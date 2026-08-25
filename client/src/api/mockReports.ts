import type { Report } from '../types/report';

/**
 * In-memory mock dataset for offline / pre-backend development.
 * Mutations (resolveReport) write back to this array so the same browser
 * session reflects the change until the page is reloaded.
 */
export const mockReports: Report[] = [
  {
    _id: 'mock-1',
    type: 'Lost',
    itemName: 'Black leather wallet',
    category: 'Accessories',
    location: 'Main Library, 2nd floor',
    date: '2026-08-20T14:30:00.000Z',
    description:
      'Lost my black leather wallet near the reading room on Tuesday afternoon. Has my student ID and a few cards inside.',
    contactInfo: 'kasun.perera@university.edu',
    status: 'Active',
    createdAt: '2026-08-20T15:00:00.000Z',
    updatedAt: '2026-08-20T15:00:00.000Z',
  },
  {
    _id: 'mock-2',
    type: 'Found',
    itemName: 'Blue Hydro Flask',
    category: 'Bottles',
    location: 'Engineering Building, Room 204',
    date: '2026-08-22T09:15:00.000Z',
    description:
      'Found a 32oz blue Hydro Flask on the lab bench. Has a small sticker of a mountain on the side.',
    contactInfo: '+1 555 0142',
    status: 'Active',
    createdAt: '2026-08-22T10:00:00.000Z',
    updatedAt: '2026-08-22T10:00:00.000Z',
  },
  {
    _id: 'mock-3',
    type: 'Lost',
    itemName: 'AirPods Pro case',
    category: 'Electronics',
    location: 'Student Center cafeteria',
    date: '2026-08-19T12:00:00.000Z',
    description: 'Small white AirPods Pro case, no engraving. Likely fell out of my backpack pocket.',
    contactInfo: '@nimali on Discord',
    status: 'Resolved',
    createdAt: '2026-08-19T13:00:00.000Z',
    updatedAt: '2026-08-21T09:30:00.000Z',
  },
  {
    _id: 'mock-4',
    type: 'Found',
    itemName: 'Set of keys with red lanyard',
    category: 'Keys',
    location: 'Gym entrance',
    date: '2026-08-23T18:45:00.000Z',
    description: 'Found a key ring with about 4 keys and a red university lanyard near the gym front desk.',
    contactInfo: 'security desk, ext. 4100',
    status: 'Active',
    createdAt: '2026-08-23T19:00:00.000Z',
    updatedAt: '2026-08-23T19:00:00.000Z',
  },
  {
    _id: 'mock-5',
    type: 'Lost',
    itemName: 'Calculus textbook (Stewart, 8th ed.)',
    category: 'Books',
    location: 'Math Building, 3rd floor hallway',
    date: '2026-08-24T11:00:00.000Z',
    description:
      'Left my calculus textbook in the hallway outside Room 310. Has my name on the inside cover.',
    contactInfo: 'tharushi.s@university.edu',
    status: 'Active',
    createdAt: '2026-08-24T11:30:00.000Z',
    updatedAt: '2026-08-24T11:30:00.000Z',
  },
];

/** Simulate network latency so loading states are visible during dev. */
export const mockDelay = (ms = 250): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));
