import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard_layout/profile/')({
  beforeLoad: ({ location }) => {
    throw redirect({
      to: `${location.pathname}/details`,
    })
  },
})
