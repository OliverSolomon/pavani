import { defineField, defineType } from 'sanity'

/**
 * Public opinion / review left on an Insight article by a website visitor.
 * Submitted from the article page; appears on the site only after you tick
 * "Approved" here in the Studio (simple spam protection).
 */
export const comment = defineType({
  name: 'comment',
  title: 'Article Comment',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      description: 'The name the visitor entered.',
      type: 'string',
      validation: (Rule) => Rule.required(),
      readOnly: true,
    }),
    defineField({
      name: 'email',
      title: 'Email (private)',
      description: 'Only visible to you — never shown on the website.',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'rating',
      title: 'Rating (optional)',
      description: 'Star rating the visitor gave, 1–5.',
      type: 'number',
      readOnly: true,
    }),
    defineField({
      name: 'message',
      title: 'Comment',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
      readOnly: true,
    }),
    defineField({
      name: 'post',
      title: 'On Article',
      description: 'The Insight article this comment belongs to.',
      type: 'reference',
      to: [{ type: 'post' }],
      readOnly: true,
    }),
    defineField({
      name: 'submittedAt',
      title: 'Submitted',
      type: 'datetime',
      readOnly: true,
    }),
    defineField({
      name: 'approved',
      title: 'Approved (show on website)',
      description: 'Turn ON to publish this comment publicly on the article. OFF keeps it hidden.',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'message', approved: 'approved' },
    prepare({ title, subtitle, approved }) {
      return {
        title: `${approved ? '✓ ' : '• '}${title || 'Anonymous'}`,
        subtitle,
      }
    },
  },
})
