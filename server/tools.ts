/**
 * This is where you define your tools.
 *
 * Tools are the functions that will be available on your
 * MCP server. They can be called from any other Deco app
 * or from your front-end code via typed RPC. This is the
 * recommended way to build your Web App.
 *
 * @see https://docs.deco.page/en/guides/creating-tools/
 */
import { createTool } from "@deco/workers-runtime/mastra";
import { z } from "zod";
import type { Env } from "./main.ts";

const HOLIDAY_SUMMARY_SCHEMA = {
  type: "object",
  properties: {
    summary: {
      type: "string",
      description: "A short summary about the holiday (2-3 sentences)",
    },
    curiosities: {
      type: "array",
      items: {
        type: "string"
      },
      description: "3-5 interesting curiosities about the holiday",
    },
    historicalContext: {
      type: "string",
      description: "Brief historical context about when and why this holiday was established",
    },
  },
  required: ["summary", "curiosities", "historicalContext"],
};

export const createGenerateHolidaySummaryTool = (env: Env) =>
  createTool({
    id: "GENERATE_HOLIDAY_SUMMARY",
    description: "Generate a short summary and curiosities about a Brazilian holiday using AI",
    inputSchema: z.object({
      holidayName: z.string().min(1, "Holiday name is required"),
      holidayDate: z.string().optional(),
    }),
    outputSchema: z.object({
      holidayName: z.string(),
      summary: z.string(),
      curiosities: z.array(z.string()),
      historicalContext: z.string(),
    }),
    execute: async ({ context }) => {
      try {
        const prompt = `Generate information about the Brazilian holiday "${context.holidayName}"${context.holidayDate ? ` (celebrated on ${context.holidayDate})` : ''}.

Please provide:
1. A short summary (2-3 sentences) explaining what this holiday is about
2. 3-5 interesting curiosities about this holiday
3. Brief historical context about when and why this holiday was established

Focus on Brazilian culture, history, and traditions. Make the information engaging and educational.

translate the information to Brazilian Portuguese.
`;

        const generatedContent = await env.DECO_CHAT_WORKSPACE_API
          .AI_GENERATE_OBJECT({
            model: "openai:gpt-4.1-mini",
            messages: [
              {
                role: "user",
                content: prompt,
              },
            ],
            temperature: 0.7,
            schema: HOLIDAY_SUMMARY_SCHEMA,
          });

        const content = generatedContent.object;

        if (!content) {
          throw new Error("Failed to generate holiday summary");
        }

        return {
          holidayName: context.holidayName,
          summary: String(content.summary),
          curiosities: Array.isArray(content.curiosities) ? content.curiosities.map(String) : [],
          historicalContext: String(content.historicalContext),
        };
      } catch (error) {
        console.error("Error generating holiday summary:", error);
        throw new Error(`Failed to generate summary for holiday "${context.holidayName}": ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
  });

export const createGetBrazilianHolidaysTool = (env: Env) =>
  createTool({
    id: "GET_BRAZILIAN_HOLIDAYS",
    description: "Get Brazilian national holidays for a specific year",
    inputSchema: z.object({
      year: z.number().min(1900).max(2100).optional().default(() => new Date().getFullYear()),
    }),
    outputSchema: z.object({
      holidays: z.array(
        z.object({
          date: z.string(),
          name: z.string(),
          type: z.string(),
        }),
      ),
      year: z.number(),
      total: z.number(),
    }),
    execute: async ({ context }) => {
      const year = context.year || new Date().getFullYear();
      
      try {
        const response = await fetch(`https://brasilapi.com.br/api/feriados/v1/${year}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch holidays: ${response.status} ${response.statusText}`);
        }
        
        const holidays = await response.json();
        
        return {
          holidays: holidays.map((holiday: any) => ({
            date: holiday.date,
            name: holiday.name,
            type: holiday.type,
          })),
          year,
          total: holidays.length,
        };
      } catch (error) {
        console.error("Error fetching Brazilian holidays:", error);
        throw new Error(`Failed to fetch Brazilian holidays for year ${year}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
  });

export const tools = [
  createGenerateHolidaySummaryTool,
  createGetBrazilianHolidaysTool,
];
