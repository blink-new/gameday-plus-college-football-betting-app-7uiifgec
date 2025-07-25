import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, TrendingUp, TrendingDown } from 'lucide-react'

interface GameCardProps {
  game: {
    id: string
    homeTeam: string
    awayTeam: string
    homeScore?: number
    awayScore?: number
    status: 'upcoming' | 'live' | 'final'
    time: string
    homeOdds: number
    awayOdds: number
    overUnder: number
    conference: string
    week: number
    homeRank?: number
    awayRank?: number
  }
  onBetClick: (gameId: string, betType: string, odds: number) => void
}

export function GameCard({ game, onBetClick }: GameCardProps) {
  const isLive = game.status === 'live'
  const isFinal = game.status === 'final'

  return (
    <Card className="bg-card border-border hover:border-accent/50 transition-all duration-200">
      <CardContent className="p-6">
        {/* Game Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Badge 
              variant={isLive ? "destructive" : "secondary"}
              className={isLive ? "bg-red-500/10 text-red-400 border-red-500/20 animate-pulse" : ""}
            >
              {isLive ? 'LIVE' : isFinal ? 'FINAL' : game.time}
            </Badge>
            <Badge variant="outline" className="text-xs">
              Week {game.week} • {game.conference}
            </Badge>
          </div>
          {isLive && (
            <div className="flex items-center space-x-1 text-accent">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">Q2 8:45</span>
            </div>
          )}
        </div>

        {/* Teams */}
        <div className="space-y-3 mb-6">
          {/* Away Team */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-accent">
                  {game.awayTeam.split(' ').pop()?.slice(0, 2).toUpperCase()}
                </span>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  {game.awayRank && (
                    <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                      #{game.awayRank}
                    </Badge>
                  )}
                  <span className="font-medium text-foreground">{game.awayTeam}</span>
                </div>
              </div>
            </div>
            {(isLive || isFinal) && (
              <span className="text-2xl font-bold text-foreground">{game.awayScore}</span>
            )}
          </div>

          {/* Home Team */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-primary-foreground">
                  {game.homeTeam.split(' ').pop()?.slice(0, 2).toUpperCase()}
                </span>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  {game.homeRank && (
                    <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                      #{game.homeRank}
                    </Badge>
                  )}
                  <span className="font-medium text-foreground">{game.homeTeam}</span>
                </div>
              </div>
            </div>
            {(isLive || isFinal) && (
              <span className="text-2xl font-bold text-foreground">{game.homeScore}</span>
            )}
          </div>
        </div>

        {/* Betting Options */}
        {!isFinal && (
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBetClick(game.id, 'away', game.awayOdds)}
              className="flex flex-col items-center p-3 h-auto hover:bg-accent/10 hover:border-accent/50"
            >
              <span className="text-xs text-muted-foreground mb-1">Away</span>
              <span className="font-bold text-foreground flex items-center">
                {game.awayOdds > 0 ? '+' : ''}{game.awayOdds}
                {game.awayOdds < game.homeOdds ? (
                  <TrendingUp className="h-3 w-3 ml-1 text-green-400" />
                ) : (
                  <TrendingDown className="h-3 w-3 ml-1 text-red-400" />
                )}
              </span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onBetClick(game.id, 'home', game.homeOdds)}
              className="flex flex-col items-center p-3 h-auto hover:bg-accent/10 hover:border-accent/50"
            >
              <span className="text-xs text-muted-foreground mb-1">Home</span>
              <span className="font-bold text-foreground flex items-center">
                {game.homeOdds > 0 ? '+' : ''}{game.homeOdds}
                {game.homeOdds < game.awayOdds ? (
                  <TrendingUp className="h-3 w-3 ml-1 text-green-400" />
                ) : (
                  <TrendingDown className="h-3 w-3 ml-1 text-red-400" />
                )}
              </span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onBetClick(game.id, 'over-under', game.overUnder)}
              className="flex flex-col items-center p-3 h-auto hover:bg-accent/10 hover:border-accent/50"
            >
              <span className="text-xs text-muted-foreground mb-1">O/U</span>
              <span className="font-bold text-foreground">{game.overUnder}</span>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}