'use client'

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'

import { apiVersion, dataset, projectId } from './sanity/env'
import { schema } from './sanity/schemaTypes'
import { structure } from './sanity/structure'

/**
 * One-of-a-kind documents (a page's sections and site settings). Each is
 * opened by a fixed ID from the Studio structure, so deleting, duplicating or
 * unpublishing one leaves the website without that content and leaves the
 * Studio pane stuck on a "This document has been deleted" screen. Editors can
 * still edit and publish them; they just cannot remove them.
 */
const SINGLETON_TYPES = new Set([
  'heroSection',
  'propertiesSection',
  'aboutPage',
  'contactPage',
  'insightsPage',
  'generalSettings',
  'brandSettings',
  'contactSettings',
  'socialSettings',
])

const SINGLETON_ACTIONS = new Set(['publish', 'discardChanges', 'restore'])

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  schema,
  document: {
    actions: (input, context) =>
      SINGLETON_TYPES.has(context.schemaType)
        ? input.filter(({ action }) => action && SINGLETON_ACTIONS.has(action))
        : input,
    // Hide singletons from the global "Create new document" menu so a second
    // copy with a random ID can never be created alongside the real one.
    newDocumentOptions: (prev, { creationContext }) =>
      creationContext.type === 'global'
        ? prev.filter((item) => !SINGLETON_TYPES.has(item.templateId))
        : prev,
  },
  plugins: [
    structureTool({ structure }),
  ],
})
