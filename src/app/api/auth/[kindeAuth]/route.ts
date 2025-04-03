import { handleAuth } from "@kinde-oss/kinde-auth-nextjs/server";

export async function GET(req: Request) {
  // Call the Kinde handler, passing a dummy response object to satisfy the signature.
  const response = await handleAuth()(req, {} as any);
  
  // Add the required CORS header
  response.headers.set("Access-Control-Allow-Origin", "https://www.chichore.com");
  return response;
}

// Handle preflight OPTIONS request
export function OPTIONS() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "https://www.chichore.com",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
