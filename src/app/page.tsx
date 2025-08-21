'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, MapPin, Phone, Utensils, Users } from 'lucide-react';
import MenuSystem from '@/components/MenuSystem';
import ReservationSystem from '@/components/ReservationSystem';

export default function Home() {
  const [activeTab, setActiveTab] = useState('menu');

  const featuredDishes = [
    {
      id: 1,
      name: 'برجر لحم خاص',
      description: 'برجر لحم بقري طازج مع صلصة خاصة وخضروات طازجة',
      price: '45 ريال',
      image: '/api/placeholder/300/200',
      rating: 4.8,
      category: 'مقبلات'
    },
    {
      id: 2,
      name: 'بيتزا مارغريتا',
      description: 'بيتزا إيطالية أصلية مع صلصة الطماطم وجبنة الموزاريلا',
      price: '38 ريال',
      image: '/api/placeholder/300/200',
      rating: 4.6,
      category: 'مقبلات'
    },
    {
      id: 3,
      name: 'سلطة قيصر',
      description: 'سلطة طازجة مع صلصة قيصر وخبز المحمص',
      price: '25 ريال',
      image: '/api/placeholder/300/200',
      rating: 4.5,
      category: 'سلطات'
    },
    {
      id: 4,
      name: 'تشيز كيك',
      description: 'تشيز كيك كريمي مع توت طازج',
      price: '28 ريال',
      image: '/api/placeholder/300/200',
      rating: 4.9,
      category: 'حلويات'
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: 'أحمد محمد',
      rating: 5,
      comment: 'أفضل مطعم في المدينة! الطعام لذيذ والخدمة ممتازة',
      date: 'منذ أسبوع'
    },
    {
      id: 2,
      name: 'فاطمة علي',
      rating: 4,
      comment: 'تجربة رائعة، سأعود مرة أخرى بالتأكيد',
      date: 'منذ أسبوعين'
    },
    {
      id: 3,
      name: 'محمد سالم',
      rating: 5,
      comment: 'الأطباق شهية والأسعار معقولة جداً',
      date: 'منذ شهر'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-40 z-10"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/api/placeholder/1920/1080')" }}
        ></div>
        
        <div className="relative z-20 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            مطعمنا المميز
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            تجربة طعام استثنائية مع أطباق شهية من حول العالم
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg">
              اطلب الآن
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-500 px-8 py-3 text-lg">
              احجز طاولة
            </Button>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="sticky top-0 z-40 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center">
            <div className="flex space-x-1 rtl:space-x-reverse">
              <Button
                variant={activeTab === 'menu' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('menu')}
                className="px-6 py-3 text-lg"
              >
                القائمة والطلب
              </Button>
              <Button
                variant={activeTab === 'reservation' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('reservation')}
                className="px-6 py-3 text-lg"
              >
                حجز الطاولات
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Content */}
      <section className="py-20 px-4 bg-white">
        {activeTab === 'menu' ? <MenuSystem /> : <ReservationSystem />}
      </section>

      {/* Featured Dishes */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">أطباقنا المميزة</h2>
            <p className="text-xl text-gray-600">اكتشف تشكيلتنا المختارة من الأطباق الشهية</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDishes.map((dish) => (
              <Card key={dish.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="h-48 bg-gray-200 relative">
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                      {dish.category}
                    </Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{dish.name}</CardTitle>
                  <CardDescription>{dish.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-orange-600">{dish.price}</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-gray-600">{dish.rating}</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4 bg-orange-500 hover:bg-orange-600">
                    أضف إلى السلة
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-orange-50 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">قصتنا</h2>
              <p className="text-lg text-gray-600 mb-6">
                نحن مطعم عائلي تأسس في عام 2020، نقدم أطباقاً متنوعة تجمع بين الأصالة والحداثة. 
                نستخدم أجود المكونات الطازجة لضمان تقديم أفضل تجربة طعام لعملائنا.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                فريقنا من الطهاة المحترفين يعمل بجد لإبتكار أطباق جديدة تلبي أذواق الجميع، 
                مع الحفاظ على أعلى معايير الجودة والنظافة.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">500+</div>
                  <div className="text-gray-600">طبق مميز</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">50K+</div>
                  <div className="text-gray-600">عميل سعيد</div>
                </div>
              </div>
            </div>
            <div className="h-96 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </section>

      {/* Info Cards */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardHeader>
                <Clock className="w-12 h-12 mx-auto text-orange-500 mb-4" />
                <CardTitle>ساعات العمل</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  الأحد - الخميس<br />
                  11:00 ص - 11:00 م<br />
                  الجمعة - السبت<br />
                  12:00 م - 12:00 ص
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <MapPin className="w-12 h-12 mx-auto text-orange-500 mb-4" />
                <CardTitle>الموقع</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  شارع الملك فهد<br />
                  حي النخيل<br />
                  الرياض، المملكة العربية السعودية
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Phone className="w-12 h-12 mx-auto text-orange-500 mb-4" />
                <CardTitle>اتصل بنا</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  920000123<br />
                  info@restaurant.com<br />
                  متوفر على واتساب
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Utensils className="w-12 h-12 mx-auto text-orange-500 mb-4" />
                <CardTitle>الخدمات</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  توصيل للمنزل<br />
                  حجز طاولات<br />
                  مناسبات خاصة
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-orange-50 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">آراء عملائنا</h2>
            <p className="text-xl text-gray-600">ماذا يقول عملاؤنا عن تجربتهم معنا</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="text-center">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-5 h-5 ${i < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <CardTitle>{testimonial.name}</CardTitle>
                  <CardDescription>{testimonial.date}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 italic">"{testimonial.comment}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-orange-500 to-red-500">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6">جاهز لتجربة مميزة؟</h2>
          <p className="text-xl mb-8 opacity-90">
            اطلق العنان لذوقك واستمتع بأطباقنا الشهية
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-orange-500 hover:bg-gray-100 px-8 py-3 text-lg">
              اطلق العنان للقائمة
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-500 px-8 py-3 text-lg">
              احجز الآن
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}