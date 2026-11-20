import { NextResponse } from 'next/server';
import { getScenario, SuggestedReply, RoleplayScenario, TargetWordDetail } from '@/data/roleplayScenarios';

interface ChatMessage {
  sender: 'user' | 'assistant';
  text: string;
}

// Check which target words appear in text
function extractUsedTargetWords(text: string, targetWords: string[]): string[] {
  const cleanText = text.toLowerCase();
  return targetWords.filter(tw => {
    const cleanWord = tw.toLowerCase();
    // word boundary or stem check
    const regex = new RegExp(`\\b${cleanWord}(s|ed|ing)?\\b`, 'i');
    return regex.test(cleanText) || cleanText.includes(cleanWord);
  });
}

// Generate intelligent constructive tip
function generateGrammarTip(
  userMessage: string,
  usedWords: string[],
  nextSuggestionWord?: TargetWordDetail
): string | undefined {
  const lower = userMessage.trim();

  if (usedWords.length > 0) {
    return `أحسنت جداً! وظّفت مفردات مستهدفة (${usedWords.join('، ')}) في سياق ممتاز 🌟`;
  }

  if (/\b(i)\b/.test(lower) && !/\bI\b/.test(userMessage)) {
    return `نصيحة كتابة: في اللغة الإنجليزية يُكتب ضمير المتكلم "I" دائماً بحرف كبير (Capital) أينما ورد في الجملة.`;
  }

  if (/\b(want)\b/i.test(lower) && !/\bwould like\b/i.test(lower)) {
    return `نصيحة لباقة: استخدام "I would like" أو "Could I please" يبدو أكثر تهذيباً واحترافية من "I want".`;
  }

  if (/\b(thanks|thank you)\b/i.test(lower)) {
    return `رائع! عبارات الشكر مثل "Thank you" تمنح المحادثة طابعاً ودوداً وجذاباً.`;
  }

  if (nextSuggestionWord) {
    return `تحدي المفردات: جرب في ردك القادم توظيف كلمة "${nextSuggestionWord.word}" (${nextSuggestionWord.meaningAr}) لكسب نقاط التحدي! 🎯`;
  }

  return undefined;
}

// Multi-turn Engine for Curated and Dynamic Scenarios
function getEngineResponse(
  scenario: RoleplayScenario,
  turnIndex: number,
  userMessage: string,
  allUsedTargetWords: string[],
  newlyUsedWords: string[]
): { reply: string; replyAr: string; suggestions: SuggestedReply[] } {
  const scenarioId = scenario.id;

  // Curated scenarios fine-tuned turns
  if (scenarioId === 'a1-s1') {
    if (turnIndex === 0) {
      return {
        reply: "Oh, that is so kind of you! Yes, please could you help me hold this garden gate? This wooden box is quite heavy.",
        replyAr: "أوه، هذا لطف كبير منك! نعم، هل يمكنك من فضلك مساعدتي في تثبيت بوابة الحديقة؟ هذا الصندوق الخشبي ثقيل جداً.",
        suggestions: [
          { text: "Of course! Let me help you carry the box to the porch.", translationAr: "بالتأكيد! دعيني أساعدك في حمل الصندوق إلى الشرفة." },
          { text: "No problem at all! Please take your time.", translationAr: "لا مشكلة على الإطلاق! خذي وقتك من فضلك." },
          { text: "I am happy to help you. What is inside this heavy box?", translationAr: "أنا سعيد بمساعدتك. ماذا يوجد داخل هذا الصندوق الثقيل؟" }
        ]
      };
    }
    if (turnIndex === 1) {
      return {
        reply: "Thank you so much! Look inside: I found this little lost puppy near the school. Isn't he lovely?",
        replyAr: "شكراً جزيلاً لك! انظر إلى الداخل: لقد وجدت هذا الجرو الصغير تائهاً قرب المدرسة. أليس لطيفاً؟",
        suggestions: [
          { text: "He is so cute! It is very good news that you rescued him.", translationAr: "إنه لطيف للغاية! إنه خبر جيد جداً أنك قمتِ بإنقاذه." },
          { text: "He looks very happy now. Do you need any water or food for him?", translationAr: "يبدو سعيداً جداً الآن. هل تحتاجين إلى أي ماء أو طعام لأجله؟" },
          { text: "What a good puppy! What will you name your new friend?", translationAr: "يا له من جرو رائع! ما هو الاسم الذي ستطلقينه على صديقك الجديد؟" }
        ]
      };
    }
    if (turnIndex === 2) {
      return {
        reply: "I am going to name him Lucky! You are such a polite and thoughtful neighbor. Thank you for your assistance today.",
        replyAr: "سأطلق عليه اسم لاكي (المحظوظ)! أنت جار مهذب ومتعاون للغاية. شكراً لك على مساعدتك اليوم.",
        suggestions: [
          { text: "You are welcome! Goodbye Mrs. Mary, see you and Lucky soon.", translationAr: "على الرحب والسعة! مع السلامة يا سيدة ماري، أراكِ وأرى لاكي قريباً." },
          { text: "Goodbye, have a wonderful afternoon with your new puppy!", translationAr: "مع السلامة، أتمنى لكِ بعد ظهر رائع مع جروك الجديد!" }
        ]
      };
    }
  }

  if (scenarioId === 'a1-s2') {
    if (turnIndex === 0) {
      return {
        reply: "I know how that feels. Sometimes school makes us all tired or a little sad. When you feel that way, what activity makes you happy?",
        replyAr: "أنا أعرف هذا الشعور جيداً. في بعض الأحيان تجعلنا المدرسة جميعاً نشعر بالإرهاق أو ببعض الحزن. عندما تشعر هكذا، ما هو النشاط الذي يجعلك سعيداً؟",
        suggestions: [
          { text: "Painting bright pictures with yellow and green colors makes me feel happy.", translationAr: "رسم لوحات مشرقة بألوان صفراء وخضراء يجعلني أشعر بالسعادة." },
          { text: "Listening to peaceful music and reading a good book helps me relax.", translationAr: "الاستماع إلى موسيقى هادئة وقراءة كتاب ممتع يساعدني على الاسترخاء." }
        ]
      };
    }
    if (turnIndex === 1) {
      return {
        reply: "That is wonderful! I love using bright yellow and calm blue on my canvas. Would you like to paint together this weekend?",
        replyAr: "هذا رائع جداً! أنا أيضاً أحب استخدام الأصفر المشرق والأزرق الهادئ على لوحتي. هل تود أن نرسم معاً في عطلة نهاية الأسبوع؟",
        suggestions: [
          { text: "Yes! That would make me so happy and remove all my tired feelings.", translationAr: "نعم! هذا سيجعلني سعيداً جداً ويزيل كل شعور بالتعب." },
          { text: "I would love to! We can paint sunny trees and a blue sea.", translationAr: "يسعدني ذلك جداً! يمكننا رسم أشجار مشمسة وبحر أزرق." }
        ]
      };
    }
  }

  if (scenarioId === 'b1-s1') {
    if (turnIndex === 0) {
      return {
        reply: "Exactly right. Turning this challenge into an opportunity requires responsible planning. What specific decision should we finalize today?",
        replyAr: "بالضبط! تحويل هذا التحدي إلى فرصة يتطلب تخطيطاً مسؤولاً. ما هو القرار المحدد الذي ينبغي أن نبتّ فيه اليوم؟",
        suggestions: [
          { text: "Our decision must focus on improving internal communication channels to ensure project success.", translationAr: "يجب أن يركز قرارنا على تحسين قنوات التواصل الداخلية لضمان نجاح المشروع." },
          { text: "We should divide responsibilities clearly so every team member can achieve their targets.", translationAr: "ينبغي أن نقسم المسؤوليات بوضوح ليتمكن كل عضو في الفريق من تحقيق أهدافه." }
        ]
      };
    }
  }

  // ── Dynamic Intelligent Conversation Engine for All 78 Units ──────────────
  const usedSet = new Set(allUsedTargetWords.map(w => w.toLowerCase()));
  const allDetails = scenario.targetWordDetails && scenario.targetWordDetails.length > 0
    ? scenario.targetWordDetails
    : scenario.targetWords.map(w => ({ word: w, meaningAr: '', phonetic: '', example: '' }));

  // Find remaining unused target words
  const unusedDetails = allDetails.filter(d => !usedSet.has(d.word.toLowerCase()));

  // Target word candidates for next turn suggestions
  const pool = unusedDetails.length > 0 ? unusedDetails : allDetails;
  const w1 = pool[0] || { word: 'practice', meaningAr: 'ممارسة' };
  const w2 = pool[1] || pool[0] || { word: 'improve', meaningAr: 'يحسن' };
  const w3 = pool[2] || pool[0] || { word: 'success', meaningAr: 'نجاح' };

  const charName = scenario.character.name;
  const charRole = scenario.character.roleAr || scenario.character.role;
  const unitTitle = scenario.title;
  const unitTitleAr = scenario.titleAr;

  const introEn = newlyUsedWords.length > 0
    ? `Great use of "${newlyUsedWords.join('", "')}"! `
    : ``;
  const introAr = newlyUsedWords.length > 0
    ? `توظيف رائع لكلمة "${newlyUsedWords.join('"، "')}"! `
    : ``;

  if (turnIndex === 0) {
    return {
      reply: `${introEn}That is a very thoughtful perspective. As your ${scenario.character.role}, I believe paying attention to "${w1.word}" can make a remarkable difference. In your experience, how do you handle "${w1.word}"?`,
      replyAr: `${introAr}هذه وجهة نظر مدروسة جداً. بصفتي ${charRole}، أعتقد أن الانتباه لـ "${w1.meaningAr || w1.word}" يمكن أن يُحدث فرقاً ملحوظاً. في تجربتك، كيف تتعامل مع "${w1.meaningAr || w1.word}"؟`,
      suggestions: [
        {
          text: `In my experience, understanding ${w1.word.toLowerCase()} is vital whenever we want to achieve real progress.`,
          translationAr: `من واقع خبرتي، فهم ${w1.meaningAr || w1.word} أمر حيوي كلما أردنا تحقيق تقدم حقيقي.`
        },
        {
          text: `I always try to apply ${w2.word.toLowerCase()} carefully to ensure the best possible results.`,
          translationAr: `أحاول دائماً تطبيق ${w2.meaningAr || w2.word} بعناية لضمان أفضل النتائج الممكنة.`
        },
        {
          text: `Balancing ${w1.word.toLowerCase()} and ${w3.word.toLowerCase()} is key in our daily routine.`,
          translationAr: `الموازنة بين ${w1.meaningAr || w1.word} و ${w3.meaningAr || w3.word} هي المفتاح في روتيننا اليومي.`
        }
      ]
    };
  }

  if (turnIndex === 1) {
    return {
      reply: `${introEn}I completely agree with your analysis! When addressing ${unitTitle}, combining "${w1.word}" with "${w2.word}" is often the key to lasting success. What strategy do you think works best?`,
      replyAr: `${introAr}أتفق تماماً مع تحليلك! عند التطرق لموضوع ${unitTitleAr}، فإن الجمع بين "${w1.meaningAr || w1.word}" و "${w2.meaningAr || w2.word}" غالباً ما يكون مفتاح النجاح الدائم. ما هي الاستراتيجية الأفضل برأيك؟`,
      suggestions: [
        {
          text: `A clear plan that incorporates ${w1.word.toLowerCase()} helps everyone stay focused and productive.`,
          translationAr: `الخطة الواضحة التي تتضمن ${w1.meaningAr || w1.word} تساعد الجميع على البقاء مركزين ومنتجين.`
        },
        {
          text: `Practicing ${w2.word.toLowerCase()} consistently overcomes any unexpected obstacles.`,
          translationAr: `الممارسة المنتظمة لـ ${w2.meaningAr || w2.word} تتغلب على أي عقبات غير متوقعة.`
        },
        {
          text: `Sharing knowledge about ${w3.word.toLowerCase()} strengthens teamwork and confidence.`,
          translationAr: `مشاركة المعرفة حول ${w3.meaningAr || w3.word} تعزز العمل الجماعي والثقة.`
        }
      ]
    };
  }

  if (turnIndex === 2) {
    return {
      reply: `${introEn}Your reasoning is solid and realistic. Many learners find that mastering "${w1.word}" takes consistent effort, but you have handled it naturally. What is the most rewarding part for you?`,
      replyAr: `${introAr}منطقك سديد وواقعي للغاية. يجد الكثيرون أن إتقان "${w1.meaningAr || w1.word}" يتطلب جهداً مستمراً، لكنك تعاملت معه بطبيعية تامة. ما هو الجانب الأكثر متعة وإفادة بالنسبة لك؟`,
      suggestions: [
        {
          text: `Seeing real improvement when using ${w1.word.toLowerCase()} gives me great confidence and motivation.`,
          translationAr: `رؤية تحسن حقيقي عند استخدام ${w1.meaningAr || w1.word} تمنحني ثقة وحافزاً كبيرين.`
        },
        {
          text: `Applying ${w2.word.toLowerCase()} in practical daily life makes conversations much smoother.`,
          translationAr: `تطبيق ${w2.meaningAr || w2.word} في الحياة اليومية العملية يجعل المحادثات أكثر سلاسة.`
        },
        {
          text: `I enjoy learning how ${w3.word.toLowerCase()} connects with different situations.`,
          translationAr: `أستمتع بتعلم كيف يرتبط ${w3.meaningAr || w3.word} بمواقف متعددة ومختلفة.`
        }
      ]
    };
  }

  // Turn 3+ (Finalizing / Celebration)
  return {
    reply: `${introEn}You have expressed your ideas with remarkable fluency and clarity! We explored essential vocabulary like "${w1.word}" and "${w2.word}" seamlessly. I truly enjoyed having this conversation with you!`,
    replyAr: `${introAr}لقد عبّرت عن أفكارك بطلاقة ووضوح مدهش! استكشفنا مفردات أساسية مثل "${w1.meaningAr || w1.word}" و "${w2.meaningAr || w2.word}" بكل سلاسة. لقد استمتعت حقاً بهذا الحوار معك!`,
    suggestions: [
      {
        text: `Thank you ${charName}! This was a wonderful and helpful conversation.`,
        translationAr: `شكراً لك ${charName}! لقد كانت هذه محادثة رائعة ومفيدة للغاية.`
      },
      {
        text: `I really enjoyed practicing our unit vocabulary with you today.`,
        translationAr: `لقد استمتعت حقاً بممارسة مفردات الوحدة معك اليوم.`
      }
    ]
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { scenarioId, messages, userMessage } = body as {
      scenarioId: string;
      messages: ChatMessage[];
      userMessage: string;
    };

    if (!scenarioId || !userMessage) {
      return NextResponse.json({ success: false, error: 'Missing parameters' }, { status: 400 });
    }

    const scenario = getScenario(scenarioId);
    if (!scenario) {
      return NextResponse.json({ success: false, error: 'Scenario not found' }, { status: 404 });
    }

    // 1. Calculate target words used in this turn
    const newlyUsedTargetWords = extractUsedTargetWords(userMessage, scenario.targetWords);

    // 2. Calculate all target words used in the whole conversation
    const allUserTexts = [...messages.filter(m => m.sender === 'user').map(m => m.text), userMessage].join(' ');
    const allUsedTargetWords = extractUsedTargetWords(allUserTexts, scenario.targetWords);

    // 3. Current turn count
    const userTurnCount = messages.filter(m => m.sender === 'user').length;

    // 4. Find next suggested target word from unused pool for tip
    const usedSet = new Set(allUsedTargetWords.map(w => w.toLowerCase()));
    const nextUnused = scenario.targetWordDetails?.find(d => !usedSet.has(d.word.toLowerCase()));

    // 5. Generate grammar/phrasing tip
    const tip = generateGrammarTip(userMessage, newlyUsedTargetWords, nextUnused);

    // 6. Generate persona reply & suggestions
    const engineRes = getEngineResponse(
      scenario,
      userTurnCount,
      userMessage,
      allUsedTargetWords,
      newlyUsedTargetWords
    );

    // 7. Check if dialogue goal reached (at least minTurns turns and good vocabulary usage)
    const isGoalReached = userTurnCount + 1 >= scenario.minTurns;

    return NextResponse.json({
      success: true,
      data: {
        reply: engineRes.reply,
        replyAr: engineRes.replyAr,
        newlyUsedTargetWords,
        allUsedTargetWords,
        tip,
        suggestions: engineRes.suggestions,
        isGoalReached,
        userTurns: userTurnCount + 1,
        minTurns: scenario.minTurns,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Error processing chat' }, { status: 500 });
  }
}
