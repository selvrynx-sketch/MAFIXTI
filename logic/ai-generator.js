const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

/**
 * Genera una introducción de 3 líneas usando IA.
 */
async function generateIntro(title, snippet) {
    if (!process.env.GEMINI_API_KEY) {
        return "Mafixti te trae lo último en tecnología directamente a tu pantalla. No te pierdas los detalles de esta noticia que está marcando tendencia hoy.";
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = `Actúa como un experto en tecnología para el sitio 'Mafixti'. Genera una introducción única, enganchadora y original de exactamente 3 líneas (no más, no menos) para el siguiente artículo:
        Título: ${title}
        Resumen: ${snippet}
        
        Asegúrate de que la introducción sirva como gancho para el lector.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error generando intro con IA:", error);
        return "Descubre cómo esta innovación de Mafixti está cambiando el panorama tecnológico actual. Analizamos los puntos clave para que no te pierdas nada.";
    }
}

module.exports = { generateIntro };
