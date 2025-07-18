import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Users, MapPin, Save } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Team {
  id: string;
  name: string;
  players: [string, string];
}

interface Match {
  winner: Team | null;
  loser: Team | null;
  court: string;
  timestamp: Date;
}

const teams: Team[] = [
  { id: '1', name: 'Ruben & Aran', players: ['Ruben', 'Aran'] },
  { id: '2', name: 'Marches & Javi', players: ['Marches', 'Javi'] },
  { id: '3', name: 'Arturo & Pablo', players: ['Arturo', 'Pablo'] },
  { id: '4', name: 'Ruben & Nelson', players: ['Ruben', 'Nelson'] },
  { id: '5', name: 'Marcos & Perma', players: ['Marcos', 'Perma'] },
];

const courts = ['Pista 1', 'Pista 2', 'Pista 3', 'Pista 4'];

export const MatchForm = () => {
  const [selectedWinner, setSelectedWinner] = useState<Team | null>(null);
  const [selectedLoser, setSelectedLoser] = useState<Team | null>(null);
  const [selectedCourt, setSelectedCourt] = useState<string>('');
  const [matches, setMatches] = useState<Match[]>([]);

  const resetForm = () => {
    setSelectedWinner(null);
    setSelectedLoser(null);
    setSelectedCourt('');
  };

  const handleSubmit = () => {
    if (!selectedWinner || !selectedLoser || !selectedCourt) {
      toast({
        title: "Error",
        description: "Selecciona pareja ganadora, perdedora y pista",
        variant: "destructive",
      });
      return;
    }

    if (selectedWinner.id === selectedLoser.id) {
      toast({
        title: "Error",
        description: "La pareja ganadora y perdedora no pueden ser la misma",
        variant: "destructive",
      });
      return;
    }

    const newMatch: Match = {
      winner: selectedWinner,
      loser: selectedLoser,
      court: selectedCourt,
      timestamp: new Date(),
    };

    setMatches(prev => [newMatch, ...prev]);
    resetForm();
    
    toast({
      title: "¡Partido registrado!",
      description: `${selectedWinner.name} venció a ${selectedLoser.name} en ${selectedCourt}`,
    });
  };

  const availableTeams = teams.filter(team => 
    !selectedWinner || team.id !== selectedWinner.id
  );

  const availableLoserTeams = teams.filter(team => 
    !selectedLoser || team.id !== selectedLoser.id
  );

  return (
    <div className="space-y-6">
      {/* Winner Selection */}
      <Card className="bg-[var(--gradient-card)] shadow-[var(--shadow-card)]">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Trophy className="h-5 w-5 text-winner" />
            Pareja Ganadora
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 gap-2">
            {teams.map((team) => (
              <Button
                key={team.id}
                variant={selectedWinner?.id === team.id ? "winner" : "outline"}
                onClick={() => setSelectedWinner(team)}
                className="justify-start h-auto p-3"
                disabled={selectedLoser?.id === team.id}
              >
                <div className="text-left">
                  <div className="font-semibold">{team.name}</div>
                  <div className="text-xs opacity-80">
                    {team.players.join(' & ')}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Loser Selection */}
      <Card className="bg-[var(--gradient-card)] shadow-[var(--shadow-card)]">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-5 w-5 text-loser" />
            Pareja Derrotada
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 gap-2">
            {teams.map((team) => (
              <Button
                key={team.id}
                variant={selectedLoser?.id === team.id ? "loser" : "outline"}
                onClick={() => setSelectedLoser(team)}
                className="justify-start h-auto p-3"
                disabled={selectedWinner?.id === team.id}
              >
                <div className="text-left">
                  <div className="font-semibold">{team.name}</div>
                  <div className="text-xs opacity-80">
                    {team.players.join(' & ')}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Court Selection */}
      <Card className="bg-[var(--gradient-card)] shadow-[var(--shadow-card)]">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="h-5 w-5 text-court" />
            Pista
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {courts.map((court) => (
              <Button
                key={court}
                variant={selectedCourt === court ? "court" : "outline"}
                onClick={() => setSelectedCourt(court)}
                className="h-12"
              >
                {court}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        className="w-full h-12"
        disabled={!selectedWinner || !selectedLoser || !selectedCourt}
      >
        <Save className="h-4 w-4 mr-2" />
        Registrar Partido
      </Button>

      {/* Matches History */}
      {matches.length > 0 && (
        <Card className="bg-[var(--gradient-card)] shadow-[var(--shadow-card)]">
          <CardHeader>
            <CardTitle className="text-lg">Partidos Registrados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {matches.map((match, index) => (
              <div
                key={index}
                className="p-3 rounded-lg border bg-background/50 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {match.court}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {match.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-3 w-3 text-winner" />
                    <span className="text-sm font-medium text-winner">
                      {match.winner?.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-3 w-3 text-loser" />
                    <span className="text-sm text-loser">
                      {match.loser?.name}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};