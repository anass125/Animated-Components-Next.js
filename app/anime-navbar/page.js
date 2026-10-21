import { AnimeNavBarDemo } from "@/components/ui/anime-navbar-demo"

const sections = [
  {
    id: "home",
    eyebrow: "01 / Home",
    title: "Anime Navbar",
    description:
      "A floating glass navbar with a playful mascot that springs between active items.",
  },
  {
    id: "convert",
    eyebrow: "02 / Convert",
    title: "Responsive by default",
    description:
      "Desktop shows labels. Smaller screens automatically switch to compact Lucide icons.",
  },
  {
    id: "pricing",
    eyebrow: "03 / Pricing",
    title: "Smooth Motion animations",
    description:
      "Spring movement, hover feedback, blinking eyes, glow, sparkles and idle floating are all included.",
  },
  {
    id: "about",
    eyebrow: "04 / About",
    title: "JavaScript + App Router",
    description:
      "No TypeScript is required. The component lives in components/ui and is ready for a shadcn-style codebase.",
  },
]


export default function Page() {
  return (
    <main>
      <AnimeNavBarDemo />

      {sections.map((section, index) => (
        <section
          key={section.id}
          id={section.id}
          className="relative flex min-h-screen scroll-mt-28 items-center justify-center overflow-hidden px-6 py-32"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-70"
            aria-hidden="true"
          >
            <div
              className={`absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl ${index % 2 === 0
                  ? "bg-violet-700/20"
                  : "bg-fuchsia-700/15"
                }`}
            />
          </div>

          <div className="relative mx-auto max-w-4xl text-center">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.35em] text-violet-300/80">
              {section.eyebrow}
            </p>

            <h1 className="text-balance text-5xl font-black tracking-tight text-white sm:text-7xl md:text-8xl">
              {section.title}
            </h1>

            <p className="mx-auto mt-7 max-w-2xl text-pretty text-base leading-8 text-white/55 sm:text-lg">
              {section.description}
            </p>
          </div>
        </section>
      ))}
    </main>
  )
}