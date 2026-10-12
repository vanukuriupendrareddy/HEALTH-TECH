import mongoose from 'mongoose';

const vaccinationSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    animal: { type: mongoose.Schema.Types.ObjectId, ref: 'Animal', required: true, index: true },
    vaccine: { type: String, required: true, trim: true },
    dueDate: { type: Date, required: true },
    givenDate: { type: Date },
    administeredBy: { type: String, trim: true },
    batchNo: { type: String, trim: true },
    notes: { type: String, maxlength: 500 },
  },
  { timestamps: true }
);

export default mongoose.model('Vaccination', vaccinationSchema);
