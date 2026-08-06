import { getWeeklyCosmicContext } from '@/lib/cosmic/provider';
import { ObservadorClient } from './_components/ObservadorClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Observador Cósmico | EA Lumina',
  description: 'Gerador inteligente de conteúdo para terapeutas',
};

export default async function ObservadorPage() {
  const context = await getWeeklyCosmicContext();

  return (
    <div className="p-6 md:p-8 w-full min-h-screen bg-[#FAFAF9]">
      <ObservadorClient initialContext={context} />
    </div>
  );
}
