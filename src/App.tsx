import { useEffect, useMemo, useState, useRef } from 'react';
import type { CSSProperties, FormEvent, ReactNode } from 'react';
import {
  Menu as MenuIcon, X, Search, ShoppingBag, Hammer, Plane, ShieldCheck, PenLine,
  Minus, Plus, ChevronDown, Lock, HelpCircle, Check, ArrowRight, MessageCircle,
} from 'lucide-react';
import { BRANDS, type BrandData } from './config/brandConfig';
import { formatPrice, TRANSLATIONS, type Lang, type Cur } from './config/i18n';

/* ───────────────────────── DATA ───────────────────────── */

const IMG = (file: string) => `${import.meta.env.BASE_URL}img/${file}`;

type Category = 'Totes' | 'Backpacks' | 'Duffels' | 'Briefcases' | 'Small Goods' | 'Camera';

interface Product {
  id: string;
  name: string;
  sub: string;
  category: Category;
  kzt: number;
  img: string;
  lifestyleImg?: string;
  blurb: string;
  pairIds?: string[];
}

const PRODUCTS: Product[] = [
  {
    id: 'nomadique-mini-tote',
    name: 'The Tote Bag Nomadique',
    sub: 'Espresso Leather & Canvas',
    category: 'Totes',
    kzt: 185000,
    img: IMG('nomadique_mini_tote.png'),
    lifestyleImg: IMG('nomadique_mini_tote_story.jpg'),
    blurb: 'Компактная городская сумка-тоут из фактурной зернистой кожи глубокого кофейного оттенка Espresso со светлыми ручками из прочного канваса. Фирменный кожаный ярлык «The Tote Bag Nomadique», съемный регулируемый плечевой ремень и надежная металлическая фурнитура.',
    pairIds: ['card-holder', 'nomadique-cream-tote'],
  },
  {
    id: 'nomadique-artisan-brief',
    name: 'Artisan Laptop Briefcase',
    sub: 'Espresso Pebbled Leather',
    category: 'Briefcases',
    kzt: 295000,
    img: IMG('nomadique_artisan_briefcase.png'),
    lifestyleImg: IMG('nomadique_briefcase_craftsman.jpg'),
    blurb: 'Деловой портфель ручной работы из плотной зернистой кожи растительного дубления. Усиленные кожаные стропы, надежная молния, защитное отделение для ноутбука до 16 дюймов и эргономичные двойные круглые ручки.',
    pairIds: ['nomadique-mini-tote', 'card-holder'],
  },
  {
    id: 'nomadique-cognac-duffel',
    name: 'Voyager Weekender Duffel',
    sub: 'Cognac Amber & Dark Brown',
    category: 'Duffels',
    kzt: 320000,
    img: IMG('nomadique_cognac_duffel.png'),
    lifestyleImg: IMG('nomadique_cognac_sunlight.jpg'),
    blurb: 'Вместительный дорожный саквояж цилиндрической формы из благородной кожи цвета теплого янтаря и коньяка с контрастными темно-коричневыми ремнями. Металлическая молния, съемный плечевой ремень и фирменная кожаная нашивка NOMADIQUE.',
    pairIds: ['dopp-kit', 'nomadique-mini-tote'],
  },
  {
    id: 'nomadique-black-duffel',
    name: 'Grand Travel Weekender',
    sub: 'Charcoal Black & Tuscan Brown',
    category: 'Duffels',
    kzt: 345000,
    img: IMG('nomadique_black_duffel.png'),
    lifestyleImg: IMG('nomadique_black_craftsman.jpg'),
    blurb: 'Премиальная дорожная сумка большого объема из зернистой кожи угольно-черного оттенка с акцентными ручками цвета темного каштана. Идеальный спутник для коротких путешествий, деловых поездок и уикендов.',
    pairIds: ['dopp-kit', 'card-holder'],
  },
  {
    id: 'nomadique-cream-tote',
    name: 'Riviera Fold-Over Tote',
    sub: 'Cream Ivory & Dark Chocolate',
    category: 'Totes',
    kzt: 215000,
    img: IMG('nomadique_cream_tote.png'),
    lifestyleImg: IMG('nomadique_cream_carseat.jpg'),
    blurb: 'Изысканный вместительный шопер в силуэте трапеции из эластичной зернистой кожи сливочного оттенка Ivory с клапаном из темного шоколада на металлической кнопке. Легкий, пластичный и невероятно удобный для города и путешествий.',
    pairIds: ['nomadique-mini-tote', 'open-wallet'],
  },
  {
    id: 'weekender',
    name: 'Weekender Duffel Bag',
    sub: 'Cognac Leather',
    category: 'Duffels',
    kzt: 342000,
    img: IMG('duffel.png'),
    blurb: 'A generous, hand-finished weekender cut from a single hide of vegetable tanned Tuscan leather. Two rolled handles, an adjustable shoulder strap and solid brass hardware.',
    pairIds: ['dopp-kit', 'card-holder'],
  },
  {
    id: 'laptop-brief',
    name: 'Leather Laptop Briefcase',
    sub: 'Tan Full Grain',
    category: 'Briefcases',
    kzt: 312000,
    img: IMG('briefcase.png'),
    blurb: 'A structured briefcase with a padded felt compartment for a 15" laptop, double buckle closure and a rolled top handle.',
    pairIds: ['card-holder', 'open-wallet'],
  },
  {
    id: 'rucksack',
    name: 'Leather Rucksack',
    sub: 'Cognac Leather',
    category: 'Backpacks',
    kzt: 289000,
    img: IMG('rucksack.png'),
    blurb: 'A minimalist roll-top rucksack with padded leather straps, buckle closures and a roomy single compartment designed for daily commute and travel.',
    pairIds: ['camera-case', 'card-holder'],
  },
  {
    id: 'dopp-kit',
    name: 'Horizontal Dopp Kit',
    sub: 'Chestnut',
    category: 'Small Goods',
    kzt: 96000,
    img: IMG('dopp_kit.png'),
    blurb: 'A zip-top wash bag that sits upright on the shelf and packs flat in a duffel, lined with water-resistant Italian twill.',
    pairIds: ['card-holder', 'weekender'],
  },
  {
    id: 'card-holder',
    name: 'Leather Card Holder',
    sub: 'Espresso',
    category: 'Small Goods',
    kzt: 42000,
    img: IMG('cardholder.png'),
    blurb: 'A slim bifold in thick, dark espresso leather with six card slots and a centre pocket for notes.',
    pairIds: ['open-wallet', 'satchel'],
  },
  {
    id: 'camera-case',
    name: 'Camera & Accessories Case',
    sub: 'Felted Wool & Leather',
    category: 'Camera',
    kzt: 152000,
    img: IMG('camera_case.png'),
    blurb: 'A felted wool lined leather case with a magnetic flap and a long carry strap for camera and small accessories.',
    pairIds: ['rucksack', 'card-holder'],
  },
  {
    id: 'satchel',
    name: 'Pack All Satchel Bag',
    sub: 'Deep Brown',
    category: 'Briefcases',
    kzt: 326000,
    img: IMG('satchel.png'),
    blurb: 'Our signature satchel: a deep brown flap bag with twin buckles, top handle and an adjustable shoulder strap. Crafted from Tuscan vegetable tanned leather.',
    pairIds: ['open-wallet', 'card-holder'],
  },
  {
    id: 'open-wallet',
    name: 'Leather Billfold Wallet',
    sub: 'Cognac & Slate Felt',
    category: 'Small Goods',
    kzt: 72000,
    img: IMG('wallet_open.png'),
    blurb: 'A classic billfold lined with grey felted wool, with six card slots and a full-length note pocket.',
    pairIds: ['card-holder', 'satchel'],
  },
];

const byId = (id: string) => PRODUCTS.find(p => p.id === id) || PRODUCTS[0];

/* ───────────────────────── ROUTER ───────────────────────── */

type Route = { page: 'home' | 'shop' | 'checkout' | 'product'; id?: string };
const parseHash = (): Route => {
  const h = window.location.hash.replace(/^#\/?/, '');
  if (h.startsWith('product/')) return { page: 'product', id: h.split('/')[1] };
  if (h === 'shop') return { page: 'shop' };
  if (h === 'checkout') return { page: 'checkout' };
  return { page: 'home' };
};

/* ───────────────────────── SMALL COMPONENTS ───────────────────────── */

function Img({ src, alt, className = '', style }: { src: string; alt: string; className?: string; style?: CSSProperties }) {
  const [bad, setBad] = useState(false);
  if (bad)
    return (
      <div
        role="img" aria-label={alt} style={style}
        className={`${className} bg-gradient-to-br from-[#8a5a3c] via-[#6b3f26] to-[#3a2314]`}
      />
    );
  return <img src={src} alt={alt} style={style} loading="lazy" onError={() => setBad(true)} className={className} />;
}

function Logo({ brand }: { brand: BrandData }) {
  return (
    <a href="#/" aria-label={`${brand.name} home`} className="inline-block select-none text-center">
      <span className="font-serif font-bold text-xl sm:text-2xl md:text-[32px] tracking-[0.16em] sm:tracking-[0.18em] text-neutral-900 uppercase">
        {brand.name}
      </span>
    </a>
  );
}

function Stamp({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke="#191919" strokeWidth="1.2" aria-hidden>
      <circle cx="20" cy="20" r="18" />
      <circle cx="20" cy="20" r="14" strokeDasharray="1.5 2.5" />
      <path d="M13 26 L20 12 L27 26 M16 21 H24" />
    </svg>
  );
}

function Card({ p, cur, big = false }: { p: Product; cur: Cur; big?: boolean }) {
  return (
    <a
      href={`#/product/${p.id}`}
      className="group block text-center transition-transform duration-500 ease-out hover:scale-105"
      id={`card-${p.id}`}
    >
      <div className={`flex items-center justify-center ${big ? 'h-72 md:h-96' : 'h-44 sm:h-56 md:h-72'}`}>
        <Img
          src={p.img}
          alt={p.name}
          className="max-h-full max-w-[88%] w-auto h-auto object-contain drop-shadow-[0_18px_20px_rgba(0,0,0,0.16)] transition duration-500 ease-out group-hover:drop-shadow-[0_24px_24px_rgba(0,0,0,0.22)]"
        />
      </div>
      <div className="font-serif text-sm text-neutral-900 tracking-wide mt-3 text-center">{p.name}</div>
      <div className="text-xs text-neutral-600 tracking-wider text-center mt-1">{formatPrice(p.kzt, cur)}</div>
    </a>
  );
}

function Section({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`w-full max-w-full overflow-x-hidden px-4 sm:px-6 md:px-14 lg:px-20 box-border ${className}`}>{children}</section>;
}

/* ───────────────────────── MAIN APP ───────────────────────── */

export default function App() {
  const [route, setRoute] = useState<Route>(parseHash());
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [cur, setCur] = useState<Cur>('KZT');
  const [lang, setLang] = useState<Lang>('ru');
  const [cart, setCart] = useState<Record<string, number>>({});
  const [toast, setToast] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Clean White-Label: strictly via URL ?brand=hakimage
  const brand = useMemo<BrandData>(() => {
    let clientKey = new URLSearchParams(window.location.search).get('brand');
    if (!clientKey && window.location.hash.includes('?')) {
      const hashQuery = window.location.hash.substring(window.location.hash.indexOf('?'));
      clientKey = new URLSearchParams(hashQuery).get('brand');
    }
    const key = (clientKey || 'default').toLowerCase();
    return BRANDS[key] || BRANDS.default;
  }, []);

  const t = TRANSLATIONS[lang];

  useEffect(() => {
    if (brand?.name) {
      document.title = `${brand.name} — ${brand.tagline || 'Leather Goods'}`;
    }
  }, [brand]);

  useEffect(() => {
    const on = () => { setRoute(parseHash()); setMenuOpen(false); setSearchOpen(false); window.scrollTo(0, 0); };
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);

  useEffect(() => { document.body.style.overflow = menuOpen ? 'hidden' : ''; }, [menuOpen]);
  useEffect(() => { if (!toast) return; const timer = setTimeout(() => setToast(''), 2500); return () => clearTimeout(timer); }, [toast]);

  // Click outside listener for currency/lang dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const add = (id: string, n = 1) => {
    setCart(c => ({ ...c, [id]: (c[id] ?? 0) + n }));
    setToast(`${byId(id).name} ${t.addedToCart}`);
  };
  const setQty = (id: string, n: number) =>
    setCart(c => { const x = { ...c }; if (n <= 0) delete x[id]; else x[id] = n; return x; });

  const results = useMemo(
    () => query.trim() ? PRODUCTS.filter(p => (p.name + p.sub + p.category).toLowerCase().includes(query.toLowerCase())) : [],
    [query]
  );

  if (route.page === 'checkout')
    return <Checkout cart={cart} cur={cur} lang={lang} brand={brand} setQty={setQty} clear={() => setCart({})} />;

  return (
    <div className="min-h-screen bg-[#D9D7CE] text-neutral-900 font-serif selection:bg-neutral-900 selection:text-[#D9D7CE] w-full max-w-full overflow-x-hidden relative">
      {/* 2. TRANSPARENT STICKY HEADER — HARDGRAFT ORIGINAL STYLE */}
      <header className="sticky top-0 z-50 bg-[#D9D7CE] py-3.5 sm:py-4 px-4 sm:px-8 md:px-16 transition-all duration-300 grid grid-cols-[1fr_auto_1fr] items-center w-full max-w-full box-border">
        {/* Left: Menu & Search */}
        <nav className="flex items-center gap-3 sm:gap-6 font-sans text-xs uppercase tracking-wider font-medium text-neutral-800" aria-label="Primary">
          <button id="btn-menu" onClick={() => setMenuOpen(true)} className="flex items-center gap-1.5 sm:gap-2 hover:opacity-60 transition">
            <MenuIcon size={15} /> <span>{t.menu}</span>
          </button>
          <button id="btn-search" onClick={() => setSearchOpen(s => !s)} className="flex items-center gap-1.5 sm:gap-2 hover:opacity-60 transition" aria-label={t.search}>
            <Search size={15} /> <span className="hidden sm:inline">{t.search}</span>
          </button>
        </nav>

        {/* Center: Brand Name (Monolithic Brutal Serif strictly centered) */}
        <div className="flex justify-center text-center">
          <Logo brand={brand} />
        </div>

        {/* Right Desktop (lg and up): KZ · ₸ KZT | КОРЗИНА (0) */}
        <div className="hidden lg:flex items-center justify-end gap-3 sm:gap-5 font-sans text-[10px] tracking-[0.2em] uppercase font-medium text-neutral-800">
          {/* Dropdown Trigger for Language & Currency */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(o => !o)}
              className="flex items-center gap-1.5 hover:opacity-60 transition py-1 text-neutral-900"
              title="Change Language & Currency"
            >
              <span>{lang.toUpperCase()} · {cur === 'KZT' ? '₸ KZT' : '$ USD'}</span>
              <ChevronDown size={12} className={`transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Seamless dropdown matching #D9D7CE background */}
            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-44 bg-[#D9D7CE] border border-neutral-900/15 shadow-xl p-3 z-50 fade-up font-sans text-[11px]">
                <div className="text-[9px] uppercase tracking-widest text-neutral-500 mb-2 font-medium">Язык / Language</div>
                <div className="flex flex-col gap-1.5 mb-3">
                  {[
                    ['kz', 'Қазақша (KZ)'],
                    ['ru', 'Русский (RU)'],
                    ['en', 'English (EN)'],
                  ].map(([code, label]) => (
                    <button
                      key={code}
                      onClick={() => { setLang(code as Lang); setDropdownOpen(false); }}
                      className={`text-left px-2 py-1 transition flex justify-between items-center ${
                        lang === code ? 'font-bold bg-neutral-900/10 text-neutral-950' : 'hover:bg-neutral-900/5 text-neutral-700'
                      }`}
                    >
                      <span>{label}</span>
                      {lang === code && <Check size={12} />}
                    </button>
                  ))}
                </div>

                <div className="text-[9px] uppercase tracking-widest text-neutral-500 mb-2 font-medium border-t border-neutral-900/10 pt-2">
                  Валюта / Currency
                </div>
                <div className="flex flex-col gap-1.5">
                  {[
                    ['KZT', '₸ KZT (Tenge)'],
                    ['USD', '$ USD (Dollar)'],
                  ].map(([c, label]) => (
                    <button
                      key={c}
                      onClick={() => { setCur(c as Cur); setDropdownOpen(false); }}
                      className={`text-left px-2 py-1 transition flex justify-between items-center ${
                        cur === c ? 'font-bold bg-neutral-900/10 text-neutral-950' : 'hover:bg-neutral-900/5 text-neutral-700'
                      }`}
                    >
                      <span>{label}</span>
                      {cur === c && <Check size={12} />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <span className="text-neutral-400 select-none">|</span>

          {/* Cart */}
          <a id="btn-cart" href="#/checkout" className="flex items-center gap-1.5 hover:opacity-60 transition font-medium text-neutral-900">
            <ShoppingBag size={13} />
            <span>{t.cart} ({count})</span>
          </a>
        </div>

        {/* Right Mobile (< lg): only minimalist bag icon with count [ 🛍️ (0) ] */}
        <div className="flex lg:hidden items-center justify-end font-sans text-xs font-medium text-neutral-900">
          <a
            id="btn-cart-mobile"
            href="#/checkout"
            className="flex items-center gap-1 hover:opacity-60 transition py-1 px-1.5"
            aria-label={`${t.cart} (${count})`}
          >
            <ShoppingBag size={16} />
            <span className="font-semibold text-xs tracking-tight">({count})</span>
          </a>
        </div>
      </header>

      {/* Search Input Box */}
      {searchOpen && (
        <div className="px-4 sm:px-8 md:px-16 py-6 fade-up bg-[#D9D7CE] border-b border-neutral-900/10 w-full max-w-full box-border">
          <div className="max-w-2xl mx-auto">
            <input
              autoFocus
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="field !bg-transparent !border-neutral-900/30"
              aria-label="Search products"
            />
            {results.length > 0 && (
              <ul className="mt-3 divide-y divide-neutral-900/10">
                {results.map(r => (
                  <li key={r.id}>
                    <a href={`#/product/${r.id}`} className="flex justify-between py-3 label hover:opacity-60 transition">
                      <span>{r.name} — {r.sub}</span>
                      <span>{formatPrice(r.kzt, cur)}</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
            {query && results.length === 0 && <p className="mt-4 label text-stone">{t.noResults}</p>}
          </div>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      <div className={`fixed inset-0 z-50 transition-all ${menuOpen ? 'visible' : 'invisible pointer-events-none'}`}>
        <div
          onClick={() => setMenuOpen(false)}
          className={`absolute inset-0 bg-ink/40 transition-opacity duration-300 ${menuOpen ? 'opacity-100' : 'opacity-0'}`}
        />
        <aside
          className={`absolute left-0 top-0 h-full w-[85%] max-w-sm bg-[#D9D7CE] p-6 sm:p-8 shadow-2xl transition-transform duration-500 overflow-y-auto flex flex-col justify-between ${
            menuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div>
            <div className="flex justify-between items-center mb-6">
              <span className="font-serif text-2xl font-bold uppercase tracking-widest text-neutral-900">{brand.name}</span>
              <button onClick={() => setMenuOpen(false)} aria-label="Close menu" className="p-1 hover:rotate-90 transition text-neutral-900">
                <X size={20} />
              </button>
            </div>

            {/* Mobile Language & Currency Switcher Bar */}
            <div className="mb-8 pb-6 border-b border-neutral-900/10 space-y-4 font-sans">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-neutral-500 mb-2 font-medium block">
                  Язык / Language
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['kz', 'ru', 'en'] as const).map(code => (
                    <button
                      key={code}
                      onClick={() => setLang(code)}
                      className={`py-1.5 px-2 text-xs uppercase tracking-wider rounded border text-center transition ${
                        lang === code
                          ? 'bg-neutral-900 text-[#D9D7CE] border-neutral-900 font-bold shadow-sm'
                          : 'border-neutral-900/20 text-neutral-700 hover:border-neutral-900/40'
                      }`}
                    >
                      {code}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-widest text-neutral-500 mb-2 font-medium block">
                  Валюта / Currency
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'KZT', label: '₸ KZT' },
                    { id: 'USD', label: '$ USD' },
                  ].map(c => (
                    <button
                      key={c.id}
                      onClick={() => setCur(c.id as Cur)}
                      className={`py-1.5 px-2 text-xs uppercase tracking-wider rounded border text-center transition ${
                        cur === c.id
                          ? 'bg-neutral-900 text-[#D9D7CE] border-neutral-900 font-bold shadow-sm'
                          : 'border-neutral-900/20 text-neutral-700 hover:border-neutral-900/40'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <ul className="space-y-5 font-serif text-2xl sm:text-3xl">
              {[
                [t.home, '#/'],
                [t.shopAll, '#/shop'],
                [t.bags, '#/shop'],
                [t.smallGoods, '#/shop'],
                [t.checkout, '#/checkout'],
              ].map(([label, href]) => (
                <li key={label}>
                  <a
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className="block hover:italic hover:pl-2 transition-all text-neutral-900"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-8 mt-8 border-t border-neutral-900/10 text-neutral-600">
            <p className="label text-[10px] uppercase tracking-widest">{brand.subTitle}</p>
            <p className="font-sans text-[11px] mt-1">{brand.tagline} • {brand.city}</p>
          </div>
        </aside>
      </div>

      <main className="w-full max-w-full overflow-x-hidden">
        {route.page === 'home' && <Home cur={cur} lang={lang} brand={brand} add={add} />}
        {route.page === 'shop' && <Shop cur={cur} lang={lang} />}
        {route.page === 'product' && <ProductPage id={route.id || 'satchel'} cur={cur} lang={lang} add={add} />}
      </main>

      <Footer brand={brand} lang={lang} />

      {toast && (
        <div role="status" className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-neutral-900 text-[#D9D7CE] label px-5 py-3 rounded-full fade-up shadow-2xl flex items-center gap-2">
          <Check size={14} />
          {toast} · <a href="#/checkout" className="underline font-bold">{t.checkout}</a>
        </div>
      )}
    </div>
  );
}

/* ───────────────────────── HOME PAGE ───────────────────────── */

function Home({ cur, lang, brand, add }: { cur: Cur; lang: Lang; brand: BrandData; add: (id: string) => void }) {
  const hero = byId('nomadique-mini-tote');
  const [tab, setTab] = useState<'craft' | 'materials' | 'care'>('craft');
  const grid = ['nomadique-cognac-duffel', 'nomadique-artisan-brief', 'nomadique-cream-tote', 'nomadique-black-duffel', 'satchel', 'card-holder'].map(byId);
  const t = TRANSLATIONS[lang];

  const tabsContent = {
    craft: {
      h: `${brand.name} • ${brand.city}`,
      t: `${brand.name} — ${brand.subTitle}. ${brand.tagline}. Натуральная кожа растительного дубления, ручной шов вощеными нитями и внимание к мельчайшим деталям для истинных ценителей.`,
    },
    materials: {
      h: t.tabMaterials,
      t: 'Rich, Tuscan vegetable tanned leather — gently tumbled in age-old oak drums and hand stained. Thick Italian felted wool and solid cast brass fittings made to outlive us all.',
    },
    care: {
      h: t.tabCare,
      t: 'We design from first principles: pure geometry, balanced weight, lifetime repairability. Clean silhouettes designed to mature with a deep, personal patina over years of daily wear.',
    },
  };

  return (
    <>
      {/* HERO SECTION: isolated bag with soft contact shadow */}
      <Section className="pt-2 pb-16">
        <div className="relative max-w-5xl mx-auto text-center">
          <a href={`#/product/${hero.id}`} className="group block relative">
            <div className="flex justify-center">
              <Img
                src={hero.img}
                alt={hero.name}
                className="w-full max-w-[22rem] md:max-w-[34rem] h-auto filter drop-shadow-[0_20px_25px_rgba(0,0,0,0.14)] transition duration-1000 ease-out group-hover:scale-[1.03]"
              />
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white/95 px-6 text-center pt-10 md:pt-16 pointer-events-none">
              <h1 className="font-serif text-3xl md:text-5xl font-normal tracking-normal drop-shadow-md fade-up">
                {hero.name}
              </h1>
              <p className="mt-3 font-sans text-[11px] uppercase tracking-widest font-medium drop-shadow">
                {t.heroBadge} • {brand.name}
              </p>
              <span className="mt-5 inline-flex items-center gap-2 border border-white/80 px-5 py-2.5 label group-hover:bg-white group-hover:text-ink transition pointer-events-auto">
                {t.discover} <ArrowRight size={12} />
              </span>
            </div>
          </a>
          <button
            onClick={() => add(hero.id)}
            id="hero-add"
            className="mt-6 label border-b border-ink pb-0.5 hover:opacity-60 transition"
          >
            {t.addToCart} — {formatPrice(hero.kzt, cur)}
          </button>
        </div>
      </Section>

      {/* BRAND MANIFESTO */}
      <Section>
        <div className="max-w-2xl text-center mx-auto py-12">
          <p className="text-2xl md:text-3xl font-serif leading-snug">
            {brand.name} — {brand.subTitle || t.manifesto}
          </p>
          <span className="block mt-2 italic text-stone text-xl">
            {brand.tagline} • {brand.city}
          </span>
        </div>
      </Section>

      {/* ASYMMETRIC 3-COLUMN FEATURED PRODUCTS GRID */}
      <Section className="pb-10">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-x-4 md:gap-12 gap-y-14 md:gap-y-20 items-center">
          {grid.map(p => (
            <Card key={p.id} p={p} cur={cur} />
          ))}
        </div>
        <div className="text-center mt-14">
          <a href="#/shop" className="label border-b border-ink pb-0.5 hover:opacity-60 transition">
            {t.shopAll}
          </a>
        </div>
      </Section>

      {/* EDITORIAL / PHILOSOPHY & STORYTELLING */}
      <Section className="py-20">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xl md:text-2xl leading-snug">
            {t.philosophyTitle}
          </p>
          <div role="tablist" className="mt-10 flex justify-center gap-6 label">
            {(['craft', 'care', 'materials'] as const).map(k => (
              <button
                key={k}
                role="tab"
                aria-selected={tab === k}
                id={`tab-${k}`}
                onClick={() => setTab(k)}
                className={`pb-1 border-b transition ${tab === k ? 'border-ink' : 'border-transparent text-stone hover:text-ink'}`}
              >
                {k === 'craft' ? t.tabCraft : k === 'care' ? t.tabCare : t.tabMaterials}
              </button>
            ))}
          </div>
          <div key={tab} className="mt-8 fade-up">
            <h2 className="text-3xl italic">{tabsContent[tab].h}</h2>
            <p className="mt-4 text-lg text-stone leading-relaxed">{tabsContent[tab].t}</p>
          </div>
        </div>
      </Section>

      {/* VALET TRAY: Clean image with serif headline below */}
      <Section className="pb-16">
        <div className="relative max-w-5xl mx-auto overflow-hidden group">
          <Img
            src={IMG('valet_tray.jpg')}
            alt="Valet tray with glasses, keys and watch"
            className="w-full aspect-[16/10] object-cover transition duration-1000 group-hover:scale-105"
          />
        </div>
        <div className="max-w-2xl mx-auto text-center mt-8">
          <h2 className="text-2xl md:text-3xl font-serif text-neutral-900 leading-snug">
            {t.valetTrayTitle}
          </h2>
          <p className="mt-3 text-stone text-base leading-relaxed">
            {t.valetTrayDesc}
          </p>
          <a href="#/shop" className="inline-block mt-4 label border-b border-ink pb-0.5 hover:opacity-60 transition">
            {t.discover}
          </a>
        </div>
      </Section>

      {/* MOODBOARD: Laying directly on #D9D7CE page */}
      <Section className="pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-6 grid-rows-[repeat(4,minmax(0,1fr))] gap-3 md:gap-4 aspect-[4/3]">
            {[
              ['nomadique_cognac_sunlight.jpg', 'col-span-2 row-span-2'],
              ['macro_seam.jpg', 'col-span-2 row-span-1'],
              ['macro_brass.jpg', 'col-span-2 row-span-2'],
              ['nomadique_mini_tote.png', 'col-span-1 row-span-1'],
              ['nomadique_cream_tote.png', 'col-span-2 row-span-1'],
              ['nomadique_briefcase_craftsman.jpg', 'col-span-2 row-span-1'],
              ['nomadique_black_duffel.png', 'col-span-1 row-span-1'],
            ].map(([file, cls], i) => (
              <div
                key={i}
                className={`${cls} overflow-hidden shadow-md hover:z-10 hover:scale-105 transition duration-500 ${
                  i % 2 ? 'rotate-1' : '-rotate-1'
                }`}
              >
                <Img
                  src={IMG(file)}
                  alt={`Atelier moodboard ${i + 1}`}
                  className={`w-full h-full ${file.endsWith('.png') ? 'object-contain p-1 drop-shadow-[0_10px_10px_rgba(0,0,0,0.12)]' : 'object-cover'}`}
                />
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* MATERIALS SECTION */}
      <Section className="pb-20">
        <h2 className="text-center text-3xl md:text-4xl italic mb-12">{t.materialsTitle}</h2>
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-10">
          {[
            ['macro_texture.jpg', 'Vegetable Tanned Leather', 'Full-grain Italian calf, tanned slowly with tree bark. It darkens and softens, gaining a patina that is entirely yours.'],
            ['wallet_open.png', 'Felted Wool', 'Dense, thick Italian felt — warm to the touch, naturally water-resistant and wonderfully quiet inside a bag.'],
            ['macro_brass.jpg', 'Crafted Hardware', 'Solid brass and nickel fittings, hand-set and riveted, made to be repaired rather than replaced.'],
          ].map(([file, title, desc]) => (
            <article key={title} className="group text-center">
              <div className="overflow-hidden aspect-[4/5] flex items-center justify-center">
                <Img
                  src={IMG(file)}
                  alt={title}
                  className={`w-full h-full transition duration-700 group-hover:scale-105 ${
                    file.endsWith('.png') ? 'object-contain p-4 drop-shadow-[0_15px_15px_rgba(0,0,0,0.15)]' : 'object-cover'
                  }`}
                />
              </div>
              <h3 className="mt-5 text-2xl italic">{title}</h3>
              <p className="mt-2 text-stone leading-relaxed">{desc}</p>
            </article>
          ))}
        </div>
      </Section>

      {/* BENEFITS MICRO-BLOCKS */}
      <Section className="pb-24">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 border-t border-ink/15 pt-12">
          {[
            [Hammer, t.benefit1Title, t.benefit1Desc],
            [Plane, t.benefit2Title, t.benefit2Desc],
            [ShieldCheck, t.benefit3Title, t.benefit3Desc],
            [PenLine, t.benefit4Title, t.benefit4Desc],
          ].map(([Icon, title, desc]) => {
            const I = Icon as typeof Hammer;
            return (
              <div key={title as string} className="text-center group">
                <I size={22} strokeWidth={1.2} className="mx-auto mb-4 transition group-hover:-translate-y-1" />
                <h3 className="label text-[10px] mb-2">{title as string}</h3>
                <p className="text-stone leading-snug">{desc as string}</p>
              </div>
            );
          })}
        </div>
      </Section>
    </>
  );
}

/* ───────────────────────── CATALOG / SHOP ───────────────────────── */

function Shop({ cur, lang }: { cur: Cur; lang: Lang }) {
  const [tab, setTab] = useState<string>('All');
  const t = TRANSLATIONS[lang];

  const shopTabs = [
    { key: 'All', label: t.all },
    { key: 'Totes', label: t.totes || 'Тоуты' },
    { key: 'Duffels', label: t.duffels },
    { key: 'Briefcases', label: t.briefcases },
    { key: 'Backpacks', label: t.backpacks },
    { key: 'Small Goods', label: t.smallGoods },
    { key: 'Camera', label: t.camera },
  ];

  const list = tab === 'All' ? PRODUCTS : PRODUCTS.filter(p => p.category === tab);

  return (
    <Section className="pb-24 pt-6">
      <h1 className="text-center text-4xl italic mb-8">{t.shopAll}</h1>
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 label mb-12">
        {shopTabs.map(st => (
          <button
            key={st.key}
            id={`shop-tab-${st.key}`}
            onClick={() => setTab(st.key)}
            className={`pb-1 border-b transition ${tab === st.key ? 'border-ink' : 'border-transparent text-stone hover:text-ink'}`}
          >
            {st.label}
          </button>
        ))}
      </div>
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-x-4 md:gap-12 gap-y-14 md:gap-y-20 items-center">
        {list.map(p => (
          <Card key={p.id} p={p} cur={cur} />
        ))}
      </div>
    </Section>
  );
}

/* ───────────────────────── 3. PRODUCT DETAIL (HARDGRAFT LOOKBOOK STYLE) ───────────────────────── */

function ProductPage({ id, cur, lang, add }: { id: string; cur: Cur; lang: Lang; add: (id: string, n?: number) => void }) {
  const p = PRODUCTS.find(x => x.id === id) || PRODUCTS[0];
  const [qty, setQty] = useState(1);
  const [open, setOpen] = useState<string | null>('Details');
  const [selectedColor, setSelectedColor] = useState<'brown' | 'tan' | 'black'>('brown');
  const t = TRANSLATIONS[lang];

  const colorOptions = [
    { id: 'brown' as const, name: t.colorDeepBrown, hex: '#3D2314' },
    { id: 'tan' as const, name: t.colorCognacTan, hex: '#8B4513' },
    { id: 'black' as const, name: t.colorAllBlack, hex: '#1A1A1A' },
  ];

  // 1-в-1 по ТЗ: Левая колонка — вертикальная лента фото во всю высоту
  const lookbookFeed = [
    // 1-е фото: изолированная сумка на фоне #D9D7CE с мягкой контактной тенью
    {
      src: p.img,
      alt: `${p.name} Studio View`,
      type: 'isolated' as const,
    },
    // 2-е фото: макро ручных стежков и толщины кожи
    {
      src: IMG('macro_seam.jpg'),
      alt: 'Hand-stitched saddle seam detail',
      type: 'photo' as const,
    },
    // 3-е фото: аутентичное фото в мастерской / lifestyle
    {
      src: p.lifestyleImg || IMG('satchel_lifestyle.jpg'),
      alt: `${p.name} handcrafted workshop & lifestyle`,
      type: 'photo' as const,
    },
    // 4-е фото: пряжка и латунная фурнитура
    {
      src: IMG('macro_brass.jpg'),
      alt: 'Solid brass cast hardware buckle',
      type: 'photo' as const,
    },
    // 5-е фото: макро-текстура итальянской кожи растительного дубления
    {
      src: IMG('macro_texture.jpg'),
      alt: 'Tuscan vegetable tanned leather grain',
      type: 'photo' as const,
    },
  ];

  // Сопутствующие товары (Complements & Small Leather Goods)
  const complements = (p.pairIds || ['card-holder', 'open-wallet']).map(byId);

  return (
    <Section className="pb-24 pt-6">
      {/* 1. EDITORIAL SPLIT LAYOUT */}
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
        
        {/* Левая колонка: Вертикальная лента фото во всю высоту (60%) */}
        <div className="w-full lg:w-[60%] flex flex-col gap-8 md:gap-12">
          {lookbookFeed.map((item, index) => (
            <div key={index} className="w-full overflow-hidden group">
              {item.type === 'isolated' ? (
                <div className="w-full aspect-[4/3] flex items-center justify-center py-6">
                  <Img
                    src={item.src}
                    alt={item.alt}
                    className="max-h-full max-w-[85%] w-auto h-auto object-contain filter drop-shadow-[0_25px_30px_rgba(0,0,0,0.18)] transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                </div>
              ) : (
                <div className="w-full aspect-[4/3] sm:aspect-[16/11] overflow-hidden bg-neutral-900/5">
                  <Img
                    src={item.src}
                    alt={item.alt}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Правая колонка: Залипающая панель покупки (40%) */}
        <div className="w-full lg:w-[40%] lg:sticky lg:top-24 h-fit flex flex-col gap-6 pl-0 lg:pl-6">
          
          {/* Title & Category Subtitle */}
          <div>
            <h1 className="font-serif text-3xl md:text-4xl text-neutral-900 tracking-tight leading-tight">
              {p.name}
            </h1>
            <p className="text-xs uppercase tracking-widest text-neutral-500 font-sans mt-2">
              {p.sub} • {p.category}
            </p>
          </div>

          {/* Price */}
          <div className="text-2xl md:text-3xl font-serif text-neutral-900 font-normal">
            {formatPrice(p.kzt, cur)}
          </div>

          {/* Color Swatches */}
          <div className="border-t border-neutral-900/10 pt-4">
            <div className="flex justify-between items-center text-xs font-sans text-neutral-700 mb-3">
              <span className="uppercase tracking-wider font-medium">{t.colorSelect}</span>
              <span className="text-neutral-500">
                {colorOptions.find(c => c.id === selectedColor)?.name}
              </span>
            </div>
            <div className="flex items-center gap-3">
              {colorOptions.map(swatch => (
                <button
                  key={swatch.id}
                  onClick={() => setSelectedColor(swatch.id)}
                  aria-label={swatch.name}
                  className={`w-7 h-7 rounded-full transition-all flex items-center justify-center p-0.5 ${
                    selectedColor === swatch.id
                      ? 'ring-2 ring-neutral-900 ring-offset-2 ring-offset-[#D9D7CE]'
                      : 'hover:opacity-80'
                  }`}
                >
                  <span
                    className="w-full h-full rounded-full shadow-inner block"
                    style={{ backgroundColor: swatch.hex }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & Add to Cart button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <div className="flex items-center justify-between border border-neutral-900/40 rounded px-3 py-3 w-full sm:w-32">
              <button
                aria-label="Decrease quantity"
                onClick={() => setQty(q => Math.max(1, q - 1))}
                className="hover:opacity-60 p-1"
              >
                <Minus size={13} />
              </button>
              <span className="font-sans text-xs font-semibold">{qty}</span>
              <button
                aria-label="Increase quantity"
                onClick={() => setQty(q => q + 1)}
                className="hover:opacity-60 p-1"
              >
                <Plus size={13} />
              </button>
            </div>

            <button
              id="add-to-cart"
              onClick={() => add(p.id, qty)}
              className="flex-1 bg-neutral-900 text-[#D9D7CE] hover:bg-neutral-800 transition font-sans text-xs uppercase tracking-[0.2em] font-medium py-4 px-6 text-center"
            >
              {t.addToCart}
            </button>
          </div>

          {/* Accordion: Details, Materials, Delivery */}
          <div className="mt-4 border-t border-neutral-900/10">
            {[
              [t.details, p.blurb],
              [t.materialsAcc, t.matDesc],
              [t.shippingAcc, t.shipDesc],
            ].map(([sectionTitle, text]) => (
              <div key={sectionTitle} className="border-b border-neutral-900/10">
                <button
                  onClick={() => setOpen(open === sectionTitle ? null : sectionTitle)}
                  className="w-full flex justify-between items-center py-4 font-sans text-xs uppercase tracking-wider text-neutral-800 font-medium hover:text-black transition"
                >
                  <span>{sectionTitle}</span>
                  <ChevronDown size={14} className={`transition-transform duration-300 ${open === sectionTitle ? 'rotate-180' : ''}`} />
                </button>
                {open === sectionTitle && (
                  <p className="pb-4 font-serif text-base text-neutral-600 leading-relaxed fade-up">
                    {text}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3.3 COMPLEMENTS & SMALL LEATHER GOODS */}
      <div className="max-w-6xl mx-auto mt-28 border-t border-neutral-900/10 pt-16">
        <h2 className="text-center font-serif text-2xl md:text-3xl text-neutral-900 italic mb-10">
          {t.pairWithTitle}
        </h2>
        <div className="grid grid-cols-2 max-w-2xl mx-auto gap-8 md:gap-14">
          {complements.map(comp => (
            <Card key={comp.id} p={comp} cur={cur} />
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ───────────────────────── FOOTER ───────────────────────── */

function Footer({ brand, lang }: { brand: BrandData; lang: Lang }) {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const t = TRANSLATIONS[lang];

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (email) setDone(true);
  };

  return (
    <footer className="w-full max-w-full overflow-x-hidden bg-[#D9D7CE] text-center px-4 sm:px-6 py-16 md:py-20 border-t border-neutral-900/10 box-border">
      <div className="flex justify-center mb-6"><Stamp /></div>
      <h2 className="font-serif text-3xl md:text-4xl uppercase tracking-wide text-neutral-900">
        {brand.subTitle || t.footerHeadline}
      </h2>
      <p className="max-w-3xl mx-auto mt-6 text-xl md:text-2xl leading-snug text-neutral-800">
        {brand.name} — {brand.tagline}. {brand.city}.
      </p>

      {/* Subscription form without white container */}
      <form onSubmit={submit} className="mt-10 max-w-sm mx-auto">
        {done ? (
          <p className="label flex items-center justify-center gap-2 text-neutral-900"><Check size={14} /> {t.subscribed}</p>
        ) : (
          <>
            <label htmlFor="sub-email" className="label text-[10px] block mb-3 text-neutral-700">{t.subscribeTitle}</label>
            <div className="flex border-b border-neutral-900/60 pb-1">
              <input
                id="sub-email"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email address"
                className="flex-1 bg-transparent py-2 font-sans text-xs outline-none placeholder:text-stone text-neutral-900"
              />
              <button type="submit" aria-label="Subscribe" className="hover:translate-x-1 transition text-neutral-900 px-2">
                <ArrowRight size={14} />
              </button>
            </div>
          </>
        )}
      </form>

      <div className="mt-14 flex flex-wrap justify-center gap-x-5 gap-y-2 label text-[9px] text-neutral-600">
        <span>© 2026 {brand.name} LEATHER GOODS</span>
        <a href="#/">{t.contact}</a>
        <a href="#/">{t.privacy}</a>
        <a href="#/">{t.terms}</a>
        <a href="#/">{t.refunds}</a>
      </div>
    </footer>
  );
}

/* ───────────────────────── CHECKOUT WITH WHATSAPP ───────────────────────── */

function Checkout({
  cart,
  cur,
  lang,
  brand,
  setQty,
  clear,
}: {
  cart: Record<string, number>;
  cur: Cur;
  lang: Lang;
  brand: BrandData;
  setQty: (id: string, n: number) => void;
  clear: () => void;
}) {
  const items = Object.entries(cart).map(([id, n]) => ({ p: byId(id), n }));
  const subtotal = items.reduce((a, i) => a + i.p.kzt * i.n, 0);
  const shipping = items.length ? 21600 : 0;
  const [code, setCode] = useState('');
  const [placed, setPlaced] = useState(false);
  const [emailOffers, setEmailOffers] = useState(true);
  const [textOffers, setTextOffers] = useState(false);
  const [billing, setBilling] = useState(true);

  // Form Fields
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: 'Almaty',
    phone: '',
  });

  const t = TRANSLATIONS[lang];

  const handleOrder = (e: FormEvent) => {
    e.preventDefault();
    if (!items.length) return;

    // Compose message for WhatsApp
    const orderItemsText = items
      .map(it => `• ${it.p.name} (${it.p.sub}) x ${it.n} = ${formatPrice(it.p.kzt * it.n, cur)}`)
      .join('\n');

    const totalText = formatPrice(subtotal + shipping, cur);
    const clientName = `${formData.firstName} ${formData.lastName}`.trim() || 'Клиент';

    const message = `🛍️ *НОВЫЙ ЗАКАЗ — ${brand.name}*\n` +
      `👤 Клиент: ${clientName}\n` +
      `📞 Телефон: ${formData.phone || 'Указан при подтверждении'}\n` +
      `📍 Адрес: ${formData.city}, ${formData.address || 'Уточняется'}\n\n` +
      `📦 *Состав заказа:*\n${orderItemsText}\n\n` +
      `🚚 Доставка: ${formatPrice(shipping, cur)}\n` +
      `💰 *ИТОГО К ОПЛАТЕ:* ${totalText}\n\n` +
      `_Сформировано через витрину ${brand.name}_`;

    const rawNumber = brand.whatsappNumber || '+77017770000';
    const cleanNumber = rawNumber.replace(/[^0-9]/g, '');
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;

    setPlaced(true);
    clear();
    window.open(whatsappUrl, '_blank');
  };

  const Check_ = ({ on, set, label }: { on: boolean; set: (v: boolean) => void; label: string }) => (
    <button type="button" onClick={() => set(!on)} className="flex items-center gap-2.5 font-sans text-[11px] text-left">
      <span className={`w-4 h-4 rounded-[4px] border border-ink flex items-center justify-center ${on ? 'bg-ink text-paper' : ''}`}>
        {on && <Check size={11} />}
      </span>
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#D9D7CE] font-serif w-full max-w-full overflow-x-hidden relative">
      <div className="max-w-5xl w-full mx-auto grid md:grid-cols-2 gap-10 md:gap-16 px-4 sm:px-5 py-8 box-border">
        <form onSubmit={handleOrder} className="space-y-3 max-w-md w-full md:justify-self-end">
          <div className="flex justify-between items-center mb-4 relative">
            <Logo brand={brand} />
            <a href="#/" className="hover:opacity-60" aria-label="Back to shop">
              <ShoppingBag size={18} />
            </a>
          </div>

          <div className="p-3 bg-neutral-900/[0.04] border border-neutral-900/15 rounded-md flex items-center gap-2.5 font-sans text-[11px]">
            <MessageCircle size={16} className="text-emerald-700 shrink-0" />
            <span>
              Прямой заказ мастеру в WhatsApp бренду <strong>{brand.name}</strong> ({brand.city})
            </span>
          </div>

          <div className="flex justify-between items-baseline pt-2">
            <h2 className="font-display text-xl font-bold">{t.contactTitle}</h2>
            <a href="#/" className="font-sans text-[11px] underline">
              {brand.name}
            </a>
          </div>

          <div className="relative">
            <input
              required
              type="email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              placeholder="Email"
              className="field pr-9"
            />
            <HelpCircle size={14} className="absolute right-3 top-3.5 text-stone" />
          </div>
          <Check_ on={emailOffers} set={setEmailOffers} label={t.emailOffers} />

          <h2 className="font-display text-xl font-bold pt-5">{t.deliveryTitle}</h2>
          <div className="relative">
            <select className="field appearance-none pt-5 pb-2" defaultValue="Kazakhstan" aria-label="Country">
              <option>Kazakhstan</option>
              <option>Uzbekistan</option>
              <option>Kyrgyzstan</option>
              <option>United Kingdom</option>
              <option>United States</option>
              <option>Germany</option>
            </select>
            <span className="absolute left-3 top-1.5 font-sans text-[9px] text-stone pointer-events-none">
              {t.countryLabel}
            </span>
            <ChevronDown size={14} className="absolute right-3 top-4 pointer-events-none" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input
              required
              placeholder={t.firstName}
              value={formData.firstName}
              onChange={e => setFormData({ ...formData, firstName: e.target.value })}
              className="field"
            />
            <input
              required
              placeholder={t.lastName}
              value={formData.lastName}
              onChange={e => setFormData({ ...formData, lastName: e.target.value })}
              className="field"
            />
          </div>

          <input
            required
            placeholder={t.address}
            value={formData.address}
            onChange={e => setFormData({ ...formData, address: e.target.value })}
            className="field"
          />
          <input placeholder={t.apt} className="field" />

          <div className="grid grid-cols-2 gap-3">
            <input
              required
              placeholder={t.city}
              value={formData.city}
              onChange={e => setFormData({ ...formData, city: e.target.value })}
              className="field"
            />
            <input placeholder={t.postalCode} className="field" />
          </div>

          <div className="relative">
            <input
              required
              type="tel"
              placeholder={t.phone}
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              className="field pr-9"
            />
            <HelpCircle size={14} className="absolute right-3 top-3.5 text-stone" />
          </div>

          <Check_ on={textOffers} set={setTextOffers} label={t.textOffers} />

          <h3 className="font-display text-base font-bold pt-4">{t.shippingMethod}</h3>
          <div className="flex justify-between border border-ink rounded-md px-3 py-3.5 font-sans text-[11px] font-medium bg-ink/[0.03]">
            <span>{t.expressShipping}</span>
            <span>{formatPrice(shipping || 21600, cur)}</span>
          </div>

          <div className="flex justify-between items-end pt-4">
            <h2 className="font-display text-xl font-bold">{t.payWithCard}</h2>
            <div className="flex gap-1 items-center">
              <span className="bg-[#1434CB] text-white text-[8px] font-bold italic px-1.5 py-1 rounded-sm">VISA</span>
              <span className="bg-white w-7 h-5 rounded-sm flex items-center justify-center border border-ink/20">
                <i className="w-2.5 h-2.5 rounded-full bg-[#EB001B] -mr-1" />
                <i className="w-2.5 h-2.5 rounded-full bg-[#F79E1B]" />
              </span>
            </div>
          </div>
          <p className="font-sans text-[11px] text-stone">{t.secureNotice}</p>

          <div className="relative">
            <input inputMode="numeric" placeholder={t.cardNumber} className="field pr-9" />
            <Lock size={14} className="absolute right-3 top-3.5 text-stone" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input placeholder={t.expiry} className="field" />
            <input placeholder={t.cvv} className="field" />
          </div>
          <input placeholder={t.nameOnCard} className="field" />
          <Check_ on={billing} set={setBilling} label={t.sameBilling} />

          <button
            type="submit"
            id="review-order"
            disabled={!items.length}
            className="w-full bg-[#191919] text-white hover:bg-[#25D366] transition-colors duration-300 font-sans text-[13px] font-medium py-4 rounded-md mt-6 disabled:opacity-40 flex items-center justify-center gap-2 shadow-lg"
          >
            <MessageCircle size={16} />
            {t.orderViaWhatsApp} ({formatPrice(subtotal + shipping, cur)})
          </button>
          <p className="pt-8 font-sans text-[10px] text-stone underline">Terms and policies</p>
        </form>

        {/* Right side cart summary */}
        <aside className="md:pt-8 max-w-md w-full">
          {placed && (
            <div className="border border-emerald-800/40 bg-emerald-500/10 rounded-md p-5 mb-6 fade-up">
              <p className="font-display text-lg font-bold flex items-center gap-2 text-emerald-950">
                <Check size={18} className="text-emerald-700" /> {t.orderReceived}
              </p>
              <p className="font-sans text-[11px] text-stone mt-2">
                {t.orderSuccessDesc} {t.orderSentWhatsApp}{' '}
                <a href="#/" className="underline font-bold text-ink">
                  {t.home}
                </a>
              </p>
            </div>
          )}

          {items.length === 0 && !placed && (
            <p className="font-sans text-[12px] text-stone">
              {t.cartEmpty} <a href="#/shop" className="underline">{t.shopAll}</a>
            </p>
          )}

          {items.map(({ p, n }) => (
            <div key={p.id} className="flex items-center gap-3 mb-3">
              <div className="relative w-12 h-12 rounded-md border border-ink/20 bg-paper overflow-hidden shrink-0 flex items-center justify-center">
                <Img src={p.img} alt={p.name} className="w-full h-full object-contain p-1" />
                <span className="absolute -top-0 -right-0 bg-black text-white text-[9px] font-sans w-4 h-4 rounded-full flex items-center justify-center">
                  {n}
                </span>
              </div>
              <div className="flex-1 font-sans text-[11px] font-medium">
                {p.name} . {p.sub}
                <div className="flex gap-2 mt-1 text-stone">
                  <button type="button" aria-label="Less" onClick={() => setQty(p.id, n - 1)}>
                    <Minus size={11} />
                  </button>
                  <button type="button" aria-label="More" onClick={() => setQty(p.id, n + 1)}>
                    <Plus size={11} />
                  </button>
                </div>
              </div>
              <span className="font-sans text-[11px]">{formatPrice(p.kzt * n, cur)}</span>
            </div>
          ))}

          <div className="flex gap-2 border border-ink/20 rounded-md p-1.5 mt-4">
            <input
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder={t.discountPlaceholder}
              className="flex-1 bg-transparent px-2 font-sans text-[11px] outline-none placeholder:text-stone"
            />
            <button type="button" className="font-sans text-[11px] px-3 py-1.5 bg-ink/10 rounded-md hover:bg-ink hover:text-paper transition">
              {t.apply}
            </button>
          </div>

          <dl className="mt-6 space-y-2 font-sans text-[11px] font-medium">
            <div className="flex justify-between">
              <dt>{t.subtotal}</dt>
              <dd>{formatPrice(subtotal, cur)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>{t.shipping}</dt>
              <dd>{formatPrice(shipping, cur)}</dd>
            </div>
            <div className="flex justify-between items-baseline pt-2 border-t border-ink/15 font-display text-base font-bold">
              <dt>{t.total}</dt>
              <dd>
                <span className="font-sans text-[9px] text-stone mr-2">{cur}</span>
                {formatPrice(subtotal + shipping, cur)}
              </dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}
