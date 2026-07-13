# 2) API Anahtarları ve İzinler

Bir API anahtarı, çağıranı **kimlik olarak doğrular**. Hangi asistanı
çağıracağınızı ise her istekte URL'de (`:agent`) belirtirsiniz. Bir anahtar
**yalnızca izinli olduğu** asistanları çağırabilir; aksi halde `403` alırsınız.

İzinler veritabanında **ilişki (relation)** olarak tutulur — koda gömülü değildir.

## A) Yönetim panelinden (önerilen)

### Anahtar oluşturma

1. Yönetici olarak giriş yapın.
2. Sol menüden **API Anahtarları** sayfasına gidin (`/admin/api-keys`).
3. Sağ üstteki **Yeni Anahtar** butonuna tıklayın.
4. Açılan pencerede:
   - **Ad** (opsiyonel): anahtarı tanımak için bir etiket, örn. `mobil-uygulama`.
   - **İzinli Asistanlar:** bu anahtarın çağırabileceği asistanları işaretleyin.
     ("Tümünü seç" ile hepsini bir kerede işaretleyebilirsiniz.)
5. **Anahtar oluştur**'a basın.
6. Açılan kutuda **ham anahtar** (`sk_agent_...`) gösterilir. **Şimdi kopyalayın**
   — bu değer bir daha gösterilmez (veritabanında sadece hash'i saklanır).

### Mevcut anahtarları yönetme

Listedeki her anahtar için:

- **İzinler:** anahtarın erişebileceği asistanları düzenleyin (işaretleyip kaydedin).
- **İptal et / Etkinleştir:** anahtarı devre dışı bırakın veya geri açın.
  İptal edilen anahtarla yapılan çağrılar `403` döner.
- **Sil (çöp kutusu):** anahtarı kalıcı olarak siler. Silinen anahtarla çağrı `401` döner.

> Bu işlemlerin tamamı cache'i **anında** temizler; değişiklik hemen geçerli olur.

Listede ayrıca her anahtarın **ön eki** (`sk_agent_xxxx…`), **durumu** (Aktif/İptal),
**son kullanım** ve **oluşturulma** zamanı ile **izinli asistanları** görünür.

> Her satırdaki **Detay** butonu, o anahtarın kullanım grafiklerini (token/erişim
> ölçümü, IP dağılımı, son istekler) ve yönetim aksiyonlarını (pasifize et,
> izin düzenle, sil) içeren sayfaya götürür. Bkz.
> [Kullanım Analitiği](./05-kullanim-analitigi.md).

## B) Komut satırından (CLI)

```bash
# Belirli asistan(lar) için (id veya slug ile):
npx tsx scripts/create-agent-key.ts "prod-entegrasyon" ustun-zeka

# Birden fazla asistan:
npx tsx scripts/create-agent-key.ts "cok-asistanli" ustun-zeka genel-asistan

# Asistan verilmezse: TÜM mevcut asistanlara izinli anahtar (geliştirme kolaylığı):
npx tsx scripts/create-agent-key.ts "dev-anahtari"
```

Çıktı, ham anahtarı ve örnek bir `curl` komutunu bir kez yazdırır.

## Slug belirleme

Asistanı API'de `id` yerine okunaklı bir **slug** ile çağırmak isterseniz:

1. **Asistanlar → (asistan) → Asistan Ayarları** ekranına gidin.
2. **Slug (API için)** alanına bir değer yazın, örn. `ustun-zeka`.
   - Sadece küçük harf, rakam ve tire kullanılır; kaydederken otomatik normalize edilir.
   - Boş bırakılırsa API çağrılarında asistanın `id`'si kullanılır.
3. **Kaydet**'e basın. Aynı slug başka bir asistanda kullanılıyorsa `409` (çakışma) uyarısı alırsınız.

Bundan sonra asistanı `.../api/v1/agents/ustun-zeka` şeklinde çağırabilirsiniz.

## Güvenlik notları

- Ham anahtar yalnızca oluşturulurken görünür; kaybederseniz yenisini üretin.
- Anahtarı istemci tarafına (tarayıcı/JS bundle) gömmeyin; sunucu tarafında saklayın.
- Sızdığından şüphelenirseniz panelden **İptal et** veya **Sil**.
- Bir anahtarın kapsamını daraltmak için yalnızca gereken asistanlara izin verin.
