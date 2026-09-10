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

const PROMPT = "guest@introserver:~$";

export default function Home() {
  return (
    <div className="mx-auto min-h-screen max-w-2xl px-4 py-10 sm:py-16">
      <div className="overflow-hidden rounded-md border border-foreground-dim shadow-[0_0_25px_rgba(51,255,102,0.15)]">
        <div className="flex items-center gap-2 border-b border-foreground-dim bg-black/40 px-4 py-2">
          <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
          <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
          <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
          <span className="ml-2 truncate text-xs text-foreground-dim">
            {PROMPT.replace("$", "")}
          </span>
        </div>

        <div className="space-y-6 break-words px-5 py-6 text-sm leading-relaxed sm:text-base">
          <p>
            <span className="text-foreground-dim">{PROMPT}</span> cat profile.txt
          </p>

          <section>
            <p className="text-foreground-dim"># NAME</p>
            <p>{profile.name}</p>
            <p className="mt-2 text-foreground-dim"># AFFIL</p>
            <p>{profile.affiliation}</p>
          </section>

          <section>
            <p className="text-foreground-dim"># INTRO</p>
            <p>{profile.intro}</p>
          </section>

          <section>
            <p className="text-foreground-dim"># INTERESTS</p>
            <ul>
              {profile.interests.map((interest) => (
                <li key={interest}>- {interest}</li>
              ))}
            </ul>
          </section>

          <section>
            <p className="text-foreground-dim"># PROJECTS</p>
            <ul className="space-y-2">
              {(profile.projects as Project[]).map((project) => (
                <li key={project.title}>
                  <p>
                    [
                    {project.url ? (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline decoration-dotted underline-offset-2 hover:text-white"
                      >
                        {project.title}
                      </a>
                    ) : (
                      project.title
                    )}
                    ]
                  </p>
                  <p className="pl-2 text-foreground-dim">
                    └ {project.description}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <p className="text-foreground-dim"># LINKS</p>
            <ul>
              {(profile.links as Link[])
                .filter((link) => link.url)
                .map((link) => (
                  <li key={link.label}>
                    {link.label}:{" "}
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-dotted underline-offset-2 hover:text-white"
                    >
                      {link.url}
                    </a>
                  </li>
                ))}
            </ul>
          </section>

          <p>
            <span className="text-foreground-dim">{PROMPT}</span>{" "}
            <span className="cursor">█</span>
          </p>
        </div>
      </div>
    </div>
  );
}
