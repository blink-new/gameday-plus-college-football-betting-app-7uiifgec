import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Target,
  Trophy,
  Activity,
  Zap,
  Brain
} from 'lucide-react'

export function Analytics() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Football Intelligence</h1>
        <p className="text-muted-foreground">Advanced analytics and insights for college football</p>
      </div>

      <Tabs defaultValue="team-analytics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="team-analytics">Team Analytics</TabsTrigger>
          <TabsTrigger value="player-stats">Player Stats</TabsTrigger>
          <TabsTrigger value="predictions">AI Predictions</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="team-analytics" className="space-y-6">
          {/* Team Performance Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-accent/20 to-accent/5 border-accent/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Trophy className="h-5 w-5 text-accent" />
                  <span>Top Ranked Teams</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { rank: 1, team: 'Alabama', record: '7-0', points: 1547 },
                  { rank: 2, team: 'Ohio State', record: '6-1', points: 1489 },
                  { rank: 3, team: 'Georgia', record: '6-1', points: 1432 },
                  { rank: 4, team: 'Texas', record: '6-1', points: 1398 },
                  { rank: 5, team: 'Michigan', record: '6-1', points: 1356 }
                ].map((team) => (
                  <div key={team.rank} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Badge variant="secondary" className="w-8 h-8 rounded-full flex items-center justify-center p-0">
                        {team.rank}
                      </Badge>
                      <div>
                        <div className="font-medium text-foreground">{team.team}</div>
                        <div className="text-sm text-muted-foreground">{team.record}</div>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-accent">{team.points}</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500/20 to-green-500/5 border-green-500/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Activity className="h-5 w-5 text-green-400" />
                  <span>Offensive Leaders</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { team: 'LSU', stat: '542.3', label: 'Yards/Game' },
                  { team: 'Alabama', stat: '45.8', label: 'Points/Game' },
                  { team: 'Texas', stat: '312.1', label: 'Pass Yards/Game' },
                  { team: 'Georgia', stat: '198.7', label: 'Rush Yards/Game' },
                  { team: 'Ohio State', stat: '78.2%', label: 'Red Zone %' }
                ].map((leader, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-foreground">{leader.team}</div>
                      <div className="text-sm text-muted-foreground">{leader.label}</div>
                    </div>
                    <div className="text-lg font-bold text-green-400">{leader.stat}</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500/20 to-blue-500/5 border-blue-500/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Target className="h-5 w-5 text-blue-400" />
                  <span>Defensive Leaders</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { team: 'Georgia', stat: '12.4', label: 'Points Allowed/Game' },
                  { team: 'Alabama', stat: '267.8', label: 'Yards Allowed/Game' },
                  { team: 'Michigan', stat: '89.2', label: 'Rush Yards Allowed' },
                  { team: 'Ohio State', stat: '178.6', label: 'Pass Yards Allowed' },
                  { team: 'Texas', stat: '42.1%', label: '3rd Down Defense' }
                ].map((leader, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-foreground">{leader.team}</div>
                      <div className="text-sm text-muted-foreground">{leader.label}</div>
                    </div>
                    <div className="text-lg font-bold text-blue-400">{leader.stat}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Conference Standings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-accent" />
                <span>Conference Standings</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    conference: 'SEC',
                    teams: [
                      { name: 'Alabama', record: '5-0', overall: '7-0' },
                      { name: 'Georgia', record: '4-1', overall: '6-1' },
                      { name: 'LSU', record: '3-2', overall: '5-2' },
                      { name: 'Tennessee', record: '3-2', overall: '5-2' }
                    ]
                  },
                  {
                    conference: 'Big Ten',
                    teams: [
                      { name: 'Ohio State', record: '4-0', overall: '6-1' },
                      { name: 'Michigan', record: '4-1', overall: '6-1' },
                      { name: 'Penn State', record: '3-1', overall: '5-2' },
                      { name: 'Iowa', record: '2-2', overall: '4-3' }
                    ]
                  },
                  {
                    conference: 'Big 12',
                    teams: [
                      { name: 'Texas', record: '4-0', overall: '6-1' },
                      { name: 'Oklahoma', record: '3-1', overall: '5-2' },
                      { name: 'Kansas State', record: '2-2', overall: '4-3' },
                      { name: 'TCU', record: '2-2', overall: '4-3' }
                    ]
                  }
                ].map((conf) => (
                  <div key={conf.conference} className="space-y-3">
                    <h3 className="font-bold text-foreground text-lg">{conf.conference}</h3>
                    <div className="space-y-2">
                      {conf.teams.map((team, index) => (
                        <div key={team.name} className="flex items-center justify-between p-2 bg-secondary/30 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="w-6 h-6 rounded-full flex items-center justify-center p-0 text-xs">
                              {index + 1}
                            </Badge>
                            <span className="font-medium text-foreground">{team.name}</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-foreground">{team.record}</span>
                            <span className="text-muted-foreground ml-1">({team.overall})</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="player-stats" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-accent" />
                  <span>Top Quarterbacks</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: 'Caleb Williams', team: 'USC', yards: 2847, tds: 28, rating: 168.5 },
                  { name: 'Jayden Daniels', team: 'LSU', yards: 2674, tds: 25, rating: 165.2 },
                  { name: 'Bo Nix', team: 'Oregon', yards: 2598, tds: 24, rating: 162.8 },
                  { name: 'Michael Penix Jr.', team: 'Washington', yards: 2512, tds: 22, rating: 159.4 }
                ].map((qb) => (
                  <div key={qb.name} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                    <div>
                      <div className="font-medium text-foreground">{qb.name}</div>
                      <div className="text-sm text-muted-foreground">{qb.team}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-foreground">{qb.yards} yds, {qb.tds} TDs</div>
                      <div className="text-sm text-accent">{qb.rating} rating</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-accent" />
                  <span>Top Running Backs</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: 'Blake Corum', team: 'Michigan', yards: 1247, tds: 18, avg: 6.2 },
                  { name: 'Bijan Robinson', team: 'Texas', yards: 1189, tds: 16, avg: 5.8 },
                  { name: 'Sean Tucker', team: 'Syracuse', yards: 1156, tds: 14, avg: 5.9 },
                  { name: 'TreVeyon Henderson', team: 'Ohio State', yards: 1098, tds: 13, avg: 6.1 }
                ].map((rb) => (
                  <div key={rb.name} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                    <div>
                      <div className="font-medium text-foreground">{rb.name}</div>
                      <div className="text-sm text-muted-foreground">{rb.team}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-foreground">{rb.yards} yds, {rb.tds} TDs</div>
                      <div className="text-sm text-accent">{rb.avg} avg</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-accent" />
                <span>AI Game Predictions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  game: 'Alabama vs Georgia',
                  prediction: 'Alabama -3.5',
                  confidence: 89,
                  reasoning: 'Alabama\'s superior offensive line and home field advantage'
                },
                {
                  game: 'Ohio State vs Michigan',
                  prediction: 'Over 48.5',
                  confidence: 76,
                  reasoning: 'Both teams averaging 35+ points, weak pass defenses'
                },
                {
                  game: 'Texas vs Oklahoma',
                  prediction: 'Texas ML',
                  confidence: 68,
                  reasoning: 'Texas QB advantage and better recent form'
                }
              ].map((pred, index) => (
                <div key={index} className="p-4 bg-secondary/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-foreground">{pred.game}</h3>
                    <Badge 
                      className={`${
                        pred.confidence >= 80 
                          ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                          : pred.confidence >= 70
                          ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                          : 'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}
                    >
                      {pred.confidence}% confidence
                    </Badge>
                  </div>
                  <div className="text-lg font-bold text-accent mb-2">{pred.prediction}</div>
                  <div className="text-sm text-muted-foreground">{pred.reasoning}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-accent" />
                  <span>Hot Trends</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { trend: 'Unders hitting 67% in SEC games', impact: 'High' },
                  { trend: 'Home dogs covering 58% this season', impact: 'Medium' },
                  { trend: 'Top 10 teams 12-3 ATS as favorites', impact: 'High' },
                  { trend: 'Night games averaging 3.2 more points', impact: 'Medium' }
                ].map((trend, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-foreground">{trend.trend}</div>
                    </div>
                    <Badge 
                      variant={trend.impact === 'High' ? 'default' : 'secondary'}
                      className={trend.impact === 'High' ? 'bg-accent/10 text-accent border-accent/20' : ''}
                    >
                      {trend.impact}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-accent" />
                  <span>Public Betting</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { game: 'Alabama vs Georgia', side: 'Alabama -3.5', public: 78 },
                  { game: 'Ohio State vs Michigan', side: 'Over 48.5', public: 65 },
                  { game: 'Texas vs Oklahoma', side: 'Texas ML', public: 72 },
                  { game: 'Clemson vs FSU', side: 'Under 52', public: 59 }
                ].map((bet, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                    <div>
                      <div className="font-medium text-foreground">{bet.side}</div>
                      <div className="text-sm text-muted-foreground">{bet.game}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-accent">{bet.public}%</div>
                      <div className="text-xs text-muted-foreground">public</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}