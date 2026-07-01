import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter, UNSAFE_withComponentProps, Outlet, UNSAFE_withErrorBoundaryProps, isRouteErrorResponse, Meta, Links, ScrollRestoration, Scripts, useNavigation, Link, Form, useLocation, useNavigate, useParams, useSearchParams, useRevalidator } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { Loader2Icon, OctagonXIcon, TriangleAlertIcon, InfoIcon, CircleCheckIcon, Bot, Sun, Moon, LockKeyhole, UserRound, Sparkles, ArrowRight, Monitor, BadgeCheck, Gamepad2, Languages, BrainCircuit, MessageSquareText, ShieldCheck, CheckCircle2, ArrowLeft, AlertCircle, Mail, Lock, Loader2, User, XIcon, Menu, PanelLeftClose, Plus, PanelLeftOpen, MessageSquare, Trash2, LogOut, Settings, ChevronDown, Check, SendHorizontal, X, LayoutDashboard, Users, ExternalLink, TrendingUp, Globe, FileText, Save, Database, Upload, UserPlus, Search, Shield } from "lucide-react";
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
function meta() {
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
  meta
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
async function action$a({
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
async function loader$j({
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
  action: action$a,
  default: login,
  loader: loader$j
}, Symbol.toStringTag, { value: "Module" }));
async function action$9({
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
async function loader$i({
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
  action: action$9,
  default: register,
  loader: loader$i
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
async function loader$h({
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
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: layout$1,
  loader: loader$h
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
async function loader$g({
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
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const scrollAreaRef = useRef(null);
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
  const handleSend = async () => {
    if (!input.trim() || isLoading || !selectedAssistant) return;
    const userMessageContent = input.trim();
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
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
            }), /* @__PURE__ */ jsx(Button, {
              onClick: handleSend,
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
            children: message.role === "assistant" ? /* @__PURE__ */ jsx(MarkdownRenderer, {
              content: message.content
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
          ), /* @__PURE__ */ jsx(Button, {
            onClick: handleSend,
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
      })
    })]
  });
});
const route6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: chat,
  loader: loader$g
}, Symbol.toStringTag, { value: "Module" }));
async function loader$f({
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
const route7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: layout,
  loader: loader$f
}, Symbol.toStringTag, { value: "Module" }));
async function loader$e() {
  return new Response(null, {
    status: 302,
    headers: {
      Location: "/admin/dashboard"
    }
  });
}
const route8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$e
}, Symbol.toStringTag, { value: "Module" }));
async function loader$d() {
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
const route9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: dashboard,
  loader: loader$d
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
async function loader$c() {
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
const route10 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: assistants,
  loader: loader$c
}, Symbol.toStringTag, { value: "Module" }));
async function loader$b({
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
    allUsers
  };
}
const assistantDetail = UNSAFE_withComponentProps(function AssistantDetail({
  loaderData
}) {
  const {
    assistant,
    allUsers
  } = loaderData;
  const navigate = useNavigate();
  const revalidator = useRevalidator();
  const fileInputRef = useRef(null);
  const [name, setName] = useState(assistant?.name || "");
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
        toast.error("Güncelleme başarısız");
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
const route11 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: assistantDetail,
  loader: loader$b
}, Symbol.toStringTag, { value: "Module" }));
async function loader$a() {
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
const route12 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: users,
  loader: loader$a
}, Symbol.toStringTag, { value: "Module" }));
async function loader$9() {
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
const route13 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: settings,
  loader: loader$9
}, Symbol.toStringTag, { value: "Module" }));
async function action$8({
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
async function loader$8({
  request
}) {
  return action$8({
    request
  });
}
const route14 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$8,
  loader: loader$8
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
async function chatStream(messages, systemInstruction, vectorStoreId, model = "gpt-4.1-mini") {
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
  const response = await openai.responses.create(requestParams);
  const encoder = new TextEncoder();
  return new ReadableStream({
    async start(controller) {
      try {
        for await (const event of response) {
          const eventData = event;
          if (eventData.type === "response.output_text.delta" && eventData.delta) {
            controller.enqueue(encoder.encode(eventData.delta));
          } else if (eventData.type === "content_block_delta" && eventData.delta?.text) {
            controller.enqueue(encoder.encode(eventData.delta.text));
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
async function action$7({
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
const route15 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$7
}, Symbol.toStringTag, { value: "Module" }));
async function loader$7({
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
const route16 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$7
}, Symbol.toStringTag, { value: "Module" }));
async function loader$6({
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
async function action$6({
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
const route17 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$6,
  loader: loader$6
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
async function loader$5({
  request
}) {
  if (!await isAdmin$4(request)) {
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
async function action$5({
  request
}) {
  if (!await isAdmin$4(request)) {
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
const route18 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$5,
  loader: loader$5
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
async function loader$4({
  request,
  params
}) {
  if (!await isAdmin$3(request)) {
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
async function action$4({
  request,
  params
}) {
  if (!await isAdmin$3(request)) {
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
      description,
      systemInstruction,
      model,
      color,
      isPublic,
      isActive,
      vectorStoreId,
      vectorStoreName
    } = body;
    const assistant = await prisma.assistant.update({
      where: {
        id: assistantId
      },
      data: {
        name,
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
const route19 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$4,
  loader: loader$4
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
async function loader$3({
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
async function action$3({
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
const route20 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$3,
  loader: loader$3
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
async function loader$2({
  request
}) {
  if (!await isAdmin$1(request)) {
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
const route21 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$2,
  loader: loader$2
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
async function loader$1({
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
async function action$1({
  request,
  params
}) {
  const session = await auth.api.getSession({
    headers: request.headers
  });
  if (!await isAdmin(request)) {
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
const route22 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$1,
  loader: loader$1
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
const route23 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action,
  loader
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-DreTdhKf.js", "imports": ["/assets/chunk-WWGJGFF6-FsV5rGUt.js", "/assets/index-BTKUR6Zh.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": true, "module": "/assets/root-Pd-y4Pee.js", "imports": ["/assets/chunk-WWGJGFF6-FsV5rGUt.js", "/assets/index-BTKUR6Zh.js", "/assets/index-IfJG031w.js", "/assets/index-BprA-IWH.js", "/assets/loader-circle-DNJuC_ln.js", "/assets/createLucideIcon-DkBi3VpE.js", "/assets/circle-check-D-GG0PLy.js"], "css": ["/assets/root-D-p-JgzY.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/home": { "id": "routes/home", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/home-BOXPEGKA.js", "imports": ["/assets/chunk-WWGJGFF6-FsV5rGUt.js", "/assets/button-B6rweKZg.js", "/assets/brand-mark-BZD0cciZ.js", "/assets/index-IfJG031w.js", "/assets/sun-DfGKyZbc.js", "/assets/createLucideIcon-DkBi3VpE.js", "/assets/sparkles-CETB8vpp.js", "/assets/arrow-right-Db7jDY-W.js", "/assets/bot-CH5p-L-2.js", "/assets/circle-check-D-GG0PLy.js", "/assets/utils-OEcyCmvs.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/auth/login": { "id": "routes/auth/login", "parentId": "root", "path": "login", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/login-501JsVLk.js", "imports": ["/assets/chunk-WWGJGFF6-FsV5rGUt.js", "/assets/brand-mark-BZD0cciZ.js", "/assets/button-B6rweKZg.js", "/assets/card-BP_Rmrj8.js", "/assets/label-DDDtlq00.js", "/assets/arrow-left-C73sPFeW.js", "/assets/mail-BwVSRkz8.js", "/assets/lock-qoXx74ur.js", "/assets/loader-circle-DNJuC_ln.js", "/assets/bot-CH5p-L-2.js", "/assets/createLucideIcon-DkBi3VpE.js", "/assets/utils-OEcyCmvs.js", "/assets/index-BTKUR6Zh.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/auth/register": { "id": "routes/auth/register", "parentId": "root", "path": "register", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/register-BTr7NP-d.js", "imports": ["/assets/chunk-WWGJGFF6-FsV5rGUt.js", "/assets/brand-mark-BZD0cciZ.js", "/assets/button-B6rweKZg.js", "/assets/card-BP_Rmrj8.js", "/assets/label-DDDtlq00.js", "/assets/arrow-left-C73sPFeW.js", "/assets/mail-BwVSRkz8.js", "/assets/user-Cym75eac.js", "/assets/lock-qoXx74ur.js", "/assets/loader-circle-DNJuC_ln.js", "/assets/bot-CH5p-L-2.js", "/assets/createLucideIcon-DkBi3VpE.js", "/assets/utils-OEcyCmvs.js", "/assets/index-BTKUR6Zh.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/app/layout": { "id": "routes/app/layout", "parentId": "root", "path": void 0, "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/layout-B6DA4HCq.js", "imports": ["/assets/chunk-WWGJGFF6-FsV5rGUt.js", "/assets/button-B6rweKZg.js", "/assets/scroll-area-qD90NoAF.js", "/assets/index-0nEghcqO.js", "/assets/utils-OEcyCmvs.js", "/assets/x-CgEnCyRX.js", "/assets/index-CVtuAv9o.js", "/assets/index-CfJCwwuW.js", "/assets/index-U5RpO2XE.js", "/assets/index-BTKUR6Zh.js", "/assets/brand-mark-BZD0cciZ.js", "/assets/index-IfJG031w.js", "/assets/settings-FFlA-Ecc.js", "/assets/createLucideIcon-DkBi3VpE.js", "/assets/plus-DZM7Et6z.js", "/assets/message-square-OXPVG4cu.js", "/assets/trash-2-BsN0O_HH.js", "/assets/sun-DfGKyZbc.js", "/assets/bot-CH5p-L-2.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/app/chat": { "id": "routes/app/chat", "parentId": "routes/app/layout", "path": "chat", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/chat-BYfyEvbC.js", "imports": ["/assets/chunk-WWGJGFF6-FsV5rGUt.js", "/assets/button-B6rweKZg.js", "/assets/textarea-B9P2Bp3P.js", "/assets/scroll-area-qD90NoAF.js", "/assets/index-CVtuAv9o.js", "/assets/utils-OEcyCmvs.js", "/assets/index-CfJCwwuW.js", "/assets/index-BTKUR6Zh.js", "/assets/index-U5RpO2XE.js", "/assets/bot-CH5p-L-2.js", "/assets/sparkles-CETB8vpp.js", "/assets/createLucideIcon-DkBi3VpE.js", "/assets/check-CeH-WlbG.js", "/assets/loader-circle-DNJuC_ln.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "chat-detail": { "id": "chat-detail", "parentId": "routes/app/layout", "path": "chat/:chatId", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/chat-BYfyEvbC.js", "imports": ["/assets/chunk-WWGJGFF6-FsV5rGUt.js", "/assets/button-B6rweKZg.js", "/assets/textarea-B9P2Bp3P.js", "/assets/scroll-area-qD90NoAF.js", "/assets/index-CVtuAv9o.js", "/assets/utils-OEcyCmvs.js", "/assets/index-CfJCwwuW.js", "/assets/index-BTKUR6Zh.js", "/assets/index-U5RpO2XE.js", "/assets/bot-CH5p-L-2.js", "/assets/sparkles-CETB8vpp.js", "/assets/createLucideIcon-DkBi3VpE.js", "/assets/check-CeH-WlbG.js", "/assets/loader-circle-DNJuC_ln.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/admin/layout": { "id": "routes/admin/layout", "parentId": "root", "path": void 0, "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/layout-CNmh936O.js", "imports": ["/assets/chunk-WWGJGFF6-FsV5rGUt.js", "/assets/button-B6rweKZg.js", "/assets/scroll-area-qD90NoAF.js", "/assets/index-IfJG031w.js", "/assets/bot-CH5p-L-2.js", "/assets/x-CgEnCyRX.js", "/assets/settings-FFlA-Ecc.js", "/assets/createLucideIcon-DkBi3VpE.js", "/assets/users-JAb2fVDc.js", "/assets/sun-DfGKyZbc.js", "/assets/utils-OEcyCmvs.js", "/assets/index-BTKUR6Zh.js", "/assets/index-CVtuAv9o.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/admin/index": { "id": "routes/admin/index", "parentId": "routes/admin/layout", "path": "admin", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/index-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/admin/dashboard": { "id": "routes/admin/dashboard", "parentId": "routes/admin/layout", "path": "admin/dashboard", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/dashboard-BSj5q7kU.js", "imports": ["/assets/chunk-WWGJGFF6-FsV5rGUt.js", "/assets/card-BP_Rmrj8.js", "/assets/button-B6rweKZg.js", "/assets/users-JAb2fVDc.js", "/assets/bot-CH5p-L-2.js", "/assets/message-square-OXPVG4cu.js", "/assets/createLucideIcon-DkBi3VpE.js", "/assets/plus-DZM7Et6z.js", "/assets/arrow-right-Db7jDY-W.js", "/assets/utils-OEcyCmvs.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/admin/assistants": { "id": "routes/admin/assistants", "parentId": "routes/admin/layout", "path": "admin/assistants", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/assistants-CgW96rFr.js", "imports": ["/assets/chunk-WWGJGFF6-FsV5rGUt.js", "/assets/card-BP_Rmrj8.js", "/assets/button-B6rweKZg.js", "/assets/label-DDDtlq00.js", "/assets/textarea-B9P2Bp3P.js", "/assets/dialog-DZY6rRsu.js", "/assets/badge-D8Tb4v7H.js", "/assets/plus-DZM7Et6z.js", "/assets/loader-circle-DNJuC_ln.js", "/assets/bot-CH5p-L-2.js", "/assets/lock-qoXx74ur.js", "/assets/arrow-right-Db7jDY-W.js", "/assets/utils-OEcyCmvs.js", "/assets/index-BTKUR6Zh.js", "/assets/createLucideIcon-DkBi3VpE.js", "/assets/index-0nEghcqO.js", "/assets/index-CVtuAv9o.js", "/assets/index-CfJCwwuW.js", "/assets/x-CgEnCyRX.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/admin/assistant-detail": { "id": "routes/admin/assistant-detail", "parentId": "routes/admin/layout", "path": "admin/assistants/:assistantId", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/assistant-detail-DTrP7AkL.js", "imports": ["/assets/chunk-WWGJGFF6-FsV5rGUt.js", "/assets/card-BP_Rmrj8.js", "/assets/button-B6rweKZg.js", "/assets/label-DDDtlq00.js", "/assets/textarea-B9P2Bp3P.js", "/assets/badge-D8Tb4v7H.js", "/assets/scroll-area-qD90NoAF.js", "/assets/dialog-DZY6rRsu.js", "/assets/index-BprA-IWH.js", "/assets/utils-OEcyCmvs.js", "/assets/arrow-left-C73sPFeW.js", "/assets/bot-CH5p-L-2.js", "/assets/lock-qoXx74ur.js", "/assets/users-JAb2fVDc.js", "/assets/createLucideIcon-DkBi3VpE.js", "/assets/loader-circle-DNJuC_ln.js", "/assets/save-CoWfz4Oh.js", "/assets/trash-2-BsN0O_HH.js", "/assets/check-CeH-WlbG.js", "/assets/plus-DZM7Et6z.js", "/assets/x-CgEnCyRX.js", "/assets/index-BTKUR6Zh.js", "/assets/index-CVtuAv9o.js", "/assets/index-0nEghcqO.js", "/assets/index-CfJCwwuW.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/admin/users": { "id": "routes/admin/users", "parentId": "routes/admin/layout", "path": "admin/users", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/users-pY6XehlE.js", "imports": ["/assets/chunk-WWGJGFF6-FsV5rGUt.js", "/assets/card-BP_Rmrj8.js", "/assets/badge-D8Tb4v7H.js", "/assets/users-JAb2fVDc.js", "/assets/createLucideIcon-DkBi3VpE.js", "/assets/user-Cym75eac.js", "/assets/bot-CH5p-L-2.js", "/assets/utils-OEcyCmvs.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/admin/settings": { "id": "routes/admin/settings", "parentId": "routes/admin/layout", "path": "admin/settings", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/settings-C1wqbOFf.js", "imports": ["/assets/chunk-WWGJGFF6-FsV5rGUt.js", "/assets/card-BP_Rmrj8.js", "/assets/button-B6rweKZg.js", "/assets/label-DDDtlq00.js", "/assets/index-BprA-IWH.js", "/assets/loader-circle-DNJuC_ln.js", "/assets/save-CoWfz4Oh.js", "/assets/utils-OEcyCmvs.js", "/assets/index-BTKUR6Zh.js", "/assets/createLucideIcon-DkBi3VpE.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/api/logout": { "id": "routes/api/logout", "parentId": "root", "path": "api/logout", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/logout-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "api-chat": { "id": "api-chat", "parentId": "root", "path": "api/chat/:chatId", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/chat-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/api/assistants": { "id": "routes/api/assistants", "parentId": "root", "path": "api/assistants", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/assistants-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/api/user-chats": { "id": "routes/api/user-chats", "parentId": "root", "path": "api/user/chats", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/user-chats-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/api/admin/assistants": { "id": "routes/api/admin/assistants", "parentId": "root", "path": "api/admin/assistants", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/assistants-DP2rzg_V.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/api/admin/assistant-detail": { "id": "routes/api/admin/assistant-detail", "parentId": "root", "path": "api/admin/assistants/:assistantId", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/assistant-detail-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/api/admin/assistant-files": { "id": "routes/api/admin/assistant-files", "parentId": "root", "path": "api/admin/assistants/:assistantId/files", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/assistant-files-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/api/admin/users": { "id": "routes/api/admin/users", "parentId": "root", "path": "api/admin/users", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/users-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/api/admin/user-access": { "id": "routes/api/admin/user-access", "parentId": "root", "path": "api/admin/users/:userId/access", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/user-access-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "api-auth": { "id": "api-auth", "parentId": "root", "path": "api/auth/*", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/assets/manifest-48fb03d3.js", "version": "48fb03d3", "sri": void 0 };
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
  "routes/app/layout": {
    id: "routes/app/layout",
    parentId: "root",
    path: void 0,
    index: void 0,
    caseSensitive: void 0,
    module: route4
  },
  "routes/app/chat": {
    id: "routes/app/chat",
    parentId: "routes/app/layout",
    path: "chat",
    index: void 0,
    caseSensitive: void 0,
    module: route6
  },
  "chat-detail": {
    id: "chat-detail",
    parentId: "routes/app/layout",
    path: "chat/:chatId",
    index: void 0,
    caseSensitive: void 0,
    module: route6
  },
  "routes/admin/layout": {
    id: "routes/admin/layout",
    parentId: "root",
    path: void 0,
    index: void 0,
    caseSensitive: void 0,
    module: route7
  },
  "routes/admin/index": {
    id: "routes/admin/index",
    parentId: "routes/admin/layout",
    path: "admin",
    index: void 0,
    caseSensitive: void 0,
    module: route8
  },
  "routes/admin/dashboard": {
    id: "routes/admin/dashboard",
    parentId: "routes/admin/layout",
    path: "admin/dashboard",
    index: void 0,
    caseSensitive: void 0,
    module: route9
  },
  "routes/admin/assistants": {
    id: "routes/admin/assistants",
    parentId: "routes/admin/layout",
    path: "admin/assistants",
    index: void 0,
    caseSensitive: void 0,
    module: route10
  },
  "routes/admin/assistant-detail": {
    id: "routes/admin/assistant-detail",
    parentId: "routes/admin/layout",
    path: "admin/assistants/:assistantId",
    index: void 0,
    caseSensitive: void 0,
    module: route11
  },
  "routes/admin/users": {
    id: "routes/admin/users",
    parentId: "routes/admin/layout",
    path: "admin/users",
    index: void 0,
    caseSensitive: void 0,
    module: route12
  },
  "routes/admin/settings": {
    id: "routes/admin/settings",
    parentId: "routes/admin/layout",
    path: "admin/settings",
    index: void 0,
    caseSensitive: void 0,
    module: route13
  },
  "routes/api/logout": {
    id: "routes/api/logout",
    parentId: "root",
    path: "api/logout",
    index: void 0,
    caseSensitive: void 0,
    module: route14
  },
  "api-chat": {
    id: "api-chat",
    parentId: "root",
    path: "api/chat/:chatId",
    index: void 0,
    caseSensitive: void 0,
    module: route15
  },
  "routes/api/assistants": {
    id: "routes/api/assistants",
    parentId: "root",
    path: "api/assistants",
    index: void 0,
    caseSensitive: void 0,
    module: route16
  },
  "routes/api/user-chats": {
    id: "routes/api/user-chats",
    parentId: "root",
    path: "api/user/chats",
    index: void 0,
    caseSensitive: void 0,
    module: route17
  },
  "routes/api/admin/assistants": {
    id: "routes/api/admin/assistants",
    parentId: "root",
    path: "api/admin/assistants",
    index: void 0,
    caseSensitive: void 0,
    module: route18
  },
  "routes/api/admin/assistant-detail": {
    id: "routes/api/admin/assistant-detail",
    parentId: "root",
    path: "api/admin/assistants/:assistantId",
    index: void 0,
    caseSensitive: void 0,
    module: route19
  },
  "routes/api/admin/assistant-files": {
    id: "routes/api/admin/assistant-files",
    parentId: "root",
    path: "api/admin/assistants/:assistantId/files",
    index: void 0,
    caseSensitive: void 0,
    module: route20
  },
  "routes/api/admin/users": {
    id: "routes/api/admin/users",
    parentId: "root",
    path: "api/admin/users",
    index: void 0,
    caseSensitive: void 0,
    module: route21
  },
  "routes/api/admin/user-access": {
    id: "routes/api/admin/user-access",
    parentId: "root",
    path: "api/admin/users/:userId/access",
    index: void 0,
    caseSensitive: void 0,
    module: route22
  },
  "api-auth": {
    id: "api-auth",
    parentId: "root",
    path: "api/auth/*",
    index: void 0,
    caseSensitive: void 0,
    module: route23
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
