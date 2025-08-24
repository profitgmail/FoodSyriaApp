import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// GET all restaurants
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || 'ACTIVE'

    const offset = (page - 1) * limit

    let query = supabase
      .from('restaurants')
      .select(`
        *,
        user!restaurants_userId_fkey (
          id,
          email,
          name
        ),
        categories (
          id,
          name,
          sortOrder
        ),
        menuItems (
          id,
          name,
          price,
          available,
          isFeatured,
          category (
            name
          )
        ),
        ratingsFor (
          score,
          comment,
          byUser: user!ratings_byUserId_fkey (
            name
          )
        )
      `)
      .eq('status', status)
      .order('ratingAvg', { ascending: false })
      .range(offset, offset + limit - 1)

    if (search) {
      query = query.ilike('name', `%${search}%`)
    }

    const { data, error, count } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Calculate average rating for each restaurant
    const restaurantsWithStats = data?.map(restaurant => {
      const ratings = restaurant.ratingsFor || []
      const avgRating = ratings.length > 0 
        ? ratings.reduce((sum, rating) => sum + rating.score, 0) / ratings.length 
        : 0
      
      return {
        ...restaurant,
        avgRating,
        totalRatings: ratings.length,
        totalMenuItems: restaurant.menuItems?.length || 0,
        availableMenuItems: restaurant.menuItems?.filter(item => item.available).length || 0
      }
    })

    return NextResponse.json({
      restaurants: restaurantsWithStats,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching restaurants:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST create new restaurant
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      description,
      phone,
      email,
      address,
      latitude,
      longitude,
      deliveryFee,
      minOrder,
      userId
    } = body

    // Validate required fields
    if (!name || !phone || !address || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('restaurants')
      .insert([{
        name,
        description,
        phone,
        email,
        address,
        latitude,
        longitude,
        deliveryFee: deliveryFee || 0,
        minOrder: minOrder || 0,
        userId,
        status: 'ACTIVE'
      }])
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ restaurant: data }, { status: 201 })
  } catch (error) {
    console.error('Error creating restaurant:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}