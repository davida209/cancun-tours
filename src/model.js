export const tours = [
  {
    id: "isla",
    name: "Isla Mujeres en catamarán",
    category: "Mar",
    destination: "Isla Mujeres",
    price: 890,
    duration: "7 horas",
    image: "/images/sea.jpg",
    tag: "Un día en el Caribe",
    description:
      "Navega por aguas turquesa, recorre la isla y disfruta de una parada para nadar.",
    includes: [
      "Paseo en catamarán",
      "Equipo de snorkel",
      "Almuerzo de muestra",
    ],
    itinerary: [
      "08:00 · Salida desde la marina",
      "10:00 · Parada de snorkel",
      "12:30 · Tiempo libre en la isla",
      "15:00 · Regreso a Cancún",
    ],
  },
  {
    id: "chichen",
    name: "Ruta a Chichén Itzá",
    category: "Cultura",
    destination: "Yucatán",
    price: 1290,
    duration: "10 horas",
    image: "/images/ruins.jpg",
    tag: "Historia a cielo abierto",
    description:
      "Una jornada de historia, arquitectura maya y una parada en Valladolid.",
    includes: [
      "Transporte de muestra",
      "Recorrido guiado",
      "Parada en Valladolid",
    ],
    itinerary: [
      "08:00 · Salida de Cancún",
      "11:00 · Recorrido arqueológico",
      "14:00 · Almuerzo",
      "16:00 · Paseo en Valladolid",
    ],
  },
  {
    id: "cenotes",
    name: "Sendero de cenotes",
    category: "Naturaleza",
    destination: "Riviera Maya",
    price: 750,
    duration: "5 horas",
    image: "/images/cenote.jpg",
    tag: "Otra forma de explorar",
    description:
      "Explora piscinas naturales entre vegetación y senderos de la Riviera Maya.",
    includes: [
      "Visita a dos cenotes",
      "Chaleco salvavidas",
      "Transporte de muestra",
    ],
    itinerary: [
      "08:00 · Punto de encuentro",
      "09:30 · Primer cenote",
      "11:30 · Segundo cenote",
      "13:00 · Regreso",
    ],
  },
  {
    id: "sunset",
    name: "Atardecer en el Caribe",
    category: "Mar",
    destination: "Cancún",
    price: 650,
    duration: "3 horas",
    image: "/images/sea.jpg",
    tag: "La última luz del día",
    description:
      "Un paseo costero para disfrutar de los colores del atardecer.",
    includes: ["Paseo costero", "Bebida sin alcohol", "Tiempo para fotografía"],
    itinerary: [
      "17:00 · Embarque",
      "18:00 · Recorrido por la costa",
      "19:00 · Atardecer",
      "20:00 · Regreso",
    ],
  },
  {
    id: "tulum",
    name: "Tulum: mar e historia",
    category: "Cultura",
    destination: "Tulum",
    price: 990,
    duration: "8 horas",
    image: "/images/ruins.jpg",
    tag: "Entre piedra y azul",
    description:
      "Un recorrido de muestra que combina historia y una tarde cerca de la costa.",
    includes: ["Transporte de muestra", "Recorrido guiado", "Tiempo libre"],
    itinerary: [
      "08:00 · Salida",
      "10:00 · Zona arqueológica",
      "13:00 · Tiempo libre",
      "16:00 · Regreso",
    ],
  },
  {
    id: "jungle",
    name: "Caminata en la selva",
    category: "Naturaleza",
    destination: "Puerto Morelos",
    price: 590,
    duration: "4 horas",
    image: "/images/cenote.jpg",
    tag: "Conecta con lo natural",
    description:
      "Senderos, vegetación y una pausa lejos del ritmo de la ciudad.",
    includes: ["Caminata de muestra", "Guía del recorrido", "Agua"],
    itinerary: [
      "08:00 · Encuentro",
      "09:00 · Caminata",
      "11:00 · Descanso",
      "12:00 · Regreso",
    ],
  },
];
export function bookingTotal(tour, adults, children) {
  if (
    !Number.isInteger(adults) ||
    adults < 1 ||
    !Number.isInteger(children) ||
    children < 0 ||
    adults + children > 12
  )
    throw new Error(
      "Selecciona entre 1 y 12 viajeros, con al menos un adulto.",
    );
  return Math.round(tour.price * (adults + children * 0.65));
}
export function remainingSeats(bookings, id, date) {
  return Math.max(
    0,
    12 -
      bookings
        .filter(
          (b) =>
            b.tourId === id && b.date === date && b.status === "Confirmada",
        )
        .reduce((s, b) => s + b.adults + b.children, 0),
  );
}
export function validateBooking(
  { tourId, date, adults, children },
  bookings,
  minDate,
) {
  const tour = tours.find((t) => t.id === tourId);
  if (!tour) throw new Error("El tour no existe.");
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    Number.isNaN(Date.parse(date)) ||
    new Date(date).toISOString().slice(0, 10) !== date ||
    date < minDate
  )
    throw new Error("Elige una fecha de hoy en adelante.");
  const total = bookingTotal(tour, adults, children);
  if (adults + children > remainingSeats(bookings, tourId, date))
    throw new Error("No quedan suficientes lugares para esta fecha.");
  return total;
}
