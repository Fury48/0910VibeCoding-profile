import profile from "@/data/profile.json";

type Project = {
  title: string;
  description: string;
  url: string;
};

type Link = {
  label: string;
  url: string;
};

export default function Home() {
  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col justify-center gap-10 px-6 py-16">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          {profile.name}
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {profile.affiliation}
        </p>
      </header>

      <section>
        <p className="leading-7 text-zinc-700 dark:text-zinc-300">
          {profile.intro}
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-400">
          관심사
        </h2>
        <ul className="flex flex-wrap gap-2">
          {profile.interests.map((interest) => (
            <li
              key={interest}
              className="rounded-full border border-zinc-200 px-3 py-1 text-sm text-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
            >
              {interest}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-400">
          프로젝트
        </h2>
        <ul className="space-y-3">
          {(profile.projects as Project[]).map((project) => (
            <li key={project.title}>
              {project.url ? (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-zinc-900 underline underline-offset-2 dark:text-zinc-50"
                >
                  {project.title}
                </a>
              ) : (
                <p className="font-medium text-zinc-900 dark:text-zinc-50">
                  {project.title}
                </p>
              )}
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {project.description}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-400">
          링크
        </h2>
        <ul className="flex flex-col gap-1">
          {(profile.links as Link[])
            .filter((link) => link.url)
            .map((link) => (
              <li key={link.label}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-700 underline underline-offset-2 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
                >
                  {link.label}
                </a>
              </li>
            ))}
        </ul>
      </section>
    </div>
  );
}
