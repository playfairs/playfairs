import { useState, useEffect } from "react";
import { ExternalLink, Star, GitBranch, Package, Users, Filter, ChevronDown } from "lucide-react";
import "../../index.css";

interface Repository {
  id: string;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  platform: 'github' | 'gitlab';
  owner: string;
}

interface ProjectAccount {
  name: string;
  platform: 'github' | 'gitlab';
  url: string;
}

export default function GitPage() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [filteredRepositories, setFilteredRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedAccount, setSelectedAccount] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('updated');
  const [languageFilter, setLanguageFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  const githubAccounts = ['playfairs', 'bevlynous', 'smezir', 'tekhnika'];

  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        setLoading(true);
        const repos: Repository[] = [];
        
        for (const username of githubAccounts) {
          try {            
            const searchResponse = await fetch(`https://api.github.com/search/repositories?q=user:${username}&sort=updated&per_page=100`, {
              headers: {
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'Mozilla/5.0 (compatible; GitPage/1.0)',
              }
            });
            
            if (searchResponse.ok) {
              const searchData = await searchResponse.json();
              const searchRepos = searchData.items || [];
              
              for (const repo of searchRepos) {
                repos.push({
                  id: `github-${repo.id}`,
                  name: repo.name,
                  description: repo.description || 'No description available',
                  html_url: repo.html_url,
                  stargazers_count: repo.stargazers_count,
                  forks_count: repo.forks_count,
                  language: repo.language,
                  updated_at: repo.updated_at,
                  platform: 'github' as const,
                  owner: username
                });
              }
            } else {
              console.error(`Failed to search GitHub repos for ${username}: ${searchResponse.status}`);
            }
          } catch (err) {
            console.error(`Error fetching GitHub repos for ${username}:`, err);
          }
        }
        
        const uniqueRepos = repos.filter((repo, index, self) => 
          index === self.findIndex((r) => r.html_url === repo.html_url)
        );
        
        uniqueRepos.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
        
        setRepositories(uniqueRepos);
        setFilteredRepositories(uniqueRepos);
      } catch (err) {
        setError('Failed to fetch repositories');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRepositories();
  }, []);

  useEffect(() => {
    let filtered = [...repositories];
    
    if (selectedAccount !== 'all') {
      filtered = filtered.filter(repo => repo.owner === selectedAccount);
    }
    
    if (languageFilter !== 'all') {
      filtered = filtered.filter(repo => repo.language === languageFilter);
    }
    
    switch (sortBy) {
      case 'updated':
        filtered.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
        break;
      case 'stars':
        filtered.sort((a, b) => b.stargazers_count - a.stargazers_count);
        break;
      case 'forks':
        filtered.sort((a, b) => b.forks_count - a.forks_count);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
    
    setFilteredRepositories(filtered);
  }, [repositories, selectedAccount, sortBy, languageFilter]);

  const languages = [...new Set(repositories.map(repo => repo.language).filter(Boolean))] as string[];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Updated yesterday';
    if (diffDays < 7) return `Updated ${diffDays} days ago`;
    if (diffDays < 30) return `Updated ${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `Updated ${Math.floor(diffDays / 30)} months ago`;
    return `Updated ${Math.floor(diffDays / 365)} years ago`;
  };

  const getLanguageColor = (language: string | null) => {
    const colors: Record<string, string> = {
      TypeScript: '#3178c6',
      JavaScript: '#f1e05a',
      Python: '#3572A5',
      Rust: '#dea584',
      Go: '#00ADD8',
      HTML: '#e34c26',
      CSS: '#563d7c',
      Shell: '#89e051',
      Dockerfile: '#384d54',
      Nix: '#7e7eff',
      Lua: '#000080',
      Zig: '#ec915c',
      Ruby: '#701516',
      PHP: '#4F5D95',
      Java: '#b07219',
      C: '#555555',
      'C++': '#f34b7d',
      CSharp: '#178600',
      Swift: '#F05138',
      Kotlin: '#A97BFF',
      SQL: '#e38c00',
      Markdown: '#083fa1',
      JSON: '#292929',
      TOML: '#9c4221',
      YAML: '#cb171e',
      Bash: '#4EAA25',
      Makefile: '#427819',
      Vue: '#41b883',
      Svelte: '#ff3e00',
      React: '#61dafb',
      Tailwind: '#38bdf8',
      Astro: '#ff5d01',
      VimScript: '#199f4b',
      Haskell: '#5e5086',
      Erlang: '#B83998',
      Elixir: '#6e4a7e',
      Perl: '#0298c3',
      R: '#198ce7',
      null: '#666666'
    };
    return colors[language || 'null'] || '#666666';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        backgroundColor: 'var(--color-bg)',
        color: 'var(--color-text)'
      } as React.CSSProperties}>
        <div className="text-center">
          <div 
            className="animate-spin rounded-full h-12 w-12 border-b-2 mb-4 mx-auto"
            style={{ borderColor: 'var(--color-primary)' }}
          ></div>
          <p style={{ color: 'var(--color-text)' } as React.CSSProperties}>Loading repositories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{
          backgroundColor: 'var(--color-bg)',
          color: 'var(--color-text)'
        } as React.CSSProperties}
      >
        <div className="text-center">
          <p className="mb-4" style={{ color: 'var(--color-error)' } as React.CSSProperties}>
            Error: {error}
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 rounded transition-colors"
            style={{
              backgroundColor: 'var(--color-secondary)',
              color: 'var(--color-text)',
              '--hover-bg': 'var(--color-bg-hover)'
            } as React.CSSProperties}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg-hover)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--color-secondary)'}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen p-4"
      style={{
        backgroundColor: 'var(--color-bg)',
        color: 'var(--color-text)'
      } as React.CSSProperties}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Git</h1>
            <p className="text-gray-400">
              {filteredRepositories.length} {filteredRepositories.length === 1 ? 'repository' : 'repositories'} 
              {selectedAccount !== 'all' && ` from ${selectedAccount}`}
              {languageFilter !== 'all' && ` in ${languageFilter}`}
            </p>
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Filter size={16} />
            Filters
            <ChevronDown size={16} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {showFilters && (
          <div className="mb-6 bg-linear-gradient-to-r from-gray-800/50 to-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 shadow-xl">
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-300 uppercase tracking-wider">Account</label>
                  <select
                    value={selectedAccount}
                    onChange={(e) => setSelectedAccount(e.target.value)}
                    className="w-full pl-2 pr-4 py-3 rounded-lg focus:outline-none transition-all"
                    style={{
                      backgroundColor: 'var(--color-bg-hover)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text)',
                      '--ring-color': 'var(--color-primary)',
                      '--border-focus': 'var(--color-primary)'
                    } as React.CSSProperties}
                  >
                    <option value="all">All Accounts</option>
                    {githubAccounts.map(account => (
                      <option key={account} value={account}>{account}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-300 uppercase tracking-wider">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full pl-2 pr-4 py-3 rounded-lg focus:outline-none transition-all"
                    style={{
                      backgroundColor: 'var(--color-bg-hover)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text)',
                      '--ring-color': 'var(--color-primary)',
                      '--border-focus': 'var(--color-primary)'
                    } as React.CSSProperties}
                  >
                    <option value="updated">Last Updated</option>
                    <option value="stars">Stars</option>
                    <option value="forks">Forks</option>
                    <option value="name">Name</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-300 uppercase tracking-wider">Language</label>
                  <select
                    value={languageFilter}
                    onChange={(e) => setLanguageFilter(e.target.value)}
                    className="w-full pl-2 pr-4 py-3 rounded-lg focus:outline-none transition-all"
                    style={{
                      backgroundColor: 'var(--color-bg-hover)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text)',
                      '--ring-color': 'var(--color-primary)',
                      '--border-focus': 'var(--color-primary)'
                    } as React.CSSProperties}
                  >
                    <option value="all">All Languages</option>
                    {languages.map(language => (
                      <option key={language} value={language}>{language}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <span className="text-sm font-medium text-gray-400 mr-2">Quick filters:</span>
                <button
                  onClick={() => {
                    setSelectedAccount('all');
                    setLanguageFilter('all');
                    setSortBy('updated');
                  }}
                  className="px-4 py-2 text-sm font-medium bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 rounded-full transition-all duration-200 hover:scale-105 border border-gray-600/50"
                >
                  Reset All
                </button>
                {githubAccounts.map(account => (
                  <button
                    key={account}
                    onClick={() => setSelectedAccount(selectedAccount === account ? 'all' : account)}
                    className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 hover:scale-105 border ${
                      selectedAccount === account 
                        ? 'bg-blue-600/80 text-white border-blue-500/50 shadow-lg shadow-blue-500/20' 
                        : 'bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 border-gray-600/50'
                    }`}
                  >
                    {account}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-600 mx-auto mb-4 animate-pulse" />
            <p className="text-gray-400">Loading repositories...</p>
          </div>
        ) : filteredRepositories.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p style={{ color: 'var(--color-text-muted)' } as React.CSSProperties}>
              No repositories found
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredRepositories.map((repo) => (
              <div 
                key={repo.id} 
                className="rounded-lg p-6 transition-colors group"
                style={{
                  backgroundColor: 'var(--color-secondary)',
                  border: '1px solid var(--color-border)',
                  '--hover-bg': 'var(--color-bg-hover)'
                } as React.CSSProperties}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg-hover)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--color-secondary)'}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 
                        className="text-lg font-semibold transition-colors"
                        style={{
                          color: 'var(--color-text)',
                          '--hover-color': 'var(--color-primary)'
                        } as React.CSSProperties}
                      >
                        {repo.name}
                      </h3>
                      <span 
                        className="px-2 py-1 text-xs rounded-full"
                        style={{
                          backgroundColor: 'var(--color-secondary)',
                          color: 'var(--color-primary)',
                          border: '1px solid var(--color-border)'
                        } as React.CSSProperties}
                      >
                        {repo.platform === 'github' ? 'GitHub' : 'GitLab'}
                      </span>
                      {repo.language && (
                        <div className="flex items-center space-x-1">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: getLanguageColor(repo.language) }}
                          />
                          <span className="text-sm text-gray-400">{repo.language}</span>
                        </div>
                      )}
                    </div>
                    <p 
                      className="mb-4 line-clamp-2"
                      style={{ color: 'var(--color-text-muted)' } as React.CSSProperties}
                    >{repo.description}</p>
                    <div 
                      className="flex items-center space-x-4 text-sm"
                      style={{ color: 'var(--color-text-muted)' } as React.CSSProperties}
                    >
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4" />
                        <span>{repo.stargazers_count}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <GitBranch className="w-4 h-4" />
                        <span>{repo.forks_count}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{repo.owner}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span>•</span>
                        <span>{formatDate(repo.updated_at)}</span>
                      </div>
                    </div>
                  </div>
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-4 p-2 rounded-lg transition-colors"
                    style={{
                      color: 'var(--color-text-muted)',
                      '--hover-color': 'var(--color-text)',
                      '--hover-bg': 'var(--color-bg-hover)'
                    } as React.CSSProperties}
                    onMouseOver={(e) => {
                      e.currentTarget.style.color = 'var(--color-text)';
                      e.currentTarget.style.backgroundColor = 'var(--color-bg-hover)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.color = 'var(--color-text-muted)';
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
