import { defineField, defineType } from 'sanity'

/**
 * A street within a district. Mirrors the County → District structure,
 * adding one more level: County → District → Street.
 */
export const street = defineType({
  name: 'street',
  title: 'Street',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Street Name',
      description: 'e.g. Riverside Drive, Convent Road',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'district',
      title: 'District',
      description: 'The district this street belongs to.',
      type: 'reference',
      to: [{ type: 'district' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'district.name' },
  },
})
