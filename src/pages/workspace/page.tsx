import { useState, useEffect } from "react";
import { ExternalLink, Cpu as CpuIcon, HardDrive, Monitor, Laptop, Smartphone, Server, Database, Search } from "lucide-react";
import "../../index.css";

interface HardwareItem {
  name: string;
  category: string;
  operating_system: string;
  url: string;
  cpu: {
    model: string;
    architecture?: string;
    performance_cores?: number;
    efficiency_cores?: number;
    total_cores?: number;
    neural_engine?: string;
    generation?: string;
    cores?: number;
    threads?: number;
    base_clock?: string;
    boost_clock?: string;
  };
  gpu: {
    model: string;
    cores?: number;
    type: string;
    vram?: string;
  };
  ram: {
    capacity: string;
    type: string;
  };
  storage: Array<{
    capacity: string;
    type: string;
  }> | {
    capacity: string;
    type: string;
  };
}

interface SoftwareItem {
  name: string;
  category: string;
  description: string;
  url: string;
  developer: string;
  license: string;
  platforms: string[];
  features: string[];
}

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'desktop':
      return <Monitor className="w-5 h-5" />;
    case 'laptop':
      return <Laptop className="w-5 h-5" />;
    case 'mobile':
      return <Smartphone className="w-5 h-5" />;
    case 'server':
      return <Server className="w-5 h-5" />;
    default:
      return <Database className="w-5 h-5" />;
  }
};

export default function WorkspacePage() {
  const [hardware, setHardware] = useState<HardwareItem[]>([]);
  const [software, setSoftware] = useState<SoftwareItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'hardware' | 'software'>('hardware');
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [allExpanded, setAllExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = () => {
      try {
        const hardwareData = require('./hardware.json');
        const softwareData = require('./software.json');
        
        if (!Array.isArray(hardwareData) || !Array.isArray(softwareData)) {
          throw new Error('Invalid data format in JSON files');
        }
        
        setHardware(hardwareData);
        setSoftware(softwareData);
      } catch (err) {
        console.error('Error loading workspace data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
    setAllExpanded(false);
  };

  const toggleAllItems = () => {
    if (allExpanded) {
      setExpandedItems({});
    } else {
      const currentItems = activeTab === 'hardware' ? hardware : software;
      const newExpandedState: Record<string, boolean> = {};
      
      currentItems.forEach((_, index) => {
        const id = `${activeTab === 'hardware' ? 'hw' : 'sw'}-${index}`;
        newExpandedState[id] = true;
      });
      
      setExpandedItems(newExpandedState);
    }
    setAllExpanded(!allExpanded);
  };

  const renderHardwareItem = (item: HardwareItem, index: number) => {
    const isExpanded = expandedItems[`hw-${index}`];
    const storageArray = Array.isArray(item.storage) ? item.storage : [item.storage];
    
    return (
      <div 
        key={`hw-${index}`} 
        className="border rounded overflow-hidden transition-all duration-200 shadow-sm"
        style={{
          '--border-color': 'var(--color-border)',
          '--bg-color': 'var(--color-card-bg)',
          borderColor: 'var(--border-color)',
          backgroundColor: 'var(--bg-color)'
        } as React.CSSProperties}
      >
        <div 
          className="p-4 flex justify-between items-center cursor-pointer transition-colors"
          style={{ '--hover-bg': 'var(--color-card-hover)' } as React.CSSProperties}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--hover-bg)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '')}
          onClick={() => toggleExpand(`hw-${index}`)}
        >
          <div className="flex items-center space-x-3">
            <div 
              className="p-2 rounded-md"
              style={{
                '--bg-color': 'var(--color-primary-faded)',
                '--text-color': 'var(--color-primary)',
                backgroundColor: 'var(--bg-color)',
                color: 'var(--text-color)'
              } as React.CSSProperties}
            >
              {getCategoryIcon(item.category)}
            </div>
            <div>
              <h3 className="font-medium text-lg" style={{ color: 'var(--color-text)' }}>{item.name}</h3>
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{item.category} • {item.operating_system}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {item.url !== 'Not Available' && (
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
            <svg 
              className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              style={{ color: 'var(--color-text-muted)' } as React.CSSProperties} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        
        {isExpanded && (
          <div 
            className="p-4 border-t"
            style={{ borderColor: 'var(--color-border)' } as React.CSSProperties}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2 flex items-center" style={{ color: 'var(--color-text)' }}>
                  <CpuIcon className="w-4 h-4 mr-2" style={{ color: 'var(--color-primary)' }} />
                  Processor
                </h4>
                <div className="pl-6 space-y-1">
                  <p style={{ color: 'var(--color-text)' }}>{item.cpu.model}</p>
                  {item.cpu.architecture && <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Architecture: {item.cpu.architecture}</p>}
                  {item.cpu.total_cores && (
                    <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                      Cores: {item.cpu.performance_cores && `${item.cpu.performance_cores}P + `}
                            {item.cpu.efficiency_cores && `${item.cpu.efficiency_cores}E`}
                            {!item.cpu.performance_cores && !item.cpu.efficiency_cores && item.cpu.cores}
                            {item.cpu.total_cores && ` (${item.cpu.total_cores} total)`}
                    </p>
                  )}
                  {item.cpu.neural_engine && <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Neural Engine: {item.cpu.neural_engine}</p>}
                  {item.cpu.base_clock && <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Base Clock: {item.cpu.base_clock}</p>}
                  {item.cpu.boost_clock && <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Boost Clock: {item.cpu.boost_clock}</p>}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2 flex items-center" style={{ color: 'var(--color-text)' }}>
                  <svg className="w-4 h-4 mr-2" style={{ color: 'var(--color-primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Graphics
                </h4>
                <div className="pl-6 space-y-1">
                  <p style={{ color: 'var(--color-text)' }}>{item.gpu.model}</p>
                  <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Type: {item.gpu.type}</p>
                  {item.gpu.cores && <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Cores: {item.gpu.cores}</p>}
                  {item.gpu.vram && <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>VRAM: {item.gpu.vram}</p>}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2 flex items-center" style={{ color: 'var(--color-text)' }}>
                  <svg className="w-4 h-4 mr-2" style={{ color: 'var(--color-primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Memory
                </h4>
                <div className="pl-6">
                  <p style={{ color: 'var(--color-text)' }}>{item.ram.capacity} {item.ram.type}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2 flex items-center" style={{ color: 'var(--color-text)' }}>
                  <HardDrive className="w-4 h-4 mr-2" style={{ color: 'var(--color-primary)' }} />
                  Storage
                </h4>
                <div className="pl-6 space-y-1">
                  {storageArray.map((storage, i) => (
                    <div key={i} className="flex justify-between">
                      <span style={{ color: 'var(--color-text)' }}>{storage.capacity}</span>
                      <span style={{ color: 'var(--color-text-muted)' }}>{storage.type}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderSoftwareItem = (item: SoftwareItem, index: number) => {
    const isExpanded = expandedItems[`sw-${index}`];
    
    return (
      <div 
        key={`sw-${index}`} 
        className="border rounded overflow-hidden transition-all duration-200 shadow-sm"
        style={{
          '--border-color': 'var(--color-border)',
          '--bg-color': 'var(--color-card-bg)',
          borderColor: 'var(--border-color)',
          backgroundColor: 'var(--bg-color)'
        } as React.CSSProperties}
      >
        <div 
          className="p-4 flex justify-between items-center cursor-pointer transition-colors"
          style={{ '--hover-bg': 'var(--color-card-hover)' } as React.CSSProperties}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--hover-bg)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '')}
          onClick={() => toggleExpand(`sw-${index}`)}
        >
          <div className="flex items-center space-x-3">
            <div 
              className="p-2 rounded-md"
              style={{
                '--bg-color': 'var(--color-primary-faded)',
                '--text-color': 'var(--color-primary)',
                backgroundColor: 'var(--bg-color)',
                color: 'var(--text-color)'
              } as React.CSSProperties}
            >
              {getCategoryIcon(item.category)}
            </div>
            <div>
              <h3 className="font-medium text-lg" style={{ color: 'var(--color-text)' }}>{item.name}</h3>
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{item.category}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
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
              aria-label={`Visit ${item.name} website`}
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <svg 
              className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              style={{ color: 'var(--color-text-muted)' } as React.CSSProperties} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        
        {isExpanded && (
          <div 
            className="p-4 border-t"
            style={{ borderColor: 'var(--color-border)' } as React.CSSProperties}
          >
            <div className="space-y-6">
              <div className="space-y-2">
                <p style={{ color: 'var(--color-text)' }}>{item.description}</p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <p style={{ color: 'var(--color-text-muted)' }}>
                    <span className="font-medium">Developer:</span> {item.developer}
                  </p>
                  <p style={{ color: 'var(--color-text-muted)' }}>
                    <span className="font-medium">License:</span> {item.license}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>Supported Platforms:</p>
                <div className="flex flex-wrap gap-2">
                  {item.platforms.map((platform, i) => (
                    <span 
                      key={i} 
                      className="px-2 py-1 text-xs rounded"
                      style={{
                        '--bg-color': 'var(--color-primary-faded)',
                        '--text-color': 'var(--color-primary)',
                        backgroundColor: 'var(--bg-color)',
                        color: 'var(--text-color)'
                      } as React.CSSProperties}
                    >
                      {platform}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>Key Features:</p>
                <ul className="space-y-1.5 pl-1">
                  {item.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <span className="mr-2" style={{ color: 'var(--color-primary)' }}>•</span>
                      <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const filteredItems = activeTab === 'hardware' 
    ? hardware.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.cpu.model.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : software.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.developer.toLowerCase().includes(searchTerm.toLowerCase())
      );

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8" style={{ color: 'var(--color-text)' }}>My Workspace</h1>
      
      <div className="flex items-end" style={{ borderBottom: '1px solid var(--color-primary)', paddingBottom: '1px' }}>
        <div className="flex flex-1">
          {(['hardware', 'software'] as const).map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 text-sm font-medium transition-colors border hover:bg-opacity-90 ${activeTab === tab ? '' : 'opacity-70'}`}
              style={{
                backgroundColor: activeTab === tab ? 'var(--color-secondary)' : 'transparent',
                color: 'var(--color-text)',
                border: '1px solid var(--color-primary)',
                borderBottom: activeTab === tab ? 'none' : '1px solid var(--color-primary)',
                borderRadius: '0.25rem 0.25rem 0 0',
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
          <button
            onClick={toggleAllItems}
            className="px-4 py-2 text-sm font-medium transition-colors border hover:bg-opacity-90 flex items-center"
            style={{
              backgroundColor: 'var(--color-secondary)',
              color: 'var(--color-text)',
              border: '1px solid var(--color-primary)',
              borderBottom: 'none',
              borderRadius: '0.25rem 0.25rem 0 0',
              height: '100%',
              position: 'relative',
              zIndex: 1,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            <span className="mr-2">{allExpanded ? 'Collapse All' : 'Expand All'}</span>
            <svg
              className={`w-4 h-4 transition-transform ${allExpanded ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              style={{ color: 'var(--color-text-muted)' }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="mb-8">
        {activeTab === 'hardware' ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mt-6" style={{ color: 'var(--color-text)' }}>My Hardware</h2>
            {hardware.length > 0 ? (
              <div className="space-y-4">
                {filteredItems.map((item, index) => renderHardwareItem(item as HardwareItem, index))}
              </div>
            ) : (
              <p style={{ color: 'var(--color-text-muted)' }}>No hardware information available.</p>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mt-6 mb-4" style={{ color: 'var(--color-text)' }}>My Software Stack</h2>
            {software.length > 0 ? (
              <div className="space-y-4">
                {(filteredItems as SoftwareItem[])
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((item, index) => renderSoftwareItem(item, index))}
              </div>
            ) : (
              <p style={{ color: 'var(--color-text-muted)' }}>No software information available.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}