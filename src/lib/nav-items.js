// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 freeLoad contributors
import { Dumbbell, History, Home, TrendingUp } from "lucide-react";

export const NAV_ITEMS = [
  { label: "Home", to: "/", icon: Home },
  { label: "Workouts", to: "/workouts", icon: Dumbbell },
  { label: "History", to: "/history", icon: History },
  { label: "Progress", to: "/progress", icon: TrendingUp },
];

export function isActivePath(pathname, to) {
  if (to === "/") return pathname === "/";
  return pathname === to || pathname.startsWith(`${to}/`);
}