# Web Latihan Nexora

Website portofolio pribadi bertema *Minecraft / pixel art* yang dibuat dengan HTML, CSS, dan JavaScript murni (tanpa framework).

## Fitur

- Hero dengan parallax dan animasi block Minecraft
- Section Tentang, Hobi, Portofolio, dan Kontak
- Navigasi responsif dengan menu mobile
- Tema pixel-art/texture block (SVG) yang ringan
- Dideploy otomatis ke GitHub Pages lewat GitHub Actions

## Struktur Folder

```
.
├── index.html          # struktur halaman
├── style.css           # seluruh styling
├── script.js           # interaksi & animasi
├── image/              # foto profil & gambar konten
├── textures/           # tekstur SVG (block Minecraft)
├── unnamed.png         # ilustrasi section
└── .github/workflows/  # deploy otomatis ke GitHub Pages
```

## Menjalankan Secara Lokal

Cukup buka `index.html` di browser, atau jalankan server statis:

```bash
npx serve .
```

## Deploy

Setiap push ke branch `main` otomatis men-deploy situs ke GitHub Pages
(workflow `.github/workflows/static.yml`).
