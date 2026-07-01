# FriendlyAI

Modern, çoklu asistan destekli yapay zeka sohbet uygulaması.

## 🚀 Özellikler

- **Kullanıcı Kimlik Doğrulama**: BetterAuth ile güvenli giriş/kayıt
- **Çoklu Asistan**: Farklı AI asistanları oluşturun ve yönetin
- **Erişim Kontrolü**: Kullanıcılara asistan erişimi atayın
- **Sohbet Geçmişi**: Veritabanında kalıcı sohbet depolama
- **Streaming Yanıtlar**: OpenAI Responses API ile gerçek zamanlı yanıtlar
- **Vector Store**: Her asistan için ayrı bilgi bankası
- **Tema Desteği**: Light/Dark mode
- **Responsive**: Mobil uyumlu tasarım
- **Progress Bar**: Sayfa geçişlerinde yükleme animasyonu

## 📦 Teknolojiler

- **Frontend**: React Router 7, TypeScript, Tailwind CSS
- **Backend**: React Router (SSR), Prisma
- **Database**: PostgreSQL
- **AI**: OpenAI Responses API
- **Auth**: BetterAuth
- **UI**: shadcn/ui

## 🛠️ Kurulum

### 1. Bağımlılıkları Yükleyin

```bash
npm install
```

### 2. Çevre Değişkenlerini Ayarlayın

`.env` dosyası oluşturun:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/friendlyai"
OPENAI_API_KEY="sk-..."
APP_URL="http://localhost:5173"
BETTER_AUTH_SECRET="your-secret-key"
```

### 3. Veritabanını Hazırlayın

```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

### 4. Uygulamayı Başlatın

```bash
npm run dev
```

### 5. Admin Kullanıcı Oluşturun

Uygulama çalışırken başka bir terminalde:

```bash
npx tsx create-admin.ts
```

## 📱 Sayfalar

| Sayfa | URL | Açıklama |
|-------|-----|----------|
| Ana Sayfa | `/` | Landing page |
| Giriş | `/login` | Kullanıcı girişi |
| Kayıt | `/register` | Yeni kayıt |
| Sohbet | `/chat` | Ana sohbet arayüzü |
| Admin Giriş | `/admin/login` | Yönetici girişi |
| Dashboard | `/admin/dashboard` | Admin paneli |
| Asistanlar | `/admin/assistants` | Asistan yönetimi |
| Kullanıcılar | `/admin/users` | Kullanıcı yönetimi |

## 🔧 Admin Paneli

Admin olarak:
- Yeni AI asistanları oluşturun
- Asistan ayarlarını düzenleyin (sistem talimatı, model, renk)
- Kullanıcılara asistan erişimi verin
- Sohbet istatistiklerini görüntüleyin

## 📝 Lisans

MIT
