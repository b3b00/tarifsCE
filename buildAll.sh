#!/bin/bash 

echo "build windows"
./build.sh  $1 ia32 win > /dev/null
echo "build linux x64"
./build.sh  $1 x64 linux > /dev/null
echo "build linux ia32"
./build.sh  $1 ia32 linux > /dev/null
echo "all done"
