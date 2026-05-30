// ─────────────────────────────────────────────────────
//  Wise Properties — properties.js
//  Auto-loads listings from Supabase database
//  Admin panel: /admin.html
// ─────────────────────────────────────────────────────

const SUPABASE_URL = "https://wrbsyqqdgakrbufxqimw.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndyYnN5cXFkZ2FrcmJ1ZnhxaW13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxMzA5MjIsImV4cCI6MjA5NTcwNjkyMn0.mWtfz9qqaFK7IgR-Q0RcJ2GDFHl-i-RfL-ol2Ym2zKU";

// Fallback demo data shown while loading or if DB is empty
const FALLBACK_PROPERTIES = [
  {
    id: "demo-1",
    title: "3BHK Apartment — Sector 70, Mohali",
    price: "₹85,00,000",
    type: "sale",
    category: "residential",
    location: "Sector 70, Mohali",
    beds: 3,
    baths: 2,
    area: 1450,
    description: "Beautiful apartment with modern interiors, covered parking, and 24/7 security.",
    image: "",
    images: [],
    whatsapp: "9876543210",
    featured: true,
  },
  {
    id: "demo-2",
    title: "2BHK Flat — Zirakpur Highway",
    price: "₹18,000/mo",
    type: "rent",
    category: "residential",
    location: "Zirakpur",
    beds: 2,
    baths: 2,
    area: 1050,
    description: "Well-maintained 2BHK near NH-5, close to schools and markets.",
    image: "",
    images: [],
    whatsapp: "9876543210",
    featured: false,
  },
  {
    id: "demo-3",
    title: "Commercial Shop — Phase 7, Mohali",
    price: "₹1,20,00,000",
    type: "sale",
    category: "commercial",
    location: "Phase 7, Mohali",
    beds: null,
    baths: null,
    area: 450,
    description: "Prime commercial space on main road. High footfall area, ideal for retail.",
    image: "",
    images: [],
    whatsapp: "9876543210",
    featured: false,
  },
];

// ── Fetch properties from Supabase ──────────────────────
async function fetchProperties() {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/properties?order=featured.desc,created_at.desc`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      }
    );
    if (!res.ok) throw new Error("Fetch failed: " + res.status);
    const data = await res.json();
    return data && data.length > 0 ? data : FALLBACK_PROPERTIES;
  } catch (e) {
    console.warn("Supabase load failed, using fallback data:", e.message);
    return FALLBACK_PROPERTIES;
  }
}

// ── Global used by app.jsx ──────────────────────────────
// app.jsx should call: window.getProperties().then(props => { ... })
window.getProperties = fetchProperties;

// Also expose as a ready-promise so app.jsx can await it
window.propertiesReady = fetchProperties();
