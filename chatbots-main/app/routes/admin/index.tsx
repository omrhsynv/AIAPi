// Redirect /admin to /admin/dashboard
export async function loader() {
    return new Response(null, {
        status: 302,
        headers: { Location: "/admin/dashboard" },
    });
}
