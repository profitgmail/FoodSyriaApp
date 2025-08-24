import { NextRequest, NextResponse } from 'next/server'
import { getServerUser } from '@/lib/auth-supabase'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const user = await getServerUser()
    
    if (!user?.id) {
      return NextResponse.json({ error: 'غير مصرح لك' }, { status: 401 })
    }

    // Get customer profile
    const customer = await db.customer.findFirst({
      where: { userId: user.id }
    })

    if (!customer) {
      return NextResponse.json({ error: 'ملف العميل غير موجود' }, { status: 404 })
    }

    const orders = await db.order.findMany({
      where: { customerId: customer.id },
      include: {
        orderItems: {
          include: {
            menuItem: {
              include: {
                restaurant: true
              }
            }
          }
        },
        restaurant: true,
        address: true,
        payment: true
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
    const user = await getServerUser()
    
    if (!user?.id) {
      return NextResponse.json({ error: 'يجب تسجيل الدخول أولاً' }, { status: 401 })
    }

    const { items, restaurantId, addressId, notes, paymentMethod = 'COD' } = await request.json()

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'الطلب يجب أن يحتوي على عناصر' }, { status: 400 })
    }

    if (!restaurantId) {
      return NextResponse.json({ error: 'يجب تحديد المطعم' }, { status: 400 })
    }

    // Get customer profile
    const customer = await db.customer.findFirst({
      where: { userId: user.id },
      include: { addresses: true }
    })

    if (!customer) {
      return NextResponse.json({ error: 'ملف العميل غير موجود' }, { status: 404 })
    }

    // Get restaurant details
    const restaurant = await db.restaurant.findUnique({
      where: { id: restaurantId }
    })

    if (!restaurant) {
      return NextResponse.json({ error: 'المطعم غير موجود' }, { status: 404 })
    }

    // Get or create address
    let address = null
    if (addressId) {
      address = await db.address.findFirst({
        where: { 
          id: addressId, 
          customerId: customer.id 
        }
      })
    }

    // Calculate totals
    let subtotal = 0
    const orderItemsData = []

    for (const item of items) {
      const menuItem = await db.menuItem.findUnique({
        where: { id: item.menuItemId },
        include: { restaurant: true }
      })

      if (!menuItem) {
        return NextResponse.json({ error: `العنصر ${item.menuItemId} غير موجود` }, { status: 400 })
      }

      if (menuItem.restaurantId !== restaurantId) {
        return NextResponse.json({ error: `العنصر ${menuItem.name} لا ينتمي إلى هذا المطعم` }, { status: 400 })
      }

      if (!menuItem.available) {
        return NextResponse.json({ error: `العنصر ${menuItem.name} غير متوفر حالياً` }, { status: 400 })
      }

      const itemTotal = menuItem.price * item.quantity
      subtotal += itemTotal

      orderItemsData.push({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        price: menuItem.price,
        notes: item.notes || null
      })
    }

    // Check minimum order
    if (subtotal < restaurant.minOrder) {
      return NextResponse.json({ 
        error: `الحد الأدنى للطلب هو ${restaurant.minOrder} ل.س` 
      }, { status: 400 })
    }

    // Calculate totals
    const deliveryFee = restaurant.deliveryFee
    const tax = 0 // No tax for now
    const discount = 0 // No discount for now
    const total = subtotal + deliveryFee + tax - discount

    // Create order
    const order = await db.order.create({
      data: {
        customerId: customer.id,
        restaurantId: restaurantId,
        addressId: address?.id,
        status: 'CREATED',
        paymentStatus: 'PENDING',
        paymentMethod,
        subtotal,
        deliveryFee,
        tax,
        discount,
        total,
        notes: notes || null,
        orderItems: {
          create: orderItemsData
        }
      },
      include: {
        orderItems: {
          include: {
            menuItem: {
              include: {
                restaurant: true
              }
            }
          }
        },
        restaurant: true,
        address: true
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