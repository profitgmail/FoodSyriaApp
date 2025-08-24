import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Stripe from 'stripe'

// Check if Stripe is configured
const stripeSecretKey = process.env.STRIPE_SECRET_KEY
let stripe: Stripe | null = null

if (stripeSecretKey && stripeSecretKey !== 'sk_test_your_stripe_secret_key') {
  stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2024-12-18.acacia',
  })
}

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is configured
    if (!stripe) {
      return NextResponse.json({ 
        error: 'نظام الدفع غير متاح حالياً. يرجى التواصل مع الإدارة.' 
      }, { status: 503 })
    }

    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'يجب تسجيل الدخول أولاً' }, { status: 401 })
    }

    const { amount, orderId } = await request.json()

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'المبلغ غير صالح' }, { status: 400 })
    }

    // Create PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'sar',
      metadata: {
        userId: session.user.id,
        orderId: orderId || '',
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    })

  } catch (error) {
    console.error('Error creating payment intent:', error)
    return NextResponse.json({ error: 'حدث خطأ أثناء إنشاء الدفع' }, { status: 500 })
  }
}