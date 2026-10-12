import { Router } from 'express';
import mongoose from 'mongoose';
import Animal from '../models/Animal.js';
import HealthRecord from '../models/HealthRecord.js';
import Vaccination from '../models/Vaccination.js';
import Checkup from '../models/Checkup.js';
import { requireAuth } from '../middleware/auth.js';
import { wrap } from '../utils/helpers.js';

const router = Router();
router.use(requireAuth);

router.get(
  '/',
  wrap(async (req, res) => {
    const owner = new mongoose.Types.ObjectId(req.userId);
    const now = new Date();
    const in30 = new Date(now.getTime() + 30 * 86400000);

    const [bySpecies, byStatus, overdue, upcomingVacc, upcomingCheckups, recent] = await Promise.all([
      Animal.aggregate([{ $match: { owner } }, { $group: { _id: '$species', count: { $sum: 1 } } }]),
      Animal.aggregate([{ $match: { owner } }, { $group: { _id: '$status', count: { $sum: 1 } } }]),
      Vaccination.find({ owner, givenDate: null, dueDate: { $lt: now } }).sort({ dueDate: 1 }).limit(10).populate('animal', 'tagId name species'),
      Vaccination.find({ owner, givenDate: null, dueDate: { $gte: now, $lte: in30 } }).sort({ dueDate: 1 }).limit(10).populate('animal', 'tagId name species'),
      Checkup.find({ owner, status: 'scheduled', scheduledAt: { $gte: now } }).sort({ scheduledAt: 1 }).limit(5).populate('animal', 'tagId name species'),
      HealthRecord.find({ owner }).sort({ date: -1 }).limit(5).populate('animal', 'tagId name species'),
    ]);

    const total = bySpecies.reduce((a, b) => a + b.count, 0);
    res.json({
      totalAnimals: total,
      bySpecies: Object.fromEntries(bySpecies.map((s) => [s._id, s.count])),
      byStatus: Object.fromEntries(byStatus.map((s) => [s._id, s.count])),
      overdueVaccinations: overdue,
      upcomingVaccinations: upcomingVacc,
      upcomingCheckups,
      recentRecords: recent,
    });
  })
);

export default router;
