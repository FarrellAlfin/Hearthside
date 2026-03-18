import { useState, useEffect, useRef } from "react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
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
const CHAT_INIT = [
  { id:1, seller:"Maria's Home Bakery",  hood:"Leslieville",  emoji:"🍞", time:"8:02am",  msg:"Fresh sourdough just out of the oven! 8 loaves available today 🔥 Order by noon for afternoon pickup." },
  { id:2, seller:"The Dumpling Den",     hood:"Chinatown",    emoji:"🥟", time:"8:45am",  msg:"Making an extra batch of pork dumplings today — 5 orders left at the special price of $12/dozen." },
  { id:3, seller:"Biji's Spice Kitchen", hood:"Brampton",     emoji:"🫙", time:"9:10am",  msg:"New batch of mango chutney and mixed pickle ready 🥭 Also fresh roti every morning this week." },
  { id:4, seller:"Aisha's Sweet Corner", hood:"Kensington",   emoji:"🧁", time:"10:30am", msg:"Taking custom cake orders for Easter weekend. DM me your design! Minimum 3 days notice needed 🎂" },
  { id:5, seller:"Sunshine Sourdough",   hood:"Roncesvalles", emoji:"☀️", time:"11:00am", msg:"Focaccia is back on the menu. Rosemary & sea salt, ready by 2pm today." },
];
const REV_DATA = [
  { month:"Oct", revenue:420,  expenses:180, profit:240 },
  { month:"Nov", revenue:680,  expenses:215, profit:465 },
  { month:"Dec", revenue:1240, expenses:385, profit:855 },
  { month:"Jan", revenue:890,  expenses:295, profit:595 },
  { month:"Feb", revenue:1050, expenses:325, profit:725 },
  { month:"Mar", revenue:1380, expenses:415, profit:965 },
];
const ORDERS_DATA = [];
const STATUS_MAP = {
  delivered:{ bg:"rgba(34,197,94,0.12)",   color:"#22C55E", label:"Delivered"  },
  ready:    { bg:"rgba(59,130,246,0.12)",   color:"#3B82F6", label:"Ready"      },
  preparing:{ bg:"rgba(245,158,11,0.12)",  color:"#F59E0B", label:"Preparing"  },
  cancelled:{ bg:"rgba(239,68,68,0.12)",   color:"#EF4444", label:"Cancelled"  },
};
const SELLER_NAV = [
  { id:"dashboard",  icon:"▦", label:"Dashboard"    },
  { id:"storefront", icon:"◫", label:"Storefront"   },
  { id:"orders",     icon:"≡", label:"Orders"       },
  { id:"finances",   icon:"◈", label:"Finances"     },
  { id:"delivery",   icon:"⌖", label:"Delivery"     },
  { id:"marketing",  icon:"✦", label:"AI Marketing" },
  { id:"community",  icon:"◎", label:"Community"    },
  { id:"profile",    icon:"⊙", label:"Store Profile" },
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
function SellerApp({ user, onSignOut }) {
  const [view,            setView]            = useState("dashboard");
  const [products,        setProducts]        = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(()=>{
    if (!user?.id) { setProducts([]); setLoadingProducts(false); return; }
    supabase.from("products").select("*").eq("seller_id", user.id)
      .then(({ data })=>{ if (data&&data.length>0) setProducts(data); else setProducts([]); setLoadingProducts(false); });
  }, [user?.id]);

  // ── SIDEBAR ──
  const Sidebar = () => (
    <div style={{ width:220, background:C.sidebar, display:"flex", flexDirection:"column", flexShrink:0, borderRight:`1px solid rgba(255,255,255,0.06)` }}>
      <div style={{ padding:"1.25rem 1rem", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:10 }}>
        <div style={{ width:28, height:28, background:C.accent, borderRadius:5, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>🍞</div>
        <div style={{ minWidth:0 }}>
          <p style={{ color:C.sidebarText, fontSize:13, fontWeight:700, margin:0, letterSpacing:"-0.01em", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{user.business}</p>
          <p style={{ color:C.sidebarMuted, fontSize:10, margin:0 }}>Seller Dashboard</p>
        </div>
      </div>
      <nav style={{ flex:1, padding:"0.5rem" }}>
        {SELLER_NAV.map(item=>{
          const active = view===item.id;
          return (
            <button key={item.id} onClick={()=>setView(item.id)} style={{
              display:"flex", alignItems:"center", gap:10, width:"100%", padding:"8px 10px",
              background:active?"rgba(196,98,45,0.15)":"transparent", border:"none",
              borderRadius:5, cursor:"pointer", marginBottom:1, textAlign:"left"
            }}>
              <span style={{ fontSize:13, color:active?C.accent:C.sidebarMuted, width:16, textAlign:"center" }}>{item.icon}</span>
              <span style={{ fontSize:13, color:active?C.accent:C.textMuted, fontWeight:active?600:400 }}>{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div style={{ padding:"0.75rem" }}>
        <button onClick={onSignOut} style={{ display:"flex", alignItems:"center", gap:8, width:"100%", padding:"8px 10px", background:"transparent", border:"1px solid rgba(255,255,255,0.1)", borderRadius:5, cursor:"pointer" }}>
          <span style={{ fontSize:12, color:C.sidebarMuted }}>Sign out</span>
        </button>
      </div>
      <div style={{ padding:"0.75rem", borderTop:`1px solid ${C.border}` }}>
        <div style={{ background:"rgba(196,98,45,0.15)", border:"1px solid rgba(196,98,45,0.35)", borderRadius:6, padding:"10px 12px" }}>
          <p style={{ color:"#F4A261", fontSize:10, fontWeight:700, margin:"0 0 2px", textTransform:"uppercase", letterSpacing:"0.08em" }}>Free Trial</p>
          <p style={{ color:C.sidebarText, fontSize:11, margin:"0 0 8px" }}>14 days remaining</p>
          <button style={{ background:C.accent, color:"#000", border:"none", borderRadius:4, padding:"6px 10px", fontSize:11, fontWeight:700, cursor:"pointer", width:"100%" }}>Upgrade →</button>
        </div>
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
    const top = [...products].sort((a,b)=>(b.sold||0)-(a.sold||0))[0]||products[0];
    const thisM  = REV_DATA[REV_DATA.length-1];
    const prevM  = REV_DATA[REV_DATA.length-2];
    const growth = (((thisM.revenue-prevM.revenue)/prevM.revenue)*100).toFixed(1);
    const totalRev = REV_DATA.reduce((s,d)=>s+d.revenue,0);
    return (
      <div style={{ padding:"2rem" }}>
        <div style={{ marginBottom:"1.5rem" }}>
          <h1 style={{ fontSize:24, fontWeight:700, color:C.text, margin:"0 0 4px", letterSpacing:"-0.02em" }}>Good morning, {user.name.split(" ")[0]} 👋</h1>
          <p style={{ color:C.textMuted, fontSize:13, margin:0 }}>Here's how your bakery is performing.</p>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,minmax(0,1fr))", gap:10, marginBottom:"1.5rem" }}>
          <KPI label="Total Revenue" value={`$${(totalRev/1000).toFixed(1)}k`} sub="Last 6 months" color={C.accent}/>
          <KPI label="This Month"    value={`$${thisM.revenue.toLocaleString()}`} sub={`↑ ${growth}% vs last month`} color={C.success}/>
          <KPI label="Active Orders" value={ORDERS_DATA.filter(o=>o.status==="preparing"||o.status==="ready").length} sub="Need attention"/>
          <KPI label="Top Seller"    value={top?.emoji||"🍞"} sub={`${top?.name||"–"}`}/>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:12, marginBottom:"1.5rem" }}>
          <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:"1.25rem" }}>
            <p style={{ fontWeight:600, fontSize:13, color:C.text, margin:"0 0 1rem" }}>Revenue vs Expenses</p>
            <ResponsiveContainer width="100%" height={195}>
              <AreaChart data={REV_DATA}>
                <defs>
                  <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={C.accent} stopOpacity={0.15}/>
                    <stop offset="95%" stopColor={C.accent} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border}/>
                <XAxis dataKey="month" tick={{ fontSize:11, fill:C.textMuted }} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fontSize:11, fill:C.textMuted }} axisLine={false} tickLine={false}/>
                <Tooltip contentStyle={{ background:C.surfaceTop, border:`1px solid ${C.border}`, borderRadius:5, fontSize:12, color:C.text }}/>
                <Area type="monotone" dataKey="revenue"  stroke={C.accent}   strokeWidth={2} fill="url(#rg)" name="Revenue ($)"/>
                <Area type="monotone" dataKey="expenses" stroke={C.warning}  strokeWidth={2} fill="none"     name="Expenses ($)"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:"1.25rem" }}>
            <p style={{ fontWeight:600, fontSize:13, color:C.text, margin:"0 0 1rem" }}>Recent Orders</p>
            {ORDERS_DATA.slice(0,4).map(o=>(
              <div key={o.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"7px 0", borderBottom:`1px solid ${C.border}` }}>
                <div>
                  <p style={{ fontSize:12, color:C.text, fontWeight:500, margin:0 }}>{o.customer}</p>
                  <p style={{ fontSize:11, color:C.textMuted, margin:0 }}>{o.id}</p>
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
    const [showModal,    setShowModal]    = useState(false);
    const [editProduct,  setEditProduct]  = useState(null);
    const [form,         setForm]         = useState({ name:"", price:"", emoji:"🍞", desc:"", stock:"10" });
    const [editForm,     setEditForm]     = useState(null);
    const [imageFile,    setImageFile]    = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploading,    setUploading]    = useState(false);
    const [saving,       setSaving]       = useState(false);

    const openEdit = (p) => { setEditProduct(p); setEditForm({ name:p.name, price:String(p.price||""), emoji:p.emoji||"🍞", desc:p.desc||"", stock:String(p.stock||"10") }); };

    const saveEdit = async () => {
      if (!editForm.name||!editForm.price||!editProduct) return;
      setSaving(true);
      const updates = { name:editForm.name, price:parseFloat(editForm.price)||0, emoji:editForm.emoji||"🍞", desc:editForm.desc, stock:parseInt(editForm.stock)||0 };
      const { error } = await supabase.from("products").update(updates).eq("id", editProduct.id);
      if (!error) setProducts(p=>p.map(prod=>prod.id===editProduct.id?{...prod,...updates}:prod));
      setSaving(false); setEditProduct(null); setEditForm(null);
    };

    const deleteProduct = async () => {
      if (!editProduct||!window.confirm("Delete this product? This cannot be undone.")) return;
      await supabase.from("products").delete().eq("id", editProduct.id);
      setProducts(p=>p.filter(prod=>prod.id!==editProduct.id));
      setEditProduct(null); setEditForm(null);
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
        emoji: form.emoji||"🍞",
        stock: parseInt(form.stock)||10,
        desc: form.desc,
        image_url: imageUrl,
      };
      const { data, error } = await supabase.from("products").insert(newProduct).select().single();
      if (!error&&data) setProducts(p=>[...p, data]);
      else setProducts(p=>[...p,{ id:Date.now(), ...newProduct }]);
      setUploading(false);
      setShowModal(false);
      setForm({ name:"", price:"", emoji:"🍞", desc:"", stock:"10" });
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
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,minmax(0,1fr))", gap:10 }}>
          {products.map(p=>(
            <div key={p.id} onClick={()=>setEditProduct({...p})} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, overflow:"hidden", cursor:"pointer", transition:"border-color 0.15s" }}
              onMouseEnter={e=>e.currentTarget.style.borderColor=C.borderMid}
              onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
              {p.image_url
                ? <img src={p.image_url} alt={p.name} style={{ width:"100%", height:120, objectFit:"cover", display:"block" }}/>
                : <div style={{ width:"100%", height:80, background:C.surfaceHigh, display:"flex", alignItems:"center", justifyContent:"center", fontSize:28 }}>{p.emoji}</div>
              }
              <div style={{ padding:"0.875rem" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:3 }}>
                  <p style={{ fontSize:14, fontWeight:600, color:C.text, margin:0, letterSpacing:"-0.01em" }}>{p.name}</p>
                  <span style={{ fontSize:10, color:C.accent, fontWeight:600, background:C.accentBg, padding:"2px 7px", borderRadius:3, flexShrink:0, marginLeft:4 }}>Edit</span>
                </div>
                <p style={{ fontSize:11, color:C.textMuted, margin:"0 0 10px", lineHeight:1.5 }}>{p.desc}</p>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", borderTop:`1px solid ${C.border}`, paddingTop:9 }}>
                  <span style={{ fontSize:16, fontWeight:700, color:C.accent, letterSpacing:"-0.01em" }}>${p.price?.toFixed(2)||"0.00"}</span>
                  <span style={{ fontSize:11, color:p.stock<5?C.danger:C.textMuted, fontWeight:p.stock<5?600:400 }}>
                    {p.stock<5?`⚠ ${p.stock} left`:`${p.stock} in stock`}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* ── EDIT PRODUCT MODAL ── */}
        {editProduct && editForm && (
          <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:200 }}>
            <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:"1.75rem", width:440, maxWidth:"95vw", maxHeight:"90vh", overflowY:"auto" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1rem" }}>
                <h2 style={{ fontSize:18, fontWeight:700, color:C.text, margin:0, letterSpacing:"-0.02em" }}>Edit Product</h2>
                <button onClick={()=>{ setEditProduct(null); setEditForm(null); }} style={{ background:C.surfaceHigh, border:"none", width:28, height:28, borderRadius:4, fontSize:14, cursor:"pointer", color:C.textMuted }}>✕</button>
              </div>
              {editProduct.image_url && (
                <img src={editProduct.image_url} alt={editProduct.name} style={{ width:"100%", height:120, objectFit:"cover", borderRadius:6, marginBottom:14 }}/>
              )}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                <Inp label="Product Name" value={editForm.name}  onChange={v=>setEditForm({...editForm,name:v})}  ph="e.g. Blueberry Scones"/>
                <Inp label="Price ($)"    value={editForm.price} onChange={v=>setEditForm({...editForm,price:v})} ph="16.00"/>
                <Inp label="Stock"        value={editForm.stock} onChange={v=>setEditForm({...editForm,stock:v})} ph="10"/>
                <Inp label="Emoji"        value={editForm.emoji} onChange={v=>setEditForm({...editForm,emoji:v})} ph="🍞"/>
              </div>
              <div style={{ marginBottom:16 }}>
                <label style={{ fontSize:10, fontWeight:600, color:C.textMuted, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.08em" }}>Description</label>
                <textarea value={editForm.desc} onChange={e=>setEditForm({...editForm,desc:e.target.value})} rows={3}
                  style={{ width:"100%", padding:"9px 12px", border:`1px solid ${C.border}`, borderRadius:5, fontSize:13, color:C.text, background:C.surfaceHigh, outline:"none", resize:"none", boxSizing:"border-box" }}/>
              </div>
              <div style={{ display:"flex", gap:8 }}>
                <button onClick={deleteProduct} style={{ padding:"10px 14px", border:`1px solid ${C.danger}`, borderRadius:5, background:C.dangerBg, color:C.danger, cursor:"pointer", fontSize:13, fontWeight:600 }}>Delete</button>
                <button onClick={()=>{ setEditProduct(null); setEditForm(null); }} style={{ flex:1, padding:"10px", border:`1px solid ${C.border}`, borderRadius:5, background:"transparent", color:C.textMuted, cursor:"pointer", fontSize:13 }}>Cancel</button>
                <button onClick={saveEdit} disabled={saving} style={{ flex:2, padding:"10px", background:saving?"rgba(196,98,45,0.4)":C.accent, color:"#FFF", border:"none", borderRadius:5, cursor:saving?"default":"pointer", fontSize:13, fontWeight:700 }}>
                  {saving?"Saving...":"Save Changes"}
                </button>
              </div>
            </div>
          </div>
        )}

        {showModal && (
          <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:200 }}>
            <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:"1.75rem", width:440, maxWidth:"95vw" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.25rem" }}>
                <h2 style={{ fontSize:18, fontWeight:700, color:C.text, margin:0, letterSpacing:"-0.02em" }}>Add Product</h2>
                <button onClick={()=>setShowModal(false)} style={{ background:C.surfaceHigh, border:"none", width:28, height:28, borderRadius:4, fontSize:14, cursor:"pointer", color:C.textMuted }}>✕</button>
              </div>
              {[{ k:"name",label:"Product Name",ph:"e.g. Blueberry Scones"},{k:"price",label:"Price ($)",ph:"16.00"},{k:"emoji",label:"Emoji",ph:"🍞"}].map(f=>(
                <Inp key={f.k} label={f.label} value={form[f.k]} onChange={v=>setForm({...form,[f.k]:v})} ph={f.ph}/>
              ))}
              <Inp label="Stock Available" value={form.stock} onChange={v=>setForm({...form,stock:v})} ph="e.g. 10"/>
              <div style={{ marginBottom:12 }}>
                <label style={{ fontSize:10, fontWeight:600, color:C.textMuted, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.08em" }}>Description</label>
                <textarea value={form.desc} onChange={e=>setForm({...form,desc:e.target.value})} rows={2} placeholder="Brief description..."
                  style={{ width:"100%", padding:"9px 12px", border:`1px solid ${C.border}`, borderRadius:5, fontSize:13, color:C.text, background:C.surfaceHigh, outline:"none", resize:"none", boxSizing:"border-box" }}/>
              </div>
              <div style={{ marginBottom:16 }}>
                <label style={{ fontSize:10, fontWeight:600, color:C.textMuted, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.08em" }}>Product Photo (optional)</label>
                <label style={{ display:"block", border:`2px dashed ${imagePreview?C.accent:C.border}`, borderRadius:6, padding:"1rem", textAlign:"center", cursor:"pointer", background:imagePreview?C.accentBg:C.surfaceHigh, transition:"all 0.2s" }}>
                  <input type="file" accept="image/*" onChange={handleImage} style={{ display:"none" }}/>
                  {imagePreview ? (
                    <div>
                      <img src={imagePreview} alt="preview" style={{ width:"100%", height:120, objectFit:"cover", borderRadius:4, marginBottom:6 }}/>
                      <p style={{ fontSize:11, color:C.accent, margin:0, fontWeight:600 }}>✓ Photo selected — tap to change</p>
                    </div>
                  ) : (
                    <div>
                      <p style={{ fontSize:22, margin:"0 0 4px" }}>📷</p>
                      <p style={{ fontSize:12, color:C.textMuted, margin:0 }}>Tap to upload a photo</p>
                      <p style={{ fontSize:10, color:C.textMuted, margin:"3px 0 0", opacity:0.7 }}>JPG, PNG or WEBP · Max 5MB</p>
                    </div>
                  )}
                </label>
              </div>
              <div style={{ display:"flex", gap:8 }}>
                <button onClick={()=>{ setShowModal(false); setImageFile(null); setImagePreview(null); }} style={{ flex:1, padding:"10px", border:`1px solid ${C.border}`, borderRadius:5, background:"transparent", color:C.textMuted, cursor:"pointer", fontSize:13 }}>Cancel</button>
                <button onClick={add} disabled={uploading} style={{ flex:2, padding:"10px", background:uploading?"rgba(196,98,45,0.4)":C.accent, color:"#FFF", border:"none", borderRadius:5, cursor:uploading?"default":"pointer", fontSize:13, fontWeight:700 }}>
                  {uploading?"Uploading...":"Add Product"}
                </button>
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
    const totalRev    = REV_DATA.reduce((s,d)=>s+d.revenue,0);
    const totalExp    = REV_DATA.reduce((s,d)=>s+d.expenses,0);
    const totalProfit = totalRev-totalExp;
    const margin      = ((totalProfit/totalRev)*100).toFixed(1);
    const expenses    = [
      { label:"Ingredients", pct:45, amount:186.75, color:C.accent   },
      { label:"Packaging",   pct:20, amount:83.00,  color:C.warning  },
      { label:"Delivery",    pct:25, amount:103.75, color:C.info     },
      { label:"Equipment",   pct:10, amount:41.50,  color:C.success  },
    ];
    return (
      <div style={{ padding:"2rem" }}>
        <h1 style={{ fontSize:24, fontWeight:700, color:C.text, margin:"0 0 1.5rem", letterSpacing:"-0.02em" }}>Finances</h1>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,minmax(0,1fr))", gap:10, marginBottom:"1.5rem" }}>
          <KPI label="Total Revenue"  value={`$${totalRev.toLocaleString()}`}    sub="6 months" color={C.accent}/>
          <KPI label="Total Expenses" value={`$${totalExp.toLocaleString()}`}    sub="6 months" color={C.warning}/>
          <KPI label="Net Profit"     value={`$${totalProfit.toLocaleString()}`} sub="6 months" color={C.success}/>
          <KPI label="Profit Margin"  value={`${margin}%`}                       sub="Avg: 62%" color={parseFloat(margin)>=62?C.success:C.warning}/>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:12, marginBottom:"1.5rem" }}>
          <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:"1.25rem" }}>
            <p style={{ fontWeight:600, fontSize:13, color:C.text, margin:"0 0 1rem" }}>Monthly Profit</p>
            <ResponsiveContainer width="100%" height={210}>
              <BarChart data={REV_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border}/>
                <XAxis dataKey="month" tick={{ fontSize:11, fill:C.textMuted }} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fontSize:11, fill:C.textMuted }} axisLine={false} tickLine={false}/>
                <Tooltip contentStyle={{ background:C.surfaceTop, border:`1px solid ${C.border}`, borderRadius:5, fontSize:12, color:C.text }}/>
                <Bar dataKey="profit" fill={C.accent} radius={[3,3,0,0]} name="Profit ($)"/>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:"1.25rem" }}>
            <p style={{ fontWeight:600, fontSize:13, color:C.text, margin:"0 0 1rem" }}>This Month's Costs</p>
            {expenses.map(e=>(
              <div key={e.label} style={{ marginBottom:12 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                  <span style={{ fontSize:12, color:C.textSub, fontWeight:500 }}>{e.label}</span>
                  <span style={{ fontSize:11, color:C.textMuted }}>{e.pct}%</span>
                </div>
                <div style={{ height:4, background:C.surfaceHigh, borderRadius:2 }}>
                  <div style={{ height:4, width:`${e.pct}%`, background:e.color, borderRadius:2 }}/>
                </div>
              </div>
            ))}
            <div style={{ marginTop:12, paddingTop:12, borderTop:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between" }}>
              <span style={{ fontSize:12, fontWeight:600, color:C.text }}>Total</span>
              <span style={{ fontSize:12, fontWeight:700, color:C.accent }}>$415.00</span>
            </div>
          </div>
        </div>
        <div style={{ background:"rgba(245,158,11,0.06)", border:`1px solid rgba(245,158,11,0.2)`, borderRadius:7, padding:"1rem 1.25rem" }}>
          <p style={{ fontWeight:700, fontSize:12, color:C.warning, margin:"0 0 5px", textTransform:"uppercase", letterSpacing:"0.06em" }}>Insight</p>
          <p style={{ fontSize:13, color:C.textSub, margin:0, lineHeight:1.7 }}>Ingredient costs at 45% are above the 35–40% optimal range. Buying wholesale could save ~$40/month. A $1–2 price increase on bread would bring your margin above 70%.</p>
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
          method:"POST",
          headers:{
            "Content-Type":"application/json",
            "x-api-key": process.env.REACT_APP_ANTHROPIC_KEY || "",
            "anthropic-version":"2023-06-01",
            "anthropic-dangerous-direct-browser-access":"true",
          },
          body:JSON.stringify({
            model:"claude-opus-4-6",
            max_tokens:1024,
            messages:[{
              role:"user",
              content:`You are a marketing copywriter for artisanal home-baked goods sold locally. Be warm, specific, and mouth-watering.

Product: ${name}
Details: ${details||"Home-baked with love, using quality ingredients"}

Return ONLY a valid JSON object with no markdown fences, no extra text, no explanation:
{"tagline":"A punchy 5-8 word tagline","description":"A 2-3 sentence storefront description that highlights texture, flavour, and what makes it special","instagram":"An Instagram caption under 150 characters with 3-5 relevant hashtags and an emoji","whatsapp":"A short WhatsApp broadcast message under 100 characters, conversational and enticing"}`
            }]
          })
        });
        if (!res.ok) {
          const errData = await res.json();
          setError(`API error: ${errData?.error?.message||res.status}`);
          setLoading(false); return;
        }
        const data = await res.json();
        const text = (data.content||[]).map(c=>c.text||"").join("").trim();
        const jsonStr = text.replace(/^```json\s*/,"").replace(/^```\s*/,"").replace(/\s*```$/,"").trim();
        setResult(JSON.parse(jsonStr));
      } catch(e) {
        setError("Could not generate copy. Check your connection and try again.");
        console.error(e);
      }
      setLoading(false);
    };
    const copy = (text,key) => { navigator.clipboard.writeText(text).then(()=>{ setCopied(key); setTimeout(()=>setCopied(""),2000); }); };
    return (
      <div style={{ padding:"2rem", maxWidth:600 }}>
        <div style={{ marginBottom:"1.5rem" }}>
          <h1 style={{ fontSize:24, fontWeight:700, color:C.text, margin:"0 0 4px", letterSpacing:"-0.02em" }}>AI Marketing</h1>
          <p style={{ color:C.textMuted, fontSize:13, margin:0 }}>Generate product copy and social captions powered by Claude</p>
        </div>
        <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:"1.25rem", marginBottom:"1rem" }}>
          <div style={{ display:"flex", gap:7, flexWrap:"wrap", marginBottom:"1.25rem" }}>
            {products.slice(0,4).map(p=>(
              <button key={p.id} onClick={()=>{ setName(p.name); setDetails(p.desc); }} style={{ padding:"5px 12px", border:`1px solid ${C.border}`, borderRadius:4, background:"transparent", fontSize:12, cursor:"pointer", color:C.textSub, display:"flex", alignItems:"center", gap:5 }}>
                <span>{p.emoji}</span>{p.name}
              </button>
            ))}
          </div>
          <Inp label="Product Name" value={name} onChange={setName} ph="e.g. Blueberry Scones"/>
          <div style={{ marginBottom:16 }}>
            <label style={{ fontSize:10, fontWeight:600, color:C.textMuted, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.08em" }}>Key Details</label>
            <textarea value={details} onChange={e=>setDetails(e.target.value)} rows={3} placeholder="Ingredients, textures, what makes it special..."
              style={{ width:"100%", padding:"10px 12px", border:`1px solid ${C.border}`, borderRadius:5, fontSize:13, color:C.text, background:C.surfaceHigh, outline:"none", resize:"none", boxSizing:"border-box", lineHeight:1.6 }}/>
          </div>
          <button onClick={generate} disabled={!name.trim()||loading} style={{ background:name.trim()?C.accent:"rgba(255,255,255,0.06)", color:name.trim()?"#000":C.textMuted, border:"none", borderRadius:5, padding:"10px 20px", fontSize:13, fontWeight:700, cursor:name.trim()?"pointer":"default" }}>
            {loading?"Generating...":"✦ Generate Copy"}
          </button>
        </div>
        {error && <div style={{ background:C.dangerBg, border:`1px solid rgba(239,68,68,0.2)`, borderRadius:6, padding:"10px 14px", marginBottom:12, fontSize:13, color:C.danger }}>{error}</div>}
        {result && (
          <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, overflow:"hidden" }}>
            <div style={{ background:C.accentBg, borderBottom:`1px solid ${C.border}`, padding:"1rem 1.25rem" }}>
              <p style={{ fontSize:18, fontWeight:700, color:C.accent, margin:0, letterSpacing:"-0.01em" }}>"{result.tagline}"</p>
            </div>
            <div style={{ padding:"1rem 1.25rem" }}>
              {[{ key:"description",label:"Storefront",icon:"🏪"},{key:"instagram",label:"Instagram",icon:"📸"},{key:"whatsapp",label:"WhatsApp",icon:"💬"}].map(item=>(
                <div key={item.key} style={{ marginBottom:"1rem", paddingBottom:"1rem", borderBottom:`1px solid ${C.border}` }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                    <p style={{ fontSize:10, fontWeight:700, color:C.textMuted, textTransform:"uppercase", letterSpacing:"0.08em", margin:0 }}>{item.icon} {item.label}</p>
                    <button onClick={()=>copy(result[item.key],item.key)} style={{ background:C.surfaceHigh, border:`1px solid ${C.border}`, borderRadius:3, padding:"3px 10px", fontSize:10, cursor:"pointer", color:C.textMuted, fontWeight:600 }}>
                      {copied===item.key?"✓ Copied":"Copy"}
                    </button>
                  </div>
                  <p style={{ fontSize:13, color:C.textSub, margin:0, lineHeight:1.7, background:C.surfaceHigh, padding:"9px 12px", borderRadius:4 }}>{result[item.key]}</p>
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
    return (
      <div style={{ padding:"2rem", maxWidth:600 }}>
        <h1 style={{ fontSize:24, fontWeight:700, color:C.text, margin:"0 0 1.5rem", letterSpacing:"-0.02em" }}>Delivery Settings</h1>
        <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:"1.25rem", marginBottom:12 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:pickup.enabled?"1rem":0 }}>
            <div>
              <p style={{ fontWeight:600, fontSize:14, color:C.text, margin:"0 0 2px" }}>Pickup</p>
              <p style={{ fontSize:12, color:C.textMuted, margin:0 }}>Customers collect from your home</p>
            </div>
            <Toggle val={pickup.enabled} onChange={()=>setPickup(p=>({...p,enabled:!p.enabled}))}/>
          </div>
          {pickup.enabled && <>
            <Inp label="Pickup Address" value={pickup.address} onChange={v=>setPickup(p=>({...p,address:v}))} ph="Your address"/>
            <div>
              <label style={{ fontSize:10, fontWeight:600, color:C.textMuted, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.08em" }}>Instructions</label>
              <textarea value={pickup.instructions} onChange={e=>setPickup(p=>({...p,instructions:e.target.value}))} rows={2}
                style={{ width:"100%", padding:"9px 12px", border:`1px solid ${C.border}`, borderRadius:5, fontSize:13, color:C.text, background:C.surfaceHigh, outline:"none", resize:"none", boxSizing:"border-box" }}/>
            </div>
          </>}
        </div>
        <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:"1.25rem", marginBottom:12 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:del.enabled?"1rem":0 }}>
            <div>
              <p style={{ fontWeight:600, fontSize:14, color:C.text, margin:"0 0 2px" }}>Home Delivery</p>
              <p style={{ fontSize:12, color:C.textMuted, margin:0 }}>You deliver to customers</p>
            </div>
            <Toggle val={del.enabled} onChange={()=>setDel(p=>({...p,enabled:!p.enabled}))}/>
          </div>
          {del.enabled && (
            <div style={{ display:"flex", gap:10 }}>
              <Inp label="Fee ($)"     value={del.fee}      onChange={v=>setDel(p=>({...p,fee:v}))}      ph="5.00"/>
              <Inp label="Min ($)"     value={del.minOrder} onChange={v=>setDel(p=>({...p,minOrder:v}))} ph="20.00"/>
              <Inp label="Radius (km)" value={del.radius}   onChange={v=>setDel(p=>({...p,radius:v}))}   ph="10"/>
            </div>
          )}
        </div>
        <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:"1.25rem", marginBottom:"1.5rem" }}>
          <p style={{ fontWeight:600, fontSize:13, color:C.text, margin:"0 0 1rem" }}>Schedule</p>
          <div style={{ display:"flex", gap:7, marginBottom:"1rem" }}>
            {DAY_LABELS.map(([key,label])=>(
              <button key={key} onClick={()=>setDays(p=>({...p,[key]:!p[key]}))} style={{ width:40, height:36, borderRadius:4, border:`1px solid ${days[key]?C.accent:C.border}`, background:days[key]?C.accentBg:"transparent", color:days[key]?C.accent:C.textMuted, fontSize:11, fontWeight:600, cursor:"pointer" }}>{label}</button>
            ))}
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <Inp label="Cutoff Time" value={del.cutoff} onChange={v=>setDel(p=>({...p,cutoff:v}))} ph="17:00"/>
            <div style={{ flex:1, marginBottom:12 }}>
              <label style={{ fontSize:10, fontWeight:600, color:C.textMuted, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.08em" }}>Lead Time</label>
              <select value={del.lead} onChange={e=>setDel(p=>({...p,lead:e.target.value}))}
                style={{ width:"100%", padding:"9px 12px", border:`1px solid ${C.border}`, borderRadius:5, fontSize:13, color:C.text, background:C.surfaceHigh, outline:"none" }}>
                <option value="0">Same day</option><option value="1">1 day</option><option value="2">2 days</option>
              </select>
            </div>
          </div>
        </div>
        <button onClick={save} style={{ background:saved?"rgba(34,197,94,0.15)":C.accent, color:saved?C.success:"#000", border:`1px solid ${saved?C.success:"transparent"}`, borderRadius:5, padding:"11px 24px", fontSize:13, fontWeight:700, cursor:"pointer", transition:"all 0.2s" }}>
          {saved?"✓ Settings Saved":"Save Settings"}
        </button>
      </div>
    );
  };

  // ── STORE PROFILE ──
  const StoreProfile = () => {
    const [profile, setProfile] = useState({
      business: user.business||"",
      desc: user.storeDesc||"",
      hood: user.hood||"Lessieville",
      whatsapp: user.whatsapp||"",
      instagram: user.instagram||"",
    });
    const [logoFile,    setLogoFile]    = useState(null);
    const [logoPreview, setLogoPreview] = useState(user.logoUrl||null);
    const [saving,      setSaving]      = useState(false);
    const [saved,       setSaved]       = useState(false);

    const handleLogo = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    };

    const save = async () => {
      setSaving(true);
      let logoUrl = logoPreview;
      if (logoFile) {
        const ext = logoFile.name.split(".").pop();
        const path = `logos/${user.id}.${ext}`;
        const { error:upErr } = await supabase.storage.from("product-images").upload(path, logoFile, { upsert:true });
        if (!upErr) {
          const { data:urlData } = supabase.storage.from("product-images").getPublicUrl(path);
          logoUrl = urlData.publicUrl;
        }
      }
      await supabase.from("profiles").update({
        business: profile.business,
        desc: profile.desc,
        hood: profile.hood,
        logo_url: logoUrl,
        whatsapp: profile.whatsapp,
        instagram: profile.instagram,
      }).eq("id", user.id);
      setSaving(false); setSaved(true); setTimeout(()=>setSaved(false),2500);
    };

    const F = ({ label, value, onChange, ph }) => (
      <div style={{ marginBottom:14 }}>
        <label style={{ fontSize:10, fontWeight:600, color:C.textMuted, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.08em" }}>{label}</label>
        <input value={value} onChange={e=>onChange(e.target.value)} placeholder={ph}
          style={{ width:"100%", padding:"10px 12px", border:`1px solid ${C.border}`, borderRadius:5, fontSize:13, color:C.text, background:C.surfaceHigh, outline:"none", boxSizing:"border-box" }}
          onFocus={e=>e.target.style.borderColor=C.accent} onBlur={e=>e.target.style.borderColor=C.border}/>
      </div>
    );

    return (
      <div style={{ padding:"2rem", maxWidth:600 }}>
        <div style={{ marginBottom:"1.5rem" }}>
          <h1 style={{ fontSize:24, fontWeight:700, color:C.text, margin:"0 0 4px", letterSpacing:"-0.02em" }}>Store Profile</h1>
          <p style={{ color:C.textMuted, fontSize:13, margin:0 }}>Customize how your store appears to customers</p>
        </div>

        {/* Logo upload */}
        <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:"1.25rem", marginBottom:14 }}>
          <p style={{ fontSize:11, fontWeight:700, color:C.textMuted, textTransform:"uppercase", letterSpacing:"0.08em", margin:"0 0 12px" }}>Store Logo</p>
          <div style={{ display:"flex", alignItems:"center", gap:16 }}>
            <div style={{ width:80, height:80, borderRadius:14, background:C.surfaceHigh, border:`2px dashed ${logoPreview?C.accent:C.border}`, overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              {logoPreview
                ? <img src={logoPreview} alt="logo" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                : <span style={{ fontSize:11, color:C.textMuted, textAlign:"center", padding:"0 6px" }}>No logo yet</span>
              }
            </div>
            <div style={{ flex:1 }}>
              <p style={{ fontSize:13, fontWeight:600, color:C.text, margin:"0 0 4px" }}>
                {logoPreview?"Logo uploaded ✓":"No logo uploaded yet"}
              </p>
              <p style={{ fontSize:12, color:C.textMuted, margin:"0 0 10px" }}>
                Your logo appears on your store page and in the marketplace. Square images work best.
              </p>
              <div style={{ display:"flex", gap:8 }}>
                <label style={{ display:"inline-block", background:C.accent, color:"#FFF", borderRadius:5, padding:"9px 16px", fontSize:12, fontWeight:700, cursor:"pointer" }}>
                  <input type="file" accept="image/*" onChange={handleLogo} style={{ display:"none" }}/>
                  {logoPreview?"Change Logo":"Upload Logo"}
                </label>
                {logoPreview && (
                  <button onClick={()=>setLogoPreview(null)} style={{ background:"transparent", border:`1px solid ${C.border}`, borderRadius:5, padding:"9px 14px", fontSize:12, color:C.textMuted, cursor:"pointer" }}>
                    Remove
                  </button>
                )}
              </div>
              <p style={{ fontSize:11, color:C.textMuted, margin:"6px 0 0", opacity:0.7 }}>JPG, PNG or WEBP · Recommended 400×400px · Max 5MB</p>
            </div>
          </div>
        </div>

        {/* Store details */}
        <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:"1.25rem", marginBottom:14 }}>
          <p style={{ fontSize:11, fontWeight:700, color:C.textMuted, textTransform:"uppercase", letterSpacing:"0.08em", margin:"0 0 12px" }}>Store Details</p>
          <F label="Bakery Name" value={profile.business} onChange={v=>setProfile({...profile,business:v})} ph="Maria's Home Bakery"/>
          <div style={{ marginBottom:14 }}>
            <label style={{ fontSize:10, fontWeight:600, color:C.textMuted, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.08em" }}>Store Description</label>
            <textarea value={profile.desc} onChange={e=>setProfile({...profile,desc:e.target.value})} rows={3} placeholder="Tell customers what makes your bakery special..."
              style={{ width:"100%", padding:"10px 12px", border:`1px solid ${C.border}`, borderRadius:5, fontSize:13, color:C.text, background:C.surfaceHigh, outline:"none", resize:"none", boxSizing:"border-box" }}/>
          </div>
          <div style={{ marginBottom:0 }}>
            <label style={{ fontSize:10, fontWeight:600, color:C.textMuted, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.08em" }}>Neighbourhood</label>
            <select value={profile.hood} onChange={e=>setProfile({...profile,hood:e.target.value})}
              style={{ width:"100%", padding:"10px 12px", border:`1px solid ${C.border}`, borderRadius:5, fontSize:13, color:C.text, background:C.surfaceHigh, outline:"none" }}>
              {HOODS.filter(h=>h!=="All").map(h=><option key={h} value={h}>{h}</option>)}
            </select>
          </div>
        </div>

        {/* Social links */}
        <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:"1.25rem", marginBottom:14 }}>
          <p style={{ fontSize:11, fontWeight:700, color:C.textMuted, textTransform:"uppercase", letterSpacing:"0.08em", margin:"0 0 12px" }}>Social & Contact</p>
          <F label="Instagram Handle" value={profile.instagram} onChange={v=>setProfile({...profile,instagram:v})} ph="@mariashomebakery"/>
          <F label="WhatsApp Number"  value={profile.whatsapp}  onChange={v=>setProfile({...profile,whatsapp:v})}  ph="+1 (416) 555-0100"/>
        </div>

        {/* Store link preview */}
        <div style={{ background:C.accentBg, border:`1px solid ${C.accentBorder}`, borderRadius:8, padding:"1rem 1.25rem", marginBottom:"1.5rem" }}>
          <p style={{ fontSize:11, fontWeight:700, color:C.accent, margin:"0 0 4px" }}>Your store link</p>
          <p style={{ fontSize:13, color:C.textSub, margin:"0 0 8px" }}>Share this with customers so they can find your store directly:</p>
          <div style={{ background:C.surface, borderRadius:5, padding:"8px 12px", fontSize:12, color:C.text, fontFamily:"monospace" }}>
            hearthside.app/store/{user.id?.slice(0,8)||"your-id"}
          </div>
        </div>

        <button onClick={save} disabled={saving} style={{ background:saved?C.success:C.accent, color:"#FFF", border:"none", borderRadius:5, padding:"11px 24px", fontSize:13, fontWeight:700, cursor:"pointer", transition:"background 0.2s" }}>
          {saving?"Saving...":saved?"✓ Profile Saved!":"Save Profile"}
        </button>
      </div>
    );
  };

  return (
    <div style={{ display:"flex", height:"100vh", fontFamily:"'DM Sans', system-ui, sans-serif", background:C.bg, overflow:"hidden" }}>
      <Sidebar/>
      <main style={{ flex:1, overflowY:"auto" }}>
        {view==="dashboard"  && <Dashboard/>}
        {view==="storefront" && <Storefront/>}
        {view==="orders"     && <Orders/>}
        {view==="finances"   && <Finances/>}
        {view==="delivery"   && <Delivery/>}
        {view==="marketing"  && <Marketing/>}
        {view==="community"  && <SellerCommunity/>}
        {view==="profile"    && <StoreProfile/>}
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
