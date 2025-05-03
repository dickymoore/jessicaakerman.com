// functions/api/auth.js

export async function onRequest(context) {
    const {
      request,      // the incoming Request
      env,          // your environment variables / secrets
    } = context;
  
    // 1️⃣ Debug: dump the keys in `env` so we can confirm
    console.log("🔍 env keys in /api/auth:", Object.keys(env));
  
    // 2️⃣ Pull out your GitHub Client ID
    const client_id = env.GITHUB_CLIENT_ID;
  
    // 3️⃣ If it’s missing, return an explicit JSON error
    if (!client_id) {
      return new Response(
        JSON.stringify({
          error: "Missing GITHUB_CLIENT_ID in context.env",
          availableEnvKeys: Object.keys(env),
        }, null, 2),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  
    // 4️⃣ Build the OAuth authorize URL
    try {
      const url = new URL(request.url);
      const redirectUrl = new URL("https://github.com/login/oauth/authorize");
      redirectUrl.searchParams.set("client_id", client_id);
      redirectUrl.searchParams.set("redirect_uri", url.origin + "/api/callback");
      redirectUrl.searchParams.set("scope", "repo user");
      redirectUrl.searchParams.set(
        "state",
        crypto.getRandomValues(new Uint8Array(12)).join("")
      );
  
      return Response.redirect(redirectUrl.href, 301);
  
    } catch (error) {
      console.error("Error building OAuth URL:", error);
      return new Response(error.message, {
        status: 500,
        headers: { "Content-Type": "text/plain;charset=UTF-8" },
      });
    }
  }
  