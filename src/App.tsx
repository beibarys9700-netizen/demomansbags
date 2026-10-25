import { useEffect, useMemo, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import {
  Menu as MenuIcon, X, Search, ShoppingBag, Hammer, Plane, ShieldCheck, PenLine,
  Minus, Plus, ChevronDown, Lock, HelpCircle, Check, ArrowRight,
} from 'lucide-react';

/* ───────────────────────── DATA ───────────────────────── */

const U = (id: string, w = 900) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

type Category = 'Backpacks' | 'Duffels' | 'Briefcases' | 'Small Goods' | 'Camera';
interface Product {
  id: string; name: string; sub: string; category: Category; kzt: number; img: string; img2: string;
}

const PRODUCTS: Product[] = [
  { id: 'rucksack', name: 'Roll-Top Rucksack', sub: 'Cognac Leather', category: 'Backpacks', kzt: 289000, img: U('photo-1553062407-98eeb64c6a62'), img2: U('photo-1548036328-c9fa89d128fa') },
  { id: 'strap-clutch', name: 'Strap Clutch', sub: 'Chestnut', category: 'Small Goods', kzt: 118000, img: U('photo-1590874103328-eac38a683ce7'), img2: U('photo-1627123424574-724758594e93') },
  { id: 'dopp-kit', name: 'Horizontal Dopp Kit', sub: 'Deep Brown', category: 'Small Goods', kzt: 96000, img: U('photo-1491637639811-60e2756cc1c7'), img2: U('photo-1544816155-12df9643f363') },
  { id: 'weekender', name: 'Weekender Duffel', sub: 'Vegetable Tanned', category: 'Duffels', kzt: 342000, img: U('photo-1547949003-9792a18a2601'), img2: U('photo-1584917865442-de89df76afd3') },
  { id: 'pocket-wallet', name: 'Compact Wallet', sub: 'Pocket Size', category: 'Small Goods', kzt: 64000, img: U('photo-1627123424574-724758594e93'), img2: U('photo-1559563458-527698bf5295') },
  { id: 'camera-case', name: 'Camera Case', sub: 'Felted Wool & Leather', category: 'Camera', kzt: 152000, img: U('photo-1516035069371-29a1b244cc32'), img2: U('photo-1502920917128-1aa500764cbd') },
  { id: 'laptop-brief', name: 'Laptop Briefcase', sub: 'Tan Full Grain', category: 'Briefcases', kzt: 312000, img: U('photo-1548036328-c9fa89d128fa'), img2: U('photo-1553062407-98eeb64c6a62') },
  { id: 'card-holder', name: 'Card Holder', sub: 'Espresso', category: 'Small Goods', kzt: 42000, img: U('photo-1559563458-527698bf5295'), img2: U('photo-1627123424574-724758594e93') },
  { id: 'open-wallet', name: 'Open Billfold', sub: 'Slate & Cognac', category: 'Small Goods', kzt: 72000, img: U('photo-1553531384-cc64ac80f931'), img2: U('photo-1559563458-527698bf5295') },
  { id: 'satchel', name: 'Pack All Satchel Bag', sub: 'Deep Brown', category: 'Briefcases', kzt: 326000, img: U('photo-1491637639811-60e2756cc1c7', 1400), img2: U('photo-1590874103328-eac38a683ce7') },
  { id: 'black-duffel', name: 'Night Duffel', sub: 'Black Leather', category: 'Duffels', kzt: 298000, img: U('photo-1553062407-98eeb64c6a62'), img2: U('photo-1547949003-9792a18a2601') },
  { id: 'daypack', name: 'Daypack', sub: 'Waxed Canvas', category: 'Backpacks', kzt: 214000, img: U('photo-1622560480605-d83c853bc5c3'), img2: U('photo-1553062407-98eeb64c6a62') },
];

const SHOP_TABS: ('All' | Category)[] = ['All', 'Backpacks', 'Duffels', 'Briefcases', 'Small Goods', 'Camera'];
const RATE = 480; // KZT per USD
const byId = (id: string) => PRODUCTS.find(p => p.id === id)!;

type Cur = 'KZT' | 'USD';
const fmt = (kzt: number, cur: Cur) =>
  cur === 'KZT' ? `₸${kzt.toLocaleString('en-US')}.00` : `$${(kzt / RATE).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;

/* ───────────────────────── ROUTER ───────────────────────── */

type Route = { page: 'home' | 'shop' | 'checkout' | 'product'; id?: string };
const parseHash = (): Route => {
  const h = window.location.hash.replace(/^#\/?/, '');
  if (h.startsWith('product/')) return { page: 'product', id: h.split('/')[1] };
  if (h === 'shop') return { page: 'shop' };
  if (h === 'checkout') return { page: 'checkout' };
  return { page: 'home' };
};

/* ───────────────────────── SMALL PARTS ───────────────────────── */

/** Image with graceful leather-toned fallback if the remote photo fails. */
function Img({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  const [bad, setBad] = useState(false);
  if (bad)
    return (
      <div
        role="img" aria-label={alt}
        className={`${className} bg-gradient-to-br from-[#8a5a3c] via-[#6b3f26] to-[#3a2314]`}
      />
    );
  return <img src={src} alt={alt} loading="lazy" onError={() => setBad(true)} className={className} />;
}

function Logo({ onClick }: { onClick: () => void }) {
  return (
    <a href="#/" onClick={onClick} aria-label="Hardcraft home" className="flex items-center gap-2 select-none">
      <span className="font-display font-black text-[34px] md:text-[44px] leading-[0.82] tracking-tight text-ink">
        hard<br />craft
      </span>
      <span className="hidden sm:block font-sans italic text-[8px] md:text-[9px] leading-tight uppercase tracking-wider text-ink text-left">
        Fine Lifestyle<br />Accessories<br />
        <span className="not-italic font-medium">Hold on to<br />the good</span>
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

function Price({ p, cur }: { p: Product; cur: Cur }) {
  return <span>{fmt(p.kzt, cur)}</span>;
}

function Card({ p, cur, big = false }: { p: Product; cur: Cur; big?: boolean }) {
  return (
    <a href={`#/product/${p.id}`} className="group block text-center" id={`card-${p.id}`}>
      <div className={`relative overflow-hidden ${big ? 'aspect-[4/5]' : 'aspect-square'} mx-auto`}>
        <Img src={p.img} alt={p.name}
          className="absolute inset-0 w-full h-full object-cover mix-blend-multiply drop-shadow-2xl transition duration-700 group-hover:opacity-0 group-hover:scale-105" />
        <Img src={p.img2} alt={`${p.name} alternate view`}
          className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-0 transition duration-700 group-hover:opacity-100 group-hover:scale-105" />
      </div>
      <div className="mt-4 label text-[10px] text-ink">{p.name}</div>
      <div className="mt-1 label text-[10px] text-stone"><Price p={p} cur={cur} /></div>
    </a>
  );
}

function Section({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`px-5 md:px-10 ${className}`}>{children}</section>;
}

/* ───────────────────────── APP ───────────────────────── */

export default function App() {
  const [route, setRoute] = useState<Route>(parseHash());
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [cur, setCur] = useState<Cur>('KZT');
  const [cart, setCart] = useState<Record<string, number>>({});
  const [toast, setToast] = useState('');

  useEffect(() => {
    const on = () => { setRoute(parseHash()); setMenuOpen(false); setSearchOpen(false); window.scrollTo(0, 0); };
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  useEffect(() => { document.body.style.overflow = menuOpen ? 'hidden' : ''; }, [menuOpen]);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(''), 2200); return () => clearTimeout(t); }, [toast]);

  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const add = (id: string, n = 1) => { setCart(c => ({ ...c, [id]: (c[id] ?? 0) + n })); setToast(`${byId(id).name} added to cart`); };
  const setQty = (id: string, n: number) =>
    setCart(c => { const x = { ...c }; if (n <= 0) delete x[id]; else x[id] = n; return x; });

  const results = useMemo(
    () => query.trim() ? PRODUCTS.filter(p => (p.name + p.sub + p.category).toLowerCase().includes(query.toLowerCase())) : [],
    [query]
  );

  if (route.page === 'checkout')
    return <Checkout cart={cart} cur={cur} setQty={setQty} clear={() => setCart({})} />;

  return (
    <div className="min-h-screen bg-paper text-ink font-serif">
      {/* announcement */}
      <div className="text-center label text-[10px] py-2 text-stone">Customs & Duties Refunded</div>

      {/* NAV */}
      <header className="relative px-5 md:px-10 pb-6 pt-2 grid grid-cols-[1fr_auto_1fr] items-center">
        <nav className="flex items-center gap-5 label" aria-label="Primary">
          <button id="btn-menu" onClick={() => setMenuOpen(true)} className="flex items-center gap-2 hover:opacity-60 transition">
            <MenuIcon size={14} /> <span className="hidden sm:inline">Menu</span>
          </button>
          <button id="btn-search" onClick={() => setSearchOpen(s => !s)} className="flex items-center gap-2 hover:opacity-60 transition">
            <Search size={14} /> <span className="hidden sm:inline">Search</span>
          </button>
        </nav>
        <Logo onClick={() => {}} />
        <div className="flex items-center justify-end gap-4 md:gap-6 label">
          <button id="btn-currency" onClick={() => setCur(c => (c === 'KZT' ? 'USD' : 'KZT'))}
            className="hover:opacity-60 transition" title="Switch currency">{cur === 'KZT' ? 'KZ' : 'US'}</button>
          <a href="#/checkout" className="hidden sm:inline hover:opacity-60 transition">Account</a>
          <a id="btn-cart" href="#/checkout" className="flex items-center gap-1.5 hover:opacity-60 transition">
            <ShoppingBag size={14} className="sm:hidden" /> <span className="hidden sm:inline">Cart</span> ({count})
          </a>
        </div>
      </header>

      {/* search panel */}
      {searchOpen && (
        <div className="px-5 md:px-10 pb-8 fade-up">
          <div className="max-w-2xl mx-auto">
            <input autoFocus value={query} onChange={e => setQuery(e.target.value)} placeholder="Search bags, wallets, accessories…"
              className="field !bg-paper" aria-label="Search products" />
            {results.length > 0 && (
              <ul className="mt-3 divide-y divide-ink/10">
                {results.map(r => (
                  <li key={r.id}>
                    <a href={`#/product/${r.id}`} className="flex justify-between py-3 label hover:opacity-60 transition">
                      <span>{r.name} — {r.sub}</span><span>{fmt(r.kzt, cur)}</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
            {query && results.length === 0 && <p className="mt-4 label text-stone">No results</p>}
          </div>
        </div>
      )}

      {/* mobile / drawer menu */}
      <div className={`fixed inset-0 z-50 transition ${menuOpen ? 'visible' : 'invisible'}`}>
        <div onClick={() => setMenuOpen(false)} className={`absolute inset-0 bg-ink/40 transition-opacity ${menuOpen ? 'opacity-100' : 'opacity-0'}`} />
        <aside className={`absolute left-0 top-0 h-full w-[85%] max-w-sm bg-paper p-8 shadow-2xl transition-transform duration-500 ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <button onClick={() => setMenuOpen(false)} aria-label="Close menu" className="mb-12 hover:rotate-90 transition"><X size={18} /></button>
          <ul className="space-y-6 font-serif text-3xl">
            {[['Home', '#/'], ['Shop All', '#/shop'], ['Bags', '#/shop'], ['Small Goods', '#/shop'], ['Checkout', '#/checkout']].map(([t, h]) => (
              <li key={t}><a href={h} onClick={() => setMenuOpen(false)} className="hover:italic hover:pl-2 transition-all">{t}</a></li>
            ))}
          </ul>
          <p className="absolute bottom-8 label text-stone">Hold on to the good</p>
        </aside>
      </div>

      <main>
        {route.page === 'home' && <Home cur={cur} add={add} />}
        {route.page === 'shop' && <Shop cur={cur} />}
        {route.page === 'product' && <ProductPage id={route.id!} cur={cur} add={add} />}
      </main>

      <Footer />

      {toast && (
        <div role="status" className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-ink text-paper label px-5 py-3 rounded-full fade-up shadow-2xl">
          {toast} · <a href="#/checkout" className="underline">Checkout</a>
        </div>
      )}
    </div>
  );
}

/* ───────────────────────── HOME ───────────────────────── */

function Home({ cur, add }: { cur: Cur; add: (id: string) => void }) {
  const hero = byId('satchel');
  const [tab, setTab] = useState<'craft' | 'materials' | 'care'>('craft');
  const grid = ['rucksack', 'strap-clutch', 'dopp-kit', 'weekender', 'pocket-wallet', 'camera-case', 'laptop-brief', 'card-holder', 'open-wallet'].map(byId);

  const tabs = {
    craft: { h: '2007 Onwards', t: 'hardcraft is a small independent brand founded by a pair of friends in the Austrian Alps and raised in the United Kingdom, with an ambitious worldwide outlook. We are creatives who believe in the good. Clever, thoughtful, unexpected designs carefully developed and mastered by artisans in Italy.' },
    materials: { h: 'What We’re Made Of', t: 'Rich, Tuscan vegetable tanned leather — gently tumbled to age old oak drawers and hand stained. Felted wool — thick, dense and extra-strong woven once. X-Pac weatherproof cotton laminate — a natural organic duck cotton face laminated for ultimate strength.' },
    care: { h: 'Eagle Eyes', t: 'We are designers. From the initial idea to the construction and realisation we try and walk new paths finding solutions and uncommon approaches. Surprising features keep you on the edge of your seat.' },
  } as const;

  return (
    <>
      {/* HERO */}
      <Section className="pt-4 pb-16">
        <div className="relative max-w-5xl mx-auto text-center">
          <a href={`#/product/${hero.id}`} className="group block relative">
            <Img src={hero.img} alt={hero.name}
              className="mx-auto w-full max-w-3xl aspect-[4/3] md:aspect-[16/11] object-cover mix-blend-multiply drop-shadow-2xl transition duration-1000 group-hover:scale-[1.03]" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-paper px-6 text-center">
              <h1 className="font-serif text-3xl md:text-5xl italic drop-shadow-lg fade-up">Pack All Satchel Bag</h1>
              <p className="mt-3 max-w-xs font-sans text-[11px] tracking-widest uppercase drop-shadow">
                A roomy leather satchel with an adjustable strap
              </p>
              <span className="mt-6 inline-flex items-center gap-2 border border-paper px-5 py-2.5 label group-hover:bg-paper group-hover:text-ink transition">
                Discover <ArrowRight size={12} />
              </span>
            </div>
          </a>
          <button onClick={() => add(hero.id)} id="hero-add"
            className="mt-6 label border-b border-ink pb-0.5 hover:opacity-60 transition">
            Add to cart — {fmt(hero.kzt, cur)}
          </button>
        </div>
      </Section>

      {/* MANIFESTO */}
      <Section>
        <p className="max-w-2xl text-2xl md:text-3xl font-serif text-center mx-auto leading-snug py-12">
          Artisan Made Bags, Small Leather Goods &amp; Accessories
          <span className="block mt-2 italic text-stone text-xl">Since 2007</span>
        </p>
      </Section>

      {/* FEATURED GRID */}
      <Section className="pb-10">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-12 md:gap-y-16">
          {grid.map((p, i) => (
            <div key={p.id} className={i === 2 ? 'col-span-2 md:col-span-1' : ''}><Card p={p} cur={cur} /></div>
          ))}
        </div>
        <div className="text-center mt-14"><a href="#/shop" className="label border-b border-ink pb-0.5 hover:opacity-60 transition">Shop all</a></div>
      </Section>

      {/* TABS — Philosophy & Materials */}
      <Section className="py-20">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xl md:text-2xl leading-snug">
            If you think we design morning, noon and night, call melange grey clothes our daily uniform, pouch and pack everything in leather —
            then you are absolutely right. We are absolutely independent and sustainable.
          </p>
          <div role="tablist" className="mt-10 flex justify-center gap-6 label">
            {([['craft', 'The Brand'], ['care', 'Eagle Eyes'], ['materials', 'Materials']] as const).map(([k, l]) => (
              <button key={k} role="tab" aria-selected={tab === k} id={`tab-${k}`} onClick={() => setTab(k)}
                className={`pb-1 border-b transition ${tab === k ? 'border-ink' : 'border-transparent text-stone hover:text-ink'}`}>{l}</button>
            ))}
          </div>
          <div key={tab} className="mt-8 fade-up">
            <h2 className="text-3xl italic">{tabs[tab].h}</h2>
            <p className="mt-4 text-lg text-stone leading-relaxed">{tabs[tab].t}</p>
          </div>
        </div>
      </Section>

      {/* VALET TRAY */}
      <Section className="pb-16">
        <div className="relative max-w-5xl mx-auto overflow-hidden group">
          <Img src={U('photo-1523275335684-37898b6baf30', 1600)} alt="Valet tray with glasses, keys and watch"
            className="w-full aspect-[16/10] object-cover transition duration-1000 group-hover:scale-105" />
          <div className="absolute inset-0 bg-ink/35" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-paper text-center px-6">
            <h2 className="text-3xl md:text-5xl italic max-w-xl leading-tight">The Hold On Valet Tray, Designed to Catch What Else You Leave Behind</h2>
            <a href="#/shop" className="mt-6 label border-b border-paper pb-0.5">Discover</a>
          </div>
        </div>
        <p className="max-w-xl mx-auto text-center mt-10 text-lg text-stone leading-relaxed">
          A considered place for your everyday carry — wool-felt base, leather-wrapped edge, shaped to live on a dresser or in a bag.
        </p>
      </Section>

      {/* MOODBOARD */}
      <Section className="pb-20">
        <div className="max-w-5xl mx-auto bg-[#c7c3b6] p-4 md:p-8 shadow-inner">
          <div className="grid grid-cols-6 grid-rows-[repeat(4,minmax(0,1fr))] gap-3 md:gap-4 aspect-[4/3]">
            {[
              ['photo-1473188588951-666fce8e7c68', 'col-span-2 row-span-2'],
              ['photo-1590874103328-eac38a683ce7', 'col-span-2 row-span-1'],
              ['photo-1544816155-12df9643f363', 'col-span-2 row-span-2'],
              ['photo-1559563458-527698bf5295', 'col-span-1 row-span-1'],
              ['photo-1548036328-c9fa89d128fa', 'col-span-1 row-span-2'],
              ['photo-1523275335684-37898b6baf30', 'col-span-2 row-span-1'],
              ['photo-1627123424574-724758594e93', 'col-span-2 row-span-1'],
            ].map(([id, cls], i) => (
              <div key={i} className={`${cls} overflow-hidden bg-paper p-1 md:p-1.5 shadow-lg hover:z-10 hover:scale-105 transition duration-500 ${i % 2 ? 'rotate-1' : '-rotate-1'}`}>
                <Img src={U(id, 500)} alt={`Atelier moodboard ${i + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* MATERIALS */}
      <Section className="pb-20">
        <h2 className="text-center text-3xl md:text-4xl italic mb-12">The Materials</h2>
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-10">
          {[
            ['photo-1544816155-12df9643f363', 'Vegetable Tanned Leather', 'Full-grain Italian calf, tanned slowly with tree bark. It darkens and softens, gaining a patina that is entirely yours.'],
            ['photo-1473188588951-666fce8e7c68', 'Felted Wool', 'Dense, thick Italian felt — warm to the touch, naturally water-resistant and wonderfully quiet inside a bag.'],
            ['photo-1553531384-cc64ac80f931', 'Crafted Hardware', 'Solid brass and nickel fittings, hand-set and riveted, made to be repaired rather than replaced.'],
          ].map(([id, t, d]) => (
            <article key={t} className="group text-center">
              <div className="overflow-hidden aspect-[4/5]">
                <Img src={U(id, 700)} alt={t} className="w-full h-full object-cover transition duration-700 group-hover:scale-105" />
              </div>
              <h3 className="mt-5 text-2xl italic">{t}</h3>
              <p className="mt-2 text-stone leading-relaxed">{d}</p>
            </article>
          ))}
        </div>
      </Section>

      {/* BENEFITS */}
      <Section className="pb-24">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 border-t border-ink/15 pt-12">
          {[
            [Hammer, 'Handmade in Small Batches', 'Every piece is cut and stitched by a single artisan.'],
            [Plane, 'Worldwide Express Shipping', 'Duties refunded, tracked door to door.'],
            [ShieldCheck, 'Lifetime Guarantee', 'On stitching and hardware. Forever.'],
            [PenLine, 'Personal Monogramming', 'Add hot-foil initials or a custom emboss.'],
          ].map(([Icon, t, d]) => {
            const I = Icon as typeof Hammer;
            return (
              <div key={t as string} className="text-center group">
                <I size={22} strokeWidth={1.2} className="mx-auto mb-4 transition group-hover:-translate-y-1" />
                <h3 className="label text-[10px] mb-2">{t as string}</h3>
                <p className="text-stone leading-snug">{d as string}</p>
              </div>
            );
          })}
        </div>
      </Section>
    </>
  );
}

/* ───────────────────────── SHOP ───────────────────────── */

function Shop({ cur }: { cur: Cur }) {
  const [tab, setTab] = useState<(typeof SHOP_TABS)[number]>('All');
  const list = tab === 'All' ? PRODUCTS : PRODUCTS.filter(p => p.category === tab);
  return (
    <Section className="pb-24">
      <h1 className="text-center text-4xl italic mb-8">Shop</h1>
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 label mb-12">
        {SHOP_TABS.map(t => (
          <button key={t} id={`shop-tab-${t}`} onClick={() => setTab(t)}
            className={`pb-1 border-b transition ${tab === t ? 'border-ink' : 'border-transparent text-stone hover:text-ink'}`}>{t}</button>
        ))}
      </div>
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-12">
        {list.map(p => <Card key={p.id} p={p} cur={cur} />)}
      </div>
    </Section>
  );
}

/* ───────────────────────── PRODUCT ───────────────────────── */

function ProductPage({ id, cur, add }: { id: string; cur: Cur; add: (id: string, n?: number) => void }) {
  const p = PRODUCTS.find(x => x.id === id);
  const [qty, setQty] = useState(1);
  const [open, setOpen] = useState<string | null>('Details');
  if (!p) return <Section className="py-24 text-center"><p className="text-2xl">Product not found. <a className="underline" href="#/shop">Back to shop</a></p></Section>;
  const gallery = [p.img, p.img2, ...PRODUCTS.filter(x => x.id !== p.id).slice(0, 4).map(x => x.img)];
  return (
    <Section className="pb-24">
      <div className="max-w-6xl mx-auto grid md:grid-cols-[1fr_340px] gap-10">
        <div className="grid grid-cols-2 gap-3 order-2 md:order-1">
          {gallery.map((g, i) => (
            <div key={i} className="overflow-hidden aspect-square group">
              <Img src={g} alt={`${p.name} view ${i + 1}`} className="w-full h-full object-cover transition duration-700 group-hover:scale-105" />
            </div>
          ))}
        </div>
        <div className="order-1 md:order-2 md:sticky md:top-6 self-start">
          <h1 className="text-3xl italic">{p.name}</h1>
          <p className="label text-stone mt-1">{p.sub}</p>
          <p className="label mt-4">{fmt(p.kzt, cur)}</p>
          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center border border-ink/30 rounded-full">
              <button aria-label="Decrease" onClick={() => setQty(q => Math.max(1, q - 1))} className="p-2.5 hover:opacity-60"><Minus size={12} /></button>
              <span className="label w-6 text-center">{qty}</span>
              <button aria-label="Increase" onClick={() => setQty(q => q + 1)} className="p-2.5 hover:opacity-60"><Plus size={12} /></button>
            </div>
            <button id="add-to-cart" onClick={() => add(p.id, qty)}
              className="flex-1 bg-ink text-paper label py-3.5 rounded-md hover:bg-stone transition">Add to cart</button>
          </div>
          <div className="mt-8 border-t border-ink/15">
            {[
              ['Details', 'Full-grain vegetable tanned calf leather, hand-stitched with waxed linen thread and finished in our Italian workshop.'],
              ['Materials', 'Italian leather, felted wool lining, solid brass hardware.'],
              ['Shipping', 'Express DHL / UPS worldwide. Duties and customs refunded.'],
            ].map(([t, d]) => (
              <div key={t} className="border-b border-ink/15">
                <button onClick={() => setOpen(open === t ? null : t)} className="w-full flex justify-between items-center py-4 label">
                  {t} <ChevronDown size={14} className={`transition ${open === t ? 'rotate-180' : ''}`} />
                </button>
                {open === t && <p className="pb-4 text-stone leading-relaxed fade-up">{d}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ───────────────────────── FOOTER ───────────────────────── */

function Footer() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const submit = (e: FormEvent) => { e.preventDefault(); if (email) setDone(true); };
  return (
    <footer className="bg-[#F1EFE8] text-center px-5 py-16 md:py-20">
      <div className="flex justify-center mb-6"><Stamp /></div>
      <h2 className="font-serif text-3xl md:text-4xl uppercase tracking-wide">Hold on to the good</h2>
      <p className="max-w-3xl mx-auto mt-8 text-xl md:text-2xl leading-snug">
        Artisan made bags, small leather goods and accessories. Fine lifestyle accessories with down to earth aesthetics and a human touch since 2007.
      </p>
      <form onSubmit={submit} className="mt-12 max-w-sm mx-auto">
        {done ? (
          <p className="label flex items-center justify-center gap-2"><Check size={14} /> Welcome to the Members Club</p>
        ) : (
          <>
            <label htmlFor="sub-email" className="label text-[10px] block mb-3">Subscribe to the Members Club</label>
            <div className="flex border-b border-ink">
              <input id="sub-email" type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="Email address" className="flex-1 bg-transparent py-2 font-sans text-[12px] outline-none placeholder:text-stone" />
              <button type="submit" aria-label="Subscribe" className="hover:translate-x-1 transition"><ArrowRight size={14} /></button>
            </div>
          </>
        )}
      </form>
      <div className="mt-16 flex flex-wrap justify-center gap-x-5 gap-y-2 label text-[9px] text-stone">
        <span>© hardcraft 2026</span><a href="#/">Contact</a><a href="#/">Privacy</a><a href="#/">Terms</a><a href="#/">Refunds</a>
      </div>
    </footer>
  );
}

/* ───────────────────────── CHECKOUT ───────────────────────── */

function Checkout({ cart, cur, setQty, clear }: { cart: Record<string, number>; cur: Cur; setQty: (id: string, n: number) => void; clear: () => void }) {
  const items = Object.entries(cart).map(([id, n]) => ({ p: byId(id), n }));
  const subtotal = items.reduce((a, i) => a + i.p.kzt * i.n, 0);
  const shipping = items.length ? 21600 : 0;
  const [code, setCode] = useState('');
  const [placed, setPlaced] = useState(false);
  const [emailOffers, setEmailOffers] = useState(true);
  const [textOffers, setTextOffers] = useState(false);
  const [billing, setBilling] = useState(true);

  const Check_ = ({ on, set, label }: { on: boolean; set: (v: boolean) => void; label: string }) => (
    <button type="button" onClick={() => set(!on)} className="flex items-center gap-2.5 font-sans text-[11px] text-left">
      <span className={`w-4 h-4 rounded-[4px] border border-ink flex items-center justify-center ${on ? 'bg-ink text-paper' : ''}`}>
        {on && <Check size={11} />}
      </span>{label}
    </button>
  );

  return (
    <div className="min-h-screen bg-paper font-serif">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 md:gap-16 px-5 py-8">
        <form
          onSubmit={(e: FormEvent) => { e.preventDefault(); if (items.length) { setPlaced(true); clear(); } }}
          className="space-y-3 max-w-md w-full md:justify-self-end"
        >
          <div className="flex justify-center items-center mb-4 relative">
            <Logo onClick={() => {}} />
            <a href="#/" className="absolute right-0" aria-label="Back to shop"><ShoppingBag size={16} /></a>
          </div>
          <p className="text-center label text-[10px] text-stone">Express checkout</p>
          <button type="button" className="w-full bg-[#5a31f4] text-white font-sans font-medium text-lg py-3 rounded-md hover:brightness-110 transition">shop</button>
          <p className="text-center label text-[10px] text-stone">or</p>

          <div className="flex justify-between items-baseline pt-2"><h2 className="font-display text-xl font-bold">Contact</h2><a href="#/" className="font-sans text-[11px] underline">Sign in</a></div>
          <div className="relative"><input required type="email" placeholder="Email" className="field pr-9" /><HelpCircle size={14} className="absolute right-3 top-3.5 text-stone" /></div>
          <Check_ on={emailOffers} set={setEmailOffers} label="Email me with news and offers" />

          <h2 className="font-display text-xl font-bold pt-5">Delivery</h2>
          <div className="relative">
            <select className="field appearance-none pt-5 pb-2" defaultValue="Kazakhstan" aria-label="Country">
              <option>Kazakhstan</option><option>United Kingdom</option><option>United States</option><option>Germany</option><option>Italy</option>
            </select>
            <span className="absolute left-3 top-1.5 font-sans text-[9px] text-stone pointer-events-none">Country/Region</span>
            <ChevronDown size={14} className="absolute right-3 top-4 pointer-events-none" />
          </div>
          <div className="grid grid-cols-2 gap-3"><input required placeholder="First name" className="field" /><input required placeholder="Last name" className="field" /></div>
          <input required placeholder="Address" className="field" />
          <input placeholder="Apartment, suite, etc. (optional)" className="field" />
          <div className="grid grid-cols-2 gap-3"><input required placeholder="City" className="field" /><input placeholder="Postal code (optional)" className="field" /></div>
          <div className="relative"><input placeholder="Phone" className="field pr-9" /><HelpCircle size={14} className="absolute right-3 top-3.5 text-stone" /></div>
          <Check_ on={textOffers} set={setTextOffers} label="Text me with news and offers" />

          <h3 className="font-display text-base font-bold pt-4">Shipping method</h3>
          <div className="flex justify-between border border-ink rounded-md px-3 py-3.5 font-sans text-[11px] font-medium bg-ink/[0.03]">
            <span>Express Shipping (DHL/UPS)</span><span>{fmt(shipping || 21600, 'KZT')}</span>
          </div>

          <div className="flex justify-between items-end pt-4">
            <h2 className="font-display text-xl font-bold">Pay with credit card</h2>
            <div className="flex gap-1">
              <span className="bg-[#1434CB] text-white text-[8px] font-bold italic px-1.5 py-1 rounded-sm">VISA</span>
              <span className="bg-white w-7 h-5 rounded-sm flex items-center justify-center"><i className="w-2.5 h-2.5 rounded-full bg-[#0099DF] -mr-1" /><i className="w-2.5 h-2.5 rounded-full bg-[#EB001B]" /></span>
              <span className="bg-ink w-7 h-5 rounded-sm flex items-center justify-center"><i className="w-2.5 h-2.5 rounded-full bg-[#EB001B] -mr-1" /><i className="w-2.5 h-2.5 rounded-full bg-[#F79E1B]" /></span>
            </div>
          </div>
          <p className="font-sans text-[11px] text-stone">All transactions are secure and encrypted.</p>
          <div className="relative"><input required inputMode="numeric" placeholder="Card number" className="field pr-9" /><Lock size={14} className="absolute right-3 top-3.5 text-stone" /></div>
          <div className="grid grid-cols-2 gap-3">
            <input required placeholder="Expiration date (MM / YY)" className="field" />
            <div className="relative"><input required placeholder="Security code" className="field pr-9" /><HelpCircle size={14} className="absolute right-3 top-3.5 text-stone" /></div>
          </div>
          <input required placeholder="Name on card" className="field" />
          <Check_ on={billing} set={setBilling} label="Use shipping address as billing address" />

          <div className="pt-8">
            <p className="font-sans text-[11px] font-medium">Save my information for a faster checkout</p>
            <p className="font-sans text-[9px] text-stone mt-1">By paying, you agree to create a Shop account subject to Shop’s Terms and Privacy Policy.</p>
          </div>

          <button type="submit" id="review-order" disabled={!items.length}
            className="w-full bg-black text-white font-sans text-[12px] font-medium py-4 rounded-md mt-6 hover:bg-stone transition disabled:opacity-40">
            Review order
          </button>
          <p className="pt-8 font-sans text-[10px] underline">Terms and policies</p>
        </form>

        <aside className="md:pt-8 max-w-md w-full">
          {placed && (
            <div className="border border-ink rounded-md p-5 mb-6 fade-up">
              <p className="font-display text-lg font-bold flex items-center gap-2"><Check size={16} /> Order received</p>
              <p className="font-sans text-[11px] text-stone mt-2">Thank you — your handmade piece is entering the workshop. <a href="#/" className="underline">Continue shopping</a></p>
            </div>
          )}
          {items.length === 0 && !placed && <p className="font-sans text-[12px] text-stone">Your cart is empty. <a href="#/shop" className="underline">Shop all</a></p>}
          {items.map(({ p, n }) => (
            <div key={p.id} className="flex items-center gap-3 mb-3">
              <div className="relative w-12 h-12 rounded-md border border-ink/20 bg-paper overflow-hidden shrink-0">
                <Img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                <span className="absolute -top-0 -right-0 bg-black text-white text-[9px] font-sans w-4 h-4 rounded-full flex items-center justify-center">{n}</span>
              </div>
              <div className="flex-1 font-sans text-[11px] font-medium">{p.name} . {p.sub}
                <div className="flex gap-2 mt-1 text-stone">
                  <button type="button" aria-label="Less" onClick={() => setQty(p.id, n - 1)}><Minus size={11} /></button>
                  <button type="button" aria-label="More" onClick={() => setQty(p.id, n + 1)}><Plus size={11} /></button>
                </div>
              </div>
              <span className="font-sans text-[11px]">{fmt(p.kzt * n, cur)}</span>
            </div>
          ))}
          <div className="flex gap-2 border border-ink/20 rounded-md p-1.5 mt-4">
            <input value={code} onChange={e => setCode(e.target.value)} placeholder="Discount code or gift card"
              className="flex-1 bg-transparent px-2 font-sans text-[11px] outline-none placeholder:text-stone" />
            <button type="button" className="font-sans text-[11px] px-3 py-1.5 bg-ink/10 rounded-md hover:bg-ink hover:text-paper transition">Apply</button>
          </div>
          <dl className="mt-6 space-y-2 font-sans text-[11px] font-medium">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>{fmt(subtotal, cur)}</dd></div>
            <div className="flex justify-between"><dt>Shipping</dt><dd>{fmt(shipping, cur)}</dd></div>
            <div className="flex justify-between items-baseline pt-1 font-display text-base font-bold">
              <dt>Total</dt><dd><span className="font-sans text-[9px] text-stone mr-2">{cur}</span>{fmt(subtotal + shipping, cur)}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}
