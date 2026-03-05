import{j as r}from"./jsx-runtime.D_zvdyIk.js";import{r as l}from"./index.DiEladB3.js";const y={team_name:"",representative:"",phone:"",email:"",members:"",how_heard:"",institution:"",experience:"",special_needs:"",comments:""},f=["team_name","representative","phone","email","members","how_heard","institution","experience","special_needs"];function N(){const[o,x]=l.useState(y),[d,m]=l.useState({}),[n,i]=l.useState("idle"),[p,c]=l.useState(""),u={team_name:"Nombre del equipo",representative:"Nombre del representante",phone:"Número de teléfono",email:"Correo electrónico",members:"Nombres completos de los integrantes (comenzando por el representante)",how_heard:"¿Cómo se enteraron de este rally?",institution:"Institución educativa o procedencia",experience:"¿Tienen experiencia en rallies o actividades similares? ¿Cuáles?",special_needs:"¿Cuentan con algún impedimento físico o requerimiento especial? ¿Cuál?",comments:"Comentarios o dudas adicionales"},g=["members","how_heard","experience","special_needs","comments"];function h(){const e={};for(const s of f)o[s].trim()||(e[s]="Este campo es obligatorio.");return o.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(o.email)&&(e.email="Ingresa un correo válido."),m(e),Object.keys(e).length===0}function b(e){const{name:s,value:t}=e.target;x(a=>({...a,[s]:t})),d[s]&&m(a=>({...a,[s]:void 0}))}async function v(e){if(e.preventDefault(),!!h()){i("loading"),c("");try{const s=await fetch("/api/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)}),t=await s.json();s.ok?i("success"):(c(t.error??"Error al enviar. Intenta de nuevo."),i("error"))}catch{c("No se pudo conectar con el servidor. Intenta de nuevo."),i("error")}}}return n==="success"?r.jsxs("div",{className:"success-card",children:[r.jsx("div",{className:"success-icon",children:"💧"}),r.jsx("h2",{className:"success-title",children:"¡Inscripción recibida!"}),r.jsxs("p",{className:"success-text",children:["El equipo ",r.jsxs("strong",{children:['"',o.team_name,'"']})," ha sido registrado exitosamente para el Rally del Ciclo del Agua.",r.jsx("br",{}),"Estaremos en contacto al correo ",r.jsx("strong",{children:o.email}),"."]}),r.jsxs("p",{className:"success-sub",children:["Sábado 21 de marzo · 9:00 AM",r.jsx("br",{}),"Juntos hacemos que cada gota cuente. 🌊"]}),r.jsx("style",{children:`
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
        `})]}):r.jsxs("form",{onSubmit:v,noValidate:!0,className:"reg-form",children:[Object.keys(u).map(e=>{const s=f.includes(e),t=g.includes(e),a=d[e];return r.jsxs("div",{className:"field-group",children:[r.jsxs("label",{htmlFor:e,className:"field-label",children:[u[e],s&&r.jsx("span",{className:"required-star","aria-hidden":"true",children:" *"})]}),t?r.jsx("textarea",{id:e,name:e,value:o[e],onChange:b,rows:e==="members"?5:3,className:`field-input field-textarea${a?" field-error":""}`,"aria-required":s,"aria-describedby":a?`${e}-err`:void 0}):r.jsx("input",{id:e,name:e,type:e==="email"?"email":e==="phone"?"tel":"text",value:o[e],onChange:b,className:`field-input${a?" field-error":""}`,"aria-required":s,"aria-describedby":a?`${e}-err`:void 0}),a&&r.jsx("span",{id:`${e}-err`,className:"error-msg",role:"alert",children:a})]},e)}),n==="error"&&p&&r.jsxs("div",{className:"server-error",role:"alert",children:["⚠️ ",p]}),r.jsx("button",{type:"submit",className:"submit-btn",disabled:n==="loading",children:n==="loading"?r.jsxs("span",{className:"btn-loading",children:[r.jsx("span",{className:"spinner"}),"Enviando…"]}):"¡Inscribir equipo! 💧"}),r.jsx("style",{children:`
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
      `})]})}export{N as default};
