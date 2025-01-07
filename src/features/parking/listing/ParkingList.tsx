import { Center, HStack, Select, Spinner, StackProps, Text, VStack } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useParkingListingStore } from '../../../state/store'
import { ParkingListing, sortingType } from '../../../lib/types'
import { ParkingListingItem } from './ParkingListingItem'

type ParkingListProps = {
  data: ParkingListing[]
} & StackProps

export const ParkingList = ({ data, ...props }: ParkingListProps) => {
  const isLoading = useParkingListingStore((state) => state.isLoading)
  const [sortingType, setSortingType] = useState<sortingType>('location')
  const setParkings = useParkingListingStore((state) => state.setParkings)

  useEffect(() => {
    switch (sortingType) {
      case 'location':
        setParkings(data.sort((a, b) => a.distance_km - b.distance_km))
        break
      case 'price_lowest':
        setParkings(data.sort((a, b) => a.price - b.price))
        break
      case 'price_highest':
        setParkings(data.sort((a, b) => b.price - a.price))
        break
    }
  }, [setParkings, sortingType])
  return isLoading ? (
    <Center height='100%'>
      <Spinner size='xl' />
    </Center>
  ) : (
    <VStack {...props}>
      {data.length ? (
        <>
          <HStack width='100%' gap='10px' alignItems='center' justifyContent='flex-end'>
            <Text fontSize='12px'>Sortowanie: </Text>
            <Select
              fontSize='12px'
              width='auto'
              borderRadius='radiusL'
              bgColor='content'
              onChange={(event) => setSortingType(event.target.value as sortingType)}
            >
              <option value='location'>Najmniejsza odległość</option>
              <option value='price_lowest'>Cena rosnąco</option>
              <option value='price_highest'>Cena malejąco</option>
            </Select>
          </HStack>
          {data.map((parking, index) => (
            <ParkingListingItem data={parking} key={index} />
          ))}
        </>
      ) : (
        <Text>Wybierz miejsce i daty rezerwacji, aby wyświetlić listę dostępnych parkingów</Text>
      )}
    </VStack>
  )
}
