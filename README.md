<h1 align="center">
useKit
</h1>

<p align="center">
  <b>A collection of reusable React hooks you can copy and paste into your apps.</b><br/>
  <i>Production-ready, TypeScript-supported, zero-dependency, and instantly integrable.</i>
</p>

<p align="center">
  <a href="https://github.com/kiron0/usekit"><img src="https://img.shields.io/github/stars/kiron0/usekit?style=flat-square" alt="GitHub stars" /></a>
  <a href="https://github.com/kiron0/usekit"><img src="https://img.shields.io/github/forks/kiron0/usekit?style=flat-square" alt="GitHub forks" /></a>
  <a href="https://github.com/kiron0/usekit/issues"><img src="https://img.shields.io/github/issues/kiron0/usekit?style=flat-square" alt="GitHub issues" /></a>
  <a href="https://twitter.com/hashtagkiron"><img src="https://img.shields.io/twitter/follow/hashtagkiron?style=flat-square" alt="Follow on Twitter" /></a>
</p>

---

## 🚀 Why useKit?

- **Reusable Solutions**: Carefully crafted hooks for common development needs
- **Zero Dependencies**: Copy-paste without worrying about package bloat
- **Production-Ready**: TypeScript supported and thoroughly tested patterns
- **Instant Integration**: No installations needed – just copy and go
- **Community-Driven**: Built for developers, by developers

---

## ✨ Features

- **State Management**: Simplify complex state logic
- **UI Interactions**: Handle animations, gestures, and UI states
- **Network Operations**: Manage API calls and data fetching
- **Browser APIs**: Wrap browser functionality in a React way
- **Utilities**: Common solutions for daily development challenges

---

## 🛠️ Quick Start

### Method 1: Copy-Paste

1. **Browse the collection** at [useKit Docs](https://usekit.kiron.dev/docs/hooks)
2. **Copy** the hook that solves your problem
3. **Paste** into your project's hooks directory
4. **Customize** as needed for your specific use case

```tsx
import { useLocalStorage } from "@/hooks/use-local-storage"

function DemoComponent() {
  const [token, setToken] = useLocalStorage("authToken", "")
  return <input value={token} onChange={e => setToken(e.target.value)} />
}
```

### Method 2: Using shadcn CLI (Recommended)

```bash
npx shadcn@latest add https://usekit.kiron.dev/k/[hookName]
```
Replace `[hookName]` with the name of the hook you want to add (e.g., `use-local-storage`).

---

## 📚 Documentation

- [Introduction](https://usekit.kiron.dev/docs)
- [Installation](https://usekit.kiron.dev/docs/installation)
- [Hooks List](https://usekit.kiron.dev/docs/hooks)
- [Development](https://usekit.kiron.dev/docs/development)

---

## 🤝 Contributing & Community

- **Request a Feature:** [Open a feature request](https://github.com/kiron0/useKit/issues/new?labels=enhancement&template=feature_request.md)
- **Report a Bug:** [Report a bug](https://github.com/kiron0/useKit/issues/new?labels=bug&template=bug_report.md)
- **GitHub Issues:** [View all issues](https://github.com/kiron0/useKit/issues)
- **Discussions:** [Join the discussion](https://github.com/kiron0/useKit/discussions)

---

## 🧑‍💻 How to Contribute

We welcome contributions from everyone! Here’s how you can get started:

### 1. Fork & Clone

- Fork the repository on GitHub and clone it to your local machine.

```bash
git clone https://github.com/kiron0/usekit.git
cd usekit
```

### 2. Explore the Project Structure

- **registry/hooks/**: Main directory for reusable hooks. Add new hooks here.
- **registry/**: Demo and registry files for hooks. Add demo files in `registry/examples/` and register new hooks in `registry/hooks.ts`.
- **content/docs/hooks/**: Documentation in MDX format. Add or update docs for your hook here.
- **public/**: Static assets (images, icons, etc.).
- **scripts/**: Build and utility scripts.

### 3. Add a New Hook

1. Create your hook in `registry/hooks/` (e.g., `use-my-hook.ts`).
2. Add a demo in `registry/examples/` (e.g., `use-my-hook-demo.tsx`) (Optional but Recommended).
3. Register your hook in `registry/hooks.ts`.
4. Write documentation in `content/docs/hooks/` (e.g., `use-my-hook.mdx`).

### 4. Run & Test

- Install dependencies:
  ```bash
  bun install
  ```
- Run the development server and test your changes.
### 4.1. Set Up Environment Variables

- Create a `.env` file at the root of the project with the following content:

  ```
  NEXT_PUBLIC_NODE_ENV=development
  ```

- You can now visit the `/docs/development` route to test your example of a hook.

- Start the development server:

  ```bash
  bun run dev
  ```

### 4.2. Build for Production
- Before committing, run the following command to build the current registry for production readiness:

  ```bash
  bun run build:registry
  ```

### 5. Commit & PR

1. Create a new branch for your feature or fix.
2. Commit your changes with a descriptive message.
3. Push to your fork and open a Pull Request (PR) against the `dev` branch.

### 6. Code Style

- Follow the existing code style. Use Prettier and ESLint for formatting and linting.
- TypeScript is required for all hooks.

We welcome your ideas, feedback, and contributions! Star ⭐ the repo to support the project.
---

## 👤 Author & Credits

- **Author:** [Toufiq Hasan Kiron](https://kiron.dev) ([Twitter](https://twitter.com/hashtagkiron), [GitHub](https://github.com/kiron0))
- **Inspired by:** [shadcn/ui](https://ui.shadcn.com)

---

<p align="center">
  <b>Happy Coding! 🚀</b>
</p>

---
