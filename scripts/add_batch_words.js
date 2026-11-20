const fs = require('fs');
const path = require('path');

const wordsJsonPath = path.join(__dirname, '..', 'src', 'data', 'words.json');
const data = JSON.parse(fs.readFileSync(wordsJsonPath, 'utf8'));

const b2Units = [
  {
    id: "b2-u14",
    title: "Architecture & Urban Planning",
    titleAr: "العمارة والتخطيط العمراني",
    category: "arts",
    words: [
      {
        id: "b2-u14-w1", word: "Facade", phonetic: "/fəˈsɑːd/", syllables: "fa·cade",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "The principal front of a building facing the street", meaningAr: "واجهة المبنى",
        synonyms: ["Front", "Exterior", "Face"], antonyms: ["Interior", "Back"],
        examples: ["The historic cathedral has an impressive facade.", "Behind his calm facade lay immense tension.", "The modern building features a glass facade."],
        imageQuery: "building facade architecture", category: "arts"
      },
      {
        id: "b2-u14-w2", word: "Zoning", phonetic: "/ˈzoʊnɪŋ/", syllables: "zon·ing",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "Dividing urban areas into zones reserved for specific purposes", meaningAr: "تقسيم المناطق العمرانية",
        synonyms: ["Partitioning", "Division", "Allocation"], antonyms: [],
        examples: ["Strict zoning laws prevent factories in residential areas.", "The city council revised the commercial zoning regulations.", "Zoning policies shape the urban landscape."],
        imageQuery: "city zoning urban plan", category: "arts"
      },
      {
        id: "b2-u14-w3", word: "Density", phonetic: "/ˈdɛnsɪti/", syllables: "den·si·ty",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "The degree of compactness of a substance or population", meaningAr: "كثافة سكانية / تركيز",
        synonyms: ["Crowdedness", "Concentration", "Compactness"], antonyms: ["Sparseness", "Dispersion"],
        examples: ["High population density creates traffic congestion.", "Urban planners try to balance density with open parks.", "The downtown core has a very high population density."],
        imageQuery: "city population density", category: "arts"
      },
      {
        id: "b2-u14-w4", word: "Aesthetic", phonetic: "/iːsˈθɛtɪk/", syllables: "aes·thet·ic",
        partOfSpeech: "adjective", partOfSpeechAr: "صفة",
        meaningEn: "Concerned with beauty or the appreciation of beauty", meaningAr: "جمالي",
        synonyms: ["Artistic", "Tasteful", "Decorative"], antonyms: ["Unattractive", "Drab"],
        examples: ["The bridge combines functional strength with aesthetic grace.", "Modern architects prioritize aesthetic value as well as utility.", "The town was redesigned with aesthetic harmony in mind."],
        imageQuery: "aesthetic architecture design", category: "arts"
      },
      {
        id: "b2-u14-w5", word: "Demolish", phonetic: "/dɪˈmɒlɪʃ/", syllables: "de·mol·ish",
        partOfSpeech: "verb", partOfSpeechAr: "فعل",
        meaningEn: "To pull down or completely destroy a structure", meaningAr: "يهدم",
        synonyms: ["Tear down", "Flatten", "Dismantle"], antonyms: ["Construct", "Build"],
        examples: ["The council decided to demolish the dilapidated factory.", "Workers will demolish the old stadium next month.", "The storm threatened to demolish the wooden houses."],
        imageQuery: "demolish building construction", category: "arts"
      },
      {
        id: "b2-u14-w6", word: "Renovate", phonetic: "/ˈrɛnəveɪt/", syllables: "ren·o·vate",
        partOfSpeech: "verb", partOfSpeechAr: "فعل",
        meaningEn: "To restore to a good state of repair", meaningAr: "يرمم / يجدد",
        synonyms: ["Restore", "Refurbish", "Revamp"], antonyms: ["Damage", "Neglect"],
        examples: ["They invested heavily to renovate the old theatre.", "The house took six months to fully renovate.", "Renovating historical landmarks protects our cultural heritage."],
        imageQuery: "renovate house interior", category: "arts"
      },
      {
        id: "b2-u14-w7", word: "Infrastructure", phonetic: "/ˈɪnfrəstrʌktʃər/", syllables: "in·fra·struc·ture",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "The basic physical structures needed for society operation", meaningAr: "بنية تحتية",
        synonyms: ["Framework", "Facilities", "Foundation"], antonyms: [],
        examples: ["Investing in transport infrastructure boosts economic growth.", "The earthquake severely damaged public infrastructure.", "Modern smart cities require robust digital infrastructure."],
        imageQuery: "infrastructure roads bridge", category: "arts"
      },
      {
        id: "b2-u14-w8", word: "Landmark", phonetic: "/ˈlændmɑːrk/", syllables: "land·mark",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "An object or feature that is easily seen and recognized", meaningAr: "معلم بارز",
        synonyms: ["Monument", "Signpost", "Milestone"], antonyms: [],
        examples: ["The Eiffel Tower is the most famous landmark in Paris.", "The old lighthouse serves as a navigational landmark.", "The supreme court issued a landmark ruling today."],
        imageQuery: "landmark monument architecture", category: "arts"
      },
      {
        id: "b2-u14-w9", word: "Sustainable", phonetic: "/səˈsteɪnəbəl/", syllables: "sus·tain·a·ble",
        partOfSpeech: "adjective", partOfSpeechAr: "صفة",
        meaningEn: "Able to be maintained at a certain rate or without depleting resources", meaningAr: "مستدام",
        synonyms: ["Eco-friendly", "Renewable", "Viable"], antonyms: ["Unsustainable", "Wasteful"],
        examples: ["Sustainable buildings consume minimal electricity.", "The city adopted sustainable materials for all new schools.", "We need sustainable development to protect nature."],
        imageQuery: "sustainable green building", category: "arts"
      },
      {
        id: "b2-u14-w10", word: "Metropolitan", phonetic: "/ˌmɛtrəˈpɒlɪtən/", syllables: "met·ro·pol·i·tan",
        partOfSpeech: "adjective", partOfSpeechAr: "صفة",
        meaningEn: "Relating to a large city, often regarded as its center", meaningAr: "حضري / كبرى المدن",
        synonyms: ["Urban", "Citywide", "Civic"], antonyms: ["Rural", "Provincial"],
        examples: ["The metropolitan transit authority operates trains across the county.", "Tokyo is the largest metropolitan area in the world.", "Metropolitan life offers diverse cultural opportunities."],
        imageQuery: "metropolitan city skyline", category: "arts"
      }
    ]
  },
  {
    id: "b2-u15",
    title: "Communication & Public Relations",
    titleAr: "التواصل والعلاقات العامة",
    category: "communication",
    words: [
      {
        id: "b2-u15-w1", word: "Spokesperson", phonetic: "/ˈspoʊkspɜːrsən/", syllables: "spokes·per·son",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "A person chosen to speak officially on behalf of others", meaningAr: "متحدث رسمي",
        synonyms: ["Representative", "Delegate", "Agent"], antonyms: [],
        examples: ["The ministry spokesperson issued an official clarification.", "A company spokesperson addressed the press after the launch.", "She was appointed as the main spokesperson for the charity."],
        imageQuery: "spokesperson conference press", category: "communication"
      },
      {
        id: "b2-u15-w2", word: "Endorse", phonetic: "/ɪnˈdɔːrs/", syllables: "en·dorse",
        partOfSpeech: "verb", partOfSpeechAr: "فعل",
        meaningEn: "To declare public approval or support of something", meaningAr: "يصادق على / يؤيد رسمياً",
        synonyms: ["Support", "Approve", "Back"], antonyms: ["Oppose", "Reject"],
        examples: ["Celebrities frequently endorse international commercial brands.", "The medical association refused to endorse the unproven remedy.", "Several senators endorsed the proposed peace treaty."],
        imageQuery: "endorse agreement approval", category: "communication"
      },
      {
        id: "b2-u15-w3", word: "Campaign", phonetic: "/kæmˈpeɪn/", syllables: "cam·paign",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "An organized course of action to achieve a specific goal", meaningAr: "حملة إعلامية / توعوية",
        synonyms: ["Drive", "Initiative", "Crusade"], antonyms: [],
        examples: ["The health authority launched an anti-smoking campaign.", "Their digital marketing campaign reached millions of users.", "Volunteers helped organize the fundraising campaign."],
        imageQuery: "campaign poster social media", category: "communication"
      },
      {
        id: "b2-u15-w4", word: "Articulate", phonetic: "/ɑːrˈtɪkjʊleɪt/", syllables: "ar·tic·u·late",
        partOfSpeech: "adjective", partOfSpeechAr: "صفة",
        meaningEn: "Having or showing the ability to speak fluently and coherently", meaningAr: "بليغ / فصيح اللسان",
        synonyms: ["Eloquent", "Fluent", "Expressive"], antonyms: ["Inarticulate", "Hesitant"],
        examples: ["She is an articulate speaker who explains difficult ideas clearly.", "An articulate response calmed the anxious investors.", "He gave a remarkably articulate summary of the dilemma."],
        imageQuery: "articulate public speaker", category: "communication"
      },
      {
        id: "b2-u15-w5", word: "Clarification", phonetic: "/ˌklærɪfɪˈkeɪʃən/", syllables: "clar·i·fi·ca·tion",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "The action of making a statement or situation less confusing", meaningAr: "توضيح / استيضاح",
        synonyms: ["Explanation", "Elucidation", "Interpretation"], antonyms: ["Confusion", "Obscurity"],
        examples: ["The diplomat asked for clarification on the treaty terms.", "We sought official clarification from the department manager.", "His explanation provided much needed clarification."],
        imageQuery: "clarification explanation message", category: "communication"
      },
      {
        id: "b2-u15-w6", word: "Diplomatic", phonetic: "/ˌdɪpləˈmætɪk/", syllables: "dip·lo·mat·ic",
        partOfSpeech: "adjective", partOfSpeechAr: "صفة",
        meaningEn: "Showing skill in dealing with people and avoiding offense", meaningAr: "دبلوماسي / لبق",
        synonyms: ["Tactful", "Polite", "Discreet"], antonyms: ["Tactless", "Rude"],
        examples: ["He gave a diplomatic answer without offending either side.", "Her diplomatic demeanor resolved the workplace disagreement.", "The ambassadors held diplomatic talks in Geneva."],
        imageQuery: "diplomatic handshake discussion", category: "communication"
      },
      {
        id: "b2-u15-w7", word: "Audience", phonetic: "/ˈɔːdiəns/", syllables: "au·di·ence",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "The assembled spectators or listeners at a public event", meaningAr: "جمهور",
        synonyms: ["Spectators", "Listeners", "Public"], antonyms: [],
        examples: ["The speaker captured the attention of the entire audience.", "Knowing your target audience is essential in modern advertising.", "The lecture hall was filled with an eager audience."],
        imageQuery: "audience crowd seminar", category: "communication"
      },
      {
        id: "b2-u15-w8", word: "Mislead", phonetic: "/mɪsˈliːd/", syllables: "mis·lead",
        partOfSpeech: "verb", partOfSpeechAr: "فعل",
        meaningEn: "To cause someone to have a wrong idea or impression", meaningAr: "يضلل / يخدع",
        synonyms: ["Deceive", "Delude", "Misinform"], antonyms: ["Guide", "Inform"],
        examples: ["Advertisements should never mislead vulnerable consumers.", "False rumors mislead the public during an emergency.", "Statistics can easily be manipulated to mislead readers."],
        imageQuery: "mislead fake news illusion", category: "communication"
      },
      {
        id: "b2-u15-w9", word: "Advocate", phonetic: "/ˈædvəkeɪt/", syllables: "ad·vo·cate",
        partOfSpeech: "verb", partOfSpeechAr: "فعل",
        meaningEn: "To publicly recommend or support a cause or policy", meaningAr: "يدافع عن / يدعو إلى",
        synonyms: ["Champion", "Promote", "Uphold"], antonyms: ["Oppose", "Denounce"],
        examples: ["Activists advocate for cleaner air and water standards.", "Doctors advocate regular exercise to reduce heart attacks.", "She continues to advocate equal pay for women."],
        imageQuery: "advocate support protest", category: "communication"
      },
      {
        id: "b2-u15-w10", word: "Reputation", phonetic: "/ˌrɛpjʊˈteɪʃən/", syllables: "rep·u·ta·tion",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "The beliefs or opinions generally held about someone", meaningAr: "سمعة",
        synonyms: ["Prestige", "Standing", "Stature"], antonyms: ["Infamy"],
        examples: ["The hospital enjoys an impeccable global reputation.", "A single scandal can destroy years of good reputation.", "High ethical conduct protects corporate reputation."],
        imageQuery: "reputation star quality trust", category: "communication"
      }
    ]
  },
  {
    id: "b2-u16",
    title: "Ethics & Moral Dilemmas",
    titleAr: "الأخلاقيات والمعضلات",
    category: "psychology",
    words: [
      {
        id: "b2-u16-w1", word: "Integrity", phonetic: "/ɪnˈtɛɡrɪti/", syllables: "in·teg·ri·ty",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "The quality of being honest and having strong moral principles", meaningAr: "نزاهة / استقامة",
        synonyms: ["Honesty", "Probity", "Morality"], antonyms: ["Dishonesty", "Deceit"],
        examples: ["A judge must act with absolute integrity at all times.", "His professional integrity was recognized across the industry.", "Financial auditors need honesty and unyielding integrity."],
        imageQuery: "integrity ethics moral compass", category: "psychology"
      },
      {
        id: "b2-u16-w2", word: "Dilemma", phonetic: "/dɪˈlɛmə/", syllables: "di·lem·ma",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "A situation in which a difficult choice has to be made between two alternatives", meaningAr: "معضلة / مأزق",
        synonyms: ["Predicament", "Quandary", "Conundrum"], antonyms: ["Solution"],
        examples: ["The manager faced an ethical dilemma regarding budget cuts.", "Choosing between family loyalty and truth created a dilemma.", "The team resolved the dilemma through open deliberation."],
        imageQuery: "dilemma choice decision", category: "psychology"
      },
      {
        id: "b2-u16-w3", word: "Obligation", phonetic: "/ˌɒblɪˈɡeɪʃən/", syllables: "ob·li·ga·tion",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "An act or course of action to which a person is morally or legally bound", meaningAr: "التزام / واجب",
        synonyms: ["Duty", "Commitment", "Responsibility"], antonyms: ["Discharge"],
        examples: ["Citizens have a civic obligation to vote in elections.", "Doctors feel a moral obligation to treat every patient.", "He fulfilled his financial obligation without delay."],
        imageQuery: "obligation duty contract", category: "psychology"
      },
      {
        id: "b2-u16-w4", word: "Justify", phonetic: "/ˈdʒʌstɪfaɪ/", syllables: "jus·ti·fy",
        partOfSpeech: "verb", partOfSpeechAr: "فعل",
        meaningEn: "To show or prove to be right or reasonable", meaningAr: "يبرر",
        synonyms: ["Defend", "Vindicate", "Validate"], antonyms: ["Condemn", "Disprove"],
        examples: ["Nothing can justify violence against innocent civilians.", "He struggled to justify the excessive expenditures.", "The company justified the price increase with inflation."],
        imageQuery: "justify reason evidence scale", category: "psychology"
      },
      {
        id: "b2-u16-w5", word: "Virtue", phonetic: "/ˈvɜːrtʃuː/", syllables: "vir·tue",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "Behavior showing high moral standards", meaningAr: "فضيلة",
        synonyms: ["Goodness", "Righteousness", "Honor"], antonyms: ["Vice", "Immorality"],
        examples: ["Patience is considered a vital human virtue.", "Humility is an admirable virtue in great leaders.", "Philosophy explores the balance between virtue and pleasure."],
        imageQuery: "virtue moral goodness light", category: "psychology"
      },
      {
        id: "b2-u16-w6", word: "Accountable", phonetic: "/əˈkaʊntəbəl/", syllables: "ac·count·a·ble",
        partOfSpeech: "adjective", partOfSpeechAr: "صفة",
        meaningEn: "Required or expected to justify actions or decisions", meaningAr: "مسؤول / خاضع للمساءلة",
        synonyms: ["Answerable", "Responsible", "Liable"], antonyms: ["Irresponsible", "Exempt"],
        examples: ["Government officials must be held accountable to the public.", "Managers are accountable for their team's performance.", "Transparency ensures everyone remains accountable."],
        imageQuery: "accountable responsibility leadership", category: "psychology"
      },
      {
        id: "b2-u16-w7", word: "Bias", phonetic: "/ˈbaɪəs/", syllables: "bi·as",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "Prejudice in favor of or against one thing or group", meaningAr: "تحيز / انحياز",
        synonyms: ["Prejudice", "Partiality", "Favoritism"], antonyms: ["Fairness", "Impartiality"],
        examples: ["Journalists must strive to report news without political bias.", "Unconscious bias can influence hiring decisions unfairly.", "The algorithm showed a subtle cultural bias."],
        imageQuery: "bias balance fairness scales", category: "psychology"
      },
      {
        id: "b2-u16-w8", word: "Conscience", phonetic: "/ˈkɒnʃəns/", syllables: "con·science",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "An inner feeling or voice viewed as an acting guide to rightness", meaningAr: "ضمير",
        synonyms: ["Morals", "Scruples", "Inner voice"], antonyms: [],
        examples: ["His guilty conscience kept him awake through the night.", "She acted according to her conscience despite peer pressure.", "A clear conscience is the softest pillow."],
        imageQuery: "conscience thought heart mind", category: "psychology"
      },
      {
        id: "b2-u16-w9", word: "Hypocrisy", phonetic: "/hɪˈpɒkrɪsi/", syllables: "hy·poc·ri·sy",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "The practice of claiming moral standards that one does not practice", meaningAr: "نفاق",
        synonyms: ["Pretense", "Deceit", "Insincerity"], antonyms: ["Sincerity", "Authenticity"],
        examples: ["Condemning pollution while driving gas guzzlers is hypocrisy.", "Voters grew frustrated with political hypocrisy.", "Honest self-examination helps eliminate personal hypocrisy."],
        imageQuery: "hypocrisy two faced masks", category: "psychology"
      },
      {
        id: "b2-u16-w10", word: "Transparent", phonetic: "/trænsˈpærənt/", syllables: "trans·par·ent",
        partOfSpeech: "adjective", partOfSpeechAr: "صفة",
        meaningEn: "Allowing light to pass through; open to public scrutiny", meaningAr: "شفاف / صريح",
        synonyms: ["Clear", "Candid", "Open"], antonyms: ["Opaque", "Secretive"],
        examples: ["The government promised a transparent investigation into the accident.", "Transparent financial reporting builds shareholder confidence.", "Be transparent about any potential conflicts of interest."],
        imageQuery: "transparent glass clean open", category: "psychology"
      }
    ]
  },
  {
    id: "b2-u17",
    title: "Energy & Natural Resources",
    titleAr: "الطاقة والموارد الطبيعية",
    category: "nature",
    words: [
      {
        id: "b2-u17-w1", word: "Depletion", phonetic: "/dɪˈpliːʃən/", syllables: "de·ple·tion",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "Reduction in the number or quantity of something", meaningAr: "استنزاف / نضوب",
        synonyms: ["Exhaustion", "Consumption", "Draining"], antonyms: ["Replenishment", "Abundance"],
        examples: ["Overfishing leads to the rapid depletion of marine life.", "Groundwater depletion poses a serious threat to agriculture.", "We must conserve energy to prevent resource depletion."],
        imageQuery: "resource depletion drying drought", category: "nature"
      },
      {
        id: "b2-u17-w2", word: "Solar", phonetic: "/ˈsoʊlər/", syllables: "so·lar",
        partOfSpeech: "adjective", partOfSpeechAr: "صفة",
        meaningEn: "Relating to or determined by the sun", meaningAr: "شمسي",
        synonyms: ["Sun-powered"], antonyms: [],
        examples: ["Solar panels convert sunlight directly into electricity.", "The desert receives abundant solar radiation all year round.", "Solar energy is an infinite clean power source."],
        imageQuery: "solar panels sun green energy", category: "nature"
      },
      {
        id: "b2-u17-w3", word: "Turbine", phonetic: "/ˈtɜːrbaɪn/", syllables: "tur·bine",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "A machine for producing continuous power using fluid or gas flow", meaningAr: "توربين",
        synonyms: ["Generator", "Engine", "Rotor"], antonyms: [],
        examples: ["Wind turbines generate clean power along coastal hills.", "Water drives the turbine inside the hydroelectric dam.", "Modern turbines operate with high aerodynamic efficiency."],
        imageQuery: "wind turbine renewable energy", category: "nature"
      },
      {
        id: "b2-u17-w4", word: "Fossil", phonetic: "/ˈfɒsəl/", syllables: "fos·sil",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "The remains or impression of a prehistoric organism", meaningAr: "أحفورة (وقود أحفوري)",
        synonyms: ["Relic", "Petrifaction"], antonyms: [],
        examples: ["Fossil fuels release greenhouse gases when burned.", "Geologists found a marine fossil inside the limestone layer.", "Phasing out fossil energy is critical for climate targets."],
        imageQuery: "fossil rock stone science", category: "nature"
      },
      {
        id: "b2-u17-w5", word: "Efficiency", phonetic: "/ɪˈfɪʃənsi/", syllables: "ef·fi·cien·cy",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "The state or quality of being efficient with minimal waste", meaningAr: "كفاءة / فاعلية",
        synonyms: ["Effectiveness", "Productivity", "Competence"], antonyms: ["Inefficiency", "Wastefulness"],
        examples: ["Improving thermal insulation increases heating efficiency.", "Electric motors have much higher energy efficiency than gasoline engines.", "LED bulbs offer unmatched lighting efficiency."],
        imageQuery: "efficiency light bulb energy save", category: "nature"
      },
      {
        id: "b2-u17-w6", word: "Grid", phonetic: "/ɡrɪd/", syllables: "grid",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "A network of cables or pipes distributing power or supplies", meaningAr: "شبكة كهرباء عامة",
        synonyms: ["Network", "System", "Matrix"], antonyms: [],
        examples: ["Homeowners sell surplus electricity back to the national grid.", "Extreme winter weather knocked out the regional power grid.", "Smart grids balance electric supply and real-time demand."],
        imageQuery: "power grid electric transmission lines", category: "nature"
      },
      {
        id: "b2-u17-w7", word: "Biomass", phonetic: "/ˈbaɪoʊmæs/", syllables: "bi·o·mass",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "Total quantity or weight of organisms in an area, used as fuel", meaningAr: "كتلة حيوية",
        synonyms: ["Organic matter", "Biofuel"], antonyms: [],
        examples: ["Wood pellets and agricultural residue are common forms of biomass.", "Biomass power plants recycle forestry waste.", "Converting biomass into biofuels helps reduce transport emissions."],
        imageQuery: "biomass wood organic biofuel", category: "nature"
      },
      {
        id: "b2-u17-w8", word: "Conservation", phonetic: "/ˌkɒnsərˈveɪʃən/", syllables: "con·ser·va·tion",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "The prevention of wasteful use of a resource", meaningAr: "حفظ / ترشيد الاستهلاك",
        synonyms: ["Preservation", "Protection", "Safeguarding"], antonyms: ["Destruction", "Waste"],
        examples: ["Water conservation is crucial during summer droughts.", "Energy conservation tips can lower your monthly electricity bill.", "Wildlife conservation preserves endangered habitats."],
        imageQuery: "conservation water drop earth hands", category: "nature"
      },
      {
        id: "b2-u17-w9", word: "Extraction", phonetic: "/ɪkˈstrækʃən/", syllables: "ex·trac·tion",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "The action of taking out something, especially using effort or force", meaningAr: "استخراج / استخلاص",
        synonyms: ["Removal", "Withdrawal", "Mining"], antonyms: ["Insertion"],
        examples: ["Mineral extraction often causes localized soil degradation.", "Oil extraction in deep waters requires advanced engineering.", "Sustainable timber extraction prevents forest destruction."],
        imageQuery: "mineral extraction mine engineering", category: "nature"
      },
      {
        id: "b2-u17-w10", word: "Subsidize", phonetic: "/ˈsʌbsɪdaɪz/", syllables: "sub·si·dize",
        partOfSpeech: "verb", partOfSpeechAr: "فعل",
        meaningEn: "To support financially through grants or public funds", meaningAr: "يدعم مالياً (حكومياً)",
        synonyms: ["Fund", "Finance", "Underwrite"], antonyms: ["Tax", "Defund"],
        examples: ["Governments subsidize electric vehicle purchases to reduce smog.", "The state subsidizes public transit to encourage ridership.", "Subsidizing green tech speeds up clean energy adoption."],
        imageQuery: "subsidize money investment growth", category: "nature"
      }
    ]
  },
  {
    id: "b2-u18",
    title: "Mental Health & Well-being",
    titleAr: "الصحة النفسية والرفاه",
    category: "health",
    words: [
      {
        id: "b2-u18-w1", word: "Mindfulness", phonetic: "/ˈmaɪndfʊlnəs/", syllables: "mind·ful·ness",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "The quality or state of being conscious or aware of something", meaningAr: "يقظة ذهنية / وعي",
        synonyms: ["Awareness", "Attentiveness", "Presence"], antonyms: ["Distraction", "Neglect"],
        examples: ["Mindfulness meditation helps reduce occupational burnout.", "Practicing mindfulness improves emotional regulation.", "She starts each morning with ten minutes of mindfulness."],
        imageQuery: "mindfulness meditation peace", category: "health"
      },
      {
        id: "b2-u18-w2", word: "Resilience", phonetic: "/rɪˈzɪliəns/", syllables: "re·sil·ience",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "The capacity to recover quickly from difficulties; toughness", meaningAr: "مرونة نفسية / صمود",
        synonyms: ["Toughness", "Endurance", "Fortitude"], antonyms: ["Vulnerability", "Fragility"],
        examples: ["Emotional resilience allows people to bounce back after failure.", "Children often demonstrate incredible natural resilience.", "Community resilience helped the town rebuild after the flood."],
        imageQuery: "resilience flower rock overcoming", category: "health"
      },
      {
        id: "b2-u18-w3", word: "Burnout", phonetic: "/ˈbɜːrnaʊt/", syllables: "burn·out",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "State of emotional, physical, and mental exhaustion caused by stress", meaningAr: "إنهاك وظيفي / إرهاق حاد",
        synonyms: ["Exhaustion", "Fatigue", "Collapse"], antonyms: ["Energy", "Vitality"],
        examples: ["Long work hours without rest inevitably cause burnout.", "He took a medical sabbatical to recover from corporate burnout.", "Workplace wellness programs aim to prevent employee burnout."],
        imageQuery: "burnout tired stressed head in hands", category: "health"
      },
      {
        id: "b2-u18-w4", word: "Therapy", phonetic: "/ˈθɛrəpi/", syllables: "ther·a·py",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "Treatment intended to relieve or heal a disorder", meaningAr: "علاج نفسي / جلسات علاج",
        synonyms: ["Treatment", "Counseling", "Rehabilitation"], antonyms: [],
        examples: ["Cognitive behavioral therapy is proven to alleviate depression.", "Attending regular therapy sessions helped him manage grief.", "Art therapy provides a creative outlet for trauma survivors."],
        imageQuery: "therapy session counseling talk", category: "health"
      },
      {
        id: "b2-u18-w5", word: "Stigma", phonetic: "/ˈstɪɡmə/", syllables: "stig·ma",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "A mark of disgrace associated with a particular circumstance or quality", meaningAr: "وصمة عار / نظرة دونية",
        synonyms: ["Shame", "Disgrace", "Dishonor"], antonyms: ["Pride", "Credit"],
        examples: ["We must break the societal stigma surrounding mental illness.", "Public education campaigns help remove the stigma of seeking help.", "No one should experience social stigma for talking to a therapist."],
        imageQuery: "stigma mental health awareness", category: "health"
      },
      {
        id: "b2-u18-w6", word: "Anxiety", phonetic: "/æŋˈzaɪəti/", syllables: "anx·i·e·ty",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "A feeling of worry, nervousness, or unease about an imminent event", meaningAr: "قلق / توتر",
        synonyms: ["Apprehension", "Nervousness", "Unease"], antonyms: ["Calmness", "Serenity"],
        examples: ["Deep breathing exercises can calm acute test anxiety.", "Chronic anxiety impairs concentration and sleep quality.", "She sought clinical advice when anxiety disrupted daily work."],
        imageQuery: "anxiety stress nervous breathing", category: "health"
      },
      {
        id: "b2-u18-w7", word: "Coping", phonetic: "/ˈkoʊpɪŋ/", syllables: "cop·ing",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "Dealing effectively with something difficult", meaningAr: "تأقلم / مواجهة الضغوط",
        synonyms: ["Managing", "Handling", "Enduring"], antonyms: [],
        examples: ["Exercise and journaling are healthy coping mechanisms.", "Unhealthy coping habits like smoking only worsen stress.", "The support group taught positive emotional coping skills."],
        imageQuery: "coping calm nature walk", category: "health"
      },
      {
        id: "b2-u18-w8", word: "Depression", phonetic: "/dɪˈprɛʃən/", syllables: "de·pres·sion",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "A mental condition characterized by persistent feelings of sadness and loss of interest", meaningAr: "اكتئاب",
        synonyms: ["Despair", "Melancholy", "Gloom"], antonyms: ["Happiness", "Elation"],
        examples: ["Clinical depression requires professional diagnosis and care.", "Regular cardiovascular activity can alleviate mild depression.", "Family support is an invaluable asset when fighting depression."],
        imageQuery: "depression dark light hope mental", category: "health"
      },
      {
        id: "b2-u18-w9", word: "Equilibrium", phonetic: "/ˌiːkwɪˈlɪbriəm/", syllables: "e·qui·lib·ri·um",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "A state in which opposing forces or influences are balanced", meaningAr: "توازن نفسي / اتزان",
        synonyms: ["Balance", "Symmetry", "Equanimity"], antonyms: ["Imbalance", "Instability"],
        examples: ["A healthy work-life balance restores mental equilibrium.", "Meditation helped her maintain inner equilibrium during chaos.", "The body constantly works to preserve internal biological equilibrium."],
        imageQuery: "equilibrium balance stones zen", category: "health"
      },
      {
        id: "b2-u18-w10", word: "Empathy", phonetic: "/ˈɛmpəθi/", syllables: "em·pa·thy",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "The ability to understand and share the feelings of another", meaningAr: "تعاطف / تقمص وجداني",
        synonyms: ["Compassion", "Sensitivity", "Understanding"], antonyms: ["Apathy", "Indifference"],
        examples: ["Effective counselors listen with genuine empathy and patience.", "Teaching empathy in schools curbs bullying behaviors.", "Empathy fosters meaningful connections among colleagues."],
        imageQuery: "empathy listening comforting friend", category: "health"
      }
    ]
  },
  {
    id: "b2-u19",
    title: "International Trade & Commerce",
    titleAr: "التجارة الدولية والأعمال",
    category: "finance",
    words: [
      {
        id: "b2-u19-w1", word: "Tariff", phonetic: "/ˈtærɪf/", syllables: "tar·iff",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "A tax or duty to be paid on a particular class of imports or exports", meaningAr: "تعرفة جمركية",
        synonyms: ["Duty", "Tax", "Levy"], antonyms: [],
        examples: ["The government imposed a tariff on foreign steel imports.", "High protective tariffs can trigger bilateral trade disputes.", "Eliminating customs tariffs stimulated regional trade flows."],
        imageQuery: "tariff shipping container port", category: "finance"
      },
      {
        id: "b2-u19-w2", word: "Embargo", phonetic: "/ɪmˈbɑːrɡoʊ/", syllables: "em·bar·go",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "An official ban on trade or other commercial activity with a particular country", meaningAr: "حظر تجاري",
        synonyms: ["Blockade", "Ban", "Prohibition"], antonyms: [],
        examples: ["The council instituted an arms embargo against the aggressor.", "An oil embargo caused global fuel prices to skyrocket.", "Diplomats worked tirelessly to lift the longstanding trade embargo."],
        imageQuery: "embargo border closed trade", category: "finance"
      },
      {
        id: "b2-u19-w3", word: "Deficit", phonetic: "/ˈdɛfɪsɪt/", syllables: "def·i·cit",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "The amount by which something, especially money, is too small", meaningAr: "عجز مالي / تجاري",
        synonyms: ["Shortfall", "Deficiency", "Loss"], antonyms: ["Surplus", "Excess"],
        examples: ["The nation struggles to shrink its trade deficit with Asia.", "Increased public spending widened the federal budget deficit.", "A chronic trade deficit can weaken national currency values."],
        imageQuery: "deficit economic chart finance", category: "finance"
      },
      {
        id: "b2-u19-w4", word: "Surplus", phonetic: "/ˈsɜːrpləs/", syllables: "sur·plus",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "An amount of something left over when requirements have been met", meaningAr: "فائض تجاري / مالي",
        synonyms: ["Excess", "Abundance", "Remainder"], antonyms: ["Deficit", "Shortage"],
        examples: ["Exporting manufactured goods produced a substantial trade surplus.", "The agricultural surplus was distributed to neighboring countries.", "The fiscal surplus was allocated to public education."],
        imageQuery: "surplus growth profit wealth", category: "finance"
      },
      {
        id: "b2-u19-w5", word: "Logistics", phonetic: "/ləˈdʒɪstɪks/", syllables: "lo·gis·tics",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "The detailed coordination of a complex operation involving many people, facilities, or supplies", meaningAr: "لوجستيات / إدارة الإمداد",
        synonyms: ["Organization", "Coordination", "Distribution"], antonyms: [],
        examples: ["Efficient shipping logistics reduce consumer retail costs.", "The logistics team tracked the shipment across three continents.", "Modern e-commerce relies heavily on automated logistics hubs."],
        imageQuery: "logistics cargo plane ship truck", category: "finance"
      },
      {
        id: "b2-u19-w6", word: "Wholesale", phonetic: "/ˈhoʊlseɪl/", syllables: "whole·sale",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "The business of selling of goods in large quantities and at low prices", meaningAr: "تجارة الجملة",
        synonyms: ["Bulk", "Mass"], antonyms: ["Retail"],
        examples: ["Retailers purchase merchandise at wholesale prices from factories.", "He started a successful wholesale food distribution business.", "Wholesale prices dropped after raw material costs decreased."],
        imageQuery: "wholesale warehouse boxes goods", category: "finance"
      },
      {
        id: "b2-u19-w7", word: "Monopoly", phonetic: "/məˈnɒpəli/", syllables: "mo·nop·o·ly",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "The exclusive possession or control of the supply of or trade in a commodity or service", meaningAr: "احتكار",
        synonyms: ["Dominance", "Control", "Corner"], antonyms: ["Competition"],
        examples: ["Antitrust laws prevent tech giants from forming a monopoly.", "The state-owned rail company previously held a total monopoly.", "Monopoly in telecommunications leads to exorbitant consumer prices."],
        imageQuery: "monopoly control chess king", category: "finance"
      },
      {
        id: "b2-u19-w8", word: "Consortium", phonetic: "/kənˈsɔːrtiəm/", syllables: "con·sor·ti·um",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "An association, typically of several companies, formed to undertake a joint project", meaningAr: "ائتلاف شركات / تحالف تجاري",
        synonyms: ["Syndicate", "Alliance", "Federation"], antonyms: [],
        examples: ["An international consortium won the high-speed rail contract.", "Leading automakers formed a consortium to develop green batteries.", "The banking consortium secured funding for the infrastructure project."],
        imageQuery: "consortium business meeting partnership", category: "finance"
      },
      {
        id: "b2-u19-w9", word: "Commodity", phonetic: "/kəˈmɒdɪti/", syllables: "com·mod·i·ty",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "A raw material or primary agricultural product that can be bought and sold", meaningAr: "سلعة أساسية / بضاعة",
        synonyms: ["Product", "Good", "Merchandise"], antonyms: [],
        examples: ["Crude oil, wheat, and gold are internationally traded commodities.", "Commodity price fluctuations directly impact developing economies.", "Time is the most precious commodity a human possesses."],
        imageQuery: "commodity wheat grain gold cargo", category: "finance"
      },
      {
        id: "b2-u19-w10", word: "Bilateral", phonetic: "/baɪˈlætərəl/", syllables: "bi·lat·er·al",
        partOfSpeech: "adjective", partOfSpeechAr: "صفة",
        meaningEn: "Having or relating to two sides; affecting both sides", meaningAr: "ثنائي الأطراف",
        synonyms: ["Two-sided", "Mutual", "Joint"], antonyms: ["Unilateral", "Multilateral"],
        examples: ["The two prime ministers signed a historic bilateral trade pact.", "Bilateral agreements encourage direct cross-border investments.", "Diplomats initiated bilateral consultations on maritime borders."],
        imageQuery: "bilateral flags treaty agreement", category: "finance"
      }
    ]
  },
  {
    id: "b2-u20",
    title: "Engineering & Construction",
    titleAr: "الهندسة والإنشاءات",
    category: "work",
    words: [
      {
        id: "b2-u20-w1", word: "Structural", phonetic: "/ˈstrʌktʃərəl/", syllables: "struc·tur·al",
        partOfSpeech: "adjective", partOfSpeechAr: "صفة",
        meaningEn: "Relating to the arrangement of and relations between the parts or elements of a complex whole", meaningAr: "هيكلي / إنشائي",
        synonyms: ["Architectural", "Constitutive", "Formative"], antonyms: [],
        examples: ["The engineer identified severe structural defects in the foundation.", "Reinforced concrete provides necessary structural integrity during earthquakes.", "Structural steel beams support the weight of the skyscraper."],
        imageQuery: "structural steel beams building", category: "work"
      },
      {
        id: "b2-u20-w2", word: "Excavation", phonetic: "/ˌɛkskəˈveɪʃən/", syllables: "ex·ca·va·tion",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "The action of excavating something, especially an archaeological site", meaningAr: "حفريات / تنقيب",
        synonyms: ["Digging", "Unearthing", "Hollowing"], antonyms: [],
        examples: ["Deep excavation was required before pouring the tower foundation.", "Archaeological excavation uncovered Roman mosaic floors.", "Heavy machinery operated during the tunnel excavation."],
        imageQuery: "excavation digger construction site", category: "work"
      },
      {
        id: "b2-u20-w3", word: "Reinforce", phonetic: "/ˌriːɪnˈfɔːrs/", syllables: "re·in·force",
        partOfSpeech: "verb", partOfSpeechAr: "فعل",
        meaningEn: "Strengthen or support, especially with additional personnel or material", meaningAr: "يعزز / يقوي",
        synonyms: ["Strengthen", "Fortify", "Bolster"], antonyms: ["Weaken", "Undermine"],
        examples: ["Builders reinforce concrete with steel rebar for tension strength.", "Additional pillars were installed to reinforce the bridge deck.", "Safety protocols were reinforced following the site audit."],
        imageQuery: "reinforce rebar concrete construction", category: "work"
      },
      {
        id: "b2-u20-w4", word: "Blueprint", phonetic: "/ˈbluːprɪnt/", syllables: "blue·print",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "A design plan or other technical drawing", meaningAr: "مخطط هندسي / رسم تفصيلي",
        synonyms: ["Plan", "Design", "Draft"], antonyms: [],
        examples: ["The chief architect examined the architectural blueprints thoroughly.", "The blueprint specified fire-resistant insulation for all walls.", "The government unveiled an ambitious blueprint for economic reform."],
        imageQuery: "blueprint architectural drawing plan", category: "work"
      },
      {
        id: "b2-u20-w5", word: "Tolerate", phonetic: "/ˈtɒləreɪt/", syllables: "tol·er·ate",
        partOfSpeech: "verb", partOfSpeechAr: "فعل",
        meaningEn: "To allow the existence or practice of; to withstand a condition", meaningAr: "يتحمل (ميكانيكياً أو معنوياً)",
        synonyms: ["Endure", "Withstand", "Bear"], antonyms: ["Prohibit", "Break"],
        examples: ["The bridge suspension is engineered to tolerate high-wind speeds.", "Special alloys tolerate extreme friction and intense heat.", "Safety authorities will not tolerate negligence on construction sites."],
        imageQuery: "tolerate metal heat strength test", category: "work"
      },
      {
        id: "b2-u20-w6", word: "Prototype", phonetic: "/ˈproʊtətaɪp/", syllables: "pro·to·type",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "A first, typical or preliminary model of something", meaningAr: "نموذج أولي / عينة تجريبية",
        synonyms: ["Model", "Archetype", "Mockup"], antonyms: [],
        examples: ["The automotive engineers built a functional hydrogen car prototype.", "Rapid 3D printing allows designers to test prototypes quickly.", "The drone prototype completed its inaugural test flight smoothly."],
        imageQuery: "prototype 3d model engineering", category: "work"
      },
      {
        id: "b2-u20-w7", word: "Maintenance", phonetic: "/ˈmeɪntənəns/", syllables: "main·te·nance",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "The process of preserving a condition or situation or the state of being preserved", meaningAr: "صيانة دورية",
        synonyms: ["Upkeep", "Servicing", "Preservation"], antonyms: ["Neglect"],
        examples: ["Routine aircraft maintenance prevents catastrophic mechanical failures.", "The highway will close temporarily for resurfacing and maintenance.", "Proper maintenance extends the operational lifespan of heavy machinery."],
        imageQuery: "maintenance tools mechanic engineer", category: "work"
      },
      {
        id: "b2-u20-w8", word: "Pneumatic", phonetic: "/njuːˈmætɪk/", syllables: "pneu·mat·ic",
        partOfSpeech: "adjective", partOfSpeechAr: "صفة",
        meaningEn: "Containing or operated by air or gas under pressure", meaningAr: "هوائي (مضغوط بالهواء)",
        synonyms: ["Air-powered", "Pressurized"], antonyms: [],
        examples: ["Construction workers broke through the pavement using a pneumatic drill.", "Pneumatic suspension provides a smooth ride in luxury buses.", "Factory automation systems make extensive use of pneumatic cylinders."],
        imageQuery: "pneumatic tools pressure air", category: "work"
      },
      {
        id: "b2-u20-w9", word: "Compliance", phonetic: "/kəmˈplaɪəns/", syllables: "com·pli·ance",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "The action or fact of complying with a wish or command", meaningAr: "امتثال / التزام بالمعايير",
        synonyms: ["Conformity", "Adherence", "Observance"], antonyms: ["Defiance", "Violation"],
        examples: ["All structural materials must show compliance with building codes.", "Safety officers inspect work zones to guarantee regulatory compliance.", "Non-compliance with environmental standards results in hefty corporate fines."],
        imageQuery: "compliance checklist safety check", category: "work"
      },
      {
        id: "b2-u20-w10", word: "Corrosion", phonetic: "/kəˈroʊʒən/", syllables: "cor·ro·sion",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "The process of corroding metal, stone, or other materials", meaningAr: "تآكل / صدأ",
        synonyms: ["Rust", "Decay", "Oxidation"], antonyms: [],
        examples: ["Special galvanizing coatings protect marine pipelines against salt corrosion.", "Inspection divers looked for steel corrosion along the offshore platform.", "Chemical corrosion weakened the internal plumbing fixtures over time."],
        imageQuery: "corrosion rust metal pipe", category: "work"
      }
    ]
  },
  {
    id: "b2-u21",
    title: "History & Civilization",
    titleAr: "التاريخ والحضارة",
    category: "society",
    words: [
      {
        id: "b2-u21-w1", word: "Artifact", phonetic: "/ˈɑːrtɪfækt/", syllables: "ar·ti·fact",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "An object made by a human being, typically one of cultural interest", meaningAr: "قطعة أثرية",
        synonyms: ["Relic", "Antiquity", "Handiwork"], antonyms: [],
        examples: ["Museum conservators restored an ancient Mesopotamian clay artifact.", "Illegal excavation and looting of historic artifacts is a criminal offense.", "The bronze artifact dates back to the third century BCE."],
        imageQuery: "ancient artifact pottery museum", category: "society"
      },
      {
        id: "b2-u21-w2", word: "Dynasty", phonetic: "/ˈdɪnəsti/", syllables: "dy·nas·ty",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "A line of hereditary rulers of a country", meaningAr: "سلالة حاكمة",
        synonyms: ["Lineage", "Bloodline", "House"], antonyms: [],
        examples: ["The Ming Dynasty presided over a golden age of porcelain art.", "The royal dynasty ruled the Mediterranean empire for three centuries.", "Historians examine internal conflicts that precipitated the dynasty's collapse."],
        imageQuery: "dynasty palace royal crown", category: "society"
      },
      {
        id: "b2-u21-w3", word: "Chronological", phonetic: "/ˌkrɒnəˈlɒdʒɪkəl/", syllables: "chron·o·log·i·cal",
        partOfSpeech: "adjective", partOfSpeechAr: "صفة",
        meaningEn: "Arranged in the order of time occurrence", meaningAr: "مرتّب زمنياً",
        synonyms: ["Sequential", "Ordered", "Consecutive"], antonyms: ["Random", "Disordered"],
        examples: ["The documentary presents historic events in strict chronological order.", "Students created a chronological timeline of ancient Egyptian eras.", "The biography follows the inventor's life chronologically."],
        imageQuery: "chronological timeline clock history", category: "society"
      },
      {
        id: "b2-u21-w4", word: "Predecessor", phonetic: "/ˈpriːdɪsɛsər/", syllables: "pre·de·ces·sor",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "A person who held a job or office before the current holder", meaningAr: "سَلَف / السابق في المنصب",
        synonyms: ["Forebear", "Precursor", "Ancestor"], antonyms: ["Successor"],
        examples: ["The new president reversed several foreign policies of his predecessor.", "The modern supersonic jet is twice as fuel-efficient as its predecessor.", "He honored the work established by his scholarly predecessors."],
        imageQuery: "predecessor past history throne", category: "society"
      },
      {
        id: "b2-u21-w5", word: "Successor", phonetic: "/səkˈsɛsər/", syllables: "suc·ces·sor",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "A person or thing that succeeds another", meaningAr: "خَلَف / التالي",
        synonyms: ["Heir", "Descendant", "Replacement"], antonyms: ["Predecessor"],
        examples: ["The monarch designated his eldest daughter as his legitimate successor.", "Who will be chosen as the successor to the retiring chief executive?", "The new computer system is a worthy successor to the previous version."],
        imageQuery: "successor crown heir king", category: "society"
      },
      {
        id: "b2-u21-w6", word: "Heritage", phonetic: "/ˈhɛrɪtɪdʒ/", syllables: "her·i·tage",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "Valued objects and qualities such as historic buildings that have been passed down", meaningAr: "موروث ثقافي / تراث",
        synonyms: ["Tradition", "Inheritance", "Legacy"], antonyms: [],
        examples: ["UNESCO designated the ancient citadel as a World Heritage site.", "Local festivals preserve the rich musical heritage of the indigenous people.", "Younger generations are encouraged to take pride in their cultural heritage."],
        imageQuery: "world heritage monument ruins", category: "society"
      },
      {
        id: "b2-u21-w7", word: "Conquest", phonetic: "/ˈkɒŋkwɛst/", syllables: "con·quest",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "The subjugation and assumption of control of a place or people by military force", meaningAr: "غزو / فتح / احتلال",
        synonyms: ["Invasion", "Subjugation", "Triumph"], antonyms: ["Surrender", "Retreat"],
        examples: ["The Norman conquest of England fundamentally transformed the English language.", "Alexander the Great's conquest stretched from Greece to the borders of India.", "Historical texts document the military campaigns and subsequent conquests."],
        imageQuery: "conquest battle history knight", category: "society"
      },
      {
        id: "b2-u21-w8", word: "Excavate", phonetic: "/ˈɛkskəveɪt/", syllables: "ex·ca·vate",
        partOfSpeech: "verb", partOfSpeechAr: "فعل",
        meaningEn: "Make a hole or channel by digging", meaningAr: "ينقب / يستخرج من باطن الأرض",
        synonyms: ["Dig up", "Unearth", "Disinter"], antonyms: ["Bury"],
        examples: ["Archaeologists excavate buried ruins in search of ancient inscriptions.", "Teams spent five seasons excavating the submerged Roman port.", "Delicate brushes are used to gently excavate prehistoric bone fragments."],
        imageQuery: "excavate archaeologist brush artifact", category: "society"
      },
      {
        id: "b2-u21-w9", word: "Primitive", phonetic: "/ˈprɪmɪtɪv/", syllables: "prim·i·tive",
        partOfSpeech: "adjective", partOfSpeechAr: "صفة",
        meaningEn: "Relating to the character of an early stage in the evolutionary development", meaningAr: "بدائي",
        synonyms: ["Ancient", "Crude", "Rudimentary"], antonyms: ["Advanced", "Modern"],
        examples: ["Early hominids fashioned primitive hunting tools out of flint stone.", "The remote islanders lived in primitive shelters woven from palm leaves.", "Modern antibiotics have replaced primitive herbal wound dressings."],
        imageQuery: "primitive stone age tools fire", category: "society"
      },
      {
        id: "b2-u21-w10", word: "Colony", phonetic: "/ˈkɒləni/", syllables: "col·o·ny",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "A country or area under the full or partial political control of another", meaningAr: "مستعمرة",
        synonyms: ["Settlement", "Territory", "Dependency"], antonyms: [],
        examples: ["The nation fought a revolutionary war to break free as a British colony.", "European powers founded commercial colonies across Southeast Asia.", "Historians analyze the profound linguistic imprint left on former colonies."],
        imageQuery: "colony old map sailing ship", category: "society"
      }
    ]
  },
  {
    id: "b2-u22",
    title: "Leadership & Strategic Management",
    titleAr: "القيادة والإدارة الاستراتيجية",
    category: "work",
    words: [
      {
        id: "b2-u22-w1", word: "Visionary", phonetic: "/ˈvɪʒənɛri/", syllables: "vi·sion·ar·y",
        partOfSpeech: "adjective", partOfSpeechAr: "صفة",
        meaningEn: "Thinking about or planning the future with imagination or wisdom", meaningAr: "صاحب رؤية استشرافية / ملهم",
        synonyms: ["Far-sighted", "Innovative", "Inspiring"], antonyms: ["Short-sighted"],
        examples: ["Steve Jobs was widely regarded as a visionary corporate leader.", "Visionary policies laid the groundwork for renewable energy dominance.", "She presented a visionary blueprint for educational reform."],
        imageQuery: "visionary leader mountain sunrise", category: "work"
      },
      {
        id: "b2-u22-w2", word: "Delegate", phonetic: "/ˈdɛlɪɡeɪt/", syllables: "del·e·gate",
        partOfSpeech: "verb", partOfSpeechAr: "فعل",
        meaningEn: "Entrust a task or responsibility to another person", meaningAr: "يفوض صلاحية / يوكل مهام",
        synonyms: ["Assign", "Entrust", "Allocate"], antonyms: ["Retain", "Monopolize"],
        examples: ["A capable executive knows how to delegate routine tasks effectively.", "Delegating operational decisions empowered junior supervisors.", "Failure to delegate leads directly to managerial burnout."],
        imageQuery: "delegate teamwork office task", category: "work"
      },
      {
        id: "b2-u22-w3", word: "Benchmark", phonetic: "/ˈbɛntʃmɑːrk/", syllables: "bench·mark",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "A standard or point of reference against which things may be compared", meaningAr: "معيار قياس / نقطة مرجعية",
        synonyms: ["Standard", "Criterion", "Yardstick"], antonyms: [],
        examples: ["The firm's customer service rating is the gold benchmark in banking.", "We benchmark our quarterly performance against industry leaders.", "The Paris climate targets set a global sustainability benchmark."],
        imageQuery: "benchmark metric graph standard", category: "work"
      },
      {
        id: "b2-u22-w4", word: "Incentive", phonetic: "/ɪnˈsɛntɪv/", syllables: "in·cen·tive",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "A thing that motivates or encourages one to do something", meaningAr: "حافز / مكافأة تشجيعية",
        synonyms: ["Inducement", "Motivation", "Stimulus"], antonyms: ["Deterrent", "Disincentive"],
        examples: ["The company introduced generous performance bonuses as an incentive.", "Tax incentives motivate multinational companies to open local branches.", "Recognition and career advancement act as powerful intrinsic incentives."],
        imageQuery: "incentive bonus award gold medal", category: "work"
      },
      {
        id: "b2-u22-w5", word: "Consensus", phonetic: "/kənˈsɛnsəs/", syllables: "con·sen·sus",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "A general agreement among members of a group", meaningAr: "إجماع / توافق في الآراء",
        synonyms: ["Agreement", "Harmony", "Concord"], antonyms: ["Disagreement", "Discord"],
        examples: ["The committee reached a unanimous consensus after hours of debate.", "Scientific consensus confirms that human activities drive global warming.", "Building consensus across diverse departments takes skilled diplomacy."],
        imageQuery: "consensus handshake hands together", category: "work"
      },
      {
        id: "b2-u22-w6", word: "Implement", phonetic: "/ˈɪmplɪmɛnt/", syllables: "im·ple·ment",
        partOfSpeech: "verb", partOfSpeechAr: "فعل",
        meaningEn: "Put a decision, plan, or agreement into effect", meaningAr: "ينفّذ / يطبق",
        synonyms: ["Execute", "Enact", "Enforce"], antonyms: ["Cancel", "Suspend"],
        examples: ["The software team worked over the weekend to implement the security patch.", "Schools will implement the revised curriculum starting this September.", "Having a great plan is useless unless you can implement it flawlessly."],
        imageQuery: "implement execute project gears", category: "work"
      },
      {
        id: "b2-u22-w7", word: "Restructure", phonetic: "/riːˈstrʌktʃər/", syllables: "re·struc·ture",
        partOfSpeech: "verb", partOfSpeechAr: "فعل",
        meaningEn: "Organize differently, typically in order to make more efficient", meaningAr: "يعيد هيكلة",
        synonyms: ["Reorganize", "Overhaul", "Realign"], antonyms: [],
        examples: ["The board voted to restructure the marketing department to cut overhead.", "The insolvent airline had to restructure its debts with creditors.", "Restructuring corporate operations saved the firm from liquidation."],
        imageQuery: "restructure puzzle rebuild organization", category: "work"
      },
      {
        id: "b2-u23-w8", word: "Proactive", phonetic: "/proʊˈæktɪv/", syllables: "pro·ac·tive",
        partOfSpeech: "adjective", partOfSpeechAr: "صفة",
        meaningEn: "Creating or controlling a situation rather than just responding to it", meaningAr: "استباقي / مبادر",
        synonyms: ["Enterprising", "Forward-looking", "Dynamic"], antonyms: ["Reactive", "Passive"],
        examples: ["A proactive manager identifies supply bottlenecks before they disrupt work.", "Taking a proactive approach to mental health prevents employee burnout.", "The maintenance crew performed proactive repairs before the storm."],
        imageQuery: "proactive forward step leadership", category: "work"
      },
      {
        id: "b2-u22-w9", word: "Synergy", phonetic: "/ˈsɪnərdʒi/", syllables: "syn·er·gy",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "The interaction or cooperation of two or more organizations producing combined effect greater than the sum of separate parts", meaningAr: "تآزر / تكامل قوى",
        synonyms: ["Collaboration", "Teamwork", "Symbiosis"], antonyms: ["Antagonism"],
        examples: ["The merger created powerful corporate synergy across R&D teams.", "Cross-functional teams achieve synergy through varied skill sets.", "The synergy between software and hardware yielded unrivaled speed."],
        imageQuery: "synergy teamwork puzzle connect", category: "work"
      },
      {
        id: "b2-u22-w10", word: "Authorize", phonetic: "/ˈɔːθəraɪz/", syllables: "au·thor·ize",
        partOfSpeech: "verb", partOfSpeechAr: "فعل",
        meaningEn: "Give official permission for or approval to an undertaking or agent", meaningAr: "يفوّض رسمياً / يأذن بـ",
        synonyms: ["Sanction", "Permit", "Empower"], antonyms: ["Forbid", "Prohibit"],
        examples: ["Only the chief financial officer can authorize major corporate expenditures.", "Congress must authorize any foreign military deployment.", "The hospital director authorized emergency funding for pediatric ventilators."],
        imageQuery: "authorize signature stamp approved", category: "work"
      }
    ]
  },
  {
    id: "b2-u23",
    title: "Cultural Diversity & Globalization",
    titleAr: "التنوع الثقافي والعولمة",
    category: "society",
    words: [
      {
        id: "b2-u23-w1", word: "Assimilation", phonetic: "/əˌsɪmɪˈleɪʃən/", syllables: "as·sim·i·la·tion",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "The process of absorbing and integrating people into a wider society or culture", meaningAr: "اندماج / انصهار ثقافي",
        synonyms: ["Integration", "Absorption", "Acculturation"], antonyms: ["Segregation", "Isolation"],
        examples: ["Immigrants often navigate the delicate balance between assimilation and heritage.", "Cultural assimilation can happen naturally over multiple generations.", "Linguistic assimilation occurred as regional dialects merged into a national tongue."],
        imageQuery: "assimilation multicultural unity hands", category: "society"
      },
      {
        id: "b2-u23-w2", word: "Pluralism", phonetic: "/ˈplʊərəˌlɪzəm/", syllables: "plu·ral·ism",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "A condition or system in which two or more states or groups coexist", meaningAr: "تعددية ثقافية / سياسية",
        synonyms: ["Diversity", "Multiculturalism", "Coexistence"], antonyms: ["Monism", "Homogeneity"],
        examples: ["Democratic societies champion cultural, religious, and political pluralism.", "The university's vibrant pluralism enriches classroom discussions.", "Pluralism ensures that minority viewpoints are represented in civil discourse."],
        imageQuery: "pluralism diverse community flags", category: "society"
      },
      {
        id: "b2-u23-w3", word: "Stereotype", phonetic: "/ˈstɛriətaɪp/", syllables: "ste·re·o·type",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "A widely held but fixed and oversimplified image or idea of a type of person", meaningAr: "صورة نمطية مسبقة",
        synonyms: ["Cliché", "Preconception", "Formula"], antonyms: [],
        examples: ["Films should challenge harmful racial and gender stereotypes.", "He proved that national stereotypes rarely reflect individual character.", "Educating children about different cultures helps dissolve damaging stereotypes."],
        imageQuery: "stereotype diversity breaking barriers", category: "society"
      },
      {
        id: "b2-u23-w4", word: "Homogeneous", phonetic: "/ˌhoʊməˈdʒiːniəs/", syllables: "ho·mo·ge·ne·ous",
        partOfSpeech: "adjective", partOfSpeechAr: "صفة",
        meaningEn: "Of the same kind; alike in character or nature", meaningAr: "متجانس / متشابه التركيب",
        synonyms: ["Uniform", "Consistent", "Identical"], antonyms: ["Heterogeneous", "Diverse"],
        examples: ["Global migration has transformed previously homogeneous towns into multicultural centers.", "The student body is far from homogeneous, coming from forty nations.", "A homogeneous group may fall victim to dangerous groupthink."],
        imageQuery: "homogeneous pattern uniform shapes", category: "society"
      },
      {
        id: "b2-u23-w5", word: "Prejudice", phonetic: "/ˈprɛdʒʊdɪs/", syllables: "prej·u·dice",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "Preconceived opinion that is not based on reason or actual experience", meaningAr: "حكم مسبق / تعصب",
        synonyms: ["Bigotry", "Bias", "Intolerance"], antonyms: ["Tolerance", "Acceptance"],
        examples: ["Ignorance and fear are often root causes of racial prejudice.", "The civil rights act outlawed employment discrimination based on prejudice.", "She overcame deep-seated institutional prejudice to become a renowned surgeon."],
        imageQuery: "prejudice justice tolerance balance", category: "society"
      },
      {
        id: "b2-u23-w6", word: "Cosmopolitan", phonetic: "/ˌkɒzməˈpɒlɪtən/", syllables: "cos·mo·pol·i·tan",
        partOfSpeech: "adjective", partOfSpeechAr: "صفة",
        meaningEn: "Familiar with and at ease in many different countries and cultures", meaningAr: "عالمي التوجه / منفتح عالمياً",
        synonyms: ["Global", "International", "Cultured"], antonyms: ["Provincial", "Insular"],
        examples: ["London is celebrated for its cosmopolitan culinary and artistic scene.", "Having lived in five continents, she possesses a cosmopolitan worldview.", "The port city evolved into a cosmopolitan trade hub welcoming merchants worldwide."],
        imageQuery: "cosmopolitan global city diverse crowd", category: "society"
      },
      {
        id: "b2-u23-w7", word: "Custom", phonetic: "/ˈkʌstəm/", syllables: "cus·tom",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "A widely accepted way of behaving or doing something that is specific to a society", meaningAr: "عُرف / عادة اجتماعية",
        synonyms: ["Tradition", "Ritual", "Convention"], antonyms: [],
        examples: ["Removing shoes before entering a home is a customary practice in Japan.", "Travelers should respect the local customs and dress codes.", "Many modern holiday rituals originated from ancient harvest customs."],
        imageQuery: "custom traditional ceremony culture", category: "society"
      },
      {
        id: "b2-u23-w8", word: "Dialect", phonetic: "/ˈdaɪəlɛkt/", syllables: "di·a·lect",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "A particular form of a language that is peculiar to a specific region or social group", meaningAr: "لهجة محلية",
        synonyms: ["Vernacular", "Patois", "Idiom"], antonyms: [],
        examples: ["Linguists recorded rare regional dialects spoken in the mountain valley.", "Although both speak Arabic, their distinct dialects require mutual adjustment.", "Literature written in local dialects preserves oral folk traditions."],
        imageQuery: "dialect speech language talk", category: "society"
      },
      {
        id: "b2-u23-w9", word: "Indigenous", phonetic: "/ɪnˈdɪdʒɪnəs/", syllables: "in·dig·e·nous",
        partOfSpeech: "adjective", partOfSpeechAr: "صفة",
        meaningEn: "Originating or occurring naturally in a particular place; native", meaningAr: "أصلي / سكان أصليون",
        synonyms: ["Native", "Aboriginal", "Endemic"], antonyms: ["Non-native", "Foreign"],
        examples: ["The rights of indigenous peoples are protected under UN declarations.", "The eucalyptus tree is indigenous to the Australian continent.", "Indigenous wisdom holds invaluable knowledge on sustainable agriculture."],
        imageQuery: "indigenous culture art nature", category: "society"
      },
      {
        id: "b2-u23-w10", word: "Intercultural", phonetic: "/ˌɪntərˈkʌltʃərəl/", syllables: "in·ter·cul·tur·al",
        partOfSpeech: "adjective", partOfSpeechAr: "صفة",
        meaningEn: "Taking place between or involving different cultures", meaningAr: "عابر للثقافات / بين الثقافات",
        synonyms: ["Cross-cultural", "Transcultural"], antonyms: [],
        examples: ["The student exchange program fosters meaningful intercultural dialogue.", "Global business executives need intercultural competence to negotiate deals.", "The intercultural festival showcased folklore, music, and food from twenty countries."],
        imageQuery: "intercultural festival dance music", category: "society"
      }
    ]
  }
];

// Add C1 Units
const c1Units = [
  {
    id: "c1-u3",
    title: "Advanced Economics & Market Dynamics",
    titleAr: "الاقتصاد المتقدم وديناميكيات السوق",
    category: "finance",
    words: [
      {
        id: "c1-u3-w1", word: "Fiscal", phonetic: "/ˈfɪskəl/", syllables: "fis·cal",
        partOfSpeech: "adjective", partOfSpeechAr: "صفة",
        meaningEn: "Relating to government revenue, especially taxes", meaningAr: "مالي / ضريبي حكومي",
        synonyms: ["Monetary", "Financial", "Budgetary"], antonyms: [],
        examples: ["Governments enact counter-cyclical fiscal policy during recessions.", "The ministry announced stringent fiscal consolidation measures.", "Fiscal deficit targets were met through improved tax collection."],
        imageQuery: "fiscal budget government finance", category: "finance"
      },
      {
        id: "c1-u3-w2", word: "Liquidity", phonetic: "/lɪˈkwɪdɪti/", syllables: "li·quid·i·ty",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "The availability of liquid assets to a market or company", meaningAr: "سيولة نقدية",
        synonyms: ["Cash flow", "Solvency", "Fluidity"], antonyms: ["Illiquidity"],
        examples: ["Central banks injected liquidity to stabilize the interbank lending market.", "The hedge fund faced sudden insolvency due to acute liquidity shortages.", "Real estate investments offer long-term gains but low immediate liquidity."],
        imageQuery: "liquidity cash gold coins bank", category: "finance"
      },
      {
        id: "c1-u3-w3", word: "Derivatives", phonetic: "/dɪˈrɪvətɪvz/", syllables: "de·riv·a·tives",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "Financial contracts whose value depends on underlying assets", meaningAr: "مشتقات مالية",
        synonyms: ["Futures", "Options", "Swaps"], antonyms: [],
        examples: ["Institutions use financial derivatives to hedge against exchange rate volatility.", "Excessive speculation in credit derivatives fueled the 2008 banking crisis.", "The commodities exchange trades oil and wheat futures derivatives."],
        imageQuery: "derivatives stock trading market charts", category: "finance"
      },
      {
        id: "c1-u3-w4", word: "Depreciation", phonetic: "/dɪˌpriːʃiˈeɪʃən/", syllables: "de·pre·ci·a·tion",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "A reduction in the value of an asset with the passage of time", meaningAr: "انخفاض القيمة / استهلاك الأصول",
        synonyms: ["Devaluation", "Decline", "Depletion"], antonyms: ["Appreciation"],
        examples: ["Accelerated currency depreciation pushed import costs to unprecedented highs.", "Accountants calculate equipment depreciation for annual corporate tax deductions.", "Vehicles experience rapid capital depreciation during their initial three years."],
        imageQuery: "depreciation graph downward arrow finance", category: "finance"
      },
      {
        id: "c1-u3-w5", word: "Insolvent", phonetic: "/ɪnˈsɒlvənt/", syllables: "in·sol·vent",
        partOfSpeech: "adjective", partOfSpeechAr: "صفة",
        meaningEn: "Unable to pay debts owed", meaningAr: "معسر / مفلس",
        synonyms: ["Bankrupt", "Ruined", "Broke"], antonyms: ["Solvent", "Flourishing"],
        examples: ["The commercial builder was declared insolvent after loan defaults mounted.", "Creditors petitioned the high court to liquidate the insolvent conglomerate.", "Swift restructuring prevented the national carrier from becoming insolvent."],
        imageQuery: "insolvent bankruptcy empty wallet padlock", category: "finance"
      },
      {
        id: "c1-u3-w6", word: "Amortization", phonetic: "/əˌmɔːrtɪˈzeɪʃən/", syllables: "a·mor·ti·za·tion",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "The action or process of gradually writing off initial cost or debt", meaningAr: "إهلاك الأصول / سداد الدين بالتقسيط",
        synonyms: ["Repayment", "Depreciation", "Write-off"], antonyms: [],
        examples: ["The bank provided a 25-year mortgage amortization schedule.", "Intangible assets such as patents undergo annual amortization.", "Early principal prepayments reduce the overall debt amortization period."],
        imageQuery: "amortization schedule calculator finance", category: "finance"
      },
      {
        id: "c1-u3-w7", word: "Arbitrage", phonetic: "/ˈɑːrbɪtrɑːʒ/", syllables: "ar·bi·trage",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "Simultaneous purchase and sale of an asset to profit from price differences", meaningAr: "مراجحة / مضاربة الفروق السعرية",
        synonyms: ["Price exploitation", "Trading"], antonyms: [],
        examples: ["High-frequency algorithms execute currency arbitrage across world bourses in milliseconds.", "Commodity arbitrage balances regional disparities in natural gas prices.", "Pure statistical arbitrage strategies rely on sophisticated quantitative modeling."],
        imageQuery: "arbitrage stock exchange trade profit", category: "finance"
      },
      {
        id: "c1-u3-w8", word: "Microeconomics", phonetic: "/ˌmaɪkroʊˌiːkəˈnɒmɪks/", syllables: "mi·cro·e·co·nom·ics",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "The part of economics concerned with single factors and the effects of individual decisions", meaningAr: "اقتصاد جزئي",
        synonyms: ["Price theory"], antonyms: ["Macroeconomics"],
        examples: ["Microeconomics examines how consumer preferences dictate commodity supply and demand.", "Firms utilize microeconomics principles to optimize product pricing strategies.", "The course covers market equilibrium, elasticity, and consumer choice theory."],
        imageQuery: "microeconomics supply demand curve chart", category: "finance"
      },
      {
        id: "c1-u3-w9", word: "Macroeconomics", phonetic: "/ˌmækroʊˌiːkəˈnɒmɪks/", syllables: "mac·ro·e·co·nom·ics",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "The branch of economics concerned with large-scale or general economic factors", meaningAr: "اقتصاد كلي",
        synonyms: ["Aggregate economics"], antonyms: ["Microeconomics"],
        examples: ["Macroeconomics investigates national unemployment rates, inflation, and GDP growth.", "Central bankers formulate interest rate decisions based on macroeconomic data.", "The lecture addressed the macroeconomic consequences of global tariffs."],
        imageQuery: "macroeconomics world globe growth chart", category: "finance"
      },
      {
        id: "c1-u3-w10", word: "Volatility", phonetic: "/ˌvɒləˈtɪlɪti/", syllables: "vol·a·til·i·ty",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "Liability to change rapidly and unpredictably, especially for the worse", meaningAr: "تقلب سعري حاد",
        synonyms: ["Instability", "Turbulence", "Unpredictability"], antonyms: ["Stability", "Calm"],
        examples: ["Geopolitical tensions triggered unprecedented volatility across crude oil futures.", "Investors purchase gold as a safe-haven asset during times of market volatility.", "Implied volatility metrics jumped preceding the central bank announcement."],
        imageQuery: "volatility stock market wave spike", category: "finance"
      }
    ]
  },
  {
    id: "c1-u4",
    title: "Philosophy & Critical Reasoning",
    titleAr: "الفلسفة والتفكير النقدي",
    category: "education",
    words: [
      {
        id: "c1-u4-w1", word: "Epistemology", phonetic: "/ɪˌpɪstɪˈmɒlədʒi/", syllables: "e·pis·te·mol·o·gy",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "The theory of knowledge, especially with regard to its methods and validation", meaningAr: "نظرية المعرفة / الإبستمولوجيا",
        synonyms: ["Theory of knowledge"], antonyms: [],
        examples: ["Epistemology probes the fundamental difference between justified belief and opinion.", "Descartes made foundational contributions to modern philosophical epistemology.", "The seminar debated empiricist and rationalist branches of epistemology."],
        imageQuery: "epistemology book light thinking brain", category: "education"
      },
      {
        id: "c1-u4-w2", word: "Fallacy", phonetic: "/ˈfæləsi/", syllables: "fal·la·cy",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "A mistaken belief, especially one based on unsound argument", meaningAr: "مغالطة منطقية",
        synonyms: ["Delusion", "Misconception", "Sophistry"], antonyms: ["Truth", "Fact"],
        examples: ["Attacking your opponent personally is a classic ad hominem fallacy.", "The assumption that correlation implies causation is a common statistical fallacy.", "Critical thinking courses train students to detect subtle logical fallacies."],
        imageQuery: "fallacy logic puzzle broken bridge", category: "education"
      },
      {
        id: "c1-u4-w3", word: "Existential", phonetic: "/ˌɛɡzɪˈstɛnʃəl/", syllables: "ex·is·ten·tial",
        partOfSpeech: "adjective", partOfSpeechAr: "صفة",
        meaningEn: "Relating to human existence or the meaning and purpose of life", meaningAr: "وجودي",
        synonyms: ["Experiential", "Empirical", "Vital"], antonyms: [],
        examples: ["Climate destabilization poses an existential threat to humanity's survival.", "Sartre and Camus explored the depths of existential philosophy.", "The protagonist endured a profound existential crisis regarding his life choices."],
        imageQuery: "existential silhouette stars cosmos", category: "education"
      },
      {
        id: "c1-u4-w4", word: "Paradox", phonetic: "/ˈpærədɒks/", syllables: "par·a·dox",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "A seemingly absurd or self-contradictory statement that may prove to be true", meaningAr: "مفارقة / تناقض ظاهري",
        synonyms: ["Contradiction", "Enigma", "Anomaly"], antonyms: ["Certainty"],
        examples: ["The paradox of thrift shows that saving more can reduce aggregate economic output.", "It is a curious paradox that drinking warm tea cools the human body in heat.", "Zeno formulated famous motion paradoxes that challenged Greek mathematicians."],
        imageQuery: "paradox optical illusion stairs", category: "education"
      },
      {
        id: "c1-u4-w5", word: "Pragmatic", phonetic: "/præɡˈmætɪk/", syllables: "prag·mat·ic",
        partOfSpeech: "adjective", partOfSpeechAr: "صفة",
        meaningEn: "Dealing with things sensibly and realistically based on practical conditions", meaningAr: "عملي / براغماتي",
        synonyms: ["Practical", "Utilitarian", "Realistic"], antonyms: ["Idealistic", "Impractical"],
        examples: ["She adopted a pragmatic compromise that allowed negotiations to proceed.", "Pragmatic political governance yields better results than rigid ideological dogmatism.", "We need pragmatic, actionable solutions rather than theoretical pontification."],
        imageQuery: "pragmatic compass path direction", category: "education"
      },
      {
        id: "c1-u4-w6", word: "Dialectic", phonetic: "/ˌdaɪəˈlɛktɪk/", syllables: "di·a·lec·tic",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "The art of investigating or discussing the truth of opinions through thesis and antithesis", meaningAr: "ديالكتيك / جدلية فكرية",
        synonyms: ["Argumentation", "Disputation", "Dialogue"], antonyms: [],
        examples: ["Hegel proposed that historical progress stems from a thesis-antithesis dialectic.", "Socrates engaged youth in philosophical dialectic to illuminate fundamental ethics.", "The dialectic between personal freedom and state security continues unabated."],
        imageQuery: "dialectic debate two minds discussion", category: "education"
      },
      {
        id: "c1-u4-w7", word: "Empirical", phonetic: "/ɪmˈpɪrɪkəl/", syllables: "em·pir·i·cal",
        partOfSpeech: "adjective", partOfSpeechAr: "صفة",
        meaningEn: "Based on, concerned with, or verifiable by observation or experience rather than pure logic", meaningAr: "تجريبي / مستند إلى أدلة حسية",
        synonyms: ["Observed", "Factual", "Verifiable"], antonyms: ["Theoretical", "Hypothetical"],
        examples: ["The researcher presented robust empirical evidence confirming the drug's efficacy.", "Science requires that theoretical conjectures be tested against empirical measurements.", "His assertions lacked any substantiated empirical backing."],
        imageQuery: "empirical laboratory experiment microscope", category: "education"
      },
      {
        id: "c1-u4-w8", word: "Dogma", phonetic: "/ˈdɒɡmə/", syllables: "dog·ma",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "A principle or set of principles laid down by an authority as incontrovertibly true", meaningAr: "عقيدة جامدة / مذهب غير قابل للنقاش",
        synonyms: ["Doctrine", "Creed", "Tenet"], antonyms: ["Open-mindedness"],
        examples: ["Free thinkers refuse to accept traditional political dogma without question.", "Scientific discovery thrives when dogma is challenged by verifiable facts.", "He urged researchers not to let institutional dogma stifle revolutionary ideas."],
        imageQuery: "dogma ancient book stone law", category: "education"
      },
      {
        id: "c1-u4-w9", word: "Cognizant", phonetic: "/ˈkɒɡnɪzənt/", syllables: "cog·ni·zant",
        partOfSpeech: "adjective", partOfSpeechAr: "صفة",
        meaningEn: "Having knowledge or being aware of", meaningAr: "مدرك لـ / على علم تام بـ",
        synonyms: ["Aware", "Mindful", "Conscious"], antonyms: ["Unaware", "Ignorant"],
        examples: ["Statesmen must remain cognizant of the geopolitical repercussions of sanctions.", "She made the career change fully cognizant of the substantial financial risks.", "Doctors must be cognizant of adverse drug interactions."],
        imageQuery: "cognizant telescope awareness observation", category: "education"
      },
      {
        id: "c1-u4-w10", word: "Postulate", phonetic: "/ˈpɒstjʊleɪt/", syllables: "pos·tu·late",
        partOfSpeech: "verb", partOfSpeechAr: "فعل",
        meaningEn: "Suggest or assume the existence, fact, or truth of something as a basis for reasoning", meaningAr: "يفترض كمسلمة أولية",
        synonyms: ["Hypothesize", "Premise", "Posit"], antonyms: [],
        examples: ["Physicists postulate the existence of dark matter to explain galaxy rotation speeds.", "The economic model postulates that consumers always act rationally to maximize utility.", "Ancient mathematicians postulated axioms from which complex theorems unfolded."],
        imageQuery: "postulate chalkboard math theory", category: "education"
      }
    ]
  },
  {
    id: "c1-u5",
    title: "Diplomacy & Geopolitics",
    titleAr: "الدبلوماسية والجيوسياسة",
    category: "politics",
    words: [
      {
        id: "c1-u5-w1", word: "Sovereignty", phonetic: "/ˈsɒvrənti/", syllables: "sov·er·eign·ty",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "The authority of a state to govern itself or another state", meaningAr: "سيادة وطنية",
        synonyms: ["Autonomy", "Independence", "Self-governance"], antonyms: ["Subjugation", "Dependency"],
        examples: ["Violating national territorial sovereignty constitutes a grave breach of international law.", "Small states fiercely defend their sovereign decision-making power in trade blocs.", "Maritime disputes challenge the sovereign jurisdiction over coastal waters."],
        imageQuery: "sovereignty flag parliament constitution", category: "politics"
      },
      {
        id: "c1-u5-w2", word: "Hegemony", phonetic: "/hɪˈɡɛməni/", syllables: "he·gem·o·ny",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "Leadership or dominance, especially by one state or social group over others", meaningAr: "هيمنة / سطوة إقليمية",
        synonyms: ["Dominance", "Supremacy", "Ascendancy"], antonyms: ["Subordination"],
        examples: ["Superpowers contest naval hegemony across strategic Pacific shipping corridors.", "Cultural hegemony shapes global entertainment and consumer tastes worldwide.", "The alliance sought to counterbalance the neighboring power's growing regional hegemony."],
        imageQuery: "hegemony globe chess crown power", category: "politics"
      },
      {
        id: "c1-u5-w3", word: "Treaty", phonetic: "/ˈtriːti/", syllables: "trea·ty",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "A formally concluded and ratified agreement between states", meaningAr: "معاهدة رسمية",
        synonyms: ["Pact", "Accord", "Convention"], antonyms: [],
        examples: ["The nuclear non-proliferation treaty was ratified by over 190 sovereign nations.", "Bilateral peace treaties established clear demarcation lines between the two borders.", "The environmental treaty mandates aggressive reductions in methane gas emissions."],
        imageQuery: "treaty parchment fountain pen diplomacy", category: "politics"
      },
      {
        id: "c1-u5-w4", word: "Envoys", phonetic: "/ˈɛnvɔɪz/", syllables: "en·voys",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "Messengers or representatives, especially on diplomatic missions", meaningAr: "مبعوثون دبلوماسيون",
        synonyms: ["Emissaries", "Delegates", "Ambassadors"], antonyms: [],
        examples: ["Special UN peace envoys facilitated negotiations between the warring factions.", "The president dispatched seasoned diplomatic envoys to restore severed ties.", "International trade envoys convened in Vienna to finalize cross-border tariffs."],
        imageQuery: "envoys diplomatic motorcade conference", category: "politics"
      },
      {
        id: "c1-u5-w5", word: "Deterrence", phonetic: "/dɪˈtɛrəns/", syllables: "de·ter·rence",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "The action of discouraging an action or event through instilling fear of consequences", meaningAr: "ردع استراتيجي",
        synonyms: ["Prevention", "Dissuasion", "Disincentive"], antonyms: ["Encouragement"],
        examples: ["Nuclear deterrence was the cornerstone of defense posture throughout the Cold War.", "A formidable air defense network provides essential military deterrence.", "Economic sanctions operate as a diplomatic deterrence tool against unauthorized proliferation."],
        imageQuery: "deterrence shield fortress security", category: "politics"
      },
      {
        id: "c1-u5-w6", word: "Annexation", phonetic: "/ˌænɛkˈseɪʃən/", syllables: "an·nex·a·tion",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "The action of annexing something, especially territory", meaningAr: "ضم الأراضي بالقوة",
        synonyms: ["Seizure", "Occupation", "Appropriation"], antonyms: ["Relinquishment"],
        examples: ["The unilateral annexation of foreign territory drew universal condemnation.", "The security council passed a binding resolution denouncing the illegal annexation.", "Historians examine the territorial annexations that preceded the outbreak of war."],
        imageQuery: "annexation territory map border line", category: "politics"
      },
      {
        id: "c1-u5-w7", word: "Armistice", phonetic: "/ˈɑːrmɪstɪs/", syllables: "ar·mi·stice",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "An agreement made by opposing sides in a war to stop fighting for a certain time", meaningAr: "هدنة / وقف إطلاق النار",
        synonyms: ["Ceasefire", "Truce", "Suspension of hostilities"], antonyms: [],
        examples: ["An armistice was signed in 1953, halting active hostilities along the peninsula.", "Both factions agreed to honor a temporary humanitarian armistice.", "The anniversary of the Great War armistice is commemorated each November."],
        imageQuery: "armistice white flag peace handshake", category: "politics"
      },
      {
        id: "c1-u5-w8", word: "Unilateral", phonetic: "/ˌjuːnɪˈlætərəl/", syllables: "u·ni·lat·er·al",
        partOfSpeech: "adjective", partOfSpeechAr: "صفة",
        meaningEn: "Performed by or affecting only one person, group, or country involved in a situation", meaningAr: "أحادي الجانب",
        synonyms: ["One-sided", "Independent", "Autonomous"], antonyms: ["Multilateral", "Bilateral"],
        examples: ["Taking unilateral military action without UN sanction alienates traditional allies.", "The state announced a unilateral moratorium on deep-sea exploratory drilling.", "Unilateral tariff increases triggered retaliatory trade countermeasures."],
        imageQuery: "unilateral solitary path direction", category: "politics"
      },
      {
        id: "c1-u5-w9", word: "Multilateral", phonetic: "/ˌmʌltɪˈlætərəl/", syllables: "mul·ti·lat·er·al",
        partOfSpeech: "adjective", partOfSpeechAr: "صفة",
        meaningEn: "Agreed upon or participated in by three or more parties, especially the governments of different countries", meaningAr: "متعدد الأطراف",
        synonyms: ["Collective", "Collaborative", "International"], antonyms: ["Unilateral"],
        examples: ["Complex global challenges like pandemics require multilateral cooperation.", "The World Health Organization is a premier multilateral health institution.", "Multilateral diplomacy reconciles diverging national interests into common frameworks."],
        imageQuery: "multilateral united nations assembly hall", category: "politics"
      },
      {
        id: "c1-u5-w10", word: "Sanction", phonetic: "/ˈsæŋkʃən/", syllables: "sanc·tion",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "A threatened penalty for disobeying a law or rule; economic measures taken against a state", meaningAr: "عقوبة دولية / جزاء",
        synonyms: ["Penalty", "Embargo", "Restriction"], antonyms: ["Reward", "Incentive"],
        examples: ["Targeted financial sanctions froze the offshore assets of corrupt officials.", "Lifting international economic sanctions paved the way for industrial modernization.", "Sanctions are intended to compel policy compliance without engaging in armed conflict."],
        imageQuery: "sanction gavel chain lock border", category: "politics"
      }
    ]
  },
  {
    id: "c1-u6",
    title: "Literature & Literary Analysis",
    titleAr: "الأدب والتحليل الأدبي",
    category: "arts",
    words: [
      {
        id: "c1-u6-w1", word: "Allegory", phonetic: "/ˈæləɡəri/", syllables: "al·le·go·ry",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "A story, poem, or picture that can be interpreted to reveal a hidden meaning", meaningAr: "رمزية أدبية / قصة تمثيلية",
        synonyms: ["Parable", "Metaphor", "Symbolism"], antonyms: [],
        examples: ["George Orwell's novel Animal Farm is a biting political allegory of totalitarianism.", "The epic poem functions as a moral allegory concerning virtue and temptation.", "Literary critics unpack the theological allegories embedded in Dante's Inferno."],
        imageQuery: "allegory metaphor mask shadow book", category: "arts"
      },
      {
        id: "c1-u6-w2", word: "Protagonist", phonetic: "/proʊˈtæɡənɪst/", syllables: "pro·tag·o·nist",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "The leading character or one of the major characters in a drama, movie, novel", meaningAr: "بطل الرواية / الشخصية المحورية",
        synonyms: ["Hero", "Lead", "Central character"], antonyms: ["Antagonist"],
        examples: ["The tragic protagonist struggles against unrelenting societal pressures.", "Readers sympathize deeply with the young protagonist's moral awakening.", "Unlike classic heroes, modern literature often presents morally flawed protagonists."],
        imageQuery: "protagonist character silhouette light book", category: "arts"
      },
      {
        id: "c1-u6-w3", word: "Antagonist", phonetic: "/ænˈtæɡənɪst/", syllables: "an·tag·o·nist",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "A person who actively opposes or is hostile to someone or something; an adversary", meaningAr: "الشخصية المعارضة / الخصم في الرواية",
        synonyms: ["Adversary", "Opponent", "Nemesis"], antonyms: ["Protagonist", "Ally"],
        examples: ["Iago serves as the devious psychological antagonist in Shakespeare's Othello.", "A compelling antagonist possesses understandable motives rather than pure wickedness.", "The tension between the visionary protagonist and bureaucratic antagonist drives the plot."],
        imageQuery: "antagonist shadow villain duel drama", category: "arts"
      },
      {
        id: "c1-u6-w4", word: "Foreshadowing", phonetic: "/fɔːrˈʃædoʊɪŋ/", syllables: "fore·shad·ow·ing",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "A warning or indication of a future event in a story", meaningAr: "استشراف / تلميح تمهيدي لأحداث لاحقة",
        synonyms: ["Prefiguration", "Portent", "Omen"], antonyms: [],
        examples: ["The recurring thunderclap provides subtle foreshadowing of impending tragedy.", "The author's deliberate word choices serve as eerie foreshadowing of the final betrayal.", "Careful literary analysis uncovers masterclass foreshadowing throughout the early chapters."],
        imageQuery: "foreshadowing dark clouds raven tree", category: "arts"
      },
      {
        id: "c1-u6-w5", word: "Irony", phonetic: "/ˈaɪrəni/", syllables: "i·ro·ny",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "The expression of one's meaning by using language that normally signifies the opposite", meaningAr: "سخرية / تهكم درامي أو لغوي",
        synonyms: ["Sarcasm", "Paradox", "Incongruity"], antonyms: ["Sincerity"],
        examples: ["Dramatic irony occurs when the audience knows the secret that the hero ignores.", "There is profound irony in a fire station burning down due to an unattended candle.", "Swift deployed ruthless satirical irony to excoriate British economic policies."],
        imageQuery: "irony drama masks comedy tragedy", category: "arts"
      },
      {
        id: "c1-u6-w6", word: "Metaphor", phonetic: "/ˈmɛtəfɔːr/", syllables: "met·a·phor",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "A figure of speech in which a word or phrase is applied to an object to which it is not literally applicable", meaningAr: "استعارة مجازية",
        synonyms: ["Analogy", "Figure of speech", "Comparison"], antonyms: ["Literalism"],
        examples: ["All the world's a stage is Shakespeare's celebrated theatrical metaphor.", "The author uses a crumbling mansion as a metaphor for the family's moral decay.", "Poetic metaphors bridge the divide between abstract feeling and vivid imagery."],
        imageQuery: "metaphor poetry quill ink parchment", category: "arts"
      },
      {
        id: "c1-u6-w7", word: "Prose", phonetic: "/proʊz/", syllables: "prose",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "Written or spoken language in its ordinary form, without metrical structure", meaningAr: "نثر أدبي",
        synonyms: ["Essay", "Text", "Narrative"], antonyms: ["Poetry", "Verse"],
        examples: ["Hemingway is celebrated for his concise, unadorned narrative prose style.", "The essayist wrote crystalline philosophical prose that was accessible to all readers.", "Unlike poetic verse, prose does not adhere to rhythmic meter or rhyme."],
        imageQuery: "prose vintage typewriter book manuscript", category: "arts"
      },
      {
        id: "c1-u6-w8", word: "Soliloquy", phonetic: "/səˈlɪləkwi/", syllables: "so·lil·o·quy",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "An act of speaking one's thoughts aloud when by oneself in a play", meaningAr: "مناجاة النفس / مونولوج مسرحي",
        synonyms: ["Monologue", "Speech", "Asides"], antonyms: ["Dialogue"],
        examples: ["Hamlet's famous 'To be or not to be' is the most dissected soliloquy in theater.", "Through an intimate soliloquy, the villain reveals his true treacherous motivations.", "The actor delivered the reflective soliloquy with haunting emotional gravity."],
        imageQuery: "soliloquy actor spotlight empty stage", category: "arts"
      },
      {
        id: "c1-u6-w9", word: "Nuance", phonetic: "/ˈnjuːɑːns/", syllables: "nu·ance",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "A subtle difference in or shade of meaning, expression, or sound", meaningAr: "فارق دقيق / لمسة دقيقة",
        synonyms: ["Subtlety", "Shade", "Fineness"], antonyms: [],
        examples: ["Translators must capture every subtle emotional nuance of the source poetry.", "The actor conveyed an extraordinary depth of emotional nuance using only eye gestures.", "A nuanced political argument avoids the crude simplifications of populist rhetoric."],
        imageQuery: "nuance color gradient shades delicate", category: "arts"
      },
      {
        id: "c1-u6-w10", word: "Eulogy", phonetic: "/ˈjuːlədʒi/", syllables: "eu·lo·gy",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "A speech or piece of writing that praises someone highly, typically one who has just died", meaningAr: "مرثية / تأبين مدحي",
        synonyms: ["Tribute", "Encomium", "Panegyric"], antonyms: ["Condemnation"],
        examples: ["He delivered a heartfelt eulogy recounting his father's compassion and integrity.", "Pericles' famous funeral eulogy extolled the democratic values of ancient Athens.", "The author penned an eloquent literary eulogy for her departed mentor."],
        imageQuery: "eulogy podium flowers memorial speech", category: "arts"
      }
    ]
  },
  {
    id: "c1-u7",
    title: "Advanced Biomedical Sciences",
    titleAr: "العلوم الطبية الحيوية المتقدمة",
    category: "health",
    words: [
      {
        id: "c1-u7-w1", word: "Genomic", phonetic: "/dʒɪˈnoʊmɪk/", syllables: "ge·nom·ic",
        partOfSpeech: "adjective", partOfSpeechAr: "صفة",
        meaningEn: "Relating to the branch of molecular biology concerned with the structure of genomes", meaningAr: "جينومي / وراثي شامل",
        synonyms: ["Genetic", "Hereditary"], antonyms: [],
        examples: ["Genomic sequencing enables oncologists to tailor targeted cancer immunotherapies.", "The human genomic database holds millions of coded base pairs.", "Genomic testing identified the hereditary predisposition for cardiovascular disease."],
        imageQuery: "genomic dna double helix science", category: "health"
      },
      {
        id: "c1-u7-w2", word: "Pathology", phonetic: "/pəˈθɒlədʒi/", syllables: "pa·thol·o·gy",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "The science of the causes and effects of diseases, especially the branch of medicine dealing with laboratory examination", meaningAr: "علم الأمراض / باثولوجيا",
        synonyms: ["Medical etiology", "Disease study"], antonyms: [],
        examples: ["The biopsy tissue specimen was sent to cellular pathology for microscopic analysis.", "Molecular pathology has revolutionized our understanding of auto-immune disorders.", "The professor authored a seminal textbook on pulmonary infectious pathology."],
        imageQuery: "pathology microscope laboratory tissue slide", category: "health"
      },
      {
        id: "c1-u7-w3", word: "Virulence", phonetic: "/ˈvɪrʊləns/", syllables: "vir·u·lence",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "The severity or harmfulness of a disease or poison; pathogen lethality", meaningAr: "ضراوة الفيروس / فتك المسبب المرضي",
        synonyms: ["Lethality", "Malignancy", "Toxicity"], antonyms: ["Harmlessness", "Mildness"],
        examples: ["Mutations in the spike glycoprotein can enhance viral virulence dramatically.", "Epidemiologists monitor the seasonal influenza strain for heightened virulence.", "Vaccines attenuate microbial virulence, preparing the immune system safely."],
        imageQuery: "virulence virus pathogen danger microscope", category: "health"
      },
      {
        id: "c1-u7-w4", word: "Antibody", phonetic: "/ˈæntɪˌbɒdi/", syllables: "an·ti·bod·y",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "A blood protein produced in response to and counteracting a specific antigen", meaningAr: "جسم مضاد",
        synonyms: ["Immunoglobulin"], antonyms: ["Antigen"],
        examples: ["Neutralizing antibodies bind to pathogens and prevent cellular infiltration.", "Monoclonal antibody therapies successfully treat acute inflammatory conditions.", "Serological blood tests measure circulating antibody titers after vaccination."],
        imageQuery: "antibody immune cell defense science", category: "health"
      },
      {
        id: "c1-u7-w5", word: "Efficacy", phonetic: "/ˈɛfɪkəsi/", syllables: "ef·fi·ca·cy",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "The ability to produce a desired or intended result", meaningAr: "فعالية سريرية",
        synonyms: ["Effectiveness", "Potency", "Success"], antonyms: ["Inefficacy", "Impotence"],
        examples: ["Double-blind clinical trials confirmed the high prophylactic efficacy of the vaccine.", "Researchers compared the relative therapeutic efficacy of two novel analgesics.", "A medicine must exhibit safety and proven medical efficacy before commercial approval."],
        imageQuery: "efficacy clinical trial pill medicine", category: "health"
      },
      {
        id: "c1-u7-w6", word: "Prognosis", phonetic: "/prɒɡˈnoʊsɪs/", syllables: "prog·no·sis",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "The likely course of a medical condition or disease", meaningAr: "تكهن بمسار المرض / تشخيص مآلي",
        synonyms: ["Forecast", "Outlook", "Projection"], antonyms: [],
        examples: ["Early detection of malignant tumors vastly improves the long-term prognosis.", "The neurologist delivered a cautious prognosis regarding cognitive recovery.", "With modern antiviral cocktails, the prognosis for infected patients is optimistic."],
        imageQuery: "prognosis doctor patient consultation hope", category: "health"
      },
      {
        id: "c1-u7-w7", word: "Congenital", phonetic: "/kənˈdʒɛnɪtəl/", syllables: "con·gen·i·tal",
        partOfSpeech: "adjective", partOfSpeechAr: "صفة",
        meaningEn: "Present from birth, typically of a medical condition or physical trait", meaningAr: "خلقي / ولادي",
        synonyms: ["Inborn", "Inherent", "Hereditary"], antonyms: ["Acquired"],
        examples: ["Pediatric surgeons corrected the child's congenital heart defect.", "Congenital hearing impairment can now be addressed with early cochlear implants.", "Prenatal screenings evaluate fetuses for potential congenital anomalies."],
        imageQuery: "congenital newborn medical care ultrasound", category: "health"
      },
      {
        id: "c1-u7-w8", word: "Metabolism", phonetic: "/mɪˈtæbəlɪzəm/", syllables: "me·tab·o·lism",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "The chemical processes that occur within a living organism in order to maintain life", meaningAr: "أيض / تمثيل غذائي",
        synonyms: ["Cellular processing", "Catabolism/Anabolism"], antonyms: [],
        examples: ["Thyroid hormones play an instrumental role in regulating basal cellular metabolism.", "Disruptions in glucose metabolism underpin the pathophysiology of type 2 diabetes.", "High-intensity physical exertion stimulates energetic mitochondrial metabolism."],
        imageQuery: "metabolism energy cells biology", category: "health"
      },
      {
        id: "c1-u7-w9", word: "Oncology", phonetic: "/ɒnˈkɒlədʒi/", syllables: "on·col·o·gy",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "The study and treatment of tumors and cancer", meaningAr: "علم الأورام",
        synonyms: ["Cancer research"], antonyms: [],
        examples: ["Advancements in precision oncology have radically altered chemotherapy protocols.", "She completed her postdoctoral fellowship in pediatric radiation oncology.", "The university hospital opened a world-class institute dedicated to clinical oncology."],
        imageQuery: "oncology cancer ribbon doctor medicine", category: "health"
      },
      {
        id: "c1-u7-w10", word: "Transfusion", phonetic: "/trænsˈfjuːʒən/", syllables: "trans·fu·sion",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "An act of transferring donated blood, blood products, or other fluid into the circulatory system", meaningAr: "نقل دم",
        synonyms: ["Blood transfer", "Infusion"], antonyms: [],
        examples: ["Trauma surgeons performed an emergency blood transfusion following the accident.", "Strict compatibility screening ensures safe platelet and whole blood transfusions.", "Volunteer blood donations remain the lifeline of hospital transfusion services."],
        imageQuery: "blood transfusion drip bag red cross", category: "health"
      }
    ]
  },
  {
    id: "c1-u8",
    title: "Artificial Intelligence & Data Ethics",
    titleAr: "الذكاء الاصطناعي وأخلاقيات البيانات",
    category: "technology",
    words: [
      {
        id: "c1-u8-w1", word: "Algorithmic", phonetic: "/ˌælɡəˈrɪðmɪk/", syllables: "al·go·rith·mic",
        partOfSpeech: "adjective", partOfSpeechAr: "صفة",
        meaningEn: "Relating to or using an algorithm or methodical process", meaningAr: "خوارزمي",
        synonyms: ["Computational", "Procedural"], antonyms: [],
        examples: ["Auditors inspected algorithmic lending models for insidious credit bias.", "Algorithmic trading systems execute complex currency swaps in nanoseconds.", "Content recommendation feeds are governed by proprietary algorithmic metrics."],
        imageQuery: "algorithmic code computer math stream", category: "technology"
      },
      {
        id: "c1-u8-w2", word: "Autonomous", phonetic: "/ɔːˈtɒnəməs/", syllables: "au·ton·o·mous",
        partOfSpeech: "adjective", partOfSpeechAr: "صفة",
        meaningEn: "Having the freedom to govern itself or control its own affairs; self-driving", meaningAr: "ذاتي القيادة / مستقل",
        synonyms: ["Self-governing", "Automated", "Independent"], antonyms: ["Dependent", "Manual"],
        examples: ["Fully autonomous vehicles rely on real-time LiDAR and sensor fusion.", "The factory deployed autonomous robotic couriers to transport inventory across bays.", "Military ethicists vigorously debate the deployment of autonomous weapon systems."],
        imageQuery: "autonomous vehicle self driving car sensors", category: "technology"
      },
      {
        id: "c1-u8-w3", word: "Surveillance", phonetic: "/sɜːrˈveɪləns/", syllables: "sur·veil·lance",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "Close observation, especially of a suspected spy or criminal", meaningAr: "مراقبة ورصد",
        synonyms: ["Observation", "Monitoring", "Vigilance"], antonyms: [],
        examples: ["Civil liberties organizations filed lawsuits against mass biometric facial surveillance.", "Drones equipped with thermal cameras provided border surveillance night and day.", "Digital surveillance legislation must respect basic constitutional privacy protections."],
        imageQuery: "surveillance camera security cctv lens", category: "technology"
      },
      {
        id: "c1-u8-w4", word: "Biometrics", phonetic: "/ˌbaɪoʊˈmɛtrɪks/", syllables: "bi·o·met·rics",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "The measurement and statistical analysis of people's unique physical characteristics", meaningAr: "القياسات الحيوية / البيومترية",
        synonyms: ["Fingerprint scan", "Facial recognition"], antonyms: [],
        examples: ["Modern smartphones deploy facial and iris biometrics for secure authentication.", "Border checkpoints verify international traveler identities via biometric passport chips.", "Encrypting biometric templates prevents catastrophic identity theft from server breaches."],
        imageQuery: "biometrics fingerprint face scan digital", category: "technology"
      },
      {
        id: "c1-u8-w5", word: "Hallucination", phonetic: "/həˌluːsɪˈneɪʃən/", syllables: "hal·lu·ci·na·tion",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "An apparent perception of an external object not actually present; fabricated AI output", meaningAr: "هلوسة (توليد بيانات زائفة في الذكاء الاصطناعي)",
        synonyms: ["Fabrication", "Illusion", "Delusion"], antonyms: ["Truth", "Veracity"],
        examples: ["Large language models can present fabricated citations with convincing AI hallucination.", "Prompt engineering techniques significantly reduce factual hallucination in legal software.", "Researchers develop fact-checking guardrails to penalize probabilistic hallucinations."],
        imageQuery: "hallucination surreal digital brain fantasy", category: "technology"
      },
      {
        id: "c1-u8-w6", word: "Heuristic", phonetic: "/hjʊəˈrɪstɪk/", syllables: "heu·ris·tic",
        partOfSpeech: "adjective", partOfSpeechAr: "صفة",
        meaningEn: "Enabling a person to discover or learn something for themselves; problem-solving shortcut", meaningAr: "استكشافي / تقريبي لحل المشكلات",
        synonyms: ["Rule-of-thumb", "Empirical shortcut", "Investigative"], antonyms: ["Algorithmic proof"],
        examples: ["Antivirus scanners employ heuristic analysis to identify previously unseen malware variants.", "Human decision-makers rely on mental heuristics to navigate cognitive overload.", "The pathfinding robot uses an A-star heuristic to navigate around dense obstacles."],
        imageQuery: "heuristic problem solving maze puzzle", category: "technology"
      },
      {
        id: "c1-u8-w7", word: "Neural", phonetic: "/ˈnjʊərəl/", syllables: "neu·ral",
        partOfSpeech: "adjective", partOfSpeechAr: "صفة",
        meaningEn: "Relating to a nerve or the nervous system; machine learning network", meaningAr: "عصبي (شبكات عصبية اصطناعية)",
        synonyms: ["Synaptic", "Neuronal", "Nervous"], antonyms: [],
        examples: ["Deep neural networks mimic the layered synaptic architecture of the human cortex.", "Convolutional neural structures excel at computer vision and object localization.", "Neural machine translation produces contextually natural, fluent sentences."],
        imageQuery: "neural network nodes glowing brain", category: "technology"
      },
      {
        id: "c1-u8-w8", word: "Supervised", phonetic: "/ˈsuːpərvaɪzd/", syllables: "su·per·vised",
        partOfSpeech: "adjective", partOfSpeechAr: "صفة",
        meaningEn: "Observed and directed by someone; machine learning trained on labelled data", meaningAr: "خاضع للإشراف (تعلم الآلة بالبيانات المصنفة)",
        synonyms: ["Monitored", "Guided", "Labelled"], antonyms: ["Unsupervised"],
        examples: ["Supervised learning models require vast repositories of manually labeled image datasets.", "Medical image diagnostic models rely on expert supervised annotations.", "The team transitioned from purely supervised training to self-supervised pre-training."],
        imageQuery: "supervised learning computer teacher training", category: "technology"
      },
      {
        id: "c1-u8-w9", word: "Generative", phonetic: "/ˈdʒɛnərətɪv/", syllables: "gen·er·a·tive",
        partOfSpeech: "adjective", partOfSpeechAr: "صفة",
        meaningEn: "Having the ability to produce or originate something", meaningAr: "توليدي (ذكاء اصطناعي توليدي)",
        synonyms: ["Productive", "Originative", "Creative"], antonyms: ["Destructive"],
        examples: ["Generative AI models create hyper-realistic illustrations and articulate prose.", "Software engineers integrate generative code completion tools into development IDEs.", "The museum curated an exhibition examining art crafted by generative diffusion models."],
        imageQuery: "generative ai art digital painting robot", category: "technology"
      },
      {
        id: "c1-u8-w10", word: "Disinformation", phonetic: "/ˌdɪsˌɪnfərˈmeɪʃən/", syllables: "dis·in·for·ma·tion",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "False information which is intended to mislead, especially propaganda", meaningAr: "تضليل إعلامي متعمد",
        synonyms: ["Propaganda", "Fabrication", "Deception"], antonyms: ["Truth", "Fact"],
        examples: ["Coordinated disinformation botnets sought to sow societal discord before the election.", "Deepfake audio recordings were weaponized to spread harmful corporate disinformation.", "Cyber defense agencies actively dismantle foreign digital disinformation operations."],
        imageQuery: "disinformation fake news puppet strings", category: "technology"
      }
    ]
  },
  {
    id: "c1-u9",
    title: "Environmental Ecology & Biodiversity",
    titleAr: "علم البيئة والتنوع الحيوي",
    category: "nature",
    words: [
      {
        id: "c1-u9-w1", word: "Symbiosis", phonetic: "/ˌsɪmbaɪˈoʊsɪs/", syllables: "sym·bi·o·sis",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "Interaction between two different organisms living in close physical association, typically to advantage of both", meaningAr: "تكافل حيوي / معايشة نفعية",
        synonyms: ["Mutualism", "Collaboration", "Interdependence"], antonyms: ["Parasitism"],
        examples: ["The clownfish and sea anemone demonstrate classic marine ecological symbiosis.", "Mycorrhizal fungi maintain a symbiotic exchange with tree roots in ancient forests.", "The corporate partnership was praised as a commercial symbiosis that enriched both."],
        imageQuery: "symbiosis clownfish anemone ocean coral", category: "nature"
      },
      {
        id: "c1-u9-w2", word: "Anthropogenic", phonetic: "/ˌænθrəpəˈdʒɛnɪk/", syllables: "an·thro·po·gen·ic",
        partOfSpeech: "adjective", partOfSpeechAr: "صفة",
        meaningEn: "Originating in human activity, chiefly in environmental pollution or degradation", meaningAr: "بشري المنشأ / ناجم عن النشاط الإنساني",
        synonyms: ["Human-caused", "Artificial"], antonyms: ["Natural", "Biogenic"],
        examples: ["The report conclusively verified that modern climate change is anthropogenic.", "Anthropogenic greenhouse gas emissions have risen exponentially since the industrial revolution.", "Coastal marshlands help mitigate severe anthropogenic runoff pollution."],
        imageQuery: "anthropogenic smoke factory climate footprint", category: "nature"
      },
      {
        id: "c1-u9-w3", word: "Biosphere", phonetic: "/ˈbaɪoʊsfɪər/", syllables: "bi·o·sphere",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "The regions of the surface, atmosphere, and hydrosphere of the earth occupied by living organisms", meaningAr: "الغلاف الحيوي للأرض",
        synonyms: ["Ecosphere", "Living world"], antonyms: [],
        examples: ["Plastic microparticles have now penetrated every corner of the global biosphere.", "Preserving planetary biosphere integrity is vital for maintaining atmospheric equilibrium.", "Scientists study how volcanic super-eruptions disrupted prehistoric biospheres."],
        imageQuery: "biosphere earth nature green blue globe", category: "nature"
      },
      {
        id: "c1-u9-w4", word: "Degradation", phonetic: "/ˌdɛɡrəˈdeɪʃən/", syllables: "deg·ra·da·tion",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "The condition or process of degrading or being degraded; deterioration", meaningAr: "تدهور بيئي / انحطاط",
        synonyms: ["Deterioration", "Decline", "Erosion"], antonyms: ["Restoration", "Enhancement"],
        examples: ["Intensive agricultural tilling caused catastrophic soil nutrient degradation.", "Environmental degradation leads inevitably to poverty and water insecurity.", "The reforestation campaign successfully halted steep hillside land degradation."],
        imageQuery: "soil degradation dry cracked ground desert", category: "nature"
      },
      {
        id: "c1-u9-w5", word: "Ecosystem", phonetic: "/ˈiːkoʊˌsɪstəm/", syllables: "e·co·sys·tem",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "A biological community of interacting organisms and their physical environment", meaningAr: "نظام بيئي متكامل",
        synonyms: ["Biome", "Ecological network"], antonyms: [],
        examples: ["Mangrove forests provide an indispensable barrier protecting delicate coastal ecosystems.", "Invasive carp disrupted the freshwater ecosystem by outcompeting native trout.", "A healthy ecosystem delivers clean water, pollinated crops, and carbon sequestration."],
        imageQuery: "ecosystem rainforest river waterfall nature", category: "nature"
      },
      {
        id: "c1-u9-w6", word: "Acidification", phonetic: "/əˌsɪdɪfɪˈkeɪʃən/", syllables: "a·cid·i·fi·ca·tion",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "The process of becoming acid or being converted into an acid", meaningAr: "تحمض (المحيطات / التربة)",
        synonyms: ["Acid enrichment"], antonyms: ["Neutralization"],
        examples: ["Ocean acidification dissolves the delicate calcium carbonate shells of shellfish.", "Atmospheric carbon absorption accelerates deep-sea acidification.", "Acidification impairs the sensory navigation faculties of juvenile marine species."],
        imageQuery: "ocean acidification bleached coral underwater", category: "nature"
      },
      {
        id: "c1-u9-w7", word: "Endangered", phonetic: "/ɪnˈdeɪndʒərd/", syllables: "en·dan·gered",
        partOfSpeech: "adjective", partOfSpeechAr: "صفة",
        meaningEn: "At risk of extinction, as a species", meaningAr: "مهدد بالانقراض",
        synonyms: ["Threatened", "At-risk", "Vulnerable"], antonyms: ["Thriving", "Secure"],
        examples: ["The Sumatran rhino is critically endangered due to relentless poaching and logging.", "Captive breeding programs strive to reintroduce endangered species into the wild.", "Strict wildlife sanctuaries guard the remaining habitats of endangered primates."],
        imageQuery: "endangered tiger wild jungle majestic", category: "nature"
      },
      {
        id: "c1-u9-w8", word: "Sequestration", phonetic: "/ˌsiːkwɛˈstreɪʃən/", syllables: "se·ques·tra·tion",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "The action of taking legal possession of assets until a debt is paid; biological isolation of carbon", meaningAr: "عزل واحتجاز (الكربون)",
        synonyms: ["Capture", "Isolation", "Storage"], antonyms: ["Release", "Emission"],
        examples: ["Peat bogs and boreal forests provide tremendous natural carbon sequestration.", "Engineers test geological carbon sequestration deep within underground basalt formations.", "Protecting wetlands maximizes blue carbon sequestration along coastal estuaries."],
        imageQuery: "carbon sequestration green forest trees canopy", category: "nature"
      },
      {
        id: "c1-u9-w9", word: "Deforestation", phonetic: "/diːˌfɒrɪˈsteɪʃən/", syllables: "de·for·est·a·tion",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "The action of clearing a wide area of trees", meaningAr: "إزالة الغابات والتصحر",
        synonyms: ["Clear-cutting", "Logging"], antonyms: ["Afforestation", "Reforestation"],
        examples: ["Illegal deforestation in the Amazon rainforest releases millions of tons of stored CO2.", "Satellite imagery tracks illegal logging roads and rapid deforestation.", "Consumer boycotts pressure food manufacturers to halt palm oil driven deforestation."],
        imageQuery: "deforestation cut trees stumps logging", category: "nature"
      },
      {
        id: "c1-u9-w10", word: "Permafrost", phonetic: "/ˈpɜːrməfrɒst/", syllables: "per·ma·frost",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "A thick subsurface layer of soil that remains frozen throughout the year", meaningAr: "التربة الصقيعية الدائمة",
        synonyms: ["Frozen subsoil"], antonyms: [],
        examples: ["Thawing Siberian permafrost releases ancient methane into the atmosphere.", "Infrastructure in the Arctic is collapsing as the supporting permafrost softens.", "Scientists sample prehistoric microbes trapped inside intact permafrost cores."],
        imageQuery: "permafrost arctic tundra ice snow", category: "nature"
      }
    ]
  },
  {
    id: "c1-u10",
    title: "Legal Theory & Jurisprudence",
    titleAr: "النظرية القانونية والفقه المقارن",
    category: "law",
    words: [
      {
        id: "c1-u10-w1", word: "Jurisprudence", phonetic: "/ˌdʒʊərɪsˈpruːdəns/", syllables: "ju·ris·pru·dence",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "The theory or philosophy of law; legal system", meaningAr: "فقه القانون / علم أصول التشريع",
        synonyms: ["Legal theory", "Law philosophy"], antonyms: [],
        examples: ["Constitutional jurisprudence evolves to address technological challenges like online privacy.", "The landmark judgment established a new standard in international human rights jurisprudence.", "He studied classical Roman jurisprudence to understand the roots of modern civil codes."],
        imageQuery: "jurisprudence justice scales gavel law books", category: "law"
      },
      {
        id: "c1-u10-w2", word: "Precedent", phonetic: "/ˈprɛsɪdənt/", syllables: "prec·e·dent",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "An earlier event or action that is regarded as an example or guide in subsequent similar circumstances", meaningAr: "سابقة قضائية",
        synonyms: ["Model", "Exemplar", "Prior case"], antonyms: [],
        examples: ["The supreme court was reluctant to overturn a century-old judicial precedent.", "The judge cited binding appellate precedent when dismissing the frivolous lawsuit.", "Setting a dangerous legal precedent could compromise future consumer protection suits."],
        imageQuery: "precedent gavel law library courtroom", category: "law"
      },
      {
        id: "c1-u10-w3", word: "Injunction", phonetic: "/ɪnˈdʒʌŋkʃən/", syllables: "in·junc·tion",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "An authoritative warning or order; a judicial order that restrains a person from an action", meaningAr: "أمر قضائي زجري / منع قضائي",
        synonyms: ["Order", "Mandate", "Restraining order"], antonyms: [],
        examples: ["The district court granted an emergency injunction halting the factory demolition.", "The patent owner sought a preliminary injunction to stop retail distribution of counterfeits.", "Violating a court injunction constitutes direct contempt of judicial authority."],
        imageQuery: "injunction stop legal document stamp", category: "law"
      },
      {
        id: "c1-u10-w4", word: "Litigation", phonetic: "/ˌlɪtɪˈɡeɪʃən/", syllables: "lit·i·ga·tion",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "The process of taking legal action", meaningAr: "تقاضٍ / نزاع قضائي",
        synonyms: ["Legal proceeding", "Lawsuit", "Case"], antonyms: ["Arbitration", "Settlement"],
        examples: ["Protracted commercial litigation cost both corporations millions in legal fees.", "Corporate lawyers recommended arbitration to avoid costly public courtroom litigation.", "The class-action litigation dragged on for over a decade before reaching settlement."],
        imageQuery: "litigation courtroom lawyer trial judge", category: "law"
      },
      {
        id: "c1-u10-w5", word: "Indictment", phonetic: "/ɪnˈdaɪtmənt/", syllables: "in·dict·ment",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "A formal charge or accusation of a serious crime", meaningAr: "لائحة اتهام جنائية",
        synonyms: ["Charge", "Arraignment", "Accusation"], antonyms: ["Acquittal", "Exoneration"],
        examples: ["The grand jury handed down a multi-count indictment for corporate wire fraud.", "The criminal indictment charged the rogue trader with systemic market manipulation.", "A formal indictment must specify the statutory provisions alleged to have been violated."],
        imageQuery: "indictment legal document court stamp", category: "law"
      },
      {
        id: "c1-u10-w6", word: "Extradition", phonetic: "/ˌɛkstrəˈdɪʃən/", syllables: "ex·tra·di·tion",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "The action of extraditing a person accused or convicted of a crime", meaningAr: "تسليم المجرمين المطلوبين",
        synonyms: ["Surrender", "Handover", "Deportation"], antonyms: [],
        examples: ["The fugitive was taken into custody pending an extradition hearing to face charges.", "The absence of a bilateral extradition treaty prevented repatriation of the suspect.", "The high court approved the extradition after assurances against capital punishment."],
        imageQuery: "extradition handcuffs airport police passport", category: "law"
      },
      {
        id: "c1-u10-w7", word: "Acquittal", phonetic: "/əˈkwɪtəl/", syllables: "ac·quit·tal",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "A judgment that a person is not guilty of the crime with which they have been charged", meaningAr: "تبرئة قضائية",
        synonyms: ["Absolution", "Exoneration", "Clearing"], antonyms: ["Conviction"],
        examples: ["The jury deliberated for three days before returning a unanimous verdict of acquittal.", "DNA forensics proved conclusive, leading to the posthumous acquittal of the prisoner.", "His acquittal was greeted with tears of relief by family members inside the gallery."],
        imageQuery: "acquittal hammer gavel free not guilty", category: "law"
      },
      {
        id: "c1-u10-w8", word: "Statutory", phonetic: "/ˈstætʃʊtəri/", syllables: "stat·u·to·ry",
        partOfSpeech: "adjective", partOfSpeechAr: "صفة",
        meaningEn: "Required, permitted, or enacted by statute or legislation", meaningAr: "قانوني منصوص عليه / تشريعي",
        synonyms: ["Mandatory", "Legally binding", "Prescribed"], antonyms: ["Discretionary"],
        examples: ["Employers must comply with strict statutory minimum wage requirements.", "The statutory limitation period for filing financial fraud claims is five years.", "The regulatory agency exercises statutory oversight over pharmaceutical production."],
        imageQuery: "statutory law book legislation code", category: "law"
      },
      {
        id: "c1-u10-w9", word: "Subpoena", phonetic: "/səˈpiːnə/", syllables: "sub·poe·na",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "A writ ordering a person to attend a court or produce documents", meaningAr: "استدعاء قضائي ملزم للشهادة أو تقديم وثائق",
        synonyms: ["Summons", "Writ", "Court order"], antonyms: [],
        examples: ["The congressional committee issued a formal subpoena for the financial records.", "Failure to comply with a judicial subpoena triggers immediate contempt citations.", "She received a witness subpoena commanding her testimony before the federal grand jury."],
        imageQuery: "subpoena legal summons envelope seal", category: "law"
      },
      {
        id: "c1-u10-w10", word: "Testimony", phonetic: "/ˈtɛstɪmoʊni/", syllables: "tes·ti·mo·ny",
        partOfSpeech: "noun", partOfSpeechAr: "اسم",
        meaningEn: "A formal written or spoken statement, especially one given in a court of law", meaningAr: "شهادة قضائية / إفادة رسمية",
        synonyms: ["Evidence", "Attestation", "Deposition"], antonyms: [],
        examples: ["The forensic pathologist's expert testimony disproved the defendant's alibi.", "Witness testimony corroborated the timeline established by surveillance cameras.", "Perjury charges were filed after it was discovered the witness gave fabricated testimony under oath."],
        imageQuery: "testimony witness oath court swearing", category: "law"
      }
    ]
  }
];

// Combine into data.levels
if (!data.levels.B2) data.levels.B2 = { units: [] };
if (!data.levels.C1) data.levels.C1 = { units: [] };

const existingB2Ids = new Set(data.levels.B2.units.map(u => u.id));
b2Units.forEach(u => {
  if (!existingB2Ids.has(u.id)) {
    data.levels.B2.units.push(u);
    existingB2Ids.add(u.id);
  }
});

const existingC1Ids = new Set(data.levels.C1.units.map(u => u.id));
c1Units.forEach(u => {
  if (!existingC1Ids.has(u.id)) {
    data.levels.C1.units.push(u);
    existingC1Ids.add(u.id);
  }
});

fs.writeFileSync(wordsJsonPath, JSON.stringify(data, null, 2), 'utf8');

let total = 0;
console.log('--- Current Summary ---');
Object.entries(data.levels).forEach(([lvl, d]) => {
  const count = d.units.reduce((s, u) => s + u.words.length, 0);
  console.log(`${lvl}: ${d.units.length} units, ${count} words`);
  total += count;
});
console.log(`\nTOTAL WORDS NOW: ${total}`);
