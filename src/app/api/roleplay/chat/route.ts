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
    const regex = new RegExp(`\\b${cleanWord}(s|ed|ing|d|es)?\\b`, 'i');
    return regex.test(cleanText) || cleanText.includes(cleanWord);
  });
}

// ── NLP Intent & Keyword Analyzer for Smart Fallback ────────────────────────
interface AnalyzedMessage {
  isQuestion: boolean;
  isGreeting: boolean;
  isAffirmative: boolean;
  isNegative: boolean;
  isThanking: boolean;
  meaningfulWords: string[];
}

function analyzeUserMessage(text: string): AnalyzedMessage {
  const clean = text.trim();
  const lower = clean.toLowerCase();

  const isQuestion =
    clean.includes('?') ||
    /^(what|where|when|who|why|how|can|could|would|is|are|do|does|did|will|should|may)\b/i.test(lower);
  const isGreeting = /\b(hi|hello|hey|good morning|good afternoon|good evening|greetings)\b/i.test(lower);
  const isAffirmative = /\b(yes|yeah|sure|of course|certainly|gladly|happy to|i can|i will|ok|okay|agreed)\b/i.test(lower);
  const isNegative = /\b(no|cannot|can't|sorry|unable|busy|not now|unfortunately|not really)\b/i.test(lower);
  const isThanking = /\b(thank|thanks|appreciate|grateful)\b/i.test(lower);

  const stopWords = new Set([
    'this', 'that', 'with', 'from', 'have', 'your', 'about', 'some', 'there',
    'what', 'when', 'where', 'which', 'here', 'just', 'like', 'will', 'would',
    'could', 'should', 'very', 'much', 'more', 'also', 'really'
  ]);

  const words = lower.match(/[a-z]{4,}/g) || [];
  const meaningfulWords = words.filter(w => !stopWords.has(w));

  return {
    isQuestion,
    isGreeting,
    isAffirmative,
    isNegative,
    isThanking,
    meaningfulWords,
  };
}

// ── 1. Real LLM AI Provider (Gemini / Groq / OpenAI) ────────────────────────
interface AIRoleplayResponse {
  reply: string;
  replyAr: string;
  tip?: string;
  suggestions: SuggestedReply[];
}

async function callLLMProvider(
  scenario: RoleplayScenario,
  messages: ChatMessage[],
  userMessage: string,
  unusedWords: string[]
): Promise<AIRoleplayResponse | null> {
  const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (!geminiKey && !groqKey && !openaiKey) {
    return null; // No key configured, use smart semantic engine
  }

  const historyText = messages
    .slice(-6)
    .map(m => `${m.sender === 'user' ? 'Learner' : scenario.character.name}: ${m.text}`)
    .join('\n');

  const systemPrompt = `You are an expert English language tutor roleplaying in character with an English student.
Character: ${scenario.character.name} (${scenario.character.roleAr || scenario.character.role})
Current Scenario: ${scenario.title} (${scenario.titleAr})
Scenario Context: ${scenario.description} (${scenario.descriptionAr})
Learner Level: ${scenario.level}
Target Words: ${scenario.targetWords.join(', ')}
Remaining Unused Target Words: ${unusedWords.join(', ')}

Instructions:
1. Stay strictly in character as ${scenario.character.name}.
2. Respond DIRECTLY and DYNAMICALLY to what the learner said in their latest message. Never give a generic canned reply!
3. Keep sentence length and grammar matching CEFR Level ${scenario.level}:
   - A1/A2: 1-2 simple, clear, encouraging sentences.
   - B1/B2: 2-3 natural conversational sentences. Ask an engaging question.
   - C1: Sophisticated, nuanced vocabulary.
4. When fitting, naturally steer towards or use one of the unused target words (${unusedWords.join(', ')}).
5. Provide an accurate natural Arabic translation (replyAr).
6. Provide an encouraging Arabic tip (tip) about grammar, polite phrasing, or vocabulary.
7. Provide 2-3 natural English suggestions the learner could say next, with Arabic translations (translationAr).

Respond strictly in valid JSON:
{
  "reply": "English in-character response",
  "replyAr": "الترجمة العربية للرد",
  "tip": "نصيحة تعليمية بالعربية",
  "suggestions": [
    {"text": "English suggestion", "translationAr": "الترجمة العربية"}
  ]
}`;

  const userPrompt = `Conversation History:
${historyText || '(Conversation just started)'}

Learner: "${userMessage}"

Generate in-character response in JSON:`;

  // 1. Google Gemini (Fast & Generous Free Tier)
  if (geminiKey) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
          systemInstruction: { parts: [{ text: systemPrompt }] },
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.7,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          const clean = rawText.replace(/```json\n?/g, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(clean);
          if (parsed.reply && parsed.replyAr) return parsed;
        }
      }
    } catch (e) {
      console.warn('Gemini API call failed:', e);
    }
  }

  // 2. Groq (Ultra-fast Llama-3.3)
  if (groqKey) {
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${groqKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.7,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const rawText = data?.choices?.[0]?.message?.content;
        if (rawText) {
          const clean = rawText.replace(/```json\n?/g, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(clean);
          if (parsed.reply && parsed.replyAr) return parsed;
        }
      }
    } catch (e) {
      console.warn('Groq API call failed:', e);
    }
  }

  // 3. OpenAI (GPT-4o-mini)
  if (openaiKey) {
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.7,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const rawText = data?.choices?.[0]?.message?.content;
        if (rawText) {
          const clean = rawText.replace(/```json\n?/g, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(clean);
          if (parsed.reply && parsed.replyAr) return parsed;
        }
      }
    } catch (e) {
      console.warn('OpenAI API call failed:', e);
    }
  }

  return null;
}

// ── 2. Smart Dynamic Semantic Engine (Zero-Latency Fallback) ────────────────
function getDynamicContextualReply(
  scenario: RoleplayScenario,
  userMessage: string,
  userTurnCount: number,
  allUsedTargetWords: string[],
  newlyUsedTargetWords: string[]
): AIRoleplayResponse {
  const analysis = analyzeUserMessage(userMessage);
  const char = scenario.character;
  const isFinalTurn = userTurnCount + 1 >= scenario.minTurns;

  const usedSet = new Set(allUsedTargetWords.map(w => w.toLowerCase()));
  const unusedTargetDetails = (scenario.targetWordDetails || []).filter(
    d => !usedSet.has(d.word.toLowerCase())
  );
  const nextTarget = unusedTargetDetails[0] || scenario.targetWordDetails?.[0] || {
    word: scenario.targetWords[0] || 'practice',
    meaningAr: 'ممارسة',
  };

  const keyWord = analysis.meaningfulWords[0] || '';

  // Determine dynamic English response based on user's exact communicative intent
  let reply = '';
  let replyAr = '';

  if (analysis.isQuestion) {
    // User asked a question! Directly answer it in character!
    if (analysis.isGreeting) {
      reply = `Good to see you! To answer your question: yes, absolutely! As a ${char.role.toLowerCase()}, I am glad you asked. Could we also use "${nextTarget.word}" as we continue?`;
      replyAr = `يسعدني لقاؤك! وللإجابة على سؤالك: نعم، بالتأكيد! بصفتي ${char.roleAr || char.role}، يسعدني أنك سألت عن ذلك. هل يمكننا أيضاً توظيف "${nextTarget.meaningAr || nextTarget.word}" في حديثنا؟`;
    } else {
      reply = `That is a great question about ${keyWord ? keyWord : 'this'}! From my experience as a ${char.role.toLowerCase()}, I completely agree with your point. What do you think about "${nextTarget.word}"?`;
      replyAr = `هذا سؤال رائع ومهم! من واقع خبرتي كـ ${char.roleAr || char.role}، أتفق تماماً مع وجهة نظرك. ما رأيك بشأن "${nextTarget.meaningAr || nextTarget.word}"؟`;
    }
  } else if (analysis.isNegative) {
    // User declined, apologized, or said no
    reply = `I completely understand, no worries at all! We can take our time. Would you like to focus on "${nextTarget.word}" instead?`;
    replyAr = `أتفهم ذلك تماماً، لا داعي للقلق على الإطلاق! يمكننا أخذ وقتنا. هل ترغب في التركيز على "${nextTarget.meaningAr || nextTarget.word}" بدلاً من ذلك؟`;
  } else if (analysis.isAffirmative || analysis.isThanking) {
    // User agreed or expressed gratitude
    reply = `You are very welcome, and thank you for your enthusiasm! That sounds wonderful. Let's make sure we include "${nextTarget.word}" in our conversation today.`;
    replyAr = `على الرحب والسعة، وشكراً لحماسك الرائع! يبدو ذلك رائعاً جداً. دعنا نحرص على استخدام "${nextTarget.meaningAr || nextTarget.word}" في محادثتنا اليوم.`;
  } else if (analysis.isGreeting) {
    // User greeted
    reply = `Hello! It is wonderful talking with you today. As a ${char.role.toLowerCase()}, I am excited to discuss ${scenario.title.toLowerCase()}. Tell me, how does "${nextTarget.word}" relate to your day?`;
    replyAr = `أهلاً بك! من الرائع التحدث معك اليوم. بصفتي ${char.roleAr || char.role}، أنا متحمس لمناقشة هذا الموضوع معك. أخبرني، كيف ترتبط كلمة "${nextTarget.meaningAr || nextTarget.word}" بيومك؟`;
  } else {
    // Informative / conversational statement by user
    if (newlyUsedTargetWords.length > 0) {
      reply = `Excellent point! I really like how you used "${newlyUsedTargetWords.join(', ')}". Speaking as a ${char.role.toLowerCase()}, this is exactly right. How would you describe "${nextTarget.word}" next?`;
      replyAr = `نقطة ممتازة! أعجبني حقاً توظيفك لكلمة "${newlyUsedTargetWords.join(', ')}". كـ ${char.roleAr || char.role}، هذا دقيق للغاية. كيف تصف كلمة "${nextTarget.meaningAr || nextTarget.word}" بعد ذلك؟`;
    } else {
      reply = `I hear you clearly, and that makes a lot of sense! ${keyWord ? `Regarding ${keyWord}, ` : ''}it connects deeply with our topic. Could you tell me more using "${nextTarget.word}"?`;
      replyAr = `أسمعك بوضوح، وهذا الكلام منطقي وسليم تماماً! يرتبط ذلك بشكل عميق بموضوعنا. هل يمكنك إخباري بالمزيد مع توظيف كلمة "${nextTarget.meaningAr || nextTarget.word}"؟`;
    }
  }

  if (isFinalTurn) {
    reply += ` You have done a fantastic job completing our dialogue practice today!`;
    replyAr += ` لقد قمت بعمل رائع ومبهر في إكمال تدريب المحادثة اليوم!`;
  }

  // Dynamic constructive tip
  let tip = `نصيحة تعليمية: رائع! المحادثة تسير بسلاسة، حاول في ردك التالي كتابة جملة تتضمن "${nextTarget.word}" (${nextTarget.meaningAr}) لكسب نقاط التحدي 🌟`;
  if (newlyUsedTargetWords.length > 0) {
    tip = `أحسنت جداً! وظفت كلمة مستهدفة (${newlyUsedTargetWords.join('، ')}) في مكانها الصحيح 🎯`;
  } else if (analysis.isQuestion) {
    tip = `مهارة ممتازة: طرح الأسئلة في المحادثة يعكس ثقة عالية ويجعل الحوار ممتعاً وتفاعلياً! 💡`;
  }

  // Contextual suggested replies
  const suggestions: SuggestedReply[] = [
    {
      text: `I understand, and I think ${nextTarget.word.toLowerCase()} is very important here.`,
      translationAr: `أفهم ذلك، وأعتقد أن ${nextTarget.meaningAr || nextTarget.word} مهم جداً هنا.`,
    },
    {
      text: `Could you tell me more about how you handle ${nextTarget.word.toLowerCase()}?`,
      translationAr: `هل يمكنك إخباري بالمزيد عن كيفية تعاملك مع ${nextTarget.meaningAr || nextTarget.word}؟`,
    },
    {
      text: `That sounds good to me, let's continue!`,
      translationAr: `يبدو ذلك جيداً بالنسبة لي، فلنتابع!`,
    },
  ];

  return {
    reply,
    replyAr,
    tip,
    suggestions,
  };
}

// ── 3. Main POST Handler ────────────────────────────────────────────────────
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

    // 4. Find unused target words
    const usedSet = new Set(allUsedTargetWords.map(w => w.toLowerCase()));
    const unusedWords = scenario.targetWords.filter(tw => !usedSet.has(tw.toLowerCase()));

    // 5. Try real LLM AI Provider first (if GEMINI / GROQ / OPENAI key is present)
    const aiRes = await callLLMProvider(scenario, messages, userMessage, unusedWords);

    // 6. Use smart dynamic semantic engine if LLM was not called or unavailable
    const dynamicRes = aiRes || getDynamicContextualReply(
      scenario,
      userMessage,
      userTurnCount,
      allUsedTargetWords,
      newlyUsedTargetWords
    );

    // 7. Check if dialogue goal reached
    const isGoalReached = userTurnCount + 1 >= scenario.minTurns;

    return NextResponse.json({
      success: true,
      data: {
        reply: dynamicRes.reply,
        replyAr: dynamicRes.replyAr,
        newlyUsedTargetWords,
        allUsedTargetWords,
        tip: dynamicRes.tip,
        suggestions: dynamicRes.suggestions,
        isGoalReached,
        userTurns: userTurnCount + 1,
        minTurns: scenario.minTurns,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Error processing chat' }, { status: 500 });
  }
}
