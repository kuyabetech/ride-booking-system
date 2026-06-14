export const calculateFare = (distanceKm, baseRate = 500, perKmRate = 100) => {
  const fare = baseRate + (distanceKm * perKmRate);
  return Math.round(fare);
};

export const calculateSurgePrice = (bookingCount, baseMultiplier = 1.0) => {
  // Apply surge pricing based on bookings
  if (bookingCount > 20) return baseMultiplier * 1.5;
  if (bookingCount > 15) return baseMultiplier * 1.3;
  if (bookingCount > 10) return baseMultiplier * 1.1;
  return baseMultiplier;
};

export const applyDiscount = (fare, discountPercent = 0) => {
  return fare * (1 - discountPercent / 100);
};

export const calculateTotalFare = (distanceKm, bookingCount = 0, discountPercent = 0) => {
  let baseFare = calculateFare(distanceKm);
  let surgeMultiplier = calculateSurgePrice(bookingCount);
  let totalFare = baseFare * surgeMultiplier;
  return Math.round(applyDiscount(totalFare, discountPercent));
};
