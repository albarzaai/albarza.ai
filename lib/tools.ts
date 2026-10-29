import { toolTitles } from "./content";

export type Field = { key: string; label: string; options: string[] };
export type ToolSlug = keyof typeof toolTitles;
export type Tab = "creations" | "library" | "templates" | "tutorial" | "voices";

export const tools: Record<ToolSlug, {
  icon: string; tabs: Tab[]; defaultTab: Tab; promptKey: string; uploads: string[]; fields: Field[]; cost: number; needsPrompt: boolean;
}> = {
  video: {
    icon: "video", tabs: ["creations", "library", "templates", "tutorial"], defaultTab: "templates", promptKey: "promptPh", needsPrompt: true,
    uploads: ["startImage", "endImage"], cost: 30,
    fields: [
      { key: "model", label: "model", options: ["Seedance 2.0 Fast", "Veo 3.1", "Kling O3", "Wan 2.6", "Sora 2"] },
      { key: "ratio", label: "ratio", options: ["16:9", "9:16", "1:1"] },
      { key: "duration", label: "duration", options: ["4s", "8s", "12s", "15s"] },
      { key: "quality", label: "quality", options: ["480p", "720p", "1080p"] },
    ],
  },
  image: {
    icon: "image", tabs: ["creations", "templates", "tutorial"], defaultTab: "creations", promptKey: "describeImage", needsPrompt: true,
    uploads: ["uploadFile"], cost: 4,
    fields: [
      { key: "model", label: "model", options: ["Flux Pro", "Imagen 4", "Seedream 4"] },
      { key: "ratio", label: "ratio", options: ["1:1", "16:9", "9:16", "4:3"] },
      { key: "count", label: "count", options: ["1", "2", "4"] },
      { key: "quality", label: "quality", options: ["Standard", "HD"] },
    ],
  },
  "lip-sync": {
    icon: "lip", tabs: ["creations", "tutorial"], defaultTab: "creations", promptKey: "describeLip", needsPrompt: false,
    uploads: ["uploadVideo", "uploadAudio"], cost: 20,
    fields: [{ key: "quality", label: "quality", options: ["720p", "1080p"] }],
  },
  upscale: {
    icon: "upscale", tabs: ["creations", "tutorial"], defaultTab: "creations", promptKey: "uploadFile", needsPrompt: false,
    uploads: ["uploadFile"], cost: 6,
    fields: [{ key: "quality", label: "quality", options: ["2x", "4x", "8x"] }],
  },
  "text-to-voice": {
    icon: "mic", tabs: ["creations", "voices", "tutorial"], defaultTab: "creations", promptKey: "describeScript", needsPrompt: true,
    uploads: [], cost: 3,
    fields: [
      { key: "voice", label: "voice", options: ["حمد (ar-AE)", "فاطمة (ar-AE)", "Noor (en)", "James (en)"] },
      { key: "language", label: "language", options: ["العربية", "English"] },
    ],
  },
  "voice-changer": {
    icon: "wave", tabs: ["creations", "tutorial"], defaultTab: "creations", promptKey: "uploadAudio", needsPrompt: false,
    uploads: ["uploadAudio"], cost: 5,
    fields: [{ key: "voice", label: "voice", options: ["حمد (ar-AE)", "فاطمة (ar-AE)", "Noor (en)", "James (en)"] }],
  },
};
export const isTool = (s: string): s is ToolSlug => s in tools;
