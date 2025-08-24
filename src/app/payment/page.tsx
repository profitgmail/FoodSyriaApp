'use client'

import { useSearchParams } from 'next/navigation'
import { useState, Suspense } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, ArrowRight } from 'lucide-react'
import PaymentForm from '@/components/payment-form'

function PaymentContent() {
  const searchParams = useSearchParams()
  const { data: session } = useSession()
  const router = useRouter()
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  const amount = parseFloat(searchParams.get('amount') || '0')
  const orderId = searchParams.get('orderId') || undefined
  const orderItems = searchParams.get('items') ? JSON.parse(searchParams.get('items')!) : []

  if (!session) {
    router.push('/auth/signin')
    return null
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl text-green-600">تم الدفع بنجاح!</CardTitle>
            <CardDescription>
              شكراً لك على دفعك. تم تأكيد طلبك بنجاح.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>المبلغ المدفوع:</span>
                <Badge variant="secondary">{amount} ر.س</Badge>
              </div>
              <Button 
                className="w-full" 
                onClick={() => router.push('/dashboard')}
              >
                الذهاب إلى لوحة التحكم
                <ArrowRight className="mr-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">إتمام الدفع</h1>
          <p className="text-gray-600">ادفع طلبك بأمان باستخدام بطاقتك الائتمانية</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>ملخص الطلب</CardTitle>
              <CardDescription>مراجعة تفاصيل طلبك قبل الدفع</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orderItems.length > 0 ? (
                  orderItems.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <span className="font-medium">{item.name}</span>
                        <div className="text-sm text-gray-500">
                          الكمية: {item.quantity}
                        </div>
                      </div>
                      <Badge variant="secondary">
                        {(item.price * item.quantity).toFixed(2)} ر.س
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">لا توجد عناصر في الطلب</p>
                  </div>
                )}
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>المجموع:</span>
                    <Badge variant="default" className="text-lg">
                      {amount} ر.س
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <PaymentForm
            amount={amount}
            orderId={orderId}
            onSuccess={() => setPaymentSuccess(true)}
          />
        </div>

        <div className="mt-8 text-center">
          <Alert>
            <AlertDescription>
              جميع المدفوعات مشفرة وآمنة. لا نقوم بتخزين معلومات بطاقتك الائتمانية.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  )
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل صفحة الدفع...</p>
        </div>
      </div>
    }>
      <PaymentContent />
    </Suspense>
  )
}