import { createFileRoute, Outlet } from '@tanstack/react-router'
import { Box, HStack, VStack } from '@chakra-ui/react'
import { NavItem } from '@saas-ui/react'
import { Link } from '../../../../../common/components/Link'

export const Route = createFileRoute('/_dashboard_layout/profile/_profile_layout/admin/_admin_layout')({
  component: AdminLayoutComponent,
})

function AdminLayoutComponent() {
  return (
    <VStack>
      <HStack>
        <NavItem
          as={Link}
          paddingX='30px'
          paddingY='4px'
          _activeLink={{
            background: 'none',
            color: 'black',
            borderRadius: '0px',
            borderBottom: '2px solid',
            borderBottomColor: 'black',
          }}
          to='/profile/admin/users'
        >
          Użytkownicy
        </NavItem>
        <NavItem
          as={Link}
          paddingX='30px'
          paddingY='4px'
          _activeLink={{
            background: 'none',
            color: 'black',
            borderRadius: '0px',
            borderBottom: '2px solid',
            borderBottomColor: 'black',
          }}
          to='/profile/admin/tickets'
        >
          Zgłoszenia
        </NavItem>
        <NavItem
          as={Link}
          paddingX='30px'
          paddingY='4px'
          _activeLink={{
            background: 'none',
            color: 'black',
            borderRadius: '0px',
            borderBottom: '2px solid',
            borderBottomColor: 'black',
          }}
          to='/profile/admin/parkings'
        >
          Parkingi
        </NavItem>
      </HStack>
      <Box marginTop='20px' width='100%'>
        <Outlet />
      </Box>
    </VStack>
  )
}
