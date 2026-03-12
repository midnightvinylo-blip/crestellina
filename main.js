// Lógica de alternancia del menú móvil
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar iconos de Lucide
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    // Podríamos añadir un menú móvil aquí si tuviéramos un botón de hamburguesa,
    // pero el diseño actual está optimizado para una navegación responsiva.
    // Añadamos desplazamiento suave para los enlaces de anclaje.
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Interacción simple para las tarjetas
    const cards = document.querySelectorAll('.group');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Lógica adicional potencial para interacciones
        });
    });
});
