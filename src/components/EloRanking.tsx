import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Crown, TrendingDown } from 'lucide-react';

interface TeamWithElo {
  id: string;
  name: string;
  players: [string, string];
  elo: number;
}

interface EloRankingProps {
  teams: TeamWithElo[];
}

export const EloRanking = ({ teams }: EloRankingProps) => {
  const sortedTeams = [...teams].sort((a, b) => b.elo - a.elo);

  const getRankIcon = (position: number, total: number) => {
    if (position === 1) return <Crown className="h-5 w-5 text-amber-500" />;
    if (position === 2) return <Medal className="h-5 w-5 text-slate-400" />;
    if (position === 3) return <Trophy className="h-5 w-5 text-amber-600" />;
    if (position === total) return <TrendingDown className="h-5 w-5 text-red-500" />;
    return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-muted-foreground">#{position}</span>;
  };

  const getRankStyle = (position: number, total: number) => {
    if (position === 1) return "bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200 dark:from-amber-950/20 dark:to-yellow-950/20 dark:border-amber-800";
    if (position === 2) return "bg-gradient-to-r from-slate-50 to-gray-50 border-slate-200 dark:from-slate-950/20 dark:to-gray-950/20 dark:border-slate-700";
    if (position === 3) return "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 dark:from-amber-950/20 dark:to-orange-950/20 dark:border-amber-700";
    if (position === total) return "bg-gradient-to-r from-red-50 to-pink-50 border-red-200 dark:from-red-950/20 dark:to-pink-950/20 dark:border-red-800";
    return "bg-background border-border";
  };

  const getEloColor = (elo: number) => {
    if (elo >= 1200) return "text-amber-600 dark:text-amber-400";
    if (elo >= 1100) return "text-green-600 dark:text-green-400";
    if (elo >= 1000) return "text-blue-600 dark:text-blue-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <Card className="bg-[var(--gradient-card)] shadow-[var(--shadow-card)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Trophy className="h-5 w-5 text-primary" />
          Clasificación ELO
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {sortedTeams.map((team, index) => {
          const position = index + 1;
          const total = sortedTeams.length;
          
          return (
            <div
              key={team.id}
              className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${getRankStyle(position, total)}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getRankIcon(position, total)}
                  <div>
                    <div className="font-semibold text-foreground">
                      {team.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {team.players.join(' & ')}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge 
                    variant="outline" 
                    className={`font-bold ${getEloColor(team.elo)}`}
                  >
                    {team.elo} ELO
                  </Badge>
                  {position <= 3 && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {position === 1 ? '🥇 Campeón' : position === 2 ? '🥈 Subcampeón' : '🥉 Tercer lugar'}
                    </div>
                  )}
                  {position === total && (
                    <div className="text-xs text-red-500 mt-1">
                      😤 Inútiles
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};