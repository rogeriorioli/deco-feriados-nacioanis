/**
 * This is where you define your workflows.
 *
 * Workflows are a way to encode complex flows of steps
 * reusing your tools and with built-in observability
 * on the Deco project dashboard. They can also do much more!
 *
 * When exported, they will be available on the MCP server
 * via built-in tools for starting, resuming and cancelling
 * them.
 *
 * @see https://docs.deco.page/en/guides/building-workflows/
 */
import {
  createStepFromTool,
  createWorkflow,
} from "@deco/workers-runtime/mastra";
import { z } from "zod";
import { Env } from "./main";
import { createGetBrazilianHolidaysTool, createGenerateHolidaySummaryTool } from "./tools";

const createBrazilianHolidaysWorkflow = (env: Env) => {
  const fetchHolidaysStep = createStepFromTool(createGetBrazilianHolidaysTool(env));
  const generateSummaryStep = createStepFromTool(createGenerateHolidaySummaryTool(env));

  return createWorkflow({
    id: "BRAZILIAN_HOLIDAYS_WORKFLOW",
    inputSchema: z.object({ 
      year: z.number().min(1900).max(2100).optional().default(() => new Date().getFullYear()),
      selectedHoliday: z.string().optional(),
    }),
    outputSchema: z.object({
      year: z.number(),
      holidays: z.array(
        z.object({
          date: z.string(),
          name: z.string(),
          type: z.string(),
        })
      ),
      total: z.number(),
      selectedHolidaySummary: z.object({
        holidayName: z.string(),
        summary: z.string(),
        curiosities: z.array(z.string()),
        historicalContext: z.string(),
      }).optional(),
    }),
  })
    .then(fetchHolidaysStep)
    .map(async ({ inputData, getStepResult }) => {
      const holidaysResult = getStepResult(fetchHolidaysStep);
      
      // If a specific holiday was requested, generate summary for it
      if (inputData.selectedHoliday) {
        const selectedHoliday = holidaysResult.holidays.find(
          holiday => holiday.name.toLowerCase().includes(inputData.selectedHoliday!.toLowerCase())
        );
        
        if (selectedHoliday) {
          // Generate summary for the selected holiday
          const summaryResult = await env.DECO_CHAT_WORKSPACE_API
            .AI_GENERATE_OBJECT({
              model: "openai:gpt-4.1-mini",
              messages: [
                {
                  role: "user",
                  content: `Generate information about the Brazilian holiday "${selectedHoliday.name}" (celebrated on ${selectedHoliday.date}).

Please provide:
1. A short summary (2-3 sentences) explaining what this holiday is about
2. 3-5 interesting curiosities about this holiday
3. Brief historical context about when and why this holiday was established

Focus on Brazilian culture, history, and traditions. Make the information engaging and educational.`,
                },
              ],
              temperature: 0.7,
              schema: {
                type: "object",
                properties: {
                  summary: {
                    type: "string",
                    description: "A short summary about the holiday (2-3 sentences)",
                  },
                  curiosities: {
                    type: "array",
                    items: { type: "string" },
                    description: "3-5 interesting curiosities about the holiday",
                  },
                  historicalContext: {
                    type: "string",
                    description: "Brief historical context about when and why this holiday was established",
                  },
                },
                required: ["summary", "curiosities", "historicalContext"],
              },
            });

          const content = summaryResult.object;
          
          return {
            ...holidaysResult,
            selectedHolidaySummary: {
              holidayName: selectedHoliday.name,
              summary: String(content?.summary || ""),
              curiosities: Array.isArray(content?.curiosities) ? content.curiosities.map(String) : [],
              historicalContext: String(content?.historicalContext || ""),
            },
          };
        }
      }
      
      return {
        ...holidaysResult,
        selectedHolidaySummary: undefined,
      };
    })
    .commit();
};

const createHolidaySummaryWorkflow = (env: Env) => {
  const generateSummaryStep = createStepFromTool(createGenerateHolidaySummaryTool(env));

  return createWorkflow({
    id: "HOLIDAY_SUMMARY_WORKFLOW",
    inputSchema: z.object({
      holidayName: z.string().min(1, "Holiday name is required"),
      holidayDate: z.string().optional(),
    }),
    outputSchema: z.object({
      holidayName: z.string(),
      summary: z.string(),
      curiosities: z.array(z.string()),
      historicalContext: z.string(),
      generatedAt: z.string(),
    }),
  })
    .then(generateSummaryStep)
    .map(async ({ inputData, getStepResult }) => {
      const summaryResult = getStepResult(generateSummaryStep);
      
      return {
        ...summaryResult,
        generatedAt: new Date().toISOString(),
      };
    })
    .commit();
};

export const workflows = [
  createBrazilianHolidaysWorkflow,
  createHolidaySummaryWorkflow,
];
