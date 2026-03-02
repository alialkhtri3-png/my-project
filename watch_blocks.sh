#!/data/data/com.termux/files/usr/bin/bash

# تأكد من تثبيت jq أولاً:
# pkg install jq

previous_block=0

while true; do
  # طلب آخر بلوك من شبكة Base Mainnet
  block_hex=$(curl -s -X POST https://mainnet.base.org \
    -H "Content-Type: application/json" \
    -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' | jq -r '.result')

  # تحويل hex إلى decimal
  block_dec=$((block_hex))

  # حساب الفرق مع البلوك السابق
  if [ "$previous_block" -eq 0 ]; then
    diff=0
  else
    diff=$((block_dec - previous_block))
  fi

  # طباعة الوقت + رقم البلوك + الفرق
  echo "$(date '+%Y-%m-%d %H:%M:%S') - Last Block: $block_dec (+$diff)"

  # تحديث البلوك السابق
  previous_block=$block_dec

  # الانتظار 5 ثواني قبل التكرار
  sleep 5
done

