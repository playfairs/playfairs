import { useState, useEffect, useRef } from 'react';
import { ExternalLink, Music, Film, Gamepad2, Search, ArrowUpDown } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const getCategoryIcon = (type: string, icon?: string) => {
  if (icon) {
    return <img src={icon} alt="" className="w-full h-full object-contain max-w-full max-h-full" />;
  }
  
  switch (type) {
    case 'music':
      return <Music className="w-5 h-5" />;
    case 'shows':
      return <Film className="w-5 h-5" />;
    case 'games':
      return <Gamepad2 className="w-5 h-5" />;
    default:
      return null;
  }
};

interface InterestItem {
  name: string;
  type: string;
  description: string;
  url: string;
  category: string;
  year: number;
  creator: string;
  platform: string;
  tags: string[];
  metacritic_score?: number;
  playtime?: string;
  icon?: string;
}

const InterestCard = ({ item, type }: { item: InterestItem; type: 'games' | 'music' | 'shows' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);
  const { theme } = useTheme();
  
  const getUnfilledColor = () => {
    if (theme.includes('rose-pine')) {
      if (theme.includes('moon')) return '#6e6a86';
      if (theme.includes('dawn')) return '#9893a5';
      return '#6e6a86';
    }
    return '#2a273f';
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div 
      className="border rounded-lg overflow-hidden transition-all duration-200 shadow-sm"
      style={{
        '--border-color': 'var(--color-border)',
        '--bg-color': 'var(--color-card-bg)',
        borderColor: 'var(--border-color)',
        backgroundColor: 'var(--bg-color)'
      } as React.CSSProperties}
    >
      <div 
        className="p-4 flex justify-between items-start cursor-pointer transition-colors"
        style={{ '--hover-bg': 'var(--color-card-hover)' } as React.CSSProperties}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--hover-bg)')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '')}
        onClick={toggleExpand}
      >
        <div className="flex items-start space-x-3 flex-1">
          <div 
            className="flex items-center justify-center w-10 h-10 rounded-md mt-0.5 shrink-0 overflow-hidden p-1.5"
            style={{
              '--bg-color': 'var(--color-primary-faded)',
              backgroundColor: 'var(--bg-color)'
            } as React.CSSProperties}
          >
            <div className="w-full h-full flex items-center justify-center">
              {getCategoryIcon(type, item.icon)}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <h3 className="font-medium text-lg truncate pr-2" style={{ color: 'var(--color-text)' }}>
                {item.name}
              </h3>
              <div className="flex items-center space-x-2 shrink-0">
                {item.url && (
                  <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="transition-colors"
                    style={{
                      '--color': 'var(--color-primary)',
                      '--hover-color': 'var(--color-primary-hover)',
                      color: 'var(--color)'
                    } as React.CSSProperties}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--hover-color)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color)')}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                {item.metacritic_score && (
                  <span 
                    className="text-xs font-medium px-2 py-0.5 rounded"
                    style={{
                      backgroundColor: 'var(--color-primary-faded)',
                      color: 'var(--color-primary)'
                    }}
                  >
                    {item.metacritic_score}
                  </span>
                )}
                <svg 
                  className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  style={{ color: 'var(--color-text-muted)' }} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            
            <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
              {item.creator} • {item.year} • {item.platform}
            </p>
            
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {item.tags.slice(0, 3).map((tag, i) => (
                  <span 
                    key={i} 
                    className="px-2 py-0.5 text-xs rounded"
                    style={{
                      '--bg-color': 'var(--color-primary-faded)',
                      '--text-color': 'var(--color-primary)',
                      backgroundColor: 'var(--bg-color)',
                      color: 'var(--text-color)'
                    } as React.CSSProperties}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div 
        className={`overflow-hidden transition-all duration-200 ${isExpanded ? 'max-h-96' : 'max-h-0'}`}
        style={{ borderTop: isExpanded ? '1px solid var(--color-border)' : 'none' }}
      >
        <div className="p-4 pt-2 space-y-4">
          {item.description && (
            <div>
              <h4 className="text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>Description</h4>
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{item.description}</p>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>Details</h4>
              <div className="space-y-1">
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  <span className="font-medium">Category:</span> {item.category}
                </p>
                {item.playtime && (
                  <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                    <span className="font-medium">Playtime:</span> {item.playtime}
                  </p>
                )}
              </div>
            </div>
            
            {item.metacritic_score && (
              <div>
                <h4 className="text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>Rating</h4>
                <div className="flex items-center">
                  <div 
                    className="h-2 rounded-full mr-2 flex-1 max-w-full" 
                    style={{
                      width: '100%',
                      backgroundColor: getUnfilledColor()
                    }}
                  >
                    <div 
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min(100, item.metacritic_score)}%`,
                        backgroundColor: 'var(--color-primary)'
                      }}
                    />
                  </div>
                  <span 
                    className="text-sm font-medium"
                    style={{
                      color: 'var(--color-text)'
                    }}
                  >
                    {item.metacritic_score}/100
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function InterestsPage() {
  const [activeTab, setActiveTab] = useState<'games' | 'music' | 'shows'>('games');
  const [items, setItems] = useState<InterestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'year' | 'rating'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const { theme } = useTheme();

  useEffect(() => {
    const loadData = () => {
      setLoading(true);
      try {
        let data;
        if (activeTab === 'games') {
          data = require('./games.json');
        } else if (activeTab === 'music') {
          data = require('./music.json');
        } else if (activeTab === 'shows') {
          data = require('./shows.json');
        }
        setItems(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(`Error loading ${activeTab} data:`, error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [activeTab]);

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.creator.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  ).sort((a, b) => {
    if (sortBy === 'name') {
      return sortOrder === 'asc' 
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else if (sortBy === 'year') {
      return sortOrder === 'asc' 
        ? a.year - b.year
        : b.year - a.year;
    } else if (sortBy === 'rating' && a.metacritic_score !== undefined && b.metacritic_score !== undefined) {
      return sortOrder === 'asc' 
        ? (a.metacritic_score || 0) - (b.metacritic_score || 0)
        : (b.metacritic_score || 0) - (a.metacritic_score || 0);
    }
    return 0;
  });

  const toggleSortOrder = (newSortBy: typeof sortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (column: typeof sortBy) => {
    if (sortBy !== column) return null;
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8" style={{ color: 'var(--color-text)' }}>My Interests</h1>
      
      <div className="flex items-end" style={{ borderBottom: '1px solid var(--color-primary)', paddingBottom: '1px' }}>
        <div className="flex flex-1">
          {(['games', 'music', 'shows'] as const).map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 text-sm font-medium transition-colors border hover:bg-opacity-90 ${activeTab === tab ? '' : 'opacity-70'}`}
              style={{
                backgroundColor: activeTab === tab ? 'var(--color-secondary)' : 'transparent',
                color: 'var(--color-text)',
                border: '1px solid var(--color-primary)',
                borderBottom: activeTab === tab ? 'none' : '1px solid var(--color-primary)',
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                marginBottom: '-1px',
                position: 'relative',
                top: '1px',
                zIndex: activeTab === tab ? 2 : 1,
                marginRight: '0.5rem'
              } as React.CSSProperties}
              onClick={() => setActiveTab(tab)}
              onMouseEnter={(e) => {
                if (activeTab !== tab) {
                  e.currentTarget.style.opacity = '1';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab) {
                  e.currentTarget.style.opacity = '0.7';
                }
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        
        <div className="relative flex items-end" style={{ marginBottom: '-1px' }}>
          <div className="relative flex items-center h-full">
            <div className="relative" style={{ 
              border: '1px solid var(--color-primary)',
              borderBottom: 'none',
              backgroundColor: 'var(--color-secondary)'
            }}>
              <div className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }}>
                <Search className="h-4 w-4" />
              </div>
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                className="px-4 py-2 pl-10 pr-4 text-sm bg-transparent border-0 focus:outline-none focus:ring-0 w-64"
                style={{
                  color: 'var(--color-text)',
                  backgroundColor: 'transparent',
                  height: '100%',
                }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mt-6 mb-4">
          <h2 className="text-2xl font-semibold" style={{ color: 'var(--color-text)' }}>
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Collection
          </h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Sort by:</span>
            <select
              className="text-sm bg-transparent border rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary-500"
              style={{
                color: 'var(--color-text)',
                borderColor: 'var(--color-border)',
                backgroundColor: 'var(--color-secondary)'
              }}
              value={sortBy}
              onChange={(e) => toggleSortOrder(e.target.value as 'name' | 'year' | 'rating')}
            >
              <option value="name">Name</option>
              <option value="year">Year</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2" style={{ borderColor: 'var(--color-primary)' }}></div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: 'var(--color-primary-faded)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--color-primary)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-1" style={{ color: 'var(--color-text)' }}>
              {searchTerm ? 'No matches found' : `No ${activeTab} added yet`}
            </h3>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              {searchTerm 
                ? `We couldn't find any ${activeTab} matching "${searchTerm}"`
                : `You haven't added any ${activeTab} to your collection yet.`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item, index) => (
              <InterestCard key={`${item.name}-${index}`} item={item} type={activeTab} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}