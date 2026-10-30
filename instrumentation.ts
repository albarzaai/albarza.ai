import { reportToSentry } from "./lib/sentry";

// Called by Next for errors thrown while rendering pages, running server actions or route handlers.
export async function onRequestError(err: unknown, request: { path: string; method: string }, context: { routeType?: string; routePath?: string }) {
  await reportToSentry(err, { service: "web", path: request.path, method: request.method, tags: { kind: "next-request", routeType: context.routeType ?? "", route: context.routePath ?? "" } });
}
