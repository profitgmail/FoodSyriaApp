import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'يجب تسجيل الدخول أولاً' }, { status: 401 })
    }

    // Get user loyalty points
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { loyaltyPoints: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 })
    }

    // Get loyalty rewards history
    const rewards = await db.loyaltyReward.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 20 // Limit to last 20 rewards
    })

    return NextResponse.json({
      points: user.loyaltyPoints,
      rewards
    })

  } catch (error) {
    console.error('Error fetching loyalty data:', error)
    return NextResponse.json({ error: 'حدث خطأ أثناء جلب بيانات الولاء' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'يجب تسجيل الدخول أولاً' }, { status: 401 })
    }

    const { points, type, description, orderId, reservationId } = await request.json()

    if (!points || !type || !description) {
      return NextResponse.json({ error: 'جميع الحقول مطلوبة' }, { status: 400 })
    }

    // Update user loyalty points
    const updatedUser = await db.user.update({
      where: { id: session.user.id },
      data: {
        loyaltyPoints: {
          increment: type === 'REDEEMED' ? -points : points
        }
      }
    })

    // Create loyalty reward record
    const loyaltyReward = await db.loyaltyReward.create({
      data: {
        userId: session.user.id,
        points,
        type,
        description,
        orderId: orderId || null,
        reservationId: reservationId || null
      }
    })

    return NextResponse.json({
      message: 'تم تحديث نقاط الولاء بنجاح',
      points: updatedUser.loyaltyPoints,
      reward: loyaltyReward
    })

  } catch (error) {
    console.error('Error updating loyalty points:', error)
    return NextResponse.json({ error: 'حدث خطأ أثناء تحديث نقاط الولاء' }, { status: 500 })
  }
}