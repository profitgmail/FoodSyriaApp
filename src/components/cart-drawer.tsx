'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import { Separator } from '@/components/ui/separator'
import { ShoppingCart, Plus, Minus, Trash2, X } from 'lucide-react'

interface CartItem {
  id: string
  menuItemId: string
  name: string
  price: number
  quantity: number
  notes?: string
}

interface CartDrawerProps {
  children: React.ReactNode
}

export default function CartDrawer({ children }: CartDrawerProps) {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [orderNotes, setOrderNotes] = useState('')
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  })

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }
  }, [])

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems))
  }, [cartItems])

  // Update customer info when session is available
  useEffect(() => {
    if (session?.user) {
      setCustomerInfo(prev => ({
        ...prev,
        name: session.user?.name || '',
        email: session.user?.email || ''
      }))
    }
  }, [session])

  const addToCart = (menuItem: any) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.menuItemId === menuItem.id)
      if (existingItem) {
        return prev.map(item =>
          item.menuItemId === menuItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        return [
          ...prev,
          {
            id: Date.now().toString(),
            menuItemId: menuItem.id,
            name: menuItem.name,
            price: menuItem.price,
            quantity: 1
          }
        ]
      }
    })
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(itemId)
      return
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    )
  }

  const removeFromCart = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId))
  }

  const clearCart = () => {
    setCartItems([])
  }

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const handleOrderSubmit = async () => {
    if (cartItems.length === 0) {
      alert('السلة فارغة')
      return
    }

    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      alert('يرجى ملء جميع الحقول المطلوبة')
      return
    }

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cartItems.map(item => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            price: item.price,
            notes: item.notes
          })),
          address: customerInfo.address,
          phone: customerInfo.phone,
          notes: orderNotes
        }),
      })

      const data = await response.json()

      if (response.ok) {
        alert('تم إرسال الطلب بنجاح! سنتواصل معك قريباً.')
        clearCart()
        setIsOpen(false)
        setOrderNotes('')
      } else {
        alert(data.error || 'حدث خطأ أثناء إرسال الطلب')
      }
    } catch (error) {
      alert('حدث خطأ أثناء إرسال الطلب')
    }
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        {children}
      </DrawerTrigger>
      <DrawerContent className="h-[90vh]">
        <div className="flex flex-col h-full">
          <DrawerHeader className="border-b">
            <div className="flex items-center justify-between">
              <DrawerTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                سلة التسوق
                {getTotalItems() > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {getTotalItems()}
                  </Badge>
                )}
              </DrawerTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto p-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500 mb-4">السلة فارغة</p>
                <Button onClick={() => setIsOpen(false)}>
                  ابدأ التسوق
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <Card key={item.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-sm text-gray-600">{item.price} ر.س</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="mt-2">
                          <Label htmlFor={`notes-${item.id}`} className="text-sm">
                            ملاحظات للطبق
                          </Label>
                          <Input
                            id={`notes-${item.id}`}
                            placeholder="ملاحظات إضافية..."
                            value={item.notes || ''}
                            onChange={(e) => {
                              setCartItems(prev =>
                                prev.map(cartItem =>
                                  cartItem.id === item.id
                                    ? { ...cartItem, notes: e.target.value }
                                    : cartItem
                                )
                              )
                            }}
                            className="mt-1"
                          />
                        </div>
                        <div className="mt-2 text-right">
                          <span className="font-medium">
                            {(item.price * item.quantity).toFixed(2)} ر.س
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Separator />

                {/* Customer Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">معلومات العميل</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">الاسم الكامل *</Label>
                        <Input
                          id="name"
                          value={customerInfo.name}
                          onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">البريد الإلكتروني</Label>
                        <Input
                          id="email"
                          type="email"
                          value={customerInfo.email}
                          onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">رقم الهاتف *</Label>
                        <Input
                          id="phone"
                          value={customerInfo.phone}
                          onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="address">العنوان *</Label>
                        <Input
                          id="address"
                          value={customerInfo.address}
                          onChange={(e) => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Order Notes */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">ملاحظات الطلب</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="ملاحظات إضافية للطلب..."
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      rows={3}
                    />
                  </CardContent>
                </Card>

                {/* Total */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center text-lg font-semibold">
                      <span>المجموع:</span>
                      <span>{getTotalPrice().toFixed(2)} ر.س</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="border-t p-4 space-y-3">
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  onClick={clearCart}
                  className="text-red-500 hover:text-red-700"
                >
                  إفراغ السلة
                </Button>
                <Button
                  onClick={handleOrderSubmit}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  إتمام الطلب
                </Button>
              </div>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  )
}

// Hook to use cart functions
export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }
  }, [])

  const addToCart = (menuItem: any) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.menuItemId === menuItem.id)
      if (existingItem) {
        return prev.map(item =>
          item.menuItemId === menuItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        return [
          ...prev,
          {
            id: Date.now().toString(),
            menuItemId: menuItem.id,
            name: menuItem.name,
            price: menuItem.price,
            quantity: 1
          }
        ]
      }
    })
  }

  return { cartItems, addToCart }
}