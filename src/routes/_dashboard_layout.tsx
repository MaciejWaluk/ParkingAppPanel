import { HStack, Text } from '@chakra-ui/react'
import { AppShell, NavItem } from '@saas-ui/react'
import { redirect, useRouter } from '@tanstack/react-router'
import { Outlet, createFileRoute, useNavigate } from '@tanstack/react-router'
import { Link } from '../common/components/Link'
import { authenticationContent } from '../utils/authentication'
import { useEffect } from 'react'
import supabase from '../lib/supabase'

export const Route = createFileRoute('/_dashboard_layout')({
  component: RootComponent,
  beforeLoad: async ({ context }) => {
    const { isLogged } = context.authentication

    if (!isLogged()) {
      throw redirect({
        to: '/login',
      })
    }
  },
})
function RootComponent() {
  const navigate = useNavigate()

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

  return (
    <AppShell height='$100vh'>
      <HStack paddingX={'20px'} paddingY={'15px'} bgColor='primary' justifyContent='space-between'>
        <Text fontSize='24px' fontWeight='700' color='content' cursor='pointer' onClick={() => navigate({ to: '/' })}>
          ParkingApp
        </Text>

        <HStack>
          <NavItem
            as={Link}
            to='/'
            color='content'
            _activeLink={{
              color: 'content',
              paddingX: '10px',
              paddingY: '4px',
              borderRadius: 'radiusL',
              border: '1px solid',
              borderColor: 'content',
            }}
            _hover={{
              background: 'none',
              textDecoration: 'none',
            }}
          >
            Strona główna
          </NavItem>
          <NavItem
            as={Link}
            to='/profile'
            color='content'
            _activeLink={{
              color: 'content',
              paddingX: '10px',
              paddingY: '4px',
              borderRadius: 'radiusL',
              border: '1px solid',
              borderColor: 'content',
            }}
            _hover={{
              background: 'none',
              textDecoration: 'none',
            }}
          >
            Profil
          </NavItem>
        </HStack>
      </HStack>
      <Outlet />
    </AppShell>
  )
}
