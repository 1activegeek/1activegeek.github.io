import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { joinSegments, pathToRoot } from "../util/path"
import Search from "./Search"

const TopNav: QuartzComponent = (props: QuartzComponentProps) => {
  const { fileData, cfg } = props
  const baseDir = pathToRoot(fileData.slug!)
  const SearchComponent = Search()

  return (
    <div class="top-nav">
      <div class="top-nav__inner">
        <a class="top-nav__logo internal" href={baseDir}>
          {cfg.pageTitle}
        </a>
        <nav class="top-nav__links">
          <a class="internal" href={baseDir}>
            Home
          </a>
          <a class="internal" href={joinSegments(baseDir, "about")}>
            About
          </a>
        </nav>
        <div class="top-nav__actions">
          <SearchComponent {...props} />
          <a class="top-nav__rss" href={joinSegments(baseDir, "index.xml")} aria-label="RSS Feed">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="18"
              height="18"
              aria-hidden="true"
            >
              <path
                d="M4.5 18.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm0-6a6 6 0 0 1 6 6h-3a3 3 0 0 0-3-3v-3zm0-6a12 12 0 0 1 12 12h-3a9 9 0 0 0-9-9v-3z"
                fill="currentColor"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}

TopNav.css = ""

export default (() => TopNav) satisfies QuartzComponentConstructor
