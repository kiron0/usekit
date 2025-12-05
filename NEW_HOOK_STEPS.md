# Steps for adding a new hook

This checklist captures every place a hook touches in the repo so any contributor (human or AI) can wire it up end‑to‑end without guesswork.

CHECK FOR DUPLICATES BEFORE YOU START. (by name, description, etc.)

## 1. Decide the hook metadata up front

- **Slug / file names:** lower-case with dashes (e.g. `use-masked-input`).
- **Route path:** every hook doc renders at `/docs/hooks/<slug>` via `src/app/(routes)/docs/[[...slug]]/page.tsx`.
- **Demo component name:** append `-demo` (e.g. `use-masked-input-demo`) so it can be referenced by `<ComponentPreview name="...">`.

Keep these three strings consistent—they are reused in the following steps.

## 2. Implement the hook

1. Create `registry/hooks/<slug>.ts`. Export the hook (named with camelCase, e.g. `export function useMaskedInput() { ... }`).
2. If the file needs the `use client` pragma, place it on the first line.
3. Prefer co-locating helper types/functions inside the same file unless they are reused elsewhere.

## 3. Register the hook with the registry CLI

Update `registry/hooks.ts` by adding a new object inside the `hooks` array:

| Field                              | Required | Description                                                               |
| ---------------------------------- | -------- | ------------------------------------------------------------------------- |
| `name`                             | ✅       | Slug (`"use-masked-input"`).                                              |
| `title`                            | ✅       | Human-friendly label (`"Use Masked Input"`).                              |
| `description`                      | ✅       | Short marketing copy (one sentence).                                      |
| `type`                             | ✅       | Always `"registry:hook"`.                                                 |
| `files`                            | ✅       | Array with `{ path: "registry/hooks/<slug>.ts", type: "registry:hook" }`. |
| `registryDependencies`             | optional | Array of other registry packages if the hook re-exports them.             |
| `dependencies` / `devDependencies` | optional | npm packages the hook needs.                                              |

This entry powers the public registry endpoint and ensures `npx uselab@latest add <slug>` works.

## 4. Build an interactive demo

1. Create `registry/examples/<slug>-demo.tsx`. It must be a client component that imports the hook from `registry/hooks/<slug>` and showcases typical usage.
2. Add a matching entry to `registry/examples.ts`:
   ```ts
   {
     name: "<slug>-demo",
     type: "registry:example",
     files: [{ path: "registry/examples/<slug>-demo.tsx", type: "registry:example" }],
   }
   ```
3. Keep demos minimal but self-explanatory—prefer small local state over external dependencies.

## 5. Document the hook (MDX page)

1. Add `content/docs/hooks/<slug>.mdx` with frontmatter:
   ```md
   ---
   title: Use Masked Input
   description: Declarative input masking supporting complex patterns.
   ---
   ```
2. At minimum, include:
   - `<ComponentPreview name="<slug>-demo" />` to render the demo.
   - Installation instructions (`<CodeTabs>` block).
   - API reference tables describing parameters/options/return values.
   - Usage snippet that imports the hook from `@/hooks/<slug>` (mirrors how consumers will import it).
3. If the hook exposes extra helpers, document them under their own headings.

The docs renderer automatically maps `content/docs/hooks/<slug>.mdx` to `/docs/hooks/<slug>`.

## 6. Surface the doc in the sidebar

In `src/config/docs.ts`, find the `"Hooks"` section inside `sidebarNav`. Append a new item object:

```ts
{
  title: "useMaskedInput",
  href: "/docs/hooks/use-masked-input",
  items: [],
  label: "New", // optional badge
}
```

The `DocsNav` component automatically sorts entries that begin with “use”, so you only need to ensure `href` matches the MDX route.

## 7. (Optional) Highlight the hook elsewhere

- If the hook needs to appear on marketing pages or hero sections, update the relevant component (e.g. `src/app/page.tsx`) manually.
- Remove the `"New"` badge from `docsConfig` once the hook is no longer new.

## 8. Verify everything locally

1. `bun run lint` – catches type issues in the new hook/demo.
2. `bun run build:registry` – runs `scripts/build-registry.mts` (via `tsx` per `package.json`) and formats the generated files so the registry CLI stays in sync.
3. `bun run dev` – open `http://localhost:3000/docs/hooks/<slug>` and verify:
   - Demo renders via `<ComponentPreview>`.
   - Sidebar link navigates correctly.
   - Code snippets reference the right import paths.

## Quick reference table

| Concern                    | Path to edit                                 | Key fields                                          |
| -------------------------- | -------------------------------------------- | --------------------------------------------------- |
| Hook implementation        | `registry/hooks/<slug>.ts`                   | Exported hook code.                                 |
| Registry metadata          | `registry/hooks.ts`                          | `name`, `title`, `description`, `files`, deps.      |
| Demo component             | `registry/examples/<slug>-demo.tsx`          | Default export React component.                     |
| Demo registration          | `registry/examples.ts`                       | `name: "<slug>-demo"`, `files[].path`.              |
| Documentation page         | `content/docs/hooks/<slug>.mdx`              | Frontmatter + MDX body + `<ComponentPreview>`.      |
| Sidebar link               | `src/config/docs.ts`                         | `{ title, href: "/docs/hooks/<slug>", items: [] }`. |
| Route renderer (reference) | `src/app/(routes)/docs/[[...slug]]/page.tsx` | No changes needed; consumes MDX.                    |

Follow these steps sequentially and every new hook will ship with code, docs, demo, and navigation wired up correctly.
