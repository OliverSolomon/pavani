import { defineField, defineType } from 'sanity'

/** Editable headings/intro for the Insights page. The article cards come from the Insight Articles list. */
export const insightsPage = defineType({
  name: 'insightsPage',
  title: 'Insights Page',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero' },
    { name: 'grid', title: 'Article Grid' },
    { name: 'cta', title: 'LinkedIn CTA' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // Hero
    defineField({ name: 'heroEyebrow', title: 'Hero — Small Label', type: 'string', group: 'hero', initialValue: 'Insights' }),
    defineField({ name: 'heroTitle', title: 'Hero — Title', type: 'string', group: 'hero', initialValue: 'Notes on Nairobi' }),
    defineField({ name: 'heroIntro', title: 'Hero — Intro', type: 'text', rows: 3, group: 'hero' }),
    // Grid
    defineField({ name: 'gridEyebrow', title: 'Grid — Small Label', type: 'string', group: 'grid', initialValue: 'The Journal' }),
    defineField({ name: 'gridTitle', title: 'Grid — Heading', type: 'string', group: 'grid', initialValue: 'Latest Articles' }),
    // CTA
    defineField({ name: 'ctaTitle', title: 'CTA — Heading', type: 'string', group: 'cta', initialValue: 'Every insight, first on LinkedIn' }),
    defineField({ name: 'ctaText', title: 'CTA — Text', type: 'text', rows: 2, group: 'cta' }),
    defineField({ name: 'seo', title: 'SEO & Social Sharing', type: 'seo', group: 'seo' }),
  ],
  preview: { prepare: () => ({ title: 'Insights Page' }) },
})
