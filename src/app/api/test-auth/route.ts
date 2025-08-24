import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    console.log('Test auth endpoint called with:', email)
    
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }
    
    // Find user
    const user = await db.user.findUnique({
      where: { email }
    })
    
    console.log('User found:', user ? 'Yes' : 'No')
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password || "")
    console.log('Password valid:', isPasswordValid)
    
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }
    
    // Return success
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    })
    
  } catch (error) {
    console.error('Test auth error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}