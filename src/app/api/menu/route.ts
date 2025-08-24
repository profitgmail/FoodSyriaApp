import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    const where = category && category !== 'الكل' ? { category } : {}

    const menuItems = await db.menuItem.findMany({
      where,
      orderBy: { name: 'asc' }
    })

    // Get unique categories
    const categories = await db.menuItem.findMany({
      select: { category: true },
      distinct: ['category']
    })

    const categoryList = categories.map(item => item.category)

    return NextResponse.json({
      menuItems,
      categories: categoryList
    })
  } catch (error) {
    console.error('Error fetching menu:', error)
    return NextResponse.json({ error: 'حدث خطأ أثناء جلب القائمة' }, { status: 500 })
  }
}