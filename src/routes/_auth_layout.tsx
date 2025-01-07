import { Center } from '@chakra-ui/react'
import { AppShell } from '@saas-ui/react'
import { redirect } from '@tanstack/react-router'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth_layout')({
  component: () => (
    <AppShell height='$100vh' backgroundColor='background'>
      <Center height='100%'>
        <Outlet />
      </Center>
    </AppShell>
  ),
  beforeLoad: async ({ context }) => {
    const { isLogged } = context.authentication

    if (isLogged()) {
      throw redirect({
        to: '/',
      })
    }
  },
})
