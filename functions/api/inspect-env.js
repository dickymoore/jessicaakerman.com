export async function GET() {
    return new Response(
      JSON.stringify({
        GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
        GITHUB_ID:        process.env.GITHUB_ID,
        // don’t echo secrets in cleartext, just show if they exist
        GITHUB_CLIENT_SECRET_exists: !!process.env.GITHUB_CLIENT_SECRET,
        GITHUB_SECRET_exists:        !!process.env.GITHUB_SECRET,
      }, null, 2),
      { headers: { "Content-Type": "application/json" } }
    );
  }
  