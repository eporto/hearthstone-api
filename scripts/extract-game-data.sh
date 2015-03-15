#!/bin/bash

escape="\033";
green="${escape}[32m";
yellow="${escape}[33m";
reset="${escape}[0m";
INFO="\n[${green}INFO${reset}]"
WARNING="\n[${yellow}WARNING${reset}]"

HEARTHSTONE_PATH=/Applications/Hearthstone

PREVIOUS_VERSION=$(jq -r '.BlizzardFileVersion' json/info.json)

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

echo -e "${INFO} Checking for Hearthstone update"
plutil -convert json ${HEARTHSTONE_PATH}/Hearthstone.app/Contents/info.plist -o json/info.json
CURRENT_VERSION=$(jq -r '.BlizzardFileVersion' json/info.json)

if [ "${PREVIOUS_VERSION}" == "${CURRENT_VERSION}" ]; then
    echo -e "${INFO} Version found: ${CURRENT_VERSION} - No change"

    if [[ $1 == "-f" ]]; then
        CHANGE_FOUND=true
        echo "${INFO} -f force is set, running anyway."
    else
        CHANGE_FOUND=false
    fi
else
    echo -e "${WARNING} New version found: ${CURRENT_VERSION} - Update from: ${PREVIOUS_VERSION}"
    CHANGE_FOUND=true
fi


if [ "${CHANGE_FOUND}" == true ];  then
    echo -e "${INFO} Extracting xml from cardxml0.unity3d"
    ../disunity/disunity.sh extract ${HEARTHSTONE_PATH}/Data/OSX/cardxml0.unity3d

    for LANGUAGE in "${SUPPORTED_LANGUAGES[@]}"; do
        # This is redundant, but I am doing it anyway.  A `git diff` will catch if
        # anything unexpected has happened after running this script.
        echo -e "${INFO} Backing up current ${LANGUAGE}.xml to ${LANGUAGE}-${PREVIOUS_VERSION}.xml"
        mv -v xml/${LANGUAGE}.xml "xml/${LANGUAGE}-${PREVIOUS_VERSION}.xml"



        echo -e "${INFO} Moving new xml into project"
        mv -v ${HEARTHSTONE_PATH}/Data/OSX/cardxml0/CAB-cardxml0/TextAsset/${LANGUAGE}.txt xml/${LANGUAGE}.xml



        echo -e "${INFO} Backing up new ${LANGUAGE}.xml to ${LANGUAGE}-${CURRENT_VERSION}.xml"
        cp -v xml/${LANGUAGE}.xml "xml/${LANGUAGE}-${CURRENT_VERSION}.xml"



        #echo -e "${INFO} Cleaning up"
        #rm -r ${HEARTHSTONE_PATH}/Data/OSX/cardxml0
    done
fi


echo -e "${INFO} Done"
