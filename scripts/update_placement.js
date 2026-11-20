const fs = require('fs');
const data = JSON.parse(fs.readFileSync('./src/data/words.json', 'utf8'));

data.placementTest = {
  questions: [
    // A1 (5 questions)
    {
      id: 'pt-a1-1', level: 'A1', type: 'vocabulary',
      question: 'What is the opposite of "hot"?',
      questionAr: 'ما هو عكس كلمة "hot" (حار)؟',
      options: ['Cold', 'Warm', 'Big', 'Fast'],
      correct: 'Cold'
    },
    {
      id: 'pt-a1-2', level: 'A1', type: 'grammar',
      question: 'She ___ a student.',
      questionAr: 'هي ___ طالبة.',
      options: ['is', 'are', 'am', 'be'],
      correct: 'is'
    },
    {
      id: 'pt-a1-3', level: 'A1', type: 'vocabulary',
      question: 'Which one is a fruit?',
      questionAr: 'أي من هذه فاكهة؟',
      options: ['Apple', 'Chair', 'Shirt', 'Book'],
      correct: 'Apple'
    },
    {
      id: 'pt-a1-4', level: 'A1', type: 'grammar',
      question: 'I ___ to school every day.',
      questionAr: 'أنا ___ إلى المدرسة كل يوم.',
      options: ['go', 'goes', 'going', 'gone'],
      correct: 'go'
    },
    {
      id: 'pt-a1-5', level: 'A1', type: 'vocabulary',
      question: 'What colour is the sky on a clear day?',
      questionAr: 'ما لون السماء في يوم صافٍ؟',
      options: ['Blue', 'Green', 'Red', 'Yellow'],
      correct: 'Blue'
    },

    // A2 (5 questions)
    {
      id: 'pt-a2-1', level: 'A2', type: 'grammar',
      question: 'Yesterday, I ___ to the cinema.',
      questionAr: 'بالأمس، أنا ___ إلى السينما.',
      options: ['went', 'go', 'going', 'will go'],
      correct: 'went'
    },
    {
      id: 'pt-a2-2', level: 'A2', type: 'grammar',
      question: 'This book is ___ than that one.',
      questionAr: 'هذا الكتاب ___ من ذلك.',
      options: ['more interesting', 'most interesting', 'interesting', 'interestingly'],
      correct: 'more interesting'
    },
    {
      id: 'pt-a2-3', level: 'A2', type: 'vocabulary',
      question: 'What do you use to cut paper?',
      questionAr: 'ماذا تستخدم لقص الورق؟',
      options: ['Scissors', 'Hammer', 'Brush', 'Spoon'],
      correct: 'Scissors'
    },
    {
      id: 'pt-a2-4', level: 'A2', type: 'grammar',
      question: 'She has ___ finished her homework.',
      questionAr: 'هي ___ أنهت واجبها.',
      options: ['already', 'yet', 'since', 'for'],
      correct: 'already'
    },
    {
      id: 'pt-a2-5', level: 'A2', type: 'reading',
      question: '"I wake up at 7, eat breakfast, and take the bus to work." What time does the person wake up?',
      questionAr: '"أستيقظ الساعة 7 وأتناول الفطور وأركب الباص للعمل." متى يستيقظ الشخص؟',
      options: ['7:00', '8:00', '6:00', '9:00'],
      correct: '7:00'
    },

    // B1 (5 questions)
    {
      id: 'pt-b1-1', level: 'B1', type: 'grammar',
      question: 'If it rains tomorrow, I ___ stay at home.',
      questionAr: 'إذا أمطرت غداً، ___ سأبقى في المنزل.',
      options: ['will', 'would', 'had', 'am'],
      correct: 'will'
    },
    {
      id: 'pt-b1-2', level: 'B1', type: 'vocabulary',
      question: 'What does "ambitious" mean?',
      questionAr: 'ماذا تعني كلمة "ambitious"؟',
      options: ['Having a strong desire to succeed', 'Being lazy and careless', 'Feeling very tired', 'Being afraid of everything'],
      correct: 'Having a strong desire to succeed'
    },
    {
      id: 'pt-b1-3', level: 'B1', type: 'grammar',
      question: 'You ___ wear a seatbelt when driving. It is the law.',
      questionAr: 'أنت ___ ترتدي حزام الأمان عند القيادة. إنه القانون.',
      options: ['must', 'might', 'could', 'would'],
      correct: 'must'
    },
    {
      id: 'pt-b1-4', level: 'B1', type: 'vocabulary',
      question: 'Choose the correct meaning of "negotiate".',
      questionAr: 'اختر المعنى الصحيح لكلمة "negotiate".',
      options: ['To discuss terms to reach an agreement', 'To refuse all offers', 'To run away from problems', 'To argue without listening'],
      correct: 'To discuss terms to reach an agreement'
    },
    {
      id: 'pt-b1-5', level: 'B1', type: 'reading',
      question: '"Despite the heavy traffic, she managed to arrive on time for the interview." What is true about the woman?',
      questionAr: '"رغم الازدحام الشديد، استطاعت الوصول في الوقت المحدد للمقابلة." ما الصحيح عن المرأة؟',
      options: ['She was punctual despite difficulties', 'She was late to the interview', 'She cancelled the interview', 'She took a taxi'],
      correct: 'She was punctual despite difficulties'
    },

    // B2 (4 questions)
    {
      id: 'pt-b2-1', level: 'B2', type: 'grammar',
      question: 'She ___ at this company for five years when she finally got promoted.',
      questionAr: 'هي ___ في هذه الشركة لمدة خمس سنوات عندما تمت ترقيتها أخيراً.',
      options: ['had been working', 'has worked', 'is working', 'works'],
      correct: 'had been working'
    },
    {
      id: 'pt-b2-2', level: 'B2', type: 'vocabulary',
      question: 'What does "unprecedented" mean?',
      questionAr: 'ماذا تعني كلمة "unprecedented"؟',
      options: ['Never happened before', 'Very common', 'Easily predicted', 'Not important'],
      correct: 'Never happened before'
    },
    {
      id: 'pt-b2-3', level: 'B2', type: 'grammar',
      question: 'Not only ___ the exam, but she also scored the highest in her class.',
      questionAr: 'ليس فقط ___ الامتحان، بل أيضاً حصلت على أعلى درجة في صفها.',
      options: ['did she pass', 'she passed', 'she did pass', 'has she passed'],
      correct: 'did she pass'
    },
    {
      id: 'pt-b2-4', level: 'B2', type: 'reading',
      question: '"The government\'s austerity measures, while economically necessary, have disproportionately affected lower-income families." What is the main idea?',
      questionAr: 'ما الفكرة الرئيسية للجملة؟',
      options: ['Budget cuts hurt the poor more than others', 'The government supports lower-income families', 'Austerity measures are unnecessary', 'All families are equally affected'],
      correct: 'Budget cuts hurt the poor more than others'
    },

    // C1 (3 questions)
    {
      id: 'pt-c1-1', level: 'C1', type: 'grammar',
      question: '___ he had studied harder, he might have passed the exam.',
      questionAr: '___ درس بجدية أكثر، ربما كان قد نجح في الامتحان.',
      options: ['Had', 'If', 'Should', 'Were'],
      correct: 'Had'
    },
    {
      id: 'pt-c1-2', level: 'C1', type: 'vocabulary',
      question: 'Choose the word closest in meaning to "ubiquitous".',
      questionAr: 'اختر الكلمة الأقرب في المعنى لـ "ubiquitous".',
      options: ['Found everywhere', 'Extremely rare', 'Very expensive', 'Highly dangerous'],
      correct: 'Found everywhere'
    },
    {
      id: 'pt-c1-3', level: 'C1', type: 'grammar',
      question: 'Under no circumstances ___ to leave the building during the drill.',
      questionAr: 'لا يُسمح بأي حال من الأحوال ___ بمغادرة المبنى أثناء التدريب.',
      options: ['are employees permitted', 'employees are permitted', 'employees permitted', 'do employees permit'],
      correct: 'are employees permitted'
    },

    // C2 (3 questions)
    {
      id: 'pt-c2-1', level: 'C2', type: 'vocabulary',
      question: 'Which word means "a formal statement of retraction"?',
      questionAr: 'أي كلمة تعني "بيان رسمي بالتراجع عن موقف"؟',
      options: ['Recantation', 'Reverberation', 'Recapitulation', 'Remuneration'],
      correct: 'Recantation'
    },
    {
      id: 'pt-c2-2', level: 'C2', type: 'grammar',
      question: 'Seldom ___ such a compelling argument in an academic paper.',
      questionAr: 'نادراً ما ___ حجة بهذه القوة في ورقة أكاديمية.',
      options: ['have I encountered', 'I have encountered', 'I encountered', 'did I encountered'],
      correct: 'have I encountered'
    },
    {
      id: 'pt-c2-3', level: 'C2', type: 'reading',
      question: '"The author\'s penchant for sesquipedalian prose renders the narrative needlessly opaque." What does this criticise?',
      questionAr: 'ما الذي تنتقده هذه الجملة؟',
      options: ['The use of overly complex language', 'The lack of research evidence', 'Poor story structure', 'The author\'s personal opinions'],
      correct: 'The use of overly complex language'
    }
  ]
};

fs.writeFileSync('./src/data/words.json', JSON.stringify(data, null, 2), 'utf8');
console.log('Done! Total questions: ' + data.placementTest.questions.length);
const counts = {};
data.placementTest.questions.forEach(q => { counts[q.level] = (counts[q.level]||0)+1; });
console.log('By level:', JSON.stringify(counts));
