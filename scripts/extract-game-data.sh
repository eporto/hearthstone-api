#!/bin/bash

escape="\033";
green="${escape}[32m";
yellow="${escape}[33m";
reset="${escape}[0m";
INFO="\n[${green}INFO${reset}]"
WARNING="\n[${yellow}WARNING${reset}]"

HEARTHSTONE_PATH=/Applications/Hearthstone

PREVIOUS_VERSION=$(jq -r '.BlizzardFileVersion' json/info.json)



echo -e "${INFO} Checking for Hearthstone update"
plutil -convert json ${HEARTHSTONE_PATH}/Hearthstone.app/Contents/info.plist -o json/info.json
CURRENT_VERSION=$(jq -r '.BlizzardFileVersion' json/info.json)

if [ "${PREVIOUS_VERSION}" == "${CURRENT_VERSION}" ]; then
    echo -e "${INFO} Version found: ${CURRENT_VERSION} - No change"
    CHANGE_FOUND=false
else
    echo -e "${WARNING} New version found: ${CURRENT_VERSION} - Update from: ${PREVIOUS_VERSION}"
    CHANGE_FOUND=true
fi


if [ "${CHANGE_FOUND}" == true ];  then
    echo -e "${INFO} Extracting xml from cardxml0.unity3d"
    ../disunity/disunity.sh extract ${HEARTHSTONE_PATH}/Data/OSX/cardxml0.unity3d


    # This is redundant, but I am doing it anyway.  A `git diff` will catch if
    # anything unexpected has happened after running this script.
    echo -e "${INFO} Backing up current enUS.xml to enUS-${PREVIOUS_VERSION}.xml"
    mv -v xml/enUS.xml "xml/enUS-${PREVIOUS_VERSION}.xml"



    echo -e "${INFO} Moving new xml into project"
    mv -v ${HEARTHSTONE_PATH}/Data/OSX/cardxml0/CAB-cardxml0/TextAsset/enUS.txt xml/enUS.xml



    echo -e "${INFO} Backing up new enUS.xml to enUS-${CURRENT_VERSION}.xml"
    cp -v xml/enUS.xml "xml/enUS-${CURRENT_VERSION}.xml"



    echo -e "${INFO} Cleaning up"
    rm -r ${HEARTHSTONE_PATH}/Data/OSX/cardxml0
fi


echo -e "${INFO} Done"
