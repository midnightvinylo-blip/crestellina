const fs = require('fs');
let html = fs.readFileSync('experiencias.html', 'utf8');

const jsInject = `
<script>
const expData = {
    cabrero: {
        title: "Cabrero y Quesero <span class='text-primary block italic font-serif opacity-90'>por un Día</span>",
        desc: "<p>Desde la mezcla de los ingredientes hasta la elaboración de un queso fresco con receta tradicional familiar. Durante la actividad también conoceremos de primera mano nuestro entorno protegido así como nuestra historia de 90 años de legado.</p><p>También tendréis que acompañar a las estrellas de nuestra quesería, las cabras payoyas para el ordeño manual tradicional antes de que salgan a la sierra a pastar.</p><p>Terminaréis vuestro propio queso para llevarlo a casa, también veremos el vídeo del proceso en fábrica y no podía faltar para terminar una cata de quesos maridada con vino local.</p>",
        duration: "3 Horas aprox.",
        capacity: "Todos los públicos",
        price: "Desde 40€",
        includes: [
            "<li class='flex gap-3'><i data-lucide='check' class='text-primary w-5 h-5 shrink-0'></i> Elaboración de tu propio queso fresco.</li>",
            "<li class='flex gap-3'><i data-lucide='check' class='text-primary w-5 h-5 shrink-0'></i> Ordeño manual tradicional a las cabras.</li>",
            "<li class='flex gap-3'><i data-lucide='check' class='text-primary w-5 h-5 shrink-0'></i> Cata de quesos profesional maridada con vino.</li>",
            "<li class='flex gap-3'><i data-lucide='check' class='text-primary w-5 h-5 shrink-0'></i> Visita al rebaño y audiovisuales.</li>",
            "<li class='flex gap-3'><i data-lucide='check' class='text-primary w-5 h-5 shrink-0'></i> Te llevas tu propio queso artesano a casa.</li>"
        ],
        ticketsHtml: \`
            <h4 class="text-xl font-bold uppercase tracking-widest text-white border-b border-white/10 pb-4">Asistentes</h4>
            <!-- Adultos -->
            <div class="flex items-center justify-between bg-slate-900 p-6 rounded-2xl border border-white/5">
                <div>
                    <p class="font-bold text-white">Adultos (+12 años)</p>
                    <p class="text-primary text-sm font-bold">40€</p>
                </div>
                <div class="flex items-center gap-4 bg-background-dark p-2 rounded-xl">
                    <button class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-white transition-colors">-</button>
                    <span class="w-4 text-center font-bold">2</span>
                    <button class="w-8 h-8 flex items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors">+</button>
                </div>
            </div>
            <!-- Niños (4-11) -->
            <div class="flex items-center justify-between bg-slate-900 p-6 rounded-2xl border border-white/5">
                <div>
                    <p class="font-bold text-white">Niños (4 a 11 años)</p>
                    <p class="text-slate-400 text-sm">20€</p>
                </div>
                <div class="flex items-center gap-4 bg-background-dark p-2 rounded-xl">
                    <button class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-white transition-colors">-</button>
                    <span class="w-4 text-center font-bold">0</span>
                    <button class="w-8 h-8 flex items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors">+</button>
                </div>
            </div>
            <!-- Bebés -->
            <div class="flex items-center justify-between bg-slate-900 p-6 rounded-2xl border border-white/5">
                <div>
                    <p class="font-bold text-white">Bebés (0 a 3 años)</p>
                    <p class="text-slate-400 text-sm hover:text-white transition-colors">Gratis</p>
                </div>
                <div class="flex items-center gap-4 bg-background-dark p-2 rounded-xl">
                    <button class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-white transition-colors">-</button>
                    <span class="w-4 text-center font-bold">0</span>
                    <button class="w-8 h-8 flex items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors">+</button>
                </div>
            </div>
        \`
    },
    chivitos: {
        title: "Conoce los Chivitos <span class='text-primary block italic font-serif opacity-90'>de Crestellina</span>",
        desc: "<p>Una experiencia de lo más familiar e inmersiva. Ideal para disfrutar con los más pequeños y conecten con la naturaleza y la nobleza de los animales al aire libre.</p><p>Esta actividad está adaptada para conocer a los chivitos y sus cuidados de primera mano. Podremos conocer a las grandes protagonistas: las cabras payoyas... y podréis darles el biberón a los chivitos más pequeños y cariñosos de la granja.</p><p>Al terminar el recorrido habrá una estupenda sesión gastronómica degustando nuestros mejores quesos artesanos en un ambiente relajado y natural.</p>",
        duration: "2 Horas aprox.",
        capacity: "Mínimo 2 px.",
        price: "Desde 24€",
        includes: [
            "<li class='flex gap-3'><i data-lucide='check' class='text-primary w-5 h-5 shrink-0'></i> Visita adaptada a un entorno natural inmejorable.</li>",
            "<li class='flex gap-3'><i data-lucide='check' class='text-primary w-5 h-5 shrink-0'></i> Actividad inmersiva: dar biberón a los chivitos bebés.</li>",
            "<li class='flex gap-3'><i data-lucide='check' class='text-primary w-5 h-5 shrink-0'></i> Degustación de nuestra selección de quesos artesanos.</li>",
            "<li class='flex gap-3'><i data-lucide='check' class='text-primary w-5 h-5 shrink-0'></i> Interacción pacífica y didáctica con el rebaño.</li>"
        ],
         ticketsHtml: \`
            <h4 class="text-xl font-bold uppercase tracking-widest text-white border-b border-white/10 pb-4">Asistentes</h4>
            <!-- General -->
            <div class="flex items-center justify-between bg-slate-900 p-6 rounded-2xl border border-white/5">
                <div>
                    <p class="font-bold text-white">General (+4 años)</p>
                    <p class="text-primary text-sm font-bold">24€</p>
                </div>
                <div class="flex items-center gap-4 bg-background-dark p-2 rounded-xl">
                    <button class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-white transition-colors">-</button>
                    <span class="w-4 text-center font-bold">2</span>
                    <button class="w-8 h-8 flex items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors">+</button>
                </div>
            </div>
            <!-- Bebés -->
            <div class="flex items-center justify-between bg-slate-900 p-6 rounded-2xl border border-white/5">
                <div>
                    <p class="font-bold text-white">Bebés (0 a 3 años)</p>
                    <p class="text-slate-400 text-sm hover:text-white transition-colors">Gratis</p>
                </div>
                <div class="flex items-center gap-4 bg-background-dark p-2 rounded-xl">
                    <button class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-white transition-colors">-</button>
                    <span class="w-4 text-center font-bold">0</span>
                    <button class="w-8 h-8 flex items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors">+</button>
                </div>
            </div>
        \`
    }
};

window.selectExp = function(type) {
    const data = expData[type];
    
    // Toggle active classes
    const allTypes = ['cabrero', 'chivitos'];
    allTypes.forEach(t => {
        const card = document.getElementById('card-' + t);
        const badge = document.getElementById('badge-' + t);
        const overlay = document.getElementById('overlay-' + t);
        const img = document.getElementById('img-' + t);
        if (t === type) {
            card.classList.add('border-primary');
            card.classList.remove('border-white/5', 'opacity-80');
            badge.classList.remove('hidden');
            overlay.classList.remove('hidden');
            img.classList.remove('grayscale-[30%]');
        } else {
            card.classList.remove('border-primary');
            card.classList.add('border-white/5', 'opacity-80');
            badge.classList.add('hidden');
            overlay.classList.add('hidden');
            img.classList.add('grayscale-[30%]');
        }
    });

    // Populate dynamic data
    document.getElementById('dyn-title').innerHTML = data.title;
    document.getElementById('dyn-desc').innerHTML = data.desc;
    document.getElementById('dyn-duration').innerText = data.duration;
    document.getElementById('dyn-capacity').innerText = data.capacity;
    document.getElementById('dyn-includes').innerHTML = data.includes.join('');
    document.getElementById('tickets-container').innerHTML = data.ticketsHtml;
    
    if (window.lucide) {
        lucide.createIcons();
    }

    const container = document.getElementById('exp-config-area');
    container.classList.remove('hidden');
    container.classList.add('flex');
    
    // Force reflow and transition
    void container.offsetWidth;
    container.classList.remove('opacity-0');
    container.classList.add('opacity-100');

    setTimeout(() => {
        container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
};
</script>
</body>`;

html = html.replace('</body>', jsInject);
html = html.replace('<script>\nconst expData', ''); // Deduplicate if accidentally injected twice
fs.writeFileSync('experiencias.html', html);
console.log('JS injected successfully.');
