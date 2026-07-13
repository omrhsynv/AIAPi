# 5) Kullanım Analitiği (Token & Erişim Ölçümü)

Her API çağrısı **ölçülür** ve anahtar bazında raporlanır: kaç kez çağrıldı,
kaç token harcandı, hangi IP'den bağlanıldı, hangi asistan çağrıldı ve ne
sonuç (durum kodu) döndü.

## Neler ölçülür?

Geçerli (aktif) bir anahtarla yapılan **her istek** için bir kayıt tutulur:

| Alan | Açıklama |
|------|----------|
| `status` | Dönen HTTP durumu (200/400/403/404/500). |
| `ip` | Kaynak IP (`X-Forwarded-For` / `X-Real-IP` başlığından). |
| `assistantId` | Çağrılan asistan (varsa). |
| `inputTokens` / `outputTokens` / `totalTokens` | OpenAI'nin bildirdiği token kullanımı (yalnızca başarılı `200` çağrılarda). |
| `createdAt` | İstek zamanı. |

> **Not:** Token sayıları OpenAI'nin akış tamamlandığında bildirdiği gerçek
> değerlerdir. `OPENAI_API_KEY` yoksa (mock modu), yaklaşık bir tahmin
> (~4 karakter/token) kaydedilir. Geçersiz/iptal edilmiş anahtarlarla yapılan
> reddedilen denemeler ölçülmez (kayıt bir anahtara bağlanamadığı için).

## Veri modeli

`prisma/schema.prisma` içindeki `ApiKeyUsage` modeli (istek başına bir satır):

```prisma
model ApiKeyUsage {
  id           String   @id @default(cuid())
  apiKeyId     String
  apiKey       ApiKey   @relation(fields: [apiKeyId], references: [id], onDelete: Cascade)
  assistantId  String?
  ip           String?
  status       Int
  inputTokens  Int      @default(0)
  outputTokens Int      @default(0)
  totalTokens  Int      @default(0)
  createdAt    DateTime @default(now())

  @@index([apiKeyId, createdAt])
}
```

Kayıt yazımı **bloklamaz** (fire-and-forget): yanıtın gecikmesine etki etmez.
Ölçüm, endpoint'in hız hedefini bozmamak için yanıt akışı bittikten sonra
(başarılı çağrılarda) veya hata dönüşünden hemen önce yapılır.

## Grafikleri görüntüleme

1. **Admin → API Anahtarları** sayfasına gidin (`/admin/api-keys`).
2. İlgili anahtarın satırında **Detay** butonuna tıklayın
   (`/admin/api-keys/<keyId>`).

Detay sayfasında şunları görürsünüz:

- **Özet kutuları:** Toplam Çağrı, Toplam Token, Benzersiz IP (son 14 gün).
- **Son 14 Gün — Çağrı Sayısı:** günlük istek adedi (dikey çubuk grafik).
- **Son 14 Gün — Token Kullanımı:** günlük toplam token (dikey çubuk grafik).
- **Asistana Göre Çağrı:** hangi asistanın ne kadar çağrıldığı (yatay çubuklar).
- **IP'ye Göre Çağrı:** nereden bağlanıldığı — en sık 8 IP (yatay çubuklar).
- **Son İstekler:** en son 20 çağrı (zaman, IP, asistan, durum kodu, token).

## Anahtar yönetimi (detay sayfasından)

Aynı sayfadan anahtarı yönetebilirsiniz:

- **Pasifize et / Etkinleştir:** anahtarı devre dışı bırakır veya geri açar.
  Pasif anahtarla yapılan çağrılar `403` döner. Değişiklik **anında** geçerli olur.
- **İzinleri düzenle:** anahtarın erişebileceği asistanları güncelleyin.
- **Sil:** anahtarı ve ona ait tüm kullanım kayıtlarını (cascade) kalıcı olarak siler.

## Gizlilik / saklama notu

- IP adresleri analitik ve güvenlik amacıyla saklanır. Kurumsal gizlilik
  gereksinimlerinize göre bu alanı anonimleştirebilir veya kayıtları periyodik
  olarak temizleyebilirsiniz (örn. 90 günden eski `ApiKeyUsage` satırlarını silen
  bir görev).
- Bir anahtar silindiğinde, ilişkili tüm kullanım kayıtları da silinir.
