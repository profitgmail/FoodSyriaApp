# FoodSyriaApp

🍽️ تطبيق مطعم متكامل يشبه foodtimeasia، مبني باستخدام Next.js 15 وSupabase.

## ✨ المميزات

- 📱 **واجهة مستخدم متجاوبة** - تصميم عصري يعمل على جميع الأجهزة
- 🛒 **نظام طلبات الطعام** - قائمة كاملة مع سلة تسوق ودفع
- 🪑 **نظام حجز الطاولات** - حجز الطاولات مع اختيار التاريخ والوقت
- 👤 **نظام المستخدمين** - تسجيل، دخول، لوحة تحكم شخصية
- 🔐 **مصادقة آمنة** - باستخدام Supabase Auth
- 🗄️ **قاعدة بيانات قوية** - Supabase PostgreSQL مع RLS
- 🎨 **تصميم عربي** - دعم كامل للغة العربية وRTL

## 🛠️ التقنيات المستخدمة

### الواجهة الأمامية
- **⚡ Next.js 15** - مع App Router
- **📘 TypeScript** - برمجة نوعية آمنة
- **🎨 Tailwind CSS** - إطار عمل CSS
- **🧩 shadcn/ui** - مكونات واجهة عالية الجودة

### الخلفية والبيانات
- **🗄️ Supabase** - قاعدة بيانات PostgreSQL + مصادقة + تخزين
- **🔐 Supabase Auth** - نظام مصادقة متكامل
- **📊 Real-time** - تحديثات فورية

## 🚀 البدء السريع

### المتطلبات
- Node.js 18+
- npm أو yarn

### التثبيت
```bash
# استنساخ المستودع
git clone https://github.com/profitgmail/FoodSyriaApp.git
cd FoodSyriaApp

# تثبيت الاعتماديات
npm install

# إعداد متغيرات البيئة
cp .env.example .env.local
# قم بتحديث المتغيرات في .env.local بمعلومات Supabase الخاصة بك

# تشغيل خادم التطوير
npm run dev
```

### متغيرات البيئة
أنشئ ملف `.env.local` وأضف المتغيرات التالية:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# NextAuth Configuration
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your_nextauth_secret_key

# Database Configuration
DATABASE_URL=your_database_url
DIRECT_URL=your_direct_database_url
```

## 📁 هيكل المشروع

```
src/
├── app/                    # صفحات Next.js App Router
│   ├── api/               # واجهات برمجية API
│   ├── page.tsx           # الصفحة الرئيسية
│   └── layout.tsx         # التخطيط العام
├── components/            # المكونات القابلة لإعادة الاستخدام
│   ├── ui/               # مكونات shadcn/ui
│   ├── MenuSystem.tsx    # نظام القائمة والطلبات
│   ├── ReservationSystem.tsx # نظام الحجوزات
│   ├── AuthModal.tsx     # نافذة المصادقة
│   └── UserDashboard.tsx  # لوحة تحكم المستخدم
├── hooks/                 # Hooks مخصصة
│   ├── useAuth.ts        # hook المصادقة
│   └── use-toast.ts      # hook الإشعارات
└── lib/                   # الدوال المساعدة والإعدادات
    ├── supabase.ts       # إعدادات Supabase
    ├── db.ts             # إعدادات قاعدة البيانات
    └── utils.ts          # دوال مساعدة
```

## 🎯 الميزات الرئيسية

### نظام الطلبات
- 📋 عرض القائمة مع الفئات
- 🔍 البحث والتصفية
- 🛒 سلة التسوق
- 💳 نموذج الطلب
- 📧 تأكيد الطلب

### نظام الحجوزات
- 🪑 اختيار الطاولة
- 📅 اختيار التاريخ والوقت
- 📝 نموذج الحجز
- ✅ تأكيد الحجز
- 📊 عرض الحجوزات السابقة

### لوحة تحكم المستخدم
- 👤 معلومات المستخدم
- 📜 تاريخ الطلبات
- 📅 تاريخ الحجوزات
- ⭐ التقييمات
- 📊 الإحصائيات

## 🚀 النشر

### بيئة التطوير
```bash
npm run dev
```

### بناء المشروع
```bash
npm run build
```

### بدء الخادم
```bash
npm start
```

## 🔧 الأوامر المتاحة

```bash
# تشغيل خادم التطوير
npm run dev

# بناء المشروع للإنتاج
npm run build

# بدء خادم الإنتاج
npm start

# فحص جودة الكود
npm run lint

# تهيئة قاعدة البيانات
npm run db:push
```

## 📝 التوثيق

- [توثيق المرحلة 1](التوثيق/مرحلة_1_2025-08-21_15-30-00.md)
- [توثيق المرحلة 2](التوثيق/مرحلة_2_2025-08-21_15-30-00.md)
- [برومبت التسليم](برومبت_تسليم_مفصل_للوكيل_الوكيل_الثاني.md)

## 🤝 المساهمة

1. Fork المشروع
2. أنشئ فرعًا جديدًا (`git checkout -b feature/AmazingFeature`)
3. قم بالتغييرات (`git commit -m 'Add some AmazingFeature'`)
4. ادفع الفرع (`git push origin feature/AmazingFeature`)
5. افتح Pull Request

## 📄 الرخصة

هذا المشروع مرخص تحت رخصة MIT - انظر ملف [LICENSE](LICENSE) للتفاصيل.

## 🙏 الشكر

- [Next.js](https://nextjs.org/) - إطار العمل React
- [Supabase](https://supabase.com/) - منصة Backend كخدمة
- [Tailwind CSS](https://tailwindcss.com/) - إطار عمل CSS
- [shadcn/ui](https://ui.shadcn.com/) - مكونات واجهة

---

**مبني بـ ❤️ لمجتمع المطورين**