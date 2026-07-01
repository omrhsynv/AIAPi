export const isUiPreview = process.env.UI_PREVIEW === "1";

export const previewUser = {
  id: "preview-user",
  name: "Aris Demo",
  email: "demo@arisai.local",
  role: "admin",
};

export const previewAssistants = [
  {
    id: "aris-general",
    name: "Aris Genel Asistan",
    description: "Günlük işler, araştırma ve fikir üretimi için hızlı asistan.",
    systemInstruction:
      "Sen yardımcı bir AI asistanısın. Kullanıcıların sorularına açık ve anlaşılır cevaplar ver.",
    model: "gpt-4.1-mini",
    color: "#21c6cc",
    icon: "Bot",
    isPublic: true,
    isActive: true,
    createdAt: new Date("2026-06-09T10:00:00Z"),
    _count: { chats: 18, userAccess: 4, vectorStoreFiles: 2 },
  },
  {
    id: "aris-creative",
    name: "Kreatif Metin Asistanı",
    description: "Kampanya, sosyal medya ve marka metinleri için yaratıcı destek.",
    systemInstruction:
      "Yaratıcı, net ve marka tonuna uygun metinler üret.",
    model: "gpt-4.1",
    color: "#d84fd2",
    icon: "Sparkles",
    isPublic: false,
    isActive: true,
    createdAt: new Date("2026-06-08T10:00:00Z"),
    _count: { chats: 9, userAccess: 2, vectorStoreFiles: 1 },
  },
];

export const previewChats = [
  {
    id: "preview-chat",
    title: "ArisAI arayüz incelemesi",
    assistantId: "aris-general",
    updatedAt: new Date("2026-06-09T12:00:00Z"),
  },
  {
    id: "preview-chat-2",
    title: "Kampanya metni taslağı",
    assistantId: "aris-creative",
    updatedAt: new Date("2026-06-09T11:00:00Z"),
  },
];

export const previewMessages = [
  {
    id: "m1",
    role: "user",
    content: "Aris888 estetiğine uygun kısa bir tanıtım metni yaz.",
    createdAt: new Date("2026-06-09T12:00:00Z"),
  },
  {
    id: "m2",
    role: "assistant",
    content:
      "Elbette. ArisAI, neon metaverse atmosferini sade ve anlaşılır bir sohbet deneyimiyle birleştirir. Hızlı başlayın, doğru asistanı seçin ve fikirlerinizi tek ekranda ilerletin.",
    createdAt: new Date("2026-06-09T12:01:00Z"),
  },
];

export const previewUsers = [
  {
    id: "u1",
    name: "Deniz Kaya",
    email: "deniz@example.com",
    role: "user",
    createdAt: new Date("2026-06-01T10:00:00Z"),
    _count: { chats: 12, accessGrants: 2 },
  },
  {
    id: "u2",
    name: "Ece Yılmaz",
    email: "ece@example.com",
    role: "admin",
    createdAt: new Date("2026-05-28T10:00:00Z"),
    _count: { chats: 7, accessGrants: 0 },
  },
];
