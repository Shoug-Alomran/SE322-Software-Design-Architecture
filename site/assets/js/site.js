/* ==========================================================================
   SE322 Digital Blueprint — shared layout (header, view tabs, pager, footer)

   PAGES is the single source of truth for the reading order of the site.
   Each page sets <body data-page="..."> and includes the mount points:
     <div id="site-header"></div>  <div id="view-tabs"></div>
     <div id="site-pager"></div>   <div id="site-footer"></div>
   ========================================================================== */
(function () {
    'use strict';

    var REPO_URL = 'https://github.com/Shoug-Alomran/SE322-Software-Design-Architecture';
    var WORKFLOW_URL = REPO_URL + '/actions/workflows/deploy.yml';

    var PAGES = [
        { id: 'home',             title: 'Home',                       href: 'index.html',              section: 'home',          icon: 'ph-house' },
        { id: 'project',          title: 'Project Overview',           href: 'project.html',            section: 'project',       icon: 'ph-file-text' },
        { id: 'architecture',     title: 'Architecture Overview',      href: 'architecture.html',       section: 'architecture',  icon: 'ph-hexagon' },
        { id: 'user-view',        title: 'User View (+1)',             href: 'user-view.html',          section: 'architecture',  icon: 'ph-users',            view: true },
        { id: 'logical-view',     title: 'Logical View',               href: 'logical-view.html',       section: 'architecture',  icon: 'ph-tree-structure',   view: true },
        { id: 'process-view',     title: 'Process View',               href: 'process-view.html',       section: 'architecture',  icon: 'ph-arrows-clockwise', view: true },
        { id: 'development-view', title: 'Development View',           href: 'development-view.html',   section: 'architecture',  icon: 'ph-code',             view: true },
        { id: 'physical-view',    title: 'Physical View',              href: 'physical-view.html',      section: 'architecture',  icon: 'ph-hard-drives',      view: true },
        { id: 'quality',          title: 'Quality Attributes',         href: 'quality.html',            section: 'quality',       icon: 'ph-gauge' },
        { id: 'style',            title: 'Architectural Style',        href: 'architectural-style.html', section: 'architecture', icon: 'ph-stack' },
        { id: 'patterns',         title: 'Design Patterns',            href: 'design-patterns.html',    section: 'design',        icon: 'ph-puzzle-piece' },
        { id: 'documentation',    title: 'Documentation & Validation', href: 'documentation.html',      section: 'documentation', icon: 'ph-files' }
    ];

    var NAV = [
        { label: 'Home',          href: 'index.html',           section: 'home' },
        { label: 'Project',       href: 'project.html',         section: 'project' },
        { label: 'Architecture',  href: 'architecture.html',    section: 'architecture',
          menu: ['architecture', '|4+1 Views', 'user-view', 'logical-view', 'process-view', 'development-view', 'physical-view', '|Style', 'style'] },
        { label: 'Quality',       href: 'quality.html',         section: 'quality' },
        { label: 'Design',        href: 'design-patterns.html', section: 'design' },
        { label: 'Documentation', href: 'documentation.html',   section: 'documentation' }
    ];

    var byId = {};
    PAGES.forEach(function (p) { byId[p.id] = p; });

    var currentId = document.body.getAttribute('data-page') || 'home';
    var current = byId[currentId] || PAGES[0];

    function esc(s) {
        return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function pad(n) {
        return (n < 10 ? '0' : '') + n;
    }

    /* ---------------------------------------------------------------- header */
    function renderHeader() {
        var mount = document.getElementById('site-header');
        if (!mount) return;

        var desktop = NAV.map(function (item) {
            var active = item.section === current.section;
            var linkCls = active ? 'text-cyan-400' : 'text-slate-400 hover:text-cyan-300';
            var underline = active
                ? '<span class="absolute bottom-0 left-0 w-full h-[2px] bg-cyan-400 shadow-[0_0_8px_rgba(0,240,255,0.8)]"></span>'
                : '';

            if (!item.menu) {
                return '<a href="' + item.href + '" class="relative h-16 flex items-center transition-colors ' + linkCls + '"' +
                    (active && current.href === item.href ? ' aria-current="page"' : '') + '>' +
                    esc(item.label) + underline + '</a>';
            }

            var entries = item.menu.map(function (key) {
                if (key.charAt(0) === '|') {
                    return '<div class="px-4 pt-3 pb-1 text-[9px] text-slate-600 tracking-[0.25em] border-t border-cyan-500/10 mt-1">' + esc(key.slice(1)) + '</div>';
                }
                var p = byId[key];
                var on = p.id === current.id;
                return '<a href="' + p.href + '" class="flex items-center gap-3 px-4 py-2 transition-colors ' +
                    (on ? 'text-cyan-300 bg-cyan-500/10' : 'text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/5') + '"' +
                    (on ? ' aria-current="page"' : '') + '>' +
                    '<i class="ph ' + p.icon + ' text-sm ' + (on ? 'text-cyan-400' : 'text-cyan-700') + '"></i>' + esc(p.title) + '</a>';
            }).join('');

            return '<div class="relative group h-16 flex items-center">' +
                '<a href="' + item.href + '" class="relative h-16 flex items-center gap-1.5 transition-colors ' + linkCls + '">' +
                esc(item.label) + '<i class="ph ph-caret-down text-[10px] opacity-70"></i>' + underline + '</a>' +
                '<div class="absolute top-full left-1/2 -translate-x-1/2 hidden group-hover:block group-focus-within:block">' +
                '<div class="panel !bg-[#030712]/95 min-w-[250px] py-2 text-[11px] normal-case tracking-wider shadow-[0_10px_40px_rgba(0,0,0,0.6)]">' +
                '<div class="ch ch-tl"></div><div class="ch ch-br"></div>' + entries + '</div></div></div>';
        }).join('');

        var mobile = PAGES.map(function (p, i) {
            var on = p.id === current.id;
            return '<a href="' + p.href + '" class="flex items-center gap-4 px-6 py-3 border-b border-cyan-500/10 transition-colors ' +
                (on ? 'text-cyan-300 bg-cyan-500/10' : 'text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/5') + '">' +
                '<span class="text-[10px] ' + (on ? 'text-cyan-400' : 'text-slate-600') + '">' + pad(i + 1) + '</span>' +
                '<i class="ph ' + p.icon + ' ' + (on ? 'text-cyan-400' : 'text-cyan-700') + '"></i>' +
                (p.view ? '<span class="text-cyan-800">└</span>' : '') + esc(p.title) + '</a>';
        }).join('');

        mount.outerHTML =
            '<header id="site-nav" class="sticky top-0 z-50 border-b border-cyan-500/20 bg-[#030712]/85 backdrop-blur-md transition-shadow">' +
            '<div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">' +
            '<a href="index.html" class="flex items-center gap-3" aria-label="SE322 home">' +
            '<span class="w-2 h-2 bg-cyan-400 rounded-sm animate-pulse"></span>' +
            '<span class="font-mono font-medium text-cyan-50 tracking-widest text-sm">SE322<span class="text-cyan-600">_</span></span>' +
            '<span class="hidden sm:inline font-mono text-[10px] text-cyan-700 tracking-[0.2em] uppercase border-l border-cyan-900/60 pl-3">Digital Blueprint</span>' +
            '</a>' +
            '<nav class="hidden lg:flex items-center gap-8 font-mono text-[11px] uppercase tracking-widest" aria-label="Primary">' + desktop + '</nav>' +
            '<button id="menu-toggle" type="button" class="lg:hidden text-cyan-400 border border-cyan-500/30 p-2 hover:bg-cyan-950/30 transition-colors" aria-expanded="false" aria-controls="mobile-menu" aria-label="Toggle navigation">' +
            '<i class="ph ph-list text-xl"></i></button>' +
            '</div>' +
            '<nav id="mobile-menu" class="lg:hidden hidden border-t border-cyan-500/20 bg-[#030712]/95 font-mono text-xs uppercase tracking-wider max-h-[calc(100vh-4rem)] overflow-y-auto" aria-label="Mobile">' +
            mobile + '</nav>' +
            '</header>';

        var toggle = document.getElementById('menu-toggle');
        var menu = document.getElementById('mobile-menu');
        function setOpen(open) {
            menu.classList.toggle('hidden', !open);
            toggle.setAttribute('aria-expanded', String(open));
            toggle.innerHTML = '<i class="ph ' + (open ? 'ph-x' : 'ph-list') + ' text-xl"></i>';
        }
        toggle.addEventListener('click', function () {
            setOpen(menu.classList.contains('hidden'));
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') setOpen(false);
        });

        var nav = document.getElementById('site-nav');
        window.addEventListener('scroll', function () {
            nav.classList.toggle('shadow-[0_4px_30px_rgba(0,0,0,0.5)]', window.scrollY > 20);
        }, { passive: true });
    }

    /* ------------------------------------------------------------- view tabs */
    function renderViewTabs() {
        var mount = document.getElementById('view-tabs');
        if (!mount) return;

        var tabs = PAGES.filter(function (p) { return p.view; }).map(function (p) {
            var on = p.id === current.id;
            return '<a href="' + p.href + '" class="relative shrink-0 flex items-center gap-2 px-3 py-3 transition-colors ' +
                (on ? 'text-cyan-300' : 'text-slate-500 hover:text-cyan-400') + '"' + (on ? ' aria-current="page"' : '') + '>' +
                '<i class="ph ' + p.icon + '"></i>' + esc(p.title) +
                (on ? '<span class="absolute bottom-0 left-0 w-full h-px bg-cyan-400 shadow-[0_0_6px_#00f0ff]"></span>' : '') + '</a>';
        }).join('');

        mount.outerHTML =
            '<div class="border-b border-cyan-500/10 bg-[#060b13]/80 backdrop-blur-sm relative z-40">' +
            '<div class="max-w-7xl mx-auto px-6 flex items-center gap-1 font-mono text-xs overflow-x-auto hide-scrollbar whitespace-nowrap">' +
            '<a href="architecture.html" class="shrink-0 flex items-center gap-2 pr-3 py-3 text-slate-500 hover:text-cyan-400 transition-colors">' +
            '<i class="ph ph-hexagon"></i>4+1 Overview</a>' +
            '<span class="text-cyan-500/30 pr-1">/</span>' + tabs +
            '</div></div>';
    }

    /* ----------------------------------------------------------------- pager */
    function renderPager() {
        var mount = document.getElementById('site-pager');
        if (!mount) return;

        var i = PAGES.indexOf(current);
        var prev = PAGES[i - 1];
        var next = PAGES[i + 1];

        var prevHtml = prev
            ? '<a href="' + prev.href + '" class="group flex items-center gap-3 px-5 py-3 border border-cyan-900/50 bg-[#060b13] hover:border-cyan-500/50 hover:bg-cyan-950/30 transition-all w-full sm:w-auto">' +
              '<i class="ph ph-arrow-left text-cyan-600 group-hover:text-cyan-400 group-hover:-translate-x-1 transition-all"></i>' +
              '<span class="flex flex-col items-start"><span class="text-[9px] text-slate-500 font-mono uppercase tracking-widest">Previous Node</span>' +
              '<span class="font-mono text-xs text-slate-300 group-hover:text-cyan-300 transition-colors">' + esc(prev.title) + '</span></span></a>'
            : '<span class="hidden sm:block"></span>';

        var target = next || PAGES[0];
        var nextHtml =
            '<a href="' + target.href + '" class="group flex items-center justify-end gap-3 px-5 py-3 border border-cyan-900/50 bg-[#060b13] hover:border-cyan-500/50 hover:bg-cyan-950/30 transition-all w-full sm:w-auto text-right">' +
            '<span class="flex flex-col items-end"><span class="text-[9px] text-slate-500 font-mono uppercase tracking-widest">' + (next ? 'Next Node' : 'Return') + '</span>' +
            '<span class="font-mono text-xs text-cyan-400 group-hover:text-cyan-300 transition-colors">' + esc(next ? next.title : 'Home / Top') + '</span></span>' +
            '<i class="ph ' + (next ? 'ph-arrow-right' : 'ph-arrow-up') + ' text-cyan-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all"></i></a>';

        mount.outerHTML =
            '<nav class="relative flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 mt-8 border-t border-cyan-500/20" aria-label="Page navigation">' +
            '<span class="absolute top-0 left-0 w-2 h-px bg-cyan-400"></span><span class="absolute top-0 right-0 w-2 h-px bg-cyan-400"></span>' +
            prevHtml +
            '<span class="hidden md:block font-mono text-[10px] text-slate-600 tracking-[0.3em]">NODE ' + pad(i + 1) + ' / ' + pad(PAGES.length) + '</span>' +
            nextHtml + '</nav>';
    }

    /* ---------------------------------------------------------------- footer */
    function renderFooter() {
        var mount = document.getElementById('site-footer');
        if (!mount) return;

        mount.outerHTML =
            '<footer class="border-t border-cyan-900/30 bg-[#030712]/95 backdrop-blur-sm relative z-10 mt-auto">' +
            '<div class="max-w-7xl mx-auto px-6 py-8 flex flex-col lg:flex-row items-center justify-between gap-6 font-mono text-[10px] text-slate-500 uppercase tracking-widest text-center">' +
            '<div class="flex items-center gap-2"><span class="w-1.5 h-1.5 bg-cyan-700"></span>SE322 — Software Design &amp; Architecture</div>' +
            '<div class="flex flex-col sm:flex-row items-center gap-2 sm:gap-4"><span>Prince Sultan University</span>' +
            '<span class="hidden sm:inline text-cyan-800">|</span><span>Academic Project — 2026</span></div>' +
            '<div class="flex items-center gap-3">' +
            '<a href="' + WORKFLOW_URL + '" target="_blank" rel="noopener" title="GitHub Actions deployment status" class="flex items-center opacity-80 hover:opacity-100 transition-opacity">' +
            '<img src="' + WORKFLOW_URL + '/badge.svg" alt="Deploy workflow status" class="h-5" loading="lazy"></a>' +
            '<a href="' + REPO_URL + '" target="_blank" rel="noopener" class="inline-flex items-center gap-2 px-3 py-1.5 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400 transition-colors">' +
            '<i class="ph ph-github-logo text-sm"></i>Repository</a>' +
            '</div></div></footer>';
    }

    /* ------------------------------------------------------------- behaviour */
    // [data-toggle="element-id"] shows/hides the target element.
    function bindToggles() {
        document.addEventListener('click', function (e) {
            var btn = e.target.closest('[data-toggle]');
            if (!btn) return;
            var target = document.getElementById(btn.getAttribute('data-toggle'));
            if (!target) return;
            var open = target.classList.toggle('hidden') === false;
            btn.setAttribute('aria-expanded', String(open));
        });
    }

    // Click a diagram image to view it full screen.
    function bindLightbox() {
        document.addEventListener('click', function (e) {
            var img = e.target.closest('.diagram-canvas img');
            if (!img) return;
            var box = document.createElement('div');
            box.className = 'lightbox';
            box.innerHTML = '<img src="' + img.getAttribute('src') + '" alt="' + esc(img.getAttribute('alt') || '') + '">';
            function close() { box.remove(); document.removeEventListener('keydown', onKey); }
            function onKey(ev) { if (ev.key === 'Escape') close(); }
            box.addEventListener('click', close);
            document.addEventListener('keydown', onKey);
            document.body.appendChild(box);
        });
    }

    renderHeader();
    renderViewTabs();
    renderPager();
    renderFooter();
    bindToggles();
    bindLightbox();
})();
