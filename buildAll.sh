#!/bin/bash 

function build_usage {
	echo "$0 <node-webkit version> "
	echo "     - <node-webkit version> : version of node-webkit. 0.8.1 for example"	
}

if [ $# != 1 ]
then	
	build_usage $0;
	exit 1;
fi

echo "build windows"
./build.sh  $1 ia32 win > /dev/null
echo "build linux x64"
./build.sh  $1 x64 linux > /dev/null
echo "build linux ia32"
./build.sh  $1 ia32 linux > /dev/null
echo "all done"
