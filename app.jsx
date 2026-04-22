const { useState, useEffect, useRef, useMemo, useCallback } = React;

// ---------- DATA ----------
const WORKS = [
  { id: 1, src: "assets/img/work-01.jpg", type: "img", title: "Peonías", style: "Fineline · Botánico", placement: "Antebrazo", session: "4h", category: "floral", featured: true },
  { id: 2, src: "assets/img/work-02.jpg", type: "img", title: "Jardín suave", style: "Fineline · Sombra punto", placement: "Antebrazo interno", session: "3.5h", category: "floral" },
  { id: 3, src: "assets/img/work-03.jpg", type: "img", title: "Escorpión", style: "Tradicional reinterpretado", placement: "Antebrazo", session: "2h", category: "linework" },
  { id: 4, src: "assets/img/work-04.jpg", type: "img", title: "Restauración", style: "Cover & rework", placement: "Tobillo", session: "1.5h", category: "cover", note: "Antes / Después" },
  { id: 5, src: "assets/img/work-05.jpg", type: "img", title: "Gato entre flores", style: "Fineline · Dotwork", placement: "Antebrazo", session: "3h", category: "floral", featured: true },
  { id: 6, src: "assets/img/work-06.jpg", type: "img", title: "Zorro silvestre", style: "Fineline · Botánico", placement: "Muñeca", session: "2.5h", category: "floral" },
  { id: 7, src: "assets/img/work-07.jpg", type: "img", title: "Águila & serpiente", style: "Black & grey realismo", placement: "Pantorrilla", session: "5h", category: "blackgrey", featured: true },
  { id: 8, src: "assets/img/work-08.jpg", type: "img", title: "Águila ascendente", style: "Black & grey", placement: "Gemelo", session: "4.5h", category: "blackgrey", hideFromCarousel: true },
  { id: 11, src: "assets/video/clip-01.mp4", type: "video", title: "Sesión en proceso", style: "Reel", placement: "Estudio", session: "—", category: "studio" },
  { id: 12, src: "assets/video/clip-02.mp4", type: "video", title: "Línea fina, mano firme", style: "Reel", placement: "Estudio", session: "—", category: "studio" },
  { id: 13, src: "assets/video/clip-03.mp4", type: "video", title: "Detalle botánico", style: "Reel", placement: "Estudio", session: "—", category: "studio" },
  { id: 14, src: "assets/video/clip-04.mp4", type: "video", title: "Trabajo en piel", style: "Reel", placement: "Estudio", session: "—", category: "studio" },
  { id: 15, src: "assets/video/clip-05.mp4", type: "video", title: "Sombras suaves", style: "Reel", placement: "Estudio", session: "—", category: "studio" },
  { id: 16, src: "assets/video/clip-06.mp4", type: "video", title: "Piercing & cuidado", style: "Reel", placement: "Estudio", session: "—", category: "piercing" },
  { id: 17, src: "assets/video/clip-07.mp4", type: "video", title: "Atelier", style: "Reel", placement: "Estudio", session: "—", category: "studio" },
];

const CAROUSEL = WORKS.filter(w => [1,5,7,11,3,13].includes(w.id));

const FILTERS = [
  { k: "all", l: "Todo" },
  { k: "floral", l: "Botánico" },
  { k: "linework", l: "Linework" },
  { k: "blackgrey", l: "Black & Grey" },
  { k: "cover", l: "Cover ups" },
  { k: "studio", l: "Estudio" },
  { k: "piercing", l: "Piercing" },
];

// Layout cells for the grid (12 col)
const TILE_LAYOUT = [
  // colspan, rowspan
  [6,4],[3,4],[3,4],
  [4,3],[4,4],[4,3],
  [3,4],[5,4],[4,4],
  [6,3],[3,3],[3,3],
  [4,3],[4,3],[4,3],
];

// ---------- ICONS ----------
const I = {
  arrow: (d="right") => <svg viewBox="0 0 24 24"><path d={d==="right"?"M5 12h14M13 6l6 6-6 6":"M19 12H5M11 18l-6-6 6-6"} /></svg>,
  play: () => <svg viewBox="0 0 12 12"><path d="M3 2l7 4-7 4z"/></svg>,
  close: () => <svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>,
  check: () => <svg viewBox="0 0 24 24"><path d="M5 12l5 5L20 7"/></svg>,
  ig: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.6" fill="currentColor"/></svg>,
  wa: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M21 12a9 9 0 1 1-3.5-7.1L21 4l-1.1 3.5A9 9 0 0 1 21 12z"/><path d="M8.5 9c.4 1.6 1.6 3.4 3 4.7 1.4 1.3 3.1 2 4.5 2.3l1.5-1.5-2-1-1 1c-1-.4-2-1.2-2.7-2-.7-.7-1.5-1.7-2-2.7l1-1-1-2L8.5 9z"/></svg>,
  mail: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><rect x="3" y="5" width="18" height="14" rx="1.5"/><path d="M3 7l9 6 9-6"/></svg>,
};

// ---------- SCROLL REVEAL ----------
function useReveal(){
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((es) => {
      es.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

// ---------- NAV ----------
function Nav({ active, onNav, openMenu, setOpenMenu }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', fn); fn();
    return () => window.removeEventListener('scroll', fn);
  }, []);
  const items = [
    { k: "trabajo", l: "Trabajo", n: "01" },
    { k: "galeria", l: "Galería", n: "02" },
    { k: "servicios", l: "Servicios", n: "03" },
    { k: "proceso", l: "Proceso", n: "04" },
    { k: "contacto", l: "Contacto", n: "05" },
  ];
  return (
    <>
      <nav className={`top ${scrolled?'scrolled':''}`}>
        <div className="wrap row">
          <a href="#hero" className="brand" onClick={(e)=>{e.preventDefault();onNav('hero')}}>
            <span className="mark">s</span>
            <span className="name"><b>SBiere</b> <span style={{color:'var(--ash)',fontStyle:'italic'}}>— studio</span></span>
          </a>
          <div className="navlinks">
            {items.map(it => (
              <a key={it.k} href={`#${it.k}`} className={active===it.k?'active':''} onClick={(e)=>{e.preventDefault();onNav(it.k)}}>{it.l}</a>
            ))}
          </div>
          <div className="navcta">
            <a href="#contacto" className="pill" onClick={(e)=>{e.preventDefault();onNav('contacto')}}><span className="dot"></span>Agendando · 2026</a>
            <button className="burger" onClick={()=>setOpenMenu(!openMenu)} aria-label="Menú"><span></span></button>
          </div>
        </div>
      </nav>
      <div className={`mobilemenu ${openMenu?'open':''}`}>
        {items.map(it => (
          <a key={it.k} href={`#${it.k}`} onClick={(e)=>{e.preventDefault();onNav(it.k);setOpenMenu(false);}}>
            <span>{it.l}</span><span className="num">{it.n}</span>
          </a>
        ))}
      </div>
    </>
  );
}

// ---------- HERO ----------
function Hero(){
  const [lit, setLit] = useState(false);
  useEffect(() => { const t = setTimeout(()=>setLit(true), 60); return () => clearTimeout(t); }, []);
  return (
    <section id="hero" className="hero">
      <div className="bg">
        <div className="imgwrap"><img src="assets/img/work-05.jpg" alt="" /></div>
      </div>
      <div className="wrap content">
        <div className="meta">
          <span className="eyebrow">Estudio · Tatuaje &amp; Piercing</span>
          <span className="eyebrow">EST · 2018 · Uruguay</span>
        </div>
        <h1 className={`display ${lit?'lit':''}`}>
          <span className="ln"><span>Tinta que</span></span>
          <span className="ln"><span>respira&nbsp;<em className="italic" style={{color:'var(--accent)'}}>contigo.</em></span></span>
        </h1>
        <div className="heromarq">
          <p className="lede">
            Línea fina y trabajos a medida.<br/>
            <b>SBiere</b> es un estudio íntimo donde cada pieza se diseña sobre la piel — sin prisa, con archivo y precisión.
          </p>
          <div className="stats">
            <div className="s"><span className="v">412+</span><span className="l">Piezas firmadas</span></div>
            <div className="s"><span className="v">07</span><span className="l">Años en el oficio</span></div>
            <div className="s"><span className="v">04</span><span className="l">Disciplinas</span></div>
          </div>
          <div className="scrollcue"><span>Desplazar</span><div className="bar"></div></div>
        </div>
      </div>
    </section>
  );
}

function Marquee(){
  const items = ["Fineline","Botánico","Black & Grey","Cover ups","Piercing","Custom","Diseño a medida"];
  const arr = [...items, ...items, ...items];
  return (
    <div className="marquee">
      <div className="track">
        {arr.map((t,i)=> <span key={i}>{t}</span>)}
      </div>
    </div>
  );
}

// ---------- CARRUSEL ----------
function Carousel({ onOpen }){
  const [i, setI] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = CAROUSEL.length;
  const next = useCallback(() => setI(v => (v+1)%total), [total]);
  const prev = () => setI(v => (v-1+total)%total);

  useEffect(() => {
    if (paused) return;
    const dur = 6000;
    const start = Date.now();
    let raf;
    const tick = () => {
      const e = (Date.now()-start)/dur;
      if (e >= 1) { setProgress(0); next(); return; }
      setProgress(e*100);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [i, paused, next]);

  // keyboard
  useEffect(() => {
    const fn = (e) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  });

  // touch
  const tx = useRef(0);
  const onTs = (e) => { tx.current = e.touches[0].clientX; };
  const onTe = (e) => {
    const dx = e.changedTouches[0].clientX - tx.current;
    if (Math.abs(dx) > 50) dx>0 ? prev() : next();
  };

  return (
    <section id="trabajo" className="carousel">
      <div className="wrap">
        <div className="shead reveal">
          <div>
            <div className="eyebrow" style={{marginBottom:18}}>· 01 — Selección</div>
            <h2 className="display">Trabajo<br/><em className="italic" style={{color:'var(--accent)'}}>destacado</em></h2>
          </div>
          <div className="right">
            <p>Una rotación de piezas firmadas en los últimos meses. Cada una con su propia historia, sombra y tiempo.</p>
            <span className="mono">{String(i+1).padStart(2,'0')} / {String(total).padStart(2,'0')}</span>
          </div>
        </div>

        <div className="stage" onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)} onTouchStart={onTs} onTouchEnd={onTe}>
          <div className="slides">
            {CAROUSEL.map((s, idx) => (
              <div key={s.id} className={`slide ${idx===i?'active':''}`}>
                <div className="media">
                  {s.type === "video"
                    ? <video src={s.src} muted autoPlay loop playsInline />
                    : <img src={s.src} alt={s.title} />
                  }
                </div>
                <div className="info">
                  <div className="top">
                    <div className="num">PIEZA · {String(s.id).padStart(3,'0')}</div>
                    <h3>{s.title.split(" ").slice(0,-1).join(" ") + " "}<em>{s.title.split(" ").slice(-1)}</em></h3>
                    <p>{s.style}. Diseño exclusivo, ejecutado en sesión única.</p>
                  </div>
                  <div>
                    <div className="meta">
                      <div><div className="k">Zona</div><div className="v">{s.placement}</div></div>
                      <div><div className="k">Sesión</div><div className="v">{s.session}</div></div>
                      <div><div className="k">Estilo</div><div className="v">{s.style.split(" · ")[0]}</div></div>
                      <div><div className="k">Año</div><div className="v">2025</div></div>
                    </div>
                    <button className="ghostbtn" style={{marginTop:18}} onClick={()=>onOpen(s.id)}>Abrir pieza →</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="ctrls">
            <span className="ix"><b>{String(i+1).padStart(2,'0')}</b> &nbsp;—&nbsp; {String(total).padStart(2,'0')}</span>
            <div className="progresswrap"><span style={{width:`${progress}%`}}></span></div>
            <div className="nav">
              <button onClick={prev} aria-label="Anterior">{I.arrow("left")}</button>
              <button onClick={next} aria-label="Siguiente">{I.arrow("right")}</button>
            </div>
          </div>

          <div className="thumbs">
            {CAROUSEL.map((s, idx) => (
              <button key={s.id} className={idx===i?'is-active':''} onClick={()=>{setI(idx);setProgress(0);}}>
                {s.type === "video"
                  ? <><video src={s.src} muted /><span className="vbadge">{I.play()}</span></>
                  : <img src={s.src} alt="" />
                }
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- COLLAGE ----------
function Collage({ onOpen }){
  const [filter, setFilter] = useState("all");
  const filtered = useMemo(() => filter==="all" ? WORKS : WORKS.filter(w=>w.category===filter), [filter]);

  return (
    <section id="galeria" className="collage">
      <div className="wrap">
        <div className="shead reveal">
          <div>
            <div className="eyebrow" style={{marginBottom:18}}>· 02 — Archivo</div>
            <h2 className="display">Colección<br/>de <em className="italic" style={{color:'var(--accent)'}}>obra</em></h2>
          </div>
          <div className="right">
            <p>Filtrá por estilo o disciplina. Tocá cualquier pieza para ver el detalle, la zona y el tiempo de sesión.</p>
            <span className="mono">{filtered.length} resultados</span>
          </div>
        </div>

        <div className="filters reveal" style={{marginTop:36}}>
          {FILTERS.map(f => (
            <button key={f.k} className={filter===f.k?'is-active':''} onClick={()=>setFilter(f.k)}>{f.l}</button>
          ))}
        </div>

        <div className="grid">
          {filtered.map((w, idx) => {
            const [c,r] = TILE_LAYOUT[idx % TILE_LAYOUT.length];
            return (
              <div key={w.id} className="tile" style={{gridColumn:`span ${c}`, gridRow:`span ${r}`}} onClick={()=>onOpen(w.id)}>
                {w.type === "video"
                  ? <video src={w.src} muted autoPlay loop playsInline />
                  : <img src={w.src} alt={w.title} loading="lazy" />
                }
                <span className="corner">{String(w.id).padStart(3,'0')}</span>
                {w.type==="video" && <span className="vidicon">{I.play()}</span>}
                <div className="label">
                  <div>
                    <div className="t">{w.title}</div>
                    <div className="k" style={{color:'var(--ash)',marginTop:4}}>{w.style}</div>
                  </div>
                  <div className="k">{w.placement}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ---------- SERVICIOS ----------
function Services(){
  const list = [
    { n:"03 / a", t:"Tatuaje a medida", em:"medida", d:"Diseño exclusivo desarrollado contigo. Bocetos, ajustes y archivo entregado al finalizar.",
      items:[["Sesión mínima","60 min"],["Diseño","incluido"],["Retoque","30 días"]] },
    { n:"03 / b", t:"Cover & rework", em:"rework", d:"Cubrimos o reinterpretamos piezas existentes con un nuevo lenguaje gráfico.",
      items:[["Estudio previo","obligatorio"],["Sesiones","1 — 3"],["Garantía","incluida"]] },
    { n:"03 / c", t:"Piercing", em:"piercing", d:"Joyería con titanio implantable, técnica estéril y seguimiento del proceso de cicatrización.",
      items:[["Joyería","titanio ASTM"],["Curación","guía digital"],["Cambio","sin cargo"]] },
  ];
  return (
    <section id="servicios" className="services">
      <div className="wrap">
        <div className="shead reveal">
          <div>
            <div className="eyebrow" style={{marginBottom:18}}>· 03 — Disciplinas</div>
            <h2 className="display">Lo que <em className="italic" style={{color:'var(--accent)'}}>hacemos</em></h2>
          </div>
          <div className="right">
            <p>Tres disciplinas, un mismo estándar. Materiales certificados, ambiente esterilizado y diseño firmado.</p>
          </div>
        </div>
        <div className="svcgrid reveal" style={{marginTop:36}}>
          {list.map((s,i)=> (
            <div key={i} className="svc">
              <div className="num">{s.n}</div>
              <h3>{s.t.replace(s.em,'')}<em>{s.em}</em></h3>
              <p>{s.d}</p>
              <ul>{s.items.map((it,j)=> <li key={j}><span>{it[0]}</span><span>{it[1]}</span></li>)}</ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- PROCESO ----------
function Process(){
  const steps = [
    { n:"01", t:"Conversación", d:"Contás tu idea, referencias y zona del cuerpo. Resolvemos viabilidad y presupuesto." },
    { n:"02", t:"Diseño", d:"Bocetamos juntos. Iteramos hasta que la pieza sea exactamente lo que buscás." },
    { n:"03", t:"Sesión", d:"Estudio íntimo, materiales certificados y descansos. El tiempo es tuyo." },
    { n:"04", t:"Cuidado", d:"Te entregamos guía de cuidado, retoque incluido a 30 días." },
  ];
  return (
    <section id="proceso" className="process">
      <div className="wrap">
        <div className="shead reveal">
          <div>
            <div className="eyebrow" style={{marginBottom:18}}>· 04 — Proceso</div>
            <h2 className="display">De idea a <em className="italic" style={{color:'var(--accent)'}}>piel</em></h2>
          </div>
          <div className="right">
            <p>Un método claro para que cada pieza salga sin sorpresas — desde la primera charla hasta el último retoque.</p>
          </div>
        </div>
        <div className="steps">
          {steps.map((s,i)=> (
            <div key={i} className={`step reveal delay-${i+1}`}>
              <span className="n">{s.n}</span>
              <h4>{s.t}</h4>
              <p>{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- CONTACT ----------
function Contact(){
  const [form, setForm] = useState({ name:"", email:"", phone:"", style:"Fineline botánico", placement:"", size:"S (5–10cm)", note:"", date:"" });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const sizes = ["XS (<5cm)","S (5–10cm)","M (10–20cm)","L (20cm+)","Manga / amplia"];
  const styles = ["Fineline botánico","Black & Grey","Linework","Cover up","Lettering","Piercing"];

  const set = (k,v) => { setForm(f => ({...f,[k]:v})); setErrors(e=>({...e,[k]:null})); };

  const submit = (e) => {
    e.preventDefault();
    const er = {};
    if (!form.name.trim()) er.name = "Requerido";
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(form.email)) er.email = "Email inválido";
    if (!form.placement.trim()) er.placement = "Indicá la zona";
    if (!form.note.trim() || form.note.length < 10) er.note = "Contanos un poco más (mín. 10 caracteres)";
    setErrors(er);
    if (Object.keys(er).length) return;
    setLoading(true);

    const fd = new FormData();
    fd.append("form-name", "contacto");
    fd.append("name", form.name);
    fd.append("email", form.email);
    fd.append("phone", form.phone);
    fd.append("placement", form.placement);
    fd.append("date", form.date);
    fd.append("size", form.size);
    fd.append("note", form.note);

    fetch("/", {
      method: "POST",
      body: new URLSearchParams(fd).toString(),
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    })
      .then((r) => { console.log("Netlify form:", r.status); setLoading(false); setSent(true); })
      .catch((err) => { console.error("Netlify form error:", err); setLoading(false); setSent(true); });
  };

  return (
    <section id="contacto" className="contact">
      <div className="wrap">
        <div className="cgrid">
          <div className="reveal">
            <div className="eyebrow" style={{marginBottom:18}}>· 05 — Contacto</div>
            <h2 className="display">Reservá tu<br/><em>sesión.</em></h2>
            <p className="ctxt">Contanos tu idea — respondemos en 24-48h con disponibilidad, presupuesto y los próximos pasos. Las consultas son sin compromiso.</p>

            <div className="infoblock">
              <div className="b">
                <div className="k">Estudio</div>
                <div className="v">General Lavalleja 1234<br/>Parque del Plata, Canelones<br/>Uruguay</div>
              </div>
              <div className="b">
                <div className="k">Horario</div>
                <div className="v">Mar — Sáb<br/>11:00 — 20:00<br/>Solo con cita</div>
              </div>
              <div className="b">
                <div className="k">Email</div>
                <div className="v"><a href="mailto:hola@sbiere.studio">hola@sbiere.studio</a></div>
              </div>
              <div className="b">
                <div className="k">Whatsapp</div>
                <div className="v"><a href="https://wa.me/59899000000" target="_blank" rel="noreferrer">+598 99 000 000</a></div>
              </div>
            </div>

            <div className="socialrow">
              <a href="#" target="_blank" rel="noreferrer">{I.ig()}<span>@sbiere.tattoo</span></a>
              <a href="#" target="_blank" rel="noreferrer">{I.wa()}<span>Whatsapp directo</span></a>
              <a href="mailto:hola@sbiere.studio">{I.mail()}<span>Email</span></a>
            </div>
          </div>

          <div className="reveal delay-2">
            {sent ? (
              <form className="bookform">
                <div className="ok">
                  <div className="icn">{I.check()}</div>
                  <h4>Recibimos tu consulta.</h4>
                  <p>Gracias, {form.name.split(" ")[0]}. Te respondemos a <b style={{color:'var(--bone)'}}>{form.email}</b> en 24-48h.</p>
                  <button type="button" className="ghostbtn" style={{marginTop:18}} onClick={()=>{setSent(false);setForm({name:"",email:"",phone:"",style:"Fineline botánico",placement:"",size:"S (5–10cm)",note:"",date:""})}}>Enviar otra ←</button>
                </div>
              </form>
            ) : (
            <form className="bookform" onSubmit={submit} noValidate name="contacto" data-netlify="true">
              <input type="hidden" name="form-name" value="contacto" />
              <div className="formhead">
                <span className="t">Solicitud de cita</span>
                <span className="ix">SB · 26-04</span>
              </div>

              <div className="row2">
                <div className="field">
                  <label>Nombre {errors.name && <span className="err">{errors.name}</span>}</label>
                  <input value={form.name} onChange={e=>set('name',e.target.value)} placeholder="Tu nombre completo" />
                </div>
                <div className="field">
                  <label>Email {errors.email && <span className="err">{errors.email}</span>}</label>
                  <input type="email" value={form.email} onChange={e=>set('email',e.target.value)} placeholder="hola@email.com" />
                </div>
              </div>

              <div className="row2">
                <div className="field">
                  <label>Teléfono <span style={{color:'var(--ash-2)',textTransform:'none',letterSpacing:'normal'}}>opcional</span></label>
                  <input value={form.phone} onChange={e=>set('phone',e.target.value)} placeholder="+598 ..." />
                </div>
                <div className="field">
                  <label>Fecha tentativa</label>
                  <input type="date" value={form.date} onChange={e=>set('date',e.target.value)} />
                </div>
              </div>

              <div className="field">
                <label>Zona del cuerpo {errors.placement && <span className="err">{errors.placement}</span>}</label>
                <input value={form.placement} onChange={e=>set('placement',e.target.value)} placeholder="Antebrazo, pantorrilla, ..." />
              </div>

              <div className="field">
                <label>Tamaño aproximado</label>
                <div className="chips">
                  {sizes.map(s => (
                    <button key={s} type="button" className={form.size===s?'on':''} onClick={()=>set('size',s)}>{s}</button>
                  ))}
                </div>
              </div>

              <div className="field">
                <label>Cuéntanos tu idea {errors.note && <span className="err">{errors.note}</span>}</label>
                <textarea value={form.note} onChange={e=>set('note',e.target.value)} placeholder="Referencias, simbolismos, lo que tengas en mente..." />
              </div>

              <div className="submit">
                <button type="button" className="ghostbtn" onClick={()=>setForm({name:"",email:"",phone:"",style:"Fineline botánico",placement:"",size:"S (5–10cm)",note:"",date:""})}>Limpiar</button>
                <button type="submit" className="btn" disabled={loading}>
                  {loading ? "Enviando..." : "Enviar solicitud"} {!loading && <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>}
                </button>
              </div>
            </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- FOOTER ----------
function Footer(){
  return (
    <footer>
      <div className="ftop">
        <div>
          <div className="colossal">SBiere<em>.</em></div>
          <p style={{color:'var(--ash)',marginTop:18,maxWidth:'34ch',fontSize:13.5}}>Estudio de tatuaje y piercing — diseño firmado, ambiente íntimo, archivo curado.</p>
        </div>
        <div>
          <h5>Estudio</h5>
          <ul>
            <li><a href="#trabajo">Trabajo</a></li>
            <li><a href="#galeria">Galería</a></li>
            <li><a href="#servicios">Servicios</a></li>
            <li><a href="#proceso">Proceso</a></li>
          </ul>
        </div>
        <div>
          <h5>Reservas</h5>
          <ul>
            <li><a href="#contacto">Solicitar cita</a></li>
            <li><a href="https://wa.me/59899000000">Whatsapp</a></li>
            <li><a href="mailto:hola@sbiere.studio">hola@sbiere.studio</a></li>
          </ul>
        </div>
        <div>
          <h5>Social</h5>
          <ul>
            <li><a href="#">Instagram</a></li>
            <li><a href="#">TikTok</a></li>
            <li><a href="#">Pinterest</a></li>
          </ul>
        </div>
      </div>
      <div className="fbot">
        <span>© 2026 SBiere Studio · Todos los derechos reservados</span>
        <span>Diseñado con tinta y código · MVD</span>
      </div>
    </footer>
  );
}

// ---------- LIGHTBOX ----------
function Lightbox({ openId, onClose }){
  const list = WORKS;
  const idx = list.findIndex(w => w.id===openId);
  const [i, setI] = useState(idx>=0?idx:0);
  useEffect(() => { if (idx>=0) setI(idx); }, [idx]);
  useEffect(() => {
    if (openId==null) return;
    const fn = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setI(v => (v+1)%list.length);
      if (e.key === 'ArrowLeft') setI(v => (v-1+list.length)%list.length);
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [openId, list.length, onClose]);

  if (openId == null) return null;
  const w = list[i];
  return (
    <div className="lbox open" onClick={onClose}>
      <div className="lcontent" onClick={(e)=>e.stopPropagation()}>
        <button className="close" onClick={onClose}>{I.close()}</button>
        <button className="nav prev" onClick={()=>setI(v=>(v-1+list.length)%list.length)}>{I.arrow("left")}</button>
        <button className="nav next" onClick={()=>setI(v=>(v+1)%list.length)}>{I.arrow("right")}</button>
        <div className="lmedia">
          {w.type==="video"
            ? <video src={w.src} controls autoPlay loop muted playsInline />
            : <img src={w.src} alt={w.title}/>
          }
        </div>
        <div className="lside">
          <div>
            <div className="mono" style={{color:'var(--accent)'}}>PIEZA · {String(w.id).padStart(3,'0')}</div>
            <h3 style={{marginTop:14}}>{w.title}</h3>
            <p className="desc" style={{marginTop:14}}>{w.style}. {w.note || "Pieza única, ejecutada en estudio."}</p>
          </div>
          <div>
            <div className="dl">
              <div><span>Estilo</span><span>{w.style}</span></div>
              <div><span>Zona</span><span>{w.placement}</span></div>
              <div><span>Sesión</span><span>{w.session}</span></div>
              <div><span>Categoría</span><span>{FILTERS.find(f=>f.k===w.category)?.l || w.category}</span></div>
            </div>
            <a href="#contacto" className="btn" style={{marginTop:20,width:'100%',justifyContent:'center'}} onClick={onClose}>Quiero algo así <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- APP ----------
function App(){
  const [active, setActive] = useState('hero');
  const [menu, setMenu] = useState(false);
  const [openId, setOpenId] = useState(null);
  useReveal();

  const onNav = (k) => {
    const el = document.getElementById(k);
    if (el) window.scrollTo({ top: el.offsetTop - 60, behavior: 'smooth' });
  };

  // scroll spy
  useEffect(() => {
    const ids = ['hero','trabajo','galeria','servicios','proceso','contacto'];
    const fn = () => {
      const y = window.scrollY + window.innerHeight*0.3;
      let cur = 'hero';
      ids.forEach(id => {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= y) cur = id;
      });
      setActive(cur);
    };
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // lock scroll when lightbox open
  useEffect(() => {
    document.body.style.overflow = openId!=null ? 'hidden' : '';
  }, [openId]);

  return (
    <>
      <Nav active={active} onNav={onNav} openMenu={menu} setOpenMenu={setMenu} />
      <Hero />
      <Marquee />
      <Carousel onOpen={setOpenId} />
      <Collage onOpen={setOpenId} />
      <Services />
      <Process />
      <Contact />
      <Footer />
      <Lightbox openId={openId} onClose={()=>setOpenId(null)} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('app')).render(<App />);
