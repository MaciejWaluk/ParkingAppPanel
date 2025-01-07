import { Box, Button, HStack, Select, Text, useDisclosure, useToast, VStack } from '@chakra-ui/react'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import Divider from '../../../../common/components/Divider'
import { LabelInput } from '../../../../common/components/LabelInput'
import { useForm } from 'react-hook-form'
import supabase from '../../../../lib/supabase'
import { useProfileDetailsStore } from '../../../../state/store'
import { Select as ReactSelect } from 'chakra-react-select'
import React, { useEffect, useState } from 'react'
import { ResetPasswordModalBody } from '../../../../features/profile/ResetPasswordModalBody'
import { authenticationContent } from '../../../../utils/authentication'
import { Database } from '../../../../../database.types'

type ProfileDetailsInputs = {
  name: string
  login: string
  email: string
  type: string
  fuel: string
  registerNumber: string
}

export const Route = createFileRoute('/_dashboard_layout/profile/_profile_layout/details')({
  component: ProfileDetailsComponent,
})

const carTypeNames = {
  sedan: 'Sedan',
  suv: 'SUV',
  pickup: 'Pickup',
  van: 'Van',
  truck: 'Ciężarówka',
  bus: 'Autobus',
}

function ProfileDetailsComponent() {
  const profile = useProfileDetailsStore((state) => state.profile)!
  const vehicle = useProfileDetailsStore((state) => state.vehicle)
  const setVehicle = useProfileDetailsStore((state) => state.setVehicle)
  const setProfile = useProfileDetailsStore((state) => state.setProfile)
  const toast = useToast()
  const [defaultEmail, setDefaultEmail] = useState('')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [vehicles, setVehicles] = useState<Database['public']['Tables']['vehicles']['Row'][]>([])
  const [selectedVehicle, setSelectedVehicle] = useState<Database['public']['Tables']['vehicles']['Row'] | undefined>(
    vehicle,
  )

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileDetailsInputs>({
    defaultValues: {
      name: profile.name,
      login: profile.login,
      type: selectedVehicle?.type,
      registerNumber: selectedVehicle?.registerNumber,
      fuel: selectedVehicle?.fuel,
    },
  })

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

  useEffect(() => {
    async function getEmail() {
      const { data } = await supabase.auth.getUser()
      if (data.user?.email) {
        setValue('email', data.user.email)
        setDefaultEmail(data.user.email)
      }
    }
    getEmail()
  }, [setValue])

  useEffect(() => {
    async function getVehicles() {
      const { data } = await supabase.from('vehicles').select().eq('userId', profile.id)
      if (data) {
        setVehicles(data)
      }
    }
    getVehicles()
  }, [profile.id])

  const onSubmit = async (values: ProfileDetailsInputs) => {
    if (values.email !== defaultEmail) {
      const { error } = await supabase.auth.updateUser({
        email: values.email,
      })
      if (error) {
        toast({
          title: 'Zmiana adresu email',
          description: 'Wystąpił błąd przy zmianie email',
          status: 'error',
        })
      } else {
        toast({
          title: 'Zmiana adresu email',
          description: 'Na nowy adres email został wysłany link aktywacyjny',
          status: 'success',
        })
      }
    }
    const { data: newProfile, error: profileUpdateError } = await supabase
      .from('profiles')
      .update({ name: values.name, login: values.login })
      .eq('id', profile!.id)
      .select()
    if (profileUpdateError) {
      toast({
        title: 'Aktualizacja profilu',
        description: 'Wystąpił błąd przy aktualizacji profilu',
        status: 'error',
      })
    } else {
      toast({
        title: 'Aktualizacja profilu',
        description: 'Zmiana danych pomyślna',
        status: 'success',
      })
      setProfile(newProfile[0])
    }

    if (!selectedVehicle) {
      const { data: createdVehicle, error } = await supabase
        .from('vehicles')
        .insert({
          type: values.type,
          fuel: values.fuel,
          registerNumber: values.registerNumber,
          userId: profile.id,
          isPrimary: vehicle === undefined,
        })
        .select()
      if (createdVehicle) {
        if (createdVehicle[0].isPrimary) {
          setVehicle(createdVehicle[0])
        }
        setSelectedVehicle(createdVehicle[0])
      }
    } else {
      const { data: newVehicle, error: vehicleUpdateError } = await supabase
        .from('vehicles')
        .update({ type: values.type, fuel: values.fuel, registerNumber: values.registerNumber })
        .eq('userId', profile!.id)
        .eq('id', selectedVehicle?.id)
        .select()
      if (vehicleUpdateError) {
        toast({
          title: 'Aktualizacja pojazdu',
          description: 'Wystąpił błąd przy aktualizacji pojazdu',
          status: 'error',
        })
      } else {
        toast({
          title: 'Aktualizacja pojazdu',
          description: 'Zmiana danych pojazdu pomyślna',
          status: 'success',
        })
        if (newVehicle[0].id === vehicle.id) {
          setVehicle(newVehicle[0])
        }
        setSelectedVehicle(newVehicle[0])
      }
    }
    const { data } = await supabase.from('vehicles').select().eq('userId', profile.id)
    if (data) {
      setVehicles(data)
    }
  }

  const vehicleOptions = vehicles.map((vehicle) => ({
    value: vehicle.id,
    label: `${vehicle.registerNumber} - ${carTypeNames[vehicle.type as keyof typeof carTypeNames]}`,
  }))

  const handleSelectVehicleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value !== 'add-car') {
      const foundVehicle = vehicles.find((vehicle) => vehicle.id === e.target.value)
      setValue('type', foundVehicle?.type)
      setValue('registerNumber', foundVehicle?.registerNumber)
      setValue('fuel', foundVehicle?.fuel)
      setSelectedVehicle(foundVehicle)
    } else {
      setSelectedVehicle(undefined)
      setValue('type', 'sedan')
      setValue('registerNumber', '')
      setValue('fuel', 'gasoline')
    }
  }

  const setPrimary = async () => {
    const { error } = await supabase.rpc('set_primary_vehicle', {
      _userid: profile.id,
      _vehicleid: selectedVehicle?.id as string,
    })

    const { data: vehicles } = await supabase.from('vehicles').select().eq('userId', profile.id)
    if (vehicles) {
      setVehicles(vehicles)
      setSelectedVehicle(vehicles.find((vehicle) => vehicle.isPrimary))
    }
  }
  return (
    <form>
      <HStack justifyContent='space-between'>
        <Text fontSize='32px' fontWeight='700' paddingBottom='20px'>
          Dane konta
        </Text>
        <Button onClick={handleSubmit(onSubmit)}>Zapisz</Button>
      </HStack>
      <VStack gap='10px' alignItems='stretch'>
        <Text fontWeight='700' fontSize='20px'>
          Dane personalne
        </Text>
        <HStack paddingY='10px' alignItems='flex-start'>
          <Box flex={1}>
            <LabelInput
              label='Imię i nazwisko:'
              errorMessage={errors['name']?.message}
              {...register('name', { required: 'Imię i nazwisko jest wymagane' })}
            />
          </Box>
          <Box flex={1}>
            <LabelInput
              label='Login:'
              errorMessage={errors['login']?.message}
              {...register('login', { required: 'Login jest wymagany' })}
            />
          </Box>
        </HStack>
        <HStack paddingY='10px'>
          <Box flex={1}>
            <LabelInput
              label='Email:'
              errorMessage={errors['email']?.message}
              {...register('email', { required: 'Email jest wymagany' })}
            />
          </Box>
          <VStack flex={1} alignSelf='flex-end' alignItems='stretch'>
            <Text fontSize='12px'>Hasło:</Text>
            <Button onClick={onOpen} variant='ghost'>
              Zmień hasło
            </Button>
          </VStack>
        </HStack>
        <Divider marginY='20px' />
      </VStack>
      <HStack width='100%'>
        <VStack width='100%' gap='10px' alignItems='stretch'>
          <HStack justifyContent='space-between' width='50%'>
            <Text fontWeight='700' fontSize='20px'>
              Pojazd
            </Text>
            <Box minWidth='35%'>
              <Select value={selectedVehicle?.id} onChange={handleSelectVehicleChange}>
                {vehicleOptions.map((option) => (
                  <option value={option.value}>{option.label}</option>
                ))}
                <option value='add-car'>Dodaj auto...</option>
              </Select>
            </Box>
          </HStack>
          <HStack paddingY='10px'>
            <VStack flex={1} alignItems='flex-start'>
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
            <Box flex={1}></Box>
          </HStack>
          <HStack paddingY='10px'>
            <Box flex={1}>
              <LabelInput
                label='Numer rejestracyjny:'
                errorMessage={errors['registerNumber']?.message}
                {...register('registerNumber', {
                  required: 'Numer rejestracyjny jest wymagany',
                })}
              />
            </Box>
            <Box flex={1}></Box>
          </HStack>
          <HStack paddingY='10px'>
            <VStack flex={1} alignItems='flex-start'>
              <Text width='100%' fontSize='12px'>
                Rodzaj paliwa:
              </Text>
              <Select border='2px solid' borderColor='border' borderRadius='radiusM' {...register('fuel')}>
                <option value='gasoline'>Benzyna</option>
                <option value='diesel'>Diesel</option>
                <option value='gas'>Gaz</option>
                <option value='electric'>Elektryczność</option>
              </Select>
            </VStack>
            <Box flex={1}></Box>
          </HStack>
          {!selectedVehicle?.isPrimary && (
            <Button maxWidth='50%' onClick={setPrimary}>
              Ustaw jako główny pojazd
            </Button>
          )}
          <Divider marginY='20px' />
        </VStack>
      </HStack>
      <ResetPasswordModalBody onClose={onClose} isOpen={isOpen} />
    </form>
  )
}
