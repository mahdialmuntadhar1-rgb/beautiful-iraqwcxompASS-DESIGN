import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { StoriesRing } from './components/StoriesRing';
import { CategoryGrid } from './components/CategoryGrid';
import { FeaturedBusinesses } from './components/FeaturedBusinesses';
import { PersonalizedEvents } from './components/PersonalizedEvents';
import { DealsMarketplace } from './components/DealsMarketplace';
import { CommunityStories } from './components/CommunityStories';
import { CityGuide } from './components/CityGuide';
import { BusinessDirectory } from './components/BusinessDirectory';
import { InclusiveFeatures } from './components/InclusiveFeatures';
import { AuthModal } from './components/AuthModal';
import { Dashboard } from './components/Dashboard';
import { SubcategoryModal } from './components/SubcategoryModal';
import { GovernorateFilter } from './components/GovernorateFilter';
import { SearchPortal } from './components/SearchPortal';
import { AdminHealthCheck } from './components/AdminHealthCheck';
import { mockUser } from './constants';
import type { User, Category, Subcategory } from './types';
import { TranslationProvider } from './hooks/useTranslations';

const MainContent: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [page, setPage] = useState<'home' | 'dashboard' | 'listing'>('home');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [listingFilter, setListingFilter] = useState<{ categoryId: string } | null>(null);
  const [selectedGovernorate, setSelectedGovernorate] = useState('all');
  const [scrollTrigger, setScrollTrigger] = useState(0);
  const [highContrast, setHighContrast] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('iraq-compass-high-contrast') === 'true';
    }
    return false;
  });

  useEffect(() => {
    console.log(`Governorate changed to: ${selectedGovernorate}. Data should be refetched.`);
  }, [selectedGovernorate]);

  useEffect(() => {
    if (highContrast) {
      document.documentElement.setAttribute('data-contrast', 'high');
      localStorage.setItem('iraq-compass-high-contrast', 'true');
    } else {
      document.documentElement.removeAttribute('data-contrast');
      localStorage.setItem('iraq-compass-high-contrast', 'false');
    }
  }, [highContrast]);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentUser(mockUser);
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setPage('home');
  };

  const navigateTo = (targetPage: 'home' | 'dashboard') => {
    if (targetPage === 'dashboard' && !isLoggedIn) {
      setShowAuthModal(true);
    } else {
      setPage(targetPage);
      if (targetPage === 'home') {
        setListingFilter(null);
      }
    }
  };

  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const isAdminRoute = pathname === '/admin';

  if (isAdminRoute) {
    return (
      <div className="min-h-screen bg-dark-bg text-white">
        <Header
          isLoggedIn={isLoggedIn}
          user={currentUser}
          onSignIn={() => setShowAuthModal(true)}
          onSignOut={handleLogout}
          onDashboard={() => navigateTo('dashboard')}
          onHome={() => navigateTo('home')}
        />
        <main>
          <AdminHealthCheck />
        </main>
      </div>
    );
  }

  const handleCategoryClick = (category: Category) => {
    if (category.subcategories && category.subcategories.length > 0) {
      setSelectedCategory(category);
    } else {
      setListingFilter({ categoryId: category.id });
      setPage('listing');
    }
  };


  const handleGovernorateChange = (governorateId: string) => {
    setSelectedGovernorate(governorateId);
    setListingFilter(null);
  };

  const handleSubcategorySelect = (category: Category, subcategory: Subcategory) => {
    void subcategory;
    setListingFilter({ categoryId: category.id });
    setPage('listing');
    setSelectedCategory(null);
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      <Header
        isLoggedIn={isLoggedIn}
        user={currentUser}
        onSignIn={() => setShowAuthModal(true)}
        onSignOut={handleLogout}
        onDashboard={() => navigateTo('dashboard')}
        onHome={() => navigateTo('home')}
      />
      <main>
        {page === 'home' && (
          <>
            <HeroSection />
            <StoriesRing />
            <SearchPortal />
            <GovernorateFilter
              selectedGovernorate={selectedGovernorate}
              onGovernorateChange={handleGovernorateChange}
              onSearchGovernorate={() => setScrollTrigger((prev) => prev + 1)}
            />
            <CategoryGrid
              onCategoryClick={handleCategoryClick}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
            <FeaturedBusinesses />
            <PersonalizedEvents />
            <DealsMarketplace />
            <CommunityStories />
            <CityGuide />
            <BusinessDirectory
              initialFilter={listingFilter ?? undefined}
              initialGovernorate={selectedGovernorate}
              scrollTrigger={scrollTrigger}
            />
            <InclusiveFeatures highContrast={highContrast} setHighContrast={setHighContrast} />
          </>
        )}
        {page === 'listing' && listingFilter && (
          <BusinessDirectory
            initialFilter={listingFilter}
            initialGovernorate={selectedGovernorate}
            scrollTrigger={scrollTrigger}
            onBack={() => navigateTo('home')}
          />
        )}
        {page === 'dashboard' && <Dashboard user={currentUser!} onLogout={handleLogout} />}
      </main>
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} onLogin={handleLogin} />}
      <SubcategoryModal
        category={selectedCategory}
        onClose={() => setSelectedCategory(null)}
        onSubcategorySelect={handleSubcategorySelect}
      />
    </div>
  );
};

const App: React.FC = () => (
  <TranslationProvider>
    <MainContent />
  </TranslationProvider>
);

export default App;
