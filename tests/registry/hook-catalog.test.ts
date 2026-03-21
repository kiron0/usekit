import fs from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

import { hooksExamples } from "../../registry/examples"
import { hooks } from "../../registry/hooks"
import registryItemSchema from "../../registry/schema"

const rootDir = process.cwd()
const importedHookModules = import.meta.glob("../../registry/hooks/*.ts", {
  eager: true,
})
const hookFiles = fs
  .readdirSync(path.join(rootDir, "registry/hooks"))
  .filter((file) => file.endsWith(".ts") || file.endsWith(".tsx"))

describe("registry hook catalog", () => {
  it("loads every non-TSX hook module successfully", () => {
    expect(Object.keys(importedHookModules).length).toBeGreaterThan(0)

    for (const [modulePath, moduleExports] of Object.entries(
      importedHookModules
    )) {
      expect(modulePath).toContain("/registry/hooks/")
      expect(Object.keys(moduleExports)).not.toHaveLength(0)
    }
  })

  it("keeps every hook source file present and non-empty", () => {
    expect(hookFiles.length).toBeGreaterThanOrEqual(155)

    for (const file of hookFiles) {
      const content = fs.readFileSync(
        path.join(rootDir, "registry/hooks", file),
        "utf8"
      )

      expect(content.trim().length).toBeGreaterThan(0)
      expect(content).toContain("export")
    }
  })

  it("keeps every registered hook valid and backed by source files and docs", () => {
    for (const item of hooks) {
      expect(registryItemSchema.parse(item)).toBeTruthy()

      for (const file of item.files ?? []) {
        expect(fs.existsSync(path.join(rootDir, file.path))).toBe(true)
      }

      expect(
        fs.existsSync(
          path.join(rootDir, "content/docs/hooks", `${item.name}.mdx`)
        )
      ).toBe(true)
    }
  })

  it("keeps every registered example backed by source files", () => {
    for (const item of hooksExamples) {
      expect(registryItemSchema.parse(item)).toBeTruthy()

      for (const file of item.files ?? []) {
        const fullPath = path.join(rootDir, file.path)

        expect(fs.existsSync(fullPath)).toBe(true)
        expect(fs.readFileSync(fullPath, "utf8").trim().length).toBeGreaterThan(
          0
        )
      }
    }
  })
})
