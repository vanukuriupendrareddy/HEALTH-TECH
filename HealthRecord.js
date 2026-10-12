import mongoose from 'mongoose';

const recordSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    animal: { type: mongoose.Schema.Types.ObjectId, ref: 'Animal', required: true, index: true },
    date: { type: Date, default: Date.now },
    type: { type: String, enum: ['symptom', 'illness', 'treatment', 'note'], default: 'symptom' },
    symptoms: [{ type: String, trim: true }],
    temperatureC: { type: Number, min: 30, max: 46 },
    description: { type: String, maxlength: 1000 },
    treatment: { type: String, maxlength: 1000 },
    vetConsulted: { type: Boolean, default: false },
    riskLevel: { type: String, enum: ['low', 'moderate', 'high', 'emergency'] },
    possibleConditions: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model('HealthRecord', recordSchema);
