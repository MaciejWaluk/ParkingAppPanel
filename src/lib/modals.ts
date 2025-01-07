import { ConfirmDialog, createModals } from '@saas-ui/react'

export const { ModalsProvider, useModals } = createModals({
  modals: {
    confirm: ConfirmDialog,
  },
})
