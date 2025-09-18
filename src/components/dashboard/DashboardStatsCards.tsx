import { StatsCard } from "../statscard/stats-card";

interface DashboardStatsCardsProps {
  municipalitiesServed: number;
  statesServed: number;
  analyzesGenerated: number;
}

export function DashboardStatsCards({
  municipalitiesServed,
  statesServed,
  analyzesGenerated,
}: DashboardStatsCardsProps) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
      <StatsCard
        title='Municípios atendidos'
        value={municipalitiesServed}
        color='blue'
        className='shadow-sm'
      />
      <StatsCard
        title='Estados atendidos'
        value={statesServed}
        color='amber'
        className='shadow-sm'
      />
      <StatsCard
        title='Análises geradas'
        value={analyzesGenerated}
        color='green'
        className='shadow-sm'
      />
    </div>
  );
}
