import mongoose from 'mongoose';

const vetSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    clinic: { type: String, trim: true, maxlength: 120 },
    phone: { type: String, required: true, trim: true },
    village: { type: String, trim: true },
    specialization: { type: String, trim: true },
    emergency24x7: { type: Boolean, default: false },
    notes: { type: String, maxlength: 300 },
  },
  { timestamps: true }
);

export default mongoose.model('Vet', vetSchema);
