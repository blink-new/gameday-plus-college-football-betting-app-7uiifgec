import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { TrendingUp, TrendingDown, DollarSign, Target, Calendar } from 'lucide-react'
import { blink } from '@/blink/client'

interface BetHistoryItem {
  id: string
  game_id: string
  bet_type: string
  team: string
  amount: number
  odds: number
  potential_payout: number
  status: string
  placed_at: string
  settled_at?: string
}

interface PortfolioStats {
  totalBets: number
  totalWagered: number
  totalWon: number
  totalLost: number
  winRate: number
  roi: number
  activeBets: number
}

export default function BetHistory() {
  const [betHistory, setBetHistory] = useState<BetHistoryItem[]>([])
  const [portfolioStats, setPortfolioStats] = useState<PortfolioStats>({
    totalBets: 0,
    totalWagered: 0,
    totalWon: 0,
    totalLost: 0,
    winRate: 0,
    roi: 0,
    activeBets: 0
  })
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const calculatePortfolioStats = (bets: BetHistoryItem[]) => {
      const totalBets = bets.length
      const totalWagered = bets.reduce((sum, bet) => sum + bet.amount, 0)
      const wonBets = bets.filter(bet => bet.status === 'won')
      const lostBets = bets.filter(bet => bet.status === 'lost')
      const activeBets = bets.filter(bet => bet.status === 'pending').length
      
      const totalWon = wonBets.reduce((sum, bet) => sum + bet.potential_payout, 0)
      const totalLost = lostBets.reduce((sum, bet) => sum + bet.amount, 0)
      const winRate = totalBets > 0 ? (wonBets.length / (wonBets.length + lostBets.length)) * 100 : 0
      const roi = totalWagered > 0 ? ((totalWon - totalLost) / totalWagered) * 100 : 0

      setPortfolioStats({
        totalBets,
        totalWagered,
        totalWon,
        totalLost,
        winRate,
        roi,
        activeBets
      })
    }

    const fetchBetHistory = async (userId: string) => {
      try {
        const bets = await blink.db.bet_history.list({
          where: { user_id: userId },
          orderBy: { placed_at: 'desc' }
        })
        setBetHistory(bets)
        calculatePortfolioStats(bets)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching bet history:', error)
        setLoading(false)
      }
    }

    const initAuth = async () => {
      try {
        const userData = await blink.auth.me()
        setUser(userData)
        fetchBetHistory(userData.id)
      } catch (error) {
        console.error('User not authenticated:', error)
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: 'secondary' as const, text: 'PENDING', icon: '⏳' },
      won: { variant: 'default' as const, text: 'WON', icon: '✅' },
      lost: { variant: 'destructive' as const, text: 'LOST', icon: '❌' },
      pushed: { variant: 'outline' as const, text: 'PUSH', icon: '↔️' }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <span>{config.icon}</span>
        {config.text}
      </Badge>
    )
  }

  const formatBetType = (betType: string, team: string) => {
    const typeMap = {
      spread: `${team} Spread`,
      moneyline: `${team} ML`,
      over_under: betType.includes('over') ? 'Over' : 'Under'
    }
    return typeMap[betType as keyof typeof typeMap] || betType
  }

  const formatOdds = (odds: number) => {
    return odds > 0 ? `+${odds}` : `${odds}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <DollarSign className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Sign In Required</h3>
            <p className="text-gray-600 mb-4">Please sign in to view your betting history and portfolio.</p>
            <Button onClick={() => blink.auth.login()}>Sign In</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="animate-pulse">
          <CardContent className="p-6">
            <div className="h-64 bg-gray-200 rounded"></div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Betting Portfolio</h2>
        <Badge variant="outline" className="flex items-center gap-1">
          <Target className="w-4 h-4" />
          {portfolioStats.activeBets} Active Bets
        </Badge>
      </div>

      {/* Portfolio Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Wagered</p>
                <p className="text-2xl font-bold">${portfolioStats.totalWagered.toFixed(2)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Win Rate</p>
                <p className="text-2xl font-bold">{portfolioStats.winRate.toFixed(1)}%</p>
              </div>
              <Target className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">ROI</p>
                <p className={`text-2xl font-bold ${portfolioStats.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {portfolioStats.roi >= 0 ? '+' : ''}{portfolioStats.roi.toFixed(1)}%
                </p>
              </div>
              {portfolioStats.roi >= 0 ? (
                <TrendingUp className="w-8 h-8 text-green-500" />
              ) : (
                <TrendingDown className="w-8 h-8 text-red-500" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Net Profit</p>
                <p className={`text-2xl font-bold ${(portfolioStats.totalWon - portfolioStats.totalLost) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${(portfolioStats.totalWon - portfolioStats.totalLost).toFixed(2)}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bet History Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Betting History</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Bets ({portfolioStats.totalBets})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({portfolioStats.activeBets})</TabsTrigger>
              <TabsTrigger value="won">Won ({betHistory.filter(b => b.status === 'won').length})</TabsTrigger>
              <TabsTrigger value="lost">Lost ({betHistory.filter(b => b.status === 'lost').length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <BetTable bets={betHistory} />
            </TabsContent>

            <TabsContent value="pending" className="mt-6">
              <BetTable bets={betHistory.filter(bet => bet.status === 'pending')} />
            </TabsContent>

            <TabsContent value="won" className="mt-6">
              <BetTable bets={betHistory.filter(bet => bet.status === 'won')} />
            </TabsContent>

            <TabsContent value="lost" className="mt-6">
              <BetTable bets={betHistory.filter(bet => bet.status === 'lost')} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )

  function BetTable({ bets }: { bets: BetHistoryItem[] }) {
    if (bets.length === 0) {
      return (
        <div className="text-center py-8">
          <Target className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">No bets found in this category.</p>
        </div>
      )
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Bet</TableHead>
            <TableHead>Odds</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Potential Payout</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bets.map((bet) => (
            <TableRow key={bet.id}>
              <TableCell className="font-medium">
                {formatDate(bet.placed_at)}
              </TableCell>
              <TableCell>
                {formatBetType(bet.bet_type, bet.team)}
              </TableCell>
              <TableCell>
                <Badge variant="outline">{formatOdds(bet.odds)}</Badge>
              </TableCell>
              <TableCell>${bet.amount.toFixed(2)}</TableCell>
              <TableCell className="font-semibold">
                ${bet.potential_payout.toFixed(2)}
              </TableCell>
              <TableCell>
                {getStatusBadge(bet.status)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }
}