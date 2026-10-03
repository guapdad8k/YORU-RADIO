# YORU RADIO / 夜のラジオ

Pierwowzór osobistego radia internetowego. Nocny, chromowany klimat WEB-PORTFOLIO połączony z ramkami, typografią monospace, kasetą i detalami japońskich stron z lat 2000. Responsywny HTML/CSS/JavaScript, bez zależności i procesu budowania.

## Uruchomienie

Wymagany Node.js 20 lub nowszy:

```sh
npm start
```

Otwórz http://127.0.0.1:4173. `npm test` sprawdza walidację playlist; `npm run check` sprawdza składnię. Stronę należy otwierać przez HTTP, nie `file://` (moduły ES). Przy pierwszym uruchomieniu serwer pobiera dekoracyjne tło z WEB-PORTFOLIO. ZIP ma już tę kopię; Git ignoruje GIF. Brak pobrania nie blokuje radia. Dla hostingu statycznego uruchom najpierw `npm run prepare:assets` i dołącz `assets/night.gif` do paczki strony.

## Kanały i Spotify

Spokojny, Elektroniczna, Rap / Nowoczesny, Rap / Oldschool, Latino. Każdy kanał ma działający oficjalny Spotify Embed. „Włącz odsłuch” otwiera odtwarzacz; odtwarzanie uruchamia się przyciskiem Spotify. Przełączenie kanału zastępuje odtwarzacz i zatrzymuje poprzedni. To wybór playlist na żądanie, nie zsynchronizowana transmisja na żywo.

Playlisty startowe są **demonstracyjne**, nie są przedstawiane jako selekcje właściciela. Własne publiczne playlisty można przypisać przez „Twoje playlisty”. Edytor sprawdza format linku, nie dostępność playlisty. Niedostępna/prywatna playlista może nie odtwarzać się w Spotify; pozostaje link do aplikacji. Faktyczny zakres odtwarzania, logowanie i ograniczenia konta obsługuje Spotify. Nie ma własnych kluczy, tokenów ani dostępu do prywatnej biblioteki.

Edycja w UI zapisuje wybór w localStorage tej przeglądarki. Nie jest panelem administracyjnym współdzielonym między użytkownikami. Import/eksport JSON przenosi ustawienia. Aby udostępnić wszystkim Twoją selekcję, zmień `playlistId` w `config.js` i zaktualizuj opisy demonstracyjne w UI (`playlist-badge` i notatka kuratora). Dalsza wersja może dodać autoryzowany panel kuratora oraz Spotify OAuth z PKCE, jeśli potrzebny będzie dostęp do biblioteki lub sterowanie odtwarzaniem.

Zapisywanie kanałów i ostatni wybór są lokalne. Brak telemetryki. Kliknięcie odsłuchu ładuje zewnętrzny iframe Spotify. Animacje można wyłączyć; strona respektuje preferencję ograniczonego ruchu.

## Struktura

- `index.html`, `style.css`: interfejs i responsywny wygląd.
- `app.js`: przełączanie kanałów, Spotify Embed, edytor i localStorage.
- `config.js`: lista kanałów, identyfikatory playlist i walidacja.
- `scripts/serve.mjs`: lokalny serwer, udostępnia tylko zasoby strony.
- `tests/config.test.js`: walidacja danych importowanych i linków Spotify.

## Inspiracje i zasoby

- [WEB-PORTFOLIO](https://github.com/guapdad8k/WEB-PORTFOLIO): marka JAY BLAZE, chrom, nocny klimat i boombox. `assets/night.gif` to kopia `LoopNightGIF.gif` z repozytorium właściciela, wykorzystana na jego prośbę. Nie skopiowano plików muzycznych. Prawa do oryginalnych zasobów pozostają u ich właścicieli.
- [FishingBear — osobiste strony lat 2000](https://fishingbear.jp/tech/homepage/): ramki, małe etykiety i osobisty charakter wczesnej sieci. Pozostałe dekoracje wykonano w CSS, favicon w SVG.
- [Spotify Embeds — dokumentacja](https://developer.spotify.com/documentation/embeds/tutorials/creating-an-embed).

Repozytorium: https://github.com/guapdad8k/YORU-RADIO

Statyczną stronę można hostować bez budowania. Ten pierwowzór nie zawiera backendu ani automatycznej publikacji.
