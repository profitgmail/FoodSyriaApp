import Head from 'next/head'
import { useRouter } from 'next/navigation'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  ogImage?: string
  ogUrl?: string
  noIndex?: boolean
}

export default function SEO({
  title = 'مطعم سوريا - أطيب الأطباق السورية التقليدية',
  description = 'مطعم سوريا يقدم أطيب الأطباق السورية التقليدية مع تجربة طعام أصيلة. اطلق طلبك أو احجز طاولة الآن.',
  keywords = 'مطعم سوريا, أطباق سورية, طعام سوري, حجز طاولات, طلب طعام, مطعم عربي',
  ogImage = '/og-image.jpg',
  ogUrl,
  noIndex = false
}: SEOProps) {
  const router = useRouter()
  const currentUrl = ogUrl || (typeof window !== 'undefined' ? window.location.origin : '') + router.asPath

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": "مطعم سوريا",
    "description": description,
    "image": ogImage,
    "url": currentUrl,
    "telephone": "+966500000000",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "شارع الملك فهد",
      "addressLocality": "الرياض",
      "addressRegion": "الرياض",
      "postalCode": "12345",
      "addressCountry": "SA"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 24.7136,
      "longitude": 46.6753
    },
    "openingHours": "Mo-Su 12:00-23:00",
    "servesCuisine": "Syrian",
    "priceRange": "$$",
    "menu": `${currentUrl}#menu`,
    "acceptsReservations": "True"
  }

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="مطعم سوريا" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow"} />
      
      {/* Open Graph Tags */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:site_name" content="مطعم سوريا" />
      <meta property="og:locale" content="ar_SA" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Additional SEO Tags */}
      <meta name="theme-color" content="#ea580c" />
      <meta name="msapplication-TileColor" content="#ea580c" />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      
      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={currentUrl} />
      
      {/* Language and Direction */}
      <html lang="ar" dir="rtl" />
    </Head>
  )
}