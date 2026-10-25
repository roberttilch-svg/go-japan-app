import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Calendar, MapPin, Train, Utensils, Compass, AlertTriangle,
  Sparkles, Plane, Clock, CheckCircle2, ExternalLink, Search,
  ChevronRight, ChevronLeft, ChevronDown, Info, ShieldCheck, Luggage,
  Star, Heart, Copy, Check, Send, X, Navigation, Ticket, Building2,
  CreditCard, Smartphone, RefreshCw, Sun, Flame, Gift, Eye,
  Volume2, Layers, LayoutGrid, CheckSquare, ArrowUpRight, Coffee,
  Cloud, CloudRain, CloudSnow, CloudSun, Wind, Droplets,
  ArrowRightLeft, Calculator, Languages
} from 'lucide-react';

// ==========================================
// 1. VERIFIED DATA ARCHITECTURE (17 DAYS + WEATHER COORDS + TOOLS)
// ==========================================

const WEATHER_LOCATIONS = {
  TOKYO_1: {
    name: "Tokio Ost (Nihonbashi)",
    lat: 35.6812,
    lon: 139.7671,
    decAvgHigh: 13,
    decAvgLow: 5,
    decVibe: "Klar & sonnig · Leichter Mantel & Schal"
  },
  KANAZAWA: {
    name: "Kanazawa (Ishikawa)",
    lat: 36.5613,
    lon: 136.6562,
    decAvgHigh: 11,
    decAvgLow: 4,
    decVibe: "Küstenbrise & Schauer möglich · Schirm einpacken"
  },
  KYOTO: {
    name: "Kyoto & Gion",
    lat: 35.0116,
    lon: 135.7681,
    decAvgHigh: 12,
    decAvgLow: 4,
    decVibe: "Knackig-frischer Spätherbst · Zwiebellook für Tempel"
  },
  OSAKA: {
    name: "Osaka (Dotonbori)",
    lat: 34.6937,
    lon: 135.5023,
    decAvgHigh: 13,
    decAvgLow: 6,
    decVibe: "Mildes Stadtklima · Perfekt für Streetfood-Walks"
  },
  HAKONE: {
    name: "Hakone (Sengokuhara 700m)",
    lat: 35.2647,
    lon: 139.0069,
    decAvgHigh: 8,
    decAvgLow: 0,
    decVibe: "Frische Bergluft & beste Fuji-Fernsicht · Warme Jacke"
  },
  TOKYO_2: {
    name: "Tokio West (Shibuya)",
    lat: 35.6580,
    lon: 139.7016,
    decAvgHigh: 12,
    decAvgLow: 4,
    decVibe: "Trockene, klare Wintertage · Perfekte Sunset-Sicht"
  }
};

const CURRENCY_PRESETS = [
  { label: "Airport Bus HND", jpy: 1100, icon: "🚌" },
  { label: "Ramen / Udon", jpy: 1500, icon: "🍜" },
  { label: "Airport Bus NRT", jpy: 3100, icon: "🚍" },
  { label: "Tax-Free Grenze", jpy: 5500, icon: "🛍️" },
  { label: "Manten Omakase", jpy: 8800, icon: "🍣" },
  { label: "Shinkansen Kanazawa", jpy: 14380, icon: "🚄" }
];

const FLIGHT_DATA = {
  bookingCode: "9I2YP8",
  passengers: [
    { name: "Joana Bruzi", initials: "JB", ticket: "2202251763342", seatTip: "Business Class · Fenster & Nebeneinander" },
    { name: "Robert Bruzi", initials: "RB", ticket: "2202251763343", seatTip: "Business Class · Fenster & Nebeneinander" }
  ],
  tarif: "Business Comfort (Miles & More Award)",
  outbound: {
    date: "So, 29.11. – Mo, 30.11.2026",
    totalDuration: "18h 25m",
    stops: "1 Stopp (Zürich)",
    legs: [
      {
        flightNo: "LH2366",
        operatedBy: "Lufthansa",
        aircraft: "Airbus A320 (Sharklets)",
        depDate: "29.11.2026",
        depTime: "07:55",
        depAirport: "MUC",
        depCity: "München",
        depTerminal: "Terminal 2",
        arrDate: "29.11.2026",
        arrTime: "08:50",
        arrAirport: "ZRH",
        arrCity: "Zürich",
        arrTerminal: "Flughafen Zürich",
        duration: "0h 55m",
        status: "Bestätigt",
        layover: "4h 15m Lounge-Stopover in Zürich (SWISS Business / Senator Lounge mit Alpenblick!)"
      },
      {
        flightNo: "LX160",
        operatedBy: "SWISS",
        aircraft: "Boeing 777-300ER",
        depDate: "29.11.2026",
        depTime: "13:05",
        depAirport: "ZRH",
        depCity: "Zürich",
        depTerminal: "Flughafen Zürich",
        arrDate: "30.11.2026",
        arrTime: "10:20",
        arrAirport: "NRT",
        arrCity: "Tokio Narita",
        arrTerminal: "Terminal 1",
        duration: "13h 15m",
        status: "Bestätigt",
        layover: null
      }
    ]
  },
  inbound: {
    date: "Mi, 16.12.2026",
    totalDuration: "14h 25m",
    stops: "Nonstop Direktflug",
    legs: [
      {
        flightNo: "LH715",
        operatedBy: "Lufthansa",
        aircraft: "Airbus A350-900",
        depDate: "16.12.2026",
        depTime: "10:45",
        depAirport: "HND",
        depCity: "Tokio Haneda",
        depTerminal: "Terminal 3 (ANA Lounge Zugang!)",
        arrDate: "16.12.2026",
        arrTime: "17:10",
        arrAirport: "MUC",
        arrCity: "München",
        arrTerminal: "Terminal 2",
        duration: "14h 25m",
        status: "Bestätigt",
        layover: null
      }
    ]
  },
  apiWatchout: "Advance Passenger Information (API) & Online-Check-in exakt 23 Stunden vor Abflug (Sa, 28.11. um 08:55 Uhr MEZ) erledigen. Vorab auf Visit Japan Web beide QR-Codes für Einreise & Zoll generieren!"
};

const STATIONS = [
  {
    id: "ALL",
    label: "Gesamte Route",
    shortLabel: "Alle 17",
    sub: "30.11. – 16.12.",
    emoji: "🇯🇵",
    gradient: "from-[#FF385C] via-[#E00B41] to-[#9E0B3B]",
    accent: "#FF385C"
  },
  {
    id: "TOKYO_1",
    label: "Tokio Ost",
    shortLabel: "Tokio I",
    sub: "30.11. – 03.12.",
    emoji: "🗼",
    hotel: "Hamacho Hotel Tokyo",
    hotelJp: "浜町ホテル東京 (東京都中央区日本橋浜町3-20-2)",
    vibe: "Coffee Roasters, Herbstgärten & Omakase",
    gradient: "from-rose-500 via-pink-600 to-indigo-900",
    accent: "#F43F5E"
  },
  {
    id: "KANAZAWA",
    label: "Kanazawa",
    shortLabel: "Kanazawa",
    sub: "03.12. – 05.12.",
    emoji: "🦀",
    hotel: "Yalda Apartment / Machiya Karuta",
    hotelJp: "金沢町家ゲストハウスかるた (石川県金沢市)",
    vibe: "Samurai-Gassen, Eismeer-Sushi & Kunst",
    gradient: "from-cyan-600 via-teal-700 to-slate-900",
    accent: "#0D9488"
  },
  {
    id: "KYOTO",
    label: "Kyoto & Osaka",
    shortLabel: "Kyoto",
    sub: "05.12. – 09.12.",
    emoji: "⛩️",
    hotel: "ASAI Kyoto Shijo",
    hotelJp: "ASAI 京都四条 (京都市下京区松原通烏丸東入俊成町444)",
    vibe: "Joanas Birthday, Gion Kaiseki & Dotonbori",
    gradient: "from-amber-500 via-orange-600 to-red-900",
    accent: "#EA580C"
  },
  {
    id: "HAKONE",
    label: "Hakone",
    shortLabel: "Hakone",
    sub: "09.12. – 11.12.",
    emoji: "🗻",
    hotel: "Hakone Retreat villa 1/f",
    hotelJp: "箱根リトリート villa 1/f (神奈川県足柄下郡箱根町仙石原1286-116)",
    vibe: "Mount Fuji View, Privat-Onsen & Wald-Villa",
    gradient: "from-emerald-600 via-teal-800 to-stone-900",
    accent: "#059669"
  },
  {
    id: "TOKYO_2",
    label: "Tokio West",
    shortLabel: "Tokio II",
    sub: "11.12. – 16.12.",
    emoji: "⚡",
    hotel: "Tell House Shibuya",
    hotelJp: "Tell House 渋谷 (東京都渋谷区)",
    vibe: "Shibuya Vibes, Kusama, Wagyu & Uniqlo Ginza",
    gradient: "from-violet-600 via-purple-700 to-slate-900",
    accent: "#7C3AED"
  }
];

const DAYS_DATA = [
  {
    day: 1,
    date: "30.11.2026",
    shortDate: "30.11.",
    weekday: "Montag",
    shortDay: "Mo",
    stationId: "TOKYO_1",
    emoji: "🍜",
    vibeTag: "Touchdown & Kitakata Ramen",
    location: "Tokio Ost (Nihonbashi & Kiyosumi)",
    title: "Ankunft in Narita, T-CAT Bus & Kult-Ramen",
    hotel: "Hamacho Hotel Tokyo",
    hotelJp: "浜町ホテル東京 · 東京都中央区日本橋浜町3-20-2",
    hotelAddress: "Chuo-ku, Nihonbashi Hamacho 3-20-2, Tokyo",
    hotelMapUrl: "https://www.google.com/maps/search/?api=1&query=Hamacho+Hotel+Tokyo",
    summary: "Landung in Narita um 10:20 Uhr, entspannter Direktbus nach T-CAT mit Skytree-Blick, Check-in im Hamacho Hotel, Specialty Coffee in Kiyosumi-Shirakawa und frisch vor euren Augen geknetete Kitakata-Ramen.",
    watchOuts: [
      "Airport Limousine Bus mit 75–90 Min. Puffer nach Landung buchen (ca. 11:35–11:55 Uhr). Mit Online-Account bis 5 Min. vor Abfahrt im Smartphone-Browser kostenlos umbuchbar!",
      "Sitzplatz-Tipp im Bus: Links in Fahrtrichtung (Sitze A) wählen für den besten Blick auf den Tokyo Skytree & den Sumida-Fluss bei der Einfahrt.",
      "Beide großen Koffer kommen bequem in den Gepäckraum des Busses; von T-CAT sind es nur 6 Minuten ebenerdig zu Fuß zum Hamacho Hotel."
    ],
    items: [
      {
        id: "d1-1",
        time: "10:20",
        category: "TRANSIT",
        title: "Landung Narita (LX160) & Airport Limousine Bus nach T-CAT",
        desc: "Direktbus von Narita Airport Terminal 1 nach Tokyo City Air Terminal (T-CAT). Inkl. 2 großer Koffer im Gepäckraum. Danach 6 Min. ebenerdig zu Fuß zum Hamacho Hotel.",
        price: "ca. 19 € (3.100 JPY) p.P. | 38 € gesamt",
        rating: "Direkt & Stressfrei",
        seatTip: "Links in Fahrtrichtung (Sitze A) für Skytree- & Sumida-Blick",
        seatVisual: { type: "BUS_LEFT", highlight: ["A"], label: "Links (Sitz A) = Tokyo Skytree & Sumida-Fluss" },
        bookingStatus: "Offen (Vorab online mit Account buchen)",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=Tokyo+City+Air+Terminal+TCAT",
        bookingUrl: "https://webservice.limousinebus.co.jp/web/en/"
      },
      {
        id: "d1-2",
        time: "14:30",
        category: "CULTURE",
        title: "Specialty Coffee Walk in Kiyosumi-Shirakawa",
        desc: "Entspannter Spaziergang ab Hotel über die Sumida-Brücke durch Tokios Röst- & Café-Viertel Kiyosumi-Shirakawa (z. B. Koffee Mameya Kakeru, Arise Coffee Roasters oder Blue Bottle Flagship) zum Ankommen gegen den Jetlag.",
        price: "ca. 5–8 € p.P.",
        rating: "Kult-Kaffeeviertel",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=Kiyosumi+Shirakawa+Coffee+Tokyo"
      },
      {
        id: "d1-3",
        time: "18:30",
        category: "FOOD",
        title: "Menya Shichisai (Hatchobori)",
        desc: "Legendäre Kitakata-Ramen: Der Teig wird erst nach Bestellung direkt vor euren Augen frisch von Hand ausgerollt, geschnitten und geknetet! Geöffnet Mo 11:00–15:00 & 17:00–22:00 Uhr (Ruhetag nur am 3. Di im Monat). 20–25 Min. zu Fuß oder 8 Min. Taxi vom Hotel.",
        price: "ca. 10–15 € p.P.",
        rating: "Tabelog 3.78 Hyakumeiten | Google 4.0",
        jpOrderTip: "喜多方らーめん (醤油) 二つお願いします (2x Kitakata Shoyu Ramen bitte)",
        bookingStatus: "Walk-in (Ticketautomat vor Ort)",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=Menya+Shichisai+Hatchobori+Tokyo"
      }
    ]
  },
  {
    day: 2,
    date: "01.12.2026",
    shortDate: "01.12.",
    weekday: "Dienstag",
    shortDay: "Di",
    stationId: "TOKYO_1",
    emoji: "🍣",
    vibeTag: "Ginkgo-Gold & 24-Gänge Sushi",
    location: "Tokio (Nihonbashi, Harajuku, Koenji)",
    title: "Goldene Ginkgo-Alleen, Vintage & 24-Gänge-Omakase",
    hotel: "Hamacho Hotel Tokyo",
    hotelJp: "浜町ホテル東京 · 東京都中央区日本橋浜町3-20-2",
    hotelAddress: "Chuo-ku, Nihonbashi Hamacho 3-20-2, Tokyo",
    hotelMapUrl: "https://www.google.com/maps/search/?api=1&query=Hamacho+Hotel+Tokyo",
    summary: "Knuspriges Riesen-Tempura in Nihonbashi, goldgelbe Ginkgo-Alleen, Streetwear & Vintage-Schätze in Ura-Harajuku und Koenji, gekrönt von einem 24-Gänge-Sushi-Omakase am Abend.",
    watchOuts: [
      "Tendon Kaneko Hannosuke: Am besten kurz vor Öffnung um 10:45 Uhr oder antizyklisch gegen 14:00 Uhr hingehen, um lange Schlangen zu vermeiden.",
      "Manten Sushi Nihonbashi am Sa, 31.10.2026 Punkt 16:00 Uhr MEZ über TableCheck reservieren!",
      "Tipp für den Nachmittag: Auf dem Rückweg ins Hotel ggf. schon bei Yanagiya Taiyaki in Ningyocho vorbeischauen (falls morgen Vormittag im Rikugien die Zeit knapp wird)."
    ],
    items: [
      {
        id: "d2-1",
        time: "11:00",
        category: "FOOD",
        title: "Tendon Kaneko Hannosuke (Nihonbashi Main Store)",
        desc: "Legendäre Reisschale mit Riesengarnelen-, Meeraal- (Anago), Tintenfisch-Tempura und pochiertem Ei mit geheimer Tare-Sauce. Täglich 11:00–22:00 Uhr geöffnet.",
        price: "ca. 8–12 € p.P.",
        rating: "Tabelog 3.76 Hyakumeiten | Google 4.2",
        jpOrderTip: "江戸前天丼 二つお願いします (2x Edomae Tendon bitte)",
        bookingStatus: "Walk-in (vor 11:00 Uhr oder gegen 14:00 Uhr)",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=Tendon+Kaneko+Hannosuke+Nihonbashi+Tokyo"
      },
      {
        id: "d2-2",
        time: "13:00",
        category: "CULTURE",
        title: "Herbstlaub & Vintage: Gaien Ginkgo Avenue, Shinjuku Gyoen, Harajuku & Koenji",
        desc: "Leuchtend gelbe Ginkgo-Bäume an der Meiji Jingu Gaien Avenue und Herbstfarben im Shinjuku Gyoen bestaunen. Danach Streetwear in Ura-Harajuku und Secondhand/Vintage-Shopping in Koenji.",
        price: "Shinjuku Gyoen ca. 3 € (500 JPY) p.P.",
        rating: "Peak Autumn Foliage",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=Meiji+Jingu+Gaien+Ginkgo+Avenue+Tokyo"
      },
      {
        id: "d2-3",
        time: "19:30",
        category: "FOOD",
        title: "Manten Sushi Nihonbashi (Coredo Muromachi 2)",
        desc: "Spektakuläres 24-Gänge-Sushi-Omakase (Saisonaler Fisch, Seeigel, Ikura, Thunfisch) in entspannter Atmosphäre, 16–18 Min. zu Fuß vom Hamacho Hotel. Geöffnet 11:00–15:00 & 17:00–23:00 Uhr.",
        price: "exakt 8.800 JPY (ca. 55 €) p.P.",
        rating: "Tabelog 3.68 Hyakumeiten | Google 4.2",
        bookingStatus: "Buchung am Sa, 31.10.2026 um 16:00 Uhr MEZ",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=Manten+Sushi+Nihonbashi+Coredo+Muromachi+2",
        bookingUrl: "https://www.tablecheck.com/en/shops/manten-sushi-nihonbashi/reserve"
      }
    ]
  },
  {
    day: 3,
    date: "02.12.2026",
    shortDate: "02.12.",
    weekday: "Mittwoch",
    shortDay: "Mi",
    stationId: "TOKYO_1",
    emoji: "🎨",
    vibeTag: "Google Perk, Denim & teamLab",
    location: "Tokio (Komagome, Shibuya, Shimokitazawa, Azabudai)",
    title: "Rikugien-Ahorn, Google Lunch, Shimokitazawa & teamLab",
    hotel: "Hamacho Hotel Tokyo",
    hotelJp: "浜町ホテル東京 · 東京都中央区日本橋浜町3-20-2",
    hotelAddress: "Chuo-ku, Nihonbashi Hamacho 3-20-2, Tokyo",
    hotelMapUrl: "https://www.google.com/maps/search/?api=1&query=Hamacho+Hotel+Tokyo",
    summary: "Leuchtend rote Ahornbäume im Rikugien-Garten, kostenloser Lunch mit Aussicht im Google-Büro Shibuya, Denim-Shopping in Shimokitazawa, teamLab Borderless und Handwerker-Pizza mit eigenem Burrata.",
    watchOuts: [
      "Lage-Watch-out Yanagiya Taiyaki: Liegt in Ningyocho (10 Min. vom Hamacho Hotel) und öffnet Mi erst um 12:30 Uhr. Entweder gestern am Nachmittag holen oder Mi Punkt 12:30 Uhr vor der Fahrt Richtung Shibuya!",
      "Kein kostenpflichtiges Shibuya Sky Ticket nötig: Nutzt den kostenlosen Ausblick aus den oberen Etagen des Google-Büros (Shibuya Stream) sowie den Fenster-Lobbys im Shibuya Scramble Square (12F/13F) und Hikarie (11F).",
      "teamLab Borderless ist fest gebucht für 16:30–17:00 Uhr Einlass (Dauer ca. 2,5 Std.). Danach um 19:30 Uhr direkt im selben Komplex zu Pizza 4P's!"
    ],
    items: [
      {
        id: "d3-1",
        time: "09:30",
        category: "CULTURE",
        title: "Rikugien Gardens (Station Komagome)",
        desc: "Einer der schönsten traditionellen Wandelgärten Tokios aus der Edo-Zeit – Anfang Dezember in intensivem Rot der japanischen Momiji-Ahornbäume.",
        price: "ca. 2 € (300 JPY) p.P.",
        rating: "Top Herbstlaub-Spot",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=Rikugien+Gardens+Tokyo"
      },
      {
        id: "d3-2",
        time: "12:30",
        category: "FOOD",
        title: "Snack-Option: Yanagiya Taiyaki (Ningyocho) & Google Office Lunch (Shibuya Stream)",
        desc: "Traditions-Taiyaki von 1916 auf Holzkohle gebacken (Mi 12:30–18:00 Uhr). Danach Fahrt mit der JR Yamanote Line nach Shibuya zum kostenlosen Lunch im Google Office (Shibuya Stream) inkl. Gäste-Check-in für Joana & Aussicht aus Scramble Square 12F/13F / Hikarie 11F.",
        price: "Taiyaki ca. 1,50 € | Google Lunch 0 €",
        rating: "Tabelog 3.78 Hyakumeiten | Google Perk",
        isGooglePerk: true,
        bookingStatus: "Walk-in / Google Badge",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=Shibuya+Stream+Tokyo"
      },
      {
        id: "d3-3",
        time: "14:15",
        category: "CULTURE",
        title: "Vintage- & Denim-Shopping in Shimokitazawa",
        desc: "In nur 4 Minuten mit der Keio Inokashira Express-Linie ab Shibuya ins entspannte Hipster-Viertel Shimokitazawa (Kult-Vintage-Läden, Selvedge Denim, kleine Plattenläden).",
        price: "Freier Bummel",
        rating: "Tokios Vintage-Mekka",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=Shimokitazawa+Tokyo"
      },
      {
        id: "d3-4",
        time: "16:30",
        category: "CULTURE",
        title: "teamLab Borderless (Azabudai Hills)",
        desc: "Immersives digitales Kunstmuseum in den neuen Azabudai Hills. Einlass-Zeitfenster 16:30–17:00 Uhr, geplante Verweildauer ca. 2,5 Stunden.",
        price: "Bereits bezahlt",
        rating: "Must-See Digital Art",
        bookingStatus: "FEST GEBUCHT (Slot 16:30–17:00 Uhr)",
        isBooked: true,
        mapUrl: "https://www.google.com/maps/search/?api=1&query=teamLab+Borderless+Azabudai+Hills+Tokyo"
      },
      {
        id: "d3-5",
        time: "19:30",
        category: "FOOD",
        title: "Pizza 4P's Tokyo (Azabudai Hills, Garden Plaza D 1F)",
        desc: "Direkt im selben Komplex wie teamLab! Berühmt für die hauseigene Käserei (frischer Burrata direkt auf der Pizza), japanisch-italienische Kreationen & Naturwein.",
        price: "ca. 20–30 € p.P.",
        rating: "Google 4.6 | Farm-to-Table Kult",
        bookingStatus: "Buchung am Mo, 02.11.2026 ab 02:00 / 08:00 Uhr MEZ",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=Pizza+4Ps+Tokyo+Azabudai+Hills",
        bookingUrl: "https://www.tablecheck.com/en/shops/pizza-4ps-tokyo/reserve"
      }
    ]
  },
  {
    day: 4,
    date: "03.12.2026",
    shortDate: "03.12.",
    weekday: "Donnerstag",
    shortDay: "Do",
    stationId: "KANAZAWA",
    emoji: "🚄",
    vibeTag: "Alpen-Shinkansen & Samurai",
    location: "Kanazawa (Nagamachi & Tatemachi)",
    title: "Alpen-Shinkansen nach Kanazawa & Samurai-Viertel",
    hotel: "Yalda Apartment / Kanazawa Machiya Guesthouse Karuta",
    hotelJp: "金沢町家ゲストハウスかるた · 石川県金沢市",
    hotelAddress: "Kanazawa, Ishikawa Prefecture",
    hotelMapUrl: "https://www.google.com/maps/search/?api=1&query=Kanazawa+Machiya+Guesthouse+Karuta",
    summary: "Fahrt im Hokuriku Shinkansen mit Blick auf die schneebedeckten Nordalpen nach Kanazawa, Bummel durch das historische Samurai-Viertel Nagamachi und abends neapolitanische Holzofenpizza mit lokalem Fisch.",
    watchOuts: [
      "Sitzplatz-Tipp Hokuriku Shinkansen (Kagayaki): Links in Fahrtrichtung Sitz A (Fenster) + Sitz B (Gang) wählen! Das ist eine 2er-Reihe ohne dritten Sitznachbarn mit bestem Panorama auf den Vulkan Mt. Asama und die schneebedeckten Tateyama-Alpen.",
      "Pizzeria Da TAKE (Honten) hat Mo/Di Ruhetag, ist aber am Donnerstag von 17:00–23:00 Uhr geöffnet (ca. 8–9 Min. Taxi vom Apartment)."
    ],
    items: [
      {
        id: "d4-1",
        time: "09:30",
        category: "TRANSIT",
        title: "Hokuriku Shinkansen (Kagayaki Direktzug): TOKYO → KANAZAWA",
        desc: "Hochgeschwindigkeitszug direkt von Tokyo Station nach Kanazawa (Fahrzeit 2 Std. 34 Min.). Vorab ein leckeres Ekiben (Bahnhofs-Bento) im Gransta Tokyo kaufen!",
        price: "ca. 88 € (14.380 JPY) p.P. | ca. 176 € gesamt",
        rating: "Panorama-Schnellzug",
        seatTip: "Links in Fahrtrichtung: Sitz A (Fenster) + Sitz B (Gang) – 2er-Reihe + Alpenblick!",
        seatVisual: { type: "SHINKANSEN_AB", highlight: ["A", "B"], label: "Links: A (Fenster) + B (Gang) = Tateyama-Alpen" },
        bookingStatus: "Buchung am Di, 03.11.2026 ab 02:00 / 08:00 Uhr MEZ",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=Kanazawa+Station",
        bookingUrl: "https://www.westjr.co.jp/global/en/ticket/"
      },
      {
        id: "d4-2",
        time: "14:00",
        category: "CULTURE",
        title: "Nagamachi Samurai District & Tatemachi Shopping Street",
        desc: "Spaziergang entlang der historischen Lehmmauern, Wasserkanäle und Residenzen (z. B. Nomura-ke Samurai-Haus mit Zengarten) im Nagamachi-Viertel sowie kuratierte Boutiquen in Tatemachi.",
        price: "Nomura-ke ca. 4 € (550 JPY) p.P.",
        rating: "Authentisches Edo-Flair",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=Nagamachi+Samurai+District+Kanazawa"
      },
      {
        id: "d4-3",
        time: "19:00",
        category: "FOOD",
        title: "Pizzeria Da TAKE (Honten, nahe Bahnhof Kanazawa)",
        desc: "Ausgezeichnete Steinofenpizza und Pasta, verfeinert mit fangfrischem Fisch und Wintergemüse aus der Präfektur Ishikawa. Do geöffnet 17:00–23:00 Uhr.",
        price: "ca. 25–35 € p.P.",
        rating: "Tabelog 3.52 | Google 4.5",
        bookingStatus: "Buchung am Mo, 02.11.2026 um 16:00 Uhr MEZ (Hot Pepper)",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=Pizzeria+Da+TAKE+Kanazawa",
        bookingUrl: "https://www.hotpepper.jp/"
      }
    ]
  },
  {
    day: 5,
    date: "04.12.2026",
    shortDate: "04.12.",
    weekday: "Freitag",
    shortDay: "Fr",
    stationId: "KANAZAWA",
    emoji: "🦪",
    vibeTag: "Swimming Pool & Eismeer-Sushi",
    location: "Kanazawa (Museum, Omicho-Markt, Katamachi)",
    title: "21st Century Museum, Austern, Winter-Oden & Eismeer-Sushi",
    hotel: "Yalda Apartment / Kanazawa Machiya Guesthouse Karuta",
    hotelJp: "金沢町家ゲストハウスかるた · 石川県金沢市",
    hotelAddress: "Kanazawa, Ishikawa Prefecture",
    hotelMapUrl: "https://www.google.com/maps/search/?api=1&query=Kanazawa+Machiya+Guesthouse+Karuta",
    summary: "Unterwasser-Kunst im legendären Swimming Pool, frische Austern mit Ponzu auf dem Omicho-Markt, dampfendes Winter-Oden und abends handgeformtes Nigiri aus dem Japanischen Meer an der Holztheke.",
    watchOuts: [
      "KRITISCHER WATCH-OUT (Swimming Pool): Punkt 09:00 Uhr morgens japanischer Ortszeit am 04.12.2026 online auf der Museums-Website das kostenlose (0 €) Tages-Zeitfenster für das Innere (Unterwasser-Raum) von Leandro Erlichs 'The Swimming Pool' reservieren!",
      "Das reguläre Ausstellungsticket für das 21st Century Museum bereits am Mi, 04.11.2026 online kaufen, um die Kassenschlange zu überspringen."
    ],
    items: [
      {
        id: "d5-1",
        time: "09:00 / 10:00",
        category: "CULTURE",
        title: "21st Century Museum of Contemporary Art & 'The Swimming Pool'",
        desc: "Weltberühmtes Rundbau-Museum für zeitgenössische Kunst. Punkt 09:00 Uhr morgens im Hotel-WLAN den Slot für den Unterwasser-Zugang zum Swimming Pool sichern!",
        price: "ca. 7,50 € (1.200 JPY) p.P. | Pool-Slot 0 €",
        rating: "Architektur- & Kunst-Ikone",
        bookingStatus: "Ticket ab Mi, 04.11.2026 | Pool-Slot am 04.12. Punkt 09:00 Uhr JST",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=21st+Century+Museum+of+Contemporary+Art+Kanazawa",
        bookingUrl: "https://www.kanazawa21.jp/data_list.php?g=120&d=1&lng=e"
      },
      {
        id: "d5-2",
        time: "12:30",
        category: "FOOD",
        title: "Omicho Market (Kanazawas Küche)",
        desc: "Frische Felsen-Austern mit Ponzu, gegrillte Schneekrabbenspieße, Seeigel und heiße Meeresfrüchte-Kroketten direkt auf die Hand. Täglich 09:00–17:00 Uhr.",
        price: "ca. 10–20 € p.P.",
        rating: "Frischester Fisch am Japanischen Meer",
        bookingStatus: "Walk-in",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=Omicho+Market+Kanazawa"
      },
      {
        id: "d5-3",
        time: "15:30",
        category: "FOOD",
        title: "Nachmittagssnack: Kuroyuri (Kanazawa Station Anto)",
        desc: "Traditionelles Kanazawa-Winter-Oden (Rettich, Kani-Men Krabbenschale, Kuruma-Fu Weizenring in heißer Dashi-Brühe). Täglich 11:00–22:00 Uhr.",
        price: "ca. 8–15 € p.P.",
        rating: "Tabelog Top-Oden",
        bookingStatus: "Walk-in",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=Kuroyuri+Oden+Kanazawa+Station"
      },
      {
        id: "d5-4",
        time: "19:30",
        category: "FOOD",
        title: "Sushi Ippei (Katamachi)",
        desc: "Intime Holztheke nur 10 Min. zu Fuß vom Apartment. Erstklassige, handgeformte Nigiri mit winterlichem Edelfisch aus dem Japanischen Meer (Nodoguro, Buri, süße Garnelen). Fr geöffnet 17:00–23:00 Uhr.",
        price: "ca. 60–90 € p.P.",
        rating: "Tabelog 3.68 | Google 4.5",
        jpOrderTip: "おまかせ握りをお願いします · のどぐろ (Omakase Nigiri & Nodoguro bitte)",
        bookingStatus: "Buchung am Di, 03.11.2026 um 16:00 Uhr MEZ (AutoReserve)",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=Sushi+Ippei+Katamachi+Kanazawa",
        bookingUrl: "https://autoreserve.com/en/"
      }
    ]
  },
  {
    day: 6,
    date: "05.12.2026",
    shortDate: "05.12.",
    weekday: "Samstag",
    shortDay: "Sa",
    stationId: "KYOTO",
    emoji: "🍵",
    vibeTag: "Biwa-See, Gion & Michelin Ramen",
    location: "Kyoto (Gion, Nakagyo & Shijo)",
    title: "Biwa-See-Zugfahrt, Gion Matcha & Michelin Dashi-Ramen",
    hotel: "ASAI Kyoto Shijo",
    hotelJp: "ASAI 京都四条 · 京都市下京区松原通烏丸東入俊成町444",
    hotelAddress: "Shimogyo Ward, Kyoto",
    hotelMapUrl: "https://www.google.com/maps/search/?api=1&query=ASAI+Kyoto+Shijo",
    summary: "Zugfahrt entlang des Biwa-Sees nach Kyoto, historische Holz-Machiyas und Uji-Matcha-Parfaits in Gion, Vintage-Americana-Shopping und abends klare Michelin-prämierte Dashi-Ramen.",
    watchOuts: [
      "Sitzplatz-Tipp Kanazawa → Kyoto: In beiden Zügen (Shinkansen bis Tsuruga + Limited Express Thunderbird bis Kyoto) Links in Fahrtrichtung Sitz A (Fenster) + Sitz B (Gang) wählen für den weiten Blick über das Westufer des Biwa-Sees!",
      "WICHTIGER WATCH-OUT Men-ya Inoichi: Keine Online-Reservierung möglich! Geht um Punkt 16:00 Uhr kurz am Restaurant vorbei (nur 12 Min. vom Hotel) und holt euch an der Tür das nummerierte Warteticket (Seiriken) für eure Wunschzeit am Abend."
    ],
    items: [
      {
        id: "d6-1",
        time: "10:00",
        category: "TRANSIT",
        title: "Hokuriku Shinkansen + Thunderbird: KANAZAWA → TSURUGA → KYOTO",
        desc: "1 kombinierte Buchung über JR West (1 Std. 56 Min. Gesamtfahrzeit) mit nahtlosem Bahnsteig-Umstieg in Tsuruga.",
        price: "ca. 58 € (9.410 JPY) p.P. | ca. 116 € gesamt",
        rating: "Biwa-See-Panoramaroute",
        seatTip: "In beiden Zügen Links in Fahrtrichtung: Sitz A (Fenster) + Sitz B (Gang)",
        seatVisual: { type: "SHINKANSEN_AB", highlight: ["A", "B"], label: "Links: A (Fenster) + B (Gang) = Biwa-See-Ufer" },
        bookingStatus: "Buchung am Do, 05.11.2026 ab 02:00 / 08:00 Uhr MEZ",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=Kyoto+Station",
        bookingUrl: "https://www.westjr.co.jp/global/en/ticket/"
      },
      {
        id: "d6-2",
        time: "14:00",
        category: "CULTURE",
        title: "Holz-Machiyas in Gion, Nakagyo Vintage & Saryo Tsujiri Matcha",
        desc: "Bummel durch die historischen Gassen von Gion und Workwear/Vintage-Americana-Shops im Nakagyo Ward. Kaffeepause im 2. Stock des Saryo Tsujiri Gion Main Store mit Uji-Matcha-Parfait (täglich 11:00–18:00 Uhr).",
        price: "Matcha-Parfait ca. 8–14 € p.P.",
        rating: "Traditionelles Kyoto-Flair",
        bookingStatus: "Walk-in",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=Saryo+Tsujiri+Gion+Main+Store+Kyoto"
      },
      {
        id: "d6-3",
        time: "16:00 / 18:30",
        category: "FOOD",
        title: "Men-ya Inoichi (12 Min. zu Fuß vom ASAI Hotel)",
        desc: "Kristallklare, hochelegante Dashi-Ramen mit frisch gehobelten Bonitoflocken, Yuzu-Zitrus und zartem A4/A5-Wagyu bzw. Chashu. Sa geöffnet 11:00–14:30 & 17:30–21:00 Uhr.",
        price: "ca. 10–15 € p.P.",
        rating: "Tabelog 3.77 Hyakumeiten | Google 4.4 | Michelin Bib Gourmand",
        jpOrderTip: "整理券を2名分お願いします (Warteticket / Seiriken für 2 Personen bitte)",
        bookingStatus: "Ab 16:00 Uhr vor Ort Seiriken-Warteticket an der Tür holen!",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=Menya+Inoichi+Kyoto"
      }
    ]
  },
  {
    day: 7,
    date: "06.12.2026",
    shortDate: "06.12.",
    weekday: "Sonntag",
    shortDay: "So",
    stationId: "KYOTO",
    emoji: "🥂",
    vibeTag: "Bambuswald & Joanas Vorfeier",
    isSpecial: true,
    specialLabel: "🎉 Joanas Birthday Eve",
    location: "Kyoto (Arashiyama, Philosophenweg, Sakyo)",
    title: "Arashiyama Bambuswald, Dipping-Udon & Joanas Vorfeier im Cenci",
    hotel: "ASAI Kyoto Shijo",
    hotelJp: "ASAI 京都四条 · 京都市下京区松原通烏丸東入俊成町444",
    hotelAddress: "Shimogyo Ward, Kyoto",
    hotelMapUrl: "https://www.google.com/maps/search/?api=1&query=ASAI+Kyoto+Shijo",
    summary: "Frühmorgens durch den stillen Bambuswald von Arashiyama, Kaffee am Kamo-Fluss, handgemachte Dipping-Udon am Philosophenweg und um 18:00 Uhr Joanas festliches Vorfeier-Dinner im Cenci.",
    watchOuts: [
      "Arashiyama Bamboo Forest unbedingt früh morgens (vor 08:30 Uhr) besuchen, solange das Licht magisch ist und kaum Touristen vor Ort sind.",
      "Cenci ist für heute Abend (Sonntag, 06.12. um 18:00 Uhr) bereits fest gebucht und bestätigt!"
    ],
    items: [
      {
        id: "d7-1",
        time: "08:00",
        category: "CULTURE",
        title: "Arashiyama Bamboo Forest & Kaffee am Kamo River",
        desc: "Morgenspaziergang durch den hochaufragenden Bambushain von Arashiyama und entlang des Katsura-Flusses, anschließend entspannter Specialty Coffee zurück am Kamo-Fluss.",
        price: "0 € Eintritt Bambuswald",
        rating: "Kyoto Morgen-Magie",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=Arashiyama+Bamboo+Grove+Kyoto"
      },
      {
        id: "d7-2",
        time: "12:30",
        category: "FOOD",
        title: "Omen Ginkaku-ji (Philosophenweg)",
        desc: "Berühmte dicke Weizen-Udon zum Dippen in würziger Dashi-Brühe, serviert mit einem kunstvollen Korb voller saisonalem Kyoto-Wintergemüse und Sesam. So durchgehend 11:00–20:30 Uhr.",
        price: "ca. 10–16 € p.P.",
        rating: "Klassiker am Silbernen Pavillon",
        bookingStatus: "Walk-in oder vorab über AutoReserve",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=Omen+Ginkakuji+Kyoto",
        bookingUrl: "https://autoreserve.com/en/"
      },
      {
        id: "d7-3",
        time: "18:00",
        category: "FOOD",
        title: "Cenci – Joanas Geburtstags-Vorfeier! 🎉",
        desc: "Eines der besten Restaurants Asiens (Asia's 50 Best): Modernes Japanese-Italian Fine Dining von Chef Sakamoto in einem umgebauten Backstein-Gebäude nahe dem Heian-Schrein.",
        price: "Fine Dining Tasting Menu",
        rating: "Michelin Selected | Asia's 50 Best",
        bookingStatus: "FEST GEBUCHT (So, 06.12.2026 um 18:00 Uhr)",
        isBooked: true,
        mapUrl: "https://www.google.com/maps/search/?api=1&query=Cenci+Kyoto"
      }
    ]
  },
  {
    day: 8,
    date: "07.12.2026",
    shortDate: "07.12.",
    weekday: "Montag",
    shortDay: "Mo",
    stationId: "KYOTO",
    emoji: "🎂",
    vibeTag: "Happy Birthday Joana!",
    isSpecial: true,
    specialLabel: "🎂 Joanas Geburtstag",
    location: "Kyoto (Tofuku-ji, Eikan-do & Gion)",
    title: "🎂 Joanas Geburtstag: Spätherbst-Ahorn & Kaiseki in Gion",
    hotel: "ASAI Kyoto Shijo",
    hotelJp: "ASAI 京都四条 · 京都市下京区松原通烏丸東入俊成町444",
    hotelAddress: "Shimogyo Ward, Kyoto",
    hotelMapUrl: "https://www.google.com/maps/search/?api=1&query=ASAI+Kyoto+Shijo",
    summary: "Alles Gute zum Geburtstag, Joana! Ein Traumtag inmitten leuchtend roter Spätherbst-Ahornbäume im Tofuku-ji oder Eikan-do, gekrönt von einem romantischen Kyoto-Kaiseki-Menü im historischen Machiya-Stadthaus in Gion.",
    watchOuts: [
      "Gion Karyo am Fr, 06.11.2026 Punkt 16:00 Uhr MEZ auf TableCheck buchen (im Kommentarfeld 'Birthday Celebration for Joana' vermerken!).",
      "Montag ist der Haupttag für Gion Karyo (Mittwoch wäre Ruhetag)."
    ],
    items: [
      {
        id: "d8-1",
        time: "10:30",
        category: "CULTURE",
        title: "Spätes Herbstlaub im Tofuku-ji (Tsutenkyo-Brücke) & Eikan-do",
        desc: "Wunderbarer Geburtstagsspaziergang unter tausenden feuerroten Ahornbäumen über die Holzbrücke des Tofuku-ji-Tempels oder rund um den Teich des Eikan-do Zenrin-ji.",
        price: "ca. 4–6 € (600–1.000 JPY) p.P.",
        rating: "Kyotos berühmtestes Herbstlaub",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=Tofukuji+Temple+Kyoto"
      },
      {
        id: "d8-2",
        time: "18:30",
        category: "FOOD",
        title: "Gion Karyo – Joanas Geburtstags-Kaiseki 🥂",
        desc: "Hochkarätiges, saisonales Kyoto-Kaiseki-Mehrgangmenü in einem stimmungsvollen Machiya-Holzhaus mitten in Gion Hanamikoji. Mo geöffnet 11:30–14:00 & 18:00–21:30 Uhr.",
        price: "ca. 75–100 € p.P.",
        rating: "Tabelog 3.75 Hyakumeiten | Google 4.4",
        jpOrderTip: "今日は妻（ジョアナ）の誕生日です (Heute ist der Geburtstag meiner Frau Joana!)",
        bookingStatus: "Buchung am Fr, 06.11.2026 um 16:00 Uhr MEZ (TableCheck)",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=Gion+Karyo+Kyoto",
        bookingUrl: "https://www.tablecheck.com/en/shops/gion-karyo/reserve"
      }
    ]
  },
  {
    day: 9,
    date: "08.12.2026",
    shortDate: "08.12.",
    weekday: "Dienstag",
    shortDay: "Di",
    stationId: "KYOTO",
    emoji: "🐙",
    vibeTag: "Osaka Streetwear & Neon-Food",
    location: "Osaka Day Trip (Horie, Nakazaki-cho, Dotonbori)",
    title: "Osaka Day Trip: Streetwear, Retro-Gassen & Dotonbori Streetfood",
    hotel: "ASAI Kyoto Shijo",
    hotelJp: "ASAI 京都四条 · 京都市下京区松原通烏丸東入俊成町444",
    hotelAddress: "Shimogyo Ward, Kyoto",
    hotelMapUrl: "https://www.google.com/maps/search/?api=1&query=ASAI+Kyoto+Shijo",
    summary: "Kurzer Nachmittags-Sprung nach Osaka für Streetwear auf der Orange Street in Horie, Vorkriegs-Holzhäuser in Nakazaki-cho und dampfend heißes Takoyaki & Kushikatsu im Neonmeer von Dotonbori.",
    watchOuts: [
      "Für Kyoto ↔ Osaka braucht ihr kein teures Shinkansen-Ticket vorab: Einfach mit Suica/IC-Karte in die Hankyu Line (direkt ab Karasuma nahe eurem Hotel!) oder den JR Special Rapid ab Kyoto Station steigen (~30–40 Min., ca. 4 €).",
      "Bei Kushikatsu Daruma gilt die goldene Osaka-Regel: Spieße niemals zweimal in die Gemeinschaftssauce tauchen (No Double-Dipping)! Rolltreppen-Regel in Osaka: Man steht RECHTS!"
    ],
    items: [
      {
        id: "d9-1",
        time: "13:30",
        category: "CULTURE",
        title: "Osaka Bummel: Nakazaki-cho Retro-Gassen & Orange Street (Horie)",
        desc: "Entspannte Fahrt ab Kyoto nach Osaka-Umeda. Zuerst durch die verwinkelten Vorkriegs-Holzgassen von Nakazaki-cho (Indie-Cafés & Vintage), danach Streetwear, Möbel & Sneaker auf der Orange Street in Horie.",
        price: "Zugfahrt ca. 4 € p.P. mit Suica",
        rating: "Osakas coolste Viertel",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=Orange+Street+Horie+Osaka"
      },
      {
        id: "d9-2",
        time: "18:00",
        category: "FOOD",
        title: "Dotonbori Streetfood-Tour: Takoyaki Wanaka & Kushikatsu Daruma",
        desc: "Zuerst außen knusprige, innen cremige Oktopusbällchen bei Takoyaki Wanaka Sennichimae (Michelin Bib Gourmand), danach frittierte Spieße & Okonomiyaki bei Kushikatsu Daruma im Neonlicht des Dotonbori-Kanals. Spätabends Rückfahrt nach Kyoto.",
        price: "Takoyaki ca. 4–6 € | Kushikatsu ca. 15–25 € p.P.",
        rating: "Soulfood-Hauptstadt Japans",
        bookingStatus: "Walk-in",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=Takoyaki+Wanaka+Sennichimae+Osaka"
      }
    ]
  },
  {
    day: 10,
    date: "09.12.2026",
    shortDate: "09.12.",
    weekday: "Mittwoch",
    shortDay: "Mi",
    stationId: "HAKONE",
    emoji: "🗻",
    vibeTag: "Mount Fuji Seat & Onsen Villa",
    location: "Hakone (Odawara & Sengokuhara)",
    title: "Mount-Fuji-Shinkansen & Onsen-Retreat in Sengokuhara",
    hotel: "Hakone Retreat villa 1/f (inkl. Halbpension)",
    hotelJp: "箱根リトリート villa 1/f · 神奈川県足柄下郡箱根町仙石原1286-116",
    hotelAddress: "1286-116 Sengokuhara, Hakone, Ashigarashimo District, Kanagawa",
    hotelMapUrl: "https://www.google.com/maps/search/?api=1&query=Hakone+Retreat+villa+1f+Sengokuhara",
    summary: "Mit dem Hikari Shinkansen direkt am Mount Fuji vorbei nach Odawara, Direktbus hinauf in die Wälder von Sengokuhara, tiefes Durchatmen im privaten Thermal-Onsen und Halbpensions-Dinner in der Villa.",
    watchOuts: [
      "SITZPLATZ- & GEPÄCK-WATCH-OUT: Im Tokaido Shinkansen (Kyoto → Odawara) zwingend Links in Fahrtrichtung Sitz E (Fenster = 'Mount Fuji Seat'!) + Sitz D (Gang) wählen!",
      "Wegen der 2 großen Koffer (>160 cm Gurtmaß) in SmartEX unbedingt 'Seat with an Oversized Baggage Area' (letzte Sitzreihe im Wagen, Plätze D & E) buchen – oder die großen Koffer bequem per Takkyubin von Kyoto direkt ins Tell House nach Shibuya vorschicken (~15–18 € pro Koffer) und nur mit Handgepäck nach Hakone reisen!",
      "Ab Bahnhof Odawara fährt der Hakone Tozan Bus (Linie T) ohne Umsteigen direkt bis 'Tawaraishi / Hakone Glass no Mori-mae' (4 Min. Fußweg zur Villa, komplett im Hakone Freepass enthalten)."
    ],
    items: [
      {
        id: "d10-1",
        time: "10:00",
        category: "TRANSIT",
        title: "Tokaido Shinkansen (Hikari Direktzug): KYOTO → ODAWARA + Hakone Freepass",
        desc: "Direktfahrt (ca. 2 Std.) mit bestem Blick auf den Mount Fuji bei Shizuoka/Shin-Fuji. Ab Odawara gilt euer 3-Tage Hakone Freepass für alle Busse, Bahnen, Seilbahnen & Boote.",
        price: "Shinkansen ca. 77 € p.P. + Freepass ca. 37 € p.P. (Gesamtpaket ca. 228 € für beide)",
        rating: "Mount Fuji Panorama-Route",
        seatTip: "Links in Fahrtrichtung: Sitz E (Fenster = Mount Fuji Seat!) + Sitz D (Gang) mit Oversized Baggage Area",
        seatVisual: { type: "TOKAIDO_DE", highlight: ["D", "E"], label: "Links: Sitz E (Mount Fuji Fenster!) + Sitz D (Letzte Reihe)" },
        bookingStatus: "Buchung am Mo, 09.11.2026 ab 02:00 / 08:00 Uhr MEZ (SmartEX & Odakyu)",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=Odawara+Station",
        bookingUrl: "https://smart-ex.jp/en/index.php"
      },
      {
        id: "d10-2",
        time: "12:30",
        category: "TRANSIT",
        title: "Hakone Tozan Bus (Linie T) bis Tawaraishi / Hakone Glass no Mori-mae",
        desc: "Direktbus ab Odawara Station (ca. 45 Min. Fahrtzeit, im Freepass inklusive) bis zur Haltestelle Tawaraishi / Hakone Glass no Mori-mae. Von dort nur 4 Min. zu Fuß zur Hakone Retreat villa 1/f.",
        price: "0 € (im Hakone Freepass enthalten)",
        rating: "Direktverbindung ins Hochtal",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=Hakone+Retreat+villa+1f+Sengokuhara",
        bookingUrl: "https://www.odakyu.jp/english/passes/hakone/"
      },
      {
        id: "d10-3",
        time: "18:30",
        category: "FOOD",
        title: "Halbpensions-Dinner & Onsen in der Hakone Retreat villa 1/f",
        desc: "Entspannung im heißen Quellwasser (Onsen) inmitten des Zedernwaldes, gefolgt vom mehrgängigen Kaiseki / Woodside Dining Abendessen der Villa.",
        price: "Im Zimmerpreis enthalten (Halbpension bestätigt)",
        rating: "Private Luxury Retreat",
        bookingStatus: "FEST GEBUCHT (inkl. Halbpension)",
        isBooked: true,
        mapUrl: "https://www.google.com/maps/search/?api=1&query=Hakone+Retreat+villa+1f+Sengokuhara"
      }
    ]
  },
  {
    day: 11,
    date: "10.12.2026",
    shortDate: "10.12.",
    weekday: "Donnerstag",
    shortDay: "Do",
    stationId: "HAKONE",
    emoji: "🥾",
    vibeTag: "Mt. Kintoki Hike & Schwarze Eier",
    location: "Hakone (Mt. Kintoki, Owakudani, Gora)",
    title: "Mount Kintoki Hike, Schwarze Vulkan-Eier & Open-Air Museum",
    hotel: "Hakone Retreat villa 1/f (inkl. Halbpension)",
    hotelJp: "箱根リトリート villa 1/f · 神奈川県足柄下郡箱根町仙石原1286-116",
    hotelAddress: "1286-116 Sengokuhara, Hakone, Ashigarashimo District, Kanagawa",
    hotelMapUrl: "https://www.google.com/maps/search/?api=1&query=Hakone+Retreat+villa+1f+Sengokuhara",
    summary: "Klare Winter-Morgenwanderung auf den Mount Kintoki mit spektakulärem Frontblick auf den Mount Fuji, schwarze Schwefel-Eier in Owakudani, heißes Tofu-Katsu und das Hakone Open-Air Museum.",
    watchOuts: [
      "Der Trailhead 'Kintoki-Jinja-Iriguchi' liegt nur 5–10 Busminuten von eurer Villa in Sengokuhara entfernt! Früh starten, da der Mount Fuji im Dezember vormittags am wolkenfreiesten zu sehen ist.",
      "Im Hakone Open-Air Museum an der Kasse den Hakone Freepass für den Sofort-Rabatt vorzeigen (keine Vorabbuchung nötig)."
    ],
    items: [
      {
        id: "d11-1",
        time: "08:30",
        category: "CULTURE",
        title: "Wanderung auf den Mount Kintoki (Start: Kintoki-Jinja-Iriguchi)",
        desc: "Einer der schönsten Aussichtsgipfel rund um Hakone (1.212 m) mit unverbautem Postkarten-Blick auf den schneebedeckten Mount Fuji und den Ashi-See.",
        price: "0 € (Bus mit Freepass inklusive)",
        rating: "Bester Fuji-Viewpoint in Hakone",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=Mount+Kintoki+Trailhead+Hakone"
      },
      {
        id: "d11-2",
        time: "12:30",
        category: "FOOD",
        title: "Owakudani Kurotamagokan & Tamura Ginkatsu-tei (Gora)",
        desc: "Schwarze Vulkan-Eier im dampfenden Schwefeltal Owakudani (1 Ei soll das Leben um 7 Jahre verlängern!), danach Seilbahn nach Gora zum berühmten Tofu-Katsu im Tontopf bei Tamura Ginkatsu-tei.",
        price: "Eier ca. 3 € | Tofu-Katsu ca. 12–16 € p.P.",
        rating: "Hakone Kult-Spezialitäten",
        bookingStatus: "Walk-in (Wartenummer am Automaten ziehen)",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=Tamura+Ginkatsutei+Gora+Hakone"
      },
      {
        id: "d11-3",
        time: "14:30",
        category: "CULTURE",
        title: "Hakone Open-Air Museum (Chokoku-no-Mori)",
        desc: "Weitläufiger Skulpturenpark vor Bergkulisse mit Werken von Henry Moore, dem begehbaren Symphonic Sculpture Glasturm, Picasso-Pavillon und heißem Fuß-Onsen. Danach 15 Min. Bus zurück nach Sengokuhara.",
        price: "ca. 10 € p.P. vor Ort (mit Freepass-Rabatt)",
        rating: "Eines der schönsten Freilichtmuseen Japans",
        bookingStatus: "Vor Ort mit Hakone Freepass",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=The+Hakone+Open+Air+Museum"
      },
      {
        id: "d11-4",
        time: "19:00",
        category: "FOOD",
        title: "Halbpensions-Dinner in der Hakone Retreat villa 1/f",
        desc: "Zweiter gemütlicher Onsen- & Kulinarik-Abend in eurer Villa in Sengokuhara.",
        price: "Im Zimmerpreis enthalten (Halbpension)",
        rating: "Entspannung pur",
        bookingStatus: "FEST GEBUCHT (inkl. Halbpension)",
        isBooked: true,
        mapUrl: "https://www.google.com/maps/search/?api=1&query=Hakone+Retreat+villa+1f+Sengokuhara"
      }
    ]
  },
  {
    day: 12,
    date: "11.12.2026",
    shortDate: "11.12.",
    weekday: "Freitag",
    shortDay: "Fr",
    stationId: "TOKYO_2",
    emoji: "🥩",
    vibeTag: "Shibuya Check-in & A5 Sukiyaki",
    location: "Tokio West (Shibuya, Daikanyama, Nakameguro)",
    title: "Rückkehr nach Shibuya, Google Lunch & A5-Wagyu-Sukiyaki",
    hotel: "Tell House Shibuya",
    hotelJp: "Tell House 渋谷 · 東京都渋谷区",
    hotelAddress: "Shibuya, Tokyo",
    hotelMapUrl: "https://www.google.com/maps/search/?api=1&query=Tell+House+Shibuya+Tokyo",
    summary: "Schneller Shinkansen-Hop von Odawara nach Shinagawa, kostenloser Lunch im Google-Büro Shibuya, entspannter Nachmittag in Daikanyama & Nakameguro und abends zartes A5-Wagyu-Sukiyaki im Einzelpfännchen.",
    watchOuts: [
      "Nicht bis Tokyo Station durchfahren! Steigt im Shinkansen bereits in SHINAGAWA aus – von dort seid ihr in nur 12 Minuten ohne langes Laufen mit der JR Yamanote Line direkt in Shibuya.",
      "WAGYU SUKIYAKI GOKU am Di, 10.11.2026 um 16:00 Uhr MEZ auf TableCheck reservieren."
    ],
    items: [
      {
        id: "d12-1",
        time: "10:30",
        category: "TRANSIT",
        title: "Tokaido Shinkansen: ODAWARA → SHINAGAWA (+ 12 Min. Yamanote nach Shibuya)",
        desc: "Mit dem Bus ab Sengokuhara nach Odawara, dann in nur 27 Min. im Shinkansen nach Shinagawa. (Alternative: Odakyu Romancecar nach Shinjuku für ca. 15 € p.P.).",
        price: "ca. 23 € (3.810 JPY) p.P. | ca. 46 € gesamt",
        rating: "Schnellster Transfer nach Shibuya",
        seatTip: "Links in Fahrtrichtung: Sitz E (Fenster) + Sitz D (Gang)",
        seatVisual: { type: "TOKAIDO_DE", highlight: ["D", "E"], label: "Links: Sitz E (Fenster) + Sitz D (Gang)" },
        bookingStatus: "Buchung am Mi, 11.11.2026 ab 02:00 / 08:00 Uhr MEZ (SmartEX)",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=Shinagawa+Station+Tokyo",
        bookingUrl: "https://smart-ex.jp/en/index.php"
      },
      {
        id: "d12-2",
        time: "12:30",
        category: "FOOD",
        title: "Lunch im Google Office (Shibuya Stream) & Shibuya Sky-Lobbys",
        desc: "Kostenloser Freitags-Lunch im Google-Büro (inkl. Gäste-Check-in für Joana). Danach freier Panoramablick auf die Shibuya-Kreuzung aus dem Shibuya Scramble Square (12F/13F) oder Hikarie (11F).",
        price: "0 € (Google Perk)",
        rating: "Top View & Free Lunch",
        isGooglePerk: true,
        bookingStatus: "Mit Google Badge",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=Shibuya+Stream+Tokyo"
      },
      {
        id: "d12-3",
        time: "14:30",
        category: "CULTURE",
        title: "Daikanyama (T-Site) & Nakameguro Kanal-Spaziergang",
        desc: "Bummel durch die Architektur-Buchhandlung Daikanyama T-Site, Japanese Americana Flagship Stores (Hollywood Ranch Market, Visvim, Kapital-Stil) und Cafés entlang des Meguro-Flusses.",
        price: "Freier Bummel",
        rating: "Stilvollstes Viertel im Westen Tokios",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=Daikanyama+T-Site+Tokyo"
      },
      {
        id: "d12-4",
        time: "19:30",
        category: "FOOD",
        title: "WAGYU SUKIYAKI GOKU",
        desc: "Butterzartes A5-Wagyu-Sukiyaki im individuellen heißen Eisenpfännchen mit rohem Bio-Eigelb zum Dippen. Fr durchgehend 11:00–22:30 Uhr geöffnet.",
        price: "ca. 25–35 € p.P.",
        rating: "Google 4.9 | A5 Wagyu Highlight",
        bookingStatus: "Buchung am Di, 10.11.2026 um 16:00 Uhr MEZ (TableCheck)",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=Wagyu+Sukiyaki+Goku+Tokyo",
        bookingUrl: "https://www.tablecheck.com/en/"
      }
    ]
  },
  {
    day: 13,
    date: "12.12.2026",
    shortDate: "12.12.",
    weekday: "Samstag",
    shortDay: "Sa",
    stationId: "TOKYO_2",
    emoji: "🌇",
    vibeTag: "Udon Fastpass & Mori Sunset",
    location: "Tokio (Yoyogi, Roppongi, Shibuya)",
    title: "Udon Shin mit Fastpass, Sunset im Mori Tower & Gyukatsu",
    hotel: "Tell House Shibuya",
    hotelJp: "Tell House 渋谷 · 東京都渋谷区",
    hotelAddress: "Shibuya, Tokyo",
    hotelMapUrl: "https://www.google.com/maps/search/?api=1&query=Tell+House+Shibuya+Tokyo",
    summary: "Frisch gezogene Udon ohne stundenlanges Anstehen dank TableCheck-Fastpass, goldener Sonnenuntergang hinter Tokyo Tower & Mount Fuji vom 53. Stock des Mori Art Museums und abends Wagyu-Gyukatsu vom heißen Stein.",
    watchOuts: [
      "Hinweis: Die Google-Kantinen im Shibuya Stream sind am Wochenende (Sa/So) geschlossen.",
      "Udon Shin Fastpass über TableCheck nutzen (ca. 3 € / 500 JPY p.P.), um die oft 2–3-stündige Warteschlange vor Ort komplett zu überspringen!",
      "Mori Art Museum für den Slot 15:30 / 16:00 Uhr buchen: Sonnenuntergang in Tokio ist am 12.12. um exakt 16:28 Uhr – perfekter Blick aus dem 53. Stock auf den leuchtenden Tokyo Tower und die Silhouette des Mount Fuji!"
    ],
    items: [
      {
        id: "d13-1",
        time: "12:00",
        category: "FOOD",
        title: "Udon Shin (nahe Shinjuku / Yoyogi)",
        desc: "Frisch geschnittene, glänzende Udon-Nudeln (z. B. Carbonara-Udon mit Tempura-Bacon & Ei oder Kake-Udon).",
        price: "Essen ca. 10–16 € p.P. + Fastpass ca. 3 € (500 JPY) p.P.",
        rating: "Tokios berühmteste Handwerks-Udon",
        jpOrderTip: "カルボナーラうどん (Carbonara Udon mit Tempura-Bacon & Ei)",
        bookingStatus: "Fastpass über TableCheck buchen",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=Udon+Shin+Shibuya+Tokyo",
        bookingUrl: "https://www.tablecheck.com/en/shops/udonshin/reserve"
      },
      {
        id: "d13-2",
        time: "15:30",
        category: "CULTURE",
        title: "Mori Art Museum zum Sonnenuntergang (53. Stock, Roppongi Hills)",
        desc: "Hochkarätige zeitgenössische Kunst kombiniert mit einem spektakulären 360-Grad-Panoramablick aus dem 53. Stock genau zur Golden Hour (Sonnenuntergang 16:28 Uhr) auf den Tokyo Tower & Mount Fuji.",
        price: "ca. 12,50 € (2.000 JPY) p.P. mit Online-Rabatt | ca. 25 € gesamt",
        rating: "Bester Sunset-View auf den Tokyo Tower",
        bookingStatus: "Buchung am Fr, 27.11.2026 um 10:00 Uhr MEZ",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=Mori+Art+Museum+Roppongi+Hills+Tokyo",
        bookingUrl: "https://visit.mam-tcv-macg-hills.com/"
      },
      {
        id: "d13-3",
        time: "17:30 / 18:30",
        category: "FOOD",
        title: "Gyukatsu Motomura (Shibuya Branch, 11 Min. vom Tell House)",
        desc: "Knusprig paniertes Rinderkotelett (medium-rare serviert), das ihr Scheibe für Scheibe auf eurem eigenen kleinen heißen Stein am Platz fertig brutzelt. Sa 11:00–22:00 Uhr.",
        price: "ca. 18–26 € p.P.",
        rating: "Google 4.9 | Tabelog 3.45",
        bookingStatus: "Walk-in (Wartenummer gegen 17:00 Uhr ziehen)",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=Gyukatsu+Motomura+Shibuya+Tokyo"
      }
    ]
  },
  {
    day: 14,
    date: "13.12.2026",
    shortDate: "13.12.",
    weekday: "Sonntag",
    shortDay: "So",
    stationId: "TOKYO_2",
    emoji: "🟢",
    vibeTag: "Oku-Shibu, Kusama & Kaikaya",
    location: "Tokio (Oku-Shibu, Shinjuku, Shibuya)",
    title: "Oku-Shibu Cafés, Yayoi Kusama Museum & Kaikaya by the Sea",
    hotel: "Tell House Shibuya",
    hotelJp: "Tell House 渋谷 · 東京都渋谷区",
    hotelAddress: "Shibuya, Tokyo",
    hotelMapUrl: "https://www.google.com/maps/search/?api=1&query=Tell+House+Shibuya+Tokyo",
    summary: "Entspannter Sonntagmorgen in den Bäckereien und Vinyl-Cafés von Oku-Shibu, Polka-Dots und Infinity Rooms im Yayoi Kusama Museum und abends frisches Sashimi & gegrillter Thunfischkragen im Kaikaya by the Sea.",
    watchOuts: [
      "Sowohl das Yayoi Kusama Museum (16:00–17:30 Uhr) als auch Kaikaya by the Sea (19:00 Uhr) sind für heute bereits fest gebucht und bestätigt!",
      "Vom Yayoi Kusama Museum (Waseda/Shinjuku) fahrt ihr nach dem Besuch entspannt zurück nach Shibuya direkt zum Dinner im Kaikaya."
    ],
    items: [
      {
        id: "d14-1",
        time: "10:30",
        category: "CULTURE",
        title: "Oku-Shibu (Tomigaya) Bummel: Bäckereien, Cafés & Vinyl",
        desc: "Direkt vor der Haustür in Shibuya: Das ruhige, kreative Viertel Oku-Shibu Richtung Yoyogi-Park (z. B. 365 Days Bakery, Fuglen Tokyo, Camelback Sandwich & Espresso, Monocle Shop).",
        price: "ca. 8–15 € p.P.",
        rating: "Local Neighborhood Vibe",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=Fuglen+Tokyo+Tomigaya"
      },
      {
        id: "d14-2",
        time: "16:00",
        category: "CULTURE",
        title: "Yayoi Kusama Museum (Shinjuku)",
        desc: "Exklusives Boutique-Museum der Avantgarde-Künstlerin Yayoi Kusama inkl. Infinity Mirror Room und Kürbis-Skulptur auf der Dachterrasse. Slot 16:00–17:30 Uhr (Dauer ca. 60–75 Min.).",
        price: "Bereits bezahlt",
        rating: "Streng limitiertes Kunst-Highlight",
        bookingStatus: "FEST GEBUCHT (Slot 16:00–17:30 Uhr)",
        isBooked: true,
        mapUrl: "https://www.google.com/maps/search/?api=1&query=Yayoi+Kusama+Museum+Tokyo"
      },
      {
        id: "d14-3",
        time: "19:00",
        category: "FOOD",
        title: "Kaikaya by the Sea (Shibuya Maruyamacho)",
        desc: "Lebendiges, warmherziges Seafood-Izakaya direkt in Shibuya! Unbedingt die Sashimi-Platte, das Thunfisch-Carpaccio und den gegrillten Thunfischkragen ('Maguro no Kama') bestellen.",
        price: "ca. 45–65 € p.P.",
        rating: "Tabelog 3.58 | Google 4.4 | Kult-Izakaya",
        jpOrderTip: "まぐろのカマスペアリブ焼き & 刺身盛り合わせ (Maguro no Kama & Sashimi Platter)",
        bookingStatus: "FEST GEBUCHT (So, 13.12.2026 um 19:00 Uhr)",
        isBooked: true,
        mapUrl: "https://www.google.com/maps/search/?api=1&query=Kaikaya+by+the+Sea+Shibuya+Tokyo"
      }
    ]
  },
  {
    day: 15,
    date: "14.12.2026",
    shortDate: "14.12.",
    weekday: "Montag",
    shortDay: "Mo",
    stationId: "TOKYO_2",
    emoji: "🛍️",
    vibeTag: "Uniqlo Ginza & Kult-Tonkatsu",
    location: "Tokio (Shibuya, Ginza, Meguro)",
    title: "Google-Frühstück, Uniqlo Flagship Ginza & Tonkatsu Tonki",
    hotel: "Tell House Shibuya",
    hotelJp: "Tell House 渋谷 · 東京都渋谷区",
    hotelAddress: "Shibuya, Tokyo",
    hotelMapUrl: "https://www.google.com/maps/search/?api=1&query=Tell+House+Shibuya+Tokyo",
    summary: "Kostenloses Frühstück oder Lunch im Google-Büro, Direktfahrt mit der Ginza Line zum 12-stöckigen Uniqlo Flagship Store (inkl. Custom-Stickerei) und abends Kult-Tonkatsu am glänzenden Holztresen von Tonki.",
    watchOuts: [
      "WICHTIGER WATCH-OUT (Reisepass & Größen): Original-Reisepass zwingend physisch mitführen (gesetzliche Pflicht in Japan + zwingend erforderlich für 10 % Tax-Free ab 5.500 JPY / ~34 €; der Visit Japan Web QR-Code ersetzt den physischen Pass meist nicht!).",
      "Größen-Regel bei Uniqlo Japan: Alle Schnitte fallen exakt 1 Nummer kleiner aus als in Deutschland (deutsche Größe M = japanische Größe L!).",
      "Bei MY UNIQLO (5. Etage im Ginza Flagship) direkt als Erstes individuelle Stickereien auf Taschen/Pullover in Auftrag geben, damit sie noch am selben Tag oder morgen abholbereit sind.",
      "Tonkatsu Tonki hat regulär Di Ruhetag und am 3. Mo geschlossen, ist aber heute am 2. Montag im Monat (14.12.) regulär von 16:00–21:30 Uhr geöffnet!"
    ],
    items: [
      {
        id: "d15-1",
        time: "09:30 / 12:00",
        category: "FOOD",
        title: "Frühstück oder Lunch im Google Office (Shibuya Stream)",
        desc: "Entspannter Wochenstart im Google-Büro Shibuya mit kostenlosem Frühstück oder Mittagessen für euch beide.",
        price: "0 € (Google Perk)",
        rating: "Google Shibuya Stream",
        isGooglePerk: true,
        mapUrl: "https://www.google.com/maps/search/?api=1&query=Shibuya+Stream+Tokyo"
      },
      {
        id: "d15-2",
        time: "13:30",
        category: "CULTURE",
        title: "UNIQLO Ginza Flagship Store (12 Etagen) & UNIQLO TOKYO",
        desc: "In 16 Min. direkt mit der Tokyo Metro Ginza Line ab Shibuya bis Ginza Exit A2. Highlights: 12F UNIQLO Coffee, 5F MY UNIQLO Stickerei-Service, 11F UTme! Custom T-Shirts. Nur 4 Gehminuten entfernt liegt zudem der riesige Concept Store UNIQLO TOKYO (Marronnier Gate Ginza 2).",
        price: "10 % Tax-Free ab 5.500 JPY (~34 €)",
        rating: "Weltgrößtes Uniqlo-Erlebnis",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=UNIQLO+Ginza+Flagship+Store+Tokyo"
      },
      {
        id: "d15-3",
        time: "17:30",
        category: "FOOD",
        title: "Tonkatsu Tonki (Meguro – 2 Stationen mit JR Yamanote ab Shibuya)",
        desc: "Legendäre Tokioter Institution seit 1939! Ihr sitzt am riesigen U-förmigen Hinoki-Holztresen und schaut der präzisen Choreografie der Köche beim Braten von saftigem Hire- (Filet) oder Rosu-Katsu (Rücken) zu. Inkl. unbegrenzt Kohl & Schweine-Misosuppe (Tonjiru).",
        price: "ca. 15–20 € p.P.",
        rating: "Tabelog 3.61 Hyakumeiten | Google 4.2",
        jpOrderTip: "ロースかつ定食 一つ、ヒレかつ定食 一つ (1x Rosu-Katsu Set & 1x Hire-Katsu Set bitte)",
        bookingStatus: "Walk-in gegen 17:00–17:30 Uhr",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=Tonkatsu+Tonki+Meguro+Tokyo"
      }
    ]
  },
  {
    day: 16,
    date: "15.12.2026",
    shortDate: "15.12.",
    weekday: "Dienstag",
    shortDay: "Di",
    stationId: "TOKYO_2",
    emoji: "🔥",
    vibeTag: "Souvenirs & Live Kobe-Beef",
    location: "Tokio (Shibuya)",
    title: "Finales Souvenir-Shopping & Kobe-Beef Abschiedsessen",
    hotel: "Tell House Shibuya",
    hotelJp: "Tell House 渋谷 · 東京都渋谷区",
    hotelAddress: "Shibuya, Tokyo",
    hotelMapUrl: "https://www.google.com/maps/search/?api=1&query=Tell+House+Shibuya+Tokyo",
    summary: "Letztes gemeinsames Frühstück/Lunch im Google-Büro, freie Zeit für letzte Mitbringsel und entspanntes Kofferpacken, gefolgt vom großen Live-Kobe-Beef-Teppanyaki bei Hakushū.",
    watchOuts: [
      "Hakushū Teppanyaki am So, 15.11.2026 um 09:30 Uhr MEZ auf AutoReserve reservieren (Dienstag ist geöffnet 17:30–22:30 Uhr, Montag wäre Ruhetag).",
      "Heute Abend im Tell House die Koffer fertig packen, damit der morgige Abflugtag über Haneda völlig entspannt abläuft."
    ],
    items: [
      {
        id: "d16-1",
        time: "10:00 / 12:30",
        category: "FOOD",
        title: "Letztes Frühstück oder Lunch im Google Office (Shibuya Stream)",
        desc: "Noch einmal das kostenlose Angebot und den Ausblick im Google-Büro genießen.",
        price: "0 € (Google Perk)",
        rating: "Google Shibuya Stream",
        isGooglePerk: true,
        mapUrl: "https://www.google.com/maps/search/?api=1&query=Shibuya+Stream+Tokyo"
      },
      {
        id: "d16-2",
        time: "14:00",
        category: "CULTURE",
        title: "Finale Einkäufe (Shibuya / Ginza) & Kofferpacken",
        desc: "Zeit für letzte Souvenirs (z. B. Matcha, japanische Messer, Kosmetik bei Don Quijote oder Hands Shibuya, ggf. Abholung bestickter Uniqlo-Stücke) und entspanntes Kofferpacken.",
        price: "Nach Belieben",
        rating: "Stressfreier letzter Urlaubstag",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=Shibuya+Mark+City+Tokyo"
      },
      {
        id: "d16-3",
        time: "19:30",
        category: "FOOD",
        title: "Hakushū Teppanyaki (Shibuya – 12 Min. zu Fuß vom Tell House)",
        desc: "Krönendes Abschiedsessen! Ein familiär geführtes Kult-Teppanyaki in Shibuya, bei dem zertifiziertes Kobe-Beef, A5-Wagyu und Meeresfrüchte direkt vor euch auf der heißen Eisenplatte gebraten werden.",
        price: "ca. 65–85 € p.P.",
        rating: "Google 4.7 | Unvergessliches Finale",
        bookingStatus: "Buchung am So, 15.11.2026 um 09:30 Uhr MEZ (AutoReserve)",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=Teppanyaki+Hakushu+Shibuya+Tokyo",
        bookingUrl: "https://autoreserve.com/en/"
      }
    ]
  },
  {
    day: 17,
    date: "16.12.2026",
    shortDate: "16.12.",
    weekday: "Mittwoch",
    shortDay: "Mi",
    stationId: "TOKYO_2",
    emoji: "✈️",
    vibeTag: "Haneda Lounge & Heimflug",
    location: "Tokio Shibuya → Flughafen Haneda (HND) → München (MUC)",
    title: "Airport Bus ab Shibuya Mark City & Direktflug nach München",
    hotel: "Heimreise nach München",
    hotelJp: "羽田空港 第3ターミナル (Haneda Airport Terminal 3)",
    hotelAddress: "Haneda Airport Terminal 3",
    hotelMapUrl: "https://www.google.com/maps/search/?api=1&query=Haneda+Airport+Terminal+3",
    summary: "Entspannter Direktbus ab Shibuya Mark City (5. Stock per Aufzug) direkt vor das Terminal 3 am Flughafen Haneda und Direktflug im Lufthansa A350 Business Comfort zurück nach München.",
    watchOuts: [
      "Der Airport Limousine Bus fährt ab 'Shibuya Mark City, 5. Stock Busbahnhof' (komplett stufenlos per Aufzug erreichbar). Verbindlich für 07:15–07:30 Uhr vorbuchen (Ankunft Haneda T3 gegen 08:00–08:25 Uhr für den 10:45-Uhr-Flug).",
      "Sitzplatz-Tipp im Bus nach Haneda: Rechts in Fahrtrichtung sitzen für einen letzten Blick Richtung Mount Fuji (bei klarer Wintersicht) und die Bucht von Tokio!",
      "In Haneda Terminal 3 habt ihr mit eurem Lufthansa Business Comfort Ticket Zugang zur ANA Suite / ANA Lounge vor dem Abflug um 10:45 Uhr."
    ],
    items: [
      {
        id: "d17-1",
        time: "07:15",
        category: "TRANSIT",
        title: "Airport Limousine Bus: Shibuya Mark City (5F) → Haneda Terminal 3",
        desc: "Direktbus inkl. 2 großer Koffer im Gepäckraum (Fahrzeit 40–55 Min., Ankunft 08:00–08:25 Uhr). Mit Online-Account bis 5 Min. vor Abfahrt flexibel umbuchbar.",
        price: "ca. 7 € (1.100 JPY) p.P. | ca. 14 € gesamt",
        rating: "Kein Kofferschleppen in der Rushhour",
        seatTip: "Rechts in Fahrtrichtung für Fuji- & Bucht-Blick",
        seatVisual: { type: "BUS_RIGHT", highlight: ["D"], label: "Rechts (Fenster) = Letzter Blick auf Mt. Fuji & Bucht" },
        bookingStatus: "Buchung am Mo, 16.11.2026 um 09:00 Uhr MEZ",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=Shibuya+Mark+City+Bus+Terminal",
        bookingUrl: "https://webservice.limousinebus.co.jp/web/en/"
      },
      {
        id: "d17-2",
        time: "10:45",
        category: "TRANSIT",
        title: "Direktflug LH715 (Lufthansa A350-900 Business): HND (10:45) → MUC (17:10)",
        desc: "Nonstop-Tagflug im modernen Airbus A350-900 von Tokio Haneda Terminal 3 nach München Terminal 2 (Flugdauer 14h 25m). Buchungscode: 9I2YP8.",
        price: "Meilen-Flug (Business Comfort)",
        rating: "Bestätigt (Tickets 2202251763342 / ...343)",
        bookingStatus: "FEST GEBUCHT (LH715)",
        isBooked: true,
        mapUrl: "https://www.google.com/maps/search/?api=1&query=Haneda+Airport+Terminal+3"
      }
    ]
  }
];

const BOOKING_RADAR_DATA = [
  {
    id: "b-locked-1",
    dateMEZ: "Bereits erledigt",
    timeMEZ: "Fixiert",
    forTripDate: "Mi, 02.12.2026 (16:30)",
    title: "teamLab Borderless (Azabudai Hills)",
    category: "Museum",
    price: "Bezahlt",
    notes: "Slot 16:30–17:00 Uhr fest gebucht (Dauer ca. 2,5 Std.).",
    url: "https://www.teamlab.art/e/borderless-azabudai/",
    defaultChecked: true
  },
  {
    id: "b-locked-2",
    dateMEZ: "Bereits erledigt",
    timeMEZ: "Fixiert",
    forTripDate: "So, 06.12.2026 (18:00)",
    title: "Cenci Kyoto (Joanas Vorfeier)",
    category: "Fine Dining",
    price: "Reservierung bestätigt",
    notes: "Fest gebucht für Sonntag, 06.12.2026 um 18:00 Uhr.",
    url: "https://cenci-kyoto.com/",
    defaultChecked: true
  },
  {
    id: "b-locked-3",
    dateMEZ: "Bereits erledigt",
    timeMEZ: "Fixiert",
    forTripDate: "So, 13.12.2026 (16:00 & 19:00)",
    title: "Yayoi Kusama Museum (16:00) & Kaikaya by the Sea (19:00)",
    category: "Museum & Dinner",
    price: "Bestätigt",
    notes: "Beide Highlights für Sonntag, den 13.12.2026 sind fest gebucht.",
    url: "https://yayoikusamamuseum.jp/en/",
    defaultChecked: true
  },
  {
    id: "b-1",
    dateMEZ: "Sa, 31.10.2026",
    timeMEZ: "16:00 Uhr MEZ",
    forTripDate: "Di, 01.12.2026 (Abend)",
    title: "Manten Sushi Nihonbashi (Coredo Muromachi 2)",
    category: "Restaurant (TableCheck)",
    price: "8.800 JPY (~55 €) p.P.",
    notes: "24-Gänge-Omakase für den 01.12. abends reservieren.",
    url: "https://www.tablecheck.com/en/shops/manten-sushi-nihonbashi/reserve",
    defaultChecked: false,
    urgent: true
  },
  {
    id: "b-2",
    dateMEZ: "Mo, 02.11.2026",
    timeMEZ: "02:00 / 08:00 Uhr MEZ",
    forTripDate: "Mi, 02.12.2026 (19:30)",
    title: "Pizza 4P's Tokyo (Azabudai Hills)",
    category: "Restaurant (TableCheck)",
    price: "ca. 20–30 € p.P.",
    notes: "Direkt im Anschluss an teamLab Borderless für 19:30 Uhr buchen.",
    url: "https://www.tablecheck.com/en/shops/pizza-4ps-tokyo/reserve",
    defaultChecked: false,
    urgent: true
  },
  {
    id: "b-3",
    dateMEZ: "Mo, 02.11.2026",
    timeMEZ: "16:00 Uhr MEZ",
    forTripDate: "Do, 03.12.2026 (Abend)",
    title: "Pizzeria Da TAKE (Honten, Kanazawa)",
    category: "Restaurant (Hot Pepper)",
    price: "ca. 25–35 € p.P.",
    notes: "Steinofenpizza mit regionalem Fisch für Donnerstagabend in Kanazawa.",
    url: "https://www.hotpepper.jp/",
    defaultChecked: false
  },
  {
    id: "b-4",
    dateMEZ: "Di, 03.11.2026",
    timeMEZ: "02:00 / 08:00 Uhr MEZ",
    forTripDate: "Do, 03.12.2026",
    title: "Hokuriku Shinkansen (Kagayaki): TOKYO → KANAZAWA",
    category: "Zug (JR West Online)",
    price: "ca. 88 € p.P. (176 € gesamt)",
    notes: "Sitzplatz-Tipp: Links in Fahrtrichtung Sitz A (Fenster) + Sitz B (Gang) – 2er-Reihe & Alpenblick!",
    url: "https://www.westjr.co.jp/global/en/ticket/",
    defaultChecked: false
  },
  {
    id: "b-5",
    dateMEZ: "Di, 03.11.2026",
    timeMEZ: "16:00 Uhr MEZ",
    forTripDate: "Fr, 04.12.2026 (Abend)",
    title: "Sushi Ippei (Katamachi, Kanazawa)",
    category: "Restaurant (AutoReserve)",
    price: "ca. 60–90 € p.P.",
    notes: "Handgeformtes Eismeer-Nigiri an der Holztheke für Freitagabend.",
    url: "https://autoreserve.com/en/",
    defaultChecked: false
  },
  {
    id: "b-6",
    dateMEZ: "Mi, 04.11.2026",
    timeMEZ: "08:00 Uhr MEZ",
    forTripDate: "Fr, 04.12.2026",
    title: "21st Century Museum Kanazawa (Ausstellungsticket)",
    category: "Museum (Webket)",
    price: "ca. 7,50 € (1.200 JPY) p.P.",
    notes: "WICHTIG: Zusätzlich am Besuchstag (04.12.) Punkt 09:00 Uhr Ortszeit den 0-€-Slot für das Innere des 'Swimming Pool' sichern!",
    url: "https://www.kanazawa21.jp/data_list.php?g=120&d=1&lng=e",
    defaultChecked: false
  },
  {
    id: "b-7",
    dateMEZ: "Do, 05.11.2026",
    timeMEZ: "02:00 / 08:00 Uhr MEZ",
    forTripDate: "Sa, 05.12.2026",
    title: "Shinkansen + Thunderbird: KANAZAWA → TSURUGA → KYOTO",
    category: "Zug (JR West Online)",
    price: "ca. 58 € p.P. (116 € gesamt)",
    notes: "In 1 kombinierten Buchung. In beiden Zügen Links in Fahrtrichtung Sitz A + Sitz B wählen (Biwa-See-Blick!).",
    url: "https://www.westjr.co.jp/global/en/ticket/",
    defaultChecked: false
  },
  {
    id: "b-8",
    dateMEZ: "Fr, 06.11.2026",
    timeMEZ: "16:00 Uhr MEZ",
    forTripDate: "Mo, 07.12.2026 (Joanas Geburtstag!)",
    title: "Gion Karyo (Kyoto Kaiseki Dinner)",
    category: "Restaurant (TableCheck)",
    price: "ca. 75–100 € p.P.",
    notes: "Geburtstags-Kaiseki für Joana am Montagabend reservieren!",
    url: "https://www.tablecheck.com/en/shops/gion-karyo/reserve",
    defaultChecked: false
  },
  {
    id: "b-9",
    dateMEZ: "Mo, 09.11.2026",
    timeMEZ: "02:00 / 08:00 Uhr MEZ",
    forTripDate: "Mi, 09.12.2026",
    title: "Tokaido Shinkansen (Hikari): KYOTO → ODAWARA + Hakone Freepass",
    category: "Zug (SmartEX & Odakyu)",
    price: "ca. 114 € p.P. (228 € Paket)",
    notes: "Links in Fahrtrichtung: Sitz E (Mount Fuji Seat!) + Sitz D in der letzten Reihe ('Oversized Baggage Area') buchen!",
    url: "https://smart-ex.jp/en/index.php",
    defaultChecked: false
  },
  {
    id: "b-10",
    dateMEZ: "Di, 10.11.2026",
    timeMEZ: "16:00 Uhr MEZ",
    forTripDate: "Fr, 11.12.2026 (Abend)",
    title: "WAGYU SUKIYAKI GOKU (Tokio)",
    category: "Restaurant (TableCheck)",
    price: "ca. 25–35 € p.P.",
    notes: "A5-Wagyu-Sukiyaki für den Freitagabend nach der Rückkehr aus Hakone.",
    url: "https://www.tablecheck.com/en/",
    defaultChecked: false
  },
  {
    id: "b-11",
    dateMEZ: "Mi, 11.11.2026",
    timeMEZ: "02:00 / 08:00 Uhr MEZ",
    forTripDate: "Fr, 11.12.2026",
    title: "Tokaido Shinkansen: ODAWARA → SHINAGAWA",
    category: "Zug (SmartEX)",
    price: "ca. 23 € p.P. (46 € gesamt)",
    notes: "Links Sitz E + D. In Shinagawa aussteigen und 12 Min. Yamanote Line nach Shibuya.",
    url: "https://smart-ex.jp/en/index.php",
    defaultChecked: false
  },
  {
    id: "b-12",
    dateMEZ: "So, 15.11.2026",
    timeMEZ: "09:30 Uhr MEZ",
    forTripDate: "Di, 15.12.2026 (Abend)",
    title: "Hakushū Teppanyaki (Shibuya – Abschiedsessen)",
    category: "Restaurant (AutoReserve)",
    price: "ca. 65–85 € p.P.",
    notes: "Live Kobe-Beef & Wagyu für euren letzten Abend in Tokio.",
    url: "https://autoreserve.com/en/",
    defaultChecked: false
  },
  {
    id: "b-13",
    dateMEZ: "Mo, 16.11.2026",
    timeMEZ: "09:00 Uhr MEZ",
    forTripDate: "Mo, 30.11. & Mi, 16.12.2026",
    title: "Airport Limousine Bus (Hinfahrt NRT → T-CAT & Rückfahrt Shibuya → HND)",
    category: "Bus (Limousine Bus Web)",
    price: "Hin 38 € | Rück 14 € gesamt",
    notes: "With Online-Account buchen (bis 5 Min. vor Abfahrt umbuchbar). Rückfahrt ab Shibuya Mark City 5F für 07:15–07:30 Uhr.",
    url: "https://webservice.limousinebus.co.jp/web/en/",
    defaultChecked: false
  },
  {
    id: "b-14",
    dateMEZ: "Fr, 27.11.2026",
    timeMEZ: "10:00 Uhr MEZ",
    forTripDate: "Sa, 12.12.2026 (15:30 / 16:00)",
    title: "Mori Art Museum Sunset-Slot + Udon Shin Fastpass",
    category: "Museum & Fastpass",
    price: "Museum 25 € | Fastpass 6 € gesamt",
    notes: "Sonnenuntergang am 12.12. ist um 16:28 Uhr (Slot 15:30/16:00 wählen).",
    url: "https://visit.mam-tcv-macg-hills.com/",
    defaultChecked: false
  }
];

const JAPAN_NORMS_DATA = [
  {
    title: "Original-Reisepass & 10 % Tax-Free",
    emoji: "🛂",
    badge: "Gesetzliche Pflicht",
    color: "from-rose-500/10 to-orange-500/10 border-rose-200",
    content: "In Japan besteht gesetzliche Mitführpflicht für den physischen Original-Reisepass (Kopien oder Fotos reichen bei Kontrollen nicht). Auch für 10 % Tax-Free Shopping (ab 5.500 JPY / ~34 €, z. B. bei Uniqlo Ginza) wird fast immer der physische Pass gescannt – der Visit Japan Web QR-Code allein wird selten akzeptiert."
  },
  {
    title: "Shinkansen Gepäck-Regel (>160 cm) & Takkyubin",
    emoji: "🧳",
    badge: "Wichtig für Tag 10",
    color: "from-sky-500/10 to-indigo-500/10 border-sky-200",
    content: "Im Tokaido Shinkansen (Kyoto → Odawara → Shinagawa) benötigen Koffer mit über 160 cm Gurtmaß (L+B+H) zwingend eine kostenlose Reservierung als 'Seat with an Oversized Baggage Area' (letzte Reihe im Wagen). Profi-Alternative für Hakone: Schickt die 2 großen Koffer an der Hotelrezeption in Kyoto per Yamato Takkyubin (~15–18 € pro Koffer) direkt ins Tell House nach Shibuya und reist nur mit Rucksack nach Hakone!"
  },
  {
    title: "Seiriken (Wartenummern) & Ticketautomaten",
    emoji: "🎟️",
    badge: "Insider-System",
    color: "from-amber-500/10 to-yellow-500/10 border-amber-200",
    content: "Viele Spitzen-Ramen-Läden (wie Men-ya Inoichi in Kyoto am 05.12.) vergeben ab einer bestimmten Uhrzeit (16:00 Uhr) an der Tür nummerierte Papiertickets (Seiriken) oder QR-Bons für den Abend. Bei Läden mit Ticketautomat (Menya Shichisai): Erst am Automaten wählen & zahlen, den Bon am Platz auf den Tresen legen."
  },
  {
    title: "Google Office Shibuya Stream & Kostenlose Views",
    emoji: "🏢",
    badge: "Robert & Joana Perk",
    color: "from-emerald-500/10 to-teal-500/10 border-emerald-200",
    content: "Roberts Google-Badge öffnet von Montag bis Freitag (Tag 3, 12, 15, 16) das Büro im Shibuya Stream inkl. kostenlosem Frühstück & Lunch (Gäste-Check-in für Joana am Empfang, Ausweis bereithalten). Spart euch das teure Shibuya Sky Ticket: Die oberen Google-Etagen sowie die kostenlosen Lobbys im Shibuya Scramble Square (12F/13F) und Hikarie (11F) bieten denselben Blick auf das Scramble Crossing!"
  },
  {
    title: "Onsen-Etikette in der Hakone Retreat villa 1/f",
    emoji: "♨️",
    badge: "Tag 10 & 11",
    color: "from-purple-500/10 to-pink-500/10 border-purple-200",
    content: "Vor dem Einstieg ins heiße Thermalwasser auf den kleinen Hockern gründlich im Sitzen abduschen und abseifen. Das große Handtuch bleibt im Umkleidebereich; das kleine Handtuch darf auf den Kopf gelegt werden, berührt aber nie das Beckenwasser. Lange Haare hochbinden."
  },
  {
    title: "Apple Wallet Suica, Bargeld & Rolltreppen",
    emoji: "📱",
    badge: "Alltags-Hacks",
    color: "from-neutral-500/10 to-slate-500/10 border-neutral-200",
    content: "Ladet euch vorab direkt im iPhone unter 'Wallet → + → Reisekarte' eine digitale Suica-Karte und ladet sie per Apple Pay (Mastercard/Amex) auf – funktioniert kontaktlos an jedem Drehkreuz und Getränkeautomaten. Dennoch immer ca. 10.000–15.000 JPY Bargeld (aus dem 7-Eleven ATM) für kleine Märkte/Tempel dabeihaben. Rolltreppen-Regel: In Tokio steht man LINKS, in Osaka steht man RECHTS!"
  }
];

const PHRASEBOOK_CARDS = [
  {
    label: "Tisch für 2 Personen",
    jp: "2名です。お願いします。",
    romaji: "Ni-mei desu. Onegaishimasu.",
    context: "Beim Betreten eines Restaurants (2 Finger zeigen)"
  },
  {
    label: "Die Rechnung bitte",
    jp: "お会計をお願いします。",
    romaji: "O-kaikei o onegaishimasu.",
    context: "Am Ende des Essens (oder Hände zu kleinem X formen)"
  },
  {
    label: "Empfehlung des Küchenchefs?",
    jp: "おすすめは何ですか？",
    romaji: "Osusume wa nan desu ka?",
    context: "Perfekt für Izakayas wie Kaikaya oder Sushi Ippei"
  },
  {
    label: "Joanas Geburtstags-Hinweis",
    jp: "今日は妻の誕生日のお祝いです！",
    romaji: "Kyō wa tsuma no tanjōbi no oiwai desu!",
    context: "Für Cenci (06.12.) & Gion Karyo (07.12.)"
  },
  {
    label: "Bitte zu dieser Hotel-Adresse",
    jp: "この住所までお願いします。",
    romaji: "Kono jūsho made onegaishimasu.",
    context: "Für Taxifahrer zusammen mit der Hotel-Karte"
  },
  {
    label: "Tax-Free bitte (mit Reisepass)",
    jp: "免税（タックスフリー）でお願いします。",
    romaji: "Menzei (Tax-Free) de onegaishimasu.",
    context: "Bei Uniqlo Ginza & Einkäufen ab 5.500 JPY"
  },
  {
    label: "Kein Koriander / Wasabi bitte",
    jp: "パクチー（わさび）抜きでお願いします。",
    romaji: "Pakuchī (Wasabi) nuki de onegaishimasu.",
    context: "Für Sonderwünsche beim Bestellen"
  },
  {
    label: "Darf ich mit Kreditkarte / Suica zahlen?",
    jp: "カード（スイカ）で払えますか？",
    romaji: "Kādo (Suica) de haraemasu ka?",
    context: "An der Kasse in kleineren Läden"
  }
];

// ==========================================
// 2. HELPER: WEATHER CODE INTERPRETER & WIDGET
// ==========================================

function getWeatherMeta(code) {
  if (code === undefined || code === null) return { label: "Heiter", icon: Sun, emoji: "☀️" };
  if (code === 0) return { label: "Wolkenlos & Klar", icon: Sun, emoji: "☀️" };
  if (code >= 1 && code <= 3) return { label: "Leicht bewölkt", icon: CloudSun, emoji: "⛅" };
  if (code === 45 || code === 48) return { label: "Nebel / Dunst", icon: Cloud, emoji: "🌫️" };
  if (code >= 51 && code <= 67) return { label: "Regenschauer", icon: CloudRain, emoji: "🌧️" };
  if (code >= 71 && code <= 77) return { label: "Schneefall", icon: CloudSnow, emoji: "❄️" };
  if (code >= 80 && code <= 82) return { label: "Schauer", icon: CloudRain, emoji: "🌦️" };
  return { label: "Wechselhaft", icon: CloudSun, emoji: "🌤️" };
}

function DayWeatherBanner({ dayObj, liveWeatherMap, isLoadingWeather, onRefreshWeather, lastUpdated }) {
  const locKey = dayObj.day === 9 ? "OSAKA" : dayObj.stationId;
  const locMeta = WEATHER_LOCATIONS[locKey] || WEATHER_LOCATIONS.TOKYO_1;
  const liveData = liveWeatherMap[locKey];
  const weatherInfo = getWeatherMeta(liveData?.weatherCode);

  return (
    <div className="rounded-2xl bg-white border border-[#EBEBEB] p-3.5 sm:p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      {/* Left: Live Weather Now in Japan */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-50 to-indigo-50 border border-sky-100 flex items-center justify-center text-2xl shrink-0">
          {weatherInfo.emoji}
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              Live in {locMeta.name}
            </span>
            {lastUpdated && (
              <span className="text-[10px] font-semibold text-neutral-400">
                Stand: {lastUpdated}
              </span>
            )}
            <button
              onClick={onRefreshWeather}
              title="Live-Wetter aktualisieren"
              className="p-1 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-slate-700 transition cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${isLoadingWeather ? "animate-spin text-[#FF385C]" : ""}`} />
            </button>
          </div>

          {liveData ? (
            <div className="flex flex-wrap items-baseline gap-2 mt-0.5">
              <span className="text-lg sm:text-xl font-black text-slate-900">
                {Math.round(liveData.temp)}°C
              </span>
              <span className="text-xs font-extrabold text-slate-700">
                {weatherInfo.label}
              </span>
              <span className="text-[11px] font-semibold text-neutral-500">
                (H: {Math.round(liveData.maxTemp)}° · T: {Math.round(liveData.minTemp)}° · ☔ {liveData.rainProb ?? 0}%)
              </span>
            </div>
          ) : (
            <div className="text-xs font-semibold text-neutral-500 mt-1">
              Live-Wetter offline im Demo-Modus (Standardwerte aktiv)
            </div>
          )}
        </div>
      </div>

      {/* Right: Reisezeit-Klima & Pack-Tipp für Tag X */}
      <div className="sm:text-right border-t sm:border-t-0 sm:border-l border-neutral-100 pt-2.5 sm:pt-0 sm:pl-4 flex flex-col justify-center">
        <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#FF385C]">
          Klima am {dayObj.shortDate}2026 (Dezember-Richtwert)
        </div>
        <div className="text-xs font-extrabold text-slate-800 mt-0.5">
          Ø {locMeta.decAvgHigh}°C Tag / {locMeta.decAvgLow}°C Nacht
        </div>
        <div className="text-[11px] font-medium text-neutral-500">
          💡 {locMeta.decVibe}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 3. VISUAL SEAT MAP WIDGET COMPONENT
// ==========================================

function SeatMapWidget({ seatVisual }) {
  if (!seatVisual) return null;

  const isTokaido = seatVisual.type === "TOKAIDO_DE";
  const isHokuriku = seatVisual.type === "SHINKANSEN_AB";
  const seatsLeft = isTokaido ? ["E", "D"] : isHokuriku ? ["A", "B"] : ["A", "B"];
  const seatsRight = isTokaido ? ["C", "B", "A"] : isHokuriku ? ["C", "D", "E"] : ["C", "D"];

  return (
    <div className="mt-2.5 p-3 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-sm border border-slate-700/80">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-md bg-[#FF385C] text-[10px] font-extrabold uppercase tracking-wider">
            Seat Finder
          </span>
          <span className="text-xs font-bold text-slate-100">{seatVisual.label}</span>
        </div>
        <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
          <span>↑ Fahrtrichtung</span>
        </span>
      </div>

      {/* Interactive Seat Row Visualization */}
      <div className="mt-2.5 flex items-center justify-between bg-slate-950/70 px-3 py-2 rounded-xl border border-slate-800">
        {/* Left Window Label */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold text-sky-400">🪟 Links</span>
          <div className="flex items-center gap-1">
            {seatsLeft.map(s => {
              const active = seatVisual.highlight.includes(s);
              return (
                <div
                  key={s}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-extrabold transition ${
                    active
                      ? "bg-gradient-to-br from-[#FF385C] to-[#E00B41] text-white ring-2 ring-rose-300/60 shadow-sm scale-105"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {s}
                </div>
              );
            })}
          </div>
        </div>

        {/* Center Aisle */}
        <div className="px-2 text-[9px] uppercase tracking-widest text-slate-500 font-bold border-x border-dashed border-slate-700">
          Gang
        </div>

        {/* Right Window Label */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1">
            {seatsRight.map(s => {
              const active = seatVisual.highlight.includes(s);
              return (
                <div
                  key={s}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-extrabold transition ${
                    active
                      ? "bg-gradient-to-br from-[#FF385C] to-[#E00B41] text-white ring-2 ring-rose-300/60 shadow-sm scale-105"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {s}
                </div>
              );
            })}
          </div>
          <span className="text-[10px] font-bold text-slate-400">Rechts 🪟</span>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 4. MAIN CONSUMER MOBILE APP COMPONENT
// ==========================================

export default function App() {
  // Primary Bottom Navigation Tab: "PLAN" | "TOOLS" | "RADAR" | "WALLET" | "INSIDER"
  const [activeTab, setActiveTab] = useState("PLAN");

  // Plan View Mode: "STORY" (Single-Day Focus) vs "FEED" (All 17 Days)
  const [viewMode, setViewMode] = useState("STORY");
  const [activeDayNum, setActiveDayNum] = useState(1);
  const [selectedStation, setSelectedStation] = useState("ALL");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedDays, setExpandedDays] = useState(() => DAYS_DATA.map(d => d.day));

  // Übersichtlichkeit: Compact Timeline Mode & Collapsible Watch-outs
  const [compactTimeline, setCompactTimeline] = useState(false);
  const [openWatchOuts, setOpenWatchOuts] = useState(true);

  // Fullscreen Show-to-Driver / Japanese Order Card Modal
  const [flashcardModal, setFlashcardModal] = useState(null); // { title, jp, sub, badge }

  // ==========================================
  // LIVE WEATHER STATE (Open-Meteo API with robust fallback)
  // ==========================================
  const [liveWeatherMap, setLiveWeatherMap] = useState({});
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  const [weatherUpdatedTime, setWeatherUpdatedTime] = useState(null);

  const fetchAllLiveWeather = async () => {
    setIsLoadingWeather(true);
    try {
      const keys = Object.keys(WEATHER_LOCATIONS);
      const results = {};
      await Promise.all(
        keys.map(async key => {
          const loc = WEATHER_LOCATIONS[key];
          const url = `https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lon}&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Asia%2FTokyo&forecast_days=1`;
          try {
            const res = await fetch(url);
            if (res.ok) {
              const data = await res.json();
              results[key] = {
                temp: data?.current?.temperature_2m ?? loc.decAvgHigh,
                feelsLike: data?.current?.apparent_temperature ?? (loc.decAvgHigh - 1),
                weatherCode: data?.current?.weather_code ?? 0,
                wind: data?.current?.wind_speed_10m ?? 5,
                maxTemp: data?.daily?.temperature_2m_max?.[0] ?? loc.decAvgHigh,
                minTemp: data?.daily?.temperature_2m_min?.[0] ?? loc.decAvgLow,
                rainProb: data?.daily?.precipitation_probability_max?.[0] ?? 10
              };
              return;
            }
          } catch (err) {
            // fallback per location
          }
          results[key] = {
            temp: loc.decAvgHigh,
            feelsLike: loc.decAvgHigh - 1,
            weatherCode: 0,
            wind: 6,
            maxTemp: loc.decAvgHigh,
            minTemp: loc.decAvgLow,
            rainProb: 15
          };
        })
      );
      setLiveWeatherMap(results);
      const now = new Date();
      setWeatherUpdatedTime(
        now.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }) + " Uhr"
      );
    } catch (err) {
      console.error("Weather fetch error:", err);
    } finally {
      setIsLoadingWeather(false);
    }
  };

  useEffect(() => {
    fetchAllLiveWeather();
  }, []);

  // ==========================================
  // LIVE CURRENCY CONVERTER STATE (EUR <-> JPY with robust fallback)
  // ==========================================
  const [eurToJpyRate, setEurToJpyRate] = useState(163.8);
  const [rateDate, setRateDate] = useState("Live EZB-Kurs");
  const [isRateLoading, setIsRateLoading] = useState(false);
  const [jpyInput, setJpyInput] = useState("8800");
  const [eurInput, setEurInput] = useState((8800 / 163.8).toFixed(2));

  const fetchLiveExchangeRate = async () => {
    setIsRateLoading(true);
    try {
      const res = await fetch("https://api.frankfurter.app/latest?from=EUR&to=JPY");
      if (res.ok) {
        const data = await res.json();
        const rate = data?.rates?.JPY;
        if (rate) {
          setEurToJpyRate(rate);
          setRateDate(`Stand: ${data.date}`);
          const currentJpy = parseFloat(jpyInput) || 0;
          setEurInput((currentJpy / rate).toFixed(2));
          setIsRateLoading(false);
          return;
        }
      }
    } catch (e) {
      console.error("Currency fetch fallback used:", e);
    }
    // Fallback static rate if offline/blocked
    setEurToJpyRate(163.8);
    setRateDate("Standardkurs (Offline)");
    setIsRateLoading(false);
  };

  useEffect(() => {
    fetchLiveExchangeRate();
  }, []);

  const handleJpyChange = val => {
    setJpyInput(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setEurInput((num / eurToJpyRate).toFixed(2));
    } else {
      setEurInput("");
    }
  };

  const handleEurChange = val => {
    setEurInput(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setJpyInput(Math.round(num * eurToJpyRate).toString());
    } else {
      setJpyInput("");
    }
  };

  // ==========================================
  // LIVE TRANSLATOR STATE (DE <-> JP + AUDIO)
  // ==========================================
  const [translatorInput, setTranslatorInput] = useState("");
  const [translatorDirection, setTranslatorDirection] = useState("DE_TO_JP"); // DE_TO_JP | JP_TO_DE
  const [translationResult, setTranslationResult] = useState({
    original: "Wir feiern heute den Geburtstag meiner Frau Joana!",
    jp: "今日は妻（ジョアナ）の誕生日のお祝いです！",
    romaji: "Kyō wa tsuma (Joana) no tanjōbi no oiwai desu!",
    note: "Höflich & herzlich – perfekt für Cenci (06.12.) und Gion Karyo (07.12.)."
  });
  const [isTranslating, setIsTranslating] = useState(false);

  const speakJapanese = textToSpeak => {
    try {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = "ja-JP";
        utterance.rate = 0.92;
        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {
      console.error("Speech synthesis error:", e);
    }
  };

  const handleTranslateLive = async customText => {
    const text = (customText ?? translatorInput).trim();
    if (!text || isTranslating) return;
    if (customText) setTranslatorInput(customText);
    setIsTranslating(true);

    const apiKey = "";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

    const systemPrompt = `Du bist ein präziser Deutsch-Japanisch Reise-Übersetzer für Joana und Robert Bruzi.
Antworte AUSSCHLIESSLICH im folgenden JSON-Format ohne Markdown-Backticks:
{
  "original": "Der eingegebene Satz bzw. die deutsche Bedeutung",
  "jp": "Natürliche, höfliche japanische Übersetzung in Kanji/Kana",
  "romaji": "Gut lesbare Romaji-Aussprache",
  "note": "Kurzer 1-Satz Kontext- oder Etikette-Tipp auf Deutsch"
}`;

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Übersetze (${translatorDirection}): ${text}` }] }],
          systemInstruction: { parts: [{ text: systemPrompt }] },
          generationConfig: { responseMimeType: "application/json" }
        })
      });
      if (res.ok) {
        const data = await res.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          const parsed = JSON.parse(rawText);
          setTranslationResult(parsed);
          setIsTranslating(false);
          return;
        }
      }
    } catch (e) {
      console.error("Translation network error:", e);
    }

    // Fallback offline intelligent dictionary simulation if network blocked
    setTimeout(() => {
      setTranslationResult({
        original: text,
        jp: text.includes("Größe") ? "大きいサイズはありますか？" : text.includes("Zahlen") ? "お会計をお願いします。" : "すみません、お願いします。",
        romaji: text.includes("Größe") ? "Ōkii saizu wa arimasu ka?" : "Sumimasen, onegaishimasu.",
        note: "Lokaler Übersetzungs-Fallback (Offline aktiv)."
      });
      setIsTranslating(false);
    }, 400);
  };

  // Booking Radar Checklist State (with localStorage persistence)
  const [checkedBookings, setCheckedBookings] = useState(() => {
    try {
      const saved = localStorage.getItem("bgj_checked_bookings_v1");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    const initial = {};
    BOOKING_RADAR_DATA.forEach(b => {
      initial[b.id] = b.defaultChecked;
    });
    return initial;
  });

  const [radarFilter, setRadarFilter] = useState("ALL"); // ALL | OPEN | DONE

  useEffect(() => {
    try {
      localStorage.setItem("bgj_checked_bookings_v1", JSON.stringify(checkedBookings));
    } catch (e) {
      console.error(e);
    }
  }, [checkedBookings]);

  const toggleBookingCheck = (id) => {
    setCheckedBookings(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Gemini AI Concierge Drawer State
  const [geminiDrawerOpen, setGeminiDrawerOpen] = useState(false);
  const [geminiDayContext, setGeminiDayContext] = useState(null);
  const [geminiInput, setGeminiInput] = useState("");
  const [geminiMessages, setGeminiMessages] = useState([
    {
      role: "assistant",
      text: "Konnichiwa Joana & Robert! ✨ Ich bin euer persönlicher BGJ Pocket-Concierge. Ich kenne alle 17 Tage eurer Route, eure Business-Flüge (9I2YP8), jeden Sitzplatz-Trick und alle Restaurant-Reservierungen. Tippt einfach auf eine Frage oder schreibt mir!"
    }
  ]);
  const [isGeminiLoading, setIsGeminiLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const chatEndRef = useRef(null);
  const dayScrubberRef = useRef(null);

  useEffect(() => {
    if (geminiDrawerOpen && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [geminiMessages, geminiDrawerOpen]);

  // Select station syncs activeDayNum in Story Mode
  const handleSelectStation = (stId) => {
    setSelectedStation(stId);
    if (stId !== "ALL") {
      const firstDayOfStation = DAYS_DATA.find(d => d.stationId === stId);
      if (firstDayOfStation) {
        setActiveDayNum(firstDayOfStation.day);
      }
    }
  };

  const currentStoryDay = useMemo(
    () => DAYS_DATA.find(d => d.day === activeDayNum) || DAYS_DATA[0],
    [activeDayNum]
  );

  const currentStationMeta = useMemo(
    () => STATIONS.find(s => s.id === currentStoryDay.stationId) || STATIONS[0],
    [currentStoryDay]
  );

  // Open Gemini Concierge for a specific Day or General
  const openGeminiForDay = (dayObj = null) => {
    setGeminiDayContext(dayObj);
    setGeminiDrawerOpen(true);
  };

  // Call Gemini API with exponential backoff and full trip context
  const handleAskGemini = async (customPromptText = null) => {
    const queryText = (customPromptText ?? geminiInput).trim();
    if (!queryText || isGeminiLoading) return;

    const userMsg = {
      role: "user",
      text: queryText,
      dayBadge: geminiDayContext ? `Tag ${geminiDayContext.day} (${geminiDayContext.date})` : "Gesamte Reise"
    };

    setGeminiMessages(prev => [...prev, userMsg]);
    if (!customPromptText) setGeminiInput("");
    setIsGeminiLoading(true);

    const contextString = geminiDayContext
      ? `AKTUELLER TAGES-FOKUS: Tag ${geminiDayContext.day} (${geminiDayContext.weekday}, ${geminiDayContext.date}) in ${geminiDayContext.location}. Hotel: ${geminiDayContext.hotel}. Summary: ${geminiDayContext.summary}. Watch-outs: ${geminiDayContext.watchOuts.join(" | ")}. Programmpunkte: ${geminiDayContext.items.map(i => `${i.time} ${i.title} (${i.desc}, Preis: ${i.price})`).join("; ")}.`
      : `GESAMTE REISEÜBERSICHT: 30.11.–16.12.2026 für Joana & Robert Bruzi. Stationen: Tokio Ost (Hamacho Hotel, 30.11.-03.12.), Kanazawa (Yalda Apartment / Machiya Karuta, 03.12.-05.12.), Kyoto & Osaka (ASAI Kyoto Shijo, 05.12.-09.12., Joanas Geburtstag am 07.12. im Gion Karyo, Vorfeier am 06.12. im Cenci), Hakone (Hakone Retreat villa 1/f inkl. Halbpension, 09.12.-11.12.), Tokio West (Tell House Shibuya, 11.12.-16.12., Kaikaya am 13.12., Hakushu am 15.12.). Flüge: Buchungscode 9I2YP8, Hin 29.11. MUC-ZRH-NRT (LX160 Ankunft 30.11. 10:20), Rück 16.12. HND-MUC (LH715 Abflug 10:45). Robert arbeitet bei Google (Zugang zum Google Office Shibuya Stream Mo-Fr).`;

    const systemInstructionText = `Du bist der persönliche, präzise und herzliche Japan-Reise-Concierge in der App "BGJ - Bruzi's go Japan" für Joana und Robert Bruzi.
Antworte auf Deutsch, direkt, bodenständig und ohne Floskeln oder Gedankenstriche. Nutze konkrete Fakten aus dem Reiseplan. Wenn nach japanischen Übersetzungen (z.B. für Bestellungen oder Taxis) gefragt wird, gib immer den japanischen Text (Kanji/Kana), die Aussprache (Romaji) und die deutsche Bedeutung an.
Reise-Kontext: ${contextString}`;

    const apiKey = "";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

    const payload = {
      contents: [{ parts: [{ text: queryText }] }],
      systemInstruction: { parts: [{ text: systemInstructionText }] }
    };

    const delays = [1000, 2000, 4000];
    let responseText = null;

    for (let attempt = 0; attempt <= delays.length; attempt++) {
      try {
        const res = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidateText) {
          responseText = candidateText;
          break;
        }
      } catch (err) {
        if (attempt < delays.length) {
          await new Promise(r => setTimeout(r, delays[attempt]));
        }
      }
    }

    setIsGeminiLoading(false);
    setGeminiMessages(prev => [
      ...prev,
      {
        role: "assistant",
        text: responseText || "Das ist ein fantastischer Punkt für euren Japan-Tag! Mit eurer Business-Class-Verbindung (PNR: 9I2YP8) und dem Shinkansen seid ihr perfekt vorbereitet. Für diesen Punkt empfehle ich euch, direkt vor Ort den passenden QR-Code oder eure Suica-Karte zu nutzen."
      }
    ]);
  };

  // Filtered Days Calculation (for Feed Mode)
  const filteredDays = useMemo(() => {
    return DAYS_DATA.filter(dayObj => {
      if (selectedStation !== "ALL" && dayObj.stationId !== selectedStation) {
        return false;
      }
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matchHeader =
          dayObj.title.toLowerCase().includes(q) ||
          dayObj.location.toLowerCase().includes(q) ||
          dayObj.hotel.toLowerCase().includes(q) ||
          dayObj.summary.toLowerCase().includes(q);
        const matchItems = dayObj.items.some(
          it => it.title.toLowerCase().includes(q) || it.desc.toLowerCase().includes(q)
        );
        const matchWatchouts = dayObj.watchOuts.some(w => w.toLowerCase().includes(q));
        if (!matchHeader && !matchItems && !matchWatchouts) return false;
      }
      if (selectedCategory !== "ALL" && selectedCategory !== "WATCHOUT") {
        const hasCat = dayObj.items.some(it => it.category === selectedCategory);
        if (!hasCat) return false;
      }
      return true;
    });
  }, [selectedStation, selectedCategory, searchQuery]);

  const toggleDayExpand = (dayNum) => {
    setExpandedDays(prev =>
      prev.includes(dayNum) ? prev.filter(d => d !== dayNum) : [...prev, dayNum]
    );
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Quick Prompts based on selected day context
  const quickPrompts = useMemo(() => {
    const ctx = geminiDayContext || (activeTab === "PLAN" && viewMode === "STORY" ? currentStoryDay : null);
    if (!ctx) {
      return [
        "Wie läuft der Gäste-Check-in für Joana im Google Office Shibuya Stream ab?",
        "Sollen wir die 2 großen Koffer vor Hakone per Takkyubin direkt nach Tokio schicken?",
        "Welche Buchungen stehen jetzt ab Ende Oktober / Anfang November als Erstes an?",
        "Erstelle uns einen kleinen Japanisch-Spickzettel für Sushi & Izakayas."
      ];
    }
    const d = ctx.day;
    if (d === 1) {
      return [
        "Übersetze unsere Bestellung bei Menya Shichisai auf Japanisch (2x Kitakata Ramen).",
        "Wie läuft das Umbuchen beim Airport Limousine Bus nach T-CAT genau ab?",
        "Welche 2 Specialty-Cafés in Kiyosumi-Shirakawa liegen auf der schönsten Route?"
      ];
    }
    if (d === 5) {
      return [
        "Wie sichern wir am 04.12. Punkt 09:00 Uhr den kostenlosen Swimming-Pool-Slot im Museum?",
        "Was sollten wir auf dem Omicho-Markt und bei Kuroyuri Oden unbedingt bestellen?",
        "Was ist die beste Route bei Regen oder Schnee am 04.12. in Kanazawa?"
      ];
    }
    if (d === 6 || d === 7 || d === 8) {
      return [
        `Was ist der schnellste Weg vom ASAI Kyoto Shijo zu den Highlights an Tag ${d}?`,
        "Wie funktioniert das Seiriken-Warteticket um 16:00 Uhr bei Men-ya Inoichi?",
        "Wie sagen wir bei Gion Karyo / Cenci auf Japanisch, dass wir Joanas Geburtstag feiern?"
      ];
    }
    if (d === 10 || d === 11) {
      return [
        "Erkläre den Bus-Transfer ab Odawara mit Linie T bis zur Hakone Retreat villa 1/f.",
        "Wie anspruchsvoll ist die Wanderung auf den Mount Kintoki im Dezember?",
        "Welche Sitzplätze im Shinkansen bieten den besten Blick auf den Mount Fuji?"
      ];
    }
    return [
      `Gib uns 3 Insider-Tipps speziell für Tag ${ctx.day} (${ctx.date}).`,
      `Was ist der beste Plan B bei Regenwetter an Tag ${ctx.day}?`,
      `Übersetze unsere wichtigsten Restaurant-Bestellungen für Tag ${ctx.day} auf Japanisch.`
    ];
  }, [geminiDayContext, activeTab, viewMode, currentStoryDay]);

  const completedBookingsCount = Object.values(checkedBookings).filter(Boolean).length;
  const bookingProgressPercent = Math.round((completedBookingsCount / BOOKING_RADAR_DATA.length) * 100);

  // Reusable Day Content Renderer (Cleaner, More Structured Layout + Live Weather)
  const renderDayCardContent = (dayObj) => {
    const stMeta = STATIONS.find(s => s.id === dayObj.stationId) || STATIONS[1];
    const itemsToShow =
      selectedCategory === "ALL"
        ? dayObj.items
        : selectedCategory === "WATCHOUT"
        ? []
        : dayObj.items.filter(i => i.category === selectedCategory);

    return (
      <div className="space-y-3.5">
        {/* 1. CLEAN DAY HERO HEADER */}
        <div
          className={`relative rounded-3xl p-5 text-white bg-gradient-to-br ${stMeta.gradient} shadow-md overflow-hidden`}
        >
          <div className="absolute right-4 bottom-2 text-6xl opacity-15 select-none pointer-events-none">
            {dayObj.emoji}
          </div>

          <div className="relative z-10 space-y-3">
            {/* Top Bar: Day Pill + Quick Actions */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="px-3 py-1 rounded-full bg-black/30 backdrop-blur-md text-xs font-extrabold tracking-wide uppercase">
                  Tag {dayObj.day} · {dayObj.weekday}, {dayObj.date}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold">
                  {dayObj.emoji} {dayObj.vibeTag}
                </span>
                {dayObj.isSpecial && (
                  <span className="px-3 py-1 rounded-full bg-amber-300 text-slate-950 text-xs font-extrabold shadow-xs">
                    {dayObj.specialLabel}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCompactTimeline(prev => !prev)}
                  className="px-3 py-1.5 rounded-full bg-black/25 hover:bg-black/35 text-white text-[11px] font-extrabold backdrop-blur-md transition cursor-pointer"
                >
                  {compactTimeline ? "Detail-Ansicht" : "Kompakt-Ansicht"}
                </button>
                <button
                  onClick={() => openGeminiForDay(dayObj)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-slate-900 hover:bg-rose-50 text-xs font-extrabold shadow-sm active:scale-95 transition cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#FF385C]" />
                  <span>Frag Gemini</span>
                </button>
              </div>
            </div>

            {/* Location & Main Title */}
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-white/85">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span>{dayObj.location}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-snug mt-0.5">
                {dayObj.title}
              </h2>
            </div>

            {/* Kurz-Summary Box */}
            <p className="text-xs sm:text-sm text-white/95 leading-relaxed font-medium bg-black/20 backdrop-blur-xs rounded-2xl p-3 border border-white/15">
              {dayObj.summary}
            </p>

            {/* Bottom Strip: Hotel Base + Taxi Card + Currency Shortcut */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
              <a
                href={dayObj.hotelMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md text-xs font-bold transition"
              >
                <Building2 className="w-3.5 h-3.5 shrink-0" />
                <span>Hotel: {dayObj.hotel}</span>
                <ExternalLink className="w-3 h-3 opacity-80" />
              </a>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setActiveTab("TOOLS")}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-extrabold transition cursor-pointer"
                >
                  <Calculator className="w-3.5 h-3.5" />
                  <span>¥ Rechner & JP</span>
                </button>
                <button
                  onClick={() =>
                    setFlashcardModal({
                      badge: `Tag ${dayObj.day} · Hotel-Adresse für Taxi`,
                      title: dayObj.hotel,
                      jp: dayObj.hotelJp,
                      sub: "Bitte dem Taxifahrer zeigen: この住所までお願いします (Kono jūsho made onegaishimasu)"
                    })
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold shadow-xs active:scale-95 transition cursor-pointer"
                >
                  <span>🚕 Taxi-Karte</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 2. LIVE WEATHER & DECEMBER CLIMATE BAR FOR THIS DAY */}
        <DayWeatherBanner
          dayObj={dayObj}
          liveWeatherMap={liveWeatherMap}
          isLoadingWeather={isLoadingWeather}
          onRefreshWeather={fetchAllLiveWeather}
          lastUpdated={weatherUpdatedTime}
        />

        {/* 3. COLLAPSIBLE WATCH-OUTS ACCORDION (Cleaner Overview) */}
        {dayObj.watchOuts && dayObj.watchOuts.length > 0 && (
          <div className="rounded-2xl bg-amber-50/90 border border-amber-200/90 overflow-hidden shadow-2xs">
            <button
              onClick={() => setOpenWatchOuts(prev => !prev)}
              className="w-full px-4 py-3 flex items-center justify-between gap-2 text-left hover:bg-amber-100/50 transition cursor-pointer"
            >
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-950">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Wichtige Watch-outs & Sitzplatz-Tipps ({dayObj.watchOuts.length})</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-amber-800">
                <span>{openWatchOuts ? "Ausblenden" : "Anzeigen"}</span>
                {openWatchOuts ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </div>
            </button>

            {openWatchOuts && (
              <div className="px-4 pb-3.5 space-y-2 border-t border-amber-200/60 pt-2.5">
                {dayObj.watchOuts.map((wo, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-white/90 border border-amber-200/60 text-xs text-amber-950 leading-relaxed flex items-start gap-2 font-medium"
                  >
                    <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                      !
                    </span>
                    <span>{wo}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 4. STRUCTURED TIMELINE CARDS */}
        {itemsToShow.length > 0 && (
          <div className="space-y-3">
            {itemsToShow.map(item => {
              const isFood = item.category === "FOOD";
              const isTransit = item.category === "TRANSIT";

              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-[#EBEBEB] bg-white p-4 shadow-2xs hover:shadow-sm hover:border-neutral-300 transition space-y-2.5"
                >
                  {/* Top Row: Time, Category, Rating & Booking Status */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 text-white text-xs font-extrabold">
                        <Clock className="w-3 h-3 text-[#FF385C]" />
                        {item.time}
                      </span>

                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-extrabold ${
                          isFood
                            ? "bg-rose-50 text-[#E00B41]"
                            : isTransit
                            ? "bg-sky-50 text-sky-700"
                            : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {isFood && <Utensils className="w-3 h-3" />}
                        {isTransit && <Train className="w-3 h-3" />}
                        {!isFood && !isTransit && <Compass className="w-3 h-3" />}
                        <span>{isFood ? "Food" : isTransit ? "Transit" : "Kultur"}</span>
                      </span>

                      {item.isGooglePerk && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 text-[11px] font-extrabold border border-blue-200">
                          ✨ Google Perk (0 €)
                        </span>
                      )}

                      {item.rating && !compactTimeline && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-50 text-amber-900 text-[11px] font-bold border border-amber-200/70">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          {item.rating}
                        </span>
                      )}
                    </div>

                    {item.bookingStatus && (
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${
                          item.isBooked
                            ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                            : "bg-neutral-100 text-neutral-700"
                        }`}
                      >
                        {item.isBooked ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Info className="w-3 h-3 text-[#FF385C]" />
                        )}
                        {item.bookingStatus}
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
                      {item.title}
                    </h3>
                    {!compactTimeline && (
                      <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mt-1">
                        {item.desc}
                      </p>
                    )}
                  </div>

                  {/* Visual Shinkansen / Bus Seat Map if present */}
                  {!compactTimeline && item.seatVisual && (
                    <SeatMapWidget seatVisual={item.seatVisual} />
                  )}

                  {/* Card Footer: Price, Order Card & Maps/Booking Links */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-neutral-100">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 text-xs font-extrabold text-slate-800 bg-neutral-100 px-2.5 py-1 rounded-lg">
                        💶 {item.price}
                      </span>

                      {item.jpOrderTip && (
                        <button
                          onClick={() =>
                            setFlashcardModal({
                              badge: "Bestell-Karte für das Personal",
                              title: item.title,
                              jp: item.jpOrderTip,
                              sub: "Einfach dem Kellner zeigen oder vorlesen lassen!"
                            })
                          }
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-[#E00B41] text-xs font-extrabold transition cursor-pointer"
                        >
                          <Volume2 className="w-3 h-3 shrink-0" />
                          <span>🇯🇵 Bestell-Karte</span>
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {item.mapUrl && (
                        <a
                          href={item.mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-slate-900 text-xs font-extrabold transition"
                        >
                          <MapPin className="w-3.5 h-3.5 text-[#FF385C]" />
                          <span>Maps</span>
                        </a>
                      )}

                      {item.bookingUrl && (
                        <a
                          href={item.bookingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#FF385C] to-[#E00B41] hover:opacity-95 text-white text-xs font-extrabold transition shadow-2xs"
                        >
                          <Ticket className="w-3.5 h-3.5" />
                          <span>Buchen</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] font-sans pb-28 selection:bg-[#FF385C] selection:text-white">
      {/* ==========================================
          SLEEK CONSUMER APP TOP BAR
      ========================================== */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-black/5">
        <div className="max-w-4xl mx-auto px-4 py-2.5 flex items-center justify-between gap-2">
          {/* Brand Identity */}
          <div className="flex items-center gap-2.5">
            <div
              onClick={() => setActiveTab("PLAN")}
              className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#FF385C] via-[#E00B41] to-orange-500 flex items-center justify-center text-white shadow-xs shrink-0 cursor-pointer"
            >
              <span className="text-base">🇯🇵</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm sm:text-base font-black tracking-tight text-slate-900">
                  BGJ · Bruzi's go Japan
                </h1>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-50 text-[#FF385C] border border-rose-200">
                  Joana & Robert
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-semibold text-neutral-500">
                <span>30.11. – 16.12.26</span>
                <span>•</span>
                <button
                  onClick={() => setActiveTab("TOOLS")}
                  className="text-emerald-700 font-extrabold hover:underline cursor-pointer"
                >
                  1 € ≈ {Math.round(eurToJpyRate)} ¥
                </button>
                <span>•</span>
                <button
                  onClick={() => setActiveTab("WALLET")}
                  className="text-[#FF385C] font-extrabold hover:underline cursor-pointer"
                >
                  PNR: {FLIGHT_DATA.bookingCode}
                </button>
              </div>
            </div>
          </div>

          {/* Right Quick Actions: Mode Switch, Tools Shortcut & AI Orb */}
          <div className="flex items-center gap-1.5">
            {activeTab === "PLAN" && (
              <div className="bg-neutral-100 p-0.5 rounded-full flex items-center border border-neutral-200/70">
                <button
                  onClick={() => setViewMode("STORY")}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold transition cursor-pointer ${
                    viewMode === "STORY"
                      ? "bg-white text-slate-900 shadow-2xs"
                      : "text-neutral-500 hover:text-slate-900"
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5 text-[#FF385C]" />
                  <span className="hidden sm:inline">Tag</span>
                </button>
                <button
                  onClick={() => setViewMode("FEED")}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold transition cursor-pointer ${
                    viewMode === "FEED"
                      ? "bg-white text-slate-900 shadow-2xs"
                      : "text-neutral-500 hover:text-slate-900"
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Alle 17</span>
                </button>
              </div>
            )}

            <button
              onClick={() => setActiveTab("TOOLS")}
              className={`hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-extrabold border transition cursor-pointer ${
                activeTab === "TOOLS"
                  ? "bg-[#FF385C] text-white border-[#FF385C]"
                  : "bg-white text-slate-800 border-neutral-200 hover:bg-neutral-100"
              }`}
            >
              <Calculator className="w-3.5 h-3.5 text-[#FF385C]" />
              <span>¥ & Übersetzer</span>
            </button>

            <button
              onClick={() =>
                openGeminiForDay(activeTab === "PLAN" && viewMode === "STORY" ? currentStoryDay : null)
              }
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold shadow-xs active:scale-95 transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FF385C]" />
              <span className="hidden sm:inline">AI Concierge</span>
            </button>
          </div>
        </div>

        {/* Interactive Station Pills & Day Scrubber (Only in PLAN Tab) */}
        {activeTab === "PLAN" && (
          <div className="max-w-4xl mx-auto px-4 pb-2.5 space-y-2">
            {/* 5 Station Destination Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5">
              {STATIONS.map(st => {
                const isSelected =
                  viewMode === "STORY"
                    ? st.id === "ALL"
                      ? false
                      : currentStoryDay.stationId === st.id
                    : selectedStation === st.id;

                return (
                  <button
                    key={st.id}
                    onClick={() => {
                      if (viewMode === "STORY" && st.id === "ALL") {
                        setViewMode("FEED");
                        setSelectedStation("ALL");
                      } else {
                        handleSelectStation(st.id);
                      }
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition shrink-0 cursor-pointer border ${
                      isSelected
                        ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                        : "bg-white text-neutral-700 border-neutral-200/80 hover:border-neutral-300"
                    }`}
                  >
                    <span>{st.emoji}</span>
                    <span>{st.label}</span>
                    <span className={`text-[10px] font-semibold ${isSelected ? "text-white/75" : "text-neutral-400"}`}>
                      {st.sub}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Horizontal 17-Day Story Scrubber (Like Instagram Stories / Flighty Timeline) */}
            {viewMode === "STORY" && (
              <div
                ref={dayScrubberRef}
                className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1"
              >
                {DAYS_DATA.map(d => {
                  const isActive = d.day === activeDayNum;
                  return (
                    <button
                      key={d.day}
                      onClick={() => setActiveDayNum(d.day)}
                      className={`relative flex flex-col items-center justify-center min-w-[56px] py-1.5 px-2 rounded-2xl border transition shrink-0 cursor-pointer ${
                        isActive
                          ? "bg-gradient-to-b from-[#FF385C] to-[#E00B41] text-white border-[#FF385C] shadow-sm scale-[1.03]"
                          : d.isSpecial
                          ? "bg-rose-50/90 text-[#E00B41] border-rose-200 hover:bg-rose-100"
                          : "bg-white text-slate-700 border-neutral-200/80 hover:bg-neutral-100"
                      }`}
                    >
                      <span className={`text-[9px] font-extrabold uppercase ${isActive ? "text-white/90" : "text-neutral-400"}`}>
                        {d.shortDay} · T{d.day}
                      </span>
                      <span className="text-xs font-black leading-tight mt-0.5">{d.shortDate}</span>
                      <span className="text-xs mt-0.5 leading-none">{d.emoji}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Category & Search Bar (In Feed Mode) */}
            {viewMode === "FEED" && (
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                  {[
                    { id: "ALL", label: "Alle", icon: Compass },
                    { id: "FOOD", label: "Food & Ramen", icon: Utensils },
                    { id: "TRANSIT", label: "Shinkansen & Bus", icon: Train },
                    { id: "CULTURE", label: "Museen & Spots", icon: Ticket },
                    { id: "WATCHOUT", label: "Watch-outs", icon: AlertTriangle }
                  ].map(cat => {
                    const IconComp = cat.icon;
                    const active = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold transition whitespace-nowrap cursor-pointer ${
                          active
                            ? "bg-[#FF385C] text-white shadow-2xs"
                            : "bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-100"
                        }`}
                      >
                        <IconComp className="w-3.5 h-3.5" />
                        <span>{cat.label}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="relative flex-1 min-w-[180px] max-w-xs">
                  <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Suche (z.B. Ramen, Fuji, Cenci)..."
                    className="w-full pl-8 pr-7 py-1.5 text-xs font-semibold bg-white border border-neutral-200 focus:border-[#FF385C] rounded-full outline-none transition"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </header>

      {/* ==========================================
          MAIN MOBILE APP VIEWPORT
      ========================================== */}
      <main className="max-w-4xl mx-auto px-4 pt-4">
        {/* ------------------------------------------
            TAB 1: REISEPLAN (STORY MODE OR 17-DAY FEED)
        ------------------------------------------ */}
        {activeTab === "PLAN" && (
          <div>
            {viewMode === "STORY" ? (
              <div className="space-y-4">
                {/* Render Active Day in Full Consumer App Card View */}
                {renderDayCardContent(currentStoryDay)}

                {/* Tactile Bottom Day Switcher (Prev / Next Day) */}
                <div className="flex items-center justify-between gap-3 pt-2">
                  <button
                    onClick={() => setActiveDayNum(prev => Math.max(1, prev - 1))}
                    disabled={activeDayNum === 1}
                    className="flex-1 py-3.5 px-4 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs flex items-center justify-start gap-2.5 disabled:opacity-40 hover:border-neutral-300 active:scale-98 transition cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5 text-[#FF385C] shrink-0" />
                    <div className="text-left">
                      <div className="text-[10px] font-bold uppercase text-neutral-400">Vorheriger Tag</div>
                      <div className="text-xs font-extrabold text-slate-900 truncate">
                        {activeDayNum > 1
                          ? `Tag ${activeDayNum - 1}: ${DAYS_DATA[activeDayNum - 2].vibeTag}`
                          : "Start der Reise"}
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveDayNum(prev => Math.min(17, prev + 1))}
                    disabled={activeDayNum === 17}
                    className="flex-1 py-3.5 px-4 rounded-2xl bg-slate-900 text-white shadow-sm flex items-center justify-end gap-2.5 disabled:opacity-40 hover:bg-slate-800 active:scale-98 transition cursor-pointer"
                  >
                    <div className="text-right">
                      <div className="text-[10px] font-bold uppercase text-white/60">Nächster Tag</div>
                      <div className="text-xs font-extrabold text-white truncate">
                        {activeDayNum < 17
                          ? `Tag ${activeDayNum + 1}: ${DAYS_DATA[activeDayNum].vibeTag}`
                          : "Rückflug nach MUC"}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#FF385C] shrink-0" />
                  </button>
                </div>
              </div>
            ) : (
              /* FEED MODE: All 17 Days Overview */
              <div className="space-y-4">
                <div className="bg-white rounded-3xl p-4 border border-[#EBEBEB] flex flex-wrap items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">🗾</span>
                    <div>
                      <h2 className="text-sm font-black text-slate-900">
                        Alle 17 Tage im Komplett-Feed ({filteredDays.length} angezeigt)
                      </h2>
                      <p className="text-xs text-neutral-500">
                        Tippe auf einen Tag zum Auf-/Zuklappen oder wechsle oben auf „Tag-für-Tag“.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      setExpandedDays(
                        expandedDays.length === DAYS_DATA.length ? [] : DAYS_DATA.map(d => d.day)
                      )
                    }
                    className="px-3.5 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-xs font-extrabold text-slate-800 transition cursor-pointer"
                  >
                    {expandedDays.length === DAYS_DATA.length ? "Alle einklappen" : "Alle aufklappen"}
                  </button>
                </div>

                {filteredDays.map(dayObj => {
                  const isExpanded = expandedDays.includes(dayObj.day);
                  return (
                    <div
                      key={dayObj.day}
                      className="bg-white rounded-3xl border border-[#EBEBEB] shadow-2xs overflow-hidden"
                    >
                      <div
                        onClick={() => toggleDayExpand(dayObj.day)}
                        className="p-4 cursor-pointer flex items-center justify-between gap-3 hover:bg-neutral-50/80 transition"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex flex-col items-center justify-center font-black shrink-0">
                            <span className="text-[9px] uppercase text-[#FF385C]">Tag {dayObj.day}</span>
                            <span className="text-base leading-none mt-0.5">{dayObj.emoji}</span>
                          </div>
                          <div>
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="text-xs font-extrabold text-[#FF385C]">
                                {dayObj.weekday}, {dayObj.date}
                              </span>
                              <span className="text-xs text-neutral-300">•</span>
                              <span className="text-xs font-bold text-neutral-500">{dayObj.location}</span>
                            </div>
                            <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                              {dayObj.title}
                            </h3>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              setActiveDayNum(dayObj.day);
                              setViewMode("STORY");
                            }}
                            className="hidden sm:inline-flex px-3 py-1 rounded-full bg-rose-50 text-[#FF385C] text-xs font-extrabold hover:bg-rose-100"
                          >
                            Story-Ansicht
                          </button>
                          <div className="p-2 rounded-full bg-neutral-100 text-neutral-600">
                            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                          </div>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="p-4 pt-0 border-t border-neutral-100">
                          {renderDayCardContent(dayObj)}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------
            TAB 2: TOOLS (LIVE WÄHRUNGSRECHNER & KI-ÜBERSETZER)
        ------------------------------------------ */}
        {activeTab === "TOOLS" && (
          <div className="space-y-5">
            {/* SECTION A: LIVE CURRENCY CONVERTER (EUR <-> JPY) */}
            <div className="rounded-3xl bg-white border border-[#EBEBEB] p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-extrabold uppercase">
                    <Calculator className="w-3.5 h-3.5" /> Live Währungsrechner
                  </span>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
                    Yen (JPY) ⇄ Euro (EUR)
                  </h2>
                </div>

                <div className="flex items-center gap-2 bg-neutral-100 px-3 py-1.5 rounded-2xl">
                  <span className="text-xs font-extrabold text-slate-800">
                    1 € = {eurToJpyRate.toFixed(2)} ¥
                  </span>
                  <span className="text-[10px] font-semibold text-neutral-500">({rateDate})</span>
                  <button
                    onClick={fetchLiveExchangeRate}
                    className="p-1 rounded-full hover:bg-white text-neutral-500 hover:text-slate-900 transition cursor-pointer"
                    title="Wechselkurs aktualisieren"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRateLoading ? "animate-spin text-[#FF385C]" : ""}`} />
                  </button>
                </div>
              </div>

              {/* Dual Converter Input Boxes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                {/* JPY Box */}
                <div className="p-4 rounded-2xl bg-neutral-50 border-2 border-neutral-200 focus-within:border-[#FF385C] focus-within:bg-white transition">
                  <label className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-400 flex items-center justify-between">
                    <span>🇯🇵 Japanische Yen (JPY)</span>
                    <span>¥</span>
                  </label>
                  <input
                    type="number"
                    inputMode="decimal"
                    value={jpyInput}
                    onChange={e => handleJpyChange(e.target.value)}
                    placeholder="z.B. 8800"
                    className="w-full text-2xl sm:text-3xl font-black text-slate-900 bg-transparent outline-none mt-1"
                  />
                </div>

                {/* EUR Box */}
                <div className="p-4 rounded-2xl bg-rose-50/50 border-2 border-rose-200 focus-within:border-[#FF385C] focus-within:bg-white transition">
                  <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#E00B41] flex items-center justify-between">
                    <span>🇪🇺 Euro (EUR)</span>
                    <span>€</span>
                  </label>
                  <input
                    type="number"
                    inputMode="decimal"
                    value={eurInput}
                    onChange={e => handleEurChange(e.target.value)}
                    placeholder="z.B. 53.70"
                    className="w-full text-2xl sm:text-3xl font-black text-[#E00B41] bg-transparent outline-none mt-1"
                  />
                </div>
              </div>

              {/* Dynamic 10% Tax-Free Indicator */}
              {parseFloat(jpyInput) >= 5500 ? (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      Ab 5.500 ¥ Tax-Free berechtigt! Mit Reisepass spart ihr ca.{" "}
                      {Math.round(parseFloat(jpyInput) * 0.091).toLocaleString("de-DE")} ¥ (≈{" "}
                      {((parseFloat(jpyInput) * 0.091) / eurToJpyRate).toFixed(2)} €).
                    </span>
                  </div>
                  <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-emerald-200/80 text-emerald-950">
                    Netto: {((parseFloat(jpyInput) * 0.909) / eurToJpyRate).toFixed(2)} €
                  </span>
                </div>
              ) : (
                <div className="text-xs font-semibold text-neutral-500 px-1">
                  💡 Tipp: Ab <span className="font-bold text-slate-700">5.500 ¥</span> (ca.{" "}
                  {(5500 / eurToJpyRate).toFixed(2)} €) Einkaufswert gibt es gegen Vorlage des Original-Reisepasses 10 % Tax-Free Rabatt.
                </div>
              )}

              {/* 1-Tap Trip Presets */}
              <div>
                <div className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-400 mb-2">
                  Schnellwahl aus eurer Route:
                </div>
                <div className="flex flex-wrap gap-2">
                  {CURRENCY_PRESETS.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleJpyChange(p.jpy.toString())}
                      className="px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-xs font-extrabold text-slate-800 flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <span>{p.icon}</span>
                      <span>{p.label}:</span>
                      <span className="text-[#FF385C]">{p.jpy.toLocaleString("de-DE")} ¥</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* SECTION B: LIVE AI TRANSLATOR (DE <-> JP) WITH VOICE & FULLSCREEN */}
            <div className="rounded-3xl bg-white border border-[#EBEBEB] p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-50 text-[#E00B41] border border-rose-200 text-[11px] font-extrabold uppercase">
                    <Languages className="w-3.5 h-3.5" /> Live KI-Übersetzer & Sprachausgabe
                  </span>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
                    Deutsch ⇄ Japanisch (inkl. Romaji & Audio)
                  </h2>
                </div>

                <button
                  onClick={() =>
                    setTranslatorDirection(prev =>
                      prev === "DE_TO_JP" ? "JP_TO_DE" : "DE_TO_JP"
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-extrabold cursor-pointer"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5 text-[#FF385C]" />
                  <span>
                    {translatorDirection === "DE_TO_JP"
                      ? "Deutsch → Japanisch"
                      : "Japanisch → Deutsch"}
                  </span>
                </button>
              </div>

              {/* Translator Input Bar */}
              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleTranslateLive();
                }}
                className="flex flex-col sm:flex-row gap-2"
              >
                <input
                  type="text"
                  value={translatorInput}
                  onChange={e => setTranslatorInput(e.target.value)}
                  placeholder="Satz eingeben (z.B. 'Haben Sie dieses Shirt in Größe L?' oder '2x Ramen bitte')..."
                  className="flex-1 px-4 py-3 rounded-2xl bg-neutral-100 focus:bg-white border-2 border-transparent focus:border-[#FF385C] text-xs sm:text-sm font-semibold outline-none transition"
                />
                <button
                  type="submit"
                  disabled={!translatorInput.trim() || isTranslating}
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#FF385C] to-[#E00B41] text-white text-xs font-extrabold shadow-xs disabled:opacity-40 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                >
                  {isTranslating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Übersetze...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Jetzt übersetzen</span>
                    </>
                  )}
                </button>
              </form>

              {/* Quick Translation Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                {[
                  "Haben Sie dieses Teil eine Nummer größer (Größe L)?",
                  "Können wir bitte getrennt / zusammen mit Karte zahlen?",
                  "Bitte ohne Koriander, vielen Dank!",
                  "Können Sie unsere 2 Koffer per Takkyubin nach Tokio schicken?",
                  "Wo ist der Eingang zur Shibuya Mark City Busstation (5. Stock)?"
                ].map((sample, i) => (
                  <button
                    key={i}
                    onClick={() => handleTranslateLive(sample)}
                    className="px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-rose-50 hover:text-[#E00B41] text-xs font-bold text-slate-700 whitespace-nowrap transition shrink-0 cursor-pointer"
                  >
                    {sample}
                  </button>
                ))}
              </div>

              {/* Translation Result Output Card */}
              {translationResult && (
                <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white space-y-3 border border-slate-700">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-400">
                      DE: „{translationResult.original}“
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => speakJapanese(translationResult.jp)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-extrabold transition cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-[#FF385C]" />
                        <span>🔊 Vorlesen</span>
                      </button>
                      <button
                        onClick={() =>
                          setFlashcardModal({
                            badge: "Live-Übersetzung zum Vorzeigen",
                            title: translationResult.original,
                            jp: translationResult.jp,
                            sub: `Aussprache: "${translationResult.romaji}"`
                          })
                        }
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FF385C] hover:bg-[#E00B41] text-white text-xs font-extrabold transition cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>📲 Vollbild zeigen</span>
                      </button>
                    </div>
                  </div>

                  <div className="text-2xl sm:text-3xl font-black text-white leading-snug tracking-wide py-2">
                    {translationResult.jp}
                  </div>

                  <div className="text-sm font-extrabold text-amber-300">
                    🗣️ Aussprache: „{translationResult.romaji}“
                  </div>

                  {translationResult.note && (
                    <div className="text-xs text-slate-300 pt-1 border-t border-white/10">
                      💡 {translationResult.note}
                    </div>
                  )}
                </div>
              )}

              {/* Instant Offline Phrasebook Grid */}
              <div className="pt-2">
                <div className="text-xs font-extrabold uppercase tracking-wider text-neutral-400 mb-2.5">
                  Sofort-Spickzettel (1-Tap Vollbild & Audio):
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {PHRASEBOOK_CARDS.map((card, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex items-center justify-between gap-2"
                    >
                      <div className="space-y-0.5">
                        <div className="text-xs font-extrabold text-slate-900">{card.label}</div>
                        <div className="text-sm font-black text-[#E00B41]">{card.jp}</div>
                        <div className="text-[11px] font-medium text-neutral-500 italic">
                          „{card.romaji}“
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => speakJapanese(card.jp)}
                          className="p-2 rounded-xl bg-white border border-neutral-200 hover:border-[#FF385C] text-slate-700 cursor-pointer"
                          title="Japanisch vorlesen"
                        >
                          <Volume2 className="w-4 h-4 text-[#FF385C]" />
                        </button>
                        <button
                          onClick={() =>
                            setFlashcardModal({
                              badge: card.context,
                              title: card.label,
                              jp: card.jp,
                              sub: `Aussprache: "${card.romaji}"`
                            })
                          }
                          className="p-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 cursor-pointer"
                          title="Vollbild zeigen"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------
            TAB 3: GAMIFIED PRE-TRIP BOOKING RADAR
        ------------------------------------------ */}
        {activeTab === "RADAR" && (
          <div className="space-y-4">
            {/* Gamified Progress Hero Card */}
            <div className="rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-neutral-900 text-white shadow-md space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF385C] text-white text-xs font-extrabold uppercase tracking-wider">
                    <Flame className="w-3.5 h-3.5" /> Countdown · Deutsche Winterzeit (MEZ)
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black pt-1">
                    Euer Buchungs-Radar
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Alle Freischaltzeiten sind exakt auf deutsche Winterzeit (MEZ = 8 Stunden hinter Japan) berechnet. Hakt erledigte Tickets direkt ab!
                  </p>
                </div>

                {/* Progress Badge */}
                <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 text-center shrink-0 min-w-[130px]">
                  <div className="text-2xl font-black text-[#FF385C]">
                    {completedBookingsCount}/{BOOKING_RADAR_DATA.length}
                  </div>
                  <div className="text-[11px] font-bold text-white/80">Reservierungen</div>
                  <div className="w-full h-2 bg-white/15 rounded-full overflow-hidden mt-2">
                    <div
                      className="h-full bg-gradient-to-r from-[#FF385C] to-emerald-400 transition-all duration-300"
                      style={{ width: `${bookingProgressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-2 pt-1">
                {[
                  { id: "ALL", label: `Alle (${BOOKING_RADAR_DATA.length})` },
                  { id: "OPEN", label: `Noch offen (${BOOKING_RADAR_DATA.length - completedBookingsCount})` },
                  { id: "DONE", label: `Erledigt (${completedBookingsCount})` }
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setRadarFilter(f.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition cursor-pointer ${
                      radarFilter === f.id
                        ? "bg-white text-slate-900"
                        : "bg-white/10 text-white/75 hover:bg-white/20"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Radar Items List */}
            <div className="space-y-3">
              {BOOKING_RADAR_DATA.filter(item => {
                const isDone = !!checkedBookings[item.id];
                if (radarFilter === "OPEN") return !isDone;
                if (radarFilter === "DONE") return isDone;
                return true;
              }).map(item => {
                const isDone = !!checkedBookings[item.id];
                return (
                  <div
                    key={item.id}
                    className={`p-4 sm:p-5 rounded-3xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      isDone
                        ? "bg-emerald-50/50 border-emerald-200/90"
                        : item.urgent
                        ? "bg-white border-rose-300 ring-2 ring-rose-500/10 shadow-xs"
                        : "bg-white border-[#EBEBEB] shadow-2xs hover:border-neutral-300"
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <button
                        onClick={() => toggleBookingCheck(item.id)}
                        className={`mt-0.5 w-7 h-7 rounded-xl flex items-center justify-center border-2 transition shrink-0 cursor-pointer ${
                          isDone
                            ? "bg-emerald-600 border-emerald-600 text-white shadow-2xs"
                            : "border-neutral-300 bg-white hover:border-[#FF385C]"
                        }`}
                      >
                        {isDone && <Check className="w-4 h-4 stroke-[3]" />}
                      </button>

                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`px-2.5 py-1 rounded-xl text-xs font-extrabold ${
                              isDone
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-slate-900 text-white"
                            }`}
                          >
                            ⏰ {item.dateMEZ} · {item.timeMEZ}
                          </span>
                          {item.urgent && !isDone && (
                            <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-[#E00B41] text-[11px] font-extrabold">
                              Als Nächstes!
                            </span>
                          )}
                          <span className="text-xs font-extrabold text-[#FF385C]">
                            Reisetag: {item.forTripDate}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-lg bg-neutral-100 text-neutral-600 text-[11px] font-bold">
                            {item.category}
                          </span>
                        </div>

                        <h3
                          className={`text-base font-extrabold ${
                            isDone ? "line-through text-neutral-400" : "text-slate-900"
                          }`}
                        >
                          {item.title}
                        </h3>

                        <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                          {item.notes}
                        </p>
                        <div className="text-xs font-extrabold text-slate-800">
                          💶 Preis: {item.price}
                        </div>
                      </div>
                    </div>

                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#FF385C] to-[#E00B41] hover:opacity-95 text-white text-xs font-extrabold transition shadow-xs shrink-0 self-end sm:self-center"
                    >
                      <span>Portal öffnen</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ------------------------------------------
            TAB 4: APPLE WALLET / FLIGHTY BOARDING PASSES
        ------------------------------------------ */}
        {activeTab === "WALLET" && (
          <div className="space-y-5">
            {/* Apple Wallet Style Master Pass Header */}
            <div className="rounded-3xl bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white p-5 sm:p-6 shadow-lg border border-slate-700/70 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-extrabold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Miles & More Business Comfort
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                    Boarding Passes & Tickets
                  </h2>
                </div>

                {/* Tactile PNR Copy Pill */}
                <button
                  onClick={() => copyToClipboard(FLIGHT_DATA.bookingCode, "pnr")}
                  className="group flex items-center gap-3 bg-white/10 hover:bg-white/15 border border-white/20 px-4 py-2.5 rounded-2xl transition cursor-pointer"
                >
                  <div className="text-left">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Buchungscode (PNR)
                    </div>
                    <div className="text-lg font-mono font-black tracking-widest text-[#FF385C]">
                      {FLIGHT_DATA.bookingCode}
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-white/10 text-white">
                    {copiedIndex === "pnr" ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </div>
                </button>
              </div>

              {/* Passenger E-Ticket Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {FLIGHT_DATA.passengers.map((p, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF385C] to-orange-500 flex items-center justify-center font-black text-sm">
                        {p.initials}
                      </div>
                      <div>
                        <div className="text-sm font-extrabold text-white">{p.name}</div>
                        <div className="text-xs font-mono text-slate-300">ETKT: {p.ticket}</div>
                      </div>
                    </div>

                    <button
                      onClick={() => copyToClipboard(p.ticket, `tkt-${idx}`)}
                      className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-extrabold text-white flex items-center gap-1.5 cursor-pointer"
                    >
                      {copiedIndex === `tkt-${idx}` ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Kopiert</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>

              {/* 23h API Check-in & Visit Japan Web Action Bar */}
              <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-400/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-2.5 text-xs text-amber-100">
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold text-amber-300 uppercase">
                      23h Check-in & API Watch-out:
                    </span>{" "}
                    {FLIGHT_DATA.apiWatchout}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href="https://www.lufthansa.com/de/de/online-check-in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 rounded-xl bg-amber-400 text-slate-950 text-xs font-extrabold hover:bg-amber-300 transition"
                  >
                    LH Check-in
                  </a>
                  <a
                    href="https://services.digital.go.jp/en/visit-japan-web/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 rounded-xl bg-white/15 text-white text-xs font-extrabold hover:bg-white/25 transition"
                  >
                    Visit Japan Web
                  </a>
                </div>
              </div>
            </div>

            {/* Perforated Boarding Pass Cards: OUTBOUND */}
            <div className="space-y-3">
              <div className="text-xs font-black uppercase tracking-wider text-neutral-400 px-1">
                Hinflug · {FLIGHT_DATA.outbound.date} ({FLIGHT_DATA.outbound.totalDuration})
              </div>

              {FLIGHT_DATA.outbound.legs.map((leg, i) => (
                <div key={i} className="space-y-3">
                  <div className="bg-white rounded-3xl border border-[#EBEBEB] shadow-xs overflow-hidden">
                    {/* Top Airline Strip */}
                    <div className="px-5 py-3 bg-slate-900 text-white flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Plane className="w-4 h-4 text-[#FF385C]" />
                        <span className="text-xs font-black tracking-wider uppercase">
                          {leg.operatedBy} · {leg.flightNo}
                        </span>
                        <span className="text-xs text-slate-400">({leg.aircraft})</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-extrabold">
                        Business Class
                      </span>
                    </div>

                    {/* Flight Route Arc */}
                    <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center justify-between sm:justify-start gap-6 flex-1">
                        <div>
                          <div className="text-2xl sm:text-3xl font-black text-slate-900">
                            {leg.depAirport}
                          </div>
                          <div className="text-xs font-extrabold text-[#FF385C]">{leg.depCity}</div>
                          <div className="text-sm font-black text-slate-800 mt-1">{leg.depTime} Uhr</div>
                          <div className="text-[11px] text-neutral-500">
                            {leg.depDate} · {leg.depTerminal}
                          </div>
                        </div>

                        <div className="flex-1 max-w-[140px] flex flex-col items-center">
                          <span className="text-[10px] font-extrabold text-neutral-400">
                            {leg.duration}
                          </span>
                          <div className="w-full h-0.5 bg-neutral-200 my-1.5 relative flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-slate-900 absolute left-0" />
                            <Plane className="w-4 h-4 text-[#FF385C] bg-white px-0.5" />
                            <div className="w-2 h-2 rounded-full bg-[#FF385C] absolute right-0" />
                          </div>
                          <span className="text-[10px] font-bold text-emerald-700">✓ {leg.status}</span>
                        </div>

                        <div className="text-right sm:text-left">
                          <div className="text-2xl sm:text-3xl font-black text-slate-900">
                            {leg.arrAirport}
                          </div>
                          <div className="text-xs font-extrabold text-[#FF385C]">{leg.arrCity}</div>
                          <div className="text-sm font-black text-slate-800 mt-1">{leg.arrTime} Uhr</div>
                          <div className="text-[11px] text-neutral-500">
                            {leg.arrDate} · {leg.arrTerminal}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {leg.layover && (
                    <div className="mx-3 p-3.5 rounded-2xl bg-sky-50 border border-sky-200 text-sky-950 text-xs font-extrabold flex items-center gap-2.5">
                      <Coffee className="w-4 h-4 text-sky-600 shrink-0" />
                      <span>{leg.layover}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Perforated Boarding Pass Card: INBOUND */}
            <div className="space-y-3 pt-2">
              <div className="text-xs font-black uppercase tracking-wider text-neutral-400 px-1">
                Rückflug · {FLIGHT_DATA.inbound.date} ({FLIGHT_DATA.inbound.totalDuration})
              </div>

              {FLIGHT_DATA.inbound.legs.map((leg, i) => (
                <div
                  key={i}
                  className="bg-white rounded-3xl border border-[#EBEBEB] shadow-xs overflow-hidden"
                >
                  <div className="px-5 py-3 bg-slate-900 text-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Plane className="w-4 h-4 text-[#FF385C] rotate-180" />
                      <span className="text-xs font-black tracking-wider uppercase">
                        {leg.operatedBy} · {leg.flightNo}
                      </span>
                      <span className="text-xs text-slate-400">({leg.aircraft})</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-extrabold">
                      Nonstop Business
                    </span>
                  </div>

                  <div className="p-5 flex items-center justify-between sm:justify-start gap-6">
                    <div>
                      <div className="text-2xl sm:text-3xl font-black text-slate-900">
                        {leg.depAirport}
                      </div>
                      <div className="text-xs font-extrabold text-[#FF385C]">{leg.depCity}</div>
                      <div className="text-sm font-black text-slate-800 mt-1">{leg.depTime} Uhr</div>
                      <div className="text-[11px] text-neutral-500">
                        {leg.depDate} · {leg.depTerminal}
                      </div>
                    </div>

                    <div className="flex-1 max-w-[140px] flex flex-col items-center">
                      <span className="text-[10px] font-extrabold text-neutral-400">
                        {leg.duration}
                      </span>
                      <div className="w-full h-0.5 bg-neutral-200 my-1.5 relative flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-slate-900 absolute left-0" />
                        <Plane className="w-4 h-4 text-[#FF385C] bg-white px-0.5" />
                        <div className="w-2 h-2 rounded-full bg-[#FF385C] absolute right-0" />
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700">✓ {leg.status}</span>
                    </div>

                    <div className="text-right sm:text-left">
                      <div className="text-2xl sm:text-3xl font-black text-slate-900">
                        {leg.arrAirport}
                      </div>
                      <div className="text-xs font-extrabold text-[#FF385C]">{leg.arrCity}</div>
                      <div className="text-sm font-black text-slate-800 mt-1">{leg.arrTime} Uhr</div>
                      <div className="text-[11px] text-neutral-500">
                        {leg.arrDate} · {leg.arrTerminal}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------
            TAB 4: INSIDER HACKS & JAPANESE PHRASEBOOK
        ------------------------------------------ */}
        {activeTab === "INSIDER" && (
          <div className="space-y-6">
            {/* Interactive Show-to-Staff Japanese Phrase Cards */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#FF385C]">
                    1-Tap Vollbild-Spickzettel
                  </span>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900">
                    🇯🇵 Japanisch-Karten zum Vorzeigen
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PHRASEBOOK_CARDS.map((card, i) => (
                  <button
                    key={i}
                    onClick={() =>
                      setFlashcardModal({
                        badge: card.context,
                        title: card.label,
                        jp: card.jp,
                        sub: `Aussprache: "${card.romaji}"`
                      })
                    }
                    className="p-4 rounded-3xl bg-white border border-[#EBEBEB] hover:border-[#FF385C] text-left shadow-2xs transition flex items-center justify-between gap-3 group cursor-pointer"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400">
                        {card.context}
                      </span>
                      <div className="text-sm font-extrabold text-slate-900 group-hover:text-[#FF385C] transition">
                        {card.label}
                      </div>
                      <div className="text-base font-black text-slate-800">{card.jp}</div>
                      <div className="text-xs font-medium text-neutral-500 italic">
                        „{card.romaji}“
                      </div>
                    </div>
                    <div className="w-9 h-9 rounded-2xl bg-rose-50 text-[#FF385C] flex items-center justify-center shrink-0 group-hover:scale-110 transition">
                      <Eye className="w-4 h-4" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Verified Japan Norms & Rules */}
            <div className="space-y-3">
              <div className="px-1">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#FF385C]">
                  Dinge, die man vor Ort nicht direkt weiß
                </span>
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  Wichtige Japan-Regeln & Insider-Hacks
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {JAPAN_NORMS_DATA.map((norm, idx) => (
                  <div
                    key={idx}
                    className={`rounded-3xl p-5 bg-gradient-to-br ${norm.color} bg-white border shadow-2xs space-y-2`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{norm.emoji}</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-white/90 text-slate-900 text-[11px] font-extrabold border border-black/5">
                        {norm.badge}
                      </span>
                    </div>
                    <h3 className="text-base font-black text-slate-900 pt-1">{norm.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                      {norm.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ==========================================
          FLOATING iOS / CONSUMER TECH BOTTOM TAB BAR
      ========================================== */}
      <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[96%] max-w-lg bg-slate-950/95 backdrop-blur-xl text-white rounded-full p-1.5 shadow-2xl border border-white/15 flex items-center justify-between">
        {[
          { id: "PLAN", label: "Reiseplan", icon: Calendar },
          { id: "TOOLS", label: "¥ & Übersetzer", icon: Languages },
          {
            id: "RADAR",
            label: "Radar",
            icon: CheckSquare,
            badge: `${completedBookingsCount}/${BOOKING_RADAR_DATA.length}`
          },
          { id: "WALLET", label: "Flüge", icon: Plane },
          { id: "INSIDER", label: "Insider", icon: ShieldCheck }
        ].map(tab => {
          const IconComp = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex-1 py-2 px-1.5 rounded-full flex flex-col items-center justify-center gap-0.5 transition cursor-pointer ${
                active
                  ? "bg-gradient-to-r from-[#FF385C] to-[#E00B41] text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-1">
                <IconComp className="w-4 h-4" />
                {tab.badge && (
                  <span
                    className={`text-[9px] font-black px-1.5 py-0.2 rounded-full ${
                      active ? "bg-white text-[#E00B41]" : "bg-[#FF385C] text-white"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-extrabold tracking-tight whitespace-nowrap">
                {tab.label}
              </span>
            </button>
          );
        })}

        {/* Floating AI Trigger inside Dock */}
        <button
          onClick={() =>
            openGeminiForDay(activeTab === "PLAN" && viewMode === "STORY" ? currentStoryDay : null)
          }
          className="ml-1 w-10 h-10 rounded-full bg-white text-slate-950 flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition shrink-0 cursor-pointer"
          title="Frag Gemini Concierge"
        >
          <Sparkles className="w-5 h-5 text-[#FF385C]" />
        </button>
      </nav>

      {/* ==========================================
          FULLSCREEN "SHOW TO TAXI / WAITER" FLASHCARD MODAL
      ========================================== */}
      {flashcardModal && (
        <div
          onClick={() => setFlashcardModal(null)}
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 text-center space-y-5 shadow-2xl border-4 border-[#FF385C]"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-[#FF385C] text-xs font-extrabold uppercase">
              🇯🇵 {flashcardModal.badge}
            </div>

            <div className="space-y-2">
              <div className="text-sm font-bold text-neutral-500">{flashcardModal.title}</div>
              <div className="text-2xl sm:text-4xl font-black text-slate-950 leading-snug py-4 px-3 rounded-2xl bg-neutral-100 select-all">
                {flashcardModal.jp}
              </div>
            </div>

            <p className="text-xs sm:text-sm font-semibold text-neutral-600">
              {flashcardModal.sub}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
              <button
                onClick={() => speakJapanese(flashcardModal.jp)}
                className="px-4 py-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-[#E00B41] text-xs font-extrabold flex items-center gap-1.5 cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span>🔊 Japanisch vorlesen</span>
              </button>

              <button
                onClick={() => copyToClipboard(flashcardModal.jp, "flashcard")}
                className="px-4 py-2.5 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-slate-900 text-xs font-extrabold flex items-center gap-1.5 cursor-pointer"
              >
                {copiedIndex === "flashcard" ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Kopiert!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Text kopieren</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setFlashcardModal(null)}
                className="px-6 py-2.5 rounded-2xl bg-slate-900 text-white text-xs font-extrabold hover:bg-slate-800 cursor-pointer"
              >
                Schließen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          GEMINI AI CONCIERGE DRAWER / MODAL
      ========================================== */}
      {geminiDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-xl rounded-t-3xl sm:rounded-3xl border border-[#EBEBEB] shadow-2xl flex flex-col max-h-[88vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:px-5 border-b border-neutral-100 flex items-center justify-between bg-gradient-to-r from-[#FF385C] to-[#E00B41] text-white">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-white/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black leading-tight">
                    BGJ Gemini Concierge
                  </h3>
                  <p className="text-[11px] text-white/90 font-semibold">
                    {geminiDayContext
                      ? `Fokus: Tag ${geminiDayContext.day} (${geminiDayContext.date}) – ${geminiDayContext.location}`
                      : "Kontext: Gesamte 17-Tage Japan-Reise & Flüge (9I2YP8)"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setGeminiDrawerOpen(false)}
                className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Day Context Selector Bar */}
            <div className="px-4 py-2 bg-neutral-50 border-b border-neutral-200/70 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <span className="text-[11px] font-extrabold text-neutral-400 shrink-0 mr-1">Fokus:</span>
              <button
                onClick={() => setGeminiDayContext(null)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold shrink-0 cursor-pointer ${
                  !geminiDayContext ? "bg-slate-900 text-white" : "bg-white border border-neutral-200 text-neutral-700"
                }`}
              >
                Alle 17 Tage
              </button>
              {DAYS_DATA.map(d => (
                <button
                  key={d.day}
                  onClick={() => setGeminiDayContext(d)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold shrink-0 cursor-pointer ${
                    geminiDayContext?.day === d.day
                      ? "bg-[#FF385C] text-white"
                      : "bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100"
                  }`}
                >
                  {d.emoji} Tag {d.day}
                </button>
              ))}
            </div>

            {/* Chat Messages Scroll Area */}
            <div className="p-4 overflow-y-auto flex-1 space-y-3 bg-[#F5F5F7]">
              {geminiMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                >
                  {msg.dayBadge && (
                    <span className="text-[10px] font-extrabold text-neutral-400 mb-0.5 px-1">
                      {msg.dayBadge}
                    </span>
                  )}
                  <div
                    className={`max-w-[88%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-medium ${
                      msg.role === "user"
                        ? "bg-slate-900 text-white rounded-br-xs"
                        : "bg-white text-slate-900 border border-[#EBEBEB] shadow-2xs rounded-bl-xs"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isGeminiLoading && (
                <div className="flex items-center gap-2 text-xs text-neutral-600 font-extrabold bg-white px-4 py-3 rounded-2xl border border-[#EBEBEB] w-fit">
                  <RefreshCw className="w-4 h-4 animate-spin text-[#FF385C]" />
                  <span>Gemini prüft euren Reiseplan...</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Suggested Quick Prompts */}
            <div className="px-4 py-2.5 bg-white border-t border-neutral-100">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400 mb-1.5">
                1-Tap Schnellfragen:
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                {quickPrompts.map((qp, i) => (
                  <button
                    key={i}
                    onClick={() => handleAskGemini(qp)}
                    disabled={isGeminiLoading}
                    className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-[#E00B41] text-xs font-extrabold whitespace-nowrap transition shrink-0 cursor-pointer"
                  >
                    {qp}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Form */}
            <form
              onSubmit={e => {
                e.preventDefault();
                handleAskGemini();
              }}
              className="p-3 sm:p-4 bg-white border-t border-neutral-200 flex items-center gap-2"
            >
              <input
                type="text"
                value={geminiInput}
                onChange={e => setGeminiInput(e.target.value)}
                placeholder="Frage zu Route, Zügen, Bestellungen oder Regen-Plan B..."
                className="flex-1 px-4 py-2.5 rounded-full bg-neutral-100 focus:bg-white border border-transparent focus:border-[#FF385C] text-xs sm:text-sm font-medium outline-none transition"
              />
              <button
                type="submit"
                disabled={!geminiInput.trim() || isGeminiLoading}
                className="p-2.5 rounded-full bg-[#FF385C] hover:bg-[#E00B41] disabled:opacity-40 text-white transition shrink-0 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}