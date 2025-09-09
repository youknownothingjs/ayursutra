import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = ({ userRole = null, isAuthenticated = false, userName = '', onLogout = () => {} }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(2);
  const location = useLocation();
  const navigate = useNavigate();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location?.pathname]);

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const getPatientNavItems = () => [
    {
      label: 'Dashboard',
      path: '/patient-dashboard',
      icon: 'LayoutDashboard',
      isActive: location?.pathname === '/patient-dashboard'
    },
    {
      label: 'Book Therapy',
      path: '/therapy-booking',
      icon: 'Calendar',
      isActive: location?.pathname === '/therapy-booking'
    },
    {
      label: 'Preparation',
      path: '/therapy-preparation',
      icon: 'CheckSquare',
      isActive: location?.pathname === '/therapy-preparation'
    }
  ];

  const getPractitionerNavItems = () => [
    {
      label: 'Calendar',
      path: '/practitioner-calendar',
      icon: 'CalendarDays',
      isActive: location?.pathname === '/practitioner-calendar'
    }
  ];

  const getPreAuthNavItems = () => [
    {
      label: 'Login',
      path: '/patient-login',
      icon: 'LogIn',
      isActive: location?.pathname === '/patient-login'
    },
    {
      label: 'Register',
      path: '/patient-registration',
      icon: 'UserPlus',
      isActive: location?.pathname === '/patient-registration'
    }
  ];

  const getNavigationItems = () => {
    if (!isAuthenticated) return getPreAuthNavItems();
    if (userRole === 'patient') return getPatientNavItems();
    if (userRole === 'practitioner') return getPractitionerNavItems();
    return [];
  };

  const navigationItems = getNavigationItems();

  const Logo = () => (
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
        <svg
          viewBox="0 0 24 24"
          className="w-6 h-6 text-primary-foreground"
          fill="currentColor"
        >
          <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" />
          <path d="M12 16L13.09 22.26L20 23L13.09 23.74L12 30L10.91 23.74L4 23L10.91 22.26L12 16Z" opacity="0.6" />
        </svg>
      </div>
      <div className="font-heading font-semibold text-xl text-foreground">
        AyurSutra
      </div>
    </div>
  );

  const NotificationBadge = ({ count }) => (
    count > 0 && (
      <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]">
        {count > 9 ? '9+' : count}
      </span>
    )
  );

  const NavItem = ({ item, isMobile = false }) => (
    <button
      onClick={() => handleNavigation(item?.path)}
      className={`
        relative flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-breathing
        touch-target focus-ring hover-lift
        ${item?.isActive 
          ? 'bg-primary text-primary-foreground' 
          : 'text-text-secondary hover:text-foreground hover:bg-muted'
        }
        ${isMobile ? 'w-full justify-start' : ''}
      `}
    >
      <Icon name={item?.icon} size={18} />
      <span className="font-body">{item?.label}</span>
      {item?.label === 'Dashboard' && userRole === 'patient' && (
        <NotificationBadge count={notifications} />
      )}
      {item?.label === 'Calendar' && userRole === 'practitioner' && (
        <NotificationBadge count={notifications} />
      )}
    </button>
  );

  const UserMenu = () => (
    isAuthenticated && (
      <div className="flex items-center space-x-4">
        <div className="hidden md:flex items-center space-x-2 text-sm">
          <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
            <Icon name="User" size={16} className="text-secondary-foreground" />
          </div>
          <span className="font-body text-foreground">{userName || 'User'}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onLogout}
          iconName="LogOut"
          iconSize={16}
          className="text-text-secondary hover:text-foreground"
        >
          <span className="hidden md:inline">Logout</span>
        </Button>
      </div>
    )
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems?.map((item) => (
              <NavItem key={item?.path} item={item} />
            ))}
          </nav>

          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center">
            <UserMenu />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            {isAuthenticated && (
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                <Icon name="User" size={16} className="text-secondary-foreground" />
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              iconName={isMobileMenuOpen ? "X" : "Menu"}
              iconSize={20}
              className="touch-target"
            />
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationItems?.map((item) => (
                <NavItem key={item?.path} item={item} isMobile />
              ))}
              {isAuthenticated && (
                <div className="pt-4 border-t border-border mt-4">
                  <div className="flex items-center justify-between px-3 py-2">
                    <span className="font-body text-sm text-foreground">
                      {userName || 'User'}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onLogout}
                      iconName="LogOut"
                      iconSize={16}
                      className="text-text-secondary"
                    >
                      Logout
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;