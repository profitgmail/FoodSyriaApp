import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/database'

// Client-side auth
export const createSupabaseClient = () => {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Sign up with email and password
export const signUp = async (email: string, password: string, name: string, role: 'CUSTOMER' | 'RESTAURANT' | 'DRIVER' = 'CUSTOMER') => {
  const supabase = createSupabaseClient()
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        role,
      },
    },
  })

  if (error) {
    throw error
  }

  return data
}

// Sign in with email and password
export const signIn = async (email: string, password: string) => {
  const supabase = createSupabaseClient()
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw error
  }

  return data
}

// Sign out
export const signOut = async () => {
  const supabase = createSupabaseClient()
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    throw error
  }
}

// Get current user
export const getCurrentUser = async () => {
  const supabase = createSupabaseClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error) {
    throw error
  }

  return user
}

// Get current session
export const getCurrentSession = async () => {
  const supabase = createSupabaseClient()
  const { data: { session }, error } = await supabase.auth.getSession()
  
  if (error) {
    throw error
  }

  return session
}

// Check if user is authenticated
export const isAuthenticated = async () => {
  const session = await getCurrentSession()
  return !!session
}

// Get user role from metadata
export const getUserRole = async () => {
  const user = await getCurrentUser()
  return user?.user_metadata?.role || 'CUSTOMER'
}

// Check if user has specific role
export const hasRole = async (role: string) => {
  const userRole = await getUserRole()
  return userRole === role
}

// Check if user is customer
export const isCustomer = async () => {
  return await hasRole('CUSTOMER')
}

// Check if user is restaurant
export const isRestaurant = async () => {
  return await hasRole('RESTAURANT')
}

// Check if user is driver
export const isDriver = async () => {
  return await hasRole('DRIVER')
}

// Check if user is admin
export const isAdmin = async () => {
  return await hasRole('ADMIN')
}

// Update user profile
export const updateProfile = async (updates: {
  name?: string
  phone?: string
  role?: string
}) => {
  const supabase = createSupabaseClient()
  
  const { data, error } = await supabase.auth.updateUser({
    data: updates,
  })

  if (error) {
    throw error
  }

  return data
}

// Reset password
export const resetPassword = async (email: string) => {
  const supabase = createSupabaseClient()
  
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  })

  if (error) {
    throw error
  }
}

// Update password
export const updatePassword = async (newPassword: string) => {
  const supabase = createSupabaseClient()
  
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (error) {
    throw error
  }
}