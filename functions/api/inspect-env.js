// catch-all
export async function onRequest(context) {
    return new Response(JSON.stringify({
      GITHUB_CLIENT_ID: context.env.GITHUB_CLIENT_ID,
      GITHUB_ID:        context.env.GITHUB_ID,
      GITHUB_CLIENT_SECRET_exists: !!context.env.GITHUB_CLIENT_SECRET,
      GITHUB_SECRET_exists:        !!context.env.GITHUB_SECRET
    }, null, 2), {
      headers: { "Content-Type": "application/json" }
    });
  }
  