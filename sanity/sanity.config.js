import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemaTypes/index.js'

export default defineConfig({
  name: 'kenza',
  title: 'KENZA — Administración',
  projectId: 'REEMPLAZAR_CON_PROJECT_ID',
  dataset: 'production',
  plugins: [structureTool(), visionTool()],
  schema: { types: schemaTypes },
})
