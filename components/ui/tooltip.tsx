'use client';

import * as React from 'react';

const TooltipProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;
const Tooltip = ({ children }: { children: React.ReactNode }) => <>{children}</>;
const TooltipTrigger = ({
  children,
  asChild,
}: {
  children: React.ReactNode;
  asChild?: boolean;
}) => <>{children}</>;
const TooltipContent = ({ children }: { children: React.ReactNode }) => <>{children}</>;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
