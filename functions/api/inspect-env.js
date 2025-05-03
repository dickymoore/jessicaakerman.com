export async function GET() {
    return new Response(
      JSON.stringify({
        GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
        GITHUB_ID:        process.env.GITHUB_ID,
        GITHUB_CLIENT_SECRET_exists: !!process.env.GITHUB_CLIENT_SECRET,
        GITHUB_SECRET_exists:        !!process.env.GITHUB_SECRET,
      }, null, 2),
      { headers: { "Content-Type": "application/json" } }
    );
  }
  