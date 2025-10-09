# DECISION-001: Architecture and Stack

**Date:** 2025-10-09  
**Status:** Accepted  
**Type:** Architectural Decision Record

## Context

Building AI-EPK MVP - a service for artists (DJs, live musicians) to generate professional BIO through GPT and export to PDF format. The project requires a modern, scalable stack with TypeScript for type safety and excellent developer experience.

## Decision

### Technology Stack

**Frontend:**
- Next.js 15 (App Router)
- React 18
- TypeScript
- TailwindCSS for styling
- Zod for runtime validation

**Backend:**
- Next.js API Routes
- OpenAI GPT-4 for text generation
- jsPDF for PDF generation

**Development Tools:**
- Task-Master-AI for task management
- Context7 for decision documentation
- ESLint for code quality
- Git for version control

### Project Structure

```
ai-epk-mvp/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Main landing page
│   ├── globals.css        # Global styles
│   └── api/               # API routes
│       ├── generate-bio/  # GPT integration
│       └── generate-pdf/  # PDF generation
├── components/            # React components
├── hooks/                 # Custom React hooks
├── utils/                 # Helper functions
├── services/              # Business logic
├── types/                 # TypeScript types
├── lib/                   # Shared libraries
└── .taskmaster/           # Task Master AI
    ├── docs/              # Documentation
    │   ├── prd.txt
    │   ├── DECISION-001-architecture.md
    │   ├── PROMPT-SPEC-001.md (to be created)
    │   ├── PDF-SPEC-001.md (to be created)
    │   └── DOD-MVP-001.md (to be created)
    └── tasks/             # Task tracking
```

### Data Flow

1. **User Input:** Artist fills form on landing page
2. **Validation:** Client-side validation with Zod
3. **GPT Call:** POST to /api/generate-bio with artist data
4. **Response:** JSON with elevator_pitch, bio, highlights
5. **Display:** Show generated content on page
6. **PDF Generation:** POST to /api/generate-pdf with complete data
7. **Download:** User downloads generated PDF

### Key Architectural Principles

1. **Type Safety:** TypeScript everywhere, strict mode enabled
2. **Validation:** Runtime validation with Zod schemas
3. **Separation of Concerns:** Clear separation between UI, logic, and API
4. **Error Handling:** Comprehensive try/catch blocks with user-friendly messages
5. **Performance:** Server-side generation, optimized bundle size
6. **Accessibility:** ARIA attributes, keyboard navigation
7. **Internationalization:** Russian language support (Cyrillic in PDF)

### TypeScript Interfaces

```typescript
// Artist Input Data
interface ArtistInput {
  name: string
  city: string
  genres: string[]
  venues?: string[]
  style: string
  skills?: string[]
  achievements?: string
  links?: string[]
}

// GPT Generated Content
interface GeneratedBio {
  elevator_pitch: string
  bio: string
  highlights: string[]
}

// Complete Artist Data
interface ArtistData extends ArtistInput {
  generated?: GeneratedBio
  generatedAt?: string
}
```

## Consequences

### Positive

- **Type Safety:** TypeScript prevents runtime errors
- **Developer Experience:** Next.js provides excellent DX
- **Performance:** Server-side rendering and API routes
- **Scalability:** Clear structure allows easy feature additions
- **Maintainability:** Well-documented decisions and clean code

### Negative

- **Complexity:** More setup required than simple React app
- **Learning Curve:** Team needs Next.js App Router knowledge
- **Dependencies:** Reliance on external APIs (OpenAI)

### Risks & Mitigations

**Risk:** OpenAI API failures  
**Mitigation:** Proper error handling, retry logic, fallback messages

**Risk:** PDF rendering issues with Cyrillic  
**Mitigation:** Test font embedding, use UTF-8 compatible library

**Risk:** Large bundle size  
**Mitigation:** Code splitting, dynamic imports, tree shaking

## Implementation Notes

1. Environment variables managed in `.env.local`
2. API keys never committed to git
3. All prompts documented in PROMPT-SPEC-001
4. PDF layout documented in PDF-SPEC-001
5. DoD criteria documented in DOD-MVP-001

## References

- [Next.js Documentation](https://nextjs.org/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [jsPDF Documentation](https://github.com/parallax/jsPDF)
- [Task Master AI](https://taskmaster.ai)
- [Context7](https://context7.com)

## Next Steps

1. ✅ Project initialization complete
2. → Create form components (Phase 2)
3. → Implement GPT integration (Phase 3)
4. → Implement PDF generation (Phase 4)
5. → Integration and testing (Phase 5)
6. → MVP finalization (Phase 6)

