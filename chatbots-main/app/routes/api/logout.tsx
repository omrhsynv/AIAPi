// Server-side logout - clears all auth cookies
export async function action({ request }: { request: Request }) {
    // Get all cookies from request
    const cookieHeader = request.headers.get("cookie") || "";

    // Parse cookie names
    const cookieNames = cookieHeader
        .split(";")
        .map(c => c.trim().split("=")[0])
        .filter(Boolean);

    // Create Set-Cookie headers to expire all cookies
    const expireCookies = cookieNames.map(name =>
        `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax`
    );

    // Also explicitly clear known auth cookie names
    const authCookies = [
        "better-auth.session_token",
        "better-auth.session",
        "__session",
        "session",
        "auth_session",
    ];

    authCookies.forEach(name => {
        expireCookies.push(
            `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax`
        );
    });

    // Return redirect response with cookie clearing headers
    return new Response(null, {
        status: 302,
        headers: [
            ["Location", "/"],
            ...expireCookies.map(c => ["Set-Cookie", c] as [string, string])
        ],
    });
}

export async function loader({ request }: { request: Request }) {
    // Also handle GET requests for logout
    return action({ request });
}
