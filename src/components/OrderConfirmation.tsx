'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, MapPin, Phone, Truck, Store, CreditCard } from 'lucide-react';

interface OrderConfirmationProps {
  orderData: {
    id: string;
    items: any[];
    subtotal: number;
    deliveryFee: number;
    taxAmount: number;
    finalAmount: number;
    orderType: 'delivery' | 'pickup';
    paymentMethod: 'cash' | 'card';
    customerInfo: any;
    status: string;
    estimatedTime: string;
    createdAt: string;
  };
  onNewOrder: () => void;
  onTrackOrder: () => void;
}

export default function OrderConfirmation({ orderData, onNewOrder, onTrackOrder }: OrderConfirmationProps) {
  const [orderStatus, setOrderStatus] = useState(orderData.status);

  const statusSteps = [
    { key: 'confirmed', label: 'تم تأكيد الطلب', icon: CheckCircle, color: 'green' },
    { key: 'preparing', label: 'جاري التحضير', icon: Clock, color: 'blue' },
    { key: 'ready', label: 'جاهز', icon: CheckCircle, color: 'orange' },
    { key: 'delivered', label: 'تم التسليم', icon: CheckCircle, color: 'green' }
  ];

  const currentStepIndex = statusSteps.findIndex(step => step.key === orderStatus);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Success Message */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">تم استلام طلبك!</h1>
        <p className="text-lg text-gray-600">شكراً لطلبك من مطعمنا المميز</p>
        <Badge className="mt-2 bg-green-100 text-green-800">
          طلب رقم: {orderData.id}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Details */}
        <div className="space-y-6">
          {/* Order Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                حالة الطلب
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Status Timeline */}
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                  <div className="space-y-6">
                    {statusSteps.map((step, index) => {
                      const Icon = step.icon;
                      const isActive = index <= currentStepIndex;
                      const isCurrent = index === currentStepIndex;
                      
                      return (
                        <div key={step.key} className="relative flex items-center gap-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                            isActive ? `bg-${step.color}-100 border-2 border-${step.color}-500` : 'bg-gray-100'
                          }`}>
                            <Icon className={`w-4 h-4 ${isActive ? `text-${step.color}-600` : 'text-gray-400'}`} />
                          </div>
                          <div className={`flex-1 ${isCurrent ? 'font-semibold' : ''}`}>
                            <span className={isActive ? 'text-gray-800' : 'text-gray-500'}>{step.label}</span>
                            {isCurrent && (
                              <div className="text-sm text-gray-600">الوقت المتوقع: {orderData.estimatedTime}</div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>تفاصيل الطلب</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {orderData.items.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between items-start py-2 border-b last:border-b-0">
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
              <div className="mt-4 pt-4 border-t space-y-2">
                <div className="flex justify-between">
                  <span>المجموع الفرعي:</span>
                  <span>{orderData.subtotal} ريال</span>
                </div>
                {orderData.deliveryFee > 0 && (
                  <div className="flex justify-between">
                    <span>رسوم التوصيل:</span>
                    <span>{orderData.deliveryFee} ريال</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>الضريبة (15%):</span>
                  <span>{orderData.taxAmount.toFixed(2)} ريال</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>المجموع:</span>
                  <span className="text-orange-600">{orderData.finalAmount.toFixed(2)} ريال</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customer Info & Actions */}
        <div className="space-y-6">
          {/* Delivery/Pickup Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {orderData.orderType === 'delivery' ? (
                  <Truck className="w-5 h-5" />
                ) : (
                  <Store className="w-5 h-5" />
                )}
                {orderData.orderType === 'delivery' ? 'معلومات التوصيل' : 'معلومات الاستلام'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>الوقت المتوقع: {orderData.estimatedTime}</span>
                </div>
                {orderData.orderType === 'delivery' && (
                  <>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 mt-0.5 text-gray-500" />
                      <div>
                        <p className="font-medium">عنوان التوصيل:</p>
                        <p className="text-sm text-gray-600">{orderData.customerInfo.address}</p>
                        <p className="text-sm text-gray-600">{orderData.customerInfo.city}</p>
                      </div>
                    </div>
                  </>
                )}
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span>رقم الهاتف: {orderData.customerInfo.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <CreditCard className="w-4 h-4 text-gray-500" />
                  <span>طريقة الدفع: {orderData.paymentMethod === 'cash' ? 'نقدي' : 'بطاقة'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Service */}
          <Card>
            <CardHeader>
              <CardTitle>خدمة العملاء</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  هل لديك أي استفسار حول طلبك؟ تواصل معنا على الفور
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>920000123</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm">📱</span>
                    <span>متوفر على واتساب</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span>خدمة العملاء: 9 ص - 12 ص</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="space-y-3">
            <Button 
              onClick={onTrackOrder} 
              className="w-full bg-blue-500 hover:bg-blue-600"
            >
              تتبع الطلب
            </Button>
            <Button 
              onClick={onNewOrder} 
              variant="outline" 
              className="w-full"
            >
              طلب جديد
            </Button>
          </div>

          {/* Order Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">معلومات الطلب</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">رقم الطلب:</span>
                  <span>{orderData.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">تاريخ الطلب:</span>
                  <span>{new Date(orderData.createdAt).toLocaleDateString('ar-SA')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">وقت الطلب:</span>
                  <span>{new Date(orderData.createdAt).toLocaleTimeString('ar-SA')}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}