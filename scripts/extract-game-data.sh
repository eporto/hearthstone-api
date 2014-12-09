#!/bin/bash

escape="\033";
green="${escape}[32m";
yellow="${escape}[33m";
red="${escape}[31m";
reset="${escape}[0m";
INFO="\n[${green}INFO${reset}]"
ERROR="[${red}ERROR${reset}]"
WARNING="\n[${yellow}WARNING${reset}]"

PREVIOUS_VERSION=$(cat json/info.json | jq -r '.BlizzardFileVersion')



echo -e "${INFO} Checking for Hearthstone update"
plutil -convert json /Applications/Hearthstone/Hearthstone.app/Contents/info.plist -o json/info.json
CURRENT_VERSION=$(cat json/info.json | jq -r '.BlizzardFileVersion')

if [ "${PREVIOUS_VERSION}" == "${CURRENT_VERSION}" ]; then
    echo -e "${INFO} Version found: ${CURRENT_VERSION} - No change"
    CHANGE_FOUND=false
else
    echo -e "${WARNING} New version found: ${CURRENT_VERSION} - Update from: ${PREVIOUS_VERSION}"
    CHANGE_FOUND=true
fi


if [ "${CHANGE_FOUND}" == true ];  then
    echo -e "${INFO} Extracting xml from cardxml0.unity3d"
    ../disunity/disunity.sh extract /Applications/Hearthstone/Data/OSX/cardxml0.unity3d



    echo -e "${INFO} Backing up current enUS.xml to enUS-${PREVIOUS_VERSION}.xml"
    mv -v xml/enUS.xml xml/enUS-${PREVIOUS_VERSION}.xml
    


    echo -e "${INFO} Moving xml into project"
    mv -v /Applications/Hearthstone/Data/OSX/cardxml0/CAB-cardxml0/TextAsset/enUS.txt xml/enUS.xml



    echo -e "${INFO} Cleaning up"
    rm -r /Applications/Hearthstone/Data/OSX/cardxml0
fi


echo -e "${INFO} Done"
