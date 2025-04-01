
"use client"

import React from "react";
import { TooltipProvider } from "@radix-ui/react-tooltip";

interface TooltipProviderWrapperProps {
  children: React.ReactNode;
}

const TooltipProviderWrapper: React.FC<TooltipProviderWrapperProps> = ({ children }) => {
  return <TooltipProvider>{children}</TooltipProvider>;
};

export default TooltipProviderWrapper;
