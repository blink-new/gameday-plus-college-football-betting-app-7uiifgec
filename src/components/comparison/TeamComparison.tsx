import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { TrendingUp, TrendingDown, Shield, Target, Users, Trophy, Zap } from 'lucide-react'
import { blink } from '@/blink/client'

interface TeamStats {
  id: string
  team_name: string
  conference: string
  wins: number
  losses: number
  points_per_game: number
  points_allowed_per_game: number
  rushing_yards_per_game: number
  passing_yards_per_game: number
  turnovers_per_game: number
  third_down_percentage: number
  red_zone_percentage: number
  strength_of_schedule: number
}

export default function TeamComparison() {
  const [teams, setTeams] = useState<TeamStats[]>([])
  const [selectedTeam1, setSelectedTeam1] = useState<TeamStats | null>(null)
  const [selectedTeam2, setSelectedTeam2] = useState<TeamStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTeamStats = async () => {
      try {
        const teamStats = await blink.db.team_stats.list({
          orderBy: { wins: 'desc' }
        })
        setTeams(teamStats)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching team stats:', error)
        setLoading(false)
      }
    }

    fetchTeamStats()
  }, [])

  const getWinPercentage = (wins: number, losses: number) => {
    const total = wins + losses
    return total > 0 ? (wins / total) * 100 : 0
  }

  const getAdvantageIcon = (team1Value: number, team2Value: number, higherIsBetter = true) => {
    const team1Better = higherIsBetter ? team1Value > team2Value : team1Value < team2Value
    if (Math.abs(team1Value - team2Value) < 0.1) return '='
    return team1Better ? '↑' : '↓'
  }

  const getAdvantageColor = (team1Value: number, team2Value: number, higherIsBetter = true) => {
    const team1Better = higherIsBetter ? team1Value > team2Value : team1Value < team2Value
    if (Math.abs(team1Value - team2Value) < 0.1) return 'text-gray-500'
    return team1Better ? 'text-green-600' : 'text-red-600'
  }

  const StatComparison = ({ 
    label, 
    team1Value, 
    team2Value, 
    unit = '', 
    higherIsBetter = true,
    icon 
  }: {
    label: string
    team1Value: number
    team2Value: number
    unit?: string
    higherIsBetter?: boolean
    icon: React.ReactNode
  }) => {
    const maxValue = Math.max(team1Value, team2Value)
    const team1Percentage = maxValue > 0 ? (team1Value / maxValue) * 100 : 0
    const team2Percentage = maxValue > 0 ? (team2Value / maxValue) * 100 : 0

    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-medium">{label}</span>
        </div>
        
        <div className="grid grid-cols-3 gap-4 items-center">
          <div className="text-right">
            <div className={`font-bold text-lg ${getAdvantageColor(team1Value, team2Value, higherIsBetter)}`}>
              {team1Value.toFixed(1)}{unit}
            </div>
            <Progress value={team1Percentage} className="h-2 mt-1" />
          </div>
          
          <div className="text-center">
            <span className={`text-2xl font-bold ${getAdvantageColor(team1Value, team2Value, higherIsBetter)}`}>
              {getAdvantageIcon(team1Value, team2Value, higherIsBetter)}
            </span>
          </div>
          
          <div className="text-left">
            <div className={`font-bold text-lg ${getAdvantageColor(team2Value, team1Value, higherIsBetter)}`}>
              {team2Value.toFixed(1)}{unit}
            </div>
            <Progress value={team2Percentage} className="h-2 mt-1" />
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardContent className="p-6">
          <div className="h-96 bg-gray-200 rounded"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Team Comparison Tool</h2>
        <Badge variant="outline" className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          Compare Teams Head-to-Head
        </Badge>
      </div>

      {/* Team Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              Team 1
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select onValueChange={(value) => {
              const team = teams.find(t => t.id === value)
              setSelectedTeam1(team || null)
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Select first team" />
              </SelectTrigger>
              <SelectContent>
                {teams.map((team) => (
                  <SelectItem key={team.id} value={team.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{team.team_name}</span>
                      <Badge variant="outline" className="ml-2">
                        {team.wins}-{team.losses}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {selectedTeam1 && (
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-lg">{selectedTeam1.team_name}</span>
                  <Badge>{selectedTeam1.conference}</Badge>
                </div>
                <div className="text-sm text-gray-600">
                  Record: {selectedTeam1.wins}-{selectedTeam1.losses} ({getWinPercentage(selectedTeam1.wins, selectedTeam1.losses).toFixed(1)}%)
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-red-600" />
              Team 2
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select onValueChange={(value) => {
              const team = teams.find(t => t.id === value)
              setSelectedTeam2(team || null)
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Select second team" />
              </SelectTrigger>
              <SelectContent>
                {teams.map((team) => (
                  <SelectItem key={team.id} value={team.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{team.team_name}</span>
                      <Badge variant="outline" className="ml-2">
                        {team.wins}-{team.losses}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {selectedTeam2 && (
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-lg">{selectedTeam2.team_name}</span>
                  <Badge>{selectedTeam2.conference}</Badge>
                </div>
                <div className="text-sm text-gray-600">
                  Record: {selectedTeam2.wins}-{selectedTeam2.losses} ({getWinPercentage(selectedTeam2.wins, selectedTeam2.losses).toFixed(1)}%)
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Comparison Results */}
      {selectedTeam1 && selectedTeam2 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              {selectedTeam1.team_name} vs {selectedTeam2.team_name}
            </CardTitle>
            <div className="flex items-center justify-center gap-4">
              <Badge variant="outline">{selectedTeam1.conference}</Badge>
              <span className="text-gray-400">vs</span>
              <Badge variant="outline">{selectedTeam2.conference}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Overall Record */}
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-3 items-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {selectedTeam1.wins}-{selectedTeam1.losses}
                  </div>
                  <div className="text-sm text-gray-600">
                    {getWinPercentage(selectedTeam1.wins, selectedTeam1.losses).toFixed(1)}%
                  </div>
                </div>
                <div className="text-center">
                  <Trophy className="w-8 h-8 mx-auto text-yellow-500 mb-1" />
                  <div className="text-sm font-medium">Win %</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {selectedTeam2.wins}-{selectedTeam2.losses}
                  </div>
                  <div className="text-sm text-gray-600">
                    {getWinPercentage(selectedTeam2.wins, selectedTeam2.losses).toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Offensive Stats */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange-500" />
                Offensive Performance
              </h3>
              <div className="space-y-6">
                <StatComparison
                  label="Points Per Game"
                  team1Value={selectedTeam1.points_per_game}
                  team2Value={selectedTeam2.points_per_game}
                  unit=" pts"
                  icon={<Target className="w-4 h-4 text-green-600" />}
                />
                <StatComparison
                  label="Rushing Yards Per Game"
                  team1Value={selectedTeam1.rushing_yards_per_game}
                  team2Value={selectedTeam2.rushing_yards_per_game}
                  unit=" yds"
                  icon={<Users className="w-4 h-4 text-blue-600" />}
                />
                <StatComparison
                  label="Passing Yards Per Game"
                  team1Value={selectedTeam1.passing_yards_per_game}
                  team2Value={selectedTeam2.passing_yards_per_game}
                  unit=" yds"
                  icon={<Zap className="w-4 h-4 text-purple-600" />}
                />
                <StatComparison
                  label="Third Down Conversion %"
                  team1Value={selectedTeam1.third_down_percentage}
                  team2Value={selectedTeam2.third_down_percentage}
                  unit="%"
                  icon={<TrendingUp className="w-4 h-4 text-green-600" />}
                />
                <StatComparison
                  label="Red Zone Efficiency %"
                  team1Value={selectedTeam1.red_zone_percentage}
                  team2Value={selectedTeam2.red_zone_percentage}
                  unit="%"
                  icon={<Target className="w-4 h-4 text-red-600" />}
                />
              </div>
            </div>

            <Separator />

            {/* Defensive Stats */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-500" />
                Defensive Performance
              </h3>
              <div className="space-y-6">
                <StatComparison
                  label="Points Allowed Per Game"
                  team1Value={selectedTeam1.points_allowed_per_game}
                  team2Value={selectedTeam2.points_allowed_per_game}
                  unit=" pts"
                  higherIsBetter={false}
                  icon={<Shield className="w-4 h-4 text-blue-600" />}
                />
                <StatComparison
                  label="Turnovers Forced Per Game"
                  team1Value={selectedTeam1.turnovers_per_game}
                  team2Value={selectedTeam2.turnovers_per_game}
                  unit=""
                  higherIsBetter={false}
                  icon={<TrendingDown className="w-4 h-4 text-orange-600" />}
                />
              </div>
            </div>

            <Separator />

            {/* Schedule Strength */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Schedule Analysis
              </h3>
              <StatComparison
                label="Strength of Schedule"
                team1Value={selectedTeam1.strength_of_schedule}
                team2Value={selectedTeam2.strength_of_schedule}
                unit=""
                icon={<Trophy className="w-4 h-4 text-yellow-600" />}
              />
            </div>

            {/* Prediction */}
            <div className="bg-gradient-to-r from-blue-50 to-red-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-center">AI Matchup Prediction</h3>
              <div className="text-center">
                {getWinPercentage(selectedTeam1.wins, selectedTeam1.losses) > getWinPercentage(selectedTeam2.wins, selectedTeam2.losses) ? (
                  <div>
                    <div className="text-xl font-bold text-blue-600 mb-2">
                      {selectedTeam1.team_name} Favored
                    </div>
                    <div className="text-sm text-gray-600">
                      Based on overall performance metrics and win percentage
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="text-xl font-bold text-red-600 mb-2">
                      {selectedTeam2.team_name} Favored
                    </div>
                    <div className="text-sm text-gray-600">
                      Based on overall performance metrics and win percentage
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {(!selectedTeam1 || !selectedTeam2) && (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Select Teams to Compare</h3>
              <p className="text-gray-600">Choose two teams above to see detailed head-to-head analysis</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}