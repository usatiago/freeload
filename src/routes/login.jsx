// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 freeLoad contributors
import { createFileRoute } from "@tanstack/react-router";
import { LoginPage } from "@/components/auth/LoginPage";

export const Route = createFileRoute("/login")({ ssr: false, component: LoginPage });