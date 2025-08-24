# 🍽️ FoodSyriaApp - مطعم متكامل

تطبيق مطعم احترافي متكامل مبني بأحدث التقنيات، جاهز 100% للإنتاج والنشر.

## ✨ الميزات الرئيسية

### 🍽️ نظام المطعم
- **قائمة طعام كاملة** - 38 عنصرًا حقيقيًا في 8 فئات
- **نظام الحجوزات** - حجز طاولات بسهولة
- **نظام الطلبات** - طلب الطعام عبر الإنترنت
- **سلة تسوق احترافية** - واجهة سحابية متقدمة

### 🎁 برنامج الولاء
- **5 مستويات عضوية** - من البرونزي إلى الماسي
- **نظام نقاط** - كسب النقاط مع كل طلب
- **مكافآت قابلة للاستبدال** - خصومات وعروض خاصة

### ⭐ التقييمات والتعليقات
- **نظام تقييم خماسي النجوم**
- **تعليقات النصية**
- **منع التقييمات المكررة**

### 🔐 المصادقة والأمان
- **تسجيل الدخول والتسجيل**
- **لوحة تحكم المستخدم**
- **نظام الدفع الآمن**

## 🚀 التقنيات المستخدمة

### 🎯 الإطار الأساسي
- **Next.js 15** - مع App Router
- **TypeScript 5** - برمجة نوعية آمنة
- **Tailwind CSS 4** - تصميم عصري
- **shadcn/ui** - مكونات عالية الجودة

### 🗄️ قاعدة البيانات والخلفية
- **Prisma ORM** - إدارة قاعدة البيانات
- **Supabase** - قاعدة بيانات PostgreSQL
- **NextAuth.js** - نظام المصادقة
- **Stripe** - نظام الدفع

### 🎨 واجهة المستخدم
- **Framer Motion** - رسوم متحركة سلسة
- **Lucide React** - أيقونات جميلة
- **React Hook Form** - نماذج متقدمة
- **Zod** - تحقق من البيانات

## 📦 التثبيت والتشغيل

### المتطلبات
- Node.js 18+
- npm أو yarn
- حساب Supabase

### الخطوات

1. **استنساخ المشروع**
```bash
git clone https://github.com/profitgmail/FoodSyriaApp.git
cd FoodSyriaApp
```

2. **تثبيت الاعتماديات**
```bash
npm install
```

3. **إعداد متغيرات البيئة**
أنشئ ملف `.env.local` بالمحتوى التالي:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
DATABASE_URL=your_database_url
DIRECT_URL=your_direct_url
```

4. **تهيئة قاعدة البيانات**
```bash
npm run db:push
npm run db:seed
```

5. **تشغيل خادم التطوير**
```bash
npm run dev
```

افتح [http://localhost:3000](http://localhost:3000) لعرض التطبيق.

## 🚀 النشر على Vercel

### الإعداد المسبق
1. **توصيل المستودع** - ربط GitHub مع Vercel
2. **إضافة متغيرات البيئة** في Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXTAUTH_SECRET`
   - `DATABASE_URL`
   - `DIRECT_URL`

### حل مشاكل Prisma في Vercel
تم إعداد المشروع بالفعل لحل مشاكل Prisma في Vercel:

- **`vercel.json`** - تكوين البناء المخصص
- **`next.config.ts`** - تحسينات الأداء
- **`package.json`** - سكريبتات بناء محسنة
- **`prisma/schema.prisma`** - تكوين ثنائي محسن

### أوامر البناء
```bash
# بناء محلي للاختبار
npm run build:vercel

# توليد Prisma Client
npm run db:generate

# بناء كامل
npm run build
```

## 📊 إحصائيات المشروع

- **المكونات:** 45+ مكون
- **واجهات API:** 10+ نقطة نهاية
- **أسطر الكود:** 6,000+ سطر
- **قاعدة البيانات:** 8 جداول
- **عناصر القائمة:** 38 عنصرًا

## 🎯 المراحل التطويرية

### المرحلة 1: الهيكل الأساسي ✅
- إعداد Next.js + TypeScript
- تكوين Tailwind CSS + shadcn/ui
- إنشاء الصفحات الأساسية

### المرحلة 2: المصادقة والقاعدة ✅
- إعداد NextAuth.js
- تكوين Supabase
- إنشاء قاعدة البيانات

### المرحلة 3: الميزات المتقدمة ✅
- لوحة تحكم المستخدم
- نظام الدفع
- الإشعارات

### المرحلة 4: الإكمال والجاهزية ✅
- قائمة طعام حقيقية
- سلة تسوق احترافية
- نظام التقييمات
- برنامج الولاء
- تحسينات SEO والأداء

## 🔧 المشاكل الشائعة والحلول

### Prisma Client Initialization Error
إذا واجهت خطأ `PrismaClientInitializationError` في Vercel:

1. **تأكد من متغيرات البيئة** صحيحة
2. **تحقق من سكريبت البناء** يتضمن `prisma generate`
3. **أعد النشر** بعد تحديث الإعدادات

### مشاكل التخزين المؤقت
```bash
# تنظيف ذاكرة التخزين المؤقت
rm -rf .next
npm run build
```

## 📄 التوثيق

- [دليل المستخدم](./docs/user-guide.md)
- [دليل المطور](./docs/developer-guide.md)
- [مرجع API](./docs/api-reference.md)

## 🤝 المساهمة

1. Fork المشروع
2. إنشاء فرع ميزة (`git checkout -b feature/AmazingFeature`)
3. Commit التغييرات (`git commit -m 'Add some AmazingFeature'`)
4. Push إلى الفرع (`git push origin feature/AmazingFeature`)
5. افتح Pull Request

## 📄 الرخصة

هذا المشروع مرخص تحت رخصة MIT - انظر ملف [LICENSE](LICENSE) للتفاصيل.

## 🙏 الشكر والتقدير

- **Next.js** - إطار العمل الرائع
- **Supabase** - قاعدة البيانات كخدمة
- **shadcn/ui** - المكونات الجميلة
- **Vercel** - منصة النشر الممتازة

---

مبني ب ❤️ لمجتمع المطورين. مدعوم من [Z.ai](https://chat.z.ai) 🚀
