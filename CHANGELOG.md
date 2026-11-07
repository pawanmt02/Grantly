# Changelog

All notable changes to **Grantly** will be documented in this file.

## [1.1.0] - 2026-11-07
### Added
- **Federal Student Aid & SAI Estimator**: Interactive calculator modeling the US Department of Education FAFSA Simplification Act formula.
- **Web Speech API Audio Narrator**: Text-to-Speech screen reader for scholarship requirements and transparent match breakdowns.
- **Real CSV Export Service**: Instant browser Blob generation to export student aid portfolios directly into Excel/CSV.
- **Reusable Common UI Primitives**: Polymorphic `Button`, `Badge`, and accessible `Modal` components.
- **Automated Test Suite**: 15 comprehensive unit & component tests using Vitest and React Testing Library.
- **Data Sanitization & Security**: Dedicated `sanitizer.ts` with XSS entity escaping, URL sanitization, and GPA validation.
- **Comprehensive Architecture Documentation**: Added `ARCHITECTURE.md` with system diagrams and accessibility matrix.

### Enhanced
- **Code Splitting & Performance**: Dynamic `React.lazy` and `Suspense` chunking across all main views, reducing initial bundle weight.
- **WCAG 2.1 AA Accessibility**: Added `role="dialog"`, `role="tablist"`, `aria-live="polite"`, keyboard `Escape` handlers, and `.sr-only` announcements.
- **Storage Service Resilience**: Safe LocalStorage wrapper with quota protection and schema validation.

## [1.0.0] - 2026-11-07
### Initial Release
- Multi-factor explainable matching engine (GPA, Major, Education Level, First-Gen, Need).
- Interactive 5-stage Kanban application pipeline tracker.
- AI Essay Spark & Narrative Studio with 4-part structural blueprints.
- Document Vault & Real-time requirement readiness auditor.
- Side-by-side opportunity trade-off & ROI comparison matrix.
- Streamlined 1-click apply flow with confetti celebration.
