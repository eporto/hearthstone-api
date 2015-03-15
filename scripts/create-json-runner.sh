#!/bin/bash

SUPPORTED_LANGUAGES=(
    deDE
    enGB
    enUS
    esES
    esMX
    frFR
    itIT
    koKR
    plPL
    ptBR
    ptPT
    ruRU
    zhCN
    zhTW
)

for LANGUAGE in "${SUPPORTED_LANGUAGES[@]}"; do
    echo "Processing ${LANGUAGE}"

    node scripts/create-json.js ${LANGUAGE}  > json/${LANGUAGE}.json
done
