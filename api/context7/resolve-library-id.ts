export const runtime = "nodejs";

let searchLibrariesPromise: any = null;
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
    const { query, libraryName } = req.body || {};
    if (!query || !libraryName) {
      return res.status(400).json({ error: "Bad Request", message: "Missing query or libraryName parameter" });
    }

    if (!searchLibrariesPromise) {
      searchLibrariesPromise = import("../../packages/mcp/src/lib/api.js").then((mod) => mod.searchLibraries);
    }
    if (!utilsPromise) {
      utilsPromise = import("../../packages/mcp/src/lib/utils.js").then((mod) => mod.extractClientInfoFromUserAgent);
    }

    const [searchLibraries, extractClientInfoFromUserAgent] = await Promise.all([
      searchLibrariesPromise,
      utilsPromise,
    ]);

    const apiKey = extractApiKey(req);
    const clientContext = {
      clientIp: req.headers["x-forwarded-for"] || req.socket?.remoteAddress,
      apiKey: apiKey,
      clientInfo: extractClientInfoFromUserAgent(req.headers["user-agent"]),
      transport: "http" as const,
    };

    const searchResponse = await searchLibraries(query, libraryName, clientContext);

    if (searchResponse.error && (!searchResponse.results || searchResponse.results.length === 0)) {
      return res.status(500).json({ error: "Internal Server Error", message: searchResponse.error });
    }

    return res.status(200).json(searchResponse);
  } catch (error: any) {
    return res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
}
