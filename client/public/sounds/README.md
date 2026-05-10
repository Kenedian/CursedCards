# Sound placeholders

The game currently uses procedural Web Audio placeholder sounds from:

`client/src/composables/useGameAudio.js`

Drop custom sound files in this folder and wire them in `SOUND_FILES`.

Suggested names:

- `ui-hover.mp3` XXXX
- `ui-click.mp3` XXXX
- `card-hover.mp3`XXX
- `card-pick.mp3` XXX
- `card-reveal.mp3`XXX
- `toast-success.mp3`XX
- `toast-error.mp3` XX
- `admin-open.mp3`XX

Example:

```js
const SOUND_FILES = {
  uiHover: "/sounds/ui-hover.mp3",
  uiClick: "/sounds/ui-click.mp3",
  cardHover: "/sounds/card-hover.mp3",
  cardPick: "/sounds/card-pick.mp3",
  cardReveal: "/sounds/card-reveal.mp3",
  toastSuccess: "/sounds/toast-success.mp3",
  toastError: "/sounds/toast-error.mp3",
  adminOpen: "/sounds/admin-open.mp3"
}
```
