'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { 
  Motorbike, 
  MapPin, 
  Clock, 
  CheckCircle, 
  XCircle, 
  LogOut, 
  Settings, 
  Star,
  Wallet,
  Navigation,
  Phone
} from 'lucide-react'
import SEO from '@/components/seo'

interface Order {
  id: string
  status: string
  total: number
  createdAt: string
  restaurant: {
    name: string
    address: string
    phone: string
  }
  customer: {
    name: string
    phone: string
    address: string
  }
  orderItems: Array<{
    quantity: number
    menuItem: {
      name: string
    }
  }>
}

interface DriverStats {
  totalOrders: number
  completedOrders: number
  currentOrders: number
  totalEarnings: number
  rating: number
}

export default function DriverDashboard() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const [driver, setDriver] = useState<any>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [availableOrders, setAvailableOrders] = useState<Order[]>([])
  const [stats, setStats] = useState<DriverStats>({
    totalOrders: 0,
    completedOrders: 0,
    currentOrders: 0,
    totalEarnings: 0,
    rating: 0
  })
  const [isOnline, setIsOnline] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin')
    } else if (user) {
      loadDriverData()
      loadOrders()
      loadAvailableOrders()
    }
  }, [user, loading, router])

  const loadDriverData = async () => {
    try {
      const response = await fetch('/api/driver/profile')
      if (response.ok) {
        const data = await response.json()
        setDriver(data.driver)
        setIsOnline(data.driver.status === 'ONLINE')
      }
    } catch (error) {
      console.error('Error loading driver data:', error)
    }
  }

  const loadOrders = async () => {
    try {
      const response = await fetch('/api/driver/orders')
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders)
        updateStats(data.orders)
      }
    } catch (error) {
      console.error('Error loading orders:', error)
    }
  }

  const loadAvailableOrders = async () => {
    try {
      const response = await fetch('/api/driver/orders/available')
      if (response.ok) {
        const data = await response.json()
        setAvailableOrders(data.orders)
      }
    } catch (error) {
      console.error('Error loading available orders:', error)
    }
  }

  const updateStats = (orders: Order[]) => {
    const totalOrders = orders.length
    const completedOrders = orders.filter(order => order.status === 'DELIVERED').length
    const currentOrders = orders.filter(order => 
      ['PICKED_UP', 'EN_ROUTE'].includes(order.status)
    ).length
    const totalEarnings = orders
      .filter(order => order.status === 'DELIVERED')
      .reduce((sum, order) => sum + (order.total * 0.15), 0) // 15% commission
    
    setStats({
      totalOrders,
      completedOrders,
      currentOrders,
      totalEarnings,
      rating: driver?.ratingAvg || 0
    })
  }

  const acceptOrder = async (orderId: string) => {
    try {
      const response = await fetch(`/api/driver/orders/${orderId}/accept`, {
        method: 'POST',
      })

      if (response.ok) {
        loadOrders()
        loadAvailableOrders()
      }
    } catch (error) {
      console.error('Error accepting order:', error)
    }
  }

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const response = await fetch(`/api/driver/orders/${orderId}/status`, {
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

  const toggleOnlineStatus = async (online: boolean) => {
    try {
      const response = await fetch('/api/driver/status', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: online ? 'ONLINE' : 'OFFLINE' }),
      })

      if (response.ok) {
        setIsOnline(online)
        loadDriverData()
      }
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'READY_FOR_PICKUP':
        return 'bg-purple-100 text-purple-800'
      case 'PICKED_UP':
        return 'bg-blue-100 text-blue-800'
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

  if (!user || !driver) {
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
                  <h1 className="text-2xl font-bold text-gray-900">لوحة تحكم السائق</h1>
                  <div className="flex items-center gap-2">
                    <Badge variant={isOnline ? "default" : "secondary"}>
                      {isOnline ? 'متصل' : 'غير متصل'}
                    </Badge>
                    <span className="text-sm text-gray-600">{driver.vehicleType}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="online-status">متاح للعمل</Label>
                  <Switch
                    id="online-status"
                    checked={isOnline}
                    onCheckedChange={toggleOnlineStatus}
                  />
                </div>
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
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">إجمالي الطلبات</CardTitle>
                <Motorbike className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalOrders}</div>
                <p className="text-xs text-muted-foreground">طلب</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">طلبات مكتملة</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.completedOrders}</div>
                <p className="text-xs text-muted-foreground">مكتمل</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">طلبات حالية</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.currentOrders}</div>
                <p className="text-xs text-muted-foreground">قيد التنفيذ</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">إجمالي الأرباح</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalEarnings.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">ل.س</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">التقييم</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.rating.toFixed(1)}</div>
                <p className="text-xs text-muted-foreground">من 5</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Tabs */}
          <Tabs defaultValue="current" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="current">طلباتي الحالية</TabsTrigger>
              <TabsTrigger value="available">طلبات متاحة</TabsTrigger>
              <TabsTrigger value="settings">الإعدادات</TabsTrigger>
            </TabsList>

            <TabsContent value="current" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>طلباتي الحالية</CardTitle>
                  <CardDescription>
                    عرض وإدارة الطلبات الموكلة إليك
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orders.length === 0 ? (
                      <div className="text-center py-8">
                        <Motorbike className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-500">لا توجد طلبات حالية</p>
                        <p className="text-sm text-gray-400 mt-2">
                          {isOnline ? 'سيتم إعلامك عند وجود طلبات جديدة' : 'قم بالاتصال لتلقي الطلبات'}
                        </p>
                      </div>
                    ) : (
                      orders.map((order) => (
                        <Card key={order.id} className="border-l-4 border-l-blue-500">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge className={getStatusColor(order.status)}>
                                    {getStatusText(order.status)}
                                  </Badge>
                                  <span className="text-sm text-gray-600">
                                    {new Date(order.createdAt).toLocaleString('ar-SA')}
                                  </span>
                                </div>
                                <p className="text-lg font-semibold">{order.total.toFixed(2)} ل.س</p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <h4 className="font-medium mb-2 flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  المطعم
                                </h4>
                                <p className="text-sm font-medium">{order.restaurant.name}</p>
                                <p className="text-xs text-gray-600">{order.restaurant.address}</p>
                                <p className="text-xs text-gray-600">{order.restaurant.phone}</p>
                              </div>
                              <div>
                                <h4 className="font-medium mb-2 flex items-center gap-1">
                                  <Navigation className="h-4 w-4" />
                                  العميل
                                </h4>
                                <p className="text-sm font-medium">{order.customer.name}</p>
                                <p className="text-xs text-gray-600">{order.customer.address}</p>
                                <p className="text-xs text-gray-600">{order.customer.phone}</p>
                              </div>
                            </div>
                            
                            <div className="mb-4">
                              <h4 className="font-medium mb-2">عناصر الطلب:</h4>
                              <div className="space-y-1">
                                {order.orderItems.map((item, index) => (
                                  <div key={index} className="flex justify-between text-sm">
                                    <span>{item.quantity}x {item.menuItem.name}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div className="flex gap-2">
                              {order.status === 'READY_FOR_PICKUP' && (
                                <Button
                                  size="sm"
                                  onClick={() => updateOrderStatus(order.id, 'PICKED_UP')}
                                  className="bg-blue-600 hover:bg-blue-700"
                                >
                                  استلام الطلب
                                </Button>
                              )}
                              {order.status === 'PICKED_UP' && (
                                <Button
                                  size="sm"
                                  onClick={() => updateOrderStatus(order.id, 'EN_ROUTE')}
                                  className="bg-indigo-600 hover:bg-indigo-700"
                                >
                                  بدء التوصيل
                                </Button>
                              )}
                              {order.status === 'EN_ROUTE' && (
                                <Button
                                  size="sm"
                                  onClick={() => updateOrderStatus(order.id, 'DELIVERED')}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  تم التسليم
                                </Button>
                              )}
                              <Button size="sm" variant="outline">
                                <Phone className="h-4 w-4 ml-2" />
                                اتصل بالعميل
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="available" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>طلبات متاحة</CardTitle>
                  <CardDescription>
                    الطلبات المتاحة للتوصيل في منطقتك
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {!isOnline ? (
                      <div className="text-center py-8">
                        <XCircle className="h-12 w-12 mx-auto text-red-400 mb-4" />
                        <p className="text-gray-500">أنت غير متصل حالياً</p>
                        <p className="text-sm text-gray-400 mt-2">
                          قم بالاتصال لعرض الطلبات المتاحة
                        </p>
                      </div>
                    ) : availableOrders.length === 0 ? (
                      <div className="text-center py-8">
                        <Clock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-500">لا توجد طلبات متاحة حالياً</p>
                        <p className="text-sm text-gray-400 mt-2">
                          سيتم إعلامك عند وجود طلبات جديدة
                        </p>
                      </div>
                    ) : (
                      availableOrders.map((order) => (
                        <Card key={order.id} className="border-l-4 border-l-green-500">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge className="bg-green-100 text-green-800">
                                    متاح
                                  </Badge>
                                  <span className="text-sm text-gray-600">
                                    {new Date(order.createdAt).toLocaleString('ar-SA')}
                                  </span>
                                </div>
                                <p className="text-lg font-semibold">{order.total.toFixed(2)} ل.س</p>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => acceptOrder(order.id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                قبول الطلب
                              </Button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <h4 className="font-medium mb-2 flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  المطعم
                                </h4>
                                <p className="text-sm font-medium">{order.restaurant.name}</p>
                                <p className="text-xs text-gray-600">{order.restaurant.address}</p>
                              </div>
                              <div>
                                <h4 className="font-medium mb-2 flex items-center gap-1">
                                  <Navigation className="h-4 w-4" />
                                  العميل
                                </h4>
                                <p className="text-sm font-medium">{order.customer.name}</p>
                                <p className="text-xs text-gray-600">{order.customer.address}</p>
                              </div>
                            </div>
                            
                            <div className="mb-4">
                              <h4 className="font-medium mb-2">عناصر الطلب:</h4>
                              <div className="space-y-1">
                                {order.orderItems.map((item, index) => (
                                  <div key={index} className="flex justify-between text-sm">
                                    <span>{item.quantity}x {item.menuItem.name}</span>
                                  </div>
                                ))}
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
                  <CardTitle>إعدادات السائق</CardTitle>
                  <CardDescription>
                    تحديث معلوماتك وإعدادات الحساب
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="vehicleType">نوع المركبة</Label>
                        <Input
                          id="vehicleType"
                          value={driver.vehicleType}
                          disabled
                        />
                      </div>
                      <div>
                        <Label htmlFor="licenseNumber">رقم الرخصة</Label>
                        <Input
                          id="licenseNumber"
                          value={driver.licenseNumber}
                          disabled
                        />
                      </div>
                      <div>
                        <Label htmlFor="vehiclePlate">رقم اللوحة</Label>
                        <Input
                          id="vehiclePlate"
                          value={driver.vehiclePlate}
                          disabled
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">رقم الهاتف</Label>
                        <Input
                          id="phone"
                          value={user?.phone || ''}
                          placeholder="أدخل رقم الهاتف"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium">حالة التحقق</h4>
                        <p className="text-sm text-gray-600">
                          {driver.verified ? 'تم التحقق من حسابك' : 'قيد مراجعة حسابك'}
                        </p>
                      </div>
                      <Badge variant={driver.verified ? "default" : "secondary"}>
                        {driver.verified ? 'متحقق' : 'قيد المراجعة'}
                      </Badge>
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