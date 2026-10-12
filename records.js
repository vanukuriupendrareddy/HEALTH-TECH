import { Router } from 'express';
import HealthRecord from '../models/HealthRecord.js';
import Animal from '../models/Animal.js';
import { requireAuth } from '../middleware/auth.js';
import { pick, wrap } from '../utils/helpers.js';
import { assess } from '../utils/riskEngine.js';

const router = Router();
router.use(requireAuth);

const FIELDS = ['animal', 'date', 'type', 'symptoms', 'temperatureC', 'description', 'treatment', 'vetConsulted'];

router.get(
  '/',
  wrap(async (req, res) => {
    const filter = { owner: req.userId };
    if (req.query.animal) filter.animal = req.query.animal;
    res.json(await HealthRecord.find(filter).sort({ date: -1 }).limit(200).populate('animal', 'tagId name species'));
  })
);

router.post(
  '/',
  wrap(async (req, res) => {
    const data = pick(req.body, FIELDS);
    const animal = await Animal.findOne({ _id: data.animal, owner: req.userId });
    if (!animal) return res.status(404).json({ message: 'Animal not found' });

    if (Array.isArray(data.symptoms) && data.symptoms.length) {
      const result = assess({ species: animal.species, symptoms: data.symptoms, temperatureC: data.temperatureC });
      data.riskLevel = result.riskLevel;
      data.possibleConditions = result.possibleConditions.map((c) => c.name);
      if (['high', 'emergency'].includes(result.riskLevel) && animal.status === 'healthy') {
        animal.status = 'under-observation';
        await animal.save();
      }
    }
    const record = await HealthRecord.create({ ...data, owner: req.userId });
    res.status(201).json(record);
  })
);

router.delete(
  '/:id',
  wrap(async (req, res) => {
    const r = await HealthRecord.findOneAndDelete({ _id: req.params.id, owner: req.userId });
    if (!r) return res.status(404).json({ message: 'Record not found' });
    res.json({ message: 'Record deleted' });
  })
);

export default router;
