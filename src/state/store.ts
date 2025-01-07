import { Parking, ParkingListing } from '../lib/types'
import { create } from 'zustand'
import { Database } from '../../database.types'
import { persist, createJSONStorage } from 'zustand/middleware'

type ProfileState = {
  profile: Database['public']['Tables']['profiles']['Row'] | undefined
  vehicle: Database['public']['Tables']['vehicles']['Row'] | undefined
  setProfile: (profile: Database['public']['Tables']['profiles']['Row']) => void
  setVehicle: (vehicle: Database['public']['Tables']['vehicles']['Row']) => void
}

type ParkingDetailsState = {
  parking: Parking | undefined
  totalCost: number | undefined
  setParkingDetails: (parking: Parking | undefined, totalCost?: number) => void
}

type MapState = {
  location: number[]
  setLocation: (location: number[]) => void
}

type ParkingReservationState = {
  parking: Parking | undefined
  spotType: 'regular' | 'bigger' | 'disabled'
  totalCost: number | undefined
  setParkingReservation: (parking: Parking | undefined, totalCost?: number) => void
}

type ParkingListingState = {
  parkings: ParkingListing[]
  isLoading: boolean
  startDate: string | undefined
  endDate: string | undefined
  setParkings: (parkings: ParkingListing[]) => void
  setIsLoading: (isLoading: boolean) => void
  setStartDate: (startDate: string | undefined) => void
  setEndDate: (endDate: string | undefined) => void
}

type ParkingComparisonState = {
  comparedParkings: ParkingListing[]
  setComparedParkings: (parkings: ParkingListing[]) => void
  isComparisonEnabled: boolean
  setIsComparisonEnabled: (value: boolean) => void
  addParking: (parking: ParkingListing) => void
  removeParking: (parking: ParkingListing) => void
  isParkingAdded: (parking: ParkingListing) => boolean
}

type CurrentLocationState = {
  location: number[] | undefined
  setLocation: (location: number[]) => void
}

export const useMapStore = create<MapState>()((set) => ({
  location: [53.1325, 23.1688],
  setLocation: (location) => set({ location: location }),
}))

export const useProfileDetailsStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: undefined,
      vehicle: undefined,
      setProfile: (profile: Database['public']['Tables']['profiles']['Row']) => set({ profile: profile }),
      setVehicle: (vehicle: Database['public']['Tables']['vehicles']['Row']) => set({ vehicle: vehicle }),
    }),
    {
      name: 'profile-store',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)

export const useParkingDetailsStore = create<ParkingDetailsState>()((set) => ({
  parking: undefined,
  totalCost: undefined,
  setParkingDetails: (parking, totalCost) => set({ parking: parking, totalCost: totalCost }),
}))

export const useParkingReservationStore = create<ParkingReservationState>()((set) => ({
  parking: undefined,
  totalCost: undefined,
  spotType: 'regular',
  setParkingReservation: (parking, totalCost) => set({ parking: parking, totalCost: totalCost }),
}))

export const useParkingComparison = create<ParkingComparisonState>()((set, getState) => ({
  comparedParkings: [],
  isComparisonEnabled: false,
  setIsComparisonEnabled: (value) => set({ isComparisonEnabled: value }),
  setComparedParkings: (parkings) => set({ comparedParkings: parkings }),
  addParking: (parking) => set((state) => ({ comparedParkings: [...state.comparedParkings, parking] })),
  removeParking: (parking) =>
    set((state) => ({ comparedParkings: state.comparedParkings.filter((p) => p.id !== parking.id) })),
  isParkingAdded: (parking) => getState().comparedParkings.includes(parking),
}))

export const useParkingListingStore = create<ParkingListingState>()((set) => ({
  parkings: [],
  isLoading: false,
  startDate: undefined,
  endDate: undefined,
  setParkings: (parkings) => set({ parkings: parkings }),
  setIsLoading: (isLoading) => set({ isLoading: isLoading }),
  setStartDate: (startDate: string | undefined) => set({ startDate }),
  setEndDate: (endDate: string | undefined) => set({ endDate }),
}))

export const useCurrentLocationStore = create<CurrentLocationState>()((set) => ({
  location: undefined,
  setLocation: (location: number[]) => set({ location }),
}))
