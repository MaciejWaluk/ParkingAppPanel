import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import {
  Box,
  Button,
  Collapse,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Select,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from '@chakra-ui/react'
import { Select as ReactSelect } from 'chakra-react-select'
import { LabelInput } from '../../../../common/components/LabelInput'
import { AddressAutofill } from '@mapbox/search-js-react'
import React, { useEffect, useState } from 'react'
import Divider from '../../../../common/components/Divider'
import { FilePond } from 'react-filepond'
import { FilePondFile } from 'filepond'
import { tags } from '../../../../lib/consts'
import { HiOutlinePlusSmall, HiOutlineMinusSmall } from 'react-icons/hi2'
import supabase from '../../../../lib/supabase'
import { authenticationContent } from '../../../../utils/authentication'

export const Route = createFileRoute('/_dashboard_layout/profile/_profile_layout/addParking')({
  component: AddParkingComponent,
})

type AddParkingInputs = {
  name: string //
  address: string //
  city: string //
  postcode: string //
  price: number //
  position: number[] //
  tags: string[] //
  openHour: string //
  closeHour: string //
  unitOfTime: string //
  usefulInfo: string[]
  image: File //
  regularSpots: number //
  biggerSpots: number //
  disabledSpots: number //
}

function AddParkingComponent() {
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    getValues,
    watch,
    reset,
    formState: { errors },
  } = useForm<AddParkingInputs>({
    defaultValues: {
      unitOfTime: 'hourly',
      openHour: '08:00',
      closeHour: '21:00',
    },
  })
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
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

  const onSubmit = async (values: AddParkingInputs) => {
    if (values.tags.length === 0) {
      setError('tags', {
        type: 'required',
        message: 'Oznaczenia są wymagane',
      })
      return
    }
    const file = values.image
    const { data: uploadedFile, error: fileUploadError } = await supabase.storage
      .from('parking_images')
      .upload(`images/${file.name}`, file, {
        cacheControl: '3600',
        upsert: false,
      })
    if (fileUploadError) {
      toast({
        status: 'error',
        title: 'Dodawanie parkingu',
        description: fileUploadError.message,
      })
    } else {
      const { data: imageUrl, error } = await supabase.storage
        .from('parking_images')
        .createSignedUrl(uploadedFile?.path, 8000000)

      if (imageUrl) {
        const { data: addedParking, error: parkingAddingError } = await supabase
          .from('parking_proposals')
          .insert({
            name: values.name,
            address: `${values.address}${values.city}`,
            openHours: `${values.openHour} - ${values.closeHour}`,
            openHour: values.openHour,
            closeHour: values.closeHour,
            unitOfTime: values.unitOfTime,
            price: values.price,
            position: values.position,
            usefullInfo: values.usefulInfo,
            imageUrl: imageUrl.signedUrl,
            tags: values.tags,
            regularSpots: values.regularSpots,
            biggerSpots: values.biggerSpots,
            disabledSpots: values.disabledSpots,
          })
          .select()

        if (parkingAddingError) {
          toast({
            status: 'error',
            title: 'Dodawanie parkingu',
            description: 'Dodawanie parkingu nie powiodło się',
          })
        } else {
          reset()
          setFiles([])
          setUsefulInfo([])
          onOpen()
        }
      }
    }
  }

  const [files, setFiles] = useState<File[]>([])
  const [usefulInfo, setUsefulInfo] = useState<string[]>([])
  const [currentUsefulInfoValue, setCurrentUsefulInfoValue] = useState<string>('')

  const handleFileUpdate = (fileItems: FilePondFile[]) => {
    const mappedFiles = fileItems.map((item) => item.file as File)
    setFiles(mappedFiles)
  }

  useEffect(() => {
    register('address', { required: 'Adres jest wymagany' })
    register('unitOfTime', { required: 'Wymagany jest rodzaj parkingu' })
    register('image', { required: 'Zdjęcie jest wymagane' })
    register('usefulInfo', {
      validate: {
        required: (value) => (value && value.length > 0) || 'Przynajmniej jedna informacja jest wymagana',
      },
    })
    register('tags', {
      validate: {
        required: (value) => (value && value.length > 0) || 'Przynajmniej jedno oznaczenie jest wymagane',
      },
    })
  }, [register])

  useEffect(() => {
    setValue('image', files[0])
  }, [files, setValue])

  return (
    <form>
      <VStack gap='20px' alignItems='stretch'>
        <HStack justifyContent='space-between'>
          <Text fontSize='32px' fontWeight='700' paddingBottom='20px'>
            Dodaj parking
          </Text>
          <Button onClick={handleSubmit(onSubmit)}>Wyślij propozycję</Button>
        </HStack>
        <FilePond
          files={files}
          allowMultiple={false}
          onupdatefiles={handleFileUpdate}
          server={null}
          name='files' /* sets the file input name, it's filepond by default */
          labelIdle='Przesuń i upuść zdjęcie parkingu albo <span class="filepond--label-action">Przeglądaj</span>'
        />
        <Collapse in={!!errors['image']?.message} style={{ width: '100%' }}>
          {errors['image']?.message && (
            <Text marginTop='10px' fontSize='12px' color='red'>
              {errors['image']?.message}
            </Text>
          )}
        </Collapse>

        <Divider marginY='20px' />
        <HStack alignItems='flex-start'>
          <LabelInput
            label='Nazwa: '
            errorMessage={errors['name']?.message}
            {...register('name', { required: 'Nazwa jest wymagana' })}
          />
          <Box width='100%'>
            {/*// @ts-expect-error*/}
            <AddressAutofill
              onRetrieve={(address) => {
                setValue('position', [
                  address.features[0].geometry.coordinates[1],
                  address.features[0].geometry.coordinates[0],
                ])
                setValue(
                  'address',
                  `${address.features[0].properties.address_line1}, ${address.features[0].properties.address_line2}`,
                )
              }}
              accessToken={import.meta.env.VITE_MAPBOX_ACCESS_KEY}
            >
              <LabelInput
                label='Ulica: '
                errorMessage={errors['address']?.message}
                autoComplete='address-line1'
                placeholder='ul. Wyszyńskiego'
              />
            </AddressAutofill>
          </Box>
        </HStack>
        <HStack alignItems='flex-start'>
          <LabelInput
            label='Miasto: '
            errorMessage={errors['city']?.message}
            autoComplete='address-level2'
            placeholder='Warszawa'
            {...register('city', { required: 'Miasto jest wymagane' })}
          />
          <LabelInput
            label='Kod pocztowy: '
            errorMessage={errors['postcode']?.message}
            autoComplete='postal-code'
            placeholder='12-345'
            {...register('postcode', { required: 'Kod pocztowy jest wymagany' })}
          />
        </HStack>
        <Divider marginY='20px' />
        <HStack alignItems='flex-start' width='100%'>
          <VStack gap='10px' width='33%'>
            <Text width='100%' fontSize='12px'>
              Rodzaj miejsca parkingowego:
            </Text>
            <Select
              width='100%'
              border='2px solid'
              borderColor='border'
              borderRadius='radiusM'
              defaultValue={getValues('unitOfTime')}
              onChange={(e) => setValue('unitOfTime', e.target.value)}
            >
              <option value='hourly'>Godzinowy</option>
              <option value='daily'>Dzienny</option>
              <option value='monthly'>Miesięczny</option>
            </Select>
          </VStack>
          {watch('unitOfTime') === 'hourly' && (
            <>
              <Box width='33%'>
                <LabelInput label='Godzina otwarcia: ' type='time' {...register('openHour')} />
              </Box>
              <Box width='33%'>
                <LabelInput label='Godzina zamknięcia: ' type='time' {...register('closeHour')} />
              </Box>
            </>
          )}
        </HStack>
        <HStack width='100%' alignItems='stretch'>
          <LabelInput
            label='Liczba miejsc regularnych:'
            errorMessage={errors['regularSpots']?.message}
            placeholder='99'
            type='number'
            {...register('regularSpots', { required: 'Liczba jest wymagana' })}
          />
          <LabelInput
            label='Liczba dużych miejsc:'
            placeholder='99'
            errorMessage={errors['biggerSpots']?.message}
            type='number'
            {...register('biggerSpots', { required: 'Liczba jest wymagana' })}
          />
          <LabelInput
            label='Liczba miejsc dla niepełnosprawnych:'
            placeholder='99'
            errorMessage={errors['disabledSpots']?.message}
            type='number'
            {...register('disabledSpots', { required: 'Liczba jest wymagana' })}
          />
        </HStack>
        <HStack width='100%'>
          <LabelInput
            label={`Cena za ${watch('unitOfTime') === 'hourly' ? 'godzinę:' : watch('unitOfTime') === 'daily' ? 'dzień:' : 'miesiąc:'}`}
            placeholder='99'
            width='33%'
            errorMessage={errors['price']?.message}
            type='number'
            {...register('price', { required: 'Cena jest wymagana' })}
          />
        </HStack>
        <Divider marginY='20px' />
        <HStack width='100%' alignItems='flex-start'>
          <VStack gap='10px' width='33%' alignItems='flex-start'>
            <Text fontSize='12px'>Przydatne informacje:</Text>
            <VStack
              padding='10px'
              border='2px solid'
              width='100%'
              borderRadius='radiusM'
              borderColor='border'
              alignItems='flex-start'
            >
              {usefulInfo.length > 0 ? (
                usefulInfo.map((value, index) => (
                  <HStack justifyContent='space-between' width='100%' paddingRight='5px'>
                    <Text key={index} fontSize='14px'>
                      {value}
                    </Text>
                    <HiOutlineMinusSmall
                      size='24px'
                      cursor='pointer'
                      onClick={() => {
                        setUsefulInfo((prev) => {
                          const newArray = prev.map((x) => x)
                          newArray.splice(index, 1)
                          setValue('usefulInfo', newArray)
                          return newArray
                        })
                      }}
                    />
                  </HStack>
                ))
              ) : (
                <VStack height='36px' justifyContent='center' alignItems='center'></VStack>
              )}
              <InputGroup>
                <Input
                  value={currentUsefulInfoValue}
                  onChange={(e) => setCurrentUsefulInfoValue(e.target.value)}
                  placeholder='Przydatna informacja...'
                />
                <InputRightElement
                  cursor='pointer'
                  onClick={() => {
                    setUsefulInfo((prev) => {
                      const newArray = prev.map((x) => x)
                      newArray.push(currentUsefulInfoValue)
                      setValue('usefulInfo', newArray)
                      return newArray
                    })
                    setCurrentUsefulInfoValue('')
                  }}
                >
                  <HiOutlinePlusSmall size='24px' />
                </InputRightElement>
              </InputGroup>
            </VStack>
            <Collapse in={!!errors['usefulInfo']?.message} style={{ width: '100%' }}>
              {errors['usefulInfo']?.message && (
                <Text marginTop='10px' fontSize='12px' color='red'>
                  {errors['usefulInfo']?.message}
                </Text>
              )}
            </Collapse>
          </VStack>
          <VStack gap='10px' width='33%' alignItems='flex-start'>
            <Text fontSize='12px'>Oznaczenia:</Text>
            <Box width='100%'>
              <ReactSelect
                onChange={(value) =>
                  setValue(
                    'tags',
                    value.map((tag) => tag.value),
                  )
                }
                closeMenuOnSelect={false}
                options={tags}
                isMulti={true}
                placeholder='Wybierz...'
              />
            </Box>
            <Collapse in={!!errors['tags']?.message} style={{ width: '100%' }}>
              {errors['tags']?.message && (
                <Text marginTop='10px' fontSize='12px' color='red'>
                  {errors['tags']?.message}
                </Text>
              )}
            </Collapse>
          </VStack>
        </HStack>
      </VStack>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Sukces</ModalHeader>
          <ModalBody>
            <Text fontSize='14px'>
              Twoja prośba o nowy parking została wysłana. Poczekaj, aż administrator ją rozpatrzy.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>OK</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </form>
  )
}
