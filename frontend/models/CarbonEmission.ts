import mongoose from 'mongoose';

const CarbonEmissionSchema = new mongoose.Schema({  
  date: {
    type: Date,
    default: () => new Date(), 
    required: [true, 'Please provide a date'],
  },
  fromTime: {
    type: Date,
    required: [true, 'Please provide a start time'],
  },
  toTime: {
    type: Date,
    required: [true, 'Please provide an end time'],
  },
  activity: {
    type: String,
    required: [true, 'Please provide a Activity'],
  },
  
  activityValue: {
    type: Number,
    required: [true, 'Please provide a value'],
  },
  activityHours: {
    type: Number,
    required: true
}, 
activityEmission: {
  type: Number,
  required: [true, 'Please provide a value'],
},
totalEmissions: {
  type: Number,
  required: true
},
methaneReleased: {
  type: Number,
  required: true
},
employeeCount: {
    type: Number,
    required: true
},
perCapitaEmissions: {
    type: Number,
    required: true
},
timestamp: {
    type: Date,
    default: () => new Date(), 
  },
});

export default mongoose.models.CarbonEmission || mongoose.model('CarbonEmission', CarbonEmissionSchema);
