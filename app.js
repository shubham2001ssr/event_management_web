(function () {
  const cfg = window.APP_CONFIG;

  // Branding
  const brandNameEl = document.getElementById("brandName");
  const brandTaglineEl = document.getElementById("brandTagline");
  const brandLogoEl = document.getElementById("brandLogo");
  const brandYearEl = document.getElementById("brandYear");
  const brandNameFooterEl = document.getElementById("brandNameFooter");
  brandNameEl.textContent = cfg.brand.name;
  brandTaglineEl.textContent = cfg.brand.tagline;
  brandYearEl.textContent = new Date().getFullYear();
  brandNameFooterEl.textContent = cfg.brand.name;
  if (cfg.brand.logo) {
    brandLogoEl.src = cfg.brand.logo;
    brandLogoEl.classList.remove("d-none");
  }
  document.documentElement.style.setProperty("--brand-primary", cfg.brand.primaryColor);

  // Populate selects
  const eventTypeSel = document.getElementById("eventType");
  cfg.events.forEach(e => {
    const opt = document.createElement("option");
    opt.value = e; opt.textContent = e;
    eventTypeSel.appendChild(opt);
  });

  const venueSel = document.getElementById("venue");
  cfg.venues.forEach(v => {
    const opt = document.createElement("option");
    opt.value = v.id; opt.textContent = `${v.name} (cap. ${v.capacity})`;
    venueSel.appendChild(opt);
  });

  // Decorations & services checkboxes
  const decoWrap = document.getElementById("decorations");
  cfg.decorations.forEach(d => decoWrap.appendChild(makeCheckboxCol(d.id, d.label, d.price)));

  const svcWrap = document.getElementById("services");
  cfg.services.forEach(s => svcWrap.appendChild(makeCheckboxCol(s.id, s.label, s.price)));

  function makeCheckboxCol(id, label, price) {
    const col = document.createElement("div");
    col.className = "col-6";
    col.innerHTML = `
      <div class="form-check">
        <input class="form-check-input" type="checkbox" id="${id}" data-price="${price}">
        <label class="form-check-label" for="${id}">${label} <span class="text-muted small">(₹${price.toLocaleString()})</span></label>
      </div>`;
    return col;
  }

  // Availability badge
  const eventDateEl = document.getElementById("eventDate");
  const availabilityBadge = document.getElementById("availabilityBadge");
  const dateHint = document.getElementById("dateHint");
  eventDateEl.addEventListener("change", () => {
    const d = new Date(eventDateEl.value);
    if (isNaN(d)) {
      setBadge("Check date", cfg.availabilityRules.badge.unknown);
      dateHint.textContent = "";
      return;
    }
    const day = d.getDay();
    const busy = cfg.availabilityRules.busyDays.includes(day);
    setBadge(busy ? "Busy (limited slots)" : "Available", busy ? cfg.availabilityRules.badge.busy : cfg.availabilityRules.badge.free);
    dateHint.textContent = busy ? "Tip: choose a weekday for better availability." : "Great choice—plenty of slots.";
  });

  function setBadge(text, cls) {
    availabilityBadge.className = `badge ${cls} ms-2`;
    availabilityBadge.textContent = text;
  }

  // Budget estimator
  const budgetTotalEl = document.getElementById("budgetTotal");
  const guestsEl = document.getElementById("guests");
  const foodRadios = Array.from(document.querySelectorAll('input[name="food"]'));

  const inviteDigitalEl = document.getElementById("inviteDigital");
  const invitePrintedEl = document.getElementById("invitePrinted");
  const vehicleGuestEl = document.getElementById("vehicleGuest");
  const vehicleLogisticsEl = document.getElementById("vehicleLogistics");

  [eventTypeSel, venueSel, guestsEl, inviteDigitalEl, invitePrintedEl, vehicleGuestEl, vehicleLogisticsEl, ...foodRadios]
    .forEach(el => el.addEventListener("input", updateBudget));

  document.querySelectorAll("#decorations .form-check-input, #services .form-check-input")
    .forEach(el => el.addEventListener("input", updateBudget));

  function updateBudget() {
    const venue = cfg.venues.find(v => v.id === venueSel.value);
    const guests = Math.max(0, parseInt(guestsEl.value || "0", 10));
    const foodType = foodRadios.find(r => r.checked)?.value || "veg";
    const foodCost = guests * (cfg.foodPerGuest[foodType] || 0);

    const decoCost = sumChecked("#decorations .form-check-input");
    const svcCost = sumChecked("#services .form-check-input");

    const inviteCost = (inviteDigitalEl.checked ? cfg.invitations.digital : 0) +
                       (invitePrintedEl.checked ? cfg.invitations.printed : 0);

    const logisticsCost = (vehicleGuestEl.checked ? cfg.logistics.guestTransport : 0) +
                          (vehicleLogisticsEl.checked ? cfg.logistics.eventLogistics : 0);

    const venueCost = venue ? venue.basePrice : 0;

    const total = venueCost + foodCost + decoCost + svcCost + inviteCost + logisticsCost;
    budgetTotalEl.textContent = `₹${total.toLocaleString()}`;
  }

  function sumChecked(selector) {
    return Array.from(document.querySelectorAll(selector))
      .filter(el => el.checked)
      .reduce((sum, el) => sum + Number(el.dataset.price || 0), 0);
  }

  // Submit & summary
  const submitBtn = document.getElementById("submitBooking");
  const summaryEl = document.getElementById("summary");
  submitBtn.addEventListener("click", () => {
    const summary = {
      brand: cfg.brand.name,
      eventType: eventTypeSel.value,
      location: document.getElementById("location").value,
      guests: guestsEl.value,
      date: document.getElementById("eventDate").value,
      venue: venueSel.value,
      food: foodRadios.find(r => r.checked)?.value,
      decorations: listChecked("#decorations .form-check-input"),
      services: listChecked("#services .form-check-input"),
      invitations: [
        inviteDigitalEl.checked ? "Digital" : null,
        invitePrintedEl.checked ? "Printed" : null
      ].filter(Boolean),
      logistics: [
        vehicleGuestEl.checked ? "Guest transport" : null,
        vehicleLogisticsEl.checked ? "Event logistics" : null
      ].filter(Boolean),
      budget: document.getElementById("budgetTotal").textContent
    };

    summaryEl.innerHTML = renderSummary(summary);
    summaryEl.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  function listChecked(selector) {
    return Array.from(document.querySelectorAll(selector))
      .filter(el => el.checked)
      .map(el => document.querySelector(`label[for="${el.id}"]`).textContent.split("(")[0].trim());
  }

  function renderSummary(s) {
    return `
      <ul class="summary-list">
        <li><strong>Brand:</strong> ${s.brand}</li>
        <li><strong>Event:</strong> ${s.eventType}</li>
        <li><strong>Location:</strong> ${s.location || "-"}</li>
        <li><strong>Guests:</strong> ${s.guests || "-"}</li>
        <li><strong>Date:</strong> ${s.date || "-"}</li>
        <li><strong>Venue:</strong> ${getVenueName(s.venue) || "-"}</li>
        <li><strong>Food:</strong> ${s.food}</li>
        <li><strong>Decorations:</strong> ${s.decorations.join(", ") || "None"}</li>
        <li><strong>Services:</strong> ${s.services.join(", ") || "None"}</li>
        <li><strong>Invitations:</strong> ${s.invitations.join(", ") || "None"}</li>
        <li><strong>Logistics:</strong> ${s.logistics.join(", ") || "None"}</li>
        <li><strong>Estimated budget:</strong> ${s.budget}</li>
      </ul>
    `;
  }

  function getVenueName(id) {
    return (cfg.venues.find(v => v.id === id) || {}).name;
  }

  // Initial budget
  updateBudget();
})();
