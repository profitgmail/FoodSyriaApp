import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Clear existing data
  await prisma.rating.deleteMany()
  await prisma.walletTxn.deleteMany()
  await prisma.payment.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.reservation.deleteMany()
  await prisma.review.deleteMany()
  await prisma.loyaltyReward.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.menuItem.deleteMany()
  await prisma.category.deleteMany()
  await prisma.address.deleteMany()
  await prisma.driver.deleteMany()
  await prisma.restaurant.deleteMany()
  await prisma.customer.deleteMany()
  await prisma.wallet.deleteMany()
  await prisma.admin.deleteMany()
  await prisma.user.deleteMany()

  // Hash password function
  const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, 12)
  }

  // Create sample users
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@foodsyria.com',
      name: 'System Admin',
      password: await hashPassword('admin123'),
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  })

  await prisma.admin.create({
    data: {
      userId: adminUser.id,
      role: 'SUPER_ADMIN',
    },
  })

  // Create restaurant user
  const restaurantUser = await prisma.user.create({
    data: {
      email: 'restaurant@foodsyria.com',
      name: 'Restaurant Owner',
      password: await hashPassword('restaurant123'),
      role: 'RESTAURANT',
      status: 'ACTIVE',
    },
  })

  const restaurant = await prisma.restaurant.create({
    data: {
      userId: restaurantUser.id,
      name: 'مطعم الشام الشهير',
      description: 'أشهر المطاعم السورية تقدم الأطباق التقليدية الأصيلة',
      phone: '+963-11-1234567',
      email: 'info@sham-restaurant.com',
      address: 'دمشق، سوريا',
      latitude: 33.5138,
      longitude: 36.2765,
      status: 'ACTIVE',
      deliveryFee: 5.00,
      minOrder: 20.00,
    },
  })

  // Create driver user
  const driverUser = await prisma.user.create({
    data: {
      email: 'driver@foodsyria.com',
      name: 'Driver User',
      password: await hashPassword('driver123'),
      role: 'DRIVER',
      status: 'ACTIVE',
    },
  })

  await prisma.driver.create({
    data: {
      userId: driverUser.id,
      vehicleType: 'BIKE',
      licenseNumber: 'DRV123456',
      vehiclePlate: 'DAM-123',
      verified: true,
      status: 'OFFLINE',
    },
  })

  // Create customer user
  const customerUser = await prisma.user.create({
    data: {
      email: 'customer@example.com',
      name: 'Customer User',
      password: await hashPassword('customer123'),
      role: 'CUSTOMER',
      status: 'ACTIVE',
    },
  })

  const customer = await prisma.customer.create({
    data: {
      userId: customerUser.id,
      loyaltyPoints: 100,
    },
  })

  // Create customer address
  const address = await prisma.address.create({
    data: {
      customerId: customer.id,
      label: 'المنزل',
      street: 'شارع الملك فيصل',
      city: 'دمشق',
      state: 'دمشق',
      postalCode: '12345',
      latitude: 33.5138,
      longitude: 36.2765,
      isDefault: true,
    },
  })

  // Create wallet for customer
  await prisma.wallet.create({
    data: {
      userId: customerUser.id,
      balance: 50.00,
      currency: 'SYP',
    },
  })

  // Create categories for restaurant
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        restaurantId: restaurant.id,
        name: 'أطباق رئيسية',
        sortOrder: 1,
      },
    }),
    prisma.category.create({
      data: {
        restaurantId: restaurant.id,
        name: 'مقبلات',
        sortOrder: 2,
      },
    }),
    prisma.category.create({
      data: {
        restaurantId: restaurant.id,
        name: 'سلطات',
        sortOrder: 3,
      },
    }),
    prisma.category.create({
      data: {
        restaurantId: restaurant.id,
        name: 'مشروبات',
        sortOrder: 4,
      },
    }),
    prisma.category.create({
      data: {
        restaurantId: restaurant.id,
        name: 'حلويات',
        sortOrder: 5,
      },
    }),
  ])

  // Create sample menu items
  const menuItems = await Promise.all([
    prisma.menuItem.create({
      data: {
        restaurantId: restaurant.id,
        categoryId: categories[0].id, // أطباق رئيسية
        name: 'منسف الدجاج',
        description: 'طبق تقليدي سوري يتكون من الأرز واللحم والخضروات',
        price: 45.00,
        imageUrl: '/images/mansaf.jpg',
        available: true,
        isFeatured: true,
        sortOrder: 1,
      },
    }),
    prisma.menuItem.create({
      data: {
        restaurantId: restaurant.id,
        categoryId: categories[0].id, // أطباق رئيسية
        name: 'شيش طاووق',
        description: 'دجاج مشوي على الفحم مع التوابل السورية',
        price: 40.00,
        imageUrl: '/images/shishtaouk.jpg',
        available: true,
        sortOrder: 2,
      },
    }),
    prisma.menuItem.create({
      data: {
        restaurantId: restaurant.id,
        categoryId: categories[1].id, // مقبلات
        name: 'كبة مقلي',
        description: 'كبة سورية تقليدية محشوة باللحم والصنوبر',
        price: 35.00,
        imageUrl: '/images/kibbeh.jpg',
        available: true,
        sortOrder: 1,
      },
    }),
    prisma.menuItem.create({
      data: {
        restaurantId: restaurant.id,
        categoryId: categories[1].id, // مقبلات
        name: 'محشي ورق عنب',
        description: 'ورق عنب محشي بالأرز واللحم المفروم',
        price: 30.00,
        imageUrl: '/images/warakenab.jpg',
        available: true,
        sortOrder: 2,
      },
    }),
    prisma.menuItem.create({
      data: {
        restaurantId: restaurant.id,
        categoryId: categories[2].id, // سلطات
        name: 'فتوش',
        description: 'سلطة خضراء طازجة مع الخبز المحمص والرمان',
        price: 18.00,
        imageUrl: '/images/fattoush.jpg',
        available: true,
        sortOrder: 1,
      },
    }),
    prisma.menuItem.create({
      data: {
        restaurantId: restaurant.id,
        categoryId: categories[2].id, // سلطات
        name: 'تبولة',
        description: 'سلطة البرغل مع البقدونس والنعناع والخضروات',
        price: 16.00,
        imageUrl: '/images/tabouleh.jpg',
        available: true,
        sortOrder: 2,
      },
    }),
    prisma.menuItem.create({
      data: {
        restaurantId: restaurant.id,
        categoryId: categories[3].id, // مشروبات
        name: 'عصير برتقال طازج',
        description: 'عصير برتقال طبيعي 100%',
        price: 12.00,
        imageUrl: '/images/orange.jpg',
        available: true,
        sortOrder: 1,
      },
    }),
    prisma.menuItem.create({
      data: {
        restaurantId: restaurant.id,
        categoryId: categories[4].id, // حلويات
        name: 'بقلاوة',
        description: 'حلوى شرقية شهية بالجوز والقطر',
        price: 22.00,
        imageUrl: '/images/baklava.jpg',
        available: true,
        sortOrder: 1,
      },
    }),
    prisma.menuItem.create({
      data: {
        restaurantId: restaurant.id,
        categoryId: categories[4].id, // حلويات
        name: 'كنافة',
        description: 'كنافة نابلسية بالجبن والقطر',
        price: 20.00,
        imageUrl: '/images/kunafa.jpg',
        available: true,
        sortOrder: 2,
      },
    }),
    prisma.menuItem.create({
      data: {
        restaurantId: restaurant.id,
        categoryId: categories[0].id, // أطباق رئيسية
        name: 'مشاوي مختلطة',
        description: 'تشكيلة من المشاوي السورية الشهية',
        price: 55.00,
        imageUrl: '/images/mixed-grill.jpg',
        available: true,
        isFeatured: true,
        sortOrder: 3,
      },
    }),
  ])

  // Create sample order
  const order = await prisma.order.create({
    data: {
      customerId: customer.id,
      restaurantId: restaurant.id,
      addressId: address.id,
      status: 'DELIVERED',
      paymentStatus: 'SUCCESS',
      paymentMethod: 'COD',
      subtotal: 85.00,
      deliveryFee: 5.00,
      tax: 0.00,
      discount: 0.00,
      total: 90.00,
      deliveredAt: new Date(),
    },
  })

  // Create order items
  await prisma.orderItem.create({
    data: {
      orderId: order.id,
      menuItemId: menuItems[0].id, // منسف الدجاج
      quantity: 1,
      price: 45.00,
    },
  })

  await prisma.orderItem.create({
    data: {
      orderId: order.id,
      menuItemId: menuItems[4].id, // فتوش
      quantity: 1,
      price: 18.00,
    },
  })

  await prisma.orderItem.create({
    data: {
      orderId: order.id,
      menuItemId: menuItems[6].id, // عصير برتقال
      quantity: 2,
      price: 12.00,
    },
  })

  // Create payment record
  await prisma.payment.create({
    data: {
      orderId: order.id,
      provider: 'COD',
      amount: 90.00,
      currency: 'SYP',
      status: 'SUCCESS',
    },
  })

  // Create rating
  await prisma.rating.create({
    data: {
      orderId: order.id,
      byUserId: customerUser.id,
      forRestaurantId: restaurant.id,
      score: 5,
      comment: 'تجربة رائعة! الطعام لذيذ والتوصيل سريع',
    },
  })

  // Create sample promotion
  await prisma.promotion.create({
    data: {
      name: 'خصم 10% لأول طلب',
      description: 'خصم 10% على أول طلب للمطعم',
      scope: 'RESTAURANT',
      discountType: 'PERCENT',
      value: 10.00,
      validFrom: new Date(),
      validTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      maxUses: 100,
      usedCount: 1,
      isActive: true,
    },
  })

  console.log('Created users:', 4)
  console.log('Created restaurant:', restaurant.name)
  console.log('Created driver:', driverUser.name)
  console.log('Created customer:', customerUser.name)
  console.log('Created categories:', categories.length)
  console.log('Created menu items:', menuItems.length)
  console.log('Created order with items')
  console.log('Created promotion')
  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })