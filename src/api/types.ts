export interface FoodProps {
  id: string;
  name: string;
  description: string;
  price: string;
  categoryId: number;
  imageUrls: {
    url: string;
    path: string;
  }[];
  quantity: number;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SingleFoodProps {
  id: string;
  name: string;
  description: string;
  price: string;
  categoryId: number;
  imageUrls: {
    url: string;
    path: string;
  }[];
  quantity: number;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FoodCategory {
  id: number;
  name: string;
  description: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
}
export interface FoodAddon {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudioBooking {
  id: string;
  userId: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  totalPrice: string;
  status: string;
}

export interface Studio {
  id: number;
  name: string;
  location: string;
  hourlyRate: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StudioAvailability {
  id: string;
  studioId: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface Hotel {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  country: string;
  imageUrls: {
    url: string;
    path: string;
  }[];
  rating: string;
  isAvailable: boolean;
  coordinates: {
    lat: number;
    lon: number;
  };
  createdAt: string;
  updatedAt: string;
  amenities: {
    id: number;
    name: string;
    icon: string;
  }[];
  rooms: {
    id: string;
    name: string;
    description: string;
    pricePerNight: string;
    imageUrls: {
      url: string;
      path: string;
    }[];
    capacity: number;
    isAvailable: boolean;
  }[];
}

export interface HotelInfo {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  country: string;
  imageUrls: {
    url: string;
    path: string;
  }[];
  rating: string;
  isAvailable: boolean;
  coordinates: {
    lat: number;
    lon: number;
  };
  createdAt: string;
  updatedAt: string;
  amenities: {
    id: number;
    name: string;
    icon: string;
  }[];
  rooms: {
    id: string;
    name: string;
    description: string;
    pricePerNight: string;
    imageUrls: {
      url: string;
      path: string;
    }[];
    capacity: number;
    isAvailable: boolean;
  }[];
}

export interface Amenity {
  id: number;
  name: string;
  icon: string;
  iconPath: string;
  createdAt: string;
  updatedAt: string;
}

export interface Cinema {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  countryId: number;
  createdAt: string;
  updatedAt: string;
}

export interface MovieCinema {
  id: string;
  cinemaId: string;
  title: string;
  description: string;
  cast: string;
  durationMinutes: number;
  ageRating: number;
  posterUrl: string;
  posterPath: string;
  trailerUrl: string;
  trailerPath: string;
  genres: {
    id: number;
    name: string;
    description: string;
  }[];
}

export interface Vrgame {
  id: string;
  name: string;
  description: string;
  categoryId: number;
  imageUrls: {
    url: string;
    path: string;
  }[];
  ageRating: number;
  ticketPrice: string;
  ticketQuantity: number;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RentalEquipment {
  id: string;
  name: string;
  description: string;
  imageUrls: {
    url: string;
    path: string;
  }[];
  rentalPricePerDay: string;
  address: string;
  quantityAvailable: number;
  isAvailable: boolean;
  category: {
    id: number;
    name: string;
    description: string;
    icon: string;
    iconPath: string;
  };
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  countryId: number;
  phone: string;
  address: string;
  role: string;
  emailVerified: boolean;
  refreshToken?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EquipmentCategory {
  id: string;
  name: string;
  description: string;
  iconPath: string;
  icon: string;
}

export interface Dashstats {
  userTotal: number;
  vrgameSubscribersTotal: number;
  movieSubscribersTotal: number;
  equipmentSubscribersTotal: number;
  hotelSubscribersTotal: number;
  studioSubscribersTotal: number;
  foodSubscribersTotal: number;
}

export interface DeliverySettings {
  id: number;
  pricePerKm: string;
  originLat: string;
  originLng: string;
  // [key: string]: any;
  // createdAt: "2025-11-12T00:07:04.000Z";
  // updatedAt: "2025-11-12T00:07:04.000Z";
}

export interface AdvertBanner {
  id: number;
  name: string;
  imageUrls: {
    url: string;
    path: string;
  }[];
  linkUrl: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MovieObject {
  id: string;
  cinemaId: string;
  title: string;
  description: string;
  cast: string;
  durationMinutes: number;
  ageRating: number;
  posterUrl: string;
  posterPath: string;
  trailerUrl: string;
  trailerPath: string;
  createdAt: string;
  updatedAt: string;
  genres: {
    id: number;
    name: string;
    description: string;
  }[];
}

export interface Showtime {
  id: number;
  movieId: string;
  cinemaHallId: string;
  showtime: string;
  showDate: string;
  ticketPrice: string;
  totalSeats: number;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}
export interface StudioBookings {
  id: string;
  userId: string;
  orderId: string;
  equipmentId: string;
  equipmentName: string;
  equipmentImageUrl: string;
  rentalPricePerDay: string;
  address: string;
  rentalStartDate: string;
  rentalEndDate: string;
  quantity: number;
  totalPrice: string;
  currency: string;
  status: string;
}

export interface EquipmentBooking {
  id: string;
  userId: string;
  orderId: string;
  equipmentId: string;
  equipmentName: string;
  equipmentImageUrl: string;
  rentalPricePerDay: string;
  address: string;
  rentalStartDate: string;
  rentalEndDate: string;
  quantity: number;
  totalPrice: string;
  currency: string;
  status: string;
}

export interface MovieBooking {
  ticketId: string;
  userId: string;
  orderId: string;
  movieId: string;
  movieName: string;
  movieImageUrl: string;
  cinemaHallId: string;
  genre: string;
  cinemaHallName: string;
  location: string;
  ticketPrice: string;
  ticketQuantity: number;
  showDate: string;
  showtime: string;
  totalPrice: string;
  purchaseDate: string;
  isUsed: boolean;
  verifiedAt: string | null;
  verifiedBy: string | null;
  snackAddOns: {
    snackId: number;
    snackName: string;
    snackPrice: string;
    snackQuantity: number;
  }[];
  currency: string;
  status: string;
}
