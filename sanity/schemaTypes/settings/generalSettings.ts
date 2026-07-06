import { defineField, defineType } from 'sanity'

export const generalSettings = defineType({
  name: 'generalSettings',
  title: 'General Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Site Description',
      description: 'Default SEO meta description, used on pages that don\'t set their own.',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'keywords',
      title: 'Default Focus Keywords',
      description: 'Site-wide search phrases (e.g. "luxury properties in Kenya"). Individual pages can add their own.',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'ogImage',
      title: 'Default Social Share Image',
      description: 'Shown when the site is shared on WhatsApp, X, LinkedIn. Ideal size 1200×630.',
      type: 'image',
      options: { hotspot: true },
      fields: [
        { name: 'externalUrl', title: 'OR paste an image URL', type: 'url', description: 'Use instead of uploading.' },
      ],
    }),
    defineField({
      name: 'footerText',
      title: 'Footer Copyright Text',
      type: 'string',
    }),
    defineField({
      name: 'defaultCurrency',
      title: 'Default Currency',
      description: 'The initial currency shown to users',
      type: 'string',
      options: {
        list: [
          { title: 'USD - US Dollar', value: 'USD' },
          { title: 'KSH - Kenyan Shilling', value: 'KSH' },
          { title: 'EUR - Euro', value: 'EUR' },
        ],
      },
      initialValue: 'USD',
    }),
    defineField({
      name: 'defaultLanguage',
      title: 'Default Language',
      type: 'string',
      options: {
        list: [
          { title: 'English', value: 'en' },
          { title: 'Arabic', value: 'ar' },
          { title: 'Chinese', value: 'zh' },
        ],
      },
      initialValue: 'en',
    }),
  ],
})
