'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, CreditCard, AlertCircle } from 'lucide-react'

// Check if Stripe is configured
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
const stripePromise = stripePublishableKey && stripePublishableKey !== 'pk_test_your_stripe_publishable_key' 
  ? loadStripe(stripePublishableKey)
  : null

interface PaymentFormProps {
  amount: number
  orderId?: string
  onSuccess: () => void
}

function PaymentFormComponent({ amount, orderId, onSuccess }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setProcessing(true)
    setError(null)

    try {
      // Create payment intent
      const response = await fetch('/api/payment/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount, orderId }),
      })

      const { clientSecret, error: backendError } = await response.json()

      if (backendError) {
        setError(backendError)
        setProcessing(false)
        return
      }

      // Confirm payment
      const { error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      })

      if (stripeError) {
        setError(stripeError.message || 'حدث خطأ أثناء معالجة الدفع')
      } else {
        onSuccess()
      }
    } catch (err) {
      setError('حدث خطأ أثناء معالجة الدفع')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 border rounded-lg">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
            },
          }}
        />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={!stripe || processing}
        size="lg"
      >
        {processing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            جاري معالجة الدفع...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-4 w-4" />
            ادفع {amount} ر.س
          </>
        )}
      </Button>
    </form>
  )
}

export default function PaymentForm({ amount, orderId, onSuccess }: PaymentFormProps) {
  // If Stripe is not configured, show a message
  if (!stripePromise) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-600">
            <AlertCircle className="h-5 w-5" />
            نظام الدفع غير متاح
          </CardTitle>
          <CardDescription>
            نظام الدفع الإلكتروني غير متاح حالياً
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>
              عذراً، نظام الدفع الإلكتروني غير متاح حالياً. يرجى التواصل مع الإدارة لاستكمال عملية الدفع.
            </AlertDescription>
          </Alert>
          <div className="mt-4 space-y-2">
            <p className="text-sm text-gray-600">خيارات الدفع المتاحة:</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• الدفع عند الاستلام</li>
              <li>• التحويل البنكي</li>
              <li>• الاتصال بالمطعم مباشرة</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          الدفع الآمن
        </CardTitle>
        <CardDescription>
          أدخل معلومات بطاقتك لإتمام عملية الدفع
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Elements stripe={stripePromise}>
          <PaymentFormComponent
            amount={amount}
            orderId={orderId}
            onSuccess={onSuccess}
          />
        </Elements>
      </CardContent>
    </Card>
  )
}