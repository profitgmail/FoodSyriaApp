import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'غير مصرح لك' }, { status: 401 })
    }

    const notifications = await db.notification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ notifications })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json({ error: 'حدث خطأ أثناء جلب الإشعارات' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'غير مصرح لك' }, { status: 401 })
    }

    const { title, message, type } = await request.json()

    if (!title || !message) {
      return NextResponse.json({ error: 'العنوان والرسالة مطلوبان' }, { status: 400 })
    }

    const notification = await db.notification.create({
      data: {
        userId: session.user.id,
        title,
        message,
        type: type || 'INFO',
        read: false
      }
    })

    return NextResponse.json({
      message: 'تم إنشاء الإشعار بنجاح',
      notification
    })

  } catch (error) {
    console.error('Error creating notification:', error)
    return NextResponse.json({ error: 'حدث خطأ أثناء إنشاء الإشعار' }, { status: 500 })
  }
}