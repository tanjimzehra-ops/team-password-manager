# Team Password Manager

Enterprise-grade password management platform for teams. Securely store, manage, and share passwords with role-based access control and complete audit trails.

## Features

- 🔐 **Password Management** - Store and manage passwords for all your team's applications
- 👥 **Team Sharing** - Securely share passwords with team members
- 📁 **Categories** - Organize passwords by application type
- 🔍 **Quick Search** - Find any password instantly
- 📋 **One-Click Copy** - Copy usernames and passwords to clipboard
- ⚙️ **Role-Based Access** - Admin, Editor, and Viewer roles
- 📊 **Audit Logs** - Complete compliance trail
- 🛡️ **Enterprise Security** - AES-256 encryption

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **UI:** React 19, Tailwind CSS 4, shadcn/ui
- **Backend:** Convex (Real-time database)
- **Auth:** WorkOS AuthKit

## Getting Started

### Prerequisites

- Node.js 18.17+
- pnpm 9.15.0+
- Convex account
- WorkOS account

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Convex and WorkOS credentials

# Start the development server
pnpm dev
```

The app will be available at `http://localhost:3001`

### Convex Setup

```bash
# Login to Convex
npx convex login

# Create a new deployment
npx convex dev
```

## Project Structure

```
team-password-manager/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/             # React components
│   ├── ui/                # shadcn/ui components
│   └── theme-provider.tsx
├── convex/                 # Backend functions
│   ├── schema.ts         # Database schema
│   └── ...
├── lib/                    # Utilities
│   └── utils.ts          # cn() helper
├── package.json
└── README.md
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_CONVEX_URL` | Convex deployment URL |
| `WORKOS_CLIENT_ID` | WorkOS client ID |
| `WORKOS_API_KEY` | WorkOS API key |
| `WORKOS_COOKIE_PASSWORD` | Cookie encryption password |
| `NEXT_PUBLIC_APP_URL` | Application URL |

## Documentation

- [Product Requirements Document](./PRD.md)
- [Project Context](./project-context.md)

## License

MIT
