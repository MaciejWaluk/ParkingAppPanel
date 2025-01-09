import {
  Box,
  Button,
  Collapse,
  HStack,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  StackProps,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { BsArrowLeft } from 'react-icons/bs'
import { Parking, unitOfTime } from '../../../lib/types'
import {
  useParkingDetailsStore,
  useParkingListingStore,
  useParkingReservationStore,
  useProfileDetailsStore,
} from '../../../state/store'
import { useForm } from 'react-hook-form'
import supabase from '../../../lib/supabase'
import { adjustTimeZone, getReservationTime, totalCost as totalCostFunction } from '../../../utils/time'
import { authenticationContent } from '../../../utils/authentication'
import { useRouter } from '@tanstack/react-router'
import { Elements } from '@stripe/react-stripe-js'
import { stripePromise } from '../../../lib/stripe'
import { PaymentForm } from '../../../common/components/PaymentForm'

type ParkingReservationProps = {
  data: Parking
} & StackProps

type ParkingReservationInputs = {
  name: string
  fuel: string
  type: string
  registerNumber: string
  spotType: string
  startDate: string
  endDate: string
}

export const ParkingReservation = ({ data, ...props }: ParkingReservationProps) => {
  const setParkingDetails = useParkingDetailsStore((state) => state.setParkingDetails)
  const setParkingReservation = useParkingReservationStore((state) => state.setParkingReservation)
  const totalCost = useParkingReservationStore((state) => state.totalCost)
  const startDate = useParkingListingStore((state) => state.startDate)
  const endDate = useParkingListingStore((state) => state.endDate)
  const profile = useProfileDetailsStore((state) => state.profile)
  const setVehicle = useProfileDetailsStore((state) => state.setVehicle)
  const spotType = useParkingReservationStore((state) => state.spotType)

  const toast = useToast()
  const [paymentStatus, setPaymentStatus] = useState<'none' | 'pending' | 'accepted' | 'rejected'>('none')
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  const apiURL = import.meta.env.VITE_EXPRESSJS_API_URL

  useEffect(() => {
    // Call our backend to create a PaymentIntent
    fetch(`${apiURL}/create_payment_intent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: (totalCost as number) * 100 }),
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret)
      })
      .catch((err) => console.error('Error creating payment intent:', err))
  }, [totalCost])

  const { isOpen, onOpen, onClose } = useDisclosure()

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm<ParkingReservationInputs>()

  const { signOut } = authenticationContent()
  const router = useRouter()

  useEffect(() => {
    async function getUser() {
      const { data, error } = await supabase.auth.getUser()

      if (data.user === null) {
        await signOut()
        router.invalidate()
      }
    }
    getUser()
  }, [router, signOut])

  const onSubmit = async (values: ParkingReservationInputs) => {
    let vehicleId = ''
    const { data: vehicleQuery } = await supabase.from('vehicles').select().eq('registerNumber', values.registerNumber)
    if (vehicleQuery?.length === 0) {
      const { data: vehicle, error } = await supabase
        .from('vehicles')
        .insert({
          userId: profile?.id!,
          type: values.type,
          registerNumber: values.registerNumber,
          fuel: values.fuel,
        })
        .select()

      if (error) {
        toast({
          title: 'Błąd',
          description: error.message,
          status: 'error',
          isClosable: true,
        })
      }

      vehicleId = vehicle![0].id
      if (vehicle && vehicle[0]) {
        setVehicle(vehicle[0])
      }
    } else {
      vehicleId = vehicleQuery![0].id
    }
    const { data: reservation, error: insertError } = await supabase
      .from('parking_reservations')
      .insert({
        userId: profile?.id!,
        vehicleId: vehicleId,
        parkingId: data.id,
        startDate: adjustTimeZone(values.startDate),
        endDate: adjustTimeZone(values.endDate),
        spotType: values.spotType,
      })
      .select()
    if (insertError) {
      toast({
        title: 'Błąd',
        description: insertError.message,
        status: 'error',
        isClosable: true,
      })
    } else {
      setParkingReservation(undefined)
      toast({
        title: 'Rezerwacja złożona pomyślnie',
        description: 'Twoja rezewrwacja została dokonana',
        status: 'success',
        isClosable: true,
      })
      const { data: user } = await supabase.auth.admin.getUserById(profile?.id!)
      fetch(`${apiURL}/send_email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: user.user?.email,
          subject: `Potwierdzenie rezerwacji parkingu -  ${data.name}`,
          html: `
              <p>Parking został zarezerwowany. Poniżej znajdują się szczegóły rezerwacji:</p><br/>
              <ul>
                <li><strong>Nazwa parkingu:</strong> ${data.name}</li>
                <li><strong>Adres parkingu:</strong> ${data.address}</li>
                <li><strong>Data startu rezerwacji:</strong> ${getReservationTime(new Date(reservation[0].startDate), data.unitOfTime as unitOfTime)}</li>
                <li><strong>Data końca rezerwacji:</strong> ${getReservationTime(new Date(reservation[0].endDate), data.unitOfTime as unitOfTime)}</li>
                <li><strong>Cena:</strong> ${totalCostFunction(
                  reservation[0].startDate,
                  reservation[0].endDate,
                  data.unitOfTime as unitOfTime,
                  data.price,
                )} zł</li>
              </ul>
          `,
        }),
      }).catch((e) => console.log(e))
    }
  }

  useEffect(() => {
    switch (paymentStatus) {
      case 'accepted':
        handleSubmit(onSubmit)()
        onClose()
        break
    }
  }, [paymentStatus])

  const inputType = data.unitOfTime === 'hourly' ? 'datetime-local' : data.unitOfTime === 'daily' ? 'date' : 'month'

  useEffect(() => {
    async function setData() {
      const { data: vehicle } = await supabase
        .from('vehicles')
        .select()
        .eq('userId', profile?.id!)
        .eq('isPrimary', true)
      setValue('name', profile?.name!)
      setValue('spotType', spotType)
      if (vehicle && vehicle.length > 0) {
        setValue('fuel', vehicle[0].fuel)
        setValue('registerNumber', vehicle[0].registerNumber)
        setValue('type', vehicle[0].type)
      }
      if (startDate && endDate) {
        setValue('startDate', startDate)
        setValue('endDate', endDate)
      }
    }
    setData()
  }, [])
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
          onClick={() => {
            setParkingDetails(undefined)
            setParkingReservation(undefined)
          }}
        >
          <HStack>
            <BsArrowLeft size='20px' />
          </HStack>
        </Button>
        <Image src={data.imageUrl} />
      </Box>
      <VStack padding='30px' alignItems='stretch' gap='30px'>
        <HStack justifyContent='space-between' alignItems='flex-start' width='100%'>
          <Text fontSize='36px' fontWeight='700'>
            {data.name}
          </Text>
          <Text fontSize='36px' fontWeight='700'>
            {totalCost ? totalCost : ' - '} zł
          </Text>
        </HStack>
        <form>
          <VStack marginTop='-20px'>
            <HStack width='100%'>
              <VStack gap='10px' flex={1} alignItems='stretch'>
                <VStack gap='10px'>
                  <Text width='100%' fontSize='12px'>
                    Imię i nazwisko:
                  </Text>
                  <Input
                    placeholder='Jan Kowaliski'
                    {...register('name', {
                      required: 'Imię i nazwisko jest wymagane',
                    })}
                  />
                </VStack>
                <Collapse in={!!errors['name']} style={{ width: '100%' }}>
                  {errors['name'] && (
                    <Text marginTop='10px' fontSize='12px' color='red'>
                      {errors['name']?.message}
                    </Text>
                  )}
                </Collapse>
              </VStack>
            </HStack>
            <HStack width='100%'>
              <VStack gap='10px' flex={1} alignItems='stretch'>
                <Text width='100%' fontSize='12px'>
                  Rodzaj napędu:
                </Text>

                <Select
                  border='2px solid'
                  borderColor='border'
                  borderRadius='radiusM'
                  {...register('fuel', {
                    required: 'Rodzaj paliwa jest wymagany',
                  })}
                >
                  <option value='gasoline'>Benzyna</option>
                  <option value='diesel'>Diesel</option>
                  <option value='gas'>Gaz</option>
                  <option value='electric'>Elektryczność</option>
                </Select>
              </VStack>
              <VStack gap='10px' flex={1} alignItems='stretch'>
                <VStack gap='10px'>
                  <Text width='100%' fontSize='12px'>
                    Numer rejestracyjny:
                  </Text>
                  <Input
                    placeholder='ABC XY21'
                    {...register('registerNumber', {
                      required: 'Numer rejestracyjny jest wymagany',
                    })}
                  />
                </VStack>
                <Collapse in={!!errors['registerNumber']} style={{ width: '100%' }}>
                  {errors['registerNumber'] && (
                    <Text marginTop='10px' fontSize='12px' color='red'>
                      {errors['registerNumber']?.message}
                    </Text>
                  )}
                </Collapse>
              </VStack>
            </HStack>
            <VStack width='100%' flex={1} alignItems='flex-start'>
              <Text width='100%' fontSize='12px'>
                Rodzaj pojazdu:
              </Text>
              <Select border='2px solid' borderColor='border' borderRadius='radiusM' {...register('type')}>
                <option value='sedan'>Sedan</option>
                <option value='suv'>SUV</option>
                <option value='pickup'>Pickup</option>
                <option value='van'>Van</option>
                <option value='truck'>Ciężarówka</option>
                <option value='bus'>Autobus</option>
              </Select>
            </VStack>
            <HStack width='100%'>
              <VStack gap='10px' flex={1} alignItems='stretch'>
                <VStack gap='10px'>
                  <Text width='100%' fontSize='12px'>
                    Od:
                  </Text>
                  <Input
                    type={inputType}
                    {...register('startDate', {
                      required: 'Data startu jest wymagana',
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
              <VStack gap='10px' flex={1} alignItems='stretch'>
                <VStack gap='10px'>
                  <Text width='100%' fontSize='12px'>
                    Do:
                  </Text>
                  <Input
                    type={inputType}
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
            <Button
              width='100%'
              marginTop='20px'
              onClick={() => {
                setPaymentStatus('pending')
                onOpen()
              }}
            >
              Zarezerwuj
            </Button>
          </VStack>
        </form>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Zapłać</ModalHeader>
            <ModalBody>
              {clientSecret && (
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret: clientSecret,
                    appearance: {
                      theme: 'flat',
                    },
                  }}
                >
                  <PaymentForm clientSecret={clientSecret} setPaymentStatus={setPaymentStatus} />
                </Elements>
              )}
            </ModalBody>
            <ModalFooter></ModalFooter>
          </ModalContent>
        </Modal>
      </VStack>
    </VStack>
  )
}
