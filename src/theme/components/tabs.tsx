import { tabsAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(tabsAnatomy.keys)

const baseStyle = definePartsStyle({
  tab: {
    bgColor: 'backgroundSecondary',
    width: '100%',
    color: 'black',
    fontWeight: '500',
    fontSize: '16px',
    _selected: {
      bgColor: 'secondary',
      color: 'content',
    },
  },
  tabpanels: {
    bgColor: 'background',
  },
})

export const Tabs = defineMultiStyleConfig({
  baseStyle,
  defaultProps: { variant: 'unstyled' },
})
