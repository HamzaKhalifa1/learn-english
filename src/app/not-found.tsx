import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <div className="text-7xl mb-6">🔍</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">الصفحة غير موجودة</h1>
        <p className="text-gray-400 mb-6">لم نتمكن من إيجاد الصفحة التي تبحث عنها</p>
        <Link href="/" className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}
