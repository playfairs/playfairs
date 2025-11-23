import { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';
import '../../index.css';

interface Link {
  name: string;
  url: string;
  type: string;
  description: string;
}

export default function LinksPage() {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import('./links.json')
      .then((data) => {
        const sortedLinks = data.default.sort((a: Link, b: Link) => 
          a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        );
        setLinks(sortedLinks);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading links:", error);
        setLoading(false);
      });
  }, []);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'personal':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'application':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'music':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'misc':
        return 'bg-pink-500/20 text-pink-400 border-pink-500/30';
      case 'homepage':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'game':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  if (loading) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>Links</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>My personal projects and applications</p>
        </div>
        <div className="flex justify-center items-center h-32">
          <p style={{ color: 'var(--color-text-muted)' }}>Loading links...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
        <h1 className="text-3xl font-bold" style={{ color: 'var(--color-text)' }}>Links</h1>
      </div>
      
      <div className="space-y-4">
        {links.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block p-4 border rounded-lg transition-all duration-200"
            style={{
              backgroundColor: 'var(--color-card-bg)',
              borderColor: 'var(--color-border)',
              '--hover-border': 'var(--color-primary)',
              '--hover-shadow': '0 0 15px rgba(var(--color-primary-rgb), 0.1)'
            } as React.CSSProperties}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = 'var(--hover-border)';
              e.currentTarget.style.boxShadow = 'var(--hover-shadow)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div className="flex flex-col">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-base font-semibold transition-colors truncate"
                        style={{
                          color: 'var(--color-text)',
                          '--hover-color': 'var(--color-primary)'
                        } as React.CSSProperties}
                        onMouseOver={(e) => e.currentTarget.style.color = 'var(--hover-color)'}
                        onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-text)'}>
                      {link.name}
                    </h3>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full border shrink-0 ${getTypeColor(link.type)}`}>
                      {link.type}
                    </span>
                  </div>
                </div>
                <ExternalLink 
                  className="w-4 h-4 transition-colors shrink-0 ml-3"
                  style={{
                    color: 'var(--color-text-muted)',
                    '--hover-color': 'var(--color-primary)'
                  } as React.CSSProperties}
                  onMouseOver={(e) => e.currentTarget.style.color = 'var(--hover-color)'}
                  onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}
                />
              </div>
              <p className="text-xs truncate mb-2" style={{ color: 'var(--color-text-muted)' }}>{link.url}</p>
              <p className="text-sm leading-tight" style={{ color: 'var(--color-text-secondary)' }}>{link.description}</p>
            </div>
          </a>
        ))}
      </div>

      {links.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No links available.</p>
        </div>
      )}
    </main>
  );
}