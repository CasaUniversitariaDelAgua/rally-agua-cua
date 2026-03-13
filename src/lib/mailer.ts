import nodemailer from "nodemailer";

// Retrieve environment variables
const getEnvVar = (nombre: string) => {
    if (typeof process !== "undefined" && process.env && process.env[nombre]) {
        return process.env[nombre];
    }
    if (typeof import.meta !== "undefined" && (import.meta as any).env && (import.meta as any).env[nombre]) {
        return (import.meta as any).env[nombre];
    }
    return "";
};

const user = getEnvVar("GMAIL_USER");
const pass = getEnvVar("GMAIL_APP_PASSWORD");

if (!user || !pass) {
    console.warn("Faltan las variables de entorno GMAIL_USER o GMAIL_APP_PASSWORD.");
}

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user,
        pass,
    },
});

export async function sendApprovalEmail(toEmail: string, teamName: string) {
    if (!user || !pass) {
        throw new Error("Credenciales de correo no configuradas.");
    }

    const htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0056b3;">¡Confirmación de registro! Prepárense para el Rally del Ciclo del Agua 💧</h2>
        
        <p>¡Hola, <strong>Guardianes del Agua</strong>!</p>
        
        <p>Es un gusto saludarlos. Hemos recibido con éxito el registro del equipo <strong>"${teamName}"</strong> para participar en el Rally del Ciclo del Agua, un evento científico-deportivo organizado con motivo del Día Mundial del Agua. Estamos muy emocionados de contar con su energía y destreza para este recorrido de impacto social y ambiental.</p>
        
        <h3 style="color: #0056b3; margin-top: 30px;">📍 Información clave para el día del evento:</h3>
        <ul style="list-style-type: none; padding-left: 0;">
            <li>📅 <strong>Fecha:</strong> Sábado 21 de marzo.</li>
            <li>⏰ <strong>Hora de inicio:</strong> 9:00 AM <em>(llegar 15 min antes para el registro)</em>.</li>
            <li>🏁 <strong>Punto de partida:</strong> Parque de los Pajaritos, Zona Centro.</li>
            <li>⏳ <strong>Duración estimada:</strong> Alrededor de dos horas.</li>
        </ul>

        <h3 style="color: #0056b3; margin-top: 30px;">🎒 ¿Qué deben llevar?</h3>
        <p>Para que su experiencia sea óptima, les recordamos traer:</p>
        <ul>
            <li>Ropa y calzado cómodo (deportivo) para caminar por la zona centro.</li>
            <li>Termos con agua fresca (¡reutilizables!) para mantenerse hidratados.</li>
            <li>Protección solar y gorra o sombrero.</li>
            <li><strong>¡Muchas ganas de aprender y de ser los primeros en completar el circuito!</strong></li>
        </ul>

        <h3 style="color: #0056b3; margin-top: 30px;">📘 Guía de Conocimiento para el Rally</h3>
        <p>Cada una de las 5 estaciones tiene un reto físico y uno mental. Para facilitar su paso por las bases, les sugerimos repasar la guía que hicimos para ustedes.</p>
        <p style="text-align: center; margin: 30px 0;">
            <a href="https://drive.google.com/file/d/1MNUWVk1DWAlPXIU16HQLcfJffGmLmfGx/view?usp=drive_link" 
               style="background-color: #0056b3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                Descargar Guía de Conocimiento
            </a>
        </p>

        <p>Recuerden que habrá premios sorpresa para los tres primeros lugares y constancias de participación para todos.</p>
        
        <p style="margin-top: 30px;"><strong>¡Nos vemos en la meta!</strong></p>
    </div>
    `;

    const mailOptions = {
        from: `"Rally del Ciclo del Agua" <${user}>`,
        to: toEmail,
        subject: `¡Confirmación de registro! - ${teamName}`,
        html: htmlContent,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`✉️ Correo enviado a ${toEmail} para el equipo ${teamName}`);
        return info;
    } catch (error) {
        console.error("Error enviando el correo:", error);
        throw error;
    }
}