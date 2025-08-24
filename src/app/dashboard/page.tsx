'use client'

import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { CalendarDays, Utensils, ShoppingCart, User, LogOut, Loader2, Star, Gift } from 'lucide-react'
import NotificationsPanel from '@/components/notifications-panel'
import ReviewForm, { ReviewDisplay } from '@/components/review-form'
import LoyaltyProgram from '@/components/loyalty-program'

export default function Dashboard() {
  const { user, session, loading, signOut } = useAuth()
  const router = useRouter()
  const [reviews, setReviews] = useState<any[]>([])

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin')
    } else if (user) {
      // Redirect based on user role
      if (userRole === 'RESTAURANT') {
        router.push('/restaurant-dashboard')
      } else if (userRole === 'DRIVER') {
        router.push('/driver-dashboard')
      } else if (userRole === 'ADMIN') {
        router.push('/admin-dashboard')
      } else {
        // Customer - stay on dashboard
        fetchUserReviews()
      }
    }
  }, [user, loading, router, userRole])

  const fetchUserReviews = async () => {
    try {
      const response = await fetch('/api/reviews')
      const data = await response.json()
      if (response.ok) {
        setReviews(data.reviews)
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    }
  }

  const handleReviewSubmit = () => {
    fetchUserReviews()
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="relative w-12 h-12">
                <img
                  src="/logo.svg"
                  alt="FoodSyria Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <h1 className="mr-3 text-2xl font-bold text-gray-900">لوحة التحكم</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.user_metadata?.name || user.email}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 ml-2" />
                تسجيل الخروج
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">مرحباً بك، {user.user_metadata?.name || user.email}</h2>
          <p className="text-gray-600">إدارة طلباتك وحجوزاتك بسهولة</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">الطلبات الحالية</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">لا توجد طلبات حالية</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">الحجوزات القادمة</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">لا توجد حجوزات قادمة</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">الطلبات المكتملة</CardTitle>
              <Utensils className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">ابدأ بطلبك الأول</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="orders">طلباتي</TabsTrigger>
            <TabsTrigger value="reservations">حجوزاتي</TabsTrigger>
            <TabsTrigger value="reviews">تقييماتي</TabsTrigger>
            <TabsTrigger value="loyalty">الولاء</TabsTrigger>
            <TabsTrigger value="notifications">الإشعارات</TabsTrigger>
            <TabsTrigger value="profile">ملفي الشخصي</TabsTrigger>
            <TabsTrigger value="settings">الإعدادات</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>طلباتي الحالية</CardTitle>
                <CardDescription>
                  عرض وإدارة طلباتك الحالية والسابقة
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <ShoppingCart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500 mb-4">لا توجد طلبات حالية</p>
                  <Button onClick={() => router.push('/#orders')}>
                    إنشاء طلب جديد
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reservations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>حجوزاتي</CardTitle>
                <CardDescription>
                  عرض وإدارة حجوزاتك القادمة والسابقة
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <CalendarDays className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500 mb-4">لا توجد حجوزات حالية</p>
                  <Button onClick={() => router.push('/#reservations')}>
                    حجز طاولة جديدة
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  تقييماتي
                </CardTitle>
                <CardDescription>
                  عرض وإدارة تقييماتك للطلبات والحجوزات
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">تقييماتي ({reviews.length})</h3>
                    <ReviewForm onSubmit={handleReviewSubmit} />
                  </div>
                  
                  <ReviewDisplay reviews={reviews} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="loyalty" className="space-y-4">
            <LoyaltyProgram />
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>الإشعارات</CardTitle>
                <CardDescription>
                  عرض وإدارة إشعاراتك
                </CardDescription>
              </CardHeader>
              <CardContent>
                <NotificationsPanel />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>الملف الشخصي</CardTitle>
                <CardDescription>
                  عرض وتحديث معلوماتك الشخصية
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                      <User className="h-8 w-8 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{user.user_metadata?.name || user.email}</h3>
                      <p className="text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">الاسم الكامل</label>
                      <p className="text-gray-900">{user.user_metadata?.name || 'غير محدد'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">البريد الإلكتروني</label>
                      <p className="text-gray-900">{user.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">رقم الهاتف</label>
                      <p className="text-gray-900">غير محدد</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">العنوان</label>
                      <p className="text-gray-900">غير محدد</p>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    تحديث الملف الشخصي
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>الإعدادات</CardTitle>
                <CardDescription>
                  إدارة تفضيلات الحساب والإعدادات
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">الإشعارات البريدية</h4>
                      <p className="text-sm text-gray-500">تلقي إشعارات عن حالة الطلبات</p>
                    </div>
                    <Badge variant="secondary">مفعّل</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">الرسائل النصية</h4>
                      <p className="text-sm text-gray-500">تلقي رسائل تأكيد على الهاتف</p>
                    </div>
                    <Badge variant="outline">معطّل</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">اللغة</h4>
                      <p className="text-sm text-gray-500">لغة واجهة المستخدم</p>
                    </div>
                    <Badge variant="secondary">العربية</Badge>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <Button variant="destructive" className="w-full">
                      حذف الحساب
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}