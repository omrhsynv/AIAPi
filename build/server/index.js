import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter, UNSAFE_withComponentProps, Outlet, UNSAFE_withErrorBoundaryProps, isRouteErrorResponse, Meta, Links, ScrollRestoration, Scripts, useNavigation, Link, Form, useLocation, useNavigate, useParams, useSearchParams, useRevalidator } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { Loader2Icon, OctagonXIcon, TriangleAlertIcon, InfoIcon, CircleCheckIcon, Bot, Sun, Moon, LockKeyhole, UserRound, Sparkles, ArrowRight, Monitor, BadgeCheck, Gamepad2, Languages, BrainCircuit, MessageSquareText, ShieldCheck, CheckCircle2, ArrowLeft, AlertCircle, Mail, Lock, Loader2, User, XIcon, Menu, PanelLeftClose, Plus, PanelLeftOpen, MessageSquare, Trash2, LogOut, Settings, Volume2, VolumeX, Square, Mic, ChevronDown, Check, SendHorizontal, X, LayoutDashboard, Users, KeyRound, ExternalLink, TrendingUp, Globe, FileText, Save, Database, Upload, Terminal, Copy, UserPlus, Search, Shield, Ban, Activity, Coins, Globe2 } from "lucide-react";
import { useTheme, ThemeProvider } from "next-themes";
import { Toaster as Toaster$1, toast } from "sonner";
import NProgress from "nprogress";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as LabelPrimitive from "@radix-ui/react-label";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import OpenAI from "openai";
import { randomBytes, createHash, timingSafeEqual, createHmac, randomUUID } from "node:crypto";
import agoraToken from "agora-token";
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, unlinkSync } from "node:fs";
import os from "node:os";
import path from "node:path";
const streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
  if (request.method.toUpperCase() === "HEAD") {
    return new Response(null, {
      status: responseStatusCode,
      headers: responseHeaders
    });
  }
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let userAgent = request.headers.get("user-agent");
    let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
    let timeoutId = setTimeout(
      () => abort(),
      streamTimeout + 1e3
    );
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(ServerRouter, { context: routerContext, url: request.url }),
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough({
            final(callback) {
              clearTimeout(timeoutId);
              timeoutId = void 0;
              callback();
            }
          });
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          pipe(body);
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest,
  streamTimeout
}, Symbol.toStringTag, { value: "Module" }));
const Toaster = ({ ...props }) => {
  const { theme = "system" } = useTheme();
  return /* @__PURE__ */ jsx(
    Toaster$1,
    {
      theme,
      className: "toaster group",
      icons: {
        success: /* @__PURE__ */ jsx(CircleCheckIcon, { className: "size-4" }),
        info: /* @__PURE__ */ jsx(InfoIcon, { className: "size-4" }),
        warning: /* @__PURE__ */ jsx(TriangleAlertIcon, { className: "size-4" }),
        error: /* @__PURE__ */ jsx(OctagonXIcon, { className: "size-4" }),
        loading: /* @__PURE__ */ jsx(Loader2Icon, { className: "size-4 animate-spin" })
      },
      style: {
        "--normal-bg": "var(--popover)",
        "--normal-text": "var(--popover-foreground)",
        "--normal-border": "var(--border)",
        "--border-radius": "var(--radius)"
      },
      ...props
    }
  );
};
const links = () => [{
  rel: "preconnect",
  href: "https://fonts.googleapis.com"
}, {
  rel: "preconnect",
  href: "https://fonts.gstatic.com",
  crossOrigin: "anonymous"
}, {
  rel: "stylesheet",
  href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
}, {
  rel: "stylesheet",
  href: "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css",
  crossOrigin: "anonymous"
}];
function ProgressBar() {
  const navigation = useNavigation();
  useEffect(() => {
    if (navigation.state === "loading" || navigation.state === "submitting") {
      NProgress.start();
    } else {
      NProgress.done();
    }
  }, [navigation.state]);
  return null;
}
function Layout({
  children
}) {
  return /* @__PURE__ */ jsxs("html", {
    lang: "tr",
    suppressHydrationWarning: true,
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }), /* @__PURE__ */ jsx("meta", {
        name: "theme-color",
        content: "#3B82F6"
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {})]
    }), /* @__PURE__ */ jsxs("body", {
      className: "font-sans antialiased",
      suppressHydrationWarning: true,
      children: [/* @__PURE__ */ jsxs(ThemeProvider, {
        attribute: "class",
        defaultTheme: "system",
        enableSystem: true,
        disableTransitionOnChange: true,
        children: [/* @__PURE__ */ jsx(ProgressBar, {}), children, /* @__PURE__ */ jsx(Toaster, {
          richColors: true,
          position: "top-right"
        })]
      }), /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
    })]
  });
}
const root = UNSAFE_withComponentProps(function App() {
  return /* @__PURE__ */ jsx(Outlet, {});
});
const ErrorBoundary = UNSAFE_withErrorBoundaryProps(function ErrorBoundary2({
  error
}) {
  let message = "Hata!";
  let details = "Beklenmeyen bir hata oluştu.";
  let stack;
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Hata";
    details = error.status === 404 ? "Aradığınız sayfa bulunamadı." : error.statusText || details;
  }
  return /* @__PURE__ */ jsx("main", {
    className: "min-h-screen flex items-center justify-center bg-background",
    children: /* @__PURE__ */ jsxs("div", {
      className: "text-center p-8",
      children: [/* @__PURE__ */ jsx("h1", {
        className: "text-6xl font-bold text-[#21c6cc] mb-4",
        children: message
      }), /* @__PURE__ */ jsx("p", {
        className: "text-muted-foreground mb-6",
        children: details
      }), /* @__PURE__ */ jsx("a", {
        href: "/",
        className: "font-bold text-[#21c6cc] hover:underline",
        children: "Ana Sayfaya Dön"
      }), stack]
    })
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  Layout,
  default: root,
  links
}, Symbol.toStringTag, { value: "Module" }));
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      "data-slot": "button",
      "data-variant": variant,
      "data-size": size,
      className: cn(buttonVariants({ variant, size, className })),
      ...props
    }
  );
}
const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-11 w-11",
  lg: "h-16 w-16"
};
function BrandMark({ size = "md", showBot = false }) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `${sizeClasses[size]} aris-mark relative grid place-items-center shrink-0`,
      "aria-hidden": "true",
      children: [
        /* @__PURE__ */ jsx("span", { className: "aris-ray aris-ray-a" }),
        /* @__PURE__ */ jsx("span", { className: "aris-ray aris-ray-b" }),
        /* @__PURE__ */ jsx("span", { className: "aris-ray aris-ray-c" }),
        showBot && /* @__PURE__ */ jsx(Bot, { className: "relative z-10 h-1/2 w-1/2 text-white drop-shadow" })
      ]
    }
  );
}
function meta$1() {
  return [{
    title: "ArisAI - Akıllı Yapay Zeka Asistanınız"
  }, {
    name: "description",
    content: "ArisAI ile hızlı, güvenli ve anlaşılır yapay zeka deneyimi. Sohbet edin, fikir üretin ve işlerinizi kolaylaştırın."
  }];
}
const features = [{
  icon: BrainCircuit,
  title: "Akıllı yanıtlar",
  text: "Sorularınızı bağlama göre anlayan, net ve uygulanabilir cevaplar üretir."
}, {
  icon: MessageSquareText,
  title: "Sade sohbet akışı",
  text: "Karmaşadan uzak arayüz, kolay okunur geçmiş ve hızlı başlangıç."
}, {
  icon: ShieldCheck,
  title: "Kontrollü kullanım",
  text: "Hesap, asistan ve sohbet akışları güven hissi verecek şekilde düzenlendi."
}];
const quickSteps = ["Hesabını oluştur", "Asistanı seç", "Sohbete başla"];
const home = UNSAFE_withComponentProps(function Home() {
  const {
    theme,
    setTheme
  } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return /* @__PURE__ */ jsxs("div", {
    className: "min-h-screen overflow-hidden bg-background text-foreground",
    children: [/* @__PURE__ */ jsx("nav", {
      className: "fixed left-0 right-0 top-0 z-50 px-3 pt-3 sm:px-4",
      children: /* @__PURE__ */ jsxs("div", {
        className: "mx-auto flex h-16 max-w-7xl items-center justify-between rounded-2xl border border-white/10 bg-[#25242f]/90 px-3 shadow-2xl shadow-black/30 backdrop-blur-xl sm:px-5",
        children: [/* @__PURE__ */ jsxs(Link, {
          to: "/",
          className: "flex items-center gap-3 text-white",
          "aria-label": "ArisAI ana sayfa",
          children: [/* @__PURE__ */ jsx(BrandMark, {
            size: "sm"
          }), /* @__PURE__ */ jsx("span", {
            className: "text-xl font-extrabold tracking-tight",
            children: "ArisAI"
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "hidden items-center gap-7 text-sm font-bold text-white/70 md:flex",
          children: [/* @__PURE__ */ jsx("a", {
            href: "#features",
            className: "transition hover:text-white",
            children: "Özellikler"
          }), /* @__PURE__ */ jsx("a", {
            href: "#experience",
            className: "transition hover:text-white",
            children: "Deneyim"
          }), /* @__PURE__ */ jsx(Link, {
            to: "/chat",
            className: "transition hover:text-white",
            children: "Uygulama"
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "flex items-center gap-2",
          children: [mounted && /* @__PURE__ */ jsx(Button, {
            variant: "ghost",
            size: "icon",
            onClick: () => setTheme(theme === "dark" ? "light" : "dark"),
            className: "text-white/80 hover:bg-white/10 hover:text-white",
            "aria-label": "Temayı değiştir",
            children: theme === "dark" ? /* @__PURE__ */ jsx(Sun, {
              className: "h-5 w-5"
            }) : /* @__PURE__ */ jsx(Moon, {
              className: "h-5 w-5"
            })
          }), /* @__PURE__ */ jsx(Button, {
            asChild: true,
            className: "h-11 rounded-xl bg-white/10 px-4 font-extrabold text-white hover:bg-white/15",
            children: /* @__PURE__ */ jsxs(Link, {
              to: "/login",
              children: [/* @__PURE__ */ jsx(LockKeyhole, {
                className: "h-4 w-4"
              }), "Giriş"]
            })
          }), /* @__PURE__ */ jsx(Button, {
            asChild: true,
            className: "hidden h-11 rounded-xl bg-gradient-to-r from-[#8d36ff] via-[#d84fd2] to-[#21c6cc] px-5 font-extrabold text-white shadow-lg shadow-fuchsia-500/25 hover:brightness-110 sm:inline-flex",
            children: /* @__PURE__ */ jsxs(Link, {
              to: "/register",
              children: [/* @__PURE__ */ jsx(UserRound, {
                className: "h-4 w-4"
              }), "Hemen Başla"]
            })
          })]
        })]
      })
    }), /* @__PURE__ */ jsxs("section", {
      className: "relative min-h-screen px-4 pb-14 pt-28 sm:pt-32",
      children: [/* @__PURE__ */ jsx("div", {
        className: "absolute inset-0 aris-hero-bg"
      }), /* @__PURE__ */ jsx("div", {
        className: "absolute inset-0 aris-world-grid opacity-70"
      }), /* @__PURE__ */ jsx("div", {
        className: "absolute inset-0 bg-[linear-gradient(180deg,rgba(8,10,22,0.12),var(--background)_94%)]"
      }), /* @__PURE__ */ jsxs("div", {
        className: "relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.02fr_0.98fr]",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "max-w-3xl text-center lg:text-left",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "mb-7 inline-flex items-center gap-2 rounded-md bg-[#ffc20a] px-4 py-2 text-sm font-black uppercase tracking-wide text-[#2b2230] shadow-xl shadow-yellow-500/20",
            children: [/* @__PURE__ */ jsx(Sparkles, {
              className: "h-4 w-4"
            }), "Yeni nesil AI deneyimi"]
          }), /* @__PURE__ */ jsxs("h1", {
            className: "mx-auto max-w-4xl text-4xl font-black leading-tight tracking-tight text-white drop-shadow-2xl sm:text-6xl lg:mx-0 lg:text-7xl",
            children: ["Gerçekliğin ötesinde,", /* @__PURE__ */ jsx("span", {
              className: "block bg-gradient-to-r from-[#21c6cc] via-[#7bb7ff] to-[#d84fd2] bg-clip-text text-transparent",
              children: "anlaşılır bir zeka alanı."
            })]
          }), /* @__PURE__ */ jsx("p", {
            className: "mx-auto mt-7 max-w-2xl text-lg font-semibold leading-8 text-white/76 sm:text-xl lg:mx-0",
            children: "ArisAI; sohbeti, fikir üretmeyi ve karar vermeyi tek ekranda sade hale getirir. Aris888'in neon metaverse ruhunu daha temiz, hızlı ve kullanıcı dostu bir deneyime taşır."
          }), /* @__PURE__ */ jsxs("div", {
            className: "mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start",
            children: [/* @__PURE__ */ jsx(Button, {
              size: "lg",
              asChild: true,
              className: "h-14 w-full rounded-xl bg-gradient-to-r from-[#ff8b37] via-[#d84fd2] to-[#7bb7ff] px-7 text-base font-extrabold text-white shadow-xl shadow-fuchsia-500/25 hover:brightness-110 sm:w-auto",
              children: /* @__PURE__ */ jsxs(Link, {
                to: "/register",
                children: ["Şimdi Başlat", /* @__PURE__ */ jsx(ArrowRight, {
                  className: "h-5 w-5"
                })]
              })
            }), /* @__PURE__ */ jsx(Button, {
              size: "lg",
              variant: "outline",
              asChild: true,
              className: "h-14 w-full rounded-xl border-white/20 bg-white/10 px-7 text-base font-extrabold text-white backdrop-blur hover:bg-white/15 sm:w-auto",
              children: /* @__PURE__ */ jsxs(Link, {
                to: "/chat",
                children: ["Uygulamaya Git", /* @__PURE__ */ jsx(Monitor, {
                  className: "h-5 w-5"
                })]
              })
            })]
          }), /* @__PURE__ */ jsx("div", {
            className: "mt-8 grid gap-3 text-left sm:grid-cols-3",
            children: quickSteps.map((step, index) => /* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-3 rounded-xl border border-white/10 bg-white/8 px-4 py-3 text-sm font-bold text-white/82 backdrop-blur",
              children: [/* @__PURE__ */ jsx("span", {
                className: "grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[#21c6cc]/18 text-[#7df4f2]",
                children: index + 1
              }), step]
            }, step))
          })]
        }), /* @__PURE__ */ jsxs("div", {
          id: "experience",
          className: "relative",
          children: [/* @__PURE__ */ jsx("div", {
            className: "absolute -inset-5 rounded-[2rem] bg-gradient-to-br from-[#21c6cc]/25 via-[#8d36ff]/25 to-[#d84fd2]/25 blur-2xl"
          }), /* @__PURE__ */ jsxs("div", {
            className: "relative overflow-hidden rounded-2xl border border-white/12 bg-[#141524]/92 p-4 shadow-2xl shadow-black/35 backdrop-blur-xl sm:p-5",
            children: [/* @__PURE__ */ jsxs("div", {
              className: "mb-5 flex items-center justify-between rounded-xl bg-white/8 px-4 py-3 text-white",
              children: [/* @__PURE__ */ jsxs("div", {
                className: "flex items-center gap-3",
                children: [/* @__PURE__ */ jsx(BrandMark, {
                  size: "sm"
                }), /* @__PURE__ */ jsxs("div", {
                  children: [/* @__PURE__ */ jsx("p", {
                    className: "text-sm font-black",
                    children: "ArisAI Kontrol"
                  }), /* @__PURE__ */ jsx("p", {
                    className: "text-xs font-semibold text-white/55",
                    children: "Canlı asistan oturumu"
                  })]
                })]
              }), /* @__PURE__ */ jsx(BadgeCheck, {
                className: "h-5 w-5 text-[#21c6cc]"
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "rounded-xl border border-white/10 bg-[#0d1020]/80 p-4",
              children: [/* @__PURE__ */ jsxs("div", {
                className: "mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-[#ffc20a]",
                children: [/* @__PURE__ */ jsx("span", {
                  className: "h-2 w-2 rounded-full bg-[#ffc20a]"
                }), "Hızlı iş akışı"]
              }), /* @__PURE__ */ jsxs("div", {
                className: "grid gap-3",
                children: [/* @__PURE__ */ jsx("div", {
                  className: "ml-auto max-w-[86%] rounded-xl bg-gradient-to-r from-[#8d36ff] to-[#d84fd2] px-4 py-3 text-sm font-semibold text-white",
                  children: "Kampanya metnini daha net ve güven veren bir tona getir."
                }), /* @__PURE__ */ jsx("div", {
                  className: "max-w-[94%] rounded-xl border border-white/10 bg-white/8 px-4 py-4 text-sm leading-6 text-white/82",
                  children: "Elbette. Mesajı üç parçaya ayırdım: değer önerisi, güven hissi ve net başlangıç. Dilersen daha kurumsal veya daha enerjik bir tona da çevirebilirim."
                })]
              })]
            }), /* @__PURE__ */ jsx("div", {
              className: "mt-4 grid grid-cols-3 gap-3 text-white",
              children: [[Gamepad2, "Metaverse"], [Languages, "Türkçe"], [Bot, "AI"]].map(([Icon, label]) => /* @__PURE__ */ jsxs("div", {
                className: "rounded-xl border border-white/10 bg-white/7 p-4 text-center",
                children: [/* @__PURE__ */ jsx(Icon, {
                  className: "mx-auto mb-2 h-5 w-5 text-[#21c6cc]"
                }), /* @__PURE__ */ jsx("p", {
                  className: "text-xs font-black",
                  children: label
                })]
              }, label))
            })]
          })]
        })]
      })]
    }), /* @__PURE__ */ jsx("section", {
      id: "features",
      className: "relative px-4 py-20",
      children: /* @__PURE__ */ jsxs("div", {
        className: "mx-auto max-w-7xl",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "mb-12 max-w-3xl",
          children: [/* @__PURE__ */ jsx("p", {
            className: "mb-3 text-sm font-black uppercase tracking-wide text-[#21c6cc]",
            children: "Kullanıcı dostu akış"
          }), /* @__PURE__ */ jsx("h2", {
            className: "text-3xl font-black tracking-tight sm:text-5xl",
            children: "Gücü gösteren, kullanımı kolaylaştıran bir asistan platformu."
          })]
        }), /* @__PURE__ */ jsx("div", {
          className: "grid gap-5 md:grid-cols-3",
          children: features.map((feature) => /* @__PURE__ */ jsxs("article", {
            className: "group rounded-2xl border border-border bg-card/90 p-7 shadow-lg shadow-black/5 transition hover:-translate-y-1 hover:border-[#21c6cc]/50 hover:shadow-cyan-500/10",
            children: [/* @__PURE__ */ jsx("div", {
              className: "mb-6 grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-[#21c6cc]/20 to-[#8d36ff]/20 text-[#21c6cc] ring-1 ring-[#21c6cc]/25 transition group-hover:scale-105",
              children: /* @__PURE__ */ jsx(feature.icon, {
                className: "h-6 w-6"
              })
            }), /* @__PURE__ */ jsx("h3", {
              className: "mb-3 text-xl font-black",
              children: feature.title
            }), /* @__PURE__ */ jsx("p", {
              className: "leading-7 text-muted-foreground",
              children: feature.text
            })]
          }, feature.title))
        })]
      })
    }), /* @__PURE__ */ jsx("section", {
      className: "px-4 py-20",
      children: /* @__PURE__ */ jsx("div", {
        className: "mx-auto max-w-7xl overflow-hidden rounded-2xl border border-white/10 bg-[#25242f] p-8 text-white shadow-2xl shadow-black/20 sm:p-12",
        children: /* @__PURE__ */ jsxs("div", {
          className: "grid items-center gap-8 lg:grid-cols-[1fr_auto]",
          children: [/* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsxs("div", {
              className: "mb-4 inline-flex items-center gap-2 rounded-lg bg-white/8 px-3 py-2 text-sm font-bold text-[#7df4f2]",
              children: [/* @__PURE__ */ jsx(CheckCircle2, {
                className: "h-4 w-4"
              }), "Hazır deneyim"]
            }), /* @__PURE__ */ jsx("h2", {
              className: "text-3xl font-black tracking-tight sm:text-4xl",
              children: "ArisAI ile hemen sohbete başlayın."
            }), /* @__PURE__ */ jsx("p", {
              className: "mt-4 max-w-2xl text-white/70",
              children: "Hesabınızı oluşturun, uygun asistanı seçin ve fikirlerinizi daha hızlı ilerletin."
            })]
          }), /* @__PURE__ */ jsx(Button, {
            size: "lg",
            asChild: true,
            className: "h-14 rounded-xl bg-gradient-to-r from-[#21c6cc] via-[#8d36ff] to-[#d84fd2] px-7 text-base font-extrabold text-white hover:brightness-110",
            children: /* @__PURE__ */ jsxs(Link, {
              to: "/register",
              children: ["Ücretsiz Hesap Oluştur", /* @__PURE__ */ jsx(ArrowRight, {
                className: "h-5 w-5"
              })]
            })
          })]
        })
      })
    }), /* @__PURE__ */ jsx("footer", {
      className: "border-t border-border/70 px-4 py-10",
      children: /* @__PURE__ */ jsxs("div", {
        className: "mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 text-center sm:flex-row sm:text-left",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "flex items-center gap-3",
          children: [/* @__PURE__ */ jsx(BrandMark, {
            size: "sm"
          }), /* @__PURE__ */ jsx("span", {
            className: "text-lg font-black",
            children: "ArisAI"
          })]
        }), /* @__PURE__ */ jsx("p", {
          className: "text-sm text-muted-foreground",
          children: "2026 ArisAI. Tüm hakları saklıdır."
        })]
      })
    })]
  });
});
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: home,
  meta: meta$1
}, Symbol.toStringTag, { value: "Module" }));
function Card({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card",
      className: cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      ),
      ...props
    }
  );
}
function CardHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card-header",
      className: cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      ),
      ...props
    }
  );
}
function CardTitle({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card-title",
      className: cn("leading-none font-semibold", className),
      ...props
    }
  );
}
function CardDescription({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card-description",
      className: cn("text-muted-foreground text-sm", className),
      ...props
    }
  );
}
function CardContent({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card-content",
      className: cn("px-6", className),
      ...props
    }
  );
}
function Input({ className, type, ...props }) {
  return /* @__PURE__ */ jsx(
    "input",
    {
      type,
      "data-slot": "input",
      className: cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      ),
      ...props
    }
  );
}
function Label({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    LabelPrimitive.Root,
    {
      "data-slot": "label",
      className: cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      ),
      ...props
    }
  );
}
const prisma = globalThis.__prisma__ ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") {
  globalThis.__prisma__ = prisma;
}
const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    // 7 days
    updateAge: 60 * 60 * 24
    // 1 day
  },
  trustedOrigins: [
    "http://localhost:5173",
    "http://localhost:3000",
    process.env.APP_URL || ""
  ].filter(Boolean)
});
async function action$m({
  request
}) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  try {
    const response = await auth.api.signInEmail({
      body: {
        email,
        password
      },
      asResponse: true
    });
    if (!response.ok) {
      return {
        error: "Geçersiz email veya şifre"
      };
    }
    const setCookie = response.headers.get("set-cookie");
    const user = await prisma.user.findUnique({
      where: {
        email
      },
      select: {
        role: true
      }
    });
    const redirectUrl = user?.role === "admin" ? "/admin/dashboard" : "/chat";
    return new Response(null, {
      status: 302,
      headers: {
        Location: redirectUrl,
        ...setCookie ? {
          "Set-Cookie": setCookie
        } : {}
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    return {
      error: "Giriş sırasında bir hata oluştu"
    };
  }
}
async function loader$x({
  request
}) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    });
    if (session?.user) {
      const user = await prisma.user.findUnique({
        where: {
          id: session.user.id
        },
        select: {
          role: true
        }
      });
      const redirectUrl = user?.role === "admin" ? "/admin/dashboard" : "/chat";
      return new Response(null, {
        status: 302,
        headers: {
          Location: redirectUrl
        }
      });
    }
  } catch (error) {
    console.log("Session check failed:", error);
  }
  return {};
}
const login = UNSAFE_withComponentProps(function Login({
  actionData
}) {
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (actionData?.error) {
      setIsLoading(false);
    }
  }, [actionData]);
  return /* @__PURE__ */ jsxs("div", {
    className: "relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background p-4",
    children: [/* @__PURE__ */ jsx("div", {
      className: "pointer-events-none absolute inset-0 aris-hero-bg"
    }), /* @__PURE__ */ jsx("div", {
      className: "pointer-events-none absolute inset-0 aris-world-grid opacity-60"
    }), /* @__PURE__ */ jsxs("div", {
      className: "relative z-10 w-full max-w-md",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "mb-8 text-center",
        children: [/* @__PURE__ */ jsxs(Link, {
          to: "/",
          className: "mb-6 inline-flex items-center gap-2 text-sm font-bold text-white/70 transition-colors hover:text-white",
          children: [/* @__PURE__ */ jsx(ArrowLeft, {
            className: "h-4 w-4"
          }), "Ana Sayfaya Dön"]
        }), /* @__PURE__ */ jsx("div", {
          className: "mb-4 flex justify-center",
          children: /* @__PURE__ */ jsx("div", {
            className: "rounded-2xl border border-white/10 bg-[#25242f]/90 p-4 shadow-2xl shadow-black/25",
            children: /* @__PURE__ */ jsx(BrandMark, {
              size: "lg"
            })
          })
        }), /* @__PURE__ */ jsx("h1", {
          className: "text-3xl font-black text-white",
          children: "Giriş Yap"
        }), /* @__PURE__ */ jsx("p", {
          className: "mt-2 font-semibold text-white/65",
          children: "ArisAI hesabınıza giriş yapın"
        })]
      }), /* @__PURE__ */ jsx(Card, {
        className: "border-white/10 bg-card/90 shadow-2xl shadow-black/15 backdrop-blur-xl",
        children: /* @__PURE__ */ jsxs(CardContent, {
          className: "pt-6",
          children: [/* @__PURE__ */ jsxs(Form, {
            method: "post",
            className: "space-y-4",
            onSubmit: () => setIsLoading(true),
            children: [actionData?.error && /* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive",
              children: [/* @__PURE__ */ jsx(AlertCircle, {
                className: "h-4 w-4 shrink-0"
              }), actionData.error]
            }), /* @__PURE__ */ jsxs("div", {
              className: "space-y-2",
              children: [/* @__PURE__ */ jsx(Label, {
                htmlFor: "email",
                children: "Email Adresi"
              }), /* @__PURE__ */ jsxs("div", {
                className: "group relative",
                children: [/* @__PURE__ */ jsx(Mail, {
                  className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-[#21c6cc]"
                }), /* @__PURE__ */ jsx(Input, {
                  id: "email",
                  name: "email",
                  type: "email",
                  placeholder: "ornek@email.com",
                  required: true,
                  className: "h-11 pl-10"
                })]
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "space-y-2",
              children: [/* @__PURE__ */ jsx(Label, {
                htmlFor: "password",
                children: "Şifre"
              }), /* @__PURE__ */ jsxs("div", {
                className: "group relative",
                children: [/* @__PURE__ */ jsx(Lock, {
                  className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-[#21c6cc]"
                }), /* @__PURE__ */ jsx(Input, {
                  id: "password",
                  name: "password",
                  type: "password",
                  placeholder: "********",
                  required: true,
                  className: "h-11 pl-10"
                })]
              })]
            }), /* @__PURE__ */ jsx(Button, {
              type: "submit",
              className: "h-11 w-full bg-gradient-to-r from-[#8d36ff] via-[#d84fd2] to-[#21c6cc] font-bold text-white shadow-lg shadow-fuchsia-500/20 hover:brightness-110",
              disabled: isLoading,
              children: isLoading ? /* @__PURE__ */ jsxs(Fragment, {
                children: [/* @__PURE__ */ jsx(Loader2, {
                  className: "mr-2 h-4 w-4 animate-spin"
                }), "Giriş yapılıyor..."]
              }) : "Giriş Yap"
            })]
          }), /* @__PURE__ */ jsx("div", {
            className: "mt-6 text-center",
            children: /* @__PURE__ */ jsxs("p", {
              className: "text-sm text-muted-foreground",
              children: ["Hesabınız yok mu?", " ", /* @__PURE__ */ jsx(Link, {
                to: "/register",
                className: "font-bold text-primary hover:underline",
                children: "Kayıt Ol"
              })]
            })
          })]
        })
      })]
    })]
  });
});
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$m,
  default: login,
  loader: loader$x
}, Symbol.toStringTag, { value: "Module" }));
async function action$l({
  request
}) {
  const formData = await request.formData();
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");
  try {
    const signUpResponse = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name
      },
      asResponse: true
    });
    if (!signUpResponse.ok) {
      const data = await signUpResponse.json().catch(() => ({}));
      return {
        error: data.message || "Kayıt sırasında bir hata oluştu"
      };
    }
    const loginResponse = await auth.api.signInEmail({
      body: {
        email,
        password
      },
      asResponse: true
    });
    if (loginResponse.ok) {
      const setCookie = loginResponse.headers.get("set-cookie");
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/chat",
          ...setCookie ? {
            "Set-Cookie": setCookie
          } : {}
        }
      });
    }
    return {
      error: "Kayıt başarılı, ancak giriş yapılamadı. Lütfen giriş sayfasından deneyin."
    };
  } catch (error) {
    console.error("Register error:", error);
    return {
      error: error?.body?.message || "Kayıt sırasında bir hata oluştu"
    };
  }
}
async function loader$w({
  request
}) {
  const session = await auth.api.getSession({
    headers: request.headers
  });
  if (session?.user) {
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/chat"
      }
    });
  }
  return {};
}
const register = UNSAFE_withComponentProps(function Register({
  actionData
}) {
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (actionData?.error) {
      setIsLoading(false);
    }
  }, [actionData]);
  return /* @__PURE__ */ jsxs("div", {
    className: "relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background p-4",
    children: [/* @__PURE__ */ jsx("div", {
      className: "pointer-events-none absolute inset-0 aris-hero-bg"
    }), /* @__PURE__ */ jsx("div", {
      className: "pointer-events-none absolute inset-0 aris-world-grid opacity-60"
    }), /* @__PURE__ */ jsxs("div", {
      className: "relative z-10 w-full max-w-md",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "mb-8 text-center",
        children: [/* @__PURE__ */ jsxs(Link, {
          to: "/",
          className: "mb-6 inline-flex items-center gap-2 text-sm font-bold text-white/70 transition-colors hover:text-white",
          children: [/* @__PURE__ */ jsx(ArrowLeft, {
            className: "h-4 w-4"
          }), "Ana Sayfaya Dön"]
        }), /* @__PURE__ */ jsx("div", {
          className: "mb-4 flex justify-center",
          children: /* @__PURE__ */ jsx("div", {
            className: "rounded-2xl border border-white/10 bg-[#25242f]/90 p-4 shadow-2xl shadow-black/25",
            children: /* @__PURE__ */ jsx(BrandMark, {
              size: "lg"
            })
          })
        }), /* @__PURE__ */ jsx("h1", {
          className: "text-3xl font-black text-white",
          children: "Kayıt Ol"
        }), /* @__PURE__ */ jsx("p", {
          className: "mt-2 font-semibold text-white/65",
          children: "ArisAI deneyimine katılın"
        })]
      }), /* @__PURE__ */ jsx(Card, {
        className: "border-white/10 bg-card/90 shadow-2xl shadow-black/15 backdrop-blur-xl",
        children: /* @__PURE__ */ jsxs(CardContent, {
          className: "pt-6",
          children: [/* @__PURE__ */ jsxs(Form, {
            method: "post",
            className: "space-y-4",
            onSubmit: () => setIsLoading(true),
            children: [actionData?.error && /* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive",
              children: [/* @__PURE__ */ jsx(AlertCircle, {
                className: "h-4 w-4 shrink-0"
              }), actionData.error]
            }), /* @__PURE__ */ jsxs("div", {
              className: "space-y-2",
              children: [/* @__PURE__ */ jsx(Label, {
                htmlFor: "name",
                children: "Ad Soyad"
              }), /* @__PURE__ */ jsxs("div", {
                className: "group relative",
                children: [/* @__PURE__ */ jsx(User, {
                  className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-[#21c6cc]"
                }), /* @__PURE__ */ jsx(Input, {
                  id: "name",
                  name: "name",
                  type: "text",
                  placeholder: "Adınız Soyadınız",
                  required: true,
                  className: "h-11 pl-10"
                })]
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "space-y-2",
              children: [/* @__PURE__ */ jsx(Label, {
                htmlFor: "email",
                children: "Email Adresi"
              }), /* @__PURE__ */ jsxs("div", {
                className: "group relative",
                children: [/* @__PURE__ */ jsx(Mail, {
                  className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-[#21c6cc]"
                }), /* @__PURE__ */ jsx(Input, {
                  id: "email",
                  name: "email",
                  type: "email",
                  placeholder: "ornek@email.com",
                  required: true,
                  className: "h-11 pl-10"
                })]
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "space-y-2",
              children: [/* @__PURE__ */ jsx(Label, {
                htmlFor: "password",
                children: "Şifre"
              }), /* @__PURE__ */ jsxs("div", {
                className: "group relative",
                children: [/* @__PURE__ */ jsx(Lock, {
                  className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-[#21c6cc]"
                }), /* @__PURE__ */ jsx(Input, {
                  id: "password",
                  name: "password",
                  type: "password",
                  placeholder: "********",
                  required: true,
                  minLength: 8,
                  className: "h-11 pl-10"
                })]
              }), /* @__PURE__ */ jsx("p", {
                className: "text-xs text-muted-foreground",
                children: "En az 8 karakter olmalıdır"
              })]
            }), /* @__PURE__ */ jsx(Button, {
              type: "submit",
              className: "h-11 w-full bg-gradient-to-r from-[#8d36ff] via-[#d84fd2] to-[#21c6cc] font-bold text-white shadow-lg shadow-fuchsia-500/20 hover:brightness-110",
              disabled: isLoading,
              children: isLoading ? /* @__PURE__ */ jsxs(Fragment, {
                children: [/* @__PURE__ */ jsx(Loader2, {
                  className: "mr-2 h-4 w-4 animate-spin"
                }), "Kayıt yapılıyor..."]
              }) : "Kayıt Ol"
            })]
          }), /* @__PURE__ */ jsx("div", {
            className: "mt-6 text-center",
            children: /* @__PURE__ */ jsxs("p", {
              className: "text-sm text-muted-foreground",
              children: ["Zaten hesabınız var mı?", " ", /* @__PURE__ */ jsx(Link, {
                to: "/login",
                className: "font-bold text-primary hover:underline",
                children: "Giriş Yap"
              })]
            })
          })]
        })
      })]
    })]
  });
});
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$l,
  default: register,
  loader: loader$w
}, Symbol.toStringTag, { value: "Module" }));
const meta = () => [{
  title: "Agent API — Dokümantasyon"
}, {
  name: "robots",
  content: "noindex"
}];
async function loader$v() {
  const appUrl = process.env.APP_URL || "";
  return {
    appUrl
  };
}
const STATUS_CODES = [{
  code: "200",
  label: "OK",
  when: "İstek başarılı. Yanıt gövdesi akış (streaming) olarak düz metin döner."
}, {
  code: "400",
  label: "Bad Request",
  when: "Geçersiz JSON gövdesi ya da geçerli mesaj bulunamadı."
}, {
  code: "401",
  label: "Unauthorized",
  when: "API anahtarı eksik ya da tanınmıyor."
}, {
  code: "403",
  label: "Forbidden",
  when: "Anahtar iptal edilmiş, hedef asistan pasif ya da anahtarın bu asistana izni yok."
}, {
  code: "404",
  label: "Not Found",
  when: "Belirtilen id/slug ile asistan bulunamadı."
}, {
  code: "405",
  label: "Method Not Allowed",
  when: "POST dışında bir HTTP metodu kullanıldı."
}, {
  code: "500",
  label: "Internal Server Error",
  when: "Sunucu tarafında beklenmeyen hata (ör. model sağlayıcısı)."
}];
function Section({
  title,
  children
}) {
  return /* @__PURE__ */ jsxs("section", {
    className: "space-y-3",
    children: [/* @__PURE__ */ jsx("h2", {
      className: "text-xl font-semibold text-white",
      children: title
    }), children]
  });
}
function Code({
  children
}) {
  return /* @__PURE__ */ jsx("pre", {
    className: "overflow-x-auto rounded-lg border border-white/10 bg-black/40 p-4 text-sm leading-relaxed text-slate-200",
    children: /* @__PURE__ */ jsx("code", {
      children
    })
  });
}
const agentApi = UNSAFE_withComponentProps(function AgentApiDocs({
  loaderData
}) {
  const base = loaderData.appUrl || "https://<host>";
  const endpoint = `${base}/api/v1/agents/:agent`;
  const example = `${base}/api/v1/agents/ustun-zeka`;
  return /* @__PURE__ */ jsx("div", {
    className: "min-h-screen bg-[#0d0e1a] text-slate-300",
    children: /* @__PURE__ */ jsxs("div", {
      className: "mx-auto max-w-3xl px-6 py-12 space-y-10",
      children: [/* @__PURE__ */ jsxs("header", {
        className: "space-y-2",
        children: [/* @__PURE__ */ jsx("p", {
          className: "text-sm font-medium text-[#21c6cc]",
          children: "ArisAI"
        }), /* @__PURE__ */ jsx("h1", {
          className: "text-3xl font-bold text-white",
          children: "Agent API"
        }), /* @__PURE__ */ jsx("p", {
          className: "text-slate-400",
          children: "Bir asistanı, tarayıcı oturumu olmadan, API anahtarı ile programatik olarak çağırın. Yanıt gerçek zamanlı olarak akış halinde döner."
        })]
      }), /* @__PURE__ */ jsxs(Section, {
        title: "Endpoint",
        children: [/* @__PURE__ */ jsxs(Code, {
          children: [/* @__PURE__ */ jsx("span", {
            className: "font-semibold text-[#21c6cc]",
            children: "POST"
          }), " ", endpoint]
        }), /* @__PURE__ */ jsxs("p", {
          className: "text-sm text-slate-400",
          children: [/* @__PURE__ */ jsx("code", {
            className: "rounded bg-white/10 px-1",
            children: ":agent"
          }), " hedef asistanın", " ", /* @__PURE__ */ jsx("strong", {
            className: "text-slate-200",
            children: "id"
          }), " veya", " ", /* @__PURE__ */ jsx("strong", {
            className: "text-slate-200",
            children: "slug"
          }), " değeridir. API anahtarı çağrıyı yetkilendirir; aynı anahtar ile farklı asistanlar çağrılabilir. Slug yönetim panelindeki asistan ayarlarından belirlenir."]
        })]
      }), /* @__PURE__ */ jsxs(Section, {
        title: "Kimlik Doğrulama",
        children: [/* @__PURE__ */ jsxs("p", {
          className: "text-sm",
          children: ["Anahtarı ", /* @__PURE__ */ jsx("code", {
            className: "rounded bg-white/10 px-1",
            children: "Authorization"
          }), " ", "başlığında (Bearer) ya da ", /* @__PURE__ */ jsx("code", {
            className: "rounded bg-white/10 px-1",
            children: "x-api-key"
          }), " ", "başlığında gönderin:"]
        }), /* @__PURE__ */ jsx(Code, {
          children: `Authorization: Bearer sk_agent_xxxxxxxx
# veya
x-api-key: sk_agent_xxxxxxxx`
        })]
      }), /* @__PURE__ */ jsxs(Section, {
        title: "İstek Gövdesi",
        children: [/* @__PURE__ */ jsxs("p", {
          className: "text-sm",
          children: ["JSON. İki biçimden biri kabul edilir — çok turlu bağlam için", " ", /* @__PURE__ */ jsx("code", {
            className: "rounded bg-white/10 px-1",
            children: "messages"
          }), ", tek mesaj için", " ", /* @__PURE__ */ jsx("code", {
            className: "rounded bg-white/10 px-1",
            children: "message"
          }), ":"]
        }), /* @__PURE__ */ jsx(Code, {
          children: `{
  "messages": [
    { "role": "user", "content": "Merhaba" },
    { "role": "assistant", "content": "Selam! Nasıl yardımcı olabilirim?" },
    { "role": "user", "content": "Bana bir özet çıkar" }
  ]
}

// veya kısayol:
{ "message": "Merhaba" }`
        }), /* @__PURE__ */ jsxs("ul", {
          className: "list-disc space-y-1 pl-5 text-sm text-slate-400",
          children: [/* @__PURE__ */ jsxs("li", {
            children: [/* @__PURE__ */ jsx("code", {
              className: "rounded bg-white/10 px-1",
              children: "role"
            }), ": ", /* @__PURE__ */ jsx("code", {
              children: '"user"'
            }), " veya ", /* @__PURE__ */ jsx("code", {
              children: '"assistant"'
            }), "."]
          }), /* @__PURE__ */ jsxs("li", {
            children: [/* @__PURE__ */ jsx("code", {
              className: "rounded bg-white/10 px-1",
              children: "content"
            }), ": boş olmayan metin."]
          }), /* @__PURE__ */ jsx("li", {
            children: "Geçersiz girişler atılır; bağlam son 50 mesajla sınırlanır."
          }), /* @__PURE__ */ jsx("li", {
            children: "İstek durumsuzdur (stateless): geçmiş sunucuda saklanmaz, her istekte gönderilir."
          })]
        })]
      }), /* @__PURE__ */ jsxs(Section, {
        title: "Yanıt",
        children: [/* @__PURE__ */ jsxs("p", {
          className: "text-sm",
          children: [/* @__PURE__ */ jsx("code", {
            className: "rounded bg-white/10 px-1",
            children: "200"
          }), " durumunda gövde,", " ", /* @__PURE__ */ jsx("code", {
            className: "rounded bg-white/10 px-1",
            children: "text/plain; charset=utf-8"
          }), " ", "olarak parça parça (chunked) akan model çıktısıdır. Akışı satır satır okuyup ekrana yazdırabilirsiniz. Hatalar JSON olarak döner:"]
        }), /* @__PURE__ */ jsx(Code, {
          children: `{ "error": "Invalid API key" }`
        })]
      }), /* @__PURE__ */ jsx(Section, {
        title: "Durum Kodları",
        children: /* @__PURE__ */ jsx("div", {
          className: "overflow-hidden rounded-lg border border-white/10",
          children: /* @__PURE__ */ jsxs("table", {
            className: "w-full text-left text-sm",
            children: [/* @__PURE__ */ jsx("thead", {
              className: "bg-white/5 text-slate-200",
              children: /* @__PURE__ */ jsxs("tr", {
                children: [/* @__PURE__ */ jsx("th", {
                  className: "px-4 py-2 font-semibold",
                  children: "Kod"
                }), /* @__PURE__ */ jsx("th", {
                  className: "px-4 py-2 font-semibold",
                  children: "Anlam"
                }), /* @__PURE__ */ jsx("th", {
                  className: "px-4 py-2 font-semibold",
                  children: "Ne zaman"
                })]
              })
            }), /* @__PURE__ */ jsx("tbody", {
              children: STATUS_CODES.map((s) => /* @__PURE__ */ jsxs("tr", {
                className: "border-t border-white/10",
                children: [/* @__PURE__ */ jsx("td", {
                  className: "px-4 py-2 font-mono text-[#21c6cc]",
                  children: s.code
                }), /* @__PURE__ */ jsx("td", {
                  className: "px-4 py-2 text-slate-200",
                  children: s.label
                }), /* @__PURE__ */ jsx("td", {
                  className: "px-4 py-2 text-slate-400",
                  children: s.when
                })]
              }, s.code))
            })]
          })
        })
      }), /* @__PURE__ */ jsxs(Section, {
        title: "Örnek — cURL",
        children: [/* @__PURE__ */ jsx(Code, {
          children: `curl -N ${example} \\
  -H "Authorization: Bearer sk_agent_xxxxxxxx" \\
  -H "Content-Type: application/json" \\
  -d '{"message":"Merhaba"}'`
        }), /* @__PURE__ */ jsxs("p", {
          className: "text-xs text-slate-500",
          children: [/* @__PURE__ */ jsx("code", {
            children: "-N"
          }), " akışı tamponlamadan (buffering) gösterir."]
        })]
      }), /* @__PURE__ */ jsx(Section, {
        title: "Örnek — JavaScript (fetch + stream)",
        children: /* @__PURE__ */ jsx(Code, {
          children: `const res = await fetch("${example}", {
  method: "POST",
  headers: {
    "Authorization": "Bearer sk_agent_xxxxxxxx",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ message: "Merhaba" }),
});

const reader = res.body.getReader();
const decoder = new TextDecoder();
let text = "";
while (true) {
  const { value, done } = await reader.read();
  if (done) break;
  text += decoder.decode(value, { stream: true });
  process.stdout.write(decoder.decode(value)); // canlı yazdır
}`
        })
      }), /* @__PURE__ */ jsxs(Section, {
        title: "AGORA — Agora.io Conversational AI için özel LLM",
        children: [/* @__PURE__ */ jsxs("p", {
          className: "text-sm",
          children: ['Agora.io Conversational AI Engine, "özel LLM" olarak', " ", /* @__PURE__ */ jsx("strong", {
            className: "text-slate-200",
            children: "OpenAI Chat Completions"
          }), " ", "protokolünü konuşan bir HTTP servisi bekler: SSE üzerinden", " ", /* @__PURE__ */ jsx("code", {
            className: "rounded bg-white/10 px-1",
            children: "chat.completion.chunk"
          }), " ", "olayları ve sonunda", " ", /* @__PURE__ */ jsx("code", {
            className: "rounded bg-white/10 px-1",
            children: "data: [DONE]"
          }), ". AGORA endpoint'leri bu sözleşmeye birebir uyar — bu sayede stok bir OpenAI istemcisi de yalnızca base URL değiştirilerek çalışır. Hedef asistan, gövdedeki ", /* @__PURE__ */ jsx("code", {
            className: "rounded bg-white/10 px-1",
            children: "model"
          }), " ", "alanıyla (id veya slug) seçilir; Agora'nın istek başına sunduğu tek alan budur."]
        }), /* @__PURE__ */ jsx("div", {
          className: "overflow-hidden rounded-lg border border-white/10",
          children: /* @__PURE__ */ jsxs("table", {
            className: "w-full text-left text-sm",
            children: [/* @__PURE__ */ jsx("thead", {
              className: "bg-white/5 text-slate-200",
              children: /* @__PURE__ */ jsxs("tr", {
                children: [/* @__PURE__ */ jsx("th", {
                  className: "px-4 py-2 font-semibold",
                  children: "Endpoint"
                }), /* @__PURE__ */ jsx("th", {
                  className: "px-4 py-2 font-semibold",
                  children: "Davranış"
                })]
              })
            }), /* @__PURE__ */ jsxs("tbody", {
              children: [/* @__PURE__ */ jsxs("tr", {
                className: "border-t border-white/10",
                children: [/* @__PURE__ */ jsx("td", {
                  className: "px-4 py-2 font-mono text-[#8d36ff]",
                  children: "POST /api/agora/chat/completions"
                }), /* @__PURE__ */ jsxs("td", {
                  className: "px-4 py-2 text-slate-400",
                  children: ["Varsayılan: tek parça JSON (", /* @__PURE__ */ jsx("code", {
                    className: "rounded bg-white/10 px-1",
                    children: "chat.completion"
                  }), ").", " ", /* @__PURE__ */ jsx("code", {
                    className: "rounded bg-white/10 px-1",
                    children: "stream: true"
                  }), " ", "verilirse SSE akışı."]
                })]
              }), /* @__PURE__ */ jsxs("tr", {
                className: "border-t border-white/10",
                children: [/* @__PURE__ */ jsx("td", {
                  className: "px-4 py-2 font-mono text-[#8d36ff]",
                  children: "POST /api/agora/stream"
                }), /* @__PURE__ */ jsxs("td", {
                  className: "px-4 py-2 text-slate-400",
                  children: ["Her zaman SSE akışı; aynı biçim, ama", " ", /* @__PURE__ */ jsx("code", {
                    className: "rounded bg-white/10 px-1",
                    children: "stream"
                  }), " ", "bayrağı yok sayılır. Agora'nın", " ", /* @__PURE__ */ jsx("code", {
                    className: "rounded bg-white/10 px-1",
                    children: "stream: true"
                  }), " ", "göndereceğine güvenmek istemediğinizde kullanın."]
                })]
              })]
            })]
          })
        }), /* @__PURE__ */ jsxs("p", {
          className: "text-sm text-slate-400",
          children: [/* @__PURE__ */ jsx("strong", {
            className: "text-slate-200",
            children: "Agora agent yapılandırması:"
          }), " ", "agent'ı başlatırken", " ", /* @__PURE__ */ jsx("code", {
            className: "rounded bg-white/10 px-1",
            children: "llm.url"
          }), " alanına bu endpoint'i,", " ", /* @__PURE__ */ jsx("code", {
            className: "rounded bg-white/10 px-1",
            children: "llm.api_key"
          }), " alanına Agent API anahtarınızı,", " ", /* @__PURE__ */ jsx("code", {
            className: "rounded bg-white/10 px-1",
            children: "llm.params.model"
          }), " ", "alanına da asistan id/slug değerini verin:"]
        }), /* @__PURE__ */ jsx(Code, {
          children: `{
  "llm": {
    "url": "${base}/api/agora/chat/completions",
    "api_key": "sk_agent_xxxxxxxx",
    "params": { "model": "ustun-zeka" }
  }
}`
        }), /* @__PURE__ */ jsxs("p", {
          className: "text-sm text-slate-400",
          children: [/* @__PURE__ */ jsx("strong", {
            className: "text-slate-200",
            children: "İstek gövdesi:"
          }), " OpenAI biçimi. ", /* @__PURE__ */ jsx("code", {
            className: "rounded bg-white/10 px-1",
            children: "model"
          }), " = asistan id/slug, ", /* @__PURE__ */ jsx("code", {
            className: "rounded bg-white/10 px-1",
            children: "messages"
          }), " ", "= konuşma. Gövdedeki ", /* @__PURE__ */ jsx("code", {
            className: "rounded bg-white/10 px-1",
            children: "system"
          }), " ", "mesajları yok sayılır — asistanın kendi sistem talimatı kullanılır. Agora ayrıca", " ", /* @__PURE__ */ jsx("code", {
            className: "rounded bg-white/10 px-1",
            children: "appId"
          }), ",", " ", /* @__PURE__ */ jsx("code", {
            className: "rounded bg-white/10 px-1",
            children: "channel"
          }), " ve", " ", /* @__PURE__ */ jsx("code", {
            className: "rounded bg-white/10 px-1",
            children: "userId"
          }), " gönderir; bunlar kabul edilir ama kullanılmaz."]
        }), /* @__PURE__ */ jsx(Code, {
          children: `{
  "model": "ustun-zeka",
  "messages": [
    { "role": "user", "content": "Merhaba" }
  ],
  "stream": true,
  "appId": "20b7c51ff4c644ab80cf5a4e646b0537",
  "channel": "default",
  "userId": "user123"
}`
        }), /* @__PURE__ */ jsxs("p", {
          className: "text-sm text-slate-400",
          children: [/* @__PURE__ */ jsx("strong", {
            className: "text-slate-200",
            children: "Akış (SSE) yanıtı"
          }), " — her iki endpoint de aynı biçimi döndürür: OpenAI", " ", /* @__PURE__ */ jsx("code", {
            className: "rounded bg-white/10 px-1",
            children: "chat.completion.chunk"
          }), ". Her parça bir ", /* @__PURE__ */ jsx("code", {
            className: "rounded bg-white/10 px-1",
            children: "data:"
          }), " ", "satırı; akış ", /* @__PURE__ */ jsx("code", {
            className: "rounded bg-white/10 px-1",
            children: "data: [DONE]"
          }), " ", "ile biter:"]
        }), /* @__PURE__ */ jsx(Code, {
          children: `data: {"id":"chatcmpl-…","object":"chat.completion.chunk","choices":[{"index":0,"delta":{"role":"assistant"},"finish_reason":null}]}

data: {"id":"chatcmpl-…","object":"chat.completion.chunk","choices":[{"index":0,"delta":{"content":"Merhaba, "},"finish_reason":null}]}

data: {"id":"chatcmpl-…","object":"chat.completion.chunk","choices":[{"index":0,"delta":{"content":"nasıl yardımcı olabilirim?"},"finish_reason":null}]}

data: {"id":"chatcmpl-…","object":"chat.completion.chunk","choices":[{"index":0,"delta":{},"finish_reason":"stop"}]}

data: [DONE]`
        }), /* @__PURE__ */ jsxs("p", {
          className: "rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-sm text-slate-400",
          children: [/* @__PURE__ */ jsx("strong", {
            className: "text-amber-300",
            children: "Dikkat:"
          }), " ", /* @__PURE__ */ jsx("code", {
            className: "rounded bg-white/10 px-1",
            children: `data: {"choices":[{"delta":{"content":"…"}}]}`
          }), " ", "gibi sadeleştirilmiş bir gövde Agora tarafından", " ", /* @__PURE__ */ jsx("strong", {
            className: "text-slate-200",
            children: "ayrıştırılmaz"
          }), ". Zarf (", /* @__PURE__ */ jsx("code", {
            className: "rounded bg-white/10 px-1",
            children: "id"
          }), ",", " ", /* @__PURE__ */ jsx("code", {
            className: "rounded bg-white/10 px-1",
            children: "object"
          }), ",", " ", /* @__PURE__ */ jsx("code", {
            className: "rounded bg-white/10 px-1",
            children: "created"
          }), ",", " ", /* @__PURE__ */ jsx("code", {
            className: "rounded bg-white/10 px-1",
            children: "model"
          }), ") ve", " ", /* @__PURE__ */ jsx("code", {
            className: "rounded bg-white/10 px-1",
            children: "finish_reason"
          }), " alanları zorunludur."]
        }), /* @__PURE__ */ jsxs("p", {
          className: "text-sm text-slate-400",
          children: [/* @__PURE__ */ jsx("strong", {
            className: "text-slate-200",
            children: "Akışsız (JSON) yanıtı"
          }), " —", " ", /* @__PURE__ */ jsx("code", {
            className: "rounded bg-white/10 px-1",
            children: "stream"
          }), " verilmezse:"]
        }), /* @__PURE__ */ jsx(Code, {
          children: `{
  "id": "chatcmpl-…",
  "object": "chat.completion",
  "created": 1720000000,
  "model": "ustun-zeka",
  "choices": [
    {
      "index": 0,
      "message": { "role": "assistant", "content": "Merhaba! …" },
      "finish_reason": "stop"
    }
  ],
  "usage": { "prompt_tokens": 12, "completion_tokens": 34, "total_tokens": 46 }
}`
        }), /* @__PURE__ */ jsx("p", {
          className: "text-sm text-slate-400",
          children: /* @__PURE__ */ jsx("strong", {
            className: "text-slate-200",
            children: "OpenAI SDK ile:"
          })
        }), /* @__PURE__ */ jsx(Code, {
          children: `import OpenAI from "openai";

const client = new OpenAI({
  apiKey: "sk_agent_xxxxxxxx",           // Agent API anahtarınız
  baseURL: "${base}/api/agora",           // AGORA taban adresi
});

const stream = await client.chat.completions.create({
  model: "ustun-zeka",                    // asistan id veya slug
  messages: [{ role: "user", content: "Merhaba" }],
  stream: true,
});

for await (const part of stream) {
  process.stdout.write(part.choices[0]?.delta?.content ?? "");
}`
        }), /* @__PURE__ */ jsx("p", {
          className: "text-xs text-slate-500",
          children: "AGORA da v1 ile aynı durum kodlarını döndürür (401/403/404/400/500). Anahtar yoksa/geçersizse veya asistana izniniz yoksa istek reddedilir."
        })]
      }), /* @__PURE__ */ jsxs(Section, {
        title: "Anahtar Oluşturma",
        children: [/* @__PURE__ */ jsxs("p", {
          className: "text-sm",
          children: ["Yönetim panelinden", " ", /* @__PURE__ */ jsx("code", {
            className: "rounded bg-white/10 px-1",
            children: "Admin → API Anahtarları"
          }), " ", "sayfasında anahtar üretin ve erişebileceği asistanları seçin. Bir anahtar yalnızca izinli olduğu asistanları çağırabilir; aksi halde", " ", /* @__PURE__ */ jsx("code", {
            className: "rounded bg-white/10 px-1",
            children: "403"
          }), " döner. Ham anahtar yalnızca bir kez gösterilir."]
        }), /* @__PURE__ */ jsxs("p", {
          className: "text-xs text-slate-500",
          children: ["Alternatif (CLI):", " ", /* @__PURE__ */ jsx("code", {
            className: "rounded bg-white/10 px-1",
            children: "npx tsx scripts/create-agent-key.ts [ad] [assistantIdOrSlug...]"
          })]
        })]
      }), /* @__PURE__ */ jsxs(Section, {
        title: "Postman",
        children: [/* @__PURE__ */ jsxs("p", {
          className: "text-sm",
          children: ["Hazır koleksiyonu içe aktarın; değişkenler", " ", /* @__PURE__ */ jsx("code", {
            className: "rounded bg-white/10 px-1",
            children: "baseUrl"
          }), ",", " ", /* @__PURE__ */ jsx("code", {
            className: "rounded bg-white/10 px-1",
            children: "apiKey"
          }), ",", " ", /* @__PURE__ */ jsx("code", {
            className: "rounded bg-white/10 px-1",
            children: "agent"
          }), "."]
        }), /* @__PURE__ */ jsx("a", {
          href: "/agent-api.postman_collection.json",
          download: true,
          className: "inline-flex items-center gap-2 rounded-lg border border-[#21c6cc]/40 bg-[#21c6cc]/10 px-4 py-2 text-sm font-medium text-[#21c6cc] hover:bg-[#21c6cc]/20",
          children: "Postman koleksiyonunu indir"
        })]
      })]
    })
  });
});
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: agentApi,
  loader: loader$v,
  meta
}, Symbol.toStringTag, { value: "Module" }));
function ScrollArea({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxs(
    ScrollAreaPrimitive.Root,
    {
      "data-slot": "scroll-area",
      className: cn("relative", className),
      ...props,
      children: [
        /* @__PURE__ */ jsx(
          ScrollAreaPrimitive.Viewport,
          {
            "data-slot": "scroll-area-viewport",
            className: "focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1",
            children
          }
        ),
        /* @__PURE__ */ jsx(ScrollBar, {}),
        /* @__PURE__ */ jsx(ScrollAreaPrimitive.Corner, {})
      ]
    }
  );
}
function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}) {
  return /* @__PURE__ */ jsx(
    ScrollAreaPrimitive.ScrollAreaScrollbar,
    {
      "data-slot": "scroll-area-scrollbar",
      orientation,
      className: cn(
        "flex touch-none p-px transition-colors select-none",
        orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent",
        orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsx(
        ScrollAreaPrimitive.ScrollAreaThumb,
        {
          "data-slot": "scroll-area-thumb",
          className: "bg-border relative flex-1 rounded-full"
        }
      )
    }
  );
}
function Sheet({ ...props }) {
  return /* @__PURE__ */ jsx(SheetPrimitive.Root, { "data-slot": "sheet", ...props });
}
function SheetPortal({
  ...props
}) {
  return /* @__PURE__ */ jsx(SheetPrimitive.Portal, { "data-slot": "sheet-portal", ...props });
}
function SheetOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    SheetPrimitive.Overlay,
    {
      "data-slot": "sheet-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      ),
      ...props
    }
  );
}
function SheetContent({
  className,
  children,
  side = "right",
  ...props
}) {
  return /* @__PURE__ */ jsxs(SheetPortal, { children: [
    /* @__PURE__ */ jsx(SheetOverlay, {}),
    /* @__PURE__ */ jsxs(
      SheetPrimitive.Content,
      {
        "data-slot": "sheet-content",
        className: cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
          side === "right" && "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
          side === "left" && "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
          side === "top" && "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b",
          side === "bottom" && "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t",
          className
        ),
        ...props,
        children: [
          children,
          /* @__PURE__ */ jsxs(SheetPrimitive.Close, { className: "ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none", children: [
            /* @__PURE__ */ jsx(XIcon, { className: "size-4" }),
            /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
          ] })
        ]
      }
    )
  ] });
}
function TooltipProvider({
  delayDuration = 0,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    TooltipPrimitive.Provider,
    {
      "data-slot": "tooltip-provider",
      delayDuration,
      ...props
    }
  );
}
function Tooltip({
  ...props
}) {
  return /* @__PURE__ */ jsx(TooltipProvider, { children: /* @__PURE__ */ jsx(TooltipPrimitive.Root, { "data-slot": "tooltip", ...props }) });
}
function TooltipTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsx(TooltipPrimitive.Trigger, { "data-slot": "tooltip-trigger", ...props });
}
function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsx(TooltipPrimitive.Portal, { children: /* @__PURE__ */ jsxs(
    TooltipPrimitive.Content,
    {
      "data-slot": "tooltip-content",
      sideOffset,
      className: cn(
        "bg-foreground text-background animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsx(TooltipPrimitive.Arrow, { className: "bg-foreground fill-foreground z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" })
      ]
    }
  ) });
}
async function loader$u({
  request
}) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    });
    if (!session?.user) {
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/login"
        }
      });
    }
    const userId = session.user.id;
    const dbUser = await prisma.user.findUnique({
      where: {
        id: userId
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });
    if (!dbUser) {
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/login"
        }
      });
    }
    let assistants2 = [];
    if (dbUser.role === "admin") {
      assistants2 = await prisma.assistant.findMany({
        where: {
          isActive: true
        },
        select: {
          id: true,
          name: true,
          color: true,
          icon: true
        },
        orderBy: {
          name: "asc"
        }
      });
    } else {
      assistants2 = await prisma.assistant.findMany({
        where: {
          isActive: true,
          OR: [{
            isPublic: true
          }, {
            userAccess: {
              some: {
                userId
              }
            }
          }]
        },
        select: {
          id: true,
          name: true,
          color: true,
          icon: true
        },
        orderBy: {
          name: "asc"
        }
      });
    }
    const chats = await prisma.chat.findMany({
      where: {
        userId
      },
      select: {
        id: true,
        title: true,
        assistantId: true,
        updatedAt: true
      },
      orderBy: {
        updatedAt: "desc"
      },
      take: 50
    });
    return {
      user: dbUser,
      assistants: assistants2,
      chats
    };
  } catch (error) {
    console.error("App layout loader error:", error);
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/login"
      }
    });
  }
}
const layout$1 = UNSAFE_withComponentProps(function AppLayout({
  loaderData
}) {
  const {
    user,
    assistants: assistants2,
    chats
  } = loaderData;
  const location = useLocation();
  useNavigate();
  const {
    theme,
    setTheme
  } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const handleLogout = () => {
    window.location.href = "/api/logout";
  };
  const handleDeleteChat = async (e, chatId) => {
    e.preventDefault();
    e.stopPropagation();
    await fetch(`/api/user/chats?chatId=${chatId}`, {
      method: "DELETE"
    });
    window.location.reload();
  };
  const Sidebar = ({
    mobile = false
  }) => /* @__PURE__ */ jsxs("div", {
    className: cn("flex flex-col h-full bg-sidebar border-r border-sidebar-border", mobile ? "w-full" : "w-full h-full"),
    children: [!isSidebarCollapsed && /* @__PURE__ */ jsxs("div", {
      className: "p-2 sm:p-3 lg:p-4 border-b border-sidebar-border",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "flex items-center justify-between mb-2 sm:mb-3",
        children: [/* @__PURE__ */ jsxs(Link, {
          to: "/chat",
          className: "flex items-center gap-1 sm:gap-2 font-bold text-base sm:text-lg lg:text-lg text-sidebar-foreground",
          children: [/* @__PURE__ */ jsx(BrandMark, {
            size: "sm"
          }), /* @__PURE__ */ jsx("span", {
            className: "hidden sm:inline",
            children: "ArisAI"
          })]
        }), !mobile && /* @__PURE__ */ jsx(Button, {
          variant: "ghost",
          size: "icon",
          onClick: () => setIsSidebarCollapsed(true),
          className: "h-7 w-7 sm:h-8 sm:w-8",
          children: /* @__PURE__ */ jsx(PanelLeftClose, {
            className: "w-3.5 h-3.5 sm:w-4 sm:h-4 text-sidebar-foreground/60"
          })
        })]
      }), /* @__PURE__ */ jsx(Link, {
        to: "/chat",
        onClick: () => mobile && setSidebarOpen(false),
        children: /* @__PURE__ */ jsxs(Button, {
          className: "w-full gap-1 sm:gap-2 bg-gradient-to-r from-[#8d36ff] via-[#d84fd2] to-[#21c6cc] text-xs sm:text-sm font-bold text-white hover:brightness-110",
          children: [/* @__PURE__ */ jsx(Plus, {
            className: "w-3 h-3 sm:w-4 sm:h-4"
          }), /* @__PURE__ */ jsx("span", {
            className: "hidden sm:inline",
            children: "Yeni Sohbet"
          }), /* @__PURE__ */ jsx("span", {
            className: "sm:hidden",
            children: "Yeni"
          })]
        })
      })]
    }), !mobile && isSidebarCollapsed && /* @__PURE__ */ jsxs("div", {
      className: "p-2 sm:p-3 lg:p-4 flex flex-col items-center gap-2 sm:gap-3 border-b border-sidebar-border",
      children: [/* @__PURE__ */ jsx(Link, {
        to: "/chat",
        children: /* @__PURE__ */ jsx(BrandMark, {
          size: "sm"
        })
      }), /* @__PURE__ */ jsx(TooltipProvider, {
        children: /* @__PURE__ */ jsxs(Tooltip, {
          children: [/* @__PURE__ */ jsx(TooltipTrigger, {
            asChild: true,
            children: /* @__PURE__ */ jsx(Link, {
              to: "/chat",
              children: /* @__PURE__ */ jsx(Button, {
                size: "icon",
                className: "h-8 w-8 bg-gradient-to-r from-[#8d36ff] to-[#21c6cc] text-white hover:brightness-110 sm:h-9 sm:w-9",
                children: /* @__PURE__ */ jsx(Plus, {
                  className: "w-3 h-3 sm:w-4 sm:h-4"
                })
              })
            })
          }), /* @__PURE__ */ jsx(TooltipContent, {
            side: "right",
            children: "Yeni Sohbet"
          })]
        })
      }), /* @__PURE__ */ jsx(TooltipProvider, {
        children: /* @__PURE__ */ jsxs(Tooltip, {
          children: [/* @__PURE__ */ jsx(TooltipTrigger, {
            asChild: true,
            children: /* @__PURE__ */ jsx(Button, {
              variant: "ghost",
              size: "icon",
              onClick: () => setIsSidebarCollapsed(false),
              className: "h-7 w-7 sm:h-8 sm:w-8",
              children: /* @__PURE__ */ jsx(PanelLeftOpen, {
                className: "w-3.5 h-3.5 sm:w-4 sm:h-4"
              })
            })
          }), /* @__PURE__ */ jsx(TooltipContent, {
            side: "right",
            children: "Genişlet"
          })]
        })
      })]
    }), /* @__PURE__ */ jsx(ScrollArea, {
      className: "flex-1 overflow-hidden",
      children: /* @__PURE__ */ jsxs("div", {
        className: "px-2 sm:px-3 py-2 h-full flex flex-col",
        children: [!isSidebarCollapsed && /* @__PURE__ */ jsx("p", {
          className: "text-xs sm:text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider px-1 sm:px-2 mb-2",
          children: "Sohbet Geçmişi"
        }), /* @__PURE__ */ jsxs("div", {
          className: "space-y-1",
          children: [chats.map((chat2) => /* @__PURE__ */ jsx(Link, {
            to: `/chat/${chat2.id}`,
            onClick: () => mobile && setSidebarOpen(false),
            className: cn("group flex items-center gap-1 sm:gap-2 rounded-lg transition-colors", isSidebarCollapsed ? "justify-center p-2" : "px-2 sm:px-3 py-1.5 sm:py-2", location.pathname === `/chat/${chat2.id}` ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50"),
            children: isSidebarCollapsed ? /* @__PURE__ */ jsx(TooltipProvider, {
              children: /* @__PURE__ */ jsxs(Tooltip, {
                children: [/* @__PURE__ */ jsx(TooltipTrigger, {
                  children: /* @__PURE__ */ jsx(MessageSquare, {
                    className: "w-3.5 h-3.5 sm:w-4 sm:h-4"
                  })
                }), /* @__PURE__ */ jsx(TooltipContent, {
                  side: "right",
                  children: chat2.title || "Sohbet"
                })]
              })
            }) : /* @__PURE__ */ jsxs(Fragment, {
              children: [/* @__PURE__ */ jsx(MessageSquare, {
                className: "w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0"
              }), /* @__PURE__ */ jsx("span", {
                className: "truncate text-xs sm:text-sm flex-1 line-clamp-1",
                children: chat2.title || "Yeni Sohbet"
              }), /* @__PURE__ */ jsx(Button, {
                variant: "ghost",
                size: "icon",
                className: "h-5 w-5 sm:h-6 sm:w-6 opacity-0 group-hover:opacity-100 transition-opacity shrink-0",
                onClick: (e) => handleDeleteChat(e, chat2.id),
                children: /* @__PURE__ */ jsx(Trash2, {
                  className: "w-3 h-3 text-destructive"
                })
              })]
            })
          }, chat2.id)), chats.length === 0 && !isSidebarCollapsed && /* @__PURE__ */ jsxs("div", {
            className: "text-center py-6 sm:py-8 text-sidebar-foreground/40 text-xs sm:text-sm",
            children: [/* @__PURE__ */ jsx(MessageSquare, {
              className: "w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 opacity-50"
            }), "Henüz sohbet yok"]
          })]
        })]
      })
    }), /* @__PURE__ */ jsxs("div", {
      className: "p-2 sm:p-3 border-t border-sidebar-border space-y-1.5 sm:space-y-2",
      children: [mounted && /* @__PURE__ */ jsx("div", {
        className: cn(isSidebarCollapsed ? "flex justify-center" : ""),
        children: /* @__PURE__ */ jsx(TooltipProvider, {
          children: /* @__PURE__ */ jsxs(Tooltip, {
            children: [/* @__PURE__ */ jsx(TooltipTrigger, {
              asChild: true,
              children: /* @__PURE__ */ jsxs(Button, {
                variant: "ghost",
                size: isSidebarCollapsed ? "icon" : "sm",
                onClick: () => setTheme(theme === "dark" ? "light" : "dark"),
                className: cn(!isSidebarCollapsed && "w-full justify-start gap-1 sm:gap-2 text-xs sm:text-sm"),
                children: [theme === "dark" ? /* @__PURE__ */ jsx(Sun, {
                  className: "w-3.5 h-3.5 sm:w-4 sm:h-4"
                }) : /* @__PURE__ */ jsx(Moon, {
                  className: "w-3.5 h-3.5 sm:w-4 sm:h-4"
                }), !isSidebarCollapsed && (theme === "dark" ? "Açık Tema" : "Koyu Tema")]
              })
            }), isSidebarCollapsed && /* @__PURE__ */ jsx(TooltipContent, {
              side: "right",
              children: "Tema Değiştir"
            })]
          })
        })
      }), !isSidebarCollapsed ? /* @__PURE__ */ jsxs("div", {
        className: "flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 rounded-lg bg-sidebar-accent/30",
        children: [/* @__PURE__ */ jsx("div", {
          className: "flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#8d36ff] to-[#21c6cc] text-xs font-bold text-white sm:h-9 sm:w-9 sm:text-sm",
          children: user.name?.charAt(0) || user.email?.charAt(0) || "U"
        }), /* @__PURE__ */ jsxs("div", {
          className: "flex-1 min-w-0",
          children: [/* @__PURE__ */ jsx("p", {
            className: "text-xs sm:text-sm font-medium truncate text-sidebar-foreground",
            children: user.name || "Kullanıcı"
          }), /* @__PURE__ */ jsx("p", {
            className: "text-xs text-sidebar-foreground/60 truncate hidden sm:block",
            children: user.email
          })]
        }), /* @__PURE__ */ jsx(Button, {
          variant: "ghost",
          size: "icon",
          className: "shrink-0 h-7 w-7 sm:h-8 sm:w-8",
          onClick: handleLogout,
          children: /* @__PURE__ */ jsx(LogOut, {
            className: "w-3.5 h-3.5 sm:w-4 sm:h-4 text-sidebar-foreground/60"
          })
        })]
      }) : /* @__PURE__ */ jsx(TooltipProvider, {
        children: /* @__PURE__ */ jsxs(Tooltip, {
          children: [/* @__PURE__ */ jsx(TooltipTrigger, {
            asChild: true,
            children: /* @__PURE__ */ jsx(Button, {
              variant: "ghost",
              size: "icon",
              onClick: handleLogout,
              children: /* @__PURE__ */ jsx(LogOut, {
                className: "w-4 h-4"
              })
            })
          }), /* @__PURE__ */ jsx(TooltipContent, {
            side: "right",
            children: "Çıkış Yap"
          })]
        })
      }), user.role === "admin" && !isSidebarCollapsed && /* @__PURE__ */ jsx(Link, {
        to: "/admin/dashboard",
        children: /* @__PURE__ */ jsxs(Button, {
          variant: "outline",
          size: "sm",
          className: "w-full gap-1 sm:gap-2 text-xs sm:text-sm",
          children: [/* @__PURE__ */ jsx(Settings, {
            className: "w-3.5 h-3.5 sm:w-4 sm:h-4"
          }), /* @__PURE__ */ jsx("span", {
            className: "hidden sm:inline",
            children: "yönetim Paneli"
          }), /* @__PURE__ */ jsx("span", {
            className: "sm:hidden",
            children: "yönetim"
          })]
        })
      })]
    })]
  });
  return /* @__PURE__ */ jsxs("div", {
    className: "aris-app-surface flex h-screen overflow-hidden",
    children: [/* @__PURE__ */ jsx("aside", {
      className: cn("hidden md:flex transition-all duration-300 ease-in-out", isSidebarCollapsed ? "w-[50px] lg:w-[60px]" : "w-[240px] lg:w-[280px]"),
      children: /* @__PURE__ */ jsx(Sidebar, {})
    }), /* @__PURE__ */ jsx(Sheet, {
      open: sidebarOpen,
      onOpenChange: setSidebarOpen,
      children: /* @__PURE__ */ jsx(SheetContent, {
        side: "left",
        className: "p-0 w-[280px] sm:w-[320px]",
        children: /* @__PURE__ */ jsx(Sidebar, {
          mobile: true
        })
      })
    }), /* @__PURE__ */ jsxs("main", {
      className: "flex-1 flex flex-col relative w-full h-full overflow-hidden",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "z-10 flex items-center justify-between gap-2 border-b border-white/10 bg-[#141524]/90 p-3 backdrop-blur-md sm:p-4 md:hidden",
        children: [/* @__PURE__ */ jsx(Button, {
          variant: "ghost",
          size: "icon",
          className: "h-8 w-8 sm:h-9 sm:w-9",
          onClick: () => setSidebarOpen(true),
          children: /* @__PURE__ */ jsx(Menu, {
            className: "w-4 h-4 sm:w-5 sm:h-5"
          })
        }), /* @__PURE__ */ jsx("span", {
          className: "text-sm font-bold sm:text-base",
          children: "ArisAI"
        }), /* @__PURE__ */ jsx("div", {
          className: "w-8 sm:w-9"
        })]
      }), /* @__PURE__ */ jsx(Outlet, {})]
    })]
  });
});
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: layout$1,
  loader: loader$u
}, Symbol.toStringTag, { value: "Module" }));
function Textarea({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "textarea",
    {
      "data-slot": "textarea",
      className: cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      ),
      ...props
    }
  );
}
function DropdownMenu({
  ...props
}) {
  return /* @__PURE__ */ jsx(DropdownMenuPrimitive.Root, { "data-slot": "dropdown-menu", ...props });
}
function DropdownMenuTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DropdownMenuPrimitive.Trigger,
    {
      "data-slot": "dropdown-menu-trigger",
      ...props
    }
  );
}
function DropdownMenuContent({
  className,
  sideOffset = 4,
  ...props
}) {
  return /* @__PURE__ */ jsx(DropdownMenuPrimitive.Portal, { children: /* @__PURE__ */ jsx(
    DropdownMenuPrimitive.Content,
    {
      "data-slot": "dropdown-menu-content",
      sideOffset,
      className: cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md",
        className
      ),
      ...props
    }
  ) });
}
function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DropdownMenuPrimitive.Item,
    {
      "data-slot": "dropdown-menu-item",
      "data-inset": inset,
      "data-variant": variant,
      className: cn(
        "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props
    }
  );
}
function preprocessLaTeX(content) {
  if (!content) return content;
  let result = content;
  result = result.replace(
    /\\\[\s*([\s\S]*?)\s*\\\]/g,
    (_, math) => `$$
${math.trim()}
$$`
  );
  result = result.replace(
    /\\\(\s*([\s\S]*?)\s*\\\)/g,
    (_, math) => `$${math.trim()}$`
  );
  result = result.replace(
    new RegExp("(?<!\\$\\$\\s*\\n?)(\\\\begin\\{[^}]+\\}[\\s\\S]*?\\\\end\\{[^}]+\\})", "g"),
    (match) => {
      const idx = result.indexOf(match);
      const before = result.substring(Math.max(0, idx - 10), idx).trim();
      if (before.endsWith("$$")) return match;
      return `$$
${match}
$$`;
    }
  );
  return result;
}
function MarkdownRenderer({ content, className = "" }) {
  const processedContent = useMemo(() => preprocessLaTeX(content), [content]);
  return /* @__PURE__ */ jsx("div", { className: `markdown-body ${className}`, children: /* @__PURE__ */ jsx(
    ReactMarkdown,
    {
      remarkPlugins: [remarkMath, remarkGfm],
      rehypePlugins: [rehypeKatex],
      components: {
        // Code blocks with syntax highlighting
        code({ className: className2, children, ...props }) {
          const match = /language-(\w+)/.exec(className2 || "");
          const isInline = !match && !String(children).includes("\n");
          if (isInline) {
            return /* @__PURE__ */ jsx("code", { className: "inline-code", ...props, children });
          }
          return /* @__PURE__ */ jsxs("div", { className: "code-block-wrapper", children: [
            match && /* @__PURE__ */ jsx("div", { className: "code-block-header", children: /* @__PURE__ */ jsx("span", { className: "code-lang", children: match[1] }) }),
            /* @__PURE__ */ jsx("pre", { className: "code-block", children: /* @__PURE__ */ jsx("code", { className: className2, ...props, children }) })
          ] });
        },
        // Links open in new tab
        a({ children, href, ...props }) {
          return /* @__PURE__ */ jsx(
            "a",
            {
              href,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "md-link",
              ...props,
              children
            }
          );
        },
        // Tables
        table({ children, ...props }) {
          return /* @__PURE__ */ jsx("div", { className: "table-wrapper", children: /* @__PURE__ */ jsx("table", { ...props, children }) });
        }
      },
      children: processedContent
    }
  ) });
}
function MessageSpeaker({
  messageId,
  content,
  isActive,
  onSpeak,
  className
}) {
  return /* @__PURE__ */ jsx(
    Button,
    {
      type: "button",
      variant: "ghost",
      size: "icon-sm",
      onClick: () => onSpeak(content, messageId),
      title: isActive ? "Sesi durdur" : "Mesajı dinle",
      className: cn(
        "h-7 w-7 rounded-md text-muted-foreground hover:text-foreground",
        isActive && "text-blue-600 hover:text-blue-600",
        className
      ),
      children: isActive ? /* @__PURE__ */ jsx(VolumeX, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ jsx(Volume2, { className: "h-3.5 w-3.5" })
    }
  );
}
function AutoSpeakToggle({ enabled, onToggle, disabled }) {
  return /* @__PURE__ */ jsx(
    Button,
    {
      type: "button",
      variant: "ghost",
      size: "icon",
      onClick: onToggle,
      disabled,
      title: enabled ? "Sesli mod açık" : "Sesli mod kapalı",
      className: cn(
        "h-9 w-9 rounded-xl shrink-0 relative",
        enabled && "text-blue-600 hover:text-blue-600 bg-blue-500/10 hover:bg-blue-500/15"
      ),
      children: enabled ? /* @__PURE__ */ jsx(Volume2, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(VolumeX, { className: "h-4 w-4" })
    }
  );
}
const RECORDER_TIMESLICE_MS = 1e3;
const LIVE_TRANSCRIBE_INTERVAL_MS = 2500;
const MIN_AUDIO_BYTES = 2500;
async function fetchTranscription(blob) {
  const formData = new FormData();
  formData.append("audio", blob, "recording.webm");
  const response = await fetch("/api/transcribe", {
    method: "POST",
    body: formData
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || "Ses dönüştürülemedi");
  }
  return data.text?.trim() ?? "";
}
function useVoiceInput({
  onLiveChange,
  onTranscript,
  onRecordingStart,
  onError
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isProcessingLive, setIsProcessingLive] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const mimeTypeRef = useRef("audio/webm");
  const streamRef = useRef(null);
  const liveIntervalRef = useRef(null);
  const sessionIdRef = useRef(0);
  const liveInFlightRef = useRef(false);
  const livePendingRef = useRef(false);
  const liveTextRef = useRef("");
  const onLiveChangeRef = useRef(onLiveChange);
  const onTranscriptRef = useRef(onTranscript);
  const onErrorRef = useRef(onError);
  useEffect(() => {
    onLiveChangeRef.current = onLiveChange;
    onTranscriptRef.current = onTranscript;
    onErrorRef.current = onError;
  });
  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);
  const clearLiveInterval = useCallback(() => {
    if (liveIntervalRef.current) {
      clearInterval(liveIntervalRef.current);
      liveIntervalRef.current = null;
    }
  }, []);
  const getAudioBlob = useCallback(() => {
    return new Blob(chunksRef.current, { type: mimeTypeRef.current });
  }, []);
  const runLiveTranscribe = useCallback(async () => {
    if (mediaRecorderRef.current?.state !== "recording") return;
    const blob = getAudioBlob();
    if (blob.size < MIN_AUDIO_BYTES) return;
    if (liveInFlightRef.current) {
      livePendingRef.current = true;
      return;
    }
    liveInFlightRef.current = true;
    setIsProcessingLive(true);
    const sessionId = sessionIdRef.current;
    try {
      const text = await fetchTranscription(blob);
      if (sessionId !== sessionIdRef.current || !text) return;
      liveTextRef.current = text;
      onLiveChangeRef.current(text);
    } catch {
    } finally {
      liveInFlightRef.current = false;
      if (sessionId === sessionIdRef.current) {
        setIsProcessingLive(false);
      }
      if (livePendingRef.current && sessionId === sessionIdRef.current) {
        livePendingRef.current = false;
        void runLiveTranscribe();
      }
    }
  }, [getAudioBlob]);
  const startRecording = useCallback(async () => {
    if (isRecording || isTranscribing) return;
    onRecordingStart?.();
    sessionIdRef.current += 1;
    liveTextRef.current = "";
    chunksRef.current = [];
    liveInFlightRef.current = false;
    livePendingRef.current = false;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus") ? "audio/webm;codecs=opus" : MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "audio/webm";
      mimeTypeRef.current = mimeType;
      const recorder = MediaRecorder.isTypeSupported(mimeType) ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      recorder.onstop = async () => {
        clearLiveInterval();
        stopStream();
        const blob = getAudioBlob();
        chunksRef.current = [];
        mediaRecorderRef.current = null;
        setIsRecording(false);
        if (blob.size === 0) return;
        setIsTranscribing(true);
        try {
          const text = await fetchTranscription(blob);
          if (!text) {
            throw new Error("Ses anlaşılamadı");
          }
          liveTextRef.current = text;
          onLiveChangeRef.current(text);
          onTranscriptRef.current(text);
        } catch (error) {
          const message = error instanceof Error ? error.message : "Ses dönüştürülemedi";
          onErrorRef.current?.(message);
        } finally {
          setIsTranscribing(false);
        }
      };
      recorder.start(RECORDER_TIMESLICE_MS);
      setIsRecording(true);
      liveIntervalRef.current = setInterval(() => {
        void runLiveTranscribe();
      }, LIVE_TRANSCRIBE_INTERVAL_MS);
      setTimeout(() => {
        void runLiveTranscribe();
      }, LIVE_TRANSCRIBE_INTERVAL_MS);
    } catch {
      clearLiveInterval();
      stopStream();
      onErrorRef.current?.("Mikrofon erişimi reddedildi");
    }
  }, [
    clearLiveInterval,
    getAudioBlob,
    isRecording,
    isTranscribing,
    onRecordingStart,
    runLiveTranscribe,
    stopStream
  ]);
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
      return;
    }
    clearLiveInterval();
    stopStream();
    setIsRecording(false);
  }, [clearLiveInterval, stopStream]);
  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else if (!isTranscribing) {
      void startRecording();
    }
  }, [isRecording, isTranscribing, startRecording, stopRecording]);
  useEffect(() => {
    return () => {
      clearLiveInterval();
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop();
      }
      stopStream();
    };
  }, [clearLiveInterval, stopStream]);
  return {
    isRecording,
    isTranscribing,
    isProcessingLive,
    toggleRecording,
    stopRecording
  };
}
function VoiceInputButton({
  onLiveChange,
  onTranscript,
  onRecordingStart,
  onError,
  disabled = false,
  className
}) {
  const { isRecording, isTranscribing, isProcessingLive, toggleRecording } = useVoiceInput({
    onLiveChange,
    onTranscript,
    onRecordingStart,
    onError
  });
  return /* @__PURE__ */ jsxs(
    Button,
    {
      type: "button",
      variant: "ghost",
      size: "icon",
      onClick: toggleRecording,
      disabled: disabled || isTranscribing,
      title: isTranscribing ? "Son metin hazırlanıyor..." : isRecording ? isProcessingLive ? "Ses yazıya dönüştürülüyor..." : "Kaydı durdur" : "Sesli mesaj",
      className: cn(
        "relative h-9 w-9 rounded-xl shrink-0",
        isRecording && "bg-red-500/15 text-red-500 hover:bg-red-500/20 hover:text-red-500",
        className
      ),
      children: [
        isTranscribing ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : isRecording ? /* @__PURE__ */ jsx(Square, { className: "h-3.5 w-3.5 fill-current" }) : /* @__PURE__ */ jsx(Mic, { className: "h-4 w-4" }),
        isRecording && /* @__PURE__ */ jsx(
          "span",
          {
            className: cn(
              "absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full animate-pulse",
              isProcessingLive ? "bg-blue-500" : "bg-red-500"
            )
          }
        )
      ]
    }
  );
}
function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingId, setSpeakingId] = useState(null);
  const audioRef = useRef(null);
  const objectUrlRef = useRef(null);
  const cleanup = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setIsSpeaking(false);
    setSpeakingId(null);
  }, []);
  useEffect(() => cleanup, [cleanup]);
  const speak = useCallback(
    async (text, messageId) => {
      if (!text.trim()) return;
      if (speakingId === messageId && isSpeaking) {
        cleanup();
        return;
      }
      cleanup();
      setIsSpeaking(true);
      setSpeakingId(messageId ?? "current");
      try {
        const response = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text })
        });
        if (!response.ok) {
          throw new Error("Ses oluşturulamadı");
        }
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        objectUrlRef.current = url;
        const audio = new Audio(url);
        audioRef.current = audio;
        audio.onended = cleanup;
        audio.onerror = cleanup;
        await audio.play();
      } catch {
        cleanup();
      }
    },
    [cleanup, isSpeaking, speakingId]
  );
  const stop = useCallback(() => {
    cleanup();
  }, [cleanup]);
  return {
    isSpeaking,
    speakingId,
    speak,
    stop
  };
}
async function loader$t({
  request,
  params
}) {
  const session = await auth.api.getSession({
    headers: request.headers
  });
  if (!session?.user) {
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/login"
      }
    });
  }
  const userId = session.user.id;
  const userRole = session.user.role;
  let assistants2 = [];
  if (userRole === "admin") {
    assistants2 = await prisma.assistant.findMany({
      where: {
        isActive: true
      },
      select: {
        id: true,
        name: true,
        description: true,
        color: true
      },
      orderBy: {
        name: "asc"
      }
    });
  } else {
    assistants2 = await prisma.assistant.findMany({
      where: {
        isActive: true,
        OR: [{
          isPublic: true
        }, {
          userAccess: {
            some: {
              userId
            }
          }
        }]
      },
      select: {
        id: true,
        name: true,
        description: true,
        color: true
      },
      orderBy: {
        name: "asc"
      }
    });
  }
  let chat2 = null;
  if (params.chatId) {
    chat2 = await prisma.chat.findFirst({
      where: {
        id: params.chatId,
        userId
      },
      include: {
        assistant: {
          select: {
            id: true,
            name: true,
            color: true
          }
        },
        messages: {
          orderBy: {
            createdAt: "asc"
          }
        }
      }
    });
  }
  return {
    chat: chat2,
    assistants: assistants2,
    userId
  };
}
const chat = UNSAFE_withComponentProps(function ChatPage({
  loaderData
}) {
  const {
    chat: chat2,
    assistants: assistants2,
    userId
  } = loaderData;
  const {
    chatId
  } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const revalidator = useRevalidator();
  const [selectedAssistantId, setSelectedAssistantId] = useState(chat2?.assistantId || searchParams.get("assistant") || assistants2[0]?.id || null);
  const selectedAssistant = assistants2.find((a) => a.id === selectedAssistantId) || assistants2[0];
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [localMessages, setLocalMessages] = useState(chat2?.messages || []);
  const [voiceMode, setVoiceMode] = useState(false);
  const {
    isSpeaking,
    speakingId,
    speak
  } = useSpeech();
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const scrollAreaRef = useRef(null);
  const voiceBaseRef = useRef("");
  useEffect(() => {
    setLocalMessages(chat2?.messages || []);
    if (chat2?.assistantId) {
      setSelectedAssistantId(chat2.assistantId);
    }
  }, [chat2?.messages, chat2?.assistantId]);
  const scrollToBottom = useCallback(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]");
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, []);
  useEffect(() => {
    scrollToBottom();
  }, [localMessages, streamingContent, scrollToBottom]);
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);
  const handleVoiceRecordingStart = () => {
    voiceBaseRef.current = input.trim();
  };
  const handleVoiceLiveChange = (recognized) => {
    const base = voiceBaseRef.current;
    setInput(base ? `${base} ${recognized}`.trim() : recognized);
  };
  const handleVoiceTranscript = (recognized) => {
    const base = voiceBaseRef.current;
    const full = base ? `${base} ${recognized}`.trim() : recognized;
    voiceBaseRef.current = "";
    if (voiceMode) {
      void handleSend(full);
      return;
    }
    setInput(full);
  };
  const handleSend = async (overrideContent) => {
    const userMessageContent = (overrideContent ?? input).trim();
    if (!userMessageContent || isLoading || !selectedAssistant) return;
    if (!overrideContent) {
      setInput("");
      if (textareaRef.current) textareaRef.current.style.height = "auto";
    }
    const tempUserMessage = {
      id: `temp-${Date.now()}`,
      role: "user",
      content: userMessageContent,
      createdAt: /* @__PURE__ */ new Date()
    };
    setLocalMessages((prev) => [...prev, tempUserMessage]);
    setIsLoading(true);
    setStreamingContent("");
    try {
      let currentChatId = chatId;
      const createChat = async () => {
        const createResponse = await fetch("/api/user/chats", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            assistantId: selectedAssistant.id,
            title: userMessageContent.slice(0, 50)
          })
        });
        if (!createResponse.ok) {
          throw new Error("Failed to create chat");
        }
        const chatData = await createResponse.json();
        currentChatId = chatData.id;
        navigate(`/chat/${currentChatId}`, {
          replace: true
        });
      };
      if (!currentChatId) {
        await createChat();
      }
      let response = await fetch(`/api/chat/${currentChatId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: userMessageContent
        })
      });
      if (response.status === 404) {
        await createChat();
        response = await fetch(`/api/chat/${currentChatId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            message: userMessageContent
          })
        });
      }
      if (!response.ok) {
        throw new Error("Failed to send message");
      }
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";
      if (reader) {
        while (true) {
          const {
            done,
            value
          } = await reader.read();
          if (done) break;
          const text = decoder.decode(value, {
            stream: true
          });
          assistantContent += text;
          setStreamingContent(assistantContent);
        }
      }
      const assistantMessage = {
        id: `temp-assistant-${Date.now()}`,
        role: "assistant",
        content: assistantContent || "Bir sorun oluştu.",
        createdAt: /* @__PURE__ */ new Date()
      };
      setLocalMessages((prev) => [...prev, assistantMessage]);
      if (voiceMode && assistantContent) {
        void speak(assistantContent, assistantMessage.id);
      }
      revalidator.revalidate();
    } catch (error) {
      console.error(error);
      const errorMessage = {
        id: `temp-error-${Date.now()}`,
        role: "assistant",
        content: "Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.",
        createdAt: /* @__PURE__ */ new Date()
      };
      setLocalMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setStreamingContent("");
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  if (assistants2.length === 0) {
    return /* @__PURE__ */ jsxs("div", {
      className: "flex-1 flex flex-col items-center justify-center p-4 max-w-2xl mx-auto w-full",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "mb-8 relative",
        children: [/* @__PURE__ */ jsx("div", {
          className: "absolute -inset-4 bg-[#21c6cc]/10 rounded-full blur-2xl"
        }), /* @__PURE__ */ jsx("div", {
          className: "relative w-20 h-20 bg-gradient-to-br from-[#8d36ff] to-[#21c6cc] rounded-2xl flex items-center justify-center shadow-xl shadow-cyan-500/25",
          children: /* @__PURE__ */ jsx(Bot, {
            className: "w-10 h-10 text-white"
          })
        })]
      }), /* @__PURE__ */ jsx("h2", {
        className: "text-2xl font-bold mb-2 text-center",
        children: "Henüz Asistan Yok"
      }), /* @__PURE__ */ jsx("p", {
        className: "text-muted-foreground text-center mb-8 max-w-md",
        children: "Sohbet edebilmeniz için bir yöneticinin asistan oluşturması gerekiyor."
      })]
    });
  }
  if (!chatId && localMessages.length === 0) {
    return /* @__PURE__ */ jsxs("div", {
      className: "flex-1 flex flex-col items-center justify-center p-4 max-w-2xl mx-auto w-full",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "mb-8 relative",
        children: [/* @__PURE__ */ jsx("div", {
          className: "absolute -inset-4 bg-[#21c6cc]/10 rounded-full blur-2xl"
        }), /* @__PURE__ */ jsx("div", {
          className: "relative w-20 h-20 bg-gradient-to-br from-[#8d36ff] to-[#21c6cc] rounded-2xl flex items-center justify-center shadow-xl shadow-cyan-500/25",
          children: /* @__PURE__ */ jsx(Sparkles, {
            className: "w-10 h-10 text-white"
          })
        })]
      }), /* @__PURE__ */ jsx("h2", {
        className: "text-2xl font-bold mb-2 text-center",
        children: "Merhaba! Ben ArisAI"
      }), /* @__PURE__ */ jsx("p", {
        className: "text-muted-foreground text-center mb-8 max-w-md",
        children: "Size nasıl yardımcı olabilirim?"
      }), /* @__PURE__ */ jsx("div", {
        className: "w-full max-w-xl",
        children: /* @__PURE__ */ jsxs("div", {
          className: "relative bg-card rounded-2xl border shadow-lg shadow-cyan-500/10 focus-within:ring-2 focus-within:ring-[#21c6cc]/20 focus-within:border-[#21c6cc] transition-all",
          children: [/* @__PURE__ */ jsx(Textarea, {
            ref: textareaRef,
            value: input,
            onChange: (e) => setInput(e.target.value),
            onKeyDown: handleKeyDown,
            placeholder: "Mesajınızı yazın...",
            className: "min-h-[60px] max-h-[200px] w-full resize-none border-0 bg-transparent py-4 px-4 text-base focus-visible:ring-0 placeholder:text-muted-foreground/50",
            rows: 1
          }), /* @__PURE__ */ jsxs("div", {
            className: "flex justify-between items-center px-3 pb-3 gap-2",
            children: [/* @__PURE__ */ jsxs(DropdownMenu, {
              children: [/* @__PURE__ */ jsx(DropdownMenuTrigger, {
                asChild: true,
                children: /* @__PURE__ */ jsxs(Button, {
                  variant: "ghost",
                  size: "sm",
                  className: "h-8 gap-2 text-xs font-medium hover:bg-secondary",
                  children: [/* @__PURE__ */ jsx("div", {
                    className: "w-5 h-5 rounded-md flex items-center justify-center",
                    style: {
                      backgroundColor: selectedAssistant?.color + "20",
                      color: selectedAssistant?.color
                    },
                    children: /* @__PURE__ */ jsx(Bot, {
                      className: "w-3 h-3"
                    })
                  }), /* @__PURE__ */ jsx("span", {
                    className: "truncate max-w-[120px]",
                    children: selectedAssistant?.name || "Asistan Seç"
                  }), /* @__PURE__ */ jsx(ChevronDown, {
                    className: "w-3 h-3 opacity-50"
                  })]
                })
              }), /* @__PURE__ */ jsx(DropdownMenuContent, {
                align: "start",
                className: "w-56",
                children: assistants2.map((assistant) => /* @__PURE__ */ jsxs(DropdownMenuItem, {
                  onClick: () => setSelectedAssistantId(assistant.id),
                  className: "gap-3 py-2",
                  children: [/* @__PURE__ */ jsx("div", {
                    className: "w-6 h-6 rounded-md flex items-center justify-center shrink-0",
                    style: {
                      backgroundColor: assistant.color + "20",
                      color: assistant.color
                    },
                    children: /* @__PURE__ */ jsx(Bot, {
                      className: "w-4 h-4"
                    })
                  }), /* @__PURE__ */ jsxs("div", {
                    className: "flex-1 min-w-0",
                    children: [/* @__PURE__ */ jsx("p", {
                      className: "font-medium truncate",
                      children: assistant.name
                    }), assistant.description && /* @__PURE__ */ jsx("p", {
                      className: "text-xs text-muted-foreground truncate",
                      children: assistant.description
                    })]
                  }), selectedAssistantId === assistant.id && /* @__PURE__ */ jsx(Check, {
                    className: "w-4 h-4 text-[#21c6cc] shrink-0"
                  })]
                }, assistant.id))
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-1",
              children: [/* @__PURE__ */ jsx(AutoSpeakToggle, {
                enabled: voiceMode,
                onToggle: () => setVoiceMode((prev) => !prev),
                disabled: isLoading
              }), /* @__PURE__ */ jsx(VoiceInputButton, {
                onRecordingStart: handleVoiceRecordingStart,
                onLiveChange: handleVoiceLiveChange,
                onTranscript: handleVoiceTranscript,
                onError: (message) => toast.error(message),
                disabled: isLoading,
                className: "h-8 w-8 rounded-lg"
              }), /* @__PURE__ */ jsx(Button, {
                onClick: () => handleSend(),
                disabled: !input.trim() || isLoading,
                size: "icon",
                className: cn("h-8 w-8 rounded-lg transition-all shrink-0", input.trim() ? "bg-gradient-to-r from-[#8d36ff] via-[#d84fd2] to-[#21c6cc] hover:brightness-110 text-white shadow-md shadow-cyan-500/25" : "bg-muted text-muted-foreground"),
                children: isLoading ? /* @__PURE__ */ jsx(Loader2, {
                  className: "w-4 h-4 animate-spin"
                }) : /* @__PURE__ */ jsx(SendHorizontal, {
                  className: "w-4 h-4"
                })
              })]
            })]
          })]
        })
      }), /* @__PURE__ */ jsx("div", {
        className: "flex flex-wrap justify-center gap-2 mt-6 max-w-lg",
        children: ["Merhaba!", "Bugün nasılsın?", "Bana yardım eder misin?"].map((s) => /* @__PURE__ */ jsx("button", {
          onClick: () => setInput(s),
          className: "px-4 py-2 text-sm bg-secondary hover:bg-secondary/80 rounded-full transition-colors",
          children: s
        }, s))
      })]
    });
  }
  return /* @__PURE__ */ jsxs("div", {
    className: "flex-1 flex flex-col h-full overflow-hidden",
    children: [/* @__PURE__ */ jsx("div", {
      className: "hidden md:flex items-center justify-between p-4 border-b bg-background/80 backdrop-blur-sm",
      children: /* @__PURE__ */ jsxs("div", {
        className: "flex items-center gap-3",
        children: [/* @__PURE__ */ jsx("div", {
          className: "w-10 h-10 rounded-xl flex items-center justify-center",
          style: {
            backgroundColor: (chat2?.assistant?.color || selectedAssistant?.color || "#3B82F6") + "20",
            color: chat2?.assistant?.color || selectedAssistant?.color || "#3B82F6"
          },
          children: /* @__PURE__ */ jsx(Bot, {
            className: "w-5 h-5"
          })
        }), /* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsx("h2", {
            className: "font-semibold",
            children: chat2?.assistant?.name || selectedAssistant?.name || "ArisAI"
          }), /* @__PURE__ */ jsx("p", {
            className: "text-xs text-muted-foreground",
            children: chat2?.title || "Yeni Sohbet"
          })]
        })]
      })
    }), /* @__PURE__ */ jsx(ScrollArea, {
      ref: scrollAreaRef,
      className: "flex-1 h-0 min-h-0",
      children: /* @__PURE__ */ jsxs("div", {
        className: "max-w-3xl mx-auto w-full px-4 py-6 space-y-6",
        children: [localMessages.map((message) => /* @__PURE__ */ jsxs("div", {
          className: cn("flex gap-3", message.role === "user" ? "justify-end" : "justify-start"),
          children: [message.role === "assistant" && /* @__PURE__ */ jsx("div", {
            className: "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
            style: {
              backgroundColor: (chat2?.assistant?.color || "#3B82F6") + "20",
              color: chat2?.assistant?.color || "#3B82F6"
            },
            children: /* @__PURE__ */ jsx(Bot, {
              className: "w-5 h-5"
            })
          }), /* @__PURE__ */ jsx("div", {
            className: cn("max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed", message.role === "user" ? "bg-gradient-to-br from-[#8d36ff] to-[#21c6cc] text-white rounded-tr-sm whitespace-pre-wrap" : "bg-card border rounded-tl-sm"),
            children: message.role === "assistant" ? /* @__PURE__ */ jsxs("div", {
              className: "space-y-2",
              children: [/* @__PURE__ */ jsx(MarkdownRenderer, {
                content: message.content
              }), /* @__PURE__ */ jsx("div", {
                className: "flex justify-end",
                children: /* @__PURE__ */ jsx(MessageSpeaker, {
                  messageId: message.id,
                  content: message.content,
                  isActive: speakingId === message.id && isSpeaking,
                  onSpeak: speak
                })
              })]
            }) : message.content
          }), message.role === "user" && /* @__PURE__ */ jsx("div", {
            className: "w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0 text-sm",
            children: "👤"
          })]
        }, message.id)), streamingContent && /* @__PURE__ */ jsxs("div", {
          className: "flex gap-3 justify-start",
          children: [/* @__PURE__ */ jsx("div", {
            className: "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
            style: {
              backgroundColor: (chat2?.assistant?.color || "#3B82F6") + "20",
              color: chat2?.assistant?.color || "#3B82F6"
            },
            children: /* @__PURE__ */ jsx(Bot, {
              className: "w-5 h-5"
            })
          }), /* @__PURE__ */ jsxs("div", {
            className: "max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed bg-card border rounded-tl-sm",
            children: [/* @__PURE__ */ jsx(MarkdownRenderer, {
              content: streamingContent
            }), /* @__PURE__ */ jsx("span", {
              className: "inline-block w-1 h-4 bg-[#21c6cc] ml-1 animate-pulse align-middle"
            })]
          })]
        }), isLoading && !streamingContent && /* @__PURE__ */ jsxs("div", {
          className: "flex gap-3 justify-start",
          children: [/* @__PURE__ */ jsx("div", {
            className: "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-[#21c6cc]/10 text-[#21c6cc]",
            children: /* @__PURE__ */ jsx(Bot, {
              className: "w-5 h-5"
            })
          }), /* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-2 p-4 rounded-xl bg-card border rounded-tl-sm",
            children: [/* @__PURE__ */ jsxs("span", {
              className: "flex gap-1",
              children: [/* @__PURE__ */ jsx("span", {
                className: "w-1.5 h-1.5 rounded-full bg-[#21c6cc] animate-bounce [animation-delay:-0.3s]"
              }), /* @__PURE__ */ jsx("span", {
                className: "w-1.5 h-1.5 rounded-full bg-[#21c6cc] animate-bounce [animation-delay:-0.15s]"
              }), /* @__PURE__ */ jsx("span", {
                className: "w-1.5 h-1.5 rounded-full bg-[#21c6cc] animate-bounce"
              })]
            }), /* @__PURE__ */ jsx("span", {
              className: "text-xs text-muted-foreground",
              children: "Yazıyor..."
            })]
          })]
        }), /* @__PURE__ */ jsx("div", {
          ref: messagesEndRef,
          className: "h-4 md:h-4 pb-20 md:pb-4"
        })]
      })
    }), /* @__PURE__ */ jsx("div", {
      className: "sticky bottom-0 left-0 right-0 p-3 md:p-4 bg-background/95 backdrop-blur-md border-t safe-area-bottom z-20",
      children: /* @__PURE__ */ jsxs("div", {
        className: "max-w-3xl mx-auto relative bg-card rounded-2xl border shadow-lg shadow-cyan-500/10 focus-within:ring-2 focus-within:ring-[#21c6cc]/20 focus-within:border-[#21c6cc] transition-all",
        children: [/* @__PURE__ */ jsx(Textarea, {
          ref: textareaRef,
          value: input,
          onChange: (e) => setInput(e.target.value),
          onKeyDown: handleKeyDown,
          placeholder: "Mesajınızı yazın...",
          className: "min-h-[50px] max-h-[200px] w-full resize-none border-0 bg-transparent py-3 px-4 text-base focus-visible:ring-0 placeholder:text-muted-foreground/50",
          rows: 1
        }), /* @__PURE__ */ jsxs("div", {
          className: "flex justify-between items-center px-3 pb-3 gap-2",
          children: [chatId ? /* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-2 text-xs text-muted-foreground",
            children: [/* @__PURE__ */ jsx("div", {
              className: "w-5 h-5 rounded-md flex items-center justify-center",
              style: {
                backgroundColor: (chat2?.assistant?.color || "#3B82F6") + "20",
                color: chat2?.assistant?.color || "#3B82F6"
              },
              children: /* @__PURE__ */ jsx(Bot, {
                className: "w-3 h-3"
              })
            }), /* @__PURE__ */ jsx("span", {
              children: chat2?.assistant?.name || "ArisAI"
            })]
          }) : (
            /* Assistant Selector for new chat */
            /* @__PURE__ */ jsxs(DropdownMenu, {
              children: [/* @__PURE__ */ jsx(DropdownMenuTrigger, {
                asChild: true,
                children: /* @__PURE__ */ jsxs(Button, {
                  variant: "ghost",
                  size: "sm",
                  className: "h-8 gap-2 text-xs font-medium hover:bg-secondary",
                  children: [/* @__PURE__ */ jsx("div", {
                    className: "w-5 h-5 rounded-md flex items-center justify-center",
                    style: {
                      backgroundColor: selectedAssistant?.color + "20",
                      color: selectedAssistant?.color
                    },
                    children: /* @__PURE__ */ jsx(Bot, {
                      className: "w-3 h-3"
                    })
                  }), /* @__PURE__ */ jsx("span", {
                    className: "truncate max-w-[120px]",
                    children: selectedAssistant?.name
                  }), /* @__PURE__ */ jsx(ChevronDown, {
                    className: "w-3 h-3 opacity-50"
                  })]
                })
              }), /* @__PURE__ */ jsx(DropdownMenuContent, {
                align: "start",
                className: "w-56",
                children: assistants2.map((assistant) => /* @__PURE__ */ jsxs(DropdownMenuItem, {
                  onClick: () => setSelectedAssistantId(assistant.id),
                  className: "gap-3 py-2",
                  children: [/* @__PURE__ */ jsx("div", {
                    className: "w-6 h-6 rounded-md flex items-center justify-center shrink-0",
                    style: {
                      backgroundColor: assistant.color + "20",
                      color: assistant.color
                    },
                    children: /* @__PURE__ */ jsx(Bot, {
                      className: "w-4 h-4"
                    })
                  }), /* @__PURE__ */ jsxs("div", {
                    className: "flex-1 min-w-0",
                    children: [/* @__PURE__ */ jsx("p", {
                      className: "font-medium truncate",
                      children: assistant.name
                    }), assistant.description && /* @__PURE__ */ jsx("p", {
                      className: "text-xs text-muted-foreground truncate",
                      children: assistant.description
                    })]
                  }), selectedAssistantId === assistant.id && /* @__PURE__ */ jsx(Check, {
                    className: "w-4 h-4 text-[#21c6cc] shrink-0"
                  })]
                }, assistant.id))
              })]
            })
          ), /* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-1",
            children: [/* @__PURE__ */ jsx(AutoSpeakToggle, {
              enabled: voiceMode,
              onToggle: () => setVoiceMode((prev) => !prev),
              disabled: isLoading
            }), /* @__PURE__ */ jsx(VoiceInputButton, {
              onRecordingStart: handleVoiceRecordingStart,
              onLiveChange: handleVoiceLiveChange,
              onTranscript: handleVoiceTranscript,
              onError: (message) => toast.error(message),
              disabled: isLoading
            }), /* @__PURE__ */ jsx(Button, {
              onClick: () => handleSend(),
              disabled: !input.trim() || isLoading,
              size: "icon",
              className: cn("h-9 w-9 rounded-xl transition-all shrink-0", input.trim() ? "bg-gradient-to-r from-[#8d36ff] via-[#d84fd2] to-[#21c6cc] hover:brightness-110 text-white" : "bg-muted text-muted-foreground"),
              children: isLoading ? /* @__PURE__ */ jsx(Loader2, {
                className: "w-4 h-4 animate-spin"
              }) : /* @__PURE__ */ jsx(SendHorizontal, {
                className: "w-4 h-4"
              })
            })]
          })]
        })]
      })
    })]
  });
});
const route7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: chat,
  loader: loader$t
}, Symbol.toStringTag, { value: "Module" }));
async function loader$s({
  request
}) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    });
    if (!session?.user) {
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/login"
        }
      });
    }
    const dbUser = await prisma.user.findUnique({
      where: {
        id: session.user.id
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });
    if (!dbUser || dbUser.role !== "admin") {
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/chat"
        }
      });
    }
    return {
      user: dbUser
    };
  } catch (error) {
    console.error("Admin layout loader error:", error);
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/login"
      }
    });
  }
}
const navItems = [{
  icon: LayoutDashboard,
  label: "Dashboard",
  href: "/admin/dashboard"
}, {
  icon: Bot,
  label: "Asistanlar",
  href: "/admin/assistants"
}, {
  icon: Users,
  label: "Kullanıcılar",
  href: "/admin/users"
}, {
  icon: KeyRound,
  label: "API Anahtarları",
  href: "/admin/api-keys"
}, {
  icon: Settings,
  label: "Ayarlar",
  href: "/admin/settings"
}];
const layout = UNSAFE_withComponentProps(function AdminLayout({
  loaderData
}) {
  const {
    user
  } = loaderData;
  const location = useLocation();
  useNavigate();
  const {
    theme,
    setTheme
  } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const handleLogout = () => {
    window.location.href = "/api/logout";
  };
  const Sidebar = () => /* @__PURE__ */ jsxs("div", {
    className: "flex h-full flex-col border-r border-white/10 bg-[#141524]/95 shadow-2xl shadow-black/25 backdrop-blur-xl",
    children: [/* @__PURE__ */ jsx("div", {
      className: "p-6",
      children: /* @__PURE__ */ jsxs("div", {
        className: "flex items-center gap-3",
        children: [/* @__PURE__ */ jsx("div", {
          className: "w-10 h-10 rounded-xl bg-gradient-to-br from-[#8d36ff] to-[#21c6cc] flex items-center justify-center",
          children: /* @__PURE__ */ jsx(Bot, {
            className: "w-6 h-6 text-white"
          })
        }), /* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsx("h1", {
            className: "font-bold text-lg",
            children: "ArisAI"
          }), /* @__PURE__ */ jsx("p", {
            className: "text-xs text-muted-foreground",
            children: "Admin Panel"
          })]
        })]
      })
    }), /* @__PURE__ */ jsx(ScrollArea, {
      className: "flex-1 px-4",
      children: /* @__PURE__ */ jsx("nav", {
        className: "space-y-1",
        children: navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return /* @__PURE__ */ jsxs(Link, {
            to: item.href,
            onClick: () => setMobileMenuOpen(false),
            className: `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? "bg-[#21c6cc]/10 text-[#21c6cc] font-medium" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`,
            children: [/* @__PURE__ */ jsx(item.icon, {
              className: "w-5 h-5"
            }), /* @__PURE__ */ jsx("span", {
              children: item.label
            })]
          }, item.href);
        })
      })
    }), /* @__PURE__ */ jsxs("div", {
      className: "p-4 border-t space-y-3",
      children: [/* @__PURE__ */ jsx(Button, {
        variant: "outline",
        asChild: true,
        className: "w-full justify-start gap-2",
        children: /* @__PURE__ */ jsxs(Link, {
          to: "/chat",
          children: [/* @__PURE__ */ jsx(ExternalLink, {
            className: "w-4 h-4"
          }), "Sohbete Git"]
        })
      }), mounted && /* @__PURE__ */ jsxs(Button, {
        variant: "ghost",
        size: "sm",
        onClick: () => setTheme(theme === "dark" ? "light" : "dark"),
        className: "w-full justify-start gap-2",
        children: [theme === "dark" ? /* @__PURE__ */ jsx(Sun, {
          className: "w-4 h-4"
        }) : /* @__PURE__ */ jsx(Moon, {
          className: "w-4 h-4"
        }), theme === "dark" ? "Açık Tema" : "Koyu Tema"]
      }), /* @__PURE__ */ jsxs("div", {
        className: "flex items-center gap-3 p-2 rounded-lg bg-secondary/50",
        children: [/* @__PURE__ */ jsx("div", {
          className: "w-9 h-9 rounded-full bg-gradient-to-br from-[#8d36ff] to-[#21c6cc] flex items-center justify-center text-white font-medium",
          children: user.name?.charAt(0) || user.email?.charAt(0) || "A"
        }), /* @__PURE__ */ jsxs("div", {
          className: "flex-1 min-w-0",
          children: [/* @__PURE__ */ jsx("p", {
            className: "text-sm font-medium truncate",
            children: user.name || "Yönetici"
          }), /* @__PURE__ */ jsx("p", {
            className: "text-xs text-muted-foreground truncate",
            children: user.email
          })]
        })]
      }), /* @__PURE__ */ jsxs(Button, {
        variant: "ghost",
        className: "w-full gap-2 text-destructive hover:bg-destructive/10 justify-start",
        onClick: handleLogout,
        children: [/* @__PURE__ */ jsx(LogOut, {
          className: "w-4 h-4"
        }), "Çıkış Yap"]
      })]
    })]
  });
  return /* @__PURE__ */ jsxs("div", {
    className: "aris-app-surface min-h-screen",
    children: [/* @__PURE__ */ jsx("aside", {
      className: "fixed left-0 top-0 h-full w-72 hidden lg:block",
      children: /* @__PURE__ */ jsx(Sidebar, {})
    }), /* @__PURE__ */ jsxs("header", {
      className: "fixed left-0 right-0 top-0 z-50 flex h-16 items-center justify-between border-b border-white/10 bg-[#141524]/90 px-4 backdrop-blur-md lg:hidden",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "flex items-center gap-3",
        children: [/* @__PURE__ */ jsx("div", {
          className: "w-8 h-8 rounded-lg bg-gradient-to-br from-[#8d36ff] to-[#21c6cc] flex items-center justify-center",
          children: /* @__PURE__ */ jsx(Bot, {
            className: "w-5 h-5 text-white"
          })
        }), /* @__PURE__ */ jsx("span", {
          className: "font-bold",
          children: "ArisAI Admin"
        })]
      }), /* @__PURE__ */ jsx(Button, {
        variant: "ghost",
        size: "icon",
        onClick: () => setMobileMenuOpen(!mobileMenuOpen),
        children: mobileMenuOpen ? /* @__PURE__ */ jsx(X, {
          className: "w-6 h-6"
        }) : /* @__PURE__ */ jsx(Menu, {
          className: "w-6 h-6"
        })
      })]
    }), mobileMenuOpen && /* @__PURE__ */ jsx("div", {
      className: "fixed inset-0 z-40 bg-background/80 pt-16 backdrop-blur-sm lg:hidden",
      children: /* @__PURE__ */ jsx("div", {
        className: "h-full w-4/5 max-w-sm border-r border-white/10 bg-[#141524] shadow-2xl",
        children: /* @__PURE__ */ jsx(Sidebar, {})
      })
    }), /* @__PURE__ */ jsx("main", {
      className: "lg:ml-72 pt-16 lg:pt-0 min-h-screen",
      children: /* @__PURE__ */ jsx("div", {
        className: "p-4 lg:p-8 max-w-7xl mx-auto",
        children: /* @__PURE__ */ jsx(Outlet, {})
      })
    })]
  });
});
const route8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: layout,
  loader: loader$s
}, Symbol.toStringTag, { value: "Module" }));
async function loader$r() {
  return new Response(null, {
    status: 302,
    headers: {
      Location: "/admin/dashboard"
    }
  });
}
const route9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$r
}, Symbol.toStringTag, { value: "Module" }));
async function loader$q() {
  const [totalUsers, totalAssistants, totalChats, totalMessages, recentAssistants] = await Promise.all([prisma.user.count(), prisma.assistant.count({
    where: {
      isActive: true
    }
  }), prisma.chat.count(), prisma.message.count(), prisma.assistant.findMany({
    where: {
      isActive: true
    },
    select: {
      id: true,
      name: true,
      color: true,
      _count: {
        select: {
          chats: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    },
    take: 5
  })]);
  return {
    stats: {
      totalUsers,
      totalAssistants,
      totalChats,
      totalMessages
    },
    recentAssistants
  };
}
const dashboard = UNSAFE_withComponentProps(function AdminDashboard({
  loaderData
}) {
  const {
    stats,
    recentAssistants
  } = loaderData;
  const statCards = [{
    title: "Toplam Kullanıcı",
    value: stats.totalUsers,
    icon: Users,
    color: "text-[#21c6cc]",
    bg: "bg-[#21c6cc]/10"
  }, {
    title: "Asistanlar",
    value: stats.totalAssistants,
    icon: Bot,
    color: "text-emerald-600",
    bg: "bg-emerald-500/10"
  }, {
    title: "Sohbetler",
    value: stats.totalChats,
    icon: MessageSquare,
    color: "text-violet-600",
    bg: "bg-violet-500/10"
  }, {
    title: "Mesajlar",
    value: stats.totalMessages,
    icon: TrendingUp,
    color: "text-amber-600",
    bg: "bg-amber-500/10"
  }];
  return /* @__PURE__ */ jsxs("div", {
    className: "space-y-8",
    children: [/* @__PURE__ */ jsxs("div", {
      children: [/* @__PURE__ */ jsx("h1", {
        className: "text-3xl font-bold",
        children: "Dashboard"
      }), /* @__PURE__ */ jsx("p", {
        className: "text-muted-foreground mt-1",
        children: "ArisAI yönetim paneline hoş geldiniz"
      })]
    }), /* @__PURE__ */ jsx("div", {
      className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4",
      children: statCards.map((stat) => /* @__PURE__ */ jsx(Card, {
        className: "border-border/50",
        children: /* @__PURE__ */ jsx(CardContent, {
          className: "pt-6",
          children: /* @__PURE__ */ jsxs("div", {
            className: "flex items-center justify-between",
            children: [/* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("p", {
                className: "text-sm text-muted-foreground",
                children: stat.title
              }), /* @__PURE__ */ jsx("p", {
                className: "text-3xl font-bold mt-1",
                children: stat.value
              })]
            }), /* @__PURE__ */ jsx("div", {
              className: `w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color}`,
              children: /* @__PURE__ */ jsx(stat.icon, {
                className: "w-6 h-6"
              })
            })]
          })
        })
      }, stat.title))
    }), /* @__PURE__ */ jsxs("div", {
      className: "grid lg:grid-cols-2 gap-8",
      children: [/* @__PURE__ */ jsxs(Card, {
        children: [/* @__PURE__ */ jsxs(CardHeader, {
          children: [/* @__PURE__ */ jsx(CardTitle, {
            children: "Hızlı Islemler"
          }), /* @__PURE__ */ jsx(CardDescription, {
            children: "Sık kullanılan islemlere erisin"
          })]
        }), /* @__PURE__ */ jsxs(CardContent, {
          className: "space-y-3",
          children: [/* @__PURE__ */ jsx(Link, {
            to: "/admin/assistants",
            children: /* @__PURE__ */ jsxs(Button, {
              variant: "outline",
              className: "w-full justify-between group",
              children: [/* @__PURE__ */ jsxs("span", {
                className: "flex items-center gap-2",
                children: [/* @__PURE__ */ jsx(Plus, {
                  className: "w-4 h-4"
                }), "Yeni Asistan oluştur"]
              }), /* @__PURE__ */ jsx(ArrowRight, {
                className: "w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity"
              })]
            })
          }), /* @__PURE__ */ jsx(Link, {
            to: "/admin/users",
            children: /* @__PURE__ */ jsxs(Button, {
              variant: "outline",
              className: "w-full justify-between group",
              children: [/* @__PURE__ */ jsxs("span", {
                className: "flex items-center gap-2",
                children: [/* @__PURE__ */ jsx(Users, {
                  className: "w-4 h-4"
                }), "Kullanıcıları Yönet"]
              }), /* @__PURE__ */ jsx(ArrowRight, {
                className: "w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity"
              })]
            })
          }), /* @__PURE__ */ jsx(Link, {
            to: "/admin/settings",
            children: /* @__PURE__ */ jsxs(Button, {
              variant: "outline",
              className: "w-full justify-between group",
              children: [/* @__PURE__ */ jsxs("span", {
                className: "flex items-center gap-2",
                children: [/* @__PURE__ */ jsx(Bot, {
                  className: "w-4 h-4"
                }), "Uygulama Ayarları"]
              }), /* @__PURE__ */ jsx(ArrowRight, {
                className: "w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity"
              })]
            })
          })]
        })]
      }), /* @__PURE__ */ jsxs(Card, {
        children: [/* @__PURE__ */ jsxs(CardHeader, {
          children: [/* @__PURE__ */ jsx(CardTitle, {
            children: "Asistanlar"
          }), /* @__PURE__ */ jsx(CardDescription, {
            children: "Aktif AI asistanları"
          })]
        }), /* @__PURE__ */ jsx(CardContent, {
          children: recentAssistants.length > 0 ? /* @__PURE__ */ jsx("div", {
            className: "space-y-3",
            children: recentAssistants.map((assistant) => /* @__PURE__ */ jsxs(Link, {
              to: `/admin/assistants/${assistant.id}`,
              className: "flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors",
              children: [/* @__PURE__ */ jsx("div", {
                className: "w-10 h-10 rounded-lg flex items-center justify-center",
                style: {
                  backgroundColor: assistant.color + "20",
                  color: assistant.color
                },
                children: /* @__PURE__ */ jsx(Bot, {
                  className: "w-5 h-5"
                })
              }), /* @__PURE__ */ jsxs("div", {
                className: "flex-1",
                children: [/* @__PURE__ */ jsx("p", {
                  className: "font-medium",
                  children: assistant.name
                }), /* @__PURE__ */ jsxs("p", {
                  className: "text-xs text-muted-foreground",
                  children: [assistant._count.chats, " sohbet"]
                })]
              }), /* @__PURE__ */ jsx(ArrowRight, {
                className: "w-4 h-4 text-muted-foreground"
              })]
            }, assistant.id))
          }) : /* @__PURE__ */ jsxs("div", {
            className: "text-center py-8",
            children: [/* @__PURE__ */ jsx(Bot, {
              className: "w-12 h-12 mx-auto text-muted-foreground/20 mb-3"
            }), /* @__PURE__ */ jsx("p", {
              className: "text-muted-foreground",
              children: "Henüz asistan yok"
            }), /* @__PURE__ */ jsx(Link, {
              to: "/admin/assistants",
              children: /* @__PURE__ */ jsxs(Button, {
                size: "sm",
                className: "mt-3",
                children: [/* @__PURE__ */ jsx(Plus, {
                  className: "w-4 h-4 mr-2"
                }), "İlk Asistanı oluştur"]
              })
            })]
          })
        })]
      })]
    })]
  });
});
const route10 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: dashboard,
  loader: loader$q
}, Symbol.toStringTag, { value: "Module" }));
function Dialog({
  ...props
}) {
  return /* @__PURE__ */ jsx(SheetPrimitive.Root, { "data-slot": "dialog", ...props });
}
function DialogTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsx(SheetPrimitive.Trigger, { "data-slot": "dialog-trigger", ...props });
}
function DialogPortal({
  ...props
}) {
  return /* @__PURE__ */ jsx(SheetPrimitive.Portal, { "data-slot": "dialog-portal", ...props });
}
function DialogOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    SheetPrimitive.Overlay,
    {
      "data-slot": "dialog-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      ),
      ...props
    }
  );
}
function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}) {
  return /* @__PURE__ */ jsxs(DialogPortal, { "data-slot": "dialog-portal", children: [
    /* @__PURE__ */ jsx(DialogOverlay, {}),
    /* @__PURE__ */ jsxs(
      SheetPrimitive.Content,
      {
        "data-slot": "dialog-content",
        className: cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 outline-none sm:max-w-lg",
          className
        ),
        ...props,
        children: [
          children,
          showCloseButton && /* @__PURE__ */ jsxs(
            SheetPrimitive.Close,
            {
              "data-slot": "dialog-close",
              className: "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
              children: [
                /* @__PURE__ */ jsx(XIcon, {}),
                /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
              ]
            }
          )
        ]
      }
    )
  ] });
}
function DialogHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "dialog-header",
      className: cn("flex flex-col gap-2 text-center sm:text-left", className),
      ...props
    }
  );
}
function DialogFooter({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "dialog-footer",
      className: cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      ),
      ...props
    }
  );
}
function DialogTitle({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    SheetPrimitive.Title,
    {
      "data-slot": "dialog-title",
      className: cn("text-lg leading-none font-semibold", className),
      ...props
    }
  );
}
const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary: "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive: "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({
  className,
  variant,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "span";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      "data-slot": "badge",
      className: cn(badgeVariants({ variant }), className),
      ...props
    }
  );
}
async function loader$p() {
  const assistants2 = await prisma.assistant.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      systemInstruction: true,
      model: true,
      color: true,
      isPublic: true,
      isActive: true,
      _count: {
        select: {
          chats: true,
          userAccess: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return {
    assistants: assistants2
  };
}
const assistants = UNSAFE_withComponentProps(function AdminAssistants({
  loaderData
}) {
  const {
    assistants: assistants2
  } = loaderData;
  const revalidator = useRevalidator();
  const [isCreating, setIsCreating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [systemInstruction, setSystemInstruction] = useState("Sen yardımcı bir AI asistanısın. Kullanıcıların sorularına Açık ve anlaşılır cevaplar ver.");
  const [model, setModel] = useState("gpt-4.1-mini");
  const [color, setColor] = useState("#3B82F6");
  const [isPublic, setIsPublic] = useState(true);
  const handleCreate = async () => {
    if (!name.trim()) return;
    setIsCreating(true);
    try {
      const response = await fetch("/api/admin/assistants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          description,
          systemInstruction,
          model,
          color,
          isPublic
        })
      });
      if (response.ok) {
        setIsDialogOpen(false);
        setName("");
        setDescription("");
        revalidator.revalidate();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  };
  const colors = ["#3B82F6", "#10B981", "#8B5CF6", "#F59E0B", "#EF4444", "#EC4899", "#06B6D4", "#6366F1"];
  return /* @__PURE__ */ jsxs("div", {
    className: "space-y-8",
    children: [/* @__PURE__ */ jsxs("div", {
      className: "flex items-center justify-between",
      children: [/* @__PURE__ */ jsxs("div", {
        children: [/* @__PURE__ */ jsx("h1", {
          className: "text-3xl font-bold",
          children: "Asistanlar"
        }), /* @__PURE__ */ jsx("p", {
          className: "text-muted-foreground mt-1",
          children: "AI asistanlarını yönetin"
        })]
      }), /* @__PURE__ */ jsxs(Dialog, {
        open: isDialogOpen,
        onOpenChange: setIsDialogOpen,
        children: [/* @__PURE__ */ jsx(DialogTrigger, {
          asChild: true,
          children: /* @__PURE__ */ jsxs(Button, {
            className: "gap-2 bg-gradient-to-r from-[#8d36ff] via-[#d84fd2] to-[#21c6cc] hover:brightness-110",
            children: [/* @__PURE__ */ jsx(Plus, {
              className: "w-4 h-4"
            }), "Yeni Asistan"]
          })
        }), /* @__PURE__ */ jsxs(DialogContent, {
          className: "max-w-lg",
          children: [/* @__PURE__ */ jsx(DialogHeader, {
            children: /* @__PURE__ */ jsx(DialogTitle, {
              children: "Yeni Asistan oluştur"
            })
          }), /* @__PURE__ */ jsxs("div", {
            className: "space-y-4 mt-4",
            children: [/* @__PURE__ */ jsxs("div", {
              className: "space-y-2",
              children: [/* @__PURE__ */ jsx(Label, {
                children: "Asistan Adı"
              }), /* @__PURE__ */ jsx(Input, {
                value: name,
                onChange: (e) => setName(e.target.value),
                placeholder: "Orn: Genel Asistan"
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "space-y-2",
              children: [/* @__PURE__ */ jsx(Label, {
                children: "Açıklama (opsiyonel)"
              }), /* @__PURE__ */ jsx(Input, {
                value: description,
                onChange: (e) => setDescription(e.target.value),
                placeholder: "Kısa bir Açıklama"
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "space-y-2",
              children: [/* @__PURE__ */ jsx(Label, {
                children: "Sistem Talimatı"
              }), /* @__PURE__ */ jsx(Textarea, {
                value: systemInstruction,
                onChange: (e) => setSystemInstruction(e.target.value),
                placeholder: "AI'ın nasıl davranacağını belirleyin...",
                rows: 4
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "space-y-2",
              children: [/* @__PURE__ */ jsx(Label, {
                children: "Model"
              }), /* @__PURE__ */ jsxs("select", {
                value: model,
                onChange: (e) => setModel(e.target.value),
                className: "w-full h-10 px-3 rounded-md border bg-background",
                children: [/* @__PURE__ */ jsx("option", {
                  value: "gpt-4.1-mini",
                  children: "GPT-4.1 Mini (Hızlı)"
                }), /* @__PURE__ */ jsx("option", {
                  value: "gpt-4.1",
                  children: "GPT-4.1 (Güçlü)"
                }), /* @__PURE__ */ jsx("option", {
                  value: "gpt-4o",
                  children: "GPT-4o"
                }), /* @__PURE__ */ jsx("option", {
                  value: "gpt-4o-mini",
                  children: "GPT-4o Mini"
                })]
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "space-y-2",
              children: [/* @__PURE__ */ jsx(Label, {
                children: "Renk"
              }), /* @__PURE__ */ jsx("div", {
                className: "flex gap-2 flex-wrap",
                children: colors.map((c) => /* @__PURE__ */ jsx("button", {
                  onClick: () => setColor(c),
                  className: `w-8 h-8 rounded-full transition-all ${color === c ? "ring-2 ring-offset-2 ring-[#21c6cc]" : ""}`,
                  style: {
                    backgroundColor: c
                  }
                }, c))
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-2",
              children: [/* @__PURE__ */ jsx("input", {
                type: "checkbox",
                id: "isPublic",
                checked: isPublic,
                onChange: (e) => setIsPublic(e.target.checked),
                className: "w-4 h-4"
              }), /* @__PURE__ */ jsx(Label, {
                htmlFor: "isPublic",
                className: "cursor-pointer",
                children: "Herkese Açık (Tüm Kullanıcılar erişebilir)"
              })]
            }), /* @__PURE__ */ jsx(Button, {
              onClick: handleCreate,
              disabled: !name.trim() || isCreating,
              className: "w-full bg-gradient-to-r from-[#8d36ff] via-[#d84fd2] to-[#21c6cc] hover:brightness-110",
              children: isCreating ? /* @__PURE__ */ jsxs(Fragment, {
                children: [/* @__PURE__ */ jsx(Loader2, {
                  className: "w-4 h-4 mr-2 animate-spin"
                }), "oluşturuluyor..."]
              }) : "Asistan oluştur"
            })]
          })]
        })]
      })]
    }), assistants2.length > 0 ? /* @__PURE__ */ jsx("div", {
      className: "grid md:grid-cols-2 lg:grid-cols-3 gap-4",
      children: assistants2.map((assistant) => /* @__PURE__ */ jsx(Link, {
        to: `/admin/assistants/${assistant.id}`,
        children: /* @__PURE__ */ jsx(Card, {
          className: "h-full hover:border-[#21c6cc]/50 transition-colors cursor-pointer",
          children: /* @__PURE__ */ jsx(CardContent, {
            className: "pt-6",
            children: /* @__PURE__ */ jsxs("div", {
              className: "flex items-start gap-4",
              children: [/* @__PURE__ */ jsx("div", {
                className: "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                style: {
                  backgroundColor: assistant.color + "20",
                  color: assistant.color
                },
                children: /* @__PURE__ */ jsx(Bot, {
                  className: "w-6 h-6"
                })
              }), /* @__PURE__ */ jsxs("div", {
                className: "flex-1 min-w-0",
                children: [/* @__PURE__ */ jsxs("div", {
                  className: "flex items-center gap-2",
                  children: [/* @__PURE__ */ jsx("h3", {
                    className: "font-semibold truncate",
                    children: assistant.name
                  }), !assistant.isActive && /* @__PURE__ */ jsx(Badge, {
                    variant: "secondary",
                    className: "text-xs",
                    children: "Pasif"
                  })]
                }), /* @__PURE__ */ jsx("p", {
                  className: "text-sm text-muted-foreground line-clamp-2 mt-1",
                  children: assistant.description || assistant.systemInstruction.slice(0, 100)
                }), /* @__PURE__ */ jsxs("div", {
                  className: "flex items-center gap-3 mt-3 text-xs text-muted-foreground",
                  children: [/* @__PURE__ */ jsxs("span", {
                    className: "flex items-center gap-1",
                    children: [assistant.isPublic ? /* @__PURE__ */ jsx(Globe, {
                      className: "w-3 h-3"
                    }) : /* @__PURE__ */ jsx(Lock, {
                      className: "w-3 h-3"
                    }), assistant.isPublic ? "Herkese Açık" : "Özel"]
                  }), /* @__PURE__ */ jsxs("span", {
                    children: [assistant._count.chats, " sohbet"]
                  }), /* @__PURE__ */ jsxs("span", {
                    children: [assistant._count.userAccess, " erişim"]
                  })]
                })]
              }), /* @__PURE__ */ jsx(ArrowRight, {
                className: "w-4 h-4 text-muted-foreground shrink-0"
              })]
            })
          })
        })
      }, assistant.id))
    }) : /* @__PURE__ */ jsx(Card, {
      children: /* @__PURE__ */ jsxs(CardContent, {
        className: "py-16 text-center",
        children: [/* @__PURE__ */ jsx(Bot, {
          className: "w-16 h-16 mx-auto text-muted-foreground/20 mb-4"
        }), /* @__PURE__ */ jsx("h3", {
          className: "text-lg font-semibold mb-2",
          children: "Henüz Asistan Yok"
        }), /* @__PURE__ */ jsx("p", {
          className: "text-muted-foreground mb-6",
          children: "İlk AI asistanınızı oluşturarak başlayın"
        }), /* @__PURE__ */ jsxs(Button, {
          onClick: () => setIsDialogOpen(true),
          className: "gap-2 bg-gradient-to-r from-[#8d36ff] via-[#d84fd2] to-[#21c6cc] hover:brightness-110",
          children: [/* @__PURE__ */ jsx(Plus, {
            className: "w-4 h-4"
          }), "İlk Asistanı oluştur"]
        })]
      })
    })]
  });
});
const route11 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: assistants,
  loader: loader$p
}, Symbol.toStringTag, { value: "Module" }));
async function copyText(text) {
  if (typeof navigator !== "undefined" && navigator.clipboard && typeof window !== "undefined" && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
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
async function loader$o({
  params
}) {
  const assistant = await prisma.assistant.findUnique({
    where: {
      id: params.assistantId
    },
    include: {
      _count: {
        select: {
          chats: true,
          userAccess: true,
          vectorStoreFiles: true
        }
      },
      vectorStoreFiles: {
        orderBy: {
          createdAt: "desc"
        }
      },
      userAccess: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: {
          grantedAt: "desc"
        }
      }
    }
  });
  if (!assistant) {
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/admin/assistants"
      }
    });
  }
  const assignedUserIds = assistant.userAccess.map((ua) => ua.userId);
  const allUsers = await prisma.user.findMany({
    where: {
      id: {
        notIn: assignedUserIds
      },
      role: {
        not: "admin"
      }
      // Admins don't need assignment
    },
    select: {
      id: true,
      name: true,
      email: true
    },
    orderBy: {
      name: "asc"
    }
  });
  return {
    assistant,
    allUsers,
    appUrl: process.env.APP_URL || ""
  };
}
const assistantDetail = UNSAFE_withComponentProps(function AssistantDetail({
  loaderData
}) {
  const {
    assistant,
    allUsers,
    appUrl
  } = loaderData;
  const navigate = useNavigate();
  const revalidator = useRevalidator();
  const fileInputRef = useRef(null);
  const [name, setName] = useState(assistant?.name || "");
  const [slug, setSlug] = useState(assistant?.slug || "");
  const [description, setDescription] = useState(assistant?.description || "");
  const [systemInstruction, setSystemInstruction] = useState(assistant?.systemInstruction || "");
  const [model, setModel] = useState(assistant?.model || "gpt-4.1-mini");
  const [color, setColor] = useState(assistant?.color || "#3B82F6");
  const [isPublic, setIsPublic] = useState(assistant?.isPublic ?? true);
  const [isActive, setIsActive] = useState(assistant?.isActive ?? true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingFileId, setDeletingFileId] = useState(null);
  const [isAssigning, setIsAssigning] = useState(false);
  const [removingAccessId, setRemovingAccessId] = useState(null);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  if (!assistant) return null;
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/admin/assistants/${assistant.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          slug,
          description,
          systemInstruction,
          model,
          color,
          isPublic,
          isActive
        })
      });
      if (response.ok) {
        toast.success("Asistan güncellendi");
        revalidator.revalidate();
      } else {
        const data = await response.json().catch(() => null);
        toast.error(data?.error || "Güncelleme başarısız");
      }
    } catch (error) {
      toast.error("Bir hata oluştu");
    } finally {
      setIsSaving(false);
    }
  };
  const handleDelete = async () => {
    if (!confirm("Bu asistanı silmek istediğinize emin misiniz?")) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/assistants/${assistant.id}`, {
        method: "DELETE"
      });
      if (response.ok) {
        toast.success("Asistan silindi");
        navigate("/admin/assistants");
      } else {
        toast.error("Silme başarısız");
      }
    } catch (error) {
      toast.error("Bir hata oluştu");
    } finally {
      setIsDeleting(false);
    }
  };
  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploading(true);
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch(`/api/admin/assistants/${assistant.id}/files`, {
          method: "POST",
          body: formData
        });
        if (response.ok) {
          toast.success(`${file.name} yüklendi`);
        } else {
          toast.error(`${file.name} yüklenemedi`);
        }
      }
      revalidator.revalidate();
    } catch (error) {
      toast.error("Dosya yükleme hatası");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };
  const handleDeleteFile = async (fileId) => {
    setDeletingFileId(fileId);
    try {
      const response = await fetch(`/api/admin/assistants/${assistant.id}/files?fileId=${fileId}`, {
        method: "DELETE"
      });
      if (response.ok) {
        toast.success("Dosya silindi");
        revalidator.revalidate();
      } else {
        toast.error("Dosya silinemedi");
      }
    } catch (error) {
      toast.error("Bir hata oluştu");
    } finally {
      setDeletingFileId(null);
    }
  };
  const handleAssignUsers = async () => {
    if (selectedUsers.length === 0) return;
    setIsAssigning(true);
    try {
      for (const userId of selectedUsers) {
        await fetch(`/api/admin/users/${userId}/access`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            assistantId: assistant.id
          })
        });
      }
      toast.success(`${selectedUsers.length} Kullanıcıya erişim verildi`);
      setAssignDialogOpen(false);
      setSelectedUsers([]);
      setUserSearch("");
      revalidator.revalidate();
    } catch (error) {
      toast.error("Atama yapılamadı");
    } finally {
      setIsAssigning(false);
    }
  };
  const handleRemoveAccess = async (userId) => {
    setRemovingAccessId(userId);
    try {
      const response = await fetch(`/api/admin/users/${userId}/access?assistantId=${assistant.id}`, {
        method: "DELETE"
      });
      if (response.ok) {
        toast.success("erişim kaldırıldı");
        revalidator.revalidate();
      } else {
        toast.error("erişim kaldırılamadı");
      }
    } catch (error) {
      toast.error("Bir hata oluştu");
    } finally {
      setRemovingAccessId(null);
    }
  };
  const toggleUserSelection = (userId) => {
    setSelectedUsers((prev) => prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]);
  };
  const filteredUsers = allUsers.filter((user) => user.name.toLowerCase().includes(userSearch.toLowerCase()) || user.email.toLowerCase().includes(userSearch.toLowerCase()));
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };
  const colors = ["#3B82F6", "#10B981", "#8B5CF6", "#F59E0B", "#EF4444", "#EC4899", "#06B6D4", "#6366F1"];
  const apiOrigin = appUrl || (typeof window !== "undefined" ? window.location.origin : "");
  const agentRef = assistant.slug || assistant.id;
  const apiEndpoint = `${apiOrigin}/api/v1/agents/${agentRef}`;
  const curlExample = `curl -N ${apiEndpoint} \\
  -H "Authorization: Bearer <API_KEY>" \\
  -H "Content-Type: application/json" \\
  -d '{"message":"Merhaba"}'`;
  const agoraEndpoint = `${apiOrigin}/api/agora/chat/completions`;
  const agoraCurl = `curl -N ${agoraEndpoint} \\
  -H "Authorization: Bearer <API_KEY>" \\
  -H "Content-Type: application/json" \\
  -d '{"model":"${agentRef}","messages":[{"role":"user","content":"Merhaba"}],"stream":true}'`;
  const copyToClipboard = (text, label) => {
    copyText(text).then((ok) => ok ? toast.success(`${label} kopyalandı`) : toast.error("Kopyalanamadı"));
  };
  return /* @__PURE__ */ jsxs("div", {
    className: "space-y-8",
    children: [/* @__PURE__ */ jsxs("div", {
      className: "flex items-center gap-4",
      children: [/* @__PURE__ */ jsx(Link, {
        to: "/admin/assistants",
        children: /* @__PURE__ */ jsx(Button, {
          variant: "ghost",
          size: "icon",
          children: /* @__PURE__ */ jsx(ArrowLeft, {
            className: "w-5 h-5"
          })
        })
      }), /* @__PURE__ */ jsxs("div", {
        className: "flex items-center gap-3",
        children: [/* @__PURE__ */ jsx("div", {
          className: "w-12 h-12 rounded-xl flex items-center justify-center",
          style: {
            backgroundColor: color + "20",
            color
          },
          children: /* @__PURE__ */ jsx(Bot, {
            className: "w-6 h-6"
          })
        }), /* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsx("h1", {
            className: "text-2xl font-bold",
            children: assistant.name
          }), /* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-2 mt-1",
            children: [/* @__PURE__ */ jsxs(Badge, {
              variant: isPublic ? "default" : "secondary",
              children: [isPublic ? /* @__PURE__ */ jsx(Globe, {
                className: "w-3 h-3 mr-1"
              }) : /* @__PURE__ */ jsx(Lock, {
                className: "w-3 h-3 mr-1"
              }), isPublic ? "Herkese Açık" : "Özel"]
            }), /* @__PURE__ */ jsx(Badge, {
              variant: isActive ? "default" : "destructive",
              children: isActive ? "Aktif" : "Pasif"
            })]
          })]
        })]
      })]
    }), /* @__PURE__ */ jsxs("div", {
      className: "grid grid-cols-1 md:grid-cols-3 gap-4",
      children: [/* @__PURE__ */ jsx(Card, {
        children: /* @__PURE__ */ jsx(CardContent, {
          className: "pt-6",
          children: /* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-3",
            children: [/* @__PURE__ */ jsx("div", {
              className: "w-10 h-10 rounded-lg bg-[#21c6cc]/10 flex items-center justify-center text-[#21c6cc]",
              children: /* @__PURE__ */ jsx(Bot, {
                className: "w-5 h-5"
              })
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("p", {
                className: "text-sm text-muted-foreground",
                children: "Toplam Sohbet"
              }), /* @__PURE__ */ jsx("p", {
                className: "text-2xl font-bold",
                children: assistant._count.chats
              })]
            })]
          })
        })
      }), /* @__PURE__ */ jsx(Card, {
        children: /* @__PURE__ */ jsx(CardContent, {
          className: "pt-6",
          children: /* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-3",
            children: [/* @__PURE__ */ jsx("div", {
              className: "w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600",
              children: /* @__PURE__ */ jsx(Users, {
                className: "w-5 h-5"
              })
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("p", {
                className: "text-sm text-muted-foreground",
                children: "Atanan Kullanıcı"
              }), /* @__PURE__ */ jsx("p", {
                className: "text-2xl font-bold",
                children: assistant._count.userAccess
              })]
            })]
          })
        })
      }), /* @__PURE__ */ jsx(Card, {
        children: /* @__PURE__ */ jsx(CardContent, {
          className: "pt-6",
          children: /* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-3",
            children: [/* @__PURE__ */ jsx("div", {
              className: "w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-600",
              children: /* @__PURE__ */ jsx(FileText, {
                className: "w-5 h-5"
              })
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("p", {
                className: "text-sm text-muted-foreground",
                children: "Bilgi Dosyası"
              }), /* @__PURE__ */ jsx("p", {
                className: "text-2xl font-bold",
                children: assistant._count.vectorStoreFiles
              })]
            })]
          })
        })
      })]
    }), /* @__PURE__ */ jsxs("div", {
      className: "grid lg:grid-cols-2 gap-6",
      children: [/* @__PURE__ */ jsxs(Card, {
        children: [/* @__PURE__ */ jsxs(CardHeader, {
          children: [/* @__PURE__ */ jsx(CardTitle, {
            children: "Asistan Ayarları"
          }), /* @__PURE__ */ jsx(CardDescription, {
            children: "Asistan bilgilerini düzenleyin"
          })]
        }), /* @__PURE__ */ jsxs(CardContent, {
          className: "space-y-6",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "grid md:grid-cols-2 gap-4",
            children: [/* @__PURE__ */ jsxs("div", {
              className: "space-y-2",
              children: [/* @__PURE__ */ jsx(Label, {
                children: "Asistan Adı"
              }), /* @__PURE__ */ jsx(Input, {
                value: name,
                onChange: (e) => setName(e.target.value)
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "space-y-2",
              children: [/* @__PURE__ */ jsx(Label, {
                children: "Model"
              }), /* @__PURE__ */ jsxs("select", {
                value: model,
                onChange: (e) => setModel(e.target.value),
                className: "w-full h-10 px-3 rounded-md border bg-background",
                children: [/* @__PURE__ */ jsx("option", {
                  value: "gpt-4.1-mini",
                  children: "GPT-4.1 Mini"
                }), /* @__PURE__ */ jsx("option", {
                  value: "gpt-4.1",
                  children: "GPT-4.1"
                }), /* @__PURE__ */ jsx("option", {
                  value: "gpt-4o",
                  children: "GPT-4o"
                }), /* @__PURE__ */ jsx("option", {
                  value: "gpt-4o-mini",
                  children: "GPT-4o Mini"
                })]
              })]
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "space-y-2",
            children: [/* @__PURE__ */ jsx(Label, {
              children: "Slug (API için)"
            }), /* @__PURE__ */ jsx(Input, {
              value: slug,
              onChange: (e) => setSlug(e.target.value),
              placeholder: "orn: ustun-zeka (boş bırakılırsa id kullanılır)"
            }), /* @__PURE__ */ jsx("p", {
              className: "text-xs text-muted-foreground",
              children: "API çağrılarında asistan kimliği olarak kullanılır. Küçük harf, rakam ve tire."
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "space-y-2",
            children: [/* @__PURE__ */ jsx(Label, {
              children: "Açıklama"
            }), /* @__PURE__ */ jsx(Input, {
              value: description,
              onChange: (e) => setDescription(e.target.value),
              placeholder: "Kısa bir Açıklama"
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "space-y-2",
            children: [/* @__PURE__ */ jsx(Label, {
              children: "Sistem Talimatı"
            }), /* @__PURE__ */ jsx(Textarea, {
              value: systemInstruction,
              onChange: (e) => setSystemInstruction(e.target.value),
              rows: 6
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "space-y-2",
            children: [/* @__PURE__ */ jsx(Label, {
              children: "Renk"
            }), /* @__PURE__ */ jsx("div", {
              className: "flex gap-2 flex-wrap",
              children: colors.map((c) => /* @__PURE__ */ jsx("button", {
                onClick: () => setColor(c),
                className: `w-8 h-8 rounded-full transition-all ${color === c ? "ring-2 ring-offset-2 ring-[#21c6cc]" : ""}`,
                style: {
                  backgroundColor: c
                }
              }, c))
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "flex flex-wrap gap-4",
            children: [/* @__PURE__ */ jsxs("label", {
              className: "flex items-center gap-2 cursor-pointer",
              children: [/* @__PURE__ */ jsx("input", {
                type: "checkbox",
                checked: isPublic,
                onChange: (e) => setIsPublic(e.target.checked),
                className: "w-4 h-4"
              }), /* @__PURE__ */ jsx("span", {
                children: "Herkese Açık"
              })]
            }), /* @__PURE__ */ jsxs("label", {
              className: "flex items-center gap-2 cursor-pointer",
              children: [/* @__PURE__ */ jsx("input", {
                type: "checkbox",
                checked: isActive,
                onChange: (e) => setIsActive(e.target.checked),
                className: "w-4 h-4"
              }), /* @__PURE__ */ jsx("span", {
                children: "Aktif"
              })]
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "flex gap-3 pt-4",
            children: [/* @__PURE__ */ jsx(Button, {
              onClick: handleSave,
              disabled: isSaving,
              className: "gap-2 bg-gradient-to-r from-[#8d36ff] via-[#d84fd2] to-[#21c6cc] hover:brightness-110",
              children: isSaving ? /* @__PURE__ */ jsxs(Fragment, {
                children: [/* @__PURE__ */ jsx(Loader2, {
                  className: "w-4 h-4 animate-spin"
                }), "Kaydediliyor..."]
              }) : /* @__PURE__ */ jsxs(Fragment, {
                children: [/* @__PURE__ */ jsx(Save, {
                  className: "w-4 h-4"
                }), "Kaydet"]
              })
            }), /* @__PURE__ */ jsxs(Button, {
              variant: "destructive",
              onClick: handleDelete,
              disabled: isDeleting,
              className: "gap-2",
              children: [isDeleting ? /* @__PURE__ */ jsx(Loader2, {
                className: "w-4 h-4 animate-spin"
              }) : /* @__PURE__ */ jsx(Trash2, {
                className: "w-4 h-4"
              }), "Sil"]
            })]
          })]
        })]
      }), /* @__PURE__ */ jsxs(Card, {
        children: [/* @__PURE__ */ jsx(CardHeader, {
          children: /* @__PURE__ */ jsxs("div", {
            className: "flex items-center justify-between",
            children: [/* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsxs(CardTitle, {
                className: "flex items-center gap-2",
                children: [/* @__PURE__ */ jsx(Database, {
                  className: "w-5 h-5"
                }), "Bilgi Tabanı (Vector Store)"]
              }), /* @__PURE__ */ jsx(CardDescription, {
                className: "mt-1",
                children: "Asistanın kullanacağı dokümanları yükleyin"
              })]
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("input", {
                ref: fileInputRef,
                type: "file",
                multiple: true,
                accept: ".pdf,.txt,.md,.docx,.doc,.csv,.json",
                onChange: handleFileUpload,
                className: "hidden"
              }), /* @__PURE__ */ jsxs(Button, {
                onClick: () => fileInputRef.current?.click(),
                disabled: isUploading,
                size: "sm",
                className: "gap-2",
                children: [isUploading ? /* @__PURE__ */ jsx(Loader2, {
                  className: "w-4 h-4 animate-spin"
                }) : /* @__PURE__ */ jsx(Upload, {
                  className: "w-4 h-4"
                }), "Dosya Yükle"]
              })]
            })]
          })
        }), /* @__PURE__ */ jsxs(CardContent, {
          children: [assistant.vectorStoreId && /* @__PURE__ */ jsx("div", {
            className: "mb-4 p-3 bg-muted/50 rounded-lg text-sm",
            children: /* @__PURE__ */ jsxs("p", {
              className: "text-muted-foreground",
              children: [/* @__PURE__ */ jsx("span", {
                className: "font-medium",
                children: "Vector Store ID:"
              }), " ", /* @__PURE__ */ jsx("code", {
                className: "text-xs bg-background px-1 py-0.5 rounded",
                children: assistant.vectorStoreId
              })]
            })
          }), assistant.vectorStoreFiles.length > 0 ? /* @__PURE__ */ jsx(ScrollArea, {
            className: "h-[300px]",
            children: /* @__PURE__ */ jsx("div", {
              className: "space-y-2",
              children: assistant.vectorStoreFiles.map((file) => /* @__PURE__ */ jsxs("div", {
                className: "flex items-center justify-between p-3 border rounded-lg bg-background hover:bg-muted/50 transition-colors",
                children: [/* @__PURE__ */ jsxs("div", {
                  className: "flex items-center gap-3 min-w-0",
                  children: [/* @__PURE__ */ jsx("div", {
                    className: "w-10 h-10 rounded-lg bg-[#21c6cc]/10 flex items-center justify-center text-[#21c6cc] shrink-0",
                    children: /* @__PURE__ */ jsx(FileText, {
                      className: "w-5 h-5"
                    })
                  }), /* @__PURE__ */ jsxs("div", {
                    className: "min-w-0",
                    children: [/* @__PURE__ */ jsx("p", {
                      className: "font-medium truncate",
                      children: file.fileName
                    }), /* @__PURE__ */ jsxs("p", {
                      className: "text-xs text-muted-foreground",
                      children: [formatFileSize(file.fileSize), " •", " ", /* @__PURE__ */ jsx(Badge, {
                        variant: file.status === "completed" ? "default" : "secondary",
                        className: "text-[10px] px-1",
                        children: file.status === "completed" ? "Hazır" : file.status
                      })]
                    })]
                  })]
                }), /* @__PURE__ */ jsx(Button, {
                  variant: "ghost",
                  size: "icon",
                  onClick: () => handleDeleteFile(file.openaiFileId),
                  disabled: deletingFileId === file.openaiFileId,
                  className: "shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10",
                  children: deletingFileId === file.openaiFileId ? /* @__PURE__ */ jsx(Loader2, {
                    className: "w-4 h-4 animate-spin"
                  }) : /* @__PURE__ */ jsx(Trash2, {
                    className: "w-4 h-4"
                  })
                })]
              }, file.id))
            })
          }) : /* @__PURE__ */ jsxs("div", {
            className: "text-center py-12 text-muted-foreground",
            children: [/* @__PURE__ */ jsx(Database, {
              className: "w-12 h-12 mx-auto mb-3 opacity-30"
            }), /* @__PURE__ */ jsx("p", {
              className: "font-medium",
              children: "Henüz dosya yok"
            }), /* @__PURE__ */ jsx("p", {
              className: "text-sm mt-1",
              children: "PDF, TXT, MD, DOCX gibi dosyalar yükleyebilirsiniz"
            })]
          })]
        })]
      })]
    }), /* @__PURE__ */ jsxs(Card, {
      children: [/* @__PURE__ */ jsx(CardHeader, {
        children: /* @__PURE__ */ jsxs("div", {
          className: "flex items-center justify-between",
          children: [/* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsxs(CardTitle, {
              className: "flex items-center gap-2",
              children: [/* @__PURE__ */ jsx(Terminal, {
                className: "w-5 h-5"
              }), "API Erişimi"]
            }), /* @__PURE__ */ jsx(CardDescription, {
              className: "mt-1",
              children: "Bu asistanı bir API anahtarı ile dışarıdan çağırın. Tam dokümantasyon için sağdaki butona tıklayın."
            })]
          }), /* @__PURE__ */ jsx(Button, {
            variant: "outline",
            size: "sm",
            asChild: true,
            className: "gap-2",
            children: /* @__PURE__ */ jsxs(Link, {
              to: "/docs/agent-api",
              target: "_blank",
              rel: "noreferrer",
              children: [/* @__PURE__ */ jsx(ExternalLink, {
                className: "w-4 h-4"
              }), "Dokümantasyon"]
            })
          })]
        })
      }), /* @__PURE__ */ jsxs(CardContent, {
        className: "space-y-4",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "space-y-2",
          children: [/* @__PURE__ */ jsx(Label, {
            children: "Endpoint"
          }), /* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-2",
            children: [/* @__PURE__ */ jsxs("code", {
              className: "flex-1 min-w-0 truncate rounded-md border bg-muted/50 px-3 py-2 text-sm",
              children: [/* @__PURE__ */ jsx("span", {
                className: "font-semibold text-[#21c6cc]",
                children: "POST"
              }), " ", apiEndpoint]
            }), /* @__PURE__ */ jsx(Button, {
              variant: "ghost",
              size: "icon",
              onClick: () => copyToClipboard(apiEndpoint, "Endpoint"),
              title: "Kopyala",
              children: /* @__PURE__ */ jsx(Copy, {
                className: "w-4 h-4"
              })
            })]
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground",
          children: ["Kimlik doğrulama:", " ", /* @__PURE__ */ jsx("code", {
            className: "text-xs bg-background px-1 py-0.5 rounded",
            children: "Authorization: Bearer <API_KEY>"
          }), ". Anahtarları", " ", /* @__PURE__ */ jsx(Link, {
            to: "/admin/api-keys",
            className: "text-[#21c6cc] hover:underline",
            children: "API Anahtarları"
          }), " ", "sayfasından oluşturup bu asistana izin verin."]
        }), /* @__PURE__ */ jsxs("div", {
          className: "space-y-2",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "flex items-center justify-between",
            children: [/* @__PURE__ */ jsx(Label, {
              children: "Örnek İstek"
            }), /* @__PURE__ */ jsxs(Button, {
              variant: "ghost",
              size: "sm",
              onClick: () => copyToClipboard(curlExample, "Komut"),
              className: "gap-2 h-7",
              children: [/* @__PURE__ */ jsx(Copy, {
                className: "w-3.5 h-3.5"
              }), "Kopyala"]
            })]
          }), /* @__PURE__ */ jsx("pre", {
            className: "overflow-x-auto rounded-md border bg-muted/50 p-3 text-xs leading-relaxed",
            children: /* @__PURE__ */ jsx("code", {
              children: curlExample
            })
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "space-y-3 rounded-lg border border-[#8d36ff]/30 bg-[#8d36ff]/5 p-4",
          children: [/* @__PURE__ */ jsx("div", {
            className: "flex items-center justify-between",
            children: /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("p", {
                className: "text-sm font-semibold",
                children: "OpenAI-uyumlu (AGORA)"
              }), /* @__PURE__ */ jsxs("p", {
                className: "text-xs text-muted-foreground",
                children: ["Mevcut OpenAI istemcilerini bu adrese yönlendirin; asistanı", " ", /* @__PURE__ */ jsx("code", {
                  className: "rounded bg-background px-1",
                  children: "model"
                }), " ", "alanıyla seçin (", /* @__PURE__ */ jsx("code", {
                  className: "rounded bg-background px-1",
                  children: agentRef
                }), ")."]
              })]
            })
          }), /* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-2",
            children: [/* @__PURE__ */ jsxs("code", {
              className: "flex-1 min-w-0 truncate rounded-md border bg-muted/50 px-3 py-2 text-sm",
              children: [/* @__PURE__ */ jsx("span", {
                className: "font-semibold text-[#8d36ff]",
                children: "POST"
              }), " ", agoraEndpoint]
            }), /* @__PURE__ */ jsx(Button, {
              variant: "ghost",
              size: "icon",
              onClick: () => copyToClipboard(agoraEndpoint, "Endpoint"),
              title: "Kopyala",
              children: /* @__PURE__ */ jsx(Copy, {
                className: "w-4 h-4"
              })
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "flex items-center justify-between",
            children: [/* @__PURE__ */ jsx(Label, {
              className: "text-xs",
              children: "Örnek (stream)"
            }), /* @__PURE__ */ jsxs(Button, {
              variant: "ghost",
              size: "sm",
              onClick: () => copyToClipboard(agoraCurl, "Komut"),
              className: "gap-2 h-7",
              children: [/* @__PURE__ */ jsx(Copy, {
                className: "w-3.5 h-3.5"
              }), "Kopyala"]
            })]
          }), /* @__PURE__ */ jsx("pre", {
            className: "overflow-x-auto rounded-md border bg-muted/50 p-3 text-xs leading-relaxed",
            children: /* @__PURE__ */ jsx("code", {
              children: agoraCurl
            })
          })]
        })]
      })]
    }), !isPublic && /* @__PURE__ */ jsxs(Card, {
      children: [/* @__PURE__ */ jsx(CardHeader, {
        children: /* @__PURE__ */ jsxs("div", {
          className: "flex items-center justify-between",
          children: [/* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsxs(CardTitle, {
              className: "flex items-center gap-2",
              children: [/* @__PURE__ */ jsx(Users, {
                className: "w-5 h-5"
              }), "Kullanıcı erişimi"]
            }), /* @__PURE__ */ jsx(CardDescription, {
              className: "mt-1",
              children: "Bu asistan özel. Sadece aşağıdaki Kullanıcılar erişebilir."
            })]
          }), /* @__PURE__ */ jsxs(Dialog, {
            open: assignDialogOpen,
            onOpenChange: setAssignDialogOpen,
            children: [/* @__PURE__ */ jsx(DialogTrigger, {
              asChild: true,
              children: /* @__PURE__ */ jsxs(Button, {
                size: "sm",
                className: "gap-2",
                children: [/* @__PURE__ */ jsx(UserPlus, {
                  className: "w-4 h-4"
                }), "Kullanıcı Ata"]
              })
            }), /* @__PURE__ */ jsxs(DialogContent, {
              children: [/* @__PURE__ */ jsx(DialogHeader, {
                children: /* @__PURE__ */ jsx(DialogTitle, {
                  children: "Kullanıcı Ata"
                })
              }), /* @__PURE__ */ jsxs("div", {
                className: "space-y-4 mt-4",
                children: [/* @__PURE__ */ jsxs("div", {
                  className: "relative",
                  children: [/* @__PURE__ */ jsx(Search, {
                    className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                  }), /* @__PURE__ */ jsx(Input, {
                    placeholder: "Kullanıcı ara...",
                    value: userSearch,
                    onChange: (e) => setUserSearch(e.target.value),
                    className: "pl-9"
                  })]
                }), filteredUsers.length > 0 ? /* @__PURE__ */ jsx(ScrollArea, {
                  className: "h-[300px] border rounded-lg",
                  children: /* @__PURE__ */ jsx("div", {
                    className: "p-2 space-y-1",
                    children: filteredUsers.map((user) => /* @__PURE__ */ jsxs("button", {
                      onClick: () => toggleUserSelection(user.id),
                      className: cn("w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors", selectedUsers.includes(user.id) ? "bg-[#21c6cc]/10 border border-[#21c6cc]/30" : "hover:bg-muted"),
                      children: [/* @__PURE__ */ jsx("div", {
                        className: "w-9 h-9 rounded-full bg-gradient-to-br from-[#8d36ff] to-[#21c6cc] flex items-center justify-center text-white font-medium text-sm shrink-0",
                        children: user.name?.charAt(0) || user.email.charAt(0)
                      }), /* @__PURE__ */ jsxs("div", {
                        className: "flex-1 min-w-0",
                        children: [/* @__PURE__ */ jsx("p", {
                          className: "font-medium truncate",
                          children: user.name
                        }), /* @__PURE__ */ jsx("p", {
                          className: "text-xs text-muted-foreground truncate",
                          children: user.email
                        })]
                      }), selectedUsers.includes(user.id) && /* @__PURE__ */ jsx(Check, {
                        className: "w-5 h-5 text-[#21c6cc] shrink-0"
                      })]
                    }, user.id))
                  })
                }) : /* @__PURE__ */ jsxs("div", {
                  className: "text-center py-8 text-muted-foreground border rounded-lg",
                  children: [/* @__PURE__ */ jsx(Users, {
                    className: "w-10 h-10 mx-auto mb-2 opacity-30"
                  }), /* @__PURE__ */ jsx("p", {
                    children: "Atanabilecek Kullanıcı bulunamadı"
                  })]
                }), selectedUsers.length > 0 && /* @__PURE__ */ jsxs("p", {
                  className: "text-sm text-muted-foreground",
                  children: [selectedUsers.length, " Kullanıcı seçildi"]
                })]
              }), /* @__PURE__ */ jsxs(DialogFooter, {
                children: [/* @__PURE__ */ jsx(Button, {
                  variant: "outline",
                  onClick: () => setAssignDialogOpen(false),
                  children: "İptal"
                }), /* @__PURE__ */ jsxs(Button, {
                  onClick: handleAssignUsers,
                  disabled: selectedUsers.length === 0 || isAssigning,
                  className: "gap-2",
                  children: [isAssigning ? /* @__PURE__ */ jsx(Loader2, {
                    className: "w-4 h-4 animate-spin"
                  }) : /* @__PURE__ */ jsx(Plus, {
                    className: "w-4 h-4"
                  }), "erişim Ver"]
                })]
              })]
            })]
          })]
        })
      }), /* @__PURE__ */ jsx(CardContent, {
        children: assistant.userAccess.length > 0 ? /* @__PURE__ */ jsx("div", {
          className: "grid md:grid-cols-2 lg:grid-cols-3 gap-3",
          children: assistant.userAccess.map((access) => /* @__PURE__ */ jsxs("div", {
            className: "flex items-center justify-between p-3 border rounded-lg bg-background",
            children: [/* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-3 min-w-0",
              children: [/* @__PURE__ */ jsx("div", {
                className: "w-10 h-10 rounded-full bg-gradient-to-br from-[#8d36ff] to-[#21c6cc] flex items-center justify-center text-white font-medium shrink-0",
                children: access.user.name?.charAt(0) || access.user.email.charAt(0)
              }), /* @__PURE__ */ jsxs("div", {
                className: "min-w-0",
                children: [/* @__PURE__ */ jsx("p", {
                  className: "font-medium truncate",
                  children: access.user.name
                }), /* @__PURE__ */ jsx("p", {
                  className: "text-xs text-muted-foreground truncate",
                  children: access.user.email
                })]
              })]
            }), /* @__PURE__ */ jsx(Button, {
              variant: "ghost",
              size: "icon",
              onClick: () => handleRemoveAccess(access.userId),
              disabled: removingAccessId === access.userId,
              className: "shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10",
              children: removingAccessId === access.userId ? /* @__PURE__ */ jsx(Loader2, {
                className: "w-4 h-4 animate-spin"
              }) : /* @__PURE__ */ jsx(X, {
                className: "w-4 h-4"
              })
            })]
          }, access.id))
        }) : /* @__PURE__ */ jsxs("div", {
          className: "text-center py-12 text-muted-foreground",
          children: [/* @__PURE__ */ jsx(Users, {
            className: "w-12 h-12 mx-auto mb-3 opacity-30"
          }), /* @__PURE__ */ jsx("p", {
            className: "font-medium",
            children: "Henüz Kullanıcı atanmamış"
          }), /* @__PURE__ */ jsx("p", {
            className: "text-sm mt-1",
            children: "erişim vermek için Kullanıcı atayın."
          })]
        })
      })]
    })]
  });
});
const route12 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: assistantDetail,
  loader: loader$o
}, Symbol.toStringTag, { value: "Module" }));
async function loader$n() {
  const users2 = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: {
        select: {
          chats: true,
          accessGrants: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return {
    users: users2
  };
}
const users = UNSAFE_withComponentProps(function AdminUsers({
  loaderData
}) {
  const {
    users: users2
  } = loaderData;
  const admins = users2.filter((u) => u.role === "admin");
  const regularUsers = users2.filter((u) => u.role !== "admin");
  return /* @__PURE__ */ jsxs("div", {
    className: "space-y-8",
    children: [/* @__PURE__ */ jsxs("div", {
      children: [/* @__PURE__ */ jsx("h1", {
        className: "text-3xl font-bold",
        children: "Kullanıcılar"
      }), /* @__PURE__ */ jsx("p", {
        className: "text-muted-foreground mt-1",
        children: "Kullanıcıları ve erişim yetkilerini yönetin"
      })]
    }), /* @__PURE__ */ jsxs("div", {
      className: "grid grid-cols-1 md:grid-cols-3 gap-4",
      children: [/* @__PURE__ */ jsx(Card, {
        children: /* @__PURE__ */ jsx(CardContent, {
          className: "pt-6",
          children: /* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-4",
            children: [/* @__PURE__ */ jsx("div", {
              className: "w-12 h-12 rounded-xl bg-[#21c6cc]/10 flex items-center justify-center text-[#21c6cc]",
              children: /* @__PURE__ */ jsx(Users, {
                className: "w-6 h-6"
              })
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("p", {
                className: "text-sm text-muted-foreground",
                children: "Toplam Kullanıcı"
              }), /* @__PURE__ */ jsx("p", {
                className: "text-2xl font-bold",
                children: users2.length
              })]
            })]
          })
        })
      }), /* @__PURE__ */ jsx(Card, {
        children: /* @__PURE__ */ jsx(CardContent, {
          className: "pt-6",
          children: /* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-4",
            children: [/* @__PURE__ */ jsx("div", {
              className: "w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600",
              children: /* @__PURE__ */ jsx(Shield, {
                className: "w-6 h-6"
              })
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("p", {
                className: "text-sm text-muted-foreground",
                children: "Yöneticiler"
              }), /* @__PURE__ */ jsx("p", {
                className: "text-2xl font-bold",
                children: admins.length
              })]
            })]
          })
        })
      }), /* @__PURE__ */ jsx(Card, {
        children: /* @__PURE__ */ jsx(CardContent, {
          className: "pt-6",
          children: /* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-4",
            children: [/* @__PURE__ */ jsx("div", {
              className: "w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600",
              children: /* @__PURE__ */ jsx(User, {
                className: "w-6 h-6"
              })
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("p", {
                className: "text-sm text-muted-foreground",
                children: "Normal Kullanıcılar"
              }), /* @__PURE__ */ jsx("p", {
                className: "text-2xl font-bold",
                children: regularUsers.length
              })]
            })]
          })
        })
      })]
    }), /* @__PURE__ */ jsxs(Card, {
      children: [/* @__PURE__ */ jsxs(CardHeader, {
        children: [/* @__PURE__ */ jsx(CardTitle, {
          children: "Tüm Kullanıcılar"
        }), /* @__PURE__ */ jsx(CardDescription, {
          children: "Kullanıcı listesi ve erişim durumları"
        })]
      }), /* @__PURE__ */ jsx(CardContent, {
        children: users2.length > 0 ? /* @__PURE__ */ jsx("div", {
          className: "space-y-2",
          children: users2.map((user) => /* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-4 p-4 rounded-lg hover:bg-secondary transition-colors",
            children: [/* @__PURE__ */ jsx("div", {
              className: "w-10 h-10 rounded-full bg-[#21c6cc] flex items-center justify-center text-white font-medium",
              children: user.name?.charAt(0) || user.email?.charAt(0) || "U"
            }), /* @__PURE__ */ jsxs("div", {
              className: "flex-1 min-w-0",
              children: [/* @__PURE__ */ jsxs("div", {
                className: "flex items-center gap-2",
                children: [/* @__PURE__ */ jsx("p", {
                  className: "font-medium truncate",
                  children: user.name
                }), /* @__PURE__ */ jsx(Badge, {
                  variant: user.role === "admin" ? "default" : "secondary",
                  children: user.role === "admin" ? "Yönetici" : "Kullanıcı"
                })]
              }), /* @__PURE__ */ jsx("p", {
                className: "text-sm text-muted-foreground truncate",
                children: user.email
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-4 text-sm text-muted-foreground",
              children: [/* @__PURE__ */ jsxs("span", {
                className: "flex items-center gap-1",
                children: [/* @__PURE__ */ jsx(Bot, {
                  className: "w-4 h-4"
                }), user._count.accessGrants, " asistan"]
              }), /* @__PURE__ */ jsxs("span", {
                children: [user._count.chats, " sohbet"]
              })]
            })]
          }, user.id))
        }) : /* @__PURE__ */ jsxs("div", {
          className: "text-center py-12",
          children: [/* @__PURE__ */ jsx(Users, {
            className: "w-16 h-16 mx-auto text-muted-foreground/20 mb-4"
          }), /* @__PURE__ */ jsx("h3", {
            className: "text-lg font-semibold mb-2",
            children: "Henüz Kullanıcı Yok"
          }), /* @__PURE__ */ jsx("p", {
            className: "text-muted-foreground",
            children: "Kullanıcılar kayit oldukça burada görünecekler"
          })]
        })
      })]
    })]
  });
});
const route13 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: users,
  loader: loader$n
}, Symbol.toStringTag, { value: "Module" }));
async function loader$m() {
  const [keys, assistants2] = await Promise.all([prisma.apiKey.findMany({
    select: {
      id: true,
      name: true,
      keyPrefix: true,
      revoked: true,
      lastUsedAt: true,
      createdAt: true,
      assistants: {
        select: {
          id: true,
          name: true
        },
        orderBy: {
          name: "asc"
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  }), prisma.assistant.findMany({
    select: {
      id: true,
      name: true
    },
    orderBy: {
      name: "asc"
    }
  })]);
  return {
    keys,
    assistants: assistants2
  };
}
function formatDate$1(d) {
  if (!d) return "—";
  return new Date(d).toLocaleString("tr-TR", {
    dateStyle: "medium",
    timeStyle: "short"
  });
}
const apiKeys = UNSAFE_withComponentProps(function AdminApiKeys({
  loaderData
}) {
  const {
    keys,
    assistants: assistants2
  } = loaderData;
  const revalidator = useRevalidator();
  const [createOpen, setCreateOpen] = useState(false);
  const [name, setName] = useState("");
  const [selected, setSelected] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [rawKey, setRawKey] = useState(null);
  const [editKey, setEditKey] = useState(null);
  const [editSelected, setEditSelected] = useState([]);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const toggle = (list, setList, id) => setList(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
  const copy = (text) => copyText(text).then((ok) => ok ? toast.success("Kopyalandı") : toast.error("Kopyalanamadı"));
  const handleCreate = async () => {
    if (selected.length === 0) {
      toast.error("En az bir asistan seçin");
      return;
    }
    setIsCreating(true);
    try {
      const res = await fetch("/api/admin/api-keys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          assistantIds: selected
        })
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.rawKey) {
        setCreateOpen(false);
        setName("");
        setSelected([]);
        setRawKey(data.rawKey);
        revalidator.revalidate();
      } else {
        toast.error(data?.error || "Anahtar oluşturulamadı");
      }
    } finally {
      setIsCreating(false);
    }
  };
  const patchKey = async (id, body, okMsg) => {
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/api-keys/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        toast.success(okMsg);
        revalidator.revalidate();
        return true;
      }
      const data = await res.json().catch(() => null);
      toast.error(data?.error || "İşlem başarısız");
      return false;
    } finally {
      setBusyId(null);
    }
  };
  const handleDelete = async (id) => {
    if (!confirm("Bu anahtarı silmek istediğinize emin misiniz?")) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/api-keys/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        toast.success("Anahtar silindi");
        revalidator.revalidate();
      } else {
        toast.error("Silinemedi");
      }
    } finally {
      setBusyId(null);
    }
  };
  const openEdit = (key) => {
    setEditKey(key);
    setEditSelected(key.assistants.map((a) => a.id));
  };
  const handleSaveEdit = async () => {
    if (!editKey) return;
    if (editSelected.length === 0) {
      toast.error("En az bir asistan seçin");
      return;
    }
    setIsSavingEdit(true);
    const ok = await patchKey(editKey.id, {
      assistantIds: editSelected
    }, "İzinler güncellendi");
    setIsSavingEdit(false);
    if (ok) setEditKey(null);
  };
  const AssistantChecklist = ({
    value,
    onToggle
  }) => /* @__PURE__ */ jsxs("div", {
    className: "space-y-2",
    children: [/* @__PURE__ */ jsxs("div", {
      className: "flex items-center justify-between",
      children: [/* @__PURE__ */ jsx(Label, {
        children: "İzinli Asistanlar"
      }), /* @__PURE__ */ jsx("button", {
        type: "button",
        className: "text-xs text-[#21c6cc] hover:underline",
        onClick: () => value.length === assistants2.length ? assistants2.forEach((a) => value.includes(a.id) && onToggle(a.id)) : assistants2.forEach((a) => !value.includes(a.id) && onToggle(a.id)),
        children: value.length === assistants2.length ? "Temizle" : "Tümünü seç"
      })]
    }), assistants2.length > 0 ? /* @__PURE__ */ jsx(ScrollArea, {
      className: "h-[200px] rounded-lg border",
      children: /* @__PURE__ */ jsx("div", {
        className: "p-2 space-y-1",
        children: assistants2.map((a) => /* @__PURE__ */ jsxs("button", {
          type: "button",
          onClick: () => onToggle(a.id),
          className: `flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors ${value.includes(a.id) ? "bg-[#21c6cc]/10 border border-[#21c6cc]/30" : "hover:bg-muted border border-transparent"}`,
          children: [/* @__PURE__ */ jsx("span", {
            className: `flex h-5 w-5 items-center justify-center rounded border ${value.includes(a.id) ? "bg-[#21c6cc] border-[#21c6cc] text-white" : "border-muted-foreground/40"}`,
            children: value.includes(a.id) && /* @__PURE__ */ jsx(Check, {
              className: "h-3.5 w-3.5"
            })
          }), /* @__PURE__ */ jsx("span", {
            className: "truncate",
            children: a.name
          })]
        }, a.id))
      })
    }) : /* @__PURE__ */ jsx("p", {
      className: "text-sm text-muted-foreground",
      children: "Önce bir asistan oluşturun."
    })]
  });
  return /* @__PURE__ */ jsxs("div", {
    className: "space-y-8",
    children: [/* @__PURE__ */ jsxs("div", {
      className: "flex items-center justify-between",
      children: [/* @__PURE__ */ jsxs("div", {
        children: [/* @__PURE__ */ jsx("h1", {
          className: "text-3xl font-bold",
          children: "API Anahtarları"
        }), /* @__PURE__ */ jsx("p", {
          className: "mt-1 text-muted-foreground",
          children: "Agent API için anahtar üretin ve hangi asistanlara erişebileceğini seçin."
        })]
      }), /* @__PURE__ */ jsxs(Dialog, {
        open: createOpen,
        onOpenChange: setCreateOpen,
        children: [/* @__PURE__ */ jsx(DialogTrigger, {
          asChild: true,
          children: /* @__PURE__ */ jsxs(Button, {
            className: "gap-2 bg-gradient-to-r from-[#8d36ff] via-[#d84fd2] to-[#21c6cc] hover:brightness-110",
            children: [/* @__PURE__ */ jsx(Plus, {
              className: "h-4 w-4"
            }), "Yeni Anahtar"]
          })
        }), /* @__PURE__ */ jsxs(DialogContent, {
          className: "max-w-lg",
          children: [/* @__PURE__ */ jsx(DialogHeader, {
            children: /* @__PURE__ */ jsx(DialogTitle, {
              children: "Yeni API Anahtarı"
            })
          }), /* @__PURE__ */ jsxs("div", {
            className: "mt-4 space-y-4",
            children: [/* @__PURE__ */ jsxs("div", {
              className: "space-y-2",
              children: [/* @__PURE__ */ jsx(Label, {
                children: "Ad (opsiyonel)"
              }), /* @__PURE__ */ jsx(Input, {
                value: name,
                onChange: (e) => setName(e.target.value),
                placeholder: "Orn: prod-entegrasyon"
              })]
            }), /* @__PURE__ */ jsx(AssistantChecklist, {
              value: selected,
              onToggle: (id) => toggle(selected, setSelected, id)
            }), /* @__PURE__ */ jsxs(Button, {
              onClick: handleCreate,
              disabled: isCreating || selected.length === 0,
              className: "w-full gap-2 bg-gradient-to-r from-[#8d36ff] via-[#d84fd2] to-[#21c6cc] hover:brightness-110",
              children: [isCreating ? /* @__PURE__ */ jsx(Loader2, {
                className: "h-4 w-4 animate-spin"
              }) : /* @__PURE__ */ jsx(KeyRound, {
                className: "h-4 w-4"
              }), "Anahtar oluştur"]
            })]
          })]
        })]
      })]
    }), keys.length > 0 ? /* @__PURE__ */ jsx("div", {
      className: "space-y-3",
      children: keys.map((key) => /* @__PURE__ */ jsx(Card, {
        children: /* @__PURE__ */ jsxs(CardContent, {
          className: "flex flex-col gap-4 pt-6 md:flex-row md:items-center md:justify-between",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "min-w-0 space-y-2",
            children: [/* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-2",
              children: [/* @__PURE__ */ jsx(KeyRound, {
                className: "h-4 w-4 text-[#21c6cc]"
              }), /* @__PURE__ */ jsx("span", {
                className: "font-medium",
                children: key.name || "İsimsiz anahtar"
              }), key.revoked ? /* @__PURE__ */ jsx(Badge, {
                variant: "destructive",
                children: "İptal edildi"
              }) : /* @__PURE__ */ jsx(Badge, {
                variant: "default",
                children: "Aktif"
              })]
            }), /* @__PURE__ */ jsxs("p", {
              className: "text-sm text-muted-foreground",
              children: [/* @__PURE__ */ jsxs("code", {
                className: "rounded bg-muted px-1 py-0.5 text-xs",
                children: [key.keyPrefix, "…"]
              }), " ", "· Son kullanım: ", formatDate$1(key.lastUsedAt), " · Oluşturuldu:", " ", formatDate$1(key.createdAt)]
            }), /* @__PURE__ */ jsxs("div", {
              className: "flex flex-wrap items-center gap-1.5",
              children: [/* @__PURE__ */ jsx(ShieldCheck, {
                className: "h-3.5 w-3.5 text-muted-foreground"
              }), key.assistants.length > 0 ? key.assistants.map((a) => /* @__PURE__ */ jsx(Badge, {
                variant: "secondary",
                className: "text-xs",
                children: a.name
              }, a.id)) : /* @__PURE__ */ jsx("span", {
                className: "text-xs text-muted-foreground",
                children: "İzin yok"
              })]
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "flex shrink-0 items-center gap-2",
            children: [/* @__PURE__ */ jsx(Button, {
              variant: "outline",
              size: "sm",
              asChild: true,
              children: /* @__PURE__ */ jsx(Link, {
                to: `/admin/api-keys/${key.id}`,
                children: "Detay"
              })
            }), /* @__PURE__ */ jsx(Button, {
              variant: "outline",
              size: "sm",
              onClick: () => openEdit(key),
              children: "İzinler"
            }), /* @__PURE__ */ jsxs(Button, {
              variant: "outline",
              size: "sm",
              disabled: busyId === key.id,
              onClick: () => patchKey(key.id, {
                revoked: !key.revoked
              }, key.revoked ? "Anahtar etkinleştirildi" : "Anahtar iptal edildi"),
              className: "gap-1.5",
              children: [busyId === key.id ? /* @__PURE__ */ jsx(Loader2, {
                className: "h-4 w-4 animate-spin"
              }) : key.revoked ? /* @__PURE__ */ jsx(Check, {
                className: "h-4 w-4"
              }) : /* @__PURE__ */ jsx(Ban, {
                className: "h-4 w-4"
              }), key.revoked ? "Etkinleştir" : "İptal et"]
            }), /* @__PURE__ */ jsx(Button, {
              variant: "ghost",
              size: "icon",
              disabled: busyId === key.id,
              onClick: () => handleDelete(key.id),
              className: "text-destructive hover:bg-destructive/10 hover:text-destructive",
              children: /* @__PURE__ */ jsx(Trash2, {
                className: "h-4 w-4"
              })
            })]
          })]
        })
      }, key.id))
    }) : /* @__PURE__ */ jsx(Card, {
      children: /* @__PURE__ */ jsxs(CardContent, {
        className: "py-16 text-center",
        children: [/* @__PURE__ */ jsx(KeyRound, {
          className: "mx-auto mb-4 h-16 w-16 text-muted-foreground/20"
        }), /* @__PURE__ */ jsx("h3", {
          className: "mb-2 text-lg font-semibold",
          children: "Henüz anahtar yok"
        }), /* @__PURE__ */ jsx("p", {
          className: "mb-6 text-muted-foreground",
          children: "İlk API anahtarınızı oluşturun ve erişebileceği asistanları seçin."
        })]
      })
    }), /* @__PURE__ */ jsx(Dialog, {
      open: !!rawKey,
      onOpenChange: (o) => !o && setRawKey(null),
      children: /* @__PURE__ */ jsxs(DialogContent, {
        children: [/* @__PURE__ */ jsx(DialogHeader, {
          children: /* @__PURE__ */ jsx(DialogTitle, {
            children: "Anahtar oluşturuldu"
          })
        }), /* @__PURE__ */ jsxs("div", {
          className: "space-y-3",
          children: [/* @__PURE__ */ jsx("p", {
            className: "text-sm text-muted-foreground",
            children: "Bu anahtarı şimdi kopyalayın — bir daha gösterilmeyecek."
          }), /* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-2",
            children: [/* @__PURE__ */ jsx("code", {
              className: "flex-1 truncate rounded-md border bg-muted/50 px-3 py-2 text-sm",
              children: rawKey
            }), /* @__PURE__ */ jsx(Button, {
              variant: "ghost",
              size: "icon",
              onClick: () => rawKey && copy(rawKey),
              children: /* @__PURE__ */ jsx(Copy, {
                className: "h-4 w-4"
              })
            })]
          })]
        }), /* @__PURE__ */ jsx(DialogFooter, {
          children: /* @__PURE__ */ jsx(Button, {
            onClick: () => setRawKey(null),
            children: "Tamam"
          })
        })]
      })
    }), /* @__PURE__ */ jsx(Dialog, {
      open: !!editKey,
      onOpenChange: (o) => !o && setEditKey(null),
      children: /* @__PURE__ */ jsxs(DialogContent, {
        className: "max-w-lg",
        children: [/* @__PURE__ */ jsx(DialogHeader, {
          children: /* @__PURE__ */ jsxs(DialogTitle, {
            children: ["İzinleri düzenle ", editKey?.name ? `— ${editKey.name}` : ""]
          })
        }), /* @__PURE__ */ jsx("div", {
          className: "mt-4 space-y-4",
          children: /* @__PURE__ */ jsx(AssistantChecklist, {
            value: editSelected,
            onToggle: (id) => toggle(editSelected, setEditSelected, id)
          })
        }), /* @__PURE__ */ jsxs(DialogFooter, {
          children: [/* @__PURE__ */ jsx(Button, {
            variant: "outline",
            onClick: () => setEditKey(null),
            children: "İptal"
          }), /* @__PURE__ */ jsxs(Button, {
            onClick: handleSaveEdit,
            disabled: isSavingEdit,
            className: "gap-2",
            children: [isSavingEdit && /* @__PURE__ */ jsx(Loader2, {
              className: "h-4 w-4 animate-spin"
            }), "Kaydet"]
          })]
        })]
      })
    })]
  });
});
const route14 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: apiKeys,
  loader: loader$m
}, Symbol.toStringTag, { value: "Module" }));
async function loader$l({
  params
}) {
  const keyId = params.keyId;
  const keyInfo = await prisma.apiKey.findUnique({
    where: {
      id: keyId
    },
    select: {
      id: true,
      name: true,
      keyPrefix: true,
      revoked: true,
      lastUsedAt: true,
      createdAt: true,
      assistants: {
        select: {
          id: true,
          name: true
        },
        orderBy: {
          name: "asc"
        }
      }
    }
  });
  if (!keyInfo) {
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/admin/api-keys"
      }
    });
  }
  const since = new Date(Date.now() - 14 * 24 * 60 * 60 * 1e3);
  const [agg, rows, recentRaw, assistants2] = await Promise.all([prisma.apiKeyUsage.aggregate({
    where: {
      apiKeyId: keyId
    },
    _count: {
      _all: true
    },
    _sum: {
      totalTokens: true
    }
  }), prisma.apiKeyUsage.findMany({
    where: {
      apiKeyId: keyId,
      createdAt: {
        gte: since
      }
    },
    select: {
      createdAt: true,
      ip: true,
      status: true,
      totalTokens: true,
      assistantId: true
    },
    take: 5e3
  }), prisma.apiKeyUsage.findMany({
    where: {
      apiKeyId: keyId
    },
    orderBy: {
      createdAt: "desc"
    },
    take: 20,
    select: {
      id: true,
      createdAt: true,
      ip: true,
      status: true,
      totalTokens: true,
      assistantId: true
    }
  }), prisma.assistant.findMany({
    select: {
      id: true,
      name: true
    },
    orderBy: {
      name: "asc"
    }
  })]);
  const nameById = new Map(assistants2.map((a) => [a.id, a.name]));
  const dayKeys = [];
  const dayMap = /* @__PURE__ */ new Map();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1e3);
    const key = d.toISOString().slice(0, 10);
    const label = `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}`;
    dayKeys.push(key);
    dayMap.set(key, {
      label,
      calls: 0,
      tokens: 0
    });
  }
  const agentCounts = /* @__PURE__ */ new Map();
  const ipCounts = /* @__PURE__ */ new Map();
  for (const r of rows) {
    const key = new Date(r.createdAt).toISOString().slice(0, 10);
    const bucket = dayMap.get(key);
    if (bucket) {
      bucket.calls += 1;
      bucket.tokens += r.totalTokens;
    }
    const an = r.assistantId ? nameById.get(r.assistantId) ?? r.assistantId : "—";
    agentCounts.set(an, (agentCounts.get(an) ?? 0) + 1);
    const ip = r.ip || "bilinmiyor";
    ipCounts.set(ip, (ipCounts.get(ip) ?? 0) + 1);
  }
  const byAgent = [...agentCounts.entries()].map(([label, value]) => ({
    label,
    value
  })).sort((a, b) => b.value - a.value);
  const byIp = [...ipCounts.entries()].map(([label, value]) => ({
    label,
    value
  })).sort((a, b) => b.value - a.value).slice(0, 8);
  const recent = recentRaw.map((r) => ({
    id: r.id,
    createdAt: r.createdAt,
    ip: r.ip,
    status: r.status,
    totalTokens: r.totalTokens,
    agentName: r.assistantId ? nameById.get(r.assistantId) ?? r.assistantId : "—"
  }));
  return {
    keyInfo,
    assistants: assistants2,
    totals: {
      calls: agg._count._all,
      tokens: agg._sum.totalTokens ?? 0,
      uniqueIps: ipCounts.size
    },
    days: dayKeys.map((k) => dayMap.get(k)),
    byAgent,
    byIp,
    recent
  };
}
function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleString("tr-TR", {
    dateStyle: "short",
    timeStyle: "short"
  });
}
function statusClass(status) {
  if (status >= 500) return "bg-red-500/15 text-red-400";
  if (status >= 400) return "bg-amber-500/15 text-amber-400";
  return "bg-emerald-500/15 text-emerald-400";
}
const apiKeyDetail = UNSAFE_withComponentProps(function ApiKeyDetail({
  loaderData
}) {
  const {
    keyInfo,
    assistants: assistants2,
    totals,
    days,
    byAgent,
    byIp,
    recent
  } = loaderData;
  const navigate = useNavigate();
  const revalidator = useRevalidator();
  const [busy, setBusy] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selected, setSelected] = useState(keyInfo.assistants.map((a) => a.id));
  const [savingEdit, setSavingEdit] = useState(false);
  const patch = async (body, okMsg) => {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/api-keys/${keyInfo.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        toast.success(okMsg);
        revalidator.revalidate();
        return true;
      }
      toast.error("İşlem başarısız");
      return false;
    } finally {
      setBusy(false);
    }
  };
  const handleDelete = async () => {
    if (!confirm("Bu anahtarı silmek istediğinize emin misiniz?")) return;
    setBusy(true);
    const res = await fetch(`/api/admin/api-keys/${keyInfo.id}`, {
      method: "DELETE"
    });
    if (res.ok) {
      toast.success("Anahtar silindi");
      navigate("/admin/api-keys");
    } else {
      toast.error("Silinemedi");
      setBusy(false);
    }
  };
  const handleSaveEdit = async () => {
    if (selected.length === 0) {
      toast.error("En az bir asistan seçin");
      return;
    }
    setSavingEdit(true);
    const ok = await patch({
      assistantIds: selected
    }, "İzinler güncellendi");
    setSavingEdit(false);
    if (ok) setEditOpen(false);
  };
  const maxCalls = Math.max(1, ...days.map((d) => d.calls));
  const maxTokens = Math.max(1, ...days.map((d) => d.tokens));
  const maxAgent = Math.max(1, ...byAgent.map((b) => b.value));
  const maxIp = Math.max(1, ...byIp.map((b) => b.value));
  return /* @__PURE__ */ jsxs("div", {
    className: "space-y-8",
    children: [/* @__PURE__ */ jsxs("div", {
      className: "flex flex-wrap items-center justify-between gap-4",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "flex items-center gap-4",
        children: [/* @__PURE__ */ jsx(Link, {
          to: "/admin/api-keys",
          children: /* @__PURE__ */ jsx(Button, {
            variant: "ghost",
            size: "icon",
            children: /* @__PURE__ */ jsx(ArrowLeft, {
              className: "h-5 w-5"
            })
          })
        }), /* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-2",
            children: [/* @__PURE__ */ jsx(KeyRound, {
              className: "h-5 w-5 text-[#21c6cc]"
            }), /* @__PURE__ */ jsx("h1", {
              className: "text-2xl font-bold",
              children: keyInfo.name || "İsimsiz anahtar"
            }), keyInfo.revoked ? /* @__PURE__ */ jsx(Badge, {
              variant: "destructive",
              children: "İptal edildi"
            }) : /* @__PURE__ */ jsx(Badge, {
              variant: "default",
              children: "Aktif"
            })]
          }), /* @__PURE__ */ jsxs("p", {
            className: "mt-1 text-sm text-muted-foreground",
            children: [/* @__PURE__ */ jsxs("code", {
              className: "rounded bg-muted px-1 py-0.5 text-xs",
              children: [keyInfo.keyPrefix, "…"]
            }), " ", "· Oluşturuldu ", formatDate(keyInfo.createdAt), " · Son kullanım", " ", formatDate(keyInfo.lastUsedAt)]
          })]
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "flex items-center gap-2",
        children: [/* @__PURE__ */ jsx(Button, {
          variant: "outline",
          size: "sm",
          onClick: () => setEditOpen(true),
          children: "İzinleri düzenle"
        }), /* @__PURE__ */ jsxs(Button, {
          variant: "outline",
          size: "sm",
          disabled: busy,
          onClick: () => patch({
            revoked: !keyInfo.revoked
          }, keyInfo.revoked ? "Anahtar etkinleştirildi" : "Anahtar pasifleştirildi"),
          className: "gap-1.5",
          children: [busy ? /* @__PURE__ */ jsx(Loader2, {
            className: "h-4 w-4 animate-spin"
          }) : keyInfo.revoked ? /* @__PURE__ */ jsx(Check, {
            className: "h-4 w-4"
          }) : /* @__PURE__ */ jsx(Ban, {
            className: "h-4 w-4"
          }), keyInfo.revoked ? "Etkinleştir" : "Pasifize et"]
        }), /* @__PURE__ */ jsx(Button, {
          variant: "ghost",
          size: "icon",
          disabled: busy,
          onClick: handleDelete,
          className: "text-destructive hover:bg-destructive/10 hover:text-destructive",
          children: /* @__PURE__ */ jsx(Trash2, {
            className: "h-4 w-4"
          })
        })]
      })]
    }), /* @__PURE__ */ jsxs("div", {
      className: "flex flex-wrap items-center gap-1.5",
      children: [/* @__PURE__ */ jsx(ShieldCheck, {
        className: "h-4 w-4 text-muted-foreground"
      }), /* @__PURE__ */ jsx("span", {
        className: "text-sm text-muted-foreground",
        children: "İzinli asistanlar:"
      }), keyInfo.assistants.length > 0 ? keyInfo.assistants.map((a) => /* @__PURE__ */ jsx(Badge, {
        variant: "secondary",
        className: "text-xs",
        children: a.name
      }, a.id)) : /* @__PURE__ */ jsx("span", {
        className: "text-xs text-muted-foreground",
        children: "İzin yok"
      })]
    }), /* @__PURE__ */ jsxs("div", {
      className: "grid grid-cols-1 gap-4 md:grid-cols-3",
      children: [/* @__PURE__ */ jsx(StatTile, {
        icon: /* @__PURE__ */ jsx(Activity, {
          className: "h-5 w-5"
        }),
        label: "Toplam Çağrı",
        value: totals.calls.toLocaleString("tr-TR"),
        tint: "#21c6cc"
      }), /* @__PURE__ */ jsx(StatTile, {
        icon: /* @__PURE__ */ jsx(Coins, {
          className: "h-5 w-5"
        }),
        label: "Toplam Token",
        value: totals.tokens.toLocaleString("tr-TR"),
        tint: "#8d36ff"
      }), /* @__PURE__ */ jsx(StatTile, {
        icon: /* @__PURE__ */ jsx(Globe2, {
          className: "h-5 w-5"
        }),
        label: "Benzersiz IP (14g)",
        value: totals.uniqueIps.toLocaleString("tr-TR"),
        tint: "#d84fd2"
      })]
    }), /* @__PURE__ */ jsxs("div", {
      className: "grid gap-6 lg:grid-cols-2",
      children: [/* @__PURE__ */ jsxs(Card, {
        children: [/* @__PURE__ */ jsxs(CardHeader, {
          children: [/* @__PURE__ */ jsx(CardTitle, {
            className: "text-base",
            children: "Son 14 Gün — Çağrı Sayısı"
          }), /* @__PURE__ */ jsx(CardDescription, {
            children: "Günlük istek adedi"
          })]
        }), /* @__PURE__ */ jsx(CardContent, {
          children: /* @__PURE__ */ jsx(VBars, {
            data: days.map((d) => ({
              label: d.label,
              value: d.calls
            })),
            max: maxCalls,
            color: "#21c6cc"
          })
        })]
      }), /* @__PURE__ */ jsxs(Card, {
        children: [/* @__PURE__ */ jsxs(CardHeader, {
          children: [/* @__PURE__ */ jsx(CardTitle, {
            className: "text-base",
            children: "Son 14 Gün — Token Kullanımı"
          }), /* @__PURE__ */ jsx(CardDescription, {
            children: "Günlük toplam token"
          })]
        }), /* @__PURE__ */ jsx(CardContent, {
          children: /* @__PURE__ */ jsx(VBars, {
            data: days.map((d) => ({
              label: d.label,
              value: d.tokens
            })),
            max: maxTokens,
            color: "#8d36ff"
          })
        })]
      })]
    }), /* @__PURE__ */ jsxs("div", {
      className: "grid gap-6 lg:grid-cols-2",
      children: [/* @__PURE__ */ jsxs(Card, {
        children: [/* @__PURE__ */ jsx(CardHeader, {
          children: /* @__PURE__ */ jsx(CardTitle, {
            className: "text-base",
            children: "Asistana Göre Çağrı (14g)"
          })
        }), /* @__PURE__ */ jsx(CardContent, {
          children: byAgent.length ? /* @__PURE__ */ jsx(HBars, {
            data: byAgent,
            max: maxAgent,
            color: "#21c6cc"
          }) : /* @__PURE__ */ jsx(Empty, {})
        })]
      }), /* @__PURE__ */ jsxs(Card, {
        children: [/* @__PURE__ */ jsxs(CardHeader, {
          children: [/* @__PURE__ */ jsx(CardTitle, {
            className: "text-base",
            children: "IP'ye Göre Çağrı (14g)"
          }), /* @__PURE__ */ jsx(CardDescription, {
            children: "Nereden bağlanıldı"
          })]
        }), /* @__PURE__ */ jsx(CardContent, {
          children: byIp.length ? /* @__PURE__ */ jsx(HBars, {
            data: byIp,
            max: maxIp,
            color: "#d84fd2"
          }) : /* @__PURE__ */ jsx(Empty, {})
        })]
      })]
    }), /* @__PURE__ */ jsxs(Card, {
      children: [/* @__PURE__ */ jsxs(CardHeader, {
        children: [/* @__PURE__ */ jsx(CardTitle, {
          className: "text-base",
          children: "Son İstekler"
        }), /* @__PURE__ */ jsx(CardDescription, {
          children: "En son 20 çağrı"
        })]
      }), /* @__PURE__ */ jsx(CardContent, {
        children: recent.length ? /* @__PURE__ */ jsx("div", {
          className: "overflow-x-auto",
          children: /* @__PURE__ */ jsxs("table", {
            className: "w-full text-left text-sm",
            children: [/* @__PURE__ */ jsx("thead", {
              className: "text-muted-foreground",
              children: /* @__PURE__ */ jsxs("tr", {
                className: "border-b",
                children: [/* @__PURE__ */ jsx("th", {
                  className: "py-2 pr-4 font-medium",
                  children: "Zaman"
                }), /* @__PURE__ */ jsx("th", {
                  className: "py-2 pr-4 font-medium",
                  children: "IP"
                }), /* @__PURE__ */ jsx("th", {
                  className: "py-2 pr-4 font-medium",
                  children: "Asistan"
                }), /* @__PURE__ */ jsx("th", {
                  className: "py-2 pr-4 font-medium",
                  children: "Durum"
                }), /* @__PURE__ */ jsx("th", {
                  className: "py-2 font-medium text-right",
                  children: "Token"
                })]
              })
            }), /* @__PURE__ */ jsx("tbody", {
              children: recent.map((r) => /* @__PURE__ */ jsxs("tr", {
                className: "border-b border-border/50",
                children: [/* @__PURE__ */ jsx("td", {
                  className: "py-2 pr-4 whitespace-nowrap",
                  children: formatDate(r.createdAt)
                }), /* @__PURE__ */ jsx("td", {
                  className: "py-2 pr-4 font-mono text-xs",
                  children: r.ip || "—"
                }), /* @__PURE__ */ jsx("td", {
                  className: "py-2 pr-4",
                  children: r.agentName
                }), /* @__PURE__ */ jsx("td", {
                  className: "py-2 pr-4",
                  children: /* @__PURE__ */ jsx("span", {
                    className: `rounded px-1.5 py-0.5 text-xs font-medium ${statusClass(r.status)}`,
                    children: r.status
                  })
                }), /* @__PURE__ */ jsx("td", {
                  className: "py-2 text-right tabular-nums",
                  children: r.totalTokens.toLocaleString("tr-TR")
                })]
              }, r.id))
            })]
          })
        }) : /* @__PURE__ */ jsx(Empty, {})
      })]
    }), /* @__PURE__ */ jsx(Dialog, {
      open: editOpen,
      onOpenChange: setEditOpen,
      children: /* @__PURE__ */ jsxs(DialogContent, {
        className: "max-w-lg",
        children: [/* @__PURE__ */ jsx(DialogHeader, {
          children: /* @__PURE__ */ jsx(DialogTitle, {
            children: "İzinleri düzenle"
          })
        }), /* @__PURE__ */ jsxs("div", {
          className: "mt-4 space-y-2",
          children: [/* @__PURE__ */ jsx(Label, {
            children: "İzinli Asistanlar"
          }), /* @__PURE__ */ jsx(ScrollArea, {
            className: "h-[240px] rounded-lg border",
            children: /* @__PURE__ */ jsx("div", {
              className: "space-y-1 p-2",
              children: assistants2.map((a) => {
                const on = selected.includes(a.id);
                return /* @__PURE__ */ jsxs("button", {
                  type: "button",
                  onClick: () => setSelected(on ? selected.filter((x) => x !== a.id) : [...selected, a.id]),
                  className: `flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors ${on ? "border border-[#21c6cc]/30 bg-[#21c6cc]/10" : "border border-transparent hover:bg-muted"}`,
                  children: [/* @__PURE__ */ jsx("span", {
                    className: `flex h-5 w-5 items-center justify-center rounded border ${on ? "border-[#21c6cc] bg-[#21c6cc] text-white" : "border-muted-foreground/40"}`,
                    children: on && /* @__PURE__ */ jsx(Check, {
                      className: "h-3.5 w-3.5"
                    })
                  }), /* @__PURE__ */ jsx("span", {
                    className: "truncate",
                    children: a.name
                  })]
                }, a.id);
              })
            })
          })]
        }), /* @__PURE__ */ jsxs(DialogFooter, {
          children: [/* @__PURE__ */ jsx(Button, {
            variant: "outline",
            onClick: () => setEditOpen(false),
            children: "İptal"
          }), /* @__PURE__ */ jsxs(Button, {
            onClick: handleSaveEdit,
            disabled: savingEdit,
            className: "gap-2",
            children: [savingEdit && /* @__PURE__ */ jsx(Loader2, {
              className: "h-4 w-4 animate-spin"
            }), "Kaydet"]
          })]
        })]
      })
    })]
  });
});
function StatTile({
  icon,
  label,
  value,
  tint
}) {
  return /* @__PURE__ */ jsx(Card, {
    children: /* @__PURE__ */ jsx(CardContent, {
      className: "pt-6",
      children: /* @__PURE__ */ jsxs("div", {
        className: "flex items-center gap-3",
        children: [/* @__PURE__ */ jsx("div", {
          className: "flex h-10 w-10 items-center justify-center rounded-lg",
          style: {
            backgroundColor: tint + "1a",
            color: tint
          },
          children: icon
        }), /* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsx("p", {
            className: "text-sm text-muted-foreground",
            children: label
          }), /* @__PURE__ */ jsx("p", {
            className: "text-2xl font-bold tabular-nums",
            children: value
          })]
        })]
      })
    })
  });
}
function Empty() {
  return /* @__PURE__ */ jsx("p", {
    className: "py-8 text-center text-sm text-muted-foreground",
    children: "Henüz veri yok"
  });
}
function VBars({
  data,
  max,
  color
}) {
  return /* @__PURE__ */ jsx("div", {
    className: "flex h-40 items-end gap-1",
    children: data.map((d, i) => /* @__PURE__ */ jsxs("div", {
      className: "flex flex-1 flex-col items-center gap-1",
      title: `${d.label}: ${d.value}`,
      children: [/* @__PURE__ */ jsx("div", {
        className: "w-full rounded-t transition-all",
        style: {
          height: `${Math.max(2, d.value / max * 100)}%`,
          backgroundColor: d.value > 0 ? color : "var(--border)",
          opacity: d.value > 0 ? 1 : 0.4
        }
      }), /* @__PURE__ */ jsx("span", {
        className: "text-[9px] text-muted-foreground",
        children: d.label
      })]
    }, i))
  });
}
function HBars({
  data,
  max,
  color
}) {
  return /* @__PURE__ */ jsx("div", {
    className: "space-y-2",
    children: data.map((d, i) => /* @__PURE__ */ jsxs("div", {
      className: "flex items-center gap-2 text-sm",
      children: [/* @__PURE__ */ jsx("span", {
        className: "w-28 shrink-0 truncate text-muted-foreground",
        title: d.label,
        children: d.label
      }), /* @__PURE__ */ jsx("div", {
        className: "h-4 flex-1 overflow-hidden rounded bg-muted",
        children: /* @__PURE__ */ jsx("div", {
          className: "h-full rounded",
          style: {
            width: `${Math.max(3, d.value / max * 100)}%`,
            backgroundColor: color
          }
        })
      }), /* @__PURE__ */ jsx("span", {
        className: "w-10 shrink-0 text-right tabular-nums",
        children: d.value
      })]
    }, i))
  });
}
const route15 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: apiKeyDetail,
  loader: loader$l
}, Symbol.toStringTag, { value: "Module" }));
async function loader$k() {
  let settings2 = await prisma.appSettings.findFirst({
    where: {
      id: "default"
    }
  });
  if (!settings2) {
    settings2 = await prisma.appSettings.create({
      data: {
        id: "default",
        appName: "ArisAI",
        theme: "blue"
      }
    });
  }
  return {
    settings: settings2
  };
}
const settings = UNSAFE_withComponentProps(function AdminSettings({
  loaderData
}) {
  const {
    settings: settings2
  } = loaderData;
  const [appName, setAppName] = useState(settings2.appName);
  const [isSaving, setIsSaving] = useState(false);
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success("Ayarlar kaydedildi");
    } catch (error) {
      toast.error("Ayarlar kaydedilemedi");
    } finally {
      setIsSaving(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", {
    className: "space-y-8",
    children: [/* @__PURE__ */ jsxs("div", {
      children: [/* @__PURE__ */ jsx("h1", {
        className: "text-3xl font-bold",
        children: "Ayarlar"
      }), /* @__PURE__ */ jsx("p", {
        className: "text-muted-foreground mt-1",
        children: "Uygulama ayarlarını düzenleyin"
      })]
    }), /* @__PURE__ */ jsxs("div", {
      className: "grid gap-6 max-w-2xl",
      children: [/* @__PURE__ */ jsxs(Card, {
        children: [/* @__PURE__ */ jsxs(CardHeader, {
          children: [/* @__PURE__ */ jsx(CardTitle, {
            children: "Genel Ayarlar"
          }), /* @__PURE__ */ jsx(CardDescription, {
            children: "Uygulama genel yapılandırması"
          })]
        }), /* @__PURE__ */ jsxs(CardContent, {
          className: "space-y-4",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "space-y-2",
            children: [/* @__PURE__ */ jsx(Label, {
              children: "Uygulama Adı"
            }), /* @__PURE__ */ jsx(Input, {
              value: appName,
              onChange: (e) => setAppName(e.target.value),
              placeholder: "ArisAI"
            })]
          }), /* @__PURE__ */ jsx(Button, {
            onClick: handleSave,
            disabled: isSaving,
            className: "gap-2 bg-gradient-to-r from-[#8d36ff] via-[#d84fd2] to-[#21c6cc] hover:brightness-110",
            children: isSaving ? /* @__PURE__ */ jsxs(Fragment, {
              children: [/* @__PURE__ */ jsx(Loader2, {
                className: "w-4 h-4 animate-spin"
              }), "Kaydediliyor..."]
            }) : /* @__PURE__ */ jsxs(Fragment, {
              children: [/* @__PURE__ */ jsx(Save, {
                className: "w-4 h-4"
              }), "Kaydet"]
            })
          })]
        })]
      }), /* @__PURE__ */ jsxs(Card, {
        children: [/* @__PURE__ */ jsx(CardHeader, {
          children: /* @__PURE__ */ jsx(CardTitle, {
            children: "Sistem Bilgisi"
          })
        }), /* @__PURE__ */ jsx(CardContent, {
          children: /* @__PURE__ */ jsxs("div", {
            className: "space-y-3 text-sm",
            children: [/* @__PURE__ */ jsxs("div", {
              className: "flex justify-between py-2 border-b",
              children: [/* @__PURE__ */ jsx("span", {
                className: "text-muted-foreground",
                children: "Versiyon"
              }), /* @__PURE__ */ jsx("span", {
                className: "font-medium",
                children: "1.0.0"
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "flex justify-between py-2 border-b",
              children: [/* @__PURE__ */ jsx("span", {
                className: "text-muted-foreground",
                children: "Framework"
              }), /* @__PURE__ */ jsx("span", {
                className: "font-medium",
                children: "React Router 7"
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "flex justify-between py-2 border-b",
              children: [/* @__PURE__ */ jsx("span", {
                className: "text-muted-foreground",
                children: "AI Provider"
              }), /* @__PURE__ */ jsx("span", {
                className: "font-medium",
                children: "OpenAI"
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "flex justify-between py-2",
              children: [/* @__PURE__ */ jsx("span", {
                className: "text-muted-foreground",
                children: "Auth"
              }), /* @__PURE__ */ jsx("span", {
                className: "font-medium",
                children: "BetterAuth"
              })]
            })]
          })
        })]
      })]
    })]
  });
});
const route16 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: settings,
  loader: loader$k
}, Symbol.toStringTag, { value: "Module" }));
async function action$k({
  request
}) {
  const cookieHeader = request.headers.get("cookie") || "";
  const cookieNames = cookieHeader.split(";").map((c) => c.trim().split("=")[0]).filter(Boolean);
  const expireCookies = cookieNames.map((name) => `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax`);
  const authCookies = ["better-auth.session_token", "better-auth.session", "__session", "session", "auth_session"];
  authCookies.forEach((name) => {
    expireCookies.push(`${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax`);
  });
  return new Response(null, {
    status: 302,
    headers: [["Location", "/"], ...expireCookies.map((c) => ["Set-Cookie", c])]
  });
}
async function loader$j({
  request
}) {
  return action$k({
    request
  });
}
const route17 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$k,
  loader: loader$j
}, Symbol.toStringTag, { value: "Module" }));
let openaiClient = null;
function getOpenAI() {
  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }
  return openaiClient;
}
async function chatStream(messages, systemInstruction, vectorStoreId, model = "gpt-4.1-mini", onUsage, maxOutputTokens) {
  const openai = getOpenAI();
  const input = messages.map((msg) => ({
    role: msg.role,
    content: msg.content
  }));
  const tools = [];
  if (vectorStoreId) {
    tools.push({
      type: "file_search",
      vector_store_ids: [vectorStoreId],
      max_num_results: 20
    });
  }
  const requestParams = {
    model,
    instructions: systemInstruction,
    input,
    stream: true
  };
  if (tools.length > 0) {
    requestParams.tools = tools;
  }
  if (maxOutputTokens && maxOutputTokens > 0) {
    requestParams.max_output_tokens = maxOutputTokens;
  }
  const response = await openai.responses.create(requestParams);
  const encoder2 = new TextEncoder();
  return new ReadableStream({
    async start(controller) {
      try {
        for await (const event of response) {
          const eventData = event;
          if (eventData.type === "response.output_text.delta" && eventData.delta) {
            controller.enqueue(encoder2.encode(eventData.delta));
          } else if (eventData.type === "content_block_delta" && eventData.delta?.text) {
            controller.enqueue(encoder2.encode(eventData.delta.text));
          } else if (onUsage && eventData.type === "response.completed") {
            const u = eventData.response?.usage;
            if (u) {
              onUsage({
                inputTokens: u.input_tokens ?? 0,
                outputTokens: u.output_tokens ?? 0,
                totalTokens: u.total_tokens ?? 0
              });
            }
          }
        }
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    }
  });
}
async function createVectorStore(name) {
  const openai = getOpenAI();
  const vectorStore = await openai.vectorStores.create({ name });
  return vectorStore;
}
async function uploadFileToVectorStore(vectorStoreId, file) {
  const openai = getOpenAI();
  const uploadedFile = await openai.files.create({
    file,
    purpose: "assistants"
  });
  const vectorStoreFile = await openai.vectorStores.files.create(vectorStoreId, {
    file_id: uploadedFile.id
  });
  return { file: uploadedFile, vectorStoreFile };
}
async function getVectorStoreFiles(vectorStoreId) {
  const openai = getOpenAI();
  try {
    const files = await openai.vectorStores.files.list(vectorStoreId);
    return files.data;
  } catch {
    return [];
  }
}
async function deleteVectorStoreFile(vectorStoreId, fileId) {
  const openai = getOpenAI();
  await openai.vectorStores.files.del(vectorStoreId, fileId);
  await openai.files.del(fileId);
}
async function action$j({
  request,
  params
}) {
  const session = await auth.api.getSession({
    headers: request.headers
  });
  if (!session?.user) {
    return new Response("Unauthorized", {
      status: 401
    });
  }
  const userId = session.user.id;
  const chatId = params.chatId;
  const chat2 = await prisma.chat.findFirst({
    where: {
      id: chatId,
      userId
    },
    include: {
      assistant: true,
      messages: {
        orderBy: {
          createdAt: "asc"
        },
        take: 50
        // Last 50 messages for context
      }
    }
  });
  if (!chat2) {
    return new Response("Chat not found", {
      status: 404
    });
  }
  const body = await request.json();
  const {
    message
  } = body;
  if (!message) {
    return new Response("Message required", {
      status: 400
    });
  }
  await prisma.message.create({
    data: {
      chatId,
      role: "user",
      content: message
    }
  });
  if (chat2.messages.length === 0) {
    await prisma.chat.update({
      where: {
        id: chatId
      },
      data: {
        title: message.slice(0, 50)
      }
    });
  }
  const conversationHistory = chat2.messages.map((msg) => ({
    role: msg.role,
    content: msg.content
  }));
  conversationHistory.push({
    role: "user",
    content: message
  });
  try {
    const stream = await chatStream(conversationHistory, chat2.assistant.systemInstruction, chat2.assistant.vectorStoreId || void 0, chat2.assistant.model);
    let fullResponse = "";
    const transformStream = new TransformStream({
      transform(chunk, controller) {
        const text = new TextDecoder().decode(chunk);
        fullResponse += text;
        controller.enqueue(chunk);
      },
      async flush() {
        if (fullResponse.trim()) {
          await prisma.message.create({
            data: {
              chatId,
              role: "assistant",
              content: fullResponse
            }
          });
          await prisma.chat.update({
            where: {
              id: chatId
            },
            data: {
              updatedAt: /* @__PURE__ */ new Date()
            }
          });
        }
      }
    });
    return new Response(stream.pipeThrough(transformStream), {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        "Cache-Control": "no-cache"
      }
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response("Internal server error", {
      status: 500
    });
  }
}
const route18 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$j
}, Symbol.toStringTag, { value: "Module" }));
async function transcribeAudio(audio, filename = "recording.webm") {
  const openai = getOpenAI();
  const file = audio instanceof File ? audio : new File([audio], filename, { type: audio.type || "audio/webm" });
  const transcription = await openai.audio.transcriptions.create({
    file,
    model: "whisper-1",
    language: "tr"
  });
  return transcription.text.trim();
}
async function synthesizeSpeech(text) {
  const openai = getOpenAI();
  const response = await openai.audio.speech.create({
    model: "tts-1",
    voice: "nova",
    input: text.slice(0, 4096)
  });
  return Buffer.from(await response.arrayBuffer());
}
async function action$i({
  request
}) {
  const session = await auth.api.getSession({
    headers: request.headers
  });
  if (!session?.user) {
    return new Response("Unauthorized", {
      status: 401
    });
  }
  try {
    const formData = await request.formData();
    const audio = formData.get("audio");
    if (!audio || !(audio instanceof Blob) || audio.size === 0) {
      return Response.json({
        error: "Ses kaydı gerekli"
      }, {
        status: 400
      });
    }
    const text = await transcribeAudio(audio);
    if (!text) {
      return Response.json({
        error: "Ses anlaşılamadı"
      }, {
        status: 400
      });
    }
    return Response.json({
      text
    });
  } catch (error) {
    console.error("Transcription error:", error);
    return Response.json({
      error: "Ses dönüştürülemedi"
    }, {
      status: 500
    });
  }
}
const route19 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$i
}, Symbol.toStringTag, { value: "Module" }));
function markdownToPlainText(markdown) {
  return markdown.replace(/```[\s\S]*?```/g, " ").replace(/`([^`]+)`/g, "$1").replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/^#{1,6}\s+/gm, "").replace(/(\*\*|__)(.*?)\1/g, "$2").replace(/(\*|_)(.*?)\1/g, "$2").replace(/~~(.*?)~~/g, "$1").replace(/^>\s+/gm, "").replace(/^[-*+]\s+/gm, "").replace(/^\d+\.\s+/gm, "").replace(/\n{2,}/g, ". ").replace(/\s+/g, " ").trim();
}
async function action$h({
  request
}) {
  const session = await auth.api.getSession({
    headers: request.headers
  });
  if (!session?.user) {
    return new Response("Unauthorized", {
      status: 401
    });
  }
  try {
    const {
      text
    } = await request.json();
    if (!text || typeof text !== "string" || !text.trim()) {
      return new Response("Text required", {
        status: 400
      });
    }
    const plainText = markdownToPlainText(text);
    if (!plainText) {
      return new Response("Text required", {
        status: 400
      });
    }
    const audio = await synthesizeSpeech(plainText);
    return new Response(new Uint8Array(audio), {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store"
      }
    });
  } catch (error) {
    console.error("TTS error:", error);
    return new Response("TTS failed", {
      status: 500
    });
  }
}
const route20 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$h
}, Symbol.toStringTag, { value: "Module" }));
async function loader$i({
  request
}) {
  const session = await auth.api.getSession({
    headers: request.headers
  });
  if (!session?.user) {
    return Response.json({
      error: "Unauthorized"
    }, {
      status: 401
    });
  }
  const userId = session.user.id;
  const userRole = session.user.role;
  let assistants2;
  if (userRole === "admin") {
    assistants2 = await prisma.assistant.findMany({
      where: {
        isActive: true
      },
      select: {
        id: true,
        name: true,
        description: true,
        color: true,
        icon: true,
        isPublic: true
      },
      orderBy: {
        name: "asc"
      }
    });
  } else {
    assistants2 = await prisma.assistant.findMany({
      where: {
        isActive: true,
        OR: [{
          isPublic: true
        }, {
          userAccess: {
            some: {
              userId
            }
          }
        }]
      },
      select: {
        id: true,
        name: true,
        description: true,
        color: true,
        icon: true
      },
      orderBy: {
        name: "asc"
      }
    });
  }
  return Response.json(assistants2);
}
const route21 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$i
}, Symbol.toStringTag, { value: "Module" }));
async function loader$h({
  request
}) {
  const session = await auth.api.getSession({
    headers: request.headers
  });
  if (!session?.user) {
    return Response.json({
      error: "Unauthorized"
    }, {
      status: 401
    });
  }
  const userId = session.user.id;
  const chats = await prisma.chat.findMany({
    where: {
      userId
    },
    select: {
      id: true,
      title: true,
      assistantId: true,
      updatedAt: true,
      assistant: {
        select: {
          name: true,
          color: true
        }
      }
    },
    orderBy: {
      updatedAt: "desc"
    }
  });
  return Response.json(chats);
}
async function action$g({
  request
}) {
  const session = await auth.api.getSession({
    headers: request.headers
  });
  if (!session?.user) {
    return Response.json({
      error: "Unauthorized"
    }, {
      status: 401
    });
  }
  const userId = session.user.id;
  if (request.method === "POST") {
    const body = await request.json();
    const {
      assistantId,
      title
    } = body;
    if (!assistantId) {
      return Response.json({
        error: "Assistant ID required"
      }, {
        status: 400
      });
    }
    const userRole = session.user.role;
    let hasAccess = false;
    if (userRole === "admin") {
      hasAccess = true;
    } else {
      const assistant = await prisma.assistant.findFirst({
        where: {
          id: assistantId,
          isActive: true,
          OR: [{
            isPublic: true
          }, {
            userAccess: {
              some: {
                userId
              }
            }
          }]
        }
      });
      hasAccess = !!assistant;
    }
    if (!hasAccess) {
      return Response.json({
        error: "No access to this assistant"
      }, {
        status: 403
      });
    }
    const chat2 = await prisma.chat.create({
      data: {
        userId,
        assistantId,
        title: title || "Yeni Sohbet"
      }
    });
    return Response.json(chat2);
  }
  if (request.method === "DELETE") {
    const url = new URL(request.url);
    const chatId = url.searchParams.get("chatId");
    if (!chatId) {
      return Response.json({
        error: "Chat ID required"
      }, {
        status: 400
      });
    }
    const chat2 = await prisma.chat.findFirst({
      where: {
        id: chatId,
        userId
      }
    });
    if (!chat2) {
      return Response.json({
        error: "Chat not found"
      }, {
        status: 404
      });
    }
    await prisma.chat.delete({
      where: {
        id: chatId
      }
    });
    return Response.json({
      success: true
    });
  }
  return Response.json({
    error: "Method not allowed"
  }, {
    status: 405
  });
}
const route22 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$g,
  loader: loader$h
}, Symbol.toStringTag, { value: "Module" }));
const encoder = new TextEncoder();
const CACHE_TTL_MS = Number(process.env.AGENT_CACHE_TTL_MS) || 3e4;
const LAST_USED_THROTTLE_MS = 6e4;
const globalForCache = globalThis;
const keyCache = globalForCache.__agentKeyCache__ ?? (globalForCache.__agentKeyCache__ = /* @__PURE__ */ new Map());
const agentCache = globalForCache.__agentAgentCache__ ?? (globalForCache.__agentAgentCache__ = /* @__PURE__ */ new Map());
const lastUsed = globalForCache.__agentKeyLastUsed__ ?? (globalForCache.__agentKeyLastUsed__ = /* @__PURE__ */ new Map());
function hashKey(rawKey) {
  return createHash("sha256").update(rawKey).digest("hex");
}
function generateRawApiKey() {
  return `sk_agent_${randomBytes(20).toString("hex")}`;
}
function hashApiKey(rawKey) {
  return hashKey(rawKey);
}
function invalidateKeyCache() {
  keyCache.clear();
}
function extractApiKey(headers) {
  const auth2 = headers.get("authorization");
  if (auth2) {
    const match = /^Bearer\s+(.+)$/i.exec(auth2);
    if (match) return match[1].trim();
  }
  const x = headers.get("x-api-key");
  return x ? x.trim() : null;
}
async function verifyApiKey(rawKey) {
  const keyHash = hashKey(rawKey);
  const now = Date.now();
  const cached = keyCache.get(keyHash);
  if (cached && cached.expires > now) {
    if (cached.value.ok) touchLastUsed(cached.value.apiKeyId, keyHash, now);
    return cached.value;
  }
  const row = await prisma.apiKey.findUnique({
    where: { keyHash },
    select: { id: true, revoked: true, assistants: { select: { id: true } } }
  });
  let value;
  if (!row) {
    value = { ok: false, status: 401, error: "Invalid API key" };
  } else if (row.revoked) {
    value = { ok: false, status: 403, error: "API key revoked" };
  } else {
    value = {
      ok: true,
      apiKeyId: row.id,
      allowed: new Set(row.assistants.map((a) => a.id))
    };
  }
  keyCache.set(keyHash, { value, expires: now + CACHE_TTL_MS });
  if (value.ok) touchLastUsed(value.apiKeyId, keyHash, now);
  return value;
}
async function resolveAgent(agentRef) {
  const now = Date.now();
  const cached = agentCache.get(agentRef);
  if (cached && cached.expires > now) return cached.value;
  const row = await prisma.assistant.findFirst({
    where: { OR: [{ id: agentRef }, { slug: agentRef }] },
    select: {
      id: true,
      model: true,
      systemInstruction: true,
      vectorStoreId: true,
      isActive: true
    }
  });
  let value;
  if (!row) {
    value = { ok: false, status: 404, error: "Agent not found" };
  } else if (!row.isActive) {
    value = { ok: false, status: 403, error: "Agent is inactive" };
  } else {
    value = {
      ok: true,
      agent: {
        assistantId: row.id,
        model: row.model,
        systemInstruction: row.systemInstruction,
        vectorStoreId: row.vectorStoreId
      }
    };
  }
  agentCache.set(agentRef, { value, expires: now + CACHE_TTL_MS });
  return value;
}
function touchLastUsed(apiKeyId, keyHash, now) {
  const prev = lastUsed.get(keyHash) ?? 0;
  if (now - prev < LAST_USED_THROTTLE_MS) return;
  lastUsed.set(keyHash, now);
  prisma.apiKey.update({ where: { id: apiKeyId }, data: { lastUsedAt: /* @__PURE__ */ new Date() } }).catch(() => {
    lastUsed.delete(keyHash);
  });
}
function toAgentMessages(body) {
  if (!body || typeof body !== "object") return [];
  const b = body;
  if (Array.isArray(b.messages)) {
    const out = [];
    for (const m of b.messages) {
      if (m && typeof m === "object" && (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.length > 0) {
        out.push({ role: m.role, content: m.content });
      }
    }
    return out.length > 50 ? out.slice(-50) : out;
  }
  if (typeof b.message === "string" && b.message.length > 0) {
    return [{ role: "user", content: b.message }];
  }
  return [];
}
async function streamAgentResponse(agent, messages, onUsage, maxOutputTokens) {
  if (!process.env.OPENAI_API_KEY) {
    return mockStream(agent, messages, onUsage);
  }
  return chatStream(
    messages,
    agent.systemInstruction,
    agent.vectorStoreId ?? void 0,
    agent.model,
    onUsage,
    maxOutputTokens
  );
}
function mockStream(agent, messages, onUsage) {
  const last = messages[messages.length - 1]?.content ?? "";
  const reply = `[mock:${agent.model}] received ${messages.length} message(s). echo: ${last}`;
  const chunks = reply.match(/[\s\S]{1,24}/g) ?? [reply];
  let i = 0;
  return new ReadableStream({
    pull(controller) {
      if (i < chunks.length) {
        controller.enqueue(encoder.encode(chunks[i++]));
      } else {
        if (onUsage) {
          const inChars = messages.reduce((n, m) => n + m.content.length, 0);
          const inputTokens = Math.ceil(inChars / 4);
          const outputTokens = Math.ceil(reply.length / 4);
          onUsage({ inputTokens, outputTokens, totalTokens: inputTokens + outputTokens });
        }
        controller.close();
      }
    }
  });
}
function extractClientIp(headers) {
  const xff = headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim() || null;
  return headers.get("x-real-ip");
}
function logApiUsage(entry2) {
  prisma.apiKeyUsage.create({
    data: {
      apiKeyId: entry2.apiKeyId,
      assistantId: entry2.assistantId ?? null,
      ip: entry2.ip ?? null,
      status: entry2.status,
      inputTokens: entry2.inputTokens ?? 0,
      outputTokens: entry2.outputTokens ?? 0,
      totalTokens: entry2.totalTokens ?? 0
    }
  }).catch(() => {
  });
}
function newCompletionId() {
  return `chatcmpl-${randomBytes(16).toString("hex")}`;
}
function optionalString(value) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}
async function prepareOpenAiRequest(request) {
  const rawKey = extractApiKey(request.headers);
  if (!rawKey) return { ok: false, status: 401, error: "Missing API key" };
  const ip = extractClientIp(request.headers);
  let body;
  try {
    body = await request.json();
  } catch {
    return { ok: false, status: 400, error: "Invalid JSON body" };
  }
  const b = body;
  const agora = {
    appId: optionalString(b.appId),
    channel: optionalString(b.channel),
    userId: optionalString(b.userId)
  };
  const keyResult = await verifyApiKey(rawKey);
  if (!keyResult.ok) return { ok: false, status: keyResult.status, error: keyResult.error };
  const apiKeyId = keyResult.apiKeyId;
  let model = typeof b.model === "string" ? b.model.trim() : "";
  if (!model) {
    model = (process.env.AGENT_LLM_MODEL || "").trim();
  }
  if (!model && keyResult.allowed.size > 0) {
    model = Array.from(keyResult.allowed)[0];
  }
  if (!model) {
    return {
      ok: false,
      status: 400,
      error: "Missing 'model' — set it to the agent id or slug"
    };
  }
  const agentResult = await resolveAgent(model);
  if (!agentResult.ok) {
    logApiUsage({ apiKeyId, ip, status: agentResult.status });
    return { ok: false, status: agentResult.status, error: agentResult.error };
  }
  const agent = agentResult.agent;
  if (!keyResult.allowed.has(agent.assistantId)) {
    logApiUsage({ apiKeyId, assistantId: agent.assistantId, ip, status: 403 });
    return { ok: false, status: 403, error: "API key is not permitted to access this agent" };
  }
  const messages = toAgentMessages(body);
  if (messages.length === 0) {
    messages.push({ role: "user", content: "[No speech detected]" });
  }
  return {
    ok: true,
    apiKeyId,
    ip,
    agent,
    messages,
    model,
    stream: b.stream === true,
    agora,
    locale: optionalString(b.locale)
  };
}
async function collectAgentResponse(agent, messages, maxOutputTokens) {
  let usage = { inputTokens: 0, outputTokens: 0, totalTokens: 0 };
  const stream = await streamAgentResponse(agent, messages, (u) => {
    usage = u;
  }, maxOutputTokens);
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let text = "";
  for (; ; ) {
    const { value, done } = await reader.read();
    if (done) break;
    text += decoder.decode(value, { stream: true });
  }
  text += decoder.decode();
  return { text, usage };
}
function openAiSseTransform(opts) {
  const decoder = new TextDecoder();
  let fullText = "";
  const chunk = (delta, finish) => encoder.encode(
    `data: ${JSON.stringify({
      id: opts.id,
      object: "chat.completion.chunk",
      created: opts.created,
      model: opts.model,
      choices: [{ index: 0, delta, finish_reason: finish }]
    })}

`
  );
  return new TransformStream({
    start(controller) {
      controller.enqueue(chunk({ role: "assistant" }, null));
    },
    transform(bytes, controller) {
      const text = decoder.decode(bytes, { stream: true });
      if (text) {
        fullText += text;
        controller.enqueue(chunk({ content: text }, null));
      }
    },
    flush(controller) {
      const text = decoder.decode();
      if (text) {
        fullText += text;
        controller.enqueue(chunk({ content: text }, null));
      }
      controller.enqueue(chunk({}, "stop"));
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      opts.onFlush?.(fullText);
    }
  });
}
function jsonError$9(message, status) {
  return new Response(JSON.stringify({
    error: message
  }), {
    status,
    headers: {
      "Content-Type": "application/json"
    }
  });
}
async function action$f({
  request,
  params
}) {
  if (request.method !== "POST") {
    return jsonError$9("Method not allowed", 405);
  }
  const rawKey = extractApiKey(request.headers);
  if (!rawKey) {
    return jsonError$9("Missing API key", 401);
  }
  const ip = extractClientIp(request.headers);
  const [keyResult, agentResult] = await Promise.all([verifyApiKey(rawKey), resolveAgent(params.agent)]);
  if (!keyResult.ok) {
    return jsonError$9(keyResult.error, keyResult.status);
  }
  const apiKeyId = keyResult.apiKeyId;
  if (!agentResult.ok) {
    logApiUsage({
      apiKeyId,
      ip,
      status: agentResult.status
    });
    return jsonError$9(agentResult.error, agentResult.status);
  }
  const agent = agentResult.agent;
  if (!keyResult.allowed.has(agent.assistantId)) {
    logApiUsage({
      apiKeyId,
      assistantId: agent.assistantId,
      ip,
      status: 403
    });
    return jsonError$9("API key is not permitted to access this agent", 403);
  }
  let body;
  try {
    body = await request.json();
  } catch {
    logApiUsage({
      apiKeyId,
      assistantId: agent.assistantId,
      ip,
      status: 400
    });
    return jsonError$9("Invalid JSON body", 400);
  }
  const messages = toAgentMessages(body);
  if (messages.length === 0) {
    logApiUsage({
      apiKeyId,
      assistantId: agent.assistantId,
      ip,
      status: 400
    });
    return jsonError$9("No messages provided", 400);
  }
  try {
    let usage = {
      inputTokens: 0,
      outputTokens: 0,
      totalTokens: 0
    };
    const stream = await streamAgentResponse(agent, messages, (u) => {
      usage = u;
    });
    const metered = stream.pipeThrough(new TransformStream({
      transform(chunk, controller) {
        controller.enqueue(chunk);
      },
      flush() {
        logApiUsage({
          apiKeyId,
          assistantId: agent.assistantId,
          ip,
          status: 200,
          ...usage
        });
      }
    }));
    return new Response(metered, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        "Cache-Control": "no-cache",
        // Disable proxy buffering (e.g. nginx) so chunks flush in realtime.
        "X-Accel-Buffering": "no"
      }
    });
  } catch (error) {
    logApiUsage({
      apiKeyId,
      assistantId: agent.assistantId,
      ip,
      status: 500
    });
    console.error("Agent API error:", error);
    return jsonError$9("Internal server error", 500);
  }
}
async function loader$g() {
  return jsonError$9("Method not allowed", 405);
}
const route23 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$f,
  loader: loader$g
}, Symbol.toStringTag, { value: "Module" }));
const CACHE_ENABLED = String(process.env.REALTIME_CACHE_ENABLED ?? "true").toLowerCase() !== "false";
const SEMANTIC_ENABLED = String(process.env.REALTIME_CACHE_SEMANTIC ?? "true").toLowerCase() !== "false";
const SIMILARITY_THRESHOLD = Number(process.env.REALTIME_CACHE_SIMILARITY || 0.5);
const MIN_QUESTION_LEN = Number(process.env.REALTIME_CACHE_MIN_QUESTION_LEN || 8);
const SEMANTIC_CANDIDATE_LIMIT = Number(process.env.REALTIME_CACHE_CANDIDATES || 100);
const EMBED_MODEL = process.env.REALTIME_CACHE_EMBED_MODEL || "text-embedding-3-small";
function normalizeQuestion(text) {
  return String(text || "").toLocaleLowerCase("tr-TR").replace(/[.,!?;:"'`´()\[\]{}<>»«…]/g, " ").replace(/\s+/g, " ").trim();
}
function isCacheable(question) {
  if (!CACHE_ENABLED) return false;
  const norm = normalizeQuestion(question);
  return norm.length >= MIN_QUESTION_LEN;
}
function sha(input) {
  return createHash("sha256").update(input).digest("hex");
}
async function embed(text) {
  if (!SEMANTIC_ENABLED || !process.env.OPENAI_API_KEY) return null;
  try {
    const openai = getOpenAI();
    const res = await openai.embeddings.create({ model: EMBED_MODEL, input: text.slice(0, 2e3) });
    return res.data[0]?.embedding ?? null;
  } catch {
    return null;
  }
}
function cosine(a, b) {
  if (a.length !== b.length) return 0;
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}
async function lookupAnswer(key, question) {
  if (!isCacheable(question)) return null;
  const questionNorm = normalizeQuestion(question);
  try {
    const exact = await prisma.realtimeResponseCache.findUnique({
      where: {
        orgId_gameId_characterId_questionNorm: {
          orgId: key.orgId,
          gameId: key.gameId,
          characterId: key.characterId,
          questionNorm
        }
      }
    });
    if (exact) {
      bumpHit(exact.id);
      return { answer: exact.answer, via: "exact", id: exact.id };
    }
    if (!SEMANTIC_ENABLED) return null;
    const queryVec = await embed(question);
    if (!queryVec) return null;
    const candidates = await prisma.realtimeResponseCache.findMany({
      where: { orgId: key.orgId, gameId: key.gameId, characterId: key.characterId, embedding: { not: null } },
      orderBy: { hitCount: "desc" },
      take: SEMANTIC_CANDIDATE_LIMIT,
      select: { id: true, answer: true, embedding: true }
    });
    let best = null;
    for (const row of candidates) {
      if (!row.embedding) continue;
      let vec;
      try {
        vec = JSON.parse(row.embedding);
      } catch {
        continue;
      }
      const score = cosine(queryVec, vec);
      if (!best || score > best.score) best = { id: row.id, answer: row.answer, score };
    }
    if (best && best.score >= SIMILARITY_THRESHOLD) {
      bumpHit(best.id);
      return { answer: best.answer, via: "semantic", id: best.id };
    }
    return null;
  } catch {
    return null;
  }
}
async function storeAnswer(key, question, answer) {
  if (!isCacheable(question) || !answer.trim()) return;
  const questionNorm = normalizeQuestion(question);
  const vec = await embed(question);
  try {
    await prisma.realtimeResponseCache.upsert({
      where: {
        orgId_gameId_characterId_questionNorm: {
          orgId: key.orgId,
          gameId: key.gameId,
          characterId: key.characterId,
          questionNorm
        }
      },
      create: {
        orgId: key.orgId,
        gameId: key.gameId,
        characterId: key.characterId,
        questionNorm,
        question,
        answer,
        embedding: vec ? JSON.stringify(vec) : null
      },
      update: { answer, embedding: vec ? JSON.stringify(vec) : void 0, lastUsedAt: /* @__PURE__ */ new Date() }
    });
  } catch {
  }
}
function bumpHit(id) {
  prisma.realtimeResponseCache.update({ where: { id }, data: { hitCount: { increment: 1 }, lastUsedAt: /* @__PURE__ */ new Date() } }).catch(() => null);
}
async function lookupTts(voiceId, text) {
  if (!CACHE_ENABLED) return null;
  try {
    const row = await prisma.realtimeTtsCache.findUnique({ where: { cacheKey: sha(`${voiceId}
${text}`) } });
    if (!row) return null;
    prisma.realtimeTtsCache.update({ where: { id: row.id }, data: { hitCount: { increment: 1 }, lastUsedAt: /* @__PURE__ */ new Date() } }).catch(() => null);
    return Buffer.from(row.audio);
  } catch {
    return null;
  }
}
async function storeTts(voiceId, text, audio) {
  if (!CACHE_ENABLED || audio.length === 0) return;
  try {
    await prisma.realtimeTtsCache.upsert({
      where: { cacheKey: sha(`${voiceId}
${text}`) },
      create: { cacheKey: sha(`${voiceId}
${text}`), voiceId, audio },
      update: { lastUsedAt: /* @__PURE__ */ new Date() }
    });
  } catch {
  }
}
async function lookupTranslation(targetLocale, sourceText) {
  if (!CACHE_ENABLED) return null;
  try {
    const row = await prisma.realtimeTranslationCache.findUnique({ where: { cacheKey: sha(`${targetLocale}
${sourceText}`) } });
    if (!row) return null;
    prisma.realtimeTranslationCache.update({ where: { id: row.id }, data: { hitCount: { increment: 1 }, lastUsedAt: /* @__PURE__ */ new Date() } }).catch(() => null);
    return row.translated;
  } catch {
    return null;
  }
}
async function storeTranslation(targetLocale, sourceText, translated) {
  if (!CACHE_ENABLED || !translated.trim()) return;
  try {
    await prisma.realtimeTranslationCache.upsert({
      where: { cacheKey: sha(`${targetLocale}
${sourceText}`) },
      create: { cacheKey: sha(`${targetLocale}
${sourceText}`), targetLocale, sourceText, translated },
      update: { lastUsedAt: /* @__PURE__ */ new Date() }
    });
  } catch {
  }
}
const { RtcTokenBuilder, RtcRole } = agoraToken;
function normalizeLocaleTag(locale) {
  const raw = String(locale ?? "").trim().replace("_", "-");
  if (!raw) return "";
  const [lang, region] = raw.split("-");
  if (!lang) return "";
  if (region) return `${lang.toLowerCase()}-${region.toUpperCase()}`;
  const defaults = {
    tr: "tr-TR",
    en: "en-US",
    ru: "ru-RU",
    de: "de-DE",
    fr: "fr-FR",
    es: "es-ES",
    it: "it-IT",
    ar: "ar-SA",
    az: "az-AZ",
    nl: "nl-NL",
    pt: "pt-PT",
    ja: "ja-JP",
    ko: "ko-KR",
    zh: "zh-CN",
    hi: "hi-IN"
  };
  return defaults[lang.toLowerCase()] || lang.toLowerCase();
}
function languageNameFor(locale) {
  const lang = String(locale || "").split("-")[0].toLowerCase();
  const names = {
    tr: "Turkish",
    en: "English",
    ru: "Russian",
    de: "German",
    fr: "French",
    es: "Spanish",
    it: "Italian",
    ar: "Arabic",
    az: "Azerbaijani",
    nl: "Dutch",
    pt: "Portuguese",
    ja: "Japanese",
    ko: "Korean",
    zh: "Chinese",
    hi: "Hindi"
  };
  return names[lang] || locale || "the user's language";
}
function requireEnv(name) {
  const value = process.env[name];
  if (!value || !value.trim()) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value.trim();
}
function getAgoraAppId() {
  return requireEnv("AGORA_APP_ID");
}
function buildRtcToken(params) {
  const appId = getAgoraAppId();
  const appCertificate = requireEnv("AGORA_APP_CERTIFICATE");
  const expire = Math.max(60, Math.min(86400, params.expireSeconds ?? 3600));
  const role = params.role === "subscriber" ? RtcRole.SUBSCRIBER : RtcRole.PUBLISHER;
  return RtcTokenBuilder.buildTokenWithUid(
    appId,
    appCertificate,
    params.channel,
    params.uid,
    role,
    expire,
    expire
  );
}
function agoraBasicAuthHeader() {
  const customerId = requireEnv("AGORA_CUSTOMER_ID");
  const customerSecret = requireEnv("AGORA_CUSTOMER_SECRET");
  const raw = `${customerId}:${customerSecret}`;
  return "Basic " + Buffer.from(raw, "utf8").toString("base64");
}
async function startConversationalAgent(opts) {
  const appId = getAgoraAppId();
  const llmUrl = requireEnv("AGENT_LLM_URL");
  const llmApiKey = requireEnv("AGENT_LLM_API_KEY");
  if (/your-backend|localhost|127\.0\.0\.1|0\.0\.0\.0/i.test(llmUrl)) {
    throw new Error(
      `AGENT_LLM_URL is not publicly reachable ("${llmUrl}"). Agora's cloud must be able to call it — use your public/ngrok URL, then RESTART the backend so the new .env value is loaded.`
    );
  }
  const llmModel = (opts.model || process.env.AGENT_LLM_MODEL || "").trim();
  if (!llmModel) {
    throw new Error("No LLM model resolved (pass model or set AGENT_LLM_MODEL)");
  }
  const preset = opts.preset || process.env.AGORA_AGENT_PRESET || "deepgram_nova_3,openai_tts_1";
  const playerLocale = normalizeLocaleTag(opts.locale) || process.env.REALTIME_ASR_LANGUAGE || "tr-TR";
  const asrLanguage = opts.asrLanguage || playerLocale;
  const body = {
    name: `${opts.namePrefix || "npc"}-${Date.now()}`,
    preset,
    properties: {
      channel: opts.channel,
      token: opts.agentRtcToken,
      agent_rtc_uid: opts.agentRtcUid,
      remote_rtc_uids: [opts.remoteRtcUid],
      idle_timeout: opts.idleTimeoutSeconds ?? 120,
      // ASR language, per player. "multi" (code-switching) only covers ~10
      // languages and Turkish is NOT one of them — Turkish speech came back
      // as Hindi/Korean gibberish. Naming the language explicitly fixes it,
      // and using THIS player's locale is what makes a mixed-language room
      // work (one player tr-TR, another en-US).
      asr: { language: asrLanguage, params: {} },
      llm: {
        vendor: "custom",
        url: llmUrl,
        api_key: llmApiKey,
        model: llmModel,
        // Agora forwards `llm.params` into the JSON body it POSTs to the
        // custom LLM. Without params.model the request arrives WITHOUT a
        // `model` field and the backend has to guess which assistant to
        // use — which silently picked the wrong (non-RAG) one.
        // `locale` rides along so the LLM answers in THIS player's
        // language — each player has their own agent, so in multiplayer
        // a Turkish and an English speaker each get their own language.
        params: { model: llmModel, locale: playerLocale },
        max_history: opts.maxHistory ?? 10
      },
      tts: {
        params: {
          voice: opts.ttsVoice || "coral",
          speed: opts.ttsSpeed ?? 1
        }
      },
      // Keep Agora's own interruption OFF (barge-in handled client-side).
      interruption: { enable: opts.enableInterruption === true, mode: "start_of_speech" }
    }
  };
  console.log(
    `AGORA agent start: channel=${opts.channel} model=${llmModel} llm.url=${llmUrl}`
  );
  const url = `https://api.agora.io/api/conversational-ai-agent/v2/projects/${appId}/join`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: agoraBasicAuthHeader()
    },
    body: JSON.stringify(body)
  });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Agora agent join failed: ${response.status} ${text.slice(0, 300)}`);
  }
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error(`Agora agent join returned non-JSON: ${text.slice(0, 200)}`);
  }
  if (!parsed.agent_id) {
    throw new Error(`Agora agent join response missing agent_id: ${text.slice(0, 200)}`);
  }
  return { agentId: parsed.agent_id };
}
async function getAgentHistory(agentId) {
  const appId = getAgoraAppId();
  const url = `https://api.agora.io/api/conversational-ai-agent/v2/projects/${appId}/agents/${agentId}/history`;
  const response = await fetch(url, {
    method: "GET",
    headers: { Authorization: agoraBasicAuthHeader() }
  });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Agora agent history failed: ${response.status} ${text.slice(0, 200)}`);
  }
  return text;
}
async function stopConversationalAgent(agentId) {
  const appId = getAgoraAppId();
  const url = `https://api.agora.io/api/conversational-ai-agent/v2/projects/${appId}/agents/${agentId}/leave`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: agoraBasicAuthHeader()
    },
    body: "{}"
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Agora agent leave failed: ${response.status} ${text.slice(0, 200)}`);
  }
}
async function saveAgoraChat(agora, agent, messages, assistantText) {
  let userMessageToSave = "";
  const lastMsg = messages[messages.length - 1];
  if (lastMsg && lastMsg.role === "user") {
    userMessageToSave = lastMsg.content;
  }
  if (!agora.channel || !userMessageToSave || !assistantText) return;
  try {
    let chat2 = await prisma.chat.findFirst({
      where: {
        OR: [{
          id: agora.channel
        }, {
          title: agora.channel
        }]
      }
    });
    if (!chat2) {
      const adminUser = await prisma.user.findFirst({
        where: {
          role: "admin"
        }
      }) || await prisma.user.findFirst();
      if (adminUser) {
        chat2 = await prisma.chat.create({
          data: {
            userId: adminUser.id,
            assistantId: agent.assistantId,
            title: agora.channel
          }
        });
      }
    }
    if (chat2) {
      await prisma.message.create({
        data: {
          chatId: chat2.id,
          role: "user",
          content: userMessageToSave
        }
      });
      await prisma.message.create({
        data: {
          chatId: chat2.id,
          role: "assistant",
          content: assistantText
        }
      });
    }
  } catch (e) {
    console.error("Failed to save agora chat:", e);
  }
}
const AGORA_MAX_OUTPUT_TOKENS = 220;
function cacheScopeFor(model, locale) {
  return {
    orgId: process.env.REALTIME_DEFAULT_ORG_ID || "org-aris888",
    gameId: process.env.REALTIME_DEFAULT_GAME_ID || "game-metaverse",
    // Language is part of the identity of a cached answer: the semantic tier
    // matches across languages (embeddings are multilingual), so without this
    // an English speaker could be served the Turkish answer.
    characterId: locale ? `${model}#${locale}` : model
  };
}
function localizeAgent(agent, locale) {
  if (!locale) return agent;
  const language = languageNameFor(locale);
  return {
    ...agent,
    systemInstruction: `${agent.systemInstruction}

LANGUAGE RULE (overrides any language instruction above): the user is speaking ${language} (${locale}). Reply ONLY in ${language}.`
  };
}
function standaloneQuestion(messages) {
  if (messages.length !== 1) return null;
  const only = messages[0];
  if (only.role !== "user") return null;
  if (only.content.trim() === "[No speech detected]") return null;
  return only.content;
}
const SSE_HEADERS$1 = {
  "Content-Type": "text/event-stream; charset=utf-8",
  "Cache-Control": "no-cache",
  Connection: "keep-alive",
  // Disable proxy buffering (e.g. nginx) so events flush in realtime.
  "X-Accel-Buffering": "no"
};
function jsonError$8(message, status) {
  return new Response(JSON.stringify({
    error: message
  }), {
    status,
    headers: {
      "Content-Type": "application/json"
    }
  });
}
async function action$e({
  request
}) {
  if (request.method !== "POST") {
    return jsonError$8("Method not allowed", 405);
  }
  const body = await request.clone().json().catch(() => null);
  console.log("AGORA INCOMING REQUEST BODY:", JSON.stringify(body, null, 2));
  const prep = await prepareOpenAiRequest(request);
  if (!prep.ok) {
    return jsonError$8(prep.error, prep.status);
  }
  const {
    apiKeyId,
    ip,
    agent: baseAgent,
    messages,
    model,
    stream,
    agora,
    locale
  } = prep;
  const agent = localizeAgent(baseAgent, locale);
  const id = newCompletionId();
  const created = Math.floor(Date.now() / 1e3);
  const question = standaloneQuestion(messages);
  const scope = cacheScopeFor(model, locale);
  if (question) {
    const hit = await lookupAnswer(scope, question);
    if (hit) {
      logApiUsage({
        apiKeyId,
        assistantId: agent.assistantId,
        ip,
        status: 200
      });
      saveAgoraChat(agora, agent, messages, hit.answer);
      console.log(`AGORA cache ${hit.via} hit (0 tokens):`, question.slice(0, 60));
      if (stream) {
        const encoder2 = new TextEncoder();
        const cachedStream = new ReadableStream({
          start(controller) {
            controller.enqueue(encoder2.encode(hit.answer));
            controller.close();
          }
        });
        const sse = cachedStream.pipeThrough(openAiSseTransform({
          id,
          created,
          model
        }));
        return new Response(sse, {
          headers: SSE_HEADERS$1
        });
      }
      return Response.json({
        id,
        object: "chat.completion",
        created,
        model,
        choices: [{
          index: 0,
          message: {
            role: "assistant",
            content: hit.answer
          },
          finish_reason: "stop"
        }],
        usage: {
          prompt_tokens: 0,
          completion_tokens: 0,
          total_tokens: 0
        }
      });
    }
  }
  if (stream) {
    try {
      let usage = {
        inputTokens: 0,
        outputTokens: 0,
        totalTokens: 0
      };
      const raw = await streamAgentResponse(agent, messages, (u) => {
        usage = u;
      }, AGORA_MAX_OUTPUT_TOKENS);
      const sse = raw.pipeThrough(openAiSseTransform({
        id,
        created,
        model,
        onFlush: (fullText) => {
          logApiUsage({
            apiKeyId,
            assistantId: agent.assistantId,
            ip,
            status: 200,
            ...usage
          });
          saveAgoraChat(agora, agent, messages, fullText);
          if (question) storeAnswer(scope, question, fullText).catch(() => null);
        }
      }));
      return new Response(sse, {
        headers: SSE_HEADERS$1
      });
    } catch (error) {
      logApiUsage({
        apiKeyId,
        assistantId: agent.assistantId,
        ip,
        status: 500
      });
      console.error("AGORA stream error:", {
        channel: agora.channel,
        error
      });
      return jsonError$8("Internal server error", 500);
    }
  }
  try {
    const {
      text,
      usage
    } = await collectAgentResponse(agent, messages, AGORA_MAX_OUTPUT_TOKENS);
    logApiUsage({
      apiKeyId,
      assistantId: agent.assistantId,
      ip,
      status: 200,
      ...usage
    });
    await saveAgoraChat(agora, agent, messages, text);
    if (question) storeAnswer(scope, question, text).catch(() => null);
    return Response.json({
      id,
      object: "chat.completion",
      created,
      model,
      choices: [{
        index: 0,
        message: {
          role: "assistant",
          content: text
        },
        finish_reason: "stop"
      }],
      usage: {
        prompt_tokens: usage.inputTokens,
        completion_tokens: usage.outputTokens,
        total_tokens: usage.totalTokens
      }
    });
  } catch (error) {
    logApiUsage({
      apiKeyId,
      assistantId: agent.assistantId,
      ip,
      status: 500
    });
    console.error("AGORA error:", {
      channel: agora.channel,
      error
    });
    return jsonError$8("Internal server error", 500);
  }
}
async function loader$f() {
  return jsonError$8("Method not allowed", 405);
}
const route24 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$e,
  loader: loader$f
}, Symbol.toStringTag, { value: "Module" }));
const SSE_HEADERS = {
  "Content-Type": "text/event-stream; charset=utf-8",
  "Cache-Control": "no-cache",
  Connection: "keep-alive",
  // Disable proxy buffering (e.g. nginx) so events flush in realtime.
  "X-Accel-Buffering": "no"
};
function jsonError$7(message, status) {
  return new Response(JSON.stringify({
    error: message
  }), {
    status,
    headers: {
      "Content-Type": "application/json"
    }
  });
}
async function action$d({
  request
}) {
  if (request.method !== "POST") {
    return jsonError$7("Method not allowed", 405);
  }
  const prep = await prepareOpenAiRequest(request);
  if (!prep.ok) {
    return jsonError$7(prep.error, prep.status);
  }
  const {
    apiKeyId,
    ip,
    agent,
    messages,
    model,
    agora
  } = prep;
  try {
    let usage = {
      inputTokens: 0,
      outputTokens: 0,
      totalTokens: 0
    };
    const raw = await streamAgentResponse(agent, messages, (u) => {
      usage = u;
    }, 220);
    const sse = raw.pipeThrough(openAiSseTransform({
      id: newCompletionId(),
      created: Math.floor(Date.now() / 1e3),
      model,
      onFlush: () => logApiUsage({
        apiKeyId,
        assistantId: agent.assistantId,
        ip,
        status: 200,
        ...usage
      })
    }));
    return new Response(sse, {
      headers: SSE_HEADERS
    });
  } catch (error) {
    logApiUsage({
      apiKeyId,
      assistantId: agent.assistantId,
      ip,
      status: 500
    });
    console.error("AGORA stream error:", {
      channel: agora.channel,
      error
    });
    return jsonError$7("Internal server error", 500);
  }
}
async function loader$e() {
  return jsonError$7("Method not allowed", 405);
}
const route25 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$d,
  loader: loader$e
}, Symbol.toStringTag, { value: "Module" }));
const REALTIME_TOKEN_TYPE = "realtime_session";
const MAX_TTL_SECONDS = 3600;
const DEFAULT_TTL_SECONDS = 900;
const REQUIRED_CLAIMS = [
  "orgId",
  "gameId",
  "characterId",
  "playerId",
  "locale",
  "ttlSeconds"
];
class RealtimeAuthError extends Error {
  code;
  constructor(message, code = "AUTH_INVALID") {
    super(message);
    this.code = code;
  }
}
function resolveSecret(explicit) {
  const secret = explicit || process.env.REALTIME_JWT_SECRET || process.env.BETTER_AUTH_SECRET;
  if (!secret) {
    throw new Error("REALTIME_JWT_SECRET is required for realtime session tokens");
  }
  return secret;
}
function base64UrlEncode(input) {
  return Buffer.from(input).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
function base64UrlDecode(input) {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(padded, "base64");
}
function sign(data, secret) {
  return base64UrlEncode(createHmac("sha256", secret).update(data).digest());
}
function normalizeClaims(input) {
  const ttlSeconds = Math.min(
    MAX_TTL_SECONDS,
    Math.max(60, Math.floor(Number(input.ttlSeconds ?? DEFAULT_TTL_SECONDS)))
  );
  const claims = {
    orgId: String(input.orgId ?? "").trim(),
    gameId: String(input.gameId ?? "").trim(),
    characterId: String(input.characterId ?? "").trim(),
    playerId: String(input.playerId ?? "").trim(),
    locale: String(input.locale ?? "en-US").trim() || "en-US",
    ttlSeconds,
    type: REALTIME_TOKEN_TYPE
  };
  for (const key of REQUIRED_CLAIMS) {
    if (!String(claims[key] ?? "").trim()) {
      throw new RealtimeAuthError(`Missing required realtime token claim: ${key}`);
    }
  }
  return claims;
}
function signRealtimeSessionToken(input, options = {}) {
  const claims = normalizeClaims(input);
  const secret = resolveSecret(options.secret);
  const iat = Math.floor(Date.now() / 1e3);
  const exp = iat + claims.ttlSeconds;
  const fullClaims = { ...claims, iat, exp };
  const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = base64UrlEncode(JSON.stringify(fullClaims));
  const signingInput = `${header}.${payload}`;
  const token = `${signingInput}.${sign(signingInput, secret)}`;
  return {
    token,
    tokenType: REALTIME_TOKEN_TYPE,
    expiresAt: new Date(exp * 1e3).toISOString(),
    claims: fullClaims
  };
}
function verifyRealtimeSessionToken(token, options = {}) {
  if (!token || typeof token !== "string") {
    throw new RealtimeAuthError("Realtime session token is required");
  }
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new RealtimeAuthError("Malformed realtime session token");
  }
  const [header, payload, signature] = parts;
  const secret = resolveSecret(options.secret);
  const expected = sign(`${header}.${payload}`, secret);
  const sigBuf = base64UrlDecode(signature);
  const expBuf = base64UrlDecode(expected);
  if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) {
    throw new RealtimeAuthError("Realtime session token signature is invalid");
  }
  let decoded;
  try {
    decoded = JSON.parse(base64UrlDecode(payload).toString("utf8"));
  } catch {
    throw new RealtimeAuthError("Realtime session token payload is invalid");
  }
  if (decoded.type !== REALTIME_TOKEN_TYPE) {
    throw new RealtimeAuthError("Token type must be realtime_session");
  }
  const now = Math.floor(Date.now() / 1e3);
  if (!decoded.exp || decoded.exp <= now) {
    throw new RealtimeAuthError("Realtime session token is expired");
  }
  for (const key of REQUIRED_CLAIMS) {
    const value = decoded[key];
    if (value === void 0 || value === null || String(value).trim() === "") {
      throw new RealtimeAuthError(`Missing required claim in token: ${key}`);
    }
  }
  return decoded;
}
function assertClaimBinding(tokenClaims, context = {}) {
  const mismatches = [];
  for (const key of ["orgId", "gameId", "characterId", "playerId"]) {
    if (context[key] && String(context[key]) !== String(tokenClaims[key])) {
      mismatches.push(key);
    }
  }
  if (mismatches.length > 0) {
    throw new RealtimeAuthError(`Token claim mismatch: ${mismatches.join(", ")}`, "AUTH_CLAIM_MISMATCH");
  }
  return tokenClaims;
}
function extractBearerToken(headers) {
  const auth2 = headers.get("authorization");
  if (!auth2) return null;
  const match = /^Bearer\s+(.+)$/i.exec(auth2);
  return match ? match[1].trim() : null;
}
function jsonError$6(message, status) {
  return Response.json({
    error: message
  }, {
    status
  });
}
function safeEqual$1(a, b) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}
function sanitizeChannel(raw, fallback) {
  const cleaned = raw.replace(/[^a-zA-Z0-9!#$%&()+\-:;<=>.?@[\]^_{}|~]/g, "-").slice(0, 64);
  return cleaned || fallback;
}
async function action$c({
  request
}) {
  if (request.method !== "POST") {
    return jsonError$6("Method not allowed", 405);
  }
  const serviceKey = process.env.REALTIME_GAME_SERVER_API_KEY?.trim();
  if (!serviceKey) {
    return jsonError$6("Realtime session minting is not configured", 503);
  }
  const provided = request.headers.get("x-realtime-service-key")?.trim() || "";
  if (!provided || !safeEqual$1(provided, serviceKey)) {
    return jsonError$6("Invalid or missing service key", 401);
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonError$6("Invalid JSON body", 400);
  }
  const characterId = String(body.characterId ?? "").trim();
  const playerId = String(body.playerId ?? "").trim();
  if (!characterId || !playerId) {
    return jsonError$6("characterId and playerId are required", 400);
  }
  const orgId = String(body.orgId ?? process.env.REALTIME_DEFAULT_ORG_ID ?? "org-aris888").trim();
  const gameId = String(body.gameId ?? process.env.REALTIME_DEFAULT_GAME_ID ?? "game-metaverse").trim();
  const locale = String(body.locale ?? "tr-TR").trim() || "tr-TR";
  const ttlSeconds = body.ttlSeconds != null ? Number(body.ttlSeconds) : void 0;
  let appId;
  try {
    appId = getAgoraAppId();
  } catch (e) {
    return jsonError$6(e.message, 503);
  }
  const perPlayerChannel = `npc-${gameId}-${playerId}`;
  const requestedChannel = String(body.channel ?? "").trim();
  const channel = sanitizeChannel(requestedChannel || perPlayerChannel, perPlayerChannel);
  const rtcUid = Number.isInteger(Number(body.rtcUid)) && Number(body.rtcUid) > 0 ? Number(body.rtcUid) : 1e3 + Math.floor(Math.random() * 89999999);
  let minted;
  try {
    minted = signRealtimeSessionToken({
      orgId,
      gameId,
      characterId,
      playerId,
      locale,
      ttlSeconds
    });
  } catch (e) {
    return jsonError$6(e.message, 400);
  }
  let rtcToken;
  try {
    rtcToken = buildRtcToken({
      channel,
      uid: rtcUid,
      role: "publisher",
      expireSeconds: minted.claims.ttlSeconds
    });
  } catch (e) {
    return jsonError$6(e.message, 503);
  }
  return Response.json({
    token: minted.token,
    tokenType: minted.tokenType,
    expiresAt: minted.expiresAt,
    session: {
      orgId,
      gameId,
      characterId,
      playerId,
      locale,
      appId,
      channel,
      rtcUid,
      rtcToken,
      ttlSeconds: minted.claims.ttlSeconds
    }
  });
}
function loader$d() {
  return jsonError$6("Method not allowed", 405);
}
const route26 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$c,
  loader: loader$d
}, Symbol.toStringTag, { value: "Module" }));
function jsonError$5(message, status) {
  return Response.json({
    error: message
  }, {
    status
  });
}
async function action$b({
  request
}) {
  if (request.method !== "POST") {
    return jsonError$5("Method not allowed", 405);
  }
  let claims;
  try {
    claims = verifyRealtimeSessionToken(extractBearerToken(request.headers));
  } catch (e) {
    const err = e;
    return jsonError$5(err.message, 401);
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonError$5("Invalid JSON body", 400);
  }
  try {
    assertClaimBinding(claims, {
      characterId: body.characterId != null ? String(body.characterId) : void 0,
      playerId: body.playerId != null ? String(body.playerId) : void 0
    });
  } catch (e) {
    return jsonError$5(e.message, 403);
  }
  const op = String(body.action ?? "start").trim();
  if (op === "stop") {
    const agentId = String(body.agentId ?? "").trim();
    if (!agentId) return jsonError$5("agentId is required to stop", 400);
    try {
      await stopConversationalAgent(agentId);
      return Response.json({
        ok: true
      });
    } catch (e) {
      console.error("realtime agent stop failed:", e);
      return jsonError$5(e.message, 502);
    }
  }
  if (op !== "start") {
    return jsonError$5(`Unsupported action: ${op}`, 400);
  }
  const channel = String(body.channel ?? "").trim();
  const remoteRtcUid = String(body.remoteRtcUid ?? "").trim();
  if (!channel || !remoteRtcUid) {
    return jsonError$5("channel and remoteRtcUid are required to start", 400);
  }
  const agentRtcUid = String(body.agentRtcUid ?? "2002").trim();
  const model = body.model != null ? String(body.model).trim() : void 0;
  try {
    const agentRtcToken = buildRtcToken({
      channel,
      uid: Number(agentRtcUid) || 2002,
      role: "publisher",
      expireSeconds: claims.ttlSeconds
    });
    const {
      agentId
    } = await startConversationalAgent({
      channel,
      agentRtcUid,
      agentRtcToken,
      remoteRtcUid,
      model,
      namePrefix: `npc-${claims.characterId}`,
      // This player's language, from their signed session token. Drives ASR
      // and the reply language, so a mixed-language room works.
      locale: claims.locale,
      // Empty/missing => follow the player's locale (see startConversationalAgent).
      asrLanguage: String(body.asrLanguage ?? "").trim() || void 0
    });
    return Response.json({
      ok: true,
      agentId
    });
  } catch (e) {
    console.error("realtime agent start failed:", e);
    return jsonError$5(e.message, 502);
  }
}
function loader$c() {
  return jsonError$5("Method not allowed", 405);
}
const route27 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$b,
  loader: loader$c
}, Symbol.toStringTag, { value: "Module" }));
async function synthesizeElevenLabs(text, opts = {}) {
  const apiKey = process.env.ELEVENLABS_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("Missing ELEVENLABS_API_KEY");
  }
  const voiceId = (opts.voiceId || process.env.ELEVENLABS_VOICE_ID || "").trim();
  if (!voiceId) {
    throw new Error("Missing ELEVENLABS_VOICE_ID");
  }
  const modelId = (opts.modelId || process.env.ELEVENLABS_MODEL_ID || "eleven_multilingual_v2").trim();
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
      "Content-Type": "application/json",
      accept: "audio/mpeg"
    },
    body: JSON.stringify({
      text: text.slice(0, 5e3),
      model_id: modelId,
      voice_settings: { stability: 0.5, similarity_boost: 0.75 }
    })
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`ElevenLabs TTS failed: ${response.status} ${detail.slice(0, 200)}`);
  }
  return response.arrayBuffer();
}
const TR_MODEL = process.env.PIPER_TR_MODEL || "tr_TR-dfki-medium";
const EN_MODEL = "en_US-libritts_r-medium";
function family(pitch, enSpeaker, lengthScale = 1) {
  const map = {
    tr: { model: TR_MODEL, pitch, lengthScale },
    en: { model: EN_MODEL, speaker: enSpeaker, lengthScale }
  };
  if (process.env.PIPER_RU_MODEL) map.ru = { model: process.env.PIPER_RU_MODEL, pitch, lengthScale };
  if (process.env.PIPER_DE_MODEL) map.de = { model: process.env.PIPER_DE_MODEL, pitch, lengthScale };
  if (process.env.PIPER_FR_MODEL) map.fr = { model: process.env.PIPER_FR_MODEL, pitch, lengthScale };
  return map;
}
const CALM = "Speak naturally and clearly, at a moderate pace.";
const VOICE_CATALOG = [
  // ── Male (10) ────────────────────────────────────────────────────────────
  { id: "m1", name: "Deniz", gender: "male", provider: "openai", providerVoice: "onyx", instructions: `${CALM} Deep, warm and reassuring.`, piper: family(0.82, 10) },
  { id: "m2", name: "Kaan", gender: "male", provider: "openai", providerVoice: "ash", instructions: `${CALM} Young, friendly and upbeat.`, piper: family(0.9, 11) },
  { id: "m3", name: "Emre", gender: "male", provider: "openai", providerVoice: "echo", instructions: `${CALM} Neutral and professional, like a receptionist.`, piper: family(0.86, 12) },
  { id: "m4", name: "Barış", gender: "male", provider: "openai", providerVoice: "verse", instructions: `${CALM} Expressive and lively storyteller.`, piper: family(0.94, 13) },
  { id: "m5", name: "Mert", gender: "male", provider: "openai", providerVoice: "ballad", instructions: `${CALM} Soft-spoken and thoughtful.`, piper: family(0.88, 14) },
  { id: "m6", name: "Cedar", gender: "male", provider: "openai", providerVoice: "cedar", instructions: CALM, piper: family(0.84, 15) },
  { id: "m7", name: "Tarık", gender: "male", provider: "openai", providerVoice: "onyx", instructions: "Speak briskly and energetically, like an excited guide.", piper: family(0.96, 16) },
  { id: "m8", name: "Selim", gender: "male", provider: "openai", providerVoice: "ash", instructions: "Speak slowly and calmly, like an older, patient gentleman.", piper: family(0.8, 17) },
  { id: "m9", name: "Arda", gender: "male", provider: "openai", providerVoice: "echo", instructions: "Speak confidently and crisply, like a news presenter.", piper: family(0.92, 18) },
  { id: "m10", name: "Kerem", gender: "male", provider: "openai", providerVoice: "verse", instructions: "Speak in a relaxed, casual, conversational way.", piper: family(0.98, 19) },
  // ── Female (10) ──────────────────────────────────────────────────────────
  { id: "f1", name: "Elif", gender: "female", provider: "openai", providerVoice: "nova", instructions: `${CALM} Warm and welcoming.`, piper: family(1.14, 200) },
  { id: "f2", name: "Zeynep", gender: "female", provider: "openai", providerVoice: "coral", instructions: `${CALM} Bright, cheerful and helpful.`, piper: family(1.22, 201) },
  { id: "f3", name: "Aylin", gender: "female", provider: "openai", providerVoice: "shimmer", instructions: `${CALM} Gentle and soothing.`, piper: family(1.1, 202) },
  { id: "f4", name: "Nehir", gender: "female", provider: "openai", providerVoice: "sage", instructions: `${CALM} Calm, wise and measured.`, piper: family(1.18, 203) },
  { id: "f5", name: "Defne", gender: "female", provider: "openai", providerVoice: "alloy", instructions: `${CALM} Neutral and clear.`, piper: family(1.12, 204) },
  { id: "f6", name: "Marin", gender: "female", provider: "openai", providerVoice: "marin", instructions: CALM, piper: family(1.26, 205) },
  { id: "f7", name: "İpek", gender: "female", provider: "openai", providerVoice: "fable", instructions: `${CALM} Storybook narrator, softly expressive.`, piper: family(1.16, 206) },
  { id: "f8", name: "Selin", gender: "female", provider: "openai", providerVoice: "nova", instructions: "Speak quickly and enthusiastically, like an excited young guide.", piper: family(1.3, 207) },
  { id: "f9", name: "Melis", gender: "female", provider: "openai", providerVoice: "coral", instructions: "Speak slowly and warmly, like a patient teacher.", piper: family(1.08, 208) },
  { id: "f10", name: "Ceren", gender: "female", provider: "openai", providerVoice: "shimmer", instructions: "Speak confidently and professionally, like a presenter.", piper: family(1.2, 209) }
];
function elevenLabsVoice() {
  if (!isElevenLabsEnabled()) return null;
  const providerVoice = (process.env.ELEVENLABS_VOICE_ID || "").trim();
  if (!providerVoice) return null;
  return {
    id: "el1",
    name: process.env.ELEVENLABS_VOICE_NAME?.trim() || "ElevenLabs",
    gender: process.env.ELEVENLABS_VOICE_GENDER === "male" ? "male" : "female",
    provider: "elevenlabs",
    providerVoice
  };
}
function isElevenLabsEnabled() {
  return String(process.env.ELEVENLABS_ENABLED ?? "false").toLowerCase() === "true";
}
function defaultVoiceId() {
  const configured = (process.env.REALTIME_DEFAULT_VOICE || "").trim();
  if (configured && resolveVoice(configured)) return configured;
  return "f1";
}
function listVoices() {
  const extra = elevenLabsVoice();
  return extra ? [...VOICE_CATALOG, extra] : VOICE_CATALOG;
}
function resolveVoice(voiceId) {
  const id = String(voiceId ?? "").trim();
  if (!id) return null;
  const byId = listVoices().find((v) => v.id === id);
  if (byId) return byId;
  const byProviderName = VOICE_CATALOG.find((v) => v.providerVoice === id && v.provider === "openai");
  if (byProviderName) return byProviderName;
  if (isElevenLabsEnabled() && id.length >= 16) {
    return { id, name: "Custom", gender: "female", provider: "elevenlabs", providerVoice: id };
  }
  return null;
}
const PIPER_DIR = process.env.PIPER_DIR || path.join(process.cwd(), "piper");
const PIPER_TIMEOUT_MS = Number(process.env.PIPER_TIMEOUT_MS || 2e4);
function isPiperEnabled() {
  return String(process.env.PIPER_ENABLED ?? "false").toLowerCase() === "true";
}
function findPiperBinary() {
  const configured = process.env.PIPER_BINARY?.trim();
  if (configured && existsSync(configured)) return configured;
  const candidates = [
    path.join(PIPER_DIR, "piper.exe"),
    path.join(PIPER_DIR, "piper", "piper.exe"),
    path.join(PIPER_DIR, "piper"),
    path.join(PIPER_DIR, "piper", "piper")
  ];
  return candidates.find((p) => existsSync(p)) ?? null;
}
function findPiperModel(modelName) {
  const file = modelName.endsWith(".onnx") ? modelName : `${modelName}.onnx`;
  const candidates = [
    path.join(PIPER_DIR, "voices", file),
    path.join(PIPER_DIR, file)
  ];
  return candidates.find((p) => existsSync(p)) ?? null;
}
function isPiperReady(modelName) {
  if (!isPiperEnabled()) return false;
  if (!findPiperBinary()) return false;
  return modelName ? findPiperModel(modelName) !== null : true;
}
function synthesizePiper(text, opts) {
  const binary = findPiperBinary();
  if (!binary) return Promise.reject(new Error("Piper binary not found (run `npm run piper:setup`)"));
  const model = findPiperModel(opts.model);
  if (!model) return Promise.reject(new Error(`Piper model not found: ${opts.model}`));
  const outDir = path.join(os.tmpdir(), "aiapi-piper");
  try {
    mkdirSync(outDir, { recursive: true });
  } catch {
  }
  const outFile = path.join(outDir, `${randomUUID()}.wav`);
  const args = ["--model", model, "--output_file", outFile];
  if (typeof opts.speaker === "number") args.push("--speaker", String(opts.speaker));
  if (typeof opts.lengthScale === "number") args.push("--length_scale", String(opts.lengthScale));
  return new Promise((resolve, reject) => {
    const proc = spawn(binary, args, { cwd: path.dirname(binary) });
    let stderr = "";
    const cleanup = () => {
      try {
        unlinkSync(outFile);
      } catch {
      }
    };
    const timer = setTimeout(() => {
      proc.kill();
      cleanup();
      reject(new Error("Piper timed out"));
    }, PIPER_TIMEOUT_MS);
    proc.stderr.on("data", (c) => {
      stderr += c.toString();
    });
    proc.on("error", (e) => {
      clearTimeout(timer);
      cleanup();
      reject(e);
    });
    proc.on("close", (code) => {
      clearTimeout(timer);
      if (code !== 0) {
        cleanup();
        reject(new Error(`Piper failed (code ${code}): ${stderr.slice(0, 200)}`));
        return;
      }
      try {
        const audio = readFileSync(outFile);
        cleanup();
        if (audio.length < 64) {
          reject(new Error("Piper produced no audio"));
          return;
        }
        resolve(audio);
      } catch (e) {
        cleanup();
        reject(e);
      }
    });
    proc.stdin.write(text);
    proc.stdin.end();
  });
}
function pitchShiftWav(wav, factor) {
  if (!Number.isFinite(factor) || Math.abs(factor - 1) < 0.01) return wav;
  if (wav.length < 44 || wav.toString("ascii", 0, 4) !== "RIFF") return wav;
  let offset = 12;
  let dataOffset = -1;
  let dataSize = 0;
  while (offset + 8 <= wav.length) {
    const id = wav.toString("ascii", offset, offset + 4);
    const size = wav.readUInt32LE(offset + 4);
    if (id === "data") {
      dataOffset = offset + 8;
      dataSize = Math.min(size, wav.length - dataOffset);
      break;
    }
    offset += 8 + size + size % 2;
  }
  if (dataOffset < 0 || dataSize <= 0) return wav;
  const inSamples = Math.floor(dataSize / 2);
  const outSamples = Math.max(1, Math.floor(inSamples / factor));
  const out = Buffer.alloc(44 + outSamples * 2);
  wav.copy(out, 0, 0, 44);
  for (let i = 0; i < outSamples; i++) {
    const pos = i * factor;
    const idx = Math.floor(pos);
    const frac = pos - idx;
    const a = wav.readInt16LE(dataOffset + Math.min(idx, inSamples - 1) * 2);
    const b = wav.readInt16LE(dataOffset + Math.min(idx + 1, inSamples - 1) * 2);
    const v = Math.max(-32768, Math.min(32767, Math.round(a + (b - a) * frac)));
    out.writeInt16LE(v, 44 + i * 2);
  }
  out.writeUInt32LE(36 + outSamples * 2, 4);
  out.writeUInt32LE(outSamples * 2, 40);
  return out;
}
const OPENAI_TTS_MODEL = process.env.OPENAI_TTS_MODEL || "gpt-4o-mini-tts";
function piperSkippedLanguages() {
  return new Set(
    String(process.env.PIPER_SKIP_LANGUAGES ?? "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean)
  );
}
function piperVariantFor(voice, locale) {
  if (!voice.piper) return null;
  const lang = String(locale ?? "").split("-")[0].toLowerCase();
  if (piperSkippedLanguages().has(lang)) return null;
  return voice.piper[lang] ?? voice.piper["*"] ?? null;
}
async function synthesizePiperVoice(variant, text) {
  const pitch = variant.pitch ?? 1;
  const lengthScale = (variant.lengthScale ?? 1) * (pitch !== 1 ? pitch : 1);
  const wav = await synthesizePiper(text, {
    model: variant.model,
    speaker: variant.speaker,
    lengthScale
  });
  return pitch !== 1 ? pitchShiftWav(wav, pitch) : wav;
}
async function synthesizeOpenAi(voice, text) {
  const openai = getOpenAI();
  const response = await openai.audio.speech.create({
    model: OPENAI_TTS_MODEL,
    voice: voice.providerVoice,
    input: text.slice(0, 4e3),
    response_format: "mp3",
    // Persona steering: what makes two entries on the same base voice differ.
    ...voice.instructions ? { instructions: voice.instructions } : {}
  });
  return Buffer.from(await response.arrayBuffer());
}
async function synthesizeSpeechForVoice(text, voiceId, locale) {
  const trimmed = String(text ?? "").trim();
  if (!trimmed) throw new Error("text is required");
  let voice = resolveVoice(voiceId) ?? resolveVoice(defaultVoiceId());
  if (!voice) throw new Error("No voice available");
  if (voice.provider === "elevenlabs" && !isElevenLabsEnabled()) {
    voice = resolveVoice(defaultVoiceId()) ?? voice;
  }
  const variant = isPiperEnabled() ? piperVariantFor(voice, locale) : null;
  const usePiper = variant !== null && isPiperReady(variant.model);
  const cacheKey = usePiper ? `${voice.id}@${variant.model}` : voice.id;
  const cached = await lookupTts(cacheKey, trimmed);
  if (cached) {
    return {
      audio: cached,
      cached: true,
      provider: usePiper ? "piper" : voice.provider,
      voiceId: voice.id,
      format: usePiper ? "wav" : "mp3"
    };
  }
  if (usePiper) {
    try {
      const audio2 = await synthesizePiperVoice(variant, trimmed);
      storeTts(cacheKey, trimmed, audio2).catch(() => null);
      return { audio: audio2, cached: false, provider: "piper", voiceId: voice.id, format: "wav" };
    } catch (error) {
      console.warn("Piper synthesis failed, falling back:", error.message);
    }
  }
  const audio = voice.provider === "elevenlabs" ? Buffer.from(await synthesizeElevenLabs(trimmed, { voiceId: voice.providerVoice })) : await synthesizeOpenAi(voice, trimmed);
  storeTts(voice.id, trimmed, audio).catch(() => null);
  return { audio, cached: false, provider: voice.provider, voiceId: voice.id, format: "mp3" };
}
function jsonError$4(message, status) {
  return Response.json({
    error: message
  }, {
    status
  });
}
async function action$a({
  request
}) {
  if (request.method !== "POST") {
    return jsonError$4("Method not allowed", 405);
  }
  let claims;
  try {
    claims = verifyRealtimeSessionToken(extractBearerToken(request.headers));
  } catch (e) {
    return jsonError$4(e.message, 401);
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonError$4("Invalid JSON body", 400);
  }
  const text = String(body.text ?? "").trim();
  if (!text) {
    return jsonError$4("text is required", 400);
  }
  try {
    const locale = String(body.locale ?? "").trim() || claims.locale;
    const {
      audio,
      cached,
      provider,
      voiceId,
      format
    } = await synthesizeSpeechForVoice(text, body.voiceId != null ? String(body.voiceId) : void 0, locale);
    return new Response(new Uint8Array(audio), {
      headers: {
        "Content-Type": format === "wav" ? "audio/wav" : "audio/mpeg",
        "Cache-Control": "no-store",
        "X-Cache": cached ? "HIT" : "MISS",
        "X-Voice": voiceId,
        "X-Provider": provider,
        "X-Audio-Format": format
      }
    });
  } catch (e) {
    console.error("realtime tts failed:", e);
    return jsonError$4(e.message, 502);
  }
}
function loader$b() {
  return jsonError$4("Method not allowed", 405);
}
const route28 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$a,
  loader: loader$b
}, Symbol.toStringTag, { value: "Module" }));
function jsonError$3(message, status) {
  return Response.json({
    error: message
  }, {
    status
  });
}
async function loader$a({
  request
}) {
  try {
    verifyRealtimeSessionToken(extractBearerToken(request.headers));
  } catch (e) {
    return jsonError$3(e.message, 401);
  }
  const agentId = new URL(request.url).searchParams.get("agentId")?.trim();
  if (!agentId) {
    return jsonError$3("agentId query param is required", 400);
  }
  try {
    const raw = await getAgentHistory(agentId);
    return new Response(raw, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store"
      }
    });
  } catch (e) {
    console.error("realtime history failed:", e);
    return jsonError$3(e.message, 502);
  }
}
const route29 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$a
}, Symbol.toStringTag, { value: "Module" }));
function jsonError$2(message, status) {
  return Response.json({
    error: message
  }, {
    status
  });
}
function safeEqual(a, b) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}
async function loader$9({
  request
}) {
  const serviceKey = process.env.REALTIME_GAME_SERVER_API_KEY?.trim();
  if (!serviceKey) return jsonError$2("Not configured", 503);
  const provided = request.headers.get("x-realtime-service-key")?.trim() || "";
  if (!provided || !safeEqual(provided, serviceKey)) {
    return jsonError$2("Invalid or missing service key", 401);
  }
  const dayStart = /* @__PURE__ */ new Date();
  dayStart.setHours(0, 0, 0, 0);
  const [activeSessions, sessionsToday, turnsToday, failedToday, tokenAgg] = await Promise.all([prisma.realtimeSession.count({
    where: {
      state: {
        in: ["active", "interrupted"]
      }
    }
  }), prisma.realtimeSession.count({
    where: {
      startedAt: {
        gte: dayStart
      }
    }
  }), prisma.realtimeTurn.count({
    where: {
      createdAt: {
        gte: dayStart
      }
    }
  }), prisma.realtimeTurn.count({
    where: {
      createdAt: {
        gte: dayStart
      },
      state: "failed"
    }
  }), prisma.realtimeTurn.aggregate({
    where: {
      createdAt: {
        gte: dayStart
      },
      state: "completed"
    },
    _sum: {
      inputTokens: true,
      outputTokens: true
    }
  })]);
  const recent = await prisma.realtimeTurn.findMany({
    where: {
      createdAt: {
        gte: dayStart
      },
      state: "completed",
      completedAt: {
        not: null
      }
    },
    select: {
      createdAt: true,
      completedAt: true
    },
    orderBy: {
      createdAt: "desc"
    },
    take: 200
  });
  const latencies = recent.map((t) => t.completedAt ? t.completedAt.getTime() - t.createdAt.getTime() : 0).filter((ms) => ms > 0).sort((a, b) => a - b);
  const avgMs = latencies.length ? Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length) : null;
  const p95Ms = latencies.length ? latencies[Math.min(latencies.length - 1, Math.floor(latencies.length * 0.95))] : null;
  return Response.json({
    now: (/* @__PURE__ */ new Date()).toISOString(),
    activeSessions,
    today: {
      sessions: sessionsToday,
      turns: turnsToday,
      failedTurns: failedToday,
      inputTokens: tokenAgg._sum.inputTokens ?? 0,
      outputTokens: tokenAgg._sum.outputTokens ?? 0,
      turnLatency: {
        avgMs,
        p95Ms,
        sample: latencies.length
      }
    }
  });
}
const route30 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$9
}, Symbol.toStringTag, { value: "Module" }));
function jsonError$1(message, status) {
  return Response.json({
    error: message
  }, {
    status
  });
}
const WHISPER_LANGUAGE_CODES = {
  turkish: "tr",
  english: "en",
  russian: "ru",
  german: "de",
  french: "fr",
  spanish: "es",
  italian: "it",
  dutch: "nl",
  portuguese: "pt",
  arabic: "ar",
  japanese: "ja",
  korean: "ko",
  chinese: "zh",
  hindi: "hi",
  azerbaijani: "az"
};
function toLanguageCode(raw, fallback) {
  const value = String(raw ?? "").trim().toLowerCase();
  if (!value) return fallback;
  if (WHISPER_LANGUAGE_CODES[value]) return WHISPER_LANGUAGE_CODES[value];
  return value.length <= 5 ? value : fallback;
}
const MAX_AUDIO_BYTES = 8 * 1024 * 1024;
async function action$9({
  request
}) {
  if (request.method !== "POST") {
    return jsonError$1("Method not allowed", 405);
  }
  let claims;
  try {
    claims = verifyRealtimeSessionToken(extractBearerToken(request.headers));
  } catch (e) {
    return jsonError$1(e.message, 401);
  }
  const bytes = await request.arrayBuffer();
  if (bytes.byteLength === 0) return jsonError$1("Empty audio body", 400);
  if (bytes.byteLength > MAX_AUDIO_BYTES) return jsonError$1("Audio too large", 413);
  try {
    const openai = getOpenAI();
    const file = new File([new Uint8Array(bytes)], "speech.wav", {
      type: "audio/wav"
    });
    const result = await openai.audio.transcriptions.create({
      file,
      model: "whisper-1",
      response_format: "verbose_json"
    });
    return Response.json({
      text: (result.text || "").trim(),
      language: toLanguageCode(result.language, claims.locale || "")
    });
  } catch (e) {
    console.error("realtime speech STT failed:", e);
    return jsonError$1(e.message, 502);
  }
}
function loader$8() {
  return jsonError$1("Method not allowed", 405);
}
const route31 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$9,
  loader: loader$8
}, Symbol.toStringTag, { value: "Module" }));
const CANONICAL_LOCALE = (process.env.REALTIME_CANONICAL_LOCALE || "tr-TR").trim();
const TRANSLATION_MODEL = process.env.REALTIME_TRANSLATION_MODEL || "gpt-4.1-mini";
function normalizeLocale(locale) {
  const raw = String(locale ?? "").trim();
  if (!raw) return "";
  const parts = raw.replace("_", "-").split("-");
  if (parts.length >= 2) return parts[0].toLowerCase() + "-" + parts[1].toUpperCase();
  return parts[0].toLowerCase();
}
function sameLanguage(a, b) {
  const la = normalizeLocale(a).split("-")[0];
  const lb = normalizeLocale(b).split("-")[0];
  return !!la && la === lb;
}
function isMockMode() {
  return String(process.env.REALTIME_TRANSLATION_MOCK_MODE || process.env.REALTIME_LOAD_TEST_MODE || "").toLowerCase() === "true" || !process.env.OPENAI_API_KEY;
}
async function listGlossaryTerms(orgId, gameId, targetLocale) {
  return prisma.realtimeGlossaryTerm.findMany({
    where: { orgId, gameId, locale: { in: [targetLocale, "*"] } },
    take: 100
  });
}
function applyGlossaryLocks(text, terms) {
  let output = text;
  const applied = [];
  for (const term of terms) {
    if (!term.sourceTerm) continue;
    const pattern = new RegExp(term.sourceTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    if (pattern.test(output)) {
      output = output.replace(pattern, term.targetTerm);
      applied.push(term.sourceTerm);
    }
  }
  return { text: output, applied };
}
async function translateWithOpenAi(text, sourceLocale, targetLocale, glossary) {
  const openai = getOpenAI();
  const locks = glossary.length ? `
Terminology locks (must appear verbatim): ${glossary.map((t) => `${t.sourceTerm} => ${t.targetTerm}`).join("; ")}` : "";
  const response = await openai.chat.completions.create({
    model: TRANSLATION_MODEL,
    messages: [
      {
        role: "system",
        content: `Translate from ${sourceLocale} to ${targetLocale}. Preserve meaning, tone, and names. Return ONLY the translated text, nothing else.${locks}`
      },
      { role: "user", content: text }
    ],
    max_tokens: 400
  });
  return (response.choices[0]?.message?.content || "").trim() || text;
}
async function translateText(params) {
  const sourceLocale = normalizeLocale(params.sourceLocale) || CANONICAL_LOCALE;
  const targetLocale = normalizeLocale(params.targetLocale);
  const text = String(params.text || "").trim();
  if (!text || !targetLocale || sameLanguage(sourceLocale, targetLocale)) {
    return { text, sourceLocale, targetLocale: targetLocale || sourceLocale, provider: "passthrough", glossaryApplied: [] };
  }
  const cached = await lookupTranslation(targetLocale, text);
  if (cached) {
    return { text: cached, sourceLocale, targetLocale, provider: "passthrough", glossaryApplied: [] };
  }
  const terms = await listGlossaryTerms(params.orgId, params.gameId, targetLocale).catch(() => []);
  if (isMockMode()) {
    const locked = applyGlossaryLocks(text, terms);
    return { text: `[${targetLocale}] ${locked.text}`, sourceLocale, targetLocale, provider: "mock", glossaryApplied: locked.applied };
  }
  try {
    const translated = await translateWithOpenAi(text, sourceLocale, targetLocale, terms);
    const locked = applyGlossaryLocks(translated, terms);
    storeTranslation(targetLocale, text, locked.text).catch(() => null);
    return { text: locked.text, sourceLocale, targetLocale, provider: "openai", glossaryApplied: locked.applied };
  } catch {
    return { text, sourceLocale, targetLocale, provider: "passthrough", glossaryApplied: [] };
  }
}
function jsonError(message, status) {
  return Response.json({
    error: message
  }, {
    status
  });
}
async function action$8({
  request
}) {
  if (request.method !== "POST") {
    return jsonError("Method not allowed", 405);
  }
  let claims;
  try {
    claims = verifyRealtimeSessionToken(extractBearerToken(request.headers));
  } catch (e) {
    return jsonError(e.message, 401);
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body", 400);
  }
  const text = String(body.text ?? "").trim();
  if (!text) return jsonError("text is required", 400);
  const targetLocale = String(body.targetLocale ?? "").trim() || claims.locale;
  const sourceLocale = String(body.sourceLocale ?? "").trim() || "";
  try {
    const translation = await translateText({
      text,
      sourceLocale,
      targetLocale,
      orgId: claims.orgId,
      gameId: claims.gameId
    });
    return Response.json({
      text: translation.text,
      sourceLocale: translation.sourceLocale,
      targetLocale: translation.targetLocale,
      provider: translation.provider
    });
  } catch (e) {
    console.error("realtime translate failed:", e);
    return jsonError(e.message, 502);
  }
}
function loader$7() {
  return jsonError("Method not allowed", 405);
}
const route32 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$8,
  loader: loader$7
}, Symbol.toStringTag, { value: "Module" }));
async function loader$6({
  request
}) {
  try {
    verifyRealtimeSessionToken(extractBearerToken(request.headers));
  } catch (e) {
    return Response.json({
      error: e.message
    }, {
      status: 401
    });
  }
  return Response.json({
    defaultVoiceId: defaultVoiceId(),
    voices: listVoices().map((v) => ({
      id: v.id,
      name: v.name,
      gender: v.gender
    }))
  });
}
const route33 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$6
}, Symbol.toStringTag, { value: "Module" }));
async function isAdmin$6(request) {
  const session = await auth.api.getSession({
    headers: request.headers
  });
  if (!session?.user?.id) return false;
  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id
    },
    select: {
      role: true
    }
  });
  return user?.role === "admin";
}
async function loader$5({
  request
}) {
  if (!await isAdmin$6(request)) {
    return Response.json({
      error: "Unauthorized"
    }, {
      status: 401
    });
  }
  const assistants2 = await prisma.assistant.findMany({
    include: {
      _count: {
        select: {
          chats: true,
          userAccess: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return Response.json(assistants2);
}
async function action$7({
  request
}) {
  if (!await isAdmin$6(request)) {
    return Response.json({
      error: "Unauthorized"
    }, {
      status: 401
    });
  }
  if (request.method !== "POST") {
    return Response.json({
      error: "Method not allowed"
    }, {
      status: 405
    });
  }
  const body = await request.json();
  const {
    name,
    description,
    systemInstruction,
    model,
    color,
    isPublic
  } = body;
  if (!name) {
    return Response.json({
      error: "Name is required"
    }, {
      status: 400
    });
  }
  const assistant = await prisma.assistant.create({
    data: {
      name,
      description: description || "",
      systemInstruction: systemInstruction || "Sen yardımcı bir asistansın.",
      model: model || "gpt-4.1-mini",
      color: color || "#3B82F6",
      icon: "bot",
      isPublic: isPublic !== false,
      isActive: true
    }
  });
  return Response.json(assistant);
}
const route34 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$7,
  loader: loader$5
}, Symbol.toStringTag, { value: "Module" }));
async function isAdmin$5(request) {
  const session = await auth.api.getSession({
    headers: request.headers
  });
  if (!session?.user?.id) return false;
  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id
    },
    select: {
      role: true
    }
  });
  return user?.role === "admin";
}
async function loader$4({
  request,
  params
}) {
  if (!await isAdmin$5(request)) {
    return Response.json({
      error: "Unauthorized"
    }, {
      status: 401
    });
  }
  const assistant = await prisma.assistant.findUnique({
    where: {
      id: params.assistantId
    },
    include: {
      _count: {
        select: {
          chats: true,
          userAccess: true,
          vectorStoreFiles: true
        }
      }
    }
  });
  if (!assistant) {
    return Response.json({
      error: "Assistant not found"
    }, {
      status: 404
    });
  }
  return Response.json(assistant);
}
async function action$6({
  request,
  params
}) {
  if (!await isAdmin$5(request)) {
    return Response.json({
      error: "Unauthorized"
    }, {
      status: 401
    });
  }
  const assistantId = params.assistantId;
  if (request.method === "PUT") {
    const body = await request.json();
    const {
      name,
      slug,
      description,
      systemInstruction,
      model,
      color,
      isPublic,
      isActive,
      vectorStoreId,
      vectorStoreName
    } = body;
    let normalizedSlug = void 0;
    if (slug !== void 0) {
      const cleaned = String(slug).trim().toLowerCase().replace(/[\s_]+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, "");
      normalizedSlug = cleaned || null;
    }
    try {
      const assistant = await prisma.assistant.update({
        where: {
          id: assistantId
        },
        data: {
          name,
          slug: normalizedSlug,
          description,
          systemInstruction,
          model,
          color,
          isPublic,
          isActive,
          vectorStoreId,
          vectorStoreName
        }
      });
      return Response.json(assistant);
    } catch (error) {
      if (error?.code === "P2002") {
        return Response.json({
          error: "Bu slug zaten kullanımda"
        }, {
          status: 409
        });
      }
      throw error;
    }
  }
  if (request.method === "DELETE") {
    await prisma.assistant.delete({
      where: {
        id: assistantId
      }
    });
    return Response.json({
      success: true
    });
  }
  return Response.json({
    error: "Method not allowed"
  }, {
    status: 405
  });
}
const route35 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$6,
  loader: loader$4
}, Symbol.toStringTag, { value: "Module" }));
async function isAdmin$4(request) {
  const session = await auth.api.getSession({
    headers: request.headers
  });
  if (!session?.user?.id) return false;
  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id
    },
    select: {
      role: true
    }
  });
  return user?.role === "admin";
}
async function loader$3({
  request,
  params
}) {
  if (!await isAdmin$4(request)) {
    return Response.json({
      error: "Unauthorized"
    }, {
      status: 401
    });
  }
  const assistant = await prisma.assistant.findUnique({
    where: {
      id: params.assistantId
    },
    select: {
      vectorStoreId: true
    }
  });
  if (!assistant?.vectorStoreId) {
    return Response.json([]);
  }
  const files = await getVectorStoreFiles(assistant.vectorStoreId);
  return Response.json(files);
}
async function action$5({
  request,
  params
}) {
  if (!await isAdmin$4(request)) {
    return Response.json({
      error: "Unauthorized"
    }, {
      status: 401
    });
  }
  const assistantId = params.assistantId;
  if (request.method === "POST") {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file) {
      return Response.json({
        error: "File required"
      }, {
        status: 400
      });
    }
    let assistant = await prisma.assistant.findUnique({
      where: {
        id: assistantId
      }
    });
    if (!assistant) {
      return Response.json({
        error: "Assistant not found"
      }, {
        status: 404
      });
    }
    let vectorStoreId = assistant.vectorStoreId;
    if (!vectorStoreId) {
      const vectorStore = await createVectorStore(`Assistant-${assistant.name}`);
      vectorStoreId = vectorStore.id;
      await prisma.assistant.update({
        where: {
          id: assistantId
        },
        data: {
          vectorStoreId: vectorStore.id,
          vectorStoreName: vectorStore.name
        }
      });
    }
    const result = await uploadFileToVectorStore(vectorStoreId, file);
    await prisma.vectorStoreFile.create({
      data: {
        assistantId,
        openaiFileId: result.file.id,
        fileName: file.name,
        fileSize: file.size,
        status: result.vectorStoreFile.status
      }
    });
    return Response.json(result);
  }
  if (request.method === "DELETE") {
    const url = new URL(request.url);
    const fileId = url.searchParams.get("fileId");
    if (!fileId) {
      return Response.json({
        error: "File ID required"
      }, {
        status: 400
      });
    }
    const assistant = await prisma.assistant.findUnique({
      where: {
        id: assistantId
      },
      select: {
        vectorStoreId: true
      }
    });
    if (assistant?.vectorStoreId) {
      await deleteVectorStoreFile(assistant.vectorStoreId, fileId);
    }
    await prisma.vectorStoreFile.deleteMany({
      where: {
        openaiFileId: fileId
      }
    });
    return Response.json({
      success: true
    });
  }
  return Response.json({
    error: "Method not allowed"
  }, {
    status: 405
  });
}
const route36 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$5,
  loader: loader$3
}, Symbol.toStringTag, { value: "Module" }));
async function isAdmin$3(request) {
  const session = await auth.api.getSession({
    headers: request.headers
  });
  if (!session?.user?.id) return false;
  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id
    },
    select: {
      role: true
    }
  });
  return user?.role === "admin";
}
async function loader$2({
  request
}) {
  if (!await isAdmin$3(request)) {
    return Response.json({
      error: "Unauthorized"
    }, {
      status: 401
    });
  }
  const users2 = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: {
        select: {
          chats: true,
          accessGrants: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return Response.json(users2);
}
async function action$4({
  request
}) {
  if (!await isAdmin$3(request)) {
    return Response.json({
      error: "Unauthorized"
    }, {
      status: 401
    });
  }
  if (request.method === "PUT") {
    const body = await request.json();
    const {
      userId,
      role
    } = body;
    if (!userId || !role) {
      return Response.json({
        error: "User ID and role required"
      }, {
        status: 400
      });
    }
    const user = await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        role
      }
    });
    return Response.json(user);
  }
  return Response.json({
    error: "Method not allowed"
  }, {
    status: 405
  });
}
const route37 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$4,
  loader: loader$2
}, Symbol.toStringTag, { value: "Module" }));
async function isAdmin$2(request) {
  const session = await auth.api.getSession({
    headers: request.headers
  });
  if (!session?.user?.id) return false;
  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id
    },
    select: {
      role: true
    }
  });
  return user?.role === "admin";
}
async function loader$1({
  request,
  params
}) {
  if (!await isAdmin$2(request)) {
    return Response.json({
      error: "Unauthorized"
    }, {
      status: 401
    });
  }
  const accessGrants = await prisma.userAssistantAccess.findMany({
    where: {
      userId: params.userId
    },
    include: {
      assistant: {
        select: {
          id: true,
          name: true,
          color: true
        }
      }
    }
  });
  return Response.json(accessGrants);
}
async function action$3({
  request,
  params
}) {
  const session = await auth.api.getSession({
    headers: request.headers
  });
  if (!await isAdmin$2(request)) {
    return Response.json({
      error: "Unauthorized"
    }, {
      status: 401
    });
  }
  const userId = params.userId;
  const adminId = session?.user?.id;
  if (request.method === "POST") {
    const body = await request.json();
    const {
      assistantId
    } = body;
    if (!assistantId) {
      return Response.json({
        error: "Assistant ID required"
      }, {
        status: 400
      });
    }
    const access = await prisma.userAssistantAccess.create({
      data: {
        userId,
        assistantId,
        grantedBy: adminId
      }
    });
    return Response.json(access);
  }
  if (request.method === "DELETE") {
    const url = new URL(request.url);
    const assistantId = url.searchParams.get("assistantId");
    if (!assistantId) {
      return Response.json({
        error: "Assistant ID required"
      }, {
        status: 400
      });
    }
    await prisma.userAssistantAccess.deleteMany({
      where: {
        userId,
        assistantId
      }
    });
    return Response.json({
      success: true
    });
  }
  return Response.json({
    error: "Method not allowed"
  }, {
    status: 405
  });
}
const route38 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$3,
  loader: loader$1
}, Symbol.toStringTag, { value: "Module" }));
async function isAdmin$1(request) {
  const session = await auth.api.getSession({
    headers: request.headers
  });
  if (!session?.user?.id) return false;
  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id
    },
    select: {
      role: true
    }
  });
  return user?.role === "admin";
}
async function action$2({
  request
}) {
  if (!await isAdmin$1(request)) {
    return Response.json({
      error: "Unauthorized"
    }, {
      status: 401
    });
  }
  if (request.method !== "POST") {
    return Response.json({
      error: "Method not allowed"
    }, {
      status: 405
    });
  }
  const body = await request.json().catch(() => null);
  const name = body?.name?.trim() || null;
  const assistantIds = Array.isArray(body?.assistantIds) ? body.assistantIds.filter((v) => typeof v === "string") : [];
  if (assistantIds.length === 0) {
    return Response.json({
      error: "En az bir asistan seçilmelidir"
    }, {
      status: 400
    });
  }
  const valid = await prisma.assistant.findMany({
    where: {
      id: {
        in: assistantIds
      }
    },
    select: {
      id: true
    }
  });
  if (valid.length === 0) {
    return Response.json({
      error: "Geçerli asistan bulunamadı"
    }, {
      status: 400
    });
  }
  const rawKey = generateRawApiKey();
  const key = await prisma.apiKey.create({
    data: {
      name,
      keyHash: hashApiKey(rawKey),
      keyPrefix: rawKey.slice(0, 16),
      assistants: {
        connect: valid.map((a) => ({
          id: a.id
        }))
      }
    },
    select: {
      id: true,
      name: true,
      keyPrefix: true,
      createdAt: true
    }
  });
  return Response.json({
    ...key,
    rawKey
  });
}
const route39 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$2
}, Symbol.toStringTag, { value: "Module" }));
async function isAdmin(request) {
  const session = await auth.api.getSession({
    headers: request.headers
  });
  if (!session?.user?.id) return false;
  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id
    },
    select: {
      role: true
    }
  });
  return user?.role === "admin";
}
async function action$1({
  request,
  params
}) {
  if (!await isAdmin(request)) {
    return Response.json({
      error: "Unauthorized"
    }, {
      status: 401
    });
  }
  const keyId = params.keyId;
  if (request.method === "PATCH") {
    const body = await request.json().catch(() => null);
    const data = {};
    if (typeof body?.revoked === "boolean") {
      data.revoked = body.revoked;
    }
    if (Array.isArray(body?.assistantIds)) {
      const ids = body.assistantIds.filter((v) => typeof v === "string");
      data.assistants = {
        set: ids.map((id) => ({
          id
        }))
      };
    }
    if (Object.keys(data).length === 0) {
      return Response.json({
        error: "Değişiklik yok"
      }, {
        status: 400
      });
    }
    await prisma.apiKey.update({
      where: {
        id: keyId
      },
      data
    });
    invalidateKeyCache();
    return Response.json({
      success: true
    });
  }
  if (request.method === "DELETE") {
    await prisma.apiKey.delete({
      where: {
        id: keyId
      }
    });
    invalidateKeyCache();
    return Response.json({
      success: true
    });
  }
  return Response.json({
    error: "Method not allowed"
  }, {
    status: 405
  });
}
const route40 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$1
}, Symbol.toStringTag, { value: "Module" }));
async function loader({
  request
}) {
  return auth.handler(request);
}
async function action({
  request
}) {
  return auth.handler(request);
}
const route41 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action,
  loader
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-DreTdhKf.js", "imports": ["/assets/chunk-WWGJGFF6-FsV5rGUt.js", "/assets/index-BTKUR6Zh.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": true, "module": "/assets/root-Z2xCIiiL.js", "imports": ["/assets/chunk-WWGJGFF6-FsV5rGUt.js", "/assets/index-BTKUR6Zh.js", "/assets/index-IfJG031w.js", "/assets/index-BprA-IWH.js", "/assets/loader-circle-DNJuC_ln.js", "/assets/createLucideIcon-DkBi3VpE.js", "/assets/circle-check-D-GG0PLy.js"], "css": ["/assets/root-D6Hw8wCe.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/home": { "id": "routes/home", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/home-eFhw0A8s.js", "imports": ["/assets/chunk-WWGJGFF6-FsV5rGUt.js", "/assets/button-DSz0zy4R.js", "/assets/brand-mark-BZD0cciZ.js", "/assets/index-IfJG031w.js", "/assets/sun-DfGKyZbc.js", "/assets/createLucideIcon-DkBi3VpE.js", "/assets/sparkles-CETB8vpp.js", "/assets/arrow-right-Db7jDY-W.js", "/assets/bot-CH5p-L-2.js", "/assets/shield-check-Cl2GKcjQ.js", "/assets/circle-check-D-GG0PLy.js", "/assets/utils--jWCipr1.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/auth/login": { "id": "routes/auth/login", "parentId": "root", "path": "login", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/login-CQJMEkCb.js", "imports": ["/assets/chunk-WWGJGFF6-FsV5rGUt.js", "/assets/brand-mark-BZD0cciZ.js", "/assets/button-DSz0zy4R.js", "/assets/card-By0OFkF6.js", "/assets/input-DEGQIH75.js", "/assets/label-BzB2RhT6.js", "/assets/arrow-left-C73sPFeW.js", "/assets/mail-BwVSRkz8.js", "/assets/lock-qoXx74ur.js", "/assets/loader-circle-DNJuC_ln.js", "/assets/bot-CH5p-L-2.js", "/assets/createLucideIcon-DkBi3VpE.js", "/assets/utils--jWCipr1.js", "/assets/index-BTKUR6Zh.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/auth/register": { "id": "routes/auth/register", "parentId": "root", "path": "register", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/register-2Z_keKUX.js", "imports": ["/assets/chunk-WWGJGFF6-FsV5rGUt.js", "/assets/brand-mark-BZD0cciZ.js", "/assets/button-DSz0zy4R.js", "/assets/card-By0OFkF6.js", "/assets/input-DEGQIH75.js", "/assets/label-BzB2RhT6.js", "/assets/arrow-left-C73sPFeW.js", "/assets/mail-BwVSRkz8.js", "/assets/user-Cym75eac.js", "/assets/lock-qoXx74ur.js", "/assets/loader-circle-DNJuC_ln.js", "/assets/bot-CH5p-L-2.js", "/assets/createLucideIcon-DkBi3VpE.js", "/assets/utils--jWCipr1.js", "/assets/index-BTKUR6Zh.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/docs/agent-api": { "id": "routes/docs/agent-api", "parentId": "root", "path": "docs/agent-api", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/agent-api-DKV1r9Y5.js", "imports": ["/assets/chunk-WWGJGFF6-FsV5rGUt.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/app/layout": { "id": "routes/app/layout", "parentId": "root", "path": void 0, "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/layout-DZi-tIda.js", "imports": ["/assets/chunk-WWGJGFF6-FsV5rGUt.js", "/assets/button-DSz0zy4R.js", "/assets/scroll-area-DGXQ-S2f.js", "/assets/index-Ee_dj1Vs.js", "/assets/utils--jWCipr1.js", "/assets/x-CgEnCyRX.js", "/assets/index-CffGwbet.js", "/assets/index-Co2x7cm0.js", "/assets/index-BKchecZy.js", "/assets/index-BTKUR6Zh.js", "/assets/brand-mark-BZD0cciZ.js", "/assets/index-IfJG031w.js", "/assets/settings-FFlA-Ecc.js", "/assets/createLucideIcon-DkBi3VpE.js", "/assets/plus-DZM7Et6z.js", "/assets/message-square-OXPVG4cu.js", "/assets/trash-2-BsN0O_HH.js", "/assets/sun-DfGKyZbc.js", "/assets/bot-CH5p-L-2.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/app/chat": { "id": "routes/app/chat", "parentId": "routes/app/layout", "path": "chat", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/chat-Ceem0nMI.js", "imports": ["/assets/chunk-WWGJGFF6-FsV5rGUt.js", "/assets/button-DSz0zy4R.js", "/assets/textarea-DFA-lHUk.js", "/assets/scroll-area-DGXQ-S2f.js", "/assets/index-CffGwbet.js", "/assets/utils--jWCipr1.js", "/assets/index-Co2x7cm0.js", "/assets/index-BTKUR6Zh.js", "/assets/index-BKchecZy.js", "/assets/index-BprA-IWH.js", "/assets/createLucideIcon-DkBi3VpE.js", "/assets/loader-circle-DNJuC_ln.js", "/assets/bot-CH5p-L-2.js", "/assets/sparkles-CETB8vpp.js", "/assets/check-CeH-WlbG.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "chat-detail": { "id": "chat-detail", "parentId": "routes/app/layout", "path": "chat/:chatId", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/chat-Ceem0nMI.js", "imports": ["/assets/chunk-WWGJGFF6-FsV5rGUt.js", "/assets/button-DSz0zy4R.js", "/assets/textarea-DFA-lHUk.js", "/assets/scroll-area-DGXQ-S2f.js", "/assets/index-CffGwbet.js", "/assets/utils--jWCipr1.js", "/assets/index-Co2x7cm0.js", "/assets/index-BTKUR6Zh.js", "/assets/index-BKchecZy.js", "/assets/index-BprA-IWH.js", "/assets/createLucideIcon-DkBi3VpE.js", "/assets/loader-circle-DNJuC_ln.js", "/assets/bot-CH5p-L-2.js", "/assets/sparkles-CETB8vpp.js", "/assets/check-CeH-WlbG.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/admin/layout": { "id": "routes/admin/layout", "parentId": "root", "path": void 0, "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/layout-BPgSTMzu.js", "imports": ["/assets/chunk-WWGJGFF6-FsV5rGUt.js", "/assets/button-DSz0zy4R.js", "/assets/scroll-area-DGXQ-S2f.js", "/assets/index-IfJG031w.js", "/assets/bot-CH5p-L-2.js", "/assets/x-CgEnCyRX.js", "/assets/settings-FFlA-Ecc.js", "/assets/createLucideIcon-DkBi3VpE.js", "/assets/users-JAb2fVDc.js", "/assets/key-round-BnHsVwDt.js", "/assets/external-link-f-DGLNv0.js", "/assets/sun-DfGKyZbc.js", "/assets/utils--jWCipr1.js", "/assets/index-BTKUR6Zh.js", "/assets/index-CffGwbet.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/admin/index": { "id": "routes/admin/index", "parentId": "routes/admin/layout", "path": "admin", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/index-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/admin/dashboard": { "id": "routes/admin/dashboard", "parentId": "routes/admin/layout", "path": "admin/dashboard", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/dashboard-Dbkk115J.js", "imports": ["/assets/chunk-WWGJGFF6-FsV5rGUt.js", "/assets/card-By0OFkF6.js", "/assets/button-DSz0zy4R.js", "/assets/users-JAb2fVDc.js", "/assets/bot-CH5p-L-2.js", "/assets/message-square-OXPVG4cu.js", "/assets/createLucideIcon-DkBi3VpE.js", "/assets/plus-DZM7Et6z.js", "/assets/arrow-right-Db7jDY-W.js", "/assets/utils--jWCipr1.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/admin/assistants": { "id": "routes/admin/assistants", "parentId": "routes/admin/layout", "path": "admin/assistants", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/assistants-DqUXGkrf.js", "imports": ["/assets/chunk-WWGJGFF6-FsV5rGUt.js", "/assets/card-By0OFkF6.js", "/assets/button-DSz0zy4R.js", "/assets/input-DEGQIH75.js", "/assets/label-BzB2RhT6.js", "/assets/textarea-DFA-lHUk.js", "/assets/dialog-BhPr1IBh.js", "/assets/badge-Bc9KjvNG.js", "/assets/plus-DZM7Et6z.js", "/assets/loader-circle-DNJuC_ln.js", "/assets/bot-CH5p-L-2.js", "/assets/globe-CZ_wVead.js", "/assets/lock-qoXx74ur.js", "/assets/arrow-right-Db7jDY-W.js", "/assets/utils--jWCipr1.js", "/assets/index-BTKUR6Zh.js", "/assets/index-Ee_dj1Vs.js", "/assets/index-CffGwbet.js", "/assets/index-Co2x7cm0.js", "/assets/x-CgEnCyRX.js", "/assets/createLucideIcon-DkBi3VpE.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/admin/assistant-detail": { "id": "routes/admin/assistant-detail", "parentId": "routes/admin/layout", "path": "admin/assistants/:assistantId", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/assistant-detail-DGZ6OAbB.js", "imports": ["/assets/chunk-WWGJGFF6-FsV5rGUt.js", "/assets/card-By0OFkF6.js", "/assets/button-DSz0zy4R.js", "/assets/input-DEGQIH75.js", "/assets/label-BzB2RhT6.js", "/assets/textarea-DFA-lHUk.js", "/assets/badge-Bc9KjvNG.js", "/assets/scroll-area-DGXQ-S2f.js", "/assets/dialog-BhPr1IBh.js", "/assets/clipboard-OjHtPqoZ.js", "/assets/index-BprA-IWH.js", "/assets/utils--jWCipr1.js", "/assets/arrow-left-C73sPFeW.js", "/assets/bot-CH5p-L-2.js", "/assets/globe-CZ_wVead.js", "/assets/lock-qoXx74ur.js", "/assets/users-JAb2fVDc.js", "/assets/createLucideIcon-DkBi3VpE.js", "/assets/loader-circle-DNJuC_ln.js", "/assets/save-CoWfz4Oh.js", "/assets/trash-2-BsN0O_HH.js", "/assets/external-link-f-DGLNv0.js", "/assets/check-CeH-WlbG.js", "/assets/plus-DZM7Et6z.js", "/assets/x-CgEnCyRX.js", "/assets/index-BTKUR6Zh.js", "/assets/index-CffGwbet.js", "/assets/index-Ee_dj1Vs.js", "/assets/index-Co2x7cm0.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/admin/users": { "id": "routes/admin/users", "parentId": "routes/admin/layout", "path": "admin/users", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/users-BCASnVaV.js", "imports": ["/assets/chunk-WWGJGFF6-FsV5rGUt.js", "/assets/card-By0OFkF6.js", "/assets/badge-Bc9KjvNG.js", "/assets/users-JAb2fVDc.js", "/assets/createLucideIcon-DkBi3VpE.js", "/assets/user-Cym75eac.js", "/assets/bot-CH5p-L-2.js", "/assets/utils--jWCipr1.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/admin/api-keys": { "id": "routes/admin/api-keys", "parentId": "routes/admin/layout", "path": "admin/api-keys", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/api-keys-BJkDyx5C.js", "imports": ["/assets/chunk-WWGJGFF6-FsV5rGUt.js", "/assets/card-By0OFkF6.js", "/assets/button-DSz0zy4R.js", "/assets/input-DEGQIH75.js", "/assets/label-BzB2RhT6.js", "/assets/badge-Bc9KjvNG.js", "/assets/scroll-area-DGXQ-S2f.js", "/assets/dialog-BhPr1IBh.js", "/assets/clipboard-OjHtPqoZ.js", "/assets/index-BprA-IWH.js", "/assets/plus-DZM7Et6z.js", "/assets/loader-circle-DNJuC_ln.js", "/assets/key-round-BnHsVwDt.js", "/assets/shield-check-Cl2GKcjQ.js", "/assets/check-CeH-WlbG.js", "/assets/ban-BlxeV6TG.js", "/assets/trash-2-BsN0O_HH.js", "/assets/utils--jWCipr1.js", "/assets/index-BTKUR6Zh.js", "/assets/index-CffGwbet.js", "/assets/index-Ee_dj1Vs.js", "/assets/index-Co2x7cm0.js", "/assets/x-CgEnCyRX.js", "/assets/createLucideIcon-DkBi3VpE.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/admin/api-key-detail": { "id": "routes/admin/api-key-detail", "parentId": "routes/admin/layout", "path": "admin/api-keys/:keyId", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/api-key-detail-DDQT_C2s.js", "imports": ["/assets/chunk-WWGJGFF6-FsV5rGUt.js", "/assets/card-By0OFkF6.js", "/assets/button-DSz0zy4R.js", "/assets/label-BzB2RhT6.js", "/assets/badge-Bc9KjvNG.js", "/assets/scroll-area-DGXQ-S2f.js", "/assets/dialog-BhPr1IBh.js", "/assets/index-BprA-IWH.js", "/assets/arrow-left-C73sPFeW.js", "/assets/key-round-BnHsVwDt.js", "/assets/loader-circle-DNJuC_ln.js", "/assets/check-CeH-WlbG.js", "/assets/ban-BlxeV6TG.js", "/assets/trash-2-BsN0O_HH.js", "/assets/shield-check-Cl2GKcjQ.js", "/assets/createLucideIcon-DkBi3VpE.js", "/assets/utils--jWCipr1.js", "/assets/index-BTKUR6Zh.js", "/assets/index-CffGwbet.js", "/assets/index-Ee_dj1Vs.js", "/assets/index-Co2x7cm0.js", "/assets/x-CgEnCyRX.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/admin/settings": { "id": "routes/admin/settings", "parentId": "routes/admin/layout", "path": "admin/settings", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/settings-CFJ2v43K.js", "imports": ["/assets/chunk-WWGJGFF6-FsV5rGUt.js", "/assets/card-By0OFkF6.js", "/assets/button-DSz0zy4R.js", "/assets/input-DEGQIH75.js", "/assets/label-BzB2RhT6.js", "/assets/index-BprA-IWH.js", "/assets/loader-circle-DNJuC_ln.js", "/assets/save-CoWfz4Oh.js", "/assets/utils--jWCipr1.js", "/assets/index-BTKUR6Zh.js", "/assets/createLucideIcon-DkBi3VpE.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/api/logout": { "id": "routes/api/logout", "parentId": "root", "path": "api/logout", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/logout-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "api-chat": { "id": "api-chat", "parentId": "root", "path": "api/chat/:chatId", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/chat-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/api/transcribe": { "id": "routes/api/transcribe", "parentId": "root", "path": "api/transcribe", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/transcribe-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/api/tts": { "id": "routes/api/tts", "parentId": "root", "path": "api/tts", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/tts-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/api/assistants": { "id": "routes/api/assistants", "parentId": "root", "path": "api/assistants", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/assistants-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/api/user-chats": { "id": "routes/api/user-chats", "parentId": "root", "path": "api/user/chats", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/user-chats-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/api/v1/agents": { "id": "routes/api/v1/agents", "parentId": "root", "path": "api/v1/agents/:agent", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/agents-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/api/agora/chat-completions": { "id": "routes/api/agora/chat-completions", "parentId": "root", "path": "api/agora/chat/completions", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/chat-completions-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/api/agora/stream": { "id": "routes/api/agora/stream", "parentId": "root", "path": "api/agora/stream", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/stream-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/api/realtime/session": { "id": "routes/api/realtime/session", "parentId": "root", "path": "api/realtime/session", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/session-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/api/realtime/agent": { "id": "routes/api/realtime/agent", "parentId": "root", "path": "api/realtime/agent", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/agent-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/api/realtime/tts": { "id": "routes/api/realtime/tts", "parentId": "root", "path": "api/realtime/tts", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/tts-DP2rzg_V.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/api/realtime/history": { "id": "routes/api/realtime/history", "parentId": "root", "path": "api/realtime/history", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/history-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/api/realtime/stats": { "id": "routes/api/realtime/stats", "parentId": "root", "path": "api/realtime/stats", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/stats-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/api/realtime/speech": { "id": "routes/api/realtime/speech", "parentId": "root", "path": "api/realtime/speech", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/speech-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/api/realtime/translate": { "id": "routes/api/realtime/translate", "parentId": "root", "path": "api/realtime/translate", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/translate-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/api/realtime/voices": { "id": "routes/api/realtime/voices", "parentId": "root", "path": "api/realtime/voices", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/voices-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/api/admin/assistants": { "id": "routes/api/admin/assistants", "parentId": "root", "path": "api/admin/assistants", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/assistants-DP2rzg_V.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/api/admin/assistant-detail": { "id": "routes/api/admin/assistant-detail", "parentId": "root", "path": "api/admin/assistants/:assistantId", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/assistant-detail-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/api/admin/assistant-files": { "id": "routes/api/admin/assistant-files", "parentId": "root", "path": "api/admin/assistants/:assistantId/files", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/assistant-files-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/api/admin/users": { "id": "routes/api/admin/users", "parentId": "root", "path": "api/admin/users", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/users-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/api/admin/user-access": { "id": "routes/api/admin/user-access", "parentId": "root", "path": "api/admin/users/:userId/access", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/user-access-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/api/admin/api-keys": { "id": "routes/api/admin/api-keys", "parentId": "root", "path": "api/admin/api-keys", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/api-keys-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/api/admin/api-key-detail": { "id": "routes/api/admin/api-key-detail", "parentId": "root", "path": "api/admin/api-keys/:keyId", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/api-key-detail-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "api-auth": { "id": "api-auth", "parentId": "root", "path": "api/auth/*", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/assets/manifest-e274dfd9.js", "version": "e274dfd9", "sri": void 0 };
const assetsBuildDirectory = "build\\client";
const basename = "/";
const future = { "unstable_optimizeDeps": false, "unstable_subResourceIntegrity": false, "v8_middleware": false, "v8_splitRouteModules": false, "v8_viteEnvironmentApi": false };
const ssr = true;
const isSpaMode = false;
const prerender = [];
const routeDiscovery = { "mode": "lazy", "manifestPath": "/__manifest" };
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/home": {
    id: "routes/home",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route1
  },
  "routes/auth/login": {
    id: "routes/auth/login",
    parentId: "root",
    path: "login",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/auth/register": {
    id: "routes/auth/register",
    parentId: "root",
    path: "register",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "routes/docs/agent-api": {
    id: "routes/docs/agent-api",
    parentId: "root",
    path: "docs/agent-api",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  },
  "routes/app/layout": {
    id: "routes/app/layout",
    parentId: "root",
    path: void 0,
    index: void 0,
    caseSensitive: void 0,
    module: route5
  },
  "routes/app/chat": {
    id: "routes/app/chat",
    parentId: "routes/app/layout",
    path: "chat",
    index: void 0,
    caseSensitive: void 0,
    module: route7
  },
  "chat-detail": {
    id: "chat-detail",
    parentId: "routes/app/layout",
    path: "chat/:chatId",
    index: void 0,
    caseSensitive: void 0,
    module: route7
  },
  "routes/admin/layout": {
    id: "routes/admin/layout",
    parentId: "root",
    path: void 0,
    index: void 0,
    caseSensitive: void 0,
    module: route8
  },
  "routes/admin/index": {
    id: "routes/admin/index",
    parentId: "routes/admin/layout",
    path: "admin",
    index: void 0,
    caseSensitive: void 0,
    module: route9
  },
  "routes/admin/dashboard": {
    id: "routes/admin/dashboard",
    parentId: "routes/admin/layout",
    path: "admin/dashboard",
    index: void 0,
    caseSensitive: void 0,
    module: route10
  },
  "routes/admin/assistants": {
    id: "routes/admin/assistants",
    parentId: "routes/admin/layout",
    path: "admin/assistants",
    index: void 0,
    caseSensitive: void 0,
    module: route11
  },
  "routes/admin/assistant-detail": {
    id: "routes/admin/assistant-detail",
    parentId: "routes/admin/layout",
    path: "admin/assistants/:assistantId",
    index: void 0,
    caseSensitive: void 0,
    module: route12
  },
  "routes/admin/users": {
    id: "routes/admin/users",
    parentId: "routes/admin/layout",
    path: "admin/users",
    index: void 0,
    caseSensitive: void 0,
    module: route13
  },
  "routes/admin/api-keys": {
    id: "routes/admin/api-keys",
    parentId: "routes/admin/layout",
    path: "admin/api-keys",
    index: void 0,
    caseSensitive: void 0,
    module: route14
  },
  "routes/admin/api-key-detail": {
    id: "routes/admin/api-key-detail",
    parentId: "routes/admin/layout",
    path: "admin/api-keys/:keyId",
    index: void 0,
    caseSensitive: void 0,
    module: route15
  },
  "routes/admin/settings": {
    id: "routes/admin/settings",
    parentId: "routes/admin/layout",
    path: "admin/settings",
    index: void 0,
    caseSensitive: void 0,
    module: route16
  },
  "routes/api/logout": {
    id: "routes/api/logout",
    parentId: "root",
    path: "api/logout",
    index: void 0,
    caseSensitive: void 0,
    module: route17
  },
  "api-chat": {
    id: "api-chat",
    parentId: "root",
    path: "api/chat/:chatId",
    index: void 0,
    caseSensitive: void 0,
    module: route18
  },
  "routes/api/transcribe": {
    id: "routes/api/transcribe",
    parentId: "root",
    path: "api/transcribe",
    index: void 0,
    caseSensitive: void 0,
    module: route19
  },
  "routes/api/tts": {
    id: "routes/api/tts",
    parentId: "root",
    path: "api/tts",
    index: void 0,
    caseSensitive: void 0,
    module: route20
  },
  "routes/api/assistants": {
    id: "routes/api/assistants",
    parentId: "root",
    path: "api/assistants",
    index: void 0,
    caseSensitive: void 0,
    module: route21
  },
  "routes/api/user-chats": {
    id: "routes/api/user-chats",
    parentId: "root",
    path: "api/user/chats",
    index: void 0,
    caseSensitive: void 0,
    module: route22
  },
  "routes/api/v1/agents": {
    id: "routes/api/v1/agents",
    parentId: "root",
    path: "api/v1/agents/:agent",
    index: void 0,
    caseSensitive: void 0,
    module: route23
  },
  "routes/api/agora/chat-completions": {
    id: "routes/api/agora/chat-completions",
    parentId: "root",
    path: "api/agora/chat/completions",
    index: void 0,
    caseSensitive: void 0,
    module: route24
  },
  "routes/api/agora/stream": {
    id: "routes/api/agora/stream",
    parentId: "root",
    path: "api/agora/stream",
    index: void 0,
    caseSensitive: void 0,
    module: route25
  },
  "routes/api/realtime/session": {
    id: "routes/api/realtime/session",
    parentId: "root",
    path: "api/realtime/session",
    index: void 0,
    caseSensitive: void 0,
    module: route26
  },
  "routes/api/realtime/agent": {
    id: "routes/api/realtime/agent",
    parentId: "root",
    path: "api/realtime/agent",
    index: void 0,
    caseSensitive: void 0,
    module: route27
  },
  "routes/api/realtime/tts": {
    id: "routes/api/realtime/tts",
    parentId: "root",
    path: "api/realtime/tts",
    index: void 0,
    caseSensitive: void 0,
    module: route28
  },
  "routes/api/realtime/history": {
    id: "routes/api/realtime/history",
    parentId: "root",
    path: "api/realtime/history",
    index: void 0,
    caseSensitive: void 0,
    module: route29
  },
  "routes/api/realtime/stats": {
    id: "routes/api/realtime/stats",
    parentId: "root",
    path: "api/realtime/stats",
    index: void 0,
    caseSensitive: void 0,
    module: route30
  },
  "routes/api/realtime/speech": {
    id: "routes/api/realtime/speech",
    parentId: "root",
    path: "api/realtime/speech",
    index: void 0,
    caseSensitive: void 0,
    module: route31
  },
  "routes/api/realtime/translate": {
    id: "routes/api/realtime/translate",
    parentId: "root",
    path: "api/realtime/translate",
    index: void 0,
    caseSensitive: void 0,
    module: route32
  },
  "routes/api/realtime/voices": {
    id: "routes/api/realtime/voices",
    parentId: "root",
    path: "api/realtime/voices",
    index: void 0,
    caseSensitive: void 0,
    module: route33
  },
  "routes/api/admin/assistants": {
    id: "routes/api/admin/assistants",
    parentId: "root",
    path: "api/admin/assistants",
    index: void 0,
    caseSensitive: void 0,
    module: route34
  },
  "routes/api/admin/assistant-detail": {
    id: "routes/api/admin/assistant-detail",
    parentId: "root",
    path: "api/admin/assistants/:assistantId",
    index: void 0,
    caseSensitive: void 0,
    module: route35
  },
  "routes/api/admin/assistant-files": {
    id: "routes/api/admin/assistant-files",
    parentId: "root",
    path: "api/admin/assistants/:assistantId/files",
    index: void 0,
    caseSensitive: void 0,
    module: route36
  },
  "routes/api/admin/users": {
    id: "routes/api/admin/users",
    parentId: "root",
    path: "api/admin/users",
    index: void 0,
    caseSensitive: void 0,
    module: route37
  },
  "routes/api/admin/user-access": {
    id: "routes/api/admin/user-access",
    parentId: "root",
    path: "api/admin/users/:userId/access",
    index: void 0,
    caseSensitive: void 0,
    module: route38
  },
  "routes/api/admin/api-keys": {
    id: "routes/api/admin/api-keys",
    parentId: "root",
    path: "api/admin/api-keys",
    index: void 0,
    caseSensitive: void 0,
    module: route39
  },
  "routes/api/admin/api-key-detail": {
    id: "routes/api/admin/api-key-detail",
    parentId: "root",
    path: "api/admin/api-keys/:keyId",
    index: void 0,
    caseSensitive: void 0,
    module: route40
  },
  "api-auth": {
    id: "api-auth",
    parentId: "root",
    path: "api/auth/*",
    index: void 0,
    caseSensitive: void 0,
    module: route41
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  prerender,
  publicPath,
  routeDiscovery,
  routes,
  ssr
};
