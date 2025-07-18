import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Users, MapPin, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Team {
  id: string;
  name: string;
  players: [string, string];
  elo: number;
}

interface Match {
  winner: Team | null;
  loser: Team | null;
  court: string;
  timestamp: Date;
}

const courts = ["Pista 1", "Pista 2", "Pista 3"];

const calculateEloChange = (
  winnerElo: number,
  loserElo: number,
  kFactor: number = 32
): [number, number] => {
  const expectedWin = 1 / (1 + Math.pow(10, (loserElo - winnerElo) / 400));
  const expectedLoss = 1 - expectedWin;

  const newWinnerElo = Math.round(winnerElo + kFactor * (1 - expectedWin));
  const newLoserElo = Math.round(loserElo + kFactor * (0 - expectedLoss));

  return [newWinnerElo, newLoserElo];
};

interface MatchFormProps {
  teams: Team[];
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
}

export const MatchForm = ({ teams, setTeams }: MatchFormProps) => {
  const [selectedWinner, setSelectedWinner] = useState<Team | null>(null);
  const [selectedLoser, setSelectedLoser] = useState<Team | null>(null);
  const [selectedCourt, setSelectedCourt] = useState<string>("");
  const [matches, setMatches] = useState<Match[]>([]);

  // Control de tiempo para selección de equipos
  const isTeamSelectable = (teamId: string): boolean => {
    const logs = JSON.parse(localStorage.getItem("padel-team-logs") || "{}");
    const lastSelected = logs[teamId];
    if (!lastSelected) return true;

    const timeDiff = Date.now() - lastSelected;
    const fifteenMinutes = 15 * 60 * 1000;
    return timeDiff >= fifteenMinutes;
  };

  const logTeamSelection = (teamId: string) => {
    const logs = JSON.parse(localStorage.getItem("padel-team-logs") || "{}");
    logs[teamId] = Date.now();
    localStorage.setItem("padel-team-logs", JSON.stringify(logs));
  };

  const resetForm = () => {
    setSelectedWinner(null);
    setSelectedLoser(null);
    setSelectedCourt("");
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

    // Calculate ELO changes
    const [newWinnerElo, newLoserElo] = calculateEloChange(
      selectedWinner.elo,
      selectedLoser.elo
    );
    const eloChange = newWinnerElo - selectedWinner.elo;

    // Log team selections
    logTeamSelection(selectedWinner.id);
    logTeamSelection(selectedLoser.id);

    // Update teams with new ELO
    setTeams((prevTeams) =>
      prevTeams.map((team) => {
        if (team.id === selectedWinner.id) {
          return { ...team, elo: newWinnerElo };
        }
        if (team.id === selectedLoser.id) {
          return { ...team, elo: newLoserElo };
        }
        return team;
      })
    );

    const newMatch: Match = {
      winner: selectedWinner,
      loser: selectedLoser,
      court: selectedCourt,
      timestamp: new Date(),
    };

    setMatches((prev) => [newMatch, ...prev]);
    resetForm();

    toast({
      title: "¡Partido registrado!",
      description: `${selectedWinner.name} venció a ${
        selectedLoser.name
      } en ${selectedCourt}. ELO: ${eloChange > 0 ? "+" : ""}${eloChange}`,
    });
  };

  const availableTeams = teams.filter(
    (team) => !selectedWinner || team.id !== selectedWinner.id
  );

  const availableLoserTeams = teams.filter(
    (team) => !selectedLoser || team.id !== selectedLoser.id
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
            {teams.map((team) => {
              const canSelect = isTeamSelectable(team.id);
              return (
                <Button
                  key={team.id}
                  variant={
                    selectedWinner?.id === team.id ? "winner" : "outline"
                  }
                  onClick={() => canSelect && setSelectedWinner(team)}
                  className="justify-start h-auto p-3"
                  disabled={selectedLoser?.id === team.id || !canSelect}
                >
                  <div className="text-left">
                    <div className="font-semibold">{team.name}</div>
                    <div className="text-xs opacity-80">
                      {team.players.join(" & ")}
                      {!canSelect && (
                        <span className="text-red-500 ml-2">
                          (Bloqueado 15min)
                        </span>
                      )}
                    </div>
                  </div>
                </Button>
              );
            })}
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
            {teams.map((team) => {
              const canSelect = isTeamSelectable(team.id);
              return (
                <Button
                  key={team.id}
                  variant={selectedLoser?.id === team.id ? "loser" : "outline"}
                  onClick={() => canSelect && setSelectedLoser(team)}
                  className="justify-start h-auto p-3"
                  disabled={selectedWinner?.id === team.id || !canSelect}
                >
                  <div className="text-left">
                    <div className="font-semibold">{team.name}</div>
                    <div className="text-xs opacity-80">
                      {team.players.join(" & ")}
                      {!canSelect && (
                        <span className="text-red-500 ml-2">
                          (Bloqueado 15min)
                        </span>
                      )}
                    </div>
                  </div>
                </Button>
              );
            })}
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
