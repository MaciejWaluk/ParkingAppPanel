import { Box, Flex } from '@chakra-ui/react'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Map } from '../../features/map/Map'
import { ParkingListing } from '../../features/parking/listing/ParkingListing'
import { unitOfTime } from '../../lib/types'
import { useCurrentLocationStore } from '../../state/store'

export const Route = createFileRoute('/_dashboard_layout/')({
  component: HomeComponent,
})

function HomeComponent() {
  const [currentTab, setCurrentTab] = useState<unitOfTime>('hourly')
  const location = useCurrentLocationStore((state) => state.location)
  const setLocation = useCurrentLocationStore((state) => state.setLocation)

  useEffect(() => {
    if (!location) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation([position.coords.latitude, position.coords.longitude])
      })
    }
  }, [location, setLocation])

  return (
    <Flex height='calc(100% - 66px)'>
      <Box minWidth='40%' flex={9}>
        <ParkingListing setCurrentTab={setCurrentTab} />
      </Box>
      <Map flex={20} currentTab={currentTab} />
    </Flex>
  )
}
