import React, { useState } from "react";
import { useLocation } from "wouter";
import { 
  Home, 
  Target, 
  Dumbbell, 
  Utensils, 
  TrendingUp, 
  Award,
  BookOpen,
  HelpCircle,
  Settings,
  Menu,
  X
} from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";

const navigationItems = [
  { path: "/dashboard", icon: Home, key: "home" },
  { path: "/challenges", icon: Target, key: "challenges" },
  { path: "/exercises", icon: Dumbbell, key: "exercises" },
  { path: "/meals", icon: Utensils, key: "meals" },
];

const secondaryItems = [
  { path: "/progress", icon: TrendingUp, key: "progress" },
  { path: "/badges", icon: Award, key: "badges" },
  { path: "/courses", icon: BookOpen, key: "courses" },
  { path: "/faq", icon: HelpCircle, key: "faq" },
  { path: "/settings", icon: Settings, key: "settings" },
];

export default function BottomNavigation() {
  const [location, setLocation] = useLocation();
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const NavItem = ({ path, icon: Icon, label, onClick, isSideMenu = false }: {
    path: string;
    icon: React.ComponentType<any>;
    label: string;
    onClick?: () => void;
    isSideMenu?: boolean;
  }) => {
    const isActive = location === path;

    return (
      <button
        onClick={() => {
          setLocation(path);
          onClick?.();
        }}
        className={`flex ${isSideMenu ? 'flex-row items-center justify-start p-3 w-full' : 'flex-col items-center justify-center p-2'} rounded-lg transition-colors ${
          isActive
            ? "text-primary bg-primary/10"
            : "text-muted-foreground hover:text-foreground hover:bg-muted"
        }`}
      >
        <Icon className={`w-5 h-5 ${isSideMenu ? 'mr-3' : 'mb-1'}`} />
        <span className={`${isSideMenu ? 'text-sm' : 'text-xs'} font-medium`}>{label}</span>
      </button>
    );
  };

  return (
    <>
      {/* Bottom Navigation - Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border">
        <div className="flex items-center justify-around px-2 py-2 max-w-md mx-auto">
          {navigationItems.map((item) => (
            <NavItem
              key={item.path}
              path={item.path}
              icon={item.icon}
              label={t(`navigation.${item.key}`)}
            />
          ))}

          {/* Menu Button */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <button className="flex flex-col items-center justify-center p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                <Menu className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">Menu</span>
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-2">
                {secondaryItems.map((item) => (
                  <NavItem
                    key={item.path}
                    path={item.path}
                    icon={item.icon}
                    label={t(`navigation.${item.key}`)}
                    onClick={() => setIsMenuOpen(false)}
                    isSideMenu={true}
                  />
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </>
  );
}