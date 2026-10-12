import { DISEASES, SYMPTOMS, NORMAL_TEMP_C } from '../data/knowledge.js';

const DISCLAIMER =
  'This is an educational risk indicator based on the symptoms you entered. It is NOT a veterinary diagnosis. ' +
  'Contact a qualified veterinarian for diagnosis and treatment.';

export function assess({ species, symptoms = [], temperatureC }) {
  const set = new Set(symptoms);
  const notes = [];

  const range = NORMAL_TEMP_C[species];
  if (typeof temperatureC === 'number' && range) {
    if (temperatureC > range[1] + 0.4) {
      set.add('fever');
      notes.push(`Temperature ${temperatureC}°C is above the usual range for ${species} (${range[0]}-${range[1]}°C).`);
    } else if (temperatureC < range[0] - 1.0) {
      notes.push(`Temperature ${temperatureC}°C is below the usual range for ${species}. Low body temperature can be serious.`);
    }
  }

  const known = new Set(SYMPTOMS.map((s) => s.id));
  const selected = [...set].filter((s) => known.has(s));

  const matches = DISEASES.filter((d) => d.species.includes(species))
    .map((d) => {
      const total = Object.values(d.symptoms).reduce((a, b) => a + b, 0);
      const hit = Object.entries(d.symptoms).filter(([id]) => set.has(id));
      const hitWeight = hit.reduce((a, [, w]) => a + w, 0);
      // Favour diseases that explain more of the animal's symptoms AND are well covered.
      const coverage = hitWeight / total;
      const explained = selected.length ? hit.length / selected.length : 0;
      const score = 0.6 * coverage + 0.4 * explained;
      return { d, hit: hit.map(([id]) => id), score };
    })
    .filter((m) => m.hit.length > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map(({ d, hit, score }) => ({
      id: d.id,
      name: d.name,
      matchPercent: Math.round(score * 100),
      matchedSymptoms: hit,
      summary: d.summary,
      prevention: d.prevention,
      contagious: !!d.contagious,
      zoonotic: !!d.zoonotic,
      notifiable: !!d.notifiable,
    }));

  const emergencySymptoms = SYMPTOMS.filter((s) => s.emergency && set.has(s.id)).map((s) => s.label);
  const top = matches[0];
  const hotTemp = typeof temperatureC === 'number' && range && temperatureC >= range[1] + 1.5;

  let riskLevel = 'low';
  if (selected.length >= 2 || set.has('fever')) riskLevel = 'moderate';
  if (
    (set.has('fever') && selected.length >= 3) ||
    (top && top.contagious && top.matchPercent >= 40) ||
    hotTemp
  ) riskLevel = 'high';
  if (emergencySymptoms.length > 0) riskLevel = 'emergency';
  if (selected.length === 0) riskLevel = 'low';

  const advice = {
    low: [
      'Monitor the animal closely over the next 24 hours and record changes.',
      'Check feed, water and housing conditions.',
      'Call a veterinarian if symptoms continue or get worse.',
    ],
    moderate: [
      'Separate the animal from the herd/flock as a precaution.',
      'Record temperature and symptoms twice a day.',
      'Arrange a veterinary check within 24 hours.',
    ],
    high: [
      'Isolate the animal now and limit contact with other animals and people.',
      'Contact a veterinarian today.',
      'Avoid sharing equipment; wash hands and disinfect boots after handling.',
    ],
    emergency: [
      'Contact a veterinarian IMMEDIATELY. Do not wait.',
      'Isolate the animal; keep it calm, comfortable and with access to clean water if it can drink.',
      'Do not give home remedies or medicines without veterinary guidance.',
    ],
  }[riskLevel];

  if (matches.some((m) => m.zoonotic)) {
    notes.push('Some possible conditions can spread to people. Wear gloves and wash hands after handling the animal.');
  }
  if (matches.some((m) => m.notifiable) && riskLevel !== 'low') {
    notes.push('Some possible conditions are reportable. Inform your veterinarian or local animal husbandry office.');
  }

  return {
    riskLevel,
    emergencySymptoms,
    possibleConditions: matches,
    advice,
    notes,
    disclaimer: DISCLAIMER,
  };
}
