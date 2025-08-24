import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'غير مصرح لك' }, { status: 401 })
    }

    const notification = await db.notification.updateMany({
      where: {
        id: params.id,
        userId: session.user.id
      },
      data: {
        read: true
      }
    })

    if (notification.count === 0) {
      return NextResponse.json({ error: 'الإشعار غير موجود' }, { status: 404 })
    }

    return NextResponse.json({
      message: 'تم تحديث الإشعار بنجاح'
    })

  } catch (error) {
    console.error('Error updating notification:', error)
    return NextResponse.json({ error: 'حدث خطأ أثناء تحديث الإشعار' }, { status: 500 })
  }
}