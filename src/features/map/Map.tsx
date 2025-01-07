import { Box, BoxProps, Button, Center, HStack, Spinner, Text, VStack } from '@chakra-ui/react'
import { LatLng, LatLngExpression } from 'leaflet'
import { BsClock, BsCurrencyDollar, BsGeo } from 'react-icons/bs'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import Divider from '../../common/components/Divider'
import { Tag } from '../../common/components/Tag'
import {
  useMapStore,
  useParkingComparison,
  useParkingDetailsStore,
  useParkingListingStore,
  useParkingReservationStore,
} from '../../state/store'
import './styles.css'
import { ParkingListing, unitOfTime } from '../../lib/types'
import { calculateMilisecondsDifference } from '../../utils/time'
import { tagsObject } from '../../lib/consts'
import { useEffect } from 'react'

type MapProps = {
  currentTab: unitOfTime
} & BoxProps

export const Map = ({ currentTab, ...props }: MapProps) => {
  const setParkingDetails = useParkingDetailsStore((state) => state.setParkingDetails)
  const setParkingReservation = useParkingReservationStore((state) => state.setParkingReservation)
  const parkings = useParkingListingStore((state) => state.parkings)
  const isLoading = useParkingListingStore((state) => state.isLoading)
  const startDate = useParkingListingStore((state) => state.startDate)
  const endDate = useParkingListingStore((state) => state.endDate)
  const location = useMapStore((state) => state.location)
  const comparedParkings = useParkingComparison((state) => state.comparedParkings)
  const isComparisonEnabled = useParkingComparison((state) => state.isComparisonEnabled)
  const setIsComparisonEnabled = useParkingComparison((state) => state.setIsComparisonEnabled)

  const MyMapComponent = () => {
    const map = useMap()
    useEffect(() => {
      map.panTo(new LatLng(location[0], location[1]), { animate: true })
    }, [location])
  }

  const totalCost = (data: ParkingListing) => {
    const hoursDifference = calculateMilisecondsDifference(startDate!, endDate!) / 1000 / 60 / 60
    switch (data.unitOfTime as unitOfTime) {
      case 'hourly':
        return Math.round(hoursDifference) * data.price
      case 'daily':
        return Math.round(hoursDifference / 24) * data.price
      case 'monthly':
        return Math.round(hoursDifference / 24 / 30) * data.price
    }
  }

  const parkingMarkers = isComparisonEnabled ? comparedParkings : parkings

  return (
    <Box {...props} overflow='hidden' opacity={isLoading ? 0.5 : 1} position='relative'>
      {comparedParkings.length > 0 && (
        <Box position='absolute' bottom='30px' right='20px' zIndex={9999}>
          <Button
            onClick={() => {
              setIsComparisonEnabled(!isComparisonEnabled)
            }}
          >
            {isComparisonEnabled ? 'Wyjdź z porównywania' : `Wybierz (${comparedParkings.length})`}
          </Button>
        </Box>
      )}
      <MapContainer
        style={{ width: '100%', height: '100%' }}
        center={[location[0], location[1]]}
        zoom={14}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
        />
        <MyMapComponent />
        {isLoading || (!startDate && !endDate) ? (
          <Center height='100%'>
            <Spinner size='xl' />
          </Center>
        ) : (
          parkingMarkers.length > 0 &&
          parkingMarkers[0].unitOfTime === currentTab &&
          parkingMarkers.map((parking) => (
            <Marker riseOnHover key={parking.name} position={parking.position as LatLngExpression}>
              <Popup>
                <VStack gap='10px' alignItems='stretch'>
                  <Text fontSize='20px' fontWeight='700' margin={0}>
                    {parking.name}
                  </Text>
                  <HStack width='100%' flexWrap='wrap' marginBottom='10px'>
                    {(parking.tags as string[]).map((tag, index) => (
                      <Tag key={index} label={tagsObject[tag as keyof typeof tagsObject]} />
                    ))}
                  </HStack>

                  <HStack>
                    <BsGeo size='20px' />
                    <Text fontSize='14px'>{parking.address}</Text>
                  </HStack>
                  {currentTab === 'hourly' && (
                    <HStack>
                      <BsClock size='20px' />
                      <Text fontSize='14px'>{parking.openHours}</Text>
                    </HStack>
                  )}
                  <HStack>
                    <BsCurrencyDollar size='20px' />
                    <Text fontSize='14px'>
                      {parking.price} zł /{' '}
                      {currentTab === 'hourly' ? 'godzina' : currentTab === 'daily' ? 'dzień' : 'miesiąc'}
                    </Text>
                  </HStack>

                  <Divider marginTop='10px' marginBottom='-5px' />
                  <VStack fontSize='24px' fontWeight='700' width='100%' alignItems='flex-end'>
                    <Text>{totalCost(parking)} zł</Text>
                  </VStack>
                  <HStack justifyContent='flex-end' marginTop='10px'>
                    <Button variant='ghost' size='small' onClick={() => setParkingDetails(parking, totalCost(parking))}>
                      Szczegóły
                    </Button>
                    <Button size='small' onClick={() => setParkingReservation(parking, totalCost(parking))}>
                      Rezerwuj
                    </Button>
                  </HStack>
                </VStack>
              </Popup>
            </Marker>
          ))
        )}
      </MapContainer>
    </Box>
  )
}
