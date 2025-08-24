# هيكل المشروع - FoodSyriaApp

## نظرة عامة على الهيكل

يتبع FoodSyriaApp هيكلًا تنظيميًا قياسيًا لمشاريع Next.js الحديثة، مع تقسيم واضح للمسؤوليات وتنظيم الملفات لتسهيل الصيانة والتطوير.

```
FoodSyriaApp/
├── src/                           # المجلد الرئيسي للمصدر
│   ├── app/                       # صفحات Next.js (App Router)
│   │   ├── api/                   # API Routes
│   │   │   └── health/            # نقطة نهاية للتحقق من الصحة
│   │   │       └── route.ts       # معالج طلب الصحة
│   │   ├── layout.tsx             # التخطيط الرئيسي للموقع
│   │   ├── page.tsx               # الصفحة الرئيسية
│   │   └── globals.css            # الأنماط العامة
│   ├── components/                # مكونات React
│   │   ├── ui/                    # مكونات shadcn/ui
│   │   │   ├── accordion.tsx      # مكون الأكورديون
│   │   │   ├── alert-dialog.tsx   # مربع حوار التنبيه
│   │   │   ├── alert.tsx          # مكون التنبيه
│   │   │   ├── avatar.tsx         # مكون الصورة الرمزية
│   │   │   ├── badge.tsx          # مكون الشارة
│   │   │   ├── breadcrumb.tsx     # مكون فتات الخبز
│   │   │   ├── button.tsx         # مكون الزر
│   │   │   ├── calendar.tsx       # مكون التقويم
│   │   │   ├── card.tsx           # مكون البطاقة
│   │   │   ├── carousel.tsx       # مكون العرض الدائري
│   │   │   ├── checkbox.tsx       # مكون مربع الاختيار
│   │   │   ├── collapsible.tsx    # مكون القابل للطي
│   │   │   ├── command.tsx        # مكون الأوامر
│   │   │   ├── context-menu.tsx   # مكون قائمة السياق
│   │   │   ├── dialog.tsx         # مربع الحوار
│   │   │   ├── drawer.tsx         # مكون الدرج
│   │   │   ├── dropdown-menu.tsx  # مكون القائمة المنسدلة
│   │   │   ├── form.tsx           # مكون النموذج
│   │   │   ├── hover-card.tsx     # مكون البطاقة العائمة
│   │   │   ├── input-otp.tsx      # مكون إدخال OTP
│   │   │   ├── input.tsx          # مكون إدخال النص
│   │   │   ├── label.tsx          # مكون التسمية
│   │   │   ├── menubar.tsx        # مكون شريط القوائم
│   │   │   ├── navigation-menu.tsx # مكون قائمة التنقل
│   │   │   ├── pagination.tsx    # مكون الترقيم
│   │   │   ├── popover.tsx        # مكون النافذة المنبثقة
│   │   │   ├── progress.tsx       # مكون شريط التقدم
│   │   │   ├── radio-group.tsx    # مكون مجموعة الراديو
│   │   │   ├── resizable.tsx      # مكون القابل للتحجيم
│   │   │   ├── scroll-area.tsx    # مكون منطقة التمرير
│   │   │   ├── select.tsx         # مكون الاختيار
│   │   │   ├── separator.tsx      # مكون الفاصل
│   │   │   ├── sheet.tsx          # مكون الورقة
│   │   │   ├── skeleton.tsx       # مكون الهيكل العظمي
│   │   │   ├── slider.tsx         # مكون شريط التمرير
│   │   │   ├── sonner.tsx         # مكون الإشعارات
│   │   │   ├── switch.tsx         # مكون المفتاح
│   │   │   ├── table.tsx          # مكون الجدول
│   │   │   ├── tabs.tsx           # مكون علامات التبويب
│   │   │   ├── textarea.tsx       # مكون منطقة النص
│   │   │   ├── toast.tsx          # مكون الإشعارات المنبثقة
│   │   │   ├── toggle-group.tsx   # مكون مجموعة التبديل
│   │   │   ├── toggle.tsx         # مكون التبديل
│   │   │   ├── tooltip.tsx        # مكون التلميح
│   │   │   └── chart.tsx          # مكون الرسم البياني
│   │   ├── MenuSystem.tsx         # نظام قوائم الطعام
│   │   ├── OrderForm.tsx          # نموذج الطلبات
│   │   ├── OrderConfirmation.tsx  # صفحة تأكيد الطلب
│   │   ├── ReservationForm.tsx    # نموذج الحجوزات
│   │   ├── ReservationConfirmation.tsx # صفحة تأكيد الحجز
│   │   └── ReservationSystem.tsx  # نظام الحجوزات
│   ├── hooks/                     # React Hooks مخصصة
│   │   ├── use-mobile.ts          # Hook للكشف عن الأجهزة المحمولة
│   │   └── use-toast.ts           # Hook للإشعارات
│   └── lib/                       # مكتبات مساعدة
│       ├── db.ts                  # إعدادات قاعدة البيانات (Prisma)
│       ├── socket.ts              # إعدادات WebSocket
│       ├── supabase.ts            # إعدادات Supabase
│       └── utils.ts               # وظائف مساعدة
├── docs/                          # مجلد التوثيق
├── prisma/                        # Prisma ORM
│   └── schema.prisma              # مخطط قاعدة البيانات
├── public/                        # ملفات عامة
│   ├── favicon.ico                # أيقونة الموقع
│   ├── logo.svg                   # شعار الموقع
│   └── robots.txt                 # إعدادات محركات البحث
├── db/                            # ملفات قاعدة البيانات المحلية
│   └── custom.db                  # قاعدة البيانات المحلية
├── examples/                      # أمثلة استخدام
│   └── websocket/                 # مثال WebSocket
│       └── page.tsx               # صفحة مثال WebSocket
├── components.json                # إعدادات shadcn/ui
├── eslint.config.mjs              # إعدادات ESLint
├── next.config.ts                 # إعدادات Next.js
├── package.json                   # معلومات الحزم والاعتماديات
├── package-lock.json              # قفل إصدارات الحزم
├── postcss.config.mjs             # إعدادات PostCSS
├── server.ts                      # خادم مخصص (اختياري)
├── tailwind.config.ts             # إعدادات Tailwind CSS
└── tsconfig.json                  # إعدادات TypeScript
```

## شرح تفصيلي للمجلدات والملفات

### 1. مجلد `src/` - المصدر الرئيسي

#### `src/app/` - صفحات Next.js (App Router)
- **`layout.tsx`**: التخطيط الرئيسي للموقع، يحتوي على الهيكل الأساسي، التنقل، والأنماط العامة
- **`page.tsx`**: الصفحة الرئيسية للموقع، تحتوي على المحتوى الرئيسي والمكونات
- **`globals.css`**: الأنماط العامة للموقع، يستخدم Tailwind CSS
- **`api/`**: نقاط نهاية API
  - **`health/route.ts`**: نقطة نهاية للتحقق من صحة الخادم

#### `src/components/` - مكونات React
- **`ui/`**: مكونات shadcn/ui الجاهزة، جميعها مكونات قابلة لإعادة الاستخدام
- **المكونات المخصصة**:
  - **`MenuSystem.tsx`**: نظام قوائم الطعام التفاعلي، يعرض الأصناف والأطباق
  - **`OrderForm.tsx`**: نموذج إضافة الطلبات إلى سلة التسوق
  - **`OrderConfirmation.tsx`**: صفحة تأكيد الطلب بعد الإتمام
  - **`ReservationForm.tsx`**: نموذج حجز الطاولات
  - **`ReservationConfirmation.tsx`**: صفحة تأكيد الحجز
  - **`ReservationSystem.tsx`**: نظام إدارة الحجوزات الشامل

#### `src/hooks/` - React Hooks مخصصة
- **`use-mobile.ts`**: Hook للكشف عن حجم الشاشة والأجهزة المحمولة
- **`use-toast.ts`**: Hook لإدارة الإشعارات المنبثقة

#### `src/lib/` - مكتبات مساعدة
- **`db.ts`**: إعدادات Prisma ORM للتعامل مع قاعدة البيانات
- **`socket.ts`**: إعدادات WebSocket للاتصالات الفورية
- **`supabase.ts`**: إعدادات Supabase client، مفصولة بين العميل والخادم
- **`utils.ts`**: وظائف مساعدة عامة مثل `cn()` لدمج فئات Tailwind

### 2. مجلد `prisma/` - Prisma ORM
- **`schema.prisma`**: مخطط قاعدة البيانات، يحتوي على تعريف الجداول والعلاقات

### 3. مجلد `public/` - ملفات عامة
- **`favicon.ico`**: أيقونة الموقع التي تظهر في المتصفح
- **`logo.svg`**: شعار الموقع بصيغة SVG
- **`robots.txt`**: إعدادات لمحركات البحث للتحكم في الفهرسة

### 4. مجلد `examples/` - أمثلة استخدام
- **`websocket/page.tsx`**: صفحة مثال لاستخدام WebSocket في التطبيق

### 5. ملفات الإعدادات الرئيسية
- **`components.json`**: إعدادات shadcn/ui، يحدد الأنماط والمسارات
- **`eslint.config.mjs`**: إعدادات ESLint للتحقق من جودة الكود
- **`next.config.ts`**: إعدادات Next.js المتقدمة
- **`package.json`**: معلومات المشروع والاعتماديات
- **`postcss.config.mjs`**: إعدادات PostCSS لمعالجة CSS
- **`tailwind.config.ts`**: إعدادات Tailwind CSS
- **`tsconfig.json`**: إعدادات TypeScript

## تدفق البيانات والعلاقات

### 1. تدفق البيانات من قاعدة البيانات
```
Supabase/PostgreSQL ← Prisma ← src/lib/db.ts ← المكونات
```

### 2. تدفق البيانات من Supabase
```
Supabase ← src/lib/supabase.ts ← المكونات
```

### 3. هيكل المكونات
```
الصفحة الرئيسية (page.tsx)
├── MenuSystem.tsx
├── ReservationSystem.tsx
├── OrderForm.tsx
└── المكونات الأخرى
```

### 4. العلاقة بين الملفات
- **الصفحات** تستخدم **المكونات**
- **المكونات** تستخدم **الـ Hooks** و **المكتبات**
- **المكتبات** تتصل بـ **قاعدة البيانات** و **Supabase**
- **الإعدادات** تتحكم في سلوك **التطبيق**

## قواعد تنظيم الملفات

### 1. تسمية الملفات
- استخدم PascalCase للمكونات (مثال: `MenuSystem.tsx`)
- استخدم camelCase للـ Hooks (مثال: `useMobile.ts`)
- استخدم kebab-case للمجلدات (مثال: `api-routes`)

### 2. تنظيم المكونات
- ضع المكونات العامة في `src/components/ui/`
- ضع المكونات الخاصة بالصفحات في `src/components/`
- استخدم المجلدات لتجميع المكونات ذات الصلة

### 3. تنظيم المكتبات
- ضع المكتبات العامة في `src/lib/`
- استخدم ملفات منفصلة لكل وظيفة رئيسية
- حافظ على المكتبات صغيرة ومركزة

### 4. تنظيم الصفحات
- استخدم App Router في `src/app/`
- ضع صفحات API في `src/app/api/`
- استخدم ملف `layout.tsx` للتخطيط المشترك

## أفضل الممارسات

### 1. هيكل المكونات
- اجعل المكونات صغيرة ومركزة على وظيفة واحدة
- استخدم Props بشكل فعال لتمرير البيانات
- استخدم TypeScript للتحقق من الأنواع

### 2. إدارة الحالة
- استخدم React Hooks لإدارة الحالة المحلية
- استخدم Zustand أو Redux للحالة العامة (إذا لزم الأمر)
- استخدم TanStack Query لبيانات الخادم

### 3. الأنماط
- استخدم Tailwind CSS للتنسيق
- استخدم shadcn/ui للمكونات الجاهزة
- حافظ على تناسق الألوان والتصميم

### 4. الأداء
- استخدم Dynamic Import للمكونات الكبيرة
- استخدم Memoization للمكونات البطيئة
- استخدم Image Optimization للصور

---

**ملاحظة**: هذا الهيكل مصمم ليكون قابلاً للتوسع والصيانة. أي إضافات جديدة يجب أن تتبع نفس النمط التنظيمي.

**تاريخ التحديث**: 21 أغسطس 2025  
**المسؤول**: فريق تطوير FoodSyriaApp