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
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Users, 
  Store, 
  Motorbike, 
  ShoppingCart, 
  LogOut, 
  Settings, 
  Plus, 
  Edit, 
  Trash2,
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  Star
} from 'lucide-react'
import SEO from '@/components/seo'

interface SystemStats {
  totalUsers: number
  totalRestaurants: number
  totalDrivers: number
  totalOrders: number
  totalRevenue: number
  pendingApprovals: number
  activeOrders: number
}

interface User {
  id: string
  email: string
  name?: string
  role: string
  status: string
  createdAt: string
}

interface Restaurant {
  id: string
  name: string
  email: string
  phone: string
  status: string
  ratingAvg: number
  totalOrders: number
  createdAt: string
}

interface Driver {
  id: string
  email: string
  name?: string
  vehicleType: string
  licenseNumber: string
  status: string
  verified: boolean
  ratingAvg: number
  totalOrders: number
  createdAt: string
}

interface Order {
  id: string
  status: string
  total: number
  createdAt: string
  customer: {
    name: string
    email: string
  }
  restaurant: {
    name: string
  }
  driver?: {
    name: string
  }
}

export default function AdminDashboard() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<SystemStats>({
    totalUsers: 0,
    totalRestaurants: 0,
    totalDrivers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingApprovals: 0,
    activeOrders: 0
  })
  const [users, setUsers] = useState<User[]>([])
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin')
    } else if (user) {
      loadSystemStats()
      loadUsers()
      loadRestaurants()
      loadDrivers()
      loadOrders()
    }
  }, [user, loading, router])

  const loadSystemStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error loading system stats:', error)
    }
  }

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/admin/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
      }
    } catch (error) {
      console.error('Error loading users:', error)
    }
  }

  const loadRestaurants = async () => {
    try {
      const response = await fetch('/api/admin/restaurants')
      if (response.ok) {
        const data = await response.json()
        setRestaurants(data.restaurants)
      }
    } catch (error) {
      console.error('Error loading restaurants:', error)
    }
  }

  const loadDrivers = async () => {
    try {
      const response = await fetch('/api/admin/drivers')
      if (response.ok) {
        const data = await response.json()
        setDrivers(data.drivers)
      }
    } catch (error) {
      console.error('Error loading drivers:', error)
    }
  }

  const loadOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders')
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders)
      }
    } catch (error) {
      console.error('Error loading orders:', error)
    }
  }

  const updateUserStatus = async (userId: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        loadUsers()
        loadSystemStats()
      }
    } catch (error) {
      console.error('Error updating user status:', error)
    }
  }

  const verifyDriver = async (driverId: string, verified: boolean) => {
    try {
      const response = await fetch(`/api/admin/drivers/${driverId}/verify`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ verified }),
      })

      if (response.ok) {
        loadDrivers()
        loadSystemStats()
      }
    } catch (error) {
      console.error('Error verifying driver:', error)
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-100 text-red-800'
      case 'RESTAURANT': return 'bg-blue-100 text-blue-800'
      case 'DRIVER': return 'bg-green-100 text-green-800'
      case 'CUSTOMER': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800'
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'SUSPENDED': return 'bg-red-100 text-red-800'
      case 'OFFLINE': return 'bg-gray-100 text-gray-800'
      case 'ONLINE': return 'bg-blue-100 text-blue-800'
      case 'BUSY': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'CREATED': return 'bg-yellow-100 text-yellow-800'
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800'
      case 'PREPARING': return 'bg-purple-100 text-purple-800'
      case 'READY_FOR_PICKUP': return 'bg-indigo-100 text-indigo-800'
      case 'PICKED_UP': return 'bg-cyan-100 text-cyan-800'
      case 'EN_ROUTE': return 'bg-orange-100 text-orange-800'
      case 'DELIVERED': return 'bg-green-100 text-green-800'
      case 'CANCELLED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleText = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'مدير'
      case 'RESTAURANT': return 'مطعم'
      case 'DRIVER': return 'سائق'
      case 'CUSTOMER': return 'عميل'
      default: return role
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'نشط'
      case 'PENDING': return 'قيد المراجعة'
      case 'SUSPENDED': return 'موقوف'
      case 'OFFLINE': return 'غير متصل'
      case 'ONLINE': return 'متصل'
      case 'BUSY': return 'مشغول'
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

  if (!user) {
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
                  <h1 className="text-2xl font-bold text-gray-900">لوحة تحكم المدير</h1>
                  <p className="text-sm text-gray-600">إدارة النظام الشاملة</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {stats.pendingApprovals > 0 && (
                  <Badge variant="destructive" className="animate-pulse">
                    {stats.pendingApprovals} طلبات معلقة
                  </Badge>
                )}
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
                <CardTitle className="text-sm font-medium">إجمالي المستخدمين</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">مستخدم</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">المطاعم</CardTitle>
                <Store className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalRestaurants}</div>
                <p className="text-xs text-muted-foreground">مطعم</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">السائقين</CardTitle>
                <Motorbike className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalDrivers}</div>
                <p className="text-xs text-muted-foreground">سائق</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">الطلبات</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalOrders}</div>
                <p className="text-xs text-muted-foreground">طلب</p>
              </CardContent>
            </Card>
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">الإيرادات</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalRevenue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">ل.س</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">طلبات معلقة</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingApprovals}</div>
                <p className="text-xs text-muted-foreground">قيد المراجعة</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">طلبات نشطة</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeOrders}</div>
                <p className="text-xs text-muted-foreground">قيد التنفيذ</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">المعدل اليومي</CardTitle>
                <TrendingDown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.totalOrders > 0 ? (stats.totalRevenue / stats.totalOrders).toFixed(2) : '0.00'}
                </div>
                <p className="text-xs text-muted-foreground">متوسط الطلب</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Tabs */}
          <Tabs defaultValue="users" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="users">المستخدمون</TabsTrigger>
              <TabsTrigger value="restaurants">المطاعم</TabsTrigger>
              <TabsTrigger value="drivers">السائقون</TabsTrigger>
              <TabsTrigger value="orders">الطلبات</TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>إدارة المستخدمين</CardTitle>
                  <CardDescription>
                    عرض وإدارة جميع مستخدمي النظام
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {users.length === 0 ? (
                      <div className="text-center py-8">
                        <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-500">لا توجد مستخدمين</p>
                      </div>
                    ) : (
                      users.map((user) => (
                        <Card key={user.id}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h4 className="font-medium">{user.name || user.email}</h4>
                                  <Badge className={getRoleColor(user.role)}>
                                    {getRoleText(user.role)}
                                  </Badge>
                                  <Badge className={getStatusColor(user.status)}>
                                    {getStatusText(user.status)}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600">{user.email}</p>
                                <p className="text-xs text-gray-500">
                                  انضم: {new Date(user.createdAt).toLocaleDateString('ar-SA')}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                {user.status === 'PENDING' && (
                                  <>
                                    <Button
                                      size="sm"
                                      onClick={() => updateUserStatus(user.id, 'ACTIVE')}
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      <CheckCircle className="h-4 w-4 ml-2" />
                                      قبول
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => updateUserStatus(user.id, 'SUSPENDED')}
                                    >
                                      <AlertTriangle className="h-4 w-4 ml-2" />
                                      رفض
                                    </Button>
                                  </>
                                )}
                                {user.status === 'ACTIVE' && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => updateUserStatus(user.id, 'SUSPENDED')}
                                  >
                                    تعليق
                                  </Button>
                                )}
                                {user.status === 'SUSPENDED' && (
                                  <Button
                                    size="sm"
                                    onClick={() => updateUserStatus(user.id, 'ACTIVE')}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    تفعيل
                                  </Button>
                                )}
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

            <TabsContent value="restaurants" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>إدارة المطاعم</CardTitle>
                  <CardDescription>
                    عرض وإدارة جميع المطاعم في النظام
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {restaurants.length === 0 ? (
                      <div className="text-center py-8">
                        <Store className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-500">لا توجد مطاعم</p>
                      </div>
                    ) : (
                      restaurants.map((restaurant) => (
                        <Card key={restaurant.id}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h4 className="font-medium">{restaurant.name}</h4>
                                  <Badge className={getStatusColor(restaurant.status)}>
                                    {getStatusText(restaurant.status)}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600">{restaurant.email}</p>
                                <p className="text-sm text-gray-600">{restaurant.phone}</p>
                                <div className="flex items-center gap-4 mt-2">
                                  <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4 text-yellow-400" />
                                    <span className="text-sm">{restaurant.ratingAvg.toFixed(1)}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <ShoppingCart className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm">{restaurant.totalOrders} طلب</span>
                                  </div>
                                  <span className="text-xs text-gray-500">
                                    انضم: {new Date(restaurant.createdAt).toLocaleDateString('ar-SA')}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
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

            <TabsContent value="drivers" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>إدارة السائقين</CardTitle>
                  <CardDescription>
                    عرض وإدارة جميع السائقين في النظام
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {drivers.length === 0 ? (
                      <div className="text-center py-8">
                        <Motorbike className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-500">لا يوجد سائقين</p>
                      </div>
                    ) : (
                      drivers.map((driver) => (
                        <Card key={driver.id}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h4 className="font-medium">{driver.name || driver.email}</h4>
                                  <Badge className={getStatusColor(driver.status)}>
                                    {getStatusText(driver.status)}
                                  </Badge>
                                  <Badge variant={driver.verified ? "default" : "secondary"}>
                                    {driver.verified ? 'متحقق' : 'قيد المراجعة'}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600">{driver.email}</p>
                                <p className="text-sm text-gray-600">{driver.vehicleType} - {driver.licenseNumber}</p>
                                <div className="flex items-center gap-4 mt-2">
                                  <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4 text-yellow-400" />
                                    <span className="text-sm">{driver.ratingAvg.toFixed(1)}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <ShoppingCart className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm">{driver.totalOrders} طلب</span>
                                  </div>
                                  <span className="text-xs text-gray-500">
                                    انضم: {new Date(driver.createdAt).toLocaleDateString('ar-SA')}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {!driver.verified && (
                                  <Button
                                    size="sm"
                                    onClick={() => verifyDriver(driver.id, true)}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    <CheckCircle className="h-4 w-4 ml-2" />
                                    تحقق
                                  </Button>
                                )}
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

            <TabsContent value="orders" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>إدارة الطلبات</CardTitle>
                  <CardDescription>
                    عرض وإدارة جميع طلبات النظام
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orders.length === 0 ? (
                      <div className="text-center py-8">
                        <ShoppingCart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-500">لا توجد طلبات</p>
                      </div>
                    ) : (
                      orders.map((order) => (
                        <Card key={order.id}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge className={getOrderStatusColor(order.status)}>
                                    {order.status}
                                  </Badge>
                                  <span className="text-sm text-gray-600">
                                    {new Date(order.createdAt).toLocaleString('ar-SA')}
                                  </span>
                                </div>
                                <p className="text-lg font-semibold">{order.total.toFixed(2)} ل.س</p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <h4 className="font-medium mb-1">العميل</h4>
                                <p className="text-sm">{order.customer.name}</p>
                                <p className="text-xs text-gray-600">{order.customer.email}</p>
                              </div>
                              <div>
                                <h4 className="font-medium mb-1">المطعم</h4>
                                <p className="text-sm">{order.restaurant.name}</p>
                              </div>
                              <div>
                                <h4 className="font-medium mb-1">السائق</h4>
                                <p className="text-sm">{order.driver?.name || 'غير محدد'}</p>
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
          </Tabs>
        </main>
      </div>
    </>
  )
}