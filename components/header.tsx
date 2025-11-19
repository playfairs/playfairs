export default function Header() {
  return (
    <header className="w-full py-3 px-6 border-b border-gray-200">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <a href="/" className="text-lg font-semibold text-gray-800 hover:text-teal-600 transition-colors">
          playfairs.cc
        </a>
        <nav className="flex space-x-4">
          <a 
            href="https://github.com/playfairs" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-teal-600 transition-colors text-sm"
          >
            GitHub
          </a>
          <a 
            href="/socials" 
            className="text-gray-600 hover:text-teal-600 transition-colors text-sm"
          >
            Socials
          </a>
          <a 
            href="#" 
            className="text-gray-600 hover:text-teal-600 transition-colors text-sm"
          >
            Projects
          </a>
        </nav>
      </div>
    </header>
  )
}