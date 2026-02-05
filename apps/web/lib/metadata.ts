import type { Metadata, Viewport } from "next";

const siteUrl = "https://www.uwdatascience.ca/"; // Update with your actual domain

export const baseMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/meta/favicon.ico", type: "image/x-icon" },
      { url: "/meta/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/meta/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/meta/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      {
        url: "/meta/android-icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
    apple: [
      { url: "/meta/apple-icon-57x57.png", sizes: "57x57" },
      { url: "/meta/apple-icon-60x60.png", sizes: "60x60" },
      { url: "/meta/apple-icon-72x72.png", sizes: "72x72" },
      { url: "/meta/apple-icon-76x76.png", sizes: "76x76" },
      { url: "/meta/apple-icon-114x114.png", sizes: "114x114" },
      { url: "/meta/apple-icon-120x120.png", sizes: "120x120" },
      { url: "/meta/apple-icon-144x144.png", sizes: "144x144" },
      { url: "/meta/apple-icon-152x152.png", sizes: "152x152" },
      { url: "/meta/apple-icon-180x180.png", sizes: "180x180" },
    ],
    shortcut: "/meta/favicon.ico",
  },
  manifest: "/meta/manifest.json",
  other: {
    "msapplication-TileColor": "#000211",
    "msapplication-TileImage": "/meta/ms-icon-144x144.png",
  },
};

export const baseViewport: Viewport = {
  themeColor: "#000211",
};

/**
 * Creates metadata for dynamic routes using generateMetadata().
 * Use for API-driven or parameter-based pages, not static routes.
 * @example
 * export async function generateMetadata({ params }) {
 *   const post = await fetchPost(params.id);
 *   return createMetadata({ title: post.title, description: post.excerpt });
 * }
 */
export function createMetadata({
  title,
  description,
  keywords,
  image = "/meta/og-image.png",
  pathname,
}: {
  title: string;
  description?: string;
  keywords?: string;
  image?: string;
  pathname?: string;
}): Metadata {
  const fullTitle = `${title} | UWaterloo Data Science Club`;

  return {
    ...baseMetadata,
    title: fullTitle,
    description: description || "University of Waterloo Data Science Club",
    keywords: keywords,
    alternates: {
      canonical: pathname ? `${siteUrl}${pathname}` : undefined,
    },
    openGraph: {
      type: "website",
      title: fullTitle,
      description: description || "University of Waterloo Data Science Club",
      images: [
        {
          url: image,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary",
      title: fullTitle,
      description: description || "University of Waterloo Data Science Club",
      images: [image],
    },
  };
}
