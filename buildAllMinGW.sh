#!/bin/bash 

echo "build windows"
./buildminGW.sh  $1 ia32 win > /dev/null
echo "build linux x64"
./buildMinGW.sh  $1 x64 linux > /dev/null
echo "build linux ia32"
./buildMinGW.sh  $1 ia32 linux > /dev/null
echo "all done"