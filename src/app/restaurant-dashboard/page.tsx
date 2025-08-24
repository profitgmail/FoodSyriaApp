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
import { 
  Utensils, 
  ShoppingCart, 
  Users, 
  Star, 
  LogOut, 
  Settings, 
  Plus, 
  Edit, 
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'
import SEO from '@/components/seo'

interface Order {
  id: string
  status: string
  paymentStatus: string
  total: number
  createdAt: string
  customer: {
    name: string
    phone: string
  }
  orderItems: Array<{
    quantity: number
    price: number
    menuItem: {
      name: string
    }
  }>
}

interface MenuItem {
  id: string
  name: string
  price: number
  available: boolean
  category?: {
    name: string
  }
}

export default function RestaurantDashboard() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const [restaurant, setRestaurant] = useState<any>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin')
    } else if (user) {
      loadRestaurantData()
      loadOrders()
      loadMenuItems()
    }
  }, [user, loading, router])

  const loadRestaurantData = async () => {
    try {
      const response = await fetch('/api/restaurant/profile')
      if (response.ok) {
        const data = await response.json()
        setRestaurant(data.restaurant)
      }
    } catch (error) {
      console.error('Error loading restaurant data:', error)
    }
  }

  const loadOrders = async () => {
    try {
      const response = await fetch('/api/restaurant/orders')
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders)
        
        // Calculate stats
        const totalOrders = data.orders.length
        const pendingOrders = data.orders.filter((order: Order) => 
          ['CREATED', 'CONFIRMED', 'PREPARING'].includes(order.status)
        ).length
        const completedOrders = data.orders.filter((order: Order) => 
          order.status === 'DELIVERED'
        ).length
        const totalRevenue = data.orders
          .filter((order: Order) => order.status === 'DELIVERED')
          .reduce((sum: number, order: Order) => sum + order.total, 0)
        
        setStats({ totalOrders, pendingOrders, completedOrders, totalRevenue })
      }
    } catch (error) {
      console.error('Error loading orders:', error)
    }
  }

  const loadMenuItems = async () => {
    try {
      const response = await fetch('/api/restaurant/menu')
      if (response.ok) {
        const data = await response.json()
        setMenuItems(data.menuItems)
      }
    } catch (error) {
      console.error('Error loading menu items:', error)
    }
  }

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const response = await fetch(`/api/restaurant/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        loadOrders()
      }
    } catch (error) {
      console.error('Error updating order status:', error)
    }
  }

  const toggleMenuItemAvailability = async (itemId: string, available: boolean) => {
    try {
      const response = await fetch(`/api/restaurant/menu/${itemId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ available }),
      })

      if (response.ok) {
        loadMenuItems()
      }
    } catch (error) {
      console.error('Error updating menu item:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CREATED':
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'CONFIRMED':
      case 'PREPARING':
        return 'bg-blue-100 text-blue-800'
      case 'READY_FOR_PICKUP':
        return 'bg-purple-100 text-purple-800'
      case 'PICKED_UP':
      case 'EN_ROUTE':
        return 'bg-indigo-100 text-indigo-800'
      case 'DELIVERED':
        return 'bg-green-100 text-green-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'CREATED': return 'جديد'
      case 'CONFIRMED': return 'مؤكد'
      case 'PREPARING': return 'قيد التحضير'
      case 'READY_FOR_PICKUP': return 'جاهز للاستلام'
      case 'PICKED_UP': return 'تم الاستلام'
      case 'EN_ROUTE': return 'في الطريق'
      case 'DELIVERED': return 'تم التسليم'
      case 'CANCELLED': return 'ملغي'
      default: return status
    }
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
          <div className="w-8 h-8 border-2 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  if (!user || !restaurant) {
    return null
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
                <div className="mr-3">
                  <h1 className="text-2xl font-bold text-gray-900">لوحة تحكم المطعم</h1>
                  <p className="text-sm text-gray-600">{restaurant.name}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="outline" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 ml-2" />
                  خروج
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">إجمالي الطلبات</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalOrders}</div>
                <p className="text-xs text-muted-foreground">طلبات</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">طلبات قيد التنفيذ</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingOrders}</div>
                <p className="text-xs text-muted-foreground">قيد المعالجة</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">طلبات مكتملة</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.completedOrders}</div>
                <p className="text-xs text-muted-foreground">تم التسليم</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">إجمالي الإيرادات</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalRevenue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">ل.س</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Tabs */}
          <Tabs defaultValue="orders" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="orders">الطلبات</TabsTrigger>
              <TabsTrigger value="menu">القائمة</TabsTrigger>
              <TabsTrigger value="settings">الإعدادات</TabsTrigger>
            </TabsList>

            <TabsContent value="orders" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>الطلبات الواردة</CardTitle>
                  <CardDescription>
                    عرض وإدارة طلبات المطعم
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orders.length === 0 ? (
                      <div className="text-center py-8">
                        <ShoppingCart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-500">لا توجد طلبات حالية</p>
                      </div>
                    ) : (
                      orders.map((order) => (
                        <Card key={order.id} className="border-l-4 border-l-orange-500">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge className={getStatusColor(order.status)}>
                                    {getStatusText(order.status)}
                                  </Badge>
                                  <Badge variant="outline">
                                    {order.paymentStatus === 'SUCCESS' ? 'مدفوع' : 'غير مدفوع'}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600">
                                  العميل: {order.customer.name} - {order.customer.phone}
                                </p>
                                <p className="text-sm text-gray-600">
                                  التاريخ: {new Date(order.createdAt).toLocaleString('ar-SA')}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-semibold">{order.total.toFixed(2)} ل.س</p>
                                <p className="text-sm text-gray-600">
                                  {order.orderItems.length} أصناف
                                </p>
                              </div>
                            </div>
                            
                            <div className="mb-4">
                              <h4 className="font-medium mb-2">عناصر الطلب:</h4>
                              <div className="space-y-1">
                                {order.orderItems.map((item, index) => (
                                  <div key={index} className="flex justify-between text-sm">
                                    <span>{item.quantity}x {item.menuItem.name}</span>
                                    <span>{(item.price * item.quantity).toFixed(2)} ل.س</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div className="flex gap-2">
                              {order.status === 'CREATED' && (
                                <Button
                                  size="sm"
                                  onClick={() => updateOrderStatus(order.id, 'CONFIRMED')}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  تأكيد الطلب
                                </Button>
                              )}
                              {order.status === 'CONFIRMED' && (
                                <Button
                                  size="sm"
                                  onClick={() => updateOrderStatus(order.id, 'PREPARING')}
                                  className="bg-blue-600 hover:bg-blue-700"
                                >
                                  بدء التحضير
                                </Button>
                              )}
                              {order.status === 'PREPARING' && (
                                <Button
                                  size="sm"
                                  onClick={() => updateOrderStatus(order.id, 'READY_FOR_PICKUP')}
                                  className="bg-purple-600 hover:bg-purple-700"
                                >
                                  جاهز للاستلام
                                </Button>
                              )}
                              {order.status === 'READY_FOR_PICKUP' && (
                                <Button
                                  size="sm"
                                  onClick={() => updateOrderStatus(order.id, 'PICKED_UP')}
                                  className="bg-indigo-600 hover:bg-indigo-700"
                                >
                                  تم الاستلام
                                </Button>
                              )}
                              {['CREATED', 'CONFIRMED'].includes(order.status) && (
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => updateOrderStatus(order.id, 'CANCELLED')}
                                >
                                  إلغاء الطلب
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="menu" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>القائمة</CardTitle>
                      <CardDescription>
                        إدارة قائمة الطعام والمأكولات
                      </CardDescription>
                    </div>
                    <Button>
                      <Plus className="h-4 w-4 ml-2" />
                      إضافة صنف جديد
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {menuItems.length === 0 ? (
                      <div className="text-center py-8">
                        <Utensils className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-500">لا توجد أصناف في القائمة</p>
                        <Button className="mt-4">
                          <Plus className="h-4 w-4 ml-2" />
                          إضافة صنف جديد
                        </Button>
                      </div>
                    ) : (
                      menuItems.map((item) => (
                        <Card key={item.id}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h4 className="font-medium">{item.name}</h4>
                                  <Badge variant={item.available ? "default" : "secondary"}>
                                    {item.available ? 'متوفر' : 'غير متوفر'}
                                  </Badge>
                                  {item.category && (
                                    <Badge variant="outline">
                                      {item.category.name}
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-lg font-semibold text-orange-600">
                                  {item.price.toFixed(2)} ل.س
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => toggleMenuItemAvailability(item.id, !item.available)}
                                >
                                  {item.available ? 'إخفاء' : 'إظهار'}
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="destructive">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>إعدادات المطعم</CardTitle>
                  <CardDescription>
                    تحديث معلومات المطعم والإعدادات
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="name">اسم المطعم</Label>
                        <Input
                          id="name"
                          value={restaurant.name}
                          onChange={(e) => setRestaurant({...restaurant, name: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">رقم الهاتف</Label>
                        <Input
                          id="phone"
                          value={restaurant.phone}
                          onChange={(e) => setRestaurant({...restaurant, phone: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">البريد الإلكتروني</Label>
                        <Input
                          id="email"
                          type="email"
                          value={restaurant.email || ''}
                          onChange={(e) => setRestaurant({...restaurant, email: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="deliveryFee">رسوم التوصيل (ل.س)</Label>
                        <Input
                          id="deliveryFee"
                          type="number"
                          value={restaurant.deliveryFee}
                          onChange={(e) => setRestaurant({...restaurant, deliveryFee: parseFloat(e.target.value) || 0})}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="address">العنوان</Label>
                      <Textarea
                        id="address"
                        value={restaurant.address}
                        onChange={(e) => setRestaurant({...restaurant, address: e.target.value})}
                        rows={3}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="description">الوصف</Label>
                      <Textarea
                        id="description"
                        value={restaurant.description || ''}
                        onChange={(e) => setRestaurant({...restaurant, description: e.target.value})}
                        rows={4}
                      />
                    </div>
                    
                    <div className="flex gap-4">
                      <Button className="bg-orange-600 hover:bg-orange-700">
                        حفظ التغييرات
                      </Button>
                      <Button variant="outline">
                        إلغاء
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </>
  )
}