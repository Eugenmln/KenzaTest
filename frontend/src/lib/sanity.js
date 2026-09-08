import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID
const dataset = import.meta.env.VITE_SANITY_DATASET || 'production'
const apiVersion = import.meta.env.VITE_SANITY_API_VERSION || '2026-09-01'

export const sanityConfigured = Boolean(projectId)

export const client = sanityConfigured
  ? createClient({ projectId, dataset, apiVersion, useCdn: true })
  : null

const builder = client ? imageUrlBuilder(client) : null

export function urlFor(source) {
  return builder ? builder.image(source) : null
}
