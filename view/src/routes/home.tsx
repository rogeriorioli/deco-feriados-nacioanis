import { createRoute, type RootRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Calendar, Loader, Sparkles, Info, X } from "lucide-react";
import { useBrazilianHolidays, useGenerateHolidaySummary } from "@/lib/hooks";
import { getHolidayImage, formatDate, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

function HolidayCard({ 
  holiday, 
  onGenerateSummary, 
  isGenerating, 
  selectedHoliday 
}: { 
  holiday: { date: string; name: string; type: string };
  onGenerateSummary: (holiday: { date: string; name: string; type: string }) => void;
  isGenerating: boolean;
  selectedHoliday: string | null;
}) {
  const isSelected = selectedHoliday === holiday.name;
  const imagePath = getHolidayImage(holiday.name);

  return (
    <div className={cn(
      "group relative bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer aspect-square",
      isSelected && "ring-2 ring-blue-500 shadow-lg"
    )}>
      <div className="relative w-full h-full">
        <img
          src={imagePath}
          alt={holiday.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onClick={() => onGenerateSummary(holiday)}
        />
        
        {/* Overlay with holiday info */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h3 className="font-semibold text-lg mb-1">{holiday.name}</h3>
            <p className="text-sm opacity-90">{formatDate(holiday.date)}</p>
            <p className="text-xs opacity-75 capitalize">{holiday.type}</p>
          </div>
        </div>

        {/* Loading indicator */}
        {isGenerating && isSelected && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-4 flex items-center gap-2">
              <Loader className="w-4 h-4 animate-spin text-blue-600" />
              <span className="text-sm font-medium">Gerando curiosidades...</span>
            </div>
          </div>
        )}

        {/* Generate button */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onGenerateSummary(holiday);
            }}
            disabled={isGenerating}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Sparkles className="w-3 h-3 mr-1" />
            Curiosidades
          </Button>
        </div>
      </div>

    </div>
  );
}

function HolidaySummary({ 
  summary, 
  onClose 
}: { 
  summary: {
    holidayName: string;
    summary: string;
    curiosities: string[];
    historicalContext: string;
  };
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">{summary.holidayName}</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Summary */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Resumo</h3>
            <p className="text-gray-700 leading-relaxed">{summary.summary}</p>
          </div>

          {/* Historical Context */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Contexto Histórico</h3>
            <p className="text-gray-700 leading-relaxed">{summary.historicalContext}</p>
          </div>

          {/* Curiosities */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Curiosidades</h3>
            <ul className="space-y-2">
              {summary.curiosities.map((curiosity, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">{curiosity}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function HomePage() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedHoliday, setSelectedHoliday] = useState<string | null>(null);
  const [holidaySummary, setHolidaySummary] = useState<any>(null);

  const { data: holidaysData, isLoading, error } = useBrazilianHolidays(selectedYear);
  const generateSummary = useGenerateHolidaySummary();

  const handleGenerateSummary = (holiday: { date: string; name: string; type: string }) => {
    setSelectedHoliday(holiday.name);
    generateSummary.mutate(
      { 
        holidayName: holiday.name, 
        holidayDate: holiday.date 
      },
      {
        onSuccess: (data) => {
          setHolidaySummary(data);
        },
        onError: () => {
          setSelectedHoliday(null);
        }
      }
    );
  };

  const handleCloseSummary = () => {
    setHolidaySummary(null);
    setSelectedHoliday(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Feriados Brasileiros</h1>
                <p className="text-sm text-gray-600">Descubra a história e curiosidades dos feriados nacionais</p>
              </div>
            </div>

            {/* Year Selector */}
            <div className="flex items-center gap-2">
              <label htmlFor="year" className="text-sm font-medium text-gray-700">
                Ano:
              </label>
              <select
                id="year"
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3">
              <Loader className="w-6 h-6 animate-spin text-blue-600" />
              <span className="text-lg text-gray-600">Carregando feriados...</span>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">Erro ao carregar feriados. Tente novamente.</p>
          </div>
        ) : holidaysData ? (
          <div>
            {/* Stats */}
            <div className="mb-8 text-center">
              <p className="text-lg text-gray-600">
                <span className="font-semibold text-blue-600">{holidaysData.total}</span> feriados encontrados em {selectedYear}
              </p>
            </div>

            {/* Holidays Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {holidaysData.holidays.map((holiday: { date: string; name: string; type: string }) => (
                <HolidayCard
                  key={`${holiday.date}-${holiday.name}`}
                  holiday={holiday}
                  onGenerateSummary={handleGenerateSummary}
                  isGenerating={generateSummary.isPending}
                  selectedHoliday={selectedHoliday}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {/* Holiday Summary Modal */}
      {holidaySummary && (
        <HolidaySummary 
          summary={holidaySummary} 
          onClose={handleCloseSummary} 
        />
      )}
    </div>
  );
}

export default (parentRoute: RootRoute) =>
  createRoute({
    path: "/",
    component: HomePage,
    getParentRoute: () => parentRoute,
  });
