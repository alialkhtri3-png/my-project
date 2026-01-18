#!/data/data/com.termux/files/usr/bin/bash

# ===============================
# 📦 Backup all config files (SMART)
# ===============================

# 📂 مجلد النسخ الاحتياطي
BACKUP_DIR="$HOME/Backups/configs"
mkdir -p "$BACKUP_DIR"

# 🏠 مجلد المنزل (حيث المشاريع فعليًا)
HOME_DIR="$HOME"

echo "🔍 فحص المشاريع داخل $HOME_DIR"

# 🔹 المرور على كل مجلد في HOME
for project in "$HOME_DIR"/*; do
  [ -d "$project" ] || continue

  PROJECT_NAME=$(basename "$project")

  # 🚫 استثناء مجلدات النظام والضوضاء
  case "$PROJECT_NAME" in
    .npm|.config|.cache|.local|Backups|tmp|bin)
      continue
      ;;
  esac

  DEST="$BACKUP_DIR/$PROJECT_NAME"
  mkdir -p "$DEST"

  rsync -av \
    --include='*/' \
    --include='*.env' \
    --include='*.env.*' \
    --include='*.json' \
    --include='*.yaml' \
    --include='*.yml' \
    --include='*.config' \
    --include='*.toml' \
    --include='*.ini' \
    --include='config.*' \
    --exclude='node_modules/' \
    --exclude='.git/' \
    --exclude='*' \
    "$project/" "$DEST/" >/dev/null
done

echo "✅ تم نسخ ملفات التكوين إلى: $BACKUP_DIR"

