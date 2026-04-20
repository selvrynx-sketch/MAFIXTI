function extractRealImage(item) {
    // Buscar en metadatos avanzados (Alta calidad)
    if (item.enclosure && item.enclosure.url) return item.enclosure.url;
    if (item['media:content'] && item['media:content'].$.url) return item['media:content'].$.url;
    
    // Buscar en el cuerpo del texto
    const raw = item['content:encoded'] || item.content || "";
    const match = raw.match(/<img[^>]+src="([^">]+)"/);
    if (match && match[1]) return match[1];

    return "https://images.unsplash.com/photo-1550745165-9bc0b252726f"; // Respaldo tech
}

function cleanMafixtiTitanium(text, author) {
    if (!text) return "Nota en proceso de validacin editorial.";
    let clean = text;
    
    // 1. Borrar firmas y pies de pgina agresivamente
    const killBlocks = ["La noticia", "Imgenes |", "Imágenes |", "Va |", "Vía |", "Publicado originalmente", "Sigue a", "Compartir en"];
    killBlocks.forEach(k => { if (clean.includes(k)) clean = clean.split(k)[0]; });

    // 2. Limpieza de nombres y marcas (Cero rastro de competencia)
    clean = clean.replace(/Xataka|Genbeta|VidaExtra|CriptoNoticias|Marca|Webedia|Investing/gi, "Mafixti");
    clean = clean.replace(/Ismael Garcia|Marcos Merino|Eric Ramirez|Eduardo Quevedo|Jose Garcia/gi, author);
    
    // 3. Quitar links azules
    clean = clean.replace(/<a\b[^>]*>(.*?)<\/a>/gim, "$1");

    // 4. Firma Mafixti Pro
    clean += `
        <div style="margin-top:60px; padding:40px; background:#f0f2f5; border-radius:15px; border-left:10px solid var(--p);">
            <div style="font-family:'Orbitron'; color:var(--p); font-size:1rem; margin-bottom:10px;">MAFIXTI EDITORIAL</div>
            <p style="font-size:1.2rem; font-weight:700;">Validado y analizado por ${author}</p>
        </div>
    `;
    return clean;
}

module.exports = { extractRealImage, cleanMafixtiTitanium };
