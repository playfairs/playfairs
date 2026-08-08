"use client";

import { useState, useEffect } from "react";

import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as solidIcons from "@fortawesome/free-solid-svg-icons";
import * as brandIcons from "@fortawesome/free-brands-svg-icons";
import { SiMatrix, SiCodeberg } from "react-icons/si";
import Header from "@/components/Header";

const getIcon = (iconName: string) => {
  const iconMap: { [key: string]: typeof solidIcons.faArrowRight } = {
    faTwitter: brandIcons.faTwitter,
    faInstagram: brandIcons.faInstagram,
    faThreads: brandIcons.faThreads,
    faBluesky: brandIcons.faBluesky,
    faDiscord: brandIcons.faDiscord,
    faGithub: brandIcons.faGithub,
    faLinkedin: brandIcons.faLinkedin,
    faCodepen: brandIcons.faCodepen,
    faStackOverflow: brandIcons.faStackOverflow,
    faDev: brandIcons.faDev,
    faTiktok: brandIcons.faTiktok,
    siTiktok: brandIcons.faTiktok,
    faTelegram: brandIcons.faTelegram,
    faEnvelope: solidIcons.faEnvelope,
    faGlobe: solidIcons.faGlobe,
    faPhone: solidIcons.faPhone,
    faArrowRight: solidIcons.faArrowRight,
    faGitlab: brandIcons.faGitlab,
  };
  return iconMap[iconName] || solidIcons.faArrowRight;
};



interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

interface SocialData {
  socials: SocialLink[];
  communication: SocialLink[];
  development: SocialLink[];
}

interface GitHubRepo {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  html_url: string;
  updated_at: string;
  license: {
    spdx_id: string;
  } | null;
}

interface Repository {
  name: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  license: string;
  url: string;
  updatedAt: string;
}

interface ProjectLink {
  name: string;
  description: string;
  url: string;
  type: string;
}

interface ProjectData {
  repositories: Repository[];
  projectLinks: ProjectLink[];
}

interface TechItem {
  name: string;
  icon: string;
  description: string;
  color: string;
  url?: string;
}

interface TechStackData {
  languages: TechItem[];
  software: TechItem[];
  hardware: TechItem[];
}

export default function Explore() {
  const [activeSection, setActiveSection] = useState("socials");
  const [activeSubSection, setActiveSubSection] = useState("socials");
  const [socialData, setSocialData] = useState<SocialData | null>(null);
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [techData, setTechData] = useState<TechStackData | null>(null);
  const [, setLanguageCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [socialsRes, projectsRes, techstackRes, reposRes] =
          await Promise.all([
            fetch("/data/socials.json"),
            fetch("/data/projects.json"),
            fetch("/data/techstack.json"),
            fetch(
              "https://api.github.com/users/playfairs/repos?sort=pushed&direction=desc&per_page=6",
            ),
          ]);

        const [socialsData, projectsData, techstackData, reposData] =
          await Promise.all([
            socialsRes.json(),
            projectsRes.json(),
            techstackRes.json(),
            reposRes.json(),
          ]);

        if (!Array.isArray(reposData)) {
          setSocialData(socialsData);
          setProjectData({
            repositories: [],
            projectLinks: projectsData.projectLinks,
          });
          setTechData(techstackData);
          setLanguageCounts({});
          setLoading(false);
          return;
        }

        const detailedRepos = await Promise.all(
          reposData.map(async (repo: GitHubRepo) => {
            try {
              const detailResponse = await fetch(
                `https://api.github.com/repos/playfairs/${repo.name}`,
              );
              const detailData = await detailResponse.json();

              return {
                name: detailData.name,
                description:
                  detailData.description || "No description available",
                language: detailData.language || "Unknown",
                stars: detailData.stargazers_count,
                forks: detailData.forks_count,
                license: detailData.license?.spdx_id || "Not Licensed",
                url: detailData.html_url,
                updatedAt: detailData.updated_at,
              };
            } catch {
              return {
                name: repo.name,
                description: repo.description || "No description available",
                language: repo.language || "Unknown",
                stars: repo.stargazers_count,
                forks: repo.forks_count,
                license: "Unknown",
                url: repo.html_url,
                updatedAt: repo.updated_at,
              };
            }
          }),
        );

        setSocialData(socialsData);
        setProjectData({
          repositories: detailedRepos,
          projectLinks: projectsData.projectLinks,
        });
        setTechData(techstackData);

        const languages = techstackData.languages.map(
          (item: TechItem) => item.name,
        );
        const counts: Record<string, number> = {};

        await Promise.all(
          languages.map(async (language: string) => {
            try {
              const response = await fetch(
                `https://api.github.com/search/repositories?q=user:playfairs+language:${encodeURIComponent(language)}`,
              );
              const data = await response.json();
              counts[language] = data.total_count || 0;
            } catch {
              counts[language] = 0;
            }
          }),
        );

        setLanguageCounts(counts);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const sections = [
    {
      id: "socials",
      label: "SOCIALS",
      subSections: [
        { id: "socials", label: "Media" },
        { id: "communication", label: "Communication" },
        { id: "development", label: "Development" },
      ],
    },
    {
      id: "projects",
      label: "PROJECTS",
      subSections: [
        { id: "repos", label: "Repositories" },
        { id: "links", label: "Project Links" },
      ],
    },
    {
      id: "techstack",
      label: "TECH STACK",
      subSections: [
        { id: "languages", label: "Languages" },
        { id: "software", label: "Software" },
        { id: "hardware", label: "Hardware" },
      ],
    },
  ];

  const handleTechItemClick = (item: TechItem) => {
    if (activeSubSection === "languages") {
      const languageQuery = encodeURIComponent(item.name.toLowerCase());
      const url = `https://github.com/playfairs?tab=repositories&q=&type=&language=${languageQuery}&sort=`;
      window.open(url, "_blank", "noopener,noreferrer");
      return;
    }

    if (item.url) {
      window.open(item.url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.03),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.02),transparent_20%)]" />

      <Header />

      <main className="relative px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <section className="glass-panel p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.35em] text-white/45">
                  archive
                </p>
                <h1 className="mt-1 text-xl font-semibold tracking-[0.2em] text-white">
                  Explore
                </h1>
              </div>

              <div className="flex flex-wrap gap-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => {
                      setActiveSection(section.id);
                      setActiveSubSection(section.subSections[0].id);
                    }}
                    className={`border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.28em] transition ${
                      activeSection === section.id
                        ? "border-white/20 bg-white/10 text-white"
                        : "border-white/10 text-white/60 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    {section.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 border-t border-white/10 pt-4">
              {sections
                .find((section) => section.id === activeSection)
                ?.subSections.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => {
                      setActiveSection(activeSection);
                      setActiveSubSection(sub.id);
                    }}
                    className={`px-2.5 py-1 text-[10px] uppercase tracking-[0.28em] transition ${
                      activeSubSection === sub.id
                        ? "text-white"
                        : "text-white/50 hover:text-white"
                    }`}
                  >
                    {sub.label}
                  </button>
                ))}
            </div>
          </section>

          <section className="glass-panel mt-4 p-4 sm:p-5">
            {loading ? (
              <div className="flex h-40 items-center justify-center text-sm uppercase tracking-[0.35em] text-white/60">
                loading data…
              </div>
            ) : (
              <>
                {activeSection === "socials" && (
                  <div className="space-y-2">
                    {socialData &&
                      socialData[activeSubSection as keyof SocialData]?.map(
                        (link: SocialLink, index: number) => (
                          <a
                            key={index}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between border-b border-white/10 py-3 text-sm text-white/70 last:border-b-0"
                          >
                            <div className="flex items-center gap-3">
                              {link.icon === "SiMatrix" ? (
                                <SiMatrix className="h-4 w-4 text-white/60" />
                              ) : link.icon === "siCodeberg" ? (
                                <SiCodeberg className="h-4 w-4 text-white/60" />
                              ) : (
                                <FontAwesomeIcon
                                  icon={getIcon(link.icon)}
                                  className="h-4 w-4 text-white/60"
                                />
                              )}
                              <span className="uppercase tracking-[0.28em]">
                                {link.name}
                              </span>
                            </div>
                            <FontAwesomeIcon
                              icon={getIcon("faArrowRight")}
                              className="h-3.5 w-3.5 text-white/35"
                            />
                          </a>
                        ),
                      )}
                  </div>
                )}

                {activeSection === "projects" && activeSubSection === "repos" && (
                  <div className="space-y-3">
                    {projectData?.repositories?.map((repo: Repository, index: number) => (
                      <a
                        key={index}
                        href={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block border-b border-white/10 py-3 last:border-b-0"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold uppercase tracking-[0.28em] text-white">
                              {repo.name}
                            </p>
                            <p className="mt-1 text-sm leading-6 text-white/60">
                              {repo.description}
                            </p>
                          </div>
                          <span className="text-[10px] uppercase tracking-[0.28em] text-white/45">
                            {repo.language}
                          </span>
                        </div>
                      </a>
                    ))}
                  </div>
                )}

                {activeSection === "projects" && activeSubSection === "links" && (
                  <div className="space-y-2">
                    {projectData?.projectLinks?.map((link: ProjectLink, index: number) => {
                      const getFaviconUrl = (url: string) => {
                        try {
                          const domain = new URL(url).hostname;
                          return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
                        } catch {
                          return null;
                        }
                      };

                      const faviconUrl = getFaviconUrl(link.url);

                      return (
                        <a
                          key={index}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 border-b border-white/10 py-3 text-sm text-white/70 last:border-b-0"
                        >
                          {faviconUrl ? (
                            <Image
                              src={faviconUrl}
                              alt=""
                              width={18}
                              height={18}
                              className="flex-shrink-0"
                            />
                          ) : (
                            <div className="h-4 w-4 rounded-full bg-white/10" />
                          )}
                          <span className="uppercase tracking-[0.28em]">{link.name}</span>
                        </a>
                      );
                    })}
                  </div>
                )}

                {activeSection === "techstack" && (
                  <div className="space-y-2">
                    {techData &&
                      techData[activeSubSection as keyof TechStackData]?.map(
                        (item: TechItem, index: number) => (
                          <div
                            key={index}
                            className={`flex items-center justify-between border-b border-white/10 py-3 text-sm ${item.url || activeSubSection === "languages" ? "cursor-pointer" : ""}`}
                            onClick={() => handleTechItemClick(item)}
                          >
                            <div className="flex items-center gap-3">
                              <span
                                className="h-2.5 w-2.5 rounded-full"
                                style={{ backgroundColor: item.color }}
                              />
                              <span className="uppercase tracking-[0.28em] text-white/80">
                                {item.name}
                              </span>
                            </div>
                            <span className="text-[10px] uppercase tracking-[0.28em] text-white/45">
                              {activeSubSection === "languages" ? "view all" : "tool"}
                            </span>
                          </div>
                        ),
                      )}
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
