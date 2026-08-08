"use client";

import Image from "next/image";
import Header from "@/components/Header";
import { useState, useEffect } from "react";
import { usePageCache } from "./contexts/PageCacheContext";

export default function Home() {
  const { homeMounted, setHomeMounted, githubData, setGithubData } =
    usePageCache();
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
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.03),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.02),transparent_20%)]" />

      <Header />

      <main className="relative flex min-h-screen items-center justify-center px-4 py-24 sm:px-6 lg:px-8">
        <div className="w-full max-w-3xl">
          <section className="glass-panel px-6 py-8 sm:px-8 sm:py-9">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              <Image
                src={githubData.avatar_url}
                alt={githubData.login}
                width={112}
                height={112}
                className="h-20 w-20 border border-white/10 object-cover sm:h-24 sm:w-24"
              />

              <div className="min-w-0">
                <h1 className="text-2xl font-semibold tracking-[0.2em] text-white sm:text-3xl">
                  {githubData.name || githubData.login}
                </h1>
                <p className="mt-1 text-sm font-medium uppercase tracking-[0.28em] text-white/55">
                  @{githubData.login}
                </p>
                <p className="mt-3 max-w-xl text-sm leading-7 text-white/70">
                  {githubData.bio ||
                    "Building things, collecting weird corners of the internet, and keeping the signal honest."}
                </p>

                <div className="mt-4 flex flex-wrap gap-3 text-[10px] uppercase tracking-[0.28em] text-white/55">
                  {githubData.location && <span>{githubData.location}</span>}
                  <span>{githubData.followers} followers</span>
                  <span>{githubData.public_repos} repos</span>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-white/10 pt-5">
              <div className="flex flex-wrap gap-2">
                {[
                  { name: "GitHub", url: "https://github.com/playfairs" },
                  { name: "GitLab", url: "https://gitlab.com/playfairs" },
                  { name: "TikTok", url: "https://tiktok.com/@playfairs" },
                ].map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-white/10 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-white/70 transition hover:bg-white/8 hover:text-white"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
