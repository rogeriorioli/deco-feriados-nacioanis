import { client } from "./rpc";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
  useQuery,
} from "@tanstack/react-query";
import { FailedToFetchUserError } from "@/components/logged-provider";
import { toast } from "sonner";

/**
 * This hook will throw an error if the user is not logged in.
 * You can safely use it inside routes that are protected by the `LoggedProvider`.
 */
export const useUser = () => {
  return useSuspenseQuery({
    queryKey: ["user"],
    queryFn: () =>
      client.GET_USER({}, {
        handleResponse: (res: Response) => {
          if (res.status === 401) {
            throw new FailedToFetchUserError(
              "Failed to fetch user",
              globalThis.location.href,
            );
          }

          return res.json();
        },
      }),
    retry: false,
  });
};

/**
 * This hook will return null if the user is not logged in.
 * You can safely use it inside routes that are not protected by the `LoggedProvider`.
 * Good for pages that are public, for example.
 */
export const useOptionalUser = () => {
  return useSuspenseQuery({
    queryKey: ["user"],
    queryFn: () =>
      client.GET_USER({}, {
        handleResponse: async (res: Response) => {
          if (res.status === 401) {
            return null;
          }
          return res.json();
        },
      }),
    retry: false,
  });
};

/**
 * Example hooks from the template
 */

export const useListTodos = () => {
  return useSuspenseQuery({
    queryKey: ["todos"],
    queryFn: () => client.LIST_TODOS({}),
  });
};

export const useGenerateTodoWithAI = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => client.GENERATE_TODO_WITH_AI({}),
    onSuccess: (data) => {
      queryClient.setQueryData(["todos"], (old: any) => {
        if (!old?.todos) return old;
        return {
          ...old,
          todos: [...old.todos, data.todo],
        };
      });
    },
  });
};

export const useToggleTodo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      client.TOGGLE_TODO({ id }, {
        handleResponse: (res: Response) => {
          if (res.status === 401) {
            toast.error("You need to be logged in to toggle todos");
            throw new Error("Unauthorized to toggle TODO");
          }
          return res.json();
        },
      }),
    onSuccess: (data) => {
      // Update the todos list with the updated todo
      queryClient.setQueryData(["todos"], (old: any) => {
        if (!old?.todos) return old;
        return {
          ...old,
          todos: old.todos.map((todo: any) =>
            todo.id === data.todo.id ? data.todo : todo
          ),
        };
      });
    },
  });
};

export const useDeleteTodo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      client.DELETE_TODO({ id }, {
        handleResponse: (res: Response) => {
          if (res.status === 401) {
            toast.error("You need to be logged in to delete todos");
            throw new Error("Unauthorized to delete TODO");
          }
          return res.json();
        },
      }),
    onSuccess: (data) => {
      // Remove the deleted todo from the todos list
      queryClient.setQueryData(["todos"], (old: any) => {
        if (!old?.todos) return old;
        return {
          ...old,
          todos: old.todos.filter((todo: any) => todo.id !== data.deletedId),
        };
      });
      toast.success("Todo deleted successfully");
    },
  });
};

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
