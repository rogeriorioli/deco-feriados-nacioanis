import { client } from "./rpc";
import {
  useMutation,
  useQueryClient,
  useQuery,
} from "@tanstack/react-query";

// Brazilian Holidays Hooks
export const useBrazilianHolidays = (year?: number) => {
  return useQuery({
    queryKey: ["brazilianHolidays", year],
    queryFn: () => client.GET_BRAZILIAN_HOLIDAYS({ year }),
    enabled: !year || (year >= 1900 && year <= 2100),
  });
};

export const useGenerateHolidaySummary = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (input: { holidayName: string; holidayDate?: string }) => 
      client.GENERATE_HOLIDAY_SUMMARY(input),
    onSuccess: () => {
      // Invalidate related queries after successful generation
      queryClient.invalidateQueries({ queryKey: ["brazilianHolidays"] });
    },
  });
};

export const useBrazilianHolidaysWorkflow = () => {
  return useMutation({
    mutationFn: (input: { year?: number; selectedHoliday?: string }) => 
      client.START_BRAZILIAN_HOLIDAYS_WORKFLOW(input),
  });
};

export const useHolidaySummaryWorkflow = () => {
  return useMutation({
    mutationFn: (input: { holidayName: string; holidayDate?: string }) => 
      client.START_HOLIDAY_SUMMARY_WORKFLOW(input),
  });
};
