import {
  Box,
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  StackProps,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from '@chakra-ui/react'
import { BsCalendarCheck, BsCalendarMinus, BsGeo } from 'react-icons/bs'
import { FaCarSide, FaShuttleVan, FaTruckMoving, FaTruckPickup } from 'react-icons/fa'
import { TbCarSuv } from 'react-icons/tb'
import { unitOfTime } from '../../../lib/types'

import Divider from '../../../common/components/Divider'
import { Database } from '../../../../database.types'
import { getReservationTime, totalCost } from '../../../utils/time'
import React, { useEffect, useState } from 'react'
import { spotTypes } from '../../../lib/consts'

import { Rating, ThinStar } from '@smastrom/react-rating'

import '@smastrom/react-rating/style.css'
import supabase from '../../../lib/supabase'
import { useParkingComparison } from '../../../state/store'

type ParkingHistoryItemProps = {
  data: Database['public']['Functions']['get_user_parking_history_with_vehicle_and_parking']['Returns'][number]
} & StackProps

const carTypeIcons = {
  sedan: {
    icon: <FaCarSide size='20px' />,
    name: 'Sedan',
  },
  suv: {
    icon: <TbCarSuv size='20px' />,
    name: 'SUV',
  },
  pickup: {
    icon: <FaTruckPickup size='20px' />,
    name: 'Pickup',
  },
  van: {
    icon: <FaShuttleVan size='20px' />,
    name: 'Van',
  },
  truck: {
    icon: <FaTruckMoving size='20px' />,
    name: 'Autobus / Ciężarówka',
  },
}

const unitMap = {
  hourly: 'godzina',
  daily: 'dzień',
  monthly: 'miesiąc',
}

const typeMap = {
  hourly: 'Godziny',
  daily: 'Dni',
  monthly: 'Miesiące',
}

export const ParkingHistoryItem = ({ data, ...props }: ParkingHistoryItemProps) => {
  const parkingHistory = {
    ...data,
    parking: data.parking as Database['public']['Tables']['parkings']['Row'],
    vehicle: data.vehicle as Database['public']['Tables']['vehicles']['Row'],
  }
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()
  const [rating, setRating] = useState(0)
  const [ratingId, setRatingId] = useState<string | undefined>(undefined)

  useEffect(() => {
    async function getRating() {
      if (isOpen) {
        const { data, error } = await supabase.from('parking_ratings').select().eq('historyId', parkingHistory.id)
        if (!data || error) {
          toast({
            status: 'error',
            title: 'Pobieranie oceny',
            description: 'Błąd przy pobieraniu oceny',
          })
          return
        }
        if (data[0]) {
          setRatingId(data[0].id)
          setRating(data[0].rating)
        }
      } else {
        setRating(0)
        setRatingId(undefined)
      }
    }
    getRating()
  }, [isOpen])

  const handleClose = async () => {
    if (!ratingId) {
      const { error } = await supabase.from('parking_ratings').insert({
        historyId: parkingHistory.id,
        rating: rating,
      })
      if (error) {
        toast({
          status: 'error',
          title: 'Ocena',
          description: 'Błąd przy ocenianiu',
        })
      } else {
        onClose()
      }
    } else {
      const { error } = await supabase
        .from('parking_ratings')
        .update({
          rating: rating,
        })
        .eq('id', ratingId)
      if (error) {
        toast({
          status: 'error',
          title: 'Ocena',
          description: 'Błąd przy ocenianiu',
        })
      } else {
        onClose()
      }
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
      <Box
        width='150px'
        alignSelf='stretch'
        bgImage='url(https://upload.wikimedia.org/wikipedia/commons/6/6d/Tel_Aviv_parking_lot.jpg)'
        bgSize='cover'
      />
      <VStack width='100%' alignItems='flex-start' gap='10px' paddingY='20px' paddingRight='20px'>
        <HStack width='100%' justifyContent='space-between'>
          <Text fontSize='20px' fontWeight='700'>
            {parkingHistory.parking.name}
          </Text>
          <Button variant='ghost' onClick={onOpen}>
            Szczegóły
          </Button>
        </HStack>

        <HStack width='100%' alignItems='stretch'>
          <VStack flex={1} alignItems='flex-start' gap='15px'>
            <HStack>
              <BsCalendarCheck size='20px' />
              <Text fontSize='14px'>
                Start rezerwacji:{' '}
                {getReservationTime(
                  new Date(parkingHistory.startDate),
                  parkingHistory.parking.unitOfTime as unitOfTime,
                )}
              </Text>
            </HStack>
            <HStack>
              <BsCalendarMinus size='20px' />
              <Text fontSize='14px'>
                Koniec rezerwacji:{' '}
                {getReservationTime(new Date(parkingHistory.endDate), parkingHistory.parking.unitOfTime as unitOfTime)}
              </Text>
            </HStack>
            <HStack>
              <BsGeo size='20px' />
              <Text fontSize='14px'>{parkingHistory.parking.address}</Text>
            </HStack>
          </VStack>
        </HStack>
        <Divider width='100%' />
        <HStack width='100%' justifyContent='space-between'>
          <VStack alignItems='flex-start'>
            <Text fontSize='16px'>Typ rezerwacji: </Text>
            <Text fontSize='20px' fontWeight='700'>
              {typeMap[parkingHistory.parking.unitOfTime as keyof typeof typeMap]}
            </Text>
          </VStack>
          <VStack alignItems='flex-end'>
            <Text fontSize='16px'>Opłata za całość:</Text>
            <Text fontSize='20px' fontWeight='700'>
              {totalCost(
                parkingHistory.startDate,
                parkingHistory.endDate,
                parkingHistory.parking.unitOfTime as unitOfTime,
                parkingHistory.parking.price,
              )}{' '}
              zł
            </Text>
          </VStack>
        </HStack>
      </VStack>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Szczegóły rezerwacji</ModalHeader>
          <ModalBody>
            <VStack gap='10px' width='100%' alignItems='stretch'>
              <HStack justifyContent='space-between'>
                <Text fontSize='14px' fontWeight='700'>
                  Nazwa parkingu:
                </Text>
                <Text fontSize='14px'>{parkingHistory.parking.name}</Text>
              </HStack>
              <HStack justifyContent='space-between'>
                <Text fontSize='14px' fontWeight='700'>
                  Adres:
                </Text>
                <Text fontSize='14px'>{parkingHistory.parking.address}</Text>
              </HStack>
              <HStack justifyContent='space-between'>
                <Text fontSize='14px' fontWeight='700'>
                  Start rezerwacji:
                </Text>
                <Text fontSize='14px'>
                  {getReservationTime(
                    new Date(parkingHistory.startDate),
                    parkingHistory.parking.unitOfTime as unitOfTime,
                  )}
                </Text>
              </HStack>
              <HStack justifyContent='space-between'>
                <Text fontSize='14px' fontWeight='700'>
                  Koniec rezerwacji:
                </Text>
                <Text fontSize='14px'>
                  {getReservationTime(
                    new Date(parkingHistory.endDate),
                    parkingHistory.parking.unitOfTime as unitOfTime,
                  )}
                </Text>
              </HStack>
              <HStack justifyContent='space-between'>
                <Text fontSize='14px' fontWeight='700'>
                  Rodzaj miejsca:
                </Text>
                <Text fontSize='14px'>{spotTypes[parkingHistory.spotType as keyof typeof spotTypes]}</Text>
              </HStack>
              <Divider />
              <HStack justifyContent='space-between'>
                <Text fontSize='14px' fontWeight='700'>
                  Typ pojazdu:
                </Text>
                <Text fontSize='14px'>
                  {carTypeIcons[parkingHistory.vehicle.type as keyof typeof carTypeIcons].name}
                </Text>
              </HStack>{' '}
              <HStack justifyContent='space-between'>
                <Text fontSize='14px' fontWeight='700'>
                  Numer rejestracyjny:
                </Text>
                <Text fontSize='14px'>{parkingHistory.vehicle.registerNumber}</Text>
              </HStack>
              <Divider width='100%' />
              <HStack width='100%' justifyContent='space-between'>
                <VStack alignItems='flex-start'>
                  <Text fontSize='16px'>Typ rezerwacji: </Text>
                  <Text fontSize='20px' fontWeight='700'>
                    {typeMap[parkingHistory.parking.unitOfTime as keyof typeof typeMap]}
                  </Text>
                </VStack>
                <VStack alignItems='flex-end'>
                  <Text fontSize='16px'>Opłata za całość:</Text>
                  <Text fontSize='20px' fontWeight='700'>
                    {totalCost(
                      parkingHistory.startDate,
                      parkingHistory.endDate,
                      parkingHistory.parking.unitOfTime as unitOfTime,
                      parkingHistory.parking.price,
                    )}{' '}
                    zł
                  </Text>
                </VStack>
              </HStack>
              <Divider width='100%' />
              <HStack justifyContent='space-between'>
                <Text fontSize='14px' fontWeight='700'>
                  Oceń rezerwację:
                </Text>
                <Rating
                  style={{ maxWidth: '40%' }}
                  value={rating}
                  onChange={setRating}
                  itemStyles={{
                    itemShapes: ThinStar,
                    activeFillColor: '#0A61C9',
                    inactiveFillColor: 'white',
                    itemStrokeWidth: 1,
                    activeStrokeColor: '#0A61C9',
                    inactiveStrokeColor: '#0A61C9',
                  }}
                />
              </HStack>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant='ghost' onClick={handleClose}>
              Zamknij
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </HStack>
  )
}
