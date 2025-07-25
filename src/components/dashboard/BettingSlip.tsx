import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { X, DollarSign, TrendingUp } from 'lucide-react'

interface Bet {
  id: string
  gameId: string
  type: string
  odds: number
  team: string
  amount: number
}

interface BettingSlipProps {
  bets: Bet[]
  onRemoveBet: (betId: string) => void
  onUpdateAmount: (betId: string, amount: number) => void
  onPlaceBets: () => void
}

export function BettingSlip({ bets, onRemoveBet, onUpdateAmount, onPlaceBets }: BettingSlipProps) {
  const [defaultAmount, setDefaultAmount] = useState(25)

  const totalAmount = bets.reduce((sum, bet) => sum + bet.amount, 0)
  const totalPayout = bets.reduce((sum, bet) => {
    const odds = bet.odds
    const payout = odds > 0 ? (bet.amount * odds) / 100 : (bet.amount * 100) / Math.abs(odds)
    return sum + bet.amount + payout
  }, 0)

  const potentialProfit = totalPayout - totalAmount

  return (
    <Card className="bg-card border-border sticky top-20">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5 text-accent" />
            <span>Betting Slip</span>
          </span>
          <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
            {bets.length} {bets.length === 1 ? 'Bet' : 'Bets'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {bets.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-muted-foreground mb-2">No bets selected</div>
            <div className="text-sm text-muted-foreground">
              Click on odds to add bets to your slip
            </div>
          </div>
        ) : (
          <>
            {/* Individual Bets */}
            <div className="space-y-3">
              {bets.map((bet) => (
                <div key={bet.id} className="bg-secondary/50 rounded-lg p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="font-medium text-foreground text-sm">{bet.team}</div>
                      <div className="text-xs text-muted-foreground capitalize">
                        {bet.type.replace('-', ' ')} • {bet.odds > 0 ? '+' : ''}{bet.odds}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveBet(bet.id)}
                      className="h-6 w-6 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-muted-foreground">$</span>
                    <Input
                      type="number"
                      value={bet.amount}
                      onChange={(e) => onUpdateAmount(bet.id, Number(e.target.value) || 0)}
                      className="h-8 text-sm"
                      min="1"
                      max="10000"
                    />
                  </div>
                  <div className="flex justify-between items-center mt-2 text-xs">
                    <span className="text-muted-foreground">To win:</span>
                    <span className="font-medium text-green-400">
                      ${((bet.odds > 0 ? (bet.amount * bet.odds) / 100 : (bet.amount * 100) / Math.abs(bet.odds))).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            {/* Quick Amount Buttons */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-foreground">Quick Amounts</div>
              <div className="grid grid-cols-4 gap-2">
                {[10, 25, 50, 100].map((amount) => (
                  <Button
                    key={amount}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      bets.forEach(bet => onUpdateAmount(bet.id, amount))
                    }}
                    className="text-xs"
                  >
                    ${amount}
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Totals */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Wager</span>
                <span className="font-medium text-foreground">${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Potential Payout</span>
                <span className="font-medium text-foreground">${totalPayout.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-foreground">Potential Profit</span>
                <span className="font-bold text-green-400 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  ${potentialProfit.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Place Bet Button */}
            <Button 
              onClick={onPlaceBets}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-medium"
              disabled={totalAmount === 0}
            >
              Place {bets.length === 1 ? 'Bet' : 'Bets'} • ${totalAmount.toFixed(2)}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}