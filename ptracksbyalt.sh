#!/usr/bin/env bash

TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
WORKING_DIR=/home/$USER/oarc-adsb-screenshots
TARGET_DIR=$WORKING_DIR/$TIMESTAMP
SYMLINK=$WORKING_DIR/latest

mkdir -p $TARGET_DIR

echo -e 'Writing 12 hourly ptracks graphs...\n'
google-chrome-stable --enable-logging=/dev/null --headless --disable-gpu --disable-3d-apis --screenshot=$TARGET_DIR/0to5k.png --virtual-time-budget=60000 "https://adsb.oarc.uk/?ptracks&filterAltMax=5000&zoom=5.5&hideSidebar&hideButtons&screenshot"
google-chrome-stable --enable-logging=/dev/null --headless --disable-gpu --disable-3d-apis --screenshot=$TARGET_DIR/5to17k.png --virtual-time-budget=60000 "https://adsb.oarc.uk/?ptracks&filterAltMin=5500&filterAltMax=17500&zoom=5.5&hideSidebar&hideButtons&screenshot"
google-chrome-stable --enable-logging=/dev/null --headless --disable-gpu --disable-3d-apis --screenshot=$TARGET_DIR/17to30k.png --virtual-time-budget=60000 "https://adsb.oarc.uk/?ptracks&filterAltMin=17500&filterAltMax=30000&zoom=5.5&hideSidebar&hideButtons&screenshot"
google-chrome-stable --enable-logging=/dev/null --headless --disable-gpu --disable-3d-apis --screenshot=$TARGET_DIR/30kandup.png --virtual-time-budget=60000 "https://adsb.oarc.uk/?ptracks&filterAltMin=35000&zoom=5.5&hideSidebar&hideButtons&screenshot"

if [ -L $SYMLINK ] ; then
    rm $SYMLINK
fi

ln -s $TARGET_DIR $SYMLINK

