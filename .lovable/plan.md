

# SiteWise.ai - AI Chatbot Widget Platform

## Overview
A modern, minimal SaaS platform where business owners can create AI chatbots that answer visitor questions based on their website content, with embeddable widgets and tiered subscription plans.

---

## 🎯 Core Features

### 1. Marketing Landing Page
- Clean, modern hero section explaining SiteWise.ai value proposition
- Interactive demo showing the widget in action
- Feature highlights with smooth animations
- Pricing section with 3 tiers clearly displayed
- Testimonials/social proof section
- FAQ section
- Call-to-action for signup

### 2. Authentication System
- Email/password signup & login
- Password reset functionality
- Onboarding flow for new users

### 3. Dashboard
- Overview with key metrics (conversations, messages, active visitors)
- Quick access to widget settings
- Content management
- Subscription status display

### 4. Content Management
- **URL Crawling**: Paste website URL to automatically crawl and index pages
- **Manual Upload**: Upload documents (PDF, TXT) or paste text directly
- Content preview and management
- Ability to refresh/recrawl content

### 5. Widget Builder
- **Two widget templates:**
  - **Full Chat Panel**: ChatGPT-style sliding panel from bottom/side
  - **Floating Bubble**: Small icon that expands on click
- Live preview of widget customization
- Customization options based on tier:
  - Colors, position, welcome message
  - Avatar/mascot selection
  - Branding removal (Tier 3)

### 6. Embed Code Generator
- Simple copy-paste JavaScript snippet
- Instructions for popular platforms (WordPress, Shopify, Webflow, etc.)

---

## 💳 Subscription Tiers

| Feature | Tier 1 - Starter | Tier 2 - Pro | Tier 3 - Enterprise |
|---------|-----------------|--------------|---------------------|
| Monthly conversations | 500 | 2,000 | Unlimited |
| Widget templates | 2 | 2 | 2 |
| Color customization | ❌ | ✅ | ✅ |
| Custom avatar | ❌ | ✅ | ✅ |
| Branding | "Powered by SiteWise.ai" + mascot | "Powered by SiteWise.ai" | Full white-label |
| Pages to crawl | 10 | 50 | Unlimited |
| Analytics | Basic | Advanced | Advanced + Export |

---

## 🔧 Technical Architecture

### Frontend
- React + TypeScript + Tailwind CSS
- Modern minimal UI with smooth transitions
- Responsive design for all devices

### Backend (via Lovable Cloud)
- User authentication & session management
- Content storage and indexing
- AI chat processing using Lovable AI
- Website crawling via Firecrawl integration
- Subscription management via Stripe

### Embeddable Widget
- Lightweight JavaScript bundle
- Self-contained styling (won't conflict with host site)
- Connects to your backend for AI responses

---

## 📱 Pages to Build

1. **Landing Page** (`/`) - Marketing & conversion
2. **Pricing Page** (`/pricing`) - Detailed tier comparison
3. **Login/Signup** (`/login`, `/signup`) - Authentication
4. **Dashboard** (`/dashboard`) - Main user hub
5. **Content Manager** (`/dashboard/content`) - Add/manage website content
6. **Widget Settings** (`/dashboard/widget`) - Customize & preview widget
7. **Embed Code** (`/dashboard/embed`) - Get installation snippet
8. **Settings** (`/dashboard/settings`) - Account & subscription management

---

## 🎨 Design Direction

- **Style**: Modern, minimal (inspired by Linear, Vercel)
- **Colors**: Clean neutrals with a vibrant accent color
- **Typography**: Clean sans-serif, excellent readability
- **Animations**: Subtle, purposeful micro-interactions
- **Widget Mascot**: Friendly, simple AI character for Tier 1

---

## 🚀 Implementation Priority

**Phase 1 - Foundation**
- Landing page with pricing
- Authentication system
- Basic dashboard structure
- Database setup

**Phase 2 - Core Product**
- Content management (URL crawling + manual upload)
- AI chat integration
- Widget builder with 2 templates
- Embed code generator

**Phase 3 - Monetization & Polish**
- Stripe subscription integration
- Tier-based feature gating
- Analytics dashboard
- White-label options for Tier 3

