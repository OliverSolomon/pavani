import { defineQuery } from 'next-sanity'

export const HOME_PAGE_QUERY = defineQuery(`{
  "heroVideo": *[_type == "heroSection"][0]{
    ...,
    "fileUrl": videoFile.asset->url
  },
  "secondaryVideo": *[_type == "secondarySection"][0]{
    ...,
    "fileUrl": videoFile.asset->url
  },
  "propertiesSection": *[_type == "propertiesSection"][0]{
    ...,
    featuredProperties[]-> {
      _id,
      title,
      "slug": slug.current,
      buildingName,
      price,
      "imageUrl": coalesce(
        image.asset->url, 
        image.externalUrl,
        media[_type == "image"][0].asset->url,
        media[_type == "externalImage"][0].url
      ),
      "county": county->name,
      "district": district->name,
      details,
      propertyType
    }
  },
  "experienceVideo": *[_type == "experienceSection"][0]{
    ...,
    "fileUrl": videoFile.asset->url
  },
  "spotlightSection": *[_type == "spotlightSection"][0]{
    ...,
    featuredEvent-> {
      title,
      description,
      location,
      date,
      "imageUrl": image.asset->url,
      media[] {
        ...,
        _type == "image" => {
          "url": asset->url
        },
        _type == "externalImage" => {
          "url": url
        }
      }
    }
  },
  "closingVideo": *[_type == "closingSection"][0]{
    ...,
    "fileUrl": videoFile.asset->url
  }
}`)

export const PROPERTIES_QUERY = defineQuery(`*[_type == "property"] | order(_createdAt desc) {
  _id,
  title,
  buildingName,
  price,
  "slug": slug.current,
  "imageUrl": coalesce(
    image.asset->url, 
    image.externalUrl,
    media[_type == "image"][0].asset->url,
    media[_type == "externalImage"][0].url
  ),
  "county": county->name,
  "district": district->{
    name,
    boundary
  },
  "street": street->name,
  details,
  propertyType,
  status,
  shortDescription,
  googleMapsUrl,
  amenities,
  size,
  yearBuilt,
  media[] {
    ...,
    _type == "image" => {
      "url": asset->url
    },
    _type == "externalImage" => {
      "url": url
    }
  }
}`)

export const PROPERTY_DETAIL_QUERY = defineQuery(`*[_type == "property" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  buildingName,
  price,
  "imageUrl": coalesce(
    image.asset->url, 
    image.externalUrl,
    media[_type == "image"][0].asset->url,
    media[_type == "externalImage"][0].url
  ),
  "county": county->name,
  "district": district-> {
    _id,
    "name": name,
    "slug": slug.current,
    description,
    "photos": photos[].asset->url
  },
  "street": street->name,
  details,
  propertyType,
  status,
  shortDescription,
  longDescription,
  googleMapsUrl,
  videoTour,
  amenities,
  size,
  yearBuilt,
  seo{ metaTitle, metaDescription, keywords, noIndex, "ogImage": coalesce(ogImage.asset->url, ogImage.externalUrl) },
  media[] {
    ...,
    _type == "image" => {
      "url": asset->url
    },
    _type == "externalImage" => {
      "url": url
    }
  },
  verificationDocuments[] {
    ...,
    _type == "file" => {
      "url": asset->url,
      "originalFilename": asset->originalFilename
    },
    _type == "image" => {
      "url": asset->url
    }
  },
  "similarProperties": *[_type == "property" && _id != ^._id] | order(_createdAt desc) [0...4] {
    _id,
    title,
    "slug": slug.current,
    price,
    googleMapsUrl,
    "imageUrl": coalesce(
      image.asset->url, 
      image.externalUrl,
      media[_type == "image"][0].asset->url,
      media[_type == "externalImage"][0].url
    ),
    "district": district->name,
    details,
    propertyType
  }
}`)

export const NEIGHBORHOOD_QUERY = defineQuery(`*[_type == "district" && slug.current == $slug][0] {
  _id,
  name,
  "slug": slug.current,
  "county": county->name,
  description,
  "mainImage": mainImage.asset->url,
  "photos": photos[].asset->url,
  amenities,
  schools,
  malls
}`)

export const SITE_SETTINGS_QUERY = defineQuery(`{
  "general": *[_type == "generalSettings"][0]{
    ...,
    "ogImage": coalesce(ogImage.asset->url, ogImage.externalUrl)
  },
  "brand": *[_type == "brandSettings"][0]{
    ...,
    "logoPrimary": logoPrimary.asset->url,
    "logoWhite": logoWhite.asset->url,
    "favicon": favicon.asset->url
  },
  "contact": *[_type == "contactSettings"][0],
  "socials": *[_type == "socialSettings"][0]
}`)

export const INSIGHTS_QUERY = defineQuery(`*[_type == "post"] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  category,
  excerpt,
  "coverImage": coalesce(coverImage.asset->url, coverImage.externalUrl),
  externalUrl,
  publishedAt,
  featured
}`)

export const TESTIMONIALS_QUERY = defineQuery(`*[_type == "testimonial"] | order(order asc) {
  _id,
  quote,
  authorName,
  authorRole,
  rating
}`)

export const POST_SLUGS_QUERY = defineQuery(`*[_type == "post" && defined(slug.current)]{ "slug": slug.current }`)

export const POST_BY_SLUG_QUERY = defineQuery(`*[_type == "post" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  category,
  excerpt,
  "coverImage": coalesce(coverImage.asset->url, coverImage.externalUrl),
  externalUrl,
  publishedAt,
  _updatedAt,
  content,
  seo{ metaTitle, metaDescription, keywords, noIndex, "ogImage": coalesce(ogImage.asset->url, ogImage.externalUrl) }
}`)

export const COMMENTS_BY_POST_QUERY = defineQuery(`*[_type == "comment" && approved == true && post._ref == $postId] | order(submittedAt desc){
  _id,
  name,
  rating,
  message,
  submittedAt
}`)

export const ABOUT_PAGE_QUERY = defineQuery(`*[_type == "aboutPage"][0]{
  heroEyebrow, heroTitle, heroSubtitle,
  storyTitle, storyParagraphs,
  leaderName, leaderRole, leaderQuote, leaderBio,
  "leaderImage": coalesce(leaderImage.asset->url, leaderImage.externalUrl),
  coreValuesTitle, coreValues[]{title, body},
  whyUsTitle, whyUs[]{title, body},
  testimonialsTitle,
  ctaTitle, ctaText, ctaButtonLabel,
  "ctaImage": coalesce(ctaImage.asset->url, ctaImage.externalUrl),
  seo{ metaTitle, metaDescription, keywords, noIndex, "ogImage": coalesce(ogImage.asset->url, ogImage.externalUrl) }
}`)

export const CONTACT_PAGE_QUERY = defineQuery(`*[_type == "contactPage"][0]{
  heroEyebrow, heroTitle,
  officesLabel, officeName,
  formEyebrow, formTitle,
  seo{ metaTitle, metaDescription, keywords, noIndex, "ogImage": coalesce(ogImage.asset->url, ogImage.externalUrl) }
}`)

export const INSIGHTS_PAGE_QUERY = defineQuery(`*[_type == "insightsPage"][0]{
  heroEyebrow, heroTitle, heroIntro,
  gridEyebrow, gridTitle,
  ctaTitle, ctaText,
  seo{ metaTitle, metaDescription, keywords, noIndex, "ogImage": coalesce(ogImage.asset->url, ogImage.externalUrl) }
}`)

export const SEARCH_QUERY = defineQuery(`*[_type == "district"] {
  _id,
  name,
  "slug": slug.current,
  "properties": *[_type == "property" && district._ref == ^._id] {
    _id,
    title,
    "slug": slug.current,
    "imageUrl": coalesce(
      image.asset->url, 
      image.externalUrl,
      media[_type == "image"][0].asset->url,
      media[_type == "externalImage"][0].url
    )
  }
}`)
export const NEIGHBORHOODS_QUERY = defineQuery(`*[_type == "district"] {
  _id,
  name,
  "slug": slug.current,
  boundary,
  "properties": *[_type == "property" && district._ref == ^._id] {
    _id,
    title,
    "slug": slug.current,
    price,
    "imageUrl": coalesce(image.asset->url, image.externalUrl),
    googleMapsUrl,
    "district": district->name,
    "county": county->name
  }
}`)
