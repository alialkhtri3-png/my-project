#!/bin/bash
# Usage: ./compile-base-identity-json.sh /path/to/projects-root
# سكربت لمعالجة مشاريع Base / OnChainKit، نسخ ملفات الهوية JSON وضغطها

ROOT_DIR="${1:-$PWD}"
OUTPUT_ROOT="$HOME/identity-json-compiled"   # عدل هنا لتطابق المجلد الذي أنشأته
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="$OUTPUT_ROOT/compile-log-$TIMESTAMP.txt"

mkdir -p "$OUTPUT_ROOT"

echo "🔍 فحص المجلد الرئيسي: $ROOT_DIR ..." | tee -a "$LOG_FILE"

# البحث عن كل مجلد يحتوي على package.json
find "$ROOT_DIR" -type f -name "package.json" ! -path "*/node_modules/*" ! -path "*/.git/*" | while IFS= read -r pkg; do
    PROJECT_DIR=$(dirname "$pkg")
    PROJECT_NAME=$(basename "$PROJECT_DIR")
    OUTPUT_DIR="$OUTPUT_ROOT/$PROJECT_NAME"
    LIST_FILE="$OUTPUT_DIR/json-files-list.txt"

    echo "📂 تجهيز مشروع: $PROJECT_NAME ..." | tee -a "$LOG_FILE"
    mkdir -p "$OUTPUT_DIR"

    # البحث عن ملفات الهوية JSON المهمة
    find "$PROJECT_DIR" -type f \( -name "identity.json" -o -name "nft-metadata.json" -o -name "onchain-config.json" -o -name "*.json" \) > "$LIST_FILE"

    echo "📋 نسخ ملفات الهوية JSON مع الاحتفاظ بالمسارات ..." | tee -a "$LOG_FILE"
    while IFS= read -r file; do
        rel_path="${file#$PROJECT_DIR/}"
        target="$OUTPUT_DIR/$rel_path"
        mkdir -p "$(dirname "$target")"
        cp "$file" "$target"
        echo "  - $rel_path" >> "$LOG_FILE"
    done < "$LIST_FILE"

    # ضغط المشروع
    ZIP_FILE="$OUTPUT_ROOT/${PROJECT_NAME}_$TIMESTAMP.zip"
    TAR_FILE="$OUTPUT_ROOT/${PROJECT_NAME}_$TIMESTAMP.tar.gz"

    echo "🗜️ ضغط المشروع ..." | tee -a "$LOG_FILE"
    (cd "$OUTPUT_ROOT" && zip -r "$ZIP_FILE" "$PROJECT_NAME" > /dev/null) &
    (cd "$OUTPUT_ROOT" && tar -czvf "$TAR_FILE" "$PROJECT_NAME" > /dev/null) &

    echo "✅ مشروع $PROJECT_NAME قيد الضغط في الخلفية..." | tee -a "$LOG_FILE"
done

wait

echo "🎉 جميع مشاريع Base / OnChainKit تم استخراج ملفات الهوية JSON!" | tee -a "$LOG_FILE"
echo "📁 المخرجات موجودة في: $OUTPUT_ROOT" | tee -a "$LOG_FILE"
ls -lh "$OUTPUT_ROOT" | tee -a "$LOG_FILE"
echo "📝 سجل العملية: $LOG_FILE"

