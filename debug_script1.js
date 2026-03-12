
            // ===== SCROLL EXPANSION HERO LOGIC (experiencias.html only) =====
            (function () {
                var videoCont = document.getElementById('video-container');
                var bgWrapper = document.getElementById('hero-bg-wrapper');
                var overlay = document.getElementById('video-overlay');
                var video = document.getElementById('hero-video');
                var muteBtn = document.getElementById('mute-btn');
                var t1 = document.getElementById('hero-t1');
                var t2 = document.getElementById('hero-t2');
                var hint = document.getElementById('hero-hint');
                var content = document.getElementById('hero-content');

                if (!videoCont) return; // only run on experiencias.html

                var scrollProg = 0;
                var expanded = false;
                var touchStartY = 0;
                var isMobile = window.innerWidth < 768;

                function updateUI() {
                    var vw = window.innerWidth;
                    var vh = window.innerHeight;

                    var maxW = isMobile ? vw * 0.95 : vw;
                    var maxH = isMobile ? vh * 0.85 : vh;

                    var baseW = 300, baseH = 400;
                    var w = baseW + scrollProg * (maxW - baseW);
                    var h = baseH + scrollProg * (maxH - baseH);

                    videoCont.style.width = w + 'px';
                    videoCont.style.height = h + 'px';

                    // Expand to full → remove border-radius
                    var br = (1 - scrollProg) * 16;
                    videoCont.style.borderRadius = br + 'px';

                    // Fade bg
                    bgWrapper.style.opacity = Math.max(0, 1 - scrollProg * 1.5);

                    // Lighten video overlay as it expands
                    var overlayAlpha = 0.6 - scrollProg * 0.45;
                    overlay.style.opacity = Math.max(0.05, overlayAlpha);

                    // Slide titles apart
                    var tx = scrollProg * (isMobile ? 160 : 120);
                    t1.style.transform = 'translateX(-' + tx + 'vw)';
                    t2.style.transform = 'translateX(' + tx + 'vw)';

                    // Hint fade out
                    hint.style.opacity = Math.max(0, 1 - scrollProg * 3);

                    // Fully expanded
                    if (scrollProg >= 1 && !expanded) {
                        expanded = true;
                        content.style.opacity = '1';
                        content.style.pointerEvents = 'auto';
                        // Show mute btn & unmute
                        muteBtn.style.opacity = '1';
                        muteBtn.style.pointerEvents = 'auto';
                        video.muted = false;
                        muteBtn.innerHTML = '<i data-lucide="volume-2" class="w-4 h-4"></i>';
                        if (window.lucide) lucide.createIcons();
                    } else if (scrollProg < 0.98 && expanded) {
                        expanded = false;
                        content.style.opacity = '0';
                        content.style.pointerEvents = 'none';
                        muteBtn.style.opacity = '0';
                        muteBtn.style.pointerEvents = 'none';
                        video.muted = true;
                        muteBtn.innerHTML = '<i data-lucide="volume-x" class="w-4 h-4"></i>';
                        if (window.lucide) lucide.createIcons();
                    }
                }

                // Mute toggle
                muteBtn.addEventListener('click', function (e) {
                    e.stopPropagation();
                    video.muted = !video.muted;
                    muteBtn.innerHTML = video.muted
                        ? '<i data-lucide="volume-x" class="w-4 h-4"></i>'
                        : '<i data-lucide="volume-2" class="w-4 h-4"></i>';
                    if (window.lucide) lucide.createIcons();
                });

                // Wheel handler
                window.addEventListener('wheel', function (e) {
                    if (expanded && e.deltaY > 0) return; // normal scroll down after expand
                    if (expanded && e.deltaY < 0 && window.scrollY <= 5) {
                        expanded = false; e.preventDefault(); return;
                    }
                    if (!expanded) {
                        e.preventDefault();
                        window.scrollTo(0, 0);
                        scrollProg = Math.min(1, Math.max(0, scrollProg + e.deltaY * 0.001));
                        updateUI();
                    }
                }, { passive: false });

                // Touch handlers
                window.addEventListener('touchstart', function (e) {
                    touchStartY = e.touches[0].clientY;
                }, { passive: true });

                window.addEventListener('touchmove', function (e) {
                    if (!touchStartY) return;
                    var dy = touchStartY - e.touches[0].clientY;
                    if (expanded && dy > 0) return;
                    if (expanded && dy < -20 && window.scrollY <= 5) {
                        expanded = false; e.preventDefault(); return;
                    }
                    if (!expanded) {
                        e.preventDefault();
                        window.scrollTo(0, 0);
                        var factor = dy < 0 ? 0.008 : 0.005;
                        scrollProg = Math.min(1, Math.max(0, scrollProg + dy * factor));
                        updateUI();
                        touchStartY = e.touches[0].clientY;
                    }
                }, { passive: false });

            // ===== SCROLL EXPANSION HERO LOGIC (experiencias.html only) =====
            (function () {
                var videoCont = document.getElementById('video-container');
                var bgWrapper = document.getElementById('hero-bg-wrapper');
                var overlay = document.getElementById('video-overlay');
                var video = document.getElementById('hero-video');
                var muteBtn = document.getElementById('mute-btn');
                var t1 = document.getElementById('hero-t1');
                var t2 = document.getElementById('hero-t2');
                var hint = document.getElementById('hero-hint');
                var content = document.getElementById('hero-content');

                if (!videoCont) return; // only run on experiencias.html

                var scrollProg = 0;
                var expanded = false;
                var touchStartY = 0;
                var isMobile = window.innerWidth < 768;

                function updateUI() {
                    var vw = window.innerWidth;
                    var vh = window.innerHeight;

                    var maxW = isMobile ? vw * 0.95 : vw;
                    var maxH = isMobile ? vh * 0.85 : vh;

                    var baseW = 300, baseH = 400;
                    var w = baseW + scrollProg * (maxW - baseW);
                    var h = baseH + scrollProg * (maxH - baseH);

                    videoCont.style.width = w + 'px';
                    videoCont.style.height = h + 'px';

                    // Expand to full → remove border-radius
                    var br = (1 - scrollProg) * 16;
                    videoCont.style.borderRadius = br + 'px';

                    // Fade bg
                    bgWrapper.style.opacity = Math.max(0, 1 - scrollProg * 1.5);

                    // Lighten video overlay as it expands
                    var overlayAlpha = 0.6 - scrollProg * 0.45;
                    overlay.style.opacity = Math.max(0.05, overlayAlpha);

                    // Slide titles apart
                    var tx = scrollProg * (isMobile ? 160 : 120);
                    t1.style.transform = 'translateX(-' + tx + 'vw)';
                    t2.style.transform = 'translateX(' + tx + 'vw)';

                    // Hint fade out
                    hint.style.opacity = Math.max(0, 1 - scrollProg * 3);

                    // Fully expanded
                    if (scrollProg >= 1 && !expanded) {
                        expanded = true;
                        content.style.opacity = '1';
                        content.style.pointerEvents = 'auto';
                        // Show mute btn & unmute
                        muteBtn.style.opacity = '1';
                        muteBtn.style.pointerEvents = 'auto';
                        video.muted = false;
                        muteBtn.innerHTML = '<i data-lucide="volume-2" class="w-4 h-4"></i>';
                        if (window.lucide) lucide.createIcons();
                    } else if (scrollProg < 0.98 && expanded) {
                        expanded = false;
                        content.style.opacity = '0';
                        content.style.pointerEvents = 'none';
                        muteBtn.style.opacity = '0';
                        muteBtn.style.pointerEvents = 'none';
                        video.muted = true;
                        muteBtn.innerHTML = '<i data-lucide="volume-x" class="w-4 h-4"></i>';
                        if (window.lucide) lucide.createIcons();
                    }
                }

                // Mute toggle
                muteBtn.addEventListener('click', function (e) {
                    e.stopPropagation();
                    video.muted = !video.muted;
                    muteBtn.innerHTML = video.muted
                        ? '<i data-lucide="volume-x" class="w-4 h-4"></i>'
                        : '<i data-lucide="volume-2" class="w-4 h-4"></i>';
                    if (window.lucide) lucide.createIcons();
                });

                // Wheel handler
                window.addEventListener('wheel', function (e) {
                    if (expanded && e.deltaY > 0) return; // normal scroll down after expand
                    if (expanded && e.deltaY < 0 && window.scrollY <= 5) {
                        expanded = false; e.preventDefault(); return;
                    }
                    if (!expanded) {
                        e.preventDefault();
                        window.scrollTo(0, 0);
                        scrollProg = Math.min(1, Math.max(0, scrollProg + e.deltaY * 0.001));
                        updateUI();
                    }
                }, { passive: false });

                // Touch handlers
                window.addEventListener('touchstart', function (e) {
                    touchStartY = e.touches[0].clientY;
                }, { passive: true });

                window.addEventListener('touchmove', function (e) {
                    if (!touchStartY) return;
                    var dy = touchStartY - e.touches[0].clientY;
                    if (expanded && dy > 0) return;
                    if (expanded && dy < -20 && window.scrollY <= 5) {
                        expanded = false; e.preventDefault(); return;
                    }
                    if (!expanded) {
                        e.preventDefault();
                        window.scrollTo(0, 0);
                        var factor = dy < 0 ? 0.008 : 0.005;
                        scrollProg = Math.min(1, Math.max(0, scrollProg + dy * factor));
                        updateUI();
                        touchStartY = e.touches[0].clientY;
                    }
                }, { passive: false });

                // Lock scroll until expanded
                window.addEventListener('scroll', function () {
                    if (!expanded) window.scrollTo(0, 0);
                });

                window.addEventListener('resize', function () {
                    isMobile = window.innerWidth < 768;
                    updateUI();
                });

                // Initial render
                updateUI();
            })();
    