import "./style.css";
import {
  shell,
  footer,
  bindMenu,
  esc,
  money,
  load,
  save,
  modal,
  toast,
  empty,
  normalize,
  today,
} from "./utils.js";
import {
  tours,
  bookingTotal,
  remainingSeats,
  validateBooking,
} from "./model.js";
const stored = load("les-tours-bookings-v1", []);
let bookings = Array.isArray(stored)
  ? stored.filter(
      (b) =>
        b &&
        tours.some((t) => t.id === b.tourId) &&
        ["Confirmada", "Cancelada"].includes(b.status) &&
        Number.isInteger(b.adults) &&
        Number.isInteger(b.children),
    )
  : [];
document.querySelector("#app").innerHTML =
  `${shell({ brand: "Cancun Tours", mark: "CT", nav: '<a href="#experiencias">Experiencias</a><a href="#como-funciona">Cómo funciona</a><button id="my-bookings">Mis reservas <span class="count" id="booking-count">0</span></button>', action: '<a class="btn" href="#experiencias">Explorar tours ↗</a>' })}<main id="main"><section class="hero"><img src="/images/sea.jpg" alt="Mar abierto de la Riviera Maya" fetchpriority="high"><div class="travel-copy"><p class="eyebrow">CANCÚN · ISLA MUJERES · RIVIERA MAYA</p><h1>Tu próximo viaje<br>empieza <span>aquí.</span></h1><p>Descubre el Caribe desde el agua, entre cenotes o siguiendo las huellas de la historia maya.</p><div class="hero-actions"><a class="btn" href="#experiencias">Encuentra tu tour ↓</a><button class="btn secondary" id="how-demo">Probar una reserva</button></div></div><div class="travel-coordinate"><strong>Caribe mexicano</strong>21°09′ N / 86°50′ O</div></section><div class="travel-ribbon"><span>6 experiencias para explorar</span><span>Precios claros en MXN</span><span>Reserva y cancelación de prueba</span><span>Sin cargos reales</span></div><section class="section" id="experiencias"><div class="section-title"><div><p class="eyebrow">EXPERIENCIAS / CATÁLOGO</p><h2>Elige cómo vivir el Caribe.</h2></div><p>Explora las opciones, consulta el itinerario y crea una reserva de prueba.</p></div><div class="toolbar"><div class="search"><label for="search" class="hint">Buscar experiencia o destino</label><input id="search" type="search" placeholder="¿Mar, cenotes o historia?"></div><div><label for="category" class="hint">Tipo de experiencia</label><select id="category"><option value="Todos">Todas las experiencias</option><option>Mar</option><option>Cultura</option><option>Naturaleza</option></select></div><div><label for="sort" class="hint">Ordenar</label><select id="sort"><option value="default">Selección del día</option><option value="price">Precio: menor primero</option></select></div></div><p id="result-count" class="hint" aria-live="polite"></p><div id="tour-grid" class="card-grid" style="margin-top:20px"></div></section><section class="section alt" id="como-funciona"><p class="eyebrow">RESERVAR, SIN COMPLICACIONES</p><h2>Explora el viaje completo.</h2><div class="steps" style="margin-top:35px"><div class="step"><span>01</span><h3>Elige un plan</h3><p>Filtra por categoría y consulta qué incluye cada experiencia.</p></div><div class="step"><span>02</span><h3>Personaliza el día</h3><p>Selecciona fecha y viajeros. La tarifa se calcula antes de confirmar.</p></div><div class="step"><span>03</span><h3>Prueba tu reserva</h3><p>Consulta o cancela desde Mis reservas. Todo se guarda en este navegador.</p></div></div><p class="notice">Esta es una demostración. Los cupos, precios e itinerarios son de ejemplo. No contacta operadores ni procesa pagos.</p></section></main>${footer("Cancun Tours", "les-tours-bookings-v1")}`;
bindMenu();
function updateCount() {
  document.querySelector("#booking-count").textContent = bookings.filter(
    (b) => b.status === "Confirmada",
  ).length;
}
function renderTours() {
  const q = normalize(document.querySelector("#search").value);
  const cat = document.querySelector("#category").value;
  let list = tours.filter(
    (t) =>
      (cat === "Todos" || t.category === cat) &&
      normalize(t.name + " " + t.destination).includes(q),
  );
  if (document.querySelector("#sort").value === "price")
    list = [...list].sort((a, b) => a.price - b.price);
  document.querySelector("#result-count").textContent =
    `${list.length} experiencias disponibles`;
  document.querySelector("#tour-grid").innerHTML = list.length
    ? list
        .map(
          (t) =>
            `<article class="card"><div class="card-image"><img src="${t.image}" alt="Paisaje de referencia para ${esc(t.name)}" loading="lazy"><span class="badge">${t.category} / ${t.duration}</span></div><div class="card-content"><p class="eyebrow" style="margin-bottom:8px">${t.destination}</p><h3>${t.name}</h3><p>${t.description}</p><div class="card-row"><span class="price">${money(t.price)} <small>/ adulto</small></span><button class="btn small" data-tour="${t.id}">Ver tour ↗</button></div></div></article>`,
        )
        .join("")
    : empty(
        "No encontramos ese plan",
        "Prueba otro destino o selecciona todas las experiencias.",
      );
  document
    .querySelectorAll("[data-tour]")
    .forEach((b) => (b.onclick = () => showTour(b.dataset.tour)));
}
function showTour(id) {
  const t = tours.find((t) => t.id === id);
  const el = modal(
    t.name,
    `<img src="${t.image}" alt="Paisaje de referencia" style="height:200px;width:100%;border-radius:5px"><p class="eyebrow" style="margin:20px 0 10px">${t.destination} / ${t.duration}</p><p>${t.description}</p><h3>Qué incluye</h3><div class="chips">${t.includes.map((i) => `<span class="badge">${i}</span>`).join("")}</div><h3>Itinerario de muestra</h3>${t.itinerary.map((i) => `<div class="list-row">${i}</div>`).join("")}<div class="card-row"><span class="price">${money(t.price)} <small>/ adulto</small></span><button class="btn" id="reserve">Reservar demo ↗</button></div>`,
  );
  el.querySelector("#reserve").onclick = () => showBooking(t);
}
function showBooking(t) {
  const el = modal(
    "Tu día en " + t.destination,
    `<p>${t.name} · ${money(t.price)} por adulto. Niños de 4–11 años: 65% de la tarifa.</p><form id="booking-form" style="margin-top:24px"><div class="field"><label for="date">Fecha</label><input id="date" name="date" type="date" min="${today()}" value="${today()}" required></div><div class="form-grid"><div class="field"><label for="adults">Adultos</label><input id="adults" name="adults" type="number" min="1" max="12" value="2" required></div><div class="field"><label for="children">Niños</label><input id="children" name="children" type="number" min="0" max="11" value="0" required></div></div><div class="form-grid"><div class="field"><label for="name">Nombre de prueba</label><input id="name" name="name" maxlength="80" value="Viajero demo" required></div><div class="field"><label for="email">Correo de prueba</label><input id="email" name="email" type="email" maxlength="120" value="viajero@example.com" required></div></div><div class="summary"><div class="list-row"><span>Lugares disponibles</span><strong id="seats"></strong></div><div class="list-row"><span>Total de muestra</span><strong class="total" id="total"></strong></div></div><p id="booking-error" class="notice" role="alert" hidden></p><p class="hint" style="margin-bottom:18px">Se guardará en este dispositivo. Usa datos ficticios: no se envía correo ni se realiza ningún cobro.</p><button class="btn wide" type="submit">Confirmar reserva de prueba</button></form>`,
  );
  const form = el.querySelector("form");
  function preview() {
    const a = Number(form.adults.value),
      c = Number(form.children.value);
    el.querySelector("#seats").textContent = remainingSeats(
      bookings,
      t.id,
      form.date.value,
    );
    try {
      el.querySelector("#total").textContent = money(bookingTotal(t, a, c));
    } catch {
      el.querySelector("#total").textContent = "Revisa los viajeros";
    }
  }
  form.addEventListener("input", preview);
  preview();
  form.onsubmit = (e) => {
    e.preventDefault();
    try {
      const data = {
        tourId: t.id,
        date: form.date.value,
        adults: Number(form.adults.value),
        children: Number(form.children.value),
      };
      const total = validateBooking(data, bookings, today());
      const booking = {
        ...data,
        id: crypto.randomUUID(),
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        total,
        status: "Confirmada",
      };
      if (!booking.name) throw new Error("Escribe un nombre de prueba.");
      bookings.unshift(booking);
      save("les-tours-bookings-v1", bookings);
      updateCount();
      modal(
        "¡Tu reserva demo está lista!",
        `<span class="badge">CONFIRMACIÓN SIMULADA</span><h3>${t.name}</h3><div class="list-row"><span>Referencia</span><strong>CT-${booking.id.slice(0, 8).toUpperCase()}</strong></div><div class="list-row"><span>Fecha</span><strong>${esc(booking.date)}</strong></div><div class="list-row"><span>Viajeros</span><strong>${booking.adults + booking.children}</strong></div><div class="list-row"><span>Total de muestra</span><strong>${money(total)}</strong></div><p class="notice">No hay un servicio reservado ni un cargo real. Puedes revisar o cancelar esta prueba en Mis reservas.</p>`,
      );
    } catch (error) {
      const out = el.querySelector("#booking-error");
      out.hidden = false;
      out.textContent = error.message;
    }
  };
}
function showBookings() {
  const el = modal(
    "Mis reservas",
    bookings.length
      ? `<div class="stack">${bookings
          .map((b) => {
            const t = tours.find((t) => t.id === b.tourId);
            return `<div class="panel"><span class="badge">${b.status}</span><h3>${t.name}</h3><p>${esc(b.date)} · ${b.adults + b.children} viajeros · ${money(b.total)}</p><p>Referencia CT-${esc(b.id.slice(0, 8).toUpperCase())}</p>${b.status === "Confirmada" ? `<button class="btn secondary small" data-cancel="${esc(b.id)}" style="margin-top:15px">Cancelar reserva demo</button>` : ""}</div>`;
          })
          .join("")}</div>`
      : empty(
          "Todavía no hay reservas",
          "Elige una experiencia y crea tu primera reserva de prueba.",
        ),
  );
  el.querySelectorAll("[data-cancel]").forEach(
    (b) =>
      (b.onclick = () => {
        const booking = bookings.find((x) => x.id === b.dataset.cancel);
        booking.status = "Cancelada";
        save("les-tours-bookings-v1", bookings);
        updateCount();
        showBookings();
        toast(
          "Reserva demo cancelada. Los lugares están disponibles de nuevo.",
        );
      }),
  );
}
document.querySelector("#my-bookings").onclick = showBookings;
document.querySelector("#how-demo").onclick = () =>
  modal(
    "Explora sin compromiso",
    '<p>Este catálogo es ficticio. Puedes buscar tours, revisar itinerarios, crear reservas y cancelarlas. Se conservan en el almacenamiento local del navegador, sin conexión a operadores.</p><p class="notice">Todos los importes son MXN de ejemplo. No se solicitan tarjetas ni pagos.</p>',
  );
["search", "category", "sort"].forEach((id) =>
  document
    .querySelector("#" + id)
    .addEventListener(id === "search" ? "input" : "change", renderTours),
);
renderTours();
updateCount();
