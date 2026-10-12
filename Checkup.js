import mongoose from 'mongoose';

const checkupSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    animal: { type: mongoose.Schema.Types.ObjectId, ref: 'Animal', required: true, index: true },
    scheduledAt: { type: Date, required: true },
    vetName: { type: String, trim: true },
    vetPhone: { type: String, trim: true },
    reason: { type: String, required: true, trim: true, maxlength: 300 },
    status: { type: String, enum: ['scheduled', 'completed', 'cancelled'], default: 'scheduled' },
    outcome: { type: String, maxlength: 1000 },
  },
  { timestamps: true }
);

export default mongoose.model('Checkup', checkupSchema);
