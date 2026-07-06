import { defineField, defineType } from 'sanity'

/**
 * Insight / Journal article. Shown on the "Insights" page.
 * Each article can link out to the full piece (e.g. a LinkedIn post or blog).
 */
export const post = defineType({
  name: 'post',
  title: 'Insight Article',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Headline',
      description: 'The article title shown on the Insights page (e.g. "The 2026 Nairobi Luxury Market Outlook").',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      description: 'Auto-generated from the headline. Click "Generate". This becomes part of the web address.',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
    }),
    defineField({
      name: 'category',
      title: 'Category',
      description: 'Helps readers scan topics. Pick the one that fits best.',
      type: 'string',
      options: {
        list: [
          { title: 'Market Outlook', value: 'Market Outlook' },
          { title: 'Neighbourhoods', value: 'Neighbourhoods' },
          { title: "Buyer's Guide", value: "Buyer's Guide" },
          { title: 'Design', value: 'Design' },
          { title: 'Finance', value: 'Finance' },
          { title: 'Investment', value: 'Investment' },
        ],
      },
      initialValue: 'Market Outlook',
    }),
    defineField({
      name: 'excerpt',
      title: 'Short Summary',
      description: 'One or two sentences shown under the headline on the Insights page.',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(220),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      description: 'The image shown on the article card. Use a high-quality landscape photo.',
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'externalUrl',
          title: 'OR paste an image URL',
          description: 'Optional. Use this instead of uploading a file.',
          type: 'url',
        },
      ],
    }),
    defineField({
      name: 'externalUrl',
      title: 'Read-More Link (LinkedIn / Blog)',
      description: 'Where the "Read on LinkedIn" button sends readers. Paste the full link to the post or article.',
      type: 'url',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Publish Date',
      description: 'Used to order articles (newest first) and shown on the card.',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'featured',
      title: 'Feature at the top?',
      description: 'Turn on for ONE article to highlight it as the large banner at the top of the Insights page.',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'content',
      title: 'Full Article Body (optional)',
      description: 'Only needed if you host the full article on this site instead of linking out.',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'seo',
      title: 'SEO & Social Sharing',
      type: 'seo',
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'category', media: 'coverImage' },
  },
})
