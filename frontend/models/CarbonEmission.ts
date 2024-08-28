import mongoose from 'mongoose';

const CarbonEmissionSchema = new mongoose.Schema({  
  date: {
    type: Date,
    required: [true, 'Please provide a date'],
  },
  sector: {
    type: String,
    required: [true, 'Please provide a sector'],
  },
  value: {
    type: Number,
    required: [true, 'Please provide a value'],
  },
  timestamp: {
    type: Date,
    default: () => new Date(), 
  },
});

export default mongoose.models.CarbonEmission || mongoose.model('CarbonEmission', CarbonEmissionSchema);
