import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Clear existing menu items
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.menuItem.deleteMany()
  
  console.log('🗑️ Cleared existing menu items and orders')

  // Menu categories
  const categories = [
    'المقبلات',
    'الشوربات',
    'السلطات',
    'الأطباق الرئيسية',
    'المشويات',
    'الأطباق الجانبية',
    'الحلويات',
    'المشروبات'
  ]

  // Menu items data
  const menuItems = [
    // المقبلات - Appetizers
    {
      name: 'حمص بالطحينة',
      description: 'حمص تقليدي مع زيت الزيتون والفلفل الحار والبقدونس',
      price: 12.0,
      category: 'المقبلات',
      imageUrl: '/images/hummus.jpg'
    },
    {
      name: 'متبل الباذنجان',
      description: 'باذنجان مشوي مع الطماطم والبصل والفلفل والتوابل السورية',
      price: 15.0,
      category: 'المقبلات',
      imageUrl: '/images/mutabal.jpg'
    },
    {
      name: 'فتة حمص',
      description: 'طبق فتة لذيذ مع حمص وخبز مقلي والصنوبر والزيت',
      price: 18.0,
      category: 'المقبلات',
      imageUrl: '/images/fatteh-hummus.jpg'
    },
    {
      name: 'ورق عنب بالزيت',
      description: 'ورق عنب محشي بالأرز والتوابل والزيتون',
      price: 20.0,
      category: 'المقبلات',
      imageUrl: '/images/warak-enab.jpg'
    },
    {
      name: 'كبة مقليّة',
      description: 'كبة تقليدية محشوة باللحم والصنوبر',
      price: 22.0,
      category: 'المقبلات',
      imageUrl: '/images/kubba-fried.jpg'
    },

    // الشوربات - Soups
    {
      name: 'شوربة عدس',
      description: 'شوربة عدس تقليدية مع الليمون والخبز المحمص',
      price: 10.0,
      category: 'الشوربات',
      imageUrl: '/images/lentil-soup.jpg'
    },
    {
      name: 'شوربة فراخ بالكريمة',
      description: 'شوربة فراخ كريمية مع الخضروات الطازجة',
      price: 14.0,
      category: 'الشوربات',
      imageUrl: '/images/chicken-cream-soup.jpg'
    },
    {
      name: 'شوربة خضار',
      description: 'شوربة خضار مشكلة مع الأعشاب العطرية',
      price: 12.0,
      category: 'الشوربات',
      imageUrl: '/images/vegetable-soup.jpg'
    },

    // السلطات - Salads
    {
      name: 'سلطة فتوش',
      description: 'سلطة فتوش تقليدية مع الخبز المحمص والرمان',
      price: 16.0,
      category: 'السلطات',
      imageUrl: '/images/fattoush.jpg'
    },
    {
      name: 'سلطة تبولة',
      description: 'سلطة تبولة طازجة مع البقدونس والبرغل والليمون',
      price: 18.0,
      category: 'السلطات',
      imageUrl: '/images/tabouleh.jpg'
    },
    {
      name: 'سلطة يونانية',
      description: 'سلطة يونانية مع جبنة الفيتا والزيتون',
      price: 20.0,
      category: 'السلطات',
      imageUrl: '/images/greek-salad.jpg'
    },
    {
      name: 'سلطة قيصر',
      description: 'سلطة قيصر مع الدجاج والخبز المحمص',
      price: 22.0,
      category: 'السلطات',
      imageUrl: '/images/caesar-salad.jpg'
    },

    // الأطباق الرئيسية - Main Courses
    {
      name: 'منسف فخ',
      description: 'منسف تقليدي مع اللحم والأرز واللبن',
      price: 45.0,
      category: 'الأطباق الرئيسية',
      imageUrl: '/images/mansaf.jpg'
    },
    {
      name: 'مقلوبة دجاج',
      description: 'مقلوبة لذيذة مع الدجاج والباذنجان والأرز',
      price: 38.0,
      category: 'الأطباق الرئيسية',
      imageUrl: '/images/maklouba-chicken.jpg'
    },
    {
      name: 'يخنة لحم',
      description: 'يخنة لحم غنية مع الخضروات والتوابل',
      price: 42.0,
      category: 'الأطباق الرئيسية',
      imageUrl: '/images/meat-stew.jpg'
    },
    {
      name: 'يخنة خضار',
      description: 'يخنة خضار مشكلة مع الأرز',
      price: 28.0,
      category: 'الأطباق الرئيسية',
      imageUrl: '/images/vegetable-stew.jpg'
    },
    {
      name: 'كوزي برياني',
      description: 'كوزي برياني مع اللحم والتوابل الهندية',
      price: 48.0,
      category: 'الأطباق الرئيسية',
      imageUrl: '/images/kozi-biryani.jpg'
    },

    // المشويات - Grills
    {
      name: 'شيش طاووق',
      description: 'شيش طاووق مشوي مع صلصة الثوم والخبز',
      price: 32.0,
      category: 'المشويات',
      imageUrl: '/images/shish-tawook.jpg'
    },
    {
      name: 'شيش كبدة',
      description: 'شيش كبدة مشوي مع البصل والفلفل',
      price: 28.0,
      category: 'المشويات',
      imageUrl: '/images/shish-kabab.jpg'
    },
    {
      name: 'كفتة مشوية',
      description: 'كفتة مشوية مع السلطة والأرز',
      price: 30.0,
      category: 'المشويات',
      imageUrl: '/images/kofta-grill.jpg'
    },
    {
      name: 'مشاوي مشكلة',
      description: 'طبق مشاوي مشتمل على شيش طاووق وكفتة وكباب',
      price: 45.0,
      category: 'المشويات',
      imageUrl: '/images/mixed-grill.jpg'
    },
    {
      name: 'فاهيتا لحم',
      description: 'فاهيتا لحم مع الخضروات والصلصة',
      price: 40.0,
      category: 'المشويات',
      imageUrl: '/images/meat-fajita.jpg'
    },

    // الأطباق الجانبية - Side Dishes
    {
      name: 'أرز أبيض',
      description: 'أرز أبيض مطهي بشكل مثالي',
      price: 8.0,
      category: 'الأطباق الجانبية',
      imageUrl: '/images/white-rice.jpg'
    },
    {
      name: 'أرز بسمتي',
      description: 'أرز بسمتي عالي الجودة',
      price: 10.0,
      category: 'الأطباق الجانبية',
      imageUrl: '/images/basmati-rice.jpg'
    },
    {
      name: 'خبز عربي',
      description: 'خبز عربي طازج من الفرن',
      price: 5.0,
      category: 'الأطباق الجانبية',
      imageUrl: '/images/arabic-bread.jpg'
    },
    {
      name: 'بطاطس مقلية',
      description: 'بطاطس مقلية مقلية بشكل مثالي',
      price: 12.0,
      category: 'الأطباق الجانبية',
      imageUrl: '/images/french-fries.jpg'
    },
    {
      name: 'خضار مشوية',
      description: 'خضار مشوية مع التوابل العطرية',
      price: 15.0,
      category: 'الأطباق الجانبية',
      imageUrl: '/images/grilled-vegetables.jpg'
    },

    // الحلويات - Desserts
    {
      name: 'كنافة بالجبن',
      description: 'كنافة تقليدية بالجبن والقطر',
      price: 18.0,
      category: 'الحلويات',
      imageUrl: '/images/kunafa-cheese.jpg'
    },
    {
      name: 'بقلاوة',
      description: 'بقلاوة تقليدية بالفستق الحلبي',
      price: 20.0,
      category: 'الحلويات',
      imageUrl: '/images/baklava.jpg'
    },
    {
      name: 'أم علي',
      description: 'أم علي الشهيرة مع الكريمة والمكسرات',
      price: 16.0,
      category: 'الحلويات',
      imageUrl: '/images/um-ali.jpg'
    },
    {
      name: 'محلاية',
      description: 'محلاية تقليدية مع القشطة والمكسرات',
      price: 15.0,
      category: 'الحلويات',
      imageUrl: '/images/mahalabia.jpg'
    },
    {
      name: 'رز بحليب',
      description: 'رز بحليب مع القرفة والزبيب',
      price: 14.0,
      category: 'الحلويات',
      imageUrl: '/images/rice-pudding.jpg'
    },

    // المشروبات - Beverages
    {
      name: 'عصير برتقال طازج',
      description: 'عصير برتقال طازج 100%',
      price: 12.0,
      category: 'المشروبات',
      imageUrl: '/images/fresh-orange.jpg'
    },
    {
      name: 'عصير ليمون',
      description: 'عصير ليمون منعش مع النعناع',
      price: 10.0,
      category: 'المشروبات',
      imageUrl: '/images/lemon-juice.jpg'
    },
    {
      name: 'عصير تفاح',
      description: 'عصير تفاح طبيعي',
      price: 10.0,
      category: 'المشروبات',
      imageUrl: '/images/apple-juice.jpg'
    },
    {
      name: 'قهوة عربية',
      description: 'قهوة عربية تقليدية مع الهيل',
      price: 8.0,
      category: 'المشروبات',
      imageUrl: '/images/arabic-coffee.jpg'
    },
    {
      name: 'شاي بالنعناع',
      description: 'شاي أخضر مع النعناع الطازج',
      price: 6.0,
      category: 'المشروبات',
      imageUrl: '/images/mint-tea.jpg'
    },
    {
      name: 'ماء معدني',
      description: 'ماء معدني بارد',
      price: 4.0,
      category: 'المشروبات',
      imageUrl: '/images/mineral-water.jpg'
    }
  ]

  // Insert menu items
  console.log('🍽️ Inserting menu items...')
  for (const item of menuItems) {
    await prisma.menuItem.create({
      data: item
    })
  }

  console.log('✅ Database seeding completed successfully!')
  console.log(`📊 Added ${menuItems.length} menu items`)
  console.log(`📂 Categories: ${[...new Set(menuItems.map(item => item.category))].join(', ')}`)
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })