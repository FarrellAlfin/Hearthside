import { useState, useEffect, useRef } from "react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

import { createClient } from '@supabase/supabase-js';

// eslint-disable-next-line no-unused-vars
const supabase = createClient(
  'https://kxajjlrjgrabtmyksqrq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4YWpqbHJqZ3JhYnRteWtzcXJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3NjIyMzMsImV4cCI6MjA4OTMzODIzM30.UCUOnwpyP4oBJyHhaCEM4kym_UlDY32a2SWP3x8atQU'
);

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
const C = {
  primary:"#C4622D", primaryDark:"#A05025", primaryBg:"#FBEEE6",
  bg:"#FDF7F0", surface:"#FFFFFF", border:"rgba(196,98,45,0.13)",
  sidebar:"#1C0E07", sidebarText:"#F5DCC8", sidebarMuted:"rgba(245,220,200,0.45)",
  sidebarActive:"rgba(196,98,45,0.2)",
  text:"#1C0E07", muted:"#7A5548",
  success:"#1E7A48", successBg:"#E9F7EF",
  warning:"#A07010", warningBg:"#FFF7E0",
  danger:"#B52020", dangerBg:"#FDEAEA",
  info:"#1A6B9C", infoBg:"#E6F3FA",
  charity:"#6B3FA0", charityBg:"#F3EDFC",
  chat:"#0D6E5C", chatBg:"#E6F7F4",
};
const tt = { fontFamily:"'Playfair Display', Georgia, serif" };

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const STORES = [
  { id:1, name:"Maria's Home Bakery",    owner:"Maria Santos",   hood:"Leslieville",    emoji:"🍞", rating:4.9, reviews:127, badge:"Top Rated",  desc:"Sourdough specialist. Everything baked fresh at 5am.", tags:["Bread","Pastry"], deliveryFee:5, minOrder:20 },
  { id:2, name:"Aisha's Sweet Corner",   owner:"Aisha Kamara",   hood:"Kensington",     emoji:"🧁", rating:4.7, reviews:89,  badge:"New",        desc:"Afro-Caribbean fusion cakes and celebration desserts.", tags:["Cake","Dessert"], deliveryFee:6, minOrder:25 },
  { id:3, name:"The Dumpling Den",       owner:"Li Wei",         hood:"Chinatown",      emoji:"🥟", rating:4.8, reviews:203, badge:"Community ♥", desc:"Hand-folded dumplings, scallion pancakes, red bean buns.", tags:["Savoury","Asian"], deliveryFee:4, minOrder:15 },
  { id:4, name:"Florencia's Empanadas",  owner:"Florencia Ruiz", hood:"Little Portugal",emoji:"🫓", rating:4.6, reviews:61,  badge:null,         desc:"Crispy empanadas — beef, chicken, spinach & cheese.", tags:["Savoury","Latin"], deliveryFee:5, minOrder:18 },
  { id:5, name:"Biji's Spice Kitchen",   owner:"Biji Patel",     hood:"Brampton",       emoji:"🫙", rating:4.8, reviews:145, badge:"Top Rated",  desc:"Homemade chutneys, pickles, and fresh-baked roti.", tags:["Condiments","Bread"], deliveryFee:7, minOrder:20 },
  { id:6, name:"Sunshine Sourdough",     owner:"Tom Richards",   hood:"Roncesvalles",   emoji:"☀️", rating:4.5, reviews:44,  badge:"New",        desc:"Country loaves, focaccia, and seasonal fruit crumbles.", tags:["Bread","Pastry"], deliveryFee:5, minOrder:20 },
];
const STORE_PRODUCTS = {
  1:[
    { id:101, name:"Sourdough Loaf",       price:12, emoji:"🍞", desc:"Tangy slow-fermented sourdough with a golden crust.",       stock:8  },
    { id:102, name:"Chocolate Brownies",   price:18, emoji:"🍫", desc:"Dense fudgy brownies with 70% dark chocolate & sea salt.",  stock:12 },
    { id:103, name:"Cinnamon Rolls (6pc)", price:22, emoji:"🌀", desc:"Pillowy rolls filled with cinnamon butter & cream cheese.", stock:6  },
    { id:104, name:"Lemon Drizzle Cake",   price:28, emoji:"🍋", desc:"Moist lemon sponge soaked in a citrusy drizzle glaze.",    stock:4  },
  ],
  2:[
    { id:201, name:"Jollof Rice Cake",     price:32, emoji:"🎂", desc:"A show-stopping celebration cake inspired by jollof rice.", stock:3  },
    { id:202, name:"Chin Chin Cookies",    price:16, emoji:"🍪", desc:"Crunchy West African fried dough biscuits.",                stock:20 },
    { id:203, name:"Rum Fruit Cake",       price:38, emoji:"🍰", desc:"Dense, boozy fruit cake soaked for 3 days.",               stock:5  },
  ],
  3:[
    { id:301, name:"Pork Dumplings (12pc)",price:14, emoji:"🥟", desc:"Classic pork & cabbage, hand-folded wonton wrappers.",     stock:15 },
    { id:302, name:"Scallion Pancakes",    price:10, emoji:"🫓", desc:"Flaky, crispy layered pancakes with sesame oil.",          stock:10 },
    { id:303, name:"Red Bean Buns (6pc)",  price:12, emoji:"🍡", desc:"Soft steamed buns filled with sweet red bean paste.",      stock:8  },
    { id:304, name:"Veggie Dumplings",     price:13, emoji:"🥬", desc:"Tofu, shiitake & glass noodle filling.",                  stock:12 },
  ],
  4:[
    { id:401, name:"Beef Empanadas (6pc)", price:18, emoji:"🫓", desc:"Spiced ground beef with olives & hard boiled egg.",       stock:10 },
    { id:402, name:"Spinach & Cheese",     price:16, emoji:"🧀", desc:"Creamy spinach and queso fresco empanadas.",              stock:8  },
    { id:403, name:"Chicken Empanadas",    price:17, emoji:"🍗", desc:"Shredded chicken with roasted peppers & cumin.",          stock:10 },
  ],
  5:[
    { id:501, name:"Mango Chutney (jar)",  price:12, emoji:"🥭", desc:"Sweet-tangy mango chutney, great with everything.",       stock:20 },
    { id:502, name:"Mixed Pickle",         price:10, emoji:"🫙", desc:"Classic South Asian achaar, tangy and spiced.",           stock:15 },
    { id:503, name:"Fresh Roti (6pc)",     price:8,  emoji:"🫓", desc:"Soft, fresh-made whole wheat roti.",                     stock:20 },
  ],
  6:[
    { id:601, name:"Country Sourdough",    price:14, emoji:"☀️", desc:"Open crumb, chewy crust country loaf.",                  stock:6  },
    { id:602, name:"Focaccia",             price:16, emoji:"🌿", desc:"Rosemary & sea salt focaccia, dimpled and golden.",      stock:5  },
    { id:603, name:"Seasonal Crumble",     price:22, emoji:"🍑", desc:"This week: peach & ginger crumble with oat topping.",   stock:4  },
  ],
};
const CHARITIES = [
  { id:1, name:"Daily Bread Food Bank",   emoji:"🍞", desc:"Toronto's largest food bank, serving 60,000 people/month.", hood:"City-wide"     },
  { id:2, name:"Second Harvest",          emoji:"🥗", desc:"Canada's largest food rescue organization.",               hood:"City-wide"     },
  { id:3, name:"Seva Food Bank",          emoji:"🙏", desc:"Culturally appropriate food for Peel Region families.",    hood:"Brampton"      },
  { id:4, name:"The Stop Community Food", emoji:"🌱", desc:"Community food programs in Davenport.",                   hood:"Davenport"     },
];
const HOODS = ["All","Leslieville","Kensington","Chinatown","Little Portugal","Brampton","Roncesvalles"];
const CHAT_INIT = [
  { id:1, seller:"Maria's Home Bakery",   hood:"Leslieville",     emoji:"🍞", time:"8:02am",  msg:"Fresh sourdough just out of the oven! 8 loaves available today 🔥 Order by noon for afternoon pickup." },
  { id:2, seller:"The Dumpling Den",      hood:"Chinatown",       emoji:"🥟", time:"8:45am",  msg:"Making an extra batch of pork dumplings today — 5 orders left at the special price of $12/dozen. First come first served!" },
  { id:3, seller:"Biji's Spice Kitchen",  hood:"Brampton",        emoji:"🫙", time:"9:10am",  msg:"New batch of mango chutney and mixed pickle ready 🥭 Also fresh roti every morning this week." },
  { id:4, seller:"Aisha's Sweet Corner",  hood:"Kensington",      emoji:"🧁", time:"10:30am", msg:"Taking custom cake orders for Easter weekend. DM me your design! Minimum 3 days notice needed 🎂" },
  { id:5, seller:"Sunshine Sourdough",    hood:"Roncesvalles",    emoji:"☀️", time:"11:00am", msg:"Focaccia is back on the menu after popular demand. Rosemary & sea salt, ready by 2pm today." },
];
const REV_DATA = [
  { month:"Oct", revenue:420,  expenses:180, profit:240 },
  { month:"Nov", revenue:680,  expenses:215, profit:465 },
  { month:"Dec", revenue:1240, expenses:385, profit:855 },
  { month:"Jan", revenue:890,  expenses:295, profit:595 },
  { month:"Feb", revenue:1050, expenses:325, profit:725 },
  { month:"Mar", revenue:1380, expenses:415, profit:965 },
];
const ORDERS_DATA = [
  { id:"#1042", customer:"Sarah M.",  items:"Sourdough x2, Brownies x1",          total:42, status:"delivered", date:"Mar 15" },
  { id:"#1041", customer:"James P.",  items:"Cinnamon Rolls x1",                  total:22, status:"ready",     date:"Mar 15" },
  { id:"#1040", customer:"Aisha K.",  items:"Lemon Drizzle x1, Banana Bread x1",  total:42, status:"preparing", date:"Mar 14" },
  { id:"#1039", customer:"Tom R.",    items:"Red Velvet x2, Brownies x1",         total:66, status:"delivered", date:"Mar 14" },
];
const STATUS_MAP = {
  delivered:{ bg:"#E9F7EF", color:"#1E7A48", label:"✓ Delivered" },
  ready:    { bg:"#E6F3FA", color:"#1A6B9C", label:"◉ Ready"     },
  preparing:{ bg:"#FFF7E0", color:"#A07010", label:"◌ Preparing" },
  cancelled:{ bg:"#FDEAEA", color:"#B52020", label:"✕ Cancelled" },
};
const SELLER_NAV = [
  { id:"dashboard",  icon:"⊞", label:"Dashboard"    },
  { id:"storefront", icon:"⊡", label:"Storefront"   },
  { id:"orders",     icon:"⊟", label:"Orders"       },
  { id:"finances",   icon:"◈", label:"Finances"     },
  { id:"delivery",   icon:"⊕", label:"Delivery"     },
  { id:"marketing",  icon:"✦", label:"AI Marketing" },
  { id:"community",  icon:"◎", label:"Community"    },
];
const TIME_SLOTS = [
  { value:"next-day-am", label:"Tomorrow, 9am–12pm"  },
  { value:"next-day-pm", label:"Tomorrow, 12pm–5pm"  },
  { value:"twoday-am",   label:"In 2 days, 9am–12pm" },
  { value:"twoday-pm",   label:"In 2 days, 12pm–5pm" },
];

// ─── SHARED COMPONENTS ───────────────────────────────────────────────────────
function Badge({ status }) {
  const s = STATUS_MAP[status]||STATUS_MAP.preparing;
  return <span style={{ background:s.bg, color:s.color, fontSize:11, fontWeight:600, padding:"3px 9px", borderRadius:20, whiteSpace:"nowrap" }}>{s.label}</span>;
}
function KPI({ label, value, sub, color }) {
  return (
    <div style={{ background:C.surface, border:`0.5px solid ${C.border}`, borderRadius:12, padding:"1rem 1.25rem" }}>
      <p style={{ fontSize:11, color:C.muted, margin:"0 0 6px", textTransform:"uppercase", letterSpacing:"0.07em", fontWeight:600 }}>{label}</p>
      <p style={{ fontSize:26, fontWeight:700, margin:"0 0 3px", color:color||C.text, ...tt }}>{value}</p>
      {sub && <p style={{ fontSize:12, color:C.muted, margin:0 }}>{sub}</p>}
    </div>
  );
}
function Toggle({ val, onChange }) {
  return (
    <div onClick={onChange} style={{ width:40, height:22, borderRadius:11, background:val?C.primary:"#C8B8B0", cursor:"pointer", position:"relative", flexShrink:0 }}>
      <div style={{ width:16, height:16, borderRadius:"50%", background:"#FFF", position:"absolute", top:3, left:val?21:3, transition:"left 0.18s" }}/>
    </div>
  );
}
function AuthInput({ label, ph, type="text", value, onChange, onEnter }) {
  return (
    <div style={{ marginBottom:13 }}>
      <label style={{ fontSize:11, fontWeight:600, color:C.muted, display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.06em" }}>{label}</label>
      <input type={type} value={value} onChange={onChange} placeholder={ph} onKeyDown={e=>e.key==="Enter"&&onEnter()}
        style={{ width:"100%", padding:"10px 12px", border:`1px solid ${C.border}`, borderRadius:8, fontSize:13, color:C.text, background:C.bg, outline:"none", boxSizing:"border-box" }}/>
    </div>
  );
}

// ─── AUTH SCREEN ─────────────────────────────────────────────────────────────
function AuthScreen({ onAuth }) {
  const [role, setRole]   = useState("customer");
  const [mode, setMode]   = useState("login");
  const [form, setForm]   = useState({ email:"", password:"", name:"", business:"", hood:"Leslieville" });
  const [err,  setErr]    = useState("");

  const submit = async () => {
    if (!form.email||!form.password) { setErr("Please fill in all required fields."); return; }
    if (mode==="signup"&&!form.name)  { setErr("Please enter your name."); return; }
    setErr("");
    onAuth({ name:form.name||"Guest", email:form.email, business:form.business||"My Bakery", hood:form.hood, role });
  };

  return (
    <div style={{ minHeight:"100vh", background:C.sidebar, display:"flex", alignItems:"center", justifyContent:"center", padding:"2rem", fontFamily:"'Outfit', sans-serif" }}>
      <div style={{ background:C.surface, borderRadius:20, padding:"2.5rem", width:420, maxWidth:"100%" }}>
        <div style={{ textAlign:"center", marginBottom:"1.75rem" }}>
          <div style={{ fontSize:44, marginBottom:8 }}>🍞</div>
          <h1 style={{ ...tt, fontSize:26, color:C.text, margin:"0 0 5px" }}>Hearthside</h1>
          <p style={{ color:C.muted, fontSize:13, margin:0 }}>Home-baked goods from your neighbours</p>
        </div>

        {/* Role selector */}
        <div style={{ marginBottom:"1.25rem" }}>
          <p style={{ fontSize:11, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.07em", margin:"0 0 8px" }}>I am a...</p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
            {[{ v:"customer", icon:"🛍️", label:"Customer", sub:"Browse & order" },{ v:"seller", icon:"👩‍🍳", label:"Seller", sub:"Manage my bakery" }].map(r=>(
              <button key={r.v} onClick={()=>setRole(r.v)} style={{
                padding:"12px", border:`2px solid ${role===r.v?C.primary:C.border}`,
                borderRadius:10, background:role===r.v?C.primaryBg:"transparent", cursor:"pointer", textAlign:"left"
              }}>
                <p style={{ fontSize:18, margin:"0 0 3px" }}>{r.icon}</p>
                <p style={{ fontSize:13, fontWeight:600, color:role===r.v?C.primary:C.text, margin:"0 0 1px" }}>{r.label}</p>
                <p style={{ fontSize:11, color:C.muted, margin:0 }}>{r.sub}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Sign in / Sign up tabs */}
        <div style={{ display:"flex", background:C.bg, borderRadius:10, padding:3, marginBottom:"1.25rem" }}>
          {["login","signup"].map(m=>(
            <button key={m} onClick={()=>{ setMode(m); setErr(""); }} style={{
              flex:1, padding:"8px", border:"none", borderRadius:8, cursor:"pointer", fontSize:13, fontWeight:500,
              background:mode===m?C.surface:"transparent", color:mode===m?C.text:C.muted,
              boxShadow:mode===m?"0 1px 3px rgba(0,0,0,0.08)":"none"
            }}>{m==="login"?"Sign In":"Create Account"}</button>
          ))}
        </div>

        {mode==="signup" && <AuthInput label="Full Name *" ph="e.g. Maria Santos" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} onEnter={submit}/>}
        {mode==="signup" && role==="seller" && <AuthInput label="Bakery Name" ph="e.g. Maria's Home Bakery" value={form.business} onChange={e=>setForm({...form,business:e.target.value})} onEnter={submit}/>}
        {mode==="signup" && (
          <div style={{ marginBottom:13 }}>
            <label style={{ fontSize:11, fontWeight:600, color:C.muted, display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.06em" }}>Your Neighbourhood</label>
            <select value={form.hood} onChange={e=>setForm({...form,hood:e.target.value})}
              style={{ width:"100%", padding:"10px 12px", border:`1px solid ${C.border}`, borderRadius:8, fontSize:13, color:C.text, background:C.bg, outline:"none" }}>
              {HOODS.filter(h=>h!=="All").map(h=><option key={h} value={h}>{h}</option>)}
            </select>
          </div>
        )}
        <AuthInput label="Email *"    ph="your@email.com" type="email"    value={form.email}    onChange={e=>setForm({...form,email:e.target.value})}    onEnter={submit}/>
        <AuthInput label="Password *" ph="••••••••"        type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} onEnter={submit}/>
        {err && <p style={{ color:C.danger, fontSize:12, margin:"0 0 12px" }}>{err}</p>}

        <button onClick={submit} style={{ width:"100%", padding:"12px", background:C.primary, color:"#FFF", border:"none", borderRadius:10, fontSize:14, fontWeight:700, cursor:"pointer", marginBottom:"1rem" }}>
          {mode==="login"?"Sign In →":"Create Account →"}
        </button>
        <div style={{ background:C.primaryBg, borderRadius:8, padding:"10px 12px", textAlign:"center" }}>
          <p style={{ fontSize:12, color:C.muted, margin:0 }}>Demo: any email & password works</p>
        </div>
        <p style={{ textAlign:"center", fontSize:12, color:C.muted, margin:"1rem 0 0" }}>
          {mode==="login"?"New here? ":"Already have an account? "}
          <span onClick={()=>{ setMode(mode==="login"?"signup":"login"); setErr(""); }} style={{ color:C.primary, cursor:"pointer", fontWeight:600 }}>
            {mode==="login"?"Create account":"Sign in"}
          </span>
        </p>
      </div>
    </div>
  );
}

// ─── CUSTOMER APP ─────────────────────────────────────────────────────────────
function CustomerApp({ user, onSignOut }) {
  const [view,        setView]        = useState("marketplace");
  const [activeStore, setActiveStore] = useState(null);
  const [cart,        setCart]        = useState({});
  const [cartStore,   setCartStore]   = useState(null);
  const [hoodFilter,  setHoodFilter]  = useState("All");
  const [showCart,         setShowCart]         = useState(false);
  const [isCharity,        setIsCharity]        = useState(false);
  const [selectedCharity,  setSelectedCharity]  = useState(null);

  const cartCount   = Object.values(cart).reduce((s,q)=>s+q,0);
  const cartStoreObj= STORES.find(s=>s.id===cartStore);
  const cartProducts= cartStore ? (STORE_PRODUCTS[cartStore]||[]).filter(p=>cart[p.id]).map(p=>({...p,qty:cart[p.id]})) : [];
  const subtotal    = cartProducts.reduce((s,p)=>s+p.price*p.qty,0);
  const delivFee    = cartStoreObj?.deliveryFee||0;
  const total       = subtotal+delivFee;

  const addToCart = (storeId, productId) => {
    if (cartStore && cartStore!==storeId) {
      if (!window.confirm("Your cart has items from another store. Start a new cart?")) return;
      setCart({}); setCartStore(null);
    }
    setCart(p=>({...p,[productId]:(p[productId]||0)+1}));
    setCartStore(storeId);
  };
  const decCart = id => setCart(p=>{ const n={...p}; n[id]>1?n[id]--:delete n[id]; return n; });

  const CUST_NAV = [
    { id:"marketplace", icon:"⊞", label:"Explore Stores"  },
    { id:"chat",        icon:"◎", label:"Community"       },
    { id:"charity",     icon:"♥", label:"Donate Food"     },
    { id:"orders",      icon:"⊟", label:"My Orders"       },
  ];

  const TopBar = () => (
    <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:"0.875rem 1.5rem", display:"flex", justifyContent:"space-between", alignItems:"center", position:"sticky", top:0, zIndex:50 }}>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <span style={{ fontSize:22 }}>🍞</span>
        <div>
          <p style={{ ...tt, fontSize:16, color:C.text, margin:0, fontWeight:600 }}>Hearthside</p>
          <p style={{ fontSize:10, color:C.muted, margin:0 }}>📍 {user.hood}</p>
        </div>
      </div>
      <div style={{ display:"flex", gap:8, alignItems:"center" }}>
        {cartCount>0 && (
          <button onClick={()=>setShowCart(true)} style={{ display:"flex", alignItems:"center", gap:7, background:C.primary, color:"#FFF", border:"none", borderRadius:8, padding:"7px 14px", fontSize:13, fontWeight:600, cursor:"pointer" }}>
            🛒 {cartCount} item{cartCount>1?"s":""} · ${total.toFixed(2)}
          </button>
        )}
        <div style={{ fontSize:12, color:C.muted }}>Hi, {user.name.split(" ")[0]}</div>
        <button onClick={onSignOut} style={{ background:"transparent", border:`1px solid ${C.border}`, borderRadius:8, padding:"6px 12px", fontSize:11, color:C.muted, cursor:"pointer" }}>Sign out</button>
      </div>
    </div>
  );

  const BottomNav = () => (
    <div style={{ position:"fixed", bottom:0, left:0, right:0, background:C.surface, borderTop:`1px solid ${C.border}`, display:"flex", zIndex:40 }}>
      {CUST_NAV.map(n=>{
        const active = view===n.id;
        return (
          <button key={n.id} onClick={()=>{ setView(n.id); setActiveStore(null); }} style={{
            flex:1, padding:"10px 4px 8px", border:"none", background:"transparent", cursor:"pointer",
            borderTop:`2px solid ${active?C.primary:"transparent"}`, display:"flex", flexDirection:"column", alignItems:"center", gap:3
          }}>
            <span style={{ fontSize:16, color:active?C.primary:C.muted }}>{n.icon}</span>
            <span style={{ fontSize:10, color:active?C.primary:C.muted, fontWeight:active?600:400 }}>{n.label}</span>
          </button>
        );
      })}
    </div>
  );

  // ── STORE DETAIL ──
  if (activeStore) {
    const store    = STORES.find(s=>s.id===activeStore);
    const products = STORE_PRODUCTS[activeStore]||[];
    return (
      <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"'Outfit', sans-serif", paddingBottom:80 }}>
        <TopBar/>
        <div style={{ background:`linear-gradient(135deg,${C.primaryBg},#FFF8F2)`, padding:"1.5rem 1.5rem 1rem", borderBottom:`1px solid ${C.border}` }}>
          <button onClick={()=>setActiveStore(null)} style={{ background:"transparent", border:"none", fontSize:13, color:C.primary, cursor:"pointer", fontWeight:600, marginBottom:10, padding:0 }}>← Back to stores</button>
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <span style={{ fontSize:48 }}>{store.emoji}</span>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                <h1 style={{ ...tt, fontSize:22, color:C.text, margin:0 }}>{store.name}</h1>
                {store.badge && <span style={{ background:store.badge==="Community ♥"?C.chatBg:C.primaryBg, color:store.badge==="Community ♥"?C.chat:C.primary, fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:20 }}>{store.badge}</span>}
              </div>
              <p style={{ fontSize:12, color:C.muted, margin:"0 0 4px" }}>📍 {store.hood} · ⭐ {store.rating} ({store.reviews} reviews)</p>
              <p style={{ fontSize:13, color:C.text, margin:0 }}>{store.desc}</p>
            </div>
          </div>
          <div style={{ display:"flex", gap:12, marginTop:10, fontSize:12, color:C.muted }}>
            <span>🚗 Delivery ${store.deliveryFee}</span>
            <span>📦 Min. order ${store.minOrder}</span>
          </div>
        </div>
        <div style={{ padding:"1.25rem 1.5rem" }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(2,minmax(0,1fr))", gap:12 }}>
            {products.map(p=>(
              <div key={p.id} style={{ background:C.surface, border:`0.5px solid ${C.border}`, borderRadius:12, padding:"1rem" }}>
                <span style={{ fontSize:32, display:"block", marginBottom:8 }}>{p.emoji}</span>
                <p style={{ ...tt, fontSize:14, fontWeight:600, color:C.text, margin:"0 0 4px" }}>{p.name}</p>
                <p style={{ fontSize:11, color:C.muted, margin:"0 0 10px", lineHeight:1.5 }}>{p.desc}</p>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ ...tt, fontSize:16, fontWeight:700, color:C.primary }}>${p.price.toFixed(2)}</span>
                  {cart[p.id] ? (
                    <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                      <button onClick={()=>decCart(p.id)} style={{ width:26, height:26, border:`1px solid ${C.border}`, borderRadius:6, background:"transparent", cursor:"pointer", fontSize:14 }}>−</button>
                      <span style={{ fontSize:13, fontWeight:600 }}>{cart[p.id]}</span>
                      <button onClick={()=>addToCart(activeStore,p.id)} style={{ width:26, height:26, border:"none", borderRadius:6, background:C.primary, cursor:"pointer", fontSize:14, color:"#FFF" }}>+</button>
                    </div>
                  ) : (
                    <button onClick={()=>addToCart(activeStore,p.id)} style={{ background:C.primary, color:"#FFF", border:"none", borderRadius:7, padding:"5px 12px", fontSize:11, fontWeight:600, cursor:"pointer" }}>Add</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <BottomNav/>
      </div>
    );
  }

  // ── CART DRAWER ──
  const CartDrawer = () => {
    const [del,  setDel]  = useState({ type:"delivery", address:"", time:"next-day-am", name:"", phone:"" });
    const [pay,  setPay]  = useState({ holder:"", card:"", expiry:"", cvv:"" });
    const [step, setStep] = useState("review");
    const [done, setDone] = useState(false);
    const [proc, setProc] = useState(false);

    const place = async () => {
      setProc(true);
      await new Promise(r=>setTimeout(r,1500));
      setProc(false); setDone(true);
    };

    if (!showCart) return null;
    return (
      <div style={{ position:"fixed", inset:0, zIndex:100, display:"flex" }}>
        <div onClick={()=>setShowCart(false)} style={{ flex:1, background:"rgba(0,0,0,0.4)" }}/>
        <div style={{ width:420, background:C.surface, overflowY:"auto", display:"flex", flexDirection:"column", fontFamily:"'Outfit', sans-serif" }}>
          {done ? (
            <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"2rem", textAlign:"center" }}>
              <div style={{ fontSize:52, marginBottom:12 }}>{isCharity?"💜":"🎉"}</div>
              <h2 style={{ ...tt, fontSize:22, color:C.text, margin:"0 0 8px" }}>{isCharity?"Donation Confirmed!":"Order Confirmed!"}</h2>
              <p style={{ color:C.muted, fontSize:13, margin:"0 0 1.5rem", lineHeight:1.6 }}>
                {isCharity?`Your food donation to ${selectedCharity?.name||"the charity"} is on its way. Thank you for giving back! 💜`:`Your order from ${cartStoreObj?.name} has been placed. They'll start baking soon!`}
              </p>
              <button onClick={()=>{ setShowCart(false); setCart({}); setCartStore(null); setIsCharity(false); setSelectedCharity(null); }} style={{ background:C.primary, color:"#FFF", border:"none", borderRadius:10, padding:"11px 28px", fontSize:13, fontWeight:700, cursor:"pointer" }}>Done</button>
            </div>
          ) : (
            <>
              <div style={{ padding:"1.25rem 1.5rem", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <p style={{ fontWeight:700, fontSize:15, color:C.text, margin:"0 0 1px" }}>{step==="review"?"Your Cart":step==="delivery"?"Delivery Details":"Payment"}</p>
                  <p style={{ fontSize:11, color:C.muted, margin:0 }}>{cartStoreObj?.name}</p>
                </div>
                <button onClick={()=>setShowCart(false)} style={{ background:"none", border:"none", fontSize:18, cursor:"pointer", color:C.muted }}>✕</button>
              </div>

              {/* Charity toggle */}
              {step==="review" && (
                <div style={{ margin:"1rem 1.5rem 0", background:C.charityBg, border:`1px solid rgba(107,63,160,0.2)`, borderRadius:10, padding:"10px 14px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:isCharity?10:0 }}>
                    <div>
                      <p style={{ fontSize:13, fontWeight:600, color:C.charity, margin:"0 0 1px" }}>💜 Donate this order to charity</p>
                      <p style={{ fontSize:11, color:C.muted, margin:0 }}>Your cart goes to people in need</p>
                    </div>
                    <Toggle val={isCharity} onChange={()=>setIsCharity(p=>!p)}/>
                  </div>
                  {isCharity && (
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
                      {CHARITIES.map(ch=>(
                        <button key={ch.id} onClick={()=>setSelectedCharity(ch)} style={{
                          padding:"8px", border:`2px solid ${selectedCharity?.id===ch.id?C.charity:"rgba(107,63,160,0.15)"}`,
                          borderRadius:8, background:selectedCharity?.id===ch.id?"rgba(107,63,160,0.08)":"transparent", cursor:"pointer", textAlign:"left"
                        }}>
                          <p style={{ fontSize:14, margin:"0 0 2px" }}>{ch.emoji}</p>
                          <p style={{ fontSize:11, fontWeight:600, color:C.charity, margin:"0 0 1px" }}>{ch.name}</p>
                          <p style={{ fontSize:10, color:C.muted, margin:0 }}>{ch.hood}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div style={{ flex:1, padding:"1rem 1.5rem", overflowY:"auto" }}>
                {step==="review" && <>
                  {cartProducts.map(p=>(
                    <div key={p.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:`0.5px solid ${C.border}` }}>
                      <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                        <span style={{ fontSize:22 }}>{p.emoji}</span>
                        <div>
                          <p style={{ fontSize:13, color:C.text, fontWeight:500, margin:0 }}>{p.name}</p>
                          <p style={{ fontSize:11, color:C.muted, margin:0 }}>× {p.qty}</p>
                        </div>
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <span style={{ fontSize:13, fontWeight:600 }}>${(p.price*p.qty).toFixed(2)}</span>
                        <button onClick={()=>decCart(p.id)} style={{ width:24, height:24, border:`1px solid ${C.border}`, borderRadius:5, background:"transparent", cursor:"pointer", fontSize:12 }}>−</button>
                      </div>
                    </div>
                  ))}
                  <div style={{ paddingTop:12 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:C.muted, marginBottom:4 }}>
                      <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:C.muted, marginBottom:10 }}>
                      <span>Delivery fee</span><span>${delivFee.toFixed(2)}</span>
                    </div>
                    <div style={{ display:"flex", justifyContent:"space-between", fontWeight:700, fontSize:15 }}>
                      <span>Total</span><span style={{ color:C.primary }}>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </>}

                {step==="delivery" && <>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 }}>
                    {[{ v:"delivery",icon:"🚗",label:"Delivery",sub:`+$${delivFee}`},{v:"pickup",icon:"🏠",label:"Pickup",sub:"Free"}].map(o=>(
                      <button key={o.v} onClick={()=>setDel(p=>({...p,type:o.v}))} style={{ padding:"10px", border:`2px solid ${del.type===o.v?C.primary:C.border}`, borderRadius:9, background:del.type===o.v?C.primaryBg:"transparent", cursor:"pointer", textAlign:"left" }}>
                        <p style={{ fontSize:14, margin:"0 0 2px" }}>{o.icon}</p>
                        <p style={{ fontSize:12, fontWeight:600, color:del.type===o.v?C.primary:C.text, margin:"0 0 1px" }}>{o.label}</p>
                        <p style={{ fontSize:10, color:C.muted, margin:0 }}>{o.sub}</p>
                      </button>
                    ))}
                  </div>
                  {[{ k:"name",label:"Your Name",ph:"Full name"},{k:"phone",label:"Phone",ph:"+1 (416) 555-0100"}].map(f=>(
                    <div key={f.k} style={{ marginBottom:10 }}>
                      <label style={{ fontSize:11, fontWeight:600, color:C.muted, display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.06em" }}>{f.label}</label>
                      <input value={del[f.k]} onChange={e=>setDel(p=>({...p,[f.k]:e.target.value}))} placeholder={f.ph}
                        style={{ width:"100%", padding:"9px 11px", border:`1px solid ${C.border}`, borderRadius:8, fontSize:13, color:C.text, background:C.bg, outline:"none", boxSizing:"border-box" }}/>
                    </div>
                  ))}
                  {del.type==="delivery" && (
                    <div style={{ marginBottom:10 }}>
                      <label style={{ fontSize:11, fontWeight:600, color:C.muted, display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.06em" }}>Delivery Address</label>
                      <input value={del.address} onChange={e=>setDel(p=>({...p,address:e.target.value}))} placeholder="123 Main St, Toronto, ON"
                        style={{ width:"100%", padding:"9px 11px", border:`1px solid ${C.border}`, borderRadius:8, fontSize:13, color:C.text, background:C.bg, outline:"none", boxSizing:"border-box" }}/>
                    </div>
                  )}
                  <div>
                    <label style={{ fontSize:11, fontWeight:600, color:C.muted, display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.06em" }}>Time Slot</label>
                    <select value={del.time} onChange={e=>setDel(p=>({...p,time:e.target.value}))}
                      style={{ width:"100%", padding:"9px 11px", border:`1px solid ${C.border}`, borderRadius:8, fontSize:13, color:C.text, background:C.bg, outline:"none" }}>
                      {TIME_SLOTS.map(t=><option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </div>
                </>}

                {step==="payment" && <>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1rem" }}>
                    <p style={{ fontWeight:600, fontSize:13, color:C.text, margin:0 }}>Card Details</p>
                    <span style={{ fontSize:11, color:C.success, background:C.successBg, padding:"3px 9px", borderRadius:20, fontWeight:600 }}>🔒 Stripe</span>
                  </div>
                  {[{ k:"holder",label:"Cardholder Name",ph:"Name on card"},{k:"card",label:"Card Number",ph:"•••• •••• •••• ••••"}].map(f=>(
                    <div key={f.k} style={{ marginBottom:10 }}>
                      <label style={{ fontSize:11, fontWeight:600, color:C.muted, display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.06em" }}>{f.label}</label>
                      <input value={pay[f.k]} onChange={e=>setPay(p=>({...p,[f.k]:e.target.value}))} placeholder={f.ph}
                        style={{ width:"100%", padding:"9px 11px", border:`1px solid ${C.border}`, borderRadius:8, fontSize:13, color:C.text, background:C.bg, outline:"none", boxSizing:"border-box" }}/>
                    </div>
                  ))}
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                    {[{ k:"expiry",label:"Expiry",ph:"MM/YY"},{k:"cvv",label:"CVV",ph:"•••"}].map(f=>(
                      <div key={f.k}>
                        <label style={{ fontSize:11, fontWeight:600, color:C.muted, display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.06em" }}>{f.label}</label>
                        <input value={pay[f.k]} onChange={e=>setPay(p=>({...p,[f.k]:e.target.value}))} placeholder={f.ph}
                          style={{ width:"100%", padding:"9px 11px", border:`1px solid ${C.border}`, borderRadius:8, fontSize:13, color:C.text, background:C.bg, outline:"none", boxSizing:"border-box" }}/>
                      </div>
                    ))}
                  </div>
                  {isCharity && selectedCharity && (
                    <div style={{ marginTop:14, background:C.charityBg, border:`1px solid rgba(107,63,160,0.2)`, borderRadius:8, padding:"10px 12px" }}>
                      <p style={{ fontSize:12, color:C.charity, fontWeight:600, margin:"0 0 2px" }}>💜 Donating to: {selectedCharity.name}</p>
                      <p style={{ fontSize:11, color:C.muted, margin:0 }}>{selectedCharity.desc}</p>
                    </div>
                  )}
                </>}
              </div>

              <div style={{ padding:"1rem 1.5rem", borderTop:`1px solid ${C.border}` }}>
                {step==="review" && <button onClick={()=>setStep("delivery")} style={{ width:"100%", padding:"12px", background:C.primary, color:"#FFF", border:"none", borderRadius:10, fontSize:13, fontWeight:700, cursor:"pointer" }}>Continue to Delivery →</button>}
                {step==="delivery" && (
                  <div style={{ display:"flex", gap:8 }}>
                    <button onClick={()=>setStep("review")} style={{ flex:1, padding:"12px", border:`1px solid ${C.border}`, borderRadius:10, background:"transparent", color:C.muted, cursor:"pointer", fontSize:13 }}>← Back</button>
                    <button onClick={()=>setStep("payment")} style={{ flex:2, padding:"12px", background:C.primary, color:"#FFF", border:"none", borderRadius:10, fontSize:13, fontWeight:700, cursor:"pointer" }}>Continue to Payment →</button>
                  </div>
                )}
                {step==="payment" && (
                  <div style={{ display:"flex", gap:8 }}>
                    <button onClick={()=>setStep("delivery")} style={{ flex:1, padding:"12px", border:`1px solid ${C.border}`, borderRadius:10, background:"transparent", color:C.muted, cursor:"pointer", fontSize:13 }}>← Back</button>
                    <button onClick={place} disabled={proc} style={{ flex:2, padding:"12px", background:isCharity?C.charity:C.primary, color:"#FFF", border:"none", borderRadius:10, fontSize:13, fontWeight:700, cursor:"pointer" }}>
                      {proc?"⟳ Processing...":isCharity?`💜 Donate $${total.toFixed(2)}`:`Place Order · $${total.toFixed(2)}`}
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  // ── MARKETPLACE ──
  const Marketplace = () => {
    const filtered = hoodFilter==="All" ? STORES : STORES.filter(s=>s.hood===hoodFilter);
    return (
      <div style={{ padding:"1.25rem 1.5rem" }}>
        <div style={{ marginBottom:"1.25rem" }}>
          <h2 style={{ ...tt, fontSize:22, color:C.text, margin:"0 0 4px" }}>Explore Local Bakers</h2>
          <p style={{ fontSize:13, color:C.muted, margin:0 }}>Fresh home-baked goods from your neighbourhood</p>
        </div>
        <div style={{ display:"flex", gap:8, marginBottom:"1.25rem", overflowX:"auto", paddingBottom:4 }}>
          {HOODS.map(h=>(
            <button key={h} onClick={()=>setHoodFilter(h)} style={{ padding:"6px 14px", borderRadius:20, border:"1px solid", fontSize:12, fontWeight:500, cursor:"pointer", whiteSpace:"nowrap", flexShrink:0, background:hoodFilter===h?C.primary:"transparent", borderColor:hoodFilter===h?C.primary:C.border, color:hoodFilter===h?"#FFF":C.muted }}>
              {h}
            </button>
          ))}
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(2,minmax(0,1fr))", gap:12 }}>
          {filtered.map(store=>(
            <div key={store.id} onClick={()=>setActiveStore(store.id)} style={{ background:C.surface, border:`0.5px solid ${C.border}`, borderRadius:14, padding:"1.1rem", cursor:"pointer" }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                <span style={{ fontSize:36, lineHeight:1 }}>{store.emoji}</span>
                {store.badge && (
                  <span style={{ background:store.badge==="Community ♥"?C.chatBg:C.primaryBg, color:store.badge==="Community ♥"?C.chat:C.primary, fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:20, height:"fit-content" }}>{store.badge}</span>
                )}
              </div>
              <p style={{ ...tt, fontSize:14, fontWeight:600, color:C.text, margin:"0 0 3px" }}>{store.name}</p>
              <p style={{ fontSize:11, color:C.muted, margin:"0 0 6px" }}>📍 {store.hood}</p>
              <p style={{ fontSize:11, color:C.text, margin:"0 0 8px", lineHeight:1.5 }}>{store.desc}</p>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontSize:11, color:C.muted }}>⭐ {store.rating} · {store.reviews} reviews</span>
                <span style={{ fontSize:11, color:C.primary, fontWeight:600 }}>Browse →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ── COMMUNITY CHAT ──
  const CommunityChat = () => {
    const [msgs,   setMsgs]   = useState(CHAT_INIT);
    const [filter, setFilter] = useState("All");
    const [reply,  setReply]  = useState("");
    const bottomRef = useRef(null);

    const filtered = filter==="All" ? msgs : msgs.filter(m=>m.hood===filter);
    const send = () => {
      if (!reply.trim()) return;
      setMsgs(p=>[...p,{ id:Date.now(), seller:"You", hood:user.hood, emoji:"🛍️", time:"now", msg:reply.trim() }]);
      setReply("");
      setTimeout(()=>bottomRef.current?.scrollIntoView({ behavior:"smooth" }),100);
    };

    return (
      <div style={{ display:"flex", flexDirection:"column", height:"calc(100vh - 120px)" }}>
        <div style={{ padding:"1.25rem 1.5rem 0.75rem", borderBottom:`1px solid ${C.border}` }}>
          <h2 style={{ ...tt, fontSize:22, color:C.text, margin:"0 0 4px" }}>Community Board</h2>
          <p style={{ fontSize:13, color:C.muted, margin:"0 0 10px" }}>Live broadcasts from local bakers near you</p>
          <div style={{ display:"flex", gap:7, overflowX:"auto", paddingBottom:4 }}>
            {HOODS.map(h=>(
              <button key={h} onClick={()=>setFilter(h)} style={{ padding:"5px 12px", borderRadius:20, border:"1px solid", fontSize:11, fontWeight:500, cursor:"pointer", whiteSpace:"nowrap", flexShrink:0, background:filter===h?C.chat:"transparent", borderColor:filter===h?C.chat:C.border, color:filter===h?"#FFF":C.muted }}>
                {h}
              </button>
            ))}
          </div>
        </div>
        <div style={{ flex:1, overflowY:"auto", padding:"1rem 1.5rem" }}>
          {filtered.map(m=>(
            <div key={m.id} style={{ display:"flex", gap:10, marginBottom:14 }}>
              <div style={{ width:38, height:38, borderRadius:"50%", background:C.chatBg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>{m.emoji}</div>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
                  <span style={{ fontSize:12, fontWeight:600, color:C.text }}>{m.seller}</span>
                  <span style={{ fontSize:10, color:C.muted, background:C.bg, padding:"1px 7px", borderRadius:10 }}>{m.hood}</span>
                  <span style={{ fontSize:10, color:C.muted, marginLeft:"auto" }}>{m.time}</span>
                </div>
                <div style={{ background:C.surface, border:`0.5px solid ${C.border}`, borderRadius:"4px 12px 12px 12px", padding:"9px 12px" }}>
                  <p style={{ fontSize:13, color:C.text, margin:0, lineHeight:1.6 }}>{m.msg}</p>
                </div>
                <button onClick={()=>{ const s=STORES.find(st=>st.name===m.seller); if(s) setActiveStore(s.id); }} style={{ marginTop:5, background:"transparent", border:"none", fontSize:11, color:C.primary, cursor:"pointer", padding:0, fontWeight:600 }}>
                  View store →
                </button>
              </div>
            </div>
          ))}
          <div ref={bottomRef}/>
        </div>
        <div style={{ padding:"0.75rem 1.5rem", borderTop:`1px solid ${C.border}`, display:"flex", gap:8 }}>
          <input value={reply} onChange={e=>setReply(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Ask a baker a question..."
            style={{ flex:1, padding:"9px 12px", border:`1px solid ${C.border}`, borderRadius:8, fontSize:13, color:C.text, background:C.bg, outline:"none" }}/>
          <button onClick={send} style={{ background:C.chat, color:"#FFF", border:"none", borderRadius:8, padding:"9px 16px", fontSize:13, fontWeight:600, cursor:"pointer" }}>Send</button>
        </div>
      </div>
    );
  };

  // ── CHARITY PAGE ──
  const CharityPage = () => {
    const [selected, setSelected] = useState(selectedCharity);
    return (
      <div style={{ padding:"1.25rem 1.5rem" }}>
        <div style={{ background:`linear-gradient(135deg,${C.charityBg},#FDF7F0)`, borderRadius:14, padding:"1.5rem", marginBottom:"1.25rem", border:`1px solid rgba(107,63,160,0.15)` }}>
          <p style={{ fontSize:32, margin:"0 0 8px" }}>💜</p>
          <h2 style={{ ...tt, fontSize:22, color:C.charity, margin:"0 0 6px" }}>Donate Food to Your Community</h2>
          <p style={{ fontSize:13, color:C.muted, margin:0, lineHeight:1.6 }}>Order from any local baker and send it directly to a charity near you. Every order helps a family in need.</p>
        </div>
        <p style={{ fontSize:12, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.07em", margin:"0 0 10px" }}>Choose a charity</p>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:"1.5rem" }}>
          {CHARITIES.map(ch=>(
            <div key={ch.id} onClick={()=>setSelected(ch)} style={{
              background:selected?.id===ch.id?C.charityBg:C.surface,
              border:`2px solid ${selected?.id===ch.id?C.charity:C.border}`,
              borderRadius:12, padding:"1rem", cursor:"pointer"
            }}>
              <span style={{ fontSize:28, display:"block", marginBottom:6 }}>{ch.emoji}</span>
              <p style={{ fontSize:13, fontWeight:600, color:selected?.id===ch.id?C.charity:C.text, margin:"0 0 3px" }}>{ch.name}</p>
              <p style={{ fontSize:11, color:C.muted, margin:"0 0 4px", lineHeight:1.4 }}>{ch.desc}</p>
              <span style={{ fontSize:10, color:C.muted, background:C.bg, padding:"2px 7px", borderRadius:10 }}>📍 {ch.hood}</span>
            </div>
          ))}
        </div>
        {selected && (
          <div style={{ background:C.charityBg, border:`1px solid rgba(107,63,160,0.2)`, borderRadius:12, padding:"1rem 1.25rem", marginBottom:"1.25rem" }}>
            <p style={{ fontWeight:600, fontSize:13, color:C.charity, margin:"0 0 4px" }}>✓ {selected.name} selected</p>
            <p style={{ fontSize:12, color:C.muted, margin:0, lineHeight:1.5 }}>Click Browse Stores below to add items. Your donation will be pre-selected at checkout.</p>
          </div>
        )}
        <button onClick={()=>{ if(selected){ setSelectedCharity(selected); setIsCharity(true); } setView("marketplace"); }} style={{ width:"100%", padding:"12px", background:selected?C.charity:"#C8B8B0", color:"#FFF", border:"none", borderRadius:10, fontSize:13, fontWeight:700, cursor:selected?"pointer":"default" }}>
          {selected?"Browse Stores to Donate →":"Select a charity above first"}
        </button>
        <div style={{ marginTop:"1.5rem", borderTop:`1px solid ${C.border}`, paddingTop:"1.25rem" }}>
          <p style={{ fontSize:11, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.07em", margin:"0 0 10px" }}>Your donation impact</p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
            {[["12","Meals donated"],["3","Families helped"],["$48","Total donated"]].map(([v,l])=>(
              <div key={l} style={{ background:C.surface, border:`0.5px solid ${C.border}`, borderRadius:10, padding:"10px", textAlign:"center" }}>
                <p style={{ ...tt, fontSize:22, fontWeight:700, color:C.charity, margin:"0 0 2px" }}>{v}</p>
                <p style={{ fontSize:10, color:C.muted, margin:0 }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ── MY ORDERS ──
  const MyOrders = () => (
    <div style={{ padding:"1.25rem 1.5rem" }}>
      <h2 style={{ ...tt, fontSize:22, color:C.text, margin:"0 0 4px" }}>My Orders</h2>
      <p style={{ fontSize:13, color:C.muted, margin:"0 0 1.25rem" }}>Your order history</p>
      {[
        { id:"#2041", store:"Maria's Home Bakery",   emoji:"🍞", items:"Sourdough x2",           total:24, status:"delivered", date:"Mar 15", charity:false },
        { id:"#2038", store:"The Dumpling Den",      emoji:"🥟", items:"Pork Dumplings x2",      total:28, status:"delivered", date:"Mar 12", charity:false },
        { id:"#2035", store:"Aisha's Sweet Corner",  emoji:"🧁", items:"Chin Chin Cookies x1",   total:16, status:"delivered", date:"Mar 8",  charity:true  },
      ].map(o=>(
        <div key={o.id} style={{ background:C.surface, border:`0.5px solid ${C.border}`, borderRadius:12, padding:"1rem 1.25rem", marginBottom:10 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
            <div style={{ display:"flex", alignItems:"center", gap:9 }}>
              <span style={{ fontSize:24 }}>{o.emoji}</span>
              <div>
                <p style={{ fontSize:13, fontWeight:600, color:C.text, margin:"0 0 1px" }}>{o.store}</p>
                <p style={{ fontSize:11, color:C.muted, margin:0 }}>{o.items}</p>
              </div>
            </div>
            <div style={{ textAlign:"right" }}>
              <p style={{ fontSize:13, fontWeight:700, color:C.primary, margin:"0 0 3px" }}>${o.total.toFixed(2)}</p>
              {o.charity && <span style={{ fontSize:10, background:C.charityBg, color:C.charity, padding:"1px 7px", borderRadius:10, fontWeight:600 }}>💜 Donated</span>}
            </div>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <Badge status={o.status}/>
            <span style={{ fontSize:11, color:C.muted }}>{o.date}</span>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"'Outfit', sans-serif", paddingBottom:64 }}>
      <TopBar/>
      <CartDrawer/>
      {view==="marketplace" && <Marketplace/>}
      {view==="chat"        && <CommunityChat/>}
      {view==="charity"     && <CharityPage/>}
      {view==="orders"      && <MyOrders/>}
      <BottomNav/>
    </div>
  );
}

// ─── SELLER APP ───────────────────────────────────────────────────────────────
function SellerApp({ user, onSignOut }) {
  const [view,     setView]     = useState("dashboard");
  const [products, setProducts] = useState(Object.values(STORE_PRODUCTS)[0]);

  const Sidebar = () => (
    <div style={{ width:220, background:C.sidebar, display:"flex", flexDirection:"column", flexShrink:0 }}>
      <div style={{ padding:"1.5rem 1.25rem 1.1rem", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontSize:22 }}>🍞</span>
          <div>
            <p style={{ color:C.sidebarText, ...tt, fontSize:14, fontWeight:600, margin:0, lineHeight:1.2 }}>{user.business}</p>
            <p style={{ color:C.sidebarMuted, fontSize:10, margin:0 }}>Seller Dashboard</p>
          </div>
        </div>
      </div>
      <nav style={{ flex:1, padding:"0.75rem 0.625rem" }}>
        {SELLER_NAV.map(item=>{
          const active = view===item.id;
          return (
            <button key={item.id} onClick={()=>setView(item.id)} style={{
              display:"flex", alignItems:"center", gap:10, width:"100%", padding:"8px 12px",
              background:active?C.sidebarActive:"transparent", border:"none",
              borderLeft:`3px solid ${active?C.primary:"transparent"}`,
              borderRadius:"0 8px 8px 0", cursor:"pointer", marginBottom:2, textAlign:"left"
            }}>
              <span style={{ fontSize:14, color:active?C.sidebarText:C.sidebarMuted }}>{item.icon}</span>
              <span style={{ fontSize:13, color:active?C.sidebarText:C.sidebarMuted, fontWeight:active?500:400 }}>{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div style={{ padding:"0.75rem 0.625rem" }}>
        <button onClick={onSignOut} style={{ display:"flex", alignItems:"center", gap:10, width:"100%", padding:"8px 12px", background:"transparent", border:"none", borderLeft:"3px solid transparent", borderRadius:"0 8px 8px 0", cursor:"pointer", textAlign:"left" }}>
          <span style={{ fontSize:13, color:C.sidebarMuted }}>Sign out</span>
        </button>
      </div>
      <div style={{ padding:"1rem", borderTop:"1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ background:"rgba(196,98,45,0.14)", border:"1px solid rgba(196,98,45,0.32)", borderRadius:10, padding:"10px 12px" }}>
          <p style={{ color:"#F4A261", fontSize:11, fontWeight:700, margin:"0 0 2px", textTransform:"uppercase", letterSpacing:"0.06em" }}>Free Trial</p>
          <p style={{ color:C.sidebarText, fontSize:12, margin:"0 0 9px" }}>14 days remaining</p>
          <button style={{ background:C.primary, color:"#FFF", border:"none", borderRadius:6, padding:"6px 10px", fontSize:11, fontWeight:700, cursor:"pointer", width:"100%" }}>Upgrade to Pro →</button>
        </div>
      </div>
    </div>
  );

  // ── SELLER COMMUNITY (broadcast) ──
  const SellerCommunity = () => {
    const [msgs,    setMsgs]    = useState(CHAT_INIT.filter(m=>m.seller===user.business||true));
    const [draft,   setDraft]   = useState("");
    const [reach,   setReach]   = useState("neighbourhood");
    const [sent,    setSent]    = useState(false);

    const broadcast = () => {
      if (!draft.trim()) return;
      setMsgs(p=>[...p,{ id:Date.now(), seller:user.business, hood:user.hood||"Leslieville", emoji:"🍞", time:"just now", msg:draft.trim() }]);
      setDraft(""); setSent(true); setTimeout(()=>setSent(false),2500);
    };

    return (
      <div style={{ padding:"2rem", maxWidth:660 }}>
        <div style={{ marginBottom:"1.75rem" }}>
          <h1 style={{ ...tt, fontSize:27, color:C.text, margin:"0 0 4px" }}>Community Board</h1>
          <p style={{ color:C.muted, fontSize:14, margin:0 }}>Broadcast today's bakes to your local community</p>
        </div>
        <div style={{ background:C.surface, border:`0.5px solid ${C.border}`, borderRadius:12, padding:"1.25rem", marginBottom:14 }}>
          <p style={{ fontWeight:600, fontSize:14, color:C.text, margin:"0 0 1rem" }}>📢 New Broadcast</p>
          <div style={{ marginBottom:10 }}>
            <label style={{ fontSize:11, fontWeight:600, color:C.muted, display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.06em" }}>Reach</label>
            <div style={{ display:"flex", gap:8 }}>
              {[{ v:"neighbourhood", label:`📍 ${user.hood||"Neighbourhood"}` },{ v:"city", label:"🌆 City-wide" }].map(r=>(
                <button key={r.v} onClick={()=>setReach(r.v)} style={{ padding:"7px 14px", border:`1px solid ${reach===r.v?C.chat:C.border}`, borderRadius:20, background:reach===r.v?C.chatBg:"transparent", color:reach===r.v?C.chat:C.muted, fontSize:12, fontWeight:500, cursor:"pointer" }}>{r.label}</button>
              ))}
            </div>
          </div>
          <div style={{ marginBottom:12 }}>
            <label style={{ fontSize:11, fontWeight:600, color:C.muted, display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.06em" }}>Message</label>
            <textarea value={draft} onChange={e=>setDraft(e.target.value)} rows={4} placeholder="e.g. Fresh sourdough just out of the oven! 6 loaves available, order by noon for pickup..."
              style={{ width:"100%", padding:"10px 12px", border:`1px solid ${C.border}`, borderRadius:8, fontSize:13, color:C.text, background:C.bg, outline:"none", resize:"none", boxSizing:"border-box", lineHeight:1.6 }}/>
            <p style={{ fontSize:11, color:C.muted, margin:"4px 0 0", textAlign:"right" }}>{draft.length}/280</p>
          </div>
          <button onClick={broadcast} style={{ background:sent?C.success:C.chat, color:"#FFF", border:"none", borderRadius:8, padding:"10px 20px", fontSize:13, fontWeight:700, cursor:"pointer", transition:"background 0.2s" }}>
            {sent?"✓ Broadcast Sent!":"📢 Broadcast to Community"}
          </button>
        </div>
        <p style={{ fontSize:12, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.07em", margin:"0 0 10px" }}>Recent community posts</p>
        {msgs.slice(-5).reverse().map(m=>(
          <div key={m.id} style={{ display:"flex", gap:10, marginBottom:12 }}>
            <div style={{ width:36, height:36, borderRadius:"50%", background:m.seller===user.business?C.primaryBg:C.chatBg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>{m.emoji}</div>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:3 }}>
                <span style={{ fontSize:12, fontWeight:600, color:m.seller===user.business?C.primary:C.text }}>{m.seller}</span>
                <span style={{ fontSize:10, background:C.bg, color:C.muted, padding:"1px 7px", borderRadius:10 }}>{m.hood}</span>
                <span style={{ fontSize:10, color:C.muted, marginLeft:"auto" }}>{m.time}</span>
              </div>
              <div style={{ background:C.surface, border:`0.5px solid ${C.border}`, borderRadius:"4px 12px 12px 12px", padding:"8px 11px" }}>
                <p style={{ fontSize:12, color:C.text, margin:0, lineHeight:1.55 }}>{m.msg}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // ── SELLER DASHBOARD ──
  const Dashboard = () => {
    const top    = [...products].sort((a,b)=>b.sold-a.sold)[0]||products[0];
    const thisM  = REV_DATA[REV_DATA.length-1];
    const prevM  = REV_DATA[REV_DATA.length-2];
    const growth = (((thisM.revenue-prevM.revenue)/prevM.revenue)*100).toFixed(1);
    const totalRev = REV_DATA.reduce((s,d)=>s+d.revenue,0);
    return (
      <div style={{ padding:"2rem" }}>
        <div style={{ marginBottom:"1.75rem" }}>
          <h1 style={{ ...tt, fontSize:27, color:C.text, margin:"0 0 4px" }}>Good morning, {user.name.split(" ")[0]} 👋</h1>
          <p style={{ color:C.muted, fontSize:14, margin:0 }}>Here's how your bakery is performing.</p>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,minmax(0,1fr))", gap:12, marginBottom:"2rem" }}>
          <KPI label="Total Revenue" value={`$${(totalRev/1000).toFixed(1)}k`} sub="Last 6 months" color={C.primary}/>
          <KPI label="This Month"    value={`$${thisM.revenue.toLocaleString()}`} sub={`↑ ${growth}% vs last month`} color={C.success}/>
          <KPI label="Active Orders" value={ORDERS_DATA.filter(o=>o.status==="preparing"||o.status==="ready").length} sub="Need attention"/>
          <KPI label="Top Seller"    value={top?.emoji||"🍞"} sub={`${top?.name||""} · ${top?.sold||0} sold`}/>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:16, marginBottom:"1.5rem" }}>
          <div style={{ background:C.surface, border:`0.5px solid ${C.border}`, borderRadius:12, padding:"1.25rem" }}>
            <p style={{ fontWeight:600, fontSize:14, color:C.text, margin:"0 0 1rem" }}>Revenue vs Expenses</p>
            <ResponsiveContainer width="100%" height={195}>
              <AreaChart data={REV_DATA}>
                <defs>
                  <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={C.primary} stopOpacity={0.14}/>
                    <stop offset="95%" stopColor={C.primary} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border}/>
                <XAxis dataKey="month" tick={{ fontSize:11, fill:C.muted }} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fontSize:11, fill:C.muted }} axisLine={false} tickLine={false}/>
                <Tooltip contentStyle={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, fontSize:12 }}/>
                <Area type="monotone" dataKey="revenue"  stroke={C.primary} strokeWidth={2} fill="url(#rg)" name="Revenue ($)"/>
                <Area type="monotone" dataKey="expenses" stroke="#E8960C"   strokeWidth={2} fill="none"      name="Expenses ($)"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div style={{ background:C.surface, border:`0.5px solid ${C.border}`, borderRadius:12, padding:"1.25rem" }}>
            <p style={{ fontWeight:600, fontSize:14, color:C.text, margin:"0 0 1rem" }}>Recent Orders</p>
            {ORDERS_DATA.slice(0,4).map(o=>(
              <div key={o.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"7px 0", borderBottom:`0.5px solid ${C.border}` }}>
                <div>
                  <p style={{ fontSize:12, color:C.text, fontWeight:500, margin:0 }}>{o.customer}</p>
                  <p style={{ fontSize:11, color:C.muted, margin:0 }}>{o.id}</p>
                </div>
                <Badge status={o.status}/>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ── SELLER STOREFRONT ──
  const Storefront = () => {
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ name:"", price:"", emoji:"🍞", desc:"" });
    const add = () => {
      if (!form.name||!form.price) return;
      setProducts(p=>[...p,{ id:Date.now(), name:form.name, price:parseFloat(form.price)||0, emoji:form.emoji||"🍞", sold:0, stock:10, desc:form.desc }]);
      setShowModal(false); setForm({ name:"", price:"", emoji:"🍞", desc:"" });
    };
    return (
      <div style={{ padding:"2rem" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.75rem" }}>
          <div>
            <h1 style={{ ...tt, fontSize:27, color:C.text, margin:"0 0 4px" }}>Storefront</h1>
            <p style={{ color:C.muted, fontSize:14, margin:0 }}>Manage your listings</p>
          </div>
          <button onClick={()=>setShowModal(true)} style={{ background:C.primary, color:"#FFF", border:"none", borderRadius:8, padding:"9px 18px", fontSize:13, fontWeight:600, cursor:"pointer" }}>+ Add Product</button>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,minmax(0,1fr))", gap:14 }}>
          {products.map(p=>(
            <div key={p.id} style={{ background:C.surface, border:`0.5px solid ${C.border}`, borderRadius:14, padding:"1.25rem" }}>
              <span style={{ fontSize:36, display:"block", marginBottom:8 }}>{p.emoji}</span>
              <p style={{ ...tt, fontSize:15, fontWeight:600, color:C.text, margin:"0 0 5px" }}>{p.name}</p>
              <p style={{ fontSize:12, color:C.muted, margin:"0 0 12px", lineHeight:1.5 }}>{p.desc}</p>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", borderTop:`0.5px solid ${C.border}`, paddingTop:10 }}>
                <span style={{ ...tt, fontSize:17, fontWeight:700, color:C.primary }}>${p.price.toFixed(2)}</span>
                <span style={{ fontSize:11, color:C.muted }}>Stock: <b style={{ color:p.stock<5?C.danger:C.text }}>{p.stock}</b></span>
              </div>
            </div>
          ))}
        </div>
        {showModal && (
          <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.42)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:200 }}>
            <div style={{ background:C.surface, borderRadius:16, padding:"1.75rem", width:380, maxWidth:"90vw" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.25rem" }}>
                <h2 style={{ ...tt, fontSize:20, color:C.text, margin:0 }}>Add Product</h2>
                <button onClick={()=>setShowModal(false)} style={{ background:"none", border:"none", fontSize:18, cursor:"pointer", color:C.muted }}>✕</button>
              </div>
              {[{ k:"name",label:"Name *",ph:"e.g. Blueberry Scones"},{k:"price",label:"Price ($) *",ph:"e.g. 16.00"},{k:"emoji",label:"Emoji",ph:"🍞"}].map(f=>(
                <div key={f.k} style={{ marginBottom:12 }}>
                  <label style={{ fontSize:11, fontWeight:600, color:C.muted, display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.05em" }}>{f.label}</label>
                  <input value={form[f.k]} onChange={e=>setForm({...form,[f.k]:e.target.value})} placeholder={f.ph}
                    style={{ width:"100%", padding:"8px 11px", border:`1px solid ${C.border}`, borderRadius:8, fontSize:13, color:C.text, background:C.bg, outline:"none", boxSizing:"border-box" }}/>
                </div>
              ))}
              <div style={{ marginBottom:16 }}>
                <label style={{ fontSize:11, fontWeight:600, color:C.muted, display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.05em" }}>Description</label>
                <textarea value={form.desc} onChange={e=>setForm({...form,desc:e.target.value})} rows={2}
                  style={{ width:"100%", padding:"8px 11px", border:`1px solid ${C.border}`, borderRadius:8, fontSize:13, color:C.text, background:C.bg, outline:"none", resize:"none", boxSizing:"border-box" }}/>
              </div>
              <div style={{ display:"flex", gap:8 }}>
                <button onClick={()=>setShowModal(false)} style={{ flex:1, padding:"9px", border:`1px solid ${C.border}`, borderRadius:8, background:"transparent", color:C.muted, cursor:"pointer", fontSize:13 }}>Cancel</button>
                <button onClick={add} style={{ flex:2, padding:"9px", background:C.primary, color:"#FFF", border:"none", borderRadius:8, cursor:"pointer", fontSize:13, fontWeight:600 }}>Add Product</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ── SELLER ORDERS ──
  const Orders = () => {
    const [filter, setFilter] = useState("all");
    const filtered = filter==="all" ? ORDERS_DATA : ORDERS_DATA.filter(o=>o.status===filter);
    return (
      <div style={{ padding:"2rem" }}>
        <h1 style={{ ...tt, fontSize:27, color:C.text, margin:"0 0 1.5rem" }}>Orders</h1>
        <div style={{ display:"flex", gap:8, marginBottom:"1.25rem" }}>
          {["all","preparing","ready","delivered"].map(s=>(
            <button key={s} onClick={()=>setFilter(s)} style={{ padding:"6px 14px", borderRadius:20, border:"1px solid", fontSize:12, fontWeight:500, cursor:"pointer", background:filter===s?C.primary:"transparent", borderColor:filter===s?C.primary:C.border, color:filter===s?"#FFF":C.muted }}>
              {s==="all"?`All (${ORDERS_DATA.length})`:s.charAt(0).toUpperCase()+s.slice(1)}
            </button>
          ))}
        </div>
        <div style={{ background:C.surface, border:`0.5px solid ${C.border}`, borderRadius:12, overflow:"hidden" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
            <thead>
              <tr style={{ background:C.bg, borderBottom:`1px solid ${C.border}` }}>
                {["Order","Customer","Items","Total","Status","Date"].map(h=>(
                  <th key={h} style={{ textAlign:"left", padding:"11px 14px", color:C.muted, fontWeight:600, fontSize:11, textTransform:"uppercase", letterSpacing:"0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((o,i)=>(
                <tr key={o.id} style={{ borderBottom:i<filtered.length-1?`0.5px solid ${C.border}`:"none" }}>
                  <td style={{ padding:"12px 14px", color:C.primary, fontWeight:700 }}>{o.id}</td>
                  <td style={{ padding:"12px 14px", color:C.text }}>{o.customer}</td>
                  <td style={{ padding:"12px 14px", color:C.muted, maxWidth:180, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{o.items}</td>
                  <td style={{ padding:"12px 14px", color:C.text, fontWeight:600 }}>${o.total.toFixed(2)}</td>
                  <td style={{ padding:"12px 14px" }}><Badge status={o.status}/></td>
                  <td style={{ padding:"12px 14px", color:C.muted }}>{o.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // ── SELLER FINANCES ──
  const Finances = () => {
    const totalRev    = REV_DATA.reduce((s,d)=>s+d.revenue,0);
    const totalExp    = REV_DATA.reduce((s,d)=>s+d.expenses,0);
    const totalProfit = totalRev-totalExp;
    const margin      = ((totalProfit/totalRev)*100).toFixed(1);
    return (
      <div style={{ padding:"2rem" }}>
        <h1 style={{ ...tt, fontSize:27, color:C.text, margin:"0 0 1.75rem" }}>Finances</h1>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,minmax(0,1fr))", gap:12, marginBottom:"2rem" }}>
          <KPI label="Total Revenue"  value={`$${totalRev.toLocaleString()}`}    sub="6 months" color={C.primary}/>
          <KPI label="Total Expenses" value={`$${totalExp.toLocaleString()}`}    sub="6 months" color={C.warning}/>
          <KPI label="Net Profit"     value={`$${totalProfit.toLocaleString()}`} sub="6 months" color={C.success}/>
          <KPI label="Profit Margin"  value={`${margin}%`}                       sub="Avg: 62%" color={parseFloat(margin)>=62?C.success:C.warning}/>
        </div>
        <div style={{ background:C.surface, border:`0.5px solid ${C.border}`, borderRadius:12, padding:"1.25rem" }}>
          <p style={{ fontWeight:600, fontSize:14, color:C.text, margin:"0 0 1rem" }}>Monthly Profit</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={REV_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border}/>
              <XAxis dataKey="month" tick={{ fontSize:11, fill:C.muted }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fontSize:11, fill:C.muted }} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, fontSize:12 }}/>
              <Bar dataKey="profit" fill={C.primary} radius={[4,4,0,0]} name="Profit ($)"/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  // ── AI MARKETING ──
  const Marketing = () => {
    const [name,    setName]    = useState("");
    const [details, setDetails] = useState("");
    const [result,  setResult]  = useState(null);
    const [loading, setLoading] = useState(false);
    const [error,   setError]   = useState("");
    const [copied,  setCopied]  = useState("");
    const generate = async () => {
      if (!name.trim()) return;
      setLoading(true); setError(""); setResult(null);
      try {
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method:"POST", headers:{ "Content-Type":"application/json" },
          body:JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000, messages:[{ role:"user",
            content:`Copywriter for artisanal home-baked goods. Product: ${name}\nDetails: ${details||"Home-baked, quality ingredients"}\nReturn ONLY valid JSON no markdown:\n{"tagline":"5-8 word tagline","description":"2-3 sentence description","instagram":"caption with hashtags under 150 chars","whatsapp":"broadcast under 100 chars"}`
          }] })
        });
        const data = await res.json();
        const text = (data.content||[]).map(c=>c.text||"").join("");
        setResult(JSON.parse(text.replace(/```json|```/g,"").trim()));
      } catch(e) { setError("Something went wrong. Please try again."); }
      setLoading(false);
    };
    const copy = (text,key) => { navigator.clipboard.writeText(text).then(()=>{ setCopied(key); setTimeout(()=>setCopied(""),2000); }); };
    return (
      <div style={{ padding:"2rem", maxWidth:620 }}>
        <h1 style={{ ...tt, fontSize:27, color:C.text, margin:"0 0 1.75rem" }}>AI Marketing</h1>
        <div style={{ background:C.surface, border:`0.5px solid ${C.border}`, borderRadius:14, padding:"1.5rem", marginBottom:"1.25rem" }}>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:"1.25rem" }}>
            {products.slice(0,4).map(p=>(
              <button key={p.id} onClick={()=>{ setName(p.name); setDetails(p.desc); }} style={{ padding:"5px 12px", border:`1px solid ${C.border}`, borderRadius:20, background:"transparent", fontSize:12, cursor:"pointer", color:C.text, display:"flex", alignItems:"center", gap:5 }}>
                <span>{p.emoji}</span>{p.name}
              </button>
            ))}
          </div>
          <div style={{ marginBottom:12 }}>
            <label style={{ fontSize:11, fontWeight:600, color:C.muted, display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.06em" }}>Product Name *</label>
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Blueberry Scones"
              style={{ width:"100%", padding:"10px 12px", border:`1px solid ${C.border}`, borderRadius:8, fontSize:13, color:C.text, background:C.bg, outline:"none", boxSizing:"border-box" }}/>
          </div>
          <div style={{ marginBottom:16 }}>
            <label style={{ fontSize:11, fontWeight:600, color:C.muted, display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.06em" }}>Key Details</label>
            <textarea value={details} onChange={e=>setDetails(e.target.value)} rows={3} placeholder="Ingredients, textures, what makes it special..."
              style={{ width:"100%", padding:"10px 12px", border:`1px solid ${C.border}`, borderRadius:8, fontSize:13, color:C.text, background:C.bg, outline:"none", resize:"none", boxSizing:"border-box", lineHeight:1.6 }}/>
          </div>
          <button onClick={generate} disabled={!name.trim()||loading} style={{ background:name.trim()?C.primary:C.border, color:name.trim()?"#FFF":C.muted, border:"none", borderRadius:8, padding:"10px 22px", fontSize:13, fontWeight:700, cursor:name.trim()?"pointer":"default" }}>
            {loading?"⟳ Generating...":"✦ Generate Copy"}
          </button>
        </div>
        {error && <div style={{ background:C.dangerBg, border:`1px solid ${C.danger}`, borderRadius:10, padding:"12px 14px", marginBottom:14, fontSize:13, color:C.danger }}>{error}</div>}
        {result && (
          <div style={{ background:C.surface, border:`0.5px solid ${C.border}`, borderRadius:14, overflow:"hidden" }}>
            <div style={{ background:C.primaryBg, padding:"1rem 1.5rem", borderBottom:`1px solid ${C.border}` }}>
              <p style={{ ...tt, fontSize:19, color:C.primary, margin:0, fontStyle:"italic" }}>"{result.tagline}"</p>
            </div>
            <div style={{ padding:"1.25rem 1.5rem" }}>
              {[{ key:"description",label:"Storefront Description",icon:"🏪"},{key:"instagram",label:"Instagram Caption",icon:"📸"},{key:"whatsapp",label:"WhatsApp Message",icon:"💬"}].map(item=>(
                <div key={item.key} style={{ marginBottom:"1.25rem", paddingBottom:"1.25rem", borderBottom:`0.5px solid ${C.border}` }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:7 }}>
                    <p style={{ fontSize:11, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.06em", margin:0 }}>{item.icon} {item.label}</p>
                    <button onClick={()=>copy(result[item.key],item.key)} style={{ background:"transparent", border:`1px solid ${C.border}`, borderRadius:6, padding:"3px 10px", fontSize:11, cursor:"pointer", color:C.muted }}>
                      {copied===item.key?"✓ Copied!":"Copy"}
                    </button>
                  </div>
                  <p style={{ fontSize:13, color:C.text, margin:0, lineHeight:1.7, background:C.bg, padding:"10px 13px", borderRadius:8 }}>{result[item.key]}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // ── DELIVERY SETTINGS ──
  const Delivery = () => {
    const [pickup, setPickup] = useState({ enabled:true, address:"42 Maple Street, Toronto, ON", instructions:"Ring the doorbell." });
    const [del,    setDel]    = useState({ enabled:true, fee:"5.00", minOrder:"20", radius:"10", cutoff:"17:00", lead:"1" });
    const [days,   setDays]   = useState({ mon:true,tue:true,wed:false,thu:true,fri:true,sat:true,sun:false });
    const [saved,  setSaved]  = useState(false);
    const DAY_LABELS = [["mon","Mon"],["tue","Tue"],["wed","Wed"],["thu","Thu"],["fri","Fri"],["sat","Sat"],["sun","Sun"]];
    const save = () => { setSaved(true); setTimeout(()=>setSaved(false),2500); };
    const F = ({ label, value, onChange, ph }) => (
      <div style={{ marginBottom:12, flex:1 }}>
        <label style={{ fontSize:11, fontWeight:600, color:C.muted, display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.06em" }}>{label}</label>
        <input value={value} onChange={e=>onChange(e.target.value)} placeholder={ph}
          style={{ width:"100%", padding:"9px 11px", border:`1px solid ${C.border}`, borderRadius:8, fontSize:13, color:C.text, background:C.bg, outline:"none", boxSizing:"border-box" }}/>
      </div>
    );
    return (
      <div style={{ padding:"2rem", maxWidth:620 }}>
        <h1 style={{ ...tt, fontSize:27, color:C.text, margin:"0 0 1.75rem" }}>Delivery Settings</h1>
        <div style={{ background:C.surface, border:`0.5px solid ${C.border}`, borderRadius:12, padding:"1.25rem", marginBottom:14 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:pickup.enabled?"1rem":0 }}>
            <div>
              <p style={{ fontWeight:600, fontSize:14, color:C.text, margin:"0 0 2px" }}>🏠 Pickup</p>
              <p style={{ fontSize:12, color:C.muted, margin:0 }}>Customers collect from your home</p>
            </div>
            <Toggle val={pickup.enabled} onChange={()=>setPickup(p=>({...p,enabled:!p.enabled}))}/>
          </div>
          {pickup.enabled && <>
            <F label="Pickup Address" value={pickup.address} onChange={v=>setPickup(p=>({...p,address:v}))} ph="Your address"/>
            <div>
              <label style={{ fontSize:11, fontWeight:600, color:C.muted, display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.06em" }}>Instructions</label>
              <textarea value={pickup.instructions} onChange={e=>setPickup(p=>({...p,instructions:e.target.value}))} rows={2}
                style={{ width:"100%", padding:"9px 11px", border:`1px solid ${C.border}`, borderRadius:8, fontSize:13, color:C.text, background:C.bg, outline:"none", resize:"none", boxSizing:"border-box" }}/>
            </div>
          </>}
        </div>
        <div style={{ background:C.surface, border:`0.5px solid ${C.border}`, borderRadius:12, padding:"1.25rem", marginBottom:14 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:del.enabled?"1rem":0 }}>
            <div>
              <p style={{ fontWeight:600, fontSize:14, color:C.text, margin:"0 0 2px" }}>🚗 Home Delivery</p>
              <p style={{ fontSize:12, color:C.muted, margin:0 }}>You deliver to customers</p>
            </div>
            <Toggle val={del.enabled} onChange={()=>setDel(p=>({...p,enabled:!p.enabled}))}/>
          </div>
          {del.enabled && (
            <div style={{ display:"flex", gap:10 }}>
              <F label="Fee ($)"     value={del.fee}      onChange={v=>setDel(p=>({...p,fee:v}))}      ph="5.00"/>
              <F label="Min ($)"     value={del.minOrder} onChange={v=>setDel(p=>({...p,minOrder:v}))} ph="20.00"/>
              <F label="Radius (km)" value={del.radius}   onChange={v=>setDel(p=>({...p,radius:v}))}   ph="10"/>
            </div>
          )}
        </div>
        <div style={{ background:C.surface, border:`0.5px solid ${C.border}`, borderRadius:12, padding:"1.25rem", marginBottom:"1.5rem" }}>
          <p style={{ fontWeight:600, fontSize:14, color:C.text, margin:"0 0 1rem" }}>📅 Schedule</p>
          <div style={{ display:"flex", gap:8, marginBottom:"1rem" }}>
            {DAY_LABELS.map(([key,label])=>(
              <button key={key} onClick={()=>setDays(p=>({...p,[key]:!p[key]}))} style={{ width:40, height:40, borderRadius:8, border:"1px solid", borderColor:days[key]?C.primary:C.border, background:days[key]?C.primaryBg:"transparent", color:days[key]?C.primary:C.muted, fontSize:11, fontWeight:600, cursor:"pointer" }}>{label}</button>
            ))}
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <F label="Cutoff Time" value={del.cutoff} onChange={v=>setDel(p=>({...p,cutoff:v}))} ph="17:00"/>
            <div style={{ flex:1, marginBottom:12 }}>
              <label style={{ fontSize:11, fontWeight:600, color:C.muted, display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.06em" }}>Lead Time</label>
              <select value={del.lead} onChange={e=>setDel(p=>({...p,lead:e.target.value}))}
                style={{ width:"100%", padding:"9px 11px", border:`1px solid ${C.border}`, borderRadius:8, fontSize:13, color:C.text, background:C.bg, outline:"none" }}>
                <option value="0">Same day</option><option value="1">1 day</option><option value="2">2 days</option>
              </select>
            </div>
          </div>
        </div>
        <button onClick={save} style={{ background:saved?C.success:C.primary, color:"#FFF", border:"none", borderRadius:9, padding:"11px 24px", fontSize:13, fontWeight:700, cursor:"pointer", transition:"background 0.2s" }}>
          {saved?"✓ Saved!":"Save Settings"}
        </button>
      </div>
    );
  };

  return (
    <div style={{ display:"flex", height:"100vh", fontFamily:"'Outfit', sans-serif", background:C.bg, overflow:"hidden" }}>
      <Sidebar/>
      <main style={{ flex:1, overflowY:"auto" }}>
        {view==="dashboard"  && <Dashboard/>}
        {view==="storefront" && <Storefront/>}
        {view==="orders"     && <Orders/>}
        {view==="finances"   && <Finances/>}
        {view==="delivery"   && <Delivery/>}
        {view==="marketing"  && <Marketing/>}
        {view==="community"  && <SellerCommunity/>}
      </main>
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);

  useEffect(()=>{
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Outfit:wght@300;400;500;600&display=swap";
    document.head.appendChild(link);
    return ()=>{ try{ document.head.removeChild(link); }catch(e){} };
  }, []);

  if (!user) return <AuthScreen onAuth={setUser}/>;
  if (user.role==="seller") return <SellerApp user={user} onSignOut={()=>setUser(null)}/>;
  return <CustomerApp user={user} onSignOut={()=>setUser(null)}/>;
}
