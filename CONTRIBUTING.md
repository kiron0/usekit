# Contributing

Thanks for contributing to `usekit`.

## Development Setup

1. Install dependencies:

```bash
npm install --legacy-peer-deps
```

2. Create `.env` with:

```bash
NEXT_PUBLIC_NODE_ENV=development
```

3. Start the development server:

```bash
npm run dev
```

## Project Areas

- `registry/hooks/`: source hooks
- `registry/examples/`: demos for hooks
- `content/docs/hooks/`: MDX documentation
- `src/`: application code for the docs site
- `tests/hooks/`: hook behavior tests and remaining-hook smoke coverage
- `tests/lib/`: utility and library tests
- `tests/registry/`: registry integrity tests

## Contribution Workflow

1. Create a branch from `main`.
2. Make focused changes.
3. Add or update tests when behavior changes.
4. Run checks locally before opening a pull request.
5. Open the pull request against `main`.

## Testing

The project uses `vitest` with `jsdom` for hook and browser-facing tests.

Current test areas:

- `tests/hooks/`: direct behavior tests for hooks
- `tests/lib/`: tests for helpers in `src/lib` and related utilities
- `tests/registry/`: registry and catalog integrity checks

When changing a hook:

- Add or update a direct test in `tests/hooks/` when the hook behavior is deterministic.
- Keep the test focused on observable behavior, not implementation details.
- Use fake timers for interval, timeout, countdown, stopwatch, throttle, or debounce-style hooks.
- Mock browser APIs narrowly when a hook depends on `matchMedia`, `localStorage`, `screen.orientation`, `Image`, or similar globals.

When adding a new hook:

- Add the hook source under `registry/hooks/`.
- Add docs under `content/docs/hooks/`.
- Add a dedicated test under `tests/hooks/`.

## Local Checks

Run the relevant commands before submitting:

```bash
npm run test
npm run test:watch
npm run lint
npm run build
```

If you modify registry content, also run:

```bash
npm run build:registry
```

## Pull Request Notes

- Keep changes scoped to a single fix or feature.
- Follow the existing TypeScript and formatting conventions.
- Update docs when adding or changing a hook.
- Include screenshots when a UI change affects the docs site.

## License

By contributing, you agree that your contributions will be licensed under the
MIT License in this repository.
