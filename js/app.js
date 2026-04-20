let allN = [];
let cat = 'inicio';

async function init() {
    setupNav();
    await loadN();
}

function setupNav() {
    const navHTML = `
        <button class="nav-btn active" data-cat="inicio" onclick="changeC('inicio', this)">Inicio</button>
        <button class="nav-btn" data-cat="tecnologia" onclick="changeC('tecnologia', this)">Tecnología</button>
        <button class="nav-btn" data-cat="gaming" onclick="changeC('gaming', this)">Gaming</button>
        <button class="nav-btn" data-cat="gadgets" onclick="changeC('gadgets', this)">Gadgets</button>
    `;
    document.getElementById('main-nav').innerHTML = navHTML;
}

async function loadN() {
    try {
        const res = await fetch('/.netlify/functions/server');
        if (!res.ok) throw new Error('API Error');
        allN = await res.json();
        render();
        updateTicker();
        updateTechWidget();
    } catch (e) { 
        console.error("Error cargando noticias:", e); 
        render(); // Renderizar aunque esté vacío para mostrar menú
    }
}

function scrollToCat(c) {
    cat = c;
    render();
    window.scrollTo({top: 0, behavior: 'smooth'});
    // Actualizar botones del header
    document.querySelectorAll('.nav-btn').forEach(b => {
        b.classList.remove('active');
        if(b.getAttribute('data-cat') === c) b.classList.add('active');
    });
}

function updateTicker() {
    const ticker = document.getElementById('ticker-content');
    if (!ticker || allN.length === 0) return;
    const items = allN.slice(0, 20).map(n => `<span class="ticker-item">[ MAFIXTI RECIENTE ] ${n.title}</span>`).join('');
    ticker.innerHTML = items + items;
}

function updateTechWidget() {
    const w = document.getElementById('tech-launches');
    if(!w || allN.length === 0) return;
    const launches = allN.slice(5, 10);
    w.innerHTML = launches.map(l => `
        <div style="margin-bottom:15px; border-left:3px solid var(--c); padding-left:12px; cursor:pointer;" onclick="show('${l.id}')">
            <div style="font-size:0.7rem; color:var(--p); font-weight:800; text-transform:uppercase;">Trend</div>
            <div style="font-size:0.85rem; font-weight:600; line-height:1.3; margin-top:3px;">${l.title}</div>
        </div>
    `).join('');
}

function share(title, url) {
    const t = encodeURIComponent(title);
    const u = encodeURIComponent(url);
    return `<div class="social-share">
        <button class="s-btn" onclick="window.open('https://facebook.com/sharer/sharer.php?u=${u}')"><i class="fab fa-facebook-f"></i></button>
        <button class="s-btn" onclick="window.open('https://twitter.com/intent/tweet?text=${t}&url=${u}')"><i class="fab fa-x-twitter"></i></button>
        <button class="s-btn"><i class="fas fa-link"></i></button>
    </div>`;
}

function render() {
    const hDiv = document.getElementById('h');
    const fDiv = document.getElementById('f');
    if (!hDiv || !fDiv) return;
    
    let filtered = (cat === 'inicio') ? allN : allN.filter(n => n.category === cat);
    hDiv.innerHTML = ''; fDiv.innerHTML = '';
    
    if (allN.length === 0) {
        fDiv.innerHTML = `<div style="text-align:center; padding:100px; color:#888;">Procesando últimas noticias de Mafixti... Refresca en unos segundos.</div>`;
        return;
    }

    if (cat === 'inicio') {
        const top = allN[0];
        if(top) {
            hDiv.innerHTML = `
                <div class="hero" onclick="show('${top.id}')">
                    <img src="${top.image}">
                    <div class="hero-info">
                        <div style="background:var(--p); padding:6px 15px; display:inline-block; font-size:0.75rem; font-weight:800; margin-bottom:20px; border-radius:4px; letter-spacing:1px;">DESTACADO</div>
                        <h1>${top.title}</h1>
                        ${share(top.title, top.link)}
                    </div>
                </div>
            `;
        }
        fDiv.innerHTML = allN.slice(1).map(n => cardHTML(n)).join('');
    } else {
        fDiv.innerHTML = filtered.map(n => cardHTML(n)).join('');
    }
}

function cardHTML(n) {
    return `
        <div class="item">
            <img src="${n.image}" onclick="show('${n.id}')">
            <div style="display:flex; flex-direction:column; justify-content:center;">
                <div style="font-size:0.8rem; color:#888; margin-bottom:12px; font-weight:bold; letter-spacing:1px;">POR ${n.author.toUpperCase()} • ${new Date(n.date).toLocaleDateString()}</div>
                <h2 onclick="show('${n.id}')">${n.title}</h2>
                <p style="color:#555; font-size:1.05rem; line-height:1.6; margin-bottom:20px;">${n.snippet}</p>
                ${share(n.title, n.link)}
            </div>
        </div>
    `;
}

function changeC(c, btn) {
    scrollToCat(c);
}

function show(id) {
    const n = allN.find(x => x.id === id);
    if (!n) return;
    const m = document.getElementById('modal');
    document.getElementById('m-body').innerHTML = `
        <div class="article-hero">
            <img src="${n.image}">
            <div class="article-header-overlay">
                <div class="article-meta-pro">ESCRITO POR ${n.author.toUpperCase()} • ${new Date(n.date).toLocaleDateString()}</div>
                <h1 class="article-title">${n.title}</h1>
                <div style="display:flex; justify-content:center; gap:15px; margin-top:30px;">
                    ${share(n.title, n.link)}
                </div>
            </div>
        </div>
        <div class="article-body-container">
            <div class="ai-box-premium">
                "${n.aiIntro}"
                <div style="font-size:0.8rem; font-weight:bold; margin-top:20px; color:var(--p); text-transform:uppercase;">Análisis exclusivo Mafixti AI</div>
            </div>
            <div class="full-text-pro">
                ${n.fullContent}
            </div>
        </div>
    `;
    m.style.display = 'block'; 
    document.body.style.overflow = 'hidden';
    m.scrollTop = 0;
}

function closeM() { 
    document.getElementById('modal').style.display = 'none'; 
    document.body.style.overflow = 'auto'; 
}

document.addEventListener('DOMContentLoaded', init);
