import { defineField, defineType } from 'sanity'

/**
 * Reusable SEO + social-sharing controls. Attach to any document with `type: 'seo'`.
 * Every field is optional — leave blank and the site auto-generates sensible defaults.
 */
export const seo = defineType({
  name: 'seo',
  title: 'SEO & Social Sharing',
  type: 'object',
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      description: 'Overrides the Google / browser-tab title (~60 characters). Leave blank to auto-generate.',
      validation: (Rule) => Rule.max(70).warning('Titles over ~60 characters may be truncated by Google.'),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      description: 'The grey summary shown under the title in Google (~155 characters). Leave blank to auto-generate.',
      validation: (Rule) => Rule.max(180).warning('Descriptions over ~160 characters may be truncated.'),
    }),
    defineField({
      name: 'keywords',
      title: 'Focus Keywords',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      description: 'Optional. Key search phrases this page targets (e.g. "luxury apartments Kilimani").',
    }),
    defineField({
      name: 'ogImage',
      title: 'Social Share Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Shown when the page is shared on WhatsApp, X, LinkedIn, Facebook. Ideal size 1200×630.',
      fields: [
        { name: 'externalUrl', title: 'OR paste an image URL', type: 'url', description: 'Use instead of uploading.' },
      ],
    }),
    defineField({
      name: 'noIndex',
      title: 'Hide from search engines',
      type: 'boolean',
      initialValue: false,
      description: 'Turn ON to ask Google NOT to index this page (it stays live, just unlisted in search).',
    }),
  ],
  preview: { prepare: () => ({ title: 'SEO & Social Sharing' }) },
})
