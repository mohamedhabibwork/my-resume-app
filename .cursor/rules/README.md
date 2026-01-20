# Cursor Rules for My Resume App

This directory contains Cursor IDE rules and configurations to maintain code quality and consistency.

## Structure

```
.cursor/rules/
├── README.md              # This file
├── vue-components.mdc     # Vue component rules
├── typescript.mdc         # TypeScript rules
├── pinia-stores.mdc       # Pinia store patterns
├── composables.mdc        # Composable patterns
├── tailwind-css.mdc       # CSS/Tailwind rules
├── i18n.mdc               # Internationalization rules
├── firebase.mdc           # Firebase integration rules
├── testing.mdc            # Testing guidelines
├── api.mdc                # API and fetch patterns
├── performance.mdc        # Performance best practices
├── security.mdc           # Security guidelines
└── commands.mdc           # Available commands
```

## How to Use

These `.mdc` files are automatically loaded by Cursor to provide context-aware assistance. They help ensure:

- Consistent code style
- Best practices adherence
- Project-specific patterns
- Error prevention

## Rule Categories

### Code Patterns
- `vue-components.mdc` - Component structure and patterns
- `typescript.mdc` - Type definitions and patterns
- `pinia-stores.mdc` - State management patterns
- `composables.mdc` - Reusable logic patterns

### Styling
- `tailwind-css.mdc` - CSS rules (Tailwind only, no style blocks)

### Features
- `i18n.mdc` - Multi-language support
- `firebase.mdc` - Backend integration
- `api.mdc` - API communication patterns

### Quality
- `testing.mdc` - Testing patterns
- `performance.mdc` - Optimization guidelines
- `security.mdc` - Security best practices

### Commands
- `commands.mdc` - Available CLI commands and workflows
