import { Router } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { signToken, requireAuth } from '../middleware/auth.js';
import { wrap } from '../utils/helpers.js';

const router = Router();
const emailOk = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e || '');

router.post(
  '/register',
  wrap(async (req, res) => {
    const { name, email, password, phone, village, role } = req.body;
    if (!name || !emailOk(email)) return res.status(400).json({ message: 'Valid name and email are required' });
    if (!password || password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });
    if (await User.findOne({ email: email.toLowerCase() })) {
      return res.status(409).json({ message: 'An account with this email already exists' });
    }
    const hash = await bcrypt.hash(password, 12);
    const user = await User.create({
      name, email, password: hash, phone, village,
      role: role === 'veterinarian' ? 'veterinarian' : 'farmer',
    });
    res.status(201).json({
      token: signToken(user.id),
      user: { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone, village: user.village },
    });
  })
);

router.post(
  '/login',
  wrap(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email: (email || '').toLowerCase() }).select('+password');
    const ok = user && (await bcrypt.compare(password || '', user.password));
    if (!ok) return res.status(401).json({ message: 'Invalid email or password' });
    res.json({
      token: signToken(user.id),
      user: { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone, village: user.village },
    });
  })
);

router.get(
  '/me',
  requireAuth,
  wrap(async (req, res) => {
    const user = await User.findById(req.userId);
    if (!user) return res.status(401).json({ message: 'User no longer exists' });
    res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone, village: user.village } });
  })
);

export default router;
