/**
 * Lunares Native Component - Crestellina v6.0
 * Integrated natively as a class module.
 * No more external "scripts" feel - this is core logic.
 */

class LunaresAgent {
    constructor(config = {}) {
        this.assets = config.assets || './';
        this.vapiBase = 'https://api.vapi.ai';
        this.supabaseUrl = 'https://yeutntfuyisclbfyxqzp.supabase.co/functions/v1/vapi-agent';

        // Claves públicas - Seguras para el cliente
        this.env = {
            VAPI_PUBLIC_KEY: 'cf0cc954-9812-4f8f-9f77-221228c4411b',
            VAPI_ASSISTANT_ID: '17e3214b-0a36-47d8-bac8-0407c88a36c5',
            SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlldXRudGZ1eWlzY2xiZnl4cXpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxMzQyOTksImV4cCI6MjA4ODcxMDI5OX0.2A2FngSJeNOiul0qAseNpdpyuqTXL_C9awxd_EJq7sM',
            ...(window.LUNARES_ENV || {})
        };

        // State
        this.dailyCall = null;
        this.currentCallId = null;
        this.isActive = false;
        this.isTalking = false;
        this.knowledge = '';
        this.systemPrompt = '';
        this.firstVoiceMessagePlayed = false;
        this.isNarrating = false; // Bloqueo de UI para relatos largos
        this.currentNarrativeAction = null; // Seguimiento de la sección actual
        this.isScrollingLock = false;
        this.lastTriggeredMember = null; // Evitar disparos duplicados en el mismo flujo
        
        // 🐾 Memoria de sesión
        this.sessionMemory = JSON.parse(localStorage.getItem('lunares_visited_sections') || '[]');

        // DOM refs
        this.elements = {};

        this.init();
    }

    async init() {
        console.log('[Lunares Native] 🐾 Initializing...');

        // BUILD UI IMMEDIATELY so the FAB appears without delay
        this.buildUI();
        this.wireEvents();

        // Check for auto-start redirection
        const urlParams = new URLSearchParams(window.location.search);
        const autoStart = urlParams.get('vapi') === 'start';

        // Load SDKs and data in the background
        try {
            await Promise.all([
                this.loadVapiSDK().catch(e => console.error('Vapi SDK load failed:', e)),
                this.loadPrompts().catch(e => console.error('Prompts load failed:', e))
            ]);
            console.log('[Lunares Native] 🐾 Assets and SDKs ready.');
            
            if (autoStart) {
                const choice = urlParams.get('choice');
                console.log('[Lunares Native] 🚀 Auto-starting voice call...', choice ? `Choice: ${choice}` : 'Initial');
                
                // Forzar UI visible inmediatamente
                const { container, fab } = this.elements;
                container.classList.add('open');
                fab.classList.add('active');

                // Si hay elección, entramos en modo narrativo
                if (choice) {
                    this.isNarrating = true;
                    this.currentNarrativeAction = choice;
                }

                // Iniciar llamada (primer parámetro null para que use el saludo del servidor/Vapi)
                this.startVoiceCall(null, choice);
            }
        } catch (err) {
            console.error('[Lunares Native] ❌ Init error:', err);
        }
    }

    async loadVapiSDK() {
        if (window.Vapi) {
            this.vapi = new window.Vapi(this.env.VAPI_PUBLIC_KEY);
            this.setupVapiHandlers();
            return;
        }

        try {
            // esm.sh is the gold standard for npm-to-ESM transformations in the browser
            const { default: Vapi } = await import('https://esm.sh/@vapi-ai/web@2.5.2');
            
            if (typeof Vapi === 'function') {
                this.vapi = new Vapi(this.env.VAPI_PUBLIC_KEY);
                this.setupVapiHandlers();
                console.log('[Lunares Native] 📡 SDK de Vapi cargado vía ESM.');
            } else {
                throw new Error('No constructor found');
            }
        } catch (err) {
            console.error('[Lunares Native] ❌ Error cargando Vapi (ESM):', err);
            // Ultra-fallback if ESM fails (classic script)
            return new Promise((resolve) => {
                window.exports = window.exports || {};
                const s = document.createElement('script');
                s.src = `https://unpkg.com/@vapi-ai/web@2.5.2/dist/vapi.js`;
                s.async = true;
                s.onload = () => {
                    const VapiClass = window.Vapi || window.exports.default || window.exports.Vapi;
                    if (typeof VapiClass === 'function') {
                        this.vapi = new VapiClass(this.env.VAPI_PUBLIC_KEY);
                        this.setupVapiHandlers();
                        console.log('[Lunares Native] 📡 SDK de Vapi (Script) listo.');
                    }
                    resolve();
                };
                s.onerror = () => {
                    console.error('[Lunares Native] ❌ Fallo total de Vapi');
                    resolve();
                };
                document.head.appendChild(s);
            });
        }
    }

    async loadPrompts() {
        try {
            const [p, d] = await Promise.all([
                fetch(`${this.assets}prompt_lunares.md`).then(r => r.ok ? r.text() : ''),
                fetch(`${this.assets}informe_crestellina_datos.md`).then(r => r.ok ? r.text() : '')
            ]);
            this.systemPrompt = p || 'Eres Lunares, la perra mastina de Sierra Crestellina.';
            this.knowledge = d || '';
            console.log('[Lunares Native] 📄 Prompts loaded');
        } catch (err) {
            console.warn('[Lunares Native] ⚠️ Error loading prompt files');
        }
    }

    buildUI() {
        const linkId = 'lunares-styles';
        if (!document.getElementById(linkId)) {
            const link = document.createElement('link');
            link.id = linkId;
            link.rel = 'stylesheet';
            link.href = `${this.assets}lunares-native.css?v=${Date.now()}`;
            document.head.appendChild(link);
        }

        const container = document.createElement('div');
        container.id = 'lunares-widget-container';
        container.innerHTML = `
            <svg style="position: absolute; width: 0; height: 0;">
                <filter id="lunares-key-white" color-interpolation-filters="sRGB">
                    <feColorMatrix type="matrix" values="
                        1 0 0 0 0
                        0 1 0 0 0
                        0 0 1 0 0
                        -2.5 -2.5 -2.5 7 0
                    "/>
                </filter>
            </svg>
            <div id="lunares-virtual-modal">
                <div id="lunares-left-panel">
                    <div id="lunares-speech-bubble" class="visible">Hola, soy Lunares, la mastina guardiana de Sierra Crestellina. Es un placer tenerte aquí. ¿En qué puedo ayudarte hoy?</div>
                    
                    <div id="lunares-dialog-card">
                        <div id="lunares-quick-replies"></div>
                        <div id="lunares-input-bar">
                            <div id="lunares-mic-container">
                                <button id="lunares-mic-btn" title="Habla conmigo">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line></svg>
                                    <div class="lunares-mic-ripple"></div>
                                </button>
                            </div>
                            <textarea id="lunares-text-input" rows="1" placeholder="Escribe a Lunares..."></textarea>
                            <button id="lunares-send-btn">ENVIAR</button>
                        </div>
                    </div>
                </div>
                <div id="lunares-right-panel">
                    <button id="lunares-close-btn" class="lunares-icon-btn" title="Cerrar">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                    <div id="lunares-avatar">
                        <video id="lunares-video-escuchando" src="${this.assets}assets/media/escuchando.webm" autoplay loop muted playsinline></video>
                        <video id="lunares-video-hablando"   src="${this.assets}assets/media/hablando.webm"   loop muted playsinline></video>
                    </div>
                </div>
            </div>
            
            <div id="lunares-bottom-row">
                <button id="lunares-fab" title="Habla con Lunares">
                    <img src="${this.assets}assets/media/lunares_silhouette.webp" alt="Lunares" />
                </button>
            </div>
        `;
        document.body.appendChild(container);

        this.elements = {
            container: container,
            fab: container.querySelector('#lunares-fab'),
            bubble: container.querySelector('#lunares-speech-bubble'),
            micBtn: container.querySelector('#lunares-mic-btn'),
            textInput: container.querySelector('#lunares-text-input'),
            sendBtn: container.querySelector('#lunares-send-btn'),
            avatar: container.querySelector('#lunares-avatar'),
            vidTalk: container.querySelector('#lunares-video-hablando'),
            quickReplies: container.querySelector('#lunares-quick-replies'),
            card: container.querySelector('#lunares-dialog-card'),
            closeBtn: container.querySelector('#lunares-close-btn')
        };

        // Initial state for CC and Mute
        this.ccEnabled = true;
        this.audioMuted = false;
    }

    setupVapiHandlers() {
        this.vapi.on('call-start', () => {
            this.onCallStart();
            console.log('[Lunares Native] 🚀 Call started. Narrative Mode:', this.isNarrating);
        });
        
        this.vapi.on('call-end', () => {
            this.isNarrating = false;
            this.onCallEnd();
        });
        
        this.vapi.on('speech-start', () => {
            this.setTalking(true);
            this.elements.quickReplies.classList.remove('voice-choices');
        });

        this.vapi.on('speech-end', () => {
            this.setTalking(false);
            
            // 🐾 NUDGE AUTÓNOMO: Solo si estamos narrando proactivamente
            if (this.isNarrating && this.isActive) {
                const lastText = (this.lastAssistantTranscript || '').toLowerCase();
                const looksLikeClosure = this.checkClosingPhrases(lastText);

                if (!looksLikeClosure) {
                    console.log('[Lunares Native] 🌀 Silence detected. Nudging for continuity...');
                    setTimeout(() => {
                        if (!this.isTalking && this.isActive && this.isNarrating) {
                            this.vapi.send({
                                type: 'add-message',
                                message: {
                                    role: 'user',
                                    content: "(Relato en curso: Continúa con el siguiente integrante o bloque sin pausas. Sigue adelante.)"
                                }
                            });
                        }
                    }, 1200); 
                } else {
                    console.log('[Lunares Native] 🛑 Closure detected in speech-end. Triggering options.');
                    this.isNarrating = false; 
                    this.showVoiceWelcomeOptions();
                }
                return;
            }
            if (this.isActive) {
                this.firstVoiceMessagePlayed = true; 
                setTimeout(() => {
                    // Acción inmediata solo si no está hablando y no estamos en modo narrativo bloqueado
                    if (!this.isTalking && this.isActive && !this.isNarrating) {
                        this.showVoiceWelcomeOptions(this.currentNarrativeAction);
                    }
                }, 200); 
            }
        });

        this.vapi.on('message', (message) => {
            if (message.type === 'transcript') {
                const text = message.transcript.toLowerCase();
                const role = message.role;
                const type = message.transcriptType;

                if (role === 'assistant') {
                    this.lastAssistantTranscript = message.transcript; // Rastro para el Nudge

                    // Mostrar burbuja solo si CC está activado y el texto no está vacío
                    if (message.transcript.trim().length > 0) {
                        this.showBubble(message.transcript);
                    }

                    // 🐾 DETECCIÓN TEMPRANA DE CIERRE (Partial & Final)
                    if (this.isNarrating && this.checkClosingPhrases(text)) {
                        console.log('[Lunares Native] ✅ Fin del relato (early):', text.substring(0, 30));
                        this.isNarrating = false;
                        if (type === 'final') {
                            setTimeout(() => this.showVoiceWelcomeOptions(this.currentNarrativeAction), 500);
                        }
                    }

                    if (type === 'final') {
                        this.updateHistory(`Lunares: ${message.transcript}`);
                        this.autoScrollByTranscript(text);
                    }
                } else if (role === 'user' && type === 'final') {
                    this.updateHistory(`Tú: ${message.transcript}`);
                }
            }

            // Tool call handler
            if (message.type === 'function-call' || message.type === 'tool-calls') {
                const callList = message.type === 'function-call' && message.functionCall 
                    ? [message.functionCall] 
                    : (message.toolWithToolCallList || message.toolCalls || []);

                callList.forEach(item => {
                    const call = item.toolCall || item; 
                    const name = call.name || call.function?.name;
                    let args = call.parameters || call.function?.arguments || {};
                    
                    if (typeof args === 'string') {
                        try { args = JSON.parse(args); } catch(e){}
                    }

                    if (name === 'navigate_to' && args.sectionId) {
                        this.navigateToSection(args.sectionId);
                    } else if (name === 'scroll_to_element' && args.elementId) {
                        this.guidedScrollTo(args.elementId);
                    } else if (name === 'manage_modal' && args.memberId) {
                        this.manageModal(args.action, args.memberId);
                    }

                    if (call.id) {
                        this.vapi.send({
                            type: 'tool-call-result',
                            toolCallResult: { 
                                toolCallId: call.id, 
                                result: "Action executed successfully." 
                            }
                        });
                    }
                });
            }
        });

        this.vapi.on('error', (err) => {
            console.error('[Lunares Native] ❌ Vapi error:', err);
            this.showBubble('😔 Algo ha fallado... ¿probamos otra vez? 🐾');
        });
    }

    wireEvents() {
        const { fab, container, micBtn, sendBtn, textInput, closeBtn } = this.elements;

        fab.addEventListener('click', () => {
            const isOpen = container.classList.toggle('open');
            fab.classList.toggle('active', isOpen);

            if (isOpen) {
                this.showBubble('Hola, soy Lunares, la mastina guardiana de Sierra Crestellina. Es un placer tenerte aquí. ¿En qué puedo ayudarte hoy?');
                this.setTalking(true);
                setTimeout(() => this.setTalking(false), 3000);
            } else {
                if (this.isActive || this.isConnecting) this.endCall();
            }
        });

        closeBtn.addEventListener('click', () => {
            container.classList.remove('open');
            fab.classList.remove('active');
            if (this.isActive || this.isConnecting) this.endCall();
        });

        const micHandler = (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (this.isConnecting || this.isActive) {
                this.endCall();
            } else {
                this.startVoiceCall();
            }
        };

        micBtn.addEventListener('click', micHandler);
        micBtn.addEventListener('touchstart', micHandler, { passive: false });

        sendBtn.addEventListener('click', () => {
             if (this.isActive) {
                 this.endCall();
             } else {
                 this.sendText();
             }
        });

        textInput.addEventListener('input', () => {
            textInput.style.height = 'auto';
            const newHeight = Math.min(textInput.scrollHeight, 80);
            textInput.style.height = newHeight + 'px';
        });

        textInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendText();
                textInput.style.height = 'auto'; // Reset height
            }
        });
    }

    async startVoiceCall(firstMessage = null, choice = null) {
        if (this.isActive || this.isConnecting) return;
        this.isConnecting = true;
        this.elements.container.classList.add('voice-mode');
        document.body.classList.add('lunares-voice-active');
        this.elements.micBtn.style.opacity = '0.5';
        
        if (!this.vapi) {
            this.isConnecting = false;
            this.elements.container.classList.remove('voice-mode');
            this.showBubble('🐾 Espera un segundo, Lunares está estirando las patas... (SDK no cargado)');
            return;
        }

        if (choice) this.firstVoiceMessagePlayed = true;
        this.elements.micBtn.classList.add('recording');

        try {
            const assistantId = this.env.VAPI_ASSISTANT_ID;

            // 🐾 Memoria de saludo en la sesión actual para evitar redundancias
            const hasGreeted = sessionStorage.getItem('lunares_greeted') === 'true';
            
            // Si es una navegación (choice) y ya saludó, inyectamos el primer mensaje desde aquí (LATENCIA CERO)
            let transitionMessage = firstMessage;
            if (hasGreeted && choice) {
                transitionMessage = this.getTransitionMessage(choice);
                this.firstVoiceMessagePlayed = true;
            }

            const assistantOverrides = {
                variableValues: {
                    visitedSections: this.sessionMemory.join(', ') || 'ninguna',
                    hasGreeted: hasGreeted ? 'true' : 'false'
                },
                metadata: {
                    choice: choice,
                    page: window.location.pathname,
                    hasGreeted: hasGreeted,
                    transitionMessage: transitionMessage 
                }
            };

            // Si se inicia la llamada por primera vez sin este flag, lo marcamos
            if (!hasGreeted) {
                sessionStorage.setItem('lunares_greeted', 'true');
            }
            
            if (transitionMessage) {
                assistantOverrides.firstMessage = transitionMessage;
            }
            
            console.log('[Lunares Native] Starting call:', {
                hasGreeted,
                choice,
                visited: this.sessionMemory
            });
            await this.vapi.start(assistantId, assistantOverrides);
        } catch (err) {
            this.isConnecting = false;
            this.elements.container.classList.remove('voice-mode');
            this.elements.micBtn.classList.remove('recording');
            this.elements.micBtn.style.opacity = '1';
            this.showBubble('😔 No puedo conectar ahora mismo. ¿Probamos otra vez? 🐾');
            this.onCallEnd();
        }
    }

    onCallStart() {
        this.isConnecting = false;
        this.isActive = true;
        this.elements.micBtn.classList.add('recording');
        this.elements.bubble.textContent = 'Soy todo oídos, dime lo que necesites.';

        // 🐾 PROTOCOLO DE AUTONARRACIÓN: 
        // Si hay una elección previa (SPA), disparamos el monólogo automáticamente.
        if (this.isNarrating) {
            console.log('[Lunares Native] 🦜 Triggering autonomous narration loop...');
            // 🚀 Latencia mínima: 100ms para asegurar que el canal de datos está abierto
            setTimeout(() => {
                if (this.isActive && this.vapi) {
                    this.vapi.send({
                        type: 'add-message',
                        message: {
                            role: 'user',
                            content: "(Instrucción interna: Comienza AHORA con el relato proactivo de esta sección. Tus amigos están listos para escucharte.)"
                        }
                    });
                }
            }, 100); 
        }
    }

    onCallEnd() {
        this.isConnecting = false;
        this.isActive = false;
        this.firstVoiceMessagePlayed = false;
        this.elements.container.classList.remove('voice-mode');
        document.body.classList.remove('lunares-voice-active');
        this.elements.micBtn.classList.remove('recording');
        
        // Clear voice choices if they exist
        this.elements.quickReplies.classList.remove('voice-choices');
        this.elements.quickReplies.innerHTML = '';

        // El hueso reaparece en su sitio original por CSS al quitar la clase voice-mode
        this.setTalking(false);
        this.showBubble('Ha sido un placer. Aquí me quedo para lo que necesites mientras recorres la Sierra.');
        document.querySelectorAll('audio[data-participant-id]').forEach(el => el.remove());
    }

    endCall() {
        if (this.vapi) this.vapi.stop();
        this.onCallEnd();
    }

    async sendText() {
        const { textInput } = this.elements;
        const q = textInput.value.trim();
        if (!q) return;

        textInput.value = '';
        if (this.isActive) this.endCall();

        this.showBubble('Pensando... 🐾');
        try {
            const res = await fetch(this.supabaseUrl, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'apikey': this.env.SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${this.env.SUPABASE_ANON_KEY}`
                },
                body: JSON.stringify({ 
                    query: q + " (IMPORTANTE: Tu respuesta debe ser breve, máximo 50 palabras)." 
                })
            });

            const data = await res.json();
            const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || data?.error;
            const finalReply = reply || 'Vaya, parece que he perdido el rastro un momento. ¿Podrías repetir eso? 🐾';

            this.showBubble(finalReply);
            this.updateHistory(`Tú: ${q}`);
            this.updateHistory(`Lunares: ${finalReply}`);

            this.setTalking(true);
            setTimeout(() => this.setTalking(false), 3500);
        } catch (e) {
            this.showBubble('Error al conectar con la Sierra. ¿Repetimos? 🐾');
        }
    }

    updateHistory(text) {
        if (!this.elements.history) return;
        this.elements.history.textContent = text;
    }

    showBubble(text) {
        if (!this.elements.bubble || !text || text.trim() === '') return;
        if (!this.ccEnabled && this.isActive) return; // Hide if CC disabled during active call

        // Premium behavior: the old text scrolls UP as new text is added
        this.elements.bubble.textContent = text;
        this.elements.bubble.classList.add('visible');

        // Ensure the newest content is at the bottom (scrolling it up)
        this.elements.bubble.scrollTop = this.elements.bubble.scrollHeight;
    }

    showQuickReplies(replies, isVoice = false) {
        const qrContainer = this.elements.quickReplies;
        if (!qrContainer) return;
        qrContainer.innerHTML = '';
        
        if (isVoice) {
            qrContainer.classList.add('voice-choices');
        } else {
            qrContainer.classList.remove('voice-choices');
        }

        replies.forEach(choice => {
            const text = typeof choice === 'string' ? choice : (choice.text || choice);
            const btn = document.createElement('button');
            btn.className = 'lunares-qr-btn';
            btn.textContent = text;
            btn.onclick = (e) => {
                e.stopPropagation();
                if (isVoice) {
                    this.handleVoiceChoice(choice);
                } else {
                    this.elements.textInput.value = text;
                    this.sendText();
                }
                qrContainer.innerHTML = ''; // hide after click
                qrContainer.classList.remove('voice-choices');
            };
            qrContainer.appendChild(btn);
        });
    }

    showVoiceWelcomeOptions() {
        // Jerarquía base: Nosotros > Experiencias > Tienda
        const allChoices = [
            { text: 'CONÓCENOS', action: 'nosotros', prompt: 'Háblame de nuestra familia y de vuestra historia.' },
            { text: 'EXPERIENCIAS', action: 'experiencias', prompt: 'Cuéntame qué experiencias podemos vivir aquí.' },
            { text: 'PRODUCTOS', action: 'tienda', prompt: 'Enséñame vuestros productos artesanales.' }
        ];

        // 🐾 Filtrar dinámicamente según lo ya visitado
        const choices = allChoices.filter(c => !this.sessionMemory.includes(c.action));

        if (choices.length > 0) {
            this.showQuickReplies(choices, true);
        } else {
            // Backup por si ya vio todo
            this.showQuickReplies([
                { text: 'VER TIENDA', action: 'tienda', prompt: 'Llévame a la tienda.' },
                { text: 'CONTACTO', action: 'contacto', prompt: 'Quiero hablar con vosotros.' }
            ], true);
        }
    }

    handleVoiceChoice(choice) {
        console.log('[Lunares Choice] Global Selected:', choice.text);
        
        // 1. Intentar navegación interna
        const navigated = this.navigateToSection(choice.action);
        
        if (navigated) {
            this.isNarrating = true; // 🐾 Activar modo narrativo para flujo autónomo
            this.currentNarrativeAction = choice.action; // Guardar sección actual

            // 🐾 Guardar en memoria de sesión
            if (!this.sessionMemory.includes(choice.action)) {
                this.sessionMemory.push(choice.action);
                localStorage.setItem('lunares_visited_sections', JSON.stringify(this.sessionMemory));
            }

            if (this.vapi && this.isActive) {
                // Instrucción interna adaptada al nuevo Prompt Maestro
                let internalPrompt = `(Instrucción interna: El usuario ha seleccionado ${choice.action}. EMPIEZA DIRECTAMENTE tu monólogo de esa sección según tu Prompt Maestro de Marzo 2026. No saludes ni confirmes, fluye con la historia hasta el cierre emotivo o la pregunta final.)`;
                
                this.vapi.send({
                    type: 'add-message',
                    message: {
                        role: 'user',
                        content: internalPrompt
                    }
                });
            }
        } else {
            // 2. Redirección física
            let targetPage = 'index.html';
            if (choice.action === 'nosotros') targetPage = 'nosotros.html';
            if (choice.action === 'experiencias') targetPage = 'experiencias.html';
            if (choice.action === 'tienda') targetPage = 'tienda.html';
            
            window.location.href = `${targetPage}?vapi=start&choice=${choice.action}`;
        }
    }

    // ── SPA Navigation Methods ──────────────────────────────────

    navigateToSection(sectionId) {
        console.log('[Lunares Native] Navigating to section:', sectionId);
        
        // Caso 1: Existe el elemento en la página actual (Scroll)
        const targetId = sectionId.endsWith('-section') ? sectionId : sectionId + '-section';
        const el = document.getElementById(targetId) || document.getElementById(sectionId);
        
        if (el) {
            if (window.navToSection) {
                window.navToSection(sectionId);
            } else {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            // Pequeño hack para actualizar URL sin recargar
            if (window.history.pushState) {
                window.history.pushState(null, '', '#' + sectionId);
            }
            return true;
        }

        // Caso 2: Función global de navegación definida por el framework
        if (window.navToSection) {
            window.navToSection(sectionId);
            return true;
        }

        return false;
    }

    autoScrollByTranscript(text) {
        // Bloqueo de scroll si está bloqueado manualmente o si aún no ha terminado el primer mensaje (evita saltos en el saludo)
        if (this.isScrollingLock || !this.firstVoiceMessagePlayed) return;

        let targetId = null;
        let memberId = null;
        text = text.toLowerCase();

        // 1. Árbol Familiar y Trayectoria
        if (text.includes('1930') || text.includes('historia') || text.includes('trayectoria') || text.includes('cosalva') || text.includes('laguna')) {
            targetId = 'historia';
        } else if (text.includes('familia') || text.includes('árbol')) {
            targetId = 'equipo';
        } else if (text.includes('ana mateo') || text.includes('la jefa') || text.includes('maestra quesera')) {
            targetId = 'familia-ana-madre'; memberId = 'ana-madre';
        } else if (text.includes('juan ocaña') && text.includes('hijo')) {
            targetId = 'familia-juan-hijo'; memberId = 'juan-hijo';
        } else if (text.includes('ana ocaña') || text.includes('la hija') || text.includes('nuestra hija')) {
            targetId = 'familia-ana-hija'; memberId = 'ana-hija';
        } else if (text.includes('cristina')) {
            targetId = 'familia-cristina'; memberId = 'cristina';
        } else if (text.includes('corbacho') || text.includes('cabrero')) {
            targetId = 'familia-corbacho'; memberId = 'corbacho';
        } else if (text.includes('juan josé') || text.includes('mastín')) {
            targetId = 'familia-mastines'; memberId = 'mastines';
        } else if (text.includes('juan ocaña') || text.includes('maestro quesero')) {
            targetId = 'familia-juan-padre'; memberId = 'juan-padre';
        } 
        
        // 🟢 NUEVOS TRIGGERS PARA EXPERIENCIAS
        else if (text.includes('cabrero y quesero') || text.includes('por un día')) {
            targetId = 'card-cabrero';
        } else if (text.includes('los chivitos') || (text.includes('crestellina') && text.includes('experiencia'))) {
            targetId = 'card-chivitos';
        }
        
        // 🔵 NUEVOS TRIGGERS PARA TIENDA
        else if (text.includes('pack degustación') || text.includes('selección destacada')) {
            targetId = 'packs';
        } else if (text.includes('nuestros quesos') || text.includes('productos artesanos') || text.includes('fresco') || text.includes('yogur')) {
            targetId = 'catalogo';
        }

        // 🐾 EVITAR REPETICIONES: Si ya estamos procesando a este miembro, ignoramos
        const identifier = memberId || targetId;
        if (this.lastTriggeredMember === identifier) return;
        
        if (targetId) {
            console.log('[Lunares Native] 🎯 Triggering section interaction:', targetId);
            this.lastTriggeredMember = identifier;
            
            const element = document.getElementById(targetId);
            if (element) {
                // 1. Pre-clausura de cualquier modal abierto (solo si no es el mismo)
                const currentModal = document.querySelector('[id^="modal-"]:not(.hidden)');
                if (currentModal && currentModal.id !== `modal-${targetId}`) {
                    const closeBtn = currentModal.querySelector('button');
                    if (closeBtn) closeBtn.click();
                }

                // 2. Scroll suave al elemento
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });

                // 3. Acciones especiales: Espera de 1 segundo exacto antes de abrir el modal (Solicitud usuario Mar-26)
                setTimeout(() => {
                    if (!this.isActive || !this.isNarrating) return;

                    // Si es una experiencia
                    if (targetId === 'card-cabrero' || targetId === 'card-chivitos') {
                        const exp = targetId === 'card-cabrero' ? 'cabrero' : 'chivitos';
                        if (typeof window.selectExp === 'function') window.selectExp(exp);
                    } 
                    // Si es un miembro de la familia
                    else if (memberId) {
                        if (typeof window.openModal === 'function') {
                            window.openModal(memberId);
                            
                            // 🐾 SECUENCIA DE CIERRE: 2 segundos abierto y luego se cierra solo
                            setTimeout(() => {
                                if (typeof window.closeModal === 'function') {
                                    window.closeModal();
                                }
                                // Limpiamos el rastro después de un tiempo para permitir volver a activarlo si se menciona de nuevo
                                setTimeout(() => { this.lastTriggeredMember = null; }, 5000);
                            }, 2000);
                        }
                    }
                }, 1000);

                this.isScrollingLock = true;
                setTimeout(() => { this.isScrollingLock = false; }, 2500);
            }
        }
    }

    guidedScrollTo(elementId) {
        const target = document.getElementById(elementId);
        if (!target) return;

        // Si ya hay un modal abierto del mismo elemento, no hacemos nada
        const openModal = document.querySelector('[id^="modal-"]:not(.hidden)');
        if (openModal && openModal.id === `modal-${elementId}`) return;

        // Comprobar si hay que mostrar la sección antes de hacer scroll (para temas de SPA/tabs)
        let sectionToShow = null;
        if (elementId.startsWith('familia-') || elementId === 'historia' || elementId === 'equipo') {
            sectionToShow = 'nosotros-section';
        } else if (elementId === 'packs' || elementId === 'catalogo') {
            sectionToShow = 'tienda-section';
        } else if (elementId.startsWith('card-')) {
            sectionToShow = 'experiencias-section';
        }

        const sectionEl = sectionToShow ? document.getElementById(sectionToShow) : null;
        if (sectionEl && sectionEl.classList.contains('hidden')) {
            this.navigateToSection(sectionToShow);
            setTimeout(() => this.performSmoothScroll(target, elementId), 200);
        } else {
            this.performSmoothScroll(target, elementId);
        }
    }

    manageModal(action, memberId) {
        console.log(`[Lunares UI] Modal Action: ${action} for ${memberId}`);
        
        // Mapeo quirúrgico de IDs del prompt a IDs del DOM
        const idMap = {
            'ana-madre': 'familia-ana-madre',
            'juan-hijo': 'familia-juan-hijo',
            'ana-hija': 'familia-ana-hija',
            'cristina': 'familia-cristina',
            'corbacho': 'familia-corbacho',
            'mastines': 'familia-mastines',
            'juan-padre': 'familia-juan-padre',
            'cabrero': 'card-cabrero',
            'chivitos': 'card-chivitos',
            'prod-degustacion': 'prod-degustacion',
            'prod-fresco': 'prod-fresco',
            'prod-semicurado': 'prod-semicurado',
            'prod-curado': 'prod-curado',
            'prod-yogur': 'prod-yogur',
            'prod-regalo': 'prod-regalo'
        };

        const targetId = idMap[memberId] || memberId;
        const element = document.getElementById(targetId);

        if (action === 'open' && element) {
            // 0. Cerrar preventivamente cualquier modal abierto ANTES de hacer scroll
            const currentModal = document.querySelector('[id^="modal-"]:not(.hidden), #experiencia-modal:not(.hidden)');
            if (currentModal && currentModal.id !== `modal-${targetId}`) {
                const closeBtn = currentModal.querySelector('button, .modal-close');
                if (closeBtn) closeBtn.click();
            }

            // 1. Scroll inmediato para situar al usuario y que vea el árbol o la tarjeta completa
            setTimeout(() => {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 50);
            
            // 2. Espera de 1 segundo para que la persona divise el árbol antes de que el modal lo tape
            setTimeout(() => {
                if (!this.isActive) return; // Si la llamada terminó, no abrimos nada
                
                if (memberId === 'cabrero' || memberId === 'chivitos') {
                    if (typeof window.selectExp === 'function') window.selectExp(memberId);
                } else {
                    if (typeof window.openModal === 'function') {
                        window.openModal(memberId);
                    }
                }
            }, 1000);
        } else if (action === 'close') {
            // Cerrar cualquier modal abierto de forma quirúrgica
            const currentModal = document.querySelector('[id^="modal-"]:not(.hidden), #experiencia-modal:not(.hidden)');
            if (currentModal) {
                const closeBtn = currentModal.querySelector('button, .modal-close');
                if (closeBtn) closeBtn.click();
            }
        }
    }

    performSmoothScroll(target, elementId) {
        // Offset for sticky navigation headers
        const yOffset = -120;
        const targetY = target.getBoundingClientRect().top + window.pageYOffset + yOffset;
        
        window.scrollTo({
            top: targetY,
            behavior: 'smooth'
        });

        // Update URL aesthetically without jumping
        if (window.history && window.history.pushState) {
            window.history.pushState(null, '', '#' + elementId);
        }
    }

    setTalking(t) {
        if (t === this.isTalking) return;
        this.isTalking = t;
        const { avatar, vidTalk } = this.elements;
        if (!avatar) return;
        if (t) {
            avatar.classList.add('talking');
            vidTalk?.play().catch(() => { });
        } else {
            avatar.classList.remove('talking');
            vidTalk?.pause();
        }
    }

    getTransitionMessage(choice) {
        const messages = {
            'nosotros': '¡Genial! Deja que te presente a nuestra familia.',
            'tienda': '¡Vámonos a la tienda! Sígueme.',
            'experiencias': '¡Perfecto! Vamos a descubrir nuestras experiencias.'
        };
        return messages[choice] || '¡Ya estoy contigo! Vamos allá.';
    }

    checkClosingPhrases(text) {
        if (!text) return false;
        const lowerText = text.toLowerCase();
        const closures = [
            '¿qué te apetece ahora?',
            '¿quieres que te hable de nuestras experiencias?',
            '¿prefieres que te lleve a ver la tienda?',
            '¿te gustaría descubrir el taller?',
            '¿ver nuestros productos?',
            'Te dejo por aquí las opciones',
            'te dejo los botones por aquí',
            'te dejo elegir',
            'ha sido un placer',
            'aquí me quedo para lo que necesites',
            '¿qué prefieres?',
            '¿en qué más puedo ayudarte?',
            '¿te gustaría que te presente a mi familia?',
            '¿conocer mejor a nuestra familia?'
        ];
        return closures.some(phrase => lowerText.includes(phrase));
    }
}

// Global auto-instantiation to maintain backward compatibility but integrated as a component
window.LunaresInstance = new LunaresAgent();
