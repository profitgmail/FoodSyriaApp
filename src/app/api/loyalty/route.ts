import { NextRequest, NextResponse } from 'next/server'
import { getServerUser } from '@/lib/auth-supabase'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const user = await getServerUser()
    
    if (!user?.id) {
      return NextResponse.json({ error: 'يجب تسجيل الدخول أولاً' }, { status: 401 })
    }

    // Get user loyalty points
    const userData = await db.user.findUnique({
      where: { id: user.id },
      select: { loyaltyPoints: true }
    })

    if (!userData) {
      return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 })
    }

    // Get loyalty rewards history
    const rewards = await db.loyaltyReward.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 20 // Limit to last 20 rewards
    })

    return NextResponse.json({
      points: userData.loyaltyPoints,
      rewards
    })

  } catch (error) {
    console.error('Error fetching loyalty data:', error)
    return NextResponse.json({ error: 'حدث خطأ أثناء جلب بيانات الولاء' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getServerUser()
    
    if (!user?.id) {
      return NextResponse.json({ error: 'يجب تسجيل الدخول أولاً' }, { status: 401 })
    }

    const { points, type, description, orderId, reservationId } = await request.json()

    if (!points || !type || !description) {
      return NextResponse.json({ error: 'جميع الحقول مطلوبة' }, { status: 400 })
    }

    // Update user loyalty points
    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: {
        loyaltyPoints: {
          increment: type === 'REDEEMED' ? -points : points
        }
      }
    })

    // Create loyalty reward record
    const loyaltyReward = await db.loyaltyReward.create({
      data: {
        userId: user.id,
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