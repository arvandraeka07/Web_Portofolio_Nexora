# Portofolio Arvandra Eka Pratama

Website portofolio pribadi **Arvandra Eka Pratama** bertema *Minecraft / pixel art*, dibuat dengan HTML, CSS, dan JavaScript murni (tanpa framework).

## Fitur

- Hero dengan terrain bertekstur (rumput, tanah, bijih), pohon, obor menyala, babi, bunga, loading screen, dan creeper yang bisa diklik
- **Kubus profil 3D**: 4 sisi berisi foto + gambar hobi (bingkai lukisan), item yang mengorbit, bisa diseret / dipilih lewat slot hotbar, dan berputar sendiri saat didiamkan
- Section Hobi dengan 6 kartu bergambar pixel art (bingkai lukisan Minecraft)
- Section Tentang, Hobi, Portofolio, dan Kontak; footer bergaya lapisan bawah tanah
- Mode siang "Overworld pagi" / malam (tersimpan di browser); gambar hobi punya varian siang & malam yang berganti otomatis
- Kontrol kubus: putar otomatis, mode meledak (TNT), acak sisi, dan lightbox "inspect" untuk memperbesar gambar
- Efek suara 8-bit (default mati, tombol ♪ di navbar)
- Kartu hobi dengan rarity item (Common / Rare / Epic / Legendary)
- HUD Minecraft (hati, lapar, XP, hotbar), popup *Advancement*, dan layar debug **F3**
- Navigasi responsif dengan menu mobile
- SEO dasar: Open Graph, Twitter Card, dan JSON-LD

## Struktur

```
.
├── index.html
├── style.css
├── script.js
├── favicon.svg
├── image/       # foto & gambar konten (WebP/JPEG); pixel art hobi + varian *-day.webp untuk mode siang
├── textures/    # tekstur block SVG (grass, dirt, bedrock, ore, dll.)
├── sprites/     # sprite pixel SVG (pohon, obor, babi, bunga)
└── .github/workflows/static.yml   # deploy ke GitHub Pages
```

## Menjalankan lokal

Buka `index.html` di browser, atau `npx serve .`

## Deploy

Setiap push ke `main` otomatis di-deploy ke GitHub Pages.

## Kontak

[GitHub](https://github.com/arvandraeka07/) · [Instagram](https://www.instagram.com/andraaeka_/) · [LinkedIn](https://www.linkedin.com/in/arvandra-eka-pratama-8868b9420/) · arvandraeka05@gmail.com
