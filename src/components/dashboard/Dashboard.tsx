import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { GameCard } from './GameCard'
import { BettingSlip } from './BettingSlip'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Trophy,
  Clock,
  Users,
  Target,
  Zap
} from 'lucide-react'

interface Bet {
  id: string
  gameId: string
  type: string
  odds: number
  team: string
  amount: number
}

export function Dashboard() {
  const [bets, setBets] = useState<Bet[]>([])

  // Mock data for games
  const featuredGames = [
    {
      id: '1',
      homeTeam: 'Alabama Crimson Tide',
      awayTeam: 'Georgia Bulldogs',
      homeScore: 21,
      awayScore: 14,
      status: 'live' as const,
      time: 'Q2 8:45',
      homeOdds: -150,
      awayOdds: +130,
      overUnder: 52.5,
      conference: 'SEC',
      week: 8,
      homeRank: 1,
      awayRank: 3
    },
    {
      id: '2',
      homeTeam: 'Ohio State Buckeyes',
      awayTeam: 'Michigan Wolverines',
      status: 'upcoming' as const,
      time: '3:30 PM ET',
      homeOdds: -200,
      awayOdds: +175,
      overUnder: 48.5,
      conference: 'Big Ten',
      week: 8,
      homeRank: 2,
      awayRank: 5
    },
    {
      id: '3',
      homeTeam: 'Texas Longhorns',
      awayTeam: 'Oklahoma Sooners',
      status: 'upcoming' as const,
      time: '7:00 PM ET',
      homeOdds: -110,
      awayOdds: -110,
      overUnder: 55.5,
      conference: 'Big 12',
      week: 8,
      homeRank: 4,
      awayRank: 8
    }
  ]

  const handleBetClick = (gameId: string, betType: string, odds: number) => {
    const game = featuredGames.find(g => g.id === gameId)
    if (!game) return

    let team = ''
    if (betType === 'home') team = game.homeTeam
    else if (betType === 'away') team = game.awayTeam
    else team = `${game.awayTeam} vs ${game.homeTeam}`

    const newBet: Bet = {
      id: `${gameId}-${betType}-${Date.now()}`,
      gameId,
      type: betType,
      odds,
      team,
      amount: 25
    }

    setBets(prev => [...prev, newBet])
  }

  const handleRemoveBet = (betId: string) => {
    setBets(prev => prev.filter(bet => bet.id !== betId))
  }

  const handleUpdateAmount = (betId: string, amount: number) => {
    setBets(prev => prev.map(bet => 
      bet.id === betId ? { ...bet, amount } : bet
    ))
  }

  const handlePlaceBets = () => {
    // TODO: Implement bet placement
    console.log('Placing bets:', bets)
    setBets([])
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-8">
          {/* Hero Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-accent/20 to-accent/5 border-accent/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Today's Profit</p>
                    <p className="text-2xl font-bold text-accent">+$125.50</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-accent" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500/20 to-green-500/5 border-green-500/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Win Rate</p>
                    <p className="text-2xl font-bold text-green-400">68.5%</p>
                  </div>
                  <Target className="h-8 w-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500/20 to-blue-500/5 border-blue-500/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Bets</p>
                    <p className="text-2xl font-bold text-blue-400">12</p>
                  </div>
                  <Zap className="h-8 w-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500/20 to-purple-500/5 border-purple-500/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Rank</p>
                    <p className="text-2xl font-bold text-purple-400">#247</p>
                  </div>
                  <Trophy className="h-8 w-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Featured Games */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Featured Games</h2>
                <p className="text-muted-foreground">Top matchups and live games</p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-red-500/10 text-red-400 border-red-500/20 animate-pulse">
                  <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
                  2 Live
                </Badge>
                <Badge variant="outline">Week 8</Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredGames.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  onBetClick={handleBetClick}
                />
              ))}
            </div>
          </div>

          {/* Quick Insights */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">AI Insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-accent" />
                    <span>Hot Picks</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                    <div>
                      <div className="font-medium text-foreground">Alabama -3.5</div>
                      <div className="text-sm text-muted-foreground">vs Georgia • 89% confidence</div>
                    </div>
                    <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                      Strong
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                    <div>
                      <div className="font-medium text-foreground">Over 48.5</div>
                      <div className="text-sm text-muted-foreground">OSU vs Michigan • 76% confidence</div>
                    </div>
                    <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
                      Medium
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-accent" />
                    <span>Trending Now</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground">Texas ML</span>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-green-400" />
                      <span className="text-sm text-green-400">+15% volume</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground">Alabama -3.5</span>
                    <div className="flex items-center space-x-2">
                      <TrendingDown className="h-4 w-4 text-red-400" />
                      <span className="text-sm text-red-400">-8% volume</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground">Over 52.5 (ALA/GA)</span>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-green-400" />
                      <span className="text-sm text-green-400">+22% volume</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Betting Slip Sidebar */}
        <div className="lg:col-span-1">
          <BettingSlip
            bets={bets}
            onRemoveBet={handleRemoveBet}
            onUpdateAmount={handleUpdateAmount}
            onPlaceBets={handlePlaceBets}
          />
        </div>
      </div>
    </div>
  )
}