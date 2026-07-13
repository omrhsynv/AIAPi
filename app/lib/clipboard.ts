/**
 * Copy text to the clipboard, resilient to non-secure contexts.
 *
 * `navigator.clipboard` only exists in secure contexts (HTTPS or localhost).
 * When the app is served over plain HTTP on a LAN IP/host it's `undefined`,
 * and calling `.writeText` throws synchronously — which is why the copy
 * buttons silently failed there. We try the modern API first, then fall back
 * to a hidden-textarea `execCommand("copy")`.
 *
 * Returns whether the copy succeeded so callers can toast accordingly.
 */
export async function copyText(text: string): Promise<boolean> {
    if (
        typeof navigator !== "undefined" &&
        navigator.clipboard &&
        typeof window !== "undefined" &&
        window.isSecureContext
    ) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch {
            // Permission/other failure — fall through to the legacy path.
        }
    }

    if (typeof document === "undefined") return false;

    try {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.top = "-9999px";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        ta.setSelectionRange(0, text.length);
        const ok = document.execCommand("copy");
        document.body.removeChild(ta);
        return ok;
    } catch {
        return false;
    }
}
