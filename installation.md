# دليل التثبيت والإعداد - FoodSyriaApp

## المتطلبات الأساسية

قبل البدء، تأكد من توفر المتطلبات التالية في نظامك:

### البرامج المطلوبة
- **Node.js**: الإصدار 18 أو أحدث
- **npm**: الإصدار 8 أو أحدث (يأتي مع Node.js)
- **Git**: للتحكم في الإصدارات

### المتطلبات الخارجية
- **حساب Supabase**: لقاعدة البيانات والخدمات الخلفية
- **حساب GitHub**: للمستودع البرمجي
- **محرر أكواد**: VS Code أو أي محرر آخر

---

## خطوات التثبيت

### 1. استنساخ المستودع

```bash
# استنساخ المستودع من GitHub
git clone https://github.com/profitgmail/FoodSyriaApp.git

# الدخول إلى مجلد المشروع
cd FoodSyriaApp
```

### 2. تثبيت الاعتماديات

```bash
# تثبيت جميع الحزم المطلوبة
npm install
```

هذا الأمر سيقوم بتثبيت:
- Next.js 15 والإطار المرتبط به
- TypeScript
- shadcn/ui و Tailwind CSS
- Supabase client
- Prisma ORM
- جميع الحزم الأخرى المذكورة في package.json

### 3. إعداد متغيرات البيئة

#### إنشاء ملف البيئة
```bash
# إنشاء ملف متغيرات البيئة
touch .env.local
```

#### إضافة متغيرات البيئة
انسخ المحتوى التالي إلى ملف `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://hoeayddzdrkyluxyoknu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvZWF5ZGR6ZHJreWx1eHlva251Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3NzkxMzgsImV4cCI6MjA3MTM1NTEzOH0.1DQv_neLogOYvt-_zVtjkYTC_qGDiDuBC9smSPHB_x8
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvZWF5ZGR6ZHJreWx1eHlva251Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTc3OTEzOCwiZXhwIjoyMDcxMzU1MTM4fQ.PxEnqU50mM9E78w2C8wYLvxJUwKrSooI6T1cuYFkpHw

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# Database Configuration (for Prisma)
DATABASE_URL="postgresql://postgres.hoeayddzdrkyluxyoknu:[YOUR-PASSWORD]@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.hoeayddzdrkyluxyoknu:[YOUR-PASSWORD]@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres"
```

**ملاحظة**: استبدل `[YOUR-PASSWORD]` بكلمة مرور قاعدة البيانات الفعلية.

### 4. إعداد قاعدة البيانات

#### تثبيت Prisma CLI
```bash
npm install prisma --save-dev
```

#### توليد Prisma Client
```bash
npx prisma generate
```

#### دفع المخطط إلى قاعدة البيانات
```bash
npx prisma db push
```

### 5. تشغيل المشروع

#### بيئة التطوير
```bash
npm run dev
```

سيتم تشغيل الخادم على `http://localhost:3000`

#### بناء المشروع للإنتاج
```bash
npm run build
```

#### تشغيل المشروع في بيئة الإنتاج
```bash
npm start
```

---

## التحقق من التثبيت

### 1. التحقق من تشغيل الخادم
افحص المتصفح على `http://localhost:3000` - يجب أن ترى صفحة FoodSyriaApp الرئيسية.

### 2. التحقق من اتصال قاعدة البيانات
```bash
npx prisma studio
```
سيتم فتح Prisma Studio على `http://localhost:5555` للتحقق من جداول قاعدة البيانات.

### 3. التحقق من Supabase
```bash
# اختبار اتصال Supabase
npm run test:supabase
```

---

## المشاكل الشائعة والحلول

### 1. مشكلة في تثبيت الاعتماديات
```bash
# تنظيف ذاكرة التخزين المؤقت
npm cache clean --force

# حذف node_modules وإعادة التثبيت
rm -rf node_modules package-lock.json
npm install
```

### 2. مشكلة في متغيرات البيئة
تأكد من:
- أن ملف `.env.local` موجود في جذر المشروع
- أن جميع المتغيرات مكتوبة بشكل صحيح
- أنك أعدت تشغيل خادم التطوير بعد تعديل المتغيرات

### 3. مشكلة في اتصال قاعدة البيانات
تأكد من:
- أن متغيرات `DATABASE_URL` و `DIRECT_URL` صحيحة
- أن كلمة المرور صحيحة
- أن قاعدة البيانات متاحة عبر الإنترنت

### 4. مشكلة في Prisma
```bash
# إعادة توليد Prisma Client
npx prisma generate

# إعادة دفع المخطط
npx prisma db push

# التحقق من حالة قاعدة البيانات
npx prisma db status
```

---

## إعداد بيئة التطوير

### VS Code Extensions الموصى بها
- **ESLint**: للتحقق من جودة الكود
- **Prettier**: لتنسيق الكود
- **Prisma**: لدعم Prisma
- **Tailwind CSS IntelliSense**: لدعم Tailwind
- **TypeScript Vue Plugin (Volar)**: لدعم TypeScript

### إعدادات VS Code
أنشئ ملف `.vscode/settings.json`:
```json
{
  "typescript.preferences.preferTypeOnlyAutoImports": true,
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

---

## النشر

### النشر على Vercel
1. ادفع المشروع إلى GitHub
2. اتصل بمستودع GitHub في Vercel
3. أضف متغيرات البيئة في Vercel
4. انشر المشروع

### متغيرات البيئة للنشر
تأكد من إضافة جميع المتغيرات من `.env.local` إلى بيئة النشر.

---

## الدعم

إذا واجهت أي مشاكل أثناء التثبيت:
1. راجع قسم "المشاكل الشائعة والحلول"
2. تحقق من [open_issues.md](docs/open_issues.md)
3. افتح issue في GitHub
4. تواصل مع فريق الدعم: profit1993house@gmail.com

---

**تاريخ التحديث**: 21 أغسطس 2025  
**الإصدار**: 2.0.0