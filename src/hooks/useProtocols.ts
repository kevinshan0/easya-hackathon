import { useQuery } from "@tanstack/react-query";

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000'; // Use port 4000 for backend

export function useProtocols() {
  return useQuery({
    queryKey: ["protocols"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/api/protocols`);
      if (!res.ok) throw new Error("Failed to fetch protocols");
      return res.json();
    },
  });
} 