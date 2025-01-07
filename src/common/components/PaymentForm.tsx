import React, { useEffect, useState } from 'react'
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { Button, Spinner, VStack } from '@chakra-ui/react'

interface PaymentFormProps {
  clientSecret: string
  setPaymentStatus: React.Dispatch<React.SetStateAction<'pending' | 'none' | 'accepted' | 'rejected'>>
}

export const PaymentForm: React.FC<PaymentFormProps> = ({ clientSecret, setPaymentStatus }) => {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setIsProcessing(true)
    setErrorMessage(null)

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements, // PaymentElement inside
      confirmParams: {
        return_url: window.location.href, // or a success page
      },
      redirect: 'if_required',
      // 'if_required' means Stripe may do a redirect flow if needed (3D Secure, etc.).
      // If you want to always redirect to a return_url, set 'always'
    })

    if (error) {
      setErrorMessage(error.message || 'An error occurred')
      setIsProcessing(false)
    } else if (paymentIntent?.status === 'succeeded') {
      setPaymentStatus('accepted')
    }

    setIsProcessing(false)
  }

  return (
    <VStack width='100%' marginTop='30px'>
      <form style={{ width: '100%' }} onSubmit={handleSubmit}>
        <VStack width='100%' gap='30px' alignItems='stretch'>
          <PaymentElement />
          <Button width='100%' type='submit' disabled={!stripe || isProcessing}>
            {isProcessing ? <Spinner /> : 'Zapłać'}
          </Button>
          {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
        </VStack>
      </form>
    </VStack>
  )
}
