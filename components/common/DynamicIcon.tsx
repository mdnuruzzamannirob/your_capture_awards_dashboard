'use client';
import React from 'react';
import * as LucideIcons from 'lucide-react';
import { toPascalCase } from '@/lib/utils';

interface DynamicIconProps {
  name: string;
  className?: string;
}

const ICON_ALIASES: Record<string, string> = {
  'number-circle': 'CircleGauge',
  'image-upload': 'ImageUp',
  'level-stars': 'ListChecks',
  'file-check': 'FileCheck2',
};

const DynamicIcon: React.FC<DynamicIconProps> = ({ name, className }) => {
  const icon = ICON_ALIASES[name] ?? toPascalCase(name);
  const IconComponent = (LucideIcons as any)[icon];

  if (!IconComponent) {
    return null; // fallback: nothing rendered
  }

  return <IconComponent className={className} />;
};

export default DynamicIcon;
