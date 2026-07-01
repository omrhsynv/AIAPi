import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Loader2, Save, Check } from "lucide-react";
import { prisma } from "~/lib/db.server";
import { toast } from "sonner";

interface LoaderData {
    settings: {
        id: string;
        appName: string;
        theme: string;
    };
}

export async function loader(): Promise<LoaderData> {
    let settings = await prisma.appSettings.findFirst({
        where: { id: "default" },
    });

    if (!settings) {
        settings = await prisma.appSettings.create({
            data: {
                id: "default",
                appName: "ArisAI",
                theme: "blue",
            },
        });
    }

    return { settings };
}

interface ComponentProps {
    loaderData: LoaderData;
}

export default function AdminSettings({ loaderData }: ComponentProps) {
    const { settings } = loaderData;
    const [appName, setAppName] = useState(settings.appName);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // TODO: Save settings via API
            await new Promise(resolve => setTimeout(resolve, 500));
            toast.success("Ayarlar kaydedildi");
        } catch (error) {
            toast.error("Ayarlar kaydedilemedi");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Ayarlar</h1>
                <p className="text-muted-foreground mt-1">Uygulama ayarlarını düzenleyin</p>
            </div>

            <div className="grid gap-6 max-w-2xl">
                {/* General Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle>Genel Ayarlar</CardTitle>
                        <CardDescription>Uygulama genel yapılandırması</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Uygulama Adı</Label>
                            <Input
                                value={appName}
                                onChange={(e) => setAppName(e.target.value)}
                                placeholder="ArisAI"
                            />
                        </div>

                        <Button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="gap-2 bg-gradient-to-r from-[#8d36ff] via-[#d84fd2] to-[#21c6cc] hover:brightness-110"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Kaydediliyor...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Kaydet
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>

                {/* Info Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Sistem Bilgisi</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between py-2 border-b">
                                <span className="text-muted-foreground">Versiyon</span>
                                <span className="font-medium">1.0.0</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                                <span className="text-muted-foreground">Framework</span>
                                <span className="font-medium">React Router 7</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                                <span className="text-muted-foreground">AI Provider</span>
                                <span className="font-medium">OpenAI</span>
                            </div>
                            <div className="flex justify-between py-2">
                                <span className="text-muted-foreground">Auth</span>
                                <span className="font-medium">BetterAuth</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
