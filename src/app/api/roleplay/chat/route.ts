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

// ── 1. Real LLM AI Provider (Gemini / Groq / OpenAI) ──────────────────────────
interface AIRoleplayResponse {
  reply: string;
  replyAr: string;
  tip?: string;
  suggestions: SuggestedReply[];
}

// Dynamically list models supported by the user's Gemini API key
async function getAvailableGeminiModels(apiKey: string): Promise<string[]> {
  try {
    const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const res = await fetch(listUrl, {
      headers: {
        'x-goog-api-key': apiKey,
      },
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.models)) {
        const supported = data.models
          .filter((m: any) => m.supportedGenerationMethods?.includes('generateContent'))
          .map((m: any) => m.name.replace(/^models\//, ''));

        const rank = (name: string) => {
          if (name === 'gemini-3.8-flash') return 0;
          if (name === 'gemini-3.5-flash') return 1;
          if (name === 'gemini-3.5-flash-lite') return 2;
          if (name === 'gemini-3.1-pro-preview') return 3;
          if (name === 'gemini-3-flash-preview') return 4;
          if (name.includes('gemini-3.8')) return 5;
          if (name.includes('gemini-3.5')) return 6;
          if (name.includes('gemini-3.1')) return 7;
          if (name.includes('gemini-3')) return 8;
          return 99; // Deprecated 2.x and 1.x models go to the very end
        };

        // Filter out deprecated 2.x and 1.x models if modern 3.x models are present
        const modern3x = supported.filter((m: string) => m.includes('gemini-3'));
        const targetList = modern3x.length > 0 ? modern3x : supported;
        targetList.sort((a: string, b: string) => rank(a) - rank(b));
        if (targetList.length > 0) {
          return targetList;
        }
      }
    }
  } catch (e) {
    console.warn('Could not list Gemini models dynamically:', e);
  }

  // Fallback list of current models recommended by Google AI Studio
  return [
    'gemini-3.8-flash',
    'gemini-3.5-flash',
    'gemini-3.5-flash-lite',
    'gemini-3.1-pro-preview',
    'gemini-3-flash-preview',
  ];
}

async function callLLMProvider(
  scenario: RoleplayScenario,
  messages: ChatMessage[],
  userMessage: string,
  unusedWords: string[],
  userApiKey?: string,
  userProvider?: string
): Promise<AIRoleplayResponse | null> {
  const geminiKey = (userProvider === 'gemini' && userApiKey) || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || (!userProvider && (userApiKey?.startsWith('AIzaSy') || userApiKey?.startsWith('AQ.')) ? userApiKey : undefined);
  const groqKey = (userProvider === 'groq' && userApiKey) || process.env.GROQ_API_KEY || (!userProvider && userApiKey?.startsWith('gsk_') ? userApiKey : undefined);
  const openaiKey = (userProvider === 'openai' && userApiKey) || process.env.OPENAI_API_KEY || (!userProvider && userApiKey?.startsWith('sk-') ? userApiKey : undefined);

  if (!geminiKey && !groqKey && !openaiKey) {
    return null; // No key configured, fallback to contextual engine
  }

  const historyText = messages
    .slice(-8)
    .map(m => `${m.sender === 'user' ? 'Learner' : scenario.character.name}: ${m.text}`)
    .join('\n');

  const systemPrompt = `You are an expert English language tutor roleplaying in character with an English student.
Character: ${scenario.character.name} (${scenario.character.roleAr || scenario.character.role})
Current Scenario: ${scenario.title} (${scenario.titleAr})
Scenario Context: ${scenario.description} (${scenario.descriptionAr})
Learner Level: ${scenario.level}
Target Words to Practice: ${scenario.targetWords.join(', ')}
Remaining Unused Target Words: ${unusedWords.join(', ')}

Strict Roleplay Guidelines:
1. Stay strictly in character as ${scenario.character.name}. Adopt their personality, background, and tone.
2. Respond DIRECTLY, RELEVANTLY, and AUTHENTICALLY to what the learner actually said. Acknowledge their exact questions, feelings, or details. Never give generic boilerplate replies!
3. Keep sentence length and grammar matching CEFR Level ${scenario.level}:
   - A1/A2: 1-2 simple, clear, encouraging sentences.
   - B1/B2: 2-3 natural conversational sentences. Ask an engaging question.
   - C1: Sophisticated, nuanced vocabulary.
4. When fitting, naturally steer towards or use one of the unused target words (${unusedWords.join(', ')}).
5. Provide an accurate, natural Arabic translation (replyAr).
6. Provide an encouraging Arabic tip (tip) about grammar, polite phrasing, or vocabulary.
7. Provide 2-3 natural English suggestions the learner could say next to answer your question, with Arabic translations (translationAr).

Respond strictly in valid JSON matching this schema:
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

  // 1. Google Gemini (Dynamic model detection: 3.1 Pro / 3 Flash / 2.5 Flash etc.)
  if (geminiKey) {
    const models = await getAvailableGeminiModels(geminiKey);
    for (const model of models.slice(0, 5)) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': geminiKey,
          },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] },
            generationConfig: {
              responseMimeType: 'application/json',
            },
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const clean = rawText.replace(/```json\n?/g, '').replace(/```/g, '').trim();
            const parsed = JSON.parse(clean);
            if (parsed.reply && parsed.replyAr) {
              return {
                reply: parsed.reply,
                replyAr: parsed.replyAr,
                tip: parsed.tip,
                suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
              };
            }
          }
        }
      } catch (e) {
        console.warn(`Gemini API call failed with model ${model}:`, e);
      }
    }
  }

  // 2. Groq (Llama-3.3-70b / Llama-3.1-8b)
  if (groqKey) {
    const models = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant'];
    for (const model of models) {
      try {
        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${groqKey}`,
          },
          body: JSON.stringify({
            model,
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
            if (parsed.reply && parsed.replyAr) {
              return {
                reply: parsed.reply,
                replyAr: parsed.replyAr,
                tip: parsed.tip,
                suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
              };
            }
          }
        }
      } catch (e) {
        console.warn(`Groq API call failed with model ${model}:`, e);
      }
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
          if (parsed.reply && parsed.replyAr) {
            return {
              reply: parsed.reply,
              replyAr: parsed.replyAr,
              tip: parsed.tip,
              suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
            };
          }
        }
      }
    } catch (e) {
      console.warn('OpenAI API call failed:', e);
    }
  }

  return null;
}

// ── 2. Deep Contextual Dialogue Engine (Realistic Fallback) ───────────────────
interface SemanticIntent {
  type:
    | 'ASK_NAME'
    | 'ASK_WELLBEING'
    | 'ASK_PRICE'
    | 'ASK_LOCATION'
    | 'ASK_TIME'
    | 'ASK_HELP'
    | 'FOOD_ORDER'
    | 'HEALTH_COMPLAINT'
    | 'EMOTION_SHARING'
    | 'OFFER_HELP'
    | 'GREETING'
    | 'INTRODUCING_NAME'
    | 'AGREEMENT'
    | 'DISAGREEMENT'
    | 'GRATITUDE'
    | 'FAREWELL'
    | 'QUESTION_GENERAL'
    | 'STATEMENT';
  extractedItem?: string;
  extractedFeeling?: string;
  extractedName?: string;
}

function analyzeSemanticIntent(text: string): SemanticIntent {
  const clean = text.trim();
  const lower = clean.toLowerCase();

  // Name Introduction
  const nameMatch = lower.match(/(?:my name is|i am|i'm|call me)\s+([a-zA-Z]{2,15})/i);
  if (nameMatch && !['tired', 'happy', 'sad', 'angry', 'good', 'fine', 'sorry', 'sick', 'hungry', 'ready'].includes(nameMatch[1].toLowerCase())) {
    return { type: 'INTRODUCING_NAME', extractedName: nameMatch[1] };
  }

  // Ask Name
  if (/(?:what is your name|who are you|what's your name|tell me about yourself)/i.test(lower)) {
    return { type: 'ASK_NAME' };
  }

  // Ask Wellbeing
  if (/(?:how are you|how do you do|how are things|how is your day|how have you been|how are you feeling)/i.test(lower)) {
    return { type: 'ASK_WELLBEING' };
  }

  // Price inquiry
  if (/(?:how much|what does it cost|what is the price|how expensive|is it expensive)/i.test(lower)) {
    return { type: 'ASK_PRICE' };
  }

  // Location inquiry
  if (/(?:where is|where are|where can i find|which way|how do i get to|where to go)/i.test(lower)) {
    return { type: 'ASK_LOCATION' };
  }

  // Time inquiry
  if (/(?:what time|when does|when is|when can we|how long does)/i.test(lower)) {
    return { type: 'ASK_TIME' };
  }

  // Ask for Help
  if (/(?:can you help|could you help|i need help|please help|assist me|give me a hand)/i.test(lower)) {
    return { type: 'ASK_HELP' };
  }

  // Offer Help
  if (/(?:can i help you|do you need help|i can help|let me help|can i carry|shall i help)/i.test(lower)) {
    return { type: 'OFFER_HELP' };
  }

  // Food / Drink Order
  const isOrderPrompt = /\b(?:can i have|can i get|i want|i'd like|i would like|give me|bring me|order|please get me)\b/i.test(lower);
  const foodKeywords = ['coffee', 'tea', 'water', 'juice', 'sandwich', 'pizza', 'burger', 'drink', 'food', 'salad', 'bread', 'cake', 'soup', 'pasta'];
  const matchedFood = foodKeywords.find(f => lower.includes(f));
  if (isOrderPrompt || matchedFood) {
    if (matchedFood || lower.includes('cup') || lower.includes('glass')) {
      return { type: 'FOOD_ORDER', extractedItem: matchedFood || 'drink' };
    }
  }

  // Health / Symptom complaint
  const healthKeywords = ['pain', 'hurt', 'hurts', 'toothache', 'headache', 'stomachache', 'fever', 'sick', 'ill', 'cough', 'ache', 'sore', 'injury'];
  const hasHealthKeyword = healthKeywords.some(hk => lower.includes(hk));
  if (hasHealthKeyword || lower.includes('tooth') || lower.includes('teeth') || lower.includes('head') || lower.includes('stomach')) {
    const bodyPartMatch = lower.match(/\b(tooth|teeth|head|stomach|back|eye|leg|arm|throat|neck|shoulder|knee)\b/i);
    return { type: 'HEALTH_COMPLAINT', extractedItem: bodyPartMatch ? bodyPartMatch[1].toLowerCase() : 'health' };
  }

  // Emotion sharing
  const isEmotionPrompt = /\b(?:i am feeling|i feel|i'm feeling|i am so|i'm so|i felt|i was feeling|i am|i'm)\b/i.test(lower);
  const emotionKeywords = ['tired', 'exhausted', 'happy', 'glad', 'sad', 'angry', 'mad', 'excited', 'nervous', 'stressed', 'bored', 'calm', 'relaxed', 'proud', 'worried'];
  const matchedEmotion = emotionKeywords.find(e => lower.includes(e));
  if (matchedEmotion && (isEmotionPrompt || lower.startsWith(matchedEmotion))) {
    return { type: 'EMOTION_SHARING', extractedFeeling: matchedEmotion };
  }

  // Gratitude
  if (/\b(thank you|thanks|appreciate it|grateful|thank u)\b/i.test(lower)) {
    return { type: 'GRATITUDE' };
  }

  // Farewell
  if (/\b(goodbye|bye|see you|have a good day|take care)\b/i.test(lower)) {
    return { type: 'FAREWELL' };
  }

  // Greeting
  if (/\b(hello|hi|hey|good morning|good afternoon|good evening)\b/i.test(lower)) {
    return { type: 'GREETING' };
  }

  // Agreement
  if (/^(yes|yeah|sure|of course|certainly|definitely|okay|ok|sounds good|agreed|great|i would love to)\b/i.test(lower)) {
    return { type: 'AGREEMENT' };
  }

  // Disagreement / Decline
  if (/^(no|nope|not really|i don't think so|i cannot|i can't|sorry|unfortunately|maybe later)\b/i.test(lower)) {
    return { type: 'DISAGREEMENT' };
  }

  // General Questions
  if (clean.includes('?') || /^(what|where|when|who|why|how|can|could|would|is|are|do|does|did|will|should)\b/i.test(lower)) {
    return { type: 'QUESTION_GENERAL' };
  }

  // General Statement - extract prominent noun if any
  const itemMatch = lower.match(/\b(coffee|tea|water|book|car|ticket|room|hotel|job|work|project|shoes|clothes|weather|sun|rain|music|art|garden|house|neighbor|family|friend|sport|run|food)\b/i);
  return {
    type: 'STATEMENT',
    extractedItem: itemMatch ? itemMatch[1] : undefined,
  };
}

const AR_TRANSLATIONS: Record<string, string> = {
  coffee: 'القهوة',
  tea: 'الشاي',
  water: 'الماء',
  juice: 'العصير',
  sandwich: 'الشطيرة',
  pizza: 'البيتزا',
  burger: 'البرغر',
  drink: 'المشروب',
  food: 'الطعام',
  bread: 'الخبز',
  salad: 'السلطة',
  cake: 'الكعك',
  soup: 'الحساء',
  pasta: 'المعكرونة',
  tooth: 'الأسنان',
  teeth: 'الأسنان',
  head: 'الرأس',
  stomach: 'المعدة',
  back: 'الظهر',
  eye: 'العين',
  throat: 'الحلق',
  leg: 'الساق',
  arm: 'الذراع',
  health: 'صحتك',
  symptoms: 'الأعراض',
  tired: 'التعب',
  exhausted: 'الإرهاق',
  happy: 'السعادة',
  sad: 'الحزن',
  angry: 'الغضب',
  excited: 'الحماس',
  nervous: 'التوتر',
  stressed: 'الضغط',
  bored: 'الملل',
  relaxed: 'الاسترخاء',
  worried: 'القلق',
};

function getContextualSemanticReply(
  scenario: RoleplayScenario,
  userMessage: string,
  userTurnCount: number,
  allUsedTargetWords: string[],
  newlyUsedTargetWords: string[]
): AIRoleplayResponse {
  const intent = analyzeSemanticIntent(userMessage);
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

  let reply = '';
  let replyAr = '';
  let tip = '';
  let suggestions: SuggestedReply[] = [];

  switch (intent.type) {
    case 'INTRODUCING_NAME': {
      const rawName = intent.extractedName || 'friend';
      const name = rawName.charAt(0).toUpperCase() + rawName.slice(1).toLowerCase();
      reply = `It is wonderful to meet you, ${name}! I am ${char.name}, your ${char.role.toLowerCase()}. How is everything going with you today?`;
      replyAr = `سررت جداً بمعرفتك يا ${name}! أنا ${char.name}، ${char.roleAr || char.role}. كيف تسير أمورك اليوم؟`;
      tip = `💡 رائع! استخدام الصيغة "My name is..." أو "I am..." هي الطريقة الأفضل والأكثر ثقة لتقديم نفسك بالإنجليزية.`;
      suggestions = [
        { text: `Nice to meet you, ${char.name}! Everything is going great.`, translationAr: `تشرفت بمعرفتك يا ${char.name}! كل شيء يسير بشكل رائع.` },
        { text: `I am happy to be here today. What are we doing?`, translationAr: `أنا سعيد بوجودي هنا اليوم. ماذا سنفعل؟` },
      ];
      break;
    }

    case 'ASK_NAME': {
      reply = `My name is ${char.name}, and I am your ${char.role.toLowerCase()}! I am here to help you practice English today. What would you like to talk about?`;
      replyAr = `اسمي ${char.name}، وأنا ${char.roleAr || char.role}! أنا هنا لمساعدتك في التدرّب على الإنجليزية اليوم. عَمَّ ترغب في التحدث؟`;
      tip = `💡 سؤال رائع! لطرح السؤال بأسلوب مهذب يمكنك أيضاً قول: "May I ask your name, please?"`;
      suggestions = [
        { text: `Nice to meet you, ${char.name}! Can you tell me more about ${scenario.title.toLowerCase()}?`, translationAr: `تشرفت بمعرفتك يا ${char.name}! هل يمكنك إخباري بالمزيد عن هذا الموضوع؟` },
        { text: `I am excited to practice speaking with you today!`, translationAr: `أنا متحمس للتدرب على المحادثة معك اليوم!` },
      ];
      break;
    }

    case 'ASK_WELLBEING': {
      reply = `I am doing wonderful, thank you so much for asking! The weather is pleasant, and I am glad to chat with you. How has your day been?`;
      replyAr = `أنا بخير وبأفضل حال، شكراً جزيلاً لسؤالك اللطيف! يسعدني جداً التحدث معك. كيف كان يومك حتى الآن؟`;
      tip = `💡 أسلوب راقٍ: الرد على السؤال بمبادلة السؤال ("How are you?") يعكس مهارة محادثة اجتماعية عالية.`;
      suggestions = [
        { text: `My day has been very good so far, thank you!`, translationAr: `يومي كان جيداً جداً حتى الآن، شكراً لك!` },
        { text: `I was a little busy, but I feel relaxed now.`, translationAr: `كنت مشغولاً بعض الشيء، لكني أشعر بالراحة الآن.` },
      ];
      break;
    }

    case 'FOOD_ORDER': {
      const item = intent.extractedItem || 'order';
      const itemAr = AR_TRANSLATIONS[item] || item;
      reply = `Certainly! One fresh ${item} coming right up for you. Would you like anything else to accompany that, perhaps something to drink?`;
      replyAr = `بكل سرور! طلبك من ${itemAr} قيد التحضير فوراً. هل ترغب بأي شيء آخر معه كشيء تشربه؟`;
      tip = `💡 عند الطلب في مطعم أو مقهى، استخدام "Can I have..." أو "I'd like..." يعطي أسلوباً مؤدباً واحترافياً.`;
      suggestions = [
        { text: `Yes please, can I also have some cold water?`, translationAr: `نعم من فضلك، هل يمكنني أيضاً الحصول على بعض الماء البارد؟` },
        { text: `That will be all for now, thank you!`, translationAr: `هذا كل شيء في الوقت الحالي، شكراً لك!` },
      ];
      break;
    }

    case 'HEALTH_COMPLAINT': {
      const part = intent.extractedItem || 'health';
      const partAr = AR_TRANSLATIONS[part] || part;
      reply = `Oh dear, I am so sorry to hear you are dealing with pain in your ${part}! Please make sure you take some rest and drink plenty of water. How long have you felt this way?`;
      replyAr = `أوه، يؤسفني جداً سماع أنك تعاني من ألم في ${partAr}! احرص على أخذ قسط من الراحة وشرب الكثير من الماء. منذ متى وأنت تشعر بهذا؟`;
      tip = `💡 تعبيرات الألم: يمكنك قول "I have a toothache" لألم الأسنان، و"I have a headache" لألم الرأس.`;
      suggestions = [
        { text: `It started yesterday morning, but I hope it gets better soon.`, translationAr: `بدأ الأمر صباح الأمس، لكنني آمل أن يتحسن قريباً.` },
        { text: `I will definitely rest and drink water, thank you for caring!`, translationAr: `سأرتاح وأشرب الماء بالتأكيد، شكراً لاهتمامك!` },
      ];
      break;
    }

    case 'ASK_PRICE': {
      reply = `That comes out to around $5.50 in total. Would you prefer to pay with cash or credit card?`;
      replyAr = `تكلفة ذلك هي حوالي 5.50 دولارات في الإجمالي. هل تفضل الدفع نقداً أم بالبطاقة الائتمانية؟`;
      tip = `💡 للسؤال عن الأسعار: "How much is it?" للمفرد، و "How much are they?" للجمع.`;
      suggestions = [
        { text: `I will pay with credit card, please.`, translationAr: `سأدفع بالبطاقة الائتمانية من فضلك.` },
        { text: `Here is cash, thank you very much!`, translationAr: `تفضل نقداً، شكراً جزيلاً لك!` },
      ];
      break;
    }

    case 'ASK_LOCATION': {
      reply = `It is located right down this hallway on your left side, just past the reception desk. Let me know if you would like me to guide you there!`;
      replyAr = `إنه يقع في نهاية هذا الممر على يسارك، بعد مكتب الاستقبال مباشرة. أخبرني إن كنت تود أن أرافقك إلى هناك!`;
      tip = `💡 وصف الاتجاهات: استخدم "on your left" (على يسارك) أو "straight ahead" (مباشرة للأمام).`;
      suggestions = [
        { text: `Thank you, that was very clear and helpful!`, translationAr: `شكراً لك، كان ذلك واضحاً ومفيداً جداً!` },
        { text: `Could you walk with me for a minute, please?`, translationAr: `هل يمكنك السير معي لدقيقة من فضلك؟` },
      ];
      break;
    }

    case 'ASK_TIME': {
      reply = `It is scheduled for 10:30 AM today, and we wrap up around the afternoon. Does that timing work well with your schedule?`;
      replyAr = `الموعد محدد في الساعة 10:30 صباح اليوم، وننتهي قرابة فترة بعد الظهر. هل يناسبك هذا التوقيت مع جدولك؟`;
      tip = `💡 للتعبير عن الوقت: "AM" للفترة الصباحية و "PM" لفترة ما بعد الظهر والمساء.`;
      suggestions = [
        { text: `Yes, that time is perfect for me!`, translationAr: `نعم، هذا التوقيت مثالي ومناسب جداً لي!` },
        { text: `Can we reschedule to a little later, please?`, translationAr: `هل يمكننا تأجيل الموعد قليلاً لوقت لاحق من فضلك؟` },
      ];
      break;
    }

    case 'ASK_HELP': {
      reply = `Of course, I would be delighted to help you! Please tell me what you need assistance with, and we will take care of it right away.`;
      replyAr = `بالتأكيد، يسعدني جداً تقديم المساعدة لك! تفضل وأخبرني بما تحتاج إليه وسنتعامل معه فوراً.`;
      tip = `💡 طلب المساعدة: استخدام "Could you please help me with..." يعبر عن أدب وثقة عالية في التحدث.`;
      suggestions = [
        { text: `Could you explain how this works, please?`, translationAr: `هل يمكنك شرح كيف يعمل هذا من فضلك؟` },
        { text: `I need some advice regarding ${nextTarget.word.toLowerCase()}.`, translationAr: `أحتاج إلى بعض النصائح بخصوص هذه النقطة.` },
      ];
      break;
    }

    case 'OFFER_HELP': {
      reply = `That is remarkably kind of you to offer, thank you so much! A little help with our tasks today would make a huge difference.`;
      replyAr = `هذا لطف كبير وكرم منك، شكراً جزيلاً لك! القليل من المساعدة في مهامنا اليوم سيصنع فارقاً كبيراً.`;
      tip = `💡 عرض المساعدة: "Would you like me to help?" أو "Can I lend a hand?" عبارات محببة جداً لدى المتحدثين الأصليين.`;
      suggestions = [
        { text: `I am glad I can help! Just tell me what to do.`, translationAr: `يسعدني أنني أستطيع المساعدة! فقط أخبرني بما يجب فعله.` },
        { text: `We make a great team together!`, translationAr: `نحن نشكل فريقاً رائعاً معاً!` },
      ];
      break;
    }

    case 'EMOTION_SHARING': {
      const feeling = intent.extractedFeeling || 'good';
      reply = `Thank you for sharing that with me! It is completely natural to feel ${feeling}. Tell me, what brought about this feeling today?`;
      replyAr = `شكراً لمشاركتي شعورك! من الطبيعي جداً أن تشعر بهذا الشعور (${feeling}). أخبرني، ما الذي جعلك تشعر بهذا اليوم؟`;
      tip = `💡 التعبير عن المشاعر: استخدام كلمات وصفية مثل "relaxed" أو "energetic" يثري حصيلتك اللغوية بشكل ملحوظ.`;
      suggestions = [
        { text: `I had a busy day, but I feel much better talking to you.`, translationAr: `كان يومي حافلاً، لكني أشعر بتحسن كبير بالتحدث معك.` },
        { text: `Good things happened today, and that made me happy!`, translationAr: `حدثت أشياء جيدة اليوم وهذا ما جعلني سعيداً!` },
      ];
      break;
    }

    case 'GREETING': {
      reply = `Hello and welcome! It is truly wonderful to see you today. As your ${char.role.toLowerCase()}, I am excited to talk. Tell me, how are things going with you?`;
      replyAr = `أهلاً ومرحباً بك! يسعدني حقاً لقاؤك اليوم. بصفتي ${char.roleAr || char.role}، أنا متحمس لحوارنا. أخبرني، كيف تسير أمورك؟`;
      tip = `💡 للتحية الصباحية يمكنك استخدام "Good morning!" وللمساء "Good evening!" لتبدو المحادثة طبيعية وأنيقة.`;
      suggestions = [
        { text: `Good morning! I am ready to start our conversation today.`, translationAr: `صباح الخير! أنا جاهز لبدء محادثتنا اليوم.` },
        { text: `Hello! I am doing well, thank you. What are we discussing?`, translationAr: `مرحباً! أنا بحال جيدة، شكراً لك. ما هو موضوع نقاشنا؟` },
      ];
      break;
    }

    case 'AGREEMENT': {
      reply = `Fantastic, I am really glad we are on the same page! That makes our conversation flow so nicely. What do you think our next step should be?`;
      replyAr = `رائع جداً، يسعدني حقاً أننا متفقون تماماً! هذا يجعل حوارنا ينساب بسلاسة. ما الذي تعتقد أنه ينبغي أن تكون خطوتنا التالية؟`;
      tip = `💡 للتعبير عن الموافقة بأسلوب محترف: "I totally agree with that" أو "That sounds like a great plan".`;
      suggestions = [
        { text: `I think we should practice using ${nextTarget.word.toLowerCase()} next.`, translationAr: `أعتقد أننا يجب أن نتدرب على هذه الكلمة تالياً.` },
        { text: `I agree, let's keep moving forward!`, translationAr: `أتفق معك، فلنواصل المضي قدماً!` },
      ];
      break;
    }

    case 'DISAGREEMENT': {
      reply = `No worries at all, I completely understand and respect your view! We can always explore a different option. What would you prefer instead?`;
      replyAr = `لا تقلق أبداً، أتفهم وجهة نظرك وأحترمها تماماً! يمكننا دائماً استكشاف خيار بديل. ما الذي تفضله بدلاً من ذلك؟`;
      tip = `💡 للاعتذار أو الرفض بلباقة: "I'd prefer not to" أو "I'm not quite sure about that" بدائل ممتازة للرفض المباشر.`;
      suggestions = [
        { text: `I would prefer to focus on something else for now.`, translationAr: `أفضل التركيز على شيء آخر في الوقت الحالي.` },
        { text: `Let's try a different topic that we both enjoy.`, translationAr: `دعنا نجرب موضوعاً مختلفاً نستمتع به معاً.` },
      ];
      break;
    }

    case 'GRATITUDE': {
      reply = `You are very welcome, and thank you for being so polite! It is always an absolute pleasure speaking with you. Is there anything else on your mind?`;
      replyAr = `على الرحب والسعة دائماً، وشكراً لتهذيبك ولطفك! التحدث معك يبعث على السرور دائماً. هل هناك أي شيء آخر يجول في خاطرك؟`;
      tip = `💡 للرد على الشكر: يمكنك قول "You're most welcome" أو "Don't mention it" أو "My pleasure".`;
      suggestions = [
        { text: `Everything is clear, thank you for your kind help!`, translationAr: `كل شيء واضح، شكراً لمساعدتك اللطيفة!` },
        { text: `Yes, I have one more quick question for you.`, translationAr: `نعم، لدي سؤال سريع أخير لك.` },
      ];
      break;
    }

    case 'FAREWELL': {
      reply = `It was wonderful talking with you today! You spoke clearly and expressed yourself very well. Have a marvelous day, and see you soon!`;
      replyAr = `كان من الرائع جداً التحدث معك اليوم! لقد تحدثت بوضوح وعبرت عن نفسك ببراعة. أتمنى لك يوماً رائعاً، وأراك قريباً!`;
      tip = `💡 لإنهاء المحادثة بلباقة: "It was a pleasure talking to you" أو "Have a wonderful rest of your day".`;
      suggestions = [
        { text: `Thank you so much, see you next time!`, translationAr: `شكراً جزيلاً لك، أراك في المرة القادمة!` },
        { text: `Goodbye! Have a great day ahead.`, translationAr: `مع السلامة! أتمنى لك يوماً رائعاً مقبلاً.` },
      ];
      break;
    }

    case 'QUESTION_GENERAL': {
      const topic = intent.extractedItem ? `regarding ${intent.extractedItem}` : 'about this';
      reply = `That is an insightful question ${topic}! From what I have seen here, the best way forward is to keep things simple and clear. What are your thoughts on it?`;
      replyAr = `هذا سؤال ذكي ومهم! مما رأيته هنا، الطريقة الأفضل هي إبقاء الأمور بسيطة وواضحة. ما هي أفكارك حول هذا الأمر؟`;
      tip = `💡 صياغة الأسئلة: تذكر دائماً وضع الفعل المساعد قبل الفاعل في السؤال (مثال: "Do you have...?" أو "Can you...?").`;
      suggestions = [
        { text: `I think keeping it simple is the best approach.`, translationAr: `أعتقد أن البساطة هي أفضل نهج بالفعل.` },
        { text: `Could you give me an example to make sure I understand?`, translationAr: `هل يمكنك إعطائي مثالاً للتأكد من فهمي؟` },
      ];
      break;
    }

    default: {
      // General conversational statement
      if (intent.extractedItem) {
        reply = `I see exactly what you mean about the ${intent.extractedItem}! It fits right into our topic today. Could you tell me a little more about your experience with that?`;
        replyAr = `أفهم تماماً ما تقصده بشأن الـ ${intent.extractedItem}! هذا يتماشى تماماً مع موضوعنا اليوم. هل يمكنك إخباري بالمزيد عن تجربتك في ذلك؟`;
        tip = `💡 رائع! ربط الكلمات بمواقف واقعية وتجارب شخصية يرسخ المفردات في الذاكرة طويلة المدى.`;
      } else if (newlyUsedTargetWords.length > 0) {
        reply = `Excellent point! I really like how you used "${newlyUsedTargetWords.join(', ')}". That sounded very natural and confident. What else would you like to share?`;
        replyAr = `نقطة ممتازة! أعجبني حقاً توظيفك لكلمة "${newlyUsedTargetWords.join('، ')}". كان نطقها واستخدامها طبيعياً وواثقاً جداً. ماذا تود أن تشارك أيضاً؟`;
        tip = `💡 أحسنت جداً! وظفت كلمة مستهدفة (${newlyUsedTargetWords.join('، ')}) في مكانها الصحيح 🎯`;
      } else {
        reply = `That is a great observation, and I completely agree! As your ${char.role.toLowerCase()}, I really enjoy how you express your ideas. What should we explore next?`;
        replyAr = `هذه ملاحظة ممتازة وأتفق معك تماماً! بصفتي ${char.roleAr || char.role}، يعجبني أسلوبك في التعبير عن أفكارك. ما الذي يجب أن نستكشفه تالياً؟`;
        tip = `💡 حاول في ردك القادم توظيف كلمة مستهدفة جديدة لكسب نقاط الـ XP إضافية 🌟`;
      }
      suggestions = [
        { text: `I think we should practice using "${nextTarget.word}" next!`, translationAr: `أعتقد أننا يجب أن نتدرب على كلمة "${nextTarget.meaningAr || nextTarget.word}" تالياً!` },
        { text: `I would love to tell you more about my daily routine.`, translationAr: `يسعدني أن أخبرك بالمزيد عن روتيني اليومي.` },
      ];
      break;
    }
  }

  if (isFinalTurn) {
    reply += ` By the way, you have done a fantastic job completing all turns in our dialogue today! 🏆`;
    replyAr += ` وبالمناسبة، لقد قمت بعمل رائع ومبهر في إكمال جميع جولات المحادثة اليوم بنجاح! 🏆`;
  }

  return {
    reply,
    replyAr,
    tip,
    suggestions,
  };
}

// ── 3. Main POST Handler ──────────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Special Action: Test API Key connection
    if (body.action === 'test-key') {
      const { userApiKey, userProvider } = body as { userApiKey?: string; userProvider?: string };
      if (!userApiKey) {
        return NextResponse.json({ success: false, error: 'لم يتم إرسال مفتاح الـ API.' }, { status: 400 });
      }

      if (userProvider === 'gemini' || (!userProvider && (userApiKey.startsWith('AIzaSy') || userApiKey.startsWith('AQ.')))) {
        try {
          const testModels = await getAvailableGeminiModels(userApiKey);
          let lastErrMsg = '';

          for (const model of testModels.slice(0, 6)) {
            const testUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${userApiKey}`;
            const res = await fetch(testUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': userApiKey,
              },
              body: JSON.stringify({
                contents: [{ role: 'user', parts: [{ text: 'Reply with JSON: {"status": "ok"}' }] }],
                generationConfig: { responseMimeType: 'application/json' },
              }),
            });

            if (res.ok) {
              const friendlyName = `Google Gemini (${model})`;
              return NextResponse.json({ success: true, model: friendlyName });
            }

            const errData = await res.json().catch(() => ({}));
            if (errData?.error?.message) {
              lastErrMsg = errData.error.message;
            }
          }

          const errMsg = lastErrMsg || 'مفتاح Gemini غير صالح أو منتهي الصلاحية.';
          return NextResponse.json({ success: false, error: errMsg }, { status: 400 });
        } catch (e: any) {
          return NextResponse.json({ success: false, error: e.message || 'فشل الاتصال بـ Gemini.' }, { status: 500 });
        }
      }

      if (userProvider === 'groq' || (!userProvider && userApiKey.startsWith('gsk_'))) {
        try {
          const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userApiKey}`,
            },
            body: JSON.stringify({
              model: 'llama-3.3-70b-versatile',
              messages: [{ role: 'user', content: 'Say hello in 1 word' }],
              max_tokens: 5,
            }),
          });

          if (res.ok) {
            return NextResponse.json({ success: true, model: 'Groq Llama 3.3 70B' });
          }

          const errData = await res.json().catch(() => ({}));
          const errMsg = errData?.error?.message || 'مفتاح Groq غير صالح.';
          return NextResponse.json({ success: false, error: errMsg }, { status: 400 });
        } catch (e: any) {
          return NextResponse.json({ success: false, error: e.message || 'فشل الاتصال بـ Groq.' }, { status: 500 });
        }
      }

      if (userProvider === 'openai' || (!userProvider && userApiKey.startsWith('sk-'))) {
        try {
          const res = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userApiKey}`,
            },
            body: JSON.stringify({
              model: 'gpt-4o-mini',
              messages: [{ role: 'user', content: 'Say hello in 1 word' }],
              max_tokens: 5,
            }),
          });

          if (res.ok) {
            return NextResponse.json({ success: true, model: 'OpenAI GPT-4o-mini' });
          }

          const errData = await res.json().catch(() => ({}));
          const errMsg = errData?.error?.message || 'مفتاح OpenAI غير صالح.';
          return NextResponse.json({ success: false, error: errMsg }, { status: 400 });
        } catch (e: any) {
          return NextResponse.json({ success: false, error: e.message || 'فشل الاتصال بـ OpenAI.' }, { status: 500 });
        }
      }

      return NextResponse.json({ success: false, error: 'مزود غير مدعوم.' }, { status: 400 });
    }

    // Normal Chat Turn Action
    const { scenarioId, messages, userMessage, userApiKey, userProvider } = body as {
      scenarioId: string;
      messages: ChatMessage[];
      userMessage: string;
      userApiKey?: string;
      userProvider?: string;
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

    // 5. Try real LLM AI Provider first (User's custom key or Server ENV key)
    const aiRes = await callLLMProvider(
      scenario,
      messages,
      userMessage,
      unusedWords,
      userApiKey,
      userProvider
    );

    // 6. Use smart contextual dialogue engine if LLM was not called or unavailable
    const dynamicRes =
      aiRes ||
      getContextualSemanticReply(
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
        isLiveAI: !!aiRes,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Error processing chat' }, { status: 500 });
  }
}
