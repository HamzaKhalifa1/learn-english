/**
 * Comprehensive Semantic Visual Atlas for English Vocabulary
 * Maps words directly to context-accurate photography and distinct semantic emoji.
 */

export interface WordVisual {
  imageUrl: string;
  emoji: string;
  gradient: string;
  altText: string;
}

export const CURATED_WORD_VISUALS: Record<string, WordVisual> = {
  // ─── A1 & Everyday Core ───────────────────────────────────────────────────
  'friend': {
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
    emoji: '🫂',
    gradient: 'from-teal-500 to-cyan-700',
    altText: 'أصدقاء سعداء يبتسمون ويتعانقون بود'
  },
  'family': {
    imageUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=800&q=80',
    emoji: '👨‍👩‍👧‍👦',
    gradient: 'from-rose-500 to-pink-700',
    altText: 'عائلة سعيدة متجمعة بمحبة'
  },
  'house': {
    imageUrl: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80',
    emoji: '🏡',
    gradient: 'from-blue-600 to-teal-800',
    altText: 'منزل حديث وأنيق مع حديقة'
  },
  'water': {
    imageUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80',
    emoji: '💧',
    gradient: 'from-cyan-500 to-blue-700',
    altText: 'كوب ماء نقي ومنعش'
  },
  'food': {
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
    emoji: '🍲',
    gradient: 'from-orange-500 to-amber-700',
    altText: 'وجبات وأطباق طعام لذيذة وصحية'
  },
  'book': {
    imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
    emoji: '📖',
    gradient: 'from-indigo-600 to-purple-800',
    altText: 'كتاب مفتوح للدراسة والقراءة'
  },
  'school': {
    imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
    emoji: '🏫',
    gradient: 'from-blue-500 to-indigo-700',
    altText: 'مبنى مدرسة وفناء تعليمي'
  },
  'car': {
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    emoji: '🚗',
    gradient: 'from-red-600 to-orange-700',
    altText: 'سيارة حديثة تسير على الطريق'
  },
  'day': {
    imageUrl: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=800&q=80',
    emoji: '☀️',
    gradient: 'from-amber-400 to-yellow-600',
    altText: 'شروق الشمس ونور النهار الساطع'
  },
  'night': {
    imageUrl: 'https://images.unsplash.com/photo-1507499739999-097706ad8914?auto=format&fit=crop&w=800&q=80',
    emoji: '🌙',
    gradient: 'from-indigo-950 to-slate-900',
    altText: 'سماء ليلية ساحرة مليئة بالنجوم'
  },
  'hello': {
    imageUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=800&q=80',
    emoji: '👋',
    gradient: 'from-blue-500 to-indigo-600',
    altText: 'شخص يلوح بيده مبتسماً للتحية'
  },
  'goodbye': {
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    emoji: '🛫',
    gradient: 'from-amber-500 to-orange-600',
    altText: 'وداع ومغادرة سفر'
  },
  'please': {
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    emoji: '🙏',
    gradient: 'from-purple-500 to-indigo-600',
    altText: 'طلب رجاء ولطف'
  },
  'thank you': {
    imageUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80',
    emoji: '💐',
    gradient: 'from-pink-500 to-rose-600',
    altText: 'باقة شكر وعرفان'
  },
  'sorry': {
    imageUrl: 'https://images.unsplash.com/photo-1541199249251-f713e6145474?auto=format&fit=crop&w=800&q=80',
    emoji: '🙇',
    gradient: 'from-slate-500 to-gray-700',
    altText: 'اعتذار وأسف'
  },
  'yes': {
    imageUrl: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=800&q=80',
    emoji: '👍',
    gradient: 'from-emerald-500 to-teal-600',
    altText: 'إشارة إبهام للأعلى تدل على الموافقة ونعم'
  },
  'no': {
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
    emoji: '🛑',
    gradient: 'from-rose-500 to-red-600',
    altText: 'إشارة توقف ورفض'
  },
  'help': {
    imageUrl: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=800&q=80',
    emoji: '🆘',
    gradient: 'from-red-500 to-orange-600',
    altText: 'يد تمد المساعدة للآخرين'
  },
  'good': {
    imageUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80',
    emoji: '✨',
    gradient: 'from-emerald-400 to-teal-600',
    altText: 'شيء جيد ورائع'
  },
  'bad': {
    imageUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80',
    emoji: '👎',
    gradient: 'from-gray-600 to-slate-800',
    altText: 'شيء سيء'
  },
  'happy': {
    imageUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80',
    emoji: '😊',
    gradient: 'from-yellow-400 to-amber-600',
    altText: 'وجه مبتسم وسعيد'
  },
  'sad': {
    imageUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80',
    emoji: '😢',
    gradient: 'from-blue-600 to-slate-800',
    altText: 'شخص حزين ومتأثر'
  },
  'angry': {
    imageUrl: 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&w=800&q=80',
    emoji: '😠',
    gradient: 'from-red-600 to-rose-800',
    altText: 'شخص غاضب ومنفعل'
  },
  'tired': {
    imageUrl: 'https://images.unsplash.com/photo-1511295742362-92c96b124e52?auto=format&fit=crop&w=800&q=80',
    emoji: '🥱',
    gradient: 'from-slate-500 to-indigo-800',
    altText: 'إرهاق وتعب ونعاس'
  },
  'red': {
    imageUrl: 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=800&q=80',
    emoji: '🔴',
    gradient: 'from-red-500 to-rose-700',
    altText: 'اللون الأحمر الزاهي'
  },
  'blue': {
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    emoji: '🔵',
    gradient: 'from-blue-500 to-indigo-700',
    altText: 'اللون الأزرق البحري'
  },
  'green': {
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
    emoji: '🟢',
    gradient: 'from-emerald-500 to-green-700',
    altText: 'اللون الأخضر الطبيعي'
  },
  'yellow': {
    imageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
    emoji: '🟡',
    gradient: 'from-amber-400 to-yellow-600',
    altText: 'اللون الأصفر المشرق'
  },
  'black': {
    imageUrl: 'https://images.unsplash.com/photo-1507499739999-097706ad8914?auto=format&fit=crop&w=800&q=80',
    emoji: '⚫',
    gradient: 'from-slate-800 to-black',
    altText: 'اللون الأسود الداكن'
  },
  'white': {
    imageUrl: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=800&q=80',
    emoji: '⚪',
    gradient: 'from-gray-200 to-slate-400',
    altText: 'اللون الأبيض النقي'
  },

  // ─── A2 Actions & Verbs ───────────────────────────────────────────────────
  'run': {
    imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80',
    emoji: '🏃',
    gradient: 'from-orange-500 to-red-600',
    altText: 'شخص يمارس رياضة الجري والركض'
  },
  'eat': {
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
    emoji: '🍴',
    gradient: 'from-amber-500 to-orange-700',
    altText: 'شخص يتناول وجبة طعام لذيذة'
  },
  'sleep': {
    imageUrl: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80',
    emoji: '😴',
    gradient: 'from-indigo-800 to-purple-950',
    altText: 'نوم هانئ ومريح في السرير'
  },
  'work': {
    imageUrl: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80',
    emoji: '💼',
    gradient: 'from-violet-600 to-indigo-800',
    altText: 'بيئة عمل ومكتب حديث'
  },
  'study': {
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
    emoji: '📚',
    gradient: 'from-blue-600 to-cyan-800',
    altText: 'طالب يذاكر ويدرس بتركيز'
  },
  'speak': {
    imageUrl: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?auto=format&fit=crop&w=800&q=80',
    emoji: '🗣️',
    gradient: 'from-indigo-500 to-purple-700',
    altText: 'شخص يتحدث ويلقي كلمة'
  },
  'listen': {
    imageUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80',
    emoji: '🎧',
    gradient: 'from-teal-500 to-blue-700',
    altText: 'شخص يستمع بتركيز عبر سماعات الأذن'
  },
  'write': {
    imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80',
    emoji: '✍️',
    gradient: 'from-purple-600 to-pink-700',
    altText: 'كتابة بالقلم على الورق'
  },
  'read': {
    imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
    emoji: '📖',
    gradient: 'from-blue-600 to-indigo-800',
    altText: 'قراءة كتاب بتمعن'
  },
  'play': {
    imageUrl: 'https://images.unsplash.com/photo-1511882150382-421056c89033?auto=format&fit=crop&w=800&q=80',
    emoji: '🎮',
    gradient: 'from-emerald-500 to-teal-700',
    altText: 'لعب ومرح وترفيه'
  },

  // ─── B1 Common Vocabulary ──────────────────────────────────────────────────
  'achieve': {
    imageUrl: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80',
    emoji: '🏆',
    gradient: 'from-amber-500 to-yellow-600',
    altText: 'الوصول لقمة الجبل وتحقيق النجاح'
  },
  'communicate': {
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    emoji: '💬',
    gradient: 'from-blue-500 to-indigo-600',
    altText: 'فريق عمل يتحاور ويتواصل بفاعلية'
  },
  'doctor': {
    imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
    emoji: '🩺',
    gradient: 'from-teal-600 to-blue-800',
    altText: 'طبيب فاحص يرتدي المعطف الأبيض وسماعة الكشف'
  },
  'hospital': {
    imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
    emoji: '🏥',
    gradient: 'from-blue-600 to-indigo-900',
    altText: 'مستشفى مجهز وأسرة علاجية'
  },
  'traffic': {
    imageUrl: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80',
    emoji: '🚦',
    gradient: 'from-amber-600 to-orange-800',
    altText: 'حركة مرور وازدحام سيارات في المدينة'
  },
  'travel': {
    imageUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80',
    emoji: '🧳',
    gradient: 'from-sky-500 to-blue-700',
    altText: 'حقيبة سفر واستعداد لرحلة سياحية'
  },
  'money': {
    imageUrl: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&w=800&q=80',
    emoji: '💵',
    gradient: 'from-emerald-600 to-teal-800',
    altText: 'أموال ونقود ورقية'
  },
  'time': {
    imageUrl: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=800&q=80',
    emoji: '⏰',
    gradient: 'from-amber-500 to-orange-700',
    altText: 'ساعة يد وساعة حائط تدل على الوقت'
  },
  'destination': {
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    emoji: '🏖️',
    gradient: 'from-blue-500 to-teal-600',
    altText: 'وجهة سفر سياحية خلابة على الشاطئ'
  },
  'passport': {
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    emoji: '🛂',
    gradient: 'from-indigo-600 to-blue-800',
    altText: 'جواز سفر مع تذاكر طيران'
  },
  'furniture': {
    imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
    emoji: '🛋️',
    gradient: 'from-stone-600 to-amber-800',
    altText: 'أثاث منزلي حديث وغرفة جلوس مريحة'
  },
  'wildlife': {
    imageUrl: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=800&q=80',
    emoji: '🦁',
    gradient: 'from-emerald-600 to-green-800',
    altText: 'حياة برية وحيوانات طليقة في الطبيعة'
  },
  'solar': {
    imageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
    emoji: '☀️',
    gradient: 'from-amber-500 to-yellow-600',
    altText: 'ألواح طاقة شمسية تنتج الكهرباء النظيفة'
  },
  'turbine': {
    imageUrl: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=800&q=80',
    emoji: '🌀',
    gradient: 'from-sky-500 to-blue-700',
    altText: 'توربين رياح عملاق لتوليد الطاقة'
  },
  'facade': {
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    emoji: '🏛️',
    gradient: 'from-slate-600 to-zinc-800',
    altText: 'واجهة معمارية راقية لمبنى عريق'
  },
  'integrity': {
    imageUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
    emoji: '⚖️',
    gradient: 'from-teal-600 to-emerald-800',
    altText: 'ميزان العدالة والنزاهة'
  },
  'sovereignty': {
    imageUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80',
    emoji: '🛡️',
    gradient: 'from-blue-800 to-slate-950',
    altText: 'علم ورمز السيادة الوطنية'
  },
  'genomic': {
    imageUrl: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=800&q=80',
    emoji: '🧬',
    gradient: 'from-cyan-600 to-blue-900',
    altText: 'سلسلة حمض نووي جينومية دقيقة'
  },
  'autonomous': {
    imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    emoji: '🚗',
    gradient: 'from-teal-600 to-blue-900',
    altText: 'سيارة ذاتية القيادة برادار وحساسات'
  },
  // ─── B2 Advanced Professional & Conceptual ──────────────────────────────
  'deduce': {
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
    emoji: '🔍',
    gradient: 'from-amber-600 to-stone-800',
    altText: 'عدسة مكبرة وتحليل منطقي للاستنتاج'
  },
  'fallacy': {
    imageUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80',
    emoji: '🧩',
    gradient: 'from-purple-700 to-indigo-900',
    altText: 'متاهة وأحجية معقدة للمغالطة المنطقية'
  },
  'infrastructure': {
    imageUrl: 'https://images.unsplash.com/photo-1545459720-aac8509eb02c?auto=format&fit=crop&w=800&q=80',
    emoji: '🌉',
    gradient: 'from-blue-600 to-slate-800',
    altText: 'جسر حديث وشبكة بنية تحتية هندسية'
  },
  'portfolio': {
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80',
    emoji: '📈',
    gradient: 'from-emerald-600 to-teal-900',
    altText: 'شاشة رسوم بيانية ومحفظة استثمارات مالية'
  },
  'dividend': {
    imageUrl: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=800&q=80',
    emoji: '💰',
    gradient: 'from-amber-500 to-yellow-700',
    altText: 'عملات ذهبية ونمو أرباح الأسهم'
  },
  'censorship': {
    imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
    emoji: '🚫',
    gradient: 'from-red-700 to-zinc-900',
    altText: 'رمز حظر ورقابة على النشر'
  },
  'empathy': {
    imageUrl: 'https://images.unsplash.com/photo-1516585427167-9f4af9627e6c?auto=format&fit=crop&w=800&q=80',
    emoji: '🤝',
    gradient: 'from-pink-500 to-rose-700',
    altText: 'تواصل إنساني دافئ وتعاطف وجداني'
  },
  'resilience': {
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    emoji: '🌱',
    gradient: 'from-emerald-500 to-green-800',
    altText: 'نبتة خضراء تنمو بإصرار وسط الصخور'
  },
  'hypothesis': {
    imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
    emoji: '⚗️',
    gradient: 'from-blue-600 to-indigo-900',
    altText: 'أنابيب اختبار وبحث علمي معملي'
  },
  'ecosystem': {
    imageUrl: 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=800&q=80',
    emoji: '🌲',
    gradient: 'from-emerald-600 to-green-900',
    altText: 'غابة طبيعية عذراء ونظام بيئي غني'
  },
  'biodiversity': {
    imageUrl: 'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=800&q=80',
    emoji: '🦜',
    gradient: 'from-teal-500 to-emerald-800',
    altText: 'طيور ملونة وحياة برية وتنوع بيولوجي'
  },
  'milestone': {
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    emoji: '🚩',
    gradient: 'from-indigo-600 to-purple-900',
    altText: 'قمة جبل ومحطة إنجاز بارزة'
  },
  'masterpiece': {
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
    emoji: '🎨',
    gradient: 'from-purple-600 to-pink-900',
    altText: 'لوحة زيتية فنية خالدة وتحفة إبداعية'
  },
  'renaissance': {
    imageUrl: 'https://images.unsplash.com/photo-1543429776-2782fc8e1acd?auto=format&fit=crop&w=800&q=80',
    emoji: '🏛️',
    gradient: 'from-amber-700 to-stone-900',
    altText: 'معالم عصر النهضة الإيطالي والعمارة الكلاسيكية'
  }
};

/**
 * Returns a curated visual if explicitly defined.
 */
export function getCuratedWordVisual(rawWord: string): WordVisual | null {
  const normalized = rawWord.trim().toLowerCase();
  return CURATED_WORD_VISUALS[normalized] || null;
}
