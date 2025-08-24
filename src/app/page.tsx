'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'
import { CalendarIcon, Clock, Phone, MapPin, Star, User, LogOut, Bell, ShoppingCart, Search, Utensils, Motorbike } from 'lucide-react'
import NotificationsPanel from '@/components/notifications-panel'
import CartDrawer, { useCart } from '@/components/cart-drawer-new'
import SEO from '@/components/seo'
import MenuItemCard from '@/components/menu-item-card'
import dynamic from 'next/dynamic'

// Lazy load heavy components
const LazyCalendar = dynamic(() => import('@/components/ui/calendar').then(mod => ({ default: mod.Calendar })), {
  loading: () => <div className="h-64 bg-gray-200 animate-pulse rounded-md" />,
  ssr: false
})

export default function Home() {
  const { user, loading, signOut, userRole } = useAuth()
  const router = useRouter()
  const { addToCart } = useCart()
  const [date, setDate] = useState<Date>()
  const [restaurants, setRestaurants] = useState<any[]>([])
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(null)
  const [menuItemsData, setMenuItemsData] = useState<any[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState('الكل')
  const [menuLoading, setMenuLoading] = useState(true)
  const [restaurantsLoading, setRestaurantsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  
  const [reservationData, setReservationData] = useState({
    name: '',
    email: '',
    phone: '',
    partySize: '',
    time: '',
    notes: ''
  })

  const [orderData, setOrderData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: ''
  })

  // Fetch restaurants data
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch('/api/restaurants')
        const data = await response.json()
        setRestaurants(data.restaurants || [])
        if (data.restaurants && data.restaurants.length > 0) {
          setSelectedRestaurant(data.restaurants[0].id)
        }
        setRestaurantsLoading(false)
      } catch (error) {
        console.error('Error fetching restaurants:', error)
        setRestaurantsLoading(false)
      }
    }

    fetchRestaurants()
  }, [])

  // Fetch menu data when restaurant is selected
  useEffect(() => {
    const fetchMenuData = async () => {
      if (!selectedRestaurant) return
      
      try {
        setMenuLoading(true)
        const response = await fetch(`/api/menu?restaurantId=${selectedRestaurant}`)
        const data = await response.json()
        setMenuItemsData(data.menuItems || [])
        
        // Extract unique categories
        const uniqueCategories = [...new Set(data.menuItems?.map((item: any) => item.category?.name).filter(Boolean) || [])]
        setCategories(['الكل', ...uniqueCategories])
        setMenuLoading(false)
      } catch (error) {
        console.error('Error fetching menu:', error)
        setMenuLoading(false)
      }
    }

    fetchMenuData()
  }, [selectedRestaurant])

  const filteredRestaurants = restaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredItems = selectedCategory === 'الكل' 
    ? menuItemsData 
    : menuItemsData.filter(item => item.category?.name === selectedCategory)

  const handleReservationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!date) {
      alert('الرجاء اختيار التاريخ')
      return
    }

    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: date.toISOString(),
          time: reservationData.time,
          partySize: reservationData.partySize,
          phone: reservationData.phone,
          notes: reservationData.notes
        }),
      })

      const data = await response.json()

      if (response.ok) {
        alert('تم إرسال طلب الحجز بنجاح! سنتواصل معك قريباً.')
        // Reset form
        setReservationData({
          name: '',
          email: '',
          phone: '',
          partySize: '',
          time: '',
          notes: ''
        })
        setDate(undefined)
      } else {
        alert(data.error || 'حدث خطأ أثناء إرسال الحجز')
      }
    } catch (error) {
      alert('حدث خطأ أثناء إرسال الحجز')
    }
  }

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [], // TODO: Add cart functionality
          address: orderData.address,
          phone: orderData.phone,
          notes: orderData.notes
        }),
      })

      const data = await response.json()

      if (response.ok) {
        alert('تم إرسال الطلب بنجاح! سنتواصل معك قريباً.')
        // Reset form
        setOrderData({
          name: '',
          email: '',
          phone: '',
          address: '',
          notes: ''
        })
      } else {
        alert(data.error || 'حدث خطأ أثناء إرسال الطلب')
      }
    } catch (error) {
      alert('حدث خطأ أثناء إرسال الطلب')
    }
  }

  return (
    <>
      <SEO />
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
              <h1 className="mr-3 text-2xl font-bold text-gray-900">مطعم سوريا</h1>
            </div>
            <div className="flex items-center space-x-4">
              <nav className="hidden md:flex space-x-8">
                <a href="#restaurants" className="text-gray-700 hover:text-orange-600">المطاعم</a>
                <a href="#menu" className="text-gray-700 hover:text-orange-600">القائمة</a>
                <a href="#reservations" className="text-gray-700 hover:text-orange-600">الحجز</a>
                <a href="#orders" className="text-gray-700 hover:text-orange-600">الطلب</a>
                <a href="#contact" className="text-gray-700 hover:text-orange-600">اتصل بنا</a>
              </nav>
              {loading ? (
                <div className="w-8 h-8 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
              ) : user ? (
                <div className="flex items-center space-x-3">
                  <CartDrawer>
                    <Button variant="outline" size="sm" className="relative">
                      <ShoppingCart className="h-4 w-4 ml-2" />
                      سلة التسوق
                    </Button>
                  </CartDrawer>
                  <NotificationsPanel />
                  <div className="hidden md:block text-right">
                    <p className="text-sm font-medium text-gray-900">{user.user_metadata?.name || user.email}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (userRole === 'RESTAURANT') {
                        router.push('/restaurant-dashboard')
                      } else if (userRole === 'DRIVER') {
                        router.push('/driver-dashboard')
                      } else if (userRole === 'ADMIN') {
                        router.push('/admin-dashboard')
                      } else {
                        router.push('/dashboard')
                      }
                    }}
                  >
                    <User className="h-4 w-4 ml-2" />
                    لوحة التحكم
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => signOut()}
                  >
                    <LogOut className="h-4 w-4 ml-2" />
                    خروج
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <CartDrawer>
                    <Button variant="outline" size="sm" className="relative">
                      <ShoppingCart className="h-4 w-4 ml-2" />
                      سلة التسوق
                    </Button>
                  </CartDrawer>
                  <NotificationsPanel />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push('/auth/signin')}
                  >
                    <User className="h-4 w-4 ml-2" />
                    تسجيل الدخول
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => router.push('/auth/signup')}
                  >
                    إنشاء حساب
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            أطيب الأطباق السورية التقليدية
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            اكتشف أفضل المطاعم السورية واطلب أطباقك المفضلة من منصتنا المتعددة المطاعم
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-orange-600 hover:bg-orange-700" onClick={() => document.getElementById('restaurants')?.scrollIntoView({ behavior: 'smooth' })}>
              استكشف المطاعم
            </Button>
            <Button size="lg" variant="outline" onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}>
              اطلب طلبك
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Restaurants Section */}
        <section id="restaurants" className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">المطاعم المتاحة</h2>
            <p className="text-gray-600 mb-6">اختر من بين أفضل المطاعم السورية</p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto mb-6">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="ابحث عن مطعم..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>
          </div>

          {restaurantsLoading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-2 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">جاري تحميل المطاعم...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRestaurants.map((restaurant) => (
                <Card 
                  key={restaurant.id} 
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedRestaurant === restaurant.id ? 'ring-2 ring-orange-500' : ''
                  }`}
                  onClick={() => setSelectedRestaurant(restaurant.id)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{restaurant.name}</CardTitle>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{restaurant.avgRating?.toFixed(1) || '0.0'}</span>
                      </div>
                    </div>
                    <CardDescription className="text-sm">
                      {restaurant.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 ml-2" />
                        {restaurant.address}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 ml-2" />
                        {restaurant.phone}
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">رسوم التوصيل:</span>
                        <span className="font-medium">{restaurant.deliveryFee} ل.س</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">الحد الأدنى للطلب:</span>
                        <span className="font-medium">{restaurant.minOrder} ل.س</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">الأصناف المتاحة:</span>
                        <span className="font-medium">{restaurant.availableMenuItems || 0}</span>
                      </div>
                    </div>
                    <Button 
                      className="w-full mt-4" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedRestaurant(restaurant.id)
                        document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })
                      }}
                    >
                      عرض القائمة
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        <Tabs defaultValue="menu" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="menu">القائمة</TabsTrigger>
            <TabsTrigger value="reservations">الحجز</TabsTrigger>
            <TabsTrigger value="orders">الطلب</TabsTrigger>
          </TabsList>

          {/* Menu Tab */}
          <TabsContent value="menu" id="menu">
            <div className="mb-8">
              {!selectedRestaurant ? (
                <div className="text-center py-12">
                  <Utensils className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500 mb-4">الرجاء اختيار مطعم أولاً</p>
                  <Button onClick={() => document.getElementById('restaurants')?.scrollIntoView({ behavior: 'smooth' })}>
                    اختيار مطعم
                  </Button>
                </div>
              ) : (
                <>
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold mb-2">قائمة الطعام</h2>
                    <p className="text-gray-600">
                      {restaurants.find(r => r.id === selectedRestaurant)?.name || 'المطعم المحدد'}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap justify-center gap-2 mb-8">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        onClick={() => setSelectedCategory(category)}
                        className="mb-2"
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                  
                  {menuLoading ? (
                    <div className="text-center py-12">
                      <div className="w-8 h-8 border-2 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-gray-600">جاري تحميل القائمة...</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredItems.map((item) => (
                        <MenuItemCard
                          key={item.id}
                          item={item}
                          onAddToCart={addToCart}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </TabsContent>

          {/* Reservations Tab */}
          <TabsContent value="reservations" id="reservations">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8">احجز طاولة</h2>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    معلومات الحجز
                  </CardTitle>
                  <CardDescription>
                    املأ النموذج أدناه لحجز طاولة في مطعمنا
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleReservationSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">الاسم الكامل</Label>
                        <Input
                          id="name"
                          value={reservationData.name}
                          onChange={(e) => setReservationData({...reservationData, name: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">البريد الإلكتروني</Label>
                        <Input
                          id="email"
                          type="email"
                          value={reservationData.email}
                          onChange={(e) => setReservationData({...reservationData, email: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">رقم الهاتف</Label>
                        <Input
                          id="phone"
                          value={reservationData.phone}
                          onChange={(e) => setReservationData({...reservationData, phone: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="partySize">عدد الأشخاص</Label>
                        <Select value={reservationData.partySize} onValueChange={(value) => setReservationData({...reservationData, partySize: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر عدد الأشخاص" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">شخص واحد</SelectItem>
                            <SelectItem value="2">شخصان</SelectItem>
                            <SelectItem value="3">3 أشخاص</SelectItem>
                            <SelectItem value="4">4 أشخاص</SelectItem>
                            <SelectItem value="5">5 أشخاص</SelectItem>
                            <SelectItem value="6">6 أشخاص</SelectItem>
                            <SelectItem value="7+">7+ أشخاص</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>التاريخ</Label>
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          className="rounded-md border"
                        />
                      </div>
                      <div>
                        <Label htmlFor="time">الوقت</Label>
                        <Select value={reservationData.time} onValueChange={(value) => setReservationData({...reservationData, time: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر الوقت" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="12:00">12:00 ظهراً</SelectItem>
                            <SelectItem value="13:00">1:00 ظهراً</SelectItem>
                            <SelectItem value="14:00">2:00 ظهراً</SelectItem>
                            <SelectItem value="15:00">3:00 ظهراً</SelectItem>
                            <SelectItem value="18:00">6:00 مساءً</SelectItem>
                            <SelectItem value="19:00">7:00 مساءً</SelectItem>
                            <SelectItem value="20:00">8:00 مساءً</SelectItem>
                            <SelectItem value="21:00">9:00 مساءً</SelectItem>
                            <SelectItem value="22:00">10:00 مساءً</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="notes">ملاحظات إضافية</Label>
                      <Textarea
                        id="notes"
                        value={reservationData.notes}
                        onChange={(e) => setReservationData({...reservationData, notes: e.target.value})}
                        placeholder="أي طلبات خاصة أو ملاحظات..."
                      />
                    </div>

                    <Button type="submit" className="w-full" size="lg">
                      تأكيد الحجز
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" id="orders">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8">اطلب طعامك</h2>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    معلومات الطلب
                  </CardTitle>
                  <CardDescription>
                    املأ النموذج أدناه لطلب الطعام للتوصيل
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleOrderSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="orderName">الاسم الكامل</Label>
                        <Input
                          id="orderName"
                          value={orderData.name}
                          onChange={(e) => setOrderData({...orderData, name: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="orderEmail">البريد الإلكتروني</Label>
                        <Input
                          id="orderEmail"
                          type="email"
                          value={orderData.email}
                          onChange={(e) => setOrderData({...orderData, email: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="orderPhone">رقم الهاتف</Label>
                      <Input
                        id="orderPhone"
                        value={orderData.phone}
                        onChange={(e) => setOrderData({...orderData, phone: e.target.value})}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="address">عنوان التوصيل</Label>
                      <Textarea
                        id="address"
                        value={orderData.address}
                        onChange={(e) => setOrderData({...orderData, address: e.target.value})}
                        placeholder="أدخل عنوان التوصيل الكامل..."
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="orderNotes">ملاحظات الطلب</Label>
                      <Textarea
                        id="orderNotes"
                        value={orderData.notes}
                        onChange={(e) => setOrderData({...orderData, notes: e.target.value})}
                        placeholder="اكتب طلبك هنا مع أي ملاحظات خاصة..."
                      />
                    </div>

                    <Button type="submit" className="w-full" size="lg">
                      إرسال الطلب
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Contact Section */}
      <section id="contact" className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">معلومات التواصل</h2>
            <p className="text-lg text-gray-600">نحن هنا لخدمتك على مدار الساعة</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="pt-6">
                <Phone className="h-12 w-12 mx-auto mb-4 text-orange-600" />
                <h3 className="text-lg font-semibold mb-2">الهاتف</h3>
                <p className="text-gray-600">+966 12 345 6789</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <MapPin className="h-12 w-12 mx-auto mb-4 text-orange-600" />
                <h3 className="text-lg font-semibold mb-2">العنوان</h3>
                <p className="text-gray-600">شارع الملك فهد، الرياض</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <Clock className="h-12 w-12 mx-auto mb-4 text-orange-600" />
                <h3 className="text-lg font-semibold mb-2">ساعات العمل</h3>
                <p className="text-gray-600">يومياً من 12 ظهراً حتى 11 مساءً</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="relative w-8 h-8">
                <img
                  src="/logo.svg"
                  alt="FoodSyria Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="ml-2 text-xl font-bold">مطعم سوريا</span>
            </div>
            <p className="text-gray-400">© 2024 مطعم سوريا. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
      </div>
    </>
  )
}