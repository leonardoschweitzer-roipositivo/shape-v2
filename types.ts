import React from 'react';

export interface BodyMetric {
  id: string;
  label: string;
  value: number;
  unit: string;
  target?: number;
  ideal?: number;
  status?: 'on-track' | 'warning' | 'neutral';
  diff?: number;
  icon: React.ReactNode;
}

export interface NavItem {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  pro?: boolean;
  href?: string;
}