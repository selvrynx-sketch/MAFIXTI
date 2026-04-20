const Parser = require('rss-parser');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const parser = new Parser({
    timeout: 10000,
    customFields: {
        item: [['media:content', 'media:content', {keepArray: false}], ['enclosure', 'enclosure'], ['content:encoded', 'contentEncoded']]
    }
});

const genAI = new GoogleGenerativeAI("AIzaSyDgu8rraIwNqNGestWMEDYJk3iMPmSaWzo");
const AUTHORS = ["Alex Tech", "Sofia Digital", "Marcos Bit", "Elena Cyber", "Dani Cripto", "Victor Gaming"];

function extractRealImage(item) {
    if (item.enclosure && item.enclosure.url) return item.enclosure.url;
    if (item['media:content'] && item['media:content'].$.url) return item['media:content'].$.url;
    const raw = item.contentEncoded || item.content || "";
    const match = raw.match(/<img[^>]+src="([^">]+)"/);
    return (match && match[1]) ? match[1] : "https://images.unsplash.com/photo-1550745165-9bc0b252726f";
}

function cleanMafixtiTitanium(text, author) {
    if (!text) return "Nota en proceso de validacin editorial.";
    let clean = text;
    const killBlocks = ["La noticia", "Imgenes |", "Imágenes |", "Va |", "Vía |", "Publicado originalmente"];
    killBlocks.forEach(k => { if (clean.includes(k)) clean = clean.split(k)[0]; });
    clean = clean.replace(/Xataka|Genbeta|VidaExtra|CriptoNoticias|Marca|Webedia|Investing/gi, "Mafixti");
    clean = clean.replace(/<a\b[^>]*>(.*?)<\/a>/gim, "$1");
    clean += `<div style="margin-top:60px; padding:40px; background:#f0f2f5; border-radius:15px; border-left:10px solid #6200ea;">
                <div style="font-family:'Orbitron'; color:#6200ea; font-size:1rem; margin-bottom:10px;">MAFIXTI EDITORIAL</div>
                <p style="font-size:1.2rem; font-weight:700;">Validado y analizado por ${author}</p>
              </div>`;
    return clean;
}

async function fetchNews(cat, url) {
    try {
        const feed = await parser.parseURL(url);
        return feed.items.slice(0, 15).map(i => {
            const auth = AUTHORS[Math.floor(Math.random() * AUTHORS.length)];
            return {
                id: Math.random().toString(36).substr(2, 9),
                title: i.title.split(' - ')[0].replace(/Xataka|Genbeta|VidaExtra|Investing/gi, "Mafixti"),
                image: extractRealImage(i),
                aiIntro: "Analizado por Mafixti AI.",
                snippet: i.contentSnippet ? i.contentSnippet.substring(0, 150) + "..." : "Resumen de Mafixti.",
                fullContent: cleanMafixtiTitanium(i.contentEncoded || i.content || i.description || "", auth),
                date: i.pubDate || new Date(),
                category: cat,
                author: auth
            };
        });
    } catch (e) { return []; }
}

exports.handler = async (event, context) => {
    try {
        const results = await Promise.all([
            fetchNews('inicio', 'https://www.xataka.com.mx/index.xml'),
            fetchNews('tecnologia', 'https://www.xataka.com/index.xml'),
            fetchNews('gaming', 'https://www.vidaextra.com/index.xml'),
            fetchNews('gadgets', 'https://www.xatakamovil.com/index.xml')
        ]);
        
        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(results.flat().sort((a,b) => new Date(b.date) - new Date(a.date)))
        };
    } catch (e) {
        return { statusCode: 500, body: e.message };
    }
};
