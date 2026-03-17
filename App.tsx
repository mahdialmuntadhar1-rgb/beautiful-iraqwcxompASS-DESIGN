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
import { SearchPortal } from './components/SearchPortal';
import { MainTabs } from './components/MainTabs';
import { MadinatyFilters } from './components/MadinatyFilters';
import { ShakumakuFilters } from './components/ShakumakuFilters';
import { CityOnboarding } from './components/CityOnboarding';
import { BottomNav } from './components/BottomNav';
import { mockUser, businesses } from './constants';
import type { User, Category, Subcategory, TabType } from './types';
import { TranslationProvider, useTranslations } from './hooks/useTranslations';

const MainContent: React.FC = () => {
  const { t, setLang } = useTranslations();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [page, setPage] = useState<'home' | 'dashboard' | 'listing'>('home');
  const [activeTab, setActiveTab] = useState<TabType>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('iraq_compass_active_tab') as TabType) || 'madinaty';
    }
    return 'madinaty';
  });
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [listingFilter, setListingFilter] = useState<{ categoryId: string } | null>(null);
  
  // Navigation State
  const [activeNav, setActiveNav] = useState<'feed' | 'city' | 'search' | 'profile'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('iraq_compass_active_nav');
      if (saved === 'feed' || saved === 'city' || saved === 'search' || saved === 'profile') return saved;
    }
    return 'city';
  });

  // Onboarding State
  const [showOnboarding, setShowOnboarding] = useState(() => {
    if (typeof window !== 'undefined') {
      return !localStorage.getItem('iraq_compass_city');
    }
    return false;
  });

  const [selectedGovernorate, setSelectedGovernorate] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('iraq_compass_gov_filter') || 
             localStorage.getItem('iraq_compass_city') || 'all';
    }
    return 'all';
  });

  const [madinatyCategory, setMadinatyCategory] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('iraq_compass_cat_filter') || 'all';
    }
    return 'all';
  });
  const [shakumakuFeedFilter, setShakumakuFeedFilter] = useState<'all' | 'business' | 'people'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('iraq_compass_feed_type') as any) || 'all';
    }
    return 'all';
  });
  
  const [highContrast, setHighContrast] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('iraq-compass-high-contrast') === 'true';
    }
    return false;
  });

  useEffect(() => {
    if (highContrast) {
      document.documentElement.setAttribute('data-contrast', 'high');
      localStorage.setItem('iraq-compass-high-contrast', 'true');
    } else {
      document.documentElement.removeAttribute('data-contrast');
      localStorage.setItem('iraq-compass-high-contrast', 'false');
    }
  }, [highContrast]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('iraq_compass_gov_filter', selectedGovernorate);
      localStorage.setItem('iraq_compass_city', selectedGovernorate); // Keep for onboarding check
    }
  }, [selectedGovernorate]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('iraq_compass_cat_filter', madinatyCategory);
    }
  }, [madinatyCategory]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('iraq_compass_feed_type', shakumakuFeedFilter);
    }
  }, [shakumakuFeedFilter]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('iraq_compass_active_tab', activeTab);
      // Sync activeNav when activeTab changes
      if (activeTab === 'shakumaku') setActiveNav('feed');
      if (activeTab === 'madinaty') setActiveNav('city');
    }
  }, [activeTab]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('iraq_compass_active_nav', activeNav);
      // Logic to switch between pages based on nav
      if (activeNav === 'feed') {
        setActiveTab('shakumaku');
        setPage('home');
      } else if (activeNav === 'city') {
        setActiveTab('madinaty');
        setPage('home');
      } else if (activeNav === 'profile') {
        if (isLoggedIn) {
          setPage('dashboard');
        } else {
          setShowAuthModal(true);
          // Revert nav if not logged in
          setActiveNav(activeTab === 'shakumaku' ? 'feed' : 'city');
        }
      } else if (activeNav === 'search') {
        setPage('home'); // For now, search is on home
        // We could scroll to search or open search portal
      }
    }
  }, [activeNav, isLoggedIn]);

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
  }

  const handleCategoryClick = (category: Category) => {
    if (category.subcategories && category.subcategories.length > 0) {
      setSelectedCategory(category);
    } else {
      setListingFilter({ categoryId: category.id });
      setPage('listing');
    }
  };
  
  const handleSubcategorySelect = (category: Category, subcategory: Subcategory) => {
    setListingFilter({ categoryId: category.id });
    setPage('listing');
    setSelectedCategory(null);
  };

  const handleOnboardingComplete = (city: string, lang: 'en' | 'ar' | 'ku') => {
    setLang(lang);
    setSelectedGovernorate(city);
    setShowOnboarding(false);
  };

  // Filter logic for Madinaty (Phase 1)
  const filteredBusinessesCount = businesses.filter(b => {
    const matchesGov = selectedGovernorate === 'all' || b.governorate?.toLowerCase() === selectedGovernorate.toLowerCase();
    const matchesCat = madinatyCategory === 'all' || b.category === madinatyCategory;
    return matchesGov && matchesCat;
  }).length;

  return (
    <div className="min-h-screen bg-navy text-[#e8dcc8] bg-mesh relative overflow-x-hidden">
      {showOnboarding && <CityOnboarding onComplete={handleOnboardingComplete} />}
      <Header 
        isLoggedIn={isLoggedIn}
        user={currentUser}
        onSignIn={() => setShowAuthModal(true)}
        onSignOut={handleLogout}
        onDashboard={() => navigateTo('dashboard')}
        onHome={() => navigateTo('home')}
      />
      
      <main className="relative z-10 max-w-[480px] mx-auto min-h-screen bg-navy/40 backdrop-blur-sm border-x border-white/5 pb-24">
        {page === 'home' && (
          <>
            <MainTabs activeTab={activeTab} onTabChange={setActiveTab} />
            
            <div key={`${activeTab}-${selectedGovernorate}-${madinatyCategory}-${shakumakuFeedFilter}`} className="tab-content-fade">
              {activeTab === 'shakumaku' ? (
                <>
                  <ShakumakuFilters 
                    selectedGovernorate={selectedGovernorate}
                    onGovernorateChange={setSelectedGovernorate}
                    feedFilter={shakumakuFeedFilter}
                    onFeedFilterChange={setShakumakuFeedFilter}
                  />
                  {/* Phase 2 will fill this feed */}
                  <div className="flex flex-col items-center justify-center py-20 px-10 text-center space-y-4">
                    <span className="text-6xl">⚡</span>
                    <h2 className="text-xl font-bold text-[#d4af37]">{t('common.shakumaku')}</h2>
                    <p className="text-[#e8dcc8]/60 text-sm">Social feed coming in Phase 2...</p>
                  </div>
                </>
              ) : (
                <>
                  <MadinatyFilters 
                    selectedGovernorate={selectedGovernorate}
                    onGovernorateChange={setSelectedGovernorate}
                    selectedCategory={madinatyCategory}
                    onCategoryChange={setMadinatyCategory}
                    resultCount={filteredBusinessesCount}
                  />
                  
                  {filteredBusinessesCount === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 px-10 text-center space-y-4">
                      <span className="text-6xl">🏛️</span>
                      <p className="text-[#e8dcc8]/60">{t('common.noResults')}</p>
                    </div>
                  ) : (
                    <>
                      <HeroSection />
                      <StoriesRing />
                      <SearchPortal />
                      <CategoryGrid 
                        onCategoryClick={handleCategoryClick} 
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                      />
                      <FeaturedBusinesses 
                        governorate={selectedGovernorate}
                        category={madinatyCategory}
                      />
                      <PersonalizedEvents 
                        governorate={selectedGovernorate}
                      />
                      <DealsMarketplace 
                        governorate={selectedGovernorate}
                      />
                      <CommunityStories />
                      <CityGuide />
                      <BusinessDirectory 
                        governorate={selectedGovernorate}
                        category={madinatyCategory}
                      />
                    </>
                  )}
                </>
              )}
            </div>
            <InclusiveFeatures highContrast={highContrast} setHighContrast={setHighContrast} />
          </>
        )}
        {page === 'listing' && listingFilter && (
            <BusinessDirectory 
                initialFilter={listingFilter} 
                onBack={() => navigateTo('home')} 
            />
        )}
        {page === 'dashboard' && <Dashboard user={currentUser!} onLogout={handleLogout} />}
      </main>

      <BottomNav activeTab={activeNav} onTabChange={setActiveNav} />

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} onLogin={handleLogin} />}
      <SubcategoryModal 
        category={selectedCategory} 
        onClose={() => setSelectedCategory(null)}
        onSubcategorySelect={handleSubcategorySelect}
      />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <TranslationProvider>
      <MainContent />
    </TranslationProvider>
  );
}

export default App;