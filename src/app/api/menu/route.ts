import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const restaurantId = searchParams.get('restaurantId')
    const categoryId = searchParams.get('categoryId')
    const search = searchParams.get('search') || ''
    const availableOnly = searchParams.get('availableOnly') === 'true'

    if (!restaurantId) {
      return NextResponse.json({ error: 'Restaurant ID is required' }, { status: 400 })
    }

    let query = supabase
      .from('menuItems')
      .select(`
        *,
        category (
          id,
          name,
          sortOrder
        ),
        restaurant (
          id,
          name,
          deliveryFee,
          minOrder
        )
      `)
      .eq('restaurantId', restaurantId)
      .order('sortOrder', { ascending: true })
      .order('name', { ascending: true })

    if (categoryId) {
      query = query.eq('categoryId', categoryId)
    }

    if (availableOnly) {
      query = query.eq('available', true)
    }

    if (search) {
      query = query.ilike('name', `%${search}%`)
    }

    const { data: menuItems, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Get categories for this restaurant
    const { data: categories } = await supabase
      .from('categories')
      .select('*')
      .eq('restaurantId', restaurantId)
      .order('sortOrder', { ascending: true })

    // Get restaurant info
    const { data: restaurant } = await supabase
      .from('restaurants')
      .select('*')
      .eq('id', restaurantId)
      .single()

    // Group menu items by category
    const menuByCategory = categories?.map(category => ({
      category,
      items: menuItems?.filter(item => item.categoryId === category.id) || []
    })) || []

    return NextResponse.json({
      menuItems,
      categories,
      menuByCategory,
      restaurant
    })
  } catch (error) {
    console.error('Error fetching menu:', error)
    return NextResponse.json({ error: 'حدث خطأ أثناء جلب القائمة' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      restaurantId,
      categoryId,
      name,
      description,
      price,
      imageUrl,
      available = true,
      isFeatured = false,
      sortOrder = 0
    } = body

    // Validate required fields
    if (!restaurantId || !name || !price) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('menuItems')
      .insert([{
        restaurantId,
        categoryId,
        name,
        description,
        price,
        imageUrl,
        available,
        isFeatured,
        sortOrder
      }])
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ menuItem: data }, { status: 201 })
  } catch (error) {
    console.error('Error creating menu item:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}