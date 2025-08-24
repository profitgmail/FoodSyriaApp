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

    const orders = await db.order.findMany({
      where: { userId: session.user.id },
      include: {
        orderItems: {
          include: {
            menuItem: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ orders })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: 'حدث خطأ أثناء جلب الطلبات' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'يجب تسجيل الدخول أولاً' }, { status: 401 })
    }

    const { items, address, phone, notes } = await request.json()

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'الطلب يجب أن يحتوي على عناصر' }, { status: 400 })
    }

    // Calculate total
    let total = 0
    const orderItemsData = []

    for (const item of items) {
      const menuItem = await db.menuItem.findUnique({
        where: { id: item.menuItemId }
      })

      if (!menuItem) {
        return NextResponse.json({ error: `العنصر ${item.menuItemId} غير موجود` }, { status: 400 })
      }

      if (!menuItem.available) {
        return NextResponse.json({ error: `العنصر ${menuItem.name} غير متوفر حالياً` }, { status: 400 })
      }

      const itemTotal = menuItem.price * item.quantity
      total += itemTotal

      orderItemsData.push({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        price: menuItem.price,
        notes: item.notes || null
      })
    }

    // Create order
    const order = await db.order.create({
      data: {
        userId: session.user.id,
        total,
        address: address || null,
        phone: phone || null,
        notes: notes || null,
        status: 'PENDING',
        orderItems: {
          create: orderItemsData
        }
      },
      include: {
        orderItems: {
          include: {
            menuItem: true
          }
        }
      }
    })

    return NextResponse.json({
      message: 'تم إنشاء الطلب بنجاح',
      order
    })

  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json({ error: 'حدث خطأ أثناء إنشاء الطلب' }, { status: 500 })
  }
}