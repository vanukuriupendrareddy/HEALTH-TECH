import mongoose from 'mongoose';

export const SPECIES = ['cattle', 'buffalo', 'goat', 'sheep', 'poultry'];

const animalSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    tagId: { type: String, required: true, trim: true },
    name: { type: String, trim: true },
    species: { type: String, enum: SPECIES, required: true },
    breed: { type: String, trim: true },
    sex: { type: String, enum: ['male', 'female'], default: 'female' },
    dateOfBirth: { type: Date },
    weightKg: { type: Number, min: 0 },
    // For poultry this represents a flock.
    flockSize: { type: Number, min: 1 },
    notes: { type: String, maxlength: 500 },
    status: { type: String, enum: ['healthy', 'under-observation', 'sick', 'sold', 'deceased'], default: 'healthy' },
  },
  { timestamps: true }
);

animalSchema.index({ owner: 1, tagId: 1 }, { unique: true });

export default mongoose.model('Animal', animalSchema);
