const fs = require('fs');
const path = require('path');

const wordsPath = path.join(__dirname, '../src/data/words.json');
const wordsData = JSON.parse(fs.readFileSync(wordsPath, 'utf8'));

const newB2Units = [
  {
    id: 'b2-u24',
    title: 'Critical Thinking & Logic',
    titleAr: 'التفكير النقدي والمنطق',
    description: 'Master analytical and deductive reasoning terminology.',
    descriptionAr: 'مصطلحات التفكير التحليلي والاستدلال المنطقي الرصين.',
    words: [
      {
        id: 'b2-u24-w1',
        word: 'Deduce',
        phonetic: '/dɪˈdjuːs/',
        syllables: 'de·duce',
        partOfSpeech: 'verb',
        partOfSpeechAr: 'فعل',
        meaningEn: 'To arrive at a fact or conclusion by reasoning from general principles',
        meaningAr: 'يستنتج بالمنطق',
        synonyms: ['Conclude', 'Infer', 'Derive'],
        antonyms: ['Guess', 'Assume'],
        examples: [
          'From the available evidence, detectives were able to deduce the timeline of events.',
          'Can we deduce that customer satisfaction has improved based on these surveys?'
        ],
        imageQuery: 'deduce detective logic magnifying glass',
        category: 'thinking'
      },
      {
        id: 'b2-u24-w2',
        word: 'Fallacy',
        phonetic: '/ˈfæləsi/',
        syllables: 'fal·la·cy',
        partOfSpeech: 'noun',
        partOfSpeechAr: 'اسم',
        meaningEn: 'A mistaken belief or a flaw in reasoning that invalidates an argument',
        meaningAr: 'مغالطة منطقية',
        synonyms: ['Misconception', 'Delusion', 'Error'],
        antonyms: ['Truth', 'Fact', 'Validity'],
        examples: [
          'It is a common fallacy that success happens overnight without preparation.',
          'The debater pointed out the logical fallacy in his opponent’s premise.'
        ],
        imageQuery: 'fallacy maze puzzle confusion',
        category: 'thinking'
      },
      {
        id: 'b2-u24-w3',
        word: 'Premise',
        phonetic: '/ˈpremɪs/',
        syllables: 'prem·ise',
        partOfSpeech: 'noun',
        partOfSpeechAr: 'اسم',
        meaningEn: 'A proposition supporting or helping to persuade a conclusion',
        meaningAr: 'فرضية / مقدمة منطقية',
        synonyms: ['Assumption', 'Hypothesis', 'Proposition'],
        antonyms: ['Conclusion', 'Fact'],
        examples: [
          'The entire argument collapses if the underlying premise is proven false.',
          'His economic theory is built upon the premise that consumers act rationally.'
        ],
        imageQuery: 'foundation blueprint building structure',
        category: 'thinking'
      },
      {
        id: 'b2-u24-w4',
        word: 'Validity',
        phonetic: '/vəˈlɪdəti/',
        syllables: 'va·lid·i·ty',
        partOfSpeech: 'noun',
        partOfSpeechAr: 'اسم',
        meaningEn: 'The quality of being logically or factually sound and legally acceptable',
        meaningAr: 'صحة / صلاحية / وجاهة',
        synonyms: ['Soundness', 'Legitimacy', 'Authenticity'],
        antonyms: ['Invalidity', 'Flaw', 'Falsity'],
        examples: [
          'Scientists questioned the validity of the sample size used in the study.',
          'The lawyer successfully challenged the legal validity of the contract.'
        ],
        imageQuery: 'stamp approved valid certificate',
        category: 'thinking'
      },
      {
        id: 'b2-u24-w5',
        word: 'Contradiction',
        phonetic: '/ˌkɒntrəˈdɪkʃən/',
        syllables: 'con·tra·dic·tion',
        partOfSpeech: 'noun',
        partOfSpeechAr: 'اسم',
        meaningEn: 'A combination of statements or ideas that are opposed to one another',
        meaningAr: 'تناقض / تضارب',
        synonyms: ['Inconsistency', 'Conflict', 'Paradox'],
        antonyms: ['Consistency', 'Agreement', 'Harmony'],
        examples: [
          'There was a direct contradiction between his two public statements.',
          'Living in luxury while advocating austerity seemed an obvious contradiction.'
        ],
        imageQuery: 'arrows opposite directions conflict',
        category: 'thinking'
      },
      {
        id: 'b2-u24-w6',
        word: 'Rationalize',
        phonetic: '/ˈræʃənəlaɪz/',
        syllables: 'ra·tion·al·ize',
        partOfSpeech: 'verb',
        partOfSpeechAr: 'فعل',
        meaningEn: 'To attempt to explain or justify behavior with logical reasons, even if not true',
        meaningAr: 'يبرر عقلانياً',
        synonyms: ['Justify', 'Explain away', 'Excuse'],
        antonyms: ['Condemn', 'Admit'],
        examples: [
          'He tried to rationalize his impulsive spending by calling it an investment.',
          'People often rationalize unethical choices when under severe pressure.'
        ],
        imageQuery: 'person thinking justification scales balance',
        category: 'thinking'
      },
      {
        id: 'b2-u24-w7',
        word: 'Inference',
        phonetic: '/ˈɪnfərəns/',
        syllables: 'in·fer·ence',
        partOfSpeech: 'noun',
        partOfSpeechAr: 'اسم',
        meaningEn: 'A conclusion reached on the basis of evidence and reasoning',
        meaningAr: 'استدلال / استنتاج',
        synonyms: ['Deduction', 'Interpretation', 'Reasoning'],
        antonyms: ['Fact', 'Direct observation'],
        examples: [
          'What inference can you draw from the sudden drop in quarterly revenue?',
          'Her quiet demeanor led many to the mistaken inference that she lacked ambition.'
        ],
        imageQuery: 'puzzle pieces connecting lightbulb',
        category: 'thinking'
      },
      {
        id: 'b2-u24-w8',
        word: 'Skepticism',
        phonetic: '/ˈskeptɪsɪzəm/',
        syllables: 'skep·ti·cism',
        partOfSpeech: 'noun',
        partOfSpeechAr: 'اسم',
        meaningEn: 'A skeptical attitude; doubt as to the truth of something',
        meaningAr: 'تشكك / نزعة الشك المنهجي',
        synonyms: ['Doubt', 'Distrust', 'Incredulity'],
        antonyms: ['Certainty', 'Gullibility', 'Trust'],
        examples: [
          'Healthy skepticism is vital when reading unverified claims on social media.',
          'The proposed timeline was met with considerable skepticism from engineers.'
        ],
        imageQuery: 'question mark critical thinking doubts',
        category: 'thinking'
      },
      {
        id: 'b2-u24-w9',
        word: 'Coherent',
        phonetic: '/kəʊˈhɪərənt/',
        syllables: 'co·her·ent',
        partOfSpeech: 'adjective',
        partOfSpeechAr: 'صفة',
        meaningEn: 'Logical and consistent; forming a unified, understandable whole',
        meaningAr: 'متماسك / مترابط ومنطقي',
        synonyms: ['Articulate', 'Consistent', 'Lucid'],
        antonyms: ['Incoherent', 'Confused', 'Disjointed'],
        examples: [
          'She presented a coherent vision for the future development of the company.',
          'The essay was praised for its coherent structure and compelling arguments.'
        ],
        imageQuery: 'connected bridge harmony structure',
        category: 'thinking'
      },
      {
        id: 'b2-u24-w10',
        word: 'Ambiguity',
        phonetic: '/ˌæmbɪˈɡjuːəti/',
        syllables: 'am·bi·gu·i·ty',
        partOfSpeech: 'noun',
        partOfSpeechAr: 'اسم',
        meaningEn: 'The quality of being open to more than one interpretation; inexactness',
        meaningAr: 'غموض / التباس في المعنى',
        synonyms: ['Vagueness', 'Uncertainty', 'Obscurity'],
        antonyms: ['Clarity', 'Certainty', 'Precision'],
        examples: [
          'To avoid legal ambiguity, the clause was reworded with strict terminology.',
          'Poets deliberately embrace ambiguity to invite diverse interpretations.'
        ],
        imageQuery: 'fog crossroads mystery multiple paths',
        category: 'thinking'
      }
    ]
  },
  {
    id: 'b2-u25',
    title: 'Negotiation & Diplomacy',
    titleAr: 'التفاوض والدبلوماسية',
    description: 'Essential terminology for reaching agreements and resolving disputes.',
    descriptionAr: 'مصطلحات أساسية للتوصل إلى اتفاقيات وحل النزاعات باحترافية.',
    words: [
      {
        id: 'b2-u25-w1',
        word: 'Concession',
        phonetic: '/kənˈseʃən/',
        syllables: 'con·ces·sion',
        partOfSpeech: 'noun',
        partOfSpeechAr: 'اسم',
        meaningEn: 'A thing that is granted, especially in response to demands in a dispute',
        meaningAr: 'تنازل تفاوضي',
        synonyms: ['Compromise', 'Yielding', 'Allowance'],
        antonyms: ['Demand', 'Refusal', 'Defiance'],
        examples: [
          'Both sides made substantial concessions to prevent a costly labor strike.',
          'The government offered tax concessions to stimulate manufacturing investments.'
        ],
        imageQuery: 'handshake negotiation compromise agreement',
        category: 'diplomacy'
      },
      {
        id: 'b2-u25-w2',
        word: 'Compromise',
        phonetic: '/ˈkɒmprəmaɪz/',
        syllables: 'com·pro·mise',
        partOfSpeech: 'noun',
        partOfSpeechAr: 'اسم',
        meaningEn: 'An agreement reached by each side making mutual concessions',
        meaningAr: 'حل وسط / تسوية',
        synonyms: ['Settlement', 'Agreement', 'Middle ground'],
        antonyms: ['Intransigence', 'Stalemate'],
        examples: [
          'After weeks of intense talks, they reached a sensible compromise on pricing.',
          'Effective leadership often requires the ability to forge a compromise.'
        ],
        imageQuery: 'two hands meeting balance scale agreement',
        category: 'diplomacy'
      },
      {
        id: 'b2-u25-w3',
        word: 'Mediation',
        phonetic: '/ˌmiːdiˈeɪʃən/',
        syllables: 'me·di·a·tion',
        partOfSpeech: 'noun',
        partOfSpeechAr: 'اسم',
        meaningEn: 'Intervention in a dispute in order to resolve it through an impartial third party',
        meaningAr: 'وساطة توفيقية',
        synonyms: ['Arbitration', 'Intervention', 'Conciliation'],
        antonyms: ['Confrontation', 'Discord'],
        examples: [
          'The union and management agreed to independent mediation to break the impasse.',
          'International mediation successfully prevented further escalation at the border.'
        ],
        imageQuery: 'mediator between two people talking peace',
        category: 'diplomacy'
      },
      {
        id: 'b2-u25-w4',
        word: 'Deadlock',
        phonetic: '/ˈdedlɒk/',
        syllables: 'dead·lock',
        partOfSpeech: 'noun',
        partOfSpeechAr: 'اسم',
        meaningEn: 'A situation, typically involving opposing parties, where no progress can be made',
        meaningAr: 'طريق مسدود / انسداد مفاوضات',
        synonyms: ['Impasse', 'Stalemate', 'Gridlock'],
        antonyms: ['Breakthrough', 'Progress'],
        examples: [
          'Negotiations reached a deadlock over environmental safety protocols.',
          'A last-minute intervention by the ambassador broke the diplomatic deadlock.'
        ],
        imageQuery: 'padlock chains roadblock barrier',
        category: 'diplomacy'
      },
      {
        id: 'b2-u25-w5',
        word: 'Consensus',
        phonetic: '/kənˈsensəs/',
        syllables: 'con·sen·sus',
        partOfSpeech: 'noun',
        partOfSpeechAr: 'اسم',
        meaningEn: 'General agreement among a group of people on an issue',
        meaningAr: 'إجماع / توافق عام',
        synonyms: ['Agreement', 'Harmony', 'Concord'],
        antonyms: ['Disagreement', 'Discord', 'Dissent'],
        examples: [
          'There is a broad scientific consensus regarding human-induced climate change.',
          'The committee worked tirelessly until a consensus was achieved on the budget.'
        ],
        imageQuery: 'team all raising hands voting agreeing',
        category: 'diplomacy'
      },
      {
        id: 'b2-u25-w6',
        word: 'Leverage',
        phonetic: '/ˈliːvərɪdʒ/',
        syllables: 'lev·er·age',
        partOfSpeech: 'noun',
        partOfSpeechAr: 'اسم',
        meaningEn: 'Power to influence people and get the results you want',
        meaningAr: 'نفوذ / أوراق ضغط تفاوضية',
        synonyms: ['Influence', 'Advantage', 'Bargaining power'],
        antonyms: ['Weakness', 'Powerlessness'],
        examples: [
          'The exclusive patent gave the small biotech firm enormous leverage in talks.',
          'Threatening to walk away gave the buyer leverage to negotiate a lower price.'
        ],
        imageQuery: 'lever moving large stone mechanical advantage',
        category: 'diplomacy'
      },
      {
        id: 'b2-u25-w7',
        word: 'Arbitrate',
        phonetic: '/ˈɑːbɪtreɪt/',
        syllables: 'ar·bi·trate',
        partOfSpeech: 'verb',
        partOfSpeechAr: 'فعل',
        meaningEn: 'To reach an authoritative judgment or settlement between opposing factions',
        meaningAr: 'يُحكّم ويفصل بين متنازعين',
        synonyms: ['Judge', 'Adjudicate', 'Moderate'],
        antonyms: ['Instigate', 'Complicate'],
        examples: [
          'An international tribunal was appointed to arbitrate the maritime dispute.',
          'Senior directors had to arbitrate between the competing project proposals.'
        ],
        imageQuery: 'gavel judge arbitration legal desk',
        category: 'diplomacy'
      },
      {
        id: 'b2-u25-w8',
        word: 'Stalemate',
        phonetic: '/ˈsteɪlmeɪt/',
        syllables: 'stale·mate',
        partOfSpeech: 'noun',
        partOfSpeechAr: 'اسم',
        meaningEn: 'A position counting as a draw in chess; any situation where neither side can win',
        meaningAr: 'حالة مأزق تام / جمود تعادلي',
        synonyms: ['Standstill', 'Halt', 'Dead end'],
        antonyms: ['Victory', 'Breakthrough'],
        examples: [
          'Neither army could advance, resulting in months of grueling stalemate.',
          'Diplomats are looking for innovative formulas to break the ongoing stalemate.'
        ],
        imageQuery: 'chess pieces king stalemate tied match',
        category: 'diplomacy'
      },
      {
        id: 'b2-u25-w9',
        word: 'Pact',
        phonetic: '/pækt/',
        syllables: 'pact',
        partOfSpeech: 'noun',
        partOfSpeechAr: 'اسم',
        meaningEn: 'A formal agreement between individuals or parties; a covenant',
        meaningAr: 'ميثاق / اتفاقية رسمية',
        synonyms: ['Treaty', 'Accord', 'Agreement'],
        antonyms: ['Breach', 'Rupture'],
        examples: [
          'The two neighboring states signed a non-aggression pact to ensure border safety.',
          'Tech leaders agreed on a voluntary pact regarding ethical AI guidelines.'
        ],
        imageQuery: 'signed document treaty seal feather pen',
        category: 'diplomacy'
      },
      {
        id: 'b2-u25-w10',
        word: 'Settlement',
        phonetic: '/ˈsetəlmənt/',
        syllables: 'set·tle·ment',
        partOfSpeech: 'noun',
        partOfSpeechAr: 'اسم',
        meaningEn: 'An official agreement intended to resolve a dispute or lawsuit',
        meaningAr: 'تسوية نزاع قانوني أو مالي',
        synonyms: ['Resolution', 'Agreement', 'Compromise'],
        antonyms: ['Dispute', 'Litigation'],
        examples: [
          'The corporation agreed to an out-of-court settlement worth millions of dollars.',
          'Peace settlements often take months of patient backchannel communication.'
        ],
        imageQuery: 'contract sign handshake formal resolution',
        category: 'diplomacy'
      }
    ]
  },
  {
    id: 'b2-u26',
    title: 'Urban Planning & Architecture',
    titleAr: 'التخطيط العمراني والعمارة',
    description: 'City design, structural planning, and modern infrastructure terms.',
    descriptionAr: 'مصطلحات تصميم المدن والهندسة المعمارية والبنية التحتية الذكية.',
    words: [
      {
        id: 'b2-u26-w1',
        word: 'Infrastructure',
        phonetic: '/ˈɪnfrəˌstrʌktʃər/',
        syllables: 'in·fra·struc·ture',
        partOfSpeech: 'noun',
        partOfSpeechAr: 'اسم',
        meaningEn: 'The basic physical systems of a business, region, or nation like roads and power',
        meaningAr: 'بنية تحتية',
        synonyms: ['Framework', 'Network', 'Foundations'],
        antonyms: ['Superstructure'],
        examples: [
          'Massive public investment was directed toward upgrading aging rail infrastructure.',
          'A reliable telecommunications infrastructure is crucial for modern economic growth.'
        ],
        imageQuery: 'bridge railway highway modern infrastructure',
        category: 'architecture'
      },
      {
        id: 'b2-u26-w2',
        word: 'Density',
        phonetic: '/ˈdensəti/',
        syllables: 'den·si·ty',
        partOfSpeech: 'noun',
        partOfSpeechAr: 'اسم',
        meaningEn: 'The degree of compactness of a substance or population in a given area',
        meaningAr: 'كثافة سكانية أو مادية',
        synonyms: ['Concentration', 'Crowdedness', 'Compactness'],
        antonyms: ['Sparseness', 'Dispersion'],
        examples: [
          'High population density in coastal cities creates significant housing challenges.',
          'Urban planners encourage mixed-use zoning with high residential density.'
        ],
        imageQuery: 'crowded city skyscrapers aerial density',
        category: 'architecture'
      },
      {
        id: 'b2-u26-w3',
        word: 'Zoning',
        phonetic: '/ˈzəʊnɪŋ/',
        syllables: 'zon·ing',
        partOfSpeech: 'noun',
        partOfSpeechAr: 'اسم',
        meaningEn: 'Dividing land into zones restricted to specific uses, such as residential or commercial',
        meaningAr: 'تنظيم استخدام الأراضي وتقسيم المناطق',
        synonyms: ['Partitioning', 'Allotment', 'City zoning'],
        antonyms: ['Deregulation'],
        examples: [
          'New zoning regulations prohibit heavy industrial factories near residential areas.',
          'The city council reformed zoning laws to allow affordable apartment construction.'
        ],
        imageQuery: 'city map colorful zones planning',
        category: 'architecture'
      },
      {
        id: 'b2-u26-w4',
        word: 'Facade',
        phonetic: '/fəˈsɑːd/',
        syllables: 'fa·cade',
        partOfSpeech: 'noun',
        partOfSpeechAr: 'اسم',
        meaningEn: 'The principal front of a building facing on a street or open space',
        meaningAr: 'واجهة مبنى / مظهر خارجي',
        synonyms: ['Frontage', 'Exterior', 'Veneer'],
        antonyms: ['Interior', 'Rear'],
        examples: [
          'Architects preserved the historic neoclassical facade while modernizing the interior.',
          'Behind his confident facade, the young designer was quite nervous about the review.'
        ],
        imageQuery: 'historic building facade architecture stone glass',
        category: 'architecture'
      },
      {
        id: 'b2-u26-w5',
        word: 'Blueprint',
        phonetic: '/ˈbluːprɪnt/',
        syllables: 'blue·print',
        partOfSpeech: 'noun',
        partOfSpeechAr: 'اسم',
        meaningEn: 'A design plan or technical drawing; a detailed outline or model for a project',
        meaningAr: 'مخطط هندسي / خارطة طريق',
        synonyms: ['Schematic', 'Plan', 'Design', 'Prototype'],
        antonyms: ['Finished product'],
        examples: [
          'The engineer laid out the architectural blueprint on the conference table.',
          'This sustainable project serves as a blueprint for green cities worldwide.'
        ],
        imageQuery: 'architect blueprint roll plan drafting table',
        category: 'architecture'
      },
      {
        id: 'b2-u26-w6',
        word: 'Sustainable',
        phonetic: '/səˈsteɪnəbl/',
        syllables: 'sus·tain·a·ble',
        partOfSpeech: 'adjective',
        partOfSpeechAr: 'صفة',
        meaningEn: 'Conserving an ecological balance by avoiding depletion of natural resources',
        meaningAr: 'مستدام وصديق للبيئة',
        synonyms: ['Eco-friendly', 'Renewable', 'Viable'],
        antonyms: ['Unsustainable', 'Depleting', 'Destructive'],
        examples: [
          'The tower incorporates solar panels and rainwater collection for sustainable living.',
          'Sustainable urban transport reduces greenhouse emissions while cutting traffic.'
        ],
        imageQuery: 'green building eco architecture rooftop plants',
        category: 'architecture'
      },
      {
        id: 'b2-u26-w7',
        word: 'Congestion',
        phonetic: '/kənˈdʒestʃən/',
        syllables: 'con·ges·tion',
        partOfSpeech: 'noun',
        partOfSpeechAr: 'اسم',
        meaningEn: 'The state of being overcrowded, blocked, or overloaded, especially with traffic',
        meaningAr: 'ازدحام مروري / اختناق',
        synonyms: ['Traffic jam', 'Gridlock', 'Crowding'],
        antonyms: ['Flow', 'Clearance', 'Openness'],
        examples: [
          'A congestion pricing scheme was introduced to deter cars from the city center.',
          'Subway expansion successfully reduced severe traffic congestion on the bridges.'
        ],
        imageQuery: 'traffic jam city cars brake lights red',
        category: 'architecture'
      },
      {
        id: 'b2-u26-w8',
        word: 'Aesthetic',
        phonetic: '/esˈθetɪk/',
        syllables: 'aes·thet·ic',
        partOfSpeech: 'adjective',
        partOfSpeechAr: 'صفة',
        meaningEn: 'Concerned with beauty or the appreciation of beauty; visually pleasing',
        meaningAr: 'جمالي / ذو ذوق فني',
        synonyms: ['Artistic', 'Visual', 'Tasteful', 'Graceful'],
        antonyms: ['Ugly', 'Unattractive', 'Crude'],
        examples: [
          'The building strikes a harmonious balance between functional utility and aesthetic beauty.',
          'Minimalist aesthetics have influenced contemporary Scandinavian interior design.'
        ],
        imageQuery: 'modern minimal design aesthetic architecture lines',
        category: 'architecture'
      },
      {
        id: 'b2-u26-w9',
        word: 'Pedestrian',
        phonetic: '/pəˈdestriən/',
        syllables: 'pe·des·tri·an',
        partOfSpeech: 'noun',
        partOfSpeechAr: 'اسم',
        meaningEn: 'A person walking along a road or in a developed area rather than traveling in a vehicle',
        meaningAr: 'من المشاة',
        synonyms: ['Walker', 'Foot traveler'],
        antonyms: ['Driver', 'Motorist'],
        examples: [
          'The historic downtown street was permanently converted into a pedestrian zone.',
          'Traffic calming measures were installed to safeguard pedestrian crossings.'
        ],
        imageQuery: 'pedestrian crosswalk people walking city street',
        category: 'architecture'
      },
      {
        id: 'b2-u26-w10',
        word: 'Metropolis',
        phonetic: '/məˈtrɒpəlɪs/',
        syllables: 'me·trop·o·lis',
        partOfSpeech: 'noun',
        partOfSpeechAr: 'اسم',
        meaningEn: 'A very large and densely populated industrial and commercial city',
        meaningAr: 'حاضرة كبرى / مدينة عظمى',
        synonyms: ['Megacity', 'Urban center', 'Capital'],
        antonyms: ['Village', 'Hamlet', 'Rural area'],
        examples: [
          'Tokyo is a bustling metropolis renowned for public safety and punctuality.',
          'Young professionals from rural provinces migrated to the growing metropolis.'
        ],
        imageQuery: 'skyline metropolis neon lights dusk high rises',
        category: 'architecture'
      }
    ]
  },
  {
    id: 'b2-u27',
    title: 'Finance & Investments',
    titleAr: 'المالية والاستثمار',
    description: 'Corporate finance, equity markets, and asset valuation vocabulary.',
    descriptionAr: 'مصطلحات أسواق الأسهم والتمويل المؤسسي وإدارة الأصول الاستثمارية.',
    words: [
      {
        id: 'b2-u27-w1',
        word: 'Dividend',
        phonetic: '/ˈdɪvɪdend/',
        syllables: 'div·i·dend',
        partOfSpeech: 'noun',
        partOfSpeechAr: 'اسم',
        meaningEn: 'A sum of money paid regularly by a company to its shareholders out of profits',
        meaningAr: 'حصة أرباح موزعة على المساهمين',
        synonyms: ['Share', 'Return', 'Payout'],
        antonyms: ['Expense', 'Deduction'],
        examples: [
          'Long-term investors rely on blue-chip stocks that pay consistent quarterly dividends.',
          'The board of directors voted to increase the annual dividend by eight percent.'
        ],
        imageQuery: 'coins stock chart profit payout growth',
        category: 'finance'
      },
      {
        id: 'b2-u27-w2',
        word: 'Portfolio',
        phonetic: '/pɔːtˈfəʊliəʊ/',
        syllables: 'port·fo·li·o',
        partOfSpeech: 'noun',
        partOfSpeechAr: 'اسم',
        meaningEn: 'A range of investments held by an institution or private individual',
        meaningAr: 'محفظة استثمارية',
        synonyms: ['Holdings', 'Investments', 'Assets'],
        antonyms: ['Single asset'],
        examples: [
          'Financial advisors recommend diversifying your investment portfolio across asset classes.',
          'Her portfolio includes renewable energy stocks, real estate, and government bonds.'
        ],
        imageQuery: 'investment portfolio tablet pie chart stocks',
        category: 'finance'
      },
      {
        id: 'b2-u27-w3',
        word: 'Liability',
        phonetic: '/ˌlaɪəˈbɪləti/',
        syllables: 'li·a·bil·i·ty',
        partOfSpeech: 'noun',
        partOfSpeechAr: 'اسم',
        meaningEn: 'A thing for which someone is responsible, especially a debt or financial obligation',
        meaningAr: 'التزام مالي / دين / مسؤولية قانونية',
        synonyms: ['Debt', 'Obligation', 'Burden'],
        antonyms: ['Asset', 'Credit', 'Advantage'],
        examples: [
          'The company managed to pay off half of its long-term liabilities within two years.',
          'Untrained staff can be a major security liability for confidential financial data.'
        ],
        imageQuery: 'debt balance sheet finance calculator',
        category: 'finance'
      },
      {
        id: 'b2-u27-w4',
        word: 'Yield',
        phonetic: '/jiːld/',
        syllables: 'yield',
        partOfSpeech: 'noun',
        partOfSpeechAr: 'اسم',
        meaningEn: 'The full financial return on an investment over a specific period',
        meaningAr: 'عائد استثماري / ريع',
        synonyms: ['Return', 'Earnings', 'Output'],
        antonyms: ['Loss', 'Outflow'],
        examples: [
          'Government treasury bonds currently offer a guaranteed annual yield of four percent.',
          'High-yield investment programs frequently carry substantial financial risk.'
        ],
        imageQuery: 'plant growing from coins financial yield',
        category: 'finance'
      },
      {
        id: 'b2-u27-w5',
        word: 'Equity',
        phonetic: '/ˈekwəti/',
        syllables: 'eq·ui·ty',
        partOfSpeech: 'noun',
        partOfSpeechAr: 'اسم',
        meaningEn: 'The value of shares issued by a company; fairness and justice in treatment',
        meaningAr: 'حقوق الملكية / أسهم الشركة / عدالة',
        synonyms: ['Shares', 'Ownership', 'Fairness', 'Stock'],
        antonyms: ['Debt', 'Inequity', 'Bias'],
        examples: [
          'Early startup employees accepted lower salaries in exchange for equity options.',
          'Home equity accumulates over the years as homeowners gradually pay off their mortgages.'
        ],
        imageQuery: 'shares certificate ownership equity pie chart',
        category: 'finance'
      },
      {
        id: 'b2-u27-w6',
        word: 'Valuation',
        phonetic: '/ˌvæljuˈeɪʃən/',
        syllables: 'val·u·a·tion',
        partOfSpeech: 'noun',
        partOfSpeechAr: 'اسم',
        meaningEn: 'An estimation of the monetary worth of something, especially by an appraiser',
        meaningAr: 'تقييم القيمة المالية',
        synonyms: ['Appraisal', 'Estimate', 'Assessment'],
        antonyms: ['Undervaluation'],
        examples: [
          'The latest round of venture capital funding gave the software startup a billion-dollar valuation.',
          'An independent valuation was commissioned before finalizing the corporate merger.'
        ],
        imageQuery: 'price tag appraisal luxury house valuation',
        category: 'finance'
      },
      {
        id: 'b2-u27-w7',
        word: 'Volatility',
        phonetic: '/ˌvɒləˈtɪləti/',
        syllables: 'vol·a·til·i·ty',
        partOfSpeech: 'noun',
        partOfSpeechAr: 'اسم',
        meaningEn: 'Liability to change rapidly and unpredictably, especially for the worse',
        meaningAr: 'تقلب حاد وغير مستقر في الأسعار',
        synonyms: ['Instability', 'Fluctuation', 'Turbulence'],
        antonyms: ['Stability', 'Constancy', 'Predictability'],
        examples: [
          'Cryptocurrency markets are known for sharp volatility and unexpected price swings.',
          'Diversified index funds help buffer everyday investors against stock market volatility.'
        ],
        imageQuery: 'roller coaster stock market line chart spikes',
        category: 'finance'
      },
      {
        id: 'b2-u27-w8',
        word: 'Collateral',
        phonetic: '/kəˈlætərəl/',
        syllables: 'col·lat·er·al',
        partOfSpeech: 'noun',
        partOfSpeechAr: 'اسم',
        meaningEn: 'Something pledged as security for repayment of a loan, forfeited in case of default',
        meaningAr: 'ضمان مالي / رهن عقاري أو عيني',
        synonyms: ['Security', 'Guarantee', 'Pledge'],
        antonyms: ['Unsecured debt'],
        examples: [
          'The borrower pledged his family estate as collateral to secure the commercial bank loan.',
          'If the loan defaults, the financial institution retains legal rights to liquidate the collateral.'
        ],
        imageQuery: 'bank safe vault key collateral pledge',
        category: 'finance'
      },
      {
        id: 'b2-u27-w9',
        word: 'Liquidity',
        phonetic: '/lɪˈkwɪdəti/',
        syllables: 'li·quid·i·ty',
        partOfSpeech: 'noun',
        partOfSpeechAr: 'اسم',
        meaningEn: 'The availability of liquid assets (especially cash) to a market or company',
        meaningAr: 'سيولة نقدية جاهزة',
        synonyms: ['Cash flow', 'Fluidity', 'Available funds'],
        antonyms: ['Illiquidity', 'Insolvency'],
        examples: [
          'Maintaining adequate liquidity enables a firm to meet unexpected operating expenses.',
          'Central banks inject liquidity into commercial banking systems during economic crises.'
        ],
        imageQuery: 'cash banknotes water stream liquidity concept',
        category: 'finance'
      },
      {
        id: 'b2-u27-w10',
        word: 'Fiscal',
        phonetic: '/ˈfɪskəl/',
        syllables: 'fis·cal',
        partOfSpeech: 'adjective',
        partOfSpeechAr: 'صفة',
        meaningEn: 'Relating to government revenue, taxation, and public spending policies',
        meaningAr: 'مالي حكومي / متعلق بالميزانية والضرائب',
        synonyms: ['Financial', 'Monetary', 'Budgetary'],
        antonyms: ['Non-financial'],
        examples: [
          'The treasury minister unveiled strict fiscal discipline measures to rein in public debt.',
          'The corporation recorded record-breaking revenue in the third quarter of the fiscal year.'
        ],
        imageQuery: 'treasury government budget stamps fiscal report',
        category: 'finance'
      }
    ]
  },
  {
    id: 'b2-u28',
    title: 'Journalism & Mass Media',
    titleAr: 'الصحافة والإعلام',
    description: 'News broadcasting, media ethics, and reporting vocabulary.',
    descriptionAr: 'مصطلحات التغطية الإخبارية، أخلاقيات الإعلام والتحرير الصحفي.',
    words: [
      {
        id: 'b2-u28-w1',
        word: 'Censorship',
        phonetic: '/ˈsensəʃɪp/',
        syllables: 'cen·sor·ship',
        partOfSpeech: 'noun',
        partOfSpeechAr: 'اسم',
        meaningEn: 'The suppression or prohibition of any parts of books, news, or films that are considered politically unacceptable',
        meaningAr: 'رقابة على المطبوعات والإعلام',
        synonyms: ['Suppression', 'Restriction', 'Muzzling'],
        antonyms: ['Free expression', 'Openness'],
        examples: [
          'Independent reporters fought against government censorship to publish the investigation.',
          'Digital censorship prevents citizens from accessing international news websites.'
        ],
        imageQuery: 'stamp censored red mark freedom of press',
        category: 'media'
      },
      {
        id: 'b2-u28-w2',
        word: 'Bias',
        phonetic: '/ˈbaɪəs/',
        syllables: 'bi·as',
        partOfSpeech: 'noun',
        partOfSpeechAr: 'اسم',
        meaningEn: 'Prejudice in favor of or against one thing, person, or group compared with another',
        meaningAr: 'انحياز / تحيز مسبق',
        synonyms: ['Prejudice', 'Partiality', 'Slant'],
        antonyms: ['Objectivity', 'Fairness', 'Impartiality'],
        examples: [
          'Critics accused the television network of showing blatant political bias during the election.',
          'Journalists are trained to recognize and eliminate subconscious personal bias.'
        ],
        imageQuery: 'unbalanced scale one side heavier bias',
        category: 'media'
      },
      {
        id: 'b2-u28-w3',
        word: 'Coverage',
        phonetic: '/ˈkʌvərɪdʒ/',
        syllables: 'cov·er·age',
        partOfSpeech: 'noun',
        partOfSpeechAr: 'اسم',
        meaningEn: 'The reporting of news and events by broadcasting or the press',
        meaningAr: 'تغطية إعلامية وإخبارية',
        synonyms: ['Reporting', 'Broadcasting', 'Press attention'],
        antonyms: ['Silence', 'Neglect'],
        examples: [
          'Live coverage of the humanitarian relief effort reached millions of global viewers.',
          'The environmental summit received extensive coverage across leading international newspapers.'
        ],
        imageQuery: 'tv camera news microphone media reporter',
        category: 'media'
      },
      {
        id: 'b2-u28-w4',
        word: 'Editorial',
        phonetic: '/ˌedɪˈtɔːriəl/',
        syllables: 'ed·i·to·ri·al',
        partOfSpeech: 'noun',
        partOfSpeechAr: 'اسم',
        meaningEn: 'A newspaper article written by or on behalf of an editor that gives an opinion on a topical issue',
        meaningAr: 'مقال افتتاحي / رأي هيئة التحرير',
        synonyms: ['Leading article', 'Opinion piece', 'Column'],
        antonyms: ['Objective report'],
        examples: [
          'The newspaper’s weekend editorial strongly condemned the proposed cuts to public arts funding.',
          'She served on the publication’s editorial board for over a decade.'
        ],
        imageQuery: 'newspaper editorial page typewriter vintage',
        category: 'media'
      },
      {
        id: 'b2-u28-w5',
        word: 'Scoop',
        phonetic: '/skuːp/',
        syllables: 'scoop',
        partOfSpeech: 'noun',
        partOfSpeechAr: 'اسم',
        meaningEn: 'A piece of exclusive news published by a journalist or newspaper in advance of competitors',
        meaningAr: 'سبق صحفي حصري',
        synonyms: ['Exclusive', 'Breakthrough story', 'Lead'],
        antonyms: ['Old news', 'Reprint'],
        examples: [
          'The investigative journalist landed a major scoop by exposing corruption in the municipal contract.',
          'Breaking the scoop ahead of rival networks boosted the evening program’s ratings.'
        ],
        imageQuery: 'newspaper breaking news headline megaphone',
        category: 'media'
      },
      {
        id: 'b2-u28-w6',
        word: 'Disinformation',
        phonetic: '/ˌdɪsˌɪnfəˈmeɪʃən/',
        syllables: 'dis·in·for·ma·tion',
        partOfSpeech: 'noun',
        partOfSpeechAr: 'اسم',
        meaningEn: 'False information which is intended to mislead, especially propaganda issued by an organization',
        meaningAr: 'تضليل إعلامي متعمد',
        synonyms: ['Fake news', 'Propaganda', 'Misinformation'],
        antonyms: ['Accurate facts', 'Truth'],
        examples: [
          'Coordinated disinformation campaigns aim to polarize electorates and erode trust in democratic institutions.',
          'Fact-checking organizations work around the clock to debunk digital disinformation.'
        ],
        imageQuery: 'fake news internet magnifying glass red warning',
        category: 'media'
      },
      {
        id: 'b2-u28-w7',
        word: 'Sensationalism',
        phonetic: '/senˈseɪʃənəlɪzəm/',
        syllables: 'sen·sa·tion·al·ism',
        partOfSpeech: 'noun',
        partOfSpeechAr: 'اسم',
        meaningEn: 'The presentation of stories in a way that is intended to provoke public excitement, at the expense of accuracy',
        meaningAr: 'إثارة صحفية مبالغ فيها',
        synonyms: ['Yellow journalism', 'Exaggeration', 'Melodrama'],
        antonyms: ['Sober reporting', 'Restraint'],
        examples: [
          'Tabloid magazines frequently resort to sensationalism and hyperbolic headlines to sell issues.',
          'Critics denounced the documentary for prioritizing dramatic sensationalism over balanced scientific evidence.'
        ],
        imageQuery: 'tabloid exaggerated shock headlines newspaper',
        category: 'media'
      },
      {
        id: 'b2-u28-w8',
        word: 'Credibility',
        phonetic: '/ˌkredəˈbɪləti/',
        syllables: 'cred·i·bil·i·ty',
        partOfSpeech: 'noun',
        partOfSpeechAr: 'اسم',
        meaningEn: 'The quality of being trusted and believed in',
        meaningAr: 'مصداقية وجدارة بالثقة',
        synonyms: ['Trustworthiness', 'Reliability', 'Integrity'],
        antonyms: ['Implausibility', 'Dishonesty', 'Untruth'],
        examples: [
          'Retracting inaccurate reporting promptly protects the credibility of news organizations.',
          'The anonymous whistleblower provided verifiable documents to establish his credibility.'
        ],
        imageQuery: 'trust badge credibility shield certified',
        category: 'media'
      },
      {
        id: 'b2-u28-w9',
        word: 'Defamation',
        phonetic: '/ˌdefəˈmeɪʃən/',
        syllables: 'def·a·ma·tion',
        partOfSpeech: 'noun',
        partOfSpeechAr: 'اسم',
        meaningEn: 'The action of damaging the good reputation of someone; slander or libel',
        meaningAr: 'تشهير / قذف وتشويه سمعة',
        synonyms: ['Slander', 'Libel', 'Smear', 'Vilification'],
        antonyms: ['Praise', 'Commendation', 'Vindication'],
        examples: [
          'The celebrity won a substantial legal verdict in a high-profile defamation lawsuit.',
          'Publishing unverified accusations without evidence exposes journalists to civil defamation claims.'
        ],
        imageQuery: 'courtroom judge gavel legal libel lawsuit',
        category: 'media'
      },
      {
        id: 'b2-u28-w10',
        word: 'Syndicate',
        phonetic: '/ˈsɪndɪkət/',
        syllables: 'syn·di·cate',
        partOfSpeech: 'verb',
        partOfSpeechAr: 'فعل',
        meaningEn: 'To publish or broadcast material simultaneously in a number of newspapers or television stations',
        meaningAr: 'ينشر أو يبث عبر شبكة صحف متعددة',
        synonyms: ['Distribute', 'Broadcast', 'Circulate'],
        antonyms: ['Withhold', 'Restrict'],
        examples: [
          'Her weekly political commentary column is syndicated across fifty regional newspapers.',
          'The documentary series was syndicated internationally in over thirty countries.'
        ],
        imageQuery: 'global broadcasting network antennas satellite',
        category: 'media'
      }
    ]
  },
  {
    id: 'b2-u29',
    title: 'Psychology & Emotional Intelligence',
    titleAr: 'علم النفس والذكاء العاطفي',
    description: 'Human cognition, empathy, resilience, and behavioral awareness.',
    descriptionAr: 'مصطلحات الإدراك البشري، التعاطف الوجداني، والمرونة النفسية.',
    words: [
      {
        id: 'b2-u29-w1',
        word: 'Empathy',
        phonetic: '/ˈempəθi/',
        syllables: 'em·pa·thy',
        partOfSpeech: 'noun',
        partOfSpeechAr: 'اسم',
        meaningEn: 'The ability to understand and share the feelings of another',
        meaningAr: 'تعاطف وجداني / تفهم مشاعر الآخرين',
        synonyms: ['Compassion', 'Understanding', 'Sensitivity'],
        antonyms: ['Indifference', 'Apathy', 'Callousness'],
        examples: [
          'Empathetic doctors listen patiently to patient concerns before prescribing treatments.',
          'Practicing empathy enables leaders to resolve interpersonal conflicts effectively.'
        ],
        imageQuery: 'comforting hand gentle hug empathy heart',
        category: 'psychology'
      },
      {
        id: 'b2-u29-w2',
        word: 'Resilience',
        phonetic: '/rɪˈzɪliəns/',
        syllables: 're·sil·ience',
        partOfSpeech: 'noun',
        partOfSpeechAr: 'اسم',
        meaningEn: 'The capacity to recover quickly from difficulties; toughness',
        meaningAr: 'مرونة نفسية / قدرة على التعافي',
        synonyms: ['Strength', 'Toughness', 'Adaptability'],
        antonyms: ['Fragility', 'Vulnerability', 'Weakness'],
        examples: [
          'Children demonstrate remarkable emotional resilience when supported by caring communities.',
          'Entrepreneurs need resilience to bounce back from commercial failures and setbacks.'
        ],
        imageQuery: 'plant growing through concrete asphalt resilience',
        category: 'psychology'
      },
      {
        id: 'b2-u29-w3',
        word: 'Impulse',
        phonetic: '/ˈɪmpʌls/',
        syllables: 'im·pulse',
        partOfSpeech: 'noun',
        partOfSpeechAr: 'اسم',
        meaningEn: 'A sudden strong and unreflective urge or desire to act',
        meaningAr: 'دافع مفاجئ / نزوة / اندفاع',
        synonyms: ['Urge', 'Instinct', 'Whim', 'Spur'],
        antonyms: ['Deliberation', 'Restraint', 'Premeditation'],
        examples: [
          'She fought against the impulse to check her smartphone during the meeting.',
          'Retailers strategically place candy near cash registers to trigger impulse purchases.'
        ],
        imageQuery: 'light switch impulse spark brain thought',
        category: 'psychology'
      },
      {
        id: 'b2-u29-w4',
        word: 'Intuition',
        phonetic: '/ˌɪntjuːˈɪʃən/',
        syllables: 'in·tu·i·tion',
        partOfSpeech: 'noun',
        partOfSpeechAr: 'اسم',
        meaningEn: 'The ability to understand something instinctively, without the need for conscious reasoning',
        meaningAr: 'حدس / بصيرة داخلية',
        synonyms: ['Instinct', 'Sixth sense', 'Hunch'],
        antonyms: ['Intellect', 'Calculation', 'Analysis'],
        examples: [
          'Experienced surgeons develop an uncanny intuition for subtle clinical changes.',
          'Follow your intuition when something about a business deal feels suspicious.'
        ],
        imageQuery: 'head with light inner wisdom intuition gut feeling',
        category: 'psychology'
      },
      {
        id: 'b2-u29-w5',
        word: 'Vulnerability',
        phonetic: '/ˌvʌlnərəˈbɪləti/',
        syllables: 'vul·ner·a·bil·i·ty',
        partOfSpeech: 'noun',
        partOfSpeechAr: 'اسم',
        meaningEn: 'The quality or state of being exposed to the possibility of being attacked or harmed, either physically or emotionally',
        meaningAr: 'هشاشة / قابلية للتأثر والأذى',
        synonyms: ['Susceptibility', 'Openness', 'Exposure'],
        antonyms: ['Invulnerability', 'Resilience', 'Defense'],
        examples: [
          'Authentic leadership requires embracing vulnerability and admitting errors openly.',
          'Cybersecurity audits identify critical vulnerabilities in cloud server configurations.'
        ],
        imageQuery: 'hands holding fragile glass heart vulnerability',
        category: 'psychology'
      },
      {
        id: 'b2-u29-w6',
        word: 'Trauma',
        phonetic: '/ˈtrɔːmə/',
        syllables: 'trau·ma',
        partOfSpeech: 'noun',
        partOfSpeechAr: 'اسم',
        meaningEn: 'A deeply distressing or disturbing experience, or physical injury',
        meaningAr: 'صدمة نفسية أو جسدية',
        synonyms: ['Distress', 'Shock', 'Ordeal', 'Wound'],
        antonyms: ['Healing', 'Solace', 'Recovery'],
        examples: [
          'Psychotherapists help survivors process childhood trauma through gentle therapy.',
          'Emergency room physicians treated severe head trauma after the multi-car collision.'
        ],
        imageQuery: 'shattered glass reflection therapy trauma healing',
        category: 'psychology'
      },
      {
        id: 'b2-u29-w7',
        word: 'Catharsis',
        phonetic: '/kəˈθɑːsɪs/',
        syllables: 'ca·thar·sis',
        partOfSpeech: 'noun',
        partOfSpeechAr: 'اسم',
        meaningEn: 'The process of releasing, and thereby providing relief from, strong or repressed emotions',
        meaningAr: 'تفريغ انفعالي / تطهير نفسي',
        synonyms: ['Purging', 'Release', 'Relief', 'Cleansing'],
        antonyms: ['Repression', 'Inhibition'],
        examples: [
          'Writing expressive poetry gave him a profound sense of emotional catharsis.',
          'Tragic theatre offers audiences a shared experience of catharsis and renewal.'
        ],
        imageQuery: 'crying tears rain relief catharsis freedom',
        category: 'psychology'
      },
      {
        id: 'b2-u29-w8',
        word: 'Inhibition',
        phonetic: '/ˌɪnhɪˈbɪʃən/',
        syllables: 'in·hi·bi·tion',
        partOfSpeech: 'noun',
        partOfSpeechAr: 'اسم',
        meaningEn: 'A feeling that makes one self-conscious and unable to act in a relaxed and natural way',
        meaningAr: 'كبت / حرج نفسي / تردد مانع',
        synonyms: ['Restraint', 'Self-consciousness', 'Hesitation'],
        antonyms: ['Spontaneity', 'Freedom', 'Uninhibition'],
        examples: [
          'Improv acting games help shy students shed their inhibitions and speak freely.',
          'Social anxiety often produces severe social inhibition in unfamiliar groups.'
        ],
        imageQuery: 'closed lock person behind bars inhibition',
        category: 'psychology'
      },
      {
        id: 'b2-u29-w9',
        word: 'Self-esteem',
        phonetic: '/ˌself ɪˈstiːm/',
        syllables: 'self-es·teem',
        partOfSpeech: 'noun',
        partOfSpeechAr: 'اسم',
        meaningEn: 'Confidence in one’s own worth or abilities; self-respect',
        meaningAr: 'تقدير الذات / احترام النفس',
        synonyms: ['Self-respect', 'Confidence', 'Self-worth'],
        antonyms: ['Self-doubt', 'Insecurity'],
        examples: [
          'Constructive feedback and encouragement cultivate healthy self-esteem in young students.',
          'Comparing oneself to curated profiles on Instagram can erode personal self-esteem.'
        ],
        imageQuery: 'smiling reflection in mirror self-esteem confidence',
        category: 'psychology'
      },
      {
        id: 'b2-u29-w10',
        word: 'Burnout',
        phonetic: '/ˈbɜːnaʊt/',
        syllables: 'burn·out',
        partOfSpeech: 'noun',
        partOfSpeechAr: 'اسم',
        meaningEn: 'Physical or mental collapse caused by overwork or stress',
        meaningAr: 'إنهاك وظيفي / إرهاق جسدي ونفسي حاد',
        synonyms: ['Exhaustion', 'Fatigue', 'Overwork'],
        antonyms: ['Vigor', 'Energy', 'Revitalization'],
        examples: [
          'Chronic sixty-hour work weeks led several software developers straight to burnout.',
          'Setting clear boundaries between work and personal life is essential to avoid burnout.'
        ],
        imageQuery: 'exhausted person head on desk burnout tired',
        category: 'psychology'
      }
    ]
  },
  {
    id: 'b2-u30',
    title: 'Scientific Research & Methodology',
    titleAr: 'البحث العلمي والمنهجية',
    description: 'Empirical experimentation, data hypotheses, and statistical reasoning.',
    descriptionAr: 'مصطلحات التجارب المعملية، الفرضيات العلمية، والتحليل الإحصائي.',
    words: [
      {
        id: 'b2-u30-w1',
        word: 'Hypothesis',
        phonetic: '/haɪˈpɒθəsɪs/',
        syllables: 'hy·poth·e·sis',
        partOfSpeech: 'noun',
        partOfSpeechAr: 'اسم',
        meaningEn: 'A proposed explanation made on the basis of limited evidence as a starting point for further investigation',
        meaningAr: 'فرضية علمية قابلة للاختبار',
        synonyms: ['Theory', 'Conjecture', 'Postulate'],
        antonyms: ['Proven fact', 'Certainty'],
        examples: [
          'The research team designed a double-blind clinical trial to test their hypothesis.',
          'Experimental observations contradicted the initial hypothesis, requiring a revised model.'
        ],
        imageQuery: 'scientist writing formula chalkboard hypothesis',
        category: 'science'
      },
      {
        id: 'b2-u30-w2',
        word: 'Empirical',
        phonetic: '/ɪmˈpɪrɪkəl/',
        syllables: 'em·pir·i·cal',
        partOfSpeech: 'adjective',
        partOfSpeechAr: 'صفة',
        meaningEn: 'Based on, concerned with, or verifiable by observation or experience rather than theory or pure logic',
        meaningAr: 'تجريبي / مبني على الملاحظة والقياس',
        synonyms: ['Observed', 'Experimental', 'Factual'],
        antonyms: ['Theoretical', 'Hypothetical', 'Speculative'],
        examples: [
          'Her conclusions were grounded in solid empirical data gathered over ten years.',
          'Empirical research demonstrated that remote workers maintained equal productivity.'
        ],
        imageQuery: 'microscope petri dish lab experiment empirical',
        category: 'science'
      },
      {
        id: 'b2-u30-w3',
        word: 'Variable',
        phonetic: '/ˈveəriəbəl/',
        syllables: 'var·i·a·ble',
        partOfSpeech: 'noun',
        partOfSpeechAr: 'اسم',
        meaningEn: 'An element, feature, or factor that is liable to vary or change in an experiment',
        meaningAr: 'متغير في تجربة أو معادلة',
        synonyms: ['Factor', 'Parameter', 'Element'],
        antonyms: ['Constant', 'Invariable'],
        examples: [
          'In this study, room temperature was kept as a constant while humidity was the independent variable.',
          'Extraneous variables must be strictly controlled to ensure clean test results.'
        ],
        imageQuery: 'sliders mixing control console variables',
        category: 'science'
      },
      {
        id: 'b2-u30-w4',
        word: 'Correlation',
        phonetic: '/ˌkɒrəˈleɪʃən/',
        syllables: 'cor·re·la·tion',
        partOfSpeech: 'noun',
        partOfSpeechAr: 'اسم',
        meaningEn: 'A mutual relationship or connection between two or more things',
        meaningAr: 'ارتباط أو علاقة تبادلية',
        synonyms: ['Connection', 'Association', 'Link'],
        antonyms: ['Independence', 'Disconnection'],
        examples: [
          'Statisticians found a strong positive correlation between daily exercise and longevity.',
          'Remember that correlation between two trends does not necessarily imply direct causation.'
        ],
        imageQuery: 'scatter plot data correlation chart line',
        category: 'science'
      },
      {
        id: 'b2-u30-w5',
        word: 'Causation',
        phonetic: '/kɔːˈzeɪʃən/',
        syllables: 'cau·sa·tion',
        partOfSpeech: 'noun',
        partOfSpeechAr: 'اسم',
        meaningEn: 'The action of causing something; the relationship between cause and effect',
        meaningAr: 'سببية / علاقة علّة ومعلول',
        synonyms: ['Causality', 'Origin', 'Genesis'],
        antonyms: ['Coincidence', 'Chance'],
        examples: [
          'Epidemiologists conducted laboratory tests to establish definitive causation for the disease.',
          'Confusing mere correlation with direct causation is a frequent statistical error.'
        ],
        imageQuery: 'falling dominoes chain reaction cause effect',
        category: 'science'
      },
      {
        id: 'b2-u30-w6',
        word: 'Methodology',
        phonetic: '/ˌmeθəˈdɒlədʒi/',
        syllables: 'meth·od·ol·o·gy',
        partOfSpeech: 'noun',
        partOfSpeechAr: 'اسم',
        meaningEn: 'A system of methods used in a particular area of study or activity',
        meaningAr: 'منهجية بحثية ونظام عمل',
        synonyms: ['Procedure', 'Framework', 'Technique'],
        antonyms: ['Chaos', 'Improvisation'],
        examples: [
          'The dissertation contains a comprehensive chapter describing the sampling methodology.',
          'Adhering to a standardized methodology allows peer reviewers to validate your findings.'
        ],
        imageQuery: 'checklist flow chart scientific method steps',
        category: 'science'
      },
      {
        id: 'b2-u30-w7',
        word: 'Replicate',
        phonetic: '/ˈreplɪkeɪt/',
        syllables: 'rep·li·cate',
        partOfSpeech: 'verb',
        partOfSpeechAr: 'فعل',
        meaningEn: 'To make an exact copy of; reproduce or repeat an experiment to confirm results',
        meaningAr: 'يكرر تجربة للتحقق / يستنسخ بدقة',
        synonyms: ['Duplicate', 'Reproduce', 'Clone'],
        antonyms: ['Originate', 'Deviate'],
        examples: [
          'Independent laboratories were unable to replicate the controversial cold fusion experiment.',
          'Viruses hijack cellular machinery to replicate their genetic material rapidly.'
        ],
        imageQuery: 'dna strand replication double helix laboratory',
        category: 'science'
      },
      {
        id: 'b2-u30-w8',
        word: 'Qualitative',
        phonetic: '/ˈkwɒlɪtətɪv/',
        syllables: 'qual·i·ta·tive',
        partOfSpeech: 'adjective',
        partOfSpeechAr: 'صفة',
        meaningEn: 'Relating to, measuring, or measured by the quality of something rather than its quantity',
        meaningAr: 'نوعي / كيفي / متعلق بالصفات',
        synonyms: ['Descriptive', 'Subjective', 'Non-numerical'],
        antonyms: ['Quantitative', 'Numerical'],
        examples: [
          'Qualitative research methods like in-depth interviews uncover deep consumer motivations.',
          'The study combined qualitative feedback from focus groups with quantitative sales metrics.'
        ],
        imageQuery: 'interview notebook listening qualitative research',
        category: 'science'
      },
      {
        id: 'b2-u30-w9',
        word: 'Quantitative',
        phonetic: '/ˈkwɒntɪtətɪv/',
        syllables: 'quan·ti·ta·tive',
        partOfSpeech: 'adjective',
        partOfSpeechAr: 'صفة',
        meaningEn: 'Relating to, measuring, or measured by the quantity of something rather than its quality',
        meaningAr: 'كمي / إحصائي عددي',
        synonyms: ['Numerical', 'Measurable', 'Statistical'],
        antonyms: ['Qualitative', 'Anecdotal'],
        examples: [
          'Economists depend on quantitative analysis of millions of census transactions.',
          'The software engineer tracked quantitative benchmarks to measure system latency.'
        ],
        imageQuery: 'graphs analytics quantitative numbers code screens',
        category: 'science'
      },
      {
        id: 'b2-u30-w10',
        word: 'Anomaly',
        phonetic: '/əˈnɒməli/',
        syllables: 'a·nom·a·ly',
        partOfSpeech: 'noun',
        partOfSpeechAr: 'اسم',
        meaningEn: 'Something that deviates from what is standard, normal, or expected',
        meaningAr: 'شذوذ عن القاعدة / أمر غير معتاد',
        synonyms: ['Irregularity', 'Abnormality', 'Outlier'],
        antonyms: ['Norm', 'Standard', 'Regularity'],
        examples: [
          'Astronomers detected a gravitational anomaly near the orbit of the outer planet.',
          'The automated fraud detection system flagged a rare spending anomaly in the account.'
        ],
        imageQuery: 'one red apple among green apples anomaly outlier',
        category: 'science'
      }
    ]
  },
  {
    id: 'b2-u31',
    title: 'Environmental Science & Climate',
    titleAr: 'علوم البيئة والمناخ',
    description: 'Ecology, biodiversity conservation, and renewable planet management.',
    descriptionAr: 'مصطلحات علم البيئة والتنوع الحيوي وصون الموارد الطبيعية.',
    words: [
      {
        id: 'b2-u31-w1',
        word: 'Ecosystem',
        phonetic: '/ˈiːkəʊˌsɪstəm/',
        syllables: 'e·co·sys·tem',
        partOfSpeech: 'noun',
        partOfSpeechAr: 'اسم',
        meaningEn: 'A biological community of interacting organisms and their physical environment',
        meaningAr: 'نظام بيئي متكامل',
        synonyms: ['Biome', 'Ecological network', 'Environment'],
        antonyms: ['Sterile environment'],
        examples: [
          'Coral reefs form one of the richest and most diverse ecosystems on Earth.',
          'Overfishing threatens to disrupt the delicate equilibrium of the ocean ecosystem.'
        ],
        imageQuery: 'rainforest lush coral reef ecosystem nature',
        category: 'environment'
      },
      {
        id: 'b2-u31-w2',
        word: 'Biodiversity',
        phonetic: '/ˌbaɪəʊdaɪˈvɜːsəti/',
        syllables: 'bi·o·di·ver·si·ty',
        partOfSpeech: 'noun',
        partOfSpeechAr: 'اسم',
        meaningEn: 'The variety of plant and animal life in the world or in a particular habitat',
        meaningAr: 'تنوع بيولوجي / تنوع حيوي',
        synonyms: ['Ecological diversity', 'Variety of species'],
        antonyms: ['Monoculture', 'Homogeneity'],
        examples: [
          'Preserving national parks is vital to halting the tragic loss of global biodiversity.',
          'The tropical reserve boasts staggering biodiversity, housing thousands of unique species.'
        ],
        imageQuery: 'tropical birds butterflies flowers biodiversity wildlife',
        category: 'environment'
      },
      {
        id: 'b2-u31-w3',
        word: 'Emission',
        phonetic: '/ɪˈmɪʃən/',
        syllables: 'e·mis·sion',
        partOfSpeech: 'noun',
        partOfSpeechAr: 'اسم',
        meaningEn: 'The production and discharge of something, especially gas or radiation',
        meaningAr: 'انبعاثات غازية / إشعاع',
        synonyms: ['Discharge', 'Release', 'Exhaust'],
        antonyms: ['Absorption', 'Containment'],
        examples: [
          'Automakers are racing to develop zero-emission electric vehicles by the end of the decade.',
          'Strict national limits were enacted to curb industrial greenhouse gas emissions.'
        ],
        imageQuery: 'factory smokestack carbon emissions clouds',
        category: 'environment'
      },
      {
        id: 'b2-u31-w4',
        word: 'Conservation',
        phonetic: '/ˌkɒnsəˈveɪʃən/',
        syllables: 'con·ser·va·tion',
        partOfSpeech: 'noun',
        partOfSpeechAr: 'اسم',
        meaningEn: 'The prevention of wasteful use of a resource; preservation and protection of wildlife',
        meaningAr: 'حماية البيئة وصون الموارد',
        synonyms: ['Preservation', 'Protection', 'Safeguarding'],
        antonyms: ['Destruction', 'Waste', 'Depletion'],
        examples: [
          'Wildlife conservation efforts successfully brought the mountain gorilla back from the brink.',
          'Water conservation measures were introduced during the prolonged summer heatwave.'
        ],
        imageQuery: 'hands holding small green sprout seedling conservation',
        category: 'environment'
      },
      {
        id: 'b2-u31-w5',
        word: 'Deforestation',
        phonetic: '/diːˌfɒrɪˈsteɪʃən/',
        syllables: 'de·for·es·ta·tion',
        partOfSpeech: 'noun',
        partOfSpeechAr: 'اسم',
        meaningEn: 'The action of clearing a wide area of trees without replanting',
        meaningAr: 'إزالة الغابات وتجريفها',
        synonyms: ['Logging', 'Tree clearance', 'Forest stripping'],
        antonyms: ['Afforestation', 'Reforestation'],
        examples: [
          'Deforestation in the Amazon basin accelerates climate change and destroys indigenous habitats.',
          'Satellite imagery reveals alarming rates of illegal deforestation across protected reserves.'
        ],
        imageQuery: 'cut tree stumps aerial deforestation barren soil',
        category: 'environment'
      },
      {
        id: 'b2-u31-w6',
        word: 'Renewable',
        phonetic: '/rɪˈnjuːəbəl/',
        syllables: 're·new·a·ble',
        partOfSpeech: 'adjective',
        partOfSpeechAr: 'صفة',
        meaningEn: 'Not depleted by use; capable of being naturally replenished',
        meaningAr: 'متجدد وغير قابل للنضوب',
        synonyms: ['Sustainable', 'Inexhaustible', 'Green'],
        antonyms: ['Non-renewable', 'Finite', 'Fossil'],
        examples: [
          'Denmark produces over half of its electricity from renewable offshore wind turbines.',
          'Transitioning to renewable energy sources is the foundation of the net-zero strategy.'
        ],
        imageQuery: 'wind turbine solar panels blue sky renewable energy',
        category: 'environment'
      },
      {
        id: 'b2-u31-w7',
        word: 'Drought',
        phonetic: '/draʊt/',
        syllables: 'drought',
        partOfSpeech: 'noun',
        partOfSpeechAr: 'اسم',
        meaningEn: 'A prolonged period of abnormally low rainfall, leading to a shortage of water',
        meaningAr: 'جفاف وقحط مائي',
        synonyms: ['Dry spell', 'Water shortage', 'Aridity'],
        antonyms: ['Flood', 'Deluge', 'Wetness'],
        examples: [
          'Severe drought devastated regional grain harvests, sparking concerns about food security.',
          'Farmers in arid zones adopted drip irrigation to sustain crops through the drought.'
        ],
        imageQuery: 'cracked dry earth desert drought parched soil',
        category: 'environment'
      },
      {
        id: 'b2-u31-w8',
        word: 'Habitat',
        phonetic: '/ˈhæbɪtæt/',
        syllables: 'hab·i·tat',
        partOfSpeech: 'noun',
        partOfSpeechAr: 'اسم',
        meaningEn: 'The natural home or environment of an animal, plant, or other organism',
        meaningAr: 'موطن بيئي طبيعي',
        synonyms: ['Natural home', 'Territory', 'Environment'],
        antonyms: ['Unnatural enclosure'],
        examples: [
          'Urban expansion encroaches upon the natural habitat of migratory wetland birds.',
          'Protecting pristine polar bear habitats is the core priority of Arctic scientists.'
        ],
        imageQuery: 'deer forest natural wildlife habitat misty woods',
        category: 'environment'
      },
      {
        id: 'b2-u31-w9',
        word: 'Depletion',
        phonetic: '/dɪˈpliːʃən/',
        syllables: 'de·ple·tion',
        partOfSpeech: 'noun',
        partOfSpeechAr: 'اسم',
        meaningEn: 'Reduction in the number or quantity of something; the exhaustion of resources',
        meaningAr: 'استنزاف ونفاد الموارد',
        synonyms: ['Exhaustion', 'Drain', 'Diminution'],
        antonyms: ['Replenishment', 'Abundance', 'Restoration'],
        examples: [
          'Rapid groundwater depletion threatens irrigated agricultural regions in the central valley.',
          'The international ban on CFCs successfully halted further depletion of the ozone layer.'
        ],
        imageQuery: 'empty dry lake bed boat cracked sand depletion',
        category: 'environment'
      },
      {
        id: 'b2-u31-w10',
        word: 'Contaminant',
        phonetic: '/kənˈtæmɪnənt/',
        syllables: 'con·tam·i·nant',
        partOfSpeech: 'noun',
        partOfSpeechAr: 'اسم',
        meaningEn: 'A polluting or poisonous substance that makes something impure',
        meaningAr: 'مادة ملوثة أو سامة',
        synonyms: ['Pollutant', 'Impurity', 'Toxin'],
        antonyms: ['Purifier', 'Clean element'],
        examples: [
          'Municipal water testing detected chemical contaminants leaching from a nearby landfill.',
          'Advanced filtration systems eliminate microscopic contaminants from hospital air supplies.'
        ],
        imageQuery: 'water test tube droplet laboratory testing purity',
        category: 'environment'
      }
    ]
  },
  {
    id: 'b2-u32',
    title: 'Leadership & Corporate Governance',
    titleAr: 'القيادة والإدارة والحوكمة',
    description: 'Executive management, accountability, operational efficiency, and delegation.',
    descriptionAr: 'مصطلحات الإدارة التنفيذية، المساءلة، الحوكمة المؤسسية وتفويض المهام.',
    words: [
      {
        id: 'b2-u32-w1',
        word: 'Delegate',
        phonetic: '/ˈdelɪɡeɪt/',
        syllables: 'del·e·gate',
        partOfSpeech: 'verb',
        partOfSpeechAr: 'فعل',
        meaningEn: 'To entrust a task or responsibility to another person, typically one who is less senior',
        meaningAr: 'يفوض مهمة أو مسؤولية',
        synonyms: ['Assign', 'Entrust', 'Empower'],
        antonyms: ['Retain', 'Micromanage'],
        examples: [
          'Effective executives know how to delegate routine tasks and focus on long-term strategy.',
          'She delegated project supervision to her deputy while traveling abroad.'
        ],
        imageQuery: 'manager passing clipboard document to team member',
        category: 'management'
      },
      {
        id: 'b2-u32-w2',
        word: 'Accountability',
        phonetic: '/əˌkaʊntəˈbɪləti/',
        syllables: 'ac·count·a·bil·i·ty',
        partOfSpeech: 'noun',
        partOfSpeechAr: 'اسم',
        meaningEn: 'The fact or condition of being accountable; responsibility for decisions and outcomes',
        meaningAr: 'مساءلة ومسؤولية قانونية وأخلاقية',
        synonyms: ['Responsibility', 'Liability', 'Answerability'],
        antonyms: ['Irresponsibility', 'Impunity'],
        examples: [
          'A transparent corporate culture fosters individual accountability and mutual trust.',
          'The chief financial officer accepted full accountability for the accounting discrepancies.'
        ],
        imageQuery: 'scales justice balance boardroom corporate governance',
        category: 'management'
      },
      {
        id: 'b2-u32-w3',
        word: 'Benchmark',
        phonetic: '/ˈbentʃmɑːk/',
        syllables: 'bench·mark',
        partOfSpeech: 'noun',
        partOfSpeechAr: 'اسم',
        meaningEn: 'A standard or point of reference against which things may be compared or assessed',
        meaningAr: 'معيار مرجعي لقياس الأداء',
        synonyms: ['Standard', 'Criterion', 'Gauge'],
        antonyms: ['Deviation'],
        examples: [
          'The hospital’s infection control rates serve as a national benchmark for quality care.',
          'Our sales team established ambitious quarterly benchmarks to outperform competitors.'
        ],
        imageQuery: 'gauge meter measure benchmark high score',
        category: 'management'
      },
      {
        id: 'b2-u32-w4',
        word: 'Synergy',
        phonetic: '/ˈsɪnədʒi/',
        syllables: 'syn·er·gy',
        partOfSpeech: 'noun',
        partOfSpeechAr: 'اسم',
        meaningEn: 'The interaction of elements that when combined produce a total effect that is greater than the sum of the parts',
        meaningAr: 'تآزر وتكامل مثمر',
        synonyms: ['Collaboration', 'Teamwork', 'Harmony'],
        antonyms: ['Discord', 'Conflict', 'Friction'],
        examples: [
          'The corporate merger created powerful technological synergies between both engineering teams.',
          'Marketing and product development teams worked in synergy to launch the app.'
        ],
        imageQuery: 'interlocking gears clockwork cooperation teamwork',
        category: 'management'
      },
      {
        id: 'b2-u32-w5',
        word: 'Initiative',
        phonetic: '/ɪˈnɪʃətɪv/',
        syllables: 'in·i·ti·a·tive',
        partOfSpeech: 'noun',
        partOfSpeechAr: 'اسم',
        meaningEn: 'The ability to assess and initiate things independently; a fresh approach to something',
        meaningAr: 'مبادرة / حس القيادة الذاتي',
        synonyms: ['Enterprise', 'Drive', 'Resourcefulness'],
        antonyms: ['Passivity', 'Inaction', 'Lethargy'],
        examples: [
          'Managers value employees who show initiative and solve bottlenecks without prompting.',
          'The ministry launched a flagship nationwide initiative to promote digital literacy.'
        ],
        imageQuery: 'runner starting blocks race start initiative leadership',
        category: 'management'
      },
      {
        id: 'b2-u32-w6',
        word: 'Oversight',
        phonetic: '/ˈəʊvəsaɪt/',
        syllables: 'o·ver·sight',
        partOfSpeech: 'noun',
        partOfSpeechAr: 'اسم',
        meaningEn: 'The action of overseeing something; supervision; also an unintentional error or omission',
        meaningAr: 'إشراف ورقابة / أو سهو وهفوة غير مقصودة',
        synonyms: ['Supervision', 'Surveillance', 'Inspection'],
        antonyms: ['Neglect', 'Carelessness'],
        examples: [
          'A parliamentary committee provides strict legislative oversight of intelligence agencies.',
          'Omitting her signature from the bottom of the invoice was an unfortunate clerical oversight.'
        ],
        imageQuery: 'magnifying glass clipboard audit inspection oversight',
        category: 'management'
      },
      {
        id: 'b2-u32-w7',
        word: 'Milestone',
        phonetic: '/ˈmaɪlstəʊn/',
        syllables: 'mile·stone',
        partOfSpeech: 'noun',
        partOfSpeechAr: 'اسم',
        meaningEn: 'A significant stage or event in the development of something',
        meaningAr: 'محطة إنجاز بارزة / علامة فارقة',
        synonyms: ['Landmark', 'Breakthrough', 'Turning point'],
        antonyms: ['Insignificance'],
        examples: [
          'Reaching one million active registered users was a monumental milestone for the startup.',
          'The software deployment reached its final testing milestone on schedule.'
        ],
        imageQuery: 'flag on mountain peak milestone achievement',
        category: 'management'
      },
      {
        id: 'b2-u32-w8',
        word: 'Streamline',
        phonetic: '/ˈstriːmlaɪn/',
        syllables: 'stream·line',
        partOfSpeech: 'verb',
        partOfSpeechAr: 'فعل',
        meaningEn: 'To make an organization or system more efficient and effective by simplifying processes',
        meaningAr: 'يبسط الإجراءات ويرفع الكفاءة',
        synonyms: ['Simplify', 'Optimize', 'Rationalize'],
        antonyms: ['Complicate', 'Clutter'],
        examples: [
          'Automating the invoice verification pipeline streamlined accounting workflows.',
          'The agency restructured internal branches to streamline public service delivery.'
        ],
        imageQuery: 'sleek aerodynamic bullet train fast streamlined',
        category: 'management'
      },
      {
        id: 'b2-u32-w9',
        word: 'Restructure',
        phonetic: '/riːˈstrʌktʃər/',
        syllables: 're·struc·ture',
        partOfSpeech: 'verb',
        partOfSpeechAr: 'فعل',
        meaningEn: 'To organize differently; change the financial or operational structure of a company',
        meaningAr: 'يعيد هيكلة مؤسسة أو ديون',
        synonyms: ['Reorganize', 'Overhaul', 'Refactor'],
        antonyms: ['Maintain status quo'],
        examples: [
          'The board voted to restructure the division into three nimble autonomous business units.',
          'The airline successfully restructured its commercial debt to avert bankruptcy.'
        ],
        imageQuery: 'organization chart reorganization arrows blocks',
        category: 'management'
      },
      {
        id: 'b2-u32-w10',
        word: 'Governance',
        phonetic: '/ˈɡʌvənəns/',
        syllables: 'gov·ern·ance',
        partOfSpeech: 'noun',
        partOfSpeechAr: 'اسم',
        meaningEn: 'The action or manner of governing a state, organization, or corporate body',
        meaningAr: 'حوكمة وإدارة رشيدة',
        synonyms: ['Control', 'Regulation', 'Administration'],
        antonyms: ['Anarchy', 'Misrule'],
        examples: [
          'Ethical corporate governance mandates regular independent external financial audits.',
          'Sound environmental governance protects communal watersheds from unregulated pollution.'
        ],
        imageQuery: 'board of directors table meeting corporate governance',
        category: 'management'
      }
    ]
  },
  {
    id: 'b2-u33',
    title: 'Art, Literature & Creative Expression',
    titleAr: 'الفن والأدب والتعبير الإبداعي',
    description: 'Literary devices, critical analysis, aesthetic genres, and creative mastery.',
    descriptionAr: 'مصطلحات البلاغة الأدبية، النقد الفني، والجماليات الإبداعية.',
    words: [
      {
        id: 'b2-u33-w1',
        word: 'Motif',
        phonetic: '/məʊˈtiːf/',
        syllables: 'mo·tif',
        partOfSpeech: 'noun',
        partOfSpeechAr: 'اسم',
        meaningEn: 'A distinctive recurring feature or dominant idea in an artistic or literary composition',
        meaningAr: 'فكرة متكررة / نمط رمزي متكرر',
        synonyms: ['Theme', 'Pattern', 'Concept'],
        antonyms: ['Anomaly'],
        examples: [
          'The recurring motif of birds fleeing cages symbolizes the protagonist’s longing for freedom.',
          'Traditional geometric motifs decorate the handwoven Moroccan rugs.'
        ],
        imageQuery: 'ornate pattern repeating tile mosaic motif',
        category: 'arts'
      },
      {
        id: 'b2-u33-w2',
        word: 'Metaphor',
        phonetic: '/ˈmetəfər/',
        syllables: 'met·a·phor',
        partOfSpeech: 'noun',
        partOfSpeechAr: 'اسم',
        meaningEn: 'A figure of speech in which a word or phrase is applied to an object or action to which it is not literally applicable',
        meaningAr: 'استعارة بلاغية / مجاز',
        synonyms: ['Analogy', 'Allegory', 'Symbolism'],
        antonyms: ['Literal description'],
        examples: [
          'Shakespeare’s famous phrase "All the world’s a stage" is an iconic theatrical metaphor.',
          'The author uses the stormy ocean as a metaphor for the main character’s turbulent grief.'
        ],
        imageQuery: 'theatre masks drama comedy metaphor poetry',
        category: 'arts'
      },
      {
        id: 'b2-u33-w3',
        word: 'Genre',
        phonetic: '/ˈʒɒnrə/',
        syllables: 'gen·re',
        partOfSpeech: 'noun',
        partOfSpeechAr: 'اسم',
        meaningEn: 'A category of artistic, musical, or literary composition characterized by a particular style',
        meaningAr: 'نوع أدبي أو فني أو موسيقي',
        synonyms: ['Category', 'Class', 'Style', 'School'],
        antonyms: ['Mishmash'],
        examples: [
          'Science fiction has emerged as a respected literary genre exploring ethical technology.',
          'Her novel masterfully blends historical mystery with elements of psychological thriller genres.'
        ],
        imageQuery: 'library shelves books fiction fantasy genre',
        category: 'arts'
      },
      {
        id: 'b2-u33-w4',
        word: 'Satire',
        phonetic: '/ˈsætaɪər/',
        syllables: 'sat·ire',
        partOfSpeech: 'noun',
        partOfSpeechAr: 'اسم',
        meaningEn: 'The use of humor, irony, exaggeration, or ridicule to expose and criticize people’s stupidity or vices',
        meaningAr: 'هجاء وسخرية أدبية هادفة',
        synonyms: ['Parody', 'Irony', 'Sarcasm', 'Lampoon'],
        antonyms: ['Homage', 'Praise'],
        examples: [
          'George Orwell’s "Animal Farm" is a timeless political satire on totalitarian regimes.',
          'The editorial cartoon uses sharp satire to expose the hypocrisy of political lobbying.'
        ],
        imageQuery: 'editorial cartoon caricature humor satire art',
        category: 'arts'
      },
      {
        id: 'b2-u33-w5',
        word: 'Imagery',
        phonetic: '/ˈɪmɪdʒri/',
        syllables: 'im·age·ry',
        partOfSpeech: 'noun',
        partOfSpeechAr: 'اسم',
        meaningEn: 'Visually descriptive or figurative language, especially in a literary work',
        meaningAr: 'تصوير بياني / خيال وصفي',
        synonyms: ['Sensory language', 'Visuals', 'Descriptions'],
        antonyms: ['Literal prose'],
        examples: [
          'The poet’s vivid pastoral imagery evokes the golden warmth of autumn afternoons.',
          'Haunting auditory and visual imagery lingers long after finishing the short story.'
        ],
        imageQuery: 'open book with glowing magical trees imagery imagination',
        category: 'arts'
      },
      {
        id: 'b2-u33-w6',
        word: 'Nuance',
        phonetic: '/ˈnjuːɑːns/',
        syllables: 'nu·ance',
        partOfSpeech: 'noun',
        partOfSpeechAr: 'اسم',
        meaningEn: 'A subtle difference in or shade of meaning, expression, or sound',
        meaningAr: 'فارق دقيق وخفي في المعنى أو التعبير',
        synonyms: ['Subtlety', 'Shade', 'Distinction', 'Refinement'],
        antonyms: ['Bluntness', 'Oversimplification'],
        examples: [
          'A skilled translator captures cultural nuances that automated software routinely misses.',
          'Her vocal performance conveyed exquisite emotional nuance without being theatrical.'
        ],
        imageQuery: 'color gradient subtle shades nuance palette',
        category: 'arts'
      },
      {
        id: 'b2-u33-w7',
        word: 'Poignant',
        phonetic: '/ˈpɔɪnjənt/',
        syllables: 'poign·ant',
        partOfSpeech: 'adjective',
        partOfSpeechAr: 'صفة',
        meaningEn: 'Evoking a keen sense of sadness, regret, or deep emotional resonance',
        meaningAr: 'مؤثر عاطفياً / شجي ومحرك للشجن',
        synonyms: ['Touching', 'Moving', 'Heartbreaking', 'Affecting'],
        antonyms: ['Unmoving', 'Cheerful', 'Dull'],
        examples: [
          'The documentary concluded with a poignant letter written by a young frontline soldier.',
          'Her poignant farewell speech brought tears to the eyes of long-time colleagues.'
        ],
        imageQuery: 'solitary figure sunset bench emotional poignant moment',
        category: 'arts'
      },
      {
        id: 'b2-u33-w8',
        word: 'Masterpiece',
        phonetic: '/ˈmɑːstəpiːs/',
        syllables: 'mas·ter·piece',
        partOfSpeech: 'noun',
        partOfSpeechAr: 'اسم',
        meaningEn: 'A work of outstanding artistry, skill, or workmanship',
        meaningAr: 'تحفة فنية / عمل فني خالد',
        synonyms: ['Magnum opus', 'Tour de force', 'Classic'],
        antonyms: ['Failure', 'Mediocrity'],
        examples: [
          'Leonardo da Vinci’s Mona Lisa is celebrated as an unrivaled Renaissance masterpiece.',
          'Critics universally hailed the director’s latest film as a cinematic masterpiece.'
        ],
        imageQuery: 'art museum classical oil painting framed masterpiece',
        category: 'arts'
      },
      {
        id: 'b2-u33-w9',
        word: 'Perspective',
        phonetic: '/pəˈspektɪv/',
        syllables: 'per·spec·tive',
        partOfSpeech: 'noun',
        partOfSpeechAr: 'اسم',
        meaningEn: 'A particular attitude toward or way of regarding something; a point of view',
        meaningAr: 'منظور / زاوية رؤية / وجهة نظر',
        synonyms: ['Point of view', 'Outlook', 'Stance', 'Angle'],
        antonyms: ['Narrow-mindedness'],
        examples: [
          'Traveling abroad broadens your mind and grants a valuable global perspective.',
          'The Renaissance artist mastered linear perspective to render realistic depth on canvas.'
        ],
        imageQuery: 'vanishing point railway tracks perspective horizon',
        category: 'arts'
      },
      {
        id: 'b2-u33-w10',
        word: 'Renaissance',
        phonetic: '/rəˈneɪsəns/',
        syllables: 'ren·ais·sance',
        partOfSpeech: 'noun',
        partOfSpeechAr: 'اسم',
        meaningEn: 'A revival of or renewed interest in something, especially art, literature, or culture',
        meaningAr: 'نهضة فكرية وثقافية / إحياء حضاري',
        synonyms: ['Revival', 'Rebirth', 'Resurgence', 'Renewal'],
        antonyms: ['Decline', 'Decay', 'Stagnation'],
        examples: [
          'Independent bookstore culture is experiencing an unexpected creative renaissance.',
          'The Italian Renaissance produced groundbreaking advances in anatomy, painting, and architecture.'
        ],
        imageQuery: 'florence cathedral dome renaissance italy architecture',
        category: 'arts'
      }
    ]
  }
];

// Append new units
wordsData.levels.B2.units.push(...newB2Units);

fs.writeFileSync(wordsPath, JSON.stringify(wordsData, null, 2), 'utf8');
console.log('Successfully added 10 B2 units (b2-u24 through b2-u33)!');

const totalB2Words = wordsData.levels.B2.units.reduce((acc, u) => acc + u.words.length, 0);
console.log('B2 units count now:', wordsData.levels.B2.units.length);
console.log('B2 total words:', totalB2Words);

const grandTotal = Object.values(wordsData.levels).reduce((acc, l) => acc + (l.units || []).reduce((a, u) => a + (u.words ? u.words.length : 0), 0), 0);
console.log('Grand total words in words.json:', grandTotal);
