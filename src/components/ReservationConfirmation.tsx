'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, MapPin, Phone, Mail, Users, Calendar, AlertCircle } from 'lucide-react';

interface ReservationConfirmationProps {
  reservationData: {
    id: string;
    date: Date;
    time: string;
    numberOfGuests: number;
    tableId: string;
    table: any;
    customerInfo: any;
    status: string;
    createdAt: string;
  };
  onNewReservation: () => void;
  onCancelReservation: () => void;
}

export default function ReservationConfirmation({ 
  reservationData, 
  onNewReservation, 
  onCancelReservation 
}: ReservationConfirmationProps) {
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancel = async () => {
    setIsCancelling(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    onCancelReservation();
    setIsCancelling(false);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ar-SA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time: string) => {
    return time;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Success Message */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">تم تأكيد حجزك!</h1>
        <p className="text-lg text-gray-600">شكراً لحجزك من مطعمنا المميز</p>
        <Badge className="mt-2 bg-green-100 text-green-800">
          رقم الحجز: {reservationData.id}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Reservation Details */}
        <div className="space-y-6">
          {/* Main Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                تفاصيل الحجز
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="font-medium">التاريخ</p>
                    <p className="text-gray-600">{formatDate(reservationData.date)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="font-medium">الوقت</p>
                    <p className="text-gray-600">{formatTime(reservationData.time)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="font-medium">عدد الضيوف</p>
                    <p className="text-gray-600">{reservationData.numberOfGuests} أشخاص</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="font-medium">الطاولة</p>
                    <p className="text-gray-600">
                      طاولة {reservationData.table.number} ({reservationData.table.location})
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle>معلومات الاتصال</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="font-medium">الاسم:</span>
                  <span>{reservationData.customerInfo.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span>{reservationData.customerInfo.phone}</span>
                </div>
                {reservationData.customerInfo.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span>{reservationData.customerInfo.email}</span>
                  </div>
                )}
                {reservationData.customerInfo.specialRequests && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium text-sm mb-1">طلبات خاصة:</p>
                    <p className="text-sm text-gray-600">{reservationData.customerInfo.specialRequests}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>حالة الحجز</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-medium text-green-600">مؤكد</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                تم تأكيد حجزك بنجاح. ننتظر قدومك في الموعد المحدد.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Important Info & Actions */}
        <div className="space-y-6">
          {/* Important Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                معلومات هامة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <p>يرجى الحضور قبل الموعد بـ 15 دقيقة على الأقل</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <p>في حال التأخر أكثر من 20 دقيقة، قد يتم إلغاء الحجز تلقائياً</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <p>يمكنك تعديل أو إلغاء الحجز حتى 24 ساعة قبل الموعد</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <p>نحن نلتزم بجميع إجراءات السلامة والنظافة</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Restaurant Contact */}
          <Card>
            <CardHeader>
              <CardTitle>للتواصل معنا</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
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
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="space-y-3">
            <Button 
              onClick={onNewReservation} 
              className="w-full bg-orange-500 hover:bg-orange-600"
            >
              حجز جديد
            </Button>
            <Button 
              onClick={handleCancel} 
              variant="outline" 
              className="w-full"
              disabled={isCancelling}
            >
              {isCancelling ? 'جاري الإلغاء...' : 'إلغاء الحجز'}
            </Button>
          </div>

          {/* Reservation Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">معلومات الحجز</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">رقم الحجز:</span>
                  <span>{reservationData.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">تاريخ الحجز:</span>
                  <span>{new Date(reservationData.createdAt).toLocaleDateString('ar-SA')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">وقت الحجز:</span>
                  <span>{new Date(reservationData.createdAt).toLocaleTimeString('ar-SA')}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}