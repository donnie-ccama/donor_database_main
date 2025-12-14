# Citykid Donor CRM

A modern, open-source Donor Management System (CRM) for nonprofits, built with Next.js 14 and Supabase.

## Features

- **Dashboard**: Real-time analytics and fundraising activity.
- **Donor Management**: Detailed profiles, gift history, and contact info.
- **Gift Tracking**: Record and manage donations, pledges, and grants.
- **Segments**: Group donors for targeted communications.
- **Data Import**: Easy-to-use CSV import wizard with column mapping.
- **Secure**: Powered by Supabase Auth and Row Level Security (RLS).

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: CSS Modules with a custom design system (Variables & HSL)
- **Backend**: Supabase (PostgreSQL, Auth, Edge Functions)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

1.  Node.js 18+ installed.
2.  A Supabase project.

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/donor-management.git
    cd donor-management
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Set up environment variables:
    Create a `.env.local` file in the root directory and add:
    ```bash
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  Run the development server:
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) with your browser.

## Database Setup

This project uses Supabase. Run the provided SQL schema in your Supabase SQL Editor to set up the necessary tables and security policies.

## Deployment

The easiest way to deploy this app is to use the [Vercel Platform](https://vercel.com/new).

1.  Push your code to a GitHub repository.
2.  Import the project into Vercel.
3.  Add the `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` environment variables.
4.  Deploy!

## License

MIT
