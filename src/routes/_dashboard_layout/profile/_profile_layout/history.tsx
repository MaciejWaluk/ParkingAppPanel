import { Grid, Text, useToast, VStack } from '@chakra-ui/react'
import { createFileRoute } from '@tanstack/react-router'
import { ParkingHistoryItem } from '../../../../features/parking/listing/ParkingHistoryItem'
import { useEffect, useState } from 'react'
import { Database } from '../../../../../database.types'
import { useProfileDetailsStore } from '../../../../state/store'
import supabase from '../../../../lib/supabase'

export const Route = createFileRoute('/_dashboard_layout/profile/_profile_layout/history')({
  component: HistoryComponent,
})

function HistoryComponent() {
  const [parkingHistory, setParkingHistory] = useState<
    Database['public']['Functions']['get_user_parking_history_with_vehicle_and_parking']['Returns']
  >([])
  const toast = useToast()
  const profile = useProfileDetailsStore((state) => state.profile)

  useEffect(() => {
    async function getHistory() {
      const { data, error } = await supabase.rpc('get_user_parking_history_with_vehicle_and_parking', {
        _userid: profile?.id as string,
      })
      if (!data || error) {
        toast({
          status: 'error',
          title: 'Historia',
          description: 'Wystąpił błąd przy wczytywaniu listy rezerwacji',
        })
        console.log(error?.message)
      } else {
        setParkingHistory(data)
      }
    }
    getHistory()
  }, [])

  return (
    <>
      <Text fontSize='32px' fontWeight='700' paddingBottom='20px'>
        Historia rezerwacji
      </Text>
      <Grid gap='20px' templateColumns='repeat(2, 1fr)'>
        {parkingHistory.map((reservation, index) => (
          <ParkingHistoryItem key={index} data={reservation} />
        ))}
      </Grid>
    </>
  )
}
