import { NextRequest, NextResponse } from 'next/server'
import { getServerUser } from '@/lib/auth-supabase'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const user = await getServerUser()
    
    if (!user?.id) {
      return NextResponse.json({ error: 'يجب تسجيل الدخول أولاً' }, { status: 401 })
    }

    const { points, description } = await request.json()

    if (!points || !description) {
      return NextResponse.json({ error: 'جميع الحقول مطلوبة' }, { status: 400 })
    }

    // Check if user has enough points
    const userData = await db.user.findUnique({
      where: { id: user.id },
      select: { loyaltyPoints: true }
    })

    if (!userData) {
      return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 })
    }

    if (userData.loyaltyPoints < points) {
      return NextResponse.json({ error: 'نقاط الولاء غير كافية' }, { status: 400 })
    }

    // Update user loyalty points
    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: {
        loyaltyPoints: {
          decrement: points
        }
      }
    })

    // Create loyalty reward record
    const loyaltyReward = await db.loyaltyReward.create({
      data: {
        userId: user.id,
        points,
        type: 'REDEEMED',
        description
      }
    })

    // Create notification for the user
    await db.notification.create({
      data: {
        userId: user.id,
        title: 'مكافأة مستبدلة',
        message: `تم استبدال ${points} نقطة ولاء مقابل: ${description}`,
        type: 'SUCCESS'
      }
    })

    return NextResponse.json({
      message: 'تم استبدال المكافأة بنجاح',
      points: updatedUser.loyaltyPoints,
      reward: loyaltyReward
    })

  } catch (error) {
    console.error('Error redeeming reward:', error)
    return NextResponse.json({ error: 'حدث خطأ أثناء استبدال المكافأة' }, { status: 500 })
  }
}