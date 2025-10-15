// Commensal – Single-file React mock (3 screens: Home → Signup SMS → Verify 4-digit)
// Fix: remove duplicate LanguageSelector declaration; show selector on ALL screens.
// - Home: 3D dice, AirPods grand prize, restored prize list, casino CTA
// - Signup (SMS): SAME restaurant background, casino primary button, subtle back link
// - Verify: 4-digit code input, casino primary button, subtle back link
// - ES/EN i18n, Work Sans, casino typographic feel

import React, { useEffect, useMemo, useRef, useState } from "react";

// ---------- Inline UI primitives ----------
function Button({ className = "", style, children, ...props }: any) {
  return (
    <button
      {...props}
      style={style}
      className={
        "inline-flex items-center justify-center select-none " +
        "rounded-md px-4 py-2 font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 " +
        className
      }
    >
      {children}
    </button>
  );
}
function Card({ className = "", children }: any) {
  return <div className={"rounded-2xl border " + className}>{children}</div>;
}
function CardContent({ className = "", children }: any) {
  return <div className={className}>{children}</div>;
}
function Badge({ className = "", children, style }: any) {
  return (
    <span style={style} className={"inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold " + className}>{children}</span>
  );
}

// ---------- Config ----------
const BG_IMAGE = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1600&auto=format&fit=crop";
const DEFAULT_PRIZES = [
  { key: "airpods", title_en: "AirPods Pro 2", title_es: "AirPods Pro 2", subtitle_en: "Grand Prize · One lucky winner", subtitle_es: "Sorteo del Gran Premio · Un ganador afortunado", icon: "star" },
  { key: "huevos", title_en: "Free Huevos Rancheros", title_es: "Free Huevos Rancheros", subtitle_en: "Instant Win", subtitle_es: "Gana al Instante", icon: "gift" },
  { key: "15off", title_en: "15% Off Order (up to $20)", title_es: "15% Off Order (up to $20)", subtitle_en: "Instant Win", subtitle_es: "Gana al Instante", icon: "percent" },
];
const COUNTRIES = [
  { code: "CA", en: "Canada", es: "Canadá", dial: "+1" },
  { code: "US", en: "United States", es: "Estados Unidos", dial: "+1" },
  { code: "MX", en: "Mexico", es: "México", dial: "+52" },
];

// ---------- i18n ----------
function useI18n(langOverride?: string){
  const detectedEs = (typeof navigator !== 'undefined' ? navigator.language : 'en').toLowerCase().startsWith('es');
  const [lang, setLang] = useState(langOverride || (detectedEs ? 'es' : 'en'));
  const isEs = lang === 'es';
  const t = useMemo(()=> isEs ? {
    playToWin: "PLAY TO WIN", areYouLucky: "¿Eres suertud@?", registerCta: "Regístrate para Jugar",
    grandRaffle: "SORTEO DEL GRAN PREMIO", limited: "Entradas limitadas", oneEntry: "Gratis para jugar · Una entrada por cliente",
    taglineTop: "Brunch Vancouver | Breakfast & Brunch Restaurant", signupTitle: "Regístrate para Jugar",
    email: "Correo electrónico", phone: "Número de teléfono", country: "País",
    registerWithSMS: "Registrarse por SMS", acceptSMS: "Acepto recibir verificación y promociones de Commensal por SMS.", back: "Regresar",
    verifyTitle: "Verifica tu código", verifySubtitle: "Ingresa el código de 4 dígitos que enviamos por SMS",
    verifyCta: "Confirmar código", didntReceive: "¿No recibiste el código? Reenviar",
  } : {
    playToWin: "PLAY TO WIN", areYouLucky: "Are you lucky?", registerCta: "Register to Play",
    grandRaffle: "GRAND PRIZE RAFFLE", limited: "Limited entries", oneEntry: "Free to play · One entry per customer",
    taglineTop: "Brunch Vancouver | Breakfast & Brunch Restaurant", signupTitle: "Register to Play",
    email: "Email", phone: "Phone number", country: "Country",
    registerWithSMS: "Register via SMS", acceptSMS: "I agree to receive verification and promotions from Commensal via SMS.", back: "Back",
    verifyTitle: "Verify your code", verifySubtitle: "Enter the 4‑digit code we sent via SMS",
    verifyCta: "Confirm code", didntReceive: "Didn't get it? Resend",
  }, [isEs]);
  return {t, isEs, lang, setLang};
}

// ---------- Language Selector (single definition) ----------
function LanguageSelector({ lang, setLang }: { lang: string; setLang: (l: string) => void }) {
  return (
    <div className="absolute top-4 right-4 flex items-center gap-1 text-white/70 text-xs font-medium z-50">
      <span className="opacity-80">🌐</span>
      <select value={lang} onChange={e=>setLang((e.target as HTMLSelectElement).value)} className="bg-transparent text-white/80 border border-white/20 rounded-md px-1 py-0.5 focus:outline-none">
        <option value="en">EN</option>
        <option value="es">ES</option>
      </select>
    </div>
  );
}

// ---------- 3D Dice ----------
function Dice3DVisible(){
  const renderPips = (value:number)=>{
    const pip = (x:number,y:number,key:number)=>(
      <div key={key} style={{position:'absolute',width:'1rem',height:'1rem',background:'#e11d48',borderRadius:'50%',left:`calc(${x}% - 0.5rem)`,top:`calc(${y}% - 0.5rem)`,boxShadow:'0 0 8px rgba(255,255,255,0.9)'}} />
    );
    const positions: Record<number, [number,number][]> = {
      1:[[50,50]], 2:[[30,30],[70,70]], 3:[[30,30],[50,50],[70,70]],
      4:[[30,30],[70,30],[30,70],[70,70]], 5:[[30,30],[70,30],[50,50],[30,70],[70,70]],
      6:[[30,30],[70,30],[30,50],[70,50],[30,70],[70,70]],
    };
    return positions[value].map((p, i)=>pip(p[0],p[1],i));
  };
  return (
    <div className="relative h-56 w-56 md:h-64 md:w-64">
      {[0,1].map(i=> (
        <div key={i} className={`absolute ${i===0? 'left-4 top-2' : 'right-2 bottom-2'} dice3d-persp dice3d-shadow`}>
          <div className={`dice3d-cube ${i===0? 'dice3d-spin-1' : 'dice3d-spin-2'}`}>
            {[1,2,3,4,5,6].map(f => (
              <div key={f} className={`face face-${f}`}>
                <div className="light-glow"/>
                {renderPips(f)}
              </div>
            ))}
          </div>
        </div>
      ))}
      <style>{`
        /* Work Sans & casino typographic feel */
        @import url('https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500;600;700&display=swap');
        body, * { font-family: 'Work Sans', system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, sans-serif; }
        h1,h2,h3,h4,h5,h6 { font-weight:700; letter-spacing:.02em; text-transform:uppercase; }
        p,div,span,button,input,select { font-weight:500; }

        .dice3d-persp{ perspective:800px; }
        .dice3d-cube{ position:relative; width:7rem; height:7rem; transform-style:preserve-3d; }
        .dice3d-shadow{ filter:drop-shadow(0 10px 18px rgba(0,0,0,.35)); }
        .dice3d-spin-1{ animation:spin3d1 6s linear infinite; }
        .dice3d-spin-2{ animation:spin3d2 7s linear infinite; }
        .face{ position:absolute; width:7rem; height:7rem; background:radial-gradient(circle at 30% 30%, #ffffff 0%, #e0e0e0 70%, #bfbfbf 100%); border-radius:20%; border:2px solid #aaa; box-shadow:inset 0 0 10px rgba(0,0,0,0.3); overflow:hidden; }
        .face .light-glow { position:absolute; width:200%; height:200%; background:radial-gradient(circle at var(--x,30%) var(--y,30%), rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 60%); animation:light-move 5s linear infinite; }
        @keyframes light-move { 0% { --x: 20%; --y: 20%; } 25% { --x: 80%; --y: 25%; } 50% { --x: 70%; --y: 70%; } 75% { --x: 25%; --y: 80%; } 100% { --x: 20%; --y: 20%; } }
        .face-1{ transform:translateZ(3.5rem); }
        .face-2{ transform:rotateY(180deg) translateZ(3.5rem); }
        .face-3{ transform:rotateY(90deg) translateZ(3.5rem); }
        .face-4{ transform:rotateY(-90deg) translateZ(3.5rem); }
        .face-5{ transform:rotateX(90deg) translateZ(3.5rem); }
        .face-6{ transform:rotateX(-90deg) translateZ(3.5rem); }
        @keyframes spin3d1{0%{transform:rotateX(0deg) rotateY(0deg);}100%{transform:rotateX(360deg) rotateY(720deg);}}
        @keyframes spin3d2{0%{transform:rotateX(0deg) rotateY(0deg);}100%{transform:rotateX(-360deg) rotateY(540deg);}}
      `}</style>
    </div>
  );
}

// ---------- Signup (SMS) with SAME background ----------
function SmsSignup({ onBack, onNext, t, lang }: { onBack: () => void; onNext: () => void; t: any; lang: string; }){
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [agree, setAgree] = useState(false);

  function onSubmit(e: React.FormEvent){
    e.preventDefault();
    if(!agree){ alert(lang==='es'? 'Acepta los términos para continuar' : 'Please accept the terms to continue'); return; }
    onNext();
  }

  return (
    <div className="relative min-h-screen w-full text-white">
      <div className="absolute inset-0 -z-10">
        <img src={BG_IMAGE} alt="Restaurant background" className="w-full h-full object-cover"/>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/80"/>
      </div>

      <LanguageSelector lang={lang} setLang={setLangFromChild}/>

      <div className="w-full min-h-screen flex items-start justify-center p-4">
        <div className="w-full max-w-xl rounded-3xl bg-white/10 backdrop-blur-xl ring-1 ring-white/15 shadow-2xl p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <img src={BG_IMAGE} alt="Commensal" className="size-12 rounded-xl object-cover"/>
            <div>
              <div className="text-lg font-semibold tracking-wide">Commensal</div>
              <div className="text-xs text-white/70">1147 Granville St, Vancouver</div>
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold mb-2 tracking-wide uppercase">{t.signupTitle}</h2>
          <p className="text-sm text-white/80 mb-6">{t.oneEntry}</p>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">{t.email}</label>
              <input type="email" value={email} onChange={e=>setEmail((e.target as HTMLInputElement).value)} placeholder="you@example.com" className="mt-1 w-full rounded-xl bg-white/90 text-black px-4 py-3 outline-none ring-2 ring-transparent focus:ring-emerald-400"/>
            </div>
            <div>
              <label className="text-sm font-medium">{t.phone}</label>
              <div className="mt-1 flex gap-2">
                <select value={country.code} onChange={e=>setCountry(COUNTRIES.find(c=>c.code===(e.target as HTMLSelectElement).value) || COUNTRIES[0])} className="min-w-40 rounded-xl bg-white/90 text-black px-3 py-3 outline-none ring-2 ring-transparent focus:ring-emerald-400">
                  {COUNTRIES.map(c => (<option key={c.code} value={c.code}>{lang==='es'?c.es:c.en} ({c.dial})</option>))}
                </select>
                <input type="tel" value={phone} onChange={e=>setPhone((e.target as HTMLInputElement).value)} placeholder={lang==='es'?"Tu número":"Your number"} className="flex-1 rounded-xl bg-white/90 text-black px-4 py-3 outline-none ring-2 ring-transparent focus:ring-emerald-400"/>
              </div>
            </div>
            <label className="flex items-start gap-3 text-sm">
              <input type="checkbox" checked={agree} onChange={e=>setAgree((e.target as HTMLInputElement).checked)} className="mt-1"/>
              <span>{t.acceptSMS}</span>
            </label>
            <div className="flex flex-col items-center gap-3">
              <Button type="submit" className="w-full rounded-2xl py-4 text-base font-semibold hover:scale-105 transition-transform duration-300" style={{background:'linear-gradient(135deg,#E67E22,#C0392B,#F33912)',color:'white',boxShadow:'0 0 20px rgba(230,126,34,0.6),0 0 10px rgba(192,57,43,0.5)'}}>{t.registerWithSMS}</Button>
              <button type="button" onClick={onBack} className="text-xs text-white/50 hover:text-white/80 underline underline-offset-2 transition-all">← {t.back}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  function setLangFromChild(l:string){
    // This function will be replaced at App level via prop binding
  }
}

// ---------- Verify Code (4-digit) ----------
function VerifyCode({ onBack, onConfirm, t, lang, setLang }: { onBack: () => void; onConfirm: (code: string)=>void; t: any; lang: string; setLang: (l:string)=>void; }){
  const [digits, setDigits] = useState(["", "", "", ""]);
  const inputs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  function handleChange(i:number, val:string){
    const v = val.replace(/\D/g, "").slice(0,1);
    const next = [...digits];
    next[i] = v;
    setDigits(next);
    if(v && i < 3){ inputs[i+1].current?.focus(); }
  }
  function handleKeyDown(i:number, e: React.KeyboardEvent<HTMLInputElement>){
    if(e.key === 'Backspace' && !digits[i] && i>0){ inputs[i-1].current?.focus(); }
  }
  function submit(e: React.FormEvent){
    e.preventDefault();
    const code = digits.join("");
    if(code.length < 4){ alert(lang==='es'? 'Ingresa los 4 dígitos' : 'Enter all 4 digits'); return; }
    onConfirm(code);
  }

  return (
    <div className="relative min-h-screen w-full text-white">
      <div className="absolute inset-0 -z-10">
        <img src={BG_IMAGE} alt="Restaurant background" className="w-full h-full object-cover"/>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/80"/>
      </div>

      <LanguageSelector lang={lang} setLang={setLang}/>

      <div className="w-full min-h-screen flex items-start justify-center p-4">
        <div className="w-full max-w-md rounded-3xl bg-white/10 backdrop-blur-xl ring-1 ring-white/15 shadow-2xl p-6 md:p-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 tracking-wide uppercase">{t.verifyTitle}</h2>
          <p className="text-sm text-white/80 mb-6">{t.verifySubtitle}</p>
          <form onSubmit={submit} className="space-y-6">
            <div className="flex justify-center gap-3">
              {digits.map((d, i)=> (
                <input
                  key={i}
                  ref={inputs[i]}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={d}
                  onChange={e=>handleChange(i, (e.target as HTMLInputElement).value)}
                  onKeyDown={e=>handleKeyDown(i, e)}
                  className="w-14 h-16 md:w-16 md:h-20 text-center text-2xl md:text-3xl rounded-2xl bg-white/90 text-black ring-2 ring-transparent focus:ring-emerald-400"
                />
              ))}
            </div>
            <div className="flex flex-col items-center gap-3">
              <Button type="submit" className="w-full rounded-2xl py-4 text-base font-semibold hover:scale-105 transition-transform duration-300" style={{background:'linear-gradient(135deg,#E67E22,#C0392B,#F33912)',color:'white',boxShadow:'0 0 20px rgba(230,126,34,0.6),0 0 10px rgba(192,57,43,0.5)'}}>{t.verifyCta}</Button>
              <button type="button" onClick={onBack} className="text-xs text-white/50 hover:text-white/80 underline underline-offset-2 transition-all">← {t.back}</button>
              <button type="button" className="text-xs text-white/50 hover:text-white/80 underline underline-offset-2 transition-all">{t.didntReceive}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// ---------- App ----------
export default function CommensalMock(){
  const {t,isEs,lang,setLang}=useI18n();
  const [stage, setStage] = useState<'home'|'signup'|'verify'>("home");

  // Smoke tests
  useEffect(()=>{
    console.assert(typeof Dice3DVisible === 'function', 'Dice3DVisible defined');
    console.assert(typeof LanguageSelector === 'function', 'LanguageSelector defined');
  },[]);

  if (stage === 'signup') return (
    <div className="relative min-h-screen text-white overflow-x-hidden pb-10">
      <LanguageSelector lang={lang} setLang={setLang}/>
      <SmsSignup onBack={()=>setStage('home')} onNext={()=>setStage('verify')} t={t} lang={lang}/>
    </div>
  );

  if (stage === 'verify') return (
    <div className="relative min-h-screen text-white overflow-x-hidden pb-10">
      <VerifyCode onBack={()=>setStage('signup')} onConfirm={(code)=>{ console.log('Code entered:', code); alert((isEs? 'Código verificado: ' : 'Code verified: ')+code); setStage('home'); }} t={t} lang={lang} setLang={setLang}/>
    </div>
  );

  // Home
  return (
    <div className="relative min-h-screen text-white overflow-x-hidden pb-40">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <img src={BG_IMAGE} alt="Restaurant background" className="w-full h-full object-cover"/>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/80"/>
      </div>

      {/* Language Selector */}
      <LanguageSelector lang={lang} setLang={setLang}/>

      {/* Header */}
      <header className="pt-10 flex flex-col items-center gap-2">
        <div className="text-sm uppercase tracking-wide text-white/80">{t.taglineTop}</div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-wide uppercase">{t.playToWin}</h1>
        <div className="text-base text-white/80">{t.areYouLucky}</div>
      </header>

      {/* Dice */}
      <section className="flex items-center justify-center mt-6"><Dice3DVisible/></section>

      {/* Grand prize card */}
      <section className="mx-auto mt-6 w-full max-w-3xl px-4 text-center">
        <Card className="bg-black/60 text-white border-white/10">
          <CardContent className="p-5 md:p-6 flex items-center justify-between gap-4">
            <Badge className="shadow-lg" style={{background:'linear-gradient(145deg,#27AE60,#1E8449)',color:'white',boxShadow:'0 0 15px #27AE60aa'}}>{t.grandRaffle}</Badge>
            <div className="text-xl md:text-2xl font-bold tracking-wide">{isEs?DEFAULT_PRIZES[0].title_es:DEFAULT_PRIZES[0].title_en}</div>
            <div className="text-xs text-white/70">{t.limited}</div>
          </CardContent>
        </Card>
      </section>

      {/* Prize list */}
      <section className="mx-auto mt-5 grid w-full max-w-3xl grid-cols-1 gap-3 px-4">
        {DEFAULT_PRIZES.slice(1).map(p => (
          <div key={p.key} className="flex items-center justify-between rounded-3xl bg-black/55 px-5 py-4 ring-1 ring-white/10 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
                <span className="text-white/80">★</span>
              </div>
              <div>
                <div className="font-semibold">{isEs ? p.title_es : p.title_en}</div>
                <div className="text-xs text-white/70">{isEs ? p.subtitle_es : p.subtitle_en}</div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="mx-auto mt-6 mb-24 w-full max-w-3xl px-4">
        <div className="rounded-3xl bg-black/55 p-5 ring-1 ring-white/10 text-center">
          <Button onClick={()=>setStage('signup')} className="w-full rounded-2xl py-6 text-base font-semibold hover:scale-105 transition-transform duration-300 tracking-wide uppercase" style={{background:'linear-gradient(135deg,#E67E22,#C0392B,#F33912)',color:'white',boxShadow:'0 0 20px rgba(230,126,34,0.6),0 0 10px rgba(192,57,43,0.5)'}}>{t.registerCta} →</Button>
          <div className="mt-2 text-xs text-white/70">{t.oneEntry}</div>
        </div>
      </section>
    </div>
  );
}

