import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { QuartzPluginData } from "../plugins/vfile"
import { resolveRelative } from "../util/path"
import { Date } from "./Date"
import Graph from "./Graph"

export type SortFn = (f1: QuartzPluginData, f2: QuartzPluginData) => number

export function byModifiedDateDescending(): SortFn {
  return (f1, f2) => {
    // Prefer modified date, fall back to created date
    const f1Date = f1.dates?.modified || f1.dates?.created
    const f2Date = f2.dates?.modified || f2.dates?.created

    if (f1Date && f2Date) {
      return f2Date.getTime() - f1Date.getTime()
    } else if (f1Date && !f2Date) {
      return -1
    } else if (!f1Date && f2Date) {
      return 1
    }
    return 0
  }
}

export default (() => {
  const GardenExplorer: QuartzComponent = ({ allFiles, fileData, cfg }: QuartzComponentProps) => {
    // Filter for garden notes only (section: garden)
    const gardenNotes = allFiles.filter(
      (file) =>
        file.frontmatter?.section === "garden" &&
        file.frontmatter?.publish !== "unlisted" &&
        !file.frontmatter?.unlisted,
    )

    // Sort by modified date (or created if no modified)
    const sorter = byModifiedDateDescending()
    const sortedNotes = gardenNotes.sort(sorter)

    // Only show on garden index page
    if (fileData.slug !== "garden/index") {
      return null
    }

    return (
      <div class="garden-landing">
        <section class="hero">
          <h1>Digital Garden</h1>
          <p>
            A living collection of notes, thoughts, and references. Explore the interconnected web
            of ideas below.
          </p>
        </section>

        <section class="graph-container">
          <div class="graph-title">Knowledge Graph</div>
          <Graph />
        </section>

        {sortedNotes.length > 0 && (
          <section class="recent-notes">
            <h2>Recently Cultivated</h2>
            <div class="note-list">
              {sortedNotes.slice(0, 10).map((note) => (
                <a href={resolveRelative(fileData.slug!, note.slug!)} class="note-item">
                  <div class="note-title">{note.frontmatter?.title}</div>
                  <div class="note-meta">
                    {note.dates?.modified && (
                      <span>
                        Updated <Date date={note.dates.modified} locale={cfg.locale} />
                      </span>
                    )}
                    {!note.dates?.modified && note.dates?.created && (
                      <span>
                        Created <Date date={note.dates.created} locale={cfg.locale} />
                      </span>
                    )}
                  </div>
                  {note.description && <p class="note-desc">{note.description}</p>}
                </a>
              ))}
            </div>
          </section>
        )}

        {sortedNotes.length === 0 && (
          <section class="empty-garden">
            <p>
              The garden is just beginning to grow. Notes with <code>section: garden</code> will
              appear here.
            </p>
          </section>
        )}
      </div>
    )
  }

  return GardenExplorer
}) satisfies QuartzComponentConstructor
