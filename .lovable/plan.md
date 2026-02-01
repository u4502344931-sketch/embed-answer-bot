
# Plan: Add Floating Chat Widget to Every Page

## Overview
Move the FloatingChatWidget from the Index page to the App level so it appears on all pages throughout the application.

## Current State
- The FloatingChatWidget is currently only rendered in `src/pages/Index.tsx` (landing page)
- Dashboard pages and auth pages do not have the chat widget

## Implementation

### Step 1: Update App.tsx
Add the FloatingChatWidget component to App.tsx, placing it outside the Routes but inside the BrowserRouter so it renders on every route:

- Import FloatingChatWidget from `@/components/landing/FloatingChatWidget`
- Add the component after the Routes component (but within the BrowserRouter)
- This ensures the widget is always visible regardless of which page the user is on

### Step 2: Remove from Index.tsx
Remove the FloatingChatWidget import and usage from the Index page since it will now be handled globally at the App level.

## File Changes Summary

| File | Change |
|------|--------|
| `src/App.tsx` | Add FloatingChatWidget import and render it globally |
| `src/pages/Index.tsx` | Remove FloatingChatWidget import and usage |

## Result
After this change, the floating chat widget with the "Need help?" bubble will appear in the bottom-right corner on:
- Landing page (/)
- Login (/login) 
- Signup (/signup)
- Dashboard (/dashboard)
- All dashboard subpages (content, widget, embed, analytics, pricing)
- Even the 404 page
