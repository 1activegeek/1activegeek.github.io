import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { QuartzPluginData } from "../plugins/vfile"
import { FullSlug, resolveRelative } from "../util/path"
import { Date as DateComponent, getDate } from "./Date"
import { GlobalConfiguration } from "../cfg"

export type SortFn = (f1: QuartzPluginData, f2: QuartzPluginData) => number

export function byDateDescending(cfg: GlobalConfiguration): SortFn {
  const toDate = (value: unknown): Date | undefined => {
    if (!value) return undefined
    if (value instanceof globalThis.Date) return value
    const parsed = new globalThis.Date(value as string | number)
    return isNaN(parsed.getTime()) ? undefined : parsed
  }

  return (f1, f2) => {
    const frontmatterDate1 = toDate(
      f1.frontmatter?.date ??
        f1.frontmatter?.published ??
        f1.frontmatter?.created ??
        f1.frontmatter?.modified,
    )
    const frontmatterDate2 = toDate(
      f2.frontmatter?.date ??
        f2.frontmatter?.published ??
        f2.frontmatter?.created ??
        f2.frontmatter?.modified,
    )

    const date1 =
      frontmatterDate1 ??
      f1.dates?.published ??
      f1.dates?.created ??
      f1.dates?.modified ??
      getDate(cfg, f1)
    const date2 =
      frontmatterDate2 ??
      f2.dates?.published ??
      f2.dates?.created ??
      f2.dates?.modified ??
      getDate(cfg, f2)

    if (date1 && date2) {
      return date2.getTime() - date1.getTime()
    } else if (date1 && !date2) {
      return -1
    } else if (!date1 && date2) {
      return 1
    }
    return 0
  }
}

interface BlogOptions {
  showTags: boolean
  showExcerpt: boolean
}

const defaultOptions: BlogOptions = {
  showTags: true,
  showExcerpt: true,
}

export default ((opts?: Partial<BlogOptions>) => {
  const options = { ...defaultOptions, ...opts }

  const BlogListing: QuartzComponent = ({ allFiles, fileData, cfg }: QuartzComponentProps) => {
    // Filter for blog posts only (section: blog) and published (not unlisted)
    const blogPosts = allFiles.filter(
      (file) =>
        file.frontmatter?.section === "blog" &&
        !file.slug?.endsWith("/index") &&
        file.frontmatter?.publish !== "unlisted" &&
        !file.frontmatter?.unlisted,
    )

    // Sort by date descending
    const sorter = byDateDescending(cfg)
    const sortedPosts = [...blogPosts].sort(sorter)

    const isHome = fileData.slug === "index"

    const tagCounts = new Map<string, number>()
    for (const post of blogPosts) {
      for (const tag of post.frontmatter?.tags ?? []) {
        tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1)
      }
    }
    const tagList = Array.from(tagCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([tag]) => tag)
      .slice(0, 16)

    const twitterUrl = "https://twitter.com/1activegeek"
    const instagramUrl = "https://www.instagram.com/1activegeek"
    const coffeeUrl = "https://paypal.me/shawnmix/3"

    if (isHome) {
      const heroPost = sortedPosts[0]
      const heroImage = heroPost?.frontmatter?.image
      const heroImageUrl = heroImage ? `/img/${heroImage}` : undefined
      const postsWithoutHero = sortedPosts.filter((post) => post.slug !== heroPost?.slug)

      return (
        <div class="blog-listing home-listing">
          {heroPost && (
            <section class="home-hero-card">
              <a
                href={resolveRelative(fileData.slug!, heroPost.slug!)}
                class="home-hero-link internal"
                style={heroImageUrl ? `background-image: url('${heroImageUrl}')` : undefined}
              >
                <div class="home-hero-overlay">
                  <h2>{heroPost.frontmatter?.title}</h2>
                  {heroPost.description && <p class="home-hero-excerpt">{heroPost.description}</p>}
                  <span class="home-hero-cta">Read More</span>
                </div>
              </a>
            </section>
          )}

          <div class="blog-layout">
            <div class="blog-main">
              <section class="recent-posts">
                <div class="post-grid">
                  {postsWithoutHero.map((post) => (
                    <article class="blog-card">
                      {post.frontmatter?.image && (
                        <img
                          src={`/img/${post.frontmatter.image}`}
                          alt={post.frontmatter.title}
                          loading="lazy"
                        />
                      )}
                      <h3>
                        <a href={resolveRelative(fileData.slug!, post.slug!)} class="internal">
                          {post.frontmatter?.title}
                        </a>
                      </h3>
                      <div class="meta">
                        {post.dates && (
                          <DateComponent date={getDate(cfg, post)!} locale={cfg.locale} />
                        )}
                      </div>
                      {options.showExcerpt && post.description && (
                        <p class="excerpt">{post.description}</p>
                      )}
                      {options.showTags && post.frontmatter?.tags && (
                        <div class="tags">
                          {post.frontmatter.tags.map((tag: string) => (
                            <a
                              href={resolveRelative(fileData.slug!, `tags/${tag}` as FullSlug)}
                              class="tag"
                            >
                              {tag}
                            </a>
                          ))}
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              </section>
            </div>

            <aside class="blog-sidebar">
              <section class="sidebar-card">
                <h3>Subscribe & Follow</h3>
                <div class="social-links">
                  <a href={twitterUrl} class="social-button" aria-label="Twitter">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      aria-hidden="true"
                    >
                      <path
                        d="M23 4.5c-.8.4-1.6.6-2.5.8.9-.5 1.5-1.3 1.9-2.3-.8.5-1.7.9-2.6 1.1a4.3 4.3 0 0 0-7.4 3v.5C8 7.4 5.1 6 3.1 3.7c-.4.7-.6 1.4-.6 2.3 0 1.5.8 2.8 2 3.6-.7 0-1.4-.2-2-.5v.1c0 2.1 1.5 3.8 3.5 4.2-.4.1-.8.2-1.2.2-.3 0-.6 0-.9-.1.6 1.8 2.3 3.2 4.3 3.2A8.6 8.6 0 0 1 1 19.1c2.1 1.3 4.5 2 7.1 2 8.5 0 13.2-7.1 13.2-13.2v-.6c.9-.7 1.6-1.4 2.2-2.3z"
                        fill="currentColor"
                      />
                    </svg>
                  </a>
                  <a href={instagramUrl} class="social-button" aria-label="Instagram">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      aria-hidden="true"
                    >
                      <path
                        d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm10 2H7a2 2 0 0 0-2 2v10c0 1.1.9 2 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm-5 3.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zm0 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zm5.2-3.1a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0z"
                        fill="currentColor"
                      />
                    </svg>
                  </a>
                </div>
              </section>

              <section class="sidebar-card">
                <a href={coffeeUrl} class="coffee-card">
                  <img src="/img/buymeacoffee.png" alt="Buy me a coffee" loading="lazy" />
                </a>
              </section>

              <section class="sidebar-card">
                <h3>Tag Cloud</h3>
                <div class="tag-cloud">
                  {tagList.map((tag) => (
                    <a
                      href={resolveRelative(fileData.slug!, `tags/${tag}` as FullSlug)}
                      class="tag"
                    >
                      {tag}
                    </a>
                  ))}
                </div>
              </section>
            </aside>
          </div>
        </div>
      )
    }

    return (
      <div class="blog-listing">
        <section class="recent-posts">
          <div class="post-grid">
            {sortedPosts.map((post) => (
              <article class="blog-card">
                {post.frontmatter?.image && (
                  <img
                    src={`/img/${post.frontmatter.image}`}
                    alt={post.frontmatter.title}
                    loading="lazy"
                  />
                )}
                <h3>
                  <a href={resolveRelative(fileData.slug!, post.slug!)} class="internal">
                    {post.frontmatter?.title}
                  </a>
                </h3>
                <div class="meta">
                  {post.dates && <DateComponent date={getDate(cfg, post)!} locale={cfg.locale} />}
                </div>
                {options.showExcerpt && post.description && (
                  <p class="excerpt">{post.description}</p>
                )}
                {options.showTags && post.frontmatter?.tags && (
                  <div class="tags">
                    {post.frontmatter.tags.map((tag: string) => (
                      <a
                        href={resolveRelative(fileData.slug!, `tags/${tag}` as FullSlug)}
                        class="tag"
                      >
                        {tag}
                      </a>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
      </div>
    )
  }

  return BlogListing
}) satisfies QuartzComponentConstructor
