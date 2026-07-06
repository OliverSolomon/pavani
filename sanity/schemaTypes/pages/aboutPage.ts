import { defineField, defineType } from 'sanity'

const valueItem = {
  type: 'object' as const,
  fields: [
    { name: 'title', title: 'Title', type: 'string' as const },
    { name: 'body', title: 'Body', type: 'text' as const, rows: 3 },
  ],
  preview: { select: { title: 'title', subtitle: 'body' } },
}

const imageWithUrl = {
  options: { hotspot: true },
  fields: [
    { name: 'externalUrl', title: 'OR paste an image URL', type: 'url' as const, description: 'Use instead of uploading.' },
  ],
}

/** Everything on the About page — every heading and paragraph is editable here. */
export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero' },
    { name: 'story', title: 'Story' },
    { name: 'leadership', title: 'Leadership' },
    { name: 'values', title: 'Core Values' },
    { name: 'why', title: 'Why Choose Us' },
    { name: 'cta', title: 'Closing CTA' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // Hero
    defineField({ name: 'heroEyebrow', title: 'Hero — Small Label', type: 'string', group: 'hero', initialValue: 'Our Story' }),
    defineField({ name: 'heroTitle', title: 'Hero — Title', type: 'string', group: 'hero', initialValue: 'About Pavani Realty Co' }),
    defineField({ name: 'heroSubtitle', title: 'Hero — Subtitle', type: 'text', rows: 2, group: 'hero' }),
    // Story
    defineField({ name: 'storyTitle', title: 'Heading', type: 'string', group: 'story' }),
    defineField({ name: 'storyParagraphs', title: 'Paragraphs', type: 'array', of: [{ type: 'text', rows: 3 }], group: 'story' }),
    // Leadership
    defineField({ name: 'leaderName', title: 'Name', type: 'string', group: 'leadership' }),
    defineField({ name: 'leaderRole', title: 'Role', type: 'string', group: 'leadership' }),
    defineField({ name: 'leaderQuote', title: 'Pull Quote', type: 'text', rows: 3, group: 'leadership' }),
    defineField({ name: 'leaderBio', title: 'Biography', type: 'text', rows: 4, group: 'leadership' }),
    defineField({ name: 'leaderImage', title: 'Photo', type: 'image', group: 'leadership', ...imageWithUrl }),
    // Core values
    defineField({ name: 'coreValuesTitle', title: 'Heading', type: 'string', group: 'values' }),
    defineField({ name: 'coreValues', title: 'Values', type: 'array', of: [valueItem], group: 'values' }),
    // Why us
    defineField({ name: 'whyUsTitle', title: 'Heading', type: 'string', group: 'why' }),
    defineField({ name: 'whyUs', title: 'Points', type: 'array', of: [valueItem], group: 'why' }),
    // Testimonials heading (the cards come from the Testimonials list)
    defineField({ name: 'testimonialsTitle', title: 'Testimonials — Heading', type: 'string', group: 'cta' }),
    // CTA
    defineField({ name: 'ctaTitle', title: 'CTA — Heading', type: 'string', group: 'cta' }),
    defineField({ name: 'ctaText', title: 'CTA — Text', type: 'text', rows: 2, group: 'cta' }),
    defineField({ name: 'ctaButtonLabel', title: 'CTA — Button Label', type: 'string', group: 'cta' }),
    defineField({ name: 'ctaImage', title: 'CTA — Background Image', type: 'image', group: 'cta', ...imageWithUrl }),
    defineField({ name: 'seo', title: 'SEO & Social Sharing', type: 'seo', group: 'seo' }),
  ],
  preview: { prepare: () => ({ title: 'About Page' }) },
})
