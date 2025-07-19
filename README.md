# AI Marketplace

AI Marketplace is a Next.js 15 app that provides a curated marketplace of AI-powered tools, including text generation, code assistance, image analysis, data processing, web scraping, chat, summarization, and SEO analysis. Each tool is accessible via a modern web UI and powered by OpenAI's GPT-4o.

## Features

- **Smart Text Generator**: Generate high-quality content for blogs, emails, and marketing copy.
- **Code Assistant**: Get help with coding, debugging, and code optimization.
- **Image Analyzer**: Analyze images and extract detailed information and insights.
- **Data Processor**: Process and analyze data with AI-powered insights.
- **Web Scraper**: Extract and summarize information from websites.
- **Chat Assistant**: Conversational AI for support and queries.
- **Summary Generator**: Generate concise summaries of input text.
- **SEO Analyzer**: Analyze SEO performance and get improvement suggestions.

## Project Structure

- `app/` — Next.js app directory (pages, API routes, global styles, layout)
- `components/` — Reusable React components (UI, modals, tool windows)
- `config/tools.json` — Tool metadata and configuration
- `lib/` — Utility and tool configuration logic
- `tools/` — Tool handler implementations (backend logic for each AI tool)
- `public/` — Static assets (SVGs, icons)
- `tailwind.config.ts` — Tailwind CSS configuration

## Getting Started

### 1. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 2. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production

```bash
npm run build
npm start
```

## Usage

- Browse and search for AI tools on the homepage.
- Click "Try Now" on any tool card to open its modal and interact with the tool.
- Some tools (like Image Analyzer) require file uploads; others accept text or URLs.

## Customization

- Add or modify tools in `tools/` and update their metadata in `config/tools.json`.
- UI components can be customized in `components/`.
- Tailwind CSS is used for styling; global styles are in `app/globals.css`.

## Tech Stack

- Next.js 15 (App Router)
- React 19
- Tailwind CSS
- OpenAI SDK
- Shadcn UI
- TypeScript

## License

MIT
