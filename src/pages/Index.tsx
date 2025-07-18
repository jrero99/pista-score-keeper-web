import React, { useState, useEffect } from 'react';
import { MatchForm } from '@/components/MatchForm';
import { EloRanking } from '@/components/EloRanking';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import heroImage from '@/assets/padel-hero.jpg';

interface Team {
  id: string;
  name: string;
  players: [string, string];
  elo: number;
}

const initialTeams: Team[] = [
  { id: '1', name: 'Ruben & Aran', players: ['Ruben', 'Aran'], elo: 1000 },
  { id: '2', name: 'Marches & Javi', players: ['Marches', 'Javi'], elo: 1000 },
  { id: '3', name: 'Arturo & Pablo', players: ['Arturo', 'Pablo'], elo: 1000 },
  { id: '4', name: 'Ruben & Nelson', players: ['Ruben', 'Nelson'], elo: 1000 },
  { id: '5', name: 'Marcos & Perma', players: ['Marcos', 'Perma'], elo: 1000 },
  { id: '6', name: 'F & ?', players: ['F', '?'], elo: 1000 },
];

const Index = () => {
  const [teams, setTeams] = useState<Team[]>(() => {
    const saved = localStorage.getItem('padel-teams');
    return saved ? JSON.parse(saved) : initialTeams;
  });

  useEffect(() => {
    localStorage.setItem('padel-teams', JSON.stringify(teams));
  }, [teams]);

  const resetTournament = () => {
    setTeams(initialTeams);
    localStorage.removeItem('padel-teams');
    localStorage.removeItem('padel-team-logs');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-48 bg-[var(--gradient-primary)] overflow-hidden">
        <img 
          src={heroImage} 
          alt="Pádel Court" 
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="relative z-10 flex items-center justify-center h-full px-4">
          <div className="text-center text-primary-foreground">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Torneo de Pádel
            </h1>
            <p className="text-sm md:text-base opacity-90">
              Registra los resultados y sigue la clasificación
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 max-w-md">
        <Tabs defaultValue="matches" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="matches">Partidos</TabsTrigger>
            <TabsTrigger value="ranking">Clasificación</TabsTrigger>
          </TabsList>
          
          <TabsContent value="matches" className="space-y-6">
            <MatchForm teams={teams} setTeams={setTeams} />
          </TabsContent>
          
          <TabsContent value="ranking" className="space-y-6">
            <div className="space-y-4">
              <Button
                onClick={resetTournament}
                variant="destructive"
                className="w-full"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Empezar de Nuevo
              </Button>
              <EloRanking teams={teams} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
