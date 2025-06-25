# 🍽️ SafeTable Frontend - Food Safety Explorer

_Making French food safety data accessible and searchable for everyone - Responding to current food safety concerns_

## 🎯 Revised Core Objectives (4-Day Plan)

1. **Simple, Fast Search**
   - Basic text search for location and business names
   - Clear display of safety ratings
   - Focus on recent inspections and high-risk establishments

2. **Trust & Transparency**
   - Clear presentation of official ratings
   - Highlight establishments handling meat products (agreement numbers)
   - Last inspection dates prominently displayed

3. **SEO Focus**
   - Optimize for current food safety crisis keywords
   - Clear, informative landing page
   - Region-based content

## 🏗️ Simplified Technical Architecture

### Next.js App Router Structure

```
app/
├── page.tsx                    # Landing page with search
├── search/
│   ├── page.tsx               # Search results
│   └── [siret]/               # Business details
└── api/                       # API routes
```

### Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS + Shadcn/ui
- **Database**: Supabase (direct integration)
- **Analytics**: Vercel Analytics

## 📱 Core Features

### 1. Landing Page (/)

- Prominent search bar
- Recent high-risk inspections
- Quick region filters
- Current food safety context

### 2. Search Interface (/search)

- **Simple Search**
  - Location (city/postal code)
  - Business name
  - Single search bar approach
  
- **Essential Filters**
  - Risk level (1-4 scale)
  - Has agreement number (meat handlers)
  - Business type

- **Results Display**
  - Risk level (color-coded)
  - Business name
  - Agreement number (if exists)
  - Last inspection date
  - Address
  - Business type

### 3. Business Profile (/search/[siret])

- Full inspection details
- Risk level explanation
- Location info
- Agreement number details (if applicable)

## 🔍 SEO Strategy

### Priority Keywords

- "sécurité alimentaire restaurant"
- "contrôle sanitaire viande"
- "inspection hygiène restaurant [city]"
- "risque alimentaire [region]"

## 🚀 4-Day Development Plan

### Day 1: Core Search
- Next.js + Supabase setup
- Basic search implementation
- Results list view

### Day 2: Landing & SEO
- Landing page
- SEO optimization
- Basic styling

### Day 3: Enhanced Search
- Filter implementation
- Business detail pages
- Mobile optimization

### Day 4: Polish & Launch
- Performance optimization
- Final testing
- Deploy & monitor

## 📊 Data Structure

### Key Fields Focus
```sql
- businessName: Main identifier
- siret: Unique business ID
- evaluationCode: 
  1: "Très satisfaisant"
  2: "Satisfaisant"
  3: "À améliorer"
  4: "À corriger de manière urgente"
- riskScore: 1-4 scale
- agreement: FR XX.XXX.XXX CE format (for meat handlers)
- inspectionDate: Last inspection timestamp
- location fields: address, city, postalCode, region
```

## 🎨 MVP Design Principles

1. **Clarity First**
   - Clear risk level display
   - Simple, focused search
   - Essential information only

2. **Mobile Ready**
   - Single column layout
   - Touch-friendly filters
   - Readable on small screens

3. **Performance**
   - Minimal initial load
   - Progressive enhancement
   - Efficient search queries

## 🔄 Next Steps

1. **Initial Setup**
   - Repository creation
   - Next.js configuration
   - Supabase connection

2. **Core Development**
   - Search implementation
   - Basic UI components
   - Results display

3. **Launch Preparation**
   - Performance testing
   - SEO verification
   - Analytics setup

---

_Providing transparent food safety information when it matters most._
