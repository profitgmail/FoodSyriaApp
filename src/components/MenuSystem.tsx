'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, Search, ShoppingCart, Plus, Minus, Filter } from 'lucide-react';
import OrderForm from './OrderForm';
import OrderConfirmation from './OrderConfirmation';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  isFeatured: boolean;
  category: {
    id: string;
    name: string;
  };
  rating?: number;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
}

interface MenuSystemProps {
  onAddToCart?: (item: MenuItem) => void;
}

type ViewMode = 'menu' | 'checkout' | 'confirmation';

export default function MenuSystem({ onAddToCart }: MenuSystemProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<string>('name');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('menu');
  const [orderData, setOrderData] = useState<any>(null);

  // Mock data - in real app, this would come from API
  const mockMenuItems: MenuItem[] = [
    {
      id: '1',
      name: 'برجر لحم خاص',
      description: 'برجر لحم بقري طازج مع صلصة خاصة وخضروات طازجة',
      price: 45,
      image: '/api/placeholder/300/200',
      isFeatured: true,
      category: { id: '1', name: 'مقبلات' },
      rating: 4.8
    },
    {
      id: '2',
      name: 'بيتزا مارغريتا',
      description: 'بيتزا إيطالية أصلية مع صلصة الطماطم وجبنة الموزاريلا',
      price: 38,
      image: '/api/placeholder/300/200',
      isFeatured: true,
      category: { id: '1', name: 'مقبلات' },
      rating: 4.6
    },
    {
      id: '3',
      name: 'سلطة قيصر',
      description: 'سلطة طازجة مع صلصة قيصر وخبز المحمص',
      price: 25,
      image: '/api/placeholder/300/200',
      isFeatured: false,
      category: { id: '2', name: 'سلطات' },
      rating: 4.5
    },
    {
      id: '4',
      name: 'تشيز كيك',
      description: 'تشيز كيك كريمي مع توت طازج',
      price: 28,
      image: '/api/placeholder/300/200',
      isFeatured: true,
      category: { id: '3', name: 'حلويات' },
      rating: 4.9
    },
    {
      id: '5',
      name: 'شوربة عدس',
      description: 'شوربة عدس ساخنة مع خبز محمص',
      price: 18,
      image: '/api/placeholder/300/200',
      isFeatured: false,
      category: { id: '4', name: 'شوربات' },
      rating: 4.3
    },
    {
      id: '6',
      name: 'مشاوي مشكلة',
      description: 'تشكيلة من المشاوي الطازجة مع صلصات خاصة',
      price: 65,
      image: '/api/placeholder/300/200',
      isFeatured: true,
      category: { id: '5', name: 'أطباق رئيسية' },
      rating: 4.7
    },
    {
      id: '7',
      name: 'معكرونة بولونيز',
      description: 'معكرونة إيطالية مع صلصة اللحم المميزة',
      price: 42,
      image: '/api/placeholder/300/200',
      isFeatured: false,
      category: { id: '5', name: 'أطباق رئيسية' },
      rating: 4.4
    },
    {
      id: '8',
      name: 'عصير برتقال طازج',
      description: 'عصير برتقال طازج معصور على الطبيعة',
      price: 15,
      image: '/api/placeholder/300/200',
      isFeatured: false,
      category: { id: '6', name: 'مشروبات' },
      rating: 4.2
    }
  ];

  const categories = [
    { id: 'all', name: 'الكل' },
    { id: '1', name: 'مقبلات' },
    { id: '2', name: 'سلطات' },
    { id: '3', name: 'حلويات' },
    { id: '4', name: 'شوربات' },
    { id: '5', name: 'أطباق رئيسية' },
    { id: '6', name: 'مشروبات' }
  ];

  useEffect(() => {
    setMenuItems(mockMenuItems);
    setFilteredItems(mockMenuItems);
  }, []);

  useEffect(() => {
    let filtered = menuItems;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category.id === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort items
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });

    setFilteredItems(filtered);
  }, [menuItems, selectedCategory, searchTerm, sortBy]);

  const addToCart = (menuItem: MenuItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === menuItem.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === menuItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { 
          id: menuItem.id, 
          name: menuItem.name, 
          price: menuItem.price, 
          quantity: 1 
        }];
      }
    });

    if (onAddToCart) {
      onAddToCart(menuItem);
    }
  };

  const removeFromCart = (itemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(itemId);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.id === itemId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleCheckout = () => {
    setViewMode('checkout');
    setShowCart(false);
  };

  const handleOrderComplete = (orderData: any) => {
    setOrderData(orderData);
    setViewMode('confirmation');
    setCart([]);
  };

  const handleNewOrder = () => {
    setViewMode('menu');
    setOrderData(null);
  };

  const handleTrackOrder = () => {
    // In a real app, this would navigate to order tracking page
    alert('تتبع الطلب - هذه الميزة قيد التطوير');
  };

  const handleCancelCheckout = () => {
    setViewMode('menu');
  };

  // Render different views based on state
  if (viewMode === 'checkout') {
    return (
      <OrderForm
        cartItems={cart}
        totalAmount={cartTotal}
        onOrderComplete={handleOrderComplete}
        onCancel={handleCancelCheckout}
      />
    );
  }

  if (viewMode === 'confirmation' && orderData) {
    return (
      <OrderConfirmation
        orderData={orderData}
        onNewOrder={handleNewOrder}
        onTrackOrder={handleTrackOrder}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">قائمتنا الشهية</h1>
        <p className="text-xl text-gray-600">اكتشف تشكيلتنا المميزة من الأطباق الشهية</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="ابحث عن طبق..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full lg:w-48">
              <SelectValue placeholder="اختر الفئة" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full lg:w-48">
              <SelectValue placeholder="ترتيب حسب" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">الاسم</SelectItem>
              <SelectItem value="price-low">السعر: منخفض إلى مرتفع</SelectItem>
              <SelectItem value="price-high">السعر: مرتفع إلى منخفض</SelectItem>
              <SelectItem value="rating">التقييم</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            className="relative"
            onClick={() => setShowCart(!showCart)}
          >
            <ShoppingCart className="w-5 h-5 ml-2" />
            السلة
            {cartCount > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-orange-500 text-white">
                {cartCount}
              </Badge>
            )}
          </Button>

          {cartCount > 0 && (
            <Button
              className="bg-orange-500 hover:bg-orange-600"
              onClick={handleCheckout}
            >
              إتمام الطلب ({cartTotal} ريال)
            </Button>
          )}
        </div>
      </div>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden" onClick={() => setShowCart(false)}>
          <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg p-6 overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">السلة</h3>
              <Button variant="ghost" onClick={() => setShowCart(false)}>
                ✕
              </Button>
            </div>
            
            {cart.length === 0 ? (
              <p className="text-gray-500 text-center py-8">السلة فارغة</p>
            ) : (
              <>
                {cart.map(item => (
                  <div key={item.id} className="border-b py-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.name}</h4>
                        <p className="text-gray-600 text-sm">{item.price} ريال</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="mt-6 pt-4 border-t">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold">المجموع:</span>
                    <span className="text-xl font-bold text-orange-600">{cartTotal} ريال</span>
                  </div>
                  <Button className="w-full bg-orange-500 hover:bg-orange-600 mb-2" onClick={handleCheckout}>
                    إتمام الطلب
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Menu Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => (
          <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="h-48 bg-gray-200 relative">
              {item.isFeatured && (
                <Badge className="absolute top-2 right-2 bg-orange-500">
                  مميز
                </Badge>
              )}
              {item.rating && (
                <div className="absolute top-2 left-2 bg-white rounded-full px-2 py-1 flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{item.rating}</span>
                </div>
              )}
            </div>
            <CardHeader>
              <CardTitle className="text-lg">{item.name}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-orange-600">{item.price} ريال</span>
                <Button 
                  className="bg-orange-500 hover:bg-orange-600"
                  onClick={() => addToCart(item)}
                >
                  أضف للسلة
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">لا توجد أطباق مطابقة لبحثك</p>
        </div>
      )}

      {/* Desktop Cart */}
      <div className="hidden lg:block fixed left-4 top-1/2 transform -translate-y-1/2 w-80">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              السلة
              <Badge variant="secondary">{cartCount} عناصر</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {cart.length === 0 ? (
              <p className="text-gray-500 text-center py-4">السلة فارغة</p>
            ) : (
              <>
                <div className="max-h-64 overflow-y-auto space-y-3">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div className="flex-1">
                        <h5 className="font-medium text-sm">{item.name}</h5>
                        <p className="text-gray-600 text-xs">{item.price} ريال × {item.quantity}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-6 text-center text-sm">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-semibold">المجموع:</span>
                    <span className="font-bold text-orange-600">{cartTotal} ريال</span>
                  </div>
                  <Button className="w-full bg-orange-500 hover:bg-orange-600" onClick={handleCheckout}>
                    إتمام الطلب
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}