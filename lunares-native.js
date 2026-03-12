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

        // Claves públicas de VAPI — seguras para el cliente, no requieren backend
        this.env = {
            VAPI_PUBLIC_KEY: 'cf0cc954-9812-4f8f-9f77-221228c4411b',
            VAPI_ASSISTANT_ID: '17e3214b-0a36-47d8-bac8-0407c88a36c5',
            ...(window.LUNARES_ENV || {})
        };

        // State
        this.dailyCall = null;
        this.currentCallId = null;
        this.isActive = false;
        this.isTalking = false;
        this.systemPrompt = '';
        this.knowledge = '';

        // DOM refs
        this.elements = {};

        this.init();
    }

    async init() {
        console.log('[Lunares Native] 🐾 Initializing...');

        // BUILD UI IMMEDIATELY so the FAB appears without delay
        this.buildUI();
        this.wireEvents();

        // Load SDKs and data in the background
        try {
            await Promise.all([
                this.loadVapiSDK().catch(e => console.error('Vapi SDK load failed:', e)),
                this.loadPrompts().catch(e => console.error('Prompts load failed:', e))
            ]);
            console.log('[Lunares Native] 🐾 Assets and SDKs ready.');
        } catch (err) {
            console.error('[Lunares Native] ❌ Init error:', err);
        }
    }

    loadVapiSDK() {
        return new Promise((resolve) => {
            // Check if already loaded
            if (window.Vapi) {
                this.vapi = new window.Vapi(this.env.VAPI_PUBLIC_KEY);
                this.setupVapiHandlers();
                resolve();
                return;
            }

            const s = document.createElement('script');
            // Using a more robust CDN build for Vapi
            s.src = 'https://cdn.jsdelivr.net/npm/@vapi-ai/web/dist/vapi.js';
            s.async = true;
            s.onload = () => {
                if (window.Vapi) {
                    // Some builds export as window.Vapi, others as window.Vapi.default
                    const VapiClass = window.Vapi.default || window.Vapi;
                    this.vapi = new VapiClass(this.env.VAPI_PUBLIC_KEY);
                    this.setupVapiHandlers();
                }
                resolve();
            };
            s.onerror = (err) => {
                console.error('[Lunares Native] ❌ Failed to load Vapi SDK script:', err);
                resolve(); // Resolve anyway to unblock init, startVoiceCall will check this.vapi
            };
            document.head.appendChild(s);
        });
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
                    <div id="lunares-speech-bubble" class="visible">Hola, soy Lunares. Soy la guardiana de Crestellina y tu guía en esta web. ¿En qué puedo ayudarte?</div>
                    
                    <div id="lunares-dialog-card">
                        <div id="lunares-card-header">
                            <button id="lunares-mute-btn" class="lunares-icon-btn" title="Activar/Desactivar Sonido">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>
                            </button>
                            <button id="lunares-cc-btn" class="lunares-icon-btn active" title="Activar/Desactivar Subtítulos">CC</button>
                        </div>
                        <div id="lunares-quick-replies"></div>
                        <div id="lunares-input-bar">
                            <button id="lunares-mic-btn" title="Modo Conversación">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-top: 2px;"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line></svg>
                            </button>
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
            ccBtn: container.querySelector('#lunares-cc-btn'),
            muteBtn: container.querySelector('#lunares-mute-btn'),
            closeBtn: container.querySelector('#lunares-close-btn')
        };

        // Initial state for CC and Mute
        this.ccEnabled = true;
        this.audioMuted = false;
    }

    setupVapiHandlers() {
        this.vapi.on('call-start', () => this.onCallStart());
        this.vapi.on('call-end', () => this.onCallEnd());
        this.vapi.on('speech-start', () => this.setTalking(true));
        this.vapi.on('speech-end', () => this.setTalking(false));

        this.vapi.on('message', (msg) => {
            if (msg.type === 'transcript') {
                const text = msg.transcript;
                const role = msg.role;
                const type = msg.transcriptType;

                if (role === 'assistant') {
                    this.showBubble(text);
                    if (type === 'final') {
                        this.updateHistory(`Lunares: ${text}`);
                    }
                } else if (role === 'user' && type === 'final') {
                    this.updateHistory(`Tú: ${text}`);
                }
            }
        });

        this.vapi.on('error', (err) => {
            console.error('[Lunares Native] Vapi Error:', err);
            this.showBubble('😔 Algo ha fallado... ¿probamos otra vez? 🐾');
        });
    }

    wireEvents() {
        const { fab, container, micBtn, sendBtn, textInput, ccBtn, muteBtn, closeBtn } = this.elements;

        fab.addEventListener('click', () => {
            const isOpen = container.classList.toggle('open');
            fab.classList.toggle('active', isOpen);

            if (isOpen) {
                this.showBubble('Hola, soy Lunares. Soy la guardiana de Crestellina. Dime, ¿en qué puedo ayudarte?');
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

        ccBtn.addEventListener('click', () => {
            this.ccEnabled = !this.ccEnabled;
            ccBtn.classList.toggle('active', this.ccEnabled);
            this.elements.bubble.style.display = this.ccEnabled ? 'block' : 'none';
        });

        muteBtn.addEventListener('click', () => {
            this.audioMuted = !this.audioMuted;
            muteBtn.classList.toggle('active', this.audioMuted);
            // Si estuviésemos en VAPI, silenciamos los audios
            document.querySelectorAll('audio[data-participant-id]').forEach(audio => {
                audio.muted = this.audioMuted;
            });
            muteBtn.innerHTML = this.audioMuted
                ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>'
                : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>';
        });

        micBtn.addEventListener('click', () => {
            if (this.isConnecting || this.isActive) {
                this.endCall();
            } else {
                this.startVoiceCall();
            }
        });

        sendBtn.addEventListener('click', () => this.sendText());

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

    async startVoiceCall() {
        this.isConnecting = true;
        this.elements.container.classList.add('voice-mode');

        if (!this.vapi) {
            this.isConnecting = false;
            this.elements.container.classList.remove('voice-mode');
            this.showBubble('🐾 Espera un segundo, Lunares está estirando las patas... (SDK no cargado)');
            return;
        }

        // Show bubble momentarily before hiding it via voice-mode (although voice-mode hides it so we might not see this)
        // Wait, voice mode hides the bubble, so we should just change mic icon to indicate loading:
        this.elements.micBtn.classList.add('recording');
        this.elements.micBtn.style.opacity = '0.5';

        try {
            const assistantId = this.env.VAPI_ASSISTANT_ID;

            if (assistantId) {
                console.log(`[Lunares Native] 📡 Starting call using Assistant ID: ${assistantId}`);
                // When using assistantId, Vapi will call our Supabase Server URL
                // Ensure you have set the Server URL in Vapi dashboard to:
                // https://yeutntfuyisclbfyxqzp.supabase.co/functions/v1/vapi-agent
                await this.vapi.start(assistantId);
            } else {
                console.log('[Lunares Native] 📡 Starting call using dynamic config from Supabase');
                // Optional: We can fetch the config from Supabase before starting
                const res = await fetch(this.supabaseUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: { type: 'assistant-request' } })
                });
                const data = await res.json();
                if (data.assistant) {
                    await this.vapi.start(data.assistant);
                } else {
                    throw new Error('No assistant config returned from Supabase');
                }
            }
        } catch (err) {
            console.error('[Lunares Native] Call Error:', err);
            this.vapi = null; // Reset to allow retry
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
        this.elements.container.classList.add('voice-mode');
        this.elements.micBtn.classList.add('recording');
        this.elements.micBtn.style.opacity = '1';
        // The bubble is hidden in voice mode, but we prepare text for when it's closed, or we can just leave it.
        this.elements.bubble.textContent = '📡 ¡Te escucho! Dime lo que necesitas.';
    }

    onCallEnd() {
        this.isConnecting = false;
        this.isActive = false;
        this.elements.container.classList.remove('voice-mode');
        this.elements.micBtn.classList.remove('recording');
        this.elements.micBtn.style.opacity = '1';
        this.setTalking(false);
        this.showBubble('¡Hasta pronto! Aquí me quedo patrullando la Sierra 🐾');
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
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: q })
            });

            const data = await res.json();
            const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || data?.error;
            const finalReply = reply || '¡Guau! No sé qué pasó... 🐾';

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
        if (!this.elements.bubble) return;

        // Premium behavior: the old text scrolls UP as new text is added
        this.elements.bubble.textContent = text;
        this.elements.bubble.classList.add('visible');

        // Ensure the newest content is at the bottom (scrolling it up)
        this.elements.bubble.scrollTop = this.elements.bubble.scrollHeight;
    }

    showQuickReplies(replies) {
        const qrContainer = this.elements.quickReplies;
        if (!qrContainer) return;
        qrContainer.innerHTML = '';
        replies.forEach(text => {
            const btn = document.createElement('button');
            btn.className = 'lunares-qr-btn';
            btn.textContent = text;
            btn.onclick = () => {
                this.elements.textInput.value = text;
                this.sendText();
                qrContainer.innerHTML = ''; // hide after click
            };
            qrContainer.appendChild(btn);
        });
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
}

// Global auto-instantiation to maintain backward compatibility but integrated as a component
window.LunaresInstance = new LunaresAgent();
