import { defineField, defineType, type StringRule } from 'sanity'

import { videoSourceFields } from '../objects/videoFields'

/** Accepts a site path ("/properties") or a full https:// link. */
const linkRule = (rule: StringRule) =>
  rule.custom((value?: string) => {
    if (!value) return true
    return /^(\/|https?:\/\/|mailto:|tel:)/.test(value)
      ? true
      : 'Start with "/" for a page on this site (e.g. /properties) or https:// for another site.'
  })

export const heroSection = defineType({
  name: 'heroSection',
  title: 'Hero Section (Section 1)',
  type: 'document',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Small Label',
      description: 'The short line in capitals above the headline.',
      type: 'string',
      initialValue: 'Pavani Realty Co',
    }),
    defineField({
      name: 'title',
      title: 'Main Title',
      description:
        'The headline. The last word drops onto its own line in italics, e.g. "Property With" / "Perspective". Keep it to 2 to 4 words so it fits on phones.',
      type: 'string',
      initialValue: 'Property With Perspective',
      validation: (rule) => rule.max(40).warning('Long headlines crowd the video on phones.'),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      description: 'One sentence under the headline.',
      type: 'string',
      initialValue: "Exceptional apartments and villas across Kenya's most prestigious neighbourhoods.",
      validation: (rule) => rule.max(140).warning('Keep it to one sentence.'),
    }),
    defineField({
      name: 'primaryButtonLabel',
      title: 'Main Button: Text',
      type: 'string',
      initialValue: 'Browse Properties',
    }),
    defineField({
      name: 'primaryButtonLink',
      title: 'Main Button: Link',
      type: 'string',
      initialValue: '/properties',
      validation: linkRule,
    }),
    defineField({
      name: 'secondaryButtonLabel',
      title: 'Second Button: Text',
      type: 'string',
      initialValue: 'Contact Us',
    }),
    defineField({
      name: 'secondaryButtonLink',
      title: 'Second Button: Link',
      type: 'string',
      initialValue: '/contact',
      validation: linkRule,
    }),
    ...videoSourceFields('file'),
  ],
  preview: {
    select: { title: 'title', subtitle: 'subtitle' },
    prepare: ({ title, subtitle }) => ({ title: title || 'Hero Section', subtitle }),
  },
})
