import { HealthStatus } from '../types/animal.types';

export interface SeverityTier {
  status: HealthStatus;
  baseDays: number;
  desirabilityBoost: number;
  label: string;
}

export const SEVERITY_TIERS: Record<HealthStatus, SeverityTier> = {
  [HealthStatus.HEALTHY]: {
    status: HealthStatus.HEALTHY,
    baseDays: 0,
    desirabilityBoost: 0,
    label: 'Healthy'
  },
  [HealthStatus.MINOR]: {
    status: HealthStatus.MINOR,
    baseDays: 2,
    desirabilityBoost: 5,
    label: 'Minor Injury'
  },
  [HealthStatus.MODERATE]: {
    status: HealthStatus.MODERATE,
    baseDays: 4,
    desirabilityBoost: 15,
    label: 'Moderate Condition'
  },
  [HealthStatus.SERIOUS]: {
    status: HealthStatus.SERIOUS,
    baseDays: 7,
    desirabilityBoost: 30,
    label: 'Serious Illness'
  },
  [HealthStatus.CRITICAL]: {
    status: HealthStatus.CRITICAL,
    baseDays: 12,
    desirabilityBoost: 60,
    label: 'Critical Condition'
  }
};
