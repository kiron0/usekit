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
  return <input value={token} onChange={(e) => setToken(e.target.value)} />
}
```

### Method 2: Using uselab CLI (Recommended)

```bash
npx uselab@latest add [hookName]
```

Replace `[hookName]` with the name of the hook you want to add (e.g., `use-local-storage`).

---

## 📚 Documentation

- [Introduction](https://usekit.kiron.dev/docs)
- [Installation](https://usekit.kiron.dev/docs/installation)
- [Hooks List](https://usekit.kiron.dev/docs/hooks)
- [Development](https://usekit.kiron.dev/docs/development)

---

## 🤝 Community

- **Request a Feature:** [Open a feature request](https://github.com/kiron0/useKit/issues/new?labels=enhancement&template=feature_request.md)
- **Report a Bug:** [Report a bug](https://github.com/kiron0/useKit/issues/new?labels=bug&template=bug_report.md)
- **GitHub Issues:** [View all issues](https://github.com/kiron0/useKit/issues)
- **Discussions:** [Join the discussion](https://github.com/kiron0/useKit/discussions)
- **Contributing Guide:** See [CONTRIBUTING.md](./CONTRIBUTING.md)

---

## 👤 Author

- **Author:** [Toufiq Hasan Kiron](https://kiron.dev) ([Twitter](https://twitter.com/hashtagkiron), [GitHub](https://github.com/kiron0))

---

## We welcome your ideas, feedback, and contributions! Star ⭐ the repo to support the project.

## Happy Coding! 🚀
