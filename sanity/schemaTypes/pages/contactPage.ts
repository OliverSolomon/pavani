import { defineField, defineType } from 'sanity'

/** Editable text for the Contact page. Phone / email / address live under Settings → Contact Details. */
export const contactPage = defineType({
  name: 'contactPage',
  title: 'Contact Page',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero' },
    { name: 'offices', title: 'Offices' },
    { name: 'form', title: 'Form' },
  ],
  fields: [
    // Hero
    defineField({ name: 'heroEyebrow', title: 'Hero — Small Label', type: 'string', group: 'hero', initialValue: 'Contact' }),
    defineField({ name: 'heroTitle', title: 'Hero — Title', type: 'string', group: 'hero', initialValue: 'Get In Touch' }),
    // Offices card (phone / email / address come from Settings → Contact Details)
    defineField({ name: 'officesLabel', title: 'Small Label', type: 'string', group: 'offices', initialValue: 'Offices' }),
    defineField({ name: 'officeName', title: 'Office Name', type: 'string', group: 'offices', initialValue: 'Westlands Office' }),
    // Form
    defineField({ name: 'formEyebrow', title: 'Form — Small Label', type: 'string', group: 'form', initialValue: 'Enquiry Form' }),
    defineField({ name: 'formTitle', title: 'Form — Heading', type: 'string', group: 'form', initialValue: 'Tell Us About Your Requirements' }),
  ],
  preview: { prepare: () => ({ title: 'Contact Page' }) },
})
