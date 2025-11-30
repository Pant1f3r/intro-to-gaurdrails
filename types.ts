import { LucideIcon } from 'lucide-react';

export interface Policy {
  title: string;
  description: string;
  subItems?: string[];
  icon?: LucideIcon;
}

export interface Faction {
  id: string;
  name: string;
  role: string;
  layer: 'Foundation' | 'Deployment' | 'Oversight';
  description: string;
  policies: Policy[];
  color: string;
  bgGradient: string;
  icon: LucideIcon;
}

export enum AppMode {
  VISUALIZER = 'VISUALIZER',
  LIVE_DEMO = 'LIVE_DEMO',
  SUMMARY = 'SUMMARY'
}

export interface SafetyRating {
  category: string;
  probability: string;
}
