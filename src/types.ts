export interface Flight {
  id: string;
  flightNumber: string;
  airline: string;
  source: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  availableSeats: number;
  totalSeats: number;
}

export interface Booking {
  id: string;
  userId: string;
  flightId: string;
  passengerName: string;
  seatNumber: string;
  status: 'confirmed' | 'cancelled';
  bookingDate: string;
  flightDetails: Partial<Flight>;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
}
