import { Router } from 'express';
import Vaccination from '../models/Vaccination.js';
import Animal from '../models/Animal.js';
import { requireAuth } from '../middleware/auth.js';
import { pick, wrap } from '../utils/helpers.js';

const router = Router();
router.use(requireAuth);

const FIELDS = ['animal', 'vaccine', 'dueDate', 'givenDate', 'administeredBy', 'batchNo', 'notes'];

router.get(
  '/',
  wrap(async (req, res) => {
    const filter = { owner: req.userId };
    if (req.query.animal) filter.animal = req.query.animal;
    const now = new Date();
    if (req.query.status === 'pending') filter.givenDate = null;
    if (req.query.status === 'overdue') { filter.givenDate = null; filter.dueDate = { $lt: now }; }
    if (req.query.status === 'done') filter.givenDate = { $ne: null };
    const list = await Vaccination.find(filter).sort({ dueDate: 1 }).populate('animal', 'tagId name species');
    res.json(list);
  })
);

router.post(
  '/',
  wrap(async (req, res) => {
    const data = pick(req.body, FIELDS);
    if (!(await Animal.exists({ _id: data.animal, owner: req.userId }))) {
      return res.status(404).json({ message: 'Animal not found' });
    }
    res.status(201).json(await Vaccination.create({ ...data, owner: req.userId }));
  })
);

router.patch(
  '/:id',
  wrap(async (req, res) => {
    const update = pick(req.body, FIELDS.filter((f) => f !== 'animal'));
    const v = await Vaccination.findOneAndUpdate({ _id: req.params.id, owner: req.userId }, update, {
      new: true,
      runValidators: true,
    });
    if (!v) return res.status(404).json({ message: 'Vaccination not found' });
    res.json(v);
  })
);

router.delete(
  '/:id',
  wrap(async (req, res) => {
    const v = await Vaccination.findOneAndDelete({ _id: req.params.id, owner: req.userId });
    if (!v) return res.status(404).json({ message: 'Vaccination not found' });
    res.json({ message: 'Deleted' });
  })
);

export default router;
