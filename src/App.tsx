import React, { useState, useEffect, useRef } from 'react';
import { db } from './firebase';
import { collection, onSnapshot, doc, setDoc, query } from 'firebase/firestore';

const linkFonts = document.createElement('link');
linkFonts.rel = 'stylesheet';
linkFonts.href = 'https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700;800;900&display=swap';
if (!document.head.querySelector('link[href*="Lexend"]')) {
  document.head.appendChild(linkFonts);
}

const LogoOficialCanva = () => (
  <div style={{ width: '100%', maxWidth: '270px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <img
      src="/logo.png"
      alt="Nasa Cifras"
      onError={(e) => {
        e.currentTarget.style.display = 'none';
        if (e.currentTarget.nextElementSibling) {
          (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
        }
      }}
      style={{ width: '100%', height: 'auto', objectFit: 'contain', display: 'block' }}
    />
    <div style={{ display: 'none', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
      <span style={{ fontSize: '42px', fontWeight: '800', color: '#e07a4f', letterSpacing: '2px' }}>NASA</span>
      <span style={{ fontSize: '24px', fontWeight: '900', color: '#f4f6fb', letterSpacing: '4px' }}>CIFRAS</span>
      <span style={{ fontSize: '12px', fontWeight: '700', color: '#fcd34d', letterSpacing: '2px', marginTop: '6px' }}>JESÚS ES EL SEÑOR</span>
    </div>
  </div>
);

function Icon({ name, size = 18 }: { name: string; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };
  switch (name) {
    case 'search': return <svg {...common}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>;
    case 'moon': return <svg {...common}><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" /></svg>;
    case 'sun': return <svg {...common}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>;
    case 'settings': return <svg {...common}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l-.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" /></svg>;
    case 'plus': return <svg {...common} strokeWidth={2.4}><path d="M12 5v14M5 12h14" /></svg>;
    case 'stack': return <svg {...common}><path d="M4 7.5 12 4l8 3.5-8 3.5-8-3.5Z" /><path d="m4 12 8 3.5 8-3.5M4 16.5 12 20l8-3.5" /></svg>;
    case 'layers': return <svg {...common}><rect x="4" y="4" width="12" height="12" rx="2" /><path d="M8 20h10a2 2 0 0 0 2-2V8" /></svg>;
    case 'music': return <svg {...common}><path d="M9 18V6l10-2v12" /><circle cx="6.5" cy="18" r="2.5" /><circle cx="16.5" cy="16" r="2.5" /></svg>;
    case 'sparkle': return <svg {...common}><path d="M12 3v4M12 17v4M3 12h4M17 12h4" /><path d="M12 8c.6 2.2 1.8 3.4 4 4-2.2.6-3.4 1.8-4 4-.6-2.2-1.8-3.4-4-4 2.2-.6 3.4-1.8 4-4Z" /></svg>;
    case 'clock': return <svg {...common}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></svg>;
    case 'heart': return <svg {...common}><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" /></svg>;
    case 'arrow-left': return <svg {...common}><path d="m15 18-6-6 6-6" /></svg>;
    case 'edit': return <svg {...common}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>;
    case 'printer': return <svg {...common}><polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" /></svg>;
    case 'play': return <svg {...common}><polygon points="5 3 19 12 5 21 5 3" /></svg>;
    case 'pause': return <svg {...common}><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>;
    case 'download': return <svg {...common}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>;
    case 'upload': return <svg {...common}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>;
    default: return null;
  }
}

const ALL_TONES = [
  'C', 'Cm', 'C#', 'C#m', 'Db', 'Dbm',
  'D', 'Dm', 'D#', 'D#m', 'Eb', 'Ebm',
  'E', 'Em',
  'F', 'Fm', 'F#', 'F#m', 'Gb', 'Gbm',
  'G', 'Gm', 'G#', 'G#m', 'Ab', 'Abm',
  'A', 'Am', 'A#', 'A#m', 'Bb', 'Bbm',
  'B', 'Bm'
];

function calcularDiagramaAcorde(nombreAcorde: string) {
  if (!nombreAcorde) return null;
  const limpio = nombreAcorde.split('/')[0].trim();
  const basicos: Record<string, any> = {
    "C": { frets: [-1, 3, 2, 0, 1, 0] },
    "Cm": { baseFret: 3, barre: { fret: 3, from: 0, to: 4 }, frets: [3, 5, 5, 3, 3, 3] },
    "Dm": { frets: [-1, -1, 0, 2, 3, 1] },
    "D": { frets: [-1, -1, 0, 2, 3, 2] },
    "E": { frets: [0, 2, 2, 1, 0, 0] },
    "Em": { frets: [0, 2, 2, 0, 0, 0] },
    "G": { frets: [3, 2, 0, 0, 0, 3] },
    "Gm": { baseFret: 3, barre: { fret: 3, from: 0, to: 5 }, frets: [3, 5, 5, 3, 3, 3] },
    "A": { frets: [-1, 0, 2, 2, 2, 0] },
    "Am": { frets: [-1, 0, 2, 2, 1, 0] },
    "Bb": { baseFret: 1, barre: { fret: 1, from: 0, to: 5 }, frets: [1, 3, 3, 2, 1, 1] },
    "Bbm": { baseFret: 1, barre: { fret: 1, from: 0, to: 5 }, frets: [1, 3, 3, 1, 1, 1] },
    "B": { baseFret: 2, barre: { fret: 2, from: 0, to: 5 }, frets: [2, 4, 4, 4, 2, 2] },
    "Bm": { baseFret: 2, barre: { fret: 2, from: 0, to: 5 }, frets: [2, 4, 4, 3, 2, 2] },
    "C#m": { baseFret: 4, barre: { fret: 4, from: 0, to: 5 }, frets: [4, 6, 6, 5, 4, 4] },
    "F#m": { baseFret: 2, barre: { fret: 2, from: 0, to: 5 }, frets: [2, 4, 4, 2, 2, 2] },
    "F": { baseFret: 1, barre: { fret: 1, from: 0, to: 5 }, frets: [1, 3, 3, 2, 1, 1] },
    "C7": { frets: [-1, 3, 2, 3, 1, -1] },
    "A7": { frets: [-1, 0, 2, 0, 2, 0] },
    "B7": { frets: [-1, 2, 1, 2, 0, 2] },
    "A7M": { frets: [-1, 0, 2, 1, 2, 0] },
    "C#7M": { baseFret: 4, barre: { fret: 4, from: 0, to: 4 }, frets: [4, 6, 5, 6, 4, -1] },
    "E/G#": { frets: [4, -1, 2, 4, 5, -1] },
    "B9": { frets: [-1, 2, 1, 2, 2, -1] },
    "A": { frets: [-1, 0, 2, 2, 2, 0] }
  };
  return basicos[limpio] || { frets: [-1, -1, 0, 2, 3, 2] };
}

const STRINGS = 6, FRETS = 4, W = 64, H = 72, PAD_X = 8, PAD_TOP = 12;
const GRID_W = W - PAD_X * 2, GRID_H = H - PAD_TOP - 6;
const STRING_GAP = GRID_W / (STRINGS - 1), FRET_GAP = GRID_H / FRETS;

function DiagramaAcordeLexend({ name, tema, colorAcordes }: { name: string; tema: any; colorAcordes: string }) {
  const shape = calcularDiagramaAcorde(name);
  const baseFret = shape.baseFret || 1;

  return (
    <figure className="item-acorde-pdf" style={{ background: tema.surface, boxShadow: `inset 0 0 0 1px ${tema.border}`, borderRadius: '12px', width: '76px', padding: '6px 4px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, margin: 0 }}>
      <figcaption style={{ fontFamily: "'Lexend', sans-serif", fontSize: '12px', fontWeight: '700', color: colorAcordes, marginBottom: '2px' }}>{name}</figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
        {baseFret === 1 ? (
          <rect x={PAD_X - 1} y={PAD_TOP - 3} width={GRID_W + 2} height={3} rx={1} fill={tema.text} />
        ) : (
          <text x={PAD_X - 5} y={PAD_TOP + FRET_GAP / 2 + 3} fontSize={8} fill={tema.text} opacity={0.6} textAnchor="middle" fontFamily="'Lexend', sans-serif" fontWeight="600">{baseFret}</text>
        )}
        {Array.from({ length: FRETS + 1 }).map((_, i) => (
          <line key={`f${i}`} x1={PAD_X} x2={PAD_X + GRID_W} y1={PAD_TOP + i * FRET_GAP} y2={PAD_TOP + i * FRET_GAP} stroke={tema.text} strokeOpacity={0.35} strokeWidth={1} />
        ))}
        {Array.from({ length: STRINGS }).map((_, i) => (
          <line key={`s${i}`} x1={PAD_X + i * STRING_GAP} x2={PAD_X + i * STRING_GAP} y1={PAD_TOP} y2={PAD_TOP + GRID_H} stroke={tema.text} strokeOpacity={0.5} strokeWidth={1} />
        ))}
        {shape.barre && (
          <rect x={PAD_X + shape.barre.from * STRING_GAP - 3} y={PAD_TOP + (shape.barre.fret - baseFret) * FRET_GAP + FRET_GAP / 2 - 3.5} width={(shape.barre.to - shape.barre.from) * STRING_GAP + 6} height={7} rx={3.5} fill={colorAcordes} />
        )}
        {shape.frets.map((fret: number, i: number) => {
          const x = PAD_X + i * STRING_GAP;
          if (fret === -1) return <text key={`x${i}`} x={x} y={PAD_TOP - 4} fontSize={8} textAnchor="middle" fill={tema.text} opacity={0.5} fontFamily="'Lexend', sans-serif">×</text>;
          if (fret === 0) return <circle key={`o${i}`} cx={x} cy={PAD_TOP - 6} r={2.2} fill="none" stroke={tema.text} strokeOpacity={0.6} strokeWidth={1} />;
          if (shape.barre && fret === shape.barre.fret && i >= shape.barre.from && i <= shape.barre.to) return null;
          return <circle key={`d${i}`} cx={x} cy={PAD_TOP + (fret - baseFret) * FRET_GAP + FRET_GAP / 2} r={3.8} fill={colorAcordes} />;
        })}
      </svg>
    </figure>
  );
}

function formatearEtiqueta(himno: any) {
  if (!himno || !himno.numero || himno.numero.trim() === '') return '';
  const num = himno.numero.trim();
  if (himno.categoria === 'Suplementarios') return `S-${num}`;
  if (himno.categoria === 'Complementarios') return `C-${num}`;
  if (himno.categoria === 'Himnos') return `H-${num}`;
  return '';
}

function RenderLineaChordPro({ linea, tema, fontSizeAcordes, fontSizeLetra, colorAcordes }: { linea: string; tema: any; fontSizeAcordes: number; fontSizeLetra: number; colorAcordes: string }) {
  const lineaTrim = linea.trim();
  if (!lineaTrim) return <div style={{ height: '14px' }} />;
  const esSeccion = /^(ESTROFA|CORO|PUENTE|INTRO|CODA|INTRODUCCIÓN|VERSO)/i.test(lineaTrim);
  if (esSeccion) {
    return <div style={{ marginTop: '20px', marginBottom: '6px', fontWeight: '800', fontSize: '0.8em', color: tema.muted, letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: "'Lexend', sans-serif" }}>{lineaTrim}</div>;
  }

  // Segment exact tokens of [acorde] and text chunks. 
  // Each pair [acorde]texto is rendered as an inline-flex column so the chord stays right above its precise text position.
  const regex = /\[([^\]]+)\]([^[]*)/g;
  let matches: { acorde: string; texto: string }[] = [];
  let match;
  let lastIndex = 0;

  // Check leading text before the first bracket
  const firstBracket = linea.indexOf('[');
  let leadingText = '';
  if (firstBracket > 0) {
    leadingText = linea.slice(0, firstBracket);
    lastIndex = firstBracket;
  } else if (firstBracket === -1) {
    // No chords on this line, just plain text
    return <div style={{ fontSize: `${fontSizeLetra}px`, lineHeight: '1.5', color: tema.text, fontFamily: "'Lexend', sans-serif", margin: '2px 0' }}>{linea}</div>;
  }

  while ((match = regex.exec(linea)) !== null) {
    matches.push({ acorde: match[1].trim(), texto: match[2] });
    lastIndex = regex.lastIndex;
  }

  // Trailing text after last match
  const trailingText = lastIndex < linea.length ? linea.slice(lastIndex) : '';

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', minHeight: `${fontSizeAcordes + fontSizeLetra + 6}px`, margin: '4px 0', rowGap: '2px' }}>
      {leadingText && (
        <span style={{ display: 'inline-flex', flexDirection: 'column', verticalAlign: 'bottom' }}>
          <span style={{ fontSize: `${fontSizeAcordes}px`, lineHeight: '1.2', visibility: 'hidden', fontFamily: "'Lexend', sans-serif" }}>.</span>
          <span style={{ fontSize: `${fontSizeLetra}px`, lineHeight: '1.25', color: tema.text, fontFamily: "'Lexend', sans-serif", whiteSpace: 'pre' }}>{leadingText}</span>
        </span>
      )}
      {matches.map((m, idx) => (
        <span key={idx} style={{ display: 'inline-flex', flexDirection: 'column', verticalAlign: 'bottom' }}>
          <span style={{ fontSize: `${fontSizeAcordes}px`, fontWeight: '800', color: colorAcordes, lineHeight: '1.2', fontFamily: "'Lexend', sans-serif", whiteSpace: 'pre' }}>
            {m.acorde}
          </span>
          <span style={{ fontSize: `${fontSizeLetra}px`, lineHeight: '1.25', color: tema.text, fontFamily: "'Lexend', sans-serif", whiteSpace: 'pre' }}>
            {m.texto || '\u00A0'}
          </span>
        </span>
      ))}
      {trailingText && (
        <span style={{ display: 'inline-flex', flexDirection: 'column', verticalAlign: 'bottom' }}>
          <span style={{ fontSize: `${fontSizeAcordes}px`, lineHeight: '1.2', visibility: 'hidden', fontFamily: "'Lexend', sans-serif" }}>.</span>
          <span style={{ fontSize: `${fontSizeLetra}px`, lineHeight: '1.25', color: tema.text, fontFamily: "'Lexend', sans-serif", whiteSpace: 'pre' }}>{trailingText}</span>
        </span>
      )}
    </div>
  );
}

const SPEEDS = [0.5, 1, 1.5, 2];

export default function App() {
  const [ocultarSplash, setOcultarSplash] = useState(false);
  const [vistaActual, setVistaActual] = useState('menu');
  const [categoriaSel, setCategoriaSel] = useState('Suplementarios');
  
  const [modoOscuro, setModoOscuro] = useState(() => {
    try {
      const guardado = localStorage.getItem('nasa_cifras_dark');
      if (guardado !== null) return JSON.parse(guardado);
    } catch (e) {}
    return false;
  });

  useEffect(() => {
    try {
      localStorage.setItem('nasa_cifras_dark', JSON.stringify(modoOscuro));
    } catch (e) {}
  }, [modoOscuro]);

  const [scrolling, setScrolling] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState('recent');

  const [fontSizeLetra, setFontSizeLetra] = useState(16);
  const [fontSizeAcordes, setFontSizeAcordes] = useState(14);
  const [notacionCifrado, setNotacionCifrado] = useState<'america' | 'latina'>('america');
  const [colorAcordes, setColorAcordes] = useState('#e07a4f');

  const [idEditando, setIdEditando] = useState<string | null>(null);
  const [formCat, setFormCat] = useState('Suplementarios');
  const [formNum, setFormNum] = useState('');
  const [formTitulo, setFormTitulo] = useState('');
  const [formCompas, setFormCompas] = useState('4/4');
  const [formBpm, setFormBpm] = useState('132');
  const [formAutor, setFormAutor] = useState('');
  const [formTono, setFormTono] = useState('C');
  const [formCuerpo, setFormCuerpo] = useState('');

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = modoOscuro ? {
    bg: '#0b1120', surface: '#111a2e', surface2: '#16213a', border: 'rgba(255,255,255,0.08)', borderStrong: 'rgba(255,255,255,0.16)', text: '#f4f6fb', muted: '#94a3b8', faint: '#64748b', accent: '#e07a4f', accentSoft: 'rgba(224,122,79,0.14)', onAccent: '#1a0d07', shadow: '0 8px 24px rgba(0,0,0,0.3)',
  } : {
    bg: '#f8fafc', surface: '#ffffff', surface2: '#f1f5f9', border: '#cbd5e1', borderStrong: '#94a3b8', text: '#0f172a', muted: '#334155', faint: '#475569', accent: '#d46a3f', accentSoft: 'rgba(212,106,63,0.12)', onAccent: '#ffffff', shadow: '0 4px 20px rgba(11,17,32,0.06)',
  };

  const himnosIniciales = [
    {
      id: "1",
      categoria: "Nuevos",
      numero: "",
      titulo: "La Nube",
      compas: "4/4",
      bpm: "132",
      autor: "Hebert Faria / Samuel Huh",
      tonoBase: "Dm",
      textoChordPro: "INTRO\n[Dm]    [Bb]    [F]    [C]    [Dm]\nOh, oh, oh, oh, oh, oh, oh.\n\nESTROFA 1\n[Dm]Hay una nube que con[Bb]duce la iglesia;\nHay una [F]voz que nos ordena [C]ir a la [Dm]guerra.\n¿Quién va a oír el hablar que está fluyendo de Dios?\n\nCORO\n[Bb]¡Heme aquí! No teme[F]ré, ¡atiendo a Tu llama[C]do!\n[Dm]Te seguiré, y busca[Bb]ré las cosas [F]de lo al[C]to.\n[Gm]¡Obedecer! No duda[Dm]ré, murmuración [Bb]ya de[F]jo.\n[Gm]Si no es de Dios, lo olvida[Bb]ré, así en Cristo [F]crezco.[C]"
    }
  ];

  const [himnos, setHimnos] = useState(() => {
    try {
      const guardados = localStorage.getItem('nasa_cifras_himnos');
      if (guardados) return JSON.parse(guardados);
    } catch (e) {}
    return himnosIniciales;
  });

  const [himnoActivo, setHimnoActivo] = useState(himnos[0]);
  const [recientes, setRecientes] = useState([himnos[0]]);
  const [favoritos, setFavoritos] = useState([himnos[0]]);

  useEffect(() => {
    try {
      const q = query(collection(db, "himnos"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const listaCloud = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
          setHimnos(prev => {
            const combinado = [...listaCloud];
            prev.forEach(itemLocal => {
              if (!combinado.some(c => c.id === itemLocal.id)) {
                combinado.push(itemLocal);
              }
            });
            localStorage.setItem('nasa_cifras_himnos', JSON.stringify(combinado));
            return combinado;
          });
        }
      }, (err) => { console.warn("Firestore sync offline mode"); });
      return () => unsubscribe();
    } catch (e) { console.warn("Firestore offline"); }
  }, []);

  useEffect(() => {
    const splashTimer = setTimeout(() => { setOcultarSplash(true); }, 2200);
    return () => clearTimeout(splashTimer);
  }, []);

  useEffect(() => {
    if (!scrolling || vistaActual !== 'visor') return;
    const el = scrollRef.current;
    if (!el) return;
    let frameId: number;
    const stepScroll = () => {
      el.scrollTop += 0.8 * speed;
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 2) {
        setScrolling(false);
        return;
      }
      frameId = requestAnimationFrame(stepScroll);
    };
    frameId = requestAnimationFrame(stepScroll);
    return () => cancelAnimationFrame(frameId);
  }, [scrolling, speed, vistaActual]);

  const acordesDelHimno = (texto: string) => {
    if (!texto) return [himnoActivo?.tonoBase || 'C'];
    const matches = texto.match(/\[([^\]]+)\]/g);
    if (!matches) return [himnoActivo?.tonoBase || 'C'];
    const lista: string[] = [];
    matches.forEach(m => {
      const ac = m.slice(1, -1).trim();
      if (ac && !lista.includes(ac)) lista.push(ac);
    });
    return lista.length > 0 ? lista : [himnoActivo?.tonoBase || 'C'];
  };

  const seleccionarHimno = (h: any) => {
    setHimnoActivo(h);
    setRecientes((prev) => [h, ...prev.filter((item) => item.id !== h.id)].slice(0, 8));
    setVistaActual('visor');
  };

  const descargarPDF = () => {
    const tituloPrevio = document.title;
    const prefijo = formatearEtiqueta(himnoActivo);
    document.title = prefijo ? `${prefijo} - ${himnoActivo.titulo}` : himnoActivo.titulo;
    window.print();
    setTimeout(() => { document.title = tituloPrevio; }, 1500);
  };

  const exportarCancionero = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(himnos, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "nasa_cifras_respaldo.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importarCancionero = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed)) {
            setHimnos(parsed);
            localStorage.setItem('nasa_cifras_himnos', JSON.stringify(parsed));
            alert("¡Cancionero importado con éxito!");
          }
        } catch (err) {
          alert("Error al importar el archivo JSON.");
        }
      };
    }
  };

  const abrirEditor = (himno: any) => {
    setIdEditando(himno.id);
    setFormCat(himno.categoria);
    setFormNum(himno.numero || '');
    setFormTitulo(himno.titulo);
    setFormCompas(himno.compas || '4/4');
    setFormBpm(himno.bpm || '120');
    setFormAutor(himno.autor || '');
    setFormTono(himno.tonoBase || 'C');
    setFormCuerpo(himno.textoChordPro || '');
    setVistaActual('formulario');
  };

  const abrirNuevo = () => {
    setIdEditando(null);
    setFormCat('Suplementarios');
    setFormNum('');
    setFormTitulo('');
    setFormCompas('4/4');
    setFormBpm('120');
    setFormAutor('');
    setFormTono('C');
    setFormCuerpo('');
    setVistaActual('formulario');
  };

  const guardarFormulario = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitulo.trim()) return;

    const idDoc = idEditando ? String(idEditando) : String(Date.now());
    const objetoHimno = {
      categoria: formCat,
      numero: formCat === 'Nuevos' ? '' : formNum.trim(),
      titulo: formTitulo.trim(),
      compas: formCompas.trim() || '4/4',
      bpm: formBpm.trim() || '120',
      autor: formAutor.trim(),
      tonoBase: formTono,
      textoChordPro: formCuerpo,
      actualizadoEn: new Date().toISOString()
    };

    const himnoCompleto = { id: idDoc, ...objetoHimno };
    
    setHimnos(prev => {
      const existe = prev.some(h => String(h.id) === idDoc);
      let nuevaLista = existe ? prev.map(h => String(h.id) === idDoc ? himnoCompleto : h) : [himnoCompleto, ...prev];
      localStorage.setItem('nasa_cifras_himnos', JSON.stringify(nuevaLista));
      return nuevaLista;
    });

    try {
      await setDoc(doc(db, "himnos", idDoc), objetoHimno, { merge: true });
    } catch (err) { console.warn("Guardado local persistente OK"); }

    seleccionarHimno(himnoCompleto);
  };

  const navegarAtras = () => {
    setScrolling(false);
    if (vistaActual === 'visor') setVistaActual('lista');
    else if (vistaActual === 'lista') setVistaActual('categories');
    else if (vistaActual === 'categories' || vistaActual === 'formulario') setVistaActual('menu');
  };

  const CATEGORIES = [
    { key: 'Suplementarios', title: 'Suplementarios', badge: 'S-', count: himnos.filter((h: any) => h.categoria === 'Suplementarios').length, hint: 'Himnario suplementario', icon: 'stack' },
    { key: 'Complementarios', title: 'Complementarios', badge: 'C-', count: himnos.filter((h: any) => h.categoria === 'Complementarios').length, hint: 'Cantos complementarios', icon: 'layers' },
    { key: 'Himnos', title: 'Himnos', badge: 'H-', count: himnos.filter((h: any) => h.categoria === 'Himnos').length, hint: 'Himnario clásico', icon: 'music' },
    { key: 'Nuevos', title: 'Nuevos', badge: '✨', count: himnos.filter((h: any) => h.categoria === 'Nuevos').length, hint: 'Agregados recientemente', icon: 'sparkle' },
  ];

  const himnosFiltrados = query.trim() === '' ? [] : himnos.filter((h: any) => {
    const q = query.toLowerCase().trim();
    return h.titulo.toLowerCase().includes(q) || (h.numero && h.numero.includes(q));
  });

  const listTab = tab === 'recent' ? recientes : favoritos;

  return (
    <div style={{ height: '100dvh', overflow: 'hidden', fontFamily: "'Lexend', sans-serif", backgroundColor: t.bg, color: t.text, display: 'flex', flexDirection: 'column' }}>
      <style>{`
        * { box-sizing: border-box; }
        html, body { margin: 0; padding: 0; height: 100%; overflow: hidden; background-color: ${t.bg}; }
        @keyframes animFadeOut { 0% { opacity: 1; transform: scale(1); } 100% { opacity: 0; transform: scale(1.03); } }
        .cn-scroll { scrollbar-width: none; -ms-overflow-style: none; }
        .cn-scroll::-webkit-scrollbar { display: none; }
        .cn-press { transition: transform 0.15s ease, opacity 0.15s ease; cursor: pointer; border: none; font-family: inherit; }
        .cn-press:active { transform: scale(0.97); }

        @media print {
          @page { size: A4 portrait; margin: 12mm 14mm; }
          body, html { background: #ffffff !important; color: #000000 !important; font-family: 'Lexend', sans-serif !important; height: auto !important; overflow: auto !important; }
          .no-imprimir { display: none !important; }
          .contenedor-visor { max-width: 100% !important; height: auto !important; padding: 0 !important; margin: 0 !important; }
          
          .layout-partitura-pdf {
            display: flex !important;
            flex-direction: row !important;
            justify-content: space-between !important;
            align-items: flex-start !important;
            gap: 20px !important;
          }
          .area-partitura {
            flex: 1 !important;
            padding: 0 !important;
            line-height: 1.45 !important;
          }
          .area-partitura * { color: #000000 !important; }

          .carrusel-acordes {
            width: 170px !important;
            display: grid !important;
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 8px !important;
            margin: 0 !important;
            padding: 0 !important;
            flex-shrink: 0 !important;
          }
          .item-acorde-pdf {
            background: #ffffff !important;
            border: 1px solid #cbd5e1 !important;
            box-shadow: none !important;
            width: 100% !important;
            padding: 4px !important;
          }
          .header-himno-pdf {
            margin-bottom: 16px !important;
            padding-bottom: 10px !important;
            border-bottom: 2px solid #e2e8f0 !important;
          }
          .header-himno-pdf h1 { font-size: 22pt !important; font-weight: 800 !important; color: #000000 !important; margin: 0 0 4px 0 !important; }
          .header-himno-pdf p { font-size: 11pt !important; color: #334155 !important; margin: 0 !important; }
        }
      `}</style>

      {!ocultarSplash && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: '#0b1120', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '24px', animation: 'animFadeOut 0.45s ease 1.75s forwards' }}>
          <LogoOficialCanva />
        </div>
      )}

      {vistaActual === 'menu' && (
        <div style={{ flex: 1, width: '100%', display: 'flex', justifyContent: 'center', overflowY: 'auto' }}>
          <div style={{ width: '100%', maxWidth: 440, display: 'flex', flexDirection: 'column', padding: 'max(16px, env(safe-area-inset-top)) 18px max(24px, env(safe-area-inset-bottom)) 18px', gap: 16 }}>
            
            <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ background: t.accent, color: t.onAccent, fontWeight: 800, fontSize: 14, padding: '5px 12px', borderRadius: 10, lineHeight: 1, boxShadow: `0 4px 14px ${t.accentSoft}` }}>Cifra</span>
                <span style={{ fontWeight: 800, fontSize: 20, letterSpacing: '0.04em', lineHeight: 1, color: t.text }}>NASA</span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" className="cn-press" onClick={() => setModoOscuro(!modoOscuro)} style={{ width: 38, height: 38, borderRadius: 999, border: `1px solid ${t.border}`, background: t.surface, color: t.text, display: 'grid', placeItems: 'center' }}>
                  <Icon name={modoOscuro ? 'moon' : 'sun'} size={18} />
                </button>
                <button type="button" className="cn-press" onClick={() => setVistaActual('categories')} style={{ width: 38, height: 38, borderRadius: 999, border: `1px solid ${t.border}`, background: t.surface, color: t.text, display: 'grid', placeItems: 'center' }}>
                  <Icon name="settings" size={18} />
                </button>
              </div>
            </header>

            <section>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, background: t.surface, border: `1px solid ${t.border}`, borderRadius: 999, padding: '11px 16px', color: t.muted, boxShadow: t.shadow }}>
                <Icon name="search" size={18} />
                <input value={query} onChange={(e) => setQuery(e.target.value)} type="search" placeholder="Buscar por número (ej: 53) o título..." style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: t.text, fontSize: 14, fontFamily: "'Lexend', sans-serif" }} />
              </label>
              {query.trim() !== '' && (
                <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {himnosFiltrados.map((h: any) => (
                    <div key={h.id} onClick={() => { setQuery(''); seleccionarHimno(h); }} style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 12, padding: '11px 14px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {formatearEtiqueta(h) && <span style={{ color: t.accent, fontWeight: 700, fontSize: 13 }}>{formatearEtiqueta(h)}</span>}
                        <span style={{ fontWeight: 600, fontSize: 14, color: t.text }}>{h.titulo}</span>
                      </div>
                      <span style={{ fontSize: 12, color: t.muted }}>{h.tonoBase}</span>
                    </div>
                  ))}
                  {himnosFiltrados.length === 0 && <div style={{ padding: '12px', textAlign: 'center', fontSize: 13, color: t.muted }}>No se encontraron cánticos</div>}
                </div>
              )}
            </section>

            {query.trim() === '' && (
              <>
                <section>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
                    <h2 style={{ margin: 0, fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: t.muted }}>Categorías</h2>
                    <span style={{ fontSize: 11, color: t.faint, fontWeight: 600 }}>{himnos.length} cantos</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {CATEGORIES.map((c) => (
                      <button key={c.key} type="button" className="cn-press" onClick={() => { setCategoriaSel(c.key); setVistaActual('lista'); }} style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 16, color: t.text, textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 12, padding: '13px 14px', boxShadow: t.shadow }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <span style={{ width: 38, height: 38, borderRadius: 12, display: 'grid', placeItems: 'center', background: t.accentSoft, color: t.accent }}><Icon name={c.icon} size={20} /></span>
                          <span style={{ fontSize: 10, fontWeight: 700, color: c.icon === 'sparkle' ? t.accent : t.muted, border: `1px solid ${t.border}`, borderRadius: 6, padding: '3px 6px', background: t.surface2 }}>{c.badge}</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <span style={{ fontWeight: 700, fontSize: 14, color: t.text }}>{c.title}</span>
                          <span style={{ fontSize: 11, color: t.muted }}><strong style={{ color: t.text, fontWeight: 700 }}>{c.count}</strong> · {c.hint}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>

                <section>
                  <button type="button" className="cn-press" onClick={abrirNuevo} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '13px 16px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.12)', background: `linear-gradient(135deg, ${t.accent} 0%, #c9623a 100%)`, color: '#fff', fontWeight: 700, fontSize: 14, boxShadow: `0 8px 20px rgba(224,122,79,0.25)`, fontFamily: "'Lexend', sans-serif" }}>
                    <span style={{ width: 24, height: 24, borderRadius: 999, display: 'grid', placeItems: 'center', background: 'rgba(255,255,255,0.2)' }}><Icon name="plus" size={14} /></span>
                    <span>Agregar Nuevo Himno</span>
                  </button>
                </section>

                <section>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div style={{ display: 'flex', gap: 4, background: t.surface, border: `1px solid ${t.border}`, borderRadius: 999, padding: 3 }}>
                      <button type="button" onClick={() => setTab('recent')} className="cn-press" style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 10px', borderRadius: 999, background: tab === 'recent' ? t.accentSoft : 'transparent', color: tab === 'recent' ? t.accent : t.muted, fontSize: 12, fontWeight: 700 }}>
                        <Icon name="clock" size={13} /> Últimos
                      </button>
                      <button type="button" onClick={() => setTab('fav')} className="cn-press" style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 10px', borderRadius: 999, background: tab === 'fav' ? t.accentSoft : 'transparent', color: tab === 'fav' ? t.accent : t.muted, fontSize: 12, fontWeight: 700 }}>
                        <Icon name="heart" size={13} /> Favoritos
                      </button>
                    </div>
                  </div>
                  <div className="cn-scroll" style={{ display: 'flex', gap: 10, overflowX: 'auto', margin: '0 -18px', padding: '2px 18px 6px' }}>
                    {listTab.map((s: any) => (
                      <button key={s.id} type="button" className="cn-press" onClick={() => seleccionarHimno(s)} style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 14, padding: '12px 14px', minWidth: 150, textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 6, boxShadow: t.shadow, flexShrink: 0 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: t.accent }}>{formatearEtiqueta(s) || s.categoria}</span>
                        <span style={{ fontWeight: 600, fontSize: 13, color: t.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.titulo}</span>
                      </button>
                    ))}
                  </div>
                </section>
              </>
            )}

            <footer style={{ marginTop: 'auto', textAlign: 'center', padding: '12px 0 4px' }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: t.faint, letterSpacing: '0.04em' }}>NASA CIFRAS · JESÚS ES EL SEÑOR</span>
            </footer>
          </div>
        </div>
      )}

      {vistaActual === 'categories' && (
        <div style={{ flex: 1, width: '100%', display: 'flex', justifyContent: 'center', overflowY: 'auto' }}>
          <div style={{ width: '100%', maxWidth: 480, display: 'flex', flexDirection: 'column', padding: 'max(16px, env(safe-area-inset-top)) 18px max(24px, env(safe-area-inset-bottom)) 18px', gap: 16 }}>
            <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button type="button" className="cn-press" onClick={navegarAtras} style={{ width: 36, height: 36, borderRadius: 999, border: `1px solid ${t.border}`, background: t.surface, color: t.text, display: 'grid', placeItems: 'center' }}>
                  <Icon name="arrow-left" size={18} />
                </button>
                <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: t.text }}>Configuración y Ajustes</h1>
              </div>
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 16, padding: '16px', display: 'flex', flexDirection: 'column', gap: 14, boxShadow: t.shadow }}>
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: t.accent }}>Tamaño de Letra y Acordes</h3>
                
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4, color: t.muted }}>
                    <span>Tamaño de la Letra: {fontSizeLetra}px</span>
                  </div>
                  <input type="range" min="12" max="24" value={fontSizeLetra} onChange={(e) => setFontSizeLetra(Number(e.target.value))} style={{ width: '100%', accentColor: t.accent }} />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4, color: t.muted }}>
                    <span>Tamaño de los Acordes: {fontSizeAcordes}px</span>
                  </div>
                  <input type="range" min="10" max="22" value={fontSizeAcordes} onChange={(e) => setFontSizeAcordes(Number(e.target.value))} style={{ width: '100%', accentColor: t.accent }} />
                </div>
              </div>

              <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 16, padding: '16px', display: 'flex', flexDirection: 'column', gap: 12, boxShadow: t.shadow }}>
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: t.accent }}>Estilo de Cifrado</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <button type="button" className="cn-press" onClick={() => setNotacionCifrado('america')} style={{ padding: '10px', borderRadius: 10, border: `1px solid ${notacionCifrado === 'america' ? t.accent : t.border}`, background: notacionCifrado === 'america' ? t.accentSoft : t.surface2, color: t.text, fontWeight: 700, fontSize: 13 }}>
                    Americana (C, D, E)
                  </button>
                  <button type="button" className="cn-press" onClick={() => setNotacionCifrado('latina')} style={{ padding: '10px', borderRadius: 10, border: `1px solid ${notacionCifrado === 'latina' ? t.accent : t.border}`, background: notacionCifrado === 'latina' ? t.accentSoft : t.surface2, color: t.text, fontWeight: 700, fontSize: 13 }}>
                    Latina (Do, Re, Mi)
                  </button>
                </div>
              </div>

              <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 16, padding: '16px', display: 'flex', flexDirection: 'column', gap: 12, boxShadow: t.shadow }}>
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: t.accent }}>Color de los Acordes</h3>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  {['#e07a4f', '#3b82f6', '#ef4444', '#10b981', '#8b5cf6', '#f59e0b'].map(c => (
                    <button key={c} type="button" className="cn-press" onClick={() => setColorAcordes(c)} style={{ width: 32, height: 32, borderRadius: 999, background: c, border: colorAcordes === c ? `3px solid ${t.text}` : 'none' }} />
                  ))}
                </div>
              </div>

              <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 16, padding: '16px', display: 'flex', flexDirection: 'column', gap: 12, boxShadow: t.shadow }}>
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: t.accent }}>Importar / Exportar Cancionero</h3>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button type="button" className="cn-press" onClick={exportarCancionero} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px', borderRadius: 10, background: t.surface2, border: `1px solid ${t.border}`, color: t.text, fontWeight: 700, fontSize: 13 }}>
                    <Icon name="download" size={16} /> Exportar
                  </button>
                  <button type="button" className="cn-press" onClick={() => fileInputRef.current?.click()} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px', borderRadius: 10, background: t.surface2, border: `1px solid ${t.border}`, color: t.text, fontWeight: 700, fontSize: 13 }}>
                    <Icon name="upload" size={16} /> Importar
                  </button>
                  <input type="file" ref={fileInputRef} onChange={importarCancionero} accept=".json" style={{ display: 'none' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {vistaActual === 'lista' && (
        <div style={{ flex: 1, width: '100%', display: 'flex', justifyContent: 'center', overflowY: 'auto' }}>
          <div style={{ width: '100%', maxWidth: 480, display: 'flex', flexDirection: 'column', padding: 'max(16px, env(safe-area-inset-top)) 18px max(24px, env(safe-area-inset-bottom)) 18px', gap: 16 }}>
            <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button type="button" className="cn-press" onClick={navegarAtras} style={{ width: 36, height: 36, borderRadius: 999, border: `1px solid ${t.border}`, background: t.surface, color: t.text, display: 'grid', placeItems: 'center' }}>
                  <Icon name="arrow-left" size={18} />
                </button>
                <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: t.text }}>{categoriaSel}</h1>
              </div>
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {himnos.filter((h: any) => h.categoria === categoriaSel).map((h: any) => (
                <div key={h.id} onClick={() => seleccionarHimno(h)} style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 12, padding: '12px 14px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {formatearEtiqueta(h) && <span style={{ fontWeight: 800, color: colorAcordes, fontSize: 13, minWidth: 32 }}>{formatearEtiqueta(h)}</span>}
                    <span style={{ fontWeight: 600, fontSize: 14, color: t.text }}>{h.titulo}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 11, color: t.muted, background: t.surface2, padding: '2px 8px', borderRadius: 6 }}>{h.tonoBase || 'C'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {vistaActual === 'visor' && himnoActivo && (
        <div style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', height: '100dvh', overflow: 'hidden', backgroundColor: t.bg }}>
          
          <header className="no-imprimir" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: t.surface, borderBottom: `1px solid ${t.border}`, flexShrink: 0 }}>
            <button type="button" className="cn-press" onClick={navegarAtras} style={{ width: 36, height: 36, borderRadius: 999, border: `1px solid ${t.border}`, background: t.surface2, color: t.text, display: 'grid', placeItems: 'center' }}>
              <Icon name="arrow-left" size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button type="button" className="cn-press" onClick={() => setModoOscuro(!modoOscuro)} style={{ width: 36, height: 36, borderRadius: 999, border: `1px solid ${t.border}`, background: t.surface2, color: t.text, display: 'grid', placeItems: 'center' }}>
                <Icon name={modoOscuro ? 'moon' : 'sun'} size={16} />
              </button>

              <button type="button" className="cn-press" onClick={descargarPDF} style={{ width: 36, height: 36, borderRadius: 999, border: `1px solid ${t.border}`, background: t.surface2, color: t.text, display: 'grid', placeItems: 'center' }}>
                <Icon name="printer" size={15} />
              </button>

              <button type="button" className="cn-press" onClick={() => abrirEditor(himnoActivo)} style={{ width: 36, height: 36, borderRadius: 999, border: `1px solid ${t.border}`, background: t.surface2, color: t.text, display: 'grid', placeItems: 'center' }}>
                <Icon name="edit" size={15} />
              </button>
            </div>
          </header>

          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '16px 20px 130px 20px', backgroundColor: t.bg }} ref={scrollRef}>
            <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }} className="contenedor-visor">
              
              <div className="header-himno-pdf">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 800, color: colorAcordes, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{himnoActivo.categoria}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: t.muted }}>TONO:</span>
                    <span style={{ minWidth: 26, textAlign: 'center', fontWeight: 800, color: colorAcordes, fontSize: 13 }}>{himnoActivo.tonoBase || 'C'}</span>
                  </div>
                </div>

                <h1 style={{ margin: '0 0 6px 0', fontSize: 'clamp(22px, 5vw, 28px)', fontWeight: 800, color: t.text }}>
                  {formatearEtiqueta(himnoActivo) ? `${formatearEtiqueta(himnoActivo)} · ${himnoActivo.titulo}` : himnoActivo.titulo}
                </h1>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: t.muted, background: t.surface2, padding: '3px 8px', borderRadius: 6 }}>Compás: {himnoActivo.compas || '4/4'}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: t.muted, background: t.surface2, padding: '3px 8px', borderRadius: 6 }}>BPM: {himnoActivo.bpm || '120'}</span>
                  {himnoActivo.autor && <span style={{ fontSize: 12, color: t.faint, fontWeight: 600 }}>{himnoActivo.autor}</span>}
                </div>
              </div>

              <div className="layout-partitura-pdf" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div className="carrusel-acordes cn-scroll" style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
                  {acordesDelHimno(himnoActivo.textoChordPro).map(ac => (
                    <DiagramaAcordeLexend key={ac} name={ac} tema={t} colorAcordes={colorAcordes} />
                  ))}
                </div>

                <div className="area-partitura" style={{ display: 'flex', flexDirection: 'column', gap: 6, color: t.text }}>
                  {himnoActivo.textoChordPro ? himnoActivo.textoChordPro.split('\n').map((linea: string, lIdx: number) => (
                    <RenderLineaChordPro key={lIdx} linea={linea} tema={t} fontSizeAcordes={fontSizeAcordes} fontSizeLetra={fontSizeLetra} colorAcordes={colorAcordes} />
                  )) : <p style={{ color: t.muted }}>Sin contenido</p>}
                </div>
              </div>

            </div>
          </div>

          {/* Barra flotante estilo píldora para Auto-scroll */}
          <div className="no-imprimir" style={{ position: 'fixed', bottom: 16, left: '50%', transform: 'translateX(-50%)', background: 'rgba(15, 23, 42, 0.92)', backdropFilter: 'blur(8px)', borderRadius: 999, padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 10, zIndex: 100, boxShadow: '0 10px 25px rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <button type="button" className="cn-press" onClick={() => setScrolling(!scrolling)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 999, background: scrolling ? colorAcordes : 'rgba(255,255,255,0.15)', color: '#fff', fontWeight: 700, fontSize: 13 }}>
              <Icon name={scrolling ? 'pause' : 'play'} size={14} /> Auto-scroll
            </button>
            <div style={{ display: 'flex', gap: 4 }}>
              {SPEEDS.map(s => (
                <button key={s} type="button" className="cn-press" onClick={() => setSpeed(s)} style={{ padding: '6px 8px', borderRadius: 999, background: speed === s ? colorAcordes : 'transparent', color: speed === s ? '#fff' : '#94a3b8', fontSize: 12, fontWeight: 700 }}>
                  {s}x
                </button>
              ))}
            </div>
          </div>

        </div>
      )}

      {vistaActual === 'formulario' && (
        <div style={{ flex: 1, width: '100%', minHeight: '100dvh', display: 'flex', justifyContent: 'center', overflowY: 'auto', backgroundColor: t.bg }}>
          <form onSubmit={guardarFormulario} style={{ width: '100%', maxWidth: 520, display: 'flex', flexDirection: 'column', padding: 'max(16px, env(safe-area-inset-top)) 18px max(40px, env(safe-area-inset-bottom)) 18px', gap: 16, backgroundColor: t.bg }}>
            <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button type="button" className="cn-press" onClick={() => setVistaActual('menu')} style={{ width: 36, height: 36, borderRadius: 999, border: `1px solid ${t.border}`, background: t.surface, color: t.text, display: 'grid', placeItems: 'center' }}>
                  <Icon name="arrow-left" size={18} />
                </button>
                <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: t.text }}>{idEditando ? 'Editar Cántico' : 'Nuevo Cántico'}</h1>
              </div>
              <button type="submit" className="cn-press" style={{ background: colorAcordes, color: '#fff', fontWeight: 700, fontSize: 13, padding: '8px 16px', borderRadius: 10 }}>Guardar</button>
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: t.muted, display: 'block', marginBottom: 4 }}>Categoría</label>
                  <select value={formCat} onChange={(e) => setFormCat(e.target.value)} style={{ width: '100%', background: t.surface, color: t.text, border: `1px solid ${t.border}`, borderRadius: 10, padding: '10px 12px', fontSize: 14, fontFamily: "'Lexend', sans-serif" }}>
                    <option value="Suplementarios">Suplementarios</option>
                    <option value="Complementarios">Complementarios</option>
                    <option value="Himnos">Himnos</option>
                    <option value="Nuevos">Nuevos</option>
                  </select>
                </div>
                {formCat !== 'Nuevos' && (
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: t.muted, display: 'block', marginBottom: 4 }}>Número</label>
                    <input type="text" value={formNum} onChange={(e) => setFormNum(e.target.value)} placeholder="Ej: 53" style={{ width: '100%', background: t.surface, color: t.text, border: `1px solid ${t.border}`, borderRadius: 10, padding: '10px 12px', fontSize: 14, fontFamily: "'Lexend', sans-serif" }} />
                  </div>
                )}
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: t.muted, display: 'block', marginBottom: 4 }}>Título</label>
                <input type="text" required value={formTitulo} onChange={(e) => setFormTitulo(e.target.value)} placeholder="Título del canto" style={{ width: '100%', background: t.surface, color: t.text, border: `1px solid ${t.border}`, borderRadius: 10, padding: '10px 12px', fontSize: 14, fontFamily: "'Lexend', sans-serif" }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: t.muted, display: 'block', marginBottom: 4 }}>Tono Base</label>
                  <select value={formTono} onChange={(e) => setFormTono(e.target.value)} style={{ width: '100%', background: t.surface, color: t.text, border: `1px solid ${t.border}`, borderRadius: 10, padding: '10px 12px', fontSize: 14, fontFamily: "'Lexend', sans-serif" }}>
                    {ALL_TONES.map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: t.muted, display: 'block', marginBottom: 4 }}>Compás</label>
                  <input type="text" value={formCompas} onChange={(e) => setFormCompas(e.target.value)} style={{ width: '100%', background: t.surface, color: t.text, border: `1px solid ${t.border}`, borderRadius: 10, padding: '10px 12px', fontSize: 14, fontFamily: "'Lexend', sans-serif" }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: t.muted, display: 'block', marginBottom: 4 }}>BPM</label>
                  <input type="text" value={formBpm} onChange={(e) => setFormBpm(e.target.value)} style={{ width: '100%', background: t.surface, color: t.text, border: `1px solid ${t.border}`, borderRadius: 10, padding: '10px 12px', fontSize: 14, fontFamily: "'Lexend', sans-serif" }} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: t.muted, display: 'block', marginBottom: 4 }}>Autor / Referencia</label>
                <input type="text" value={formAutor} onChange={(e) => setFormAutor(e.target.value)} placeholder="Ej: Hebert Faria" style={{ width: '100%', background: t.surface, color: t.text, border: `1px solid ${t.border}`, borderRadius: 10, padding: '10px 12px', fontSize: 14, fontFamily: "'Lexend', sans-serif" }} />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: t.muted, display: 'block', marginBottom: 4 }}>Letra y Acordes (Formato ChordPro con [Acorde])</label>
                <textarea rows={12} required value={formCuerpo} onChange={(e) => setFormCuerpo(e.target.value)} placeholder="ESTROFA 1&#10;[Dm]Hay una nube..." style={{ width: '100%', background: t.surface, color: t.text, border: `1px solid ${t.border}`, borderRadius: 10, padding: '12px', fontSize: 13, fontFamily: 'monospace', resize: 'vertical' }} />
              </div>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}