import {
  Button,
  Collapse,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderMark,
  RangeSliderThumb,
  RangeSliderTrack,
  Select,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react'
import { AddressAutofill } from '@mapbox/search-js-react'
import { useMapStore, useParkingListingStore } from '../../../state/store'
import supabase from '../../../lib/supabase'
import { useForm } from 'react-hook-form'
import { adjustTimeZone } from '../../../utils/time'
import { unitOfTime } from '../../../lib/types'
import React, { useState } from 'react'
import { NoParkingsFoundModal } from '../search/NoParkingsFoundModal'

type ParkingSearchFormProps = {
  unitOfTime: unitOfTime
}

type ParkingSearchFormInputs = {
  location: number[]
  startDate: string
  endDate: string
  address: string
  city: string
  postcode: string
  spotType: string
  maxPrice: number
  minPrice: number
  maxDistance: number
}

const rangeConfig = {
  hourly: {
    label: 'godzinę',
    minValue: 5,
    maxValue: 100,
    thumbWidth: 12,
  },
  daily: {
    label: 'dzień',
    minValue: 20,
    maxValue: 300,
    thumbWidth: 15,
  },
  monthly: {
    label: 'miesiąc',
    minValue: 500,
    maxValue: 5000,
    thumbWidth: 15,
  },
}

const maxDistanceConfig = {
  min: 0.1,
  max: 3,
}

export const ParkingSearchForm = ({ unitOfTime }: ParkingSearchFormProps) => {
  const setParkings = useParkingListingStore((state) => state.setParkings)
  const setStartDate = useParkingListingStore((state) => state.setStartDate)
  const setEndDate = useParkingListingStore((state) => state.setEndDate)
  const setLocation = useMapStore((state) => state.setLocation)

  const {
    handleSubmit,
    register,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm<ParkingSearchFormInputs>({
    defaultValues: {
      spotType: 'regular',
      minPrice: rangeConfig[unitOfTime].minValue,
      maxPrice: rangeConfig[unitOfTime].maxValue,
      maxDistance: 0.5,
    },
  })

  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isOpen: parkingsIsOpen, onOpen: parkingsOnOpen, onClose: parkingsOnClose } = useDisclosure()
  const [sliderValue, setSliderValue] = useState([rangeConfig[unitOfTime].minValue, rangeConfig[unitOfTime].maxValue])
  const [selectValue, setSelectValue] = useState(getValues('spotType'))

  const onSubmit = async (data: ParkingSearchFormInputs) => {
    // @ts-ignore
    let { data: result, error } = await supabase.rpc('find_available_parkings', {
      _end: adjustTimeZone(data.endDate),
      _lat: data.location[0],
      _lng: data.location[1],
      _spot_type: 'regular',
      _start: adjustTimeZone(data.startDate),
      _unit_of_time: unitOfTime,
      _max_distance: data.maxDistance,
    })
    if (error) {
      console.error(error)
      return
    }

    if (result) {
      setParkings(result)
      setStartDate(data.startDate)
      setEndDate(data.endDate)
      setLocation([data.location[0], data.location[1]])
      if (result.length === 0) parkingsOnOpen()
    }
  }
  const handleStartDateChange = () => {
    const startDate = new Date(getValues('startDate'))
    const endDate = new Date(startDate)
    switch (unitOfTime) {
      case 'hourly':
        endDate.setHours(startDate.getHours() + 2)
        break
      case 'daily':
        endDate.setDate(endDate.getDate() + 1)
        break
      case 'monthly':
        endDate.setMonth(endDate.getMonth() + 1)
    }

    const stringDate = endDate.toJSON().substring(0, unitOfTime === 'hourly' ? 16 : unitOfTime === 'daily' ? 10 : 7)

    setValue('endDate', stringDate)
  }

  const inputType = unitOfTime === 'hourly' ? 'datetime-local' : unitOfTime === 'daily' ? 'date' : 'month'
  const minDateValue = () => {
    const now = new Date()
    switch (unitOfTime) {
      case 'hourly': {
        const year = now.getFullYear()
        const month = String(now.getMonth() + 1).padStart(2, '0') // Months are zero-based
        const day = String(now.getDate()).padStart(2, '0')
        const hours = String(now.getHours()).padStart(2, '0')
        const minutes = String(now.getMinutes()).padStart(2, '0')
        return `${year}-${month}-${day}T${hours}:${minutes}`
      }
      case 'daily': {
        const year = now.getFullYear()
        const month = String(now.getMonth() + 1).padStart(2, '0')
        const day = String(now.getDate()).padStart(2, '0')

        return `${year}-${month}-${day}`
      }
      case 'monthly': {
        const year = now.getFullYear()
        const month = String(now.getMonth() + 1).padStart(2, '0')

        return `${year}-${month}`
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        type='hidden'
        {...register('location', {
          required: 'Adres jest wymagany',
        })}
      />
      <VStack gap='10px' alignItems='stretch'>
        <VStack gap='10px'>
          <Text width='100%' fontSize='12px'>
            Adres:
          </Text>
          <VStack width='100%' alignItems='stretch'>
            {/*// @ts-expect-error*/}
            <AddressAutofill
              onRetrieve={(address) => {
                setValue('location', [
                  address.features[0].geometry.coordinates[1],
                  address.features[0].geometry.coordinates[0],
                ])
              }}
              accessToken={import.meta.env.VITE_MAPBOX_ACCESS_KEY}
            >
              <Input autoComplete='address-line1' placeholder='ul. Wyszyńskiego' />
            </AddressAutofill>
            <Collapse in={!!errors['location']} style={{ width: '100%' }}>
              {errors['location'] && (
                <Text marginTop='10px' fontSize='12px' color='red'>
                  {errors['location']?.message}
                </Text>
              )}
            </Collapse>
          </VStack>
        </VStack>
        <HStack width='100%' alignItems='top'>
          <VStack flex={1} alignItems='stretch'>
            <VStack gap='10px'>
              <Text width='100%' fontSize='12px'>
                Miasto:
              </Text>
              <Input
                placeholder='Warszawa'
                autoComplete='address-level2'
                {...register('city', {
                  required: 'Miasto jest wymagane',
                })}
              />
            </VStack>
            <Collapse in={!!errors['city']} style={{ width: '100%' }}>
              {errors['city'] && (
                <Text marginTop='10px' fontSize='12px' color='red'>
                  {errors['city']?.message}
                </Text>
              )}
            </Collapse>
          </VStack>
          <VStack flex={1} alignItems='stretch'>
            <VStack gap='10px'>
              <Text width='100%' fontSize='12px'>
                Kod pocztowy:
              </Text>
              <Input
                placeholder='12-123'
                autoComplete='postal-code'
                {...register('postcode', {
                  required: 'Kod pocztowy jest wymagany',
                })}
              />
            </VStack>
            <Collapse in={!!errors['postcode']} style={{ width: '100%' }}>
              {errors['postcode'] && (
                <Text marginTop='10px' fontSize='12px' color='red'>
                  {errors['postcode']?.message}
                </Text>
              )}
            </Collapse>
          </VStack>
        </HStack>
        <HStack>
          <VStack flex={1} alignItems='stretch'>
            <VStack gap='10px'>
              <Text width='100%' fontSize='12px'>
                Od:
              </Text>
              <Input
                type={inputType}
                min={minDateValue()}
                {...register('startDate', {
                  required: 'Data startu jest wymagana',
                  onChange: () => handleStartDateChange(),
                })}
              />
            </VStack>

            <Collapse in={!!errors['startDate']} style={{ width: '100%' }}>
              {errors['startDate'] && (
                <Text marginTop='10px' fontSize='12px' color='red'>
                  {errors['startDate']?.message}
                </Text>
              )}
            </Collapse>
          </VStack>
          <VStack flex={1} alignItems='stretch'>
            <VStack gap='10px'>
              <Text width='100%' fontSize='12px'>
                Do:
              </Text>
              <Input
                type={inputType}
                min={minDateValue()}
                {...register('endDate', {
                  required: 'Data końca jest wymagana',
                })}
              />
            </VStack>
            <Collapse in={!!errors['endDate']} style={{ width: '100%' }}>
              {errors['endDate'] && (
                <Text marginTop='10px' fontSize='12px' color='red'>
                  {errors['endDate']?.message}
                </Text>
              )}
            </Collapse>
          </VStack>
        </HStack>
        <HStack paddingTop='20px'>
          <Button flex={1} variant='ghost' onClick={() => reset()}>
            Wyczyść
          </Button>
          <Button flex={1} variant='ghost' onClick={onOpen}>
            Filtry
          </Button>
          <Button type='submit' flex={1}>
            Szukaj
          </Button>
        </HStack>
      </VStack>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Filtry</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack alignItems='flex-start' width='100%' gap='20px' paddingX='20px'>
              <VStack gap='10px' width='100%'>
                <Text width='100%' fontSize='12px'>
                  Rodzaj miejsca parkingowego:
                </Text>
                <Select
                  border='2px solid'
                  borderColor='border'
                  borderRadius='radiusM'
                  onChange={(e) => setSelectValue(e.target.value)}
                >
                  <option value='regular'>Zwykłe</option>
                  <option value='bigger'>Powiększone</option>
                  <option value='disabled'>Dla niepełnosprawnych</option>
                </Select>
              </VStack>
              <VStack gap='10px' width='100%'>
                <Text width='100%' fontSize='12px'>
                  Maksymalna odległość parkingu od celu:
                </Text>
                <NumberInput
                  width='100%'
                  step={0.1}
                  min={0.1}
                  defaultValue={0.5}
                  onChange={(valueAsString, valueAsNumber) => setValue('maxDistance', valueAsNumber)}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </VStack>
              <VStack gap='10px' width='100%'>
                <Text width='100%' fontSize='12px'>
                  Zakres cen za {rangeConfig[unitOfTime].label}
                </Text>
                <RangeSlider
                  aria-label={['min', 'max']}
                  mb='20px'
                  min={rangeConfig[unitOfTime].minValue}
                  max={rangeConfig[unitOfTime].maxValue}
                  defaultValue={[rangeConfig[unitOfTime].minValue, rangeConfig[unitOfTime].maxValue]}
                  onChange={(val) => setSliderValue(val)}
                >
                  <RangeSliderTrack>
                    <RangeSliderFilledTrack />
                  </RangeSliderTrack>
                  <RangeSliderThumb index={0} />
                  <RangeSliderThumb index={1} />
                  <RangeSliderMark
                    value={sliderValue[0]}
                    textAlign='center'
                    borderRadius='radiusL'
                    border='2px solid'
                    borderColor='primary'
                    color='primary'
                    fontSize='14px'
                    mt='5'
                    ml='-5'
                    w={12}
                  >
                    {sliderValue[0]} zł
                  </RangeSliderMark>
                  <RangeSliderMark
                    value={sliderValue[1]}
                    textAlign='center'
                    borderRadius='radiusL'
                    border='2px solid'
                    borderColor='primary'
                    color='primary'
                    fontSize='14px'
                    mt='5'
                    ml='-5'
                    w={12}
                  >
                    {sliderValue[1]} zł
                  </RangeSliderMark>
                </RangeSlider>
              </VStack>
            </VStack>
          </ModalBody>
          <ModalFooter marginTop='20px'>
            <Button variant='ghost' onClick={onClose}>
              Anuluj
            </Button>
            <Button
              onClick={() => {
                setValue('spotType', selectValue)
                setValue('minPrice', sliderValue[0])
                setValue('maxPrice', sliderValue[1])
                onClose()
              }}
              ml='10px'
            >
              Zapisz
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <NoParkingsFoundModal isOpen={parkingsIsOpen} onClose={parkingsOnClose} />
    </form>
  )
}
