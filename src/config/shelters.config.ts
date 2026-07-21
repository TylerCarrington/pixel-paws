export interface ShelterListing {
  id: string;
  name: string;
  cost: number;
  image: string;
  location: string;
  charm: number; // out of 5
  curbAppeal: string;
  proximityDesc: string;
  yearBuilt: string;
  specialFeature: string;
}

export const SHELTER_LISTINGS: ShelterListing[] = [
  {
    id: 'shelter_cherry',
    name: 'The Cherry Blossom Shelter',
    cost: 500,
    image: '/src/assets/images/shelters/shelter-exterior-1.png',
    location: 'Near the Riverside Path',
    charm: 5,
    curbAppeal: 'High',
    proximityDesc: 'Very Close',
    yearBuilt: 'Recently Renovated',
    specialFeature: 'Cherry blossom tree drops petals on the pathway all spring',
  },
  {
    id: 'shelter_riverside',
    name: 'The Riverside Refuge',
    cost: 750,
    image: '/src/assets/images/shelters/shelter-exterior-2.png',
    location: 'By the Stream',
    charm: 4,
    curbAppeal: 'Scenic',
    proximityDesc: 'Right Beside It',
    yearBuilt: 'Vintage Character',
    specialFeature: 'Wake up to the sound of the stream every morning',
  },
  {
    id: 'shelter_garden',
    name: 'The Garden Path Sanctuary',
    cost: 1000,
    image: '/src/assets/images/shelters/shelter-exterior-3.png',
    location: 'Old Estate Grounds',
    charm: 5,
    curbAppeal: 'Storybook',
    proximityDesc: 'Generous Garden',
    yearBuilt: 'Timeless',
    specialFeature: 'Wisteria blooms attract butterflies in the summer',
  },
  {
    id: 'shelter_lantern',
    name: 'The Lantern Street Shelter',
    cost: 1250,
    image: '/src/assets/images/shelters/shelter-exterior-4.png',
    location: 'Traditional Quarter',
    charm: 4,
    curbAppeal: 'Elegant',
    proximityDesc: 'Lantern-lit',
    yearBuilt: 'Traditional',
    specialFeature: 'Lanterns light your way home every evening',
  },
  {
    id: 'shelter_hilltop',
    name: 'The Hilltop Haven',
    cost: 1500,
    image: '/src/assets/images/shelters/shelter-exterior-5.png',
    location: 'Overlooking the Village',
    charm: 4,
    curbAppeal: 'Modern Rustic',
    proximityDesc: 'Overlooks the Village',
    yearBuilt: 'Brand New',
    specialFeature: 'Best sunset view in town from the deck',
  }
];
