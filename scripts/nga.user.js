// ==UserScript==
// @name         NGA → VS Code Style
// @namespace    https://github.com/lvxingzhi/youhou
// @version      0.1.0
// @description  把 NGA 论坛改造成 VS Code 深色编辑器界面：活动栏 + 楼层目录侧边栏 + 标签页 + 状态栏
// @author       lvxingzhi
// @match        *://bbs.nga.cn/*
// @match        *://ngabbs.com/*
// @match        *://nga.178.com/*
// @match        *://bbs.178.com/*
// @match        *://bbs.ngacn.cc/*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    /* ===================== 配置 ===================== */
    const CONFIG = {
        activityBarWidth: 48,
        sidebarWidth: 260,
        tabBarHeight: 35,
        statusBarHeight: 22,
    };

    const COLORS = {
        bg: '#1e1e1e',
        bgAlt: '#252526',
        activityBar: '#333333',
        tabBar: '#2d2d2d',
        tabActive: '#1e1e1e',
        border: '#3c3c3c',
        text: '#d4d4d4',
        muted: '#858585',
        accent: '#007acc',
        link: '#4fc1ff',
        visited: '#c586c0',
        green: '#4ec9b0',
        orange: '#ce9178',
    };

    /* ===================== 工具函数 ===================== */
    function addStyle(css) {
        if (typeof GM_addStyle === 'function') {
            GM_addStyle(css);
            return;
        }
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }

    function svgIcon(path, size = 22) {
        return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            ${path}</svg>`;
    }

    const ICONS = {
        outline: svgIcon('<path d="M8 6h13M8 12h13M8 18h13"/><circle cx="3.5" cy="6" r="1"/><circle cx="3.5" cy="12" r="1"/><circle cx="3.5" cy="18" r="1"/>'),
        explorer: svgIcon('<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>'),
        search: svgIcon('<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>'),
        settings: svgIcon('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1-1.55 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.55-1H3a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.55-1 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34h.09a1.7 1.7 0 0 0 1-1.55V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87v.09a1.7 1.7 0 0 0 1.55 1H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.51 1z"/>'),
    };

    /* ===================== 样式 ===================== */
    const CSS = `
    :root {
        --vsc-activity-w: ${CONFIG.activityBarWidth}px;
        --vsc-sidebar-w: ${CONFIG.sidebarWidth}px;
        --vsc-tabbar-h: ${CONFIG.tabBarHeight}px;
        --vsc-statusbar-h: ${CONFIG.statusBarHeight}px;
    }

    html, body {
        background: ${COLORS.bg} !important;
        color: ${COLORS.text} !important;
    }

    body {
        box-sizing: border-box !important;
        padding-top: var(--vsc-tabbar-h) !important;
        padding-left: calc(var(--vsc-activity-w) + var(--vsc-sidebar-w)) !important;
        padding-bottom: var(--vsc-statusbar-h) !important;
        transition: padding-left .18s ease;
        font-family: "Menlo", "Monaco", "Consolas", ui-monospace, monospace !important;
        font-size: 14px !important;
    }

    body.vsc-sidebar-collapsed {
        padding-left: var(--vsc-activity-w) !important;
    }

    body.vsc-sidebar-collapsed #vsc-sidebar {
        display: none !important;
    }

    /* ---------- NGA 原生元素隐藏 ---------- */
    #header,
    .header,
    #nav,
    .nav,
    #menu,
    .menu,
    .topbar,
    #topbar,
    .ad,
    .advertisement,
    #footer,
    .footer,
    .bottom,
    .sidebar {
        display: none !important;
    }

    /* ---------- 通用背景与表格 ---------- */
    #main, .main, #content, .content, #wrap, .wrap {
        background: ${COLORS.bg} !important;
    }

    table, tr, td, th {
        background: transparent !important;
        border-color: ${COLORS.border} !important;
        color: ${COLORS.text} !important;
    }

    /* ---------- 帖子列表 ---------- */
    .topicrow, .topicrow td, .topicrow th {
        background: ${COLORS.bgAlt} !important;
        border-bottom: 1px solid ${COLORS.border} !important;
    }

    .topicrow:hover td {
        background: #2d2d2d !important;
    }

    .topicrow a, .topicrow .title {
        color: ${COLORS.text} !important;
    }

    .topicrow a:visited {
        color: #9a9a9a !important;
    }

    /* ---------- 楼层 ---------- */
    .postrow, .postrow td,
    .postrow > tbody > tr > td {
        background: ${COLORS.bgAlt} !important;
        border: 1px solid ${COLORS.border} !important;
        color: ${COLORS.text} !important;
    }

    .poster, .poster td {
        background: #202020 !important;
        border-right: 1px solid ${COLORS.border} !important;
    }

    .postcontent, .postContent, .post-content {
        background: ${COLORS.bg} !important;
        color: ${COLORS.text} !important;
        font-family: "Menlo", "Monaco", "Consolas", ui-monospace, monospace !important;
        line-height: 1.75 !important;
    }

    .postInfo, .postinfo, .postInfo a {
        color: ${COLORS.muted} !important;
    }

    .poster .author, .author, .poster a[href*="uid"] {
        color: ${COLORS.green} !important;
    }

    /* ---------- 链接 ---------- */
    a {
        color: ${COLORS.link} !important;
    }

    a:visited {
        color: ${COLORS.visited} !important;
    }

    /* ---------- 引用与代码 ---------- */
    .quote, blockquote, .quoteContent {
        background: #1a1a1a !important;
        border-left: 3px solid ${COLORS.accent} !important;
        color: #a0a0a0 !important;
        margin: 10px 0 !important;
        padding: 8px 14px !important;
    }

    pre, code, .code, .codeblock {
        background: #0d0d0d !important;
        border: 1px solid ${COLORS.border} !important;
        color: ${COLORS.orange} !important;
        border-radius: 0 !important;
        font-family: "Menlo", "Monaco", "Consolas", ui-monospace, monospace !important;
    }

    /* ---------- 表单控件 ---------- */
    input[type="text"],
    input[type="password"],
    input[type="search"],
    textarea,
    select {
        background: #3c3c3c !important;
        border: 1px solid ${COLORS.border} !important;
        color: ${COLORS.text} !important;
        border-radius: 0 !important;
    }

    input[type="submit"],
    input[type="button"],
    button,
    .btn {
        background: #0e639c !important;
        border: 1px solid #1177bb !important;
        color: #ffffff !important;
        border-radius: 0 !important;
        cursor: pointer;
    }

    input[type="submit"]:hover,
    input[type="button"]:hover,
    button:hover,
    .btn:hover {
        background: #1177bb !important;
    }

    /* ---------- 滚动条 ---------- */
    ::-webkit-scrollbar { width: 10px; height: 10px; }
    ::-webkit-scrollbar-track { background: ${COLORS.bg}; }
    ::-webkit-scrollbar-thumb { background: #424242; }
    ::-webkit-scrollbar-thumb:hover { background: #4f4f4f; }

    /* ---------- 顶部标签栏 ---------- */
    #vsc-tabs {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: var(--vsc-tabbar-h);
        background: ${COLORS.tabBar};
        border-bottom: 1px solid ${COLORS.border};
        display: flex;
        align-items: stretch;
        z-index: 2147483000;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        font-size: 13px;
        overflow: hidden;
    }

    #vsc-tabs .vsc-tab {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 0 14px;
        min-width: 140px;
        max-width: 340px;
        color: ${COLORS.muted};
        border-right: 1px solid ${COLORS.border};
        cursor: pointer;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        user-select: none;
    }

    #vsc-tabs .vsc-tab:hover { background: #2a2a2a; }

    #vsc-tabs .vsc-tab.active {
        background: ${COLORS.tabActive};
        color: #ffffff;
        box-shadow: inset 0 1px 0 ${COLORS.accent};
    }

    #vsc-tabs .vsc-tab .vsc-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: ${COLORS.orange};
        flex-shrink: 0;
    }

    #vsc-tabs .vsc-tab-title {
        overflow: hidden;
        text-overflow: ellipsis;
    }

    /* ---------- 活动栏 ---------- */
    #vsc-activity {
        position: fixed;
        top: var(--vsc-tabbar-h);
        left: 0;
        bottom: var(--vsc-statusbar-h);
        width: var(--vsc-activity-w);
        background: ${COLORS.activityBar};
        border-right: 1px solid ${COLORS.border};
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 6px;
        gap: 2px;
        z-index: 2147483000;
    }

    #vsc-activity .vsc-activity-btn {
        width: 48px;
        height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: ${COLORS.muted};
        background: transparent;
        border: none;
        border-left: 2px solid transparent;
        cursor: pointer;
        padding: 0;
    }

    #vsc-activity .vsc-activity-btn:hover { color: #ffffff; }

    #vsc-activity .vsc-activity-btn.active {
        color: #ffffff;
        border-left-color: #ffffff;
    }

    #vsc-activity .vsc-activity-spacer { flex: 1; }

    /* ---------- 侧边栏 ---------- */
    #vsc-sidebar {
        position: fixed;
        top: var(--vsc-tabbar-h);
        left: var(--vsc-activity-w);
        bottom: var(--vsc-statusbar-h);
        width: var(--vsc-sidebar-w);
        background: ${COLORS.bgAlt};
        border-right: 1px solid ${COLORS.border};
        display: flex;
        flex-direction: column;
        z-index: 2147482999;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        font-size: 13px;
    }

    #vsc-sidebar .vsc-sidebar-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 16px 8px;
        font-size: 11px;
        letter-spacing: .08em;
        text-transform: uppercase;
        color: ${COLORS.muted};
    }

    #vsc-sidebar .vsc-sidebar-count {
        font-size: 11px;
        color: ${COLORS.muted};
    }

    #vsc-outline {
        flex: 1;
        overflow-y: auto;
        padding-bottom: 10px;
    }

    .vsc-outline-item {
        padding: 4px 16px 4px 26px;
        color: ${COLORS.text};
        cursor: pointer;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        border-left: 2px solid transparent;
        line-height: 1.5;
    }

    .vsc-outline-item:hover {
        background: #2a2d2e;
        color: #ffffff;
    }

    .vsc-outline-item.vsc-active {
        background: #37373d;
        border-left-color: ${COLORS.accent};
        color: #ffffff;
    }

    .vsc-outline-item .vsc-outline-index {
        color: ${COLORS.muted};
        margin-right: 6px;
        font-variant-numeric: tabular-nums;
    }

    .vsc-empty {
        padding: 16px;
        color: ${COLORS.muted};
        font-size: 12px;
        line-height: 1.6;
    }

    #vsc-search-wrap {
        padding: 0 12px 8px;
        display: none;
    }

    #vsc-search-wrap.visible { display: block; }

    #vsc-search-input {
        width: 100%;
        box-sizing: border-box;
        background: #3c3c3c;
        border: 1px solid #3c3c3c;
        color: ${COLORS.text};
        padding: 5px 8px;
        outline: none;
        font-size: 12px;
        font-family: inherit;
    }

    #vsc-search-input:focus { border-color: ${COLORS.accent}; }

    /* ---------- 状态栏 ---------- */
    #vsc-statusbar {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        height: var(--vsc-statusbar-h);
        background: ${COLORS.accent};
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 12px;
        z-index: 2147483001;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        font-size: 12px;
        user-select: none;
    }

    #vsc-statusbar .vsc-status-left,
    #vsc-statusbar .vsc-status-right {
        display: flex;
        align-items: center;
        gap: 14px;
        overflow: hidden;
        white-space: nowrap;
    }

    #vsc-statusbar .vsc-status-item {
        cursor: pointer;
        opacity: .95;
    }

    #vsc-statusbar .vsc-status-item:hover { opacity: 1; text-decoration: underline; }
    `;

    /* ===================== DOM 外壳 ===================== */
    function buildShell() {
        const tabs = document.createElement('div');
        tabs.id = 'vsc-tabs';
        tabs.innerHTML = `
            <div class="vsc-tab active">
                <span class="vsc-dot"></span>
                <span class="vsc-tab-title">NGA</span>
            </div>
        `;

        const activity = document.createElement('div');
        activity.id = 'vsc-activity';
        activity.innerHTML = `
            <button class="vsc-activity-btn active" data-action="outline" title="楼层目录">${ICONS.outline}</button>
            <button class="vsc-activity-btn" data-action="explorer" title="页面信息">${ICONS.explorer}</button>
            <button class="vsc-activity-btn" data-action="search" title="搜索目录">${ICONS.search}</button>
            <div class="vsc-activity-spacer"></div>
            <button class="vsc-activity-btn" data-action="settings" title="切换侧边栏">${ICONS.settings}</button>
        `;

        const sidebar = document.createElement('aside');
        sidebar.id = 'vsc-sidebar';
        sidebar.innerHTML = `
            <div class="vsc-sidebar-header">
                <span id="vsc-sidebar-title">楼层目录</span>
                <span class="vsc-sidebar-count" id="vsc-outline-count"></span>
            </div>
            <div id="vsc-search-wrap">
                <input id="vsc-search-input" type="text" placeholder="筛选楼层..." spellcheck="false">
            </div>
            <div id="vsc-outline"></div>
        `;

        const statusbar = document.createElement('div');
        statusbar.id = 'vsc-statusbar';
        statusbar.innerHTML = `
            <div class="vsc-status-left">
                <span class="vsc-status-item" id="vsc-status-branch">⑂ main</span>
                <span class="vsc-status-item" id="vsc-status-count">0 楼层</span>
                <span class="vsc-status-item" id="vsc-status-tid"></span>
            </div>
            <div class="vsc-status-right">
                <span class="vsc-status-item">Ln 1, Col 1</span>
                <span class="vsc-status-item">空格: 2</span>
                <span class="vsc-status-item">UTF-8</span>
                <span class="vsc-status-item">LF</span>
                <span class="vsc-status-item" id="vsc-status-lang">{ } NGA</span>
            </div>
        `;

        document.body.appendChild(tabs);
        document.body.appendChild(activity);
        document.body.appendChild(sidebar);
        document.body.appendChild(statusbar);
    }

    /* ===================== 页面识别 ===================== */
    function isThreadPage() {
        return /read\.php/i.test(location.pathname + location.search);
    }

    function isForumPage() {
        return /thread\.php/i.test(location.pathname + location.search);
    }

    function getPageTitle() {
        const selectors = [
            '#postsubject',
            '.postsubject',
            '#subject',
            '.subject',
            'h1',
            '.topicTitle',
        ];
        for (const sel of selectors) {
            const el = document.querySelector(sel);
            const text = el && el.textContent.replace(/\s+/g, ' ').trim();
            if (text) return text.length > 60 ? text.slice(0, 60) + '…' : text;
        }
        return (document.title.split(/[-_|]/)[0] || 'NGA').trim();
    }

    function getTid() {
        const match = location.search.match(/[?&]tid=(\d+)/i) || location.pathname.match(/tid[=\/](\d+)/i);
        return match ? match[1] : '';
    }

    /* ===================== 楼层收集 ===================== */
    function collectFloors() {
        if (!isThreadPage()) return [];

        const selectors = [
            '#postlist .postrow',
            '#postlist > table',
            '.postrow',
            '[id^="post_"]',
        ];

        for (const sel of selectors) {
            const nodes = Array.from(document.querySelectorAll(sel)).filter((el) => {
                const rect = el.getBoundingClientRect();
                return rect.height > 40;
            });
            if (nodes.length >= 2) return nodes;
        }
        return [];
    }

    function extractAuthor(floor) {
        const selectors = [
            '.poster .author',
            '.poster a[href*="uid"]',
            '.author',
            '.postInfo a[href*="uid"]',
            'a[href*="uid"]',
        ];
        for (const sel of selectors) {
            const el = floor.querySelector(sel);
            const text = el && el.textContent.trim();
            if (text && text.length <= 24) return text;
        }
        return '匿名';
    }

    function extractFloorNo(floor, index) {
        const info = floor.querySelector('.postInfo, .postinfo');
        const match = (info && info.textContent || '').match(/(\d+)\s*楼/);
        if (match) return match[1];
        return String(index + 1);
    }

    function extractExcerpt(floor) {
        const content = floor.querySelector('.postcontent, .postContent, .post-content');
        const text = (content && content.textContent || '').replace(/\s+/g, ' ').trim();
        return text.slice(0, 80);
    }

    /* ===================== 侧边栏渲染 ===================== */
    let currentFloors = [];
    let activeIndex = -1;

    function renderOutline() {
        const outline = document.getElementById('vsc-outline');
        const count = document.getElementById('vsc-outline-count');
        const statusCount = document.getElementById('vsc-status-count');
        const statusTid = document.getElementById('vsc-status-tid');
        if (!outline) return;

        currentFloors = collectFloors();
        outline.innerHTML = '';
        activeIndex = -1;

        if (count) count.textContent = currentFloors.length ? String(currentFloors.length) : '';
        if (statusCount) statusCount.textContent = `${currentFloors.length} 楼层`;

        const tid = getTid();
        if (statusTid) statusTid.textContent = tid ? `tid=${tid}` : '';

        if (!currentFloors.length) {
            outline.innerHTML = isThreadPage()
                ? '<div class="vsc-empty">没有识别到楼层。<br>可能是未登录或页面结构变化。</div>'
                : '<div class="vsc-empty">当前不是帖子页。<br>打开一个帖子后会显示楼层目录。</div>';
            updateTabTitle();
            return;
        }

        currentFloors.forEach((floor, index) => {
            const floorNo = extractFloorNo(floor, index);
            const author = extractAuthor(floor);
            const label = `${floorNo}楼 · ${author}`;

            const row = document.createElement('div');
            row.className = 'vsc-outline-item';
            row.dataset.index = String(index);
            row.title = extractExcerpt(floor) || label;
            row.innerHTML = `<span class="vsc-outline-index">${floorNo}</span><span class="vsc-outline-label"></span>`;
            row.querySelector('.vsc-outline-label').textContent = author;

            row.addEventListener('click', () => {
                floor.scrollIntoView({ behavior: 'smooth', block: 'start' });
                setActive(index);
            });

            outline.appendChild(row);
        });

        updateTabTitle();
        syncActiveOnScroll();
    }

    function updateTabTitle() {
        const titleEl = document.querySelector('#vsc-tabs .vsc-tab-title');
        if (titleEl) titleEl.textContent = getPageTitle();

        const lang = document.getElementById('vsc-status-lang');
        if (lang) {
            if (isThreadPage()) lang.textContent = '{ } NGA Thread';
            else if (isForumPage()) lang.textContent = '{ } NGA Forum';
            else lang.textContent = '{ } NGA';
        }
    }

    function setActive(index) {
        activeIndex = index;
        document.querySelectorAll('.vsc-outline-item').forEach((el) => {
            el.classList.toggle('vsc-active', Number(el.dataset.index) === index);
        });
    }

    let scrollTicking = false;
    function syncActiveOnScroll() {
        if (scrollTicking) return;
        scrollTicking = true;
        requestAnimationFrame(() => {
            scrollTicking = false;
            if (!currentFloors.length) return;
            let bestIndex = -1;
            let bestDist = Infinity;
            currentFloors.forEach((floor, index) => {
                const dist = Math.abs(floor.getBoundingClientRect().top - 80);
                if (dist < bestDist) {
                    bestDist = dist;
                    bestIndex = index;
                }
            });
            if (bestIndex >= 0 && bestIndex !== activeIndex) setActive(bestIndex);
        });
    }

    /* ===================== 交互绑定 ===================== */
    function escapeHTML(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function bindEvents() {
        document.querySelectorAll('#vsc-activity .vsc-activity-btn').forEach((btn) => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;

                if (action === 'settings') {
                    document.body.classList.toggle('vsc-sidebar-collapsed');
                    return;
                }

                document.querySelectorAll('#vsc-activity .vsc-activity-btn').forEach((b) => b.classList.remove('active'));
                btn.classList.add('active');

                const title = document.getElementById('vsc-sidebar-title');
                const searchWrap = document.getElementById('vsc-search-wrap');
                const outline = document.getElementById('vsc-outline');

                if (action === 'search') {
                    if (title) title.textContent = '搜索';
                    if (searchWrap) {
                        searchWrap.classList.add('visible');
                        const input = document.getElementById('vsc-search-input');
                        if (input) input.focus();
                    }
                    return;
                }

                if (searchWrap) searchWrap.classList.remove('visible');

                if (action === 'explorer') {
                    if (title) title.textContent = '页面信息';
                    if (outline) {
                        const info = [
                            ['标题', getPageTitle()],
                            ['类型', isThreadPage() ? '帖子' : (isForumPage() ? '版块列表' : '论坛首页')],
                            ['tid', getTid() || '—'],
                            ['楼层数', String(currentFloors.length)],
                        ];
                        outline.innerHTML = info.map(([k, v]) =>
                            `<div class="vsc-outline-item" style="cursor:default;padding-left:16px">
                                <span class="vsc-outline-index">${k}</span>
                                <span style="color:${COLORS.green}">${escapeHTML(v)}</span>
                            </div>`
                        ).join('');
                    }
                    return;
                }

                if (title) title.textContent = '楼层目录';
                renderOutline();
            });
        });

        const searchInput = document.getElementById('vsc-search-input');
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                const keyword = searchInput.value.trim().toLowerCase();
                document.querySelectorAll('.vsc-outline-item').forEach((row) => {
                    const label = row.textContent.toLowerCase();
                    row.style.display = !keyword || label.includes(keyword) ? '' : 'none';
                });
            });
        }

        document.querySelectorAll('#vsc-tabs .vsc-tab').forEach((tab) => {
            tab.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
        });

        window.addEventListener('scroll', syncActiveOnScroll, { passive: true });

        if (typeof GM_registerMenuCommand === 'function') {
            GM_registerMenuCommand('切换侧边栏', () => {
                document.body.classList.toggle('vsc-sidebar-collapsed');
            });
            GM_registerMenuCommand('刷新楼层目录', () => {
                if (document.body.classList.contains('vsc-sidebar-collapsed')) {
                    document.body.classList.remove('vsc-sidebar-collapsed');
                }
                renderOutline();
            });
        }
    }

    /* ===================== 内容变化监听 ===================== */
    function watchChanges() {
        let timer = null;
        const observer = new MutationObserver(() => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                updateTabTitle();
                renderOutline();
            }, 700);
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    /* ===================== 启动 ===================== */
    function init() {
        if (document.getElementById('vsc-statusbar')) return;

        addStyle(CSS);
        buildShell();
        bindEvents();
        renderOutline();
        watchChanges();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }
})();
