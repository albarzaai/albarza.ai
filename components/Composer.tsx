"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { Icon } from "./Icon";
import { Pop } from "./Pop";
import { generateAction, type GenState } from "@/lib/generate-actions";
import { ta } from "@/lib/app-dict";
import type { Locale } from "@/lib/i18n";

export type Cat = "image" | "video" | "audio";
export type Mode = "createImage" | "createArtwork" | "createVideo" | "editVideo" | "extendVideo" | "motionControl" | "voiceover" | "musicGenerator" | "voiceChanger";
const modes: Record<Cat, Mode[]> = { image: ["createImage", "createArtwork"], video: ["createVideo", "editVideo", "extendVideo", "motionControl"], audio: ["voiceover", "musicGenerator", "voiceChanger"] };
const catIcon: Record<Cat, string> = { image: "image", video: "video", audio: "wave" };
const modeIcon: Record<Mode, string> = { createImage: "explore", createArtwork: "palette", createVideo: "video", editVideo: "cards", extendVideo: "expand", motionControl: "user", voiceover: "mic", musicGenerator: "note", voiceChanger: "wave" };
const catOf = (m: Mode): Cat => (modes.image.includes(m) ? "image" : modes.video.includes(m) ? "video" : "audio");
const models: Partial<Record<Mode, string[]>> = {
  createImage: ["Nano Banana 2", "Nano Banana 2.1", "GPT Image 2.5 Flare", "Seedream 5.0 Pro", "Flux 3"],
  createVideo: ["Seedance 2.0 Fast", "Seedance 2.5", "Gemini Omni Flash 1.1", "Veo 3.1", "Kling O3", "Wan 2.6", "Sora 2"],
  editVideo: ["Kling O3 Edit"], extendVideo: ["Veo 3.1 Extend"], motionControl: ["Kling Motion 3.0"],
};
const cost: Record<Mode, number> = { createImage: 19, createArtwork: 15, createVideo: 92, editVideo: 140, extendVideo: 110, motionControl: 160, voiceover: 25, musicGenerator: 25, voiceChanger: 30 };
const voicesList = ["Bella", "Harper", "Carlos", "Hamad", "Fatima", "Salem"];
const ratios = ["Auto", "1:1", "16:9", "9:16", "3:4", "4:5", "5:4", "4:3", "21:9"];
const ratioShape = (r: string) => { const [w, h] = r.split(":").map(Number); if (!w) return { w: 14, h: 14 }; const k = 16 / Math.max(w, h); return { w: w * k, h: h * k }; };

const Seg = ({ value, options, onChange }: { value: string; options: string[]; onChange: (v: string) => void }) => (
  <div className="flex gap-1 rounded-xl bg-white/5 p-1">{options.map((o) => <button type="button" key={o} onClick={() => onChange(o)} className={`flex-1 rounded-lg px-3 py-1.5 text-xs ${value === o ? "bg-white/15 text-white" : "text-white/60"}`}>{o}</button>)}</div>
);
const Switch = ({ on, set }: { on: boolean; set: (b: boolean) => void }) => (
  <button type="button" role="switch" aria-checked={on} onClick={() => set(!on)} className={`relative h-6 w-11 rounded-full transition ${on ? "bg-gold" : "bg-white/20"}`}><span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${on ? "start-[22px]" : "start-0.5"}`} /></button>
);
const Chev = () => <Icon n="chev" size={13} />;
const Tile = ({ icon, title, sub, className = "" }: { icon: string; title: string; sub?: string; className?: string }) => (
  <label className={`flex cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl bg-white/5 p-3 text-center text-xs hover:bg-white/10 ${className}`}><Icon n={icon} size={18} /><span className="font-medium">{title}</span>{sub && <span className="text-[11px] text-white/50">{sub}</span>}<input type="file" className="sr-only" /></label>
);

export function Composer({ locale, initialMode = "createImage", count = 1 }: { locale: Locale; initialMode?: Mode; count?: number }) {
  const a = ta(locale);
  const [mode, setMode] = useState<Mode>(initialMode);
  const cat = catOf(mode);
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState<Record<string, string>>({ createImage: "Nano Banana 2", createVideo: "Seedance 2.0 Fast", editVideo: "Kling O3 Edit", extendVideo: "Veo 3.1 Extend", motionControl: "Kling Motion 3.0" });
  const [aspect, setAspect] = useState("Auto"); const [outputs, setOutputs] = useState(1); const [res, setRes] = useState("512px");
  const [dur, setDur] = useState(4); const [vres, setVres] = useState("480p"); const [audio, setAudio] = useState(true); const [enhance, setEnhance] = useState(false);
  const [voice, setVoice] = useState("Bella"); const [lang, setLang] = useState(a.english);
  const [lyrics, setLyrics] = useState(a.autoLyrics); const [genre, setGenre] = useState(a.auto); const [length, setLength] = useState(a.auto);
  const [creativity, setCreativity] = useState(a.medium); const [mood, setMood] = useState<string | null>(null);
  const [keepSound, setKeepSound] = useState(true); const [scene, setScene] = useState("Image"); const [orient, setOrient] = useState("Video");
  const [state, action, pending] = useActionState<GenState, FormData>(generateAction, null);

  useEffect(() => {
    if (state?.ok) window.dispatchEvent(new CustomEvent("albarza:generate", { detail: { cat, mode, prompt, model: model[mode] ?? "", image: state.image } }));
  }, [state]); // eslint-disable-line react-hooks/exhaustive-deps

  const pill = "pill";
  const price = cost[mode] * (mode === "createImage" ? outputs : 1);
  const num = (n: number) => n.toLocaleString(locale === "ar" ? "ar-AE" : "en-AE");
  const settingsLabel = mode === "createImage" ? `${aspect === "Auto" ? a.auto : aspect} · ${outputs} ${locale === "ar" ? "صورة" : outputs > 1 ? "Images" : "Image"} · ${res}` : `${aspect === "Auto" ? a.auto : aspect} · ${dur} ${locale === "ar" ? "ث" : "Sec"} · ${vres}`;
  const ModelPick = ({ list, up = true }: { list: string[]; up?: boolean }) => (
    <Pop up={up} panelClass="w-64 p-2" trigger={<span className={pill}><Icon n={mode === "createImage" ? "spark" : "chart"} size={14} />{model[mode]}<Chev /></span>}>
      {(close) => (<div>{mode === "createVideo" && <><p className="flex items-center gap-2 px-3 py-2 text-sm"><Icon n="spark" size={14} />{a.auto}</p><p className="flex items-center justify-between px-3 py-2 text-sm"><span className="flex items-center gap-2"><Icon n="grid" size={14} />{locale === "ar" ? "كل النماذج" : "All Models"}</span><Icon n="chevR" size={13} /></p><p className="px-3 pt-2 text-[10px] tracking-widest text-white/40">{locale === "ar" ? "مميز" : "FEATURED"}</p></>}
        {list.map((m) => <button type="button" key={m} onClick={() => { setModel({ ...model, [mode]: m }); close(); }} className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-start text-sm hover:bg-white/10 ${model[mode] === m ? "bg-white/10" : ""}`}><Icon n="chart" size={14} />{m}{m.includes("Fast") && <span className="ms-1 rounded bg-gold/20 px-1.5 text-[10px] text-gold-hi">FAST</span>}</button>)}</div>)}
    </Pop>
  );
  const Enh = () => <button type="button" onClick={() => setEnhance(!enhance)} className={`${pill} ${enhance ? "pill-on" : ""}`} aria-pressed={enhance}><Icon n="spark" size={14} />{enhance ? a.on : a.off}</button>;
  const Gen = () => (
    <button aria-disabled={!prompt && mode !== "voiceChanger" && mode !== "motionControl"} disabled={pending} className="gbtn ms-auto">{a.generate}<span className="flex items-center gap-1 rounded-full bg-black/20 px-2 py-0.5 text-xs"><Icon n="spark" size={11} />{num(price)}</span></button>
  );
  const Text = ({ ph }: { ph: string }) => <textarea name="prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={2} maxLength={2000} placeholder={ph} className="min-h-[56px] w-full flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-white/45" />;

  const aspectGrid = (list: string[]) => (
    <div className="grid grid-cols-4 gap-2">{list.map((r) => { const sh = ratioShape(r); return (
      <button type="button" key={r} onClick={() => setAspect(r)} className={`flex h-14 flex-col items-center justify-center gap-1 rounded-xl text-[11px] ${aspect === r ? "bg-white/15" : "bg-white/5 hover:bg-white/10"}`}><span className="block rounded-[3px] border border-white/70" style={{ width: sh.w, height: sh.h }} />{r === "Auto" ? a.auto : r}</button>); })}</div>
  );

  return (
    <form action={action} noValidate className="pointer-events-none fixed inset-x-3 bottom-3 z-40 md:ms-[calc(var(--sb)+30px)] md:me-4">
      <input type="hidden" name="cat" value={cat} /><input type="hidden" name="mode" value={mode} />
      <input type="hidden" name="model" value={model[mode] ?? ""} /><input type="hidden" name="aspect" value={aspect} /><input type="hidden" name="outputs" value={outputs} />
      <input type="hidden" name="resolution" value={cat === "image" ? res : vres} /><input type="hidden" name="duration" value={dur} /><input type="hidden" name="audio" value={String(audio)} /><input type="hidden" name="enhance" value={String(enhance)} />
      <input type="hidden" name="voice" value={voice} /><input type="hidden" name="language" value={lang} /><input type="hidden" name="lyrics" value={lyrics} /><input type="hidden" name="genre" value={genre} /><input type="hidden" name="length" value={length} /><input type="hidden" name="creativity" value={creativity} /><input type="hidden" name="moodboard" value={mood ?? ""} />
      <div className="pointer-events-auto mx-auto max-w-[860px]">
        <div className="mb-2 flex items-center justify-between gap-3">
          <div className="dock flex items-center gap-1 !rounded-full p-1.5">
            <div className="flex rounded-full bg-black/30 p-0.5">{(["image", "video", "audio"] as Cat[]).map((c) => <button type="button" key={c} aria-label={c} onClick={() => setMode(modes[c][0])} className={`grid h-8 w-10 place-items-center rounded-full transition ${cat === c ? "bg-white text-black" : "text-white/70"}`}><Icon n={catIcon[c]} size={15} /></button>)}</div>
            <div className="noscroll flex gap-1 overflow-x-auto px-1">{modes[cat].map((m) => <button type="button" key={m} onClick={() => setMode(m)} className={`pill !px-3 !py-1.5 ${mode === m ? "pill-on" : "!bg-transparent text-white/70"}`}><Icon n={modeIcon[m]} size={14} />{a[m]}</button>)}</div>
          </div>
          <Link href={`/${locale}/app/${cat === "audio" ? "voice" : cat}`} className="dock hidden items-center gap-2 !rounded-full px-3 py-2 text-sm sm:flex"><span className="grid h-6 w-6 place-items-center rounded-full border border-gold text-xs text-gold-hi">{count}</span>{a.yourCreations}</Link>
        </div>
        <div className="dock flex flex-col gap-3 p-3 md:flex-row">
          {/* left reference area */}
          {mode === "createImage" && (<div className="w-full shrink-0 rounded-2xl bg-white/5 p-3 md:w-[210px]"><p className="text-sm font-semibold">{a.addReferences}</p><p className="text-xs text-white/50">{a.useImagesRefs}</p><div className="mt-4 flex justify-end gap-1">{["image", "user", "tag"].map((i) => <label key={i} className="grid h-8 w-8 cursor-pointer place-items-center rounded-lg bg-white/10 hover:bg-white/20"><Icon n={i} size={14} /><input type="file" className="sr-only" /></label>)}</div></div>)}
          {mode === "createArtwork" && (<button type="button" onClick={() => setMood(mood ? null : "Crimson Noir Minimalism")} className="flex w-full shrink-0 flex-col items-center justify-center gap-1 rounded-2xl bg-white/5 p-4 text-center md:w-[210px]"><Icon n="pin" size={18} /><span className="text-sm font-semibold">{mood ?? a.selectMoodboard}</span><span className="text-xs text-white/50">{a.defineLook}</span></button>)}
          {mode === "createVideo" && (<div className="grid w-full shrink-0 grid-cols-2 gap-2 md:w-[210px]"><Tile icon="image" title={a.startImage} className="h-[70px] !items-start !justify-end" /><Tile icon="image" title={a.endImage} className="h-[70px] !items-start !justify-end" /><div className="col-span-2 flex items-center justify-between rounded-2xl bg-white/5 px-3 py-2 text-xs"><span>{a.addReferences}</span><span className="flex gap-1">{["image", "user", "tag"].map((i) => <Icon key={i} n={i} size={14} />)}</span></div></div>)}
          {(mode === "editVideo" || mode === "extendVideo") && (<div className="flex w-full shrink-0 flex-col gap-2 md:w-[210px]"><Tile icon="up" title={a.addRefVideo} sub={a.addRefVideoSub} className="h-[84px]" /><div className="flex items-center justify-between rounded-2xl bg-white/5 px-3 py-2 text-xs"><span>{a.addReferences}</span><span className="flex gap-1">{["image", "user", "tag"].map((i) => <Icon key={i} n={i} size={14} />)}</span></div></div>)}
          {mode === "motionControl" && (<div className="grid w-full flex-1 grid-cols-2 gap-2"><Tile icon="user" title={a.addCharacter} sub={a.addCharacterSub} className="min-h-[110px]" /><Tile icon="camera" title={a.addMotion} sub={a.addMotionSub} className="min-h-[110px]" /></div>)}
          {mode === "voiceChanger" && (<div className="grid w-full flex-1 grid-cols-[1fr_130px] gap-2"><Tile icon="up" title={a.addVideoOrAudio} sub={a.upTo50} className="min-h-[96px]" /><Pop panelClass="w-52 p-2" trigger={<span className="flex h-full min-h-[96px] w-full flex-col items-center justify-center gap-1 rounded-2xl bg-white/5 text-center text-xs hover:bg-white/10"><Icon n="user" size={18} /><b>{voice === "Bella" ? a.selectVoice : voice}</b><span className="text-white/50">{a.pickPreset}</span></span>}>{(close) => voicesList.map((v) => <button type="button" key={v} onClick={() => { setVoice(v); close(); }} className="block w-full rounded-lg px-3 py-2 text-start text-sm hover:bg-white/10">{v}</button>)}</Pop></div>)}

          {/* right: prompt + controls */}
          {mode !== "motionControl" && mode !== "voiceChanger" && (
            <div className="flex min-w-0 flex-1 flex-col gap-3">
              <Text ph={mode === "createImage" ? a.describeImage : mode === "createArtwork" ? a.describeArtwork : mode === "voiceover" ? a.describeVoiceover : mode === "musicGenerator" ? a.describeMusic : a.describeVideo} />
              <div className="flex flex-wrap items-center gap-2">
                {mode === "createImage" && (<><ModelPick list={models.createImage!} />
                  <Pop panelClass="w-[300px] p-4" trigger={<span className={pill}>{settingsLabel}<Chev /></span>}>
                    <div className="space-y-4"><p className="text-sm font-semibold">{a.imageSettings}</p><div><p className="mb-2 text-xs text-white/60">{a.aspectRatio}</p>{aspectGrid(ratios)}</div>
                      <div className="flex items-center justify-between text-sm"><span>{a.outputs}</span><span className="flex items-center gap-3 rounded-full bg-white/5 px-2"><button type="button" onClick={() => setOutputs(Math.max(1, outputs - 1))} className="p-1">−</button>{outputs}<button type="button" onClick={() => setOutputs(Math.min(4, outputs + 1))} className="p-1">+</button></span></div>
                      <div><p className="mb-2 text-xs text-white/60">{a.resolution}</p><Seg value={res} options={["512px", "1K", "2K", "4K"]} onChange={setRes} /></div></div>
                  </Pop><Enh /></>)}
                {mode === "createArtwork" && (<>
                  <Pop panelClass="w-[260px] p-4" trigger={<span className={pill}><Icon n="panel" size={14} />{aspect === "Auto" ? "16:9" : aspect}<Chev /></span>}>{aspectGrid(["1:1", "16:9", "9:16", "3:4", "4:3", "21:9"])}</Pop>
                  <Pop panelClass="w-44 p-2" trigger={<span className={pill}><Icon n="tag" size={14} />{creativity}<Chev /></span>}>{(close) => [a.low, a.medium, a.high].map((v) => <button type="button" key={v} onClick={() => { setCreativity(v); close(); }} className="block w-full rounded-lg px-3 py-2 text-start text-sm hover:bg-white/10">{v}</button>)}</Pop></>)}
                {(mode === "createVideo" || mode === "editVideo" || mode === "extendVideo") && (<><ModelPick list={models[mode]!} />
                  {mode === "createVideo" ? (
                    <Pop panelClass="w-[290px] p-4" trigger={<span className={pill}>{settingsLabel}<Chev /></span>}>
                      <div className="space-y-4"><p className="text-sm font-semibold">{a.videoSettings}</p><div><p className="mb-2 text-xs text-white/60">{a.aspectRatio}</p>{aspectGrid(["Auto", "1:1", "21:9", "16:9", "9:16", "3:4", "4:3"])}</div>
                        <div><div className="mb-2 flex justify-between text-xs text-white/60"><span>{a.duration}</span><span>{dur}s</span></div><input type="range" min={4} max={15} value={dur} onChange={(e) => setDur(+e.target.value)} className="rng w-full" /></div>
                        <div><p className="mb-2 text-xs text-white/60">{a.resolution}</p><Seg value={vres} options={["480p", "720p"]} onChange={setVres} /></div>
                        <div className="flex items-center justify-between text-sm"><span>{a.audio}</span><Switch on={audio} set={setAudio} /></div></div>
                    </Pop>) : <span className={pill}>720p<Chev /></span>}
                  <Enh /></>)}
                {mode === "voiceover" && (<>
                  <Pop panelClass="w-48 p-2" trigger={<span className={pill}><Icon n="mic" size={14} />{voice}<Chev /></span>}>{(close) => voicesList.map((v) => <button type="button" key={v} onClick={() => { setVoice(v); close(); }} className="block w-full rounded-lg px-3 py-2 text-start text-sm hover:bg-white/10">{v}</button>)}</Pop>
                  <Pop panelClass="w-44 p-2" trigger={<span className={pill}><Icon n="language" size={14} />{lang}<Chev /></span>}>{(close) => [a.english, a.arabic].map((v) => <button type="button" key={v} onClick={() => { setLang(v); close(); }} className="block w-full rounded-lg px-3 py-2 text-start text-sm hover:bg-white/10">{v}</button>)}</Pop></>)}
                {mode === "musicGenerator" && (<>
                  <Pop panelClass="w-48 p-2" trigger={<span className={pill}><Icon n="note" size={14} />{lyrics}<Chev /></span>}>{(close) => [a.autoLyrics, a.custom, a.instrumental].map((v) => <button type="button" key={v} onClick={() => { setLyrics(v); close(); }} className="block w-full rounded-lg px-3 py-2 text-start text-sm hover:bg-white/10">{v}</button>)}</Pop>
                  <Pop panelClass="w-44 p-2" trigger={<span className={pill}><Icon n="sliders" size={14} />{genre}<Chev /></span>}>{(close) => [a.auto, "Pop", "Hip-Hop", "Electronic", "Cinematic", "Khaleeji", "Classical"].map((v) => <button type="button" key={v} onClick={() => { setGenre(v); close(); }} className="block w-full rounded-lg px-3 py-2 text-start text-sm hover:bg-white/10">{v}</button>)}</Pop>
                  <Pop panelClass="w-40 p-2" trigger={<span className={pill}><Icon n="chart" size={14} />{length}<Chev /></span>}>{(close) => [a.auto, "30s", "1m", "2m", "3m"].map((v) => <button type="button" key={v} onClick={() => { setLength(v); close(); }} className="block w-full rounded-lg px-3 py-2 text-start text-sm hover:bg-white/10">{v}</button>)}</Pop>
                  <Pop panelClass="w-52 p-2" trigger={<span className={pill} aria-label={a.advancedSettings}><Icon n="sliders" size={14} /></span>}>{[a.mood, a.tempo, a.theme, a.vocals].map((v) => <div key={v} className="flex items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-white/10">{v}<Icon n="chevR" size={13} /></div>)}<button type="button" className="block w-full px-3 py-2 text-start text-xs text-white/40">{a.clearAll}</button></Pop></>)}
                <Gen />
              </div>
            </div>
          )}
          {(mode === "motionControl" || mode === "voiceChanger") && (
            <div className={`flex shrink-0 flex-col justify-between gap-2 ${mode === "voiceChanger" ? "w-full md:w-[130px]" : "w-full md:w-[200px]"}`}>
              {mode === "motionControl" && (<><ModelPick list={models.motionControl!} /><div className="flex gap-2"><span className={pill}>720p</span>
                <Pop up align="end" panelClass="w-[300px] p-4" trigger={<span className={pill}><Icon n="sliders" size={14} />{a.settings}</span>}>
                  <div className="space-y-4"><div className="flex items-center justify-between"><p className="text-sm font-semibold">{a.advancedSettings}</p></div>
                    <div><p className="mb-1 text-xs text-white/60">{a.prompt}</p><textarea rows={3} placeholder={a.promptPh2} className="w-full resize-none rounded-xl bg-white/5 p-2 text-xs outline-none" /></div>
                    <div className="flex items-center justify-between text-sm"><span>{a.keepOriginalSound}</span><Switch on={keepSound} set={setKeepSound} /></div>
                    <div><p className="mb-1 text-sm">{a.sceneControlMode}</p><Seg value={scene} options={["Image", "Video"]} onChange={setScene} /><p className="mt-1 text-[11px] text-white/45">{a.sceneHint}</p></div>
                    <div><p className="mb-1 text-sm">{a.characterOrientation}</p><Seg value={orient} options={["Image", "Video"]} onChange={setOrient} /><p className="mt-1 text-[11px] text-white/45">{a.orientHint}</p></div></div>
                </Pop></div></>)}
              <Gen />
            </div>
          )}
        </div>
        {state && !state.ok && <p role="alert" className="mt-2 text-center text-xs text-red-400">{state.error === "rate" ? (locale === "ar" ? "طلبات كثيرة، حاول بعد قليل" : "Too many requests, try again shortly") : state.error === "unavailable" || state.error === "blocked" ? (locale === "ar" ? "تعذّر إنشاء الصورة الآن، حاول مرة أخرى" : "Couldn't generate the image, please try again") : locale === "ar" ? "أدخل وصفاً صالحاً للمتابعة" : "Enter a valid prompt to continue"}</p>}
      </div>
    </form>
  );
}
