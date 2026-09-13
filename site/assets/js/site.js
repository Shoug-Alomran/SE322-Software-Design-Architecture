/* ==========================================================================
   SE322 Digital Blueprint — shared layout and behaviour
   (header, theme toggle, search, view tabs, pager, footer)

   PAGES is the single source of truth for the reading order of the site.
   Each page sets <body data-page="..."> and includes the mount points:
     <div id="site-header"></div>  <div id="view-tabs"></div>
     <div id="site-pager"></div>   <div id="site-footer"></div>
   ========================================================================== */
(function () {
    'use strict';

    var REPO_URL = 'https://github.com/Shoug-Alomran/SE322-Software-Design-Architecture';
    var THEME_KEY = 'se322-theme';
    var SEARCH_KEY = 'se322-search-v1';

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
        { id: 'documentation',    title: 'Documentation & Validation', href: 'documentation.html',      section: 'documentation', icon: 'ph-files' },
        { id: 'team',             title: 'Team',                       href: 'team.html',               section: 'team',          icon: 'ph-users-three' }
    ];

    var NAV = [
        { label: 'Home',          href: 'index.html',           section: 'home' },
        { label: 'Project',       href: 'project.html',         section: 'project' },
        { label: 'Architecture',  href: 'architecture.html',    section: 'architecture',
          menu: ['architecture', '|4+1 Views', 'user-view', 'logical-view', 'process-view', 'development-view', 'physical-view', '|Style', 'style'] },
        { label: 'Quality',       href: 'quality.html',         section: 'quality' },
        { label: 'Design',        href: 'design-patterns.html', section: 'design' },
        { label: 'Documentation', href: 'documentation.html',   section: 'documentation' },
        { label: 'Team',          href: 'team.html',            section: 'team' }
    ];

    var byId = {};
    PAGES.forEach(function (p) { byId[p.id] = p; });

    var currentId = document.body.getAttribute('data-page') || 'home';
    var current = byId[currentId] || PAGES[0];

    function esc(s) {
        return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function pad(n) {
        return (n < 10 ? '0' : '') + n;
    }

    var ICON_BTN = 'h-9 w-9 shrink-0 flex items-center justify-center border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400 transition-colors';

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

        var isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

        mount.outerHTML =
            '<header id="site-nav" class="sticky top-0 z-50 border-b border-cyan-500/20 bg-[#030712]/85 backdrop-blur-md transition-shadow">' +
            '<div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">' +
            '<a href="index.html" class="flex items-center gap-3 shrink-0" aria-label="SE322 home">' +
            '<span class="w-2 h-2 bg-cyan-400 rounded-sm animate-pulse"></span>' +
            '<span class="font-mono font-medium text-slate-100 tracking-widest text-sm">SE322<span class="text-cyan-600">_</span></span>' +
            '<span class="hidden sm:inline lg:hidden xl:inline font-mono text-[10px] text-cyan-700 tracking-[0.2em] uppercase border-l border-cyan-900/60 pl-3">Digital Blueprint</span>' +
            '</a>' +
            '<nav class="hidden lg:flex items-center gap-6 xl:gap-8 font-mono text-[11px] uppercase tracking-widest" aria-label="Primary">' + desktop + '</nav>' +
            '<div class="flex items-center gap-2">' +
            '<button id="search-open" type="button" class="h-9 shrink-0 flex items-center gap-3 px-2.5 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400 transition-colors" aria-label="Search the site" title="Search (' + (isMac ? '⌘' : 'Ctrl+') + 'K)">' +
            '<i class="ph ph-magnifying-glass text-base"></i>' +
            '<kbd class="hidden xl:inline font-mono text-[10px] text-slate-500 border border-cyan-500/20 px-1.5 py-0.5">' + (isMac ? '⌘K' : 'Ctrl K') + '</kbd>' +
            '</button>' +
            '<button id="theme-toggle" type="button" class="' + ICON_BTN + '"></button>' +
            '<button id="menu-toggle" type="button" class="lg:hidden ' + ICON_BTN + '" aria-expanded="false" aria-controls="mobile-menu" aria-label="Toggle navigation">' +
            '<i class="ph ph-list text-xl"></i></button>' +
            '</div>' +
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

    /* ----------------------------------------------------------------- theme */
    function getTheme() {
        return document.documentElement.classList.contains('light') ? 'light' : 'dark';
    }

    function applyTheme(theme) {
        document.documentElement.classList.toggle('light', theme === 'light');
        document.documentElement.style.colorScheme = theme;
        var btn = document.getElementById('theme-toggle');
        if (!btn) return;
        var next = theme === 'light' ? 'dark' : 'light';
        btn.innerHTML = '<i class="ph ' + (theme === 'light' ? 'ph-moon' : 'ph-sun') + ' text-base"></i>';
        btn.setAttribute('aria-label', 'Switch to ' + next + ' mode');
        btn.setAttribute('title', 'Switch to ' + next + ' mode');
    }

    function bindTheme() {
        applyTheme(getTheme());
        var btn = document.getElementById('theme-toggle');
        if (btn) {
            btn.addEventListener('click', function () {
                var next = getTheme() === 'light' ? 'dark' : 'light';
                try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
                applyTheme(next);
            });
        }
        // Follow the OS setting until the visitor makes an explicit choice.
        if (window.matchMedia) {
            var mq = window.matchMedia('(prefers-color-scheme: light)');
            var onChange = function (e) {
                var saved = null;
                try { saved = localStorage.getItem(THEME_KEY); } catch (err) {}
                if (!saved) applyTheme(e.matches ? 'light' : 'dark');
            };
            if (mq.addEventListener) mq.addEventListener('change', onChange);
            else if (mq.addListener) mq.addListener(onChange);
        }
    }

    /* ---------------------------------------------------------------- search */
    var indexPromise = null;
    var searchState = { results: [], active: 0 };

    function clean(s) {
        return (s || '').replace(/\s+/g, ' ').trim();
    }

    // Split a fetched page into searchable records: one for the page, one per heading.
    function extractRecords(page, html) {
        var doc = new DOMParser().parseFromString(html, 'text/html');
        var main = doc.querySelector('main');
        if (!main) return [];
        Array.prototype.forEach.call(main.querySelectorAll('script, style, svg, [id^="site-"]'), function (n) {
            n.parentNode.removeChild(n);
        });

        var records = [{ page: page.id, heading: page.title, anchor: '', text: clean(main.textContent).slice(0, 4000) }];
        var seen = {};
        Array.prototype.forEach.call(main.querySelectorAll('h1, h2, h3, h4, figcaption'), function (h) {
            var heading = clean(h.textContent);
            if (!heading) return;
            var holder = h.closest('[id]');
            var anchor = holder && holder !== main ? holder.id : '';
            var key = heading + '|' + anchor;
            if (seen[key]) return;
            seen[key] = true;
            var block = h.closest('a, article, figure, li, section') || h.parentElement;
            records.push({ page: page.id, heading: heading.slice(0, 140), anchor: anchor, text: clean(block.textContent).slice(0, 2000) });
        });
        return records;
    }

    function loadIndex() {
        if (indexPromise) return indexPromise;
        try {
            var cached = sessionStorage.getItem(SEARCH_KEY);
            if (cached) return (indexPromise = Promise.resolve(JSON.parse(cached)));
        } catch (e) {}

        indexPromise = Promise.all(PAGES.map(function (p) {
            return fetch(p.href).then(function (res) {
                if (!res.ok) throw new Error(p.href + ': ' + res.status);
                return res.text();
            }).then(function (html) {
                return extractRecords(p, html);
            });
        })).then(function (lists) {
            var all = [].concat.apply([], lists);
            try { sessionStorage.setItem(SEARCH_KEY, JSON.stringify(all)); } catch (e) {}
            return all;
        });
        indexPromise.catch(function () { indexPromise = null; });
        return indexPromise;
    }

    function runSearch(records, query) {
        var terms = query.toLowerCase().split(/\s+/).filter(Boolean);
        var hits = [];
        records.forEach(function (r) {
            var page = byId[r.page];
            if (!page) return;
            var heading = r.heading.toLowerCase();
            var title = page.title.toLowerCase();
            var text = r.text.toLowerCase();
            var score = 0;
            for (var i = 0; i < terms.length; i++) {
                var s = 0;
                if (heading.indexOf(terms[i]) > -1) s += 10;
                if (title.indexOf(terms[i]) > -1) s += 4;
                if (text.indexOf(terms[i]) > -1) s += 2;
                if (!s) return; // every term must match
                score += s;
            }
            hits.push({ record: r, score: score, terms: terms });
        });
        hits.sort(function (a, b) { return b.score - a.score; });
        // Keep only the best-scoring record per destination (page + anchor).
        var seen = {};
        return hits.filter(function (h) {
            var key = h.record.page + '#' + h.record.anchor;
            if (seen[key]) return false;
            seen[key] = true;
            return true;
        }).slice(0, 30);
    }

    // Excerpt around the first match with <mark> highlights (built from raw text, escaped piecewise).
    function snippet(text, terms) {
        var lower = text.toLowerCase();
        var first = -1;
        terms.forEach(function (t) {
            var i = lower.indexOf(t);
            if (i > -1 && (first < 0 || i < first)) first = i;
        });
        var start = first < 0 ? 0 : Math.max(0, first - 60);
        var slice = text.slice(start, start + 180);
        var re = new RegExp(terms.map(function (t) { return t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }).join('|'), 'gi');
        var out = '';
        var last = 0;
        var m;
        while (terms.length && (m = re.exec(slice)) !== null) {
            if (!m[0]) break;
            out += esc(slice.slice(last, m.index)) + '<mark>' + esc(m[0]) + '</mark>';
            last = m.index + m[0].length;
        }
        out += esc(slice.slice(last));
        return (start > 0 ? '…' : '') + out + (start + 180 < text.length ? '…' : '');
    }

    function hitHtml(i, href, page, heading, excerpt) {
        return '<li role="option"><a href="' + href + '" data-hit="' + i + '" class="search-hit flex flex-col gap-1 px-4 py-3 border-l-2 border-transparent transition-colors">' +
            '<span class="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-cyan-600"><i class="ph ' + page.icon + '"></i>' + esc(page.title) + '</span>' +
            '<span class="font-mono text-sm text-slate-100">' + heading + '</span>' +
            (excerpt ? '<span class="text-xs text-slate-400 leading-relaxed">' + excerpt + '</span>' : '') +
            '</a></li>';
    }

    function renderResults(query) {
        var list = document.getElementById('search-results');
        var q = clean(query);

        if (!q) {
            searchState.results = PAGES.map(function (p) { return p.href; });
            list.innerHTML = '<li class="px-4 pt-2 pb-1 font-mono text-[10px] text-slate-500 uppercase tracking-widest">All pages</li>' +
                PAGES.map(function (p, i) { return hitHtml(i, p.href, p, esc(p.title), ''); }).join('');
            setActive(0);
            return;
        }

        list.innerHTML = '<li class="px-4 py-6 font-mono text-xs text-slate-500 text-center">Indexing pages…</li>';
        loadIndex().then(function (records) {
            if (clean(document.getElementById('search-input').value) !== q) return; // stale
            var hits = runSearch(records, q);
            if (!hits.length) {
                searchState.results = [];
                list.innerHTML = '<li class="px-4 py-8 font-mono text-xs text-slate-500 text-center">No results for “' + esc(q) + '”</li>';
                return;
            }
            searchState.results = hits.map(function (h) {
                return byId[h.record.page].href + (h.record.anchor ? '#' + h.record.anchor : '');
            });
            list.innerHTML = hits.map(function (h, i) {
                var r = h.record;
                return hitHtml(i, searchState.results[i], byId[r.page], snippet(r.heading, h.terms), snippet(r.text, h.terms));
            }).join('');
            setActive(0);
        }).catch(function () {
            searchState.results = [];
            list.innerHTML = '<li class="px-4 py-8 font-mono text-xs text-slate-500 text-center leading-relaxed">Search could not load the pages.<br>It works when the site is served over HTTP, not opened as a local file.</li>';
        });
    }

    function setActive(i) {
        var links = document.querySelectorAll('#search-results .search-hit');
        if (!links.length) return;
        searchState.active = (i + links.length) % links.length;
        Array.prototype.forEach.call(links, function (a, n) {
            a.classList.toggle('is-active', n === searchState.active);
        });
        links[searchState.active].scrollIntoView({ block: 'nearest' });
    }

    function openSearch() {
        var modal = document.getElementById('search-modal');
        var input = document.getElementById('search-input');
        modal.classList.remove('hidden');
        document.documentElement.style.overflow = 'hidden';
        input.value = '';
        renderResults('');
        input.focus();
        loadIndex().catch(function () {});
    }

    function closeSearch() {
        var modal = document.getElementById('search-modal');
        if (!modal || modal.classList.contains('hidden')) return;
        modal.classList.add('hidden');
        document.documentElement.style.overflow = '';
    }

    function bindSearch() {
        var modal = document.createElement('div');
        modal.id = 'search-modal';
        modal.className = 'fixed inset-0 z-[80] hidden';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-label', 'Search the site');
        modal.innerHTML =
            '<div data-search-close class="absolute inset-0 bg-[#030712]/80 backdrop-blur-sm"></div>' +
            '<div class="relative mx-auto mt-[8vh] w-[calc(100%-2rem)] max-w-2xl panel !bg-[#030712]/95 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">' +
            '<div class="ch ch-tl"></div><div class="ch ch-br"></div>' +
            '<div class="flex items-center gap-3 px-4 border-b border-cyan-500/20">' +
            '<i class="ph ph-magnifying-glass text-lg text-cyan-400"></i>' +
            '<input id="search-input" type="search" autocomplete="off" spellcheck="false" placeholder="Search the blueprint…" aria-controls="search-results" ' +
            'class="flex-grow min-w-0 bg-transparent py-4 font-mono text-sm text-slate-100 placeholder:text-slate-500 outline-none">' +
            '<button type="button" data-search-close class="font-mono text-[10px] text-slate-500 border border-cyan-500/20 px-1.5 py-0.5 hover:text-cyan-400">ESC</button>' +
            '</div>' +
            '<ul id="search-results" class="max-h-[60vh] overflow-y-auto py-2" role="listbox"></ul>' +
            '<div class="hidden sm:flex items-center gap-5 px-4 py-2 border-t border-cyan-500/20 font-mono text-[10px] text-slate-500 uppercase tracking-widest">' +
            '<span>↑ ↓ Navigate</span><span>↵ Open</span><span>Esc Close</span></div>' +
            '</div>';
        document.body.appendChild(modal);

        var input = document.getElementById('search-input');
        var timer;
        input.addEventListener('input', function () {
            clearTimeout(timer);
            timer = setTimeout(function () { renderResults(input.value); }, 120);
        });
        input.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowDown') { e.preventDefault(); setActive(searchState.active + 1); }
            else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(searchState.active - 1); }
            else if (e.key === 'Enter') {
                var href = searchState.results[searchState.active];
                if (href) { e.preventDefault(); closeSearch(); window.location.href = href; }
            }
        });

        modal.addEventListener('click', function (e) {
            if (e.target.closest('[data-search-close]') || e.target.closest('.search-hit')) closeSearch();
        });
        modal.addEventListener('mousemove', function (e) {
            var hit = e.target.closest('.search-hit');
            if (hit) setActive(Number(hit.getAttribute('data-hit')));
        });

        var openBtn = document.getElementById('search-open');
        if (openBtn) openBtn.addEventListener('click', openSearch);

        document.addEventListener('keydown', function (e) {
            var typing = /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable;
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                if (document.getElementById('search-modal').classList.contains('hidden')) openSearch();
                else closeSearch();
            } else if (e.key === '/' && !typing) {
                e.preventDefault();
                openSearch();
            } else if (e.key === 'Escape') {
                closeSearch();
            }
        });
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

        function column(title, links) {
            return '<div>' +
                '<h3 class="font-mono text-[10px] text-slate-500 uppercase tracking-[0.25em] mb-4">' + esc(title) + '</h3>' +
                '<ul class="space-y-2.5">' + links.map(function (l) {
                    var on = !l.external && l.href === current.href;
                    return '<li><a href="' + l.href + '"' + (l.external ? ' target="_blank" rel="noopener"' : '') +
                        ' class="text-sm transition-colors inline-flex items-center gap-1.5 ' + (on ? 'text-cyan-400' : 'text-slate-400 hover:text-cyan-300') + '">' +
                        esc(l.title) + (l.external ? '<i class="ph ph-arrow-up-right text-xs"></i>' : '') + '</a></li>';
                }).join('') + '</ul></div>';
        }
        function pages(ids) {
            return ids.map(function (id) { return byId[id]; });
        }

        mount.outerHTML =
            '<footer class="relative z-10 mt-auto border-t border-cyan-500/20 bg-[#030712]/95 backdrop-blur-sm">' +
            '<div class="max-w-7xl mx-auto px-6 pt-14 pb-10 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-10">' +

            '<div class="col-span-2 md:col-span-4 lg:col-span-5 flex flex-col gap-5">' +
            '<a href="index.html" class="flex items-center gap-3 self-start" aria-label="SE322 home">' +
            '<img src="assets/img/favicon.svg" alt="" class="w-9 h-9">' +
            '<span class="flex flex-col"><span class="font-mono text-sm text-slate-100 tracking-widest">SE322<span class="text-cyan-600">_</span></span>' +
            '<span class="font-mono text-[10px] text-cyan-700 tracking-[0.2em] uppercase">Digital Blueprint</span></span></a>' +
            '<p class="text-sm text-slate-400 font-light leading-relaxed max-w-sm">Software Design &amp; Architecture project documenting the system architecture, 4+1 views, quality attributes, architectural style, design patterns and validation.</p>' +
            '<p class="font-mono text-[10px] text-slate-500 uppercase tracking-widest flex items-center gap-2">' +
            '<i class="ph ph-graduation-cap text-sm text-cyan-600"></i>Prince Sultan University · 2026</p>' +
            '</div>' +

            '<div class="lg:col-span-3">' + column('Architecture', pages(['architecture', 'user-view', 'logical-view', 'process-view', 'development-view', 'physical-view', 'style'])) + '</div>' +
            '<div class="lg:col-span-2">' + column('Explore', pages(['home', 'project', 'quality', 'patterns', 'documentation', 'team'])) + '</div>' +
            '<div class="lg:col-span-2">' + column('Resources', [
                { title: 'GitHub Repository', href: REPO_URL, external: true },
                { title: 'Sitemap', href: 'sitemap.xml' }
            ]) + '</div>' +
            '</div>' +

            '<div class="border-t border-cyan-500/10">' +
            '<div class="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-[11px] text-slate-500 tracking-wider">' +
            '<span>© 2026 SE322 — Software Design &amp; Architecture</span>' +
            '<a href="https://blueprint.shoug-tech.com/" target="_blank" rel="noopener" class="group inline-flex items-center gap-1.5 text-slate-400 hover:text-cyan-300 transition-colors">' +
            'Made by <span class="text-cyan-400 group-hover:text-cyan-300">Blueprint</span>' +
            '<i class="ph ph-arrow-up-right text-xs group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"></i></a>' +
            '</div></div>' +
            '</footer>';
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
            box.innerHTML = '<img src="' + esc(img.getAttribute('src')) + '" alt="' + esc(img.getAttribute('alt') || '') + '">';
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
    bindTheme();
    bindSearch();
    bindToggles();
    bindLightbox();
})();
