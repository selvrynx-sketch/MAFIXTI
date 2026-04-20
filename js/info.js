const INFO_IA = {
    privacidad: "En Mafixti, la privacidad de nuestros usuarios es fundamental. Utilizamos algoritmos de encriptación de última generación para proteger sus datos. No vendemos información personal a terceros y nuestra inteligencia artificial solo procesa datos de navegación de forma anónima para mejorar la experiencia de usuario.",
    terminos: "Al acceder a Mafixti, usted acepta el uso responsable de nuestra información. El contenido generado por IA es propiedad intelectual de Mafixti. Queda prohibida la reproducción total o parcial sin consentimiento expreso del equipo editorial.",
    cookies: "Utilizamos cookies técnicas y de análisis para personalizar su experiencia y mostrar publicidad relevante a través de Google AdSense. Puede configurar sus preferencias en cualquier momento desde los ajustes de su navegador.",
    legal: "Mafixti es un portal de noticias independiente. Las opiniones expresadas en los artículos analizados por IA son responsabilidad del motor generativo y no necesariamente reflejan la postura oficial de Mafixti Media Network.",
    sobre: "Mafixti nació con la visión de revolucionar el periodismo tecnológico. Somos el primer portal en México que utiliza modelos de lenguaje masivo (LLM) para analizar, sintetizar y presentar las noticias más complejas de forma digerible para nuestra audiencia global.",
    contacto: "Para consultas comerciales, soporte técnico o sugerencias editoriales, escribanos a: editorial@mafixti.pro. Nuestro equipo en Toluca le responderá en menos de 24 horas.",
    publicidad: "Conecte su marca con la audiencia más tech de Latinoamérica. Ofrecemos espacios dinámicos, branded content impulsado por IA y patrocinios exclusivos en nuestras secciones de mayor tráfico.",
    redaccion: "Nuestro equipo 'Redacción Pro' combina el ojo humano de periodistas expertos con la velocidad de procesamiento de la IA. Cada nota es validada por especialistas antes de ser publicada para garantizar veracidad absoluta."
};

function showInfo(key) {
    const m = document.getElementById('modal');
    document.getElementById('m-body').innerHTML = `
        <div style="padding:40px; text-align:center;">
            <div class="logo" style="font-size:2rem; margin-bottom:30px;">MAFIXTI INFO</div>
            <h1 style="text-transform:uppercase; color:var(--p); margin-bottom:30px;">${key.replace('_', ' ')}</h1>
            <p style="font-size:1.5rem; line-height:2; color:#333; text-align:left;">${INFO_IA[key]}</p>
            <button onclick="closeM()" style="margin-top:50px; background:var(--p); color:white; border:none; padding:15px 40px; border-radius:30px; font-weight:bold; cursor:pointer;">ENTENDIDO</button>
        </div>
    `;
    m.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function scrollToCat(c) {
    if(document.getElementById('modal').style.display === 'block') closeM();
    changeC(c);
    window.scrollTo({top:0, behavior:'smooth'});
}
