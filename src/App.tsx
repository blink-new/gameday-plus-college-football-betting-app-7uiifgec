import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import { Dashboard } from '@/components/dashboard/Dashboard'
import { Analytics } from '@/components/analytics/Analytics'
import { blink } from '@/blink/client'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mb-4 mx-auto">
            <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Loading Gameday+</h2>
          <p className="text-muted-foreground">Preparing your college football experience...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mb-6 mx-auto">
            <svg className="w-10 h-10 text-accent" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">Welcome to Gameday+</h1>
          <p className="text-muted-foreground mb-8">
            Your ultimate college football intelligence and betting platform. 
            Sign in to access live odds, AI predictions, and advanced analytics.
          </p>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="font-medium text-foreground mb-1">Live Betting</div>
                <div className="text-muted-foreground">Real-time odds and quick bet placement</div>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="font-medium text-foreground mb-1">AI Insights</div>
                <div className="text-muted-foreground">Advanced predictions and analytics</div>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="font-medium text-foreground mb-1">Team Analytics</div>
                <div className="text-muted-foreground">Deep dive into team performance</div>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="font-medium text-foreground mb-1">Player Stats</div>
                <div className="text-muted-foreground">Individual player tracking</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />
      case 'live-games':
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold text-foreground mb-4">Live Games</h2>
              <p className="text-muted-foreground">Coming soon - Real-time game tracking and in-game betting</p>
            </div>
          </div>
        )
      case 'my-bets':
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold text-foreground mb-4">My Bets</h2>
              <p className="text-muted-foreground">Coming soon - Track your betting history and active wagers</p>
            </div>
          </div>
        )
      case 'analytics':
        return <Analytics />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="pb-8">
        {renderContent()}
      </main>
    </div>
  )
}

export default App