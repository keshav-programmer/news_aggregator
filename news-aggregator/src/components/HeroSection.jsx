
import {
  ArrowUpRight,
  Globe2,
} from 'lucide-react'

function HeroSection({ articles, setCategory, setShowBookmarks }) {
  return (
    <section className="mb-12 grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-center">
      <div className="py-2">
        <div className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-orange-400">
          <span className="h-2 w-2 animate-pulse rounded-full bg-orange-500" />
          Your daily briefing
        </div>

        <h1 className="max-w-2xl text-4xl font-black leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
          Stay informed.
          <br />
          <span className="text-orange-400">Stay ahead.</span>
        </h1>

        <p className="mt-5 max-w-xl text-base leading-7 text-gray-400 sm:text-lg">
          The stories that matter, from India to every corner of the
          world. Less noise, more perspective.
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          <button
            onClick={() =>
              document.getElementById('news-feed')?.scrollIntoView({
                behavior: 'smooth',
              })
            }
            className="flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-400"
          >
            Explore headlines <ArrowUpRight size={17} />
          </button>

          <button
            onClick={() => {
              setCategory('World')
              setShowBookmarks(false)
            }}
            className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-gray-300 transition hover:bg-white/5"
          >
            World news
          </button>
        </div>

        <div className="mt-8 flex items-center gap-6 border-t border-white/10 pt-6">
          <div>
            <p className="text-2xl font-bold">{articles.length}</p>
            <p className="mt-1 text-xs text-gray-500">Demo stories</p>
          </div>

          <div className="h-9 w-px bg-white/10" />

          <div>
            <p className="text-2xl font-bold">8</p>
            <p className="mt-1 text-xs text-gray-500">News sections</p>
          </div>

          <div className="h-9 w-px bg-white/10" />

          <div>
            <p className="flex items-center gap-1 text-sm font-semibold text-emerald-400">
              <Globe2 size={15} /> Global coverage
            </p>
            <p className="mt-1 text-xs text-gray-500">India + world</p>
          </div>
        </div>
      </div>

      <div className="relative min-h-[280px] overflow-hidden rounded-2xl border border-white/10 sm:min-h-[350px]">
        <img
          src={articles[0].image}
          alt="India's iconic Taj Mahal"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
          <span className="rounded-md bg-orange-500 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white">
            Editor's spotlight
          </span>

          <h2 className="mt-4 max-w-lg text-2xl font-bold leading-tight text-white sm:text-3xl">
            Stories that help you see the bigger picture.
          </h2>

          <p className="mt-3 text-sm text-gray-300">
            India, innovation and a changing world.
          </p>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
