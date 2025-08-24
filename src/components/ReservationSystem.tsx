'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, Plus, X } from 'lucide-react';
import ReservationForm from './ReservationForm';
import ReservationConfirmation from './ReservationConfirmation';

interface Reservation {
  id: string;
  date: Date;
  time: string;
  numberOfGuests: number;
  tableNumber: number;
  status: string;
  customerName: string;
}

interface ReservationSystemProps {
  onReservationComplete?: (reservationData: any) => void;
}

type ViewMode = 'list' | 'form' | 'confirmation';

export default function ReservationSystem({ onReservationComplete }: ReservationSystemProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [reservationData, setReservationData] = useState<any>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  // Mock reservations data
  const mockReservations: Reservation[] = [
    {
      id: 'RES-001',
      date: new Date('2024-01-15'),
      time: '19:00',
      numberOfGuests: 4,
      tableNumber: 2,
      status: 'confirmed',
      customerName: 'أحمد محمد'
    },
    {
      id: 'RES-002',
      date: new Date('2024-01-15'),
      time: '20:30',
      numberOfGuests: 2,
      tableNumber: 5,
      status: 'confirmed',
      customerName: 'فاطمة علي'
    },
    {
      id: 'RES-003',
      date: new Date('2024-01-16'),
      time: '13:00',
      numberOfGuests: 6,
      tableNumber: 6,
      status: 'pending',
      customerName: 'محمد سالم'
    }
  ];

  const handleReservationComplete = (data: any) => {
    setReservationData(data);
    setViewMode('confirmation');
    
    // Add to reservations list
    const newReservation: Reservation = {
      id: data.id,
      date: data.date,
      time: data.time,
      numberOfGuests: data.numberOfGuests,
      tableNumber: data.table.number,
      status: data.status,
      customerName: data.customerInfo.name
    };
    
    setReservations(prev => [...prev, newReservation]);
    
    if (onReservationComplete) {
      onReservationComplete(data);
    }
  };

  const handleNewReservation = () => {
    setViewMode('form');
    setReservationData(null);
  };

  const handleCancelReservation = () => {
    setViewMode('list');
    setReservationData(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800">مؤكد</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">قيد الانتظار</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">ملغي</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ar-SA', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  // Render different views based on state
  if (viewMode === 'form') {
    return (
      <ReservationForm
        onReservationComplete={handleReservationComplete}
        onCancel={() => setViewMode('list')}
      />
    );
  }

  if (viewMode === 'confirmation' && reservationData) {
    return (
      <ReservationConfirmation
        reservationData={reservationData}
        onNewReservation={handleNewReservation}
        onCancelReservation={handleCancelReservation}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">نظام الحجز</h1>
        <p className="text-xl text-gray-600">احجز طاولتك المفضلة واستمتع بتجربة مميزة</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              <Calendar className="w-5 h-5 text-orange-500" />
              الطاولات المتاحة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">12</div>
            <p className="text-gray-600">طاولة متاحة اليوم</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              الحجوزات اليوم
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{mockReservations.length}</div>
            <p className="text-gray-600">حجز مؤكد</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              <Users className="w-5 h-5 text-green-500" />
              إجمالي الضيوف
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {mockReservations.reduce((total, res) => total + res.numberOfGuests, 0)}
            </div>
            <p className="text-gray-600">ضيف اليوم</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Reservation Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              حجز جديد
            </CardTitle>
            <CardDescription>
              املأ النموذج التالي لحجز طاولتك
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 border rounded-lg hover:bg-orange-50 cursor-pointer">
                  <Calendar className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                  <p className="font-medium">اختر التاريخ</p>
                  <p className="text-sm text-gray-600">متاح حتى 30 يوم</p>
                </div>
                <div className="text-center p-4 border rounded-lg hover:bg-orange-50 cursor-pointer">
                  <Clock className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                  <p className="font-medium">اختر الوقت</p>
                  <p className="text-sm text-gray-600">من 11 ص إلى 11 م</p>
                </div>
              </div>
              
              <div className="text-center p-4 border rounded-lg hover:bg-orange-50 cursor-pointer">
                <Users className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                <p className="font-medium">عدد الضيوف</p>
                <p className="text-sm text-gray-600">من 1 إلى 10 أشخاص</p>
              </div>

              <Button 
                onClick={handleNewReservation} 
                className="w-full bg-orange-500 hover:bg-orange-600"
              >
                ابدأ الحجز الآن
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Today's Reservations */}
        <Card>
          <CardHeader>
            <CardTitle>حجوزات اليوم</CardTitle>
            <CardDescription>
              نظرة سريعة على حجوزات اليوم
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {mockReservations.map((reservation) => (
                <div key={reservation.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold">{reservation.customerName}</h4>
                      <p className="text-sm text-gray-600">طاولة {reservation.tableNumber}</p>
                    </div>
                    {getStatusBadge(reservation.status)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(reservation.date)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{reservation.time}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{reservation.numberOfGuests} أشخاص</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Info */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>سياسة الحجز</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p>• الحجز متاح حتى 30 يوماً مقدماً</p>
              <p>• يرجى الحضور قبل الموعد بـ 15 دقيقة</p>
              <p>• يمكن إلغاء الحجز حتى 24 ساعة قبل الموعد</p>
              <p>• التأخر أكثر من 20 دقيقة قد يؤدي إلى إلغاء الحجز</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>معلومات التواصل</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p>📞 920000123</p>
              <p>📱 متوفر على واتساب</p>
              <p>🕐 خدمة العملاء: 9 ص - 12 ص</p>
              <p>📍 شارع الملك فهد، حي النخيل</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}