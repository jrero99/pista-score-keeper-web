import { MatchForm } from '@/components/MatchForm';
import heroImage from '@/assets/padel-hero.jpg';

const Index = () => {
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
              Registra los resultados de cada partido
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 max-w-md">
        <MatchForm />
      </div>
    </div>
  );
};

export default Index;
