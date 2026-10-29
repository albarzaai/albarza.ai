// Movie projects live in this browser (IndexedDB) until accounts and cloud storage are connected.
export type AssetKind = "image" | "video";
export type Asset = { id: string; kind: AssetKind; name: string; type: string; size: number };
export type Character = { id: string; name: string; role: string; description: string; assetId?: string };
export type Scene = { id: string; title: string; description: string; shot: string; duration: number; characterIds: string[]; assetIds: string[]; notes: string };
export type Project = { id: string; title: string; logline: string; createdAt: number; updatedAt: number; characters: Character[]; assets: Asset[]; scenes: Scene[] };

export const SHOTS = ["Wide", "Medium", "Close-up", "Over the shoulder", "Aerial", "Tracking", "POV"];
export const uid = () => (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2) + Date.now().toString(36));

const DB = "albarza-projects";
function open(): Promise<IDBDatabase> {
  return new Promise((res, rej) => {
    const r = indexedDB.open(DB, 1);
    r.onupgradeneeded = () => { r.result.createObjectStore("projects", { keyPath: "id" }); r.result.createObjectStore("blobs"); };
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}
function run<T>(store: string, mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return open().then((db) => new Promise<T>((res, rej) => {
    const tx = db.transaction(store, mode);
    const req = fn(tx.objectStore(store));
    tx.oncomplete = () => { res(req.result); db.close(); };
    tx.onerror = () => { rej(tx.error); db.close(); };
  }));
}
export const listProjects = () => run<Project[]>("projects", "readonly", (s) => s.getAll() as IDBRequest<Project[]>).then((l) => l.sort((a, b) => b.updatedAt - a.updatedAt));
export const getProject = (id: string) => run<Project | undefined>("projects", "readonly", (s) => s.get(id));
export const saveProject = (p: Project) => run("projects", "readwrite", (s) => s.put({ ...p, updatedAt: Date.now() }));
export const removeProject = async (p: Project) => {
  await run("projects", "readwrite", (s) => s.delete(p.id));
  for (const a of p.assets) await run("blobs", "readwrite", (s) => s.delete(a.id));
};
export const putBlob = (id: string, b: Blob) => run("blobs", "readwrite", (s) => s.put(b, id));
export const getBlob = (id: string) => run<Blob | undefined>("blobs", "readonly", (s) => s.get(id));
export const delBlob = (id: string) => run("blobs", "readwrite", (s) => s.delete(id));

export const newProject = (title: string): Project => ({ id: uid(), title, logline: "", createdAt: Date.now(), updatedAt: Date.now(), characters: [], assets: [], scenes: [] });
export const newScene = (n: number): Scene => ({ id: uid(), title: "", description: "", shot: "Wide", duration: 5, characterIds: [], assetIds: [], notes: "" });
