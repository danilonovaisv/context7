export const runtime = "nodejs";

let fetchLibraryContextPromise: any = null;
let utilsPromise: any = null;

const extractHeaderValue = (value: string | string[] | undefined): string | undefined => {
  if (!value) return undefined;
  return typeof value === "string" ? value : value[0];
};

const extractBearerToken = (authHeader: string | string[] | undefined): string | undefined => {
  const header = extractHeaderValue(authHeader);
  if (!header) return undefined;
  if (header.startsWith("Bearer ")) {
    return header.substring(7).trim();
  }
  return header;
};

const extractApiKey = (req: any): string | undefined => {
  return (
    extractBearerToken(req.headers.authorization) ||
    extractHeaderValue(req.headers["context7-api-key"]) ||
    extractHeaderValue(req.headers["x-api-key"]) ||
    extractHeaderValue(req.headers["context7_api_key"]) ||
    extractHeaderValue(req.headers["x_api_key"]) ||
    process.env.CONTEXT7_API_KEY
  );
};

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Context7-API-Key, X-API-Key");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed", message: "Only POST is supported" });
  }

  try {
    const { query, libraryId } = req.body || {};
    if (!query || !libraryId) {
      return res.status(400).json({ error: "Bad Request", message: "Missing query or libraryId parameter" });
    }

    if (!fetchLibraryContextPromise) {
      fetchLibraryContextPromise = import("../../packages/mcp/src/lib/api.js").then((mod) => mod.fetchLibraryContext);
    }
    if (!utilsPromise) {
      utilsPromise = import("../../packages/mcp/src/lib/utils.js").then((mod) => mod.extractClientInfoFromUserAgent);
    }

    const [fetchLibraryContext, extractClientInfoFromUserAgent] = await Promise.all([
      fetchLibraryContextPromise,
      utilsPromise,
    ]);

    const apiKey = extractApiKey(req);
    const clientContext = {
      clientIp: req.headers["x-forwarded-for"] || req.socket?.remoteAddress,
      apiKey: apiKey,
      clientInfo: extractClientInfoFromUserAgent(req.headers["user-agent"]),
      transport: "http" as const,
    };

    const response = await fetchLibraryContext({ query, libraryId }, clientContext);
    return res.status(200).json(response);
  } catch (error: any) {
    return res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
}
