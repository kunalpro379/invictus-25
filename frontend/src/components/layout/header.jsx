import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Bell,
  Settings,
  LogOut,
  User,
  Edit,
  ChevronDown,
  Search,
  Menu,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function Header({ user }) {
  const navigate = useNavigate();
  const [unreadNotifications] = useState(3);

  const navItems = [
    { label: 'Research Papers', href: '/research-papers' },
    { label: 'Datasets', href: '/datasets' },
    { label: 'News', href: '/news' },
    { label: 'Articles', href: '/articles' },
  ];

  return (
    <div className="h-16 px-6 border-b bg-gradient-to-r from-rose-600 to-pink-600 flex items-center justify-between">
      {/* Left side - Navigation */}
      <div className="flex items-center gap-8">
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="text-sm font-medium text-white/90 hover:text-white transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Center - Search */}
      <div className="flex-1 max-w-2xl mx-4 md:mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search papers, datasets, or researchers..."
            className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent text-white placeholder-white/70"
          />
        </div>
      </div>

      {/* Right side - User Menu */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative text-white hover:bg-white/10"
        >
          <Bell className="h-5 w-5" />
          {unreadNotifications > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {unreadNotifications}
            </span>
          )}
        </Button>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="flex items-center gap-2 px-2 text-white hover:bg-white/10"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.profileImage || "/default-avatar.png"} />
                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
                  {user?.firstName?.[0]}
                  {user?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-2">
                <div className="text-sm text-left hidden md:block">
                  <p className="font-medium text-white">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-white/75">{user?.instituteName || 'Researcher'}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-white/70" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <div className="flex items-center gap-4 p-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user?.profileImage || "/default-avatar.png"} />
                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-xl">
                  {user?.firstName?.[0]}
                  {user?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-sm text-gray-500">{user?.email}</p>
                <p className="text-xs text-gray-500 mt-1">{user?.instituteName}</p>
              </div>
            </div>
            <div className="p-2">
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <div className="font-semibold text-gray-900">{user?.papers?.length || 0}</div>
                  <div className="text-xs text-gray-500">Papers</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <div className="font-semibold text-gray-900">{user?.experience || 0}</div>
                  <div className="text-xs text-gray-500">Years Exp.</div>
                </div>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/user-profile')} className="gap-2">
              <User className="h-4 w-4" /> View Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/update-profile')} className="gap-2">
              <Edit className="h-4 w-4" /> Update Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/settings')} className="gap-2">
              <Settings className="h-4 w-4" /> Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600 gap-2">
              <LogOut className="h-4 w-4" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
