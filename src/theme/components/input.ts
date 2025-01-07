import { inputAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(inputAnatomy.keys)

const baseStyle = definePartsStyle({
  field: {
    borderRadius: 'radiusM',
    background: 'none',
    backgroundColor: 'backgroundSecondary',
    border: '1px solid',
    borderWidth: 2,
    borderColor: 'border',
    color: 'black',
    _placeholder: {
      color: 'border',
    },
  },
})

export const Input = defineMultiStyleConfig({
  baseStyle,
  defaultProps: { focusBorderColor: 'primary' },
})
