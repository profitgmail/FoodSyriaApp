'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Users, MapPin, Phone, Mail, Calendar as CalendarIcon } from 'lucide-react';

interface Table {
  id: string;
  number: number;
  capacity: number;
  location: string;
  isAvailable: boolean;
}

interface ReservationFormProps {
  onReservationComplete: (reservationData: any) => void;
  onCancel: () => void;
}

export default function ReservationForm({ onReservationComplete, onCancel }: ReservationFormProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [numberOfGuests, setNumberOfGuests] = useState<number>(2);
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    specialRequests: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Mock tables data
  const tables: Table[] = [
    { id: '1', number: 1, capacity: 2, location: 'نافذة', isAvailable: true },
    { id: '2', number: 2, capacity: 4, location: 'وسط', isAvailable: true },
    { id: '3', number: 3, capacity: 4, location: 'نافذة', isAvailable: false },
    { id: '4', number: 4, capacity: 6, location: 'وسط', isAvailable: true },
    { id: '5', number: 5, capacity: 2, location: 'زوايا', isAvailable: true },
    { id: '6', number: 6, capacity: 8, location: 'خاص', isAvailable: true },
    { id: '7', number: 7, capacity: 4, location: 'نافذة', isAvailable: true },
    { id: '8', number: 8, capacity: 6, location: 'وسط', isAvailable: false }
  ];

  const timeSlots = [
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
    '20:00', '20:30', '21:00', '21:30', '22:00', '22:30'
  ];

  const availableTables = tables.filter(table => 
    table.isAvailable && table.capacity >= numberOfGuests
  );

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

    const reservationData = {
      id: `RES-${Date.now()}`,
      date: selectedDate,
      time: selectedTime,
      numberOfGuests,
      tableId: selectedTable,
      table: tables.find(t => t.id === selectedTable),
      customerInfo: formData,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    onReservationComplete(reservationData);
    setIsSubmitting(false);
  };

  const nextStep = () => {
    if (step === 1 && selectedDate && selectedTime && numberOfGuests) {
      setStep(2);
    } else if (step === 2 && selectedTable) {
      setStep(3);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const isStep1Complete = selectedDate && selectedTime && numberOfGuests;
  const isStep2Complete = selectedTable;
  const isStep3Complete = formData.name && formData.phone;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-4 rtl:space-x-reverse">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step >= stepNumber ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {stepNumber}
              </div>
              <span className={`mx-2 text-sm ${
                step >= stepNumber ? 'text-orange-600 font-medium' : 'text-gray-500'
              }`}>
                {stepNumber === 1 ? 'التاريخ والوقت' : stepNumber === 2 ? 'اختيار الطاولة' : 'معلومات الاتصال'}
              </span>
              {stepNumber < 3 && (
                <div className={`w-16 h-1 ${
                  step > stepNumber ? 'bg-orange-500' : 'bg-gray-200'
                }`}></div>
              )}
            </div>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            حجز طاولة
          </CardTitle>
          <CardDescription>
            احجز طاولتك الآن واستمتع بتجربة طعام مميزة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Date and Time */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-base font-semibold mb-4 block">اختر التاريخ</Label>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date() || date > new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
                    className="rounded-md border mx-auto"
                  />
                </div>

                <div>
                  <Label className="text-base font-semibold mb-4 block">اختر الوقت</Label>
                  <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        type="button"
                        variant={selectedTime === time ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedTime(time)}
                        className="text-sm"
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="guests" className="text-base font-semibold">عدد الضيوف</Label>
                  <Select value={numberOfGuests.toString()} onValueChange={(value) => setNumberOfGuests(parseInt(value))}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="اختر عدد الضيوف" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? 'شخص' : num === 2 ? 'شخصان' : 'أشخاص'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 2: Table Selection */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-base font-semibold mb-4 block">اختر الطاولة</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {availableTables.map((table) => (
                      <Card
                        key={table.id}
                        className={`cursor-pointer transition-all ${
                          selectedTable === table.id
                            ? 'ring-2 ring-orange-500 bg-orange-50'
                            : 'hover:shadow-md'
                        }`}
                        onClick={() => setSelectedTable(table.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold">طاولة {table.number}</h3>
                              <p className="text-sm text-gray-600">السعة: {table.capacity} أشخاص</p>
                            </div>
                            <Badge className={table.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                              {table.isAvailable ? 'متاحة' : 'محجوزة'}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>{table.location}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  {availableTables.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-500">لا توجد طاولات متاحة للعدد المحدد من الضيوف</p>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={prevStep}
                        className="mt-4"
                      >
                        العودة وتعديل عدد الضيوف
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Contact Information */}
            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-base font-semibold">الاسم *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-base font-semibold">رقم الهاتف *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-base font-semibold">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="specialRequests" className="text-base font-semibold">طلبات خاصة</Label>
                  <Textarea
                    id="specialRequests"
                    value={formData.specialRequests}
                    onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                    placeholder="أي طلبات خاصة للحجز..."
                    rows={3}
                  />
                </div>

                {/* Reservation Summary */}
                <Card className="bg-gray-50">
                  <CardHeader>
                    <CardTitle className="text-lg">ملخص الحجز</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">التاريخ:</span>
                        <span>{selectedDate?.toLocaleDateString('ar-SA')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">الوقت:</span>
                        <span>{selectedTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">عدد الضيوف:</span>
                        <span>{numberOfGuests} أشخاص</span>
                      </div>
                      {selectedTable && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">الطاولة:</span>
                          <span>طاولة {tables.find(t => t.id === selectedTable)?.number}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={step === 1 ? onCancel : prevStep}
              >
                {step === 1 ? 'إلغاء' : 'السابق'}
              </Button>
              
              <div className="flex gap-2">
                {step < 3 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={
                      (step === 1 && !isStep1Complete) ||
                      (step === 2 && !isStep2Complete)
                    }
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    التالي
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={!isStep3Complete || isSubmitting}
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    {isSubmitting ? 'جاري الحجز...' : 'تأكيد الحجز'}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}