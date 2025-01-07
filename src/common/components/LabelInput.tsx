import { Collapse, Input, InputProps, Text, VStack } from '@chakra-ui/react'
import React, { forwardRef } from 'react'

type LabelInputProps = {
  label: string
  errorMessage?: string
} & InputProps

export const LabelInput = forwardRef<HTMLInputElement, LabelInputProps>(({ label, errorMessage, ...props }, ref) => {
  return (
    <VStack gap='10px' width='100%' alignItems='flex-start'>
      <Text fontSize='12px'>{label}</Text>
      <Input ref={ref} {...props} />
      <Collapse in={!!errorMessage} style={{ width: '100%' }}>
        {errorMessage && (
          <Text marginTop='10px' fontSize='12px' color='red'>
            {errorMessage}
          </Text>
        )}
      </Collapse>
    </VStack>
  )
})

LabelInput.displayName = 'LabelInput'
