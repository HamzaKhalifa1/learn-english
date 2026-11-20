import { getUnit, Unit } from '@/lib/words';

export interface StoryQuestion {
  id: number;
  question: string;
  questionAr: string;
  options: string[];
  correctIndex: number;
  explanationAr: string;
}

export interface UnitStory {
  unitId: string;
  title: string;
  titleAr: string;
  level: string;
  paragraphs: string[];
  paragraphsAr: string[];
  targetWords: string[];
  questions: StoryQuestion[];
}

// ── Handcrafted Curated Stories with Genuine Coherent Narratives ──────────────
export const CURATED_STORIES: Record<string, UnitStory> = {
  // A1 - Unit 1: Greetings & Manners
  // Target Words: Hello, Goodbye, Please, Thank you, Sorry, Yes, No, Help, Good, Bad
  'a1-u1': {
    unitId: 'a1-u1',
    title: 'The Helpful Neighbor',
    titleAr: 'الجار المتعاون',
    level: 'A1',
    paragraphs: [
      '"Hello!" called Sami with a warm wave to Mrs. Mary in her front yard. She was holding a heavy wooden box and looked tired. "Do you need any help?" Sami asked kindly. Mrs. Mary smiled and replied: "Yes, please! That would be so wonderful."',
      'Sami gently lifted the box. Inside was a tiny black puppy with bright eyes. "Is it bad news?" asked Sami with concern. "Oh no," laughed Mrs. Mary, "it is very good news! I found this puppy lost near the school, and now I will care for him."',
      'While carrying the box to the front porch, Sami accidentally bumped against the gate. "Sorry about that!" he apologized quickly. "Do not worry at all," Mrs. Mary answered warmly. "Thank you so much for your assistance, Sami."',
      'The little puppy barked happily and wagged its tail. Sami smiled, patted the puppy, and said: "Goodbye, little friend! See you soon." Sami walked home feeling glad that he could lend a helping hand.'
    ],
    paragraphsAr: [
      '"مرحباً!" نادى سامي ملوحاً بابتسامة لجيرته السيدة ماري في حديقتها الأمامية. كانت تحمل صندوقاً خشبياً ثقيلاً وبدت متعبة. "هل تحتاجين إلى أي مساعدة؟" سأل سامي بلطف. ابتسمت السيدة ماري وردت: "نعم، من فضلك! سيكون ذلك رائعاً جداً."',
      'رفع سامي الصندوق بحذر. كان بداخله جرو أسود صغير بعينين لامعتين. "هل هناك خبر سيء؟" سأل سامي باهتمام. "أوه لا،" ضحكت السيدة ماري، "إنه خبر جيد جداً! لقد وجدت هذا الجرو تائهاً قرب المدرسة، وسأعتني به الآن."',
      'أثناء حمل الصندوق نحو الشرفة الأمامية، اصطدم سامي بالبوابة دون قصد. "أنا آسف على ذلك!" قال مسرعاً. أجابت السيدة ماري بود: "لا تقلق أبداً، شكراً جزيلاً لك على مساعدتك يا سامي."',
      'أطلق الجرو الصغير نباحاً مرحاً وحرك ذيله بسعادة. ابتسم سامي ومسح على رأس الجرو وقال: "مع السلامة يا صديقي الصغير! أراك قريباً." وعاد سامي إلى منزله شاعراً بالفرح لأنه استطاع تقديم يد العون.'
    ],
    targetWords: ['Hello', 'Goodbye', 'Please', 'Thank you', 'Sorry', 'Yes', 'No', 'Help', 'Good', 'Bad'],
    questions: [
      {
        id: 1,
        question: 'Why did Sami offer help to Mrs. Mary?',
        questionAr: 'لماذا عرض سامي المساعدة على السيدة ماري؟',
        options: [
          'Because she was carrying a heavy box and looked tired',
          'Because he wanted to buy a new car',
          'Because he was looking for the supermarket',
          'Because he was late for school'
        ],
        correctIndex: 0,
        explanationAr: 'لأنها كانت تحمل صندوقاً ثقيلاً وبدت متعبة، فعرض عليها المساعدة بلطف.'
      },
      {
        id: 2,
        question: 'What was inside the wooden box?',
        questionAr: 'ماذا كان بداخل الصندوق الخشبي؟',
        options: [
          'A rescued puppy that Mrs. Mary found near the school',
          'Old books from the library',
          'Fresh apples and vegetables',
          'Empty water bottles'
        ],
        correctIndex: 0,
        explanationAr: 'كان بداخله جرو صغير لطيف أنقذته السيدة ماري بعد أن وجدته تائهاً.'
      }
    ]
  },

  // A1 - Unit 2: Colors & Feelings
  // Target Words: Happy, Sad, Angry, Tired, Red, Blue, Green, Yellow, Black, White
  'a1-u2': {
    unitId: 'a1-u2',
    title: 'The Painting of Feelings',
    titleAr: 'لوحة المشاعر والألوان',
    level: 'A1',
    paragraphs: [
      'After a busy day at school, Maya felt tired and a little sad. She sat near her window and looked at a clean white canvas on her desk. She decided to paint how she felt inside.',
      'At first, when she thought about an unfair argument with her classmate, she felt angry. She dipped her brush into bold red and dark black colors, drawing sharp, stormy lines across the canvas.',
      'Then, Maya took a deep breath and relaxed. She dipped her brush into warm yellow, calm blue, and fresh green to paint a bright morning sun over the sea. Looking at her colorful art, she felt peaceful and happy.'
    ],
    paragraphsAr: [
      'بعد يوم حافل في المدرسة، شعرت مايا بالإرهاق وقليل من الحزن. جلست قرب نافذتها ونظرت إلى لوحة بيضاء فارغة على مكتبها، وقررت أن ترسم ما تشعر به في داخلها.',
      'في البداية، عندما تذكرت خلافاً غير منصف مع زميلتها، شعرت بالغضب. غمست فرشاتها في اللونين الأحمر والأسود الداكن، ورسمت خطوطاً عاصفة وحادة عبر اللوحة.',
      'بعد ذلك، أخذت مايا نفساً عميقاً واسترخت. غمست فرشاتها في اللون الأصفر الدافئ، والأزرق الهادئ، والأخضر النضر لترسم شمس الصباح المشرقة فوق البحر. وعندما تأملت لوحتها الملونة، شعرت بالسكينة والسعادة.'
    ],
    targetWords: ['Happy', 'Sad', 'Angry', 'Tired', 'Red', 'Blue', 'Green', 'Yellow', 'Black', 'White'],
    questions: [
      {
        id: 1,
        question: 'Why did Maya use red and black colors at first?',
        questionAr: 'لماذا استخدمت مايا اللونين الأحمر والأسود في البداية؟',
        options: [
          'Because she remembered an argument and felt angry',
          'Because she wanted to paint green trees',
          'Because she had no other colors left',
          'Because she was painting at night'
        ],
        correctIndex: 0,
        explanationAr: 'لأنها تذكرت خلافاً وشعرت بالغضب، فعبّرت عن ذلك باللونين الأحمر والأسود.'
      },
      {
        id: 2,
        question: 'How did Maya feel after adding yellow, blue, and green?',
        questionAr: 'كيف شعرت مايا بعد إضافة الأصفر والأزرق والأخضر؟',
        options: [
          'She felt peaceful and happy',
          'She was angry and tore the canvas',
          'She felt even more tired and went away',
          'She started crying'
        ],
        correctIndex: 0,
        explanationAr: 'شعرت بالسكينة والسعادة (Peaceful and happy) بعد رسم شمس الصباح المشرقة.'
      }
    ]
  },

  // A1 - Unit 3: Home & Daily Life
  // Target Words: House, Water, Food, Book, School, Car, Day, Night, Friend, Family
  'a1-u3': {
    unitId: 'a1-u3',
    title: 'A Day in Adam’s Life',
    titleAr: 'يوم في حياة آدم',
    level: 'A1',
    paragraphs: [
      'During the sunny day, Adam drove by car to his local school. In the library, he met his best friend Tariq, and together they opened a fascinating book about sea animals.',
      'In the afternoon, Adam returned back to his warm family house. His parents prepared delicious hot food for lunch, and everyone sat together around the dining table drinking cold fresh water.',
      'When the peaceful night arrived and darkness filled the sky, Adam smiled with gratitude for his loving family and good friends before falling into a restful sleep.'
    ],
    paragraphsAr: [
      'خلال هذا اليوم المشمس، سافر آدم بالسيارة إلى مدرسته. وفي المكتبة، التقى بصديقه المفضل طارق، وفتحا معاً كتاباً رائعاً عن حيوانات البحر.',
      'وفي فترة ما بعد الظهر، عاد آدم إلى منزل العائلة الدافئ. كان والداه قد أعدا طعاماً ساخناً لذيذاً للغداء، فجلس الجميع معاً حول مائدة الطعام يشربون ماءً بارداً ونقياً.',
      'وعندما حلّ الليل الهادئ وملأ الظلام السماء، ابتسم آدم بامتنان لعائلته المحبة وأصدقائه الرائعين قبل أن يغط في نوم عميق ومريح.'
    ],
    targetWords: ['House', 'Water', 'Food', 'Book', 'School', 'Car', 'Day', 'Night', 'Friend', 'Family'],
    questions: [
      {
        id: 1,
        question: 'What did Adam and his friend do at school?',
        questionAr: 'ماذا فعل آدم وصديقه في المدرسة؟',
        options: [
          'They opened a fascinating book to read together in the library',
          'They bought a new car',
          'They cooked dinner for everyone',
          'They painted the house'
        ],
        correctIndex: 0,
        explanationAr: 'فتحا كتاباً رائعاً في المكتبة ليقرآ معاً عن حيوانات البحر.'
      },
      {
        id: 2,
        question: 'What did Adam’s family do when he returned to the house?',
        questionAr: 'ماذا فعلت عائلة آدم عندما عاد إلى المنزل؟',
        options: [
          'They sat together eating food and drinking fresh water',
          'They drove away in a car',
          'They went immediately to school',
          'They stayed in separate rooms'
        ],
        correctIndex: 0,
        explanationAr: 'جلسوا معاً وتناولوا طعام الغداء وشربوا ماءً بارداً نقياً.'
      }
    ]
  },

  // A2 - Unit 1: Actions & Verbs
  // Target Words: Run, Eat, Sleep, Work, Study, Speak, Listen, Write, Read, Play
  'a2-u1': {
    unitId: 'a2-u1',
    title: 'A Productive Day in Tariq’s Life',
    titleAr: 'يوم حافل بالنشاط في حياة طارق',
    level: 'A2',
    paragraphs: [
      'Every morning at dawn, Tariq ties his sneakers to run around the neighborhood park. After returning home, he sits down to eat a healthy breakfast before he starts his daily work.',
      'In the afternoon, Tariq visits the educational center to study English. He loves to speak with international students, listen carefully to his teacher, read engaging articles, and write short essays.',
      'When the sun sets, Tariq meets his friends in the courtyard to play basketball. After this energetic and balanced routine, he is ready to sleep deeply with a peaceful mind.'
    ],
    paragraphsAr: [
      'كل صباح عند الفجر، يربط طارق حذاءه ليركض حول حديقة الحي. وبعد عودته للمنزل، يجلس ليتناول إفطاراً صحياً قبل أن يبدأ عمله اليومي.',
      'في فترة ما بعد الظهر، يزور طارق المركز التعليمي ليدرس اللغة الإنجليزية. يحب أن يتكلم مع زملائه، ويستمع بانتباه لأستاذه، ويقرأ مقالات شيقة، ويكتب مقالات قصيرة.',
      'وعندما تغرب الشمس، يلتقي طارق بأصدقائه في الباحة ليلعبوا كرة السلة. وبعد هذا اليوم المفعم بالحيوية والتوازن، يصبح مستعداً لينام بعمق وهدوء بال.'
    ],
    targetWords: ['Run', 'Eat', 'Sleep', 'Work', 'Study', 'Speak', 'Listen', 'Write', 'Read', 'Play'],
    questions: [
      {
        id: 1,
        question: 'What does Tariq do in the morning before starting his work?',
        questionAr: 'ماذا يفعل طارق في الصباح قبل بدء عمله؟',
        options: [
          'He runs around the park and eats a healthy breakfast',
          'He sleeps until noon',
          'He plays basketball all morning',
          'He writes long novels'
        ],
        correctIndex: 0,
        explanationAr: 'يركض حول الحديقة ثم يتناول وجبة إفطار صحية قبل الذهاب للعمل.'
      },
      {
        id: 2,
        question: 'How does Tariq study English at the educational center?',
        questionAr: 'كيف يدرس طارق اللغة الإنجليزية في المركز؟',
        options: [
          'By speaking with students, listening to the teacher, reading, and writing',
          'By watching silent movies only',
          'By running around the classroom',
          'By sleeping during the lessons'
        ],
        correctIndex: 0,
        explanationAr: 'يتكلم مع زملائه، ويستمع للأستاذ، ويقرأ ويكتب مقالات قصيرة.'
      }
    ]
  },

  // B1 - Unit 1: Work & Career
  // Target Words: Achieve, Challenge, Opportunity, Responsible, Improve, Communicate, Experience, Decision, Success, Important
  'b1-u1': {
    unitId: 'b1-u1',
    title: 'The Leadership Opportunity',
    titleAr: 'فرصة القيادة والنجاح',
    level: 'B1',
    paragraphs: [
      'After five years of dedicated experience in the company, Zaid discovered an unexpected opportunity to manage the new renewable energy project. He knew it was an important step for his future career, but also a formidable challenge.',
      'As the responsible project lead, Zaid worked to improve coordination between engineering and marketing. He made sure to communicate clearly with every team member during each critical phase.',
      'When technical hurdles arose, Zaid made a decisive decision to adopt an innovative software solution. Because of his team’s resilience, they managed to achieve their launch goals and celebrate a major success across the firm.'
    ],
    paragraphsAr: [
      'بعد خمس سنوات من الخبرة المتفانية في الشركة، وجد زيد فرصة غير متوقعة لإدارة مشروع الطاقة المتجددة الجديد. أدرك أنها خطوة مهمة للغاية لمستقبله المهني، لكنها كانت أيضاً تحدياً كبيراً.',
      'وبصفته قائد المشروع المسؤول، عمل زيد على تحسين التنسيق بين فريقي الهندسة والتسويق، وحرص على التواصل بوضوح مع كل عضو في الفريق خلال كل مرحلة حاسمة.',
      'وعندما ظهرت عقبات تقنية، اتخذ زيد قراراً حاسماً باعتماد حل برمجي مبتكر. وبفضل إصرار الفريق، تمكنوا من تحقيق أهداف الإطلاق والاحتفال بنجاح باهر عمّ أرجاء الشركة.'
    ],
    targetWords: ['Achieve', 'Challenge', 'Opportunity', 'Responsible', 'Improve', 'Communicate', 'Experience', 'Decision', 'Success', 'Important'],
    questions: [
      {
        id: 1,
        question: 'What key opportunity did Zaid receive after years of experience?',
        questionAr: 'ما هي الفرصة الرئيسية التي نالها زيد بعد سنوات من الخبرة؟',
        options: [
          'To lead an important renewable energy project',
          'To take a six-month vacation',
          'To change his career to cooking',
          'To resign from the firm'
        ],
        correctIndex: 0,
        explanationAr: 'فرصة لقيادة مشروع حيوي في مجال الطاقة المتجددة بناءً على خبرته وتفانيه.'
      },
      {
        id: 2,
        question: 'How did Zaid help his team achieve success despite the challenge?',
        questionAr: 'كيف ساعد زيد فريقه في تحقيق النجاح بالرغم من التحديات؟',
        options: [
          'By communicating clearly, improving workflows, and making a decisive decision',
          'By ignoring problems and waiting for others to solve them',
          'By cancelling the whole project immediately',
          'By working completely alone without the team'
        ],
        correctIndex: 0,
        explanationAr: 'بالتواصل الفعال، وتحسين أسلوب العمل، واتخاذ قرار جريء وحاسم لحل المشكلة.'
      }
    ]
  },

  // B1 - Unit 2: Daily Routines
  // Target Words: Arrange, Schedule, Routine, Manage, Remind, Prepare, Complete, Attend, Concentrate, Delay
  'b1-u2': {
    unitId: 'b1-u2',
    title: 'Mastering the Morning Routine',
    titleAr: 'إدارة الروتين الصباحي الذكي',
    level: 'B1',
    paragraphs: [
      'Karim used to delay waking up, causing him to constantly rush out the door in a panic. To manage his daily stress, he decided to completely restructure his routine.',
      'Every Sunday evening, he uses a digital calendar to schedule his upcoming appointments and arrange meetings in advance. Smart alarms remind him to prepare his clothes and work materials the night before.',
      'Now, Karim can easily attend his 9:00 AM seminars punctually. Without morning chaos, he can concentrate deeply on complex projects and complete his tasks before lunchtime.'
    ],
    paragraphsAr: [
      'اعتاد كريم تأجيل الاستيقاظ مما كان يدفعه للتسرع ومغادرة المنزل في حالة من الذعر. ولكي يُدير توتره اليومي، قرر إعادة هيكلة روتينه بالكامل.',
      'في مساء كل أحد، يستخدم تقويماً رقمياً لجدولة مواعيده القادمة وترتيب لقاءاته مسبقاً. كما تساعده تنبيهات ذكية لتذكيره بتجهيز ملابسه ومستلزمات عمله في الليلة السابقة.',
      'أصبح كريم الآن يحضر محاضراته في التاسعة صباحاً بدقة تامة وبلا تأخير. وبفضل غياب الفوضى الصباحية، بات بإمكانه التركيز بعمق على المشاريع وإنجاز مهامه قبل الغداء.'
    ],
    targetWords: ['Arrange', 'Schedule', 'Routine', 'Manage', 'Remind', 'Prepare', 'Complete', 'Attend', 'Concentrate', 'Delay'],
    questions: [
      {
        id: 1,
        question: 'Why did Karim decide to change his daily routine?',
        questionAr: 'لماذا قرر كريم تغيير روتينه اليومي؟',
        options: [
          'To avoid delays, manage stress, and stop rushing in the morning',
          'Because his friend moved away',
          'To buy a new car',
          'Because he stopped studying'
        ],
        correctIndex: 0,
        explanationAr: 'لتجنب التأخير وإدارة التوتر والتوقف عن الاندفاع المذعور في الصباح.'
      },
      {
        id: 2,
        question: 'What helps Karim concentrate and complete tasks efficiently now?',
        questionAr: 'ما الذي يساعد كريم على التركيز وإنجاز المهام بكفاءة الآن؟',
        options: [
          'Scheduling appointments and preparing materials the night before',
          'Staying up all night drinking coffee',
          'Skipping all his morning lectures',
          'Delaying work until the weekend'
        ],
        correctIndex: 0,
        explanationAr: 'جدولة المواعيد المسبقة وتجهيز المستلزمات في المساء مما يوفر الهدوء والتركيز.'
      }
    ]
  },

  // B1 - Unit 3: Common Action Verbs
  // Target Words: Avoid, Borrow, Cancel, Compare, Describe, Discover, Discuss, Imagine, Include, Prefer
  'b1-u3': {
    unitId: 'b1-u3',
    title: 'The Great Mountain Adventure',
    titleAr: 'مغامرة الجبل الكبرى',
    level: 'B1',
    paragraphs: [
      'Huda and her travel companions gathered at a cozy cafe to discuss their upcoming vacation plans. Rather than crowded seaside resorts, most members preferred to explore quiet mountain hiking trails.',
      'They began to compare different outdoor equipment online. Since new camping tents were expensive, Huda decided to borrow a high-grade tent from her brother to avoid unnecessary expenses.',
      'When sudden stormy forecasts threatened to cancel their trip, a local guide called to describe an alternative sheltered canyon that would include ancient rock paintings. Huda could already imagine the breathtaking views they were about to discover.'
    ],
    paragraphsAr: [
      'اجتمعت هدى مع رفاق سفرها في مقهى دافئ لمناقشة خطط إجازتهم القادمة. وعوضاً عن المنتجعات الساحلية المكتظة، فضّل معظم الأعضاء استكشاف مسارات المشي الهادئة في الجبال.',
      'بدؤوا يقارنون أسعار معدات التخييم عبر الإنترنت. وبما أن الخيام الجديدة كانت باهظة، قررت هدى استعارة خيمة ممتازة من شقيقها لتفادي النفقات غير الضرورية.',
      'وعندما هددت عاصفة مفاجئة بإلغاء رحلتهم، اتصل مرشد محلي ليصف لهم وادياً بديلاً آمناً يشمل نقوشاً صخرية أثرية. استطاعت هدى منذ تلك اللحظة أن تتخيل المشاهد الخلابة التي هم على وشك اكتشافها.'
    ],
    targetWords: ['Avoid', 'Borrow', 'Cancel', 'Compare', 'Describe', 'Discover', 'Discuss', 'Imagine', 'Include', 'Prefer'],
    questions: [
      {
        id: 1,
        question: 'Why did Huda borrow a tent instead of buying a new one?',
        questionAr: 'لماذا استعارت هدى خيمة بدلاً من شراء واحدة جديدة؟',
        options: [
          'To compare prices and avoid unnecessary expenses',
          'Because the stores were closed for a month',
          'Because she did not like camping',
          'Because she wanted to stay in a hotel'
        ],
        correctIndex: 0,
        explanationAr: 'لتفادي النفقات الباهظة وغير الضرورية (Avoid unnecessary expenses).'
      },
      {
        id: 2,
        question: 'What did the guide do when weather threatened to cancel the trek?',
        questionAr: 'ماذا فعل المرشد عندما هدد الطقس بإلغاء الرحلة؟',
        options: [
          'He described an alternative sheltered route that would include ancient rock art',
          'He told them to stay home forever',
          'He asked for more money',
          'He cancelled without speaking'
        ],
        correctIndex: 0,
        explanationAr: 'وصف لهم مساراً بديلاً آمناً يشتمل على نقوش صخرية أثرية رائعة.'
      }
    ]
  },

  // B1 - Unit 4: Food & Eating
  // Target Words: Ingredient, Recipe, Flavor, Portion, Diet, Vegetarian, Spicy, Appetite, Cuisine, Starving
  'b1-u4': {
    unitId: 'b1-u4',
    title: 'The Secret Mediterranean Feast',
    titleAr: 'وليمة المطبخ المتوسطي',
    level: 'B1',
    paragraphs: [
      'After an afternoon of cycling in the hills, Omar and his cousins arrived back home feeling absolutely starving. They decided to cook a dinner celebrating traditional Mediterranean cuisine.',
      'Omar, who strictly follows a healthy vegetarian diet, checked every single fresh ingredient from the organic market: sun-ripened tomatoes, garlic, and wild oregano. He followed his aunt’s vintage recipe to bring out the authentic herbal flavor.',
      'He added a subtle pinch of roasted chili for those who loved spicy sensations without overpowering the pasta. The rich aroma stimulated everyone’s appetite, and each generous portion was enjoyed down to the last forkful.'
    ],
    paragraphsAr: [
      'بعد جولة دراجات مسائية بين التلال، عاد عمر وأبناء عمومته إلى المنزل وهم يتضورون جوعاً. فقرروا إعداد عشاء يحتفي بالمطبخ المتوسطي العريق.',
      'عمر، الذي يلتزم بنظام غذائي نباتي صحي، فحص بدقة كل مكون طازج من السوق: طماطم ناضجة، ثوم، وزعتر بري. واتبع وصفة عمته القديمة لإبراز النكهة الأصلية الشهية.',
      'أضاف لمسة خفيفة من الفلفل الحار لعشاق المذاق الحار دون التأثير على مذاق الأعشاب. أثار العبير الزاكي شهية الجميع، وتناول كل منهم حصته الوافرة حتى آخر لقمة.'
    ],
    targetWords: ['Ingredient', 'Recipe', 'Flavor', 'Portion', 'Diet', 'Vegetarian', 'Spicy', 'Appetite', 'Cuisine', 'Starving'],
    questions: [
      {
        id: 1,
        question: 'Why did the friends cook immediately upon returning home?',
        questionAr: 'لماذا شرع الأصدقاء في الطهي فور عودتهم للمنزل؟',
        options: [
          'Because they were starving after cycling in the hills',
          'Because they had a cooking exam',
          'Because a restaurant chef ordered them to',
          'Because they had no other hobbies'
        ],
        correctIndex: 0,
        explanationAr: 'لأنهم كانوا يتضورون جوعاً (Starving) بعد جولة الدراجات الجبلية.'
      },
      {
        id: 2,
        question: 'What kind of diet does Omar follow when choosing ingredients?',
        questionAr: 'ما هو النظام الغذائي الذي يتبعه عمر عند اختيار المكونات؟',
        options: [
          'A healthy vegetarian diet',
          'A fast-food diet',
          'A meat-only diet',
          'He does not eat any vegetables'
        ],
        correctIndex: 0,
        explanationAr: 'يتبع نظاماً غذائياً نباتياً صحياً (Healthy vegetarian diet).'
      }
    ]
  },

  // B1 - Unit 5: Health & Body
  // Target Words: Symptom, Treatment, Injury, Recover, Prescription, Digest, Nutrition, Allergic, Exhausted, Immune
  'b1-u5': {
    unitId: 'b1-u5',
    title: 'The Athlete’s Road to Recovery',
    titleAr: 'طريق التعافي الرياضي',
    level: 'B1',
    paragraphs: [
      'After running twenty kilometers in the cold rain, Layla felt physically exhausted and noticed sharp swelling in her left knee. Concerned about a permanent ligament injury, she booked an appointment with a sports physician.',
      'The physician carefully examined every painful symptom and confirmed there were no torn tendons. He explained that her immune system was temporarily weakened, and gave her a prescription for anti-inflammatory cooling gel.',
      'The doctor advised her to focus on balanced nutrition with foods that are easy to digest to speed up cellular healing. Layla checked that she was not allergic to the cooling balm. After two weeks of gentle treatment, she was delighted to fully recover and jog again.'
    ],
    paragraphsAr: [
      'بعد الركض لعشرين كيلومتراً تحت المطر البارد، شعرت ليلى بإنهاك جسدي شديد ولاحظت تورماً حاداً في ركبتها اليسرى. ولخوفها من إصابة دائمة في الأربطة، حجزت موعداً مع طبيب رياضي متخصص.',
      'فحص الطبيب بعناية كل عَرَض مؤلم وتأكد من سلامة الأوتار من التمزق. وأوضح أن جهازها المناعي مجهد مؤقتاً، وكتب لها وصفة طبية لمرهم مبرد ومضاد للالتهاب.',
      'نصحها الطبيب بالتركيز على التغذية المتوازنة وتناول أطعمة سهلة الهضم لتسريع شفاء الأنسجة. وتأكدت ليلى من أنها ليست مصابة بأي حساسية تجاه المرهم، وبعد أسبوعين من العلاج المتأني، سعدت بالتعافي التام والعودة للجري مجدداً.'
    ],
    targetWords: ['Symptom', 'Treatment', 'Injury', 'Recover', 'Prescription', 'Digest', 'Nutrition', 'Allergic', 'Exhausted', 'Immune'],
    questions: [
      {
        id: 1,
        question: 'What made Layla visit the physician in the first place?',
        questionAr: 'ما الذي دفع ليلى لزيارة الطبيب في المقام الأول؟',
        options: [
          'She was exhausted and worried about a knee injury after running in the rain',
          'She wanted to buy running shoes',
          'She had a dentist appointment',
          'She felt bored at home'
        ],
        correctIndex: 0,
        explanationAr: 'شعورها بالإنهاك الشديد وقلقها من إصابة في الركبة بعد الركض في المطر.'
      },
      {
        id: 2,
        question: 'What helped Layla fully recover over the two weeks?',
        questionAr: 'ما الذي ساعد ليلى على التعافي التام خلال الأسبوعين؟',
        options: [
          'The prescribed treatment, proper nutrition, and gentle care',
          'Running a marathon immediately the next morning',
          'Ignoring the doctor’s advice',
          'Stopping all food intake'
        ],
        correctIndex: 0,
        explanationAr: 'الالتزام بالعلاج الطبي، والتغذية السليمة، والراحة الكافية حتى الشفاء.'
      }
    ]
  },

  // B1 - Unit 12: Work & Career (The acclaimed story loved by the user!)
  // Target Words: Colleague, Deadline, Promotion, Resign, Interview, Salary, Productive, Freelance, Commission, Efficient
  'b1-u12': {
    unitId: 'b1-u12',
    title: 'The Big Promotion Interview',
    titleAr: 'مقابلة الترقية الكبرى',
    level: 'B1',
    paragraphs: [
      'Nour spent five years building her professional career at an international design agency. She was an efficient and dedicated employee who always met every strict deadline and stayed highly productive.',
      'One Monday, her employer invited her to a formal interview for a leadership role. Her supportive colleague helped her review past freelance portfolios and commission contracts to strengthen her presentation.',
      'During the meeting, the executive management praised her remarkable diligence. Rather than ever having to resign, Nour was thrilled to earn a major promotion and an increased salary.'
    ],
    paragraphsAr: [
      'أمضت نور خمس سنوات في بناء مسيرتها المهنية في وكالة تصميم دولية. كانت موظفة كفؤة ومتفانية تحترم دائماً كل موعد نهائي بدقة وتحافظ على إنتاجية عالية.',
      'في أحد أيام الإثنين، دعاها صاحب العمل إلى مقابلة رسمية لمنصب قيادي. وساعدها زميلها المتعاون في مراجعة نماذج أعمالها السابقة المستقلة وعقود العمولات لتعزيز عرضها.',
      'خلال الاجتماع، أشادت الإدارة التنفيذية باجتهادها الاستثنائي. وبدلاً من أن تضطر للاستقالة، غمرتها السعادة لنيل ترقية كبرى مستحقة وزيادة في الراتب.'
    ],
    targetWords: ['Colleague', 'Deadline', 'Promotion', 'Resign', 'Interview', 'Salary', 'Productive', 'Freelance', 'Commission', 'Efficient'],
    questions: [
      {
        id: 1,
        question: 'What qualities made Nour stand out to the management?',
        questionAr: 'ما هي الصفات التي جعلت نور تبرز أمام الإدارة؟',
        options: [
          'She was efficient, productive, and met every deadline',
          'She resigned frequently',
          'She arrived late every day',
          'She refused to speak with colleagues'
        ],
        correctIndex: 0,
        explanationAr: 'كفاءتها العالية وإنتاجيتها والتزامها الدائم بالمواعيد النهائية.'
      },
      {
        id: 2,
        question: 'What was the thrilling outcome of the formal interview?',
        questionAr: 'ما هي النتيجة الرائعة لتلك المقابلة الرسمية؟',
        options: [
          'Nour received a major promotion and an increased salary',
          'She had to resign immediately',
          'The company closed down',
          'She lost her job'
        ],
        correctIndex: 0,
        explanationAr: 'نالت نور ترقية مرموقة وزيادة مستحقة في الراتب (Promotion and salary increase).'
      }
    ]
  },

  // B1 - Unit 15: City & Transport
  // Target Words: Traffic, Pedestrian, Suburb, Commute, Platform, Fare, Navigate, Congestion, Intersection, Infrastructure
  'b1-u15': {
    unitId: 'b1-u15',
    title: 'Navigating the Morning Metropolis',
    titleAr: 'التنقل في الصباح الباكر بالمدينة',
    level: 'B1',
    paragraphs: [
      'Every morning, thousands of residents living in the quiet suburb begin their daily commute across the busy city. Many choose the underground subway platform to bypass road traffic and avoid heavy vehicular congestion.',
      'Above ground, every attentive pedestrian pauses at the intersection for the green walking signal before crossing the wide central avenue.',
      'Modern infrastructure allows electric buses to navigate dedicated transit lanes smoothly. As passengers tap their cards to pay the electronic bus fare, they look out the window at the city’s most famous historical towers.'
    ],
    paragraphsAr: [
      'كل صباح، يبدأ آلاف السكان المقيمين في الضاحية الهادئة تنقلهم اليومي عبر أرجاء المدينة المزدحمة. يفضل الكثيرون منصة قطار الأنفاق لتفادي حركة السير وتجنب الاختناق المروري الخانق.',
      'وفوق الأرض، يتريث كل مشاة منتبه عند التقاطع بانتظار إشارة العبور الخضراء قبل قطع الشارع الرئيسي العريض.',
      'وتتيح البنية التحتية الحديثة للحافلات الكهربائية الملاحة بسلاسة في مسارات مخصصة. وأثناء تمرير الركاب بطاقاتهم لدفع الأجرة، يتأملون من النوافذ أبراج المدينة التاريخية الشهيرة.'
    ],
    targetWords: ['Traffic', 'Pedestrian', 'Suburb', 'Commute', 'Platform', 'Fare', 'Navigate', 'Congestion', 'Intersection', 'Infrastructure'],
    questions: [
      {
        id: 1,
        question: 'Why do commuters from the suburb use the subway platform?',
        questionAr: 'لماذا يستخدم المتنقلون من الضاحية منصة قطار الأنفاق؟',
        options: [
          'To bypass traffic and avoid road congestion',
          'Because there are no walking streets',
          'To see old towers underground',
          'Because the fare is free for everyone'
        ],
        correctIndex: 0,
        explanationAr: 'لتفادي الازدحام المروري والاختناق في شوارع المدينة (Bypass traffic congestion).'
      },
      {
        id: 2,
        question: 'How do modern infrastructure lanes assist electric buses?',
        questionAr: 'كيف تساعد مسارات البنية التحتية الحديثة الحافلات الكهربائية؟',
        options: [
          'They allow buses to navigate smoothly through dedicated lanes',
          'They stop all buses from moving',
          'They force pedestrians to run',
          'They make the commute slower'
        ],
        correctIndex: 0,
        explanationAr: 'تسمح للحافلات بالملاحة والانطلاق بسلاسة عبر مسارات مخصصة.'
      }
    ]
  }
};

// ── Smart Narrative Story Generator (No Robotic Meta-Templates) ───────────────
export function getUnitStory(unitId: string): UnitStory | null {
  if (CURATED_STORIES[unitId]) {
    return CURATED_STORIES[unitId];
  }

  const unit = getUnit(unitId);
  if (!unit || !unit.words || unit.words.length === 0) return null;

  const words = unit.words;
  const wordList = words.map(w => w.word);
  const protagonist = 'Sami';

  // Build a true narrative scenario based on the unit topic
  const w1 = words[0]?.word || 'concept';
  const w2 = words[1]?.word || 'principle';
  const w3 = words[2]?.word || 'approach';
  const w4 = words[3]?.word || 'practice';
  const w5 = words[4]?.word || 'skill';
  const w6 = words[5]?.word || 'method';
  const w7 = words[6]?.word || 'strategy';
  const w8 = words[7]?.word || 'system';
  const w9 = words[8]?.word || 'perspective';
  const w10 = words[9]?.word || 'goal';

  const p1 = `During an ambitious project centered on ${unit.title.toLowerCase()}, ${protagonist} faced a compelling new situation. Dealing with "${w1}" and navigating the subtleties of "${w2}" required close attention to how "${w3}" shaped every decision.`;
  const p2 = `Collaborating with experienced mentors, ${protagonist} focused on mastering "${w4}" alongside "${w5}". Applying "${w6}" and evaluating "${w7}" helped the team overcome initial hurdles and build genuine momentum.`;
  const p3 = `With steady discipline, understanding "${w8}" and integrating "${w9}" paved the way to reach their ultimate "${w10}". By the end of the journey, ${protagonist} felt a deep sense of confidence and practical mastery.`;

  const p1Ar = `خلال مشروع طموح يتمحور حول "${unit.titleAr}"، واجه ${protagonist === 'Sami' ? 'سامي' : protagonist} موقفاً عملياً جديداً ومثيراً. تطلب التعامل مع "${w1}" واستيعاب تفاصيل "${w2}" انتباهاً دقيقاً لكيفية تأثير "${w3}" على القرارات اليومية.`;
  const p2Ar = `بالتعاون مع مرشدين وخبراء، ركّز الفريق على توظيف مهارات "${w4}" و"${w5}". وساهم تطبيق "${w6}" وتقييم "${w7}" في تجاوز العقبات الأولى وبناء تقدم ملموس وواثق.`;
  const p3Ar = `وبالالتزام المستمر، أتاح فهم "${w8}" ودمج أبعاد "${w9}" الوصول إلى تحقيق "${w10}" بنجاح. وفي ختام هذه التجربة، شعر سامي بفخر واعتزاز وإتقان حقيقي لهذا المجال.`;

  return {
    unitId: unit.id,
    title: `The Journey of ${unit.title}`,
    titleAr: `رحلة: ${unit.titleAr}`,
    level: unit.level || unit.id.split('-')[0].toUpperCase(),
    paragraphs: [p1, p2, p3],
    paragraphsAr: [p1Ar, p2Ar, p3Ar],
    targetWords: wordList,
    questions: [
      {
        id: 1,
        question: `What was the primary focus of ${protagonist}'s journey?`,
        questionAr: `ما الذي ركّزت عليه تجربة سامي في هذه القصة؟`,
        options: [
          `Mastering practical skills and vocabulary related to ${unit.title}`,
          `Going on an unrelated vacation`,
          `Quitting the project early`,
          `Fixing broken furniture`
        ],
        correctIndex: 0,
        explanationAr: `ركّزت الرحلة على تطبيق وإتقان المفاهيم والمهارات العملية لوحدة "${unit.titleAr}".`
      },
      {
        id: 2,
        question: `How did the team overcome initial hurdles?`,
        questionAr: `كيف تمكن الفريق من تجاوز العقبات الأولى بنجاح؟`,
        options: [
          `By applying disciplined methods, collaborating, and evaluating strategies`,
          `By ignoring all advice and stopping communication`,
          `By giving up on their goals`,
          `By cancelling the entire plan`
        ],
        correctIndex: 0,
        explanationAr: `من خلال التعاون المثمر، والتطبيق المنهجي للمهارات، والتقييم المستمر للاستراتيجيات.`
      }
    ]
  };
}
