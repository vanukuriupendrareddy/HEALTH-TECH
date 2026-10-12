import { Router } from 'express';
import Checkup from '../models/Checkup.js';
import Animal from '../models/Animal.js';
import { requireAuth } from '../middleware/auth.js';
import { pick, wrap } from '../utils/helpers.js';

const router = Router();
router.use(requireAuth);

const FIELDS = ['animal', 'scheduledAt', 'vetName', 'vetPhone', 'reason', 'status', 'outcome'];

router.get(
  '/',
  wrap(async (req, res) => {
    const filter = { owner: req.userId };
    if (req.query.animal) filter.animal = req.query.animal;
    if (req.query.status) filter.status = req.query.status;
    res.json(await Checkup.find(filter).sort({ scheduledAt: 1 }).populate('animal', 'tagId name species'));
  })
);

router.post(
  '/',
  wrap(async (req, res) => {
    const data = pick(req.body, FIELDS);
    if (!(await Animal.exists({ _id: data.animal, owner: req.userId }))) {
      return res.status(404).json({ message: 'Animal not found' });
    }
    res.status(201).json(await Checkup.create({ ...data, owner: req.userId }));
  })
);

router.patch(
  '/:id',
  wrap(async (req, res) => {
    const update = pick(req.body, FIELDS.filter((f) => f !== 'animal'));
    const c = await Checkup.findOneAndUpdate({ _id: req.params.id, owner: req.userId }, update, {
      new: true,
      runValidators: true,
    });
    if (!c) return res.status(404).json({ message: 'Checkup not found' });
    res.json(c);
  })
);

router.delete(
  '/:id',
  wrap(async (req, res) => {
    const c = await Checkup.findOneAndDelete({ _id: req.params.id, owner: req.userId });
    if (!c) return res.status(404).json({ message: 'Checkup not found' });
    res.json({ message: 'Deleted' });
  })
);

export default router;
