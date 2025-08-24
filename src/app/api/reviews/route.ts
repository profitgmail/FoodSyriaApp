import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const menuItemId = searchParams.get('menuItemId')
    const orderId = searchParams.get('orderId')
    const reservationId = searchParams.get('reservationId')

    let where = {}
    
    if (menuItemId) {
      // For menu item reviews, we need to get reviews from orders that contain this item
      const ordersWithMenuItem = await db.order.findMany({
        where: {
          orderItems: {
            some: {
              menuItemId
            }
          }
        },
        select: {
          id: true
        }
      })
      
      where = {
        orderId: {
          in: ordersWithMenuItem.map(order => order.id)
        }
      }
    } else if (orderId) {
      where = { orderId }
    } else if (reservationId) {
      where = { reservationId }
    }

    const reviews = await db.review.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ reviews })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json({ error: 'حدث خطأ أثناء جلب التقييمات' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'يجب تسجيل الدخول أولاً' }, { status: 401 })
    }

    const { rating, comment, orderId, reservationId } = await request.json()

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'التقييم يجب أن يكون بين 1 و 5' }, { status: 400 })
    }

    // Check if user has already reviewed this order/reservation
    const existingReview = await db.review.findFirst({
      where: {
        userId: session.user.id,
        ...(orderId && { orderId }),
        ...(reservationId && { reservationId })
      }
    })

    if (existingReview) {
      return NextResponse.json({ error: 'لقد قمت بتقييم هذا الطلب/الحجز مسبقاً' }, { status: 400 })
    }

    // If orderId is provided, check if the order belongs to the user and is completed
    if (orderId) {
      const order = await db.order.findFirst({
        where: {
          id: orderId,
          userId: session.user.id,
          status: 'DELIVERED'
        }
      })

      if (!order) {
        return NextResponse.json({ error: 'الطلب غير موجود أو غير مكتمل' }, { status: 404 })
      }
    }

    // If reservationId is provided, check if the reservation belongs to the user and is completed
    if (reservationId) {
      const reservation = await db.reservation.findFirst({
        where: {
          id: reservationId,
          userId: session.user.id,
          status: 'COMPLETED'
        }
      })

      if (!reservation) {
        return NextResponse.json({ error: 'الحجز غير موجود أو غير مكتمل' }, { status: 404 })
      }
    }

    // Create review
    const review = await db.review.create({
      data: {
        userId: session.user.id,
        rating,
        comment: comment || null,
        orderId: orderId || null,
        reservationId: reservationId || null
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({
      message: 'تم إضافة التقييم بنجاح',
      review
    })

  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json({ error: 'حدث خطأ أثناء إضافة التقييم' }, { status: 500 })
  }
}