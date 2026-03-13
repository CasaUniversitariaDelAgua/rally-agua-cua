// scripts/send_historical_emails2.js
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const user = process.env.GMAIL_USER;
const pass = process.env.GMAIL_APP_PASSWORD;

if (!user || !pass) {
  console.error("Missing GMAIL credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
      user,
      pass,
  },
});

async function main() {
  console.log("Fetching ALL registrations to match emails...");
  
  const { data: registrations, error } = await supabase
    .from("registrations")
    .select("id, team_name, email, approved_at");

  if (error) {
    console.error("Error fetching registrations:", error);
    process.exit(1);
  }

  // Those are the ones the user supplied in the screenshot
  const targetEmails = [
    "jareddominguez0523@gmail.com",
    "rudyalpuchec@gmail.com",
    "rmily7390@gmail.com",
    "elunarosal@gmail.com",
    "wendigutierrez66@gmail.com",
    "johancordova85@gmail.com",
    "correadelacruzleslie2006@gmail.com",
    "rmily7390@gmail.com" // intentional duplicate as shown in screenshot
  ];

  const matchedRegs = [];
  
  // Try to match targets
  const availableRegs = [...registrations];
  
  for (const email of targetEmails) {
    const idx = availableRegs.findIndex(r => r.email === email);
    if (idx !== -1) {
        matchedRegs.push(availableRegs[idx]);
        // Remove from available so we handle duplicates correctly (like rmily)
        availableRegs.splice(idx, 1);
    } else {
        console.warn(`Warning: Could not find registration for email: ${email}`);
    }
  }

  if (matchedRegs.length === 0) {
    console.log("No teams matched.");
    process.exit(0);
  }

  console.log(`Found ${matchedRegs.length} target teams. Sending emails...\n`);

  for (const reg of matchedRegs) {
    try {
        console.log(`Sending to ${reg.team_name} (${reg.email})...`);

        const htmlContent = `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #0056b3;">¡Confirmación de registro! Prepárense para el Rally del Ciclo del Agua 💧</h2>
            
            <p>¡Hola, <strong>Guardianes del Agua</strong>!</p>
            
            <p>Es un gusto saludarlos. Hemos recibido con éxito el registro del equipo <strong>"${reg.team_name}"</strong> para participar en el Rally del Ciclo del Agua, un evento científico-deportivo organizado con motivo del Día Mundial del Agua. Estamos muy emocionados de contar con su energía y destreza para este recorrido de impacto social y ambiental.</p>
            
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

      await transporter.sendMail({
        from: `"Rally del Ciclo del Agua" <${user}>`,
        to: reg.email,
        subject: `¡Confirmación de registro! - ${reg.team_name}`,
        html: htmlContent,
      });

      console.log(`✅ Success for ${reg.team_name}`);
      
      // Delay to avoid spamming the SMTP server aggressively
      await new Promise(r => setTimeout(r, 1000));
      
      // Update approved_at since these were missed before
      await supabase
        .from("registrations")
        .update({ approved_at: new Date().toISOString() })
        .eq("id", reg.id);
        
    } catch (err) {
      console.error(`❌ Failed for ${reg.team_name}:`, err.message);
    }
  }

  console.log("\nDone!");
}

main();
