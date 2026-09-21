# PRD — Al Lulu Packaging B2B Website

## Original Problem Statement
Build a premium, modern, highly polished B2B website for Al Lulu Packaging (AL LULU PACKING & PACKAGING MAT.CO. LLC), a UAE packaging company in Industrial Area #5, Sharjah, established 2013. Must look like a real established industrial company (not a presentation, not a generic AI template), build trust with business customers, showcase the 16-product catalogue, generate qualified quotation requests, make WhatsApp contact extremely easy, introduce the AI assistant "Rocky" (Gemini), use a packaging-inspired interaction language (boxes → tape → labels → quotations), work exceptionally well on mobile, and never fabricate company facts.

## Source of Truth (client-supplied)
- Company profile PDF: legal name, Industrial Area #5 Sharjah address, Tel 06 530 0865, emails saleslulupac@gmail.com / lulupackaging@gmail.com, Est. 2013, 16 products (Corrugated Rolls/Boxes/Sheets, File Storage Boxes, Pizza Boxes, E-Flute Sheets Black/Brown/White, Masking Tapes, BOPP Clear/Brown Tapes, Bubble Rolls, Stretch Film Handgrade/Black/Machine Grade, Edge Protector, Paper Core, PP Strap).
- User confirmations: WhatsApp = +971 6 530 0865; show the 8 client names (Mercedes-Benz, SAFCO, Danube, Mitsubishi, Al Ghurair, Al Gurg FOSROC, K-Flex Gulf Manufacturing, General Motors) with no partnership claims; Rocky uses Emergent-managed Gemini key; premium placeholder imagery (to be swapped with real company photos).

## User Personas
- UAE procurement/purchasing managers browsing the catalogue and requesting quotations.
- Operations/factory supervisors needing tapes, films, protection consumables.
- Food business owners (pizza boxes) and traders.
- Mobile-first users who contact via WhatsApp.

## Architecture
- FastAPI backend (/app/backend/server.py): /api/products, /api/products/{id}, /api/quote (multipart + file upload to /app/backend/uploads), /api/contact, /api/rocky/chat (SSE streaming, emergentintegrations LlmChat, Gemini gemini-3-flash-preview, strict grounded system prompt, messages persisted to Mongo).
- Data module /app/backend/data.py: COMPANY, CATEGORIES, PRODUCTS (16).
- React frontend (CRA): pages Home, Products (search + category filters), ProductDetail, About, WhatWeDo, Industries, Contact (map iframe + form), QuotePage (grouped form + box/workers/tape success animation).
- Components: Navbar (sticky, transparent-over-dark), Footer, FloatingActions (WhatsApp float + mobile sticky bar), Rocky chat widget (SSE), TapeReveal, Marquee, ProductCard, QuoteForm, CTABand, Reveal.
- Design system: bone/paper/charcoal/kraft (#A05A2C)/tape-yellow (#D9A036); Syne display + Plus Jakarta Sans + JetBrains Mono; grain, dieline frames, tape-strip signature; Lenis smooth scroll; framer-motion reveals; reduced-motion support.

## Implemented (2026-09-19)
- All pages, all components, Rocky streaming chat, quotation + contact persistence to MongoDB, file upload to Emergent object storage, client trust band, industries derived from real clients, animations (masked hero reveal, tape reveals, marquee, parallax hero, quote seal animation ~2.4s).
- Verified: curl backend endpoints (products 16, quote, contact, rocky SSE), desktop + mobile screenshots, e2e quote submit through UI.

## Implemented (2026-09-21) — Quote Inbox
- Admin area at /admin (not publicly linked): passcode login (ADMIN_PASSCODE in backend/.env) issuing a 12h JWT (JWT_SECRET); brute-force lockout 5 fails/15 min.
- GET /api/admin/quotations, /api/admin/contacts (Bearer-protected), CSV export /api/admin/export, attachment download via /api/files/{path} from object storage.
- Quote form attachments now upload to Emergent object storage (path allulu-packaging/uploads/quotes/...), original filename + storage path stored in Mongo.
- Verified: 401 on wrong passcode/unauthenticated, token flow, lists with real submissions, CSV headers, upload→download round-trip, admin UI e2e via screenshots.

## Content Integrity Notes
- No MOQs, prices, certifications, working hours, or testimonials supplied → none shown.
- Photography is premium placeholder imagery — swap with real Al Lulu photography when supplied.

## Backlog (P0/P1/P2)
- P0: (none open — core flows live)
- P1: Real client logo files; real facility/team photography; admin view of submitted quotations; working hours once supplied.
- P2: Multi-language (Arabic) version; Rocky voice; saved enquiries tracking for returning customers.
