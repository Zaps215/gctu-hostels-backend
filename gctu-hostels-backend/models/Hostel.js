const mongoose = require('mongoose');

const hostelSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Hostel name is required'], 
    trim: true 
  },
  university: {
    type: String,
    required: true,
    enum: ['GCTU', 'UG', 'UPSA', 'Other'],
    default: 'GCTU'
  },
  ownershipType: {
    type: String,
    required: true,
    enum: ['Private Hostel', 'University Hostel', 'Private Apartment'],
    default: 'Private Hostel'
  },
  genderCategory: { 
    type: String, 
    required: true, 
    enum: ['Male', 'Female', 'Mixed'],
    default: 'Mixed'
  },
  location: { 
    type: String, 
    required: true, 
    default: 'Tesano, Accra' 
  },
  distanceFromCampus: {
    type: String, // e.g., "3 mins walk", "On Campus"
    default: 'Walking distance'
  },
  price: { 
    type: Number, 
    required: true 
  },
  paymentTerm: {
    type: String,
    required: true,
    enum: ['per semester', 'per academic year', 'per month'],
    default: 'per academic year'
  },
  roomTypesAvailable: [{
    type: String // e.g., ['1-in-a-room', '2-in-a-room', '4-in-a-room']
  }],
  coverImage: {
    type: String,
    required: true
  },
  amenities: [{ 
    type: String // e.g., ['Wi-Fi', '24/7 Water', 'CCTV Security', 'Standby Generator']
  }],
  isAvailable: { 
    type: Boolean, 
    default: true 
  },
  contactPhone: { 
    type: String 
  },
  officialUrl: { 
    type: String 
  },
  // Architecture hook for Landlord Portal later
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('Hostel', hostelSchema);