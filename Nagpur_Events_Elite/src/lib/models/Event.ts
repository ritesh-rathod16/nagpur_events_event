import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    time: { type: String, required: true },
    fullAddress: { type: String },
  googleMapUrl: { type: String },
  // persisted coordinates for map pins
  locationLat: { type: Number },
  locationLng: { type: Number },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  status: { type: String, default: 'Registration Open' },
  date: { type: Date, required: true },
  capacity: { type: Number },
  countdown: { type: String },
  highlights: [{ type: String }],
  organizer: {
    name: { type: String },
    contact: { type: String },
    social: {
      instagram: { type: String },
      twitter: { type: String },
      website: { type: String },
    }
  },
  ticketTypes: [{
    name: { type: String },
    price: { type: Number },
    description: { type: String },
    quantityAvailable: { type: Number },
  }],
  agenda: [{
    time: { type: String },
    activity: { type: String },
  }],
  gallery: [{ type: String }],
  refundPolicy: { type: String, default: 'Refunds are available up to 24 hours before the event start time.' },
});

// create an index for location queries
EventSchema.index({ locationLat: 1, locationLng: 1 });

export default mongoose.models.Event || mongoose.model('Event', EventSchema);
