import { Router } from 'express';
import { SYMPTOMS, DISEASES, ARTICLES, RESOURCES, VACCINE_TEMPLATES } from '../data/knowledge.js';
import Vet from '../models/Vet.js';
import { requireAuth } from '../middleware/auth.js';
import { pick, wrap } from '../utils/helpers.js';

const router = Router();

// Public educational content
router.get('/symptoms', (_req, res) => res.json(SYMPTOMS));
router.get('/diseases', (req, res) => {
  const { species } = req.query;
  const list = species ? DISEASES.filter((d) => d.species.includes(species)) : DISEASES;
  res.json(
    list.map(({ id, name, species: sp, summary, prevention, contagious, zoonotic, notifiable }) => ({
      id, name, species: sp, summary, prevention, contagious: !!contagious, zoonotic: !!zoonotic, notifiable: !!notifiable,
    }))
  );
});
router.get('/articles', (_req, res) => res.json(ARTICLES));
router.get('/resources', (_req, res) => res.json(RESOURCES));
router.get('/vaccine-templates', (_req, res) => res.json(VACCINE_TEMPLATES));

// Veterinary contacts (per user)
const VET_FIELDS = ['name', 'clinic', 'phone', 'village', 'specialization', 'emergency24x7', 'notes'];

router.get('/vets', requireAuth, wrap(async (req, res) => {
  res.json(await Vet.find({ owner: req.userId }).sort({ name: 1 }));
}));

router.post('/vets', requireAuth, wrap(async (req, res) => {
  res.status(201).json(await Vet.create({ ...pick(req.body, VET_FIELDS), owner: req.userId }));
}));

router.put('/vets/:id', requireAuth, wrap(async (req, res) => {
  const v = await Vet.findOneAndUpdate({ _id: req.params.id, owner: req.userId }, pick(req.body, VET_FIELDS), {
    new: true,
    runValidators: true,
  });
  if (!v) return res.status(404).json({ message: 'Vet not found' });
  res.json(v);
}));

router.delete('/vets/:id', requireAuth, wrap(async (req, res) => {
  const v = await Vet.findOneAndDelete({ _id: req.params.id, owner: req.userId });
  if (!v) return res.status(404).json({ message: 'Vet not found' });
  res.json({ message: 'Deleted' });
}));

export default router;
