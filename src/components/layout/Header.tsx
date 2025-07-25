import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Trophy, 
  TrendingUp, 
  Users, 
  BarChart3, 
  User,
  Menu,
  X,
  GitCompare,
  CloudRain
} from 'lucide-react'

interface HeaderProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function Header({ activeTab, onTabChange }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Trophy },
    { id: 'live-games', label: 'Live Games', icon: TrendingUp },
    { id: 'my-bets', label: 'My Bets', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'comparison', label: 'Team Compare', icon: GitCompare },
    { id: 'analysis', label: 'Weather & Injuries', icon: CloudRain },
  ]

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-accent text-accent-foreground p-2 rounded-lg">
              <Trophy className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Gameday+</h1>
              <p className="text-xs text-muted-foreground">College Football Intelligence</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  onClick={() => onTabChange(tab.id)}
                  className="flex items-center space-x-2"
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </Button>
              )
            })}
          </nav>

          {/* User Balance & Profile */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm font-medium text-foreground">$2,450.00</div>
              <div className="text-xs text-muted-foreground">Available Balance</div>
            </div>
            <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20">
              +$125.50 Today
            </Badge>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "default" : "ghost"}
                    onClick={() => {
                      onTabChange(tab.id)
                      setMobileMenuOpen(false)
                    }}
                    className="flex items-center justify-start space-x-2 w-full"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </Button>
                )
              })}
              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-foreground">$2,450.00</div>
                    <div className="text-xs text-muted-foreground">Available Balance</div>
                  </div>
                  <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20">
                    +$125.50
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}