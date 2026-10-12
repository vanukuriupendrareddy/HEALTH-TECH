import { Router } from 'express';
import Animal from '../models/Animal.js';
import HealthRecord from '../models/HealthRecord.js';
import Vaccination from '../models/Vaccination.js';
import Checkup from '../models/Checkup.js';
import { requireAuth } from '../middleware/auth.js';
import { pick, wrap } from '../utils/helpers.js';
import { VACCINE_TEMPLATES } from '../data/knowledge.js';

const router = Router();
router.use(requireAuth);

const FIELDS = ['tagId', 'name', 'species', 'breed', 'sex', 'dateOfBirth', 'weightKg', 'flockSize', 'notes', 'status'];

router.get(
  '/',
  wrap(async (req, res) => {
    const filter = { owner: req.userId };
    if (req.query.species) filter.species = req.query.species;
    if (req.query.status) filter.status = req.query.status;
    res.json(await Animal.find(filter).sort({ createdAt: -1 }));
  })
);

router.post(
  '/',
  wrap(async (req, res) => {
    const animal = await Animal.create({ ...pick(req.body, FIELDS), owner: req.userId });
    res.status(201).json(animal);
  })
);

router.get(
  '/:id',
  wrap(async (req, res) => {
    const animal = await Animal.findOne({ _id: req.params.id, owner: req.userId });
    if (!animal) return res.status(404).json({ message: 'Animal not found' });
    res.json(animal);
  })
);

router.put(
  '/:id',
  wrap(async (req, res) => {
    const animal = await Animal.findOneAndUpdate(
      { _id: req.params.id, owner: req.userId },
      pick(req.body, FIELDS),
      { new: true, runValidators: true }
    );
    if (!animal) return res.status(404).json({ message: 'Animal not found' });
    res.json(animal);
  })
);

router.delete(
  '/:id',
  wrap(async (req, res) => {
    const animal = await Animal.findOneAndDelete({ _id: req.params.id, owner: req.userId });
    if (!animal) return res.status(404).json({ message: 'Animal not found' });
    await Promise.all([
      HealthRecord.deleteMany({ animal: animal._id }),
      Vaccination.deleteMany({ animal: animal._id }),
      Checkup.deleteMany({ animal: animal._id }),
    ]);
    res.json({ message: 'Animal and related records deleted' });
  })
);

// Create reminders from the illustrative species template. Farmers should adjust with their vet.
router.post(
  '/:id/vaccination-plan',
  wrap(async (req, res) => {
    const animal = await Animal.findOne({ _id: req.params.id, owner: req.userId });
    if (!animal) return res.status(404).json({ message: 'Animal not found' });
    const start = req.body.startDate ? new Date(req.body.startDate) : new Date();
    if (Number.isNaN(start.getTime())) return res.status(400).json({ message: 'Invalid startDate' });
    const items = (VACCINE_TEMPLATES[animal.species] || []).map((t) => ({
      owner: req.userId,
      animal: animal._id,
      vaccine: t.vaccine,
      dueDate: new Date(start.getTime() + 14 * 86400000), // first reminder two weeks out
      notes: 'Auto-generated from general template. Confirm the schedule with your veterinarian.',
    }));
    const created = await Vaccination.insertMany(items);
    res.status(201).json(created);
  })
);

export default router;
