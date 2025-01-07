import { createFileRoute } from '@tanstack/react-router'
import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
  VStack,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import supabase from '../../../../../../lib/supabase'
import { Database } from '../../../../../../../database.types'
import { useForm } from 'react-hook-form'
import { LabelInput } from '../../../../../../common/components/LabelInput'
import { formatDate } from '../../../../../../utils/time'

export const Route = createFileRoute('/_dashboard_layout/profile/_profile_layout/admin/_admin_layout/users')({
  component: UsersComponent,
})

type UserListing = {
  name: string
  email: string
  id: string
  login: string
  created_at: string
}

type UserEditInputs = {
  id: string
  email: string
  login: string
  name: string
}

function UsersComponent() {
  const [users, setUsers] = useState<UserListing[]>([])
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<UserEditInputs>()

  const onSubmit = async (values: UserEditInputs) => {
    console.log(values)
    const { data: updateAuthUser, error: emailError } = await supabase.auth.updateUser({
      email: values.email,
    })

    if (!updateAuthUser || emailError) {
      toast({
        status: 'error',
        title: 'Edycja użytkownika',
        description: 'Błąd przy zmianie adresu email',
      })
      return
    }

    const { data: updatedProfile, error: profileError } = await supabase
      .from('profiles')
      .update({ login: values.login, name: values.name })
      .eq('id', values.id)
      .select()

    if (!updatedProfile || profileError) {
      toast({
        status: 'error',
        title: 'Edycja użytkownika',
        description: 'Błąd przy aktualizacji użytkownika',
      })
      return
    }

    const newArray = users.map((user) => {
      if (user.id === values.id) {
        return {
          id: updatedProfile[0].id,
          name: updatedProfile[0].name,
          login: updatedProfile[0].login,
          email: updateAuthUser.user?.email as string,
          created_at: updatedProfile[0].created_at,
        }
      } else return user
    })

    setUsers(newArray)
    toast({
      status: 'success',
      title: 'Edycja użytkownika',
      description: 'Edycja użytkownika powiodła się',
    })

    onClose()
  }

  const handleDelete = async (userId: string) => {
    const { error: userDeleteError } = await supabase.auth.admin.deleteUser(userId)
    if (userDeleteError) {
      toast({
        status: 'error',
        title: 'Usuwanie użytkownika',
        description: 'Błąd przy usuwaniu użytkownika',
      })
      return
    }
    const { error: profileDeleteError } = await supabase.from('profiles').delete().eq('id', userId)
    if (profileDeleteError) {
      toast({
        status: 'error',
        title: 'Usuwanie użytkownika',
        description: 'Błąd przy usuwaniu użytkownika',
      })
      return
    }

    const updatedArray = users.filter((u) => u.id !== userId)
    setUsers(updatedArray)
    toast({
      status: 'success',
      title: 'Usuwanie użytkownika',
      description: 'Usuwanie użytkownika powiodło się',
    })
  }
  useEffect(() => {
    async function getUsers() {
      const { data: profiles, error: profilesError } = await supabase.from('profiles').select()
      const {
        data: { users },
        error: userError,
      } = await supabase.auth.admin.listUsers()

      if (profiles === null || users === null || profilesError || userError) {
        toast({
          status: 'error',
          title: 'Użytkownicy',
          description: 'Pobieranie listy użytkowników nie powiodło się',
        })
      } else {
        const data = profiles.map((profile) => ({
          id: profile.id,
          name: profile.name,
          login: profile.login,
          email: users.find((user) => user.id === profile.id)?.email!,
          created_at: profile.created_at,
        }))
        setUsers(data)
      }
    }
    getUsers()
  }, [toast])

  const handleOpenModal = (user: UserListing) => {
    setValue('name', user.name)
    setValue('login', user.login)
    setValue('email', user.email)
    setValue('id', user.id)
    onOpen()
  }

  return (
    <>
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>Imię i nazwisko</Th>
              <Th>Email</Th>
              <Th>Data utworzenia</Th>
              <Th textAlign='right'>Akcje</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map((user) => (
              <Tr>
                <Td>{user.name}</Td>
                <Td>{user.email}</Td>
                <Td>{formatDate(new Date(user.created_at))}</Td>
                <Td>
                  <HStack justifyContent='flex-end'>
                    <Button onClick={() => handleOpenModal(user)}>Edytuj</Button>
                    <Button variant='danger' onClick={() => handleDelete(user.id)}>
                      Usuń
                    </Button>
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edycja użytkownika</ModalHeader>
          <ModalBody>
            <VStack gap='20px'>
              <LabelInput
                label='Imię i nazwisko:'
                errorMessage={errors['name']?.message}
                {...register('name', { required: 'Imię i naziwsko jest wymagane' })}
              />{' '}
              <LabelInput
                label='Login:'
                errorMessage={errors['login']?.message}
                {...register('login', { required: 'Login jest wymagany' })}
              />{' '}
              <LabelInput
                label='Email:'
                errorMessage={errors['email']?.message}
                {...register('email', { required: 'Email jest wymagany' })}
              />
            </VStack>
          </ModalBody>
          <ModalFooter>
            <HStack gap='10px'>
              <Button variant='ghost' onClick={onClose}>
                Anuluj
              </Button>
              <Button onClick={handleSubmit(onSubmit)}>Zapisz</Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
