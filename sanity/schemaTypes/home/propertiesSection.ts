import { defineField, defineType } from 'sanity'

export const propertiesSection = defineType({
  name: 'propertiesSection',
  title: 'Featured Properties Section',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Main Title',
      type: 'string',
      initialValue: 'The Next Move Is Yours',
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      initialValue: 'Local Experts, Global Reach',
    }),
    defineField({
      name: 'featuredProperties',
      title: 'Properties to Showcase',
      description:
        'Pick exactly 6 properties. They appear as two rows of three on the Home page, and the same six fill the Gallery page showcase. Photos are pulled from each property record — no need to re-upload.',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'property' }] }],
      validation: (Rule) =>
        Rule.max(6).warning('Only the first 6 properties are shown on the site.'),
    }),
  ],
})
