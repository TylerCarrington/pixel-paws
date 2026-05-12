import { Rarity, DiscoveryMethod, HealthStatus } from './animal.types';

export interface CallTemplate {
  id: string;
  title: string;
  description: string;
  species: string;
  rarity: Rarity;
  discoveryMethod: DiscoveryMethod;
  requiredFacility: string[];
  healthStatus?: HealthStatus;
}

export interface DailyCall extends CallTemplate {
  instanceId: string;
  responded: boolean;
}
