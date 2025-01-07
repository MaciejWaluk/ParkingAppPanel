import { Database } from '../../database.types'

export type Parking = Database['public']['Tables']['parkings']['Row']

export type ParkingListing = Database['public']['Functions']['find_available_parkings']['Returns'][number]

export type unitOfTime = 'hourly' | 'daily' | 'monthly'

export type sortingType = 'location' | 'price_lowest' | 'price_highest'

export type ParkingReservation = {
  name: string
  address: string
  typeOfReservation: unitOfTime
  reservationStartDate: string
  reservationEndDate: string
  vehicle: {
    type: 'sedan' | 'suv' | 'pickup' | 'van' | 'truck'
    registrationNumber: string
  }
  unitCost: number
  totalCost: number
}
