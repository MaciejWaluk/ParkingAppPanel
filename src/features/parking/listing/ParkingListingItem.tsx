import { Box, Button, HStack, StackProps, Text, useToast, VStack } from '@chakra-ui/react'
import { BsClock, BsCurrencyDollar, BsGeo, BsStar } from 'react-icons/bs'
import React, { useEffect, useState } from 'react'
import { ParkingListing, unitOfTime } from '../../../lib/types'
import { Tag } from '../../../common/components/Tag'
import {
  useParkingComparison,
  useParkingDetailsStore,
  useParkingListingStore,
  useParkingReservationStore,
} from '../../../state/store'
import { calculateMilisecondsDifference } from '../../../utils/time'
import { Database } from '../../../../database.types'
import supabase from '../../../lib/supabase'
import { tagsObject } from '../../../lib/consts'

type ParkingListingItemProps = {
  data: ParkingListing
} & StackProps

export const ParkingListingItem = ({ data, ...props }: ParkingListingItemProps) => {
  const setParkingDetails = useParkingDetailsStore((state) => state.setParkingDetails)
  const setParkingReservation = useParkingReservationStore((state) => state.setParkingReservation)
  const startDate = useParkingListingStore((state) => state.startDate)
  const endDate = useParkingListingStore((state) => state.endDate)
  const [rating, setRating] = useState<Database['public']['Functions']['get_parking_rating_info']['Returns']>()
  const toast = useToast()
  const addParkingToComparison = useParkingComparison((state) => state.addParking)
  const removeParkingFromComparison = useParkingComparison((state) => state.removeParking)
  const isCompared = useParkingComparison((state) => state.isParkingAdded)

  useEffect(() => {
    async function getRating() {
      const { data: rating, error: ratingError } = await supabase.rpc('get_parking_rating_info', {
        _parkingid: data.id,
      })

      if (ratingError) {
        toast({
          status: 'error',
          title: 'Pobieranie oceny',
          description: 'Wystąpił błąd przy pobieraniu oceny',
        })
      } else {
        setRating(rating)
      }
    }
    getRating()
  }, [data.id, toast])

  const distance = () => {
    if (data.distance_km < 0.1) {
      return `${(data.distance_km * 1000).toFixed(1)} m `
    }
    return `${data.distance_km.toFixed(1)} km`
  }

  const totalCost = () => {
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

  return (
    <HStack
      overflow='clip'
      width='100%'
      gap='30px'
      borderRadius='radiusM'
      border='1px solid'
      borderColor='border'
      bgColor='backgroundSecondary'
      {...props}
    >
      <Box width='30%' alignSelf='stretch' bgImage={`url(${data.imageUrl})`} bgSize='cover' />
      <VStack paddingY='20px' gap='0px' width='100%' paddingRight='13px' alignItems='stretch'>
        <HStack marginBottom='-5px' width='100%' justifyContent='space-between'>
          <Text fontSize='16px' fontWeight='700'>
            {distance()}
          </Text>
          <Text
            cursor='pointer'
            onClick={() => {
              isCompared(data) ? removeParkingFromComparison(data) : addParkingToComparison(data)
            }}
          >
            {isCompared(data) ? 'Usuń z porównania' : 'Dodaj do porównania'}
          </Text>
        </HStack>
        <HStack justifyContent='space-between' alignItems='center'>
          <Text fontSize='20px' fontWeight='700'>
            {data.name}
          </Text>
          <Text textAlign='center' fontSize='32px' fontWeight='700'>
            {totalCost()} zł
          </Text>
        </HStack>
        <HStack width='100%' flexWrap='wrap' marginTop='-5px' marginBottom='20px'>
          {(data.tags as string[]).map((tag, id) => (
            <Tag key={id} label={tagsObject[tag as keyof typeof tagsObject]} />
          ))}
        </HStack>
        <HStack>
          <VStack flex={1} alignItems='stretch'>
            <HStack>
              <BsGeo size='20px' />
              <Text fontSize='14px'>{data.address}</Text>
            </HStack>
            {data.unitOfTime === 'hourly' && (
              <HStack>
                <BsClock size='20px' />
                <Text fontSize='14px'>{data.openHours}</Text>
              </HStack>
            )}
            <HStack>
              <BsCurrencyDollar size='20px' />
              <Text fontSize='14px'>
                {data.price} zł /{' '}
                {data.unitOfTime === 'hourly' ? 'godzina' : data.unitOfTime === 'daily' ? 'dzień' : 'miesiąc'}
              </Text>
            </HStack>
            {rating && (
              <HStack>
                <BsStar size='20px' />
                <Text fontSize='14px'>
                  {rating[0].ratingaverage === 0 ? '0.0' : rating[0].ratingaverage} ({rating[0].ratingcount})
                </Text>
              </HStack>
            )}
          </VStack>
          <VStack flexWrap='wrap' justifyContent='center' alignSelf='flex-end'>
            <Button onClick={() => setParkingReservation(data, totalCost())}>Zarezerwuj</Button>
            <Button variant='ghost' onClick={() => setParkingDetails(data, totalCost())}>
              Szczegóły
            </Button>
          </VStack>
        </HStack>
      </VStack>
    </HStack>
  )
}
