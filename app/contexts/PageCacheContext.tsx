'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
  followers: number;
  following: number;
  public_repos: number;
  created_at: string;
  location: string;
  bio: string | null;
}

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

interface PageCacheContextType {
  homeMounted: boolean;
  socialsMounted: boolean;
  githubData: GitHubUser | null;
  socialData: SocialData | null;
  setHomeMounted: (mounted: boolean) => void;
  setSocialsMounted: (mounted: boolean) => void;
  setGithubData: (data: GitHubUser | null) => void;
  setSocialData: (data: SocialData | null) => void;
}

const PageCacheContext = createContext<PageCacheContextType | undefined>(undefined);

export function PageCacheProvider({ children }: { children: ReactNode }) {
  const [homeMounted, setHomeMounted] = useState(false);
  const [socialsMounted, setSocialsMounted] = useState(false);
  const [githubData, setGithubData] = useState<GitHubUser | null>(null);
  const [socialData, setSocialData] = useState<SocialData | null>(null);

  return (
    <PageCacheContext.Provider value={{
      homeMounted,
      socialsMounted,
      githubData,
      socialData,
      setHomeMounted,
      setSocialsMounted,
      setGithubData,
      setSocialData
    }}>
      {children}
    </PageCacheContext.Provider>
  );
}

export function usePageCache() {
  const context = useContext(PageCacheContext);
  if (context === undefined) {
    throw new Error('usePageCache must be used within a PageCacheProvider');
  }
  return context;
}
