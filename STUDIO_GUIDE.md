# Pavani Realty - Content Studio Guide (UAT)

This guide is for **non-technical editors**. It explains how to log in and edit
every part of the website. No coding required.

---

## 1. Where to edit content

| Studio                          | Link                             | Use it for                          |
| ------------------------------- | -------------------------------- | ----------------------------------- |
| **Hosted Studio (recommended)** | **https://pavani.sanity.studio** | Day-to-day editing from any browser |
| Embedded Studio                 | `https://<your-website>/studio`  | Same thing, built into the website  |

**Logging in:** open the link, click **“Continue with Google”** (or the email
you were invited with) and approve. If you can’t get in, ask the site owner to
invite your email at _Project → Members_.

Editing model: change a field → click **Publish** (bottom-right). Until you
press Publish your change is a private **draft** and won’t show on the live site.

---

## 2. How the Studio is organised

The left sidebar mirrors the website, top to bottom:

### 🏠 Home Page

Opens the two editable parts of the homepage:

- **1 · Hero Video (background)** - the looping background video at the very top.
  (The headline “Nairobi’s Finest Addresses” is a fixed brand statement.)
- **2 · Featured Properties** - pick which properties appear in the “Exceptional
  Residences” row. You select existing properties from your list; their photos
  and prices are pulled in automatically.

### 📝 Insights / Journal

Your articles. Each **Insight Article** has:

- **Headline**, **Category**, **Short Summary**, **Cover Image**
- **Read-More Link** - paste the LinkedIn post / blog URL the “Read on LinkedIn”
  button opens
- **Publish Date** - controls the order (newest first)
- **Feature at the top?** - turn ON for exactly **one** article to make it the
  large banner at the top of the Insights page.

### 🏢 Properties

Your full listing inventory. Each property has descriptive fields:
photos, price + currency, beds/baths, size, amenities, **Video Tour (YouTube)**,
location/district, compliance documents, and more. The website builds the
listing grid and each property page from these automatically.

### 🗺️ Neighbourhoods

- **Districts** (Westlands, Karen, Muthaiga, …) - used to tag properties.
- **Counties** - e.g. Nairobi. Pick the county first, then the district.

### 💬 Testimonials

Client quotes shown on the Home and About pages. Fields: quote, client name,
role, star rating, and a **Display Order** number (1 shows first).

### 📅 Events

Optional events used by the homepage Spotlight.

### ⚙️ Settings

Brand-wide details - change once, updates everywhere:

- **General** - site name, SEO description, default currency.
- **Brand Assets** - upload logos & favicon.
- **Contact Details** - phone, email, office address (used on the Contact page,
  footer, and the “Call / Email” buttons).
- **Social Links** - **WhatsApp number**, LinkedIn, YouTube, Instagram, Facebook,
  TikTok, X. These power the floating social rail, the WhatsApp button, the
  footer icons, the Gallery’s YouTube links, and the Insights “Follow on
  LinkedIn” buttons.

---

## 3. Common tasks

- **Add a property:** Properties → **Create** → fill fields → **Publish**.
  To show it on the homepage, also add it under **Home Page → Featured Properties**.
- **Add a property video:** open the property → **Video Tour URL** → paste a
  YouTube link → Publish. A “Property Video Tour” section appears on that page.
- **Publish an article:** Insights → Create → fill fields, set the Read-More link,
  set Publish Date → Publish.
- **Change phone / WhatsApp / socials:** Settings → Contact Details / Social Links.
- **Swap a logo:** Settings → Brand Assets.

---

## 4. Project facts (for the developer)

- Sanity project: **pavani** · id `b9pxg5gg` · dataset `production`
- The website (`.env.local`) already points at this project.
- Schemas live in `sanity/schemaTypes/`; Studio navigation in `sanity/structure.ts`.
- Redeploy the hosted Studio after schema changes: `npx sanity deploy`
  (and `npx sanity schema deploy` to refresh the deployed schema).
- The dataset has been **seeded** with sample settings, 4 properties, 6 districts,
  6 insight articles and 3 testimonials so UAT starts populated.

### Not yet CMS-driven (hardcoded by design - can be wired on request)

- About page body copy (story, leadership bio, core values, why-us)
- Gallery page photo/video lists
- Home hero headline + closing CTA copy (fixed brand statements)
