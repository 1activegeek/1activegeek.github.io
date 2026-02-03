import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { QuartzPluginData } from "../plugins/vfile"
import { FullSlug, resolveRelative } from "../util/path"
import { Date, getDate } from "./Date"
import { GlobalConfiguration } from "../cfg"

export type SortFn = (f1: QuartzPluginData, f2: QuartzPluginData) => number

export function byDateDescending(cfg: GlobalConfiguration): SortFn {
  return (f1, f2) => {
    if (f1.dates && f2.dates) {
      return getDate(cfg, f2)!.getTime() - getDate(cfg, f1)!.getTime()
    } else if (f1.dates && !f2.dates) {
      return -1
    } else if (!f1.dates && f2.dates) {
      return 1
    }
    return 0
  }
}

interface BlogOptions {
  showFeatured: boolean
  showTags: boolean
  showExcerpt: boolean
}

const defaultOptions: BlogOptions = {
  showFeatured: true,
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
        file.frontmatter?.publish !== "unlisted" &&
        !file.frontmatter?.unlisted,
    )

    // Sort by date descending
    const sorter = byDateDescending(cfg)
    const sortedPosts = blogPosts.sort(sorter)

    // Separate featured posts (only if showFeatured is true)
    const featuredPosts = options.showFeatured
      ? sortedPosts.filter((p) => p.frontmatter?.featured)
      : []
    const regularPosts = sortedPosts.filter((p) => !p.frontmatter?.featured)

    return (
      <div class="blog-listing">
        {options.showFeatured && featuredPosts.length > 0 && (
          <section class="featured-posts">
            <h2>Featured</h2>
            <div class="featured-grid">
              {featuredPosts.map((post) => (
                <article class="blog-card featured">
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
                    {post.dates && <Date date={getDate(cfg, post)!} locale={cfg.locale} />}
                  </div>
                  {options.showExcerpt && post.description && (
                    <p class="excerpt">{post.description}</p>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        <section class="recent-posts">
          {featuredPosts.length > 0 && <h2>Recent Posts</h2>}
          <div class="post-grid">
            {regularPosts.map((post) => (
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
                  {post.dates && <Date date={getDate(cfg, post)!} locale={cfg.locale} />}
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
