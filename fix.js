const fs = require('fs');
let html = fs.readFileSync('experiencias.html', 'utf8');

const cardsBlock = `                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <!-- Experiencia 1: Cabrero y Quesero -->
                        <div id="card-cabrero" onclick="selectExp('cabrero')" class="group relative bg-slate-900 border-2 border-white/5 hover:border-primary/40 rounded-[2.5rem] overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all cursor-pointer">
                            <div class="h-80 overflow-hidden relative">
                                <img src="assets/media/cabrero_quesero_exp.webp" alt="Cabrero y Quesero por un Día" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">
                                <div class="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/20 to-transparent pointer-events-none"></div>
                                <div class="absolute bottom-6 left-8 right-8 flex justify-between items-end pointer-events-none">
                                    <span class="bg-primary text-background-dark font-black px-4 py-2 rounded-xl text-sm shadow-xl shadow-primary/20">Desde 40€ / Pers.</span>
                                </div>
                            </div>
                            <div class="p-8 pt-6 flex flex-col gap-4">
                                <h3 class="text-3xl font-black text-white leading-tight">Cabrero y Quesero <span class="text-primary block italic font-serif">por un Día</span></h3>
                                <div class="flex gap-4">
                                    <span class="flex items-center gap-1.5 text-xs font-bold text-slate-300"><i data-lucide="clock" class="w-4 h-4 text-primary"></i> 3 Horas</span>
                                    <span class="flex items-center gap-1.5 text-xs font-bold text-slate-300"><i data-lucide="users" class="w-4 h-4 text-primary"></i> Todos los públicos</span>
                                </div>
                            </div>
                            <!-- Seleccionado badge -->
                            <div id="badge-cabrero" class="hidden absolute top-6 right-6 bg-primary text-background-dark text-xs font-black uppercase px-4 py-1.5 rounded-full shadow-lg">Seleccionada</div>
                            <div id="overlay-cabrero" class="hidden absolute inset-0 bg-primary/5 pointer-events-none"></div>
                        </div>

                        <!-- Experiencia 2: Chivitos -->
                        <div id="card-chivitos" onclick="selectExp('chivitos')" class="group relative bg-slate-900 border-2 border-white/5 hover:border-primary/40 rounded-[2.5rem] overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all cursor-pointer">
                            <div class="h-80 overflow-hidden relative">
                                <img src="assets/media/chivitos_exp.webp" alt="Conoce los Chivitos de Crestellina" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">
                                <div class="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/20 to-transparent pointer-events-none"></div>
                                <div class="absolute bottom-6 left-8 right-8 flex justify-between items-end pointer-events-none">
                                    <span class="bg-white text-background-dark font-black px-4 py-2 rounded-xl text-sm shadow-xl hover:bg-primary transition-colors">Desde 24€ / Pers.</span>
                                </div>
                            </div>
                            <div class="p-8 pt-6 flex flex-col gap-4">
                                <h3 class="text-3xl font-black text-white leading-tight">Conoce los Chivitos <span class="text-slate-400 block italic font-serif opacity-80">de Crestellina</span></h3>
                                <div class="flex gap-4 cursor-pointer">
                                    <span class="flex items-center gap-1.5 text-xs font-bold text-slate-300 transition-colors"><i data-lucide="clock" class="w-4 h-4 text-slate-400"></i> 2 Horas</span>
                                    <span class="flex items-center gap-1.5 text-xs font-bold text-slate-300 transition-colors"><i data-lucide="users" class="w-4 h-4 text-slate-400"></i> Ideal Familias</span>
                                </div>
                            </div>
                            <!-- Seleccionado badge -->
                            <div id="badge-chivitos" class="hidden absolute top-6 right-6 bg-primary text-background-dark text-xs font-black uppercase px-4 py-1.5 rounded-full shadow-lg">Seleccionada</div>
                            <div id="overlay-chivitos" class="hidden absolute inset-0 bg-primary/5 pointer-events-none"></div>
                        </div>
                    </div>
                </div>

                <!-- Contenedor dinámico (oculto por defecto) -->
                <div id="exp-config-area" class="hidden flex-col gap-12 mt-8 opacity-0 transition-opacity duration-700">
                    
                    <hr class="border-white/5 w-full max-w-3xl mx-auto my-4" />

                    <!-- Desglose de Experiencia a todo ancho -->
                    <div class="bg-slate-900/60 border border-primary/10 rounded-[2.5rem] p-8 lg:p-14 shadow-2xl relative overflow-hidden backdrop-blur-md">
                        <!-- Graphic elements -->
                        <div class="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] pointer-events-none"></div>
                        
                        <div class="grid grid-cols-1 lg:grid-cols-5 gap-16 relative z-10">
                            <div class="lg:col-span-3 flex flex-col gap-8">
                                <h3 id="dyn-title" class="text-4xl lg:text-5xl font-black tracking-tighter leading-tight">Título <span class="text-primary italic font-serif">Dinámico</span></h3>
                                <div id="dyn-desc" class="text-slate-400 text-lg font-light leading-relaxed space-y-4">
                                    Descripción...
                                </div>
                            </div>
                            <div class="lg:col-span-2 flex flex-col gap-8">
                                <!-- Grid Info -->
                                <div class="grid grid-cols-2 gap-4">
                                    <div class="p-6 rounded-3xl bg-background-dark/80 border border-primary/10 flex flex-col gap-2">
                                        <i data-lucide="clock" class="w-6 h-6 text-primary"></i>
                                        <span class="text-[10px] text-slate-500 uppercase font-black tracking-widest">Duración</span>
                                        <span id="dyn-duration" class="text-white font-bold text-lg">-</span>
                                    </div>
                                    <div class="p-6 rounded-3xl bg-background-dark/80 border border-primary/10 flex flex-col gap-2">
                                        <i data-lucide="users" class="w-6 h-6 text-primary"></i>
                                        <span class="text-[10px] text-slate-500 uppercase font-black tracking-widest">Capacidad</span>
                                        <span id="dyn-capacity" class="text-white font-bold text-lg">-</span>
                                    </div>
                                </div>
                                <!-- Qué Incluye -->
                                <div class="bg-primary/5 rounded-3xl p-8 border border-primary/20">
                                    <h4 class="font-bold text-white mb-6 uppercase tracking-widest text-xs border-b border-primary/10 pb-4">¿Qué incluye?</h4>
                                    <ul id="dyn-includes" class="space-y-4 text-sm text-slate-300">
                                        <!-- Dinámico -->
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Configuración Reserva -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-16 items-start mt-8">
                        <!-- Selector de Asistentes -->
                        <div class="flex flex-col gap-6" id="tickets-container">
                        </div>

                        <!-- Tarjeta de Reserva -->
`;

const startIdx = html.indexOf('<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">');
const endIdx = html.indexOf('<!-- Tarjeta de Reserva -->');

if (startIdx > -1 && endIdx > -1) {
    const pre = html.substring(0, startIdx);
    const post = html.substring(endIdx);
    fs.writeFileSync('experiencias.html', pre + cardsBlock + post);
    console.log('Replaced block successfully');
} else {
    console.log('Could not find indices');
}
