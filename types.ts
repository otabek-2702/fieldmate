
export interface Stadium {
  id: string;
  name: string;
  address: string;
  description: string;
  pricePerHour: number;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  amenities: string[];
  type: 'indoor' | 'outdoor';
  distance?: number;
}

export interface Booking {
  id: string;
  stadiumName: string;
  stadiumImageUrl: string;
  date: string;
  startTime: string;
  duration: number;
  players: number;
  totalPrice: number;
  status: 'upcoming' | 'completed' | 'pending_confirmation';
  paymentDetails: {
    method: 'cash' | 'card' | 'hybrid';
    cashAmount?: number;
    cardAmount?: number;
  };
  userName?: string;
  commission?: number;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export type UserRole = 'player' | 'admin' | null;
