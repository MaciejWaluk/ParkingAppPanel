import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { AuthContext } from '../utils/authentication'

type RouterContext = {
  authentication: AuthContext
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => {
    return (
      <>
        <Outlet />
      </>
    )
  },
})
