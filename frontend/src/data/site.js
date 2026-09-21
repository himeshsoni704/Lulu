export const COMPANY = {
  name: "Al Lulu Packaging",
  legalName: "AL LULU PACKING & PACKAGING MAT.CO. LLC",
  address: "Industrial Area #5, Sharjah - U.A.E.",
  poBox: "P.O.Box: 36752",
  fullAddress: "P.O.Box: 36752, Industrial Area #5, Sharjah - U.A.E.",
  phoneDisplay: "06 530 0865",
  phoneIntl: "+971 6 530 0865",
  faxDisplay: "06 530 0895",
  faxIntl: "+971 6 530 0895",
  emailPrimary: "lulupackaging@gmail.com",
  emailSecondary: "saleslulupac@gmail.com",
  established: 2013,
  logo: "/logo.png",
  logoLight: "/logo-light.png",
};

export const waLink = (msg) => `https://wa.me/97165300865?text=${encodeURIComponent(msg)}`;
export const WA_GENERAL = waLink("Hi, I'd like to know more about Al Lulu Packaging's products and services.");
export const waProduct = (name) => waLink(`Hi, I'm interested in ${name}. I'd like to request a quotation.`);

export const CLIENTS = [
  "Mercedes-Benz", "SAFCO", "Danube", "Mitsubishi",
  "Al Ghurair", "Al Gurg FOSROC", "K-Flex Gulf Manufacturing", "General Motors",
];

export const IMG = {
  hero: "https://static.prod-images.emergentagent.com/jobs/8fd011f8-01af-4c5d-9b92-c6945b101833/images/d97084d5022d4cd546871e7ea5c7ab3e91b905dc32cb05638dbedf6aa6705032.jpeg",
  corrugatedRolls: "/images/corrugated-rolls.png",
  corrugatedSheets: "/images/corrugated-sheets.png",
  eflute: "/images/e-flute-sheets.png",
  paperCore: "/images/paper-core.png",
  corrugatedBoxes: "/images/corrugated-boxes.png",
  fileBoxes: "/images/file-storage-boxes.png",
  pizzaBoxes: "/images/pizza-boxes.png",
  maskingTapes: "/images/masking-tapes.png",
  boppClear: "/images/bopp-clear-tapes.png",
  boppBrown: "/images/bopp-brown-tapes.png",
  ppStrap: "/images/pp-strap.png",
  bubbleRolls: "/images/bubble-rolls.png",
  stretchHand: "/images/stretch-film-handgrade.png",
  stretchBlack: "/images/stretch-film-black.png",
  stretchMachine: "/images/stretch-film-machine-grade.png",
  edgeProtector: "/images/edge-protector.png",
  facility: "https://images.unsplash.com/photo-1672552226380-486fe900b322?auto=format&fit=crop&w=1600&q=80",
  forklift: "https://images.unsplash.com/photo-1740914994657-f1cdffdc418e?auto=format&fit=crop&w=1600&q=80",
  operations: "https://images.pexels.com/photos/30824313/pexels-photo-30824313.jpeg?auto=compress&cs=tinysrgb&w=1600",
  warehouseHigh: "https://images.pexels.com/photos/4483560/pexels-photo-4483560.jpeg?auto=compress&cs=tinysrgb&w=1600",
  loadbay: "https://images.unsplash.com/photo-1532635026-d12867005472?auto=format&fit=crop&w=1600&q=80",
  kraftTexture: "https://images.pexels.com/photos/16549277/pexels-photo-16549277.jpeg?auto=compress&cs=tinysrgb&w=1600",
  boxesBrownBg: "https://images.unsplash.com/photo-1624137527136-66e631bdaa0e?auto=format&fit=crop&w=1600&q=80",
  openBoxes: "https://images.unsplash.com/photo-1700165644892-3dd6b67b25bc?auto=format&fit=crop&w=1600&q=80",
  sealing: "https://images.pexels.com/photos/6169031/pexels-photo-6169031.jpeg?auto=compress&cs=tinysrgb&w=1600",
};

export const CATEGORIES = ["All", "Corrugated & Paper", "Boxes", "Tapes & Strapping", "Protective & Films"];

export const PRODUCTS = [
  { id: "corrugated-rolls", name: "Corrugated Rolls", category: "Corrugated & Paper", image: IMG.corrugatedRolls,
    blurb: "Fluted corrugated paper rolls for wrapping and surface protection. A workshop staple for cushioning fragile and irregular-shaped items in transit.",
    variants: [], applications: ["Wrapping & cushioning", "Void filling", "Surface protection"], industries: ["Manufacturing", "Industrial", "Retail"] },
  { id: "corrugated-sheets", name: "Corrugated Sheets", category: "Corrugated & Paper", image: IMG.corrugatedSheets,
    blurb: "Flat corrugated sheets used as layering pads, dividers and pallet top-caps between stacked goods.",
    variants: [], applications: ["Layer separation", "Pallet top-caps", "Dividing stacked goods"], industries: ["Manufacturing", "Industrial"] },
  { id: "e-flute-sheets", name: "E-Flute Sheets", category: "Corrugated & Paper", image: IMG.eflute,
    blurb: "Fine micro-flute corrugated sheets with a crisp, thin profile for lining, facing and light-duty packaging work.",
    variants: ["Black", "Brown", "White"], applications: ["Box lining", "Facing sheets", "Light-duty protection"], industries: ["Retail", "Manufacturing"] },
  { id: "paper-core", name: "Paper Core", category: "Corrugated & Paper", image: IMG.paperCore,
    blurb: "Spiral-wound paper tubes and cores in multiple diameters for winding films, foils, textiles and paper.",
    variants: ["Multiple diameters & wall strengths"], applications: ["Film & foil winding", "Textile rolls", "Paper reeling"], industries: ["Manufacturing", "Industrial"] },
  { id: "corrugated-boxes", name: "Corrugated Boxes", category: "Boxes", image: IMG.corrugatedBoxes,
    blurb: "Corrugated shipping and storage boxes in a wide range of sizes — the everyday workhorse of industrial packaging.",
    variants: ["Range of sizes"], applications: ["Shipping", "Storage", "Distribution"], industries: ["Automotive", "Construction", "Manufacturing", "Retail"] },
  { id: "file-storage-boxes", name: "File Storage Boxes", category: "Boxes", image: IMG.fileBoxes,
    blurb: "Purpose-made corrugated boxes for archiving and storing office files and documents, with a clear labelling area.",
    variants: [], applications: ["Document archiving", "Office storage", "Records management"], industries: ["Corporate", "Retail"] },
  { id: "pizza-boxes", name: "Pizza Boxes", category: "Boxes", image: IMG.pizzaBoxes,
    blurb: "Corrugated pizza boxes for pizzerias and food businesses, supplied in popular sizes.",
    variants: ["Multiple sizes"], applications: ["Pizzerias", "Food service", "Takeaway packing"], industries: ["Food & Beverage", "Retail"] },
  { id: "masking-tapes", name: "Masking Tapes", category: "Tapes & Strapping", image: IMG.maskingTapes,
    blurb: "Crepe-paper masking tape for holding, masking and light-duty sealing during production and finishing work.",
    variants: ["Multiple widths"], applications: ["Masking", "Holding", "Bundling"], industries: ["Manufacturing", "Automotive", "Industrial"] },
  { id: "bopp-clear-tapes", name: "BOPP Clear Tapes", category: "Tapes & Strapping", image: IMG.boppClear,
    blurb: "Clear polypropylene packaging tape for carton sealing where the contents or print should stay visible.",
    variants: ["Multiple widths & lengths"], applications: ["Carton sealing", "Bundling"], industries: ["Manufacturing", "Retail", "Industrial"] },
  { id: "bopp-brown-tapes", name: "BOPP Brown Tapes", category: "Tapes & Strapping", image: IMG.boppBrown,
    blurb: "Brown polypropylene packaging tape — the everyday carton seal for warehouses and dispatch areas.",
    variants: ["Multiple widths & lengths"], applications: ["Carton sealing", "Warehouse packing"], industries: ["Manufacturing", "Industrial", "Retail"] },
  { id: "pp-strap", name: "PP Strap", category: "Tapes & Strapping", image: IMG.ppStrap,
    blurb: "Polypropylene strapping for bundling boxes, securing loads and reinforcing pallets.",
    variants: ["Multiple widths & strengths"], applications: ["Bundling", "Pallet securing", "Load restraint"], industries: ["Industrial", "Manufacturing"] },
  { id: "bubble-rolls", name: "Bubble Rolls", category: "Protective & Films", image: IMG.bubbleRolls,
    blurb: "Air-cushion bubble film rolls for wrapping and protecting fragile goods such as glass, electronics and finished parts.",
    variants: ["Rolls & sheets"], applications: ["Cushioning fragile goods", "Wrapping", "Void fill"], industries: ["Manufacturing", "Retail", "Automotive"] },
  { id: "stretch-film-handgrade", name: "Stretch Film — Hand Grade", category: "Protective & Films", image: IMG.stretchHand,
    blurb: "Stretch film rolls for manual pallet wrapping and bundling with a dispenser.",
    variants: ["Widths & gauges"], applications: ["Manual pallet wrapping", "Bundling"], industries: ["Manufacturing", "Industrial"] },
  { id: "stretch-film-black", name: "Stretch Film — Black", category: "Protective & Films", image: IMG.stretchBlack,
    blurb: "Black stretch film for loads that need concealment or protection from light.",
    variants: ["Widths & gauges"], applications: ["Concealment", "Pallet wrapping"], industries: ["Industrial", "Manufacturing"] },
  { id: "stretch-film-machine-grade", name: "Stretch Film — Machine Grade", category: "Protective & Films", image: IMG.stretchMachine,
    blurb: "Machine-grade stretch film engineered for consistent powered pallet-wrapping at volume.",
    variants: ["Widths & gauges"], applications: ["Powered pallet wrapping", "High-volume wrapping"], industries: ["Manufacturing", "Industrial"] },
  { id: "edge-protector", name: "Edge Protector", category: "Protective & Films", image: IMG.edgeProtector,
    blurb: "Rigid paperboard edge profiles that protect pallet and load edges against strap tension and stacking damage.",
    variants: ["Multiple lengths & thicknesses"], applications: ["Pallet edge protection", "Strap load spread", "Stacking reinforcement"], industries: ["Industrial", "Construction", "Manufacturing"] },
];

export const productById = (id) => PRODUCTS.find((p) => p.id === id);

export const CAPABILITIES = [
  { num: "01", title: "Corrugated & Paper", desc: "Rolls, sheets, fine E-flute and spiral-wound cores — the raw work of wrapping, layering and winding, stocked in depth.", products: ["Corrugated Rolls", "Corrugated Sheets", "E-Flute Sheets", "Paper Core"], link: "/products?category=Corrugated%20%26%20Paper" },
  { num: "02", title: "Boxes for Every Business", desc: "Shipping boxes, archival file boxes and food cartons — sized, stacked and supplied for daily dispatch.", products: ["Corrugated Boxes", "File Storage Boxes", "Pizza Boxes"], link: "/products?category=Boxes" },
  { num: "03", title: "Tapes & Strapping", desc: "Masking, clear and brown BOPP tapes plus polypropylene strapping — the seals that hold loads together.", products: ["Masking Tapes", "BOPP Clear Tapes", "BOPP Brown Tapes", "PP Strap"], link: "/products?category=Tapes%20%26%20Strapping" },
  { num: "04", title: "Protection & Films", desc: "Bubble wrap, hand and machine stretch films, and edge protection — so goods arrive the way they left.", products: ["Bubble Rolls", "Stretch Films", "Edge Protector"], link: "/products?category=Protective%20%26%20Films" },
];

export const MANIFESTO = [
  { num: "01", title: "One supplier. The full range.", text: "Corrugated products, boxes, tapes, protective films and accessories — the catalogue our customers rely on, all under one roof." },
  { num: "02", title: "Rooted in Sharjah industry.", text: "Operating from Industrial Area #5 since 2013, close to the UAE's manufacturing and logistics corridors." },
  { num: "03", title: "Supply built for business.", text: "Quotation-based B2B supply. Tell us the product, the size and the quantity — our team responds with a formal quotation." },
];

export const INDUSTRIES = [
  { name: "Automotive", desc: "Packaging for automotive supply chains — where parts arrive protected and schedules hold.", products: ["Corrugated Boxes", "Bubble Rolls", "Edge Protector", "Stretch Film — Machine Grade"], clients: ["Mercedes-Benz", "General Motors", "Mitsubishi"] },
  { name: "Construction", desc: "From material supply sites to active builds — strapping, sheets and edge protection that survive the site.", products: ["PP Strap", "Corrugated Sheets", "Edge Protector", "Stretch Film — Black"], clients: ["Danube", "Al Ghurair", "Al Gurg FOSROC"] },
  { name: "Manufacturing", desc: "Line-side and dispatch packaging for factories that run every day.", products: ["Corrugated Rolls", "Masking Tapes", "Stretch Film — Machine Grade", "Corrugated Sheets"], clients: ["SAFCO", "K-Flex Gulf Manufacturing", "Mitsubishi"] },
  { name: "Food & Beverage", desc: "Corrugated food cartons and sealing tapes for kitchens, pizzerias and food businesses.", products: ["Pizza Boxes", "BOPP Clear Tapes", "Corrugated Boxes"], clients: [] },
  { name: "Industrial Supply", desc: "Everyday consumables for warehouses, archives and industrial trading.", products: ["Paper Core", "Bubble Rolls", "File Storage Boxes", "Stretch Film — Hand Grade"], clients: [] },
];

export const MARQUEE_ITEMS = [
  "Corrugated Boxes", "BOPP Tapes", "Stretch Films", "Bubble Rolls", "Edge Protection",
  "Paper Cores", "PP Strapping", "Pizza Boxes", "Masking Tapes", "E-Flute Sheets",
  "File Storage Boxes", "Sharjah Industrial Area #5",
];
