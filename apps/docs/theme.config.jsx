export default {
  logo: <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>📚 UWDSC Website Docs</span>,
  project: {
    link: "https://github.com/uw-datasci/uwdsc-website-v3",
  },
  docsRepositoryBase: "https://github.com/uw-datasci/uwdsc-website-v3/tree/main/apps/docs",
  footer: {
    text: (
      <span>
        {new Date().getFullYear()} © UW Data Science Club
      </span>
    ),
  },
  useNextSeoProps() {
    return {
      titleTemplate: "%s – UWDSC Docs",
    };
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="UWDSC Website Documentation" />
      <meta
        property="og:description"
        content="Developer documentation for the UW Data Science Club monorepo"
      />
    </>
  ),
  primaryHue: 200,
  sidebar: {
    defaultMenuCollapseLevel: Infinity,
    toggleButton: false,
  },
};

