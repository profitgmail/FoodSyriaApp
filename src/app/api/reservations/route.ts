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

    const reservations = await db.reservation.findMany({
      where: { userId: session.user.id },
      orderBy: [
        { date: 'asc' },
        { time: 'asc' }
      ]
    })

    return NextResponse.json({ reservations })
  } catch (error) {
    console.error('Error fetching reservations:', error)
    return NextResponse.json({ error: 'حدث خطأ أثناء جلب الحجوزات' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'يجب تسجيل الدخول أولاً' }, { status: 401 })
    }

    const { date, time, partySize, phone, notes } = await request.json()

    if (!date || !time || !partySize) {
      return NextResponse.json({ error: 'جميع الحقول المطلوبة يجب ملؤها' }, { status: 400 })
    }

    // Validate date is not in the past
    const reservationDate = new Date(date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (reservationDate < today) {
      return NextResponse.json({ error: 'لا يمكن حجز طاولة في تاريخ سابق' }, { status: 400 })
    }

    // Check if time slot is available (simplified check)
    const existingReservations = await db.reservation.findMany({
      where: {
        date: reservationDate,
        time: time,
        status: {
          in: ['PENDING', 'CONFIRMED']
        }
      }
    })

    // For simplicity, limit to 5 reservations per time slot
    if (existingReservations.length >= 5) {
      return NextResponse.json({ error: 'هذا الموعد محجوز بالكامل' }, { status: 400 })
    }

    // Create reservation
    const reservation = await db.reservation.create({
      data: {
        userId: session.user.id,
        date: reservationDate,
        time,
        partySize: parseInt(partySize),
        phone: phone || null,
        notes: notes || null,
        status: 'PENDING'
      }
    })

    return NextResponse.json({
      message: 'تم إنشاء الحجز بنجاح',
      reservation
    })

  } catch (error) {
    console.error('Error creating reservation:', error)
    return NextResponse.json({ error: 'حدث خطأ أثناء إنشاء الحجز' }, { status: 500 })
  }
}