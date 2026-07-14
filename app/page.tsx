"use client";

import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faGitlab, faTiktok } from "@fortawesome/free-brands-svg-icons";
import { faUsers, faCodeBranch, faCalendar, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Header from "@/components/Header";
import { useState, useEffect } from "react";
import { usePageCache } from "./contexts/PageCacheContext";

export default function Home() {
  const { homeMounted, setHomeMounted, githubData, setGithubData } = usePageCache();
  const [loading, setLoading] = useState(!homeMounted && !githubData);

  useEffect(() => {
    document.title = "playfairs.cc";
  }, []);

  useEffect(() => {
    if (!homeMounted) {
      async function getGitHubData() {
        try {
          const res = await fetch("https://api.github.com/users/playfairs");
          if (!res.ok) {
            throw new Error("Failed to fetch GitHub data");
          }
          const data = await res.json();
          setGithubData(data);
        } catch (error) {
          console.error("Error fetching GitHub data:", error);
        } finally {
          setLoading(false);
          setHomeMounted(true);
        }
      }

      getGitHubData();
    }
  }, [homeMounted, setHomeMounted, setGithubData]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
        <div className="glass-panel px-8 py-6 text-sm uppercase tracking-[0.35em] text-white/70">
          Loading profile…
        </div>
      </div>
    );
  }

  if (!githubData) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
        <div className="glass-panel px-8 py-6 text-sm uppercase tracking-[0.35em] text-white/70">
          Failed to load profile data
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.06),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.04),transparent_24%)]" />

      <Header />

      <main className="relative flex min-h-screen items-center justify-center px-6 py-24 sm:px-8 lg:px-10">
        <div className="w-full max-w-6xl">
          <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
            <section className="glass-panel p-8 sm:p-10">
              <div className="border-b border-white/10 pb-4" />

              <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-start">
                <div className="flex justify-center lg:justify-start">
                  <Image
                    src={githubData.avatar_url}
                    alt={githubData.login}
                    width={112}
                    height={112}
                    className="h-28 w-28 border border-white/15 object-cover sm:h-32 sm:w-32"
                  />
                </div>

                <div className="flex-1">
                  <h1 className="text-3xl font-semibold tracking-[0.2em] text-white sm:text-4xl">
                    {githubData.name || githubData.login}
                  </h1>
                  <p className="mt-2 text-sm font-medium uppercase tracking-[0.28em] text-white/55">
                    @{githubData.login}
                  </p>
                  <p className="mt-3 max-w-xl text-sm leading-7 text-white/70 sm:text-[15px]">
                    {githubData.bio || "Building things, collecting weird corners of the internet, and keeping the signal honest."}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {githubData.location && (
                      <span className="border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-white/60">
                        {githubData.location}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  { label: "Followers", value: githubData.followers, icon: faUsers, url: `https://github.com/${githubData.login}?tab=followers` },
                  { label: "Repos", value: githubData.public_repos, icon: faCodeBranch, url: `https://github.com/${githubData.login}?tab=repositories` },
                  { label: "Following", value: githubData.following, icon: faUsers, url: `https://github.com/${githubData.login}?tab=following` },
                ].map((item) => (
                  <a
                    key={item.label}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-white/10 bg-white/5 p-4 transition hover:border-white/30 hover:bg-white/10"
                  >
                    <div className="flex items-center gap-2 text-white/55">
                      <FontAwesomeIcon icon={item.icon} className="h-3.5 w-3.5" />
                      <span className="text-[10px] uppercase tracking-[0.3em]">{item.label}</span>
                    </div>
                    <p className="mt-3 text-2xl font-semibold text-white">{item.value}</p>
                  </a>
                ))}
              </div>

              <div className="mt-8 border-t border-white/10 pt-6">
                <div className="flex items-center gap-2 text-white/55">
                  <FontAwesomeIcon icon={faCalendar} className="h-3.5 w-3.5" />
                  <span className="text-[10px] uppercase tracking-[0.3em]">joined</span>
                </div>
                <p className="mt-3 text-sm leading-7 text-white/75">{formatDate(githubData.created_at)}</p>
              </div>
            </section>

            <section className="flex flex-col gap-6">
              <div className="glass-panel p-8">
                <div className="border-b border-white/10 pb-4" />

                <div className="mt-6 space-y-3">
                  {[
                    { name: "GITHUB", icon: faGithub, url: "https://github.com/playfairs" },
                    { name: "GITLAB", icon: faGitlab, url: "https://gitlab.com/playfairs" },
                    { name: "TIKTOK", icon: faTiktok, url: "https://tiktok.com/@playfairs" },
                  ].map((link) => (
                    <a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between border border-white/10 bg-white/5 px-4 py-3 transition hover:border-white/30 hover:bg-white/10"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center border border-white/10 bg-white/5 text-white/70">
                          <FontAwesomeIcon icon={link.icon} className="h-4 w-4" />
                        </span>
                        <span className="text-sm font-semibold uppercase tracking-[0.28em] text-white/80">
                          {link.name}
                        </span>
                      </div>
                      <FontAwesomeIcon
                        icon={faArrowRight}
                        className="h-3.5 w-3.5 text-white/45 transition group-hover:translate-x-1 group-hover:text-white"
                      />
                    </a>
                  ))}
                </div>
              </div>

            </section>
          </div>
        </div>
      </main>

    </div>
  );
}