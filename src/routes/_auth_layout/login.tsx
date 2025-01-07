import {
  Button,
  Collapse,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  SlideFade,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { authenticationContent } from '../../utils/authentication'
import supabase from '../../lib/supabase'
import { useProfileDetailsStore } from '../../state/store'

export const Route = createFileRoute('/_auth_layout/login')({
  component: LoginComponent,
})

type LoginInputs = {
  email: string
  password: string
}

function LoginComponent() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LoginInputs>()
  const toast = useToast()

  const router = useRouter()

  const authentication = authenticationContent()

  const setProfile = useProfileDetailsStore((state) => state.setProfile)
  const setVehicle = useProfileDetailsStore((state) => state.setVehicle)

  const onSubmit: SubmitHandler<LoginInputs> = async (formData) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    })

    if (error) {
      toast({
        title: 'Logowanie',
        description: 'Niepoprawne dane logowania',
        status: 'error',
      })
    } else {
      authentication.signIn()
      const { data: profile, error: profileError } = await supabase.from('profiles').select().eq('id', data.user?.id)
      if (profile) {
        setProfile(profile[0])
        const { data: vehicle } = await supabase
          .from('vehicles')
          .select()
          .eq('userId', profile[0].id)
          .eq('isPrimary', true)
        setVehicle(vehicle![0])
        router.invalidate()
      }
    }
  }

  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  return (
    <VStack bgColor='backgroundSecondary' alignItems='stretch' paddingY='40px' paddingX='40px' width='30%'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack gap='30px' width='100%' alignItems='stretch'>
          <Text alignSelf='center' fontSize='32px'>
            Zaloguj się
          </Text>
          <VStack gap={0}>
            <FormLabel alignSelf='flex-start' htmlFor='email'>
              Email:
            </FormLabel>
            <Input
              placeholder='Email'
              id='email'
              type='email'
              {...register('email', {
                required: 'Email jest wymagany',
              })}
            />
            <Collapse in={!!errors['email']} style={{ width: '100%' }}>
              {errors['email'] && (
                <Text marginTop='10px' fontSize='12px' color='red'>
                  {errors['email']?.message}
                </Text>
              )}
            </Collapse>
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
                  required: 'Hasło jest wymagane',
                })}
              />
              <InputRightElement cursor='pointer' onClick={() => setIsPasswordVisible((prev) => !prev)}>
                {isPasswordVisible ? <FaEyeSlash size='20px' /> : <FaEye size='20px' />}
              </InputRightElement>
            </InputGroup>
            <Collapse in={!!errors['password']} style={{ width: '100%' }}>
              {errors['password'] && (
                <Text marginTop='10px' fontSize='12px' color='red'>
                  {errors['password']?.message}
                </Text>
              )}
            </Collapse>
          </VStack>
          <Button type='submit'>Zaloguj się</Button>
        </VStack>
      </form>
      <Text marginTop='60px' alignSelf='center'>
        Nie masz konta?{' '}
        <Link style={{ color: '#0A61C9' }} to='/register'>
          Zarejestruj się
        </Link>
      </Text>
    </VStack>
  )
}
