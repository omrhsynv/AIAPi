import { useEffect, useState } from "react";
import { Form, Link } from "react-router";
import { AlertCircle, ArrowLeft, Loader2, Lock, Mail, User } from "lucide-react";
import { BrandMark } from "~/components/brand-mark";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { auth } from "~/lib/auth.server";

interface ActionData {
  error?: string;
}

export async function action({ request }: { request: Request }): Promise<Response | ActionData> {
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const signUpResponse = await auth.api.signUpEmail({
      body: { email, password, name },
      asResponse: true,
    });

    if (!signUpResponse.ok) {
      const data = await signUpResponse.json().catch(() => ({}));
      return { error: data.message || "Kayıt sırasında bir hata oluştu" };
    }

    const loginResponse = await auth.api.signInEmail({
      body: { email, password },
      asResponse: true,
    });

    if (loginResponse.ok) {
      const setCookie = loginResponse.headers.get("set-cookie");
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/chat",
          ...(setCookie ? { "Set-Cookie": setCookie } : {}),
        },
      });
    }

    return { error: "Kayıt başarılı, ancak giriş yapılamadı. Lütfen giriş sayfasından deneyin." };
  } catch (error: any) {
    console.error("Register error:", error);
    return { error: error?.body?.message || "Kayıt sırasında bir hata oluştu" };
  }
}

export async function loader({ request }: { request: Request }): Promise<Response | object> {
  const session = await auth.api.getSession({ headers: request.headers });

  if (session?.user) {
    return new Response(null, {
      status: 302,
      headers: { Location: "/chat" },
    });
  }

  return {};
}

interface ComponentProps {
  actionData?: ActionData;
}

export default function Register({ actionData }: ComponentProps) {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (actionData?.error) {
      setIsLoading(false);
    }
  }, [actionData]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background p-4">
      <div className="pointer-events-none absolute inset-0 aris-hero-bg" />
      <div className="pointer-events-none absolute inset-0 aris-world-grid opacity-60" />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-white/70 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Ana Sayfaya Dön
          </Link>
          <div className="mb-4 flex justify-center">
            <div className="rounded-2xl border border-white/10 bg-[#25242f]/90 p-4 shadow-2xl shadow-black/25">
              <BrandMark size="lg" />
            </div>
          </div>
          <h1 className="text-3xl font-black text-white">Kayıt Ol</h1>
          <p className="mt-2 font-semibold text-white/65">ArisAI deneyimine katılın</p>
        </div>

        <Card className="border-white/10 bg-card/90 shadow-2xl shadow-black/15 backdrop-blur-xl">
          <CardContent className="pt-6">
            <Form method="post" className="space-y-4" onSubmit={() => setIsLoading(true)}>
              {actionData?.error && (
                <div className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {actionData.error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Ad Soyad</Label>
                <div className="group relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-[#21c6cc]" />
                  <Input id="name" name="name" type="text" placeholder="Adınız Soyadınız" required className="h-11 pl-10" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Adresi</Label>
                <div className="group relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-[#21c6cc]" />
                  <Input id="email" name="email" type="email" placeholder="ornek@email.com" required className="h-11 pl-10" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Şifre</Label>
                <div className="group relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-[#21c6cc]" />
                  <Input id="password" name="password" type="password" placeholder="********" required minLength={8} className="h-11 pl-10" />
                </div>
                <p className="text-xs text-muted-foreground">En az 8 karakter olmalıdır</p>
              </div>

              <Button
                type="submit"
                className="h-11 w-full bg-gradient-to-r from-[#8d36ff] via-[#d84fd2] to-[#21c6cc] font-bold text-white shadow-lg shadow-fuchsia-500/20 hover:brightness-110"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Kayıt yapılıyor...
                  </>
                ) : (
                  "Kayıt Ol"
                )}
              </Button>
            </Form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Zaten hesabınız var mı?{" "}
                <Link to="/login" className="font-bold text-primary hover:underline">
                  Giriş Yap
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
