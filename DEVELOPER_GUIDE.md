# Tangelo App: Developer Guide

This document provides a technical overview of the Tangelo wedding planner application. It is intended for developers working on the project to understand its architecture, conventions, and key implementation details.

---

## 1. Project Overview

Tangelo is an AI-powered, mobile-first web application designed to simplify the process of planning Nigerian weddings. It combines traditional planning tools (checklists, budgets, guest lists) with modern AI-powered features to provide a personalized and culturally-aware experience.

The current version is a feature-rich demo that operates without a backend database, using mock data and browser `localStorage` for persistence to showcase its capabilities.

---

## 2. Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (using the App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Framework**: [React](https://react.dev/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/) - A collection of reusable components built on Radix UI and Tailwind CSS.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with a custom theme defined in `src/app/globals.css` using HSL CSS variables.
- **AI Integration**: [Genkit](https://firebase.google.com/docs/genkit) (specifically `@genkit-ai/googleai`) for connecting to Google's Gemini models.
- **Data Persistence**:
  - **Primary Data**: Mock data located in `src/lib/mockData.ts`. This simulates data that would typically come from a database.
  - **User-Generated Data**: The browser's `localStorage` is used to persist user changes for features like saved vendors and floorplan layouts.
- **Linting & Formatting**: ESLint and Prettier (integrated into Next.js).

---

## 3. Project Structure

The project follows a standard Next.js App Router structure.

```
.
├── src
│   ├── app/                # Main application routes (pages)
│   │   ├── (page_name)/    # Folder for each route (e.g., dashboard, budget)
│   │   │   └── page.tsx    # The main component for the route
│   │   ├── layout.tsx      # Root layout, includes Header and Footer
│   │   └── globals.css     # Global styles and CSS variable theming
│   │
│   ├── actions/            # Server Actions for form submissions and AI calls
│   │   └── *.ts
│   │
│   ├── ai/                 # Genkit AI-related code
│   │   ├── flows/          # Genkit flow definitions
│   │   ├── genkit.ts       # Genkit global initialization
│   │   └── dev.ts          # Entry point for the Genkit development server
│   │
│   ├── components/         # Reusable React components
│   │   ├── ai/             # AI-specific components
│   │   ├── auth/           # Authentication components
│   │   ├── budget/         # Components for the Budget page
│   │   ├── dashboard/      # Widgets and components for the Dashboard
│   │   ├── guests/         # Components for Guest Management
│   │   ├── layout/         # Header, Footer, Nav items
│   │   ├── ui/             # ShadCN UI components (auto-generated)
│   │   └── vendors/        # Components for Vendor Marketplace
│   │
│   ├── hooks/              # Custom React hooks
│   │   ├── use-auth.ts     # Mock authentication context
│   │   └── use-selected-vendors.ts # Manages saved vendors via localStorage
│   │
│   └── lib/                # Libraries, utilities, and core files
│       ├── mockData.ts     # Mock data source for the demo
│       ├── types.ts        # TypeScript type definitions
│       └── utils.ts        # Utility functions (e.g., cn for classnames)
│
├── public/                 # Static assets (images, fonts, etc.)
├── package.json            # Project dependencies and scripts
└── next.config.ts          # Next.js configuration
```

---

## 4. Key Features & Implementation

### 4.1. Multi-Event Architecture

A core concept is that a wedding can consist of multiple events (e.g., "Traditional Wedding," "White Wedding Reception"). This is handled by:
- **Data Filtering**: Pages like Budget, Checklist, and Guests use `Tabs` to switch between events. Data is filtered based on the `activeEvent` state.
- **Component Props**: Components often receive a `currentEvent` prop to know which data to display or modify.
- **Mock Data Structure**: The mock data in `src/lib/mockData.ts` includes an `event` property on tasks, expenses, and guests to associate them with a specific event.

### 4.2. AI Integration (Genkit)

AI features are powered by Genkit flows defined in `src/ai/flows/`.

- **Flows**: Each AI feature has its own flow file (e.g., `moodboard-search-flow.ts`). A flow defines the AI's logic, including prompts, tools, and input/output schemas (using Zod).
- **Server Actions**: The UI calls AI flows via Server Actions defined in `src/actions/`. This keeps API keys and complex logic on the server-side, away from the client.
- **Tools (Function Calling)**: The moodboard flow demonstrates AI tool use. The AI is given a `googleImageSearch` tool that it can decide to call. This tool is a TypeScript function that uses the `apify-client` to scrape Google Images.

To add a new AI feature:
1.  Define a new flow in `src/ai/flows/`.
2.  Import and register the flow in `src/ai/dev.ts`.
3.  Create a new Server Action in `src/actions/` to call the flow.
4.  Call the Server Action from a client component, typically using `useActionState`.

### 4.3. Floorplan Editor

- **Location**: `src/app/floorplan/editor/page.tsx`
- **Library**: Uses the `fabric` library for the 2D canvas editor.
- **State Management**: The `fabric.Canvas` instance is stored in a `useRef` to persist it across re-renders.
- **Persistence**: The layout for each event is saved to `localStorage` using a unique key (`floorplanLayout-${eventName}`). The `useEffect` hook handles loading the saved layout or a default template when the component mounts or the event tab is changed.

### 4.4. Data Persistence (Demo Mode)

In the absence of a database:
- **`localStorage`**: Hooks like `use-selected-vendors.ts` read from and write to `localStorage` to simulate a persistent state for user selections. The floorplan editor does this directly.
- **React State**: For data that doesn't need to persist across sessions (e.g., adding a task to the checklist), the application modifies the state of the component directly. A page refresh will reset this data to the initial state defined in `mockData.ts`.

---

## 5. Local Development

### 5.1. Prerequisites

- Node.js (v18 or later)
- npm or yarn

### 5.2. Setup

1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Environment Variables**:
    Create a `.env` file in the project root. You will need API keys for the AI features.
    ```env
    # For Google Gemini Models via Genkit
    GOOGLE_API_KEY="your-google-api-key"

    # For the Web Search tool in the Moodboard feature
    APIFY_API_TOKEN="your-apify-api-token"
    ```

### 5.3. Running the Application

You need to run **two separate servers** in two different terminals for all features to work correctly.

**Terminal 1: Next.js App**
This runs the main web application.
```bash
npm run dev
```
The application will be available at `http://localhost:3000`.

**Terminal 2: Genkit AI Server**
This runs the local development server for the AI flows, allowing the Next.js app to communicate with them.
```bash
npm run genkit:dev
```
Alternatively, to have the server auto-restart on changes to flow files:
```bash
npm run genkit:watch
```
The Genkit developer UI will be available at `http://localhost:4000`, which is useful for inspecting flows, viewing logs, and testing prompts.

---

This guide provides a starting point for understanding the Tangelo application. As the project evolves, this document should be updated to reflect new features and architectural changes.