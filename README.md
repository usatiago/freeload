# freeLoad

Create workouts, start one from your saved list or start empty and add exercises
as you go, log every set, and watch your progress over time. Age, height and
weight are kept in your profile; the Google Health connection reads and writes
those figures through your own Google Cloud credentials.

Licensed under the **GNU General Public License v3.0 or later** — see
[LICENSE](./LICENSE).

## Stack

- [TanStack Start](https://tanstack.com/start) (React 19) with file-based routes
- Vite for the build, Tailwind CSS for styling
- Base44 for authentication, database, storage and hosting

## Requirements

- Node.js 20 or newer
- npm (or pnpm / yarn / bun)

## Getting the source

Sync this project to your own GitHub repository from the app's dashboard
(Source / GitHub sync), then:

```bash
git clone https://github.com/<you>/<repo>.git
cd <repo>
npm install
```

## Running it locally

```bash
npm run dev       # dev server with hot reload
```

The dev server needs the app's backend (auth + database) to be reachable, so it
is normally started from the Base44 editor. Building and type-checking locally
needs no backend:

```bash
npm run build     # production build
npm run preview   # serve the production build
npm run lint      # eslint
```

## Project layout

```
src/routes/           file-based routes (each file is a URL)
src/routes/_authed/   pages behind the sign-in gate
src/components/       UI components
src/lib/              server functions, helpers, exercise catalog
base44/entities/      database schemas (JSON)
```

Server functions live in `src/lib/*-fns.js` and run on the Base44 backend — they
read and write the records in `base44/entities/`.

## Building an installable mobile app

Base44 publishes this same codebase as an installed iOS/Android app from the
dashboard. There is no separate native (Kotlin/Gradle) project to maintain: the
build scripts above are the whole build.

## Contributing

Contributions are welcome. By submitting a change you agree to license it under
GPL-3.0-or-later. Keep the SPDX header at the top of each source file.

## License

```
freeLoad
Copyright (C) 2026 <copyright holder>

This program is free software: you can redistribute it and/or modify it under
the terms of the GNU General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later
version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE.  See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with
this program.  If not, see <https://www.gnu.org/licenses/>.
`