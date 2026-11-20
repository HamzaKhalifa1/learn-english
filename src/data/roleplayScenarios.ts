import wordsData from '@/data/words.json';

export interface SuggestedReply {
  text: string;
  translationAr: string;
}

export interface TargetWordDetail {
  word: string;
  meaningAr: string;
  phonetic?: string;
  example?: string;
}

export interface RoleplayScenario {
  id: string;
  unitId?: string;
  level: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  themeColor: string;
  character: {
    name: string;
    role: string;
    roleAr?: string;
    avatar: string;
    greeting: string;
    greetingAr: string;
  };
  targetWords: string[];
  targetWordDetails?: TargetWordDetail[];
  initialHints: SuggestedReply[];
  minTurns: number;
}

// ── Handcrafted Curated Scenarios for Popular Core Units ──────────────────────
export const CURATED_SCENARIOS: RoleplayScenario[] = [
  {
    id: 'a1-s1',
    unitId: 'a1-u1',
    level: 'A1',
    title: 'Meeting Your New Neighbor',
    titleAr: 'التعرف على جارتك الجديدة',
    description: 'Practice warm greetings, offering assistance, and being polite.',
    descriptionAr: 'تدرّب على إلقاء التحية وعرض المساعدة بأسلوب مهذب وودود.',
    themeColor: 'from-blue-500 to-indigo-600',
    character: {
      name: 'Mrs. Mary',
      role: 'Friendly Neighbor',
      roleAr: 'جارتك الودودة',
      avatar: '👵',
      greeting: 'Hello there! It is a lovely sunny morning in our neighborhood. How are you today?',
      greetingAr: 'أهلاً بك! إنه صباح مشمس وجميل في حينا. كيف حالك اليوم؟',
    },
    targetWords: ['Hello', 'Please', 'Thank you', 'Help', 'Good'],
    initialHints: [
      { text: 'Hello! I am doing very good, thank you. Do you need any help?', translationAr: 'مرحباً! أنا بحال جيدة جداً، شكراً لك. هل تحتاجين إلى أي مساعدة؟' },
      { text: 'Hello Mrs. Mary! Good morning, nice to see you.', translationAr: 'مرحباً سيدة ماري! صباح الخير، سررت برؤيتك.' },
      { text: 'Good morning! Please let me know if I can help you with anything.', translationAr: 'صباح الخير! من فضلك أخبريني إن كان بإمكاني مساعدتك في أي شيء.' },
    ],
    minTurns: 4,
  },
  {
    id: 'a1-s2',
    unitId: 'a1-u2',
    level: 'A1',
    title: 'How Are You Feeling Today?',
    titleAr: 'كيف تشعر اليوم؟ ومشاعر الرسم',
    description: 'Talk about your feelings, colors, and what makes you happy.',
    descriptionAr: 'تحدث عن مشاعرك، وكيف تحوّل التعب إلى سعادة وإيجابية.',
    themeColor: 'from-amber-500 to-rose-500',
    character: {
      name: 'Maya',
      role: 'Classmate & Artist',
      roleAr: 'صديقة الصف والرسامة',
      avatar: '👩‍🎨',
      greeting: 'Hi! You look a bit tired today after school. How are you feeling right now?',
      greetingAr: 'مرحباً! تبدو متعباً قليلاً اليوم بعد المدرسة. كيف تشعر الآن؟',
    },
    targetWords: ['Happy', 'Sad', 'Angry', 'Tired', 'Blue', 'Yellow'],
    initialHints: [
      { text: 'I felt tired before, but now I feel happy to see you!', translationAr: 'كنت أشعر بالتعب من قبل، لكنني الآن أشعر بالسعادة لرؤيتك!' },
      { text: 'I was a little sad today, but looking at bright yellow colors helps me relax.', translationAr: 'كنت حزيناً قليلاً اليوم، لكن النظر إلى الألوان الصفراء المشرقة يساعدني على الاسترخاء.' },
      { text: 'I am not angry or sad anymore. I want to paint something peaceful in blue.', translationAr: 'لم أعد غاضباً أو حزيناً. أريد أن أرسم شيئاً هادئاً باللون الأزرق.' },
    ],
    minTurns: 4,
  },
  {
    id: 'a1-s3',
    unitId: 'a1-u3',
    level: 'A1',
    title: 'Visiting a Friend’s House',
    titleAr: 'زيارة منزل صديقك المقرب',
    description: 'Experience hospitality, talking about home, water, and lunch with family.',
    descriptionAr: 'عش تجربة الضيافة المنزلية، والتحدث عن البيت وتناول الطعام مع العائلة.',
    themeColor: 'from-emerald-500 to-teal-600',
    character: {
      name: 'Adam',
      role: 'Close Friend',
      roleAr: 'صديقك المقرب',
      avatar: '👦',
      greeting: 'Welcome to my house, my friend! Come in. Can I get you a cool glass of water?',
      greetingAr: 'أهلاً بك في منزلي يا صديقي! تفضل بالدخول. هل تحب أن أحضر لك كوب ماء بارد؟',
    },
    targetWords: ['House', 'Water', 'Food', 'Friend', 'Family'],
    initialHints: [
      { text: 'Thank you my friend! Yes please, cool water sounds wonderful in this warm day.', translationAr: 'شكراً يا صديقي! نعم من فضلك، الماء البارد يبدو رائعاً في هذا اليوم الدافئ.' },
      { text: 'Your family house is beautiful! It is great to see you after school.', translationAr: 'منزل عائلتك جميل جداً! من الرائع رؤيتك بعد المدرسة.' },
      { text: 'Thank you! Is your family cooking food? The kitchen smells delicious.', translationAr: 'شكراً لك! هل تعد عائلتك الطعام؟ رائحة المطبخ شهية جداً.' },
    ],
    minTurns: 4,
  },
  {
    id: 'a2-s1',
    unitId: 'a2-u1',
    level: 'A2',
    title: 'Planning Active Weekend Sports',
    titleAr: 'التخطيط لعطلة رياضية حافلة',
    description: 'Discuss running, study routines, and playing basketball with a workout buddy.',
    descriptionAr: 'ناقش تمارين الجري، روتين الدراسة، ولعب كرة السلة مع شريك التمرين.',
    themeColor: 'from-orange-500 to-amber-600',
    character: {
      name: 'Coach Tariq',
      role: 'Fitness Partner',
      roleAr: 'شريك اللياقة البدنية',
      avatar: '🏃‍♂️',
      greeting: 'Hey! Ready for the weekend? What time do you want to run in the park tomorrow morning?',
      greetingAr: 'مرحباً! هل أنت مستعد لعطلة نهاية الأسبوع؟ في أي وقت ترغب أن نركض في الحديقة صباح غد؟',
    },
    targetWords: ['Run', 'Eat', 'Sleep', 'Work', 'Study', 'Play'],
    initialHints: [
      { text: 'Let us run early at dawn! Afterwards, we can eat a healthy breakfast together.', translationAr: 'دعنا نركض مبكراً عند الفجر! بعد ذلك، يمكننا تناول إفطار صحي معاً.' },
      { text: 'I have to study in the afternoon, but in the evening we can play basketball.', translationAr: 'علي أن أدرس بعد الظهر، لكن في المساء يمكننا لعب كرة السلة.' },
      { text: 'I worked hard all week. Running will help me relax and sleep better tonight.', translationAr: 'لقد عملت بجد طوال الأسبوع. الجري سيساعدني على الاسترخاء والنوم بعمق الليلة.' },
    ],
    minTurns: 4,
  },
  {
    id: 'b1-s1',
    unitId: 'b1-u1',
    level: 'B1',
    title: 'Startup Leadership Milestone',
    titleAr: 'اجتماع قيادة المشروع والنجاح',
    description: 'Participate in a strategic business meeting about challenges, opportunities, and decisions.',
    descriptionAr: 'شارك في اجتماع استراتيجي حول التحديات، الفرص الواعدة، واتخاذ القرارات.',
    themeColor: 'from-indigo-600 to-violet-700',
    character: {
      name: 'Zaid',
      role: 'Senior Project Lead',
      roleAr: 'قائد المشروع التقني',
      avatar: '👨‍💼',
      greeting: 'Good morning! Our new green tech project is advancing quickly, but we have a major challenge. How do you propose we improve our team communication?',
      greetingAr: 'صباح الخير! مشروعنا التقني الجديد يتقدم بسرعة، لكننا نواجه تحدياً مهماً. كيف تقترح أن نحسّن التواصل داخل الفريق؟',
    },
    targetWords: ['Challenge', 'Opportunity', 'Responsible', 'Improve', 'Decision', 'Success'],
    initialHints: [
      { text: 'This challenge is a great opportunity to improve our workflow and achieve success.', translationAr: 'هذا التحدي هو فرصة ممتازة لتحسين سير العمل وتحقيق النجاح.' },
      { text: 'As responsible team members, we should make a clear decision during our weekly review.', translationAr: 'بصفتنا أعضاء مسؤولين في الفريق، ينبغي أن نتخذ قراراً واضحاً أثناء المراجعة الأسبوعية.' },
      { text: 'Transparent communication will help us overcome every challenge and build lasting success.', translationAr: 'التواصل الشفاف سيساعدنا على تجاوز كل تحدٍ وبناء نجاح دائم.' },
    ],
    minTurns: 5,
  },
  {
    id: 'b1-s4',
    unitId: 'b1-u4',
    level: 'B1',
    title: 'Dinner at Chef Marco’s Bistro',
    titleAr: 'الطلب في مطعم الشيف ماركو الإيطالي',
    description: 'Discuss fresh ingredients, special flavors, and order healthy vegetarian dishes.',
    descriptionAr: 'تحدث عن المكونات الطازجة، النكهات المميزة، واطلب وجبات نباتية لذيذة.',
    themeColor: 'from-red-500 to-rose-600',
    character: {
      name: 'Chef Marco',
      role: 'Executive Italian Chef',
      roleAr: 'كبير الطهاة الإيطالي',
      avatar: '👨‍🍳',
      greeting: 'Buonasera! Welcome to our bistro. Are you in the mood for something traditional, or would you like to explore our spicy chef specials tonight?',
      greetingAr: 'مساء الخير! مرحباً بك في مطعمنا. هل تفضل تذوق أطباقنا التقليدية، أم ترغب في استكشاف أطباق الشيف الحارة الخاصة الليلة؟',
    },
    targetWords: ['Recipe', 'Ingredient', 'Flavor', 'Portion', 'Vegetarian', 'Spicy'],
    initialHints: [
      { text: 'I follow a vegetarian diet. What fresh ingredients do you use in your homemade pasta?', translationAr: 'أنا أتبع نظاماً غذائياً نباتياً. ما هي المكونات الطازجة التي تستخدمها في الباستا المنزلية؟' },
      { text: 'I am starving! Can you recommend a dish with rich herbal flavor that is not too spicy?', translationAr: 'أنا أتضور جوعاً! هل يمكنك اقتراح طبق غني بنكهة الأعشاب ولا يكون حاراً جداً؟' },
      { text: 'Your family recipe smells wonderful. Please serve a generous portion of the house special.', translationAr: 'وصفة عائلتك تبدو رائحتها مذهلة. من فضلك قدّم لي حصة وافرة من طبق المطعم المميز.' },
    ],
    minTurns: 5,
  },
  {
    id: 'b1-s12',
    unitId: 'b1-u12',
    level: 'B1',
    title: 'The Promotion Review Meeting',
    titleAr: 'مقابلة مناقشة الترقية الوظيفية',
    description: 'Demonstrate your achievements, deadlines, and discuss a career promotion with the Director.',
    descriptionAr: 'استعرض إنجازاتك، احترامك للمواعيد النهائية، وناقش استحقاقك للترقية وزيادة الراتب.',
    themeColor: 'from-purple-600 to-indigo-700',
    character: {
      name: 'Director Elena',
      role: 'Managing Director',
      roleAr: 'المديرة التنفيذية',
      avatar: '👩‍💼',
      greeting: 'Please have a seat! I have been reviewing your performance over the past year. What achievements are you most proud of regarding your recent projects?',
      greetingAr: 'تفضل بالجلوس من فضلك! لقد كنت أراجع أداءك خلال العام المنصرم. ما هي الإنجازات التي تشعر بأكبر قدر من الفخر بها في مشاريعك الأخيرة؟',
    },
    targetWords: ['Deadline', 'Promotion', 'Colleague', 'Salary', 'Productive', 'Efficient'],
    initialHints: [
      { text: 'I always respect every strict deadline and collaborate closely with each colleague to stay productive.', translationAr: 'أنا أحترم دائماً كل موعد نهائي بدقة وأتعاون باهتمام مع كل زميل للحفاظ على إنتاجية عالية.' },
      { text: 'Our team was very efficient in completing contracts on time, and I am excited to discuss the promotion.', translationAr: 'كان فريقنا كفؤاً جداً في إنجاز العقود بالوقت المحدد، وأنا متحمس لمناقشة الترقية المستحقة.' },
      { text: 'I helped streamline workflows, which increased productivity. I am eager to take on higher responsibility.', translationAr: 'ساعدت في تنظيم سير العمل مما رفع الإنتاجية. وأنا حريص على تولي مسؤولية أعلى.' },
    ],
    minTurns: 5,
  },
  {
    id: 'b1-s15',
    unitId: 'b1-u15',
    level: 'B1',
    title: 'Navigating the City Subway',
    titleAr: 'الملاحة والتنقل في قطار الأنفاق',
    description: 'Ask for directions, bypass traffic congestion, and pay your train transit fare.',
    descriptionAr: 'اسأل عن الاتجاهات، تجنب الازدحام المروري، وتعرف على رصيف القطار ودفع الأجرة.',
    themeColor: 'from-sky-500 to-blue-600',
    character: {
      name: 'Officer Leo',
      role: 'Station Transit Officer',
      roleAr: 'مسؤول محطة المترو',
      avatar: '👮‍♂️',
      greeting: 'Good day, traveler! The city roads have heavy traffic congestion today. Where are you heading on our subway line?',
      greetingAr: 'طاب يومك أيها المسافر! شوارع المدينة تشهد ازدحاماً مرورياً خانقاً اليوم. إلى أين تتجه عبر خط قطار الأنفاق لدينا؟',
    },
    targetWords: ['Subway', 'Platform', 'Fare', 'Traffic', 'Navigate', 'Congestion'],
    initialHints: [
      { text: 'Hello Officer! I want to bypass road traffic. Which platform should I take to reach downtown?', translationAr: 'مرحباً حضرة الضابط! أريد تفادي حركة السير. أي رصيف قطار ينبغي أن أسلكه للوصول لوسط المدينة؟' },
      { text: 'How much is the subway fare for a day ticket, and how do I navigate through the central intersection?', translationAr: 'كم تبلغ أجرة المترو لتذكرة اليوم الواحد، وكيف أنتقل عبر التقاطع المركزي؟' },
      { text: 'The congestion above ground is intense! The subway is definitely the fastest commute.', translationAr: 'الازدحام فوق الأرض خانق للغاية! المترو هو بالتأكيد وسيلة التنقل الأسرع.' },
    ],
    minTurns: 4,
  },
];

// Helper to determine the persona based on theme
function getCharacterForTheme(title: string) {
  const t = title.toLowerCase();
  if (/\b(health|body|biomedical|medical|disease|symptom)\b/i.test(t)) {
    return { name: 'Dr. Sarah', role: 'Physician', roleAr: 'طبيبة استشارية', avatar: '🩺' };
  }
  if (/\b(food|eating|cook|cuisine|restaurant|dining|recipe)\b/i.test(t)) {
    return { name: 'Chef Marco', role: 'Executive Chef', roleAr: 'كبير الطهاة', avatar: '👨‍🍳' };
  }
  if (/\b(travel|tourism|tour|journey|destination|flight|hotel)\b/i.test(t)) {
    return { name: 'Clara', role: 'Travel Advisor', roleAr: 'مستشارة سفر وسياحة', avatar: '✈️' };
  }
  if (/\b(tech|internet|software|computer|artificial|intelligence|data|digital)\b/i.test(t)) {
    return { name: 'Alex', role: 'Systems Engineer', roleAr: 'مهندس برمجيات ونظم', avatar: '💻' };
  }
  if (/\b(study|education|academic|school|university|research|science|lecture)\b/i.test(t)) {
    return { name: 'Prof. Miller', role: 'Academic Advisor', roleAr: 'مرشد أكاديمي وأستاذ', avatar: '🎓' };
  }
  if (/\b(shop|money|bank|finance|investment|economic|market|budget)\b/i.test(t)) {
    return { name: 'Liam', role: 'Financial Consultant', roleAr: 'مستشار مالي واقتصادي', avatar: '💳' };
  }
  if (/\b(weather|nature|environment|climate|ecology)\b/i.test(t)) {
    return { name: 'Nora', role: 'Environmental Scientist', roleAr: 'باحثة بيئية', avatar: '🌿' };
  }
  if (/\b(animal|wildlife|species|habitat)\b/i.test(t)) {
    return { name: 'David', role: 'Wildlife Ranger', roleAr: 'حارس محمية طبيعية', avatar: '🦁' };
  }
  if (/\b(work|career|leadership|corporate|business|management|strategic|interview)\b/i.test(t)) {
    return { name: 'Director Elena', role: 'Managing Director', roleAr: 'مديرة تنفيذية', avatar: '💼' };
  }
  if (/\b(art|music|entertainment|media|literature|creative|gallery)\b/i.test(t)) {
    return { name: 'Sophia', role: 'Creative Director', roleAr: 'مديرة إبداعية وفنية', avatar: '🎨' };
  }
  if (/\b(city|transport|urban|traffic|subway|commute)\b/i.test(t)) {
    return { name: 'Officer Leo', role: 'Transit Guide', roleAr: 'مرشد النقل والمواصلات', avatar: '🚇' };
  }
  if (/\b(sport|exercise|action|verb|athletic|fitness|tournament)\b/i.test(t)) {
    return { name: 'Coach Tariq', role: 'Athletic Coach', roleAr: 'مدرب لياقة بدنية', avatar: '🏃‍♂️' };
  }
  if (/\b(law|legal|jurisprudence|diplomacy|negotiation)\b/i.test(t)) {
    return { name: 'Attorney James', role: 'Legal Counsel', roleAr: 'مستشار قانوني ودبلوماسي', avatar: '⚖️' };
  }
  if (/\b(psychology|emotion|feeling|mind|logic|thinking|philosoph)\b/i.test(t)) {
    return { name: 'Dr. Julian', role: 'Cognitive Specialist', roleAr: 'أخصائي نفسي وسلوكي', avatar: '🧠' };
  }
  if (/\b(home|house|family|relationship|friend|social|routine)\b/i.test(t)) {
    return { name: 'Samira', role: 'Community Host', roleAr: 'مضيفة مجتمعية', avatar: '🏠' };
  }
  return { name: 'Emma', role: 'Language Partner', roleAr: 'شريكة المحادثة الإنجليزية', avatar: '💬' };
}

// ── Dynamic Scenario Generator for ALL 78 Curriculum Units ───────────────────
function buildAllScenarios(): RoleplayScenario[] {
  const curatedUnitMap = new Map<string, RoleplayScenario>();
  CURATED_SCENARIOS.forEach(s => {
    if (s.unitId) curatedUnitMap.set(s.unitId, s);
  });

  const list: RoleplayScenario[] = [];

  try {
    const data = wordsData as any;
    if (data?.levels) {
      Object.entries(data.levels).forEach(([lvl, l]: [string, any]) => {
        l.units?.forEach((u: any) => {
          // Extract full word details for this unit
          const details: TargetWordDetail[] = (u.words || []).map((w: any) => ({
            word: w.word,
            meaningAr: w.meaningAr || w.meaning || w.translation || w.translationAr || '',
            phonetic: w.phonetic || '',
            example: w.example || (w.examples && w.examples[0]) || '',
          }));

          const allUnitWords = details.map(d => d.word);

          if (curatedUnitMap.has(u.id)) {
            // Curated scenario: enrich with full targetWordDetails and ensure all words are present
            const curated = { ...curatedUnitMap.get(u.id)! };
            curated.targetWordDetails = details;
            // Merge curated target words with remaining unit words
            const curatedWordsSet = new Set(curated.targetWords.map(w => w.toLowerCase()));
            const remainingWords = allUnitWords.filter(w => !curatedWordsSet.has(w.toLowerCase()));
            curated.targetWords = [...curated.targetWords, ...remainingWords];
            list.push(curated);
          } else {
            // Dynamic scenario for curriculum unit
            const char = getCharacterForTheme(u.title);
            const w0 = details[0]?.word || 'practice';
            const m0 = details[0]?.meaningAr || '';
            const w1 = details[1]?.word || 'skill';
            const m1 = details[1]?.meaningAr || '';
            const w2 = details[2]?.word || 'knowledge';
            const m2 = details[2]?.meaningAr || '';

            const scenario: RoleplayScenario = {
              id: u.id,
              unitId: u.id,
              level: lvl,
              title: u.title,
              titleAr: u.titleAr,
              description: `Practice practical conversation about ${u.title} with ${char.name}.`,
              descriptionAr: `تدرّب على محادثة عملية حول ${u.titleAr} مع ${char.name}.`,
              themeColor: 'from-indigo-600 to-purple-600',
              character: {
                name: char.name,
                role: char.role,
                roleAr: char.roleAr,
                avatar: char.avatar,
                greeting: `Hello! Welcome to our conversation about ${u.title}. I am ${char.name}, your ${char.role}. How do you usually approach '${w0}' or '${w1}'?`,
                greetingAr: `مرحباً بك! أهلاً بك في حوارنا حول ${u.titleAr}. أنا ${char.name} (${char.roleAr}). كيف تتعامل عادة مع '${w0}'${m0 ? ` (${m0})` : ''} أو '${w1}'${m1 ? ` (${m1})` : ''}؟`,
              },
              targetWords: allUnitWords,
              targetWordDetails: details,
              initialHints: [
                {
                  text: `Hello ${char.name}! In my view, understanding ${w0.toLowerCase()} is essential for good results.`,
                  translationAr: `مرحباً ${char.name}! في رأيي، فهم ${m0 || w0} أمر أساسي لتحقيق نتائج جيدة.`
                },
                {
                  text: `Good day! How can we practice ${w1.toLowerCase()} and ${w2.toLowerCase()} effectively?`,
                  translationAr: `طاب يومك! كيف يمكننا ممارسة ${m1 || w1} و ${m2 || w2} بفاعلية؟`
                },
                {
                  text: `I want to improve my fluency and explore practical examples of ${w0.toLowerCase()}.`,
                  translationAr: `أريد تحسين طلاقتي واستكشاف أمثلة عملية حول ${m0 || w0}.`
                }
              ],
              minTurns: 4,
            };
            list.push(scenario);
          }
        });
      });
    }
  } catch {
    // fallback to curated if anything fails
    return [...CURATED_SCENARIOS];
  }

  return list;
}

export const ROLEPLAY_SCENARIOS: RoleplayScenario[] = buildAllScenarios();

export function getScenario(id: string): RoleplayScenario | undefined {
  return ROLEPLAY_SCENARIOS.find(s => s.id === id || s.unitId === id);
}

export function getScenariosByLevel(level: string): RoleplayScenario[] {
  const prefix = level.substring(0, 2).toUpperCase();
  return ROLEPLAY_SCENARIOS.filter(s => s.level === prefix);
}
