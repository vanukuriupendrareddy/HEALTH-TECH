// Educational knowledge base for HEALTH TECH.
// This content supports farmer awareness only. It is NOT a diagnosis.

export const SYMPTOMS = [
  { id: 'fever', label: 'Fever / high body temperature', species: 'all' },
  { id: 'loss_appetite', label: 'Loss of appetite / off feed', species: 'all' },
  { id: 'depression', label: 'Dull, depressed, isolating from herd/flock', species: 'all' },
  { id: 'weight_loss', label: 'Weight loss / poor body condition', species: 'all' },
  { id: 'diarrhea', label: 'Diarrhea / loose droppings', species: 'all' },
  { id: 'bloody_diarrhea', label: 'Blood in dung / droppings', species: 'all', emergency: true },
  { id: 'labored_breathing', label: 'Difficult or rapid breathing', species: 'all', emergency: true },
  { id: 'cough', label: 'Coughing / sneezing', species: 'all' },
  { id: 'nasal_discharge', label: 'Nasal discharge', species: 'all' },
  { id: 'eye_discharge', label: 'Eye discharge / watery eyes', species: 'all' },
  { id: 'pale_gums', label: 'Pale gums / pale eyelids (anaemia)', species: 'all' },
  { id: 'hair_loss_itching', label: 'Itching, hair/feather loss, scratching', species: 'all' },
  { id: 'skin_lesions', label: 'Skin scabs, sores or lesions', species: 'all' },
  { id: 'sudden_death', label: 'Sudden deaths in the herd/flock', species: 'all', emergency: true },
  { id: 'convulsions', label: 'Convulsions / fits', species: 'all', emergency: true },
  { id: 'tremors', label: 'Tremors / twisted neck / circling', species: 'all' },
  { id: 'paralysis', label: 'Paralysis / unable to walk', species: 'all', emergency: true },
  { id: 'mouth_lesions', label: 'Blisters or sores in mouth / on tongue', species: 'ruminant' },
  { id: 'drooling', label: 'Excess drooling / frothing saliva', species: 'ruminant' },
  { id: 'lameness', label: 'Lameness / limping, sores between hooves', species: 'ruminant' },
  { id: 'reduced_milk', label: 'Sudden drop in milk yield', species: 'ruminant' },
  { id: 'swollen_udder', label: 'Hot, hard or swollen udder', species: 'ruminant' },
  { id: 'abnormal_milk', label: 'Clots, flakes, blood or watery milk', species: 'ruminant' },
  { id: 'bloat', label: 'Swollen left flank / bloated abdomen', species: 'ruminant', emergency: true },
  { id: 'skin_nodules', label: 'Firm skin lumps / nodules', species: 'ruminant' },
  { id: 'swollen_joints', label: 'Swollen joints or muscle swellings', species: 'ruminant' },
  { id: 'swollen_throat', label: 'Swelling of throat / brisket / head', species: 'all' },
  { id: 'abortion', label: 'Abortion / premature birth', species: 'ruminant' },
  { id: 'retained_placenta', label: 'Retained placenta after calving', species: 'ruminant' },
  { id: 'down_cannot_stand', label: 'Down and unable to stand (esp. after calving)', species: 'ruminant', emergency: true },
  { id: 'green_diarrhea', label: 'Greenish / whitish watery droppings', species: 'poultry' },
  { id: 'drop_egg_production', label: 'Sharp drop in egg production / soft-shelled eggs', species: 'poultry' },
  { id: 'comb_discoloration', label: 'Comb / wattles swollen or blue-purple', species: 'poultry' },
];

export const DISEASES = [
  {
    id: 'fmd', name: 'Foot and Mouth Disease (FMD)', species: ['cattle', 'buffalo', 'goat', 'sheep'],
    symptoms: { fever: 2, mouth_lesions: 3, drooling: 3, lameness: 2, reduced_milk: 1, loss_appetite: 1 },
    summary: 'Highly contagious viral disease causing blisters in the mouth and on feet.',
    prevention: 'Regular FMD vaccination (commonly every 6 months per local schedule), isolate sick animals, restrict visitors, disinfect sheds.',
    contagious: true, notifiable: true,
  },
  {
    id: 'mastitis', name: 'Mastitis', species: ['cattle', 'buffalo', 'goat', 'sheep'],
    symptoms: { swollen_udder: 3, abnormal_milk: 3, reduced_milk: 2, fever: 1 },
    summary: 'Inflammation of the udder, usually bacterial infection.',
    prevention: 'Clean, dry bedding; wash and dry teats before milking; post-milking teat dip; milk sick animals last; dry-cow management.',
  },
  {
    id: 'hs', name: 'Haemorrhagic Septicaemia (HS)', species: ['cattle', 'buffalo'],
    symptoms: { fever: 2, swollen_throat: 3, labored_breathing: 2, depression: 1, sudden_death: 2, drooling: 1 },
    summary: 'Acute bacterial disease, common in monsoon season, often rapidly fatal.',
    prevention: 'HS vaccination before monsoon, avoid stress and overcrowding, isolate sick animals promptly.',
    contagious: true,
  },
  {
    id: 'bq', name: 'Black Quarter (BQ)', species: ['cattle', 'buffalo', 'sheep', 'goat'],
    symptoms: { fever: 2, lameness: 2, swollen_joints: 3, sudden_death: 2, depression: 1 },
    summary: 'Bacterial disease causing painful, gas-filled muscle swellings, mostly in young animals.',
    prevention: 'BQ vaccination of young stock, proper carcass disposal (do not open carcasses), avoid grazing contaminated pasture.',
  },
  {
    id: 'lsd', name: 'Lumpy Skin Disease (LSD)', species: ['cattle', 'buffalo'],
    symptoms: { fever: 2, skin_nodules: 4, reduced_milk: 1, nasal_discharge: 1, eye_discharge: 1, swollen_joints: 1, loss_appetite: 1 },
    summary: 'Viral disease spread by biting insects causing skin nodules.',
    prevention: 'Vaccinate as advised by your veterinarian, control flies/mosquitoes, isolate affected animals, report outbreaks.',
    contagious: true, notifiable: true,
  },
  {
    id: 'bloat', name: 'Bloat (Ruminal tympany)', species: ['cattle', 'buffalo', 'goat', 'sheep'],
    symptoms: { bloat: 4, labored_breathing: 2, depression: 1, loss_appetite: 1 },
    summary: 'Gas build-up in the rumen, often after lush legumes or sudden feed change. Can be fatal within hours.',
    prevention: 'Introduce lush pasture gradually, feed dry roughage first, avoid wet legumes, provide clean water.',
  },
  {
    id: 'milk_fever', name: 'Milk Fever (Hypocalcaemia)', species: ['cattle', 'buffalo', 'goat', 'sheep'],
    symptoms: { down_cannot_stand: 4, tremors: 1, depression: 2, loss_appetite: 2 },
    summary: 'Low blood calcium around calving, especially in high-yielding animals.',
    prevention: 'Balanced transition-cow diet, correct calcium and magnesium levels, vet advice before calving.',
  },
  {
    id: 'ppr', name: 'Peste des Petits Ruminants (PPR)', species: ['goat', 'sheep'],
    symptoms: { fever: 2, nasal_discharge: 2, mouth_lesions: 2, diarrhea: 2, cough: 1, eye_discharge: 2, depression: 1 },
    summary: 'Highly contagious viral disease of goats and sheep.',
    prevention: 'PPR vaccination per schedule, quarantine new animals for 2-3 weeks, avoid mixing with unknown flocks.',
    contagious: true, notifiable: true,
  },
  {
    id: 'enterotox', name: 'Enterotoxaemia (Overeating disease)', species: ['goat', 'sheep', 'cattle'],
    symptoms: { sudden_death: 3, convulsions: 2, diarrhea: 2, bloat: 1, depression: 1 },
    summary: 'Toxin-producing bacteria multiply after sudden feed changes or rich diets.',
    prevention: 'Vaccinate before high-risk seasons, change feed gradually, avoid excess grain.',
  },
  {
    id: 'pox', name: 'Sheep / Goat Pox', species: ['goat', 'sheep'],
    symptoms: { fever: 2, skin_nodules: 3, skin_lesions: 2, eye_discharge: 1, nasal_discharge: 1 },
    summary: 'Viral disease with skin pox lesions and fever.',
    prevention: 'Vaccination, isolating affected animals, disinfecting sheds.',
    contagious: true,
  },
  {
    id: 'parasites_int', name: 'Internal Parasites (worms / liver fluke)', species: ['cattle', 'buffalo', 'goat', 'sheep'],
    symptoms: { weight_loss: 2, diarrhea: 2, pale_gums: 3, depression: 1, loss_appetite: 1 },
    summary: 'Roundworms, flukes and similar parasites cause anaemia, scouring and poor growth.',
    prevention: 'Strategic deworming guided by faecal tests, rotational grazing, clean water sources.',
  },
  {
    id: 'mange', name: 'Mange / External Parasites (ticks, lice, mites)', species: ['cattle', 'buffalo', 'goat', 'sheep', 'poultry'],
    symptoms: { hair_loss_itching: 4, skin_lesions: 2, weight_loss: 1, depression: 1 },
    summary: 'Skin parasites cause itching, hair/feather loss and reduced productivity; ticks also spread blood diseases.',
    prevention: 'Regular inspection, tick/lice control as advised by a vet, clean housing, dust-bathing areas for poultry.',
  },
  {
    id: 'brucellosis', name: 'Brucellosis', species: ['cattle', 'buffalo', 'goat', 'sheep'],
    symptoms: { abortion: 4, retained_placenta: 2, swollen_joints: 1, fever: 1 },
    summary: 'Bacterial disease causing late-term abortion. Can infect humans (zoonotic).',
    prevention: 'Vaccinate female calves (per vet/local programme), test breeding stock, wear gloves when handling aborted material, dispose of foetuses safely, boil milk.',
    zoonotic: true, notifiable: true,
  },
  {
    id: 'newcastle', name: 'Newcastle Disease (Ranikhet)', species: ['poultry'],
    symptoms: { green_diarrhea: 3, labored_breathing: 2, nasal_discharge: 1, tremors: 3, paralysis: 2, drop_egg_production: 2, sudden_death: 2, depression: 1 },
    summary: 'Highly contagious viral disease with respiratory, digestive and nervous signs.',
    prevention: 'Vaccination schedule (e.g. Lasota/Ranikhet), strict biosecurity, all-in/all-out management, no mixing with village birds.',
    contagious: true, notifiable: true,
  },
  {
    id: 'avian_flu', name: 'Avian Influenza (Bird Flu)', species: ['poultry'],
    symptoms: { sudden_death: 4, swollen_throat: 2, comb_discoloration: 3, drop_egg_production: 2, labored_breathing: 2, depression: 1, diarrhea: 1 },
    summary: 'Highly contagious viral disease with high mortality; some strains can infect humans.',
    prevention: 'Keep wild birds away, restrict visitors, disinfect, do not touch sick or dead birds, report unusual mortality immediately.',
    contagious: true, notifiable: true, zoonotic: true,
  },
  {
    id: 'gumboro', name: 'Infectious Bursal Disease (Gumboro)', species: ['poultry'],
    symptoms: { diarrhea: 2, depression: 2, loss_appetite: 2, sudden_death: 2, tremors: 1 },
    summary: 'Viral disease of young chicks that damages the immune system.',
    prevention: 'Vaccination of chicks, clean and disinfected brooder houses, good ventilation.',
    contagious: true,
  },
  {
    id: 'coccidiosis', name: 'Coccidiosis', species: ['poultry', 'goat', 'sheep', 'cattle'],
    symptoms: { bloody_diarrhea: 4, depression: 1, weight_loss: 1, pale_gums: 1, diarrhea: 2 },
    summary: 'Protozoal intestinal disease, common in young animals on damp, dirty bedding.',
    prevention: 'Keep litter and bedding dry, avoid overcrowding, clean feeders and waterers, anticoccidial programme per vet.',
  },
  {
    id: 'fowl_pox', name: 'Fowl Pox', species: ['poultry'],
    symptoms: { skin_lesions: 4, eye_discharge: 1, loss_appetite: 1, drop_egg_production: 1 },
    summary: 'Viral disease with scabby lesions on comb and wattles, spread by mosquitoes.',
    prevention: 'Vaccination, mosquito control, clean housing.',
    contagious: true,
  },
];

export const NORMAL_TEMP_C = {
  cattle: [37.8, 39.2],
  buffalo: [37.8, 39.2],
  goat: [38.5, 40.0],
  sheep: [38.5, 40.0],
  poultry: [40.6, 43.0],
};

// Illustrative schedule ONLY. Local schedules differ; always confirm with the local veterinarian.
export const VACCINE_TEMPLATES = {
  cattle: [
    { vaccine: 'Foot and Mouth Disease (FMD)', everyMonths: 6 },
    { vaccine: 'Haemorrhagic Septicaemia (HS)', everyMonths: 12 },
    { vaccine: 'Black Quarter (BQ)', everyMonths: 12 },
    { vaccine: 'Brucellosis (female calves 4-8 months)', everyMonths: 0 },
    { vaccine: 'Deworming (as per vet advice)', everyMonths: 4 },
  ],
  buffalo: [
    { vaccine: 'Foot and Mouth Disease (FMD)', everyMonths: 6 },
    { vaccine: 'Haemorrhagic Septicaemia (HS)', everyMonths: 12 },
    { vaccine: 'Black Quarter (BQ)', everyMonths: 12 },
    { vaccine: 'Deworming (as per vet advice)', everyMonths: 4 },
  ],
  goat: [
    { vaccine: 'PPR', everyMonths: 36 },
    { vaccine: 'Enterotoxaemia', everyMonths: 12 },
    { vaccine: 'Foot and Mouth Disease (FMD)', everyMonths: 6 },
    { vaccine: 'Goat Pox', everyMonths: 12 },
    { vaccine: 'Deworming (as per vet advice)', everyMonths: 3 },
  ],
  sheep: [
    { vaccine: 'PPR', everyMonths: 36 },
    { vaccine: 'Enterotoxaemia', everyMonths: 12 },
    { vaccine: 'Foot and Mouth Disease (FMD)', everyMonths: 6 },
    { vaccine: 'Sheep Pox', everyMonths: 12 },
    { vaccine: 'Deworming (as per vet advice)', everyMonths: 3 },
  ],
  poultry: [
    { vaccine: 'Marek\'s Disease (day-old, at hatchery)', everyMonths: 0 },
    { vaccine: 'Newcastle (Ranikhet / Lasota)', everyMonths: 3 },
    { vaccine: 'Infectious Bursal Disease (Gumboro)', everyMonths: 0 },
    { vaccine: 'Fowl Pox', everyMonths: 0 },
  ],
};

export const ARTICLES = [
  {
    id: 'hygiene', category: 'Hygiene', title: 'Daily shed and milking hygiene',
    points: [
      'Remove dung and wet bedding every day; keep floors dry and non-slippery.',
      'Wash hands and udder, dry with a clean cloth before milking; use clean steel or food-grade containers.',
      'Provide clean drinking water in clean troughs; scrub troughs weekly.',
      'Keep flies and rodents under control; store feed in closed bins.',
      'Wash and disinfect milking equipment after every use.',
    ],
  },
  {
    id: 'nutrition', category: 'Nutrition', title: 'Feeding for health and production',
    points: [
      'Give roughage (green and dry fodder) as the base of the ration; concentrate should supplement, not replace it.',
      'Change feeds gradually over 7-10 days to avoid bloat and acidosis.',
      'Provide a mineral mixture daily and clean water at all times.',
      'Feed dry cows and heifers a balanced ration; avoid over-conditioning before calving.',
      'Never feed mouldy, spoiled or wet feed. Check silage and grains for fungus.',
    ],
  },
  {
    id: 'biosecurity', category: 'Biosecurity', title: 'Keeping disease out of your farm',
    points: [
      'Quarantine new or returning animals for at least 2-3 weeks away from the main herd/flock.',
      'Limit visitors; provide a footbath and clean clothing/boots for essential entry.',
      'Do not share equipment, bedding or vehicles with other farms without disinfection.',
      'Separate sick animals immediately and handle them last.',
      'Dispose of carcasses and aborted material safely (deep burial or as advised by authorities).',
      'Report unusual deaths or blister/lump outbreaks to your veterinarian or local animal husbandry office.',
    ],
  },
  {
    id: 'vaccination', category: 'Prevention', title: 'Why vaccination calendars matter',
    points: [
      'Vaccinate healthy animals only; keep a written record of dates and batch numbers.',
      'Follow your local veterinarian\'s schedule: diseases and timing differ by region and season.',
      'Cold chain matters: store vaccines refrigerated and never use expired vials.',
      'Vaccinate before high-risk seasons (e.g. before monsoon for HS and BQ).',
    ],
  },
  {
    id: 'poultry', category: 'Poultry', title: 'Poultry flock management basics',
    points: [
      'Use all-in/all-out batches; clean and disinfect houses fully between batches.',
      'Keep litter dry; wet litter encourages coccidiosis and ammonia problems.',
      'Ensure good ventilation without cold drafts; provide correct stocking density.',
      'Keep wild birds and backyard birds away from commercial flocks.',
      'Report sudden high mortality immediately; do not sell or move birds.',
    ],
  },
  {
    id: 'emergency', category: 'Emergency', title: 'Signs that need a vet right away',
    points: [
      'Bloated left flank with difficulty breathing.',
      'Animal down and unable to rise, especially soon after calving.',
      'Convulsions, paralysis, or sudden collapse.',
      'Blood in dung/urine, or severe, persistent diarrhea.',
      'Multiple animals sick or dying within a day or two.',
      'Difficult birth that does not progress after normal straining.',
    ],
  },
];

// Seed national resources. Farmers add their own local vets in the app.
export const RESOURCES = [
  {
    name: 'Kisan Call Centre (India)',
    phone: '1800-180-1551',
    note: 'Toll-free farmer helpline for agriculture and allied-sector advice. Confirm current availability.',
  },
];
