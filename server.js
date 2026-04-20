const express = require('express');
const Parser = require('rss-parser');
const axios = require('axios');
const { extractRealImage, cleanMafixtiTitanium } = require('./logic/processor');
require('dotenv').config();

const app = express();
const parser = new Parser({
    timeout: 10000,
    customFields: {
        item: [['media:content', 'media:content', {keepArray: false}], ['enclosure', 'enclosure'], ['content:encoded', 'contentEncoded']]
    }
});
const PORT = 3000;

app.use(express.static('public'));
app.use('/css', express.static('css'));
app.use('/js', express.static('js'));

const AUTHORS = ["Alex Tech", "Sofia Digital", "Marcos Bit", "Elena Cyber", "Dani Cripto", "Victor Gaming"];

async function fetchNews(cat, url) {
    try {
        const feed = await parser.parseURL(url);
        return feed.items.slice(0, 20).map(i => {
            const auth = AUTHORS[Math.floor(Math.random() * AUTHORS.length)];
            const title = i.title.split(' - ')[0].replace(/Xataka|Genbeta|VidaExtra/gi, "Mafixti");
            const content = i.contentEncoded || i.content || i.description || "";

            return {
                id: Math.random().toString(36).substr(2, 9),
                title: title,
                image: extractRealImage(i),
                aiIntro: "Análisis exclusivo de Mafixti AI.",
                snippet: i.contentSnippet ? i.contentSnippet.substring(0, 150) + "..." : "Resumen de Mafixti.",
                fullContent: cleanMafixtiTitanium(content, auth),
                date: i.pubDate || new Date(),
                category: cat,
                author: auth
            };
        });
    } catch (e) { return []; }
}

app.get('/api/news', async (req, res) => {
    const results = await Promise.all([
        fetchNews('inicio', 'https://www.xataka.com.mx/index.xml'),
        fetchNews('tecnologia', 'https://www.xataka.com/index.xml'),
        fetchNews('gaming', 'https://www.vidaextra.com/index.xml'),
        fetchNews('gadgets', 'https://www.xatakamovil.com/index.xml')
    ]);
    res.json(results.flat().sort((a,b) => new Date(b.date) - new Date(a.date)));
});

app.listen(PORT, () => console.log("Mafixti Final Build Live on 3000"));
