import { Button, FormLabel, Input, InputGroup, InputRightElement, Text, useToast, VStack } from '@chakra-ui/react'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import supabase from '../../lib/supabase'
import { LabelInput } from '../../common/components/LabelInput'

export const Route = createFileRoute('/_auth_layout/register')({
  component: RegisterComponent,
})

type RegisterInputs = {
  login: string
  name: string
  email: string
  password: string
}

function RegisterComponent() {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInputs>()
  const toast = useToast()

  const router = useRouter()

  const onSubmit: SubmitHandler<RegisterInputs> = async (formData) => {
    const { data, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        emailRedirectTo: 'localhost:3001',
      },
    })
    const { error: profileError } = await supabase.from('profiles').insert({
      login: formData.login,
      name: formData.name,
      id: data.user?.id!,
    })

    if (profileError && authError) {
      toast({
        status: 'error',
        title: 'Rejestracja',
        description: 'Wystąpił błąd podczas rejestracji',
      })
    } else {
      toast({
        status: 'success',
        title: 'Rejestracja',
        description: 'Zarejestrowano pomyślnie! Potwierdź swój adres email, klikając w link wysłany w wiadomości',
      })
      router.navigate({
        to: '/login',
      })
    }
  }

  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  return (
    <VStack bgColor='backgroundSecondary' alignItems='stretch' paddingY='40px' paddingX='40px' width='30%'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack gap='30px' width='100%' alignItems='stretch'>
          <Text alignSelf='center' fontSize='32px'>
            Zarejestruj się
          </Text>
          <VStack gap={0}>
            <FormLabel alignSelf='flex-start' htmlFor='login'>
              Login:
            </FormLabel>
            <Input
              placeholder='Login'
              id='login'
              type='text'
              {...register('login', {
                required: 'This is required',
              })}
            />
          </VStack>
          <LabelInput
            label='Imię i nazwisko:'
            placeholder='Jan Kowalski'
            {...register('name', { required: 'Imię i nazwisko jest wymagane' })}
          />
          <VStack gap={0}>
            <FormLabel alignSelf='flex-start' htmlFor='email'>
              Email:
            </FormLabel>
            <Input
              placeholder='Email'
              id='email'
              type='email'
              {...register('email', {
                required: 'This is required',
              })}
            />
          </VStack>
          <VStack gap={0}>
            <FormLabel alignSelf='flex-start' htmlFor='password'>
              Hasło:
            </FormLabel>
            <InputGroup>
              <Input
                placeholder='Hasło'
                id='password'
                type={isPasswordVisible ? 'text' : 'password'}
                {...register('password', {
                  required: 'This is required',
                })}
              />
              <InputRightElement cursor='pointer' onClick={() => setIsPasswordVisible((prev) => !prev)}>
                {isPasswordVisible ? <FaEyeSlash size='20px' /> : <FaEye size='20px' />}
              </InputRightElement>
            </InputGroup>
          </VStack>
          <VStack gap={0}>
            <FormLabel alignSelf='flex-start' htmlFor='repeat_password'>
              Powtórz hasło:
            </FormLabel>
            <InputGroup>
              <Input
                placeholder='Powtórz hasło'
                id='repeat_password'
                type={isPasswordVisible ? 'text' : 'password'}
                {...register('password', {
                  required: 'This is required',
                })}
              />
              <InputRightElement cursor='pointer' onClick={() => setIsPasswordVisible((prev) => !prev)}>
                {isPasswordVisible ? <FaEyeSlash size='20px' /> : <FaEye size='20px' />}
              </InputRightElement>
            </InputGroup>
          </VStack>
          <Button type='submit'>Zarejestruj się</Button>
        </VStack>
      </form>
      <Text marginTop='60px' alignSelf='center'>
        Masz konto?{' '}
        <Link style={{ color: '#0A61C9' }} to='/login'>
          Zaloguj się
        </Link>
      </Text>
    </VStack>
  )
}
