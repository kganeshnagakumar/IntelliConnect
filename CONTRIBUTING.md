# Contributing to Intelliconnect

We welcome contributions! Please follow these guidelines to ensure a smooth development process.

## Branching Strategy
- `main` - Production-ready code.
- `dev` - Active development branch.
- Feature branches should stem from `dev` and use the format `feature/your-feature-name`.

## Code Conventions
- **Frontend**: Strictly typed TypeScript. Prefer functional components and hooks. Use TailwindCSS for styling instead of raw CSS files where possible. Ensure `eslint` passes.
- **Backend**: Adhere to PEP-8 standards. Use Django REST Framework ViewSets for new models.

## Pull Request Process
1. Fork the repository and create your feature branch.
2. Ensure your code passes standard linting (`npm run lint`).
3. Include detailed descriptions in your PR, detailing what changed and why.
4. If modifying models, ensure you include the auto-generated Django migration files.
5. Request review from a maintainer.