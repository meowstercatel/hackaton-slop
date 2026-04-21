# Hackaton SLOP - Szkolny Plan Lekcji

Aplikacja oparta o framework **Vue 3**, **Vite** oraz **TypeScript**, służąca do parsowania i wyświetlania planu zajęć dla nauczycieli bezpośrednio z pliku Excel. Do odczytu arkusza wykorzystywana jest biblioteka `exceljs`.

## Funkcjonalności

- Odczytywanie i parsowanie pliku `public/Plan.xlsx`.
- Automatyczne wyodrębnianie i kategoryzacja godzin oraz dni tygodnia z planu za pomocą funkcji iteracyjnych.
- Generowanie przejrzystej i interaktywnej tabeli dla pożądanego nauczyciela.
- Podświetlanie rzędów (godziny) i kolumn (dni tygodnia) po najechaniu kursorem dla łatwiejszej orientacji w tabeli.

## Wymagania

- Node.js (wersja przynajmniej zgodna z Vite i Vue).

## Uruchomienie projektu

1. Zainstaluj wszystkie wymagane pakiety:

```sh
npm install
```

2. Uruchom aplikację w trybie deweloperskim z przeładowaniem na żywo:

```sh
npm run dev
```

3. Wersja na serwer produkcyjny (zbuduj projekt):

```sh
npm run build
```
