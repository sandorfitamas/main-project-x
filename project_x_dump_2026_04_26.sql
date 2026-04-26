-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2026. Ápr 26. 13:36
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `project_x`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `attendances`
--

CREATE TABLE `attendances` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `event_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `events`
--

CREATE TABLE `events` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `rating` decimal(3,1) NOT NULL DEFAULT 0.0,
  `base_rating` decimal(3,1) DEFAULT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `location` varchar(255) NOT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `category` varchar(50) NOT NULL DEFAULT 'Egyéb',
  `organizer` varchar(100) DEFAULT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `tags` varchar(255) DEFAULT NULL,
  `price` varchar(100) DEFAULT NULL,
  `contact_phone` varchar(50) DEFAULT NULL,
  `suspended_until` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `events`
--

INSERT INTO `events` (`id`, `title`, `description`, `rating`, `base_rating`, `date`, `time`, `location`, `image_url`, `category`, `organizer`, `user_id`, `tags`, `price`, `contact_phone`, `suspended_until`, `created_at`, `updated_at`) VALUES
(1, 'Akvárium Klub', 'Budapest egyik leghíresebb koncert- és klubhelyszíne az Erzsébet téren. Három terem, három különböző hangulat - mainstream slágertől az underground technoig. Minden pénteken élő koncertek, utána DJ szettek hajnalig. Lenyűgöző vizuális show, professzionális hangrendszer. A város szívében, könnyen megközelíthető. Korhatár: 18+', 4.1, NULL, '2026-08-18', '22:00:00', 'Budapest, Akvárium Klub, Erzsébet tér 12.', 'https://akvariumklub.hu/wp-content/uploads/2020/08/1400-932-max-3.jpg', 'Klub', 'Akvárium Klub', NULL, 'Electro,House,Techno', '3000-4000 Ft', '+36 30 860 3368', NULL, '2026-04-26 10:45:37', '2026-04-26 10:45:37'),
(2, 'Ötkert', 'Népszerű klub a Gozsdu udvar szívében, több teremmel és változatos zenékkel. Táncdalok, house, pop és elektronikus slágerek. Kiváló helyszín baráti bulizásra, közel a legjobb éttermekhez és bárokhoz. Nagy tánctér, koktélbár minden szinten. Happy hour 22-24 óráig!', 4.5, NULL, '2026-07-26', '21:00:00', 'Budapest, Ötkert, Zrínyi utca 4/a', 'https://otkert.hu/wp-content/uploads/2022/05/otkert-kisokos.jpg', 'Klub', 'Ötkert', NULL, 'Pop,House,Dance', '2000-2500 Ft', '+36 70 330 8652', NULL, '2026-04-26 10:45:37', '2026-04-26 10:45:37'),
(3, 'Heaven Club', 'Modern klub a legújabb EDM és pop slágerekel. LED falak, UV effektek, és Instagram-worthy fotópontok minden sarkon. Nemzetközi DJ vendégek, bottle service VIP részleg. Dress code: elegáns/casual. Fiatal, energikus közönség. Pezsgőakció éjfélkor!', 4.7, NULL, '2026-07-19', '23:00:00', 'Budapest, Heaven Club, Deák Ferenc utca 5.', 'https://cdn.sanity.io/images/gfykh5ro/production/a1c2ad89692a064c355752de6e042ae4d6ebcae2-5748x3832.jpg?w=1920&h=1080&q=80&auto=format', 'Klub', 'Heaven Club', NULL, 'EDM,Pop,Commercial', '2500-3500 Ft', '+36 30 151 2000', NULL, '2026-04-26 10:45:37', '2026-04-26 10:45:37'),
(4, 'Morrison\'s 2', '6 terem, 6 különböző zenei stílus! Latino, R&B, Hip-Hop, táncdalok és még sok más. Budapest egyik legismertebb és legnépszerűbb klubja. Hatalmas tánctér, profi fényshow. Ital akciók éjfélig. Születésnaposoknak ingyenes belépés! Minden pénteken és szombaton telt ház.', 4.4, NULL, '2026-06-12', '22:00:00', 'Budapest, Morrison\'s 2, Szent István körút 11.', 'https://morrisons2.hu/wp-content/uploads/2024/02/udvar-5.jpg', 'Klub', 'Morrison\'s', NULL, 'Pop,Latino,R&B,Hip-Hop', '2000-2500 Ft', '+36 1 374 3329', NULL, '2026-04-26 10:45:37', '2026-04-26 10:45:37'),
(5, 'Instant-Fogas Komplexum', 'Legendás romkocsma-klub komplexum 26 különböző teremmel! Techno, alternatív, indie, pop - mindent megtalálsz. Egyedi atmoszféra, művészi dekoráció, labirintusszerű helyiségek. Fedett és fedetlen részek. Nyáron a kert is nyitva. Ez Budapest egyik legikonikusabb éjszakai helyszíne!', 4.3, NULL, '2026-07-18', '21:00:00', 'Budapest, Instant-Fogas, Akácfa utca 51.', 'https://kep.cdn.index.hu/1/0/5559/55598/555986/55598689_4109401_0d07d362dc1ca573eb9caeaedd436955_wm.jpg', 'Klub', 'Instant-Fogas', NULL, 'Techno,Alternative,Pop', '1500-2500 Ft', '+36 70 638 5040', NULL, '2026-04-26 10:45:37', '2026-04-26 10:45:37'),
(6, 'Lärm', 'Hardcore underground techno rave! Minimális dekoráció, maximális zene. Stroboszkóp, füstgép, és a város legjobb sound systemje. Csak a legelszántabbaknak! Nemzetközi DJ-k, minimal és hard techno. Teljesen elmerülhetsz a zenében. Korhatár: 21+', 3.7, NULL, '2026-07-07', '23:30:00', 'Budapest, Lärm, Akácfa utca 51.', 'https://res.cloudinary.com/electronic-beats/c_fit,q_auto,f_auto,w_1920/stage/uploads/sites/8/2019/06/larm_fekvo.jpg', 'Rave', 'Lärm', NULL, 'Techno,Underground,Rave', '2000-3000 Ft', '+36 30 537 2695', NULL, '2026-04-26 10:45:37', '2026-04-26 10:45:37'),
(7, 'Aether club', 'Minimal és melodic techno a legprofibb hangrendszeren. Meghitt atmoszféra, minőségi közönség, aki a zenéért jön. Lézershowk, vizuális projekciók. Chill-out zóna a pihenéshez. A budapesti techno szcéna egyik legfontosabb helyszíne. Resident és vendég DJ-k.', 4.2, NULL, '2026-07-24', '23:00:00', 'Budapest, Aether Club, Veres Pálné utca 33/a.', 'https://static.ra.co/images/clubs/lg/aethercrowd1.jpg?dateUpdated=1662639935553', 'Klub', 'Aether', NULL, 'Minimal,Techno,Melodic', '2500-3000 Ft', '+36 70 229 5127', NULL, '2026-04-26 10:45:37', '2026-04-26 10:45:37'),
(8, 'Szimpla Kert', 'Budapest leghíresebb romkocsmája! Egyedi dizájn, minden sarok más hangulatú. Akusztikus koncert a kertben, utána DJ szettek. Craft sörök, különleges borok. Tökéletes hely barátokkal találkozni. Turisták és helyiek kedvence. A koncert után nyitva hajnal 2-ig.', 4.6, NULL, '2026-06-12', '20:00:00', 'Budapest, Szimpla Kert, Kazinczy utca 14.', 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/06/62/0d/95/szimpla-kert.jpg?w=1200&h=1200&s=1', 'Chill', 'Szimpla Kert', NULL, 'Acoustic,Live,Chill', '2000-6000 Ft', '+36 20 261 8669', NULL, '2026-04-26 10:45:37', '2026-04-26 10:45:37'),
(9, 'Kőleves Vendéglő és Kert', 'Laza, barátságos romkocsma különleges ételekkel és italokkal. Nyári hangulat télen is - fűtött kert! Élő zene csütörtökönként, DJ szettek hétvégén. Craft koktélok, helyi sörök. Barátságos személyzet, kiváló árak. Társasjátékok, közösségi asztalok.', 4.6, NULL, '2026-06-17', '19:00:00', 'Budapest, Kőleves Kert, Kazinczy utca 37-41', 'https://kep.cdn.index.hu/1/0/6083/60839/608399/60839913_4499677_efa2ddd95b5e3e0eb113a280f9516491_wm.jpg', 'Chill', 'Kőleves', NULL, 'Chill,Live,Alternative', '2000-4000 Ft', '+36 20 213 5999', NULL, '2026-04-26 10:45:37', '2026-04-26 10:45:37'),
(10, 'Dürer Kert', 'Koncertek, alter, rock és elektronikus zene. Fedett és fűtött kert télen is. Roller disco pálya, büfé street food-dal. Punk, rock, indie koncertek. Fiatal, alternatív közönség. Craft sörök és pálinkaválaszték. A budapesti underground kultúra központja.', 4.5, NULL, '2026-07-29', '21:00:00', 'Budapest, Dürer Kert, Öböl utca 1.', 'https://kep.cdn.indexvas.hu/1/0/6416/64163/641634/64163469_d0cf4ce9ebf31a8ee78043f29b0ff767_wm.jpg', 'Klub', 'Dürer Kert', NULL, 'Rock,Indie,Alternative', '1500-2500 Ft', '+36 1 209 3269', NULL, '2026-04-26 10:45:37', '2026-04-26 10:45:37'),
(11, 'Kopaszi Kert', 'Baráti összejövetelek a Duna-parton! Piknik hangulat, sunset DJ szett. Hozd a takaródat és a barátaidat. Food truckók, craft sörök. Kerékpáros közönség. Nyugodt, kikapcsolódó hangulat. Gyönyörű kilátás a természetre. Kutyabarát helyszín.', 4.1, NULL, '2026-07-16', '17:00:00', 'Budapest, Kopaszi-gát 6-8', 'https://kep.cdn.indexvas.hu/1/0/6344/63443/634432/63443243_f84d15eb03645bae593e73eaa5ca694c_wm.jpg', 'Chill', 'Kopaszi-gát', NULL, 'Chill,Sunset,Nature', '2000-4000 Ft', '+36 30 441 7414', NULL, '2026-04-26 10:45:37', '2026-04-26 10:45:37'),
(12, 'Pontoon', 'Duna-parti hajóbuli! Naplemente, panoráma a Parlamentre. Chill house és lounge zene. Koktélbár, fingerfood menü. Romantikus hangulat, tökéletes randihelyszín. Fedett terasz, fűtés télen is. Fotózásra ideális! DJ szettek hétvégén.', 4.2, NULL, '2026-07-23', '19:00:00', 'Budapest, Id. Antall József rkp. 1', 'https://kep.cdn.indexvas.hu/welove-media/e1/pontoon-polyak-attila-023.exact1980w.jpg', 'Egyéb', 'Pontoon', NULL, 'Lounge,Sunset,Chill', '2000-6000 Ft', '+36 30 977 3368', NULL, '2026-04-26 10:45:37', '2026-04-26 10:45:37'),
(13, '360 Bar', 'Panorámás tetőbár a város legjobb kilátásával! Lenyűgöző 360 fokos panoráma Budapestre. Koktélbár, DJ szettek, elegáns közönség. Dress code: smart casual. Asztalfoglalás ajánlott. Prémium italok, fingerfood menü. Instagram heaven!', 4.2, NULL, '2026-06-10', '20:00:00', 'Budapest, Andrássy út 39', 'https://www.360bar.hu/wp-content/uploads/2020/05/b-139-web.jpg', 'Chill', '360 Bar', NULL, 'Rooftop,Lounge,Panorama', '3000 Ft', '+36 30 360 3600', NULL, '2026-04-26 10:45:37', '2026-04-26 10:45:37'),
(14, 'A38 Hajó', 'Kultikus koncerthajó a Dunán! Jazz koncert nemzetközi művészekkel. Étterem a fedélzeten, vacsorával kombinált jegyek. Páratlan dunai panoráma. A koncert után DJ szett. Különleges atmoszféra a vízen. Budapest egyik legikonikusabb helyszíne.', 4.5, NULL, '2026-07-29', '20:30:00', 'Budapest, Petőfi híd déli oldal', 'https://www.a38.hu/themes/a38/assets/images/frontend/postbanner.jpg', 'Egyéb', 'A38', NULL, 'Jazz,Live,Concert', '3500-6000 Ft', '+36 1 464 3940', NULL, '2026-04-26 10:45:37', '2026-04-26 10:45:37'),
(15, 'Sziget Fesztivál 2026', 'Európa egyik legnagyobb zenei fesztiválja! 7 nap, több mint 1000 koncert és program. Nemzetközi és hazai sztárok. Sziget a Dunán, felejthetetlen élmény. Kempingezés, street food, művészet. Minden zenei stílus. Nem csak koncert, hanem életérzés!', 4.3, NULL, '2026-07-11', '14:00:00', 'Budapest, Hajógyári-sziget', 'https://turizmus.com/userfiles/myResource/articles/20250812/Sziget-fesztival-koncert.jpg', 'Fesztivál', 'Sziget Kft.', NULL, 'Festival,Music,International', '99500 Ft (bérlet)', '+36 1 372 0650', NULL, '2026-04-26 10:45:37', '2026-04-26 10:45:37'),
(16, 'Budapest Park', 'Szabadtéri koncertek és bulik a Városligetben! Hazai és nemzetközi sztárok. Nagy színpad, profi technika. Food court, italstandok. Nyári esték Budapesten. Családbarát és bulizós programok. Heti 3-4 koncert nyáron.', 4.6, NULL, '2026-08-15', '19:00:00', 'Budapest, Fábián Juli tér 1', 'https://i.szalas.hu/pois/5034/original/88300.jpg', 'Fesztivál', 'Budapest Park', NULL, 'Concert,Festival,Outdoor', '5990-19990 Ft', '+36 1 434 7800', NULL, '2026-04-26 10:45:37', '2026-04-26 10:45:37'),
(17, 'Balaton Sound Fesztivál', 'Elektronikus zenei fesztivál Budapesttől 1 órára! Techno, house, trance a Balaton-parton. Kempingezés, strandfesztivál feeling. Nemzetközi DJ-k, 3 színpad. Beach party atmosphere. Vízisportok, napozás. 3 napos zenei ünnep.', 4.4, NULL, '2026-07-01', '18:00:00', 'Zamárdi, Kiss Ernő utca 44.', 'https://likebalaton.hu/wp-content/uploads/2024/02/9127461marksomay202306282049DJI202306282049510050D-scaled.jpg', 'Fesztivál', 'B My Lake', NULL, 'Electronic,Techno,House', '29990 Ft (3 napos bérlet)', '+36 1 372 0650', NULL, '2026-04-26 10:45:37', '2026-04-26 10:45:37'),
(18, 'Party Villa', 'Exkluzív villa buli a Buda-hegyekben! Medence, jacuzzi, tágas teraszok és panoráma a városra. Profi DJ, minőségi hangrendszer, LED világítás. Korlátozott létszám - max 150 fő. BYOB vagy prémium bárszolgáltatás. Privát biztonságiak. Tökéletes születésnapi, céges vagy baráti bulira. Előzetes regisztráció kötelező!', 4.2, NULL, '2026-06-02', '20:00:00', 'Budapest, Veres Péter út 121.', 'https://images.trvl-media.com/lodging/30000000/29490000/29484300/29484212/ce4b4299.jpg?impolicy=resizecrop&rw=575&rh=575&ra=fill', 'Házibuli', 'Party Villa Budapest', NULL, 'Villa,Exclusive,Private', '5000 Ft', '+36 70 633 7599', NULL, '2026-04-26 10:45:37', '2026-04-26 10:45:37'),
(19, 'The Private Rooftop', 'Születésnapi buli egy pentház tetőteraszán! Panoráma kilátás, bubble machine, neon dekor. DJ mix és karaoke. Koktélbár, finger food. Dress code: party outfit. Privát esemény, csak meghívással. Korhatár: 18+', 4.3, NULL, '2026-07-24', '21:00:00', 'Budapest, Hermina út 63', 'https://kep.cdn.index.hu/1/0/5711/57112/571124/57112409_4223685_550f8e5fb58511a15600df91539f1abc_wm.jpg', 'Házibuli', 'Privát', NULL, 'Birthday,Rooftop,Exclusive', '2000 Ft', '+36 30 343 6427', NULL, '2026-04-26 10:45:37', '2026-04-26 10:45:37'),
(20, 'Volt Fesztivál', 'Magyarország egyik legnagyobb nyári fesztiválja! Rock, pop, elektronikus zene. Nemzetközi és hazai sztárok. 4 nap, több színpad. Kempingezés, glamping opció. Strand a közelben. Sopron, fergeteges hangulat!', 4.6, NULL, '2026-06-25', '15:00:00', 'Sopron, Szent György utca 2.', 'https://pcdn.hu/articles/images-xl/v/o/l/volt-fesztival2-538907.jpg', 'Fesztivál', 'Volt Fesztivál', NULL, 'Rock,Pop,Electronic', '69990 Ft (4 napos bérlet)', '+36 30 951 9750', NULL, '2026-04-26 10:45:37', '2026-04-26 10:45:37'),
(21, 'Fishing On Orfű', 'Alternatív indie-rock fesztivál gyönyörű környezetben! Magyar és külföldi indie bandák. Tó, erdő, túrázás. Családbarát, barátságos hangulat. Craft sörök, street food. Hippi vibe. 3 nap.', 4.8, NULL, '2026-08-08', '14:00:00', 'Orfű, Dollár út 1.', 'https://www.kulter.hu/wp-content/uploads/2024/07/fishing202413-1000x667.jpg', 'Fesztivál', 'Fishing On Orfű', NULL, 'Indie,Rock,Alternative', '29990 Ft (3 napos bérlet)', '+36 30 773 6538', NULL, '2026-04-26 10:45:37', '2026-04-26 10:45:37'),
(22, 'Bálna Terasz', 'Stílusos duna-parti terasz lounge a Bálnában! Sunset cocktails, chill house music. Elegáns közönség, fingerfood menü. Perfect for networking. Dress code: smart casual. Panoráma a Budai Várra.', 4.2, NULL, '2026-07-28', '18:00:00', 'Budapest, Bálna Budapest, Fővám tér 11-12', 'https://kep.cdn.indexvas.hu/welove-media/80/balna-terasz_hartyanyi-norbert_20160916.JPG', 'Egyéb', 'Bálna Budapest', NULL, 'Lounge,Terrace,Elegant', '2500 Ft', '+36 30 410 7123', NULL, '2026-04-26 10:45:37', '2026-04-26 10:45:37'),
(23, 'Sparty - Széchenyi Bath Party', 'Exkluzív fürdőbuli! Széchenyi vagy Lukács fürdő after hours. DJ-k, LED fények a vízben. Fürdőruha kötelező! Cocktail bár, chill zónák. Egyedi budapesti élmény turistáknak és helyieknek!', 4.6, NULL, '2026-07-13', '22:00:00', 'Budapest, Állatkerti krt. 9-11', 'https://cdn-imgix.headout.com/media/images/379ff35616880b47c6a0a369c46a383e-Sparty_20220528_Bathparty-112-1.jpg?auto=compress%2Cformat&q=90&crop=faces&fit=crop', 'Egyéb', 'Sparty Budapest', NULL, 'Thermal,Bath,Unique', '20000 Ft (fürdővel)', '+36 30 395 8581', NULL, '2026-04-26 10:45:37', '2026-04-26 10:45:37'),
(24, '1111', 'sssssssssssss', 0.0, NULL, '2026-04-29', '17:55:00', '2222 Miskolc, sssssssss s222.', '/storage/uploads/MKDchxLPZxpRSwaDM06X8GOkZkPqFXxMpGVdevOf.jpg', 'Házibuli', 'aaaaaaaaaaaaa', 2, 'VIP, Ingyenes, Terasz', '2000 Ft', '+36 30 111 1111', NULL, '2026-04-26 10:50:59', '2026-04-26 10:50:59');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `favorites`
--

CREATE TABLE `favorites` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `event_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2024_01_01_000003_create_personal_access_tokens_table', 1),
(5, '2024_01_01_000004_create_events_table', 1),
(6, '2024_01_01_000005_create_favorites_table', 1),
(7, '2026_03_18_123546_create_reviews_table', 1),
(8, '2026_03_18_130900_create_attendances_table', 1),
(9, '2026_04_08_122523_add_profile_picture_to_users_table', 1),
(10, '2026_04_12_123007_add_is_admin_to_users_table', 1),
(11, '2026_04_12_132413_add_suspended_until_to_users_and_events_tables', 1),
(12, '2026_04_15_180042_create_tickets_table', 1),
(13, '2026_04_16_005443_add_base_rating_to_events_table', 1);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(2, 'App\\Models\\User', 1, 'auth_token', 'f78e0d4717be8122d5efdc95276c0ebd442f66e31f351bacb86b3f4980ff8268', '[\"*\"]', '2026-04-26 10:51:15', NULL, '2026-04-26 10:51:13', '2026-04-26 10:51:15');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `reviews`
--

CREATE TABLE `reviews` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `event_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `rating` tinyint(3) UNSIGNED NOT NULL,
  `comment` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `tickets`
--

CREATE TABLE `tickets` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `event_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `total_price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `status` varchar(50) NOT NULL DEFAULT 'pending',
  `ticket_code` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `is_admin` tinyint(1) NOT NULL DEFAULT 0,
  `suspended_until` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `profile_picture` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `is_admin`, `suspended_until`, `remember_token`, `created_at`, `updated_at`, `profile_picture`) VALUES
(1, 'Admin', 'admin@gmail.com', NULL, '$2y$12$C1K4zeTdD9TLWh3OjMa1Bu5Rg0gsZosm1NtRl8uPbMbtWjX0WxDy2', 1, NULL, NULL, '2026-04-26 10:45:36', '2026-04-26 10:45:36', NULL),
(2, 'Teszt User', 'teszt@gmail.com', NULL, '$2y$12$OSIuovrFlZN9yHtM.EPjgOklvEBrYkzJVjP48M4m3fWoT5m2xZEtm', 0, NULL, NULL, '2026-04-26 10:45:37', '2026-04-26 10:45:37', NULL);

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `attendances`
--
ALTER TABLE `attendances`
  ADD PRIMARY KEY (`id`),
  ADD KEY `attendances_user_id_foreign` (`user_id`),
  ADD KEY `attendances_event_id_foreign` (`event_id`);

--
-- A tábla indexei `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- A tábla indexei `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- A tábla indexei `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `events_user_id_foreign` (`user_id`);

--
-- A tábla indexei `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- A tábla indexei `favorites`
--
ALTER TABLE `favorites`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `favorites_user_id_event_id_unique` (`user_id`,`event_id`),
  ADD KEY `favorites_event_id_foreign` (`event_id`);

--
-- A tábla indexei `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_reserved_at_available_at_index` (`queue`,`reserved_at`,`available_at`);

--
-- A tábla indexei `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- A tábla indexei `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- A tábla indexei `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `reviews_event_id_user_id_unique` (`event_id`,`user_id`),
  ADD KEY `reviews_user_id_foreign` (`user_id`);

--
-- A tábla indexei `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- A tábla indexei `tickets`
--
ALTER TABLE `tickets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `tickets_ticket_code_unique` (`ticket_code`),
  ADD KEY `tickets_event_id_foreign` (`event_id`),
  ADD KEY `tickets_user_id_foreign` (`user_id`);

--
-- A tábla indexei `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `attendances`
--
ALTER TABLE `attendances`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `events`
--
ALTER TABLE `events`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT a táblához `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `favorites`
--
ALTER TABLE `favorites`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT a táblához `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT a táblához `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `tickets`
--
ALTER TABLE `tickets`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `attendances`
--
ALTER TABLE `attendances`
  ADD CONSTRAINT `attendances_event_id_foreign` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `attendances_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `events_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `favorites`
--
ALTER TABLE `favorites`
  ADD CONSTRAINT `favorites_event_id_foreign` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `favorites_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_event_id_foreign` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `tickets`
--
ALTER TABLE `tickets`
  ADD CONSTRAINT `tickets_event_id_foreign` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tickets_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
