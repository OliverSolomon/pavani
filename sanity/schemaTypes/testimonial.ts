import { defineField, defineType } from 'sanity'

/**
 * Client testimonial. Shown on the Home page and the About page.
 */
export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({
      name: 'quote',
      title: 'Quote',
      description: 'What the client said about working with Pavani. Keep it to a few sentences.',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'authorName',
      title: 'Client Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'authorRole',
      title: 'Client Title / Role',
      description: 'e.g. "Property Buyer", "CEO, East Africa Ventures".',
      type: 'string',
    }),
    defineField({
      name: 'rating',
      title: 'Star Rating',
      description: 'Number of stars to show (1–5).',
      type: 'number',
      initialValue: 5,
      validation: (Rule) => Rule.min(1).max(5),
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      description: 'Lower numbers appear first. Use 1, 2, 3 … to arrange the order.',
      type: 'number',
      initialValue: 1,
    }),
  ],
  preview: {
    select: { title: 'authorName', subtitle: 'authorRole' },
  },
})
