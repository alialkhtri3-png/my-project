#!/bin/bash
# Usage: ./compile-base-identity-json-v2.sh /path/to/projects-root
# نسخة محسنة: استخراج ملفات الهوية JSON من مشاريع Base / OnChainKit وضغطها

ROOT_DIR="${1:-$PWD}"
OUTPUT_ROOT="$HOME/identity-json-compiled"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="$OUTPUT_ROOT/compile-log-$TIMESTAMP.txt"

mkdir -p "$OUTPUT_ROOT"

echo "🔍 فحص المجلد الرئيسي: $ROOT_DIR ..." | tee -a "$LOG_FILE"

# البحث عن كل مجلد يحتوي على package.json
find "$PROJECT_DIR" -type f \( -name "identity.json" -o -name "nft-metadata.json" -o -name "onchain-config.json" \) ! -path "*/node_modules/*" > "$LIST_FILE"

    echo "📂 تجهيز مشروع: $PROJECT_NAME ..." | tee -a "$LOG_FILE"
    mkdir -p "$OUTPUT_DIR"

    # البحث عن ملفات الهوية JSON المهمة فقط
    find "$PROJECT_DIR" -type f \( -name "identity.json" -o -name "nft-metadata.json" -o -name "onchain-config.json" \) > "$LIST_FILE"

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

