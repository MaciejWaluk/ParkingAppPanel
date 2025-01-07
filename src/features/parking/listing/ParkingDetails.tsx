import { Box, Button, Center, HStack, Image, StackProps, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import { BsArrowLeft, BsClock, BsCurrencyDollar, BsGeo } from 'react-icons/bs'
import { Tag } from '../../../common/components/Tag'
import { Parking } from '../../../lib/types'
import { useParkingDetailsStore, useParkingReservationStore } from '../../../state/store'
import { tagsObject } from '../../../lib/consts'
import { getMapFromCoords } from '../../../lib/maps'

type ParkingDetailsProps = {
  data: Parking
} & StackProps

export const ParkingDetails = ({ data, ...props }: ParkingDetailsProps) => {
  const setParkingDetails = useParkingDetailsStore((state) => state.setParkingDetails)
  const setParkingReservation = useParkingReservationStore((state) => state.setParkingReservation)
  const totalCost = useParkingDetailsStore((state) => state.totalCost)
  return (
    <VStack {...props} bgColor='backgroundSecondary' alignItems='stretch' overflowY='scroll'>
      <Box position='relative'>
        <Button
          position='absolute'
          variant='ghost'
          top='20px'
          left='20px'
          padding='10px'
          borderRadius='50%'
          onClick={() => setParkingDetails(undefined)}
        >
          <HStack>
            <BsArrowLeft size='20px' />
          </HStack>
        </Button>
        <Image src={data.imageUrl} />
      </Box>
      <VStack padding='30px' alignItems='stretch' gap='30px'>
        <VStack alignItems='stretch'>
          <Text fontSize='36px' fontWeight='700'>
            {data.name}
          </Text>
          <HStack width='100%' flexWrap='wrap' marginTop='-5px' marginBottom='20px'>
            {(data.tags as string[]).map((tag, id) => (
              <Tag key={id} label={tagsObject[tag as keyof typeof tagsObject]} />
            ))}
          </HStack>
        </VStack>

        <HStack marginTop='-20px'>
          <VStack gap='10px' alignItems='stretch' flex={3}>
            <HStack>
              <BsGeo size='24px' />
              <Text fontSize='18px'>{data.address}</Text>
            </HStack>
            {data.unitOfTime === 'hourly' && (
              <HStack>
                <BsClock size='24px' />
                <Text fontSize='18px'>{data.openHours}</Text>
              </HStack>
            )}
            <HStack>
              <BsCurrencyDollar size='24px' />
              <Text fontSize='18px'>{data.price} zł / godzina</Text>
            </HStack>
          </VStack>
          <VStack alignItems='stretch' gap='5px'>
            <Text fontSize='12px'>Cena za cały okres:</Text>
            <Text fontSize='32px' fontWeight='700' textAlign='center'>
              {totalCost ? totalCost : ' - '} zł
            </Text>
            <Button
              onClick={() => {
                setParkingReservation(data, totalCost)
                setParkingDetails(undefined)
              }}
            >
              Zarezerwuj
            </Button>
          </VStack>
        </HStack>
        <VStack paddingTop='30px' borderTop='2px solid' borderTopColor='border' alignItems='stretch'>
          <Text fontSize='24px' fontWeight='700' marginBottom='10px'>
            Przydatne informacje
          </Text>
          {(data.usefullInfo as string[]).map((info) => (
            <Text>{info}</Text>
          ))}
        </VStack>
        <VStack paddingTop='30px' borderTop='2px solid' borderTopColor='border' alignItems='flex-start'>
          <Text fontSize='24px' fontWeight='700' marginBottom='10px'>
            Lokalizacja
          </Text>
          <Center width='100%'>
            <Image
              alt='Zdjęcie z lokalizajcą parkingu na mapie'
              src={`${getMapFromCoords((data.position as number[])[1], (data.position as number[])[0])}`}
            />
          </Center>
        </VStack>
      </VStack>
    </VStack>
  )
}
