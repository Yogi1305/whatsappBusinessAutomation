import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  NavigationMenu, 
  NavigationMenuItem, 
  NavigationMenuLink, 
  NavigationMenuList,
  navigationMenuTriggerStyle 
} from "@/components/ui/navigation-menu";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { 
  Workflow,
  MessageSquare, 
  LayoutGrid, 
  Contact, 
  Megaphone, 
  Bell, 
  UserCircle2, 
  LogOut, 
  MenuIcon
} from "lucide-react";
import { useAuth } from './authContext';
import logo from "./assets/logo.png";
import io from 'socket.io-client';
export const whatsappURL = 'https://whatsappbotserver.azurewebsites.net'
import axiosInstance from './api';

const socket = io('https://whatsappbotserver.azurewebsites.net');

const Navbar = () => {
  const { authenticated, logout, tenantId } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  const handleNewMessage = (message) => {
    const newNotification = {
      id: Date.now(),
      text: `New message from ${message.contactPhone}: ${message.message.text.body}`,
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
  };

  useEffect(() => {
    const handleNewSocketMessage = (message) => {
      if (message) {
        handleNewMessage(message);
      }
    };
    socket.on('new-message', handleNewSocketMessage);
    return () => {
      socket.off('new-message');
    };
  }, []);

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const getPath = (path) => {
    if (authenticated) {
      return `/${tenantId}${path}`;
    } else {
      return path.startsWith('/demo') ? path : `/demo${path}`;
    }
  };

  const handleLogout = async() => {
    await axiosInstance.post('logout/');
    logout();
    navigate('/');
  };

  if (isAuthPage) return null;

  const NavLinks = () => {
    const linkBaseClasses = authenticated 
      ? "group flex items-center gap-2 hover:bg-primary/10 transition-all duration-300 px-3 py-2 rounded-md"
      : "group flex items-center gap-2 hover:bg-gray-800 transition-all duration-300 px-3 py-2 rounded-md";
    
    const iconClasses = authenticated
      ? "w-5 h-5 text-primary group-hover:scale-110 transition-transform"
      : "w-5 h-5 text-gray-300 group-hover:text-white transition-transform";
    
    const textClasses = authenticated
      ? "text-foreground group-hover:text-primary"
      : "text-gray-300 group-hover:text-white";

    const navigationItems = (
      <NavigationMenuList className="flex items-center space-x-2">
        {authenticated && (
          <>
            <NavigationMenuItem>
              <Link to={getPath('/contact')}>
                <NavigationMenuLink className={linkBaseClasses}>
                  <Contact className={iconClasses} />
                  <span className={textClasses}>Contact</span>
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to={getPath('/broadcast')}>
                <NavigationMenuLink className={linkBaseClasses}>
                  <Megaphone className={iconClasses} />
                  <span className={textClasses}>Broadcast</span>
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </>
        )}
        <NavigationMenuItem>
          <Link to={getPath('/catalog')}>
            <NavigationMenuLink className={linkBaseClasses}>
              <LayoutGrid className={iconClasses} />
              <span className={textClasses}>Catalog</span>
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link to={getPath('/chatbot')}>
            <NavigationMenuLink className={linkBaseClasses}>
              <MessageSquare className={iconClasses} />
              <span className={textClasses}>Chatbot</span>
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link to={getPath('/flow-builder')}>
            <NavigationMenuLink className={linkBaseClasses}>
              <Workflow className={iconClasses} />
              <span className={textClasses}>Flow Builder</span>
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    );

    return (
      <NavigationMenu>
        {navigationItems}
      </NavigationMenu>
    );
  };

  return (
    <div className={`w-full z-40 ${authenticated 
      ? 'bg-background border-b border-border/40 shadow-sm' 
      : 'bg-black border-b border-gray-900 shadow-lg'}`}>
      <div className="container mx-auto flex justify-between items-center py-3 px-4">
        {/* Logo Section */}
        <Link 
          to="/" 
          className="flex items-center space-x-2 group transition-all duration-300 hover:scale-105"
        >
          <img 
            src={logo} 
            alt="Nuren AI Logo" 
            className="h-10 w-10 group-hover:rotate-6 transition-transform"
          />
          <span className={`text-2xl font-bold ${
            authenticated 
              ? 'text-primary group-hover:text-primary/80' 
              : 'text-white group-hover:text-gray-300'
          }`}>
            Nuren AI
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:block">
          <NavLinks />
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          {authenticated ? (
            <>
              {/* Notifications Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="relative group hover:bg-primary/10 transition-all duration-300"
                  >
                    <Bell className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                    {unreadCount > 0 && (
                      <Badge 
                        variant="destructive" 
                        className="absolute -top-2 -right-2 px-1.5 py-0.5 text-xs animate-pulse"
                      >
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {notifications.length > 0 ? (
                    notifications.map(notification => (
                      <DropdownMenuItem 
                        key={notification.id} 
                        onSelect={() => removeNotification(notification.id)}
                        className="flex justify-between items-center hover:bg-primary/10 transition-colors"
                      >
                        <span className="truncate max-w-[250px]">{notification.text}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive hover:bg-destructive/10"
                        >
                          &times;
                        </Button>
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <div className="text-muted-foreground text-center py-4">
                      No new notifications
                    </div>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="group hover:bg-primary/10 transition-all duration-300"
                  >
                    <UserCircle2 className="w-7 h-7 text-primary group-hover:scale-110 transition-transform" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onSelect={() => navigate(getPath('/profile'))}
                    className="hover:bg-primary/10 transition-colors"
                  >
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onSelect={() => navigate(getPath('/models'))}
                    className="hover:bg-primary/10 transition-colors"
                  >
                    Models
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onSelect={() => navigate(getPath('/assign'))}
                    className="hover:bg-primary/10 transition-colors"
                  >
                    Assign
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onSelect={handleLogout} 
                    className="text-destructive hover:bg-destructive/10 focus:bg-destructive/10"
                  >
                    <LogOut className="mr-2" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Link to="/login">
              <Button 
                variant="ghost" 
                className="text-gray-300 bg-transparent hover:bg-gray-800 hover:text-white transition-all duration-300"
              >
                Login
              </Button>
            </Link>
          )}

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button 
                variant="ghost" 
                size="icon" 
                className={`${
                  authenticated 
                    ? "hover:bg-primary/10" 
                    : "text-gray-300 hover:bg-gray-800 bg-transparent"
                } transition-all duration-300`}
              >
                <MenuIcon className={
                  authenticated 
                    ? "w-6 h-6 text-primary group-hover:scale-110 transition-transform"
                    : "w-6 h-6 text-gray-300 group-hover:text-white group-hover:scale-110 transition-transform"
                } />
              </Button>
            </SheetTrigger>
            <SheetContent 
              side="left" 
              className={`w-[300px] ${
                authenticated ? "" : "bg-black border-r border-gray-900"
              }`}
            >
              <SheetHeader>
                <SheetTitle className={`flex items-center space-x-2 ${
                  authenticated ? "" : "text-white"
                }`}>
                  <img src={logo} alt="Nuren AI Logo" className="h-8 w-8" />
                  <span>Nuren AI</span>
                </SheetTitle>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <NavLinks />
                {!authenticated && (
                  <Link to="/login">
                    <Button className="w-full bg-gray-900 text-gray-300 hover:bg-gray-800 hover:text-white">
                      Login
                    </Button>
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
};

export default Navbar;