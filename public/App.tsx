// Commensal – Single-file React TSX (3 screens: Home → Signup SMS → Verify 4-digit)
// Fix for build error: remove raw HTML from this TSX file. Keep ONLY React/TSX code here.
// Use a separate index.html (served by Vite/Node) to include <div id="root"> and load main.tsx.

import React, { useEffect, useMemo, useRef, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom";

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
const DEFAULT_BG_IMAGE = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1600&auto=format&fit=crop";

type HomeConfig = {
  title: string;
  description: string;
  address: string;
  backgroundImageUrl: string;
  secondaryImageUrl: string;
  prizes: string[];
  longDescription: string;
  websiteUrl: string;
  instagramUrl: string;
  platesCarousel: string[];
  collageImages: string[];
  currentPoints: number;
  totalPoints: number;
  bigPrize: {
    name: string;
    description: string;
    imageUrl: string;
  };
  termsOfService: string;
};

const COUNTRIES = [
  { code: "CA", en: "Canada", es: "Canadá", dial: "+1", flag: "🇨🇦" },
  { code: "US", en: "United States", es: "Estados Unidos", dial: "+1", flag: "🇺🇸" },
  { code: "MX", en: "Mexico", es: "México", dial: "+52", flag: "🇲🇽" },
  { code: "CN", en: "China", es: "China", dial: "+86", flag: "🇨🇳" },
  { code: "IN", en: "India", es: "India", dial: "+91", flag: "🇮🇳" },
  { code: "PH", en: "Philippines", es: "Filipinas", dial: "+63", flag: "🇵🇭" },
  { code: "GB", en: "United Kingdom", es: "Reino Unido", dial: "+44", flag: "🇬🇧" },
  { code: "AU", en: "Australia", es: "Australia", dial: "+61", flag: "🇦🇺" },
  { code: "JP", en: "Japan", es: "Japón", dial: "+81", flag: "🇯🇵" },
  { code: "KR", en: "South Korea", es: "Corea del Sur", dial: "+82", flag: "🇰🇷" },
  { code: "FR", en: "France", es: "Francia", dial: "+33", flag: "🇫🇷" },
  { code: "DE", en: "Germany", es: "Alemania", dial: "+49", flag: "🇩🇪" },
  { code: "BR", en: "Brazil", es: "Brasil", dial: "+55", flag: "🇧🇷" },
];

// ---------- i18n ----------
function useI18n(langOverride?: string){
  const detectedEs = (typeof navigator !== 'undefined' ? navigator.language : 'en').toLowerCase().startsWith('es');
  const [lang, setLang] = useState(langOverride || (detectedEs ? 'es' : 'en'));
  const isEs = lang === 'es';
  const t = useMemo(()=> isEs ? {
    playToWin: "PLAY TO WIN", areYouLucky: "¿Eres suertud@?", registerCta: "Regístrate para Jugar",
    skipRegistrationCta: "Ir directo a la experiencia",
    grandRaffle: "SORTEO DEL GRAN PREMIO", limited: "Entradas limitadas", oneEntry: "Gratis para jugar · Una entrada por cliente",
    signupTitle: "Regístrate para Jugar",
    email: "Correo electrónico", phone: "Número de teléfono", country: "País",
    registerWithSMS: "Registrarse por SMS", acceptSMS: "Acepto recibir verificación y promociones de Commensal por SMS.", back: "Regresar",
    verifyTitle: "Verifica tu código", verifySubtitle: "Ingresa el código de 4 dígitos que enviamos por SMS",
    verifyCta: "Confirmar código", didntReceive: "¿No recibiste el código? Reenviar",
  } : {
    playToWin: "PLAY TO WIN", areYouLucky: "Are you lucky?", registerCta: "Register to Play",
    skipRegistrationCta: "Jump straight to experience",
    grandRaffle: "GRAND PRIZE RAFFLE", limited: "Limited entries", oneEntry: "Free to play · One entry per customer",
    signupTitle: "Register to Play",
    email: "Email", phone: "Phone number", country: "Country",
    registerWithSMS: "Register via SMS", acceptSMS: "I agree to receive verification and promotions from Commensal via SMS.", back: "Back",
    verifyTitle: "Verify your code", verifySubtitle: "Enter the 4-digit code we sent via SMS",
    verifyCta: "Confirm code", didntReceive: "Didn't get it? Resend",
  }, [isEs]);
  return {t, isEs, lang, setLang};
}

// ---------- Language Selector (single definition) ----------
function LanguageSelector({ lang, setLang, className = "absolute top-4 right-4 flex items-center gap-1 text-white/70 text-xs font-medium z-50" }: { lang: string; setLang: (l: string) => void; className?: string }) {
  return (
    <div className={className}>
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
function SmsSignup({ onBack, onNext, t, lang, setLang, config }: { onBack: () => void; onNext: () => void; t: any; lang: string; setLang: (l: string) => void; config: HomeConfig; }){
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [agree, setAgree] = useState(false);
  const backgroundImage = config.backgroundImageUrl || DEFAULT_BG_IMAGE;

  function onSubmit(e: React.FormEvent){
    e.preventDefault();
    if(!agree){ alert(lang==='es'? 'Acepta los términos para continuar' : 'Please accept the terms to continue'); return; }
    onNext();
  }

  return (
    <div className="relative min-h-screen w-full text-white">
      <div className="absolute inset-0 -z-10">
        <img src={backgroundImage} alt="Restaurant background" className="w-full h-full object-cover"/>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/80"/>
      </div>

      <LanguageSelector lang={lang} setLang={setLang}/>

      <div className="w-full min-h-screen flex items-start justify-center p-4">
        <div className="w-full max-w-xl rounded-3xl bg-white/10 backdrop-blur-xl ring-1 ring-white/15 shadow-2xl p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <img src={config.secondaryImageUrl || backgroundImage} alt={config.title} className="size-12 rounded-xl object-cover"/>
            <div>
              <div className="text-lg font-semibold tracking-wide">{config.title}</div>
              <div className="text-xs text-white/70">{config.address}</div>
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
                  {COUNTRIES.map(c => (
                    <option key={c.code} value={c.code} aria-label={(lang==='es'?c.es:c.en) + ' ' + c.dial}>
                      {`${c.flag} ${c.dial}`}
                    </option>
                  ))}
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
}

// ---------- Verify Code (4-digit) ----------
function VerifyCode({ onBack, onConfirm, t, lang, setLang, backgroundImage }: { onBack: () => void; onConfirm: (code: string)=>void; t: any; lang: string; setLang: (l:string)=>void; backgroundImage: string; }){
  const [digits, setDigits] = useState(["", "", "", ""]);
  const inputs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];
  const background = backgroundImage || DEFAULT_BG_IMAGE;

  function handleChange(i:number, val:string){
    const v = val.replace(/\D/g, "").slice(0,1);
    const next = [...digits]; next[i] = v; setDigits(next);
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
        <img src={background} alt="Restaurant background" className="w-full h-full object-cover"/>
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
                <input key={i} ref={inputs[i]} inputMode="numeric" pattern="[0-9]*" maxLength={1}
                  value={d} onChange={e=>handleChange(i, (e.target as HTMLInputElement).value)} onKeyDown={e=>handleKeyDown(i, e)}
                  className="w-14 h-16 md:w-16 md:h-20 text-center text-2xl md:text-3xl rounded-2xl bg-white/90 text-black ring-2 ring-transparent focus:ring-emerald-400" />
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
function HomeScreen({ t, lang, setLang, config }: { t: any; lang: string; setLang: (l: string) => void; config: HomeConfig }) {
  const navigate = useNavigate();
  const tagline = `${config.title} | ${config.description}`;
  const backgroundImage = config.backgroundImageUrl || DEFAULT_BG_IMAGE;

  return (
    <div className="relative min-h-screen text-white overflow-x-hidden pb-40">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <img src={backgroundImage} alt="Restaurant background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/80" />
      </div>

      {/* Language Selector */}
      <LanguageSelector lang={lang} setLang={setLang} />

      {/* Header */}
      <header className="pt-10 flex flex-col items-center gap-2">
        <div className="text-sm uppercase tracking-wide text-white/80">{tagline}</div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-wide uppercase">{t.playToWin}</h1>
        <div className="text-base text-white/80">{t.areYouLucky}</div>
      </header>

      {/* Dice */}
      <section className="flex items-center justify-center mt-6">
        <Dice3DVisible />
      </section>

      {/* Grand prize card */}
      <section className="mx-auto mt-6 w-full max-w-3xl px-4 text-center">
        <Card className="bg-black/60 text-white border-white/10">
          <CardContent className="p-5 md:p-6 flex items-center justify-between gap-4">
            <Badge className="shadow-lg" style={{ background: "linear-gradient(145deg,#27AE60,#1E8449)", color: "white", boxShadow: "0 0 15px #27AE60aa" }}>
              {t.grandRaffle}
            </Badge>
            <div className="text-xl md:text-2xl font-bold tracking-wide">{config.bigPrize.name}</div>
            <div className="text-xs text-white/70">{t.limited}</div>
          </CardContent>
        </Card>
      </section>

      {/* Prize list */}
      <section className="mx-auto mt-5 grid w-full max-w-3xl grid-cols-1 gap-3 px-4">
        {config.prizes.map((prize, index) => (
          <div key={`${prize}-${index}`} className="flex items-center justify-between rounded-3xl bg-black/55 px-5 py-4 ring-1 ring-white/10 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
                <span className="text-white/80">★</span>
              </div>
              <div>
                <div className="font-semibold">{prize}</div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="mx-auto mt-6 mb-24 w-full max-w-3xl px-4">
        <div className="rounded-3xl bg-black/55 p-5 ring-1 ring-white/10 text-center">
          <div className="flex flex-col gap-3">
            <Button
              onClick={() => navigate("/signup")}
              className="w-full rounded-2xl py-6 text-base font-semibold hover:scale-105 transition-transform duration-300 tracking-wide uppercase"
              style={{ background: "linear-gradient(135deg,#E67E22,#C0392B,#F33912)", color: "white", boxShadow: "0 0 20px rgba(230,126,34,0.6),0 0 10px rgba(192,57,43,0.5)" }}
            >
              {t.registerCta} →
            </Button>
            <Button
              onClick={() => navigate("/homepage-registered")}
              className="w-full rounded-2xl border border-white/30 bg-white/10 py-4 text-sm font-semibold uppercase tracking-wide text-white/90 transition-transform duration-300 hover:scale-105"
            >
              {t.skipRegistrationCta}
            </Button>
          </div>
          <div className="mt-3 text-xs text-white/70">{t.oneEntry}</div>
        </div>
      </section>
    </div>
  );
}

function SignupRoute({ t, lang, setLang, config }: { t: any; lang: string; setLang: (l: string) => void; config: HomeConfig }) {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen text-white overflow-x-hidden pb-10">
      <SmsSignup onBack={() => navigate("/")} onNext={() => navigate("/verify")} t={t} lang={lang} setLang={setLang} config={config} />
    </div>
  );
}

function RegisteredHomepage({ config, lang, setLang, isEs }: { config: HomeConfig; lang: string; setLang: (l: string) => void; isEs: boolean }) {
  const [selectedPrize, setSelectedPrize] = useState<string>("");
  const expiryDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  }, []);
  const topBackground = config.backgroundImageUrl || DEFAULT_BG_IMAGE;
  const progressPercent = useMemo(() => {
    if (config.totalPoints <= 0) {
      return 0;
    }
    const ratio = Math.min(1, Math.max(0, config.currentPoints / config.totalPoints));
    return Math.round(ratio * 100);
  }, [config.currentPoints, config.totalPoints]);
  const copy = useMemo(
    () =>
      isEs
        ? {
            platesTitle: "Platos destacados",
            playToWinTitle: "Juega para ganar",
            redeemBefore: "Canjea antes de que expire:",
            redeemButton: "Canjear premio",
            scoreTitle: "Tu puntaje",
            outOf: "de",
            goalLabel: "Meta",
            bigPrizeLabel: "Gran premio",
            getMoreChances: "Obtén más oportunidades",
            followInstagram: "Síguenos en Instagram (+1)",
            visitWebsite: "Visita nuestro sitio web (+1)",
            recommendFriend: "Recomienda a un amig@ (+10)",
            menuTitle: "Platos del menú",
            termsTitle: "Términos del servicio",
            websiteCta: "Visitar sitio web",
            pointsLabel: "puntos",
          }
        : {
            platesTitle: "Signature plates",
            playToWinTitle: "Play to win prize",
            redeemBefore: "Redeem before it expires:",
            redeemButton: "Redeem prize",
            scoreTitle: "Your score",
            outOf: "of",
            goalLabel: "Goal",
            bigPrizeLabel: "Big prize",
            getMoreChances: "Get more chances",
            followInstagram: "Follow us on Instagram (+1)",
            visitWebsite: "Visit our website (+1)",
            recommendFriend: "Recommend to a friend (+10)",
            menuTitle: "Menu plates",
            termsTitle: "Terms of service",
            websiteCta: "Visit website",
            pointsLabel: "points",
          },
    [isEs]
  );

  useEffect(() => {
    if (!config.prizes.length) {
      setSelectedPrize("");
      return;
    }
    const randomIndex = Math.floor(Math.random() * config.prizes.length);
    setSelectedPrize(config.prizes[randomIndex]);
  }, [config.prizes]);

  const ActionButton = ({ children, href }: { children: React.ReactNode; href?: string }) => {
    const className =
      "inline-flex items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold uppercase tracking-wide transition-transform duration-300 hover:scale-[1.03]" +
      " bg-gradient-to-r from-amber-500 via-rose-500 to-red-500 text-white shadow-[0_0_18px_rgba(255,145,0,0.4)]";
    if (href) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
          {children}
        </a>
      );
    }
    return (
      <button type="button" className={className}>
        {children}
      </button>
    );
  };

  return (
    <div className="relative min-h-screen text-white overflow-x-hidden pb-20">
      <div className="absolute inset-0 -z-10">
        <img src={topBackground} alt={`${config.title} background`} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/80" />
      </div>

      <div className="absolute top-4 right-4 flex items-center gap-3 z-50">
        <a
          href={config.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex size-11 items-center justify-center rounded-full bg-white/15 backdrop-blur text-white transition-transform duration-300 hover:scale-105 hover:bg-white/25"
          aria-label="Instagram"
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-5">
            <path
              d="M7.75 2.5h8.5A5.75 5.75 0 0 1 22 8.25v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.75v-8.5A5.75 5.75 0 0 1 7.75 2.5Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M16.5 7.5h.01M12 9.25A2.75 2.75 0 1 0 12 14.75 2.75 2.75 0 0 0 12 9.25Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
        <LanguageSelector lang={lang} setLang={setLang} className="relative flex items-center gap-1 text-white/70 text-xs font-medium" />
      </div>

      <section className="px-4 md:px-10 pt-16 pb-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <div className="text-sm uppercase tracking-[0.3em] text-white/60">{config.address}</div>
            <h1 className="mt-3 text-4xl md:text-5xl font-extrabold tracking-wide uppercase">{config.title}</h1>
            <p className="mt-2 text-lg text-white/80">{config.description}</p>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/80">{config.longDescription}</p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <a
                href={config.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-red-500 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-[0_0_18px_rgba(255,145,0,0.4)] transition-transform duration-300 hover:scale-105"
              >
                {copy.websiteCta}
              </a>
            </div>
          </div>
          <div className="md:self-center">
            <div className="rounded-3xl bg-white/10 p-4 ring-1 ring-white/15 shadow-lg backdrop-blur">
              <div className="text-xs uppercase tracking-[0.4em] text-white/50">{copy.playToWinTitle}</div>
              <div className="mt-3 text-lg font-semibold text-white/90">{selectedPrize || config.bigPrize.name}</div>
              <div className="mt-2 text-xs text-white/60">
                {copy.redeemBefore} {expiryDate}
              </div>
              <div className="mt-5">
                <Button className="w-full rounded-2xl py-3 text-sm font-semibold uppercase tracking-wide" style={{ background: "linear-gradient(135deg,#F97316,#EF4444,#F43F5E)", color: "white", boxShadow: "0 0 20px rgba(249,115,22,0.4)" }}>
                  {copy.redeemButton}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 md:px-10">
        <h2 className="text-lg font-semibold uppercase tracking-[0.4em] text-white/60">{copy.platesTitle}</h2>
        <div className="mt-5 flex gap-5 overflow-x-auto pb-4">
          {config.platesCarousel.map((url, index) => (
            <div key={`${url}-${index}`} className="relative min-w-[220px] overflow-hidden rounded-3xl bg-white/10 ring-1 ring-white/15 shadow-lg">
              <img src={url} alt={`Plate ${index + 1}`} className="h-48 w-full object-cover" />
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 md:px-10 mt-12">
        <div className="rounded-3xl bg-black/60 p-6 md:p-8 ring-1 ring-white/10 shadow-xl backdrop-blur">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <div className="text-sm uppercase tracking-[0.5em] text-amber-300 drop-shadow">{copy.scoreTitle}</div>
              <div className="mt-4 flex items-end gap-4">
                <div className="flex items-center gap-2 rounded-2xl border border-amber-400/40 bg-black/60 px-4 py-3 font-mono text-4xl md:text-5xl tracking-[0.4em] text-amber-200 shadow-inner shadow-amber-500/20">
                  {config.currentPoints.toString().padStart(4, "0")}
                </div>
                <div className="pb-2 text-sm uppercase text-white/70">
                  {copy.outOf} {config.totalPoints.toLocaleString()} {copy.pointsLabel}
                </div>
              </div>
              <div className="mt-5 h-3 w-full overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-gradient-to-r from-amber-400 via-rose-500 to-red-500 transition-all" style={{ width: `${progressPercent}%` }} />
              </div>
              <div className="mt-3 text-xs uppercase tracking-[0.3em] text-white/50">
                {copy.goalLabel}: {config.totalPoints.toLocaleString()} {copy.pointsLabel}
              </div>
            </div>
            <div className="flex flex-col items-center gap-4 text-center lg:w-72">
              <div className="relative">
                <div className="absolute -inset-2 rounded-full bg-amber-400/20 blur-2xl" aria-hidden="true" />
                <img src={config.bigPrize.imageUrl} alt={config.bigPrize.name} className="relative size-40 rounded-full object-cover ring-4 ring-amber-400/70" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.5em] text-white/50">{copy.bigPrizeLabel}</div>
                <div className="mt-2 text-xl font-semibold uppercase tracking-wide text-white">{config.bigPrize.name}</div>
                <p className="mt-2 text-sm text-white/70">{config.bigPrize.description}</p>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <div className="text-xs uppercase tracking-[0.4em] text-white/50">{copy.getMoreChances}</div>
            <div className="mt-4 flex flex-wrap gap-3">
              <ActionButton href={config.instagramUrl}>{copy.followInstagram}</ActionButton>
              <ActionButton href={config.websiteUrl}>{copy.visitWebsite}</ActionButton>
              <ActionButton>{copy.recommendFriend}</ActionButton>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 md:px-10 mt-12">
        <h2 className="text-lg font-semibold uppercase tracking-[0.4em] text-white/60">{copy.menuTitle}</h2>
        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
          {config.collageImages.map((url, index) => {
            const isLarge = index % 5 === 0;
            return (
              <div
                key={`${url}-${index}`}
                className={`relative overflow-hidden rounded-3xl bg-white/10 ring-1 ring-white/15 shadow-lg ${
                  isLarge ? "col-span-2 row-span-2 h-64 md:h-80" : "h-32 md:h-48"
                }`}
              >
                <img src={url} alt={`Menu item ${index + 1}`} className="h-full w-full object-cover" />
              </div>
            );
          })}
        </div>
      </section>

      <section className="px-4 md:px-10 mt-16">
        <div className="rounded-3xl bg-black/70 p-6 md:p-8 ring-1 ring-white/10 shadow-xl backdrop-blur">
          <h2 className="text-base font-semibold uppercase tracking-[0.4em] text-white/60">{copy.termsTitle}</h2>
          <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-white/70">{config.termsOfService}</p>
        </div>
      </section>
    </div>
  );
}

function VerifyRoute({ t, lang, setLang, isEs, config }: { t: any; lang: string; setLang: (l: string) => void; isEs: boolean; config: HomeConfig }) {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen text-white overflow-x-hidden pb-10">
      <VerifyCode
        onBack={() => navigate("/signup")}
        onConfirm={(code) => {
          console.log(isEs ? "Código verificado:" : "Code verified:", code);
          navigate("/homepage-registered");
        }}
        t={t}
        lang={lang}
        setLang={setLang}
        backgroundImage={config.backgroundImageUrl || DEFAULT_BG_IMAGE}
      />
    </div>
  );
}

export default function CommensalMock() {
  const { t, isEs, lang, setLang } = useI18n();
  const [config, setConfig] = useState<HomeConfig | null>(null);
  const [configError, setConfigError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function loadConfig() {
      try {
        const response = await fetch("/api/home", { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Failed to load home config: ${response.status}`);
        }
        const payload = (await response.json()) as Partial<HomeConfig> & {
          bigPrize?: Partial<HomeConfig["bigPrize"]>;
          featuredPrize?: unknown;
        };
        const sanitizeList = (value: unknown): string[] =>
          Array.isArray(value)
            ? value
                .map((item) => `${item ?? ""}`.trim())
                .filter((item) => item.length > 0)
            : [];
        const normalizedPrizes = sanitizeList(payload.prizes);
        const platesCarousel = sanitizeList(payload.platesCarousel);
        const collageImages = sanitizeList(payload.collageImages);
        const backgroundImageUrl = `${payload.backgroundImageUrl ?? ""}`.trim() || DEFAULT_BG_IMAGE;
        const secondaryImageUrl = `${payload.secondaryImageUrl ?? ""}`.trim() || backgroundImageUrl;
        const bigPrizePayload = payload.bigPrize ?? {};
        const normalizedBigPrize = {
          name: `${bigPrizePayload?.name ?? ""}`.trim(),
          description: `${bigPrizePayload?.description ?? ""}`.trim(),
          imageUrl: `${bigPrizePayload?.imageUrl ?? ""}`.trim(),
        };
        const fallbackFeaturedName = `${payload.featuredPrize ?? ""}`.trim();
        if (normalizedBigPrize.name.length === 0 && fallbackFeaturedName.length > 0) {
          normalizedBigPrize.name = fallbackFeaturedName;
        }
        const normalized: HomeConfig = {
          title: `${payload.title ?? ""}`.trim(),
          description: `${payload.description ?? ""}`.trim(),
          address: `${payload.address ?? ""}`.trim(),
          backgroundImageUrl,
          secondaryImageUrl,
          prizes: normalizedPrizes,
          longDescription: `${payload.longDescription ?? ""}`.trim(),
          websiteUrl: `${payload.websiteUrl ?? ""}`.trim(),
          instagramUrl: `${payload.instagramUrl ?? ""}`.trim(),
          platesCarousel,
          collageImages,
          currentPoints: Number.isFinite(Number(payload.currentPoints)) ? Math.max(0, Number(payload.currentPoints)) : 0,
          totalPoints: Number.isFinite(Number(payload.totalPoints)) ? Math.max(0, Number(payload.totalPoints)) : 0,
          bigPrize: normalizedBigPrize,
          termsOfService: `${payload.termsOfService ?? ""}`.trim(),
        };

        const hasRequiredFields =
          normalized.title.length > 0 &&
          normalized.description.length > 0 &&
          normalized.address.length > 0 &&
          normalized.prizes.length > 0 &&
          normalized.longDescription.length > 0 &&
          normalized.websiteUrl.length > 0 &&
          normalized.instagramUrl.length > 0 &&
          normalized.platesCarousel.length > 0 &&
          normalized.collageImages.length > 0 &&
          normalized.bigPrize.name.length > 0 &&
          normalized.bigPrize.description.length > 0 &&
          normalized.bigPrize.imageUrl.length > 0 &&
          normalized.termsOfService.length > 0 &&
          normalized.totalPoints > 0;

        if (!hasRequiredFields) {
          throw new Error("Home configuration is incomplete");
        }

        if (isMounted) {
          setConfig(normalized);
          setConfigError(null);
        }
      } catch (error) {
        const isAbort = error instanceof DOMException && error.name === "AbortError";
        if (!isAbort && isMounted) {
          const normalizedError =
            error instanceof Error ? error : new Error("Failed to fetch home configuration");
          console.error("Failed to fetch home configuration", normalizedError);
          setConfigError(normalizedError);
        }
      }
    }

    loadConfig();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  // Smoke tests (runtime) – add a couple to ensure key elements exist
  useEffect(() => {
    console.assert(typeof Dice3DVisible === "function", "Dice3DVisible defined");
    console.assert(typeof LanguageSelector === "function", "LanguageSelector defined");
  }, []);

  if (configError) {
    throw configError;
  }

  if (!config) {
    return null;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeScreen t={t} lang={lang} setLang={setLang} config={config} />} />
        <Route path="/signup" element={<SignupRoute t={t} lang={lang} setLang={setLang} config={config} />} />
        <Route path="/verify" element={<VerifyRoute t={t} lang={lang} setLang={setLang} isEs={isEs} config={config} />} />
        <Route path="/homepage-registered" element={<RegisteredHomepage config={config} lang={lang} setLang={setLang} isEs={isEs} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
