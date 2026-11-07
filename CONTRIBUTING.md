# Contributing to Grantly

Thank you for your interest in contributing to **Grantly**! We welcome community contributions to make educational financial aid more accessible for students worldwide.

## Development Workflow

1. **Fork and Clone the Repository**:
   ```bash
   git clone https://github.com/pawanmt02/Grantly.git
   cd Grantly
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start the Development Server**:
   ```bash
   npm run dev
   ```

4. **Run Automated Test Suite**:
   ```bash
   npm test
   ```

5. **Type Checking & Production Build**:
   ```bash
   npm run build
   ```

## Code Quality Guidelines

- **Clean Architecture**: Follow the separation of concerns between `src/components`, `src/hooks`, `src/services`, and `src/utils`.
- **Accessibility First**: All interactive elements must maintain keyboard focusability, proper ARIA labels, and WCAG 2.1 AA contrast ratios.
- **Security & Data Sanitization**: Sanitize all untrusted inputs using `src/utils/sanitizer.ts`.
- **Testing**: Add unit tests for any new algorithms or data transformations in `src/**/__tests__/`.
