const { useState, useEffect, useRef, useMemo } = React;

/* ───────────────────── Echo Stack ───────────────────── */
function Echo({ children, size = "clamp(72px, 11vw, 220px)", className = "" }) {
  const layers = [
    { t: "0", l: "0", c: "var(--echo-4)" },
    { t: "-0.04em", l: "-0.04em", c: "var(--echo-3)" },
    { t: "-0.08em", l: "-0.08em", c: "var(--echo-2)" },
    { t: "-0.12em", l: "-0.12em", c: "var(--echo-1)" },
  ];
  return (
    <span
      className={"clash " + className}
      style={{ position: "relative", display: "inline-block", fontSize: size, lineHeight: 0.9 }}
    >
      {layers.map((l, i) => (
        <span key={i} aria-hidden style={{ position: "absolute", top: l.t, left: l.l, color: l.c, pointerEvents: "none", whiteSpace: "nowrap" }}>
          {children}
        </span>
      ))}
      <span style={{ position: "relative", color: "var(--ink)", whiteSpace: "nowrap" }}>{children}</span>
    </span>
  );
}

/* ───────────────────── Nav ───────────────────── */
function Nav({ onContact }) {
  const [solid, setSolid] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const f = () => setSolid(window.scrollY > 40);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);

  useEffect(() => {
    const f = () => { if (window.innerWidth > 768) setMobileOpen(false); };
    window.addEventListener("resize", f);
    return () => window.removeEventListener("resize", f);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const navLinks = [
    ["Our Listings", "#portfolio"],
    ["About Us", "#practice"],
    ["Market Updates", "#insights"],
    ["About", "#about"],
  ];

  const handleMobileLink = (href) => {
    setMobileOpen(false);
    setTimeout(() => {
      const el = document.querySelector(href);
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
    }, 300);
  };

  return (
    <>
      <header
        style={{
          position: "sticky", top: 0, zIndex: 40, height: 80,
          background: solid || mobileOpen ? "rgba(242,242,242,0.97)" : "rgba(242,242,242,0.0)",
          backdropFilter: solid ? "blur(12px)" : "none",
          WebkitBackdropFilter: solid ? "blur(12px)" : "none",
          borderBottom: solid ? "1px solid var(--line)" : "1px solid transparent",
          transition: "background 250ms ease, border-color 250ms ease",
        }}
      >
        <div className="container" style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="#top" onClick={() => setMobileOpen(false)} style={{ display: "flex", alignItems: "center", gap: 14, zIndex: 1 }}>
            <Crown />
            <div style={{ lineHeight: 1.05 }}>
              <div className="clash" style={{ fontSize: 20, letterSpacing: "-0.03em" }}>
                WISE <span style={{ fontFamily: "Gambarino, Georgia, serif", fontStyle: "italic", fontWeight: 400, letterSpacing: "-0.02em" }}>Properties</span>
              </div>
              <div className="uc" style={{ fontSize: 10, color: "var(--mute)", letterSpacing: "0.16em" }}>Mohali · Punjab</div>
            </div>
          </a>

          {/* Desktop nav */}
          <nav className="hide-mobile" style={{ display: "flex", alignItems: "center", gap: 36 }}>
            {navLinks.map(([label, href]) => (
              <a key={label} href={href} className="uc"
                style={{ fontSize: 13, color: "var(--ink)", transition: "color 120ms ease" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--mute-2)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--ink)")}
              >{label}</a>
            ))}
            <button onClick={onContact} className="uc"
              style={{ fontSize: 12, letterSpacing: "0.12em", padding: "12px 22px", borderRadius: 999, border: "1px solid var(--ink-2)", background: "transparent", color: "var(--ink-2)", cursor: "pointer", transition: "background 200ms ease, color 200ms ease" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--ink-2)"; e.currentTarget.style.color = "var(--bg)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--ink-2)"; }}
            >Schedule a Site Visit</button>
          </nav>

          {/* Hamburger */}
          <button
            className="show-mobile"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            style={{ width: 44, height: 44, borderRadius: 999, border: "1px solid var(--line)", background: "transparent", cursor: "pointer", alignItems: "center", justifyContent: "center", flexShrink: 0, zIndex: 1 }}
          >
            {mobileOpen
              ? <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 2l12 12M14 2L2 14" stroke="#111" strokeWidth="1.5" strokeLinecap="round"/></svg>
              : <svg width="18" height="14" viewBox="0 0 18 14" fill="none"><path d="M1 1h16M1 7h16M1 13h16" stroke="#111" strokeWidth="1.5" strokeLinecap="round"/></svg>
            }
          </button>
        </div>
      </header>

      {/* Mobile overlay menu */}
      <div className={"mobile-nav " + (mobileOpen ? "open" : "")}>
        <div style={{ flex: 1 }}>
          {navLinks.map(([label, href], i) => (
            <a
              key={label}
              href={href}
              onClick={(e) => { e.preventDefault(); handleMobileLink(href); }}
              className="clash"
              style={{
                display: "block", fontSize: "clamp(40px,11vw,64px)", letterSpacing: "-0.04em",
                color: "var(--ink)", padding: "12px 0",
                borderBottom: i < navLinks.length - 1 ? "1px solid var(--line)" : "none",
                lineHeight: 1.1,
              }}
            >{label}</a>
          ))}
        </div>
        <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 16 }}>
          <button
            onClick={() => { setMobileOpen(false); setTimeout(onContact, 300); }}
            className="uc"
            style={{ fontSize: 13, letterSpacing: "0.12em", padding: "18px 28px", borderRadius: 999, border: "none", background: "var(--ink-2)", color: "var(--bg)", cursor: "pointer", textAlign: "center" }}
          >Schedule a Site Visit →</button>
          <a href="tel:+91XXXXXXXXXX" className="uc" style={{ fontSize: 12, letterSpacing: "0.14em", color: "var(--mute)", textAlign: "center" }}>
            {/* TODO: replace with Wise Properties phone */}+91 XXXXX XXXXX
          </a>
        </div>
      </div>
    </>
  );
}

function Crown() {
  return (
    <svg width="38" height="38" viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="19" stroke="#111" strokeWidth="1" />
      <path d="M10 22 L14 14 L20 19 L26 14 L30 22 L28 26 L12 26 Z" fill="#c89a3c" />
      <text x="20" y="24" textAnchor="middle" fontFamily="Clash Display, sans-serif" fontWeight="700" fontSize="9" fill="#111" letterSpacing="-0.02em">WP</text>
    </svg>
  );
}

/* ───────────────────── Hero ───────────────────── */
function Hero() {
  return (
    <section id="top" style={{ position: "relative", minHeight: "92vh", display: "flex", flexDirection: "column" }}>
      <div className="container" style={{ paddingTop: 64, paddingBottom: 32, flex: 1, display: "flex", flexDirection: "column" }}>
        <div className="hero-top" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 32, flexWrap: "wrap" }}>
          <div style={{ maxWidth: 360 }}>
            <div className="uc" style={{ fontSize: 11, color: "var(--mute)", letterSpacing: "0.18em", marginBottom: 16 }}>
              ◇ Index № 01 — Buy · Sell · Rent
            </div>
            <p style={{ margin: 0, fontSize: 15, color: "var(--ink-2)", lineHeight: 1.55, maxWidth: 320 }}>
              Your trusted one-stop real estate solution in Mohali and Zirakpur. Honest, first-hand guidance for residential and commercial property.
            </p>
          </div>
          <div className="hero-stats" style={{ display: "flex", gap: 48, alignItems: "flex-start", flexWrap: "wrap" }}>
            <Stat n="500+" label="Properties Listed" />
            <Stat n="300+" label="Happy Clients" />
            {/* TODO: update Years in Business once founding year is confirmed */}
            <Stat n="5+" label="Years in Business" />
          </div>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", paddingTop: 56, paddingBottom: 24, overflow: "hidden" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <Echo size="clamp(44px, 8.5vw, 170px)">FIND YOUR</Echo>
            <Echo size="clamp(44px, 8.5vw, 170px)">
              <span style={{ fontFamily: "Gambarino, Georgia, serif", fontStyle: "italic", fontWeight: 400, letterSpacing: "-0.04em" }}>dream </span>
              PROPERTY.
            </Echo>
          </div>
        </div>

        <div className="hero-bottom" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderTop: "1px solid var(--line)", paddingTop: 24, gap: 20, flexWrap: "wrap" }}>
          <div className="uc" style={{ fontSize: 11, color: "var(--mute)", letterSpacing: "0.18em" }}>
            SCO-545 · Sector 70 · Mohali · Punjab
          </div>
          <div style={{ display: "flex", gap: 28, alignItems: "center", flexWrap: "wrap" }}>
            <a href="#portfolio" className="uc" style={{ fontSize: 12, letterSpacing: "0.14em", borderBottom: "1px solid var(--ink)", paddingBottom: 4 }}>
              View Listings →
            </a>
            {/* TODO: replace with Wise Properties phone number */}
            <a href="tel:+91XXXXXXXXXX" className="uc" style={{ fontSize: 12, letterSpacing: "0.14em", color: "var(--mute)" }}>
              +91 XXXXX XXXXX
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ n, label }) {
  return (
    <div style={{ minWidth: 0 }}>
      <div className="clash mono-num" style={{ fontSize: "clamp(24px,4vw,32px)", letterSpacing: "-0.04em" }}>{n}</div>
      <div className="uc" style={{ fontSize: 10, color: "var(--mute)", letterSpacing: "0.16em", marginTop: 6 }}>{label}</div>
    </div>
  );
}

/* ───────────────────── Philosophy ───────────────────── */
function Philosophy() {
  return (
    <section id="practice" style={{ paddingTop: 100, paddingBottom: 100, background: "var(--bg)" }}>
      <div className="container">
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 56 }}>
          <div style={{ width: 1, height: 80, background: "var(--ink-2)", opacity: 0.6 }} />
        </div>
        <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
          <div className="uc" style={{ fontSize: 11, color: "var(--mute)", letterSpacing: "0.18em", marginBottom: 36 }}>◇ Our Approach</div>
          <p className="clash" style={{ fontSize: "clamp(28px, 5.4vw, 76px)", letterSpacing: "-0.04em", lineHeight: 1.05, margin: 0, fontWeight: 600 }}>
            We find you the <span className="serif-it" style={{ fontSize: "1.05em" }}>right property</span>.<br/>
            Not just <span className="serif-it" style={{ fontSize: "1.05em" }}>any</span> property.
          </p>
        </div>
        <div style={{ height: 72 }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 32, borderTop: "1px solid var(--line)", paddingTop: 48 }}>
          <Column no="01" head="Honest Guidance" body="We give you first-hand, unbiased advice based on your budget and lifestyle — not on what earns us the highest commission." />
          <Column no="02" head="Market Intelligence" body="Stay ahead with up-to-date knowledge of new launches, pre-launches, and exclusive offers across Mohali and Zirakpur before they go public." />
          <Column no="03" head="End-to-End Support" body="From the first site visit to the final registry, we handle every step — paperwork, negotiations, documentation — so you never feel lost." />
        </div>
      </div>
    </section>
  );
}

function Column({ no, head, body }) {
  return (
    <div>
      <div className="clash mono-num" style={{ fontSize: 14, color: "var(--mute)", marginBottom: 24 }}>{no} / 03</div>
      <h3 className="clash" style={{ fontSize: "clamp(22px,2.4vw,28px)", letterSpacing: "-0.03em", margin: "0 0 16px", lineHeight: 1.05, fontWeight: 600 }}>{head}</h3>
      <p style={{ margin: 0, color: "var(--ink-2)", fontWeight: 300, fontSize: 15, lineHeight: 1.6 }}>{body}</p>
    </div>
  );
}

/* ───────────────────── Showcase Grid ───────────────────── */
function Showcase({ onOpen, properties }) {
  const f = properties.slice(0, 4);
  const layouts = [
    { col: "span 8", row: "span 2", radius: 6, aspect: "16/10" },
    { col: "span 4", row: "span 2", radius: 9999, aspect: "9/16" },
    { col: "span 5", row: "span 1", radius: "50%", aspect: "1/1" },
    { col: "span 7", row: "span 1", radius: 6, aspect: "16/9" },
  ];
  return (
    <section style={{ paddingTop: 60, paddingBottom: 60 }}>
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 40, gap: 24, flexWrap: "wrap" }}>
          <h2 className="clash" style={{ fontSize: "clamp(36px, 6vw, 88px)", letterSpacing: "-0.05em", margin: 0, fontWeight: 700, flex: "1 1 300px", minWidth: 0 }}>
            Featured <span className="serif-it" style={{ fontWeight: 400 }}>Listings</span>
          </h2>
          <div style={{ flex: "0 1 320px", color: "var(--ink-2)", fontSize: 14, lineHeight: 1.5, paddingTop: 12 }}>
            A selection of current listings across Mohali and Zirakpur. Tap any tile for full details and to book a site visit.
          </div>
        </div>
        <div className="showcase-grid" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gridAutoRows: "minmax(200px, auto)", gap: 12 }}>
          {f.map((p, i) => {
            const l = layouts[i];
            return (
              <button key={p.id} onClick={() => onOpen(p)} className="gs-wrap"
                style={{ gridColumn: l.col, gridRow: l.row, border: "none", background: "transparent", padding: 0, cursor: "pointer", textAlign: "left", position: "relative", overflow: "hidden", borderRadius: l.radius, aspectRatio: l.aspect }}
              >
                <div className="gs" style={{ position: "absolute", inset: 0, backgroundImage: `url(${p.hero})`, backgroundSize: "cover", backgroundPosition: "center" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.55) 100%)" }} />
                <div style={{ position: "absolute", left: 16, right: 16, bottom: 18, color: "#f6f6f6" }}>
                  <div className="uc" style={{ fontSize: 10, letterSpacing: "0.18em", opacity: 0.85, marginBottom: 6 }}>{p.code} · {p.type}</div>
                  <div className="clash" style={{ fontSize: "clamp(16px,2vw,22px)", letterSpacing: "-0.03em", lineHeight: 1.05 }}>{p.title}</div>
                  <div style={{ fontSize: 13, opacity: 0.9, marginTop: 4 }}>{p.locality} — {p.price}</div>
                </div>
                <div style={{ position: "absolute", top: 14, right: 14, width: 40, height: 40, borderRadius: 999, border: "1px solid rgba(246,246,246,0.6)", color: "#f6f6f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>↗</div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────── Portfolio ───────────────────── */
function Portfolio({ properties, onOpen }) {
  const [type, setType] = useState("All");
  const [sort, setSort] = useState("Newest");
  const types = ["All", "Residential", "Commercial", "Plot"];

  const view = useMemo(() => {
    let v = properties.slice();
    if (type !== "All") v = v.filter((p) => p.type === type);
    v.sort((a, b) => {
      const an = parsePrice(a.price), bn = parsePrice(b.price);
      if (sort === "Price ↑") return an - bn;
      if (sort === "Price ↓") return bn - an;
      return new Date(b.listingDate) - new Date(a.listingDate);
    });
    return v;
  }, [properties, type, sort]);

  return (
    <section id="portfolio" style={{ paddingTop: 60, paddingBottom: 100, background: "var(--bg)" }}>
      <div className="container">
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24, flexWrap: "wrap", marginBottom: 28 }}>
          <div style={{ flex: "1 1 300px", minWidth: 0 }}>
            <div className="uc" style={{ fontSize: 11, color: "var(--mute)", letterSpacing: "0.18em", marginBottom: 16 }}>
              ◇ Index № 02 — Active Listings · {view.length} of {properties.length}
            </div>
            <h2 className="clash" style={{ fontSize: "clamp(48px, 9vw, 148px)", letterSpacing: "-0.06em", margin: 0, lineHeight: 0.9, fontWeight: 700 }}>
              Our <span className="serif-it" style={{ fontWeight: 400 }}>Listings</span>
            </h2>
          </div>
          <div style={{ flex: "0 1 360px", color: "var(--ink-2)", fontSize: 14, lineHeight: 1.55, paddingTop: 20 }}>
            Residential, commercial, and industrial properties across Mohali and Zirakpur. Click any row for full details, photographs, and to book a site visit.
          </div>
        </div>

        <div className="filter-rail" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--ink-2)", borderBottom: "1px solid var(--line)", padding: "16px 0", gap: 12, flexWrap: "wrap", marginBottom: 0 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {types.map((t) => (
              <button key={t} onClick={() => setType(t)} className="uc"
                style={{ fontSize: 11, letterSpacing: "0.14em", padding: "9px 16px", borderRadius: 999, border: "1px solid " + (type === t ? "var(--ink-2)" : "var(--line)"), background: type === t ? "var(--ink-2)" : "transparent", color: type === t ? "var(--bg)" : "var(--ink-2)", cursor: "pointer", transition: "all 200ms ease" }}
              >{t}</button>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span className="uc" style={{ fontSize: 10, letterSpacing: "0.18em", color: "var(--mute)" }}>Sort</span>
            <div style={{ display: "flex", gap: 0, border: "1px solid var(--line)", borderRadius: 999, overflow: "hidden" }}>
              {["Newest", "Price ↑", "Price ↓"].map((s) => (
                <button key={s} onClick={() => setSort(s)} className="uc"
                  style={{ fontSize: 11, letterSpacing: "0.14em", padding: "9px 14px", border: "none", background: sort === s ? "var(--ink-2)" : "transparent", color: sort === s ? "var(--bg)" : "var(--ink-2)", cursor: "pointer", whiteSpace: "nowrap" }}
                >{s}</button>
              ))}
            </div>
          </div>
        </div>

        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {view.map((p, i) => <ListingRow key={p.id} p={p} idx={i + 1} onOpen={() => onOpen(p)} />)}
        </ul>

        <div style={{ marginTop: 40, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <div className="uc" style={{ fontSize: 11, letterSpacing: "0.18em", color: "var(--mute)" }}>
            ⓘ More listings available on request — get in touch with us.
          </div>
          <a href="#contact" className="uc"
            style={{ fontSize: 12, letterSpacing: "0.14em", padding: "14px 24px", borderRadius: 999, background: "var(--ink-2)", color: "var(--bg)", display: "inline-flex", alignItems: "center", gap: 10 }}
          >Request Full Listings <span style={{ fontSize: 16 }}>→</span></a>
        </div>
      </div>
    </section>
  );
}

function parsePrice(s) {
  const m = s.match(/([\d.]+)/);
  const n = m ? parseFloat(m[1]) : 0;
  if (/cr/i.test(s)) return n * 100;
  return n;
}

function ListingRow({ p, idx, onOpen }) {
  const [hover, setHover] = useState(false);
  const [wide, setWide] = useState(typeof window !== "undefined" ? window.innerWidth >= 1100 : true);
  useEffect(() => {
    const f = () => setWide(window.innerWidth >= 1100);
    window.addEventListener("resize", f);
    return () => window.removeEventListener("resize", f);
  }, []);

  return (
    <li
      onClick={onOpen}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="listing-row"
      style={{
        display: "grid",
        gridTemplateColumns: wide
          ? "48px 96px minmax(0,1fr) 160px auto 48px"
          : "40px 72px minmax(0,1fr) auto 40px",
        gap: wide ? 20 : 14,
        alignItems: "center",
        padding: "22px 8px",
        borderBottom: "1px solid var(--line)",
        cursor: "pointer",
        background: hover ? "var(--ink-2)" : "transparent",
        color: hover ? "var(--bg)" : "var(--ink-2)",
        transition: "background 350ms cubic-bezier(0.77,0,0.175,1), color 350ms cubic-bezier(0.77,0,0.175,1)",
      }}
    >
      <div className="clash mono-num" style={{ fontSize: 13, opacity: 0.7 }}>{String(idx).padStart(2, "0")}</div>
      <div
        className="listing-thumb"
        style={{ width: wide ? 96 : 72, height: wide ? 64 : 52, borderRadius: 4, overflow: "hidden", backgroundImage: `url(${p.hero})`, backgroundSize: "cover", backgroundPosition: "center", filter: hover ? "grayscale(0)" : "grayscale(0.8)", transition: "filter 500ms ease, transform 500ms ease", transform: hover ? "scale(1.03)" : "scale(1)", flexShrink: 0 }}
      />
      <div style={{ minWidth: 0 }}>
        <div className="clash" style={{ fontSize: wide ? 21 : 17, letterSpacing: "-0.03em", lineHeight: 1.1, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {p.title}
        </div>
        <div style={{ fontSize: 12, opacity: 0.75, marginTop: 5, display: "flex", gap: 8, flexWrap: "wrap" }}>
          <span>{p.locality}</span>
          <span style={{ opacity: 0.5 }}>·</span>
          <span>{p.builtUp !== "—" ? p.builtUp : p.plotSize}</span>
          {p.bedrooms != null && <><span style={{ opacity: 0.5 }}>·</span><span>{p.bedrooms} BR</span></>}
          <span style={{ opacity: 0.5 }}>·</span>
          <span className="uc" style={{ letterSpacing: "0.12em", fontSize: 10 }}>{p.status.split(" — ")[0]}</span>
        </div>
      </div>
      {wide && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
          {p.tags.slice(0, 2).map((t) => (
            <span key={t} className="uc" style={{ fontSize: 9, letterSpacing: "0.14em", padding: "5px 9px", border: "1px solid " + (hover ? "rgba(242,242,242,0.4)" : "var(--line)"), borderRadius: 999, whiteSpace: "nowrap" }}>{t}</span>
          ))}
        </div>
      )}
      <div className="clash mono-num" style={{ fontSize: wide ? 22 : 16, letterSpacing: "-0.03em", textAlign: "right", fontWeight: 600, whiteSpace: "nowrap" }}>{p.price}</div>
      <div style={{ width: 36, height: 36, borderRadius: 999, border: "1px solid " + (hover ? "rgba(242,242,242,0.5)" : "var(--line)"), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, marginLeft: "auto", transition: "all 250ms ease", transform: hover ? "rotate(-45deg)" : "rotate(0deg)", flexShrink: 0 }}>→</div>
    </li>
  );
}

/* ───────────────────── Property Detail Sheet ───────────────────── */
function DetailSheet({ p, onClose }) {
  const open = !!p;
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const lastRef = useRef(p);
  if (p) lastRef.current = p;
  const data = lastRef.current;

  return (
    <>
      <div className={"scrim " + (open ? "open" : "")} onClick={onClose} />
      <aside className={"sheet " + (open ? "open" : "")} aria-hidden={!open}>
        {data && <DetailContent p={data} onClose={onClose} />}
      </aside>
    </>
  );
}

function DetailContent({ p, onClose }) {
  const [tab, setTab] = useState(0);
  return (
    <div>
      <div className="sheet-sticky" style={{ position: "sticky", top: 0, background: "var(--bg)", borderBottom: "1px solid var(--line)", padding: "20px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 2 }}>
        <div className="uc" style={{ fontSize: 11, letterSpacing: "0.18em", color: "var(--mute)" }}>Memo · {p.code}</div>
        <button onClick={onClose} aria-label="Close"
          style={{ width: 40, height: 40, borderRadius: 999, border: "1px solid var(--ink-2)", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
        ><span style={{ fontSize: 16 }}>✕</span></button>
      </div>

      <div className="sheet-body" style={{ padding: "40px 32px 80px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 20, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 280px", minWidth: 0 }}>
            <div className="uc" style={{ fontSize: 11, letterSpacing: "0.16em", color: "var(--mute)", marginBottom: 12 }}>{p.type} · {p.subType}</div>
            <h2 className="clash sheet-title" style={{ fontSize: "clamp(36px, 6vw, 64px)", letterSpacing: "-0.045em", margin: 0, lineHeight: 0.95, fontWeight: 700 }}>{p.title}</h2>
            <div style={{ marginTop: 14, fontSize: 15, color: "var(--ink-2)" }}>{p.locality}</div>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div className="uc" style={{ fontSize: 10, letterSpacing: "0.16em", color: "var(--mute)", marginBottom: 6 }}>Asking Price</div>
            <div className="clash mono-num sheet-price" style={{ fontSize: 40, letterSpacing: "-0.04em", fontWeight: 700 }}>{p.price}</div>
            <div style={{ fontSize: 13, color: "var(--mute)", marginTop: 4 }}>{p.pricePerSqft}</div>
          </div>
        </div>

        <ImageReveal src={p.hero} alt={p.title} />

        <div className="spec-strip" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0, border: "1px solid var(--line)", borderRadius: 6, marginTop: 24, overflow: "hidden", background: "var(--paper)" }}>
          <Spec label="Built-up" v={p.builtUp} />
          <Spec label="Plot" v={p.plotSize} />
          <Spec label="Facing" v={p.facing} />
          <Spec label="Floor / Age" v={`${p.floor} · ${p.age}`} />
        </div>

        <div className="tab-bar" style={{ display: "flex", gap: 24, borderBottom: "1px solid var(--line)", marginTop: 44, marginBottom: 28 }}>
          {["Overview", "Specifications", "Title & Compliance", "Viewing"].map((t, i) => (
            <button key={t} onClick={() => setTab(i)} className="uc"
              style={{ fontSize: 11, letterSpacing: "0.16em", padding: "14px 0", border: "none", background: "transparent", color: tab === i ? "var(--ink)" : "var(--mute)", borderBottom: "2px solid " + (tab === i ? "var(--ink)" : "transparent"), cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}
            >{t}</button>
          ))}
        </div>

        {tab === 0 && <Overview p={p} />}
        {tab === 1 && <Specifications p={p} />}
        {tab === 2 && <Compliance p={p} />}
        {tab === 3 && <Viewing p={p} />}
      </div>
    </div>
  );
}

function ImageReveal({ src, alt }) {
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVis(true), 60);
    return () => clearTimeout(t);
  }, []);
  return (
    <div style={{ marginTop: 28, aspectRatio: "16/10", overflow: "hidden", borderRadius: 6, background: "#e5e5e5", position: "relative" }}>
      <img src={src} alt={alt} className={"reveal " + (vis ? "in" : "")} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
    </div>
  );
}

function Spec({ label, v }) {
  return (
    <div style={{ padding: "18px 20px", borderRight: "1px solid var(--line)" }}>
      <div className="uc" style={{ fontSize: 10, letterSpacing: "0.16em", color: "var(--mute)", marginBottom: 8 }}>{label}</div>
      <div className="clash" style={{ fontSize: "clamp(14px,2vw,18px)", letterSpacing: "-0.02em", fontWeight: 600 }}>{v}</div>
    </div>
  );
}

function Overview({ p }) {
  return (
    <div>
      <p className="clash" style={{ fontSize: "clamp(20px,3vw,26px)", letterSpacing: "-0.03em", lineHeight: 1.2, margin: 0, fontWeight: 500 }}>{p.summary}</p>
      <p style={{ marginTop: 20, color: "var(--ink-2)", lineHeight: 1.65, fontSize: 15 }}>{p.detail}</p>
      <h4 className="clash" style={{ fontSize: 18, letterSpacing: "-0.02em", marginTop: 36, marginBottom: 14 }}>Amenities</h4>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {p.amenities.map((a) => (
          <span key={a} className="uc" style={{ fontSize: 10, letterSpacing: "0.14em", padding: "9px 14px", border: "1px solid var(--line)", borderRadius: 999, background: "var(--paper)" }}>{a}</span>
        ))}
      </div>
      {p.gallery && p.gallery.length > 0 && (
        <>
          <h4 className="clash" style={{ fontSize: 18, letterSpacing: "-0.02em", marginTop: 36, marginBottom: 14 }}>Gallery</h4>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))", gap: 10 }}>
            {p.gallery.map((g, i) => (
              <div key={i} style={{ aspectRatio: "4/3", backgroundImage: `url(${g})`, backgroundSize: "cover", backgroundPosition: "center", borderRadius: 4, filter: "grayscale(0.4)" }} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function Specifications({ p }) {
  const rows = [
    ["Property Code", p.code], ["Type", p.subType], ["Locality", p.locality],
    ["Plot Size", p.plotSize], ["Built-up Area", p.builtUp],
    ["Bedrooms", p.bedrooms ?? "—"], ["Bathrooms", p.bathrooms ?? "—"],
    ["Facing", p.facing], ["Parking", p.parking], ["Furnishing", p.furnishing],
    ["Floor", p.floor], ["Age", p.age], ["Status", p.status], ["Listed", p.listingDate],
  ];
  return (
    <div style={{ borderTop: "1px solid var(--line)" }}>
      {rows.map(([k, v]) => (
        <div key={k} className="spec-row" style={{ display: "grid", gridTemplateColumns: "200px 1fr", padding: "14px 4px", borderBottom: "1px solid var(--line)", gap: 12 }}>
          <div className="uc" style={{ fontSize: 11, letterSpacing: "0.14em", color: "var(--mute)" }}>{k}</div>
          <div style={{ fontSize: 15, color: "var(--ink-2)" }}>{v}</div>
        </div>
      ))}
    </div>
  );
}

function Compliance({ p }) {
  return (
    <div>
      <div className="compliance-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <ComplianceCard h="RERA Registration" v={p.rera} note="Punjab Real Estate Regulatory Authority" />
        <ComplianceCard h="Approval" v="GMADA Sanctioned" note="Greater Mohali Area Development Authority" />
        <ComplianceCard h="Title" v="Clear, single owner" note="Fard, jamabandi and mutation verified by the desk" />
        <ComplianceCard h="Dues" v="All cleared" note="Property tax · Electricity · Water · Maintenance" />
      </div>
      <div style={{ marginTop: 24, padding: 24, background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 6 }}>
        <div className="uc" style={{ fontSize: 10, letterSpacing: "0.16em", color: "var(--mute)", marginBottom: 8 }}>Desk Note</div>
        <p style={{ margin: 0, fontSize: 15, color: "var(--ink-2)", lineHeight: 1.6 }}>
          A complete title memo (12 pages) and a physical inspection report are released to a buyer on confirmation of intent. Token cheques are held in escrow with our retained law firm at Chandigarh District Court.
        </p>
      </div>
    </div>
  );
}

function ComplianceCard({ h, v, note }) {
  return (
    <div style={{ border: "1px solid var(--line)", padding: "20px 20px", borderRadius: 6, background: "var(--paper)" }}>
      <div className="uc" style={{ fontSize: 10, letterSpacing: "0.16em", color: "var(--mute)", marginBottom: 10 }}>{h}</div>
      <div className="clash" style={{ fontSize: "clamp(16px,2.5vw,22px)", letterSpacing: "-0.02em", fontWeight: 600 }}>{v}</div>
      <div style={{ marginTop: 8, fontSize: 13, color: "var(--mute)" }}>{note}</div>
    </div>
  );
}

function Viewing({ p }) {
  const [sent, setSent] = useState(false);
  return (
    <div>
      <p style={{ fontSize: 15, color: "var(--ink-2)", lineHeight: 1.6, marginTop: 0 }}>
        Viewings of <strong>{p.code}</strong> at <strong>{p.locality}</strong> are arranged by appointment. Please leave a contact and a time window; the desk responds within four working hours.
      </p>
      {!sent ? (
        <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="viewing-form"
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 24 }}
        >
          <Field label="Name" name="name" />
          <Field label="Phone" name="phone" type="tel" defaultValue="+91 " />
          <Field label="Email" name="email" type="email" wide />
          <Field label="Preferred date & time" name="when" placeholder="e.g. Sat, 4–6 PM" wide />
          <Field label="Note" name="note" textarea wide placeholder="Anything we should know — funding, holding period, comparables you have seen…" />
          <div style={{ gridColumn: "1 / -1", display: "flex", gap: 16, alignItems: "center", marginTop: 8, flexWrap: "wrap" }}>
            <button type="submit" className="uc" style={{ fontSize: 12, letterSpacing: "0.14em", padding: "16px 28px", borderRadius: 999, background: "var(--ink-2)", color: "var(--bg)", border: "none", cursor: "pointer" }}>
              Request Viewing →
            </button>
            {/* TODO: replace with Wise Properties phone number */}
            <a href="tel:+91XXXXXXXXXX" className="uc" style={{ fontSize: 12, letterSpacing: "0.14em", color: "var(--mute)" }}>
              or call +91 XXXXX XXXXX
            </a>
          </div>
        </form>
      ) : (
        <div style={{ marginTop: 24, padding: 32, border: "1px solid var(--ink-2)", borderRadius: 6, background: "var(--paper)" }}>
          <div className="uc" style={{ fontSize: 10, letterSpacing: "0.16em", color: "var(--mute)", marginBottom: 10 }}>Received</div>
          <div className="clash" style={{ fontSize: "clamp(22px,4vw,28px)", letterSpacing: "-0.03em", fontWeight: 600 }}>Thank you. The desk will revert shortly.</div>
          <div style={{ marginTop: 12, color: "var(--mute)", fontSize: 14 }}>Reference: VR-{p.code}-{Math.floor(Math.random() * 9000 + 1000)}</div>
        </div>
      )}
    </div>
  );
}

function Field({ label, name, type = "text", textarea, wide, ...rest }) {
  const Comp = textarea ? "textarea" : "input";
  return (
    <label style={{ gridColumn: wide ? "1 / -1" : "auto", display: "flex", flexDirection: "column", gap: 8 }}>
      <span className="uc" style={{ fontSize: 10, letterSpacing: "0.16em", color: "var(--mute)" }}>{label}</span>
      <Comp name={name} type={type} rows={textarea ? 3 : undefined} {...rest}
        style={{ background: "transparent", border: "none", borderBottom: "1px solid var(--ink-2)", padding: "10px 0", fontFamily: "inherit", fontSize: 15, color: "var(--ink)", outline: "none", resize: "vertical" }}
      />
    </label>
  );
}

/* ───────────────────── Services ───────────────────── */
function Services() {
  const items = [
    { no: "i", head: "Residential Property Sales", body: "Flats, kothis, builder floors, villas, penthouses and residential plots across Mohali and Zirakpur. From first visit to final registry." },
    { no: "ii", head: "Residential Rentals", body: "Find the right home on rent — 1 BHK to 4 BHK apartments, independent houses, studio apartments, and furnished options." },
    { no: "iii", head: "Commercial Sales & Leasing", body: "SCOs, showrooms, office spaces, business centers, and commercial plots. We represent both buyers and tenants with honest market guidance." },
    { no: "iv", head: "Industrial & Warehouse Properties", body: "Factories, industrial sheds, and warehouse spaces in and around Mohali and Zirakpur. Full paperwork support included." },
    { no: "v", head: "New Launch & Pre-Launch Advisory", body: "Be the first to know about new and upcoming project launches with the best pricing and inventory — before they go public." },
    { no: "vi", head: "Property Buying Assistance", body: "We shortlist properties that match your budget and preferences, arrange site visits, and negotiate on your behalf for the best deal." },
    { no: "vii", head: "Property Selling Assistance", body: "We market your property to genuine buyers, handle inquiries, conduct viewings, and close at the right price with minimal hassle." },
    { no: "viii", head: "Honest Market Guidance", body: "No pressure, no inflated valuations. We give you real data on current market rates so you can make informed decisions every time." },
  ];
  return (
    <section id="insights" style={{ paddingTop: 100, paddingBottom: 100, background: "var(--bg)" }}>
      <div className="container">
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 56, flexWrap: "wrap", gap: 24 }}>
          <h2 className="clash" style={{ fontSize: "clamp(40px, 7vw, 108px)", letterSpacing: "-0.05em", margin: 0, lineHeight: 0.92, fontWeight: 700, flex: "1 1 300px", minWidth: 0 }}>
            Bespoke <span className="serif-it" style={{ fontWeight: 400 }}>services</span>
          </h2>
          <div style={{ flex: "0 1 340px", fontSize: 14, color: "var(--ink-2)", lineHeight: 1.55, paddingTop: 20 }}>
            One trusted agency. Whether you are buying, selling, or renting — residential or commercial — we have you covered.
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
          {items.map((it) => <ServiceCard key={it.no} {...it} />)}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ no, head, body }) {
  const [hov, setHov] = useState(false);
  return (
    <a href="#contact" onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display: "block", padding: "28px 28px", border: "1px solid var(--line)", background: hov ? "var(--paper)" : "transparent", borderRadius: 6, transition: "all 350ms cubic-bezier(0.77,0,0.175,1)", position: "relative", minHeight: 300 }}
    >
      <div style={{ width: 56, height: 56, border: "1px solid var(--ink-2)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24, transition: "transform 500ms cubic-bezier(0.77,0,0.175,1), background 350ms ease", transform: hov ? "rotate(12deg)" : "rotate(0deg)", background: hov ? "var(--ink-2)" : "transparent", color: hov ? "var(--bg)" : "var(--ink-2)" }}>
        <span className="clash" style={{ fontSize: 16, letterSpacing: "-0.02em", fontWeight: 600 }}>{no}</span>
      </div>
      <h3 className="clash" style={{ fontSize: "clamp(20px,2.5vw,24px)", letterSpacing: "-0.03em", margin: 0, lineHeight: 1.1, fontWeight: 600 }}>{head}</h3>
      <p style={{ marginTop: 14, color: "var(--ink-2)", fontWeight: 300, fontSize: 14, lineHeight: 1.6 }}>{body}</p>
      <div className="uc" style={{ marginTop: 20, fontSize: 11, letterSpacing: "0.18em", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 10 }}>
        Engage the desk
        <span style={{ display: "inline-block", transition: "transform 350ms ease", transform: hov ? "translateX(8px)" : "translateX(0)" }}>→</span>
      </div>
    </a>
  );
}

/* ───────────────────── About ───────────────────── */
function About() {
  return (
    <section id="about" style={{ paddingTop: 100, paddingBottom: 60 }}>
      <div className="container" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 56, alignItems: "flex-start" }}>
        <div className="about-photo-col" style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 360, width: "100%", justifySelf: "start" }}>
          <div style={{ border: "1px solid var(--line)", borderRadius: 6, padding: "20px 22px", background: "var(--paper)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14 }}>
            <div>
              <div className="clash" style={{ fontSize: 19, letterSpacing: "-0.02em", fontWeight: 600, lineHeight: 1.1 }}>[Owner Name]</div>
              <div className="uc" style={{ fontSize: 10, color: "var(--mute)", letterSpacing: "0.16em", marginTop: 6 }}>Founder & Principal Consultant</div>
            </div>
            <svg width="74" height="40" viewBox="0 0 120 60" fill="none" aria-hidden="true">
              <path d="M6 42 C 18 18, 28 18, 32 36 C 36 50, 42 18, 50 30 C 56 38, 60 22, 66 32 C 72 42, 78 26, 84 34 C 90 42, 98 30, 110 26" stroke="#111" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              <path d="M58 46 L 102 46" stroke="#111" strokeWidth="1" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        <div>
          <div className="uc" style={{ fontSize: 11, letterSpacing: "0.18em", color: "var(--mute)", marginBottom: 24 }}>◇ About Us</div>
          <p className="clash" style={{ fontSize: "clamp(24px, 3.6vw, 48px)", letterSpacing: "-0.035em", lineHeight: 1.15, margin: 0, fontWeight: 500 }}>
            Wise Properties is a <span className="serif-it">trusted real estate agency</span> based in Mohali — your <span className="serif-it">one-stop solution</span> for all property needs.
          </p>
          <p style={{ marginTop: 24, fontSize: 15, color: "var(--ink-2)", lineHeight: 1.7 }}>
            Whether you are buying, selling, or renting, our team provides honest, first-hand guidance to help you find the property that fits your budget and preferences perfectly. We stay ahead of the market with up-to-date knowledge of new launches, pre-launches, and exclusive offers — ensuring our clients never miss the right opportunity. Serving key locations across Mohali (Sector 70, Sector 126) and Zirakpur (Airport Road, Old Ambala Road, Highland Marg), we bring local expertise and genuine care to every transaction.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 24, marginTop: 36, borderTop: "1px solid var(--line)", paddingTop: 28 }}>
            <Credit k="Services" v="Residential · Commercial · Industrial" />
            <Credit k="Coverage" v="Mohali · Zirakpur" />
            <Credit k="Key Areas" v="Sector 70 · Sector 126 · Airport Road · Old Ambala Road · Highland Marg" />
            {/* TODO: add RERA registration number if applicable */}
            <Credit k="Registered" v="Real Estate Agents & Property Services" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Credit({ k, v }) {
  return (
    <div>
      <div className="uc" style={{ fontSize: 10, letterSpacing: "0.16em", color: "var(--mute)", marginBottom: 8 }}>{k}</div>
      <div style={{ fontSize: 15, color: "var(--ink-2)" }}>{v}</div>
    </div>
  );
}

/* ───────────────────── Contact ───────────────────── */
function ContactBanner() {
  return (
    <section id="contact" style={{ paddingTop: 80, paddingBottom: 80 }}>
      <div className="container">
        <div style={{ borderTop: "1px solid var(--ink-2)", paddingTop: 48, display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 32, flexWrap: "wrap" }}>
          <div>
            <div className="uc" style={{ fontSize: 11, letterSpacing: "0.18em", color: "var(--mute)", marginBottom: 24 }}>◇ Get in Touch</div>
            <h2 className="clash" style={{ fontSize: "clamp(48px, 9vw, 152px)", letterSpacing: "-0.06em", margin: 0, lineHeight: 0.9, fontWeight: 700 }}>
              <Echo size="clamp(48px, 9vw, 152px)">Let's talk.</Echo>
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-end" }}>
            {/* TODO: replace with Wise Properties phone number */}
            <a href="tel:+91XXXXXXXXXX" className="clash" style={{ fontSize: "clamp(22px,3.5vw,28px)", letterSpacing: "-0.02em", fontWeight: 600 }}>+91 XXXXX XXXXX</a>
            {/* TODO: replace with Wise Properties email */}
            <a href="mailto:info@wiseproperties.in" className="uc" style={{ fontSize: 11, letterSpacing: "0.16em", marginTop: 8, borderBottom: "1px solid var(--ink)", paddingBottom: 4 }}>
              info@wiseproperties.in
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────── Footer ───────────────────── */
function Footer() {
  return (
    <footer style={{ background: "var(--dark)", color: "rgba(246,246,246,0.6)", borderTop: "1px solid rgba(255,255,255,0.05)", marginTop: 40 }}>
      <div className="container" style={{ paddingTop: 72, paddingBottom: 40 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 40, marginBottom: 56 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <Crown />
              <div className="clash" style={{ color: "#f6f6f6", fontSize: 20, letterSpacing: "-0.03em" }}>WISE Properties</div>
            </div>
            <p style={{ marginTop: 20, fontSize: 14, lineHeight: 1.65, maxWidth: 300 }}>
              Your trusted one-stop real estate solution in Mohali and Zirakpur. Buy, sell, or rent residential and commercial properties with honest expert guidance. 2nd Floor, SCO 545, Sector 70, SAS Nagar (Mohali), Punjab 160071.
            </p>
          </div>
          <FooterCol head="Navigate" links={[["Our Listings", "#portfolio"], ["About Us", "#practice"], ["Market Updates", "#insights"], ["About", "#about"]]} />
          <FooterCol head="Services" links={[["Residential Sales", "#insights"], ["Residential Rentals", "#insights"], ["Commercial", "#insights"], ["New Launches", "#insights"]]} />
          <FooterCol head="Contact" links={[
            /* TODO: replace with Wise Properties phone */
            [<span><IconPhone/> +91 XXXXX XXXXX</span>, "tel:+91XXXXXXXXXX"],
            /* TODO: replace with Wise Properties email */
            [<span><IconMail/> info@wiseproperties.in</span>, "mailto:info@wiseproperties.in"],
            [<span><IconPin/> SCO 545, Sector 70, Mohali 160071</span>, "https://www.google.com/maps/search/?api=1&query=SCO+545+Sector+70+SAS+Nagar+Mohali+Punjab+160071"],
          ]} />
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <div className="uc" style={{ fontSize: 10, letterSpacing: "0.18em" }}>© 2026 Wise Properties — All rights reserved</div>
          <div className="uc" style={{ fontSize: 10, letterSpacing: "0.18em" }}>Real Estate Agents · Mohali & Zirakpur</div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ head, links }) {
  return (
    <div>
      <div className="uc" style={{ fontSize: 10, letterSpacing: "0.18em", color: "#f6f6f6", marginBottom: 18 }}>{head}</div>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
        {links.map(([label, href], i) => (
          <li key={i}>
            <a href={href} style={{ fontSize: 14, color: "rgba(246,246,246,0.6)", display: "inline-flex", alignItems: "center", gap: 10, transition: "color 200ms" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#f6f6f6")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(246,246,246,0.6)")}
            >{label}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function IconPhone() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ verticalAlign: "-2px", marginRight: 8 }}><path d="M22 16.92v3a2 2 0 01-2.18 2 19.86 19.86 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.86 19.86 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.37 1.9.72 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0122 16.92z" /></svg> }
function IconMail() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ verticalAlign: "-2px", marginRight: 8 }}><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 7l-10 6L2 7" /></svg> }
function IconPin() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ verticalAlign: "-2px", marginRight: 8 }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg> }

/* ───────────────────── WhatsApp Float ───────────────────── */
function WhatsAppFab() {
  const [hover, setHover] = useState(false);
  const phone = "918968017508";
  const text = encodeURIComponent("Hello Wise Properties — I would like to enquire about a property listing.");
  return (
    <a
      href={`https://wa.me/${phone}?text=${text}`}
      target="_blank" rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="wa-fab"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ position: "fixed", right: 24, bottom: 24, zIndex: 55, display: "inline-flex", alignItems: "center", gap: 12, padding: hover ? "14px 22px 14px 14px" : 14, height: 56, borderRadius: 999, background: "#25D366", color: "#ffffff", boxShadow: "0 12px 32px rgba(17,17,17,0.22), 0 2px 6px rgba(17,17,17,0.12)", transition: "padding 300ms cubic-bezier(0.77,0,0.175,1), transform 300ms cubic-bezier(0.77,0,0.175,1)", transform: hover ? "translateY(-2px)" : "translateY(0)", whiteSpace: "nowrap", overflow: "hidden" }}
    >
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
        <path fill="#ffffff" d="M16.04 4C9.42 4 4.04 9.38 4.04 16c0 2.11.55 4.18 1.6 6L4 28l6.16-1.6A11.94 11.94 0 0 0 16.04 28C22.66 28 28.04 22.62 28.04 16S22.66 4 16.04 4Zm0 21.6c-1.78 0-3.52-.48-5.04-1.4l-.36-.22-3.66.96.98-3.56-.24-.38a9.6 9.6 0 1 1 8.32 4.6Zm5.5-7.18c-.3-.16-1.78-.88-2.06-.98-.28-.1-.48-.16-.68.16s-.78.98-.96 1.18c-.18.2-.36.22-.66.08-.3-.16-1.26-.46-2.4-1.48a9 9 0 0 1-1.66-2.06c-.18-.3 0-.46.14-.62.14-.14.3-.36.46-.54.16-.18.2-.3.3-.5.1-.2.05-.38-.02-.54-.08-.16-.68-1.64-.94-2.24-.24-.58-.5-.5-.68-.5l-.58-.02c-.2 0-.54.08-.82.38s-1.08 1.06-1.08 2.58c0 1.52 1.1 3 1.26 3.2.16.2 2.18 3.32 5.3 4.66.74.32 1.32.5 1.78.66.74.24 1.42.2 1.96.12.6-.08 1.78-.72 2.04-1.42.26-.7.26-1.3.18-1.42-.08-.12-.28-.2-.58-.34Z" />
      </svg>
      <span className="uc" style={{ fontSize: 12, letterSpacing: "0.14em", fontWeight: 700, maxWidth: hover ? 200 : 0, opacity: hover ? 1 : 0, transition: "max-width 300ms cubic-bezier(0.77,0,0.175,1), opacity 200ms ease" }}>
        Chat on WhatsApp
      </span>
    </a>
  );
}

/* ───────────────────── App ───────────────────── */
function App() {
  const [active, setActive] = useState(null);
  const props = window.WP_PROPERTIES || [];

  return (
    <>
      <Nav onContact={() => {
        const el = document.getElementById("contact");
        if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
      }} />
      <Hero />
      <Philosophy />
      <Showcase properties={props} onOpen={setActive} />
      <Portfolio properties={props} onOpen={setActive} />
      <Services />
      <About />
      <ContactBanner />
      <Footer />
      <DetailSheet p={active} onClose={() => setActive(null)} />
      <WhatsAppFab />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
