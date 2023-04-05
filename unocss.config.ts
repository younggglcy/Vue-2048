import { defineConfig, presetAttributify, presetUno, transformerDirectives, transformerVariantGroup } from 'unocss'

export default defineConfig({
  presets: [
    presetAttributify(),
    presetUno(),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
})
