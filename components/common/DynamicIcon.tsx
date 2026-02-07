'use client';
import React from 'react';
import * as LucideIcons from 'lucide-react';
import { toPascalCase } from '@/lib/utils';

interface DynamicIconProps {
  name: string;
  className?: string;
}

const DynamicIcon: React.FC<DynamicIconProps> = ({ name, className }) => {
  const icon = toPascalCase(name);
  const IconComponent = (LucideIcons as any)[icon];

  if (!IconComponent) {
    return null; // fallback: nothing rendered
  }

  return <IconComponent className={className} />;
};

export default DynamicIcon;
