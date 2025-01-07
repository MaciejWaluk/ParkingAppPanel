import { Text, useToast, VStack } from '@chakra-ui/react'
import { createFileRoute } from '@tanstack/react-router'
import { ParkingReservationItem } from '../../../../features/parking/listing/ParkingReservationItem'
import { useEffect, useState } from 'react'
import { Database } from '../../../../../database.types'
import supabase from '../../../../lib/supabase'
import { useProfileDetailsStore } from '../../../../state/store'

export const Route = createFileRoute('/_dashboard_layout/profile/_profile_layout/reservations')({
  component: ReservationsScreen,
})

function ReservationsScreen() {
  const [parkingReservations, setParkingReservations] = useState<
    Database['public']['Functions']['get_user_reservations_with_vehicle_and_parking']['Returns']
  >([])
  const toast = useToast()
  const profile = useProfileDetailsStore((state) => state.profile)

  useEffect(() => {
    async function getReservations() {
      const { data, error } = await supabase.rpc('get_user_reservations_with_vehicle_and_parking', {
        _userid: profile?.id as string,
      })
      if (!data || error) {
        toast({
          status: 'error',
          title: 'Rezerwacje',
          description: 'Wystąpił błąd przy wczytywaniu listy rezerwacji',
        })
        console.log(error?.message)
      } else {
        setParkingReservations(data)
      }
    }
    getReservations()
  }, [])

  const deleteReservation = (id: string) => {
    const updatedArray = parkingReservations.filter((p) => p.id !== id)
    setParkingReservations(updatedArray)
    toast({
      status: 'success',
      title: 'Anulowanie rezerwacji',
      description: 'Rezerwacja anulowana',
    })
  }
  return (
    <>
      <Text fontSize='32px' fontWeight='700' paddingBottom='20px'>
        Rezerwacje
      </Text>
      <VStack gap='20px'>
        {parkingReservations.map((reservation, index) => (
          <ParkingReservationItem key={index} data={reservation} deleteReservation={deleteReservation} />
        ))}
      </VStack>
    </>
  )
}
