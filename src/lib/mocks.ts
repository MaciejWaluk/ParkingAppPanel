import { ParkingReservation } from './types'

export const parkingReservations: ParkingReservation[] = [
  {
    name: 'Parking Centralny',
    address: 'ul. Lipowa 10, Białystok',
    typeOfReservation: 'hourly',
    reservationStartDate: '01.04.2024, godz. 08:00',
    reservationEndDate: '01.04.2024, godz. 12:00',
    vehicle: {
      type: 'sedan',
      registrationNumber: 'ABC1234',
    },
    unitCost: 5, // Cena za godzinę z Parking Centralny
    totalCost: 20, // 4 godziny * 5 PLN/godz
  },
  {
    name: 'Parking Przy Rynku',
    address: 'ul. Lipowa 15, Białystok',
    typeOfReservation: 'daily',
    reservationStartDate: '05-04-2024',
    reservationEndDate: '06-04-2024',
    vehicle: {
      type: 'suv',
      registrationNumber: 'XYZ5678',
    },
    unitCost: 96, // Cena za dzień: 24 godziny * 4 PLN/godz
    totalCost: 96, // 1 dzień * 96 PLN/dzień
  },
  {
    name: 'Parking Dworzec Główny',
    address: 'ul. Sienkiewicza 2, Białystok',
    typeOfReservation: 'monthly',
    reservationStartDate: '01-04-2024',
    reservationEndDate: '01-05-2024',
    vehicle: {
      type: 'van',
      registrationNumber: 'LMN3456',
    },
    unitCost: 5040, // Cena za miesiąc: 30 dni * 24 godziny * 7 PLN/godz
    totalCost: 5040, // 1 miesiąc * 5040 PLN/miesiąc
  },
  {
    name: 'Parking Lotnisko',
    address: 'ul. Lotniskowa 2, Białystok',
    typeOfReservation: 'hourly',
    reservationStartDate: '10.04.2024, godz. 14:00',
    reservationEndDate: '10.04.2024, godz. 18:30',
    vehicle: {
      type: 'pickup',
      registrationNumber: 'DEF7890',
    },
    unitCost: 7, // Cena za godzinę z Parking Lotnisko
    totalCost: 35, // 5 godzin * 7 PLN/godz (zaokrąglone do pełnych godzin)
  },
  {
    name: 'Parking Centrum Handlowego',
    address: 'Galeria Białostocka, ul. Wysoka 20, Białystok',
    typeOfReservation: 'daily',
    reservationStartDate: '15-04-2024',
    reservationEndDate: '16-04-2024',
    vehicle: {
      type: 'truck',
      registrationNumber: 'GHI0123',
    },
    unitCost: 96, // Cena za dzień: 24 godziny * 4 PLN/godz
    totalCost: 96, // 1 dzień * 96 PLN/dzień
  },
  {
    name: 'Parking Park & Ride',
    address: 'ul. Transportowa 20, Białystok',
    typeOfReservation: 'monthly',
    reservationStartDate: '01-04-2024',
    reservationEndDate: '01-05-2024',
    vehicle: {
      type: 'suv',
      registrationNumber: 'JKL4567',
    },
    unitCost: 3600, // Cena za miesiąc: 30 dni * 24 godziny * 5 PLN/godz
    totalCost: 3600, // 1 miesiąc * 3600 PLN/miesiąc
  },
  {
    name: 'Parking Biznesowy',
    address: 'ul. Biznesowa 12, Białystok',
    typeOfReservation: 'daily',
    reservationStartDate: '20-04-2024',
    reservationEndDate: '21-04-2024',
    vehicle: {
      type: 'sedan',
      registrationNumber: 'MNO7891',
    },
    unitCost: 144, // Cena za dzień: 24 godziny * 6 PLN/godz
    totalCost: 144, // 1 dzień * 144 PLN/dzień
  },
  {
    name: 'Parking Stare Miasto',
    address: 'ul. Historyczna 3, Białystok',
    typeOfReservation: 'hourly',
    reservationStartDate: '25.04.2024, godz. 10:00',
    reservationEndDate: '25.04.2024, godz. 13:00',
    vehicle: {
      type: 'sedan', // Zmieniono z 'motorcycle' na 'sedan'
      registrationNumber: 'PQR2345',
    },
    unitCost: 5, // Cena za godzinę z Parking Stare Miasto
    totalCost: 15, // 3 godziny * 5 PLN/godz
  },
  {
    name: 'Parking Uniwersytecki',
    address: 'ul. Akademicka 6, Białystok',
    typeOfReservation: 'monthly',
    reservationStartDate: '01-04-2024',
    reservationEndDate: '01-05-2024',
    vehicle: {
      type: 'van',
      registrationNumber: 'STU5678',
    },
    unitCost: 3600, // Cena za miesiąc: 30 dni * 24 godziny * 5 PLN/godz
    totalCost: 3600, // 1 miesiąc * 3600 PLN/miesiąc
  },
  {
    name: 'Parking Sportowy',
    address: 'ul. Stadionowa 9, Białystok',
    typeOfReservation: 'hourly',
    reservationStartDate: '30.04.2024, godz. 18:00',
    reservationEndDate: '30.04.2024, godz. 22:00',
    vehicle: {
      type: 'truck',
      registrationNumber: 'VWX9012',
    },
    unitCost: 4, // Cena za godzinę z Parking Sportowy
    totalCost: 16, // 4 godziny * 4 PLN/godz
  },
]
