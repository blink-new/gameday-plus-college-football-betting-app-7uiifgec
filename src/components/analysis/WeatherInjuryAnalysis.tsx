import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  Snowflake, 
  Wind, 
  Thermometer,
  AlertTriangle,
  Activity,
  TrendingDown,
  TrendingUp,
  Users
} from 'lucide-react'
import { blink } from '@/blink/client'

interface GameConditions {
  id: string
  game_id: string
  temperature: number
  weather_condition: string
  wind_speed: number
  precipitation_chance: number
  field_condition: string
}

interface InjuryReport {
  id: string
  team_name: string
  player_name: string
  position: string
  injury_type: string
  status: string
  impact_rating: number
}

interface LiveGame {
  id: string
  home_team: string
  away_team: string
  venue: string
  status: string
}

export default function WeatherInjuryAnalysis() {
  const [gameConditions, setGameConditions] = useState<GameConditions[]>([])
  const [injuryReports, setInjuryReports] = useState<InjuryReport[]>([])
  const [liveGames, setLiveGames] = useState<LiveGame[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [conditions, injuries, games] = await Promise.all([
          blink.db.game_conditions.list(),
          blink.db.injury_reports.list({ orderBy: { impact_rating: 'desc' } }),
          blink.db.live_games.list({ orderBy: { game_date: 'asc' } })
        ])
        
        setGameConditions(conditions)
        setInjuryReports(injuries)
        setLiveGames(games)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching analysis data:', error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getWeatherIcon = (condition: string) => {
    const icons = {
      sunny: <Sun className="w-5 h-5 text-yellow-500" />,
      cloudy: <Cloud className="w-5 h-5 text-gray-500" />,
      rain: <CloudRain className="w-5 h-5 text-blue-500" />,
      snow: <Snowflake className="w-5 h-5 text-blue-300" />,
      wind: <Wind className="w-5 h-5 text-gray-600" />
    }
    return icons[condition as keyof typeof icons] || icons.cloudy
  }

  const getWeatherImpact = (conditions: GameConditions) => {
    let impact = 0
    const factors = []

    // Temperature impact
    if (conditions.temperature < 32) {
      impact += 3
      factors.push('Freezing temperatures affect ball handling')
    } else if (conditions.temperature > 85) {
      impact += 2
      factors.push('High heat increases fatigue')
    }

    // Wind impact
    if (conditions.wind_speed > 20) {
      impact += 4
      factors.push('Strong winds significantly affect passing game')
    } else if (conditions.wind_speed > 10) {
      impact += 2
      factors.push('Moderate winds may affect kicking game')
    }

    // Precipitation impact
    if (conditions.precipitation_chance > 70) {
      impact += 3
      factors.push('High chance of rain affects ball security')
    }

    // Field condition impact
    if (conditions.field_condition === 'muddy') {
      impact += 3
      factors.push('Muddy field reduces traction and speed')
    } else if (conditions.field_condition === 'wet') {
      impact += 2
      factors.push('Wet field increases fumble risk')
    }

    return { impact: Math.min(impact, 10), factors }
  }

  const getImpactColor = (impact: number) => {
    if (impact >= 7) return 'text-red-600'
    if (impact >= 4) return 'text-orange-600'
    if (impact >= 2) return 'text-yellow-600'
    return 'text-green-600'
  }

  const getImpactBadge = (impact: number) => {
    if (impact >= 7) return <Badge variant="destructive">High Impact</Badge>
    if (impact >= 4) return <Badge variant="secondary">Moderate Impact</Badge>
    if (impact >= 2) return <Badge variant="outline">Low Impact</Badge>
    return <Badge variant="default">Minimal Impact</Badge>
  }

  const getStatusIcon = (status: string) => {
    const icons = {
      out: <TrendingDown className="w-4 h-4 text-red-500" />,
      questionable: <AlertTriangle className="w-4 h-4 text-yellow-500" />,
      probable: <TrendingUp className="w-4 h-4 text-green-500" />,
      healthy: <Activity className="w-4 h-4 text-green-600" />
    }
    return icons[status as keyof typeof icons] || icons.questionable
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      out: { variant: 'destructive' as const, text: 'OUT' },
      questionable: { variant: 'secondary' as const, text: 'QUESTIONABLE' },
      probable: { variant: 'outline' as const, text: 'PROBABLE' },
      healthy: { variant: 'default' as const, text: 'HEALTHY' }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.questionable
    return <Badge variant={config.variant}>{config.text}</Badge>
  }

  const getImpactRating = (rating: number) => {
    return (
      <div className="flex items-center gap-2">
        <Progress value={rating * 20} className="w-16 h-2" />
        <span className="text-sm font-medium">{rating}/5</span>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-32 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Weather & Injury Impact Analysis</h2>
        <Badge variant="outline" className="flex items-center gap-1">
          <Activity className="w-4 h-4" />
          Real-time Conditions
        </Badge>
      </div>

      <Tabs defaultValue="weather" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="weather">Weather Impact</TabsTrigger>
          <TabsTrigger value="injuries">Injury Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="weather" className="space-y-4">
          <div className="grid gap-4">
            {gameConditions.map((conditions) => {
              const game = liveGames.find(g => g.id === conditions.game_id)
              const weatherImpact = getWeatherImpact(conditions)
              
              if (!game) return null

              return (
                <Card key={conditions.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        {getWeatherIcon(conditions.weather_condition)}
                        {game.home_team} vs {game.away_team}
                      </CardTitle>
                      {getImpactBadge(weatherImpact.impact)}
                    </div>
                    <div className="text-sm text-gray-600">{game.venue}</div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Weather Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2">
                        <Thermometer className="w-4 h-4 text-red-500" />
                        <div>
                          <div className="font-semibold">{conditions.temperature}°F</div>
                          <div className="text-xs text-gray-600">Temperature</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Wind className="w-4 h-4 text-gray-600" />
                        <div>
                          <div className="font-semibold">{conditions.wind_speed} mph</div>
                          <div className="text-xs text-gray-600">Wind Speed</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <CloudRain className="w-4 h-4 text-blue-500" />
                        <div>
                          <div className="font-semibold">{conditions.precipitation_chance}%</div>
                          <div className="text-xs text-gray-600">Rain Chance</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-green-600" />
                        <div>
                          <div className="font-semibold capitalize">{conditions.field_condition}</div>
                          <div className="text-xs text-gray-600">Field</div>
                        </div>
                      </div>
                    </div>

                    {/* Impact Analysis */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Weather Impact Score:</span>
                        <span className={`font-bold text-lg ${getImpactColor(weatherImpact.impact)}`}>
                          {weatherImpact.impact}/10
                        </span>
                      </div>
                      <Progress value={weatherImpact.impact * 10} className="h-2" />
                    </div>

                    {/* Impact Factors */}
                    {weatherImpact.factors.length > 0 && (
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <div className="space-y-1">
                            {weatherImpact.factors.map((factor, index) => (
                              <div key={index} className="text-sm">• {factor}</div>
                            ))}
                          </div>
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Betting Recommendations */}
                    {weatherImpact.impact >= 4 && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-blue-800 font-medium mb-2">
                          <TrendingDown className="w-4 h-4" />
                          Betting Considerations
                        </div>
                        <div className="text-sm text-blue-700 space-y-1">
                          {conditions.wind_speed > 15 && <div>• Consider Under bets due to wind affecting passing</div>}
                          {conditions.precipitation_chance > 70 && <div>• Favor rushing attacks and Under totals</div>}
                          {conditions.temperature < 32 && <div>• Cold weather typically favors defense and Under bets</div>}
                          {conditions.field_condition === 'muddy' && <div>• Muddy conditions favor ground game and lower scoring</div>}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="injuries" className="space-y-4">
          <div className="grid gap-4">
            {/* High Impact Injuries Alert */}
            {injuryReports.filter(injury => injury.impact_rating >= 4).length > 0 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>High Impact Injuries:</strong> {injuryReports.filter(injury => injury.impact_rating >= 4).length} key players have significant injury concerns that may affect game outcomes.
                </AlertDescription>
              </Alert>
            )}

            {/* Injury Reports by Team */}
            {Array.from(new Set(injuryReports.map(injury => injury.team_name))).map(teamName => {
              const teamInjuries = injuryReports.filter(injury => injury.team_name === teamName)
              const highImpactCount = teamInjuries.filter(injury => injury.impact_rating >= 4).length
              
              return (
                <Card key={teamName}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-600" />
                        {teamName}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{teamInjuries.length} Reports</Badge>
                        {highImpactCount > 0 && (
                          <Badge variant="destructive">{highImpactCount} High Impact</Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {teamInjuries.map((injury) => (
                        <div key={injury.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(injury.status)}
                            <div>
                              <div className="font-semibold">{injury.player_name}</div>
                              <div className="text-sm text-gray-600">
                                {injury.position} • {injury.injury_type}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <div className="text-sm text-gray-600 mb-1">Impact</div>
                              {getImpactRating(injury.impact_rating)}
                            </div>
                            {getStatusBadge(injury.status)}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Team Impact Summary */}
                    {highImpactCount > 0 && (
                      <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-red-800 font-medium mb-2">
                          <AlertTriangle className="w-4 h-4" />
                          Team Impact Analysis
                        </div>
                        <div className="text-sm text-red-700">
                          {teamName} has {highImpactCount} high-impact injury concern{highImpactCount > 1 ? 's' : ''} that could significantly affect their performance. Consider this when evaluating betting lines and game predictions.
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Overall Impact Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-600" />
            Overall Impact Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {gameConditions.filter(c => getWeatherImpact(c).impact >= 4).length}
              </div>
              <div className="text-sm text-blue-700">Games with Weather Impact</div>
            </div>
            
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {injuryReports.filter(i => i.impact_rating >= 4).length}
              </div>
              <div className="text-sm text-red-700">High Impact Injuries</div>
            </div>
            
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {injuryReports.filter(i => i.status === 'questionable').length}
              </div>
              <div className="text-sm text-yellow-700">Questionable Players</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}