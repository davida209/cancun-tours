import test from "node:test";
import assert from "node:assert/strict";
import {
  tours,
  bookingTotal,
  remainingSeats,
  validateBooking,
} from "../src/model.js";
test("child tariff and adult minimum", () => {
  assert.equal(bookingTotal(tours[0], 2, 1), 2359);
  assert.throws(() => bookingTotal(tours[0], 0, 2));
  assert.throws(() => bookingTotal(tours[0], 12, 1));
});
test("capacity excludes canceled reservations", () => {
  const b = [
    {
      tourId: "isla",
      date: "2027-01-01",
      adults: 10,
      children: 1,
      status: "Confirmada",
    },
    {
      tourId: "isla",
      date: "2027-01-01",
      adults: 2,
      children: 0,
      status: "Cancelada",
    },
  ];
  assert.equal(remainingSeats(b, "isla", "2027-01-01"), 1);
  assert.throws(() =>
    validateBooking(
      { tourId: "isla", date: "2027-01-01", adults: 2, children: 0 },
      b,
      "2026-10-12",
    ),
  );
});
test("reject past dates and unknown tours", () => {
  assert.throws(() =>
    validateBooking(
      { tourId: "isla", date: "2025-01-01", adults: 1, children: 0 },
      [],
      "2026-10-12",
    ),
  );
  assert.throws(() =>
    validateBooking(
      { tourId: "missing", date: "2027-01-01", adults: 1, children: 0 },
      [],
      "2026-10-12",
    ),
  );
});
test("calendar dates must exist", () => {
  assert.throws(() =>
    validateBooking(
      { tourId: "isla", date: "2027-02-31", adults: 1, children: 0 },
      [],
      "2026-10-12",
    ),
  );
});
