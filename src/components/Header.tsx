import React, { useState } from 'react';
import { 
  Phone, 
  Facebook, 
  Twitter, 
  User, 
  Search, 
  Heart, 
  ShoppingBag, 
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import { DiamondIcon } from './DiamondIcon';
import { AziiJewelsLogo } from './AziiJewelsLogo';
import { useSiteSettings } from '../context/SiteSettingsContext';

interface HeaderProps {
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onSearch: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onSearch,
}) => {
  const { get } = useSiteSettings();
  const [searchCategory, setSearchCategory] = useState('All Categories');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const categories = ['All Categories', 'Bracelets', 'Rings', 'Earrings', 'Necklaces', 'Men Collection'];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <header className="w-full bg-[#121212] text-white border-b border-neutral-800 relative z-40 font-['Jost',sans-serif]">
      {/* 1. Top Bar */}
      <div className="border-b border-neutral-800 text-[11px] text-neutral-300">
        <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap justify-between items-center gap-2">
          {/* Left: News ticker */}
          <div className="flex items-center space-x-2">
            <span className="font-bold tracking-wider text-white uppercase text-[10px] bg-neutral-800 px-2 py-0.5 rounded-sm">
              {get('news_badge') || 'NEWS'} &gt;
            </span>
            <span className="text-neutral-400 truncate max-w-[200px] sm:max-w-xs md:max-w-md">
              {get('news_text') || 'Lorem ipsum dolor consectetu'}
            </span>
          </div>

          {/* Right: Phone, Socials, Account */}
          <div className="flex items-center space-x-6 text-neutral-300">
            <a
              href={`tel:${(get('header_phone') || '01678311160').replace(/\s+/g, '')}`}
              className="flex items-center space-x-1 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-neutral-400" />
              <span>Call: {get('header_phone') || '01678 311 160'}</span>
            </a>

            <div className="hidden sm:flex items-center space-x-3 text-neutral-400">
              <a href="#" className="hover:text-white transition-colors"><Facebook className="w-3 h-3" /></a>
              <a href="#" className="hover:text-white transition-colors"><Twitter className="w-3 h-3" /></a>
              <a href="#" className="hover:text-white transition-colors">
                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>

            <a href="#" className="flex items-center space-x-1.5 hover:text-white transition-colors">
              <User className="w-3 h-3 text-neutral-400" />
              <span>My Account</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Main Header Logo & Search */}
      <div className="max-w-7xl mx-auto px-4 py-5 flex items-center justify-between gap-4">
        {/* Left: Brand Logo */}
        <a href="#" className="flex items-center group transition-transform hover:scale-[1.02]">
          <AziiJewelsLogo size="md" />
        </a>

        {/* Center: Search Bar */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center flex-1 max-w-xl mx-8 relative">
          <div className="flex w-full border border-neutral-700 bg-[#1a1a1a] rounded-sm focus-within:border-amber-400/60 transition-colors">
            {/* Category Dropdown */}
            <div className="relative border-r border-neutral-700">
              <button
                type="button"
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className="h-10 px-4 text-xs font-medium text-neutral-300 flex items-center space-x-2 hover:text-white bg-[#181818]"
              >
                <span>{searchCategory}</span>
                <ChevronDown className="w-3 h-3 text-neutral-400" />
              </button>

              {isCategoryOpen && (
                <div className="absolute top-full left-0 mt-1 w-44 bg-[#1f1f1f] border border-neutral-700 rounded-sm shadow-xl z-50 text-xs">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setSearchCategory(cat);
                        setIsCategoryOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-neutral-800 text-neutral-300 hover:text-white"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input field */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for product..."
              className="flex-1 px-4 text-xs text-white placeholder-neutral-500 bg-transparent focus:outline-none"
            />

            {/* Search Submit Button */}
            <button
              type="submit"
              className="h-10 px-5 bg-white text-black hover:bg-neutral-200 transition-colors flex items-center justify-center font-medium"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Right Info & Actions */}
        <div className="flex items-center space-x-6">
          <div className="hidden lg:block text-right">
            <p className="text-[11px] text-neutral-400">Free delivery order over <span className="text-white font-semibold">₹1,000</span></p>
          </div>

          <div className="flex items-center space-x-4">
            {/* Search icon mobile */}
            <button className="md:hidden text-neutral-300 hover:text-white p-1">
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Icon */}
            <button 
              onClick={onOpenWishlist}
              className="relative text-neutral-300 hover:text-white transition-colors p-1"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Icon */}
            <button 
              onClick={onOpenCart}
              className="relative flex items-center space-x-2 text-neutral-300 hover:text-white transition-colors p-1"
              title="Shopping Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-white text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              </div>
            </button>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-neutral-300 hover:text-white p-1"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Navigation Bar */}
      <nav className="bg-[#0e0e0e] border-t border-neutral-800 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <ul className="flex items-center space-x-8 text-xs font-semibold tracking-[0.15em] py-3 text-neutral-300">
            <li>
              <a href="#" className="text-white border-b-2 border-white pb-1 transition-colors">HOME</a>
            </li>
            <li>
              <a href="#bestsellers" className="hover:text-white transition-colors">FEATURED</a>
            </li>
            <li>
              <a href="#newarrivals" className="hover:text-white transition-colors">SHOP</a>
            </li>
            <li>
              <a href="#blog" className="hover:text-white transition-colors">BLOG</a>
            </li>
            <li>
              <a href="#categories" className="hover:text-white transition-colors">PAGES</a>
            </li>
          </ul>

          <div className="flex items-center space-x-4 text-neutral-400">
            <Search className="w-4 h-4 hover:text-white cursor-pointer" />
            <Heart className="w-4 h-4 hover:text-white cursor-pointer" onClick={onOpenWishlist} />
            <ShoppingBag className="w-4 h-4 hover:text-white cursor-pointer" onClick={onOpenCart} />
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#181818] border-b border-neutral-800 px-4 py-4 space-y-3">
          <form onSubmit={handleSearchSubmit} className="flex items-center border border-neutral-700 rounded-sm overflow-hidden mb-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full px-3 py-2 text-xs bg-transparent text-white focus:outline-none"
            />
            <button type="submit" className="px-3 py-2 bg-white text-black">
              <Search className="w-4 h-4" />
            </button>
          </form>

          <a href="#" className="block py-1.5 text-sm font-semibold tracking-wider text-white">HOME</a>
          <a href="#bestsellers" className="block py-1.5 text-sm font-semibold tracking-wider text-neutral-300">FEATURED</a>
          <a href="#newarrivals" className="block py-1.5 text-sm font-semibold tracking-wider text-neutral-300">SHOP</a>
          <a href="#blog" className="block py-1.5 text-sm font-semibold tracking-wider text-neutral-300">BLOG</a>
          <a href="#categories" className="block py-1.5 text-sm font-semibold tracking-wider text-neutral-300">PAGES</a>
        </div>
      )}
    </header>
  );
};
