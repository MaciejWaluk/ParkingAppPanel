import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
  VStack,
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import React from 'react'
import { LabelInput } from '../../common/components/LabelInput'
import supabase from '../../lib/supabase'

type ResetPasswordModalBodyProps = {
  isOpen: boolean
  onClose: () => void
}

type ResetPasswordModalBodyInputs = {
  newPassword: string
  repeatNewPassword: string
}

export const ResetPasswordModalBody = ({ isOpen, onClose }: ResetPasswordModalBodyProps) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ResetPasswordModalBodyInputs>()
  const toast = useToast()

  const onSubmit = async (values: ResetPasswordModalBodyInputs) => {
    if (values.newPassword !== values.repeatNewPassword) {
      setError('newPassword', {
        type: 'value',
        message: 'Hasła muszą być takie same',
      })
      setError('repeatNewPassword', {
        type: 'value',
        message: 'Hasła muszą być takie same',
      })
      return
    }
    const { error } = await supabase.auth.updateUser({
      password: values.newPassword,
    })

    if (error) {
      toast({
        title: 'Zmiana hasła',
        description: 'Wystąpił błąd przy zmianie hasła',
        status: 'error',
      })
    } else {
      toast({
        title: 'Zmiana hasła',
        description: 'Zmiana hasła pomyślna',
        status: 'success',
      })
      onClose()
    }
  }
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Zmiana hasła</ModalHeader>
        <ModalBody>
          <form>
            <VStack gap='20px'>
              <LabelInput
                errorMessage={errors['newPassword']?.message}
                label={'Nowe hasło'}
                {...register('newPassword', { required: 'Nowe hasło jest wymagane' })}
              />
              <LabelInput
                errorMessage={errors['repeatNewPassword']?.message}
                label={'Powtórz nowe hasło'}
                {...register('repeatNewPassword', { required: 'Powtórzenie hasła jest wymagane' })}
              />
            </VStack>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button variant='ghost' onClick={onClose}>
            Anuluj
          </Button>
          <Button ml='10px' onClick={handleSubmit(onSubmit)}>
            Zapisz
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
