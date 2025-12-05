"use client"

import { Check, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAdaptiveLanguage } from "registry/hooks/use-adaptive-language"

const TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    greeting: "Hello",
    welcome: "Welcome to our app",
    description: "This is a demonstration of adaptive language switching.",
    currentLocale: "Current locale",
    selectLanguage: "Select language",
  },
  es: {
    greeting: "Hola",
    welcome: "Bienvenido a nuestra aplicación",
    description: "Esta es una demostración de cambio de idioma adaptativo.",
    currentLocale: "Idioma actual",
    selectLanguage: "Seleccionar idioma",
  },
  fr: {
    greeting: "Bonjour",
    welcome: "Bienvenue dans notre application",
    description:
      "Ceci est une démonstration de changement de langue adaptatif.",
    currentLocale: "Langue actuelle",
    selectLanguage: "Sélectionner la langue",
  },
  de: {
    greeting: "Hallo",
    welcome: "Willkommen in unserer App",
    description: "Dies ist eine Demonstration des adaptiven Sprachwechsels.",
    currentLocale: "Aktuelle Sprache",
    selectLanguage: "Sprache auswählen",
  },
  ja: {
    greeting: "こんにちは",
    welcome: "アプリへようこそ",
    description: "これは適応的な言語切り替えのデモンストレーションです。",
    currentLocale: "現在の言語",
    selectLanguage: "言語を選択",
  },
  "zh-CN": {
    greeting: "你好",
    welcome: "欢迎使用我们的应用",
    description: "这是自适应语言切换的演示。",
    currentLocale: "当前语言",
    selectLanguage: "选择语言",
  },
}

const SUPPORTED_LOCALES = Object.keys(TRANSLATIONS)

export default function UseAdaptiveLanguageDemo() {
  const { locale, setLocale, isSupported } = useAdaptiveLanguage({
    supportedLocales: SUPPORTED_LOCALES,
    detectBrowserLocale: true,
    persist: true,
  })

  const translations = TRANSLATIONS[locale] || TRANSLATIONS.en

  return (
    <div className="w-full space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label>{translations.currentLocale}</Label>
            <p className="text-sm text-muted-foreground">
              {locale}{" "}
              {isSupported(locale) ? (
                <Check className="inline-block size-4" />
              ) : (
                <X className="inline-block size-4" />
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="locale-select">{translations.selectLanguage}</Label>
            <Select value={locale} onValueChange={setLocale}>
              <SelectTrigger id="locale-select" className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SUPPORTED_LOCALES.map((loc) => (
                  <SelectItem key={loc} value={loc}>
                    {loc.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2 rounded-md border bg-muted/30 p-4">
          <h3 className="text-lg font-semibold">{translations.greeting}!</h3>
          <p className="text-muted-foreground">{translations.welcome}</p>
          <p className="text-sm text-muted-foreground">
            {translations.description}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Quick switch buttons</Label>
        <div className="flex flex-wrap gap-2">
          {SUPPORTED_LOCALES.map((loc) => (
            <Button
              key={loc}
              variant={locale === loc ? "default" : "outline"}
              size="sm"
              onClick={() => setLocale(loc)}
            >
              {loc.toUpperCase()}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-2 rounded-md border p-4 text-sm">
        <p className="font-medium">Document language attribute</p>
        <code className="block rounded bg-muted p-2 text-xs">
          document.documentElement.lang = &quot;{locale}&quot;
        </code>
        <p className="text-muted-foreground">
          The document lang attribute is automatically updated when the locale
          changes.
        </p>
      </div>
    </div>
  )
}
