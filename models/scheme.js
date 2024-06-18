import mongoose from 'mongoose';

const schemeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  ministry: { type: String, required: true },
  tags: { type: [String], required: true },
});

const Scheme = mongoose.model('Scheme', schemeSchema);

export default Scheme;

