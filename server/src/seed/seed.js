require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Report = require('../models/Report');

const sampleReports = [
  {
    type: 'Lost',
    itemName: 'Black Leather Wallet',
    category: 'Accessories',
    location: 'Main Library, 2nd Floor',
    date: new Date('2026-08-20'),
    description: 'A black leather bifold wallet with a student ID and a few cards inside. Lost near the study pods.',
    contactInfo: 'sam.perera@campus.edu',
    status: 'Active',
  },
  {
    type: 'Found',
    itemName: 'Blue Umbrella',
    category: 'Personal Items',
    location: 'Cafeteria, near entrance',
    date: new Date('2026-08-21'),
    description: 'Found a navy blue umbrella left behind on a table after the rain.',
    contactInfo: 'security@campus.edu',
    status: 'Active',
  },
  {
    type: 'Lost',
    itemName: 'Dell Laptop Charger',
    category: 'Electronics',
    location: 'Lecture Hall B',
    date: new Date('2026-08-19'),
    description: '65W Dell laptop charger, white cable with a small twist tie. Left plugged in near the front row.',
    contactInfo: 'nadeesha.k@campus.edu',
    status: 'Active',
  },
  {
    type: 'Found',
    itemName: 'Silver Wristwatch',
    category: 'Accessories',
    location: 'Sports Complex Locker Room',
    date: new Date('2026-08-18'),
    description: 'A silver analog wristwatch found on the bench near the lockers.',
    contactInfo: 'gym.admin@campus.edu',
    status: 'Resolved',
  },
  {
    type: 'Lost',
    itemName: 'Scientific Calculator',
    category: 'Stationery',
    location: 'Engineering Building, Room 204',
    date: new Date('2026-08-22'),
    description: 'Casio fx-991 calculator with name tag "R.Fernando" scratched on the back.',
    contactInfo: 'ravindu.f@campus.edu',
    status: 'Active',
  },
  {
    type: 'Found',
    itemName: 'Set of Keys',
    category: 'Personal Items',
    location: 'Parking Lot C',
    date: new Date('2026-08-23'),
    description: 'A set of 3 keys on a red keychain, found near the motorbike parking area.',
    contactInfo: 'security@campus.edu',
    status: 'Active',
  },
  {
    type: 'Lost',
    itemName: 'Prescription Glasses',
    category: 'Accessories',
    location: 'Student Cafeteria',
    date: new Date('2026-08-17'),
    description: 'Black-framed prescription glasses in a brown hard case.',
    contactInfo: 'ishara.m@campus.edu',
    status: 'Resolved',
  },
  {
    type: 'Found',
    itemName: 'USB Flash Drive',
    category: 'Electronics',
    location: 'Computer Lab 3',
    date: new Date('2026-08-24'),
    description: '32GB SanDisk flash drive found plugged into one of the lab desktops.',
    contactInfo: 'lab.assistant@campus.edu',
    status: 'Active',
  },
  {
    type: 'Lost',
    itemName: 'Grey Hoodie',
    category: 'Clothing',
    location: 'Basketball Court',
    date: new Date('2026-08-20'),
    description: 'Grey pullover hoodie with the university logo, left on the bleachers after practice.',
    contactInfo: 'kasun.j@campus.edu',
    status: 'Active',
  },
  {
    type: 'Found',
    itemName: 'Student ID Card',
    category: 'Documents',
    location: 'Main Gate Security Booth',
    date: new Date('2026-08-24'),
    description: 'Found a student ID card near the main gate, handed in to security.',
    contactInfo: 'security@campus.edu',
    status: 'Active',
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();
    await Report.deleteMany({});
    const inserted = await Report.insertMany(sampleReports);
    console.log(`Seeded ${inserted.length} reports into the database.`);
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

seedDatabase();
