#!/bin/bash
# Použitie: ./scripts/compress-images.sh <cesta-k-priecinku-alebo-suboru>
# Skomprimuje JPEG/JPG súbory na max 1400px a ~80% kvalitu pomocou sips (macOS).

set -e

TARGET="${1:-.}"

compress() {
  local f="$1"
  local before after
  before=$(du -sh "$f" | cut -f1)
  sips -Z 1400 -s format jpeg -s formatOptions 78 "$f" --out "$f" > /dev/null 2>&1
  after=$(du -sh "$f" | cut -f1)
  echo "  $before → $after  $(basename "$f")"
}

if [ -f "$TARGET" ]; then
  compress "$TARGET"
elif [ -d "$TARGET" ]; then
  echo "Komprimujem obrázky v: $TARGET"
  find "$TARGET" -maxdepth 1 -type f \( -iname "*.jpg" -o -iname "*.jpeg" \) | sort | while read -r f; do
    compress "$f"
  done
  echo "Hotovo."
else
  echo "Chyba: '$TARGET' nie je súbor ani priečinok."
  exit 1
fi
