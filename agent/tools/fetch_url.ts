import { defineTool } from "eve/tools";
import { z } from "zod";

export default defineTool({
  description: "Fetch one public URL the applicant included (GitHub, portfolio) and return its text. Used only for shortlisted applicants and only for links they provided.",
  inputSchema: z.object({ url: z.string().url() }),
  execute: async ({ url }) => {
    const res = await fetch(url, { redirect: "follow" });
    const text = (await res.text()).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    return { url, status: res.status, text: text.slice(0, 4000) };
  },
});
