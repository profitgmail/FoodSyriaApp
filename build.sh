#!/bin/bash

# سكريبت بناء محسن لـ Vercel
echo "🚀 بدء عملية البناء لـ Vercel..."

# 1. تثبيت الاعتماديات
echo "📦 تثبيت الاعتماديات..."
npm install

# 2. توليد Prisma Client
echo "🔧 توليد Prisma Client..."
npm run db:generate

# 3. التحقق من صحة قاعدة البيانات (اختياري)
echo "🔍 التحقق من صحة قاعدة البيانات..."
if [ -n "$DATABASE_URL" ]; then
    npm run db:push
fi

# 4. بناء التطبيق
echo "🏗️ بناء التطبيق..."
npm run build

# 5. تنظيف الملفات المؤقتة
echo "🧹 تنظيف الملفات المؤقتة..."
rm -rf .next/cache

echo "✅ اكتملت عملية البناء بنجاح!"