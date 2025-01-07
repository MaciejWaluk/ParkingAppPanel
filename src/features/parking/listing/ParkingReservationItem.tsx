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
import { BsCalendarCheck, BsCalendarMinus, BsCurrencyDollar, BsGeo, BsHash } from 'react-icons/bs'
import { unitOfTime } from '../../../lib/types'
import { FaCarSide, FaShuttleVan, FaTruckMoving, FaTruckPickup } from 'react-icons/fa'
import { TbCarSuv } from 'react-icons/tb'
import Divider from '../../../common/components/Divider'
import { Database } from '../../../../database.types'
import { getReservationTime, isAbleToCancel, totalCost } from '../../../utils/time'
import React from 'react'
import supabase from '../../../lib/supabase'
import { typeMap } from '../../../lib/consts'

type ParkingReservationItemProps = {
  data: Database['public']['Functions']['get_user_reservations_with_vehicle_and_parking']['Returns'][number]
  deleteReservation: (id: string) => void
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
    name: 'Ciężarówka',
  },
}

const unitMap = {
  hourly: 'godzina',
  daily: 'dzień',
  monthly: 'miesiąc',
}

export const ParkingReservationItem = ({ data, deleteReservation, ...props }: ParkingReservationItemProps) => {
  const reservation = {
    ...data,
    parking: data.parking as Database['public']['Tables']['parkings']['Row'],
    vehicle: data.vehicle as Database['public']['Tables']['vehicles']['Row'],
  }
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  const handleDeleteReservation = async () => {
    const { error } = await supabase.from('parking_reservations').delete().eq('id', reservation.id)
    if (error) {
      toast({
        status: 'error',
        title: 'Anulowanie rezerwacji',
        description: 'Błąd przy anulowaniu rezerwacji',
      })
    } else {
      deleteReservation(reservation.id)
      onClose()
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
      <Box width='300px' alignSelf='stretch' bgImage={`url(${reservation.parking.imageUrl})`} bgSize='cover' />
      <VStack width='100%' alignItems='flex-start' gap='20px' paddingY='20px' paddingRight='20px'>
        <HStack width='100%' justifyContent='space-between'>
          <Text fontSize='32px' fontWeight='700'>
            {reservation.parking.name}
          </Text>
          {isAbleToCancel(reservation.startDate, reservation.parking.unitOfTime as unitOfTime) && (
            <Button variant='danger' onClick={onOpen}>
              Anuluj
            </Button>
          )}
        </HStack>

        <HStack width='100%' alignItems='stretch'>
          <VStack flex={1} alignItems='flex-start' gap='15px'>
            <HStack>
              <BsGeo size='20px' />
              <Text fontSize='14px'>{reservation.parking.address}</Text>
            </HStack>
            <HStack>
              <BsCalendarCheck size='20px' />
              <Text fontSize='14px'>
                Start rezerwacji:{' '}
                {getReservationTime(new Date(reservation.startDate), reservation.parking.unitOfTime as unitOfTime)}
              </Text>
            </HStack>
            <HStack>
              <BsCalendarMinus size='20px' />
              <Text fontSize='14px'>
                Koniec rezerwacji:{' '}
                {getReservationTime(new Date(reservation.endDate), reservation.parking.unitOfTime as unitOfTime)}
              </Text>
            </HStack>
            <HStack>
              <BsCurrencyDollar size='20px' />
              <Text fontSize='14px'>
                {reservation.parking.price} zł / {unitMap[reservation.parking.unitOfTime as keyof typeof unitMap]}
              </Text>
            </HStack>
          </VStack>
          <VStack flex={1} alignItems='flex-start' justifyContent='flex-end' gap='15px'>
            <HStack>
              {carTypeIcons[reservation.vehicle.type as keyof typeof carTypeIcons].icon}
              <Text fontSize='14px'>{carTypeIcons[reservation.vehicle.type as keyof typeof carTypeIcons].name}</Text>
            </HStack>
            <HStack>
              <BsHash size='20px' />
              <Text fontSize='14px'>Numer rejestracyjny: {reservation.vehicle.registerNumber}</Text>
            </HStack>
          </VStack>
        </HStack>
        <Divider width='100%' />
        <HStack width='100%' justifyContent='space-between'>
          <VStack alignItems='flex-start'>
            <Text fontSize='16px'>Typ rezerwacji: </Text>
            <Text fontSize='24px' fontWeight='700'>
              {typeMap[reservation.parking.unitOfTime as keyof typeof typeMap]}
            </Text>
          </VStack>
          <VStack alignItems='flex-end'>
            <Text fontSize='16px'>Opłata za całość:</Text>
            <Text fontSize='24px' fontWeight='700'>
              {totalCost(
                reservation.startDate,
                reservation.endDate,
                reservation.parking.unitOfTime as unitOfTime,
                reservation.parking.price,
              )}{' '}
              zł
            </Text>
          </VStack>
        </HStack>
      </VStack>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Czy na pewno chcesz anulować rezerwację?</ModalHeader>
          <ModalBody>
            <VStack gap='10px' width='100%' alignItems='stretch'>
              <HStack justifyContent='space-between'>
                <Text fontSize='14px' fontWeight='700'>
                  Nazwa:
                </Text>
                <Text fontSize='14px'>{reservation.parking.name}</Text>
              </HStack>
              <HStack justifyContent='space-between'>
                <Text fontSize='14px' fontWeight='700'>
                  Adres:
                </Text>
                <Text fontSize='14px'>{reservation.parking.address}</Text>
              </HStack>
              <HStack justifyContent='space-between'>
                <Text fontSize='14px' fontWeight='700'>
                  Start rezerwacji:
                </Text>
                <Text fontSize='14px'>
                  {getReservationTime(new Date(reservation.startDate), reservation.parking.unitOfTime as unitOfTime)}
                </Text>
              </HStack>
              <HStack justifyContent='space-between'>
                <Text fontSize='14px' fontWeight='700'>
                  Koniec rezerwacji:
                </Text>
                <Text fontSize='14px'>
                  {getReservationTime(new Date(reservation.endDate), reservation.parking.unitOfTime as unitOfTime)}
                </Text>
              </HStack>
              <Divider />
              <HStack justifyContent='space-between'>
                <Text fontSize='14px' fontWeight='700'>
                  Typ pojazdu:
                </Text>
                <Text fontSize='14px'>{carTypeIcons[reservation.vehicle.type as keyof typeof carTypeIcons].name}</Text>
              </HStack>{' '}
              <HStack justifyContent='space-between'>
                <Text fontSize='14px' fontWeight='700'>
                  Numer rejestracyjny:
                </Text>
                <Text fontSize='14px'>{reservation.vehicle.registerNumber}</Text>
              </HStack>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <HStack>
              <Button variant='ghost' onClick={onClose}>
                Nie
              </Button>
              <Button variant='danger' onClick={handleDeleteReservation}>
                Tak
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </HStack>
  )
}
