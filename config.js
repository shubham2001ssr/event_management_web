// Single codebase, multiple clients: tweak this object per event planner
window.APP_CONFIG = {
  brand: {
    name: "Shubham Events",
    tagline: "One codebase—infinite event solutions",
    logo: "", // optional: set to a logo URL
    primaryColor: "#0d6efd"
  },
  events: ["Marriage", "Birthday", "Engagement", "Housewarming", "School/College Function"],
  venues: [
    { id: "grand-hall", name: "Grand Hall", capacity: 500, basePrice: 120000 },
    { id: "garden-view", name: "Garden View", capacity: 300, basePrice: 90000 },
    { id: "city-banquet", name: "City Banquet", capacity: 200, basePrice: 70000 }
  ],
  decorations: [
    { id: "flower", label: "Flower decoration", price: 15000 },
    { id: "pandal", label: "Pandal/stage setup", price: 20000 },
    { id: "lighting", label: "Lighting package", price: 12000 }
  ],
  services: [
    { id: "photography", label: "Photography & videography", price: 25000 },
    { id: "dj", label: "Music/DJ", price: 15000 },
    { id: "seating", label: "Seating planner", price: 8000 }
  ],
  invitations: {
    digital: 3000,
    printed: 6000
  },
  logistics: {
    guestTransport: 12000,
    eventLogistics: 10000
  },
  foodPerGuest: {
    veg: 450,
    nonveg: 600,
    mixed: 525
  },
  availabilityRules: {
    // simple demo: weekends are busy
    busyDays: [5, 6], // 0=Sun ... 6=Sat
    badge: { free: "bg-success", busy: "bg-danger", unknown: "bg-secondary" }
  }
};

