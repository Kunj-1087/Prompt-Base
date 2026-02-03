# Contributing to Prompt-Base

Thank you for your interest in contributing to Prompt-Base! We welcome contributions from the community.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing Requirements](#testing-requirements)
- [Reporting Bugs](#reporting-bugs)
- [Feature Requests](#feature-requests)

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors. We expect all participants to:

- Be respectful and considerate
- Accept constructive criticism gracefully
- Focus on what's best for the community
- Show empathy towards others

### Unacceptable Behavior

- Harassment, discrimination, or offensive comments
- Trolling or insulting remarks
- Publishing others' private information
- Any conduct that could be considered inappropriate in a professional setting

---

## Getting Started

### Prerequisites

Before contributing, ensure you have:

- Node.js 18+ installed
- MongoDB running locally or access to MongoDB Atlas
- Git configured on your machine
- A GitHub account

### Fork and Clone

1. **Fork the repository** on GitHub
2. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Prompt-Base.git
   cd Prompt-Base
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/Kunj-1087/Prompt-Base.git
   ```

### Install Dependencies

```bash
# Root (for Husky)
npm install

# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### Set Up Environment

Create `.env` files in both `backend` and `frontend` directories. See `.env.example` files for required variables.

---

## Development Workflow

### 1. Create a Branch

Always create a new branch for your work:

```bash
git checkout -b feature/your-feature-name
```

### Branch Naming Convention

- `feature/` - New features (e.g., `feature/add-export-functionality`)
- `fix/` - Bug fixes (e.g., `fix/login-validation-error`)
- `docs/` - Documentation updates (e.g., `docs/update-api-reference`)
- `refactor/` - Code refactoring (e.g., `refactor/optimize-database-queries`)
- `test/` - Adding tests (e.g., `test/add-prompt-controller-tests`)
- `chore/` - Maintenance tasks (e.g., `chore/update-dependencies`)

### 2. Make Your Changes

- Write clean, readable code
- Follow the coding standards (see below)
- Add tests for new features
- Update documentation as needed

### 3. Test Your Changes

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
npm run test:e2e

# Linting
npm run lint
```

### 4. Commit Your Changes

Follow our commit guidelines (see below).

### 5. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

---

## Coding Standards

### General Principles

- **DRY (Don't Repeat Yourself)**: Avoid code duplication
- **KISS (Keep It Simple, Stupid)**: Prefer simple solutions
- **SOLID Principles**: Follow object-oriented design principles
- **Separation of Concerns**: Keep logic organized and modular

### TypeScript

- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid using `any` type (use `unknown` if necessary)
- Use strict mode

### Code Style

We use **ESLint** and **Prettier** to enforce code style:

- **ESLint**: Catches code quality issues
- **Prettier**: Formats code consistently

Configuration files:

- Backend: `backend/eslint.config.mjs`, `backend/.prettierrc`
- Frontend: `frontend/eslint.config.js`, `frontend/.prettierrc`

**Run before committing**:

```bash
npm run lint
npm run format
```

### File Organization

#### Backend Structure

```
backend/src/
├── config/         # Configuration files
├── controllers/    # Route handlers
├── middlewares/    # Express middleware
├── models/         # Mongoose models
├── routes/         # API routes
├── services/       # Business logic
├── utils/          # Utility functions
├── app.ts          # Express app setup
└── server.ts       # Server entry point
```

#### Frontend Structure

```
frontend/src/
├── components/     # React components
│   ├── common/     # Shared components
│   ├── ui/         # UI primitives
│   └── [feature]/  # Feature-specific components
├── context/        # React context providers
├── pages/          # Page components
├── services/       # API services
├── types/          # TypeScript types
├── utils/          # Utility functions
├── App.tsx         # Root component
└── main.tsx        # Entry point
```

### Naming Conventions

- **Files**: `camelCase.ts` or `PascalCase.tsx` for React components
- **Variables/Functions**: `camelCase`
- **Classes/Interfaces/Types**: `PascalCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Private properties**: Prefix with `_` (e.g., `_privateMethod`)

### Code Comments

- Use JSDoc for function documentation
- Explain **why**, not **what** (code should be self-explanatory)
- Document complex algorithms and business logic
- Keep comments up-to-date with code changes

**Example**:

```typescript
/**
 * Generates a JWT access token for the user
 * @param userId - The user's database ID
 * @param role - The user's role (user, admin, moderator)
 * @returns Signed JWT token valid for 15 minutes
 */
function generateAccessToken(userId: string, role: string): string {
  // Implementation
}
```

---

## Commit Guidelines

We follow **Conventional Commits** specification.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring (no functional changes)
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks (dependencies, build config, etc.)
- `ci`: CI/CD changes

### Examples

```bash
feat(auth): add two-factor authentication

Implemented TOTP-based 2FA with QR code generation.
Users can enable/disable 2FA from settings.

Closes #123
```

```bash
fix(prompts): resolve search pagination issue

Fixed bug where search results were not paginating correctly
when more than 10 results were returned.

Fixes #456
```

```bash
docs(api): update authentication endpoint examples

Added request/response examples for all auth endpoints
and clarified rate limiting behavior.
```

### Commit Message Rules

- Use imperative mood ("add" not "added" or "adds")
- First line should be 50 characters or less
- Body should wrap at 72 characters
- Reference issues and PRs in the footer

---

## Pull Request Process

### Before Submitting

1. ✅ Ensure all tests pass
2. ✅ Run linting and fix any issues
3. ✅ Update documentation if needed
4. ✅ Add tests for new features
5. ✅ Rebase on latest `main` branch
6. ✅ Ensure commit messages follow guidelines

### PR Title Format

Use the same format as commit messages:

```
feat(auth): add two-factor authentication
```

### PR Description Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues

Closes #123

## Testing

- [ ] Unit tests added/updated
- [ ] E2E tests added/updated
- [ ] Manual testing completed

## Screenshots (if applicable)

[Add screenshots here]

## Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added and passing
```

### Review Process

1. **Automated Checks**: CI/CD will run tests and linting
2. **Code Review**: At least one maintainer will review
3. **Feedback**: Address any requested changes
4. **Approval**: Once approved, a maintainer will merge

### After Merge

- Delete your feature branch
- Pull the latest `main` branch
- Celebrate! 🎉

---

## Testing Requirements

### Unit Tests

- Write tests for all new functions and components
- Aim for 80%+ code coverage
- Use descriptive test names

**Backend** (Jest):

```typescript
describe("AuthController", () => {
  it("should register a new user with valid credentials", async () => {
    // Test implementation
  });
});
```

**Frontend** (Vitest):

```typescript
describe("LoginForm", () => {
  it("should display validation error for invalid email", () => {
    // Test implementation
  });
});
```

### E2E Tests

- Add E2E tests for critical user flows
- Use Playwright for frontend E2E tests

```typescript
test("user can login successfully", async ({ page }) => {
  await page.goto("http://localhost:5173/login");
  await page.fill('[name="email"]', "test@example.com");
  await page.fill('[name="password"]', "password123");
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL("http://localhost:5173/dashboard");
});
```

---

## Reporting Bugs

### Before Reporting

1. Check if the bug has already been reported
2. Ensure you're using the latest version
3. Verify it's not a configuration issue

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce:

1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**

- OS: [e.g., Windows 11]
- Browser: [e.g., Chrome 120]
- Node version: [e.g., 18.17.0]

**Additional context**
Any other relevant information.
```

---

## Feature Requests

We welcome feature suggestions! Please:

1. Check if the feature has already been requested
2. Provide a clear use case
3. Explain why it would benefit users
4. Consider implementation complexity

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Other solutions or features you've considered.

**Additional context**
Any other context, mockups, or examples.
```

---

## Questions?

If you have questions about contributing:

- Open a [GitHub Discussion](https://github.com/Kunj-1087/Prompt-Base/discussions)
- Check existing issues and PRs
- Review the documentation

---

**Thank you for contributing to Prompt-Base! 🚀**
