import type { StructureResolver } from 'sanity/structure'
import {
  CogIcon, UsersIcon, EnvelopeIcon, ImageIcon, EarthAmericasIcon,
  HomeIcon, DocumentTextIcon, PinIcon, CommentIcon,
  CalendarIcon, PlayIcon, RocketIcon, StarIcon,
} from '@sanity/icons'

/**
 * Pavani Realty — Studio navigation.
 *
 * Organised the way the website reads, so a non-technical editor can find
 * things fast: PAGES (what visitors see) → LISTINGS (your content library)
 * → SETTINGS (brand-wide details like phone, email and social links).
 *
 * "Singleton" items (Home sections, Settings) open ONE editable document —
 * there is only ever one of each, so there is no list to manage.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Pavani Content')
    .items([
      // ───────────────────────── PAGES ─────────────────────────
      S.listItem()
        .title('Home Page')
        .icon(HomeIcon)
        .child(
          S.list()
            .title('Home Page — Sections (top to bottom)')
            .items([
              S.listItem().title('1 · Hero Video (background)').icon(PlayIcon)
                .child(S.document().schemaType('heroSection').documentId('heroSection')),
              S.listItem().title('2 · Featured Properties').icon(HomeIcon)
                .child(S.document().schemaType('propertiesSection').documentId('propertiesSection')),
            ])
        ),

      S.listItem()
        .title('Insights / Journal')
        .icon(DocumentTextIcon)
        .child(
          S.documentTypeList('post')
            .title('Insight Articles')
            .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
        ),

      S.divider(),

      // ─────────────────────── LISTINGS ───────────────────────
      S.documentTypeListItem('property').title('Properties').icon(HomeIcon),

      S.listItem()
        .title('Neighbourhoods')
        .icon(EarthAmericasIcon)
        .child(
          S.list()
            .title('Neighbourhoods')
            .items([
              S.documentTypeListItem('district').title('Districts').icon(PinIcon),
              S.documentTypeListItem('county').title('Counties').icon(EarthAmericasIcon),
            ])
        ),

      S.documentTypeListItem('testimonial').title('Testimonials').icon(StarIcon),
      S.documentTypeListItem('event').title('Events').icon(CalendarIcon),

      S.listItem()
        .title('Article Comments')
        .icon(CommentIcon)
        .child(
          S.list()
            .title('Article Comments')
            .items([
              S.listItem()
                .title('Pending approval')
                .icon(CommentIcon)
                .child(
                  S.documentList()
                    .title('Pending Approval')
                    .schemaType('comment')
                    .filter('_type == "comment" && approved != true')
                    .defaultOrdering([{ field: 'submittedAt', direction: 'desc' }])
                ),
              S.listItem()
                .title('Published')
                .icon(CommentIcon)
                .child(
                  S.documentList()
                    .title('Published Comments')
                    .schemaType('comment')
                    .filter('_type == "comment" && approved == true')
                    .defaultOrdering([{ field: 'submittedAt', direction: 'desc' }])
                ),
            ])
        ),

      S.divider(),

      // ─────────────────────── SETTINGS ───────────────────────
      S.listItem()
        .title('Settings')
        .icon(CogIcon)
        .child(
          S.list()
            .title('Site Settings')
            .items([
              S.listItem().title('General (site name, SEO, currency)').icon(RocketIcon)
                .child(S.document().schemaType('generalSettings').documentId('generalSettings')),
              S.listItem().title('Brand Assets (logos, favicon)').icon(ImageIcon)
                .child(S.document().schemaType('brandSettings').documentId('brandSettings')),
              S.listItem().title('Contact Details (phone, email, address)').icon(EnvelopeIcon)
                .child(S.document().schemaType('contactSettings').documentId('contactSettings')),
              S.listItem().title('Social Links (WhatsApp, LinkedIn, YouTube…)').icon(UsersIcon)
                .child(S.document().schemaType('socialSettings').documentId('socialSettings')),
            ])
        ),

      // Hide anything already placed above so the list stays clean.
      ...S.documentTypeListItems().filter(
        (listItem) =>
          ![
            'post', 'property', 'event', 'district', 'county', 'testimonial', 'comment',
            'generalSettings', 'brandSettings', 'contactSettings', 'socialSettings',
            'siteSettings', 'homePage',
            'heroSection', 'secondarySection', 'propertiesSection',
            'experienceSection', 'spotlightSection', 'closingSection',
          ].includes(listItem.getId() || '')
      ),
    ])
