import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4 Configuration - 1activegeek Hybrid Blog + Garden
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "1activegeek",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: false,
    analytics: {
      provider: "google",
      tagId: "UA-97873060-1",
    },
    locale: "en-US",
    baseUrl: "1activegeek.com",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "created",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Nunito",
        body: "Nunito",
        code: "JetBrains Mono",
      },
      colors: {
        lightMode: {
          light: "#2c2f36",
          lightgray: "#3e4250",
          gray: "#707890",
          darkgray: "#c9d3e7",
          dark: "#f8fafc",
          secondary: "#1abc9c",
          tertiary: "#3ee4c4",
          highlight: "rgba(26, 188, 156, 0.15)",
          textHighlight: "#1abc9c55",
        },
        darkMode: {
          light: "#2c2f36",
          lightgray: "#3e4250",
          gray: "#707890",
          darkgray: "#c9d3e7",
          dark: "#f8fafc",
          secondary: "#1abc9c",
          tertiary: "#3ee4c4",
          highlight: "rgba(26, 188, 156, 0.15)",
          textHighlight: "#1abc9c55",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
    ],
  },
}

export default config
