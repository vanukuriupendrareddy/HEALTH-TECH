import { Router } from 'express';
import Animal, { SPECIES } from '../models/Animal.js';
import { requireAuth } from '../middleware/auth.js';
import { wrap } from '../utils/helpers.js';
import { assess } from '../utils/riskEngine.js';

const router = Router();
router.use(requireAuth);

router.post(
  '/assess',
  wrap(async (req, res) => {
    let { species, animalId, symptoms, temperatureC } = req.body;
    if (animalId) {
      const animal = await Animal.findOne({ _id: animalId, owner: req.userId });
      if (!animal) return res.status(404).json({ message: 'Animal not found' });
      species = animal.species;
    }
    if (!SPECIES.includes(species)) return res.status(400).json({ message: 'Valid species is required' });
    if (!Array.isArray(symptoms) || symptoms.length === 0) {
      return res.status(400).json({ message: 'Select at least one symptom' });
    }
    const temp = temperatureC === '' || temperatureC == null ? undefined : Number(temperatureC);
    if (temp !== undefined && Number.isNaN(temp)) return res.status(400).json({ message: 'Invalid temperature' });
    res.json(assess({ species, symptoms, temperatureC: temp }));
  })
);

export default router;
