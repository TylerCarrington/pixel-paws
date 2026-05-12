import { DiscoveryMethod, Species } from './animal.types';

export interface Call {
  id: string;
  title: string;
  description: string;
  species: Species;
  isMysterious: boolean;
  discoveryMethod: DiscoveryMethod;
  requiredFacility: string[];
}
