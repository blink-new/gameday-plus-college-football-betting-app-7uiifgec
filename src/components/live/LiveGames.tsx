import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, MapPin, TrendingUp, TrendingDown } from 'lucide-react'
import { blink } from '@/blink/client'

interface LiveGame {
  id: string
  home_team: string
  away_team: string
  home_score: number
  away_score: number
  quarter: number
  time_remaining: string
  status: string
  spread: number
  over_under: number
  home_ml: number
  away_ml: number
  venue: string
  conference: string
}

interface GameConditions {
  temperature: number
  weather_condition: string
  wind_speed: number
  precipitation_chance: number
  field_condition: string
}

export default function LiveGames() {
  const [liveGames, setLiveGames] = useState<LiveGame[]>([])
  const [gameConditions, setGameConditions] = useState<Record<string, GameConditions>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLiveGames = async () => {
      try {
        const games = await blink.db.live_games.list({
          orderBy: { game_date: 'asc' }
        })
        setLiveGames(games)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching live games:', error)
        setLoading(false)
      }
    }

    const fetchGameConditions = async () => {
      try {
        const conditions = await blink.db.game_conditions.list()
        const conditionsMap = conditions.reduce((acc, condition) => {
          acc[condition.game_id] = condition
          return acc
        }, {} as Record<string, GameConditions>)
        setGameConditions(conditionsMap)
      } catch (error) {
        console.error('Error fetching game conditions:', error)
      }
    }

    fetchLiveGames()
    fetchGameConditions()
    
    // Simulate real-time updates every 30 seconds
    const interval = setInterval(() => {
      fetchLiveGames()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      live: { variant: 'destructive' as const, text: 'LIVE' },
      halftime: { variant: 'secondary' as const, text: 'HALFTIME' },
      final: { variant: 'outline' as const, text: 'FINAL' },
      scheduled: { variant: 'default' as const, text: 'UPCOMING' }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.scheduled
    return <Badge variant={config.variant}>{config.text}</Badge>
  }

  const getWeatherIcon = (condition: string) => {
    const icons = {
      sunny: '☀️',
      cloudy: '☁️',
      rain: '🌧️',
      snow: '❄️',
      wind: '💨'
    }
    return icons[condition as keyof typeof icons] || '☁️'
  }

  const placeBet = async (gameId: string, betType: string, team: string, odds: number) => {
    try {
      const user = await blink.auth.me()
      const amount = 25 // Default bet amount
      const potentialPayout = amount * (Math.abs(odds) / 100)
      
      await blink.db.bet_history.create({
        id: `bet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        user_id: user.id,
        game_id: gameId,
        bet_type: betType,
        team: team,
        amount: amount,
        odds: odds,
        potential_payout: potentialPayout,
        status: 'pending'
      })
      
      alert(`Bet placed: $${amount} on ${team} ${betType}`)
    } catch (error) {
      console.error('Error placing bet:', error)
      alert('Please sign in to place bets')
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Live Games</h2>
        <Badge variant="destructive" className="animate-pulse">
          🔴 LIVE UPDATES
        </Badge>
      </div>

      <div className="grid gap-4">
        {liveGames.map((game) => {
          const conditions = gameConditions[game.id]
          const isLive = game.status === 'live'
          
          return (
            <Card key={game.id} className={`transition-all ${isLive ? 'ring-2 ring-red-500 shadow-lg' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusBadge(game.status)}
                    <Badge variant="outline">{game.conference}</Badge>
                    {conditions && (
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <span>{getWeatherIcon(conditions.weather_condition)}</span>
                        <span>{conditions.temperature}°F</span>
                        {conditions.wind_speed > 10 && (
                          <span className="text-orange-600">💨 {conditions.wind_speed}mph</span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{game.venue}</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Score Display */}
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-lg">{game.away_team}</span>
                      <span className="text-2xl font-bold">{game.away_score}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-lg">{game.home_team}</span>
                      <span className="text-2xl font-bold">{game.home_score}</span>
                    </div>
                  </div>
                  
                  {isLive && (
                    <div className="text-center ml-6">
                      <div className="text-sm text-gray-600">Q{game.quarter}</div>
                      <div className="flex items-center gap-1 text-sm font-medium">
                        <Clock className="w-4 h-4" />
                        {game.time_remaining}
                      </div>
                    </div>
                  )}
                </div>

                {/* Betting Lines */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <div className="text-xs text-gray-600 mb-1">SPREAD</div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => placeBet(game.id, 'spread', game.home_team, -110)}
                      className="w-full"
                    >
                      {game.spread > 0 ? '+' : ''}{game.spread}
                      <br />
                      <span className="text-xs">-110</span>
                    </Button>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-xs text-gray-600 mb-1">TOTAL</div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => placeBet(game.id, 'over_under', 'over', -110)}
                      className="w-full"
                    >
                      O {game.over_under}
                      <br />
                      <span className="text-xs">-110</span>
                    </Button>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-xs text-gray-600 mb-1">MONEYLINE</div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => placeBet(game.id, 'moneyline', game.home_team, game.home_ml)}
                      className="w-full"
                    >
                      {game.home_ml > 0 ? '+' : ''}{game.home_ml}
                    </Button>
                  </div>
                </div>

                {/* Weather Impact Alert */}
                {conditions && (conditions.wind_speed > 15 || conditions.precipitation_chance > 70) && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-orange-800">
                      <TrendingDown className="w-4 h-4" />
                      <span className="font-medium">Weather Impact Alert</span>
                    </div>
                    <div className="text-sm text-orange-700 mt-1">
                      {conditions.wind_speed > 15 && `High winds (${conditions.wind_speed}mph) may affect passing game. `}
                      {conditions.precipitation_chance > 70 && `${conditions.precipitation_chance}% chance of precipitation. `}
                      Field conditions: {conditions.field_condition}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}