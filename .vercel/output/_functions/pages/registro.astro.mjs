import { e as createComponent, n as renderHead, l as renderComponent, r as renderTemplate } from '../chunks/astro/server_CwtUBU6d.mjs';
import 'piccolore';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState } from 'react';
/* empty css                                    */
export { renderers } from '../renderers.mjs';

const EMPTY = {
  team_name: "",
  representative: "",
  phone: "",
  email: "",
  members: "",
  how_heard: "",
  institution: "",
  experience: "",
  special_needs: "",
  comments: ""
};
const REQUIRED_FIELDS = [
  "team_name",
  "representative",
  "phone",
  "email",
  "members",
  "how_heard",
  "institution",
  "experience",
  "special_needs"
];
function RegistrationForm() {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [serverError, setServerError] = useState("");
  const labels = {
    team_name: "Nombre del equipo",
    representative: "Nombre del representante",
    phone: "Número de teléfono",
    email: "Correo electrónico",
    members: "Nombres completos de los integrantes (comenzando por el representante)",
    how_heard: "¿Cómo se enteraron de este rally?",
    institution: "Institución educativa o procedencia",
    experience: "¿Tienen experiencia en rallies o actividades similares? ¿Cuáles?",
    special_needs: "¿Cuentan con algún impedimento físico o requerimiento especial? ¿Cuál?",
    comments: "Comentarios o dudas adicionales"
  };
  const multiline = ["members", "how_heard", "experience", "special_needs", "comments"];
  function validate() {
    const newErrors = {};
    for (const field of REQUIRED_FIELDS) {
      if (!form[field].trim()) {
        newErrors[field] = "Este campo es obligatorio.";
      }
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Ingresa un correo válido.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: void 0 }));
    }
  }
  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setStatus("loading");
    setServerError("");
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) {
        setServerError(data.error ?? "Error al enviar. Intenta de nuevo.");
        setStatus("error");
      } else {
        setStatus("success");
      }
    } catch {
      setServerError("No se pudo conectar con el servidor. Intenta de nuevo.");
      setStatus("error");
    }
  }
  if (status === "success") {
    return /* @__PURE__ */ jsxs("div", { className: "success-card", children: [
      /* @__PURE__ */ jsx("div", { className: "success-icon", children: "💧" }),
      /* @__PURE__ */ jsx("h2", { className: "success-title", children: "¡Inscripción recibida!" }),
      /* @__PURE__ */ jsxs("p", { className: "success-text", children: [
        "El equipo ",
        /* @__PURE__ */ jsxs("strong", { children: [
          '"',
          form.team_name,
          '"'
        ] }),
        " ha sido registrado exitosamente para el Rally del Ciclo del Agua.",
        /* @__PURE__ */ jsx("br", {}),
        "Estaremos en contacto al correo ",
        /* @__PURE__ */ jsx("strong", { children: form.email }),
        "."
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "success-sub", children: [
        "Sábado 21 de marzo · 9:00 AM",
        /* @__PURE__ */ jsx("br", {}),
        "Juntos hacemos que cada gota cuente. 🌊"
      ] }),
      /* @__PURE__ */ jsx("style", { children: `
          .success-card {
            text-align: center;
            padding: 3rem 2rem;
            background: rgba(74, 92, 58, 0.15);
            border: 2px solid var(--moss-light);
            border-radius: 16px;
            max-width: 560px;
            margin: 0 auto;
            animation: fadeUp 0.5s ease;
          }
          .success-icon { font-size: 3.5rem; margin-bottom: 1rem; }
          .success-title {
            font-family: 'Bebas Neue', sans-serif;
            font-size: 2.2rem;
            letter-spacing: 0.08em;
            color: var(--moss-light);
            margin-bottom: 1rem;
          }
          .success-text {
            font-size: 1rem;
            line-height: 1.7;
            color: var(--fog);
            margin-bottom: 1.4rem;
          }
          .success-sub {
            font-family: 'Barlow Condensed', sans-serif;
            font-size: 0.9rem;
            letter-spacing: 0.08em;
            color: var(--dirt);
            text-transform: uppercase;
            line-height: 1.8;
          }
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(20px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        ` })
    ] });
  }
  return /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, noValidate: true, className: "reg-form", children: [
    Object.keys(labels).map((field) => {
      const isRequired = REQUIRED_FIELDS.includes(field);
      const isTextarea = multiline.includes(field);
      const error = errors[field];
      return /* @__PURE__ */ jsxs("div", { className: "field-group", children: [
        /* @__PURE__ */ jsxs("label", { htmlFor: field, className: "field-label", children: [
          labels[field],
          isRequired && /* @__PURE__ */ jsx("span", { className: "required-star", "aria-hidden": "true", children: " *" })
        ] }),
        isTextarea ? /* @__PURE__ */ jsx(
          "textarea",
          {
            id: field,
            name: field,
            value: form[field],
            onChange: handleChange,
            rows: field === "members" ? 5 : 3,
            className: `field-input field-textarea${error ? " field-error" : ""}`,
            "aria-required": isRequired,
            "aria-describedby": error ? `${field}-err` : void 0
          }
        ) : /* @__PURE__ */ jsx(
          "input",
          {
            id: field,
            name: field,
            type: field === "email" ? "email" : field === "phone" ? "tel" : "text",
            value: form[field],
            onChange: handleChange,
            className: `field-input${error ? " field-error" : ""}`,
            "aria-required": isRequired,
            "aria-describedby": error ? `${field}-err` : void 0
          }
        ),
        error && /* @__PURE__ */ jsx("span", { id: `${field}-err`, className: "error-msg", role: "alert", children: error })
      ] }, field);
    }),
    status === "error" && serverError && /* @__PURE__ */ jsxs("div", { className: "server-error", role: "alert", children: [
      "⚠️ ",
      serverError
    ] }),
    /* @__PURE__ */ jsx("button", { type: "submit", className: "submit-btn", disabled: status === "loading", children: status === "loading" ? /* @__PURE__ */ jsxs("span", { className: "btn-loading", children: [
      /* @__PURE__ */ jsx("span", { className: "spinner" }),
      "Enviando…"
    ] }) : "¡Inscribir equipo! 💧" }),
    /* @__PURE__ */ jsx("style", { children: `
        .reg-form {
          display: flex;
          flex-direction: column;
          gap: 1.4rem;
        }
        .field-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .field-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--dirt);
        }
        .required-star { color: var(--rust); }
        .field-input {
          background: rgba(42, 30, 21, 0.6);
          border: 1.5px solid rgba(196, 163, 90, 0.25);
          border-radius: 8px;
          padding: 0.7rem 1rem;
          color: var(--ash);
          font-family: 'Barlow', sans-serif;
          font-size: 0.95rem;
          transition: border-color 0.2s, box-shadow 0.2s;
          outline: none;
          width: 100%;
          resize: vertical;
        }
        .field-input::placeholder { color: rgba(210, 197, 176, 0.35); }
        .field-input:focus {
          border-color: var(--dirt);
          box-shadow: 0 0 0 3px rgba(196, 163, 90, 0.15);
        }
        .field-input.field-error {
          border-color: var(--rust);
          box-shadow: 0 0 0 3px rgba(184, 74, 30, 0.15);
        }
        .field-textarea { font-family: 'Barlow', sans-serif; }
        .error-msg {
          font-size: 0.78rem;
          color: #e07b5f;
          font-family: 'Barlow', sans-serif;
        }
        .server-error {
          background: rgba(184, 74, 30, 0.12);
          border: 1px solid rgba(184, 74, 30, 0.4);
          border-radius: 8px;
          padding: 0.8rem 1rem;
          font-size: 0.9rem;
          color: #e07b5f;
        }
        .submit-btn {
          margin-top: 0.5rem;
          padding: 0.9rem 2rem;
          background: linear-gradient(135deg, var(--dirt-dark), var(--dirt));
          color: var(--ink);
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.15rem;
          letter-spacing: 0.12em;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 16px rgba(196, 163, 90, 0.25);
          align-self: flex-start;
        }
        .submit-btn:hover:not(:disabled) {
          opacity: 0.9;
          transform: translateY(-2px);
          box-shadow: 0 6px 22px rgba(196, 163, 90, 0.35);
        }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .btn-loading { display: flex; align-items: center; gap: 0.6rem; }
        .spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(26,18,8,0.3);
          border-top-color: var(--ink);
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      ` })
  ] });
}

const $$Registro = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`<html lang="es" data-astro-cid-ohowjl3i> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Inscripción — Rally del Ciclo del Agua</title><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700&family=Barlow:wght@400;500&display=swap" rel="stylesheet">${renderHead()}</head> <body data-astro-cid-ohowjl3i> <!-- ── HEADER (standalone, sin links al marcador) ── --> <header class="nav" data-astro-cid-ohowjl3i> <div class="nav-logo" data-astro-cid-ohowjl3i>RALLY<span data-astro-cid-ohowjl3i>CUA</span></div> <div class="live-badge" data-astro-cid-ohowjl3i> <span class="live-dot" aria-hidden="true" data-astro-cid-ohowjl3i></span>
21 Mar · 9AM
</div> </header> <!-- ── MAIN ── --> <main class="page-main" data-astro-cid-ohowjl3i> <!-- Event hero --> <section class="event-hero" data-astro-cid-ohowjl3i> <div class="event-hero-inner" data-astro-cid-ohowjl3i> <p class="event-eyebrow" data-astro-cid-ohowjl3i>
Casa Universitaria del Agua · 2025
</p> <h1 class="event-title" data-astro-cid-ohowjl3i>
Rally del<br data-astro-cid-ohowjl3i><em data-astro-cid-ohowjl3i>Ciclo del Agua</em> </h1> <div class="event-divider" aria-hidden="true" data-astro-cid-ohowjl3i></div> <p class="event-tagline" data-astro-cid-ohowjl3i>
El agua es vida, y hoy más que nunca necesita de quienes
                        estén dispuestos a cuidarla.
</p> <div class="event-date-badge" data-astro-cid-ohowjl3i> <span class="date-icon" data-astro-cid-ohowjl3i>📅</span> <span data-astro-cid-ohowjl3i>Sábado <strong data-astro-cid-ohowjl3i>21 de marzo</strong> · <strong data-astro-cid-ohowjl3i>9:00 AM</strong></span> </div> <p class="event-cta-text" data-astro-cid-ohowjl3i>
Una experiencia divertida, educativa y llena de retos
                        donde aprenderás, jugarás y te convertirás en <strong data-astro-cid-ohowjl3i>GUARDIÁN</strong> del recurso más valioso del planeta.
</p> </div> <!-- Decorative drops --> <div class="drops" aria-hidden="true" data-astro-cid-ohowjl3i> <div class="drop drop-1" data-astro-cid-ohowjl3i>💧</div> <div class="drop drop-2" data-astro-cid-ohowjl3i>🌊</div> <div class="drop drop-3" data-astro-cid-ohowjl3i>💧</div> </div> </section> <!-- Registration card --> <section class="form-section" data-astro-cid-ohowjl3i> <div class="form-card" data-astro-cid-ohowjl3i> <div class="form-header" data-astro-cid-ohowjl3i> <h2 class="form-title" data-astro-cid-ohowjl3i>¡Inscríbete aquí!</h2> <p class="form-subtitle" data-astro-cid-ohowjl3i>
Juntos hacemos que cada gota cuente. Los campos
                            marcados con <span class="star" data-astro-cid-ohowjl3i>*</span> son obligatorios.
</p> </div> ${renderComponent($$result, "RegistrationForm", RegistrationForm, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/Manue/Documents/Rally-Cua/src/components/RegistrationForm", "client:component-export": "default", "data-astro-cid-ohowjl3i": true })} </div> </section> </main>  </body></html>`;
}, "C:/Users/Manue/Documents/Rally-Cua/src/pages/registro.astro", void 0);

const $$file = "C:/Users/Manue/Documents/Rally-Cua/src/pages/registro.astro";
const $$url = "/registro";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Registro,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
