# Mochi-OS

A modern dashboard-style web application powered by Next.js App Router, ShadCN UI, and Tailwind CSS. Mochi-OS integrates with the live Mochi backend to provide authenticated chat and friend management experiences alongside demo forums and feeds.

## Getting started

```bash
pnpm install
pnpm dev
```

> Replace `pnpm` with `npm` or `yarn` if desired.

## Tech highlights

- Next.js 14 App Router structure with protected layouts
- ShadCN-inspired component system styled for Material Design 3
- Light/Dark theming with persistence via `next-themes`
- Axios API client with JWT interception
- Feature hooks for authentication, chats, and friends

## Project structure

```
app/
  (protected)/         # Authenticated dashboard routes
  signin/              # Email + code login flow
  signup/              # Account creation flow
components/
  layout/              # Application shell
  navigation/          # Navigation and auth utilities
  ui/                  # Reusable UI primitives
contexts/              # Theme and auth providers
hooks/                 # Domain hooks (auth, chat, friends)
lib/                   # API client and utilities
```

## Environment

The application expects the Mochi backend to be available at `http://72.60.234.139/api`. Tokens are stored in both `localStorage` and cookies to support client and middleware access.
