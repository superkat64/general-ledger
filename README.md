# General Ledger

<div align="center">
  <img src="./general-ledger-banner.png" alt="General Ledger Logo" width="200"/>
  
  A mobile-first personal finance tracker built to solve a data entry problem.
  
  🚧 [Live Demo](#) 🚧 • [Report Bug](https://github.com/superkat64/general-ledger/issues) • [Request Feature](https://github.com/superkat64/general-ledger/issues)
</div>

## The Problem

Existing budgeting apps either lack the flexibility and control I needed, or they're too cumbersome for quick mobile entry. Other tools had poor category identification and limited customization. I tried using an extensive Google Sheets setup, but editing on mobile was frustrating and clunky. I needed a solution that would let me capture transactions the moment they happen, from anywhere, with full control over my financial data.

## The Solution

General Ledger is a mobile-friendly web app designed for frictionless data entry. Add transactions to your database wherever and whenever you make a purchase, then track your budget in real-time with visual insights into your spending patterns.

## Current Features

- **Transaction Management**: Create and track financial transactions with amount, date, and categorization
- **Category System**: Organize spending with custom categories and subcategories
- **Mobile-First Design**: Optimized interface for quick entry on the go
- **Secure Authentication**: User authentication powered by Stack Auth

## Planned Features

- **Complete CRUD Operations**: Full create, read, update, and delete functionality for transactions, categories, subcategories, and financial institutions
- **Budget Tracking Dashboard**: Visual progress bars showing spending against budget limits
- **Spending Insights**: Pie charts breaking down expenses by category relative to income
- **Trend Analysis**: Track spending patterns over time to gain insights into financial habits

## Tech Stack

**Frontend**
- Next.js - React framework with server-side rendering
- React - UI component library
- Shadcn/ui - Component system for clean, accessible interfaces
- TypeScript - Type safety throughout the application

**Backend & Database**
- Neon - Serverless Postgres database
- Prisma - Type-safe database ORM
- Stack Auth - Authentication and user management

**Design System**

The app uses a trustworthy, clean color palette designed for financial clarity:

- **Primary Colors**: Deep Blue (#2563eb) for headers and primary actions, Slate Gray (#64748b) for body text
- **Financial Status**: Forest Green (#10b981) for income/credits, Ruby Red (#ef4444) for expenses/debits, Amber (#f59e0b) for warnings
- **Supporting Colors**: Light Blue (#eff6ff) for highlights, Warm Gray (#f3f4f6) for backgrounds, White (#ffffff) for surfaces

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- A Neon database account
- A Stack Auth project

### Installation

1. Clone the repository
```bash
git clone https://github.com/superkat64/general-ledger.git
cd general-ledger
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_STACK_PROJECT_ID=your_stack_project_id
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=your_stack_client_key
STACK_SECRET_SERVER_KEY=your_stack_secret_key
DATABASE_URL=your_neon_database_url
```

4. Set up the database
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Development Status

This project is currently in active development. Core transaction and category management features are functional, with the dashboard and additional CRUD operations planned for completion by end of December 2024. The app will be deployed to Fly.io once the initial feature set is complete.

## Why This Stack?

I chose an all-JavaScript stack to deepen my understanding of the modern JS ecosystem. The combination of Next.js, Prisma, and Neon provides excellent type safety, developer experience, and scalability for a personal finance application that needs to be reliable and maintainable.

## Contributing

This is a personal project, but suggestions and feedback are welcome! Feel free to open an issue if you have ideas for features or improvements.

## License

MIT

---

Built with curiosity about personal finance data and a desire for better mobile UX.