# Troubleshooting

## AE won't launch / "unexpected error" on startup

**Symptom:** After Effects shows "An unexpected error has occurred and After Effects will now shutdown" or gets stuck on the Crash Repair Options screen.

**Cause:** Corrupted disk cache. This is an AE bug unrelated to our scripts.

**Fix:**
1. Quit AE completely
2. Delete the cache folder:
   ```
   rm -rf ~/Library/Caches/Adobe/After\ Effects/26.0/
   ```
3. Relaunch AE

If that doesn't work, also reset preferences:
1. Hold **Cmd + Option + Shift** while launching AE
2. Click "Delete preferences" when prompted

## Script errors when running .jsx files

**"Allow Scripts to Write Files" not enabled:**
- Go to AE > Preferences > Scripting & Expressions
- Check "Allow Scripts to Write Files and Access Network"

**Font not found (text looks wrong):**
- The script uses a PostScript font name that isn't installed
- Install the required fonts: BBNonamePro-Bold, Bodoni 72-Book, Akkordeon-Nine
- Font files are on the NAS: `CL-000 (ASSETS) > 03 - miscellaneous > 03.2 - Fonts`
