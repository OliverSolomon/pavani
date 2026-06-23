'use client'

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'

import { apiVersion, dataset, projectId } from './sanity/env'
import { schema } from './sanity/schemaTypes'
import { structure } from './sanity/structure'

export default defineConfig({
  // '/studio' for the embedded studio on the website; '/' for the hosted
  // pavani.sanity.studio build (set SANITY_STUDIO_BASEPATH=/ at deploy time).
  basePath: process.env.SANITY_STUDIO_BASEPATH || '/studio',
  projectId,
  dataset,
  schema,
  plugins: [
    structureTool({ structure }),
  ],
})
