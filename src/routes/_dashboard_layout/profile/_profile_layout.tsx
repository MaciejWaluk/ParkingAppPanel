import { Box, HStack, Text, VStack } from '@chakra-ui/react'
import { NavItem } from '@saas-ui/react'
import { createFileRoute, Outlet, useRouter } from '@tanstack/react-router'
import { Link } from '../../../common/components/Link'
import { authenticationContent } from '../../../utils/authentication'
import { useProfileDetailsStore } from '../../../state/store'

export const Route = createFileRoute('/_dashboard_layout/profile/_profile_layout')({
  component: ProfileComponent,
})

function ProfileComponent() {
  const { signOut } = authenticationContent()
  const profile = useProfileDetailsStore((state) => state.profile)
  const router = useRouter()
  return (
    <HStack height='calc(100% - 36px)' maxHeight='calc(100% - 36px)' overflowY='hidden' bgColor='background'>
      <VStack alignItems='flex-start' height='100%' gap='10px' padding='30px' paddingRight='50px' bgColor='content'>
        <Text marginBottom='20px' paddingLeft='10px' fontSize='32px' fontWeight='700'>
          Profil
        </Text>
        <NavItem
          as={Link}
          _activeLink={{
            background: 'none',
            color: 'black',
            paddingX: '10px',
            paddingY: '4px',
            borderRadius: 'radiusL',
            border: '1px solid',
            borderColor: 'black',
          }}
          _hover={{
            background: 'none',
            textDecoration: 'none',
          }}
          to='/profile/details'
        >
          Dane konta
        </NavItem>
        <NavItem
          as={Link}
          _activeLink={{
            background: 'none',
            color: 'black',
            paddingX: '10px',
            paddingY: '4px',
            borderRadius: 'radiusL',
            border: '1px solid',
            borderColor: 'black',
          }}
          _hover={{
            background: 'none',
            textDecoration: 'none',
          }}
          to='/profile/reservations'
        >
          Rezerwacje
        </NavItem>
        <NavItem
          as={Link}
          _activeLink={{
            background: 'none',
            color: 'black',
            paddingX: '10px',
            paddingY: '4px',
            borderRadius: 'radiusL',
            border: '1px solid',
            borderColor: 'black',
          }}
          _hover={{
            background: 'none',
            textDecoration: 'none',
          }}
          to='/profile/history'
        >
          Historia
        </NavItem>
        {/*<NavItem*/}
        {/*  as={Link}*/}
        {/*  _activeLink={{*/}
        {/*    background: 'none',*/}
        {/*    color: 'black',*/}
        {/*    paddingX: '10px',*/}
        {/*    paddingY: '4px',*/}
        {/*    borderRadius: 'radiusL',*/}
        {/*    border: '1px solid',*/}
        {/*    borderColor: 'black',*/}
        {/*  }}*/}
        {/*  _hover={{*/}
        {/*    background: 'none',*/}
        {/*    textDecoration: 'none',*/}
        {/*  }}*/}
        {/*  to='/profile/notifications'*/}
        {/*>*/}
        {/*  Ustawienia powiadomień*/}
        {/*</NavItem>*/}
        {/*<NavItem*/}
        {/*  as={Link}*/}
        {/*  _activeLink={{*/}
        {/*    background: 'none',*/}
        {/*    color: 'black',*/}
        {/*    paddingX: '10px',*/}
        {/*    paddingY: '4px',*/}
        {/*    borderRadius: 'radiusL',*/}
        {/*    border: '1px solid',*/}
        {/*    borderColor: 'black',*/}
        {/*  }}*/}
        {/*  _hover={{*/}
        {/*    background: 'none',*/}
        {/*    textDecoration: 'none',*/}
        {/*  }}*/}
        {/*  to='/profile/agreements'*/}
        {/*>*/}
        {/*  Zgody i newsletter*/}
        {/*</NavItem>*/}
        <NavItem
          as={Link}
          _activeLink={{
            background: 'none',
            color: 'black',
            paddingX: '10px',
            paddingY: '4px',
            borderRadius: 'radiusL',
            border: '1px solid',
            borderColor: 'black',
          }}
          _hover={{
            background: 'none',
            textDecoration: 'none',
          }}
          to='/profile/addParking'
        >
          Dodaj parking
        </NavItem>
        <NavItem
          as={Link}
          _activeLink={{
            background: 'none',
            color: 'black',
            paddingX: '10px',
            paddingY: '4px',
            borderRadius: 'radiusL',
            border: '1px solid',
            borderColor: 'black',
          }}
          _hover={{
            background: 'none',
            textDecoration: 'none',
          }}
          to='/profile/sendTicket'
        >
          Wyślij zgłoszenie
        </NavItem>
        {profile?.isAdmin && (
          <NavItem
            as={Link}
            _activeLink={{
              background: 'none',
              color: 'black',
              paddingX: '10px',
              paddingY: '4px',
              borderRadius: 'radiusL',
              border: '1px solid',
              borderColor: 'black',
            }}
            _hover={{
              background: 'none',
              textDecoration: 'none',
            }}
            to='/profile/admin'
          >
            Panel admina
          </NavItem>
        )}
        <Text
          paddingX='12px'
          paddingY='6px'
          fontSize='13px'
          color='primary'
          cursor='pointer'
          onClick={async () => {
            await signOut()
            router.invalidate()
          }}
        >
          Wyloguj się
        </Text>
      </VStack>
      <Box marginX='auto' width='70%' height='100%' padding='30px'>
        <VStack
          width='100%'
          maxHeight='100%'
          bgColor='content'
          borderRadius='radiusL'
          padding='30px'
          gap='10px'
          alignItems='stretch'
          overflow='scroll'
        >
          <Outlet />
        </VStack>
      </Box>
    </HStack>
  )
}
