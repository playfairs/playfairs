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
      <main className="max-w-4xl mx-auto px-6 py-12 bg-gray-900">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Links</h1>
          <p className="text-gray-400">My personal projects and applications</p>
        </div>
        <div className="text-center py-12">
          <p className="text-gray-400">Loading links...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-12 bg-gray-900">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Links</h1>
      </div>
      
      <div className="space-y-4">
        {links.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block p-4 bg-gray-800 border border-gray-700 rounded-lg hover:border-teal-500/50 hover:shadow-[0_0_15px_rgba(20,184,166,0.15)] transition-all duration-300"
          >
            <div className="flex flex-col">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-base font-semibold text-white group-hover:text-teal-400 transition-colors truncate">
                      {link.name}
                    </h3>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full border shrink-0 ${getTypeColor(link.type)}`}>
                      {link.type}
                    </span>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-teal-400 transition-colors shrink-0 ml-3" />
              </div>
              <p className="text-gray-500 text-xs truncate mb-2">{link.url}</p>
              <p className="text-gray-400 text-sm leading-tight">{link.description}</p>
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