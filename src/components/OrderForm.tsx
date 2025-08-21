'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CreditCard, MapPin, Phone, Clock, Truck, Store } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
}

interface OrderFormProps {
  cartItems: CartItem[];
  totalAmount: number;
  onOrderComplete: (orderData: any) => void;
  onCancel: () => void;
}

export default function OrderForm({ cartItems, totalAmount, onOrderComplete, onCancel }: OrderFormProps) {
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const deliveryFee = orderType === 'delivery' ? 15 : 0;
  const taxAmount = totalAmount * 0.15; // 15% tax
  const finalAmount = totalAmount + deliveryFee + taxAmount;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    const orderData = {
      id: `ORD-${Date.now()}`,
      items: cartItems,
      subtotal: totalAmount,
      deliveryFee,
      taxAmount,
      finalAmount,
      orderType,
      paymentMethod,
      customerInfo: formData,
      status: 'confirmed',
      estimatedTime: orderType === 'delivery' ? '45-60 دقيقة' : '20-30 دقيقة',
      createdAt: new Date().toISOString()
    };

    onOrderComplete(orderData);
    setIsSubmitting(false);
  };

  if (cartItems.length === 0) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>السلة فارغة</CardTitle>
          <CardDescription>أضف بعض الأطباق إلى السلة أولاً</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={onCancel} className="w-full">
            العودة للقائمة
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              إتمام الطلب
            </CardTitle>
            <CardDescription>أدخل معلوماتك لإتمام الطلب</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Order Type */}
              <div>
                <Label className="text-base font-semibold">نوع الطلب</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <Button
                    type="button"
                    variant={orderType === 'delivery' ? 'default' : 'outline'}
                    className="flex flex-col items-center gap-2 h-auto py-4"
                    onClick={() => setOrderType('delivery')}
                  >
                    <Truck className="w-6 h-6" />
                    <span>توصيل</span>
                  </Button>
                  <Button
                    type="button"
                    variant={orderType === 'pickup' ? 'default' : 'outline'}
                    className="flex flex-col items-center gap-2 h-auto py-4"
                    onClick={() => setOrderType('pickup')}
                  >
                    <Store className="w-6 h-6" />
                    <span>استلام</span>
                  </Button>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">معلومات الاتصال</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">الاسم *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">رقم الهاتف *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>
              </div>

              {/* Delivery Address */}
              {orderType === 'delivery' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    عنوان التوصيل
                  </h3>
                  <div>
                    <Label htmlFor="address">العنوان *</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">المدينة *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              {/* Payment Method */}
              <div>
                <Label className="text-base font-semibold">طريقة الدفع</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <Button
                    type="button"
                    variant={paymentMethod === 'cash' ? 'default' : 'outline'}
                    className="flex flex-col items-center gap-2 h-auto py-4"
                    onClick={() => setPaymentMethod('cash')}
                  >
                    <span>نقدي</span>
                  </Button>
                  <Button
                    type="button"
                    variant={paymentMethod === 'card' ? 'default' : 'outline'}
                    className="flex flex-col items-center gap-2 h-auto py-4"
                    onClick={() => setPaymentMethod('card')}
                  >
                    <CreditCard className="w-6 h-6" />
                    <span>بطاقة</span>
                  </Button>
                </div>
              </div>

              {/* Order Notes */}
              <div>
                <Label htmlFor="notes">ملاحظات إضافية</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="أي ملاحظات خاصة بالطلب..."
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="flex-1 bg-orange-500 hover:bg-orange-600"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'جاري المعالجة...' : `إتمام الطلب (${finalAmount} ريال)`}
                </Button>
                <Button type="button" variant="outline" onClick={onCancel}>
                  إلغاء
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <div className="space-y-6">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>ملخص الطلب</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-64 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-gray-600">
                        {item.quantity} × {item.price} ريال
                      </p>
                      {item.notes && (
                        <p className="text-xs text-gray-500 mt-1">ملاحظات: {item.notes}</p>
                      )}
                    </div>
                    <span className="font-semibold">{item.quantity * item.price} ريال</span>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>المجموع الفرعي:</span>
                  <span>{totalAmount} ريال</span>
                </div>
                {deliveryFee > 0 && (
                  <div className="flex justify-between">
                    <span>رسوم التوصيل:</span>
                    <span>{deliveryFee} ريال</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>الضريبة (15%):</span>
                  <span>{taxAmount.toFixed(2)} ريال</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>المجموع:</span>
                  <span className="text-orange-600">{finalAmount.toFixed(2)} ريال</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                معلومات التوصيل
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>وقت التجهيز: 15-20 دقيقة</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>
                    وقت التوصيل: {orderType === 'delivery' ? '45-60 دقيقة' : '20-30 دقيقة'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>الحد الأدنى للطلب: 30 ريال</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                للتواصل
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>📞 920000123</p>
                <p>📱 متوفر على واتساب</p>
                <p>🕐 خدمة العملاء: 9 ص - 12 ص</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}