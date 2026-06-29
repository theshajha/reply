import { defineTool } from "eve/tools";
import { z } from "zod";
import { readYours } from "@/lib/yours";

export default defineTool({
  description: "Load the operator's configuration: the role + rubric, their voice samples, and preferences (send vs draft, research on/off, adapters).",
  inputSchema: z.object({}),
  execute: async () => readYours(),
});
