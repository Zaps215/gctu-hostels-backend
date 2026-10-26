const mongoose = require('mongoose');
require('dotenv').config();
const Hostel = require('./models/Hostel');

const sampleHostels = [
  {
    name: 'Unidaz Hostel',
    university: 'GCTU',
    ownershipType: 'Private Hostel',
    genderCategory: 'Mixed',
    location: 'Tesano, near GCTU Back Gate',
    distanceFromCampus: '3 mins walk',
    price: 3500,
    paymentTerm: 'per academic year',
    roomTypesAvailable: ['1-in-a-room', '2-in-a-room', '4-in-a-room'],
    coverImage: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
    amenities: ['Wi-Fi', '24/7 Water', 'Security', 'Study Room', 'Standby Generator'],
    isAvailable: true,
    contactPhone: '+233 20 000 0000',
    officialUrl: 'https://unidazh.com'
  },
  {
    name: 'Delicious Hostel',
    university: 'GCTU',
    ownershipType: 'Private Hostel',
    genderCategory: 'Female',
    location: 'Tesano Police Station Area',
    distanceFromCampus: '5 mins walk',
    price: 2800,
    paymentTerm: 'per academic year',
    roomTypesAvailable: ['2-in-a-room', '4-in-a-room'],
    coverImage: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
    amenities: ['Wi-Fi', 'Water Tank', 'CCTV Security', 'Fitted Kitchen'],
    isAvailable: true,
    contactPhone: '+233 24 000 0000',
    officialUrl: ''
  },
  {
    name: 'Palace Hostel',
    university: 'GCTU',
    ownershipType: 'Private Hostel',
    genderCategory: 'Mixed',
    location: 'Near Unidaz Hostel, Tesano',
    distanceFromCampus: '7 mins walk',
    price: 1800,
    paymentTerm: 'per semester',
    roomTypesAvailable: ['1-in-a-room', '2-in-a-room'],
    coverImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
    amenities: ['Wi-Fi', 'En-suite bathrooms', 'Air Conditioning', 'Security Fencing'],
    isAvailable: true,
    contactPhone: '+233 27 000 0000',
    officialUrl: ''
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('📦 Connected to MongoDB for seeding...');

    // Clear existing hostel records to prevent duplicates during testing
    await Hostel.deleteMany({});
    console.log('🧹 Cleared existing hostel records.');

    // Insert fresh baseline data
    await Hostel.insertMany(sampleHostels);
    console.log('🚀 Successfully seeded GCTU baseline hostels!');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
};

seedDB();