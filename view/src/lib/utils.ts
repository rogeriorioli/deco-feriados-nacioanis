import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Holiday image mapping
export const getHolidayImage = (holidayName: string): string => {
  const name = holidayName.toLowerCase();
  
  // Map holiday names to image files
  const holidayImageMap: Record<string, string> = {
    'carnaval': '/feriados/carnaval.jpg',
    'sexta-feira santa': '/feriados/sexta-santa.jpg',
    'sexta santa': '/feriados/sexta-santa.jpg',
    'páscoa': '/feriados/pascoa.jpg',
    'pascoa': '/feriados/pascoa.jpg',
    'tiradentes': '/feriados/tiradentes.jpg',
    'dia do trabalho': '/feriados/dia-do-trabalho.jpg',
    'corpus christi': '/feriados/corpus-christi.jpg',
    'corpus-christi': '/feriados/corpus-christi.jpg',
    'independência do brasil': '/feriados/independencia.jpg',
    'independencia do brasil': '/feriados/independencia.jpg',
    'nossa senhora aparecida': '/feriados/nossa-senhora.jpg',
    'finados': '/feriados/finados.jpg',
    'proclamação da república': '/feriados/proclamacao-republica.jpg',
    'proclamacao da republica': '/feriados/proclamacao-republica.jpg',
    'natal': '/feriados/natal.jpg',
    'consciência negra': '/feriados/negra.jpg',
    'consciencia negra': '/feriados/negra.jpg',
    'mundial': '/feriados/mundial.jpg',
  };

  // Try exact match first
  if (holidayImageMap[name]) {
    return holidayImageMap[name];
  }

  // Try partial matches
  for (const [key, image] of Object.entries(holidayImageMap)) {
    if (name.includes(key) || key.includes(name)) {
      return image;
    }
  }

  // Default image if no match found
  return '/feriados/carnaval.jpg';
};

// Format date for display
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};
