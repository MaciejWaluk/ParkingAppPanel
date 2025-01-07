import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { Button, Collapse, HStack, Select, Text, Textarea, useToast, VStack } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import Divider from '../../../../common/components/Divider'
import { LabelInput } from '../../../../common/components/LabelInput'
import supabase from '../../../../lib/supabase'
import { useProfileDetailsStore } from '../../../../state/store'
import { authenticationContent } from '../../../../utils/authentication'

export const Route = createFileRoute('/_dashboard_layout/profile/_profile_layout/sendTicket')({
  component: SendTicketComponent,
})

type SendTicketInputs = {
  title: string
  type: string
  description: string
}

function SendTicketComponent() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SendTicketInputs>({
    defaultValues: {
      type: 'website',
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
  const toast = useToast()

  const profile = useProfileDetailsStore((state) => state.profile)

  const onSubmit = async (values: SendTicketInputs) => {
    const { error } = await supabase.from('tickets').insert({
      userId: profile!.id,
      type: values.type,
      title: values.title,
      description: values.description,
    })

    if (error) {
      toast({
        status: 'error',
        title: 'Wysyłanie zgłoszenia',
        description: 'Nastąpił błąd przy wysyłaniu zgłoszenia',
      })
      console.log(error.message)
    } else {
      toast({
        status: 'success',
        title: 'Wysyłanie zgłoszenia',
        description: 'Zgłoszenie wysłano pomyślnie',
      })
      reset()
    }
  }
  return (
    <form>
      <VStack gap='20px' alignItems='stretch'>
        <HStack justifyContent='space-between'>
          <Text fontSize='32px' fontWeight='700' paddingBottom='20px'>
            Dodaj parking
          </Text>
          <Button onClick={handleSubmit(onSubmit)}>Wyślij zgłoszenie</Button>
        </HStack>
        <Divider marginY='20px' />
        <VStack>
          <VStack gap='10px' width='100%' alignItems='flex-start'>
            <Text fontSize='12px'>Typ: </Text>
            <Select {...register('type')}>
              <option value='website'>Problem z aplikacją</option>
              <option value='parking'>Problem z parkingiem</option>
            </Select>
          </VStack>
          <LabelInput
            label='Tytuł: '
            errorMessage={errors['title']?.message}
            placeholder='Tytuł:'
            {...register('title', { required: 'Tytuł jest wymagany' })}
          />{' '}
          <VStack gap='10px' width='100%' alignItems='flex-start'>
            <Text fontSize='12px'>Treść: </Text>
            <Textarea placeholder='Treść' {...register('description', { required: 'Treść jest wymagana' })} />
            <Collapse in={!!errors['description']?.message} style={{ width: '100%' }}>
              {errors['description']?.message && (
                <Text marginTop='10px' fontSize='12px' color='red'>
                  {errors['description']?.message}
                </Text>
              )}
            </Collapse>
          </VStack>
        </VStack>
      </VStack>
    </form>
  )
}
