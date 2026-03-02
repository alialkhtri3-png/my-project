#!/bin/bash
# Usage: ./compile-base-identity-json-v4.sh /path/to/projects-root
# نسخة v4 نهائية: استخراج ملفات الهوية JSON من مشاريع Base / OnChainKit، ضغطها وإنشاء سجل موحد

set -e  # إيقاف السكربت عند أي خطأ

ROOT_DIR="${1:-$PWD}"
OUTPUT_ROOT="$HOME/identity-json-compiled"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="$OUTPUT_ROOT/compile-log-$TIMESTAMP.txt"

mkdir -p "$OUTPUT_ROOT"
echo "🔍 فحص المجلد الرئيسي: $ROOT_DIR ..." | tee -a "$LOG_FILE"

# سجل موحد لكل المشاريع
echo "🎯 سجل العملية الموحد - $TIMESTAMP" > "$LOG_FILE"

# البحث عن كل مجلد يحتوي على package.json
for pkg in $(find "$ROOT_DIR" -type f -name "package.json" ! -path "*/node_modules/*" ! -path "*/.git/*"); do
    PROJECT_DIR=$(dirname "$pkg")
    PROJECT_NAME=$(basename "$PROJECT_DIR")
    OUTPUT_DIR="$OUTPUT_ROOT/$PROJECT_NAME"
    LIST_FILE="$OUTPUT_DIR/json-files-list.txt"

    echo "📂 تجهيز مشروع: $PROJECT_NAME ..." | tee -a "$LOG_FILE"
    mkdir -p "$OUTPUT_DIR"

    # البحث عن ملفات الهوية JSON المهمة فقط، تجاهل node_modules
    find "$PROJECT_DIR" -type f \( -name "identity.json" -o -name "nft-metadata.json" -o -name "onchain-config.json" \) ! -path "*/node_modules/*" > "$LIST_FILE" || true

    echo "📋 نسخ ملفات الهوية JSON مع الاحتفاظ بالمسارات ..." | tee -a "$LOG_FILE"
    while IFS= read -r file; do
        [ -z "$file" ] && continue
        rel_path="${file#$PROJECT_DIR/}"
        target="$OUTPUT_DIR/$rel_path"
        mkdir -p "$(dirname "$target")"
        cp -n "$file" "$target"
        echo "[$PROJECT_NAME] $rel_path" >> "$LOG_FILE"
    done < "$LIST_FILE"

    # ضغط المشروع
    ZIP_FILE="$OUTPUT_ROOT/${PROJECT_NAME}_$TIMESTAMP.zip"
    TAR_FILE="$OUTPUT_ROOT/${PROJECT_NAME}_$TIMESTAMP.tar.gz"

    echo "🗜️ ضغط المشروع $PROJECT_NAME ..." | tee -a "$LOG_FILE"
    (cd "$OUTPUT_ROOT" && zip -r "$ZIP_FILE" "$PROJECT_NAME" > /dev/null) &
    (cd "$OUTPUT_ROOT" && tar -czf "$TAR_FILE" "$PROJECT_NAME" > /dev/null) &

    echo "✅ مشروع $PROJECT_NAME قيد الضغط في الخلفية..." | tee -a "$LOG_FILE"
done

wait

echo "🎉 جميع مشاريع Base / OnChainKit تم استخراج ملفات الهوية JSON!" | tee -a "$LOG_FILE"
echo "📁 المخرجات موجودة في: $OUTPUT_ROOT" | tee -a "$LOG_FILE"
ls -lh "$OUTPUT_ROOT" | tee -a "$LOG_FILE"
echo "📝 سجل العملية موجود في: $LOG_FILE" | tee -a "$LOG_FILE"

