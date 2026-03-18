import { useState, useEffect, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://kxajjlrjgrabtmyksqrq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4YWpqbHJqZ3JhYnRteWtzcXJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3NjIyMzMsImV4cCI6MjA4OTMzODIzM30.UCUOnwpyP4oBJyHhaCEM4kym_UlDY32a2SWP3x8atQU'
);

// ─── DESIGN TOKENS — Hearthside warm palette ─────────────────────────────────
const C = {
  // Base — warm cream + dark contrast
  bg:          "#F7F0E6",
  surface:     "#FFFFFF",
  surfaceHigh: "#F0E8DB",
  surfaceTop:  "#E8DDD0",
  border:      "rgba(164,98,60,0.14)",
  borderMid:   "rgba(164,98,60,0.25)",
  // Text
  text:        "#1C0E07",
  textSub:     "#5C3D2A",
  textMuted:   "#9C7A66",
  // Accent — logo burnt orange
  accent:      "#C4622D",
  accentDark:  "#A05025",
  accentBg:    "rgba(196,98,45,0.08)",
  accentBorder:"rgba(196,98,45,0.22)",
  // Sidebar — deep espresso
  sidebar:     "#1C0E07",
  sidebarText: "#F5DCC8",
  sidebarMuted:"rgba(245,220,200,0.45)",
  // Semantic
  success:     "#1E7A48",
  successBg:   "rgba(30,122,72,0.1)",
  warning:     "#A07010",
  warningBg:   "rgba(160,112,16,0.1)",
  danger:      "#B52020",
  dangerBg:    "rgba(181,32,32,0.1)",
  info:        "#1A6B9C",
  infoBg:      "rgba(26,107,156,0.1)",
  // Feature colors
  charity:     "#7C3AED",
  charityBg:   "rgba(124,58,237,0.08)",
  charityBorder:"rgba(124,58,237,0.2)",
  chat:        "#0D6E5C",
  chatBg:      "rgba(13,110,92,0.1)",
};

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const STORES = [
  { id:1, name:"Maria's Home Bakery",   owner:"Maria Santos",   hood:"Leslieville",     emoji:"🍞", rating:4.9, reviews:127, badge:"Top Rated",   desc:"Sourdough specialist. Everything baked fresh at 5am.", tags:["Bread","Pastry"],      deliveryFee:5, minOrder:20, instagram:"@mariashomebakery", whatsapp:"+14165550101" },
  { id:2, name:"Aisha's Sweet Corner",  owner:"Aisha Kamara",   hood:"Kensington",      emoji:"🧁", instagram:"@aishassweetcorner", whatsapp:"+14165550102", rating:4.7, reviews:89,  badge:"New",          desc:"Afro-Caribbean fusion cakes and celebration desserts.", tags:["Cake","Dessert"],     deliveryFee:6, minOrder:25 },
  { id:3, name:"The Dumpling Den",      owner:"Li Wei",         hood:"Chinatown",       emoji:"🥟", instagram:"@thedumplingden",    whatsapp:"+14165550103", rating:4.8, reviews:203, badge:"Community ♥",  desc:"Hand-folded dumplings, scallion pancakes, red bean buns.", tags:["Savoury","Asian"], deliveryFee:4, minOrder:15 },
  { id:4, name:"Florencia's Empanadas", owner:"Florencia Ruiz", hood:"Little Portugal", emoji:"🫓", instagram:null,                 whatsapp:null, rating:4.6, reviews:61,  badge:null,           desc:"Crispy empanadas — beef, chicken, spinach & cheese.", tags:["Savoury","Latin"],    deliveryFee:5, minOrder:18 },
  { id:5, name:"Biji's Spice Kitchen",  owner:"Biji Patel",     hood:"Brampton",        emoji:"🫙", instagram:"@bijispicekitchen",  whatsapp:"+14165550105", rating:4.8, reviews:145, badge:"Top Rated",    desc:"Homemade chutneys, pickles, and fresh-baked roti.", tags:["Condiments","Bread"],  deliveryFee:7, minOrder:20 },
  { id:6, name:"Sunshine Sourdough",    owner:"Tom Richards",   hood:"Roncesvalles",    emoji:"☀️", instagram:"@sunshinesourdough", whatsapp:null, rating:4.5, reviews:44,  badge:"New",          desc:"Country loaves, focaccia, and seasonal fruit crumbles.", tags:["Bread","Pastry"],  deliveryFee:5, minOrder:20 },
];
const STORE_PRODUCTS = {
  1:[ { id:101, name:"Sourdough Loaf",       price:12, emoji:"🍞", desc:"Tangy slow-fermented sourdough with a golden crust.", stock:8  },
      { id:102, name:"Chocolate Brownies",   price:18, emoji:"🍫", desc:"Dense fudgy brownies with 70% dark chocolate & sea salt.", stock:12 },
      { id:103, name:"Cinnamon Rolls (6pc)", price:22, emoji:"🌀", desc:"Pillowy rolls filled with cinnamon butter & cream cheese.", stock:6 },
      { id:104, name:"Lemon Drizzle Cake",   price:28, emoji:"🍋", desc:"Moist lemon sponge soaked in a citrusy drizzle glaze.", stock:4 } ],
  2:[ { id:201, name:"Jollof Rice Cake",     price:32, emoji:"🎂", desc:"A show-stopping celebration cake inspired by jollof rice.", stock:3 },
      { id:202, name:"Chin Chin Cookies",    price:16, emoji:"🍪", desc:"Crunchy West African fried dough biscuits.", stock:20 },
      { id:203, name:"Rum Fruit Cake",       price:38, emoji:"🍰", desc:"Dense, boozy fruit cake soaked for 3 days.", stock:5 } ],
  3:[ { id:301, name:"Pork Dumplings (12pc)",price:14, emoji:"🥟", desc:"Classic pork & cabbage, hand-folded wonton wrappers.", stock:15 },
      { id:302, name:"Scallion Pancakes",    price:10, emoji:"🫓", desc:"Flaky, crispy layered pancakes with sesame oil.", stock:10 },
      { id:303, name:"Red Bean Buns (6pc)",  price:12, emoji:"🍡", desc:"Soft steamed buns filled with sweet red bean paste.", stock:8 },
      { id:304, name:"Veggie Dumplings",     price:13, emoji:"🥬", desc:"Tofu, shiitake & glass noodle filling.", stock:12 } ],
  4:[ { id:401, name:"Beef Empanadas (6pc)", price:18, emoji:"🫓", desc:"Spiced ground beef with olives & hard boiled egg.", stock:10 },
      { id:402, name:"Spinach & Cheese",     price:16, emoji:"🧀", desc:"Creamy spinach and queso fresco empanadas.", stock:8 },
      { id:403, name:"Chicken Empanadas",    price:17, emoji:"🍗", desc:"Shredded chicken with roasted peppers & cumin.", stock:10 } ],
  5:[ { id:501, name:"Mango Chutney (jar)",  price:12, emoji:"🥭", desc:"Sweet-tangy mango chutney, great with everything.", stock:20 },
      { id:502, name:"Mixed Pickle",         price:10, emoji:"🫙", desc:"Classic South Asian achaar, tangy and spiced.", stock:15 },
      { id:503, name:"Fresh Roti (6pc)",     price:8,  emoji:"🫓", desc:"Soft, fresh-made whole wheat roti.", stock:20 } ],
  6:[ { id:601, name:"Country Sourdough",    price:14, emoji:"☀️", desc:"Open crumb, chewy crust country loaf.", stock:6 },
      { id:602, name:"Focaccia",             price:16, emoji:"🌿", desc:"Rosemary & sea salt focaccia, dimpled and golden.", stock:5 },
      { id:603, name:"Seasonal Crumble",     price:22, emoji:"🍑", desc:"This week: peach & ginger crumble with oat topping.", stock:4 } ],
};
const CHARITIES = [
  { id:1, name:"Daily Bread Food Bank",   emoji:"🍞", desc:"Toronto's largest food bank, serving 60,000 people/month.", hood:"City-wide" },
  { id:2, name:"Second Harvest",          emoji:"🥗", desc:"Canada's largest food rescue organization.", hood:"City-wide" },
  { id:3, name:"Seva Food Bank",          emoji:"🙏", desc:"Culturally appropriate food for Peel Region families.", hood:"Brampton" },
  { id:4, name:"The Stop Community Food", emoji:"🌱", desc:"Community food programs in Davenport.", hood:"Davenport" },
];
const HOODS = ["All","Leslieville","Kensington","Chinatown","Little Portugal","Brampton","Roncesvalles"];
// eslint-disable-next-line no-unused-vars
const CHAT_INIT = [
  { id:1, seller:"Maria's Home Bakery",  hood:"Leslieville",  emoji:"🍞", time:"8:02am",  msg:"Fresh sourdough just out of the oven! 8 loaves available today 🔥 Order by noon for afternoon pickup." },
  { id:2, seller:"The Dumpling Den",     hood:"Chinatown",    emoji:"🥟", time:"8:45am",  msg:"Making an extra batch of pork dumplings today — 5 orders left at the special price of $12/dozen." },
  { id:3, seller:"Biji's Spice Kitchen", hood:"Brampton",     emoji:"🫙", time:"9:10am",  msg:"New batch of mango chutney and mixed pickle ready 🥭 Also fresh roti every morning this week." },
  { id:4, seller:"Aisha's Sweet Corner", hood:"Kensington",   emoji:"🧁", time:"10:30am", msg:"Taking custom cake orders for Easter weekend. DM me your design! Minimum 3 days notice needed 🎂" },
  { id:5, seller:"Sunshine Sourdough",   hood:"Roncesvalles", emoji:"☀️", time:"11:00am", msg:"Focaccia is back on the menu. Rosemary & sea salt, ready by 2pm today." },
];
const ORDERS_DATA = [];
const STATUS_MAP = {
  delivered:{ bg:"rgba(34,197,94,0.12)",   color:"#22C55E", label:"Delivered"  },
  ready:    { bg:"rgba(59,130,246,0.12)",   color:"#3B82F6", label:"Ready"      },
  preparing:{ bg:"rgba(245,158,11,0.12)",  color:"#F59E0B", label:"Preparing"  },
  cancelled:{ bg:"rgba(239,68,68,0.12)",   color:"#EF4444", label:"Cancelled"  },
};
const SELLER_NAV = [
  { id:"dashboard",  icon:"▦", label:"Dashboard"  },
  { id:"storefront", icon:"◫", label:"Storefront" },
  { id:"orders",     icon:"≡", label:"Orders"     },
  { id:"customers",  icon:"◉", label:"Customers"  },
  { id:"finances",   icon:"◈", label:"Finances"   },
  { id:"delivery",   icon:"⌖", label:"Delivery"   },
  { id:"community",  icon:"◎", label:"Community"  },
];
const TIME_SLOTS = [
  { value:"next-day-am", label:"Tomorrow, 9am–12pm"  },
  { value:"next-day-pm", label:"Tomorrow, 12pm–5pm"  },
  { value:"twoday-am",   label:"In 2 days, 9am–12pm" },
  { value:"twoday-pm",   label:"In 2 days, 12pm–5pm" },
];

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
function Badge({ status }) {
  const s = STATUS_MAP[status]||STATUS_MAP.preparing;
  return (
    <span style={{ background:s.bg, color:s.color, fontSize:11, fontWeight:600, padding:"3px 10px", borderRadius:4, whiteSpace:"nowrap", letterSpacing:"0.02em" }}>
      {s.label}
    </span>
  );
}
function KPI({ label, value, sub, color }) {
  return (
    <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:"1rem 1.25rem" }}>
      <p style={{ fontSize:10, color:C.textMuted, margin:"0 0 8px", textTransform:"uppercase", letterSpacing:"0.1em", fontWeight:600 }}>{label}</p>
      <p style={{ fontSize:28, fontWeight:700, margin:"0 0 4px", color:color||C.text, letterSpacing:"-0.02em" }}>{value}</p>
      {sub && <p style={{ fontSize:11, color:C.textMuted, margin:0 }}>{sub}</p>}
    </div>
  );
}
function Toggle({ val, onChange }) {
  return (
    <div onClick={onChange} style={{ width:44, height:24, borderRadius:12, background:val?C.accent:C.surfaceTop, cursor:"pointer", position:"relative", flexShrink:0, transition:"background 0.2s" }}>
      <div style={{ width:18, height:18, borderRadius:"50%", background:val?"#000":"#555", position:"absolute", top:3, left:val?23:3, transition:"left 0.18s" }}/>
    </div>
  );
}
function AuthInput({ label, ph, type="text", value, onChange, onEnter }) {
  return (
    <div style={{ marginBottom:14 }}>
      <label style={{ fontSize:11, fontWeight:600, color:C.textMuted, display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.08em" }}>{label}</label>
      <input type={type} value={value} onChange={onChange} placeholder={ph} onKeyDown={e=>e.key==="Enter"&&onEnter()}
        style={{ width:"100%", padding:"11px 14px", border:`1px solid ${C.border}`, borderRadius:6, fontSize:14, color:C.text, background:C.surfaceHigh, outline:"none", boxSizing:"border-box", transition:"border-color 0.15s" }}
        onFocus={e=>e.target.style.borderColor=C.accent}
        onBlur={e=>e.target.style.borderColor=C.border}/>
    </div>
  );
}
function Pill({ label, active, onClick, color }) {
  return (
    <button onClick={onClick} style={{
      padding:"6px 14px", borderRadius:4, border:`1px solid ${active?(color||C.accent):C.border}`,
      background:active?(color?`rgba(${color},0.1)`:C.accentBg):"transparent",
      color:active?(color||C.accent):C.textMuted, fontSize:12, fontWeight:500,
      cursor:"pointer", whiteSpace:"nowrap", flexShrink:0, letterSpacing:"0.01em"
    }}>{label}</button>
  );
}
function Inp({ label, value, onChange, ph }) {
  return (
    <div style={{ marginBottom:12, flex:1 }}>
      <label style={{ fontSize:10, fontWeight:600, color:C.textMuted, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.08em" }}>{label}</label>
      <input value={value} onChange={e=>onChange(e.target.value)} placeholder={ph}
        style={{ width:"100%", padding:"9px 12px", border:`1px solid ${C.border}`, borderRadius:6, fontSize:13, color:C.text, background:C.surfaceHigh, outline:"none", boxSizing:"border-box" }}
        onFocus={e=>e.target.style.borderColor=C.accent} onBlur={e=>e.target.style.borderColor=C.border}/>
    </div>
  );
}

// ─── AUTH SCREEN ──────────────────────────────────────────────────────────────
function AuthScreen({ onAuth }) {
  const [role, setRole] = useState("customer");
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ email:"", password:"", name:"", business:"", hood:"Leslieville" });
  const [err,  setErr]  = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!form.email||!form.password) { setErr("Please fill in all required fields."); return; }
    if (mode==="signup"&&!form.name) { setErr("Please enter your name."); return; }
    setErr(""); setLoading(true);
    if (mode==="signup") {
      const { data, error } = await supabase.auth.signUp({ email:form.email, password:form.password });
      if (error) { setErr(error.message); setLoading(false); return; }
      if (!data.user) { setErr("Signup failed. Please try again."); setLoading(false); return; }
      await supabase.from("profiles").insert({ id:data.user.id, name:form.name, business:form.business||"My Bakery", hood:form.hood, role });
      onAuth({ id:data.user.id, name:form.name, email:form.email, business:form.business||"My Bakery", hood:form.hood, role });
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email:form.email, password:form.password });
      if (error) { setErr(error.message); setLoading(false); return; }
      if (!data.user) { setErr("Login failed. Please try again."); setLoading(false); return; }
      const { data:profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single();
      if (profile) {
        onAuth({ id:data.user.id, name:profile.name, email:form.email, business:profile.business, hood:profile.hood, role:profile.role });
      } else {
        onAuth({ id:data.user.id, name:form.name||"User", email:form.email, business:"My Bakery", hood:form.hood, role });
      }
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", fontFamily:"'DM Sans', system-ui, sans-serif" }}>
      {/* Left panel */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"center", padding:"4rem", background:C.sidebar, borderRight:`1px solid ${C.border}` }}>
        <div style={{ maxWidth:400 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:"3rem" }}>
            <div style={{ width:32, height:32, background:C.accent, borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>🍞</div>
            <span style={{ fontSize:18, fontWeight:700, color:C.sidebarText, letterSpacing:"-0.02em" }}>Hearthside</span>
          </div>
          <h1 style={{ fontSize:36, fontWeight:700, color:C.sidebarText, margin:"0 0 12px", letterSpacing:"-0.03em", lineHeight:1.15 }}>
            Home-baked goods<br/>
            <span style={{ color:C.accent }}>from your neighbours.</span>
          </h1>
          <p style={{ fontSize:15, color:C.sidebarMuted, margin:0, lineHeight:1.7 }}>
            Order fresh baked goods from local home bakers, or build your bakery business and reach customers in your city.
          </p>
          <div style={{ marginTop:"2.5rem", display:"flex", flexDirection:"column", gap:12 }}>
            {["Real bakers. Real homes. Real fresh.","Delivery, pickup, or donate to charity","Community broadcasts from local sellers"].map((t,i)=>(
              <div key={i} style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:6, height:6, borderRadius:"50%", background:C.accent, flexShrink:0 }}/>
                <span style={{ fontSize:13, color:C.sidebarMuted }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div style={{ width:460, display:"flex", flexDirection:"column", justifyContent:"center", padding:"3rem 3.5rem", background:C.surface }}>
        <h2 style={{ fontSize:22, fontWeight:700, color:C.text, margin:"0 0 6px", letterSpacing:"-0.02em" }}>
          {mode==="login"?"Welcome back":"Create your account"}
        </h2>
        <p style={{ fontSize:13, color:C.textMuted, margin:"0 0 2rem" }}>
          {mode==="login"?"Sign in to continue":"Join thousands of home bakers and food lovers"}
        </p>

        {/* Role toggle */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:"1.5rem" }}>
          {[{ v:"customer", label:"Customer", sub:"Browse & order" },{ v:"seller", label:"Seller", sub:"Manage my bakery" }].map(r=>(
            <button key={r.v} onClick={()=>setRole(r.v)} style={{
              padding:"12px 14px", border:`1px solid ${role===r.v?C.accent:C.border}`,
              borderRadius:6, background:role===r.v?C.accentBg:"transparent", cursor:"pointer", textAlign:"left"
            }}>
              <p style={{ fontSize:13, fontWeight:600, color:role===r.v?C.accent:C.text, margin:"0 0 1px" }}>{r.label}</p>
              <p style={{ fontSize:11, color:C.textMuted, margin:0 }}>{r.sub}</p>
            </button>
          ))}
        </div>

        {/* Mode tabs */}
        <div style={{ display:"flex", background:C.surfaceHigh, borderRadius:6, padding:3, marginBottom:"1.5rem", border:`1px solid ${C.border}` }}>
          {["login","signup"].map(m=>(
            <button key={m} onClick={()=>{ setMode(m); setErr(""); }} style={{
              flex:1, padding:"8px", border:"none", borderRadius:4, cursor:"pointer", fontSize:13, fontWeight:500,
              background:mode===m?C.surfaceTop:"transparent", color:mode===m?C.text:C.textMuted
            }}>{m==="login"?"Sign In":"Create Account"}</button>
          ))}
        </div>

        {mode==="signup" && <AuthInput label="Full Name" ph="Maria Santos" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} onEnter={submit}/>}
        {mode==="signup" && role==="seller" && <AuthInput label="Bakery Name" ph="Maria's Home Bakery" value={form.business} onChange={e=>setForm({...form,business:e.target.value})} onEnter={submit}/>}
        {mode==="signup" && (
          <div style={{ marginBottom:14 }}>
            <label style={{ fontSize:11, fontWeight:600, color:C.textMuted, display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.08em" }}>Neighbourhood</label>
            <select value={form.hood} onChange={e=>setForm({...form,hood:e.target.value})}
              style={{ width:"100%", padding:"11px 14px", border:`1px solid ${C.border}`, borderRadius:6, fontSize:14, color:C.text, background:C.surfaceHigh, outline:"none" }}>
              {HOODS.filter(h=>h!=="All").map(h=><option key={h} value={h}>{h}</option>)}
            </select>
          </div>
        )}
        <AuthInput label="Email" ph="you@email.com" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} onEnter={submit}/>
        <AuthInput label="Password" ph="••••••••" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} onEnter={submit}/>
        {err && <p style={{ color:C.danger, fontSize:12, margin:"0 0 12px", background:C.dangerBg, padding:"8px 12px", borderRadius:4 }}>{err}</p>}

        <button onClick={submit} disabled={loading} style={{ width:"100%", padding:"13px", background:loading?"rgba(200,240,74,0.5)":C.accent, color:"#000", border:"none", borderRadius:6, fontSize:14, fontWeight:700, cursor:loading?"default":"pointer", letterSpacing:"0.01em" }}>
          {loading?"..." : mode==="login"?"Sign In →":"Create Account →"}
        </button>

        <p style={{ textAlign:"center", fontSize:12, color:C.textMuted, margin:"1.25rem 0 0" }}>
          {mode==="login"?"Don't have an account? ":"Already have an account? "}
          <span onClick={()=>{ setMode(mode==="login"?"signup":"login"); setErr(""); }} style={{ color:C.accent, cursor:"pointer", fontWeight:600 }}>
            {mode==="login"?"Sign up":"Sign in"}
          </span>
        </p>
        <p style={{ textAlign:"center", fontSize:11, color:C.textMuted, margin:"0.5rem 0 0", opacity:0.6 }}>Demo: any email & password works</p>
      </div>
    </div>
  );
}

// ─── CUSTOMER APP ─────────────────────────────────────────────────────────────
function CustomerApp({ user, onSignOut }) {
  const [view,             setView]            = useState("marketplace");
  const [activeStore,      setActiveStore]      = useState(null);
  const [cart,             setCart]             = useState({});
  const [cartStore,        setCartStore]        = useState(null);
  const [hoodFilter,       setHoodFilter]       = useState("All");
  const [showCart,         setShowCart]         = useState(false);
  const [isCharity,        setIsCharity]        = useState(false);
  const [selectedCharity,  setSelectedCharity]  = useState(null);

  const cartCount    = Object.values(cart).reduce((s,q)=>s+q,0);
  const cartStoreObj = STORES.find(s=>s.id===cartStore);
  const cartProducts = cartStore?(STORE_PRODUCTS[cartStore]||[]).filter(p=>cart[p.id]).map(p=>({...p,qty:cart[p.id]})):[];
  const subtotal     = cartProducts.reduce((s,p)=>s+p.price*p.qty,0);
  const delivFee     = cartStoreObj?.deliveryFee||0;
  const total        = subtotal+delivFee;

  const addToCart = (storeId, productId) => {
    if (cartStore&&cartStore!==storeId) {
      if (!window.confirm("Your cart has items from another store. Start a new cart?")) return;
      setCart({}); setCartStore(null);
    }
    setCart(p=>({...p,[productId]:(p[productId]||0)+1}));
    setCartStore(storeId);
  };
  const decCart = id => setCart(p=>{ const n={...p}; n[id]>1?n[id]--:delete n[id]; return n; });

  const CUST_NAV = [
    { id:"marketplace", icon:"▦", label:"Explore"   },
    { id:"chat",        icon:"◎", label:"Community" },
    { id:"charity",     icon:"♥", label:"Donate"    },
    { id:"orders",      icon:"≡", label:"Orders"    },
  ];

  const TopBar = () => (
    <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:"0 1.5rem", height:56, display:"flex", justifyContent:"space-between", alignItems:"center", position:"sticky", top:0, zIndex:50 }}>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <div style={{ width:26, height:26, background:C.accent, borderRadius:5, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13 }}>🍞</div>
        <div>
          <span style={{ fontSize:14, fontWeight:700, color:C.text, letterSpacing:"-0.01em" }}>Hearthside</span>
          <span style={{ fontSize:11, color:C.textMuted, marginLeft:8 }}>📍 {user.hood}</span>
        </div>
      </div>
      <div style={{ display:"flex", gap:8, alignItems:"center" }}>
        {cartCount>0 && (
          <button onClick={()=>setShowCart(true)} style={{ display:"flex", alignItems:"center", gap:8, background:C.accent, color:"#000", border:"none", borderRadius:5, padding:"7px 14px", fontSize:13, fontWeight:700, cursor:"pointer" }}>
            <span>Cart ({cartCount})</span><span>·</span><span>${total.toFixed(2)}</span>
          </button>
        )}
        <span style={{ fontSize:12, color:C.textMuted }}>{user.name.split(" ")[0]}</span>
        <button onClick={onSignOut} style={{ background:"transparent", border:`1px solid ${C.border}`, borderRadius:5, padding:"5px 11px", fontSize:11, color:C.textMuted, cursor:"pointer" }}>Out</button>
      </div>
    </div>
  );

  const BottomNav = () => (
    <div style={{ position:"fixed", bottom:0, left:0, right:0, background:C.surface, borderTop:`1px solid ${C.border}`, display:"flex", zIndex:40, height:58 }}>
      {CUST_NAV.map(n=>{
        const active = view===n.id;
        return (
          <button key={n.id} onClick={()=>{ setView(n.id); setActiveStore(null); }} style={{
            flex:1, border:"none", background:"transparent", cursor:"pointer",
            borderTop:`2px solid ${active?C.accent:"transparent"}`,
            display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:3
          }}>
            <span style={{ fontSize:15, color:active?C.accent:C.textMuted }}>{n.icon}</span>
            <span style={{ fontSize:10, color:active?C.accent:C.sidebarText, fontWeight:active?600:400, letterSpacing:"0.02em" }}>{n.label}</span>
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
      <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"'DM Sans', system-ui, sans-serif", paddingBottom:80 }}>
        <TopBar/>
        <div style={{ padding:"1.25rem 1.5rem 1rem", borderBottom:`1px solid ${C.border}`, background:C.surface }}>
          <button onClick={()=>setActiveStore(null)} style={{ background:"transparent", border:"none", fontSize:13, color:C.textMuted, cursor:"pointer", fontWeight:500, marginBottom:12, padding:0, display:"flex", alignItems:"center", gap:5 }}>← Back</button>
          <div style={{ display:"flex", alignItems:"flex-start", gap:14 }}>
            <div style={{ width:56, height:56, background:C.surfaceHigh, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, flexShrink:0 }}>{store.emoji}</div>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                <h1 style={{ fontSize:20, fontWeight:700, color:C.text, margin:0, letterSpacing:"-0.02em" }}>{store.name}</h1>
                {store.badge && <span style={{ background:C.accentBg, color:C.accent, fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:3, letterSpacing:"0.04em" }}>{store.badge}</span>}
              </div>
              <p style={{ fontSize:12, color:C.textMuted, margin:"0 0 4px" }}>📍 {store.hood} · ⭐ {store.rating} ({store.reviews} reviews)</p>
              <p style={{ fontSize:13, color:C.textSub, margin:0 }}>{store.desc}</p>
            </div>
          </div>
          <div style={{ display:"flex", gap:8, marginTop:12, flexWrap:"wrap" }}>
            <span style={{ background:C.surfaceHigh, padding:"4px 10px", borderRadius:4, fontSize:12, color:C.textMuted }}>🚗 Delivery ${store.deliveryFee}</span>
            <span style={{ background:C.surfaceHigh, padding:"4px 10px", borderRadius:4, fontSize:12, color:C.textMuted }}>📦 Min. ${store.minOrder}</span>
            {store.whatsapp && (
              <a href={`https://wa.me/${store.whatsapp.replace(/[^0-9]/g,"")}`} target="_blank" rel="noreferrer"
                style={{ display:"inline-flex", alignItems:"center", gap:5, background:"#25D366", color:"#FFF", padding:"4px 12px", borderRadius:4, fontSize:12, fontWeight:600, textDecoration:"none" }}>
                <span>WhatsApp</span>
              </a>
            )}
            {store.instagram && (
              <a href={`https://instagram.com/${store.instagram.replace("@","")}`} target="_blank" rel="noreferrer"
                style={{ display:"inline-flex", alignItems:"center", gap:5, background:"linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)", color:"#FFF", padding:"4px 12px", borderRadius:4, fontSize:12, fontWeight:600, textDecoration:"none" }}>
                <span>Instagram</span>
              </a>
            )}
          </div>
        </div>
        <div style={{ padding:"1rem 1.5rem" }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(2,minmax(0,1fr))", gap:10 }}>
            {products.map(p=>(
              <div key={p.id} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:"1rem" }}>
                {p.image_url
                ? <img src={p.image_url} alt={p.name} style={{ width:"100%", height:90, objectFit:"cover", borderRadius:4, marginBottom:10, display:"block" }}/>
                : <div style={{ width:40, height:40, background:C.surfaceHigh, borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, marginBottom:10 }}>{p.emoji}</div>
              }
                <p style={{ fontSize:14, fontWeight:600, color:C.text, margin:"0 0 4px", letterSpacing:"-0.01em" }}>{p.name}</p>
                <p style={{ fontSize:11, color:C.textMuted, margin:"0 0 12px", lineHeight:1.5 }}>{p.desc}</p>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontSize:16, fontWeight:700, color:C.accent, letterSpacing:"-0.01em" }}>${p.price.toFixed(2)}</span>
                  {cart[p.id] ? (
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <button onClick={()=>decCart(p.id)} style={{ width:28, height:28, border:`1px solid ${C.border}`, borderRadius:4, background:"transparent", cursor:"pointer", fontSize:16, color:C.text }}>−</button>
                      <span style={{ fontSize:14, fontWeight:700, color:C.text, minWidth:16, textAlign:"center" }}>{cart[p.id]}</span>
                      <button onClick={()=>addToCart(activeStore,p.id)} style={{ width:28, height:28, border:"none", borderRadius:4, background:C.accent, cursor:"pointer", fontSize:16, color:"#000" }}>+</button>
                    </div>
                  ) : (
                    <button onClick={()=>addToCart(activeStore,p.id)} style={{ background:C.accent, color:"#000", border:"none", borderRadius:4, padding:"6px 14px", fontSize:12, fontWeight:700, cursor:"pointer" }}>Add</button>
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
      const itemsSummary = cartProducts.map(p=>`${p.name} x${p.qty}`).join(", ");
      await supabase.from("orders").insert({
        customer_id: user.id,
        seller_id: cartStoreObj?.id?.toString()||"unknown",
        items: itemsSummary,
        total,
        status: "preparing",
        is_charity: isCharity,
        charity_name: isCharity?(selectedCharity?.name||null):null,
      });
      await new Promise(r=>setTimeout(r,800));
      setProc(false); setDone(true);
    };

    if (!showCart) return null;
    const FI = ({ label, value, onChange, ph, type="text" }) => (
      <div style={{ marginBottom:10 }}>
        <label style={{ fontSize:10, fontWeight:600, color:C.textMuted, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.08em" }}>{label}</label>
        <input type={type} value={value} onChange={onChange} placeholder={ph}
          style={{ width:"100%", padding:"10px 12px", border:`1px solid ${C.border}`, borderRadius:5, fontSize:13, color:C.text, background:C.surfaceHigh, outline:"none", boxSizing:"border-box" }}
          onFocus={e=>e.target.style.borderColor=C.accent} onBlur={e=>e.target.style.borderColor=C.border}/>
      </div>
    );

    return (
      <div style={{ position:"fixed", inset:0, zIndex:100, display:"flex" }}>
        <div onClick={()=>setShowCart(false)} style={{ flex:1, background:"rgba(0,0,0,0.7)" }}/>
        <div style={{ width:420, background:C.surface, borderLeft:`1px solid ${C.border}`, overflowY:"auto", display:"flex", flexDirection:"column", fontFamily:"'DM Sans', system-ui, sans-serif" }}>
          {done ? (
            <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"2.5rem", textAlign:"center" }}>
              <div style={{ width:64, height:64, background:isCharity?C.charityBg:C.accentBg, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, marginBottom:16 }}>{isCharity?"💜":"✓"}</div>
              <h2 style={{ fontSize:22, fontWeight:700, color:C.text, margin:"0 0 8px", letterSpacing:"-0.02em" }}>{isCharity?"Donation Confirmed!":"Order Confirmed!"}</h2>
              <p style={{ color:C.textMuted, fontSize:13, margin:"0 0 2rem", lineHeight:1.6 }}>
                {isCharity?`Your donation to ${selectedCharity?.name||"the charity"} is confirmed. Thank you! 💜`:`${cartStoreObj?.name} has been notified and will start baking soon.`}
              </p>
              <button onClick={()=>{ setShowCart(false); setCart({}); setCartStore(null); setIsCharity(false); setSelectedCharity(null); }} style={{ background:C.accent, color:"#000", border:"none", borderRadius:5, padding:"12px 28px", fontSize:13, fontWeight:700, cursor:"pointer" }}>Done</button>
            </div>
          ) : (
            <>
              <div style={{ padding:"1rem 1.25rem", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <p style={{ fontWeight:700, fontSize:14, color:C.text, margin:"0 0 1px", letterSpacing:"-0.01em" }}>
                    {step==="review"?"Your Cart":step==="delivery"?"Delivery":"Payment"}
                  </p>
                  <p style={{ fontSize:11, color:C.textMuted, margin:0 }}>{cartStoreObj?.name}</p>
                </div>
                <button onClick={()=>setShowCart(false)} style={{ background:C.surfaceHigh, border:"none", width:28, height:28, borderRadius:4, fontSize:14, cursor:"pointer", color:C.textMuted }}>✕</button>
              </div>

              {step==="review" && (
                <div style={{ margin:"0.75rem 1.25rem 0", background:C.charityBg, border:`1px solid ${C.charityBorder}`, borderRadius:6, padding:"10px 12px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:isCharity?10:0 }}>
                    <div>
                      <p style={{ fontSize:12, fontWeight:600, color:C.charity, margin:"0 0 1px" }}>💜 Donate this order to charity</p>
                      <p style={{ fontSize:11, color:C.textMuted, margin:0 }}>Your cart goes to people in need</p>
                    </div>
                    <Toggle val={isCharity} onChange={()=>setIsCharity(p=>!p)}/>
                  </div>
                  {isCharity && (
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6, marginTop:10 }}>
                      {CHARITIES.map(ch=>(
                        <button key={ch.id} onClick={()=>setSelectedCharity(ch)} style={{
                          padding:"8px 10px", border:`1px solid ${selectedCharity?.id===ch.id?C.charity:C.border}`,
                          borderRadius:5, background:selectedCharity?.id===ch.id?C.charityBg:"transparent", cursor:"pointer", textAlign:"left"
                        }}>
                          <p style={{ fontSize:13, margin:"0 0 2px" }}>{ch.emoji}</p>
                          <p style={{ fontSize:11, fontWeight:600, color:selectedCharity?.id===ch.id?C.charity:C.text, margin:0 }}>{ch.name}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div style={{ flex:1, padding:"0.75rem 1.25rem", overflowY:"auto" }}>
                {step==="review" && <>
                  {cartProducts.map(p=>(
                    <div key={p.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:`1px solid ${C.border}` }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <div style={{ width:36, height:36, background:C.surfaceHigh, borderRadius:5, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>{p.emoji}</div>
                        <div>
                          <p style={{ fontSize:13, color:C.text, fontWeight:500, margin:0 }}>{p.name}</p>
                          <p style={{ fontSize:11, color:C.textMuted, margin:0 }}>× {p.qty}</p>
                        </div>
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <span style={{ fontSize:13, fontWeight:600, color:C.text }}>${(p.price*p.qty).toFixed(2)}</span>
                        <button onClick={()=>decCart(p.id)} style={{ width:22, height:22, border:`1px solid ${C.border}`, borderRadius:3, background:"transparent", cursor:"pointer", fontSize:12, color:C.textMuted }}>−</button>
                      </div>
                    </div>
                  ))}
                  <div style={{ paddingTop:12 }}>
                    {[["Subtotal",`$${subtotal.toFixed(2)}`],["Delivery",`$${delivFee.toFixed(2)}`]].map(([k,v])=>(
                      <div key={k} style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:C.textMuted, marginBottom:5 }}>
                        <span>{k}</span><span>{v}</span>
                      </div>
                    ))}
                    <div style={{ display:"flex", justifyContent:"space-between", fontWeight:700, fontSize:16, marginTop:8, paddingTop:8, borderTop:`1px solid ${C.border}` }}>
                      <span style={{ color:C.text }}>Total</span>
                      <span style={{ color:C.accent }}>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </>}

                {step==="delivery" && <>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:12 }}>
                    {[{ v:"delivery", label:"Delivery", sub:`+$${delivFee}` },{ v:"pickup", label:"Pickup", sub:"Free" }].map(o=>(
                      <button key={o.v} onClick={()=>setDel(p=>({...p,type:o.v}))} style={{
                        padding:"12px", border:`1px solid ${del.type===o.v?C.accent:C.border}`,
                        borderRadius:6, background:del.type===o.v?C.accentBg:"transparent", cursor:"pointer", textAlign:"left"
                      }}>
                        <p style={{ fontSize:13, fontWeight:600, color:del.type===o.v?C.accent:C.text, margin:"0 0 2px" }}>{o.label}</p>
                        <p style={{ fontSize:11, color:C.textMuted, margin:0 }}>{o.sub}</p>
                      </button>
                    ))}
                  </div>
                  <FI label="Your Name" value={del.name} onChange={e=>setDel(p=>({...p,name:e.target.value}))} ph="Full name"/>
                  <FI label="Phone" value={del.phone} onChange={e=>setDel(p=>({...p,phone:e.target.value}))} ph="+1 (416) 555-0100"/>
                  {del.type==="delivery" && <FI label="Address" value={del.address} onChange={e=>setDel(p=>({...p,address:e.target.value}))} ph="123 Main St, Toronto, ON"/>}
                  <div style={{ marginBottom:10 }}>
                    <label style={{ fontSize:10, fontWeight:600, color:C.textMuted, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.08em" }}>Time Slot</label>
                    <select value={del.time} onChange={e=>setDel(p=>({...p,time:e.target.value}))}
                      style={{ width:"100%", padding:"10px 12px", border:`1px solid ${C.border}`, borderRadius:5, fontSize:13, color:C.text, background:C.surfaceHigh, outline:"none" }}>
                      {TIME_SLOTS.map(t=><option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </div>
                </>}

                {step==="payment" && <>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                    <p style={{ fontWeight:600, fontSize:13, color:C.text, margin:0 }}>Card Details</p>
                    <span style={{ fontSize:11, color:C.success, background:C.successBg, padding:"3px 9px", borderRadius:3, fontWeight:600 }}>🔒 Stripe</span>
                  </div>
                  <FI label="Cardholder Name" value={pay.holder} onChange={e=>setPay(p=>({...p,holder:e.target.value}))} ph="Name on card"/>
                  <FI label="Card Number" value={pay.card} onChange={e=>setPay(p=>({...p,card:e.target.value}))} ph="•••• •••• •••• ••••"/>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                    <FI label="Expiry" value={pay.expiry} onChange={e=>setPay(p=>({...p,expiry:e.target.value}))} ph="MM/YY"/>
                    <FI label="CVV" value={pay.cvv} onChange={e=>setPay(p=>({...p,cvv:e.target.value}))} ph="•••"/>
                  </div>
                  {isCharity&&selectedCharity && (
                    <div style={{ marginTop:12, background:C.charityBg, border:`1px solid ${C.charityBorder}`, borderRadius:5, padding:"10px 12px" }}>
                      <p style={{ fontSize:12, color:C.charity, fontWeight:600, margin:"0 0 2px" }}>💜 Donating to: {selectedCharity.name}</p>
                      <p style={{ fontSize:11, color:C.textMuted, margin:0 }}>{selectedCharity.desc}</p>
                    </div>
                  )}
                </>}
              </div>

              <div style={{ padding:"0.75rem 1.25rem", borderTop:`1px solid ${C.border}` }}>
                {step==="review" && <button onClick={()=>setStep("delivery")} style={{ width:"100%", padding:"12px", background:C.accent, color:"#000", border:"none", borderRadius:5, fontSize:13, fontWeight:700, cursor:"pointer" }}>Continue →</button>}
                {step==="delivery" && (
                  <div style={{ display:"flex", gap:8 }}>
                    <button onClick={()=>setStep("review")} style={{ flex:1, padding:"12px", border:`1px solid ${C.border}`, borderRadius:5, background:"transparent", color:C.textMuted, cursor:"pointer", fontSize:13 }}>Back</button>
                    <button onClick={()=>setStep("payment")} style={{ flex:2, padding:"12px", background:C.accent, color:"#000", border:"none", borderRadius:5, fontSize:13, fontWeight:700, cursor:"pointer" }}>Continue →</button>
                  </div>
                )}
                {step==="payment" && (
                  <div style={{ display:"flex", gap:8 }}>
                    <button onClick={()=>setStep("delivery")} style={{ flex:1, padding:"12px", border:`1px solid ${C.border}`, borderRadius:5, background:"transparent", color:C.textMuted, cursor:"pointer", fontSize:13 }}>Back</button>
                    <button onClick={place} disabled={proc} style={{ flex:2, padding:"12px", background:isCharity?C.charity:C.accent, color:isCharity?"#FFF":"#000", border:"none", borderRadius:5, fontSize:13, fontWeight:700, cursor:"pointer" }}>
                      {proc?"Processing...":isCharity?`💜 Donate $${total.toFixed(2)}`:`Place Order · $${total.toFixed(2)}`}
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
    const filtered = hoodFilter==="All"?STORES:STORES.filter(s=>s.hood===hoodFilter);
    return (
      <div style={{ padding:"1.25rem 1.5rem" }}>
        <div style={{ marginBottom:"1rem" }}>
          <h2 style={{ fontSize:22, fontWeight:700, color:C.text, margin:"0 0 3px", letterSpacing:"-0.02em" }}>Explore Local Bakers</h2>
          <p style={{ fontSize:13, color:C.textMuted, margin:0 }}>Fresh home-baked goods from your neighbourhood</p>
        </div>
        <div style={{ display:"flex", gap:7, marginBottom:"1rem", overflowX:"auto", paddingBottom:4 }}>
          {HOODS.map(h=><Pill key={h} label={h} active={hoodFilter===h} onClick={()=>setHoodFilter(h)}/>)}
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(2,minmax(0,1fr))", gap:10 }}>
          {filtered.map(store=>(
            <div key={store.id} onClick={()=>setActiveStore(store.id)} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:"1rem", cursor:"pointer", transition:"border-color 0.15s" }}
              onMouseEnter={e=>e.currentTarget.style.borderColor=C.borderMid}
              onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                <div style={{ width:44, height:44, background:C.surfaceHigh, borderRadius:7, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>{store.emoji}</div>
                {store.badge && <span style={{ background:C.accentBg, color:C.accent, fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:3, letterSpacing:"0.04em" }}>{store.badge}</span>}
              </div>
              <p style={{ fontSize:14, fontWeight:600, color:C.text, margin:"0 0 3px", letterSpacing:"-0.01em" }}>{store.name}</p>
              <p style={{ fontSize:11, color:C.textMuted, margin:"0 0 5px" }}>📍 {store.hood}</p>
              <p style={{ fontSize:11, color:C.textSub, margin:"0 0 10px", lineHeight:1.5 }}>{store.desc}</p>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontSize:11, color:C.textMuted }}>⭐ {store.rating} · {store.reviews}</span>
                <span style={{ fontSize:11, color:C.accent, fontWeight:600 }}>Browse →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ── COMMUNITY CHAT — WhatsApp style ──
  const CommunityChat = () => {
    const CHANNELS = [
      { id:"leslieville",  name:"Leslieville",    emoji:"🏘️", last:"Fresh sourdough ready!", time:"8:02am",  unread:3 },
      { id:"kensington",   name:"Kensington",     emoji:"🌿", last:"Custom cakes for Easter", time:"10:30am", unread:1 },
      { id:"chinatown",    name:"Chinatown",      emoji:"🥟", last:"Dumplings at $12/dozen",  time:"8:45am",  unread:5 },
      { id:"brampton",     name:"Brampton",       emoji:"🫙", last:"Mango chutney ready",    time:"9:10am",  unread:0 },
      { id:"roncesvalles", name:"Roncesvalles",   emoji:"☀️", last:"Focaccia back on menu",  time:"11:00am", unread:2 },
      { id:"city",         name:"City-wide",      emoji:"🌆", last:"Morning update from bakers", time:"7:00am", unread:0 },
    ];
    const CHANNEL_MSGS = {
      leslieville:  [{ id:1, seller:"Maria's Home Bakery", emoji:"🍞", time:"8:02am", msg:"Fresh sourdough just out of the oven! 8 loaves available today 🔥 Order by noon for afternoon pickup." },{ id:2, seller:"Sunshine Sourdough", emoji:"☀️", time:"9:30am", msg:"Country loaf also available — limited to 4 orders." }],
      kensington:   [{ id:1, seller:"Aisha's Sweet Corner", emoji:"🧁", time:"10:30am", msg:"Taking custom cake orders for Easter weekend. DM me your design! Minimum 3 days notice needed 🎂" }],
      chinatown:    [{ id:1, seller:"The Dumpling Den", emoji:"🥟", time:"8:45am", msg:"Making an extra batch of pork dumplings today — 5 orders left at the special price of $12/dozen!" }],
      brampton:     [{ id:1, seller:"Biji's Spice Kitchen", emoji:"🫙", time:"9:10am", msg:"New batch of mango chutney and mixed pickle ready 🥭 Also fresh roti every morning this week." }],
      roncesvalles: [{ id:1, seller:"Sunshine Sourdough", emoji:"☀️", time:"11:00am", msg:"Focaccia is back on the menu. Rosemary & sea salt, ready by 2pm today." }],
      city:         [{ id:1, seller:"Hearthside", emoji:"🍞", time:"7:00am", msg:"Good morning Toronto! Explore local bakers near you and support your neighbours 🧡" }],
    };

    const [activeChannel, setActiveChannel] = useState(null);
    const [channelMsgs,   setChannelMsgs]   = useState(CHANNEL_MSGS);
    const [reply,         setReply]         = useState("");
    const bottomRef = useRef(null);

    const send = () => {
      if (!reply.trim()||!activeChannel) return;
      setChannelMsgs(p=>({ ...p, [activeChannel.id]:[...(p[activeChannel.id]||[]),{ id:Date.now(), seller:"You", emoji:"🛍️", time:"now", msg:reply.trim(), mine:true }] }));
      setReply("");
      setTimeout(()=>bottomRef.current?.scrollIntoView({ behavior:"smooth" }),100);
    };

    if (!activeChannel) return (
      <div style={{ display:"flex", flexDirection:"column", height:"calc(100vh - 120px)" }}>
        <div style={{ padding:"1rem 1.5rem", borderBottom:`1px solid ${C.border}`, background:C.surface }}>
          <h2 style={{ fontSize:20, fontWeight:700, color:C.text, margin:"0 0 2px", letterSpacing:"-0.02em" }}>Community</h2>
          <p style={{ fontSize:12, color:C.textMuted, margin:0 }}>Live broadcasts from bakers near you</p>
        </div>
        <div style={{ flex:1, overflowY:"auto" }}>
          {CHANNELS.map(ch=>(
            <div key={ch.id} onClick={()=>setActiveChannel(ch)} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 1.5rem", borderBottom:`1px solid ${C.border}`, cursor:"pointer", background:C.surface, transition:"background 0.1s" }}
              onMouseEnter={e=>e.currentTarget.style.background=C.surfaceHigh}
              onMouseLeave={e=>e.currentTarget.style.background=C.surface}>
              <div style={{ width:46, height:46, borderRadius:"50%", background:C.chatBg, border:`1px solid rgba(13,110,92,0.2)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>{ch.emoji}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                  <span style={{ fontSize:14, fontWeight:600, color:C.text }}>{ch.name}</span>
                  <span style={{ fontSize:11, color:C.textMuted }}>{ch.time}</span>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontSize:12, color:C.textMuted, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:220 }}>{ch.last}</span>
                  {ch.unread>0 && <span style={{ background:C.chat, color:"#FFF", fontSize:10, fontWeight:700, borderRadius:"50%", width:18, height:18, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginLeft:8 }}>{ch.unread}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );

    const msgs = channelMsgs[activeChannel.id]||[];
    return (
      <div style={{ display:"flex", flexDirection:"column", height:"calc(100vh - 120px)" }}>
        <div style={{ padding:"0.75rem 1.5rem", borderBottom:`1px solid ${C.border}`, background:C.surface, display:"flex", alignItems:"center", gap:10 }}>
          <button onClick={()=>setActiveChannel(null)} style={{ background:"transparent", border:"none", fontSize:18, cursor:"pointer", color:C.textMuted, padding:0 }}>←</button>
          <div style={{ width:34, height:34, borderRadius:"50%", background:C.chatBg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:17 }}>{activeChannel.emoji}</div>
          <div>
            <p style={{ fontSize:14, fontWeight:700, color:C.text, margin:0 }}>{activeChannel.name}</p>
            <p style={{ fontSize:11, color:C.textMuted, margin:0 }}>{msgs.length} broadcast{msgs.length!==1?"s":""}</p>
          </div>
        </div>
        <div style={{ flex:1, overflowY:"auto", padding:"1rem 1.5rem", background:C.bg, display:"flex", flexDirection:"column", gap:10 }}>
          {msgs.map(m=>(
            <div key={m.id} style={{ display:"flex", justifyContent:m.mine?"flex-end":"flex-start" }}>
              {!m.mine && <div style={{ width:30, height:30, borderRadius:"50%", background:C.chatBg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, marginRight:7, flexShrink:0, alignSelf:"flex-end" }}>{m.emoji}</div>}
              <div style={{ maxWidth:"72%" }}>
                {!m.mine && <p style={{ fontSize:10, fontWeight:600, color:C.chat, margin:"0 0 3px" }}>{m.seller}</p>}
                <div style={{ background:m.mine?C.accent:C.surface, border:`1px solid ${m.mine?"transparent":C.border}`, borderRadius:m.mine?"12px 12px 4px 12px":"12px 12px 12px 4px", padding:"9px 13px" }}>
                  <p style={{ fontSize:13, color:m.mine?"#FFF":C.text, margin:0, lineHeight:1.6 }}>{m.msg}</p>
                </div>
                {!m.mine && (
                  <button onClick={()=>{ const s=STORES.find(st=>st.name===m.seller); if(s) setActiveStore(s.id); }} style={{ background:"transparent", border:"none", fontSize:11, color:C.chat, cursor:"pointer", padding:"3px 0 0", fontWeight:600 }}>
                    View store →
                  </button>
                )}
                <p style={{ fontSize:10, color:C.textMuted, margin:"2px 0 0", textAlign:m.mine?"right":"left" }}>{m.time}</p>
              </div>
            </div>
          ))}
          <div ref={bottomRef}/>
        </div>
        <div style={{ padding:"0.625rem 1.25rem", borderTop:`1px solid ${C.border}`, background:C.surface, display:"flex", gap:8, alignItems:"center" }}>
          <input value={reply} onChange={e=>setReply(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Message..."
            style={{ flex:1, padding:"10px 14px", border:`1px solid ${C.border}`, borderRadius:20, fontSize:13, color:C.text, background:C.surfaceHigh, outline:"none" }}/>
          <button onClick={send} style={{ width:38, height:38, borderRadius:"50%", background:C.accent, border:"none", cursor:"pointer", color:"#FFF", fontSize:15, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>→</button>
        </div>
      </div>
    );
  };

  // ── CHARITY PAGE ──
  const CharityPage = () => {
    const [selected, setSelected] = useState(selectedCharity);
    return (
      <div style={{ padding:"1.25rem 1.5rem" }}>
        <div style={{ background:C.charityBg, border:`1px solid ${C.charityBorder}`, borderRadius:8, padding:"1.25rem", marginBottom:"1.25rem" }}>
          <p style={{ fontSize:28, margin:"0 0 8px" }}>💜</p>
          <h2 style={{ fontSize:20, fontWeight:700, color:C.text, margin:"0 0 5px", letterSpacing:"-0.02em" }}>Donate Food to Your Community</h2>
          <p style={{ fontSize:13, color:C.textMuted, margin:0, lineHeight:1.6 }}>Order from any local baker and send it directly to a charity near you.</p>
        </div>
        <p style={{ fontSize:10, fontWeight:700, color:C.textMuted, textTransform:"uppercase", letterSpacing:"0.1em", margin:"0 0 10px" }}>Choose a charity</p>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:"1.25rem" }}>
          {CHARITIES.map(ch=>(
            <div key={ch.id} onClick={()=>setSelected(ch)} style={{
              background:selected?.id===ch.id?C.charityBg:C.surface,
              border:`1px solid ${selected?.id===ch.id?C.charity:C.border}`,
              borderRadius:7, padding:"0.875rem", cursor:"pointer"
            }}>
              <span style={{ fontSize:24, display:"block", marginBottom:6 }}>{ch.emoji}</span>
              <p style={{ fontSize:13, fontWeight:600, color:selected?.id===ch.id?C.charity:C.text, margin:"0 0 3px" }}>{ch.name}</p>
              <p style={{ fontSize:11, color:C.textMuted, margin:"0 0 4px", lineHeight:1.4 }}>{ch.desc}</p>
              <span style={{ fontSize:10, color:C.textMuted, background:C.surfaceHigh, padding:"2px 7px", borderRadius:3 }}>📍 {ch.hood}</span>
            </div>
          ))}
        </div>
        {selected && (
          <div style={{ background:C.charityBg, border:`1px solid ${C.charityBorder}`, borderRadius:6, padding:"10px 14px", marginBottom:"1rem" }}>
            <p style={{ fontWeight:600, fontSize:13, color:C.charity, margin:"0 0 3px" }}>✓ {selected.name} selected</p>
            <p style={{ fontSize:12, color:C.textMuted, margin:0, lineHeight:1.5 }}>Click Browse Stores to add items. Your donation will be pre-selected at checkout.</p>
          </div>
        )}
        <button onClick={()=>{ if(selected){ setSelectedCharity(selected); setIsCharity(true); } setView("marketplace"); }} style={{ width:"100%", padding:"12px", background:selected?C.charity:"rgba(255,255,255,0.08)", color:selected?"#FFF":C.textMuted, border:"none", borderRadius:5, fontSize:13, fontWeight:700, cursor:selected?"pointer":"default" }}>
          {selected?"Browse Stores to Donate →":"Select a charity above first"}
        </button>
        <div style={{ marginTop:"1.5rem", borderTop:`1px solid ${C.border}`, paddingTop:"1.25rem" }}>
          <p style={{ fontSize:10, fontWeight:700, color:C.textMuted, textTransform:"uppercase", letterSpacing:"0.1em", margin:"0 0 10px" }}>Your impact</p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
            {[["12","Meals donated"],["3","Families helped"],["$48","Total donated"]].map(([v,l])=>(
              <div key={l} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:6, padding:"10px", textAlign:"center" }}>
                <p style={{ fontSize:22, fontWeight:700, color:C.charity, margin:"0 0 2px", letterSpacing:"-0.02em" }}>{v}</p>
                <p style={{ fontSize:10, color:C.textMuted, margin:0 }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ── MY ORDERS ──
  const MyOrders = () => {
    const [myOrders,        setMyOrders]        = useState([]);
    const [loadingMyOrders, setLoadingMyOrders] = useState(true);
    useEffect(()=>{
      if (!user?.id) { setLoadingMyOrders(false); return; }
      supabase.from("orders").select("*").eq("customer_id", user.id).order("created_at", { ascending:false })
        .then(({ data })=>{ if (data) setMyOrders(data.map(o=>({ ...o, date:new Date(o.created_at).toLocaleDateString("en-US",{month:"short",day:"numeric"}) }))); setLoadingMyOrders(false); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    if (loadingMyOrders) return <div style={{ padding:"2rem", textAlign:"center", color:C.textMuted, fontSize:13 }}>Loading...</div>;
    return (
      <div style={{ padding:"1.25rem 1.5rem" }}>
        <h2 style={{ fontSize:20, fontWeight:700, color:C.text, margin:"0 0 3px", letterSpacing:"-0.02em" }}>My Orders</h2>
        <p style={{ fontSize:13, color:C.textMuted, margin:"0 0 1.25rem" }}>Your order history</p>
        {myOrders.length===0 && (
          <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:"2.5rem", textAlign:"center" }}>
            <p style={{ fontSize:28, margin:"0 0 8px" }}>🛒</p>
            <p style={{ fontSize:14, color:C.textMuted, margin:0 }}>No orders yet — browse a store to get started!</p>
          </div>
        )}
        {myOrders.map(o=>(
          <div key={o.id} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:"1rem", marginBottom:8 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
              <div>
                <p style={{ fontSize:13, fontWeight:600, color:C.text, margin:"0 0 2px" }}>{o.items?.split(",")[0]||"Order"}</p>
                <p style={{ fontSize:11, color:C.textMuted, margin:0 }}>{o.items}</p>
              </div>
              <div style={{ textAlign:"right" }}>
                <p style={{ fontSize:13, fontWeight:700, color:C.accent, margin:"0 0 4px" }}>${o.total?.toFixed(2)||"0.00"}</p>
                {o.is_charity && <span style={{ fontSize:10, background:C.charityBg, color:C.charity, padding:"2px 7px", borderRadius:3, fontWeight:600 }}>💜 Donated</span>}
              </div>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <Badge status={o.status||"preparing"}/>
              <span style={{ fontSize:11, color:C.textMuted }}>{o.date}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"'DM Sans', system-ui, sans-serif", paddingBottom:64 }}>
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
const COST_CATS_DEF = [
  { value:"ingredients", label:"Ingredients", color:"#C4622D" },
  { value:"packaging",   label:"Packaging",   color:"#A07010" },
  { value:"delivery",    label:"Delivery",    color:"#1A6B9C" },
  { value:"equipment",   label:"Equipment",   color:"#1E7A48" },
  { value:"other",       label:"Other",       color:"#9C7A66" },
];

function SellerApp({ user, onSignOut }) {
  const [view,            setView]            = useState("dashboard");
  const [products,        setProducts]        = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  // Shared finances state — read by Dashboard, written by Finances
  const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const now = new Date();
  const [finMonth,    setFinMonth]    = useState(`${MONTHS[now.getMonth()]} ${now.getFullYear()}`);
  const [finRevenue,  setFinRevenue]  = useState("");
  const [finCosts,    setFinCosts]    = useState([]);
  const [finHistory,  setFinHistory]  = useState([]); // [{month, revenue, costs:[]}]
  const revenueInputRef = useRef(null); // uncontrolled ref — prevents focus loss

  useEffect(()=>{
    if (!user?.id) { setProducts([]); setLoadingProducts(false); return; }
    // Load products
    supabase.from("products").select("*").eq("seller_id", user.id)
      .then(({ data })=>{ if (data&&data.length>0) setProducts(data); else setProducts([]); setLoadingProducts(false); });
    // Load delivery settings (stored as jsonb in profiles.delivery_settings)
    // Delivery component reads from its own useState — we store as profile column
    // and reload on mount via a separate effect below
    // Load profile data (desc, instagram, whatsapp, logo)
    supabase.from("profiles").select("desc,instagram,whatsapp,logo_url,business,hood").eq("id", user.id).single()
      .then(({ data })=>{
        if (data) {
          setProfileData(p=>({ ...p,
            desc:       data.desc||"",
            instagram:  data.instagram||"",
            whatsapp:   data.whatsapp||"",
            business:   data.business||p.business,
            hood:       data.hood||p.hood,
          }));
          if (data.logo_url) setLogoPreview(data.logo_url);
        }
      });
    // Load current month finances
    const curMonth = `${MONTHS[new Date().getMonth()]} ${new Date().getFullYear()}`;
    supabase.from("finances").select("*").eq("seller_id", user.id).order("created_at", { ascending:false })
      .then(({ data })=>{
        if (!data || data.length===0) return;
        const current = data.find(r=>r.month===curMonth)||data[0];
        if (current) {
          setFinMonth(current.month);
          const rv = String(current.revenue||"");
          setFinRevenue(rv);
          if (revenueInputRef.current) revenueInputRef.current.value = rv;
          const rawCosts = current.costs||[];
          const parsedCosts = typeof rawCosts==="string" ? JSON.parse(rawCosts) : rawCosts;
          setFinCosts(parsedCosts.map(c=>({ ...c, color: COST_CATS_DEF.find(cat=>cat.value===c.cat)?.color||"#9C7A66" })));
        }
        // All other months go into history
        const history = data.filter(r=>r.month!==current.month).map(r=>({
          month: r.month,
          revenue: r.revenue||0,
          costs: (typeof r.costs==="string" ? JSON.parse(r.costs) : r.costs)||[],
        }));
        setFinHistory(history);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── SIDEBAR ──
  const [showProfilePanel, setShowProfilePanel] = useState(false);
  const [profileData, setProfileData] = useState({
    business: user.business||"",
    desc: "",
    hood: user.hood||"Lessieville",
    whatsapp: "",
    instagram: "",
  });
  const [logoFile,    setLogoFile]    = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaved,  setProfileSaved]  = useState(false);

  const handleLogoFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const saveProfile = async () => {
    setProfileSaving(true);
    let logoUrl = null;
    if (logoFile) {
      const ext = logoFile.name.split(".").pop();
      const path = `logos/${user.id}.${ext}`;
      const { error:upErr } = await supabase.storage.from("product-images").upload(path, logoFile, { upsert:true });
      if (!upErr) {
        const { data:urlData } = supabase.storage.from("product-images").getPublicUrl(path);
        logoUrl = urlData.publicUrl;
      }
    }
    const updates = {
      business:   profileData.business,
      desc:       profileData.desc,
      hood:       profileData.hood,
      whatsapp:   profileData.whatsapp,
      instagram:  profileData.instagram,
    };
    if (logoUrl) updates.logo_url = logoUrl;
    await supabase.from("profiles").update(updates).eq("id", user.id);
    setProfileSaving(false); setProfileSaved(true);
    setTimeout(()=>setProfileSaved(false), 2500);
  };

  const ProfilePanel = () => (
    showProfilePanel ? (
      <div style={{ position:"fixed", inset:0, zIndex:300, display:"flex", alignItems:"center", justifyContent:"center" }}>
        <div onClick={()=>setShowProfilePanel(false)} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.6)" }}/>
        <div style={{ position:"relative", width:600, maxWidth:"92vw", maxHeight:"88vh", background:C.surface, borderRadius:16, border:`1px solid ${C.border}`, overflowY:"auto", fontFamily:"'DM Sans', system-ui, sans-serif", boxShadow:"0 24px 60px rgba(0,0,0,0.35)" }}>
          <div style={{ padding:"1.5rem 2rem", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center", position:"sticky", top:0, background:C.surface, zIndex:10 }}>
            <div>
              <p style={{ fontSize:20, fontWeight:700, color:C.text, margin:"0 0 2px", letterSpacing:"-0.02em" }}>Store Profile</p>
              <p style={{ fontSize:13, color:C.textMuted, margin:0 }}>How customers see your store</p>
            </div>
            <button onClick={()=>setShowProfilePanel(false)} style={{ background:C.surfaceHigh, border:"none", width:34, height:34, borderRadius:7, fontSize:18, cursor:"pointer", color:C.textMuted }}>✕</button>
          </div>
          <div style={{ padding:"1.75rem 2rem" }}>
            {/* Logo */}
            <div style={{ marginBottom:22 }}>
              <label style={{ fontSize:10, fontWeight:700, color:C.textMuted, display:"block", marginBottom:12, textTransform:"uppercase", letterSpacing:"0.08em" }}>Store Logo</label>
              <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                <div style={{ width:90, height:90, borderRadius:14, background:C.surfaceHigh, border:`2px dashed ${logoPreview?C.accent:C.border}`, overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  {logoPreview
                    ? <img src={logoPreview} alt="logo" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                    : <span style={{ fontSize:11, color:C.textMuted, textAlign:"center", padding:"0 6px", lineHeight:1.4 }}>No logo</span>
                  }
                </div>
                <div>
                  <label style={{ display:"inline-block", background:C.accent, color:"#FFF", borderRadius:5, padding:"8px 14px", fontSize:12, fontWeight:700, cursor:"pointer", marginBottom:5 }}>
                    <input type="file" accept="image/*" onChange={handleLogoFile} style={{ display:"none" }}/>
                    {logoPreview?"Change":"Upload Logo"}
                  </label>
                  {logoPreview && (
                    <button onClick={()=>{ setLogoFile(null); setLogoPreview(null); }} style={{ display:"block", background:"transparent", border:"none", fontSize:11, color:C.textMuted, cursor:"pointer", padding:0 }}>Remove</button>
                  )}
                  <p style={{ fontSize:10, color:C.textMuted, margin:"4px 0 0", opacity:0.7 }}>400×400px · JPG or PNG</p>
                </div>
              </div>
            </div>

            {/* Fields */}
            {[
              { label:"Bakery Name",       key:"business",  ph:"Maria's Home Bakery"  },
              { label:"Store Description", key:"desc",      ph:"What makes you special...", multi:true },
              { label:"Instagram",         key:"instagram", ph:"@mybakery"             },
              { label:"WhatsApp Number",   key:"whatsapp",  ph:"+1 (416) 555-0100"    },
            ].map(f=>(
              <div key={f.key} style={{ marginBottom:14 }}>
                <label style={{ fontSize:10, fontWeight:700, color:C.textMuted, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.08em" }}>{f.label}</label>
                {f.multi
                  ? <textarea value={profileData[f.key]} onChange={e=>setProfileData(p=>({...p,[f.key]:e.target.value}))} rows={3} placeholder={f.ph}
                      style={{ width:"100%", padding:"9px 12px", border:`1px solid ${C.border}`, borderRadius:5, fontSize:13, color:C.text, background:C.surfaceHigh, outline:"none", resize:"none", boxSizing:"border-box" }}/>
                  : <input value={profileData[f.key]} onChange={e=>setProfileData(p=>({...p,[f.key]:e.target.value}))} placeholder={f.ph}
                      style={{ width:"100%", padding:"9px 12px", border:`1px solid ${C.border}`, borderRadius:5, fontSize:13, color:C.text, background:C.surfaceHigh, outline:"none", boxSizing:"border-box" }}/>
                }
              </div>
            ))}

            <div style={{ marginBottom:18 }}>
              <label style={{ fontSize:10, fontWeight:700, color:C.textMuted, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.08em" }}>Neighbourhood</label>
              <select value={profileData.hood} onChange={e=>setProfileData(p=>({...p,hood:e.target.value}))}
                style={{ width:"100%", padding:"9px 12px", border:`1px solid ${C.border}`, borderRadius:5, fontSize:13, color:C.text, background:C.surfaceHigh, outline:"none" }}>
                {HOODS.filter(h=>h!=="All").map(h=><option key={h} value={h}>{h}</option>)}
              </select>
            </div>

            <div style={{ background:C.accentBg, border:`1px solid ${C.accentBorder}`, borderRadius:6, padding:"10px 12px", marginBottom:18 }}>
              <p style={{ fontSize:10, fontWeight:700, color:C.accent, margin:"0 0 3px" }}>Your store link</p>
              <p style={{ fontSize:12, color:C.textSub, fontFamily:"monospace", margin:0 }}>hearthside.app/store/{user.id?.slice(0,8)||"your-id"}</p>
            </div>

            <button onClick={saveProfile} disabled={profileSaving} style={{ width:"100%", padding:"14px", background:profileSaved?C.success:C.accent, color:"#FFF", border:"none", borderRadius:5, fontSize:13, fontWeight:700, cursor:"pointer", transition:"background 0.2s" }}>
              {profileSaving?"Saving...":profileSaved?"✓ Profile Saved!":"Save Profile"}
            </button>
          </div>
        </div>
      </div>
    ) : null
  );

  const Sidebar = () => (
    <div style={{ width:220, background:C.sidebar, display:"flex", flexDirection:"column", flexShrink:0, borderRight:`1px solid rgba(255,255,255,0.06)` }}>
      <button onClick={()=>setShowProfilePanel(true)} style={{
        padding:"1.25rem 1rem", borderBottom:`1px solid rgba(255,255,255,0.06)`,
        display:"flex", alignItems:"center", gap:10, background:"transparent", border:"none",
        cursor:"pointer", textAlign:"left", width:"100%",
      }}
        onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.04)"}
        onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
        <div style={{ width:34, height:34, borderRadius:7, background:logoPreview?"transparent":C.accent, overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>
          {logoPreview
            ? <img src={logoPreview} alt="logo" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
            : <span>🍞</span>
          }
        </div>
        <div style={{ minWidth:0, flex:1 }}>
          <p style={{ color:C.sidebarText, fontSize:15, fontWeight:700, margin:0, letterSpacing:"-0.01em", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{profileData.business||user.business}</p>
          <p style={{ color:C.sidebarMuted, fontSize:12, margin:0 }}>Edit store profile →</p>
        </div>
      </button>
      <nav style={{ flex:1, padding:"0.5rem" }}>
        {SELLER_NAV.map(item=>{
          const active = view===item.id;
          return (
            <button key={item.id} onClick={()=>setView(item.id)} style={{
              display:"flex", alignItems:"center", gap:10, width:"100%", padding:"8px 10px",
              background:active?"rgba(196,98,45,0.15)":"transparent", border:"none",
              borderRadius:5, cursor:"pointer", marginBottom:1, textAlign:"left"
            }}>
              <span style={{ fontSize:15, color:active?C.accent:C.sidebarMuted, width:18, textAlign:"center" }}>{item.icon}</span>
              <span style={{ fontSize:15, color:active?C.accent:C.sidebarText, fontWeight:active?600:400 }}>{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div style={{ padding:"0.75rem" }}>
        <button onClick={onSignOut} style={{ display:"flex", alignItems:"center", gap:8, width:"100%", padding:"8px 10px", background:"transparent", border:"1px solid rgba(255,255,255,0.1)", borderRadius:5, cursor:"pointer" }}>
          <span style={{ fontSize:14, color:C.sidebarMuted }}>Sign out</span>
        </button>
      </div>
    </div>
  );

  // ── SELLER COMMUNITY — WhatsApp style ──
  const SellerCommunity = () => {
    const CHANNELS = [
      { id:"leslieville",    name:"Leslieville",     emoji:"🏘️", last:"Fresh sourdough ready!", time:"8:02am",  unread:3 },
      { id:"kensington",     name:"Kensington",      emoji:"🌿", last:"Custom cakes for Easter", time:"10:30am", unread:1 },
      { id:"chinatown",      name:"Chinatown",        emoji:"🥟", last:"Dumplings at $12/dozen", time:"8:45am",  unread:5 },
      { id:"brampton",       name:"Brampton",         emoji:"🫙", last:"Mango chutney ready",   time:"9:10am",  unread:0 },
      { id:"roncesvalles",   name:"Roncesvalles",     emoji:"☀️", last:"Focaccia back on menu", time:"11:00am", unread:2 },
      { id:"city",           name:"City-wide",        emoji:"🌆", last:"Broadcast to all",      time:"7:00am",  unread:0 },
    ];
    const CHANNEL_MSGS = {
      leslieville:  [{ id:1, seller:"Maria's Home Bakery", emoji:"🍞", mine:false, time:"8:02am", msg:"Fresh sourdough just out of the oven! 8 loaves available today 🔥 Order by noon for afternoon pickup." },{ id:2, seller:"Sunshine Sourdough", emoji:"☀️", mine:false, time:"9:30am", msg:"Country loaf also available today — limited to 4 orders." }],
      kensington:   [{ id:1, seller:"Aisha's Sweet Corner", emoji:"🧁", mine:false, time:"10:30am", msg:"Taking custom cake orders for Easter weekend. DM me your design! Minimum 3 days notice needed 🎂" }],
      chinatown:    [{ id:1, seller:"The Dumpling Den", emoji:"🥟", mine:false, time:"8:45am", msg:"Making an extra batch of pork dumplings today — 5 orders left at the special price of $12/dozen. First come first served!" }],
      brampton:     [{ id:1, seller:"Biji's Spice Kitchen", emoji:"🫙", mine:false, time:"9:10am", msg:"New batch of mango chutney and mixed pickle ready 🥭 Also fresh roti every morning this week." }],
      roncesvalles: [{ id:1, seller:"Sunshine Sourdough", emoji:"☀️", mine:false, time:"11:00am", msg:"Focaccia is back on the menu. Rosemary & sea salt, ready by 2pm today." }],
      city:         [{ id:1, seller:"Hearthside", emoji:"🍞", mine:false, time:"7:00am", msg:"Good morning Toronto bakers! Remember to update your availability for the week 🎉" }],
    };

    const [activeChannel, setActiveChannel] = useState(null);
    const [channelMsgs, setChannelMsgs] = useState(CHANNEL_MSGS);
    const [draft, setDraft] = useState("");
    const [reach, setReach] = useState("neighbourhood");
    const [sent, setSent] = useState(false);
    const bottomRef = useRef(null);

    const sendMsg = () => {
      if (!draft.trim()||!activeChannel) return;
      const newMsg = { id:Date.now(), seller:user.business, emoji:"🍞", mine:true, time:"now", msg:draft.trim() };
      setChannelMsgs(p=>({ ...p, [activeChannel.id]:[...(p[activeChannel.id]||[]), newMsg] }));
      setDraft(""); setSent(true); setTimeout(()=>setSent(false),2000);
      setTimeout(()=>bottomRef.current?.scrollIntoView({ behavior:"smooth" }),100);
    };

    // Channel list view
    if (!activeChannel) return (
      <div style={{ display:"flex", flexDirection:"column", height:"calc(100vh - 56px)", fontFamily:"'DM Sans', system-ui, sans-serif" }}>
        <div style={{ padding:"1rem 1.5rem", borderBottom:`1px solid ${C.border}`, background:C.surface }}>
          <h1 style={{ fontSize:20, fontWeight:700, color:C.text, margin:"0 0 2px", letterSpacing:"-0.02em" }}>Community</h1>
          <p style={{ fontSize:12, color:C.textMuted, margin:0 }}>Broadcast to neighbourhoods near you</p>
        </div>
        <div style={{ flex:1, overflowY:"auto" }}>
          {CHANNELS.map(ch=>(
            <div key={ch.id} onClick={()=>setActiveChannel(ch)} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 1.5rem", borderBottom:`1px solid ${C.border}`, cursor:"pointer", background:C.surface }}
              onMouseEnter={e=>e.currentTarget.style.background=C.surfaceHigh}
              onMouseLeave={e=>e.currentTarget.style.background=C.surface}>
              <div style={{ width:46, height:46, borderRadius:"50%", background:C.accentBg, border:`1px solid ${C.accentBorder}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>{ch.emoji}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:3 }}>
                  <span style={{ fontSize:14, fontWeight:600, color:C.text }}>{ch.name}</span>
                  <span style={{ fontSize:11, color:C.textMuted }}>{ch.time}</span>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontSize:12, color:C.textMuted, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:220 }}>{ch.last}</span>
                  {ch.unread>0 && <span style={{ background:C.chat, color:"#FFF", fontSize:10, fontWeight:700, borderRadius:"50%", width:18, height:18, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{ch.unread}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );

    // Chat view
    const msgs = channelMsgs[activeChannel.id]||[];
    return (
      <div style={{ display:"flex", flexDirection:"column", height:"calc(100vh - 56px)" }}>
        <div style={{ padding:"0.875rem 1.5rem", borderBottom:`1px solid ${C.border}`, background:C.surface, display:"flex", alignItems:"center", gap:12 }}>
          <button onClick={()=>setActiveChannel(null)} style={{ background:"transparent", border:"none", fontSize:18, cursor:"pointer", color:C.textMuted, padding:0, lineHeight:1 }}>←</button>
          <div style={{ width:36, height:36, borderRadius:"50%", background:C.accentBg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>{activeChannel.emoji}</div>
          <div>
            <p style={{ fontSize:14, fontWeight:700, color:C.text, margin:0 }}>{activeChannel.name}</p>
            <p style={{ fontSize:11, color:C.textMuted, margin:0 }}>{msgs.length} message{msgs.length!==1?"s":""}</p>
          </div>
          <div style={{ marginLeft:"auto", display:"flex", gap:8 }}>
            {[{ v:"neighbourhood", label:"📍 Local" },{ v:"city", label:"🌆 City" }].map(r=>(
              <button key={r.v} onClick={()=>setReach(r.v)} style={{ padding:"5px 11px", border:`1px solid ${reach===r.v?C.accent:C.border}`, borderRadius:4, background:reach===r.v?C.accentBg:"transparent", color:reach===r.v?C.accent:C.textMuted, fontSize:11, cursor:"pointer" }}>{r.label}</button>
            ))}
          </div>
        </div>
        <div style={{ flex:1, overflowY:"auto", padding:"1rem 1.5rem", background:C.bg, display:"flex", flexDirection:"column", gap:10 }}>
          {msgs.map(m=>(
            <div key={m.id} style={{ display:"flex", justifyContent:m.mine?"flex-end":"flex-start" }}>
              {!m.mine && <div style={{ width:32, height:32, borderRadius:"50%", background:C.chatBg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, marginRight:8, flexShrink:0 }}>{m.emoji}</div>}
              <div style={{ maxWidth:"72%" }}>
                {!m.mine && <p style={{ fontSize:10, fontWeight:600, color:C.chat, margin:"0 0 3px" }}>{m.seller}</p>}
                <div style={{ background:m.mine?C.accent:C.surface, border:`1px solid ${m.mine?"transparent":C.border}`, borderRadius:m.mine?"12px 12px 4px 12px":"12px 12px 12px 4px", padding:"9px 13px" }}>
                  <p style={{ fontSize:13, color:m.mine?"#FFF":C.text, margin:0, lineHeight:1.6 }}>{m.msg}</p>
                </div>
                <p style={{ fontSize:10, color:C.textMuted, margin:"3px 0 0", textAlign:m.mine?"right":"left" }}>{m.time}</p>
              </div>
            </div>
          ))}
          <div ref={bottomRef}/>
        </div>
        <div style={{ padding:"0.75rem 1.25rem", borderTop:`1px solid ${C.border}`, background:C.surface, display:"flex", gap:8, alignItems:"flex-end" }}>
          <textarea value={draft} onChange={e=>setDraft(e.target.value)} onKeyDown={e=>{ if(e.key==="Enter"&&!e.shiftKey){ e.preventDefault(); sendMsg(); } }} rows={1} placeholder={`Broadcast to ${activeChannel.name}...`}
            style={{ flex:1, padding:"10px 12px", border:`1px solid ${C.border}`, borderRadius:20, fontSize:13, color:C.text, background:C.surfaceHigh, outline:"none", resize:"none", lineHeight:1.5, maxHeight:100 }}/>
          <button onClick={sendMsg} style={{ width:40, height:40, borderRadius:"50%", background:sent?C.success:C.accent, border:"none", cursor:"pointer", fontSize:16, color:"#FFF", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
            {sent?"✓":"→"}
          </button>
        </div>
      </div>
    );
  };

  // ── SELLER DASHBOARD ──
  const Dashboard = () => {
    // eslint-disable-next-line no-unused-vars
    const top         = [...products].sort((a,b)=>(b.sold||0)-(a.sold||0))[0]||products[0];
    const rev         = parseFloat(finRevenue)||0;
    const totalCosts  = finCosts.reduce((s,c)=>s+c.amount,0);
    const profit      = rev - totalCosts;
    const margin      = rev>0 ? ((profit/rev)*100).toFixed(1) : null;

    // Build cost-by-category data for bar chart
    const costBarData = COST_CATS_DEF.map(cat=>({
      name: cat.label,
      costs: finCosts.filter(c=>c.cat===cat.value).reduce((s,c)=>s+c.amount,0),
      color: cat.color,
    })).filter(c=>c.costs>0);

    const hasData = rev>0 || finCosts.length>0;

    return (
      <div style={{ padding:"2rem" }}>
        <div style={{ marginBottom:"1.5rem" }}>
          <h1 style={{ fontSize:24, fontWeight:700, color:C.text, margin:"0 0 4px", letterSpacing:"-0.02em" }}>Good morning, {user.name.split(" ")[0]} 👋</h1>
          <p style={{ color:C.textMuted, fontSize:13, margin:0 }}>Here's how your bakery is performing.</p>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,minmax(0,1fr))", gap:10, marginBottom:"1.5rem" }}>
          <KPI label={finMonth||"This Month"} value={rev>0?`$${rev.toLocaleString()}`:"—"} sub={rev>0?"From Finances":"Add in Finances"} color={C.accent}/>
          <KPI label="Total Costs"        value={totalCosts>0?`$${totalCosts.toFixed(2)}`:"—"} sub={`${finCosts.length} cost entr${finCosts.length===1?"y":"ies"}`} color={C.warning}/>
          <KPI label="Net Profit"         value={rev>0&&totalCosts>0?`$${profit.toFixed(2)}`:"—"} sub={margin?`${margin}% margin`:""} color={profit>=0?C.success:C.danger}/>
          <KPI label="Products Listed"    value={products.length} sub={`${products.filter(p=>!p.availability||p.availability==="available").length} available`}/>
        </div>

        {!hasData && (
          <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:"2.5rem", textAlign:"center", marginBottom:"1.5rem" }}>
            <p style={{ fontSize:32, margin:"0 0 10px" }}>📊</p>
            <p style={{ fontSize:16, fontWeight:600, color:C.text, margin:"0 0 6px" }}>No financial data yet</p>
            <p style={{ fontSize:13, color:C.textMuted, margin:"0 0 1.25rem" }}>Head to the Finances tab to enter your revenue and costs. Your dashboard will populate automatically.</p>
            <button onClick={()=>setView("finances")} style={{ background:C.accent, color:"#FFF", border:"none", borderRadius:6, padding:"10px 20px", fontSize:13, fontWeight:700, cursor:"pointer" }}>
              Go to Finances →
            </button>
          </div>
        )}

        {hasData && (
          <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:12, marginBottom:"1.5rem" }}>
            <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:"1.25rem" }}>
              <p style={{ fontWeight:600, fontSize:13, color:C.text, margin:"0 0 1rem" }}>Costs by Category</p>
              {costBarData.length>0 ? (
                <ResponsiveContainer width="100%" height={210}>
                  <BarChart data={costBarData} barSize={36}>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.border}/>
                    <XAxis dataKey="name" tick={{ fontSize:11, fill:C.textMuted }} axisLine={false} tickLine={false}/>
                    <YAxis tick={{ fontSize:11, fill:C.textMuted }} axisLine={false} tickLine={false}/>
                    <Tooltip contentStyle={{ background:C.surfaceTop, border:`1px solid ${C.border}`, borderRadius:5, fontSize:12, color:C.text }} formatter={(v)=>[`$${v.toFixed(2)}`,"Amount"]}/>
                    <Bar dataKey="costs" radius={[4,4,0,0]} fill={C.accent} name="Cost ($)"/>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ height:210, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <p style={{ fontSize:13, color:C.textMuted }}>Add costs in the Finances tab to see the chart.</p>
                </div>
              )}
            </div>
            <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:"1.25rem" }}>
              <p style={{ fontWeight:600, fontSize:13, color:C.text, margin:"0 0 1rem" }}>Cost Breakdown</p>
              {finCosts.length===0 ? (
                <p style={{ fontSize:12, color:C.textMuted, lineHeight:1.6 }}>No costs entered yet. Go to Finances to start tracking.</p>
              ) : COST_CATS_DEF.map(cat=>{
                const amt = finCosts.filter(c=>c.cat===cat.value).reduce((s,c)=>s+c.amount,0);
                if (amt===0) return null;
                return (
                  <div key={cat.value} style={{ marginBottom:11 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                      <span style={{ fontSize:12, color:C.textSub, fontWeight:500 }}>{cat.label}</span>
                      <span style={{ fontSize:11, color:C.textMuted }}>${amt.toFixed(2)}</span>
                    </div>
                    <div style={{ height:4, background:C.surfaceHigh, borderRadius:2 }}>
                      <div style={{ height:4, width:totalCosts>0?`${(amt/totalCosts)*100}%`:"0%", background:cat.color, borderRadius:2 }}/>
                    </div>
                  </div>
                );
              })}
              {totalCosts>0 && (
                <div style={{ marginTop:10, paddingTop:10, borderTop:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between" }}>
                  <span style={{ fontSize:12, fontWeight:600, color:C.text }}>Total</span>
                  <span style={{ fontSize:12, fontWeight:700, color:C.warning }}>${totalCosts.toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {products.length>0 && (
          <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:"1.25rem" }}>
            <p style={{ fontWeight:600, fontSize:13, color:C.text, margin:"0 0 1rem" }}>Your Products</p>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(5,minmax(0,1fr))", gap:8 }}>
              {products.slice(0,5).map(p=>(
                <div key={p.id} style={{ textAlign:"center" }}>
                  <div style={{ width:"100%", aspectRatio:"1", background:C.surfaceHigh, borderRadius:7, overflow:"hidden", marginBottom:5, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24 }}>
                    {p.image_url?<img src={p.image_url} alt={p.name} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>:p.emoji}
                  </div>
                  <p style={{ fontSize:11, color:C.text, fontWeight:600, margin:"0 0 1px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{p.name}</p>
                  <p style={{ fontSize:11, color:C.accent, fontWeight:700, margin:0 }}>${p.price?.toFixed(2)||"0.00"}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // ── SELLER STOREFRONT ──
  const Storefront = () => {
    const PRODUCT_CATS = ["Bread","Pastry","Cake","Cookie","Savoury","Dumpling","Condiment","Drink","Other"];
    const [showModal,    setShowModal]    = useState(false);
    const [editProduct,  setEditProduct]  = useState(null);
    const [catFilter,    setCatFilter]    = useState("All");
    const [form,         setForm]         = useState({ name:"", price:"", category:"Bread", desc:"", stock:"10" });
    const [editForm,     setEditForm]     = useState(null);
    const [imageFile,    setImageFile]    = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploading,    setUploading]    = useState(false);
    const [saving,       setSaving]       = useState(false);
    const [editImages,   setEditImages]   = useState([]);
    const [editSlide,    setEditSlide]    = useState(0);

    const saveEdit = async () => {
      if (!editForm.name||!editForm.price||!editProduct) return;
      setSaving(true);
      // Upload any new images from editImages that are new File objects
      const uploadedUrls = [];
      for (const img of editImages) {
        if (img.file) {
          const ext = img.file.name.split(".").pop();
          const path = `products/${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
          const { error:upErr } = await supabase.storage.from("product-images").upload(path, img.file);
          if (!upErr) {
            const { data:urlData } = supabase.storage.from("product-images").getPublicUrl(path);
            uploadedUrls.push(urlData.publicUrl);
          }
        } else {
          uploadedUrls.push(img.url);
        }
      }
      const updates = {
        name: editForm.name,
        price: parseFloat(editForm.price)||0,
        category: editForm.category||"Other",
        emoji: editForm.category||"Other",
        desc: editForm.desc,
        stock: parseInt(editForm.stock)||0,
        availability: editForm.availability||"available",
        image_url: uploadedUrls[0]||editProduct.image_url||null,
        images: uploadedUrls.length>0 ? JSON.stringify(uploadedUrls) : editProduct.images||null,
      };
      const { error } = await supabase.from("products").update(updates).eq("id", editProduct.id);
      if (!error) setProducts(p=>p.map(prod=>prod.id===editProduct.id?{...prod,...updates}:prod));
      setSaving(false); setEditProduct(null); setEditForm(null); setEditImages([]); setEditSlide(0);
    };

    const deleteProduct = async () => {
      if (!editProduct||!window.confirm("Delete this product? This cannot be undone.")) return;
      await supabase.from("products").delete().eq("id", editProduct.id);
      setProducts(p=>p.filter(prod=>prod.id!==editProduct.id));
      setEditProduct(null); setEditForm(null); setEditImages([]); setEditSlide(0);
    };

    const handleImage = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    };

    const add = async () => {
      if (!form.name||!form.price) return;
      setUploading(true);
      let imageUrl = null;
      if (imageFile) {
        const ext = imageFile.name.split(".").pop();
        const path = `products/${user.id}/${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage.from("product-images").upload(path, imageFile);
        if (!upErr) {
          const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(path);
          imageUrl = urlData.publicUrl;
        }
      }
      const newProduct = {
        seller_id: user.id,
        name: form.name,
        price: parseFloat(form.price)||0,
        category: form.category||"Other",
        emoji: form.category||"Other",
        stock: parseInt(form.stock)||10,
        desc: form.desc,
        image_url: imageUrl,
      };
      const { data, error } = await supabase.from("products").insert(newProduct).select().single();
      if (!error&&data) setProducts(p=>[...p, data]);
      else setProducts(p=>[...p,{ id:Date.now(), ...newProduct }]);
      setUploading(false);
      setShowModal(false);
      setForm({ name:"", price:"", category:"Bread", desc:"", stock:"10" });
      setImageFile(null); setImagePreview(null);
    };
    if (loadingProducts) return <div style={{ padding:"2rem", textAlign:"center", color:C.textMuted, fontSize:13 }}>Loading products...</div>;
    return (
      <div style={{ padding:"2rem" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.5rem" }}>
          <div>
            <h1 style={{ fontSize:24, fontWeight:700, color:C.text, margin:"0 0 4px", letterSpacing:"-0.02em" }}>Storefront</h1>
            <p style={{ color:C.textMuted, fontSize:13, margin:0 }}>Manage your listings</p>
          </div>
          <button onClick={()=>setShowModal(true)} style={{ background:C.accent, color:"#000", border:"none", borderRadius:5, padding:"9px 16px", fontSize:13, fontWeight:700, cursor:"pointer" }}>+ Add Product</button>
        </div>
        {products.length===0 && (
          <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:"3rem", textAlign:"center", marginBottom:14 }}>
            <p style={{ fontSize:28, margin:"0 0 8px" }}>🍞</p>
            <p style={{ fontSize:14, color:C.textMuted, margin:0 }}>No products yet — click Add Product to get started!</p>
          </div>
        )}
        {products.length>0 && (
          <div style={{ display:"flex", gap:7, marginBottom:"1rem", overflowX:"auto", paddingBottom:4 }}>
            {["All",...PRODUCT_CATS].map(cat=>(
              <button key={cat} onClick={()=>setCatFilter(cat)} style={{
                padding:"5px 13px", borderRadius:4, border:`1px solid ${catFilter===cat?C.accent:C.border}`,
                background:catFilter===cat?C.accentBg:"transparent", color:catFilter===cat?C.accent:C.textMuted,
                fontSize:11, fontWeight:catFilter===cat?700:400, cursor:"pointer", whiteSpace:"nowrap", flexShrink:0
              }}>{cat}</button>
            ))}
          </div>
        )}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,minmax(0,1fr))", gap:10 }}>
          {products.filter(p=>catFilter==="All"||(p.category||p.emoji||"Other")===catFilter).map(p=>(
            <div key={p.id} onClick={()=>{ setEditProduct({...p}); setEditForm(null); setEditSlide(0); }} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, overflow:"hidden", cursor:"pointer", transition:"border-color 0.15s" }}
              onMouseEnter={e=>e.currentTarget.style.borderColor=C.borderMid}
              onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
              {/* Square image area — aspect ratio 1:1 */}
              <div style={{ position:"relative", paddingBottom:"100%", background:C.surfaceHigh }}>
                {p.image_url
                  ? <img src={p.image_url} alt={p.name} style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }}/>
                  : <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:44 }}>{p.emoji}</div>
                }
                {p.availability==="out_of_stock" && (
                  <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"center", justifyContent:"center", borderRadius:"10px 10px 0 0" }}>
                    <span style={{ background:"rgba(181,32,32,0.9)", color:"#FFF", fontSize:11, fontWeight:700, padding:"4px 10px", borderRadius:4 }}>Out of Stock</span>
                  </div>
                )}
                {p.availability==="out_till_eod" && (
                  <span style={{ position:"absolute", top:8, left:8, background:"rgba(160,112,16,0.92)", color:"#FFF", fontSize:10, fontWeight:700, padding:"3px 8px", borderRadius:4 }}>⏱ Back Tomorrow</span>
                )}
                {(!p.availability||p.availability==="available") && p.stock<5 && (
                  <span style={{ position:"absolute", top:8, right:8, background:C.danger, color:"#FFF", fontSize:10, fontWeight:700, padding:"2px 7px", borderRadius:4 }}>⚠ Low stock</span>
                )}
              </div>
              <div style={{ padding:"0.75rem 0.875rem 0.875rem" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:3 }}>
                  <p style={{ fontSize:13, fontWeight:700, color:C.text, margin:0, letterSpacing:"-0.01em", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", flex:1 }}>{p.name}</p>
                  {p.availability==="out_of_stock" && <span style={{ fontSize:9, fontWeight:700, color:C.danger, background:C.dangerBg, padding:"1px 5px", borderRadius:3, marginLeft:4, flexShrink:0 }}>OOS</span>}
                  {p.availability==="out_till_eod" && <span style={{ fontSize:9, fontWeight:700, color:C.warning, background:C.warningBg, padding:"1px 5px", borderRadius:3, marginLeft:4, flexShrink:0 }}>EOD</span>}
                  {(!p.availability||p.availability==="available") && <span style={{ fontSize:9, fontWeight:700, color:C.success, background:C.successBg, padding:"1px 5px", borderRadius:3, marginLeft:4, flexShrink:0 }}>●</span>}
                </div>
                {p.desc && <p style={{ fontSize:10, color:C.textMuted, margin:"0 0 5px", lineHeight:1.4, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{p.desc}</p>}
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:p.desc?"2px":0 }}>
                  <span style={{ fontSize:14, fontWeight:700, color:C.accent }}>${p.price?.toFixed(2)||"0.00"}</span>
                  <span style={{ fontSize:10, color:C.textMuted, background:C.surfaceHigh, padding:"1px 6px", borderRadius:3 }}>{p.category||p.emoji||"—"}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── PRODUCT PREVIEW + EDIT MODAL ── */}
        {editProduct && (
          <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:200 }}>
            <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:16, width:860, maxWidth:"96vw", maxHeight:"92vh", display:"flex", overflow:"hidden", boxShadow:"0 24px 60px rgba(0,0,0,0.4)" }}>

              {/* ── SHARED IMAGE PANEL (left side) ── */}
              {(() => {
                const imgs = (() => { try { return JSON.parse(editProduct.images||"[]"); } catch(e) { return editProduct.image_url?[editProduct.image_url]:[]; } })();
                const showImgs = editForm ? editImages.map(i=>i.url) : imgs;
                const slide = editSlide < showImgs.length ? editSlide : 0;
                return (
                  <div style={{ width:340, flexShrink:0, background:C.surfaceHigh, position:"relative", display:"flex", flexDirection:"column" }}>
                    {showImgs.length>0 ? (
                      <>
                        <img src={showImgs[slide]} alt={editProduct.name} style={{ width:"100%", flex:1, objectFit:"cover", minHeight:0, display:"block" }}/>
                        {showImgs.length>1 && (
                          <>
                            <button onClick={e=>{ e.stopPropagation(); setEditSlide(s=>Math.max(0,s-1)); }} disabled={slide===0}
                              style={{ position:"absolute", left:8, top:"50%", transform:"translateY(-50%)", background:"rgba(0,0,0,0.5)", color:"#FFF", border:"none", borderRadius:"50%", width:30, height:30, cursor:"pointer", fontSize:16 }}>‹</button>
                            <button onClick={e=>{ e.stopPropagation(); setEditSlide(s=>Math.min(showImgs.length-1,s+1)); }} disabled={slide===showImgs.length-1}
                              style={{ position:"absolute", right:8, top:"50%", transform:"translateY(-50%)", background:"rgba(0,0,0,0.5)", color:"#FFF", border:"none", borderRadius:"50%", width:30, height:30, cursor:"pointer", fontSize:16 }}>›</button>
                            <span style={{ position:"absolute", top:10, right:10, background:"rgba(0,0,0,0.6)", color:"#FFF", fontSize:11, fontWeight:600, padding:"2px 9px", borderRadius:10 }}>{slide+1}/{showImgs.length}</span>
                          </>
                        )}
                        {/* Thumbnail strip */}
                        {showImgs.length>1 && (
                          <div style={{ display:"flex", gap:5, padding:"8px", background:"rgba(0,0,0,0.4)", overflowX:"auto" }}>
                            {showImgs.map((url,i)=>(
                              <div key={i} onClick={()=>setEditSlide(i)} style={{ width:44, height:44, borderRadius:4, overflow:"hidden", flexShrink:0, cursor:"pointer", border:`2px solid ${i===slide?"#FFF":"transparent"}`, opacity:i===slide?1:0.65 }}>
                                <img src={url} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:10 }}>
                        <span style={{ fontSize:56 }}>{editProduct.category||"🍞"}</span>
                        <p style={{ fontSize:12, color:C.textMuted, margin:0 }}>No photos yet</p>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* ── PREVIEW MODE (right side) ── */}
              {!editForm && (
                <div style={{ flex:1, overflowY:"auto", display:"flex", flexDirection:"column" }}>
                  <div style={{ padding:"1.5rem 1.75rem", flex:1 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                      <div>
                        <p style={{ fontSize:24, fontWeight:700, color:C.text, margin:"0 0 5px", letterSpacing:"-0.02em" }}>{editProduct.name}</p>
                        <div style={{ display:"flex", alignItems:"center", gap:7, flexWrap:"wrap" }}>
                          <span style={{ fontSize:11, color:C.textMuted, background:C.surfaceHigh, padding:"2px 8px", borderRadius:3 }}>{editProduct.category||editProduct.emoji||"—"}</span>
                          <span style={{ fontSize:11, color:C.textMuted }}>{editProduct.stock} in stock</span>
                          {editProduct.availability==="out_of_stock" && <span style={{ background:C.dangerBg, color:C.danger, fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:4 }}>Out of Stock</span>}
                          {editProduct.availability==="out_till_eod" && <span style={{ background:C.warningBg, color:C.warning, fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:4 }}>⏱ Out Till EOD</span>}
                          {(!editProduct.availability||editProduct.availability==="available") && <span style={{ background:C.successBg, color:C.success, fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:4 }}>✓ Available</span>}
                        </div>
                      </div>
                      <p style={{ fontSize:28, fontWeight:700, color:C.accent, margin:0, letterSpacing:"-0.02em", flexShrink:0, marginLeft:12 }}>${editProduct.price?.toFixed(2)||"0.00"}</p>
                    </div>
                    <p style={{ fontSize:14, color:C.textSub, margin:"12px 0 1.5rem", lineHeight:1.75 }}>{editProduct.desc||"No description added yet."}</p>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:"1.5rem" }}>
                      {[["Price",`$${editProduct.price?.toFixed(2)||"0.00"}`],["Stock",`${editProduct.stock||0} units`],["Category",editProduct.category||editProduct.emoji||"–"]].map(([k,v])=>(
                        <div key={k} style={{ background:C.surfaceHigh, borderRadius:6, padding:"10px 12px" }}>
                          <p style={{ fontSize:10, color:C.textMuted, margin:"0 0 3px", textTransform:"uppercase", letterSpacing:"0.07em" }}>{k}</p>
                          <p style={{ fontSize:13, fontWeight:600, color:C.text, margin:0 }}>{v}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ padding:"1rem 1.75rem", borderTop:`1px solid ${C.border}`, display:"flex", gap:8 }}>
                    <button onClick={()=>{ setEditProduct(null); }} style={{ flex:1, padding:"11px", border:`1px solid ${C.border}`, borderRadius:6, background:"transparent", color:C.textMuted, cursor:"pointer", fontSize:13 }}>Close</button>
                    <button onClick={()=>{
                        setEditForm({ name:editProduct.name, price:String(editProduct.price||""), category:editProduct.category||editProduct.emoji||"Bread", emoji:editProduct.category||editProduct.emoji||"Bread", desc:editProduct.desc||"", stock:String(editProduct.stock||"10"), availability:editProduct.availability||"available" });
                        // Initialize editImages from existing product images
                        const existingUrls = (() => {
                          try { return JSON.parse(editProduct.images||"[]"); } catch(e) { return editProduct.image_url?[editProduct.image_url]:[]; }
                        })();
                        setEditImages(existingUrls.map(url=>({ url, file:null })));
                        setEditSlide(0);
                      }} style={{ flex:2, padding:"11px", background:C.accent, color:"#FFF", border:"none", borderRadius:6, cursor:"pointer", fontSize:13, fontWeight:700 }}>
                        ✏ Edit Product
                      </button>
                  </div>
                </div>
              )}

              {/* ── EDIT MODE (right side) ── */}
              {editForm && (
                <div style={{ flex:1, overflowY:"auto", padding:"1.5rem", display:"flex", flexDirection:"column" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.25rem" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <button onClick={()=>setEditForm(null)} style={{ background:"transparent", border:"none", fontSize:16, cursor:"pointer", color:C.textMuted, padding:0 }}>←</button>
                      <h2 style={{ fontSize:17, fontWeight:700, color:C.text, margin:0, letterSpacing:"-0.01em" }}>Edit Product</h2>
                    </div>
                    <button onClick={()=>{ setEditProduct(null); setEditForm(null); }} style={{ background:C.surfaceHigh, border:"none", width:28, height:28, borderRadius:4, fontSize:14, cursor:"pointer", color:C.textMuted }}>✕</button>
                  </div>

                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 }}>
                    <Inp label="Product Name" value={editForm.name}  onChange={v=>setEditForm({...editForm,name:v})}  ph="e.g. Blueberry Scones"/>
                    <Inp label="Price ($)"    value={editForm.price} onChange={v=>setEditForm({...editForm,price:v})} ph="16.00"/>
                    <Inp label="Stock"        value={editForm.stock} onChange={v=>setEditForm({...editForm,stock:v})} ph="10"/>
                  </div>
                  <div style={{ marginBottom:10 }}>
                    <label style={{ fontSize:10, fontWeight:600, color:C.textMuted, display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.08em" }}>Category</label>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                      {PRODUCT_CATS.map(cat=>(
                        <button key={cat} onClick={()=>setEditForm({...editForm,category:cat,emoji:cat})} style={{
                          padding:"5px 11px", borderRadius:4, border:`1px solid ${(editForm.category||editForm.emoji)===cat?C.accent:C.border}`,
                          background:(editForm.category||editForm.emoji)===cat?C.accentBg:"transparent",
                          color:(editForm.category||editForm.emoji)===cat?C.accent:C.textMuted,
                          fontSize:11, fontWeight:(editForm.category||editForm.emoji)===cat?700:400, cursor:"pointer"
                        }}>{cat}</button>
                      ))}
                    </div>
                  </div>
                  {/* Availability toggle */}
                  <div style={{ marginBottom:14 }}>
                    <label style={{ fontSize:10, fontWeight:600, color:C.textMuted, display:"block", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.08em" }}>Availability</label>
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:7 }}>
                      {[
                        { v:"available",       label:"✓ Available",          bg:C.successBg, color:C.success, border:C.success },
                        { v:"out_of_stock",     label:"✕ Out of Stock",       bg:C.dangerBg,  color:C.danger,  border:C.danger  },
                        { v:"out_till_eod",     label:"⏱ Out Till End of Day",bg:C.warningBg, color:C.warning, border:C.warning },
                      ].map(opt=>(
                        <button key={opt.v} onClick={()=>setEditForm({...editForm,availability:opt.v})} style={{
                          padding:"9px 6px", border:`1px solid ${editForm.availability===opt.v?opt.border:C.border}`,
                          borderRadius:6, background:editForm.availability===opt.v?opt.bg:"transparent",
                          color:editForm.availability===opt.v?opt.color:C.textMuted,
                          fontSize:11, fontWeight:editForm.availability===opt.v?700:400, cursor:"pointer",
                          textAlign:"center", lineHeight:1.3
                        }}>{opt.label}</button>
                      ))}
                    </div>
                  </div>

                  {/* Upload more photos */}
                  <div style={{ marginBottom:12 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                      <label style={{ fontSize:10, fontWeight:600, color:C.textMuted, textTransform:"uppercase", letterSpacing:"0.08em" }}>Photos ({editImages.length}/5)</label>
                      {editImages.length<5 && (
                        <label style={{ background:C.accentBg, border:`1px solid ${C.accentBorder}`, color:C.accent, borderRadius:4, padding:"4px 10px", fontSize:11, fontWeight:600, cursor:"pointer" }}>
                          <input type="file" accept="image/*" multiple onChange={async e=>{
                            const files = Array.from(e.target.files||[]).slice(0,5-editImages.length);
                            setEditImages(imgs=>[...imgs,...files.map(f=>({ file:f, url:URL.createObjectURL(f) }))]);
                            e.target.value="";
                          }} style={{ display:"none" }}/>
                          + Add Photos
                        </label>
                      )}
                    </div>
                    {editImages.length>0 && (
                      <div style={{ display:"flex", gap:5, overflowX:"auto" }}>
                        {editImages.map((img,i)=>(
                          <div key={i} style={{ position:"relative", width:52, height:52, borderRadius:5, overflow:"hidden", flexShrink:0, border:`2px solid ${i===editSlide?C.accent:C.border}`, cursor:"pointer" }} onClick={()=>setEditSlide(i)}>
                            <img src={img.url} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                            <button onClick={e=>{ e.stopPropagation(); setEditImages(imgs=>imgs.filter((_,ii)=>ii!==i)); setEditSlide(s=>Math.max(0,s-1)); }}
                              style={{ position:"absolute", top:1, right:1, background:"rgba(181,32,32,0.85)", color:"#FFF", border:"none", borderRadius:2, padding:"0 3px", fontSize:10, cursor:"pointer", lineHeight:"14px" }}>✕</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div style={{ marginBottom:16 }}>
                    <label style={{ fontSize:10, fontWeight:600, color:C.textMuted, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.08em" }}>Description</label>
                    <textarea value={editForm.desc} onChange={e=>setEditForm({...editForm,desc:e.target.value})} rows={3}
                      style={{ width:"100%", padding:"9px 12px", border:`1px solid ${C.border}`, borderRadius:5, fontSize:13, color:C.text, background:C.surfaceHigh, outline:"none", resize:"none", boxSizing:"border-box" }}/>
                  </div>
                  <div style={{ display:"flex", gap:8 }}>
                    <button onClick={deleteProduct} style={{ padding:"10px 14px", border:`1px solid ${C.danger}`, borderRadius:5, background:C.dangerBg, color:C.danger, cursor:"pointer", fontSize:13, fontWeight:600 }}>Delete</button>
                    <button onClick={()=>setEditForm(null)} style={{ flex:1, padding:"10px", border:`1px solid ${C.border}`, borderRadius:5, background:"transparent", color:C.textMuted, cursor:"pointer", fontSize:13 }}>← Back</button>
                    <button onClick={saveEdit} disabled={saving} style={{ flex:2, padding:"10px", background:saving?"rgba(196,98,45,0.4)":C.accent, color:"#FFF", border:"none", borderRadius:5, cursor:saving?"default":"pointer", fontSize:13, fontWeight:700 }}>
                      {saving?"Saving...":"Save Changes"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {showModal && (
          <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:200 }}>
            <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, width:780, maxWidth:"96vw", maxHeight:"92vh", display:"flex", overflow:"hidden", boxShadow:"0 24px 60px rgba(0,0,0,0.35)" }}>

              {/* LEFT — image preview */}
              <div style={{ width:300, flexShrink:0, background:C.surfaceHigh, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", position:"relative" }}>
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="preview" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}/>
                    <label style={{ position:"absolute", bottom:12, left:"50%", transform:"translateX(-50%)", background:"rgba(0,0,0,0.65)", color:"#FFF", borderRadius:5, padding:"7px 14px", fontSize:12, fontWeight:600, cursor:"pointer", whiteSpace:"nowrap" }}>
                      <input type="file" accept="image/*" onChange={handleImage} style={{ display:"none" }}/>
                      Change Photo
                    </label>
                  </>
                ) : (
                  <label style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", cursor:"pointer", width:"100%", height:"100%", gap:10 }}>
                    <input type="file" accept="image/*" onChange={handleImage} style={{ display:"none" }}/>
                    <div style={{ fontSize:40 }}>📷</div>
                    <p style={{ fontSize:13, fontWeight:600, color:C.textMuted, margin:0 }}>Upload a photo</p>
                    <p style={{ fontSize:11, color:C.textMuted, margin:0, opacity:0.7 }}>JPG, PNG or WEBP</p>
                  </label>
                )}
              </div>

              {/* RIGHT — form */}
              <div style={{ flex:1, padding:"1.5rem", overflowY:"auto" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.25rem" }}>
                  <h2 style={{ fontSize:18, fontWeight:700, color:C.text, margin:0, letterSpacing:"-0.02em" }}>Add Product</h2>
                  <button onClick={()=>{ setShowModal(false); setImageFile(null); setImagePreview(null); }} style={{ background:C.surfaceHigh, border:"none", width:28, height:28, borderRadius:4, fontSize:14, cursor:"pointer", color:C.textMuted }}>✕</button>
                </div>
                <Inp label="Product Name" value={form.name} onChange={v=>setForm({...form,name:v})} ph="e.g. Blueberry Scones"/>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                  <Inp label="Price ($)" value={form.price} onChange={v=>setForm({...form,price:v})} ph="16.00"/>
                  <Inp label="Stock Available" value={form.stock} onChange={v=>setForm({...form,stock:v})} ph="10"/>
                </div>
                <div style={{ marginBottom:12 }}>
                  <label style={{ fontSize:10, fontWeight:600, color:C.textMuted, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.08em" }}>Category</label>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                    {PRODUCT_CATS.map(cat=>(
                      <button key={cat} onClick={()=>setForm({...form,category:cat})} style={{
                        padding:"5px 12px", borderRadius:4, border:`1px solid ${form.category===cat?C.accent:C.border}`,
                        background:form.category===cat?C.accentBg:"transparent", color:form.category===cat?C.accent:C.textMuted,
                        fontSize:12, fontWeight:form.category===cat?700:400, cursor:"pointer"
                      }}>{cat}</button>
                    ))}
                  </div>
                </div>
                <div style={{ marginBottom:12 }}>
                  <label style={{ fontSize:10, fontWeight:600, color:C.textMuted, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.08em" }}>Description</label>
                  <textarea value={form.desc} onChange={e=>setForm({...form,desc:e.target.value})} rows={3} placeholder="Describe your product — ingredients, texture, what makes it special..."
                    style={{ width:"100%", padding:"9px 12px", border:`1px solid ${C.border}`, borderRadius:5, fontSize:13, color:C.text, background:C.surfaceHigh, outline:"none", resize:"none", boxSizing:"border-box" }}/>
                </div>
                <div style={{ display:"flex", gap:8, marginTop:"0.5rem" }}>
                  <button onClick={()=>{ setShowModal(false); setImageFile(null); setImagePreview(null); }} style={{ flex:1, padding:"10px", border:`1px solid ${C.border}`, borderRadius:5, background:"transparent", color:C.textMuted, cursor:"pointer", fontSize:13 }}>Cancel</button>
                  <button onClick={add} disabled={uploading} style={{ flex:2, padding:"10px", background:uploading?"rgba(196,98,45,0.4)":C.accent, color:"#FFF", border:"none", borderRadius:5, cursor:uploading?"default":"pointer", fontSize:13, fontWeight:700 }}>
                    {uploading?"Uploading...":"Add Product"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ── SELLER ORDERS ──
  const Orders = () => {
    const [filter,        setFilter]        = useState("all");
    const [liveOrders,    setLiveOrders]    = useState(ORDERS_DATA);
    const [loadingOrders, setLoadingOrders] = useState(true);
    useEffect(()=>{
      if (!user?.id) { setLoadingOrders(false); return; }
      supabase.from("orders").select("*").eq("seller_id", user.id.toString()).order("created_at",{ ascending:false })
        .then(({ data })=>{ if (data&&data.length>0) setLiveOrders(data.map(o=>({ ...o, customer:o.customer_id?.slice(0,8)||"Customer", date:new Date(o.created_at).toLocaleDateString("en-US",{month:"short",day:"numeric"}) }))); setLoadingOrders(false); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const filtered = filter==="all"?liveOrders:liveOrders.filter(o=>o.status===filter);
    if (loadingOrders) return <div style={{ padding:"2rem", textAlign:"center", color:C.textMuted, fontSize:13 }}>Loading orders...</div>;
    return (
      <div style={{ padding:"2rem" }}>
        <h1 style={{ fontSize:24, fontWeight:700, color:C.text, margin:"0 0 1.25rem", letterSpacing:"-0.02em" }}>Orders</h1>
        <div style={{ display:"flex", gap:7, marginBottom:"1rem" }}>
          {["all","preparing","ready","delivered"].map(s=>(
            <Pill key={s} label={s==="all"?`All (${liveOrders.length})`:s.charAt(0).toUpperCase()+s.slice(1)} active={filter===s} onClick={()=>setFilter(s)}/>
          ))}
        </div>
        {filtered.length===0 ? (
          <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:"3rem", textAlign:"center" }}>
            <p style={{ fontSize:28, margin:"0 0 8px" }}>📋</p>
            <p style={{ fontSize:14, fontWeight:600, color:C.text, margin:"0 0 4px" }}>No orders yet</p>
            <p style={{ fontSize:13, color:C.textMuted, margin:0 }}>When customers place orders they'll appear here.</p>
          </div>
        ) : (
          <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, overflow:"hidden" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
              <thead>
                <tr style={{ borderBottom:`1px solid ${C.border}` }}>
                  {["Order","Customer","Items","Total","Status","Date"].map(h=>(
                    <th key={h} style={{ textAlign:"left", padding:"10px 14px", color:C.textMuted, fontWeight:600, fontSize:10, textTransform:"uppercase", letterSpacing:"0.08em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((o,i)=>(
                  <tr key={o.id} style={{ borderBottom:i<filtered.length-1?`1px solid ${C.border}`:"none" }}>
                    <td style={{ padding:"11px 14px", color:C.accent, fontWeight:700, fontSize:12 }}>{o.id}</td>
                    <td style={{ padding:"11px 14px", color:C.text, fontWeight:500 }}>{o.customer}</td>
                    <td style={{ padding:"11px 14px", color:C.textMuted, maxWidth:180, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{o.items}</td>
                    <td style={{ padding:"11px 14px", color:C.text, fontWeight:600 }}>${o.total?.toFixed(2)||"0.00"}</td>
                    <td style={{ padding:"11px 14px" }}><Badge status={o.status}/></td>
                    <td style={{ padding:"11px 14px", color:C.textMuted }}>{o.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  // ── SELLER FINANCES ──
  const Finances = () => {
    const COST_CATS = COST_CATS_DEF;
    const costs   = finCosts;
    const setCosts   = setFinCosts;
    // Uncontrolled input via ref — the ONLY way to prevent focus loss
    // when the component is defined inside a parent that re-renders.
    // We commit the value to finRevenue on blur only.
    const revenue = finRevenue;
    const [newCat,    setNewCat]    = useState("ingredients");
    const [newLabel,  setNewLabel]  = useState("");
    const [newAmt,    setNewAmt]    = useState("");
    const [showStmt,        setShowStmt]        = useState(false);
    const [selectedStmtMonth, setSelectedStmtMonth] = useState("");
    const [editingStmt,       setEditingStmt]       = useState(null);

    const saveMonthToHistory = async () => {
      if (!finRevenue && finCosts.length===0) return;
      const entry = { month:finMonth, revenue:parseFloat(finRevenue)||0, costs:finCosts };
      // Update local history
      setFinHistory(h=>{
        const existing = h.findIndex(m=>m.month===finMonth);
        if (existing>=0) { const n=[...h]; n[existing]=entry; return n; }
        return [...h, entry];
      });
      // Persist to Supabase (upsert by seller_id + month)
      if (user?.id) {
        await supabase.from("finances").upsert({
          seller_id: user.id,
          month:     finMonth,
          revenue:   parseFloat(finRevenue)||0,
          costs:     finCosts,
        }, { onConflict:"seller_id,month" });
      }
    };

    // Auto-save costs whenever they change
    useEffect(()=>{
      if (!user?.id || (finCosts.length===0 && !finRevenue)) return;
      supabase.from("finances").upsert({
        seller_id: user.id,
        month:     finMonth,
        revenue:   parseFloat(finRevenue)||0,
        costs:     finCosts,
      }, { onConflict:"seller_id,month" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [finCosts]);

    const loadMonth = (entry) => {
      saveMonthToHistory();
      setFinMonth(entry.month);
      const rv = String(entry.revenue||"");
      setFinRevenue(rv);
      // Sync uncontrolled input DOM value when loading a month
      if (revenueInputRef.current) revenueInputRef.current.value = rv;
      setFinCosts(entry.costs||[]);
    };

    const startNewMonth = () => {
      saveMonthToHistory();
      // Advance to the next calendar month from the CURRENT tracking month
      const parts = finMonth.split(" ");
      const curMonthIdx = MONTHS.indexOf(parts[0]);
      const curYear = parseInt(parts[1])||new Date().getFullYear();
      const nextMonthIdx = (curMonthIdx + 1) % 12;
      const nextYear = curMonthIdx === 11 ? curYear + 1 : curYear;
      const next = `${MONTHS[nextMonthIdx]} ${nextYear}`;
      setFinMonth(next);
      setFinRevenue("");
      if (revenueInputRef.current) revenueInputRef.current.value = "";
      setFinCosts([]);
    };

    const addCost = () => {
      if (!newAmt||parseFloat(newAmt)<=0) return;
      const cat = COST_CATS.find(c=>c.value===newCat);
      setCosts(p=>[...p,{ id:Date.now(), cat:newCat, label:newLabel||cat.label, amount:parseFloat(newAmt), color:cat.color }]);
      setNewLabel(""); setNewAmt("");
    };
    const removeCost = (id) => setCosts(p=>p.filter(c=>c.id!==id));

    const totalCosts  = costs.reduce((s,c)=>s+c.amount, 0);
    const rev         = parseFloat(revenue)||0;
    const profit      = rev - totalCosts;
    const margin      = rev>0 ? ((profit/rev)*100).toFixed(1) : "—";

    // Group costs by category
    const costByCategory = COST_CATS.map(cat => ({
      name: cat.label,
      amount: costs.filter(c=>c.cat===cat.value).reduce((s,c)=>s+c.amount,0),
      color: cat.color,
    })).filter(c=>c.amount>0);

    const totalPct = totalCosts > 0;
    const highestCat = [...costByCategory].sort((a,b)=>b.amount-a.amount)[0];
    const insightText = rev>0 && totalCosts>0
      ? highestCat
        ? `${highestCat.name} is your largest expense at $${highestCat.amount.toFixed(2)} (${((highestCat.amount/totalCosts)*100).toFixed(0)}% of total costs). ${parseFloat(margin)<62?"Your margin of "+margin+"% is below the 62% industry average — consider adjusting prices or reducing costs.":"Your margin of "+margin+"% is healthy. Keep tracking costs monthly to stay on track."}`
        : "Add your costs below to see insights."
      : "Enter your revenue and costs to unlock financial insights.";

    // Bar chart data for costs over category
    const barData = COST_CATS.map(cat=>({
      name: cat.label,
      costs: costs.filter(c=>c.cat===cat.value).reduce((s,c)=>s+c.amount,0),
    }));

    return (
      <div style={{ padding:"2rem" }}>
        {/* Header with month selector */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"1.5rem" }}>
          <div>
            <h1 style={{ fontSize:24, fontWeight:700, color:C.text, margin:"0 0 3px", letterSpacing:"-0.02em" }}>Finances</h1>
            <p style={{ fontSize:13, color:C.textMuted, margin:0 }}>Tracking: <strong style={{ color:C.accent }}>{finMonth}</strong></p>
          </div>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <button onClick={()=>setShowStmt(s=>!s)} style={{ background:showStmt?C.accentBg:"transparent", border:`1px solid ${showStmt?C.accent:C.border}`, color:showStmt?C.accent:C.textMuted, borderRadius:5, padding:"8px 14px", fontSize:12, fontWeight:600, cursor:"pointer" }}>
              {showStmt?"Hide Statements":"Monthly Statements"}
            </button>
            <button onClick={()=>{ saveMonthToHistory(); startNewMonth(); }} style={{ background:C.accent, color:"#FFF", border:"none", borderRadius:5, padding:"8px 14px", fontSize:12, fontWeight:700, cursor:"pointer" }}>
              + New Month
            </button>
          </div>
        </div>

        {/* Monthly Statements Panel */}
        {showStmt && (
          <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:"1.5rem", marginBottom:"1.25rem" }}>
            <p style={{ fontWeight:700, fontSize:14, color:C.text, margin:"0 0 14px", letterSpacing:"-0.01em" }}>Monthly Statements</p>

            {finHistory.length===0 ? (
              <p style={{ fontSize:13, color:C.textMuted, margin:0 }}>No saved months yet. Click "+ New Month" to save the current month and start a fresh one.</p>
            ) : (
              <>
                {/* Dropdown to select a month */}
                <div style={{ marginBottom:16 }}>
                  <label style={{ fontSize:10, fontWeight:700, color:C.textMuted, display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.08em" }}>Select a month to view or edit</label>
                  <select
                    value={selectedStmtMonth||""}
                    onChange={e=>{
                      const m = finHistory.find(h=>h.month===e.target.value)||null;
                      setSelectedStmtMonth(e.target.value);
                      setEditingStmt(m ? { ...m, costs:[...m.costs.map(c=>({...c}))] } : null);
                    }}
                    style={{ width:"100%", padding:"10px 12px", border:`1px solid ${C.border}`, borderRadius:6, fontSize:14, fontWeight:600, color:C.text, background:C.surfaceHigh, outline:"none" }}>
                    <option value="">— Choose a month —</option>
                    {[...finHistory].reverse().map(m=>{
                      const mC = m.costs.reduce((s,c)=>s+c.amount,0);
                      const mP = m.revenue - mC;
                      return <option key={m.month} value={m.month}>{m.month} · Revenue ${m.revenue.toFixed(2)} · Profit ${mP.toFixed(2)}</option>;
                    })}
                  </select>
                </div>

                {/* Editable statement detail */}
                {editingStmt && (
                  <div style={{ background:C.surfaceHigh, border:`1px solid ${C.border}`, borderRadius:8, padding:"1.25rem" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                      <p style={{ fontWeight:700, fontSize:15, color:C.accent, margin:0 }}>{editingStmt.month}</p>
                      <div style={{ display:"flex", gap:8 }}>
                        <button onClick={async ()=>{
                          // Save changes to this historical month
                          const updated = { month:editingStmt.month, revenue:parseFloat(editingStmt.revenueEdit||editingStmt.revenue)||0, costs:editingStmt.costs };
                          setFinHistory(h=>h.map(m=>m.month===updated.month?updated:m));
                          if (user?.id) {
                            await supabase.from("finances").upsert({
                              seller_id: user.id, month: updated.month,
                              revenue: updated.revenue, costs: updated.costs
                            }, { onConflict:"seller_id,month" });
                          }
                          setEditingStmt(null); setSelectedStmtMonth("");
                        }} style={{ background:C.accent, color:"#FFF", border:"none", borderRadius:5, padding:"7px 14px", fontSize:12, fontWeight:700, cursor:"pointer" }}>
                          Save Changes
                        </button>
                        <button onClick={()=>loadMonth(editingStmt)} style={{ background:C.accentBg, border:`1px solid ${C.accentBorder}`, color:C.accent, borderRadius:5, padding:"7px 14px", fontSize:12, fontWeight:600, cursor:"pointer" }}>
                          Load as Current
                        </button>
                      </div>
                    </div>

                    {/* Edit revenue for this month */}
                    <div style={{ marginBottom:14 }}>
                      <label style={{ fontSize:10, fontWeight:700, color:C.textMuted, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.08em" }}>Revenue</label>
                      <div style={{ position:"relative", maxWidth:240 }}>
                        <span style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", fontSize:13, color:C.textMuted, fontWeight:600 }}>$</span>
                        <input
                          defaultValue={editingStmt.revenue}
                          onBlur={e=>setEditingStmt(s=>({...s, revenueEdit:e.target.value}))}
                          type="text" inputMode="decimal"
                          style={{ width:"100%", padding:"9px 9px 9px 22px", border:`1px solid ${C.border}`, borderRadius:5, fontSize:14, fontWeight:700, color:C.text, background:C.surface, outline:"none", boxSizing:"border-box" }}/>
                      </div>
                    </div>

                    {/* Edit cost entries */}
                    <div style={{ marginBottom:12 }}>
                      <label style={{ fontSize:10, fontWeight:700, color:C.textMuted, display:"block", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.08em" }}>Cost Entries</label>
                      {editingStmt.costs.length===0 ? (
                        <p style={{ fontSize:12, color:C.textMuted }}>No costs for this month.</p>
                      ) : editingStmt.costs.map((c,i)=>(
                        <div key={c.id||i} style={{ display:"flex", alignItems:"center", gap:10, padding:"7px 0", borderBottom:`1px solid ${C.border}` }}>
                          <div style={{ width:8, height:8, borderRadius:"50%", background:c.color||C.accent, flexShrink:0 }}/>
                          <span style={{ fontSize:12, color:C.text, fontWeight:500, flex:1 }}>{c.label}</span>
                          <span style={{ fontSize:11, color:C.textMuted, textTransform:"capitalize", width:80 }}>{c.cat}</span>
                          <input
                            defaultValue={c.amount}
                            onBlur={e=>{
                              const v = parseFloat(e.target.value)||0;
                              setEditingStmt(s=>({ ...s, costs:s.costs.map((cc,ii)=>ii===i?{...cc,amount:v}:cc) }));
                            }}
                            type="text" inputMode="decimal"
                            style={{ width:80, padding:"4px 8px", border:`1px solid ${C.border}`, borderRadius:4, fontSize:13, fontWeight:600, color:C.text, background:C.surface, outline:"none", textAlign:"right" }}/>
                          <button onClick={()=>setEditingStmt(s=>({...s,costs:s.costs.filter((_,ii)=>ii!==i)}))}
                            style={{ background:C.dangerBg, border:`1px solid ${C.danger}`, borderRadius:4, padding:"2px 7px", fontSize:11, color:C.danger, cursor:"pointer" }}>✕</button>
                        </div>
                      ))}
                    </div>

                    {/* Add a cost to this historical month */}
                    <div style={{ display:"flex", gap:8, alignItems:"flex-end" }}>
                      <div style={{ flex:1 }}>
                        <label style={{ fontSize:10, fontWeight:600, color:C.textMuted, display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.07em" }}>Category</label>
                        <select value={newCat} onChange={e=>setNewCat(e.target.value)}
                          style={{ width:"100%", padding:"8px 9px", border:`1px solid ${C.border}`, borderRadius:5, fontSize:12, color:C.text, background:C.surface, outline:"none" }}>
                          {COST_CATS.map(c=><option key={c.value} value={c.value}>{c.label}</option>)}
                        </select>
                      </div>
                      <div style={{ flex:1 }}>
                        <label style={{ fontSize:10, fontWeight:600, color:C.textMuted, display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.07em" }}>Description</label>
                        <input value={newLabel} onChange={e=>setNewLabel(e.target.value)} placeholder="optional"
                          style={{ width:"100%", padding:"8px 9px", border:`1px solid ${C.border}`, borderRadius:5, fontSize:12, color:C.text, background:C.surface, outline:"none", boxSizing:"border-box" }}/>
                      </div>
                      <div style={{ flex:1 }}>
                        <label style={{ fontSize:10, fontWeight:600, color:C.textMuted, display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.07em" }}>Amount ($)</label>
                        <input value={newAmt} onChange={e=>setNewAmt(e.target.value)} placeholder="0.00"
                          style={{ width:"100%", padding:"8px 9px", border:`1px solid ${C.border}`, borderRadius:5, fontSize:12, color:C.text, background:C.surface, outline:"none", boxSizing:"border-box" }}/>
                      </div>
                      <button onClick={()=>{
                        if (!newAmt||parseFloat(newAmt)<=0) return;
                        const cat = COST_CATS.find(c=>c.value===newCat);
                        setEditingStmt(s=>({ ...s, costs:[...s.costs,{ id:Date.now(), cat:newCat, label:newLabel||cat.label, amount:parseFloat(newAmt), color:cat.color }] }));
                        setNewLabel(""); setNewAmt("");
                      }} style={{ background:C.accent, color:"#FFF", border:"none", borderRadius:5, padding:"8px 14px", fontSize:12, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap" }}>
                        + Add
                      </button>
                    </div>

                    {/* Summary */}
                    {(() => {
                      const mC = editingStmt.costs.reduce((s,c)=>s+c.amount,0);
                      const mR = parseFloat(editingStmt.revenueEdit||editingStmt.revenue)||0;
                      const mP = mR - mC;
                      const mM = mR>0?((mP/mR)*100).toFixed(1):"—";
                      return (
                        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, marginTop:14, paddingTop:14, borderTop:`1px solid ${C.border}` }}>
                          {[["Revenue",`$${mR.toFixed(2)}`,C.accent],["Costs",`$${mC.toFixed(2)}`,C.warning],["Profit",`$${mP.toFixed(2)}`,mP>=0?C.success:C.danger],["Margin",mM!=="—"?`${mM}%`:"—",parseFloat(mM)>=62?C.success:C.warning]].map(([k,v,col])=>(
                            <div key={k} style={{ textAlign:"center", background:C.surface, borderRadius:6, padding:"8px" }}>
                              <p style={{ fontSize:10, color:C.textMuted, margin:"0 0 3px", textTransform:"uppercase", letterSpacing:"0.07em" }}>{k}</p>
                              <p style={{ fontSize:16, fontWeight:700, color:col, margin:0 }}>{v}</p>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* KPIs */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,minmax(0,1fr))", gap:10, marginBottom:"1.75rem" }}>
          <KPI label="Revenue This Month" value={rev>0?`$${rev.toLocaleString()}`:"—"} sub="Enter below" color={C.accent}/>
          <KPI label="Total Costs"        value={totalCosts>0?`$${totalCosts.toFixed(2)}`:"—"} sub={`${costs.length} entries`} color={C.warning}/>
          <KPI label="Net Profit"         value={rev>0&&totalCosts>0?`$${profit.toFixed(2)}`:"—"} sub="Revenue minus costs" color={profit>=0?C.success:C.danger}/>
          <KPI label="Profit Margin"      value={rev>0&&totalCosts>0?`${margin}%`:"—"} sub="Industry avg: 62%" color={parseFloat(margin)>=62?C.success:C.warning}/>
        </div>

        {/* Row 1: Revenue input + Add cost form */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:"1.25rem" }}>
          <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:"1.25rem" }}>
            <p style={{ fontWeight:600, fontSize:13, color:C.text, margin:"0 0 12px" }}>Monthly Revenue</p>
            <div style={{ position:"relative" }}>
              <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", fontSize:14, color:C.textMuted, fontWeight:600 }}>$</span>
              <input
                ref={revenueInputRef}
                defaultValue={finRevenue}
                onBlur={e=>{
                  const v=e.target.value.trim();
                  setFinRevenue(v);
                  if (user?.id && (v||finCosts.length>0)) {
                    supabase.from("finances").upsert({
                      seller_id: user.id,
                      month:     finMonth,
                      revenue:   parseFloat(v)||0,
                      costs:     finCosts,
                    }, { onConflict:"seller_id,month" });
                  }
                }}
                placeholder="0.00"
                type="text"
                inputMode="decimal"
                style={{ width:"100%", padding:"12px 12px 12px 26px", border:`1px solid ${C.border}`, borderRadius:6, fontSize:16, fontWeight:700, color:C.text, background:C.surfaceHigh, outline:"none", boxSizing:"border-box" }}/>
            </div>
            <p style={{ fontSize:11, color:C.textMuted, margin:"8px 0 0" }}>Total sales collected this month</p>
          </div>
          <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:"1.25rem" }}>
            <p style={{ fontWeight:600, fontSize:13, color:C.text, margin:"0 0 12px" }}>Add a Cost</p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:8 }}>
              <div>
                <label style={{ fontSize:10, fontWeight:600, color:C.textMuted, display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.07em" }}>Category</label>
                <select value={newCat} onChange={e=>setNewCat(e.target.value)}
                  style={{ width:"100%", padding:"9px 10px", border:`1px solid ${C.border}`, borderRadius:5, fontSize:13, color:C.text, background:C.surfaceHigh, outline:"none" }}>
                  {COST_CATS.map(c=><option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize:10, fontWeight:600, color:C.textMuted, display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.07em" }}>Amount ($)</label>
                <input value={newAmt} onChange={e=>setNewAmt(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addCost()} placeholder="0.00" type="number" min="0"
                  style={{ width:"100%", padding:"9px 10px", border:`1px solid ${C.border}`, borderRadius:5, fontSize:13, color:C.text, background:C.surfaceHigh, outline:"none", boxSizing:"border-box" }}/>
              </div>
            </div>
            <div style={{ marginBottom:8 }}>
              <label style={{ fontSize:10, fontWeight:600, color:C.textMuted, display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.07em" }}>Description (optional)</label>
              <input value={newLabel} onChange={e=>setNewLabel(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addCost()} placeholder="e.g. Flour from wholesale"
                style={{ width:"100%", padding:"9px 10px", border:`1px solid ${C.border}`, borderRadius:5, fontSize:13, color:C.text, background:C.surfaceHigh, outline:"none", boxSizing:"border-box" }}/>
            </div>
            <button onClick={addCost} disabled={!newAmt||parseFloat(newAmt)<=0} style={{ width:"100%", padding:"10px", background:newAmt&&parseFloat(newAmt)>0?C.accent:"rgba(196,98,45,0.3)", color:"#FFF", border:"none", borderRadius:5, fontSize:13, fontWeight:700, cursor:"pointer" }}>
              + Add Cost
            </button>
          </div>
        </div>

        {/* Row 2: Bar chart + Cost breakdown */}
        <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:14, marginBottom:"1.25rem" }}>
          <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:"1.25rem" }}>
            <p style={{ fontWeight:600, fontSize:13, color:C.text, margin:"0 0 1rem" }}>Costs by Category</p>
            {totalCosts>0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={barData} barSize={40}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border}/>
                  <XAxis dataKey="name" tick={{ fontSize:11, fill:C.textMuted }} axisLine={false} tickLine={false}/>
                  <YAxis tick={{ fontSize:11, fill:C.textMuted }} axisLine={false} tickLine={false}/>
                  <Tooltip contentStyle={{ background:C.surfaceTop, border:`1px solid ${C.border}`, borderRadius:5, fontSize:12, color:C.text }} formatter={(v)=>[`$${v.toFixed(2)}`,"Amount"]}/>
                  <Bar dataKey="costs" fill={C.accent} radius={[4,4,0,0]} name="Cost ($)"/>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height:220, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:8 }}>
                <p style={{ fontSize:28, margin:0 }}>📊</p>
                <p style={{ fontSize:13, color:C.textMuted, margin:0 }}>Add costs above to see the chart.</p>
              </div>
            )}
          </div>
          <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:"1.25rem" }}>
            <p style={{ fontWeight:600, fontSize:13, color:C.text, margin:"0 0 12px" }}>This Month's Costs</p>
            {costByCategory.length===0 ? (
              <p style={{ fontSize:12, color:C.textMuted, margin:0, lineHeight:1.6 }}>Add costs to see the breakdown.</p>
            ) : costByCategory.map(e=>(
              <div key={e.name} style={{ marginBottom:12 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                  <span style={{ fontSize:12, color:C.textSub, fontWeight:500 }}>{e.name}</span>
                  <span style={{ fontSize:11, color:C.textMuted }}>{totalPct?((e.amount/totalCosts)*100).toFixed(0):0}%</span>
                </div>
                <div style={{ height:5, background:C.surfaceHigh, borderRadius:2 }}>
                  <div style={{ height:5, width:totalPct?`${(e.amount/totalCosts)*100}%`:"0%", background:e.color, borderRadius:2 }}/>
                </div>
                <p style={{ fontSize:10, color:C.textMuted, margin:"2px 0 0", textAlign:"right" }}>${e.amount.toFixed(2)}</p>
              </div>
            ))}
            {totalCosts>0 && (
              <div style={{ marginTop:10, paddingTop:10, borderTop:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between" }}>
                <span style={{ fontSize:12, fontWeight:600, color:C.text }}>Total</span>
                <span style={{ fontSize:12, fontWeight:700, color:C.accent }}>${totalCosts.toFixed(2)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Row 3: Cost entries list — full width */}
        <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:"1.25rem", marginBottom:"1.25rem" }}>
          <p style={{ fontWeight:600, fontSize:13, color:C.text, margin:"0 0 12px" }}>Cost Entries</p>
          {costs.length===0 ? (
            <div style={{ textAlign:"center", padding:"1.5rem", color:C.textMuted }}>
              <p style={{ fontSize:24, margin:"0 0 6px" }}>💰</p>
              <p style={{ fontSize:13, margin:0 }}>No costs added yet — use the form above to start tracking.</p>
            </div>
          ) : (
            <>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,minmax(0,1fr))", gap:8 }}>
                {costs.map(c=>(
                  <div key={c.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", background:C.surfaceHigh, borderRadius:6, padding:"10px 12px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                      <div style={{ width:9, height:9, borderRadius:"50%", background:c.color, flexShrink:0 }}/>
                      <div>
                        <p style={{ fontSize:13, color:C.text, fontWeight:500, margin:0 }}>{c.label}</p>
                        <p style={{ fontSize:10, color:C.textMuted, margin:0, textTransform:"capitalize" }}>{c.cat}</p>
                      </div>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <span style={{ fontSize:13, fontWeight:700, color:C.text }}>${c.amount.toFixed(2)}</span>
                      <button onClick={()=>removeCost(c.id)} style={{ background:C.dangerBg, border:`1px solid ${C.danger}`, borderRadius:4, padding:"2px 7px", fontSize:11, color:C.danger, cursor:"pointer" }}>✕</button>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", marginTop:12, paddingTop:10, borderTop:`1px solid ${C.border}` }}>
                <span style={{ fontSize:13, fontWeight:700, color:C.text }}>Total Costs</span>
                <span style={{ fontSize:15, fontWeight:700, color:C.warning }}>${totalCosts.toFixed(2)}</span>
              </div>
            </>
          )}
        </div>

        {/* Insight */}
        <div style={{ background:"rgba(245,158,11,0.06)", border:`1px solid rgba(245,158,11,0.2)`, borderRadius:7, padding:"1rem 1.25rem" }}>
          <p style={{ fontWeight:700, fontSize:12, color:C.warning, margin:"0 0 5px", textTransform:"uppercase", letterSpacing:"0.06em" }}>Insight</p>
          <p style={{ fontSize:13, color:C.textSub, margin:0, lineHeight:1.7 }}>{insightText}</p>
        </div>
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
    const save = async () => {
      if (user?.id) {
        await supabase.from("profiles").update({
          delivery_settings: { pickup, delivery:del, days }
        }).eq("id", user.id);
      }
      setSaved(true); setTimeout(()=>setSaved(false),2500);
    };
    return (
      <div style={{ padding:"2rem" }}>
        <h1 style={{ fontSize:24, fontWeight:700, color:C.text, margin:"0 0 1.5rem", letterSpacing:"-0.02em" }}>Delivery Settings</h1>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
          {/* Pickup */}
          <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:"1.25rem" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:pickup.enabled?"1rem":0 }}>
              <div>
                <p style={{ fontWeight:600, fontSize:14, color:C.text, margin:"0 0 2px" }}>🏠 Pickup</p>
                <p style={{ fontSize:12, color:C.textMuted, margin:0 }}>Customers collect from your home</p>
              </div>
              <Toggle val={pickup.enabled} onChange={()=>setPickup(p=>({...p,enabled:!p.enabled}))}/>
            </div>
            {pickup.enabled && <>
              <Inp label="Pickup Address" value={pickup.address} onChange={v=>setPickup(p=>({...p,address:v}))} ph="Your address"/>
              <div>
                <label style={{ fontSize:10, fontWeight:600, color:C.textMuted, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.08em" }}>Special Instructions</label>
                <textarea value={pickup.instructions} onChange={e=>setPickup(p=>({...p,instructions:e.target.value}))} rows={3}
                  style={{ width:"100%", padding:"9px 12px", border:`1px solid ${C.border}`, borderRadius:5, fontSize:13, color:C.text, background:C.surfaceHigh, outline:"none", resize:"none", boxSizing:"border-box" }}/>
              </div>
            </>}
          </div>
          {/* Home Delivery */}
          <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:"1.25rem" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:del.enabled?"1rem":0 }}>
              <div>
                <p style={{ fontWeight:600, fontSize:14, color:C.text, margin:"0 0 2px" }}>🚗 Home Delivery</p>
                <p style={{ fontSize:12, color:C.textMuted, margin:0 }}>You deliver to customers</p>
              </div>
              <Toggle val={del.enabled} onChange={()=>setDel(p=>({...p,enabled:!p.enabled}))}/>
            </div>
            {del.enabled && <>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:8 }}>
                <Inp label="Fee ($)"     value={del.fee}      onChange={v=>setDel(p=>({...p,fee:v}))}      ph="5.00"/>
                <Inp label="Min ($)"     value={del.minOrder} onChange={v=>setDel(p=>({...p,minOrder:v}))} ph="20.00"/>
                <Inp label="Radius (km)" value={del.radius}   onChange={v=>setDel(p=>({...p,radius:v}))}   ph="10"/>
              </div>
            </>}
          </div>
        </div>
        {/* Schedule — full width */}
        <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:"1.25rem", marginBottom:"1.5rem" }}>
          <p style={{ fontWeight:600, fontSize:13, color:C.text, margin:"0 0 1rem" }}>📅 Schedule</p>
          <div style={{ display:"flex", gap:8, marginBottom:"1.25rem" }}>
            {DAY_LABELS.map(([key,label])=>(
              <button key={key} onClick={()=>setDays(p=>({...p,[key]:!p[key]}))} style={{ flex:1, height:42, borderRadius:6, border:`1px solid ${days[key]?C.accent:C.border}`, background:days[key]?C.accentBg:"transparent", color:days[key]?C.accent:C.textMuted, fontSize:12, fontWeight:600, cursor:"pointer" }}>{label}</button>
            ))}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <Inp label="Order Cutoff Time" value={del.cutoff} onChange={v=>setDel(p=>({...p,cutoff:v}))} ph="17:00"/>
            <div style={{ marginBottom:12 }}>
              <label style={{ fontSize:10, fontWeight:600, color:C.textMuted, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.08em" }}>Lead Time</label>
              <select value={del.lead} onChange={e=>setDel(p=>({...p,lead:e.target.value}))}
                style={{ width:"100%", padding:"9px 12px", border:`1px solid ${C.border}`, borderRadius:5, fontSize:13, color:C.text, background:C.surfaceHigh, outline:"none" }}>
                <option value="0">Same day</option><option value="1">1 day notice</option><option value="2">2 days notice</option>
              </select>
            </div>
          </div>
        </div>
        <button onClick={save} style={{ background:saved?C.success:C.accent, color:"#FFF", border:"none", borderRadius:5, padding:"12px 28px", fontSize:13, fontWeight:700, cursor:"pointer", transition:"background 0.2s" }}>
          {saved?"✓ Settings Saved":"Save Settings"}
        </button>
      </div>
    );
  };



  // ── CUSTOMERS ──
  const Customers = () => {
    const [customers,   setCustomers]   = useState([]);
    const [loadingCust, setLoadingCust] = useState(true);
    const [showAdd,     setShowAdd]     = useState(false);
    const [search,      setSearch]      = useState("");
    const [form, setForm] = useState({ name:"", phone:"", email:"", notes:"", tag:"regular" });

    const TAGS = [
      { v:"regular",   label:"Regular",     bg:"rgba(196,98,45,0.1)",  color:"#C4622D" },
      { v:"vip",       label:"VIP",         bg:"rgba(160,112,16,0.1)", color:"#A07010" },
      { v:"wholesale", label:"Wholesale",   bg:"rgba(26,107,156,0.1)", color:"#1A6B9C" },
      { v:"new",       label:"New",         bg:"rgba(30,122,72,0.1)",  color:"#1E7A48" },
    ];

    useEffect(()=>{
      if (!user?.id) { setLoadingCust(false); return; }
      supabase.from("customers").select("*").eq("seller_id", user.id).order("created_at", { ascending:false })
        .then(({ data })=>{ setCustomers(data||[]); setLoadingCust(false); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const addCustomer = async () => {
      if (!form.name.trim()) return;
      const since = new Date().toLocaleDateString("en-US",{month:"short",year:"numeric"});
      const newCust = { seller_id:user.id, name:form.name, phone:form.phone, email:form.email, notes:form.notes, tag:form.tag, since };
      const { data, error } = await supabase.from("customers").insert(newCust).select().single();
      if (!error && data) setCustomers(p=>[data,...p]);
      else setCustomers(p=>[{ id:Date.now(), ...newCust },...p]);
      setForm({ name:"", phone:"", email:"", notes:"", tag:"regular" });
      setShowAdd(false);
    };

    const removeCustomer = async (id) => {
      await supabase.from("customers").delete().eq("id", id);
      setCustomers(p=>p.filter(c=>c.id!==id));
    };

    const filtered = customers.filter(c=>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.email.toLowerCase().includes(search.toLowerCase())
    );

    if (loadingCust) return <div style={{ padding:"2rem", textAlign:"center", color:C.textMuted, fontSize:13 }}>Loading customers...</div>;

    return (
      <div style={{ padding:"2rem" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"1.5rem" }}>
          <div>
            <h1 style={{ fontSize:24, fontWeight:700, color:C.text, margin:"0 0 4px", letterSpacing:"-0.02em" }}>Customers</h1>
            <p style={{ fontSize:13, color:C.textMuted, margin:0 }}>Your regulars, VIPs, and wholesale buyers</p>
          </div>
          <button onClick={()=>setShowAdd(true)} style={{ background:C.accent, color:"#FFF", border:"none", borderRadius:5, padding:"9px 16px", fontSize:13, fontWeight:700, cursor:"pointer" }}>+ Add Customer</button>
        </div>

        {/* Stats row */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,minmax(0,1fr))", gap:10, marginBottom:"1.5rem" }}>
          {TAGS.map(tag=>(
            <div key={tag.v} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:"1rem 1.25rem" }}>
              <p style={{ fontSize:10, color:C.textMuted, margin:"0 0 6px", textTransform:"uppercase", letterSpacing:"0.1em", fontWeight:600 }}>{tag.label}</p>
              <p style={{ fontSize:28, fontWeight:700, margin:0, color:tag.color, letterSpacing:"-0.02em" }}>
                {customers.filter(c=>c.tag===tag.v).length}
              </p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div style={{ marginBottom:"1rem" }}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name, phone or email..."
            style={{ width:"100%", padding:"10px 14px", border:`1px solid ${C.border}`, borderRadius:6, fontSize:13, color:C.text, background:C.surface, outline:"none", boxSizing:"border-box" }}/>
        </div>

        {/* Customer list */}
        {customers.length===0 ? (
          <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:"3rem", textAlign:"center" }}>
            <p style={{ fontSize:28, margin:"0 0 10px" }}>👥</p>
            <p style={{ fontSize:15, fontWeight:600, color:C.text, margin:"0 0 6px" }}>No customers yet</p>
            <p style={{ fontSize:13, color:C.textMuted, margin:"0 0 1.25rem" }}>Build your customer list to track your regulars, VIPs, and wholesale buyers.</p>
            <button onClick={()=>setShowAdd(true)} style={{ background:C.accent, color:"#FFF", border:"none", borderRadius:5, padding:"10px 20px", fontSize:13, fontWeight:700, cursor:"pointer" }}>+ Add your first customer</button>
          </div>
        ) : filtered.length===0 ? (
          <p style={{ fontSize:13, color:C.textMuted, padding:"1rem 0" }}>No customers match "{search}"</p>
        ) : (
          <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, overflow:"hidden" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
              <thead>
                <tr style={{ borderBottom:`1px solid ${C.border}` }}>
                  {["Name","Contact","Tag","Notes","Since",""].map(h=>(
                    <th key={h} style={{ textAlign:"left", padding:"10px 14px", color:C.textMuted, fontWeight:600, fontSize:10, textTransform:"uppercase", letterSpacing:"0.08em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((c,i)=>{
                  const tag = TAGS.find(t=>t.v===c.tag)||TAGS[0];
                  return (
                    <tr key={c.id} style={{ borderBottom:i<filtered.length-1?`1px solid ${C.border}`:"none" }}>
                      <td style={{ padding:"11px 14px" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                          <div style={{ width:34, height:34, borderRadius:"50%", background:tag.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:700, color:tag.color, flexShrink:0 }}>
                            {c.name.charAt(0).toUpperCase()}
                          </div>
                          <span style={{ fontWeight:600, color:C.text }}>{c.name}</span>
                        </div>
                      </td>
                      <td style={{ padding:"11px 14px" }}>
                        <p style={{ color:C.text, margin:"0 0 1px", fontSize:12 }}>{c.phone||"—"}</p>
                        <p style={{ color:C.textMuted, margin:0, fontSize:11 }}>{c.email||"—"}</p>
                      </td>
                      <td style={{ padding:"11px 14px" }}>
                        <span style={{ background:tag.bg, color:tag.color, fontSize:11, fontWeight:700, padding:"3px 9px", borderRadius:4 }}>{tag.label}</span>
                      </td>
                      <td style={{ padding:"11px 14px", color:C.textMuted, fontSize:12, maxWidth:180, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.notes||"—"}</td>
                      <td style={{ padding:"11px 14px", color:C.textMuted, fontSize:12 }}>{c.since}</td>
                      <td style={{ padding:"11px 14px" }}>
                        <button onClick={()=>removeCustomer(c.id)} style={{ background:C.dangerBg, border:`1px solid ${C.danger}`, borderRadius:4, padding:"3px 9px", fontSize:11, color:C.danger, cursor:"pointer" }}>Remove</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Add customer modal */}
        {showAdd && (
          <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:200 }}>
            <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:"1.75rem", width:460, maxWidth:"95vw" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.25rem" }}>
                <h2 style={{ fontSize:18, fontWeight:700, color:C.text, margin:0, letterSpacing:"-0.02em" }}>Add Customer</h2>
                <button onClick={()=>setShowAdd(false)} style={{ background:C.surfaceHigh, border:"none", width:28, height:28, borderRadius:4, fontSize:14, cursor:"pointer", color:C.textMuted }}>✕</button>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 }}>
                <Inp label="Full Name *"  value={form.name}  onChange={v=>setForm({...form,name:v})}  ph="Maria Santos"/>
                <Inp label="Phone"        value={form.phone} onChange={v=>setForm({...form,phone:v})} ph="+1 (416) 555-0100"/>
              </div>
              <Inp label="Email" value={form.email} onChange={v=>setForm({...form,email:v})} ph="customer@email.com"/>
              <div style={{ marginBottom:12 }}>
                <label style={{ fontSize:10, fontWeight:600, color:C.textMuted, display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.08em" }}>Customer Type</label>
                <div style={{ display:"flex", gap:7 }}>
                  {TAGS.map(tag=>(
                    <button key={tag.v} onClick={()=>setForm({...form,tag:tag.v})} style={{
                      flex:1, padding:"8px 4px", border:`1px solid ${form.tag===tag.v?tag.color:C.border}`,
                      borderRadius:5, background:form.tag===tag.v?tag.bg:"transparent",
                      color:form.tag===tag.v?tag.color:C.textMuted, fontSize:12, fontWeight:form.tag===tag.v?700:400, cursor:"pointer"
                    }}>{tag.label}</button>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom:16 }}>
                <label style={{ fontSize:10, fontWeight:600, color:C.textMuted, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.08em" }}>Notes</label>
                <textarea value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} rows={2} placeholder="e.g. Orders sourdough every Friday, allergic to nuts..."
                  style={{ width:"100%", padding:"9px 12px", border:`1px solid ${C.border}`, borderRadius:5, fontSize:13, color:C.text, background:C.surfaceHigh, outline:"none", resize:"none", boxSizing:"border-box" }}/>
              </div>
              <div style={{ display:"flex", gap:8 }}>
                <button onClick={()=>setShowAdd(false)} style={{ flex:1, padding:"10px", border:`1px solid ${C.border}`, borderRadius:5, background:"transparent", color:C.textMuted, cursor:"pointer", fontSize:13 }}>Cancel</button>
                <button onClick={addCustomer} disabled={!form.name.trim()} style={{ flex:2, padding:"10px", background:form.name.trim()?C.accent:"rgba(196,98,45,0.3)", color:"#FFF", border:"none", borderRadius:5, cursor:"pointer", fontSize:13, fontWeight:700 }}>
                  Add Customer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ display:"flex", height:"100vh", fontFamily:"'DM Sans', system-ui, sans-serif", background:C.bg, overflow:"hidden" }}>
      <ProfilePanel/>
      <Sidebar/>
      <main style={{ flex:1, overflowY:"auto" }}>
        {view==="dashboard"  && <Dashboard/>}
        {view==="storefront" && <Storefront/>}
        {view==="orders"     && <Orders/>}
        {view==="customers"  && <Customers/>}
        {view==="finances"   && <Finances/>}
        {view==="delivery"   && <Delivery/>}
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
    link.href = "https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap";
    document.head.appendChild(link);
    return ()=>{ try{ document.head.removeChild(link); }catch(e){} };
  }, []);

  if (!user) return <AuthScreen onAuth={setUser}/>;
  if (user.role==="seller") return <SellerApp user={user} onSignOut={()=>setUser(null)}/>;
  return <CustomerApp user={user} onSignOut={()=>setUser(null)}/>;
}
