# Free Professional QR Code Generator by zentopia Labs

Professzionális, egyoldalas QR kód generátor modern, trendy megjelenéssel és átfogó testreszabási lehetőségekkel.

## 🚀 Funkciók

### QR Kód Típusok
- 🌐 **URL/Web** - Weboldalak linkjei
- 📝 **Text** - Szabad szöveges tartalom
- 👤 **Contact** - vCard formátumú névjegy
- 📶 **WiFi** - WiFi hálózat adatok

### Testreszabás
- 🎨 **Színek** - Testreszabható modulok, háttér és sarok színek
- 🖼️ **Keret stílus** - Szögletes vagy lekerekített sarkok
- 📸 **Logo** - Logó feltöltés a QR kód közepére
- 🔧 **Logo méret** - Állítható logo méret (10-30%)
- 💬 **Caption** - Opcionális felirat a QR kód alatt

### Export
- ⬇️ **PNG Export** - Magas felbontású PNG letöltés (900x900px)
- ⬇️ **SVG Export** - Vektoros SVG formátum

### Egyéb
- 📊 **Google Analytics** - Integrált analitika (G-E3JP6WRKKX)
- 📱 **Reszponzív design** - Minden képernyőméreten tökéletesen működik
- 🎨 **Modern UI** - 2025-ös trendy megjelenés
- 🔒 **Adatvédelem** - Minden adat helyben marad, nem kerül szerverre

## 🎨 Design

Az alkalmazás a zentopia Labs (zentopia.io) színvilágát használja:
- Elsődleges szín: #6366f1 (Indigo)
- Másodlagos szín: #8b5cf6 (Lila)
- Kiemelő szín: #ec4899 (Pink)
- Sötét téma háttér modern gradiens átmenetekkel

## 🛠️ Technológia

- **HTML5** - Szemantikus struktúra
- **CSS3** - Modern stílusok, gradiens, animációk
- **Vanilla JavaScript** - Tiszta JS, minimális függőség
- **Canvas API** - QR kód rajzolás
- **qrcode-generator** - QR mátrix generálás

## 📦 Telepítés

Egyszerűen töltsd le a repo-t és nyisd meg az `index.html` fájlt böngészőben:

```bash
git clone <repo-url>
cd Zentopia-QR
# Nyisd meg böngészőben vagy indíts egy helyi szervert:
python3 -m http.server 8080
```

## 🌐 Deployment

Az alkalmazás statikus, így bármilyen webszerveren vagy CDN-en hostolható:
- GitHub Pages
- Netlify
- Vercel
- Vagy bármilyen hagyományos webhosting

A tervezett cím: `qrcode.zentopia.io`

## 📄 Struktúra

```
Zentopia-QR/
├── index.html      # Fő HTML fájl
├── app.js          # JavaScript logika
└── README.md       # Dokumentáció
```

## 🔧 Használat

1. **Válaszd ki a QR típust** - URL, Text, Contact vagy WiFi
2. **Töltsd ki az adatokat** - A kiválasztott típusnak megfelelően
3. **Szabd testre** - Színek, keret stílus, logo
4. **Generálás** - Automatikus vagy kattints a "Generate QR Code" gombra
5. **Letöltés** - PNG vagy SVG formátumban

## 🎯 Funkció részletek

### URL/Web QR
- Bármilyen érvényes URL beírható
- Automatikus validáció
- Példa: https://zentopia.io

### Text QR
- Tetszőleges szöveg tárolása
- Többsoros támogatás
- Maximális karakter: ~2000 (QR korrekciós szinttől függően)

### Contact QR (vCard)
- Név, email, telefon, szervezet
- vCard 3.0 formátum
- Kompatibilis minden modern eszközzel

### WiFi QR
- SSID és jelszó
- Biztonsági típus: WPA/WPA2, WEP, None
- Azonnali csatlakozás szkennelés után

### Logo funkció
- Támogatott formátumok: PNG, JPG, SVG
- Automatikus központosítás
- A QR kód magas hibajavító szintje biztosítja az olvashatóságot

## 🔐 Adatvédelem

Az alkalmazás nem gyűjt és nem tárol személyes adatokat:
- Minden QR kód generálás lokálisan történik a böngészőben
- Nincs szerver-oldali feldolgozás
- Feltöltött logók nem kerülnek szerverre
- Google Analytics csak névtelen használati statisztikákat gyűjt

## 📞 Kapcsolat

- **Email:** start@zentopia.hu
- **Website:** [zentopia.io](https://zentopia.io)
- **QR Generator:** qrcode.zentopia.io

## 📜 Licensz

© zentopia Labs 2025

---

Készítette ❤️ zentopia Labs | [zentopia.io](https://zentopia.io)
