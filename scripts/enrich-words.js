const fs = require('fs');
const path = require('path');

const DEFINITIONS = {
  // b1-u21: Social Life & Friendships
  friendship: {
    meaningEn: 'A close bond of mutual affection and trust between people',
    synonyms: ['Companionship', 'Bond', 'Fellowship'],
    antonyms: ['Enmity', 'Hostility'],
  },
  relationship: {
    meaningEn: 'The way in which two or more people or concepts are connected',
    synonyms: ['Connection', 'Association', 'Bond'],
    antonyms: ['Separation', 'Disconnection'],
  },
  trust: {
    meaningEn: 'Firm belief in the reliability, truth, or ability of someone',
    synonyms: ['Confidence', 'Faith', 'Belief'],
    antonyms: ['Distrust', 'Suspicion'],
  },
  support: {
    meaningEn: 'To give encouragement, assistance, or approval to someone',
    synonyms: ['Encourage', 'Assist', 'Help'],
    antonyms: ['Oppose', 'Discourage'],
  },
  argue: {
    meaningEn: 'To exchange divergent or opposite views, typically in a heated way',
    synonyms: ['Quarrel', 'Debate', 'Dispute'],
    antonyms: ['Agree', 'Concur'],
  },
  forgive: {
    meaningEn: 'To stop feeling angry or resentful toward someone for an offense',
    synonyms: ['Pardon', 'Excuse', 'Absolve'],
    antonyms: ['Blame', 'Resent'],
  },
  colleague: {
    meaningEn: 'A person with whom one works in a profession or business',
    synonyms: ['Coworker', 'Associate', 'Partner'],
    antonyms: ['Opponent', 'Rival'],
  },
  neighbour: {
    meaningEn: 'A person living next door to or very near to someone',
    synonyms: ['Resident', 'Dweller'],
    antonyms: ['Stranger', 'Outsider'],
  },
  community: {
    meaningEn: 'A group of people living in the same place or sharing characteristics',
    synonyms: ['Society', 'Group', 'Fellowship'],
    antonyms: ['Individual'],
  },
  gather: {
    meaningEn: 'To come together or assemble in one place',
    synonyms: ['Assemble', 'Meet', 'Collect'],
    antonyms: ['Disperse', 'Scatter'],
  },

  // b1-u22: Animals & Environment
  wildlife: {
    meaningEn: 'Wild animals and native fauna living in a natural environment',
    synonyms: ['Fauna', 'Wilderness'],
    antonyms: ['Domesticated animals'],
  },
  habitat: {
    meaningEn: 'The natural home or environment of an animal, plant, or organism',
    synonyms: ['Home', 'Environment', 'Territory'],
    antonyms: ['Unnatural habitat'],
  },
  endangered: {
    meaningEn: 'Seriously at risk of extinction in the wild',
    synonyms: ['Threatened', 'At-risk', 'Vulnerable'],
    antonyms: ['Safe', 'Thriving'],
  },
  extinct: {
    meaningEn: 'Having no living members; no longer in existence',
    synonyms: ['Vanished', 'Dead', 'Gone'],
    antonyms: ['Living', 'Extant'],
  },
  predator: {
    meaningEn: 'An animal that naturally preys on other animals for food',
    synonyms: ['Hunter', 'Carnivore'],
    antonyms: ['Prey'],
  },
  ecosystem: {
    meaningEn: 'A biological community of interacting organisms and their environment',
    synonyms: ['Biome', 'Ecosphere', 'Biosphere'],
    antonyms: [],
  },
  migrate: {
    meaningEn: 'To move from one region or habitat to another according to the seasons',
    synonyms: ['Relocate', 'Travel', 'Journey'],
    antonyms: ['Stay', 'Remain'],
  },
  pollute: {
    meaningEn: 'To contaminate water, air, or land with harmful substances',
    synonyms: ['Contaminate', 'Taint', 'Poison'],
    antonyms: ['Purify', 'Cleanse'],
  },
  conservation: {
    meaningEn: 'The preservation and careful protection of natural resources',
    synonyms: ['Preservation', 'Protection', 'Safeguarding'],
    antonyms: ['Destruction', 'Waste'],
  },
  species: {
    meaningEn: 'A group of living organisms consisting of similar individuals',
    synonyms: ['Breed', 'Category', 'Classification'],
    antonyms: [],
  },

  // b1-u23: Banking & Finance Basics
  account: {
    meaningEn: 'A record or statement of financial funds held at a bank',
    synonyms: ['Ledger', 'Record', 'Fund'],
    antonyms: [],
  },
  deposit: {
    meaningEn: 'A sum of money placed or kept in a bank account',
    synonyms: ['Payment', 'Down payment', 'Instalment'],
    antonyms: ['Withdrawal'],
  },
  withdraw: {
    meaningEn: 'To take money out of an account',
    synonyms: ['Extract', 'Remove', 'Draw out'],
    antonyms: ['Deposit', 'Insert'],
  },
  loan: {
    meaningEn: 'A sum of money that is borrowed and expected to be paid back with interest',
    synonyms: ['Advance', 'Credit', 'Mortgage'],
    antonyms: ['Repayment'],
  },
  interest: {
    meaningEn: 'Money paid regularly at a particular rate for the use of borrowed money',
    synonyms: ['Return', 'Yield', 'Dividend'],
    antonyms: [],
  },
  budget: {
    meaningEn: 'An estimate of income and expenditure for a set period of time',
    synonyms: ['Financial plan', 'Allowance', 'Allocation'],
    antonyms: [],
  },
  invest: {
    meaningEn: 'To allocate money in the expectation of some future return or profit',
    synonyms: ['Fund', 'Stake', 'Put money into'],
    antonyms: ['Divest', 'Spend'],
  },
  currency: {
    meaningEn: 'A system of money in common use within a particular country',
    synonyms: ['Money', 'Legal tender', 'Cash'],
    antonyms: [],
  },
  mortgage: {
    meaningEn: 'A loan used to purchase property or real estate',
    synonyms: ['Home loan', 'Pledge', 'Security'],
    antonyms: [],
  },
  debt: {
    meaningEn: 'Something, typically money, that is owed or due to another party',
    synonyms: ['Liability', 'Arrears', 'Obligation'],
    antonyms: ['Asset', 'Credit'],
  },

  // b1-u24: Music & Arts
  rhythm: {
    meaningEn: 'A strong, regular, repeated pattern of movement or sound',
    synonyms: ['Beat', 'Tempo', 'Cadence'],
    antonyms: ['Arrhythmia'],
  },
  melody: {
    meaningEn: 'A sequence of single notes that is musically satisfying; a tune',
    synonyms: ['Tune', 'Aria', 'Air'],
    antonyms: ['Dissonance'],
  },
  instrument: {
    meaningEn: 'An object or device for producing musical sounds',
    synonyms: ['Device', 'Apparatus', 'Tool'],
    antonyms: [],
  },
  compose: {
    meaningEn: 'To write or create a work of art, especially music or poetry',
    synonyms: ['Create', 'Write', 'Author'],
    antonyms: ['Destroy'],
  },
  perform: {
    meaningEn: 'To present a form of entertainment to an audience',
    synonyms: ['Stage', 'Enact', 'Present'],
    antonyms: [],
  },
  gallery: {
    meaningEn: 'A room or building for the display or sale of works of art',
    synonyms: ['Exhibition room', 'Museum', 'Showroom'],
    antonyms: [],
  },
  sculpture: {
    meaningEn: 'The art of making two- or three-dimensional representative or abstract forms',
    synonyms: ['Statue', 'Carving', 'Bust'],
    antonyms: [],
  },
  creative: {
    meaningEn: 'Relating to or involving the imagination or original ideas',
    synonyms: ['Inventive', 'Imaginative', 'Innovative'],
    antonyms: ['Unimaginative', 'Conventional'],
  },
  inspire: {
    meaningEn: 'To fill someone with the urge or ability to do or feel something creative',
    synonyms: ['Motivate', 'Encourage', 'Stimulate'],
    antonyms: ['Discourage', 'Deter'],
  },
  exhibition: {
    meaningEn: 'A public display of works of art or items of interest',
    synonyms: ['Display', 'Show', 'Expo'],
    antonyms: [],
  },

  // b1-u25: Time & Planning
  schedule: {
    meaningEn: 'A plan for carrying out a process, giving intended events and times',
    synonyms: ['Timetable', 'Plan', 'Agenda'],
    antonyms: [],
  },
  deadline: {
    meaningEn: 'The latest time or date by which something should be completed',
    synonyms: ['Due date', 'Time limit', 'Target date'],
    antonyms: [],
  },
  punctual: {
    meaningEn: 'Happening or doing something at the agreed or proper time',
    synonyms: ['On time', 'Prompt', 'Timely'],
    antonyms: ['Late', 'Tardy'],
  },
  postpone: {
    meaningEn: 'To arrange for something to take place at a later time',
    synonyms: ['Delay', 'Defer', 'Put off'],
    antonyms: ['Advance', 'Expedite'],
  },
  priority: {
    meaningEn: 'A thing that is regarded as more important than another',
    synonyms: ['Prime concern', 'Preference', 'Urgency'],
    antonyms: [],
  },
  efficient: {
    meaningEn: 'Achieving maximum productivity with minimum wasted effort or expense',
    synonyms: ['Effective', 'Productive', 'Streamlined'],
    antonyms: ['Inefficient', 'Wasteful'],
  },
  routine: {
    meaningEn: 'A sequence of actions regularly followed; a fixed program',
    synonyms: ['Habit', 'Practice', 'Pattern'],
    antonyms: ['Improvisation'],
  },
  organise: {
    meaningEn: 'To arrange systematically or coordinate activities into order',
    synonyms: ['Arrange', 'Coordinate', 'Structure'],
    antonyms: ['Disorganize', 'Scatter'],
  },
  flexible: {
    meaningEn: 'Able to be easily modified to respond to altered circumstances',
    synonyms: ['Adaptable', 'Adjustable', 'Versatile'],
    antonyms: ['Rigid', 'Inflexible'],
  },
  accomplish: {
    meaningEn: 'To achieve or complete successfully',
    synonyms: ['Achieve', 'Fulfill', 'Attain'],
    antonyms: ['Fail', 'Give up'],
  },

  // b1-u26: Sports & Exercise
  compete: {
    meaningEn: 'To strive to gain or win something by defeating others',
    synonyms: ['Contend', 'Rival', 'Vie'],
    antonyms: ['Collaborate'],
  },
  championship: {
    meaningEn: 'A contest for the position of champion in a sport or game',
    synonyms: ['Tournament', 'Title match', 'Competition'],
    antonyms: [],
  },
  tournament: {
    meaningEn: 'A series of contests between competitors for an overall prize',
    synonyms: ['Championship', 'Contest', 'Series'],
    antonyms: [],
  },
  referee: {
    meaningEn: 'An official who enforces the rules in sports competitions',
    synonyms: ['Umpire', 'Judge', 'Arbitrator'],
    antonyms: [],
  },
  athlete: {
    meaningEn: 'A person who is proficient in sports and other physical exercise',
    synonyms: ['Sportsperson', 'Player', 'Competitor'],
    antonyms: [],
  },
  stamina: {
    meaningEn: 'The ability to sustain prolonged physical or mental effort',
    synonyms: ['Endurance', 'Resilience', 'Energy'],
    antonyms: ['Weakness', 'Lethargy'],
  },
  strategy: {
    meaningEn: 'A plan of action designed to achieve a major or overall aim',
    synonyms: ['Tactic', 'Plan', 'Scheme'],
    antonyms: [],
  },
  qualify: {
    meaningEn: 'To fulfill necessary conditions to participate or succeed',
    synonyms: ['Eligible', 'Pass', 'Meet requirements'],
    antonyms: ['Disqualify'],
  },
  defeat: {
    meaningEn: 'To win a victory over someone in a battle or contest',
    synonyms: ['Beat', 'Overcome', 'Conquer'],
    antonyms: ['Lose', 'Surrender'],
  },
  victory: {
    meaningEn: 'An act of defeating an opponent in a competition or battle',
    synonyms: ['Triumph', 'Win', 'Success'],
    antonyms: ['Defeat', 'Loss'],
  },

  // b1-u27: News & Current Events
  headline: {
    meaningEn: 'A prominent heading at the top of an article or news report',
    synonyms: ['Title', 'Banner', 'Heading'],
    antonyms: [],
  },
  broadcast: {
    meaningEn: 'To transmit a program or information by radio, television, or internet',
    synonyms: ['Transmit', 'Air', 'Televise'],
    antonyms: [],
  },
  reporter: {
    meaningEn: 'A person employed to gather and report news for media',
    synonyms: ['Journalist', 'Correspondent', 'Writer'],
    antonyms: [],
  },
  article: {
    meaningEn: 'A piece of writing included in a newspaper, magazine, or website',
    synonyms: ['Essay', 'Piece', 'Story'],
    antonyms: [],
  },
  publish: {
    meaningEn: 'To issue content for public distribution and readership',
    synonyms: ['Print', 'Release', 'Issue'],
    antonyms: ['Suppress', 'Withhold'],
  },
  accurate: {
    meaningEn: 'Correct in all details; exact and truthful',
    synonyms: ['Exact', 'Precise', 'Correct'],
    antonyms: ['Inaccurate', 'False'],
  },
  source: {
    meaningEn: 'A person, publication, or document that provides information',
    synonyms: ['Origin', 'Reference', 'Informant'],
    antonyms: [],
  },
  opinion: {
    meaningEn: 'A view or judgment formed about something, not necessarily proven',
    synonyms: ['Belief', 'View', 'Perspective'],
    antonyms: ['Fact', 'Certainty'],
  },
  influence: {
    meaningEn: 'The capacity to have an effect on the character or behaviour of someone',
    synonyms: ['Impact', 'Effect', 'Sway'],
    antonyms: ['Powerlessness'],
  },
  debate: {
    meaningEn: 'A formal discussion on a particular topic featuring opposing arguments',
    synonyms: ['Discussion', 'Deliberation', 'Argument'],
    antonyms: ['Agreement'],
  },

  // b1-u28: Science & Discovery
  experiment: {
    meaningEn: 'A scientific procedure undertaken to test a hypothesis or idea',
    synonyms: ['Test', 'Trial', 'Investigation'],
    antonyms: [],
  },
  hypothesis: {
    meaningEn: 'A proposed explanation made as a starting point for investigation',
    synonyms: ['Theory', 'Supposition', 'Proposition'],
    antonyms: ['Fact', 'Proof'],
  },
  laboratory: {
    meaningEn: 'A room or building equipped for scientific experiments and research',
    synonyms: ['Lab', 'Research facility', 'Testing centre'],
    antonyms: [],
  },
  discover: {
    meaningEn: 'To find unexpectedly or through systematic investigation',
    synonyms: ['Uncover', 'Find', 'Reveal'],
    antonyms: ['Hide', 'Lose'],
  },
  research: {
    meaningEn: 'The systematic investigation into materials and sources to establish facts',
    synonyms: ['Study', 'Investigation', 'Inquiry'],
    antonyms: [],
  },
  evidence: {
    meaningEn: 'Facts or information indicating whether a proposition is valid',
    synonyms: ['Proof', 'Confirmation', 'Verification'],
    antonyms: ['Disproof', 'Contradiction'],
  },
  theory: {
    meaningEn: 'A system of ideas intended to explain something based on principles',
    synonyms: ['Hypothesis', 'Concept', 'Principle'],
    antonyms: ['Practice', 'Reality'],
  },
  analysis: {
    meaningEn: 'Detailed examination of the elements or structure of something',
    synonyms: ['Examination', 'Inspection', 'Evaluation'],
    antonyms: ['Synthesis'],
  },
  observation: {
    meaningEn: 'The action or process of closely watching and monitoring something',
    synonyms: ['Monitoring', 'Viewing', 'Scrutiny'],
    antonyms: [],
  },
  conclusion: {
    meaningEn: 'A judgment or decision reached after reasoning and investigation',
    synonyms: ['Verdict', 'Decision', 'Outcome'],
    antonyms: ['Introduction', 'Premise'],
  },

  // b1-u29: Opinions & Discussions
  suggest: {
    meaningEn: 'To put forward an idea or plan for consideration',
    synonyms: ['Propose', 'Recommend', 'Advise'],
    antonyms: ['Demand', 'Order'],
  },
  disagree: {
    meaningEn: 'To hold or express a different opinion from someone else',
    synonyms: ['Differ', 'Dissent', 'Clash'],
    antonyms: ['Agree', 'Concur'],
  },
  perspective: {
    meaningEn: 'A particular attitude toward or way of regarding something',
    synonyms: ['Point of view', 'Outlook', 'Stance'],
    antonyms: [],
  },
  convince: {
    meaningEn: 'To persuade someone firmly of the truth of something',
    synonyms: ['Persuade', 'Assure', 'Sway'],
    antonyms: ['Dissuade', 'Doubt'],
  },
  emphasise: {
    meaningEn: 'To give special importance or prominence to something',
    synonyms: ['Stress', 'Highlight', 'Underline'],
    antonyms: ['Understate', 'Minimize'],
  },
  clarify: {
    meaningEn: 'To make a statement or idea easier to understand',
    synonyms: ['Explain', 'Illuminate', 'Elucidate'],
    antonyms: ['Confuse', 'Obscure'],
  },
  assume: {
    meaningEn: 'To suppose something to be the case without having proof',
    synonyms: ['Presume', 'Expect', 'Suppose'],
    antonyms: ['Know', 'Prove'],
  },
  valid: {
    meaningEn: 'Having a sound basis in logic or fact; reasonable and acceptable',
    synonyms: ['Logical', 'Sound', 'Legitimate'],
    antonyms: ['Invalid', 'Unfounded'],
  },
  negotiate: {
    meaningEn: 'To discuss something with someone in order to reach an agreement',
    synonyms: ['Bargain', 'Discuss terms', 'Confer'],
    antonyms: [],
  },

  // b1-u30: Cooking & Kitchen
  ingredient: {
    meaningEn: 'Any of the foods or substances that are combined to make a dish',
    synonyms: ['Component', 'Item', 'Element'],
    antonyms: [],
  },
  recipe: {
    meaningEn: 'A set of instructions for preparing a particular dish with ingredients',
    synonyms: ['Formula', 'Instructions', 'Method'],
    antonyms: [],
  },
  boil: {
    meaningEn: 'To cook food in water that has reached boiling temperature',
    synonyms: ['Simmer', 'Stew', 'Cook'],
    antonyms: ['Freeze'],
  },
  fry: {
    meaningEn: 'To cook food in hot fat or oil in a pan',
    synonyms: ['Saute', 'Pan-fry', 'Sear'],
    antonyms: [],
  },
  roast: {
    meaningEn: 'To cook food, especially meat, by dry heat in an oven',
    synonyms: ['Bake', 'Grill', 'Broil'],
    antonyms: [],
  },
  seasoning: {
    meaningEn: 'Salt, herbs, or spices added to food to enhance its flavour',
    synonyms: ['Spice', 'Flavouring', 'Condiment'],
    antonyms: [],
  },
  portion: {
    meaningEn: 'An amount of food served for one person; a serving',
    synonyms: ['Serving', 'Helping', 'Share'],
    antonyms: [],
  },
  chop: {
    meaningEn: 'To cut food into small pieces with repeated knife strokes',
    synonyms: ['Cut', 'Dice', 'Mince'],
    antonyms: [],
  },
  marinate: {
    meaningEn: 'To soak food in a seasoned liquid before cooking to add flavour',
    synonyms: ['Soak', 'Steep', 'Season'],
    antonyms: [],
  },
  cuisine: {
    meaningEn: 'A style or method of cooking characteristic of a country or region',
    synonyms: ['Cooking style', 'Culinary art', 'Dishes'],
    antonyms: [],
  },

  // b1-u31: Doctor & Medicine
  symptom: {
    meaningEn: 'A physical or mental sign indicating a condition of disease',
    synonyms: ['Indication', 'Sign', 'Manifestation'],
    antonyms: [],
  },
  diagnose: {
    meaningEn: 'To identify an illness or medical problem by examining symptoms',
    synonyms: ['Identify', 'Detect', 'Determine'],
    antonyms: [],
  },
  prescription: {
    meaningEn: 'An instruction written by a doctor authorizing medicine for a patient',
    synonyms: ['Medication order', 'Treatment', 'Medicine'],
    antonyms: [],
  },
  surgery: {
    meaningEn: 'Medical treatment involving an operation on a patient',
    synonyms: ['Operation', 'Procedure', 'Intervention'],
    antonyms: [],
  },
  clinic: {
    meaningEn: 'A medical facility where outpatients receive treatment or advice',
    synonyms: ['Health centre', 'Infirmary', 'Dispensary'],
    antonyms: [],
  },
  chronic: {
    meaningEn: 'Persisting for a long time or constantly recurring',
    synonyms: ['Long-term', 'Persistent', 'Incurable'],
    antonyms: ['Acute', 'Temporary'],
  },
  recover: {
    meaningEn: 'To return to a normal state of health and strength after illness',
    synonyms: ['Heal', 'Convalesce', 'Recuperate'],
    antonyms: ['Deteriorate', 'Worsen'],
  },
  vaccine: {
    meaningEn: 'A substance used to provide immunity against infectious diseases',
    synonyms: ['Immunization', 'Inoculation', 'Jab'],
    antonyms: [],
  },
  infection: {
    meaningEn: 'The invasion and growth of germs in the body that cause illness',
    synonyms: ['Contagion', 'Illness', 'Disease'],
    antonyms: ['Sterility', 'Immunity'],
  },
  emergency: {
    meaningEn: 'A serious and unexpected situation requiring immediate action',
    synonyms: ['Crisis', 'Urgent situation', 'Exigency'],
    antonyms: [],
  },

  // b2-u3: Business & Economy
  entrepreneur: {
    meaningEn: 'A person who sets up businesses, taking financial risks for profit',
    synonyms: ['Businessperson', 'Founder', 'Innovator'],
    antonyms: ['Employee'],
  },
  revenue: {
    meaningEn: 'Total income generated by the sale of goods or services',
    synonyms: ['Income', 'Earnings', 'Turnover'],
    antonyms: ['Expense', 'Loss'],
  },
  profit: {
    meaningEn: 'Financial gain exceeding the expenses incurred in business',
    synonyms: ['Gain', 'Margin', 'Net income'],
    antonyms: ['Loss', 'Deficit'],
  },
  merger: {
    meaningEn: 'The combination of two or more commercial entities into one',
    synonyms: ['Combination', 'Consolidation', 'Amalgamation'],
    antonyms: ['Separation', 'Split'],
  },
  stakeholder: {
    meaningEn: 'A person or party with an interest or concern in a business',
    synonyms: ['Shareholder', 'Partner', 'Investor'],
    antonyms: [],
  },
  forecast: {
    meaningEn: 'A prediction or projection of future business or economic trends',
    synonyms: ['Prediction', 'Projection', 'Estimate'],
    antonyms: [],
  },
  acquire: {
    meaningEn: 'To buy or take over ownership of an asset or company',
    synonyms: ['Purchase', 'Buy out', 'Obtain'],
    antonyms: ['Sell', 'Relinquish'],
  },
  liability: {
    meaningEn: 'A financial debt or obligation for which an entity is responsible',
    synonyms: ['Obligation', 'Debt', 'Burden'],
    antonyms: ['Asset'],
  },

  // b2-u4: Science & Environment
  carbon: {
    meaningEn: 'A nonmetallic chemical element that is the basis of all organic life',
    synonyms: ['Carbon element', 'Graphite', 'Charcoal'],
    antonyms: [],
  },
  renewable: {
    meaningEn: 'Energy or resources capable of being replenished naturally',
    synonyms: ['Sustainable', 'Inexhaustible', 'Replenishable'],
    antonyms: ['Non-renewable', 'Finite'],
  },
  emission: {
    meaningEn: 'The discharge of pollutants or greenhouse gases into the air',
    synonyms: ['Discharge', 'Release', 'Exhalation'],
    antonyms: ['Absorption', 'Containment'],
  },
  sustainable: {
    meaningEn: 'Able to be maintained without depleting natural resources or harming nature',
    synonyms: ['Eco-friendly', 'Renewable', 'Viable'],
    antonyms: ['Unsustainable', 'Depleting'],
  },
  molecule: {
    meaningEn: 'A group of atoms bonded together representing a chemical unit',
    synonyms: ['Particle', 'Atomic unit'],
    antonyms: [],
  },
  atmosphere: {
    meaningEn: 'The layer of gases surrounding the earth or another celestial body',
    synonyms: ['Air', 'Aerosphere', 'Sky'],
    antonyms: [],
  },
  biodiversity: {
    meaningEn: 'The variety and variability of life forms on Earth or in an ecosystem',
    synonyms: ['Biological variety', 'Ecological diversity'],
    antonyms: ['Monoculture'],
  },
  deforestation: {
    meaningEn: 'The clearing or thinning of forests by humans for land use',
    synonyms: ['Logging', 'Tree clearance', 'Forest loss'],
    antonyms: ['Afforestation', 'Reforestation'],
  },
  phenomenon: {
    meaningEn: 'A remarkable fact or situation that is observed to happen or exist',
    synonyms: ['Occurrence', 'Event', 'Marvel'],
    antonyms: [],
  },
  contaminate: {
    meaningEn: 'To make something impure or dangerous by polluting it with chemicals',
    synonyms: ['Pollute', 'Poison', 'Infect'],
    antonyms: ['Purify', 'Decontaminate'],
  },

  // b2-u5: Politics & Government
  democracy: {
    meaningEn: 'A government system by the whole population through elected representatives',
    synonyms: ['Representative government', 'Republic'],
    antonyms: ['Autocracy', 'Dictatorship'],
  },
  parliament: {
    meaningEn: 'A legislative body representing voters, enacting laws and overseeing government',
    synonyms: ['Congress', 'Legislature', 'Assembly'],
    antonyms: [],
  },
  legislation: {
    meaningEn: 'A law or set of laws enacted by a legislative authority',
    synonyms: ['Law', 'Statute', 'Act'],
    antonyms: [],
  },
  referendum: {
    meaningEn: 'A direct vote by all voters on a specific political question',
    synonyms: ['Plebiscite', 'Public ballot', 'Vote'],
    antonyms: [],
  },
  policy: {
    meaningEn: 'A course or principle of action adopted by a government or organization',
    synonyms: ['Strategy', 'Protocol', 'Code'],
    antonyms: [],
  },
  corruption: {
    meaningEn: 'Dishonest or fraudulent conduct by those in power, typically involving bribery',
    synonyms: ['Bribery', 'Graft', 'Dishonesty'],
    antonyms: ['Integrity', 'Honesty'],
  },
  sanction: {
    meaningEn: 'A coercive measure or penalty imposed on a nation to enforce compliance',
    synonyms: ['Embargo', 'Penalty', 'Restriction'],
    antonyms: ['Reward', 'Endorsement'],
  },
  sovereignty: {
    meaningEn: 'The authority of a state to govern itself or another state',
    synonyms: ['Autonomy', 'Independence', 'Self-governance'],
    antonyms: ['Subjugation', 'Dependency'],
  },
  alliance: {
    meaningEn: 'A pact or relationship between countries or parties for mutual benefit',
    synonyms: ['Coalition', 'Pact', 'Treaty'],
    antonyms: ['Hostility', 'Enmity'],
  },
  constitution: {
    meaningEn: 'A system of fundamental laws and principles governing a nation',
    synonyms: ['Charter', 'Fundamental law', 'Canons'],
    antonyms: [],
  },

  // b2-u6: Law & Justice
  defendant: {
    meaningEn: 'An individual or party sued or accused in a court of law',
    synonyms: ['Accused', 'Litigant', 'Respondent'],
    antonyms: ['Prosecutor', 'Plaintiff'],
  },
  verdict: {
    meaningEn: 'The formal finding or decision of a jury or judge in a court case',
    synonyms: ['Judgment', 'Ruling', 'Finding'],
    antonyms: [],
  },
  prosecute: {
    meaningEn: 'To institute legal proceedings against a person or organization',
    synonyms: ['Indict', 'Sue', 'Charge'],
    antonyms: ['Defend', 'Pardon'],
  },
  testimony: {
    meaningEn: 'A formal written or spoken statement given in a court of law',
    synonyms: ['Evidence', 'Deposition', 'Witness statement'],
    antonyms: [],
  },
  jurisdiction: {
    meaningEn: 'The official authority to make legal decisions and enforce laws',
    synonyms: ['Authority', 'Legal power', 'Control'],
    antonyms: [],
  },
  penalty: {
    meaningEn: 'A punishment imposed for breaking a law, rule, or contract',
    synonyms: ['Punishment', 'Fine', 'Sentence'],
    antonyms: ['Reward', 'Bounty'],
  },
  attorney: {
    meaningEn: 'A professional legal practitioner authorized to represent clients in court',
    synonyms: ['Lawyer', 'Counsel', 'Barrister'],
    antonyms: [],
  },
  appeal: {
    meaningEn: 'An application to a higher court for a review of a legal decision',
    synonyms: ['Petition', 'Plea', 'Rehearing'],
    antonyms: [],
  },
  bail: {
    meaningEn: 'Money paid as a deposit to ensure an accused person returns for trial',
    synonyms: ['Security deposit', 'Bond', 'Collateral'],
    antonyms: [],
  },
  statute: {
    meaningEn: 'A formal written law enacted by a legislative authority',
    synonyms: ['Act', 'Law', 'Enactment'],
    antonyms: [],
  },

  // b2-u7: Media & Communication
  propaganda: {
    meaningEn: 'Information used to promote a political cause, often biased or misleading',
    synonyms: ['Disinformation', 'Indoctrination', 'Promotion'],
    antonyms: ['Objective truth'],
  },
  censorship: {
    meaningEn: 'The suppression or prohibition of books, films, or news deemed objectionable',
    synonyms: ['Suppression', 'Blackout', 'Restriction'],
    antonyms: ['Freedom of speech', 'Openness'],
  },
  journalism: {
    meaningEn: 'The profession of reporting, writing, and delivering news stories',
    synonyms: ['The press', 'News reporting', 'Media'],
    antonyms: [],
  },
  narrative: {
    meaningEn: 'A spoken or written account of connected events; a story or perspective',
    synonyms: ['Story', 'Tale', 'Account'],
    antonyms: [],
  },
  circulation: {
    meaningEn: 'The average number of copies distributed by a newspaper or magazine',
    synonyms: ['Distribution', 'Readership', 'Dissemination'],
    antonyms: [],
  },
  editorial: {
    meaningEn: 'An article giving the opinion of the editor on a topical issue',
    synonyms: ['Opinion piece', 'Leader', 'Commentary'],
    antonyms: [],
  },
  anonymous: {
    meaningEn: 'Having an undisclosed or unknown name or authorship',
    synonyms: ['Unnamed', 'Unidentified', 'Nameless'],
    antonyms: ['Named', 'Identified'],
  },
  platform: {
    meaningEn: 'A digital service or environment for sharing content and applications',
    synonyms: ['Medium', 'Forum', 'Venue'],
    antonyms: [],
  },
  credibility: {
    meaningEn: 'The quality of being believable, trustworthy, and reliable',
    synonyms: ['Trustworthiness', 'Reliability', 'Plausibility'],
    antonyms: ['Incredibility', 'Unreliability'],
  },
  misinformation: {
    meaningEn: 'Inaccurate or false information spread regardless of intent to deceive',
    synonyms: ['Falsehood', 'Disinformation', 'Myth'],
    antonyms: ['Truth', 'Accurate news'],
  },

  // b2-u8: Health & Medicine
  immunology: {
    meaningEn: 'The medical and biological science of immune systems and defense mechanisms',
    synonyms: ['Immune science'],
    antonyms: [],
  },
  pathogen: {
    meaningEn: 'A biological agent such as a virus or bacterium that causes disease',
    synonyms: ['Germ', 'Microorganism', 'Infectious agent'],
    antonyms: [],
  },
  epidemic: {
    meaningEn: 'A widespread occurrence of an infectious disease in a community at one time',
    synonyms: ['Outbreak', 'Plague', 'Scourge'],
    antonyms: ['Endemic'],
  },
  antibiotics: {
    meaningEn: 'Medicines that inhibit the growth of or destroy bacterial microorganisms',
    synonyms: ['Antibacterials', 'Penicillin', 'Antimicrobial'],
    antonyms: [],
  },
  clinical: {
    meaningEn: 'Relating to direct observation and medical treatment of patients',
    synonyms: ['Medical', 'Practical', 'Bedside'],
    antonyms: ['Theoretical'],
  },
  obesity: {
    meaningEn: 'The medical condition of having excess body fat that impairs health',
    synonyms: ['Corpulency', 'Overweight', 'Adiposity'],
    antonyms: ['Leanness', 'Underweight'],
  },
  rehabilitation: {
    meaningEn: 'Therapy and training to restore health and normal life after illness or injury',
    synonyms: ['Recovery', 'Therapy', 'Restoration'],
    antonyms: ['Deterioration'],
  },
  inflammation: {
    meaningEn: 'A bodily response to injury or infection characterized by redness and swelling',
    synonyms: ['Swelling', 'Redness', 'Irritation'],
    antonyms: [],
  },
  diagnosis: {
    meaningEn: 'The identification of a medical condition from examination of symptoms',
    synonyms: ['Identification', 'Analysis', 'Assessment'],
    antonyms: [],
  },

  // b2-u9: Arts & Culture
  aesthetic: {
    meaningEn: 'Concerned with beauty, artistic taste, and appreciation of art',
    synonyms: ['Artistic', 'Tasteful', 'Graceful'],
    antonyms: ['Unaesthetic', 'Unattractive'],
  },
  abstract: {
    meaningEn: 'Art or thought that does not represent external reality realistically',
    synonyms: ['Non-representational', 'Conceptual', 'Theoretical'],
    antonyms: ['Concrete', 'Realistic'],
  },
  renaissance: {
    meaningEn: 'A revival of European cultural, artistic, and intellectual life',
    synonyms: ['Rebirth', 'Revival', 'Resurgence'],
    antonyms: ['Decline'],
  },
  masterpiece: {
    meaningEn: 'A work of outstanding artistry, technique, or workmanship',
    synonyms: ['Magnum opus', 'Tour de force', 'Classic'],
    antonyms: [],
  },
  depict: {
    meaningEn: 'To portray or represent someone or something in an artistic work',
    synonyms: ['Portray', 'Illustrate', 'Render'],
    antonyms: [],
  },
  heritage: {
    meaningEn: 'Valued traditions, culture, and historic artifacts passed down generations',
    synonyms: ['Tradition', 'Legacy', 'Inheritance'],
    antonyms: [],
  },
  folklore: {
    meaningEn: 'Traditional stories, customs, and beliefs passed orally through generations',
    synonyms: ['Mythology', 'Traditions', 'Oral history'],
    antonyms: [],
  },
  patron: {
    meaningEn: 'A benefactor who provides financial support to artists or organizations',
    synonyms: ['Benefactor', 'Sponsor', 'Supporter'],
    antonyms: [],
  },
  symbolism: {
    meaningEn: 'The practice of using symbols to represent ideas and deeper meanings in art',
    synonyms: ['Allegory', 'Metaphor', 'Representation'],
    antonyms: ['Literalism'],
  },
  architecture: {
    meaningEn: 'The discipline and art of designing and erecting buildings and structures',
    synonyms: ['Building design', 'Construction', 'Structural design'],
    antonyms: [],
  },

  // b2-u10: Global Issues
  poverty: {
    meaningEn: 'The state of being extremely poor and lacking basic resources',
    synonyms: ['Destitution', 'Hardship', 'Deprivation'],
    antonyms: ['Wealth', 'Affluence'],
  },
  inequality: {
    meaningEn: 'Unfair situation where some people have more rights or money than others',
    synonyms: ['Disparity', 'Imbalance', 'Injustice'],
    antonyms: ['Equality', 'Parity'],
  },
  refugee: {
    meaningEn: 'A person forced to leave their country to escape war or persecution',
    synonyms: ['Displaced person', 'Asylum seeker', 'Exile'],
    antonyms: [],
  },
  humanitarian: {
    meaningEn: 'Devoted to promoting human welfare and assisting those in distress',
    synonyms: ['Compassionate', 'Benevolent', 'Philanthropic'],
    antonyms: ['Callous', 'Inhumane'],
  },
  migration: {
    meaningEn: 'The movement of people from one region to another to reside',
    synonyms: ['Relocation', 'Exodus', 'Resettlement'],
    antonyms: [],
  },
  conflict: {
    meaningEn: 'A prolonged armed struggle or profound dispute between opposing factions',
    synonyms: ['Dispute', 'Clash', 'Hostility'],
    antonyms: ['Peace', 'Harmony'],
  },
  diplomacy: {
    meaningEn: 'The practice of maintaining international relations and negotiating peace',
    synonyms: ['Foreign relations', 'Statesmanship', 'Negotiation'],
    antonyms: [],
  },
  famine: {
    meaningEn: 'An extreme and widespread scarcity of food causing starvation',
    synonyms: ['Starvation', 'Food crisis', 'Drought'],
    antonyms: ['Abundance', 'Plenty'],
  },
  exploitation: {
    meaningEn: 'The act of treating people unfairly in order to profit from their labour',
    synonyms: ['Abuse', 'Misuse', 'Oppression'],
    antonyms: ['Fairness', 'Justice'],
  },
  solidarity: {
    meaningEn: 'Mutual support and unity within a group sharing common aims and values',
    synonyms: ['Unity', 'Camaraderie', 'Alliance'],
    antonyms: ['Division', 'Discord'],
  },

  // b2-u11: Technology & Innovation
  algorithm: {
    meaningEn: 'A step-by-step procedure for solving a computational problem',
    synonyms: ['Formula', 'Procedure', 'Routine'],
    antonyms: [],
  },
  automation: {
    meaningEn: 'The use of technological systems to perform tasks with minimal human input',
    synonyms: ['Mechanization', 'Computerization', 'Robotics'],
    antonyms: ['Manual operation'],
  },
  cybersecurity: {
    meaningEn: 'Practices and measures ensuring protection of digital systems from attacks',
    synonyms: ['Information security', 'Network defense', 'Data protection'],
    antonyms: ['Vulnerability'],
  },
  innovation: {
    meaningEn: 'The introduction of new ideas, devices, or novel methods',
    synonyms: ['Novelty', 'Breakthrough', 'Modernization'],
    antonyms: ['Stagnation'],
  },
  prototype: {
    meaningEn: 'A preliminary model built to evaluate a design concept or process',
    synonyms: ['Sample', 'Mock-up', 'Pilot model'],
    antonyms: ['Production model'],
  },
  semiconductor: {
    meaningEn: 'A material that conducts electricity under some conditions used in computer microchips',
    synonyms: ['Microchip material', 'Silicon chip'],
    antonyms: [],
  },
  bandwidth: {
    meaningEn: 'The maximum data transmission rate of an internet or communications channel',
    synonyms: ['Data capacity', 'Throughput', 'Transmission capacity'],
    antonyms: [],
  },
  disruptive: {
    meaningEn: 'Innovatively transforming an industry by displacing established models',
    synonyms: ['Revolutionary', 'Transformative', 'Groundbreaking'],
    antonyms: ['Conventional', 'Traditional'],
  },
  encrypt: {
    meaningEn: 'To convert data into coded cipher text to prevent unauthorized access',
    synonyms: ['Encode', 'Cipher', 'Scramble'],
    antonyms: ['Decrypt', 'Decode'],
  },
  infrastructure: {
    meaningEn: 'Basic physical structures and systems needed for society to function',
    synonyms: ['Framework', 'Facilities', 'Base'],
    antonyms: [],
  },

  // b2-u12: Psychology & Behaviour
  cognitive: {
    meaningEn: 'Relating to mental processes of understanding, memory, and reasoning',
    synonyms: ['Mental', 'Intellectual', 'Perceptual'],
    antonyms: [],
  },
  subconscious: {
    meaningEn: 'Operating below the threshold of fully active conscious awareness',
    synonyms: ['Unconscious', 'Implicit', 'Latent'],
    antonyms: ['Conscious'],
  },
  motivation: {
    meaningEn: 'The internal drive or incentive that compels a person to act',
    synonyms: ['Drive', 'Incentive', 'Inspiration'],
    antonyms: ['Apathy', 'Demotivation'],
  },
  anxiety: {
    meaningEn: 'A feeling of distress, worry, or nervousness regarding future outcomes',
    synonyms: ['Nervousness', 'Unease', 'Apprehension'],
    antonyms: ['Calm', 'Confidence'],
  },
  resilience: {
    meaningEn: 'The psychological capacity to recover swiftly from adversity',
    synonyms: ['Toughness', 'Adaptability', 'Strength'],
    antonyms: ['Fragility', 'Vulnerability'],
  },
  perception: {
    meaningEn: 'The process of interpreting sensory information to understand the environment',
    synonyms: ['Insight', 'Awareness', 'Impression'],
    antonyms: [],
  },
  behaviour: {
    meaningEn: 'The observable manner in which an individual acts or reacts to stimuli',
    synonyms: ['Conduct', 'Deportment', 'Actions'],
    antonyms: [],
  },
  stereotype: {
    meaningEn: 'A conventional and oversimplified conception of an entire group',
    synonyms: ['Cliché', 'Generalization', 'Preset notion'],
    antonyms: [],
  },
  trauma: {
    meaningEn: 'A deeply distressing emotional response to a severe event or injury',
    synonyms: ['Shock', 'Injury', 'Wound'],
    antonyms: ['Healing'],
  },
  empathy: {
    meaningEn: 'The capability to comprehend and vicariously experience the feelings of others',
    synonyms: ['Compassion', 'Sympathy', 'Fellow-feeling'],
    antonyms: ['Apathy', 'Insensitivity'],
  },

  // b2-u13: Education & Academia
  curriculum: {
    meaningEn: 'The organized sequence of courses and learning goals in an educational program',
    synonyms: ['Syllabus', 'Course of study', 'Program'],
    antonyms: [],
  },
  dissertation: {
    meaningEn: 'A comprehensive academic thesis written to attain a doctoral degree',
    synonyms: ['Thesis', 'Academic treatise', 'Paper'],
    antonyms: [],
  },
  scholarship: {
    meaningEn: 'Financial grant funding awarded to a student to support academic studies',
    synonyms: ['Fellowship', 'Bursary', 'Endowment'],
    antonyms: [],
  },
  methodology: {
    meaningEn: 'The systematic, theoretical framework of methods employed in research',
    synonyms: ['System', 'Approach', 'Strategy'],
    antonyms: [],
  },
  academic: {
    meaningEn: 'Relating to scholarly education, colleges, or formal research',
    synonyms: ['Scholarly', 'Educational', 'Intellectual'],
    antonyms: ['Non-academic', 'Practical'],
  },
  plagiarism: {
    meaningEn: 'The unethical appropriation and publication of another author thoughts as one own',
    synonyms: ['Copying', 'Infringement', 'Piracy'],
    antonyms: ['Originality'],
  },
  seminar: {
    meaningEn: 'An advanced university course or conference focused on specialized group study',
    synonyms: ['Workshop', 'Colloquium', 'Tutorial'],
    antonyms: [],
  },
  peer: {
    meaningEn: 'An individual of equal academic standing, age, or professional status',
    synonyms: ['Equal', 'Colleague', 'Contemporary'],
    antonyms: ['Superior', 'Subordinate'],
  },
  thesis: {
    meaningEn: 'A proposition or formal research treatise submitted for a university degree',
    synonyms: ['Dissertation', 'Monograph', 'Argument'],
    antonyms: [],
  },
  enroll: {
    meaningEn: 'To officially register into a formal course or educational institution',
    synonyms: ['Register', 'Sign up', 'Matriculate'],
    antonyms: ['Withdraw', 'Drop out'],
  },
};

const wordsFilePath = path.join(__dirname, '../src/data/words.json');
const rawData = fs.readFileSync(wordsFilePath, 'utf8');
const data = JSON.parse(rawData);

let updatedCount = 0;

for (const level in data.levels) {
  for (const unit of data.levels[level].units) {
    for (const w of unit.words) {
      const lower = w.word.trim().toLowerCase();
      const def = DEFINITIONS[lower];

      // 1. Standardize meaningAr
      if (!w.meaningAr && w.meaning) {
        w.meaningAr = w.meaning;
      }
      if (!w.meaning && w.meaningAr) {
        w.meaning = w.meaningAr;
      }

      // 2. Add meaningEn if missing
      if (!w.meaningEn && def && def.meaningEn) {
        w.meaningEn = def.meaningEn;
      } else if (!w.meaningEn && w.example) {
        w.meaningEn = `Related to ${w.category || 'general vocabulary'}: ${w.word}`;
      }

      // 3. Standardize examples array
      if (!w.examples || !Array.isArray(w.examples) || w.examples.length === 0) {
        if (w.example) {
          w.examples = [w.example];
        } else {
          w.examples = [];
        }
      }

      // 4. Enrich synonyms and antonyms
      if ((!w.synonyms || w.synonyms.length === 0) && def && def.synonyms) {
        w.synonyms = def.synonyms;
      }
      if ((!w.antonyms || w.antonyms.length === 0) && def && def.antonyms) {
        w.antonyms = def.antonyms;
      }

      // 5. Image query
      if (!w.imageQuery) {
        w.imageQuery = `${w.word} ${w.category || ''}`.trim();
      }

      updatedCount++;
    }
  }
}

fs.writeFileSync(wordsFilePath, JSON.stringify(data, null, 2), 'utf8');
console.log(`Successfully normalized ${updatedCount} words in words.json!`);
