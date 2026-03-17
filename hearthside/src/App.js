import { useState, useEffect } from "react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { createClient } from '@supabase/supabase-js'  //

const supabase = createClient('https://kxajjlrjgrabtmyksqrq.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4YWpqbHJqZ3JhYnRteWtzcXJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3NjIyMzMsImV4cCI6MjA4OTMzODIzM30.UCUOnwpyP4oBJyHhaCEM4kym_UlDY32a2SWP3x8atQU')

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
};
const tt = { fontFamily:"'Playfair Display', Georgia, serif" };

const INIT_PRODUCTS = [
  { id:1, name:"Sourdough Loaf",       price:12, cat:"Bread",  emoji:"🍞", sold:45, stock:8,  desc:"Tangy slow-fermented sourdough with a golden crackling crust." },
  { id:2, name:"Chocolate Brownies",   price:18, cat:"Pastry", emoji:"🍫", sold:62, stock:12, desc:"Dense, fudgy brownies made with 70% dark chocolate and sea salt." },
  { id:3, name:"Cinnamon Rolls (6pc)", price:22, cat:"Pastry", emoji:"🌀", sold:38, stock:6,  desc:"Soft pillowy rolls filled with cinnamon butter & cream cheese frosting." },
  { id:4, name:"Lemon Drizzle Cake",   price:28, cat:"Cake",   emoji:"🍋", sold:29, stock:4,  desc:"Moist lemon sponge soaked in a sharp, citrusy drizzle glaze." },
  { id:5, name:"Banana Walnut Bread",  price:14, cat:"Bread",  emoji:"🍌", sold:51, stock:10, desc:"Classic banana bread loaded with toasted walnuts and warm spice." },
  { id:6, name:"Red Velvet Cupcakes",  price:24, cat:"Cake",   emoji:"🧁", sold:33, stock:15, desc:"Velvety cupcakes with tangy cream cheese frosting and cocoa notes." },
];
const ORDERS = [
  { id:"#1042", customer:"Sarah M.",  items:"Sourdough x2, Brownies x1",          total:42, status:"delivered", date:"Mar 15" },
  { id:"#1041", customer:"James P.",  items:"Cinnamon Rolls x1",                  total:22, status:"ready",     date:"Mar 15" },
  { id:"#1040", customer:"Aisha K.",  items:"Lemon Drizzle x1, Banana Bread x1",  total:42, status:"preparing", date:"Mar 14" },
  { id:"#1039", customer:"Tom R.",    items:"Red Velvet x2, Brownies x1",         total:66, status:"delivered", date:"Mar 14" },
  { id:"#1038", customer:"Lisa H.",   items:"Sourdough x3",                       total:36, status:"delivered", date:"Mar 13" },
  { id:"#1037", customer:"Carlos E.", items:"Cinnamon Rolls x2, Banana Bread x1", total:58, status:"cancelled", date:"Mar 13" },
];
const REV_DATA = [
  { month:"Oct", revenue:420,  expenses:180, profit:240 },
  { month:"Nov", revenue:680,  expenses:215, profit:465 },
  { month:"Dec", revenue:1240, expenses:385, profit:855 },
  { month:"Jan", revenue:890,  expenses:295, profit:595 },
  { month:"Feb", revenue:1050, expenses:325, profit:725 },
  { month:"Mar", revenue:1380, expenses:415, profit:965 },
];
const STATUS_MAP = {
  delivered:{ bg:"#E9F7EF", color:"#1E7A48", label:"✓ Delivered" },
  ready:    { bg:"#E6F3FA", color:"#1A6B9C", label:"◉ Ready"     },
  preparing:{ bg:"#FFF7E0", color:"#A07010", label:"◌ Preparing" },
  cancelled:{ bg:"#FDEAEA", color:"#B52020", label:"✕ Cancelled" },
};
const NAV = [
  { id:"dashboard",  icon:"⊞", label:"Dashboard"    },
  { id:"storefront", icon:"⊡", label:"Storefront"   },
  { id:"orders",     icon:"⊟", label:"Orders"       },
  { id:"finances",   icon:"◈", label:"Finances"     },
  { id:"delivery",   icon:"⊕", label:"Delivery"     },
  { id:"marketing",  icon:"✦", label:"AI Marketing" },
];
const TIME_SLOTS = [
  { value:"next-day-am",  label:"Tomorrow, 9am–12pm"   },
  { value:"next-day-pm",  label:"Tomorrow, 12pm–5pm"   },
  { value:"twoday-am",    label:"In 2 days, 9am–12pm"  },
  { value:"twoday-pm",    label:"In 2 days, 12pm–5pm"  },
];

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

// ──────────────────────────────────────────────────────────────────────────────
// AUTH SCREEN
// ──────────────────────────────────────────────────────────────────────────────
function AuthInput({ label, ph, type="text", value, onChange, onEnter }) {
  return (
    <div style={{ marginBottom:13 }}>
      <label style={{ fontSize:11, fontWeight:600, color:C.muted, display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.06em" }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={ph}
        onKeyDown={e=>e.key==="Enter"&&onEnter()}
        style={{ width:"100%", padding:"10px 12px", border:`1px solid ${C.border}`, borderRadius:8, fontSize:13, color:C.text, background:C.bg, outline:"none", boxSizing:"border-box" }}/>
    </div>
  );
}

function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ email:"", password:"", name:"", business:"" });
  const [err,  setErr]  = useState("");

  const submit = async () => {
    if (!form.email || !form.password) { setErr("Please fill in all required fields."); return; }
    setErr("");
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({ email:form.email, password:form.password });
      if (error) { setErr(error.message); return; }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email:form.email, password:form.password });
      if (error) { setErr(error.message); return; }
    }
    onAuth({ name:form.name, email:form.email, business:form.business });
  };

  return (
    <div style={{ minHeight:"100vh", background:C.sidebar, display:"flex", alignItems:"center", justifyContent:"center", padding:"2rem", fontFamily:"'Outfit', sans-serif" }}>
      <div style={{ background:C.surface, borderRadius:20, padding:"2.5rem", width:400, maxWidth:"100%" }}>
        <div style={{ textAlign:"center", marginBottom:"2rem" }}>
          <div style={{ fontSize:44, marginBottom:8 }}>🍞</div>
          <h1 style={{ ...tt, fontSize:26, color:C.text, margin:"0 0 5px" }}>Hearthside</h1>
          <p style={{ color:C.muted, fontSize:13, margin:0 }}>Your home bakery business platform</p>
        </div>
        <div style={{ display:"flex", background:C.bg, borderRadius:10, padding:3, marginBottom:"1.5rem" }}>
          {["login","signup"].map(m=>(
            <button key={m} onClick={()=>{ setMode(m); setErr(""); }} style={{
              flex:1, padding:"8px", border:"none", borderRadius:8, cursor:"pointer", fontSize:13, fontWeight:500,
              background:mode===m?C.surface:"transparent", color:mode===m?C.text:C.muted,
              boxShadow:mode===m?"0 1px 3px rgba(0,0,0,0.08)":"none"
            }}>{m==="login"?"Sign In":"Create Account"}</button>
          ))}
        </div>
        {mode==="signup" && <AuthInput label="Full Name *"    ph="e.g. Maria Santos"        value={form.name}     onChange={e=>setForm({...form,name:e.target.value})}     onEnter={submit}/>}
        {mode==="signup" && <AuthInput label="Bakery Name"    ph="e.g. Maria's Home Bakery" value={form.business} onChange={e=>setForm({...form,business:e.target.value})} onEnter={submit}/>}
        <AuthInput label="Email *"    ph="your@email.com" type="email"     value={form.email}    onChange={e=>setForm({...form,email:e.target.value})}    onEnter={submit}/>
        <AuthInput label="Password *" ph="••••••••"        type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} onEnter={submit}/>
        {err && <p style={{ color:C.danger, fontSize:12, margin:"0 0 12px" }}>{err}</p>}
        <button onClick={submit} style={{ width:"100%", padding:"12px", background:C.primary, color:"#FFF", border:"none", borderRadius:10, fontSize:14, fontWeight:700, cursor:"pointer", marginBottom:"1rem" }}>
          {mode==="login"?"Sign In →":"Start Free Trial →"}
        </button>
        <div style={{ background:C.primaryBg, borderRadius:8, padding:"10px 12px", textAlign:"center" }}>
          <p style={{ fontSize:12, color:C.muted, margin:0 }}>Demo: enter any email &amp; password to continue</p>
        </div>
        <p style={{ textAlign:"center", fontSize:12, color:C.muted, margin:"1rem 0 0" }}>
          {mode==="login"?"New here? ":"Already have an account? "}
          <span onClick={()=>{ setMode(mode==="login"?"signup":"login"); setErr(""); }} style={{ color:C.primary, cursor:"pointer", fontWeight:600 }}>
            {mode==="login"?"Create free account":"Sign in"}
          </span>
        </p>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// CUSTOMER STOREFRONT
// ──────────────────────────────────────────────────────────────────────────────
function CustomerStorefront({ products, seller, onBack }) {
  const [cart, setCart]   = useState({});
  const [step, setStep]   = useState("shop");
  const [del,  setDel]    = useState({ type:"delivery", address:"", time:"next-day-am", name:"", phone:"" });
  const [pay,  setPay]    = useState({ holder:"", card:"", expiry:"", cvv:"" });
  const [proc, setProc]   = useState(false);
  const [orderNum]        = useState(`#${Math.floor(1000+Math.random()*9000)}`);

  const cartItems = products.filter(p=>cart[p.id]).map(p=>({...p, qty:cart[p.id]}));
  const subtotal  = cartItems.reduce((s,p)=>s+p.price*p.qty, 0);
  const fee       = del.type==="delivery"?5:0;
  const total     = subtotal+fee;
  const count     = Object.values(cart).reduce((s,q)=>s+q, 0);

  const add = id => setCart(p=>({...p,[id]:(p[id]||0)+1}));
  const dec = id => setCart(p=>{ const n={...p}; n[id]>1?n[id]--:delete n[id]; return n; });

  const placeOrder = async () => {
    setProc(true);
    await new Promise(r=>setTimeout(r,1600));
    setProc(false); setStep("confirmed");
  };

  const Hdr = () => (
    <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:"1rem 2rem", display:"flex", justifyContent:"space-between", alignItems:"center", position:"sticky", top:0, zIndex:10 }}>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <span style={{ fontSize:22 }}>🍞</span>
        <div>
          <p style={{ ...tt, fontSize:16, color:C.text, margin:0, fontWeight:600 }}>{seller?.business||"Home Bakery"}</p>
          <p style={{ fontSize:11, color:C.muted, margin:0 }}>Fresh home-baked · Local delivery</p>
        </div>
      </div>
      <div style={{ display:"flex", gap:9 }}>
        {count>0 && step==="shop" && (
          <button onClick={()=>setStep("checkout")} style={{ display:"flex", alignItems:"center", gap:7, background:C.primary, color:"#FFF", border:"none", borderRadius:8, padding:"8px 14px", fontSize:13, fontWeight:600, cursor:"pointer" }}>
            🛒 Cart ({count}) · ${total.toFixed(2)}
          </button>
        )}
        <button onClick={onBack} style={{ background:"transparent", border:`1px solid ${C.border}`, borderRadius:8, padding:"7px 13px", fontSize:12, color:C.muted, cursor:"pointer" }}>← Dashboard</button>
      </div>
    </div>
  );

  if (step==="shop") return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"'Outfit', sans-serif" }}>
      <Hdr/>
      <div style={{ background:`linear-gradient(135deg,${C.primaryBg},#FFF8F2)`, padding:"2.5rem 2rem", textAlign:"center", borderBottom:`1px solid ${C.border}` }}>
        <p style={{ ...tt, fontSize:30, color:C.primary, margin:"0 0 8px", fontStyle:"italic" }}>Baked With Love, Delivered To You</p>
        <p style={{ fontSize:13, color:C.muted, margin:"0 0 1rem" }}>All items made fresh to order. Order by 5PM for next-day delivery.</p>
        <div style={{ display:"inline-flex", gap:20, fontSize:12, color:C.muted }}>
          <span>🚗 Delivery from $5.00</span><span>🏠 Free pickup</span><span>⏱ Fresh within 24hrs</span>
        </div>
      </div>
      <div style={{ padding:"2rem", maxWidth:960, margin:"0 auto" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,minmax(0,1fr))", gap:14 }}>
          {products.map(p=>(
            <div key={p.id} style={{ background:C.surface, border:`0.5px solid ${C.border}`, borderRadius:14, padding:"1.25rem" }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
                <span style={{ fontSize:38, lineHeight:1 }}>{p.emoji}</span>
                <span style={{ background:C.primaryBg, color:C.primary, fontSize:11, fontWeight:600, padding:"3px 9px", borderRadius:20 }}>{p.cat}</span>
              </div>
              <p style={{ ...tt, fontSize:15, fontWeight:600, color:C.text, margin:"0 0 5px" }}>{p.name}</p>
              <p style={{ fontSize:12, color:C.muted, margin:"0 0 14px", lineHeight:1.55 }}>{p.desc}</p>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", borderTop:`0.5px solid ${C.border}`, paddingTop:10 }}>
                <span style={{ ...tt, fontSize:18, fontWeight:700, color:C.primary }}>${p.price.toFixed(2)}</span>
                {cart[p.id] ? (
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <button onClick={()=>dec(p.id)} style={{ width:28, height:28, border:`1px solid ${C.border}`, borderRadius:6, background:"transparent", cursor:"pointer", fontSize:16, color:C.text }}>−</button>
                    <span style={{ fontSize:14, fontWeight:600, color:C.text, minWidth:16, textAlign:"center" }}>{cart[p.id]}</span>
                    <button onClick={()=>add(p.id)} style={{ width:28, height:28, border:"none", borderRadius:6, background:C.primary, cursor:"pointer", fontSize:16, color:"#FFF" }}>+</button>
                  </div>
                ) : (
                  <button onClick={()=>add(p.id)} style={{ background:C.primary, color:"#FFF", border:"none", borderRadius:8, padding:"6px 14px", fontSize:12, fontWeight:600, cursor:"pointer" }}>Add to Cart</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (step==="checkout") return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"'Outfit', sans-serif" }}>
      <Hdr/>
      <div style={{ maxWidth:880, margin:"0 auto", padding:"2rem", display:"grid", gridTemplateColumns:"1fr 310px", gap:20 }}>
        <div>
          {/* Cart review */}
          <div style={{ background:C.surface, border:`0.5px solid ${C.border}`, borderRadius:12, padding:"1.25rem", marginBottom:14 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1rem" }}>
              <p style={{ fontWeight:600, fontSize:14, color:C.text, margin:0 }}>Your Order</p>
              <button onClick={()=>setStep("shop")} style={{ background:"transparent", border:"none", fontSize:12, color:C.primary, cursor:"pointer", fontWeight:600 }}>← Edit Cart</button>
            </div>
            {cartItems.map(p=>(
              <div key={p.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"9px 0", borderBottom:`0.5px solid ${C.border}` }}>
                <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                  <span style={{ fontSize:22 }}>{p.emoji}</span>
                  <div>
                    <p style={{ fontSize:13, color:C.text, fontWeight:500, margin:0 }}>{p.name}</p>
                    <p style={{ fontSize:11, color:C.muted, margin:0 }}>Qty: {p.qty}</p>
                  </div>
                </div>
                <span style={{ fontSize:13, fontWeight:600, color:C.text }}>${(p.price*p.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>

          {/* Delivery choice */}
          <div style={{ background:C.surface, border:`0.5px solid ${C.border}`, borderRadius:12, padding:"1.25rem", marginBottom:14 }}>
            <p style={{ fontWeight:600, fontSize:14, color:C.text, margin:"0 0 1rem" }}>Delivery Option</p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:"1rem" }}>
              {[{ v:"delivery", icon:"🚗", label:"Home Delivery", sub:"+ $5.00 fee" },{ v:"pickup", icon:"🏠", label:"Free Pickup", sub:"Collect yourself" }].map(opt=>(
                <button key={opt.v} onClick={()=>setDel(p=>({...p,type:opt.v}))} style={{
                  padding:"12px", border:`2px solid ${del.type===opt.v?C.primary:C.border}`,
                  borderRadius:10, background:del.type===opt.v?C.primaryBg:"transparent", cursor:"pointer", textAlign:"left"
                }}>
                  <p style={{ fontSize:15, margin:"0 0 3px" }}>{opt.icon}</p>
                  <p style={{ fontSize:13, fontWeight:600, color:del.type===opt.v?C.primary:C.text, margin:"0 0 1px" }}>{opt.label}</p>
                  <p style={{ fontSize:11, color:C.muted, margin:0 }}>{opt.sub}</p>
                </button>
              ))}
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 }}>
              {[{ k:"name", label:"Your Name", ph:"Full name" },{ k:"phone", label:"Phone Number", ph:"+1 (416) 555-0100" }].map(f=>(
                <div key={f.k}>
                  <label style={{ fontSize:11, fontWeight:600, color:C.muted, display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.06em" }}>{f.label}</label>
                  <input value={del[f.k]} onChange={e=>setDel(p=>({...p,[f.k]:e.target.value}))} placeholder={f.ph}
                    style={{ width:"100%", padding:"9px 11px", border:`1px solid ${C.border}`, borderRadius:8, fontSize:13, color:C.text, background:C.bg, outline:"none", boxSizing:"border-box" }}/>
                </div>
              ))}
            </div>
            {del.type==="delivery"
              ? <div style={{ marginBottom:10 }}>
                  <label style={{ fontSize:11, fontWeight:600, color:C.muted, display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.06em" }}>Delivery Address</label>
                  <input value={del.address} onChange={e=>setDel(p=>({...p,address:e.target.value}))} placeholder="123 Main St, Toronto, ON"
                    style={{ width:"100%", padding:"9px 11px", border:`1px solid ${C.border}`, borderRadius:8, fontSize:13, color:C.text, background:C.bg, outline:"none", boxSizing:"border-box" }}/>
                </div>
              : <div style={{ background:C.bg, borderRadius:8, padding:"10px 12px", marginBottom:10 }}>
                  <p style={{ fontSize:12, color:C.text, fontWeight:600, margin:"0 0 2px" }}>📍 Pickup Address</p>
                  <p style={{ fontSize:12, color:C.muted, margin:0 }}>42 Maple Street, Toronto, ON M5A 1A1 — Ring the doorbell</p>
                </div>
            }
            <div>
              <label style={{ fontSize:11, fontWeight:600, color:C.muted, display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.06em" }}>Preferred Time Slot</label>
              <select value={del.time} onChange={e=>setDel(p=>({...p,time:e.target.value}))}
                style={{ width:"100%", padding:"9px 11px", border:`1px solid ${C.border}`, borderRadius:8, fontSize:13, color:C.text, background:C.bg, outline:"none" }}>
                {TIME_SLOTS.map(t=><option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
          </div>

          {/* Payment */}
          <div style={{ background:C.surface, border:`0.5px solid ${C.border}`, borderRadius:12, padding:"1.25rem" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1rem" }}>
              <p style={{ fontWeight:600, fontSize:14, color:C.text, margin:0 }}>Payment</p>
              <span style={{ fontSize:11, color:C.success, background:C.successBg, padding:"3px 9px", borderRadius:20, fontWeight:600 }}>🔒 Secured by Stripe</span>
            </div>
            {[{ k:"holder", label:"Cardholder Name", ph:"Name as on card" },{ k:"card", label:"Card Number", ph:"•••• •••• •••• ••••" }].map(f=>(
              <div key={f.k} style={{ marginBottom:10 }}>
                <label style={{ fontSize:11, fontWeight:600, color:C.muted, display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.06em" }}>{f.label}</label>
                <input value={pay[f.k]} onChange={e=>setPay(p=>({...p,[f.k]:e.target.value}))} placeholder={f.ph}
                  style={{ width:"100%", padding:"9px 11px", border:`1px solid ${C.border}`, borderRadius:8, fontSize:13, color:C.text, background:C.bg, outline:"none", boxSizing:"border-box" }}/>
              </div>
            ))}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              {[{ k:"expiry", label:"Expiry", ph:"MM/YY" },{ k:"cvv", label:"CVV", ph:"•••" }].map(f=>(
                <div key={f.k}>
                  <label style={{ fontSize:11, fontWeight:600, color:C.muted, display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.06em" }}>{f.label}</label>
                  <input value={pay[f.k]} onChange={e=>setPay(p=>({...p,[f.k]:e.target.value}))} placeholder={f.ph}
                    style={{ width:"100%", padding:"9px 11px", border:`1px solid ${C.border}`, borderRadius:8, fontSize:13, color:C.text, background:C.bg, outline:"none", boxSizing:"border-box" }}/>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary sidebar */}
        <div>
          <div style={{ background:C.surface, border:`0.5px solid ${C.border}`, borderRadius:12, padding:"1.25rem" }}>
            <p style={{ fontWeight:600, fontSize:14, color:C.text, margin:"0 0 1rem" }}>Summary</p>
            {cartItems.map(p=>(
              <div key={p.id} style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:C.muted, marginBottom:5 }}>
                <span>{p.name} × {p.qty}</span><span>${(p.price*p.qty).toFixed(2)}</span>
              </div>
            ))}
            <div style={{ borderTop:`0.5px solid ${C.border}`, margin:"10px 0", paddingTop:10 }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:C.muted, marginBottom:5 }}>
                <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:C.muted }}>
                <span>{del.type==="delivery"?"Delivery fee":"Pickup"}</span>
                <span>{del.type==="delivery"?"$5.00":"Free"}</span>
              </div>
            </div>
            <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:10, display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.25rem" }}>
              <span style={{ fontWeight:700, fontSize:14, color:C.text }}>Total</span>
              <span style={{ ...tt, fontWeight:700, fontSize:22, color:C.primary }}>${total.toFixed(2)}</span>
            </div>
            <button onClick={placeOrder} disabled={proc} style={{ width:"100%", padding:"12px", background:C.primary, color:"#FFF", border:"none", borderRadius:10, fontSize:13, fontWeight:700, cursor:"pointer" }}>
              {proc?"⟳ Processing...":`Place Order · $${total.toFixed(2)}`}
            </button>
            <p style={{ fontSize:11, color:C.muted, textAlign:"center", margin:"10px 0 0" }}>You'll get a text/email confirmation</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Confirmed screen
  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"'Outfit', sans-serif", display:"flex", alignItems:"center", justifyContent:"center", padding:"2rem" }}>
      <div style={{ background:C.surface, borderRadius:20, padding:"2.5rem", maxWidth:430, width:"100%", textAlign:"center" }}>
        <div style={{ fontSize:52, marginBottom:12 }}>🎉</div>
        <h2 style={{ ...tt, fontSize:24, color:C.text, margin:"0 0 8px" }}>Order Confirmed!</h2>
        <p style={{ color:C.muted, fontSize:13, margin:"0 0 1.5rem" }}>Thank you! {seller?.name||"Your baker"} has been notified and will start baking soon.</p>
        <div style={{ background:C.bg, borderRadius:10, padding:"1rem 1.25rem", marginBottom:"1.5rem", textAlign:"left" }}>
          {[["Order number",orderNum],["Method",del.type==="delivery"?"Home Delivery":"Pickup"],["Time slot",TIME_SLOTS.find(t=>t.value===del.time)?.label],["Total paid",`$${total.toFixed(2)}`]].map(([k,v])=>(
            <div key={k} style={{ display:"flex", justifyContent:"space-between", marginBottom:7 }}>
              <span style={{ fontSize:12, color:C.muted }}>{k}</span>
              <span style={{ fontSize:12, fontWeight:600, color:k==="Order number"?C.primary:C.text }}>{v}</span>
            </div>
          ))}
        </div>
        <button onClick={onBack} style={{ width:"100%", padding:"11px", background:C.primary, color:"#FFF", border:"none", borderRadius:10, fontSize:13, fontWeight:700, cursor:"pointer" }}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// SIDEBAR
// ──────────────────────────────────────────────────────────────────────────────
function Sidebar({ view, setView, onPreview, user }) {
  return (
    <div style={{ width:220, background:C.sidebar, display:"flex", flexDirection:"column", flexShrink:0 }}>
      <div style={{ padding:"1.5rem 1.25rem 1.1rem", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontSize:24 }}>🍞</span>
          <div>
            <p style={{ color:C.sidebarText, ...tt, fontSize:15, fontWeight:600, margin:0, lineHeight:1.2 }}>{user?.business||"Hearthside"}</p>
            <p style={{ color:C.sidebarMuted, fontSize:10, margin:0 }}>Seller Dashboard</p>
          </div>
        </div>
      </div>
      <nav style={{ flex:1, padding:"0.75rem 0.625rem" }}>
        {NAV.map(item=>{
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
        <div style={{ height:"0.5px", background:"rgba(245,220,200,0.1)", margin:"8px 12px" }}/>
        <button onClick={onPreview} style={{ display:"flex", alignItems:"center", gap:10, width:"100%", padding:"8px 12px", background:"transparent", border:"none", borderLeft:"3px solid transparent", borderRadius:"0 8px 8px 0", cursor:"pointer", textAlign:"left" }}>
          <span style={{ fontSize:14, color:"#F4A261" }}>⊙</span>
          <span style={{ fontSize:13, color:"#F4A261", fontWeight:500 }}>Preview Storefront</span>
        </button>
      </nav>
      <div style={{ padding:"1rem", borderTop:"1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ background:"rgba(196,98,45,0.14)", border:"1px solid rgba(196,98,45,0.32)", borderRadius:10, padding:"10px 12px" }}>
          <p style={{ color:"#F4A261", fontSize:11, fontWeight:700, margin:"0 0 2px", textTransform:"uppercase", letterSpacing:"0.06em" }}>Free Trial</p>
          <p style={{ color:C.sidebarText, fontSize:12, margin:"0 0 9px" }}>14 days remaining</p>
          <button style={{ background:C.primary, color:"#FFF", border:"none", borderRadius:6, padding:"6px 10px", fontSize:11, fontWeight:700, cursor:"pointer", width:"100%" }}>Upgrade to Pro →</button>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// DASHBOARD
// ──────────────────────────────────────────────────────────────────────────────
function Dashboard({ products }) {
  const top    = [...products].sort((a,b)=>b.sold-a.sold)[0];
  const active = ORDERS.filter(o=>o.status==="preparing"||o.status==="ready").length;
  const thisM  = REV_DATA[REV_DATA.length-1];
  const prevM  = REV_DATA[REV_DATA.length-2];
  const growth = (((thisM.revenue-prevM.revenue)/prevM.revenue)*100).toFixed(1);
  const totalRev = REV_DATA.reduce((s,d)=>s+d.revenue,0);
  return (
    <div style={{ padding:"2rem" }}>
      <div style={{ marginBottom:"1.75rem" }}>
        <h1 style={{ ...tt, fontSize:27, color:C.text, margin:"0 0 4px" }}>Good morning 👋</h1>
        <p style={{ color:C.muted, fontSize:14, margin:0 }}>Here's how your bakery is performing.</p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,minmax(0,1fr))", gap:12, marginBottom:"2rem" }}>
        <KPI label="Total Revenue"  value={`$${(totalRev/1000).toFixed(1)}k`}         sub="Last 6 months"           color={C.primary}/>
        <KPI label="This Month"     value={`$${thisM.revenue.toLocaleString()}`}       sub={`↑ ${growth}% vs last month`} color={C.success}/>
        <KPI label="Active Orders"  value={active}    sub="Need your attention"/>
        <KPI label="Top Seller"     value={top.emoji} sub={`${top.name} · ${top.sold} sold`}/>
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
          <p style={{ fontWeight:600, fontSize:14, color:C.text, margin:"0 0 1rem" }}>Top Products</p>
          {[...products].sort((a,b)=>b.sold-a.sold).slice(0,4).map((p,i)=>{
            const bc=[C.primary,"#E8960C",C.info,C.success];
            return (
              <div key={p.id} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:13 }}>
                <span style={{ fontSize:20 }}>{p.emoji}</span>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontSize:12, color:C.text, margin:"0 0 4px", fontWeight:500, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{p.name}</p>
                  <div style={{ height:4, background:C.border, borderRadius:4 }}>
                    <div style={{ height:4, width:`${(p.sold/62)*100}%`, background:bc[i], borderRadius:4 }}/>
                  </div>
                </div>
                <span style={{ fontSize:11, color:C.muted, fontWeight:600 }}>{p.sold}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ background:C.surface, border:`0.5px solid ${C.border}`, borderRadius:12, padding:"1.25rem" }}>
        <p style={{ fontWeight:600, fontSize:14, color:C.text, margin:"0 0 1rem" }}>Recent Orders</p>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
          <thead>
            <tr style={{ borderBottom:`1px solid ${C.border}` }}>
              {["Order","Customer","Items","Total","Status","Date"].map(h=>(
                <th key={h} style={{ textAlign:"left", padding:"0 8px 9px", color:C.muted, fontWeight:600, fontSize:11, textTransform:"uppercase", letterSpacing:"0.05em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ORDERS.slice(0,4).map(o=>(
              <tr key={o.id} style={{ borderBottom:`0.5px solid ${C.border}` }}>
                <td style={{ padding:"11px 8px", color:C.primary, fontWeight:700 }}>{o.id}</td>
                <td style={{ padding:"11px 8px", color:C.text }}>{o.customer}</td>
                <td style={{ padding:"11px 8px", color:C.muted, maxWidth:180, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{o.items}</td>
                <td style={{ padding:"11px 8px", color:C.text, fontWeight:600 }}>${o.total.toFixed(2)}</td>
                <td style={{ padding:"11px 8px" }}><Badge status={o.status}/></td>
                <td style={{ padding:"11px 8px", color:C.muted }}>{o.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// STOREFRONT (SELLER)
// ──────────────────────────────────────────────────────────────────────────────
function Storefront({ products, setProducts }) {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name:"", price:"", cat:"", emoji:"🍞", desc:"" });
  const addProduct = () => {
    if (!form.name||!form.price) return;
    setProducts(prev=>[...prev,{ id:Date.now(), name:form.name, price:parseFloat(form.price)||0, cat:form.cat||"Other", emoji:form.emoji||"🍞", sold:0, stock:10, desc:form.desc }]);
    setShowModal(false); setForm({ name:"", price:"", cat:"", emoji:"🍞", desc:"" });
  };
  return (
    <div style={{ padding:"2rem" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.75rem" }}>
        <div>
          <h1 style={{ ...tt, fontSize:27, color:C.text, margin:"0 0 4px" }}>Storefront</h1>
          <p style={{ color:C.muted, fontSize:14, margin:0 }}>Manage your product listings</p>
        </div>
        <button onClick={()=>setShowModal(true)} style={{ background:C.primary, color:"#FFF", border:"none", borderRadius:8, padding:"9px 18px", fontSize:13, fontWeight:600, cursor:"pointer" }}>+ Add Product</button>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,minmax(0,1fr))", gap:14 }}>
        {products.map(p=>(
          <div key={p.id} style={{ background:C.surface, border:`0.5px solid ${C.border}`, borderRadius:14, padding:"1.25rem" }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
              <span style={{ fontSize:38, lineHeight:1 }}>{p.emoji}</span>
              <span style={{ background:C.primaryBg, color:C.primary, fontSize:11, fontWeight:600, padding:"3px 9px", borderRadius:20 }}>{p.cat}</span>
            </div>
            <p style={{ ...tt, fontSize:16, fontWeight:600, color:C.text, margin:"0 0 5px" }}>{p.name}</p>
            <p style={{ fontSize:12, color:C.muted, margin:"0 0 14px", lineHeight:1.55 }}>{p.desc}</p>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", borderTop:`0.5px solid ${C.border}`, paddingTop:11 }}>
              <span style={{ ...tt, fontSize:18, fontWeight:700, color:C.primary }}>${p.price.toFixed(2)}</span>
              <div style={{ display:"flex", gap:10 }}>
                <span style={{ fontSize:11, color:C.muted }}>Stock: <b style={{ color:p.stock<5?C.danger:C.text }}>{p.stock}</b></span>
                <span style={{ fontSize:11, color:C.muted }}>Sold: <b style={{ color:C.text }}>{p.sold}</b></span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {showModal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.42)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:200 }}>
          <div style={{ background:C.surface, borderRadius:16, padding:"1.75rem", width:390, maxWidth:"90vw" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.25rem" }}>
              <h2 style={{ ...tt, fontSize:20, color:C.text, margin:0 }}>Add New Product</h2>
              <button onClick={()=>setShowModal(false)} style={{ background:"none", border:"none", fontSize:18, cursor:"pointer", color:C.muted }}>✕</button>
            </div>
            {[{ label:"Product Name *", key:"name", ph:"e.g. Blueberry Scones" },{ label:"Price ($) *", key:"price", ph:"e.g. 16.00" },{ label:"Category", key:"cat", ph:"Bread / Cake / Pastry" },{ label:"Emoji", key:"emoji", ph:"🍞" }].map(f=>(
              <div key={f.key} style={{ marginBottom:12 }}>
                <label style={{ fontSize:11, fontWeight:600, color:C.muted, display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.05em" }}>{f.label}</label>
                <input value={form[f.key]} onChange={e=>setForm({...form,[f.key]:e.target.value})} placeholder={f.ph}
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
              <button onClick={addProduct} style={{ flex:2, padding:"9px", background:C.primary, color:"#FFF", border:"none", borderRadius:8, cursor:"pointer", fontSize:13, fontWeight:600 }}>Add Product</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// ORDERS
// ──────────────────────────────────────────────────────────────────────────────
function Orders() {
  const [filter, setFilter] = useState("all");
  const filtered = filter==="all" ? ORDERS : ORDERS.filter(o=>o.status===filter);
  return (
    <div style={{ padding:"2rem" }}>
      <div style={{ marginBottom:"1.75rem" }}>
        <h1 style={{ ...tt, fontSize:27, color:C.text, margin:"0 0 4px" }}>Orders</h1>
        <p style={{ color:C.muted, fontSize:14, margin:0 }}>Track and manage your customer orders</p>
      </div>
      <div style={{ display:"flex", gap:8, marginBottom:"1.25rem", flexWrap:"wrap" }}>
        {["all","preparing","ready","delivered","cancelled"].map(s=>(
          <button key={s} onClick={()=>setFilter(s)} style={{ padding:"6px 14px", borderRadius:20, border:"1px solid", fontSize:12, fontWeight:500, cursor:"pointer", background:filter===s?C.primary:"transparent", borderColor:filter===s?C.primary:C.border, color:filter===s?"#FFF":C.muted }}>
            {s==="all"?`All (${ORDERS.length})`:s.charAt(0).toUpperCase()+s.slice(1)}
          </button>
        ))}
      </div>
      <div style={{ background:C.surface, border:`0.5px solid ${C.border}`, borderRadius:12, overflow:"hidden" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
          <thead>
            <tr style={{ background:C.bg, borderBottom:`1px solid ${C.border}` }}>
              {["Order ID","Customer","Items","Total","Status","Date","Action"].map(h=>(
                <th key={h} style={{ textAlign:"left", padding:"11px 14px", color:C.muted, fontWeight:600, fontSize:11, textTransform:"uppercase", letterSpacing:"0.05em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((o,i)=>(
              <tr key={o.id} style={{ borderBottom:i<filtered.length-1?`0.5px solid ${C.border}`:"none" }}>
                <td style={{ padding:"12px 14px", color:C.primary, fontWeight:700 }}>{o.id}</td>
                <td style={{ padding:"12px 14px", color:C.text, fontWeight:500 }}>{o.customer}</td>
                <td style={{ padding:"12px 14px", color:C.muted, maxWidth:200, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{o.items}</td>
                <td style={{ padding:"12px 14px", color:C.text, fontWeight:600 }}>${o.total.toFixed(2)}</td>
                <td style={{ padding:"12px 14px" }}><Badge status={o.status}/></td>
                <td style={{ padding:"12px 14px", color:C.muted }}>{o.date}</td>
                <td style={{ padding:"12px 14px" }}>
                  {o.status==="preparing"&&<button style={{ padding:"4px 10px", background:C.infoBg, color:C.info, border:`1px solid ${C.info}`, borderRadius:6, fontSize:11, cursor:"pointer", fontWeight:500 }}>Mark Ready</button>}
                  {o.status==="ready"    &&<button style={{ padding:"4px 10px", background:C.successBg, color:C.success, border:`1px solid ${C.success}`, borderRadius:6, fontSize:11, cursor:"pointer", fontWeight:500 }}>Deliver</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// FINANCES
// ──────────────────────────────────────────────────────────────────────────────
function Finances() {
  const totalRev    = REV_DATA.reduce((s,d)=>s+d.revenue,0);
  const totalExp    = REV_DATA.reduce((s,d)=>s+d.expenses,0);
  const totalProfit = totalRev-totalExp;
  const margin      = ((totalProfit/totalRev)*100).toFixed(1);
  const expenses    = [
    { label:"Ingredients", pct:45, amount:186.75, color:C.primary },
    { label:"Packaging",   pct:20, amount:83.00,  color:"#E8960C" },
    { label:"Delivery",    pct:25, amount:103.75, color:C.info    },
    { label:"Equipment",   pct:10, amount:41.50,  color:C.success },
  ];
  return (
    <div style={{ padding:"2rem" }}>
      <div style={{ marginBottom:"1.75rem" }}>
        <h1 style={{ ...tt, fontSize:27, color:C.text, margin:"0 0 4px" }}>Finances</h1>
        <p style={{ color:C.muted, fontSize:14, margin:0 }}>Track your earnings and optimize your costs</p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,minmax(0,1fr))", gap:12, marginBottom:"2rem" }}>
        <KPI label="Total Revenue"  value={`$${totalRev.toLocaleString()}`}    sub="6 months"           color={C.primary}/>
        <KPI label="Total Expenses" value={`$${totalExp.toLocaleString()}`}    sub="6 months"           color={C.warning}/>
        <KPI label="Net Profit"     value={`$${totalProfit.toLocaleString()}`} sub="6 months"           color={C.success}/>
        <KPI label="Profit Margin"  value={`${margin}%`}                       sub="Industry avg: 62%"  color={parseFloat(margin)>=62?C.success:C.warning}/>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:16, marginBottom:"1.5rem" }}>
        <div style={{ background:C.surface, border:`0.5px solid ${C.border}`, borderRadius:12, padding:"1.25rem" }}>
          <p style={{ fontWeight:600, fontSize:14, color:C.text, margin:"0 0 1rem" }}>Monthly Profit</p>
          <ResponsiveContainer width="100%" height={195}>
            <BarChart data={REV_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border}/>
              <XAxis dataKey="month" tick={{ fontSize:11, fill:C.muted }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fontSize:11, fill:C.muted }} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, fontSize:12 }}/>
              <Bar dataKey="profit" fill={C.primary} radius={[4,4,0,0]} name="Profit ($)"/>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ background:C.surface, border:`0.5px solid ${C.border}`, borderRadius:12, padding:"1.25rem" }}>
          <p style={{ fontWeight:600, fontSize:14, color:C.text, margin:"0 0 1rem" }}>This Month's Costs</p>
          {expenses.map(e=>(
            <div key={e.label} style={{ marginBottom:13 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                <span style={{ fontSize:12, color:C.text, fontWeight:500 }}>{e.label}</span>
                <span style={{ fontSize:12, color:C.muted }}>${e.amount.toFixed(2)} · {e.pct}%</span>
              </div>
              <div style={{ height:5, background:C.border, borderRadius:3 }}>
                <div style={{ height:5, width:`${e.pct}%`, background:e.color, borderRadius:3 }}/>
              </div>
            </div>
          ))}
          <div style={{ marginTop:12, paddingTop:12, borderTop:`0.5px solid ${C.border}`, display:"flex", justifyContent:"space-between" }}>
            <span style={{ fontSize:12, fontWeight:600, color:C.text }}>Total</span>
            <span style={{ fontSize:12, fontWeight:700, color:C.primary }}>$415.00</span>
          </div>
        </div>
      </div>
      <div style={{ background:"#FFFAED", border:"1px solid #F4C44A", borderRadius:12, padding:"1rem 1.25rem" }}>
        <p style={{ fontWeight:700, fontSize:13, color:"#7A5400", margin:"0 0 5px" }}>💡 Optimization Insight</p>
        <p style={{ fontSize:13, color:"#5C3E00", margin:0, lineHeight:1.7 }}>Your ingredient costs (45%) are above the 35–40% optimal range. Buying flour, butter, and sugar wholesale could save ~$40/month. A $1–2 price increase on Sourdough and Banana Bread would bring your margin to 70%+ with minimal demand impact.</p>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// DELIVERY SETTINGS
// ──────────────────────────────────────────────────────────────────────────────
function DeliverySettings() {
  const [pickup, setPickup] = useState({ enabled:true,  address:"42 Maple Street, Toronto, ON M5A 1A1", instructions:"Ring the doorbell. Orders ready in a paper bag at the door." });
  const [del,    setDel]    = useState({ enabled:true,  fee:"5.00", minOrder:"20", radius:"10", cutoff:"17:00", lead:"1", note:"Delivery within 10km. Orders placed by 5PM ship next day." });
  const [days,   setDays]   = useState({ mon:true, tue:true, wed:false, thu:true, fri:true, sat:true, sun:false });
  const [saved,  setSaved]  = useState(false);
  const DAY_LABELS = [["mon","Mon"],["tue","Tue"],["wed","Wed"],["thu","Thu"],["fri","Fri"],["sat","Sat"],["sun","Sun"]];
  const save = () => { setSaved(true); setTimeout(()=>setSaved(false),2500); };

  const Field = ({ label, value, onChange, ph, half }) => (
    <div style={{ marginBottom:12, flex:half?1:"none" }}>
      <label style={{ fontSize:11, fontWeight:600, color:C.muted, display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.06em" }}>{label}</label>
      <input value={value} onChange={e=>onChange(e.target.value)} placeholder={ph}
        style={{ width:"100%", padding:"9px 11px", border:`1px solid ${C.border}`, borderRadius:8, fontSize:13, color:C.text, background:C.bg, outline:"none", boxSizing:"border-box" }}/>
    </div>
  );

  return (
    <div style={{ padding:"2rem", maxWidth:660 }}>
      <div style={{ marginBottom:"1.75rem" }}>
        <h1 style={{ ...tt, fontSize:27, color:C.text, margin:"0 0 4px" }}>Delivery Settings</h1>
        <p style={{ color:C.muted, fontSize:14, margin:0 }}>Configure how customers receive their orders</p>
      </div>

      <div style={{ background:C.surface, border:`0.5px solid ${C.border}`, borderRadius:12, padding:"1.25rem", marginBottom:14 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:pickup.enabled?"1rem":0 }}>
          <div>
            <p style={{ fontWeight:600, fontSize:14, color:C.text, margin:"0 0 2px" }}>🏠 Pickup</p>
            <p style={{ fontSize:12, color:C.muted, margin:0 }}>Customers collect orders from your home</p>
          </div>
          <Toggle val={pickup.enabled} onChange={()=>setPickup(p=>({...p,enabled:!p.enabled}))}/>
        </div>
        {pickup.enabled && <>
          <Field label="Pickup Address" value={pickup.address} onChange={v=>setPickup(p=>({...p,address:v}))} ph="123 Your Street, City, Province"/>
          <div>
            <label style={{ fontSize:11, fontWeight:600, color:C.muted, display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.06em" }}>Pickup Instructions</label>
            <textarea value={pickup.instructions} onChange={e=>setPickup(p=>({...p,instructions:e.target.value}))} rows={2}
              style={{ width:"100%", padding:"9px 11px", border:`1px solid ${C.border}`, borderRadius:8, fontSize:13, color:C.text, background:C.bg, outline:"none", resize:"none", boxSizing:"border-box" }}/>
          </div>
        </>}
      </div>

      <div style={{ background:C.surface, border:`0.5px solid ${C.border}`, borderRadius:12, padding:"1.25rem", marginBottom:14 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:del.enabled?"1rem":0 }}>
          <div>
            <p style={{ fontWeight:600, fontSize:14, color:C.text, margin:"0 0 2px" }}>🚗 Home Delivery</p>
            <p style={{ fontSize:12, color:C.muted, margin:0 }}>You deliver orders to customers</p>
          </div>
          <Toggle val={del.enabled} onChange={()=>setDel(p=>({...p,enabled:!p.enabled}))}/>
        </div>
        {del.enabled && <>
          <div style={{ display:"flex", gap:10 }}>
            <Field half label="Delivery Fee ($)" value={del.fee}      onChange={v=>setDel(p=>({...p,fee:v}))}      ph="5.00"/>
            <Field half label="Min. Order ($)"   value={del.minOrder} onChange={v=>setDel(p=>({...p,minOrder:v}))} ph="20.00"/>
            <Field half label="Radius (km)"      value={del.radius}   onChange={v=>setDel(p=>({...p,radius:v}))}   ph="10"/>
          </div>
          <Field label="Note to Customers" value={del.note} onChange={v=>setDel(p=>({...p,note:v}))} ph="e.g. Delivery within 10km, weekdays only."/>
        </>}
      </div>

      <div style={{ background:C.infoBg, border:`1px solid rgba(26,107,156,0.3)`, borderRadius:12, padding:"1rem 1.25rem", marginBottom:14 }}>
        <p style={{ fontWeight:700, fontSize:13, color:C.info, margin:"0 0 6px" }}>🚀 Third-Party Delivery Integrations (Pro)</p>
        <p style={{ fontSize:12, color:"#0F4A70", margin:"0 0 10px", lineHeight:1.6 }}>Let a courier handle the driving so you can focus on baking:</p>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
          {[["Uber Direct","~$3–$8 per order"],["DoorDash Drive","~$4–$9 per order"],["Stuart","~$2.50 per order"]].map(([n,p])=>(
            <div key={n} style={{ background:C.surface, borderRadius:8, padding:"9px 10px", border:`0.5px solid ${C.border}` }}>
              <p style={{ fontSize:12, fontWeight:600, color:C.text, margin:"0 0 2px" }}>{n}</p>
              <p style={{ fontSize:11, color:C.muted, margin:0 }}>{p}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background:C.surface, border:`0.5px solid ${C.border}`, borderRadius:12, padding:"1.25rem", marginBottom:"1.5rem" }}>
        <p style={{ fontWeight:600, fontSize:14, color:C.text, margin:"0 0 1rem" }}>📅 Availability Schedule</p>
        <div style={{ display:"flex", gap:8, marginBottom:"1.25rem" }}>
          {DAY_LABELS.map(([key,label])=>(
            <button key={key} onClick={()=>setDays(p=>({...p,[key]:!p[key]}))} style={{
              width:40, height:40, borderRadius:8, border:"1px solid",
              borderColor:days[key]?C.primary:C.border,
              background:days[key]?C.primaryBg:"transparent",
              color:days[key]?C.primary:C.muted,
              fontSize:11, fontWeight:600, cursor:"pointer"
            }}>{label}</button>
          ))}
        </div>
        <div style={{ display:"flex", gap:12 }}>
          <Field half label="Order Cutoff Time" value={del.cutoff} onChange={v=>setDel(p=>({...p,cutoff:v}))} ph="17:00"/>
          <div style={{ flex:1, marginBottom:12 }}>
            <label style={{ fontSize:11, fontWeight:600, color:C.muted, display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.06em" }}>Lead Time Required</label>
            <select value={del.lead} onChange={e=>setDel(p=>({...p,lead:e.target.value}))}
              style={{ width:"100%", padding:"9px 11px", border:`1px solid ${C.border}`, borderRadius:8, fontSize:13, color:C.text, background:C.bg, outline:"none" }}>
              <option value="0">Same day</option>
              <option value="1">1 day advance</option>
              <option value="2">2 days advance</option>
              <option value="3">3 days advance</option>
            </select>
          </div>
        </div>
      </div>

      <button onClick={save} style={{ background:saved?C.success:C.primary, color:"#FFF", border:"none", borderRadius:9, padding:"11px 24px", fontSize:13, fontWeight:700, cursor:"pointer", transition:"background 0.2s" }}>
        {saved?"✓ Settings Saved!":"Save Settings"}
      </button>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// AI MARKETING
// ──────────────────────────────────────────────────────────────────────────────
function Marketing({ products }) {
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
          content:`You are a copywriter for artisanal home-baked goods. Product: ${name}\nDetails: ${details||"Home-baked with love, quality ingredients"}\nReturn ONLY valid JSON (no markdown, no backticks):\n{"tagline":"5-8 word punchy tagline","description":"2-3 sentence storefront description","instagram":"Instagram caption with 3-5 hashtags under 150 chars","whatsapp":"WhatsApp broadcast under 100 chars"}`
        }] })
      });
      const data = await res.json();
      const text = (data.content||[]).map(c=>c.text||"").join("");
      setResult(JSON.parse(text.replace(/```json|```/g,"").trim()));
    } catch(e) { setError("Something went wrong. Please try again."); }
    setLoading(false);
  };

  const copy = (text, key) => { navigator.clipboard.writeText(text).then(()=>{ setCopied(key); setTimeout(()=>setCopied(""),2000); }); };

  return (
    <div style={{ padding:"2rem", maxWidth:680 }}>
      <div style={{ marginBottom:"1.75rem" }}>
        <h1 style={{ ...tt, fontSize:27, color:C.text, margin:"0 0 4px" }}>AI Marketing</h1>
        <p style={{ color:C.muted, fontSize:14, margin:0 }}>Generate product copy and social captions powered by Claude</p>
      </div>
      <div style={{ background:C.surface, border:`0.5px solid ${C.border}`, borderRadius:14, padding:"1.5rem", marginBottom:"1.25rem" }}>
        <p style={{ fontSize:11, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.07em", margin:"0 0 10px" }}>Quick fill from your products</p>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:"1.5rem" }}>
          {products.slice(0,5).map(p=>(
            <button key={p.id} onClick={()=>{ setName(p.name); setDetails(p.desc); }} style={{ padding:"5px 12px", border:`1px solid ${C.border}`, borderRadius:20, background:"transparent", fontSize:12, cursor:"pointer", color:C.text, display:"flex", alignItems:"center", gap:5 }}>
              <span>{p.emoji}</span>{p.name}
            </button>
          ))}
        </div>
        <div style={{ marginBottom:13 }}>
          <label style={{ fontSize:11, fontWeight:700, color:C.muted, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.06em" }}>Product Name *</label>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Blueberry & Lemon Scones"
            style={{ width:"100%", padding:"10px 12px", border:`1px solid ${C.border}`, borderRadius:8, fontSize:13, color:C.text, background:C.bg, outline:"none", boxSizing:"border-box" }}/>
        </div>
        <div style={{ marginBottom:18 }}>
          <label style={{ fontSize:11, fontWeight:700, color:C.muted, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.06em" }}>Key Details (optional)</label>
          <textarea value={details} onChange={e=>setDetails(e.target.value)} rows={3} placeholder="Ingredients, textures, what makes it special..."
            style={{ width:"100%", padding:"10px 12px", border:`1px solid ${C.border}`, borderRadius:8, fontSize:13, color:C.text, background:C.bg, outline:"none", resize:"none", boxSizing:"border-box", lineHeight:1.6 }}/>
        </div>
        <button onClick={generate} disabled={!name.trim()||loading} style={{ background:name.trim()?C.primary:C.border, color:name.trim()?"#FFF":C.muted, border:"none", borderRadius:8, padding:"10px 22px", fontSize:13, fontWeight:700, cursor:name.trim()?"pointer":"default" }}>
          {loading?"⟳ Generating...":"✦ Generate Marketing Copy"}
        </button>
      </div>
      {error && <div style={{ background:C.dangerBg, border:`1px solid ${C.danger}`, borderRadius:10, padding:"12px 14px", marginBottom:14, fontSize:13, color:C.danger }}>{error}</div>}
      {result && (
        <div style={{ background:C.surface, border:`0.5px solid ${C.border}`, borderRadius:14, overflow:"hidden" }}>
          <div style={{ background:C.primaryBg, padding:"1rem 1.5rem", borderBottom:`1px solid ${C.border}` }}>
            <p style={{ ...tt, fontSize:20, color:C.primary, margin:0, fontStyle:"italic" }}>"{result.tagline}"</p>
          </div>
          <div style={{ padding:"1.25rem 1.5rem" }}>
            {[{ key:"description", label:"Storefront Description", icon:"🏪" },{ key:"instagram", label:"Instagram Caption", icon:"📸" },{ key:"whatsapp", label:"WhatsApp Message", icon:"💬" }].map(item=>(
              <div key={item.key} style={{ marginBottom:"1.25rem", paddingBottom:"1.25rem", borderBottom:`0.5px solid ${C.border}` }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:7 }}>
                  <p style={{ fontSize:11, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.06em", margin:0 }}>{item.icon} {item.label}</p>
                  <button onClick={()=>copy(result[item.key],item.key)} style={{ background:"transparent", border:`1px solid ${C.border}`, borderRadius:6, padding:"3px 10px", fontSize:11, cursor:"pointer", color:C.muted, fontWeight:500 }}>
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
}

// ──────────────────────────────────────────────────────────────────────────────
// APP ROOT
// ──────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [authed,       setAuthed]       = useState(false);
  const [user,         setUser]         = useState(null);
  const [view,         setView]         = useState("dashboard");
  const [products,     setProducts]     = useState(INIT_PRODUCTS);
  const [customerView, setCustomerView] = useState(false);

  useEffect(()=>{
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Outfit:wght@300;400;500;600&display=swap";
    document.head.appendChild(link);
    return ()=>{ try{ document.head.removeChild(link); }catch(e){} };
  }, []);

  if (!authed)      return <AuthScreen onAuth={u=>{ setUser(u); setAuthed(true); }}/>;
  if (customerView) return <CustomerStorefront products={products} seller={user} onBack={()=>setCustomerView(false)}/>;

  return (
    <div style={{ display:"flex", height:"100vh", fontFamily:"'Outfit', sans-serif", background:C.bg, overflow:"hidden" }}>
      <Sidebar view={view} setView={setView} onPreview={()=>setCustomerView(true)} user={user}/>
      <main style={{ flex:1, overflowY:"auto" }}>
        {view==="dashboard"  && <Dashboard products={products}/>}
        {view==="storefront" && <Storefront products={products} setProducts={setProducts}/>}
        {view==="orders"     && <Orders/>}
        {view==="finances"   && <Finances/>}
        {view==="delivery"   && <DeliverySettings/>}
        {view==="marketing"  && <Marketing products={products}/>}
      </main>
    </div>
  );
}
