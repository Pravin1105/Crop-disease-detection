# Crop Disease Detection --- UI Design System

## 1. Design Direction

The interface must not use generic AI-product visual language (purple gradients, glowing neon cards, abstract AI illustrations).
Visual identity: **agriculture + diagnostic tooling**:
- green for crop/health context (`#39D353` / `#168A35`);
- black/near-black for dark interface (`#07100B`, `#0D1710`);
- white for light interface (`#F7FAF7`, `#FFFFFF`);
- restrained borders (`#24382A` / `#D3E1D5`);
- dense, readable information presentation.

## 2. Color System

### Dark Theme
- `--bg`: `#07100B`
- `--surface`: `#0D1710`
- `--surface-2`: `#122018`
- `--border`: `#24382A`
- `--green`: `#39D353`
- `--green-dark`: `#1F8F38`
- `--text`: `#F2F7F3`
- `--text-muted`: `#9DAEA1`
- `--danger`: `#E05A5A`
- `--warning`: `#D8B44A`

### Light Theme
- `--bg`: `#F7FAF7`
- `--surface`: `#FFFFFF`
- `--surface-2`: `#EEF5EF`
- `--border`: `#D3E1D5`
- `--green`: `#168A35`
- `--green-dark`: `#0E6727`
- `--text`: `#101711`
- `--text-muted`: `#617064`
- `--danger`: `#B83333`
- `--warning`: `#916F12`

## 3. Typography
- Clean sans-serif typeface.
- Clear hierarchy: Page title (strong/compact), Section title, Body, Metadata, Large numerical prediction confidence.

## 4. Components & Theme Behavior
- Reusable UI elements: `Navbar`, `Button`, `Input`, `ImageUploader`, `ImagePreview`, `PredictionCard`, `ConfidenceIndicator`, `TopPredictions`, `DiseaseInfo`, `HistoryTable`, `HistoryItem`, `LoadingState`, `ErrorMessage`, `Modal`, `Toast`.
- Dual theme support (Dark/Light) persisting across sessions without altering functionality or data.
