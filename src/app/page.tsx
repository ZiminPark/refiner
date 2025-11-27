import Link from 'next/link';

const navLinks = [
  { href: '/home', label: 'App' },
  { href: '/home/history', label: 'History' },
  { href: '/home/settings', label: 'Settings' },
  { href: 'https://eugeneyan.com/', label: 'Inspiration', external: true },
];

const stats = [
  { value: '118,204', label: 'Sentences refined' },
  { value: '38', label: 'Prompt variations iterated' },
  { value: '2.3s', label: 'Average turnaround time' },
];

const updates = [
  {
    date: '23 Nov 2025',
    title: 'Layered explanations for every suggestion',
    summary:
      'Each refinement now ships with rationale inspired by long-form essays so you can see the “why” behind the change.',
  },
  {
    date: '19 Oct 2025',
    title: 'New timeline view in your history',
    summary:
      'Scroll-friendly history mirrors a writing log, making it easier to revisit rough drafts and polished phrasing.',
  },
  {
    date: '14 Sep 2025',
    title: 'Semantic slots for tone & intent',
    summary:
      'Prototype work allows you to hint at tone (direct, warm, succinct) much like annotating an outline.',
  },
];

const resources = [
  { label: 'Pattern Library', description: 'Examples of polished emails, memos, and essays to emulate.', href: '/home/history' },
  { label: 'Prompt Settings', description: 'Curate the default instructions the refiner uses.', href: '/home/settings' },
  { label: 'Working Notes', description: 'A living document on what we are learning about corrections.', href: '/home' },
  { label: 'Release Journal', description: 'Changelog with human-readable summaries, no patch numbers.', href: '/home/history' },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <Link
            href="/"
            className="font-sans text-sm uppercase tracking-[0.3em] text-secondary hover:text-foreground"
          >
            English Refiner
          </Link>
          <nav className="hidden items-center gap-6 text-xs font-sans uppercase tracking-[0.25em] text-secondary md:flex">
            {navLinks.map((link) =>
              link.external ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors hover:text-foreground"
                >
                  {link.label}
                </a>
              ) : (
                <Link key={link.href} href={link.href} className="transition-colors hover:text-foreground">
                  {link.label}
                </Link>
              ),
            )}
          </nav>
          <Link
            href="/home"
            className="font-sans text-xs uppercase tracking-[0.25em] text-primary"
          >
            Launch App →
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-16 space-y-16">
        <section className="space-y-6">
          <p className="font-sans text-xs uppercase tracking-[0.35em] text-secondary">
            AI-powered sentence refinement
          </p>
          <h1 className="text-[2.5rem] leading-snug text-[#333333] sm:text-[3rem]">
            Hi, we&apos;re building a calmer way to polish American English.
          </h1>
          <p className="text-lg text-secondary leading-relaxed">
            Instead of neon gradients and flashing widgets, the refiner mirrors a thoughtful newsletter:
            serif body text, generous whitespace, and deliberate pacing. Paste a sentence, get a refined
            version with rationale, save it for later. That&apos;s it.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm font-sans uppercase tracking-[0.3em] text-secondary">
            <Link
              href="/home"
              className="inline-flex items-center border border-border px-5 py-3 text-[0.85rem] tracking-[0.25em] hover:text-foreground hover:border-foreground transition-colors"
            >
              Try the refiner
            </Link>
            <Link
              href="/home/settings"
              className="inline-flex items-center text-[0.85rem] hover:text-foreground transition-colors"
            >
              Configure prompts
            </Link>
          </div>
        </section>

        <section className="grid gap-6 border-t border-b border-border py-8 text-sm font-sans uppercase tracking-[0.25em] text-secondary sm:grid-cols-3">
          {stats.map((item) => (
            <div key={item.label} className="space-y-2">
              <p className="text-3xl font-light tracking-tight text-[#111]">{item.value}</p>
              <p className="text-xs">{item.label}</p>
            </div>
          ))}
        </section>

        <section className="space-y-6">
          <div className="flex items-baseline justify-between">
            <h2 className="text-[2rem] leading-tight text-[#333]">Latest notes</h2>
            <Link href="/home/history" className="font-sans text-xs uppercase tracking-[0.3em] text-secondary hover:text-foreground">
              View history
            </Link>
          </div>
          <div className="divide-y divide-border border border-border">
            {updates.map((item) => (
              <article key={item.title} className="grid gap-4 px-5 py-6 md:grid-cols-[160px_1fr]">
                <p className="font-sans text-xs uppercase tracking-[0.3em] text-secondary">{item.date}</p>
                <div className="space-y-2">
                  <h3 className="text-xl text-[#333]">{item.title}</h3>
                  <p className="text-base text-secondary leading-relaxed">{item.summary}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-[2rem] leading-tight text-[#333]">Resources we keep close</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {resources.map((resource) => (
              <Link
                key={resource.label}
                href={resource.href}
                className="group border border-border px-5 py-6 transition-colors hover:border-foreground"
              >
                <p className="font-sans text-xs uppercase tracking-[0.3em] text-secondary group-hover:text-foreground">
                  {resource.label}
                </p>
                <p className="mt-2 text-base text-[#333] leading-relaxed">{resource.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="space-y-4 border-t border-border pt-10">
          <p className="font-sans text-xs uppercase tracking-[0.35em] text-secondary">A quiet newsletter</p>
          <p className="text-lg text-secondary leading-relaxed">
            Once a month we send a small roundup: what&apos;s shipped, a prompt tweak worth trying, and
            a favorite sentence spotted in the wild. It&apos;s the same calm pacing you see here.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="Your email address..."
              className="w-full border border-border px-4 py-3 text-base text-foreground placeholder:text-secondary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
            />
            <button className="inline-flex items-center justify-center border border-border px-6 py-3 font-sans text-xs uppercase tracking-[0.3em] text-white bg-primary hover:bg-[hsl(var(--primary-hover))]">
              Subscribe
            </button>
          </div>
          <p className="text-sm text-secondary">
            No spam. Just a note and maybe a prototype link.
          </p>
        </section>
      </main>

      <footer className="border-t border-border bg-white">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-8 text-sm text-secondary md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} English Refiner. Crafted with a serif-first palette.</p>
          <div className="flex gap-6 font-sans text-xs uppercase tracking-[0.3em]">
            <Link href="/home" className="hover:text-foreground">
              App
            </Link>
            <Link href="/home/history" className="hover:text-foreground">
              History
            </Link>
            <Link href="/home/settings" className="hover:text-foreground">
              Settings
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
