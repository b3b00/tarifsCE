#!/bin/sh

LAST_AVAILABLE=`node ../webkitversions/getversions.js  | tail -n 1 | sed -e 's/v//g'`

if [ -e last_build ]	
then
 echo 
else
	echo '0' > last_build
fi	
LAST_BUILD=`cat last_build`

echo "last available : $LAST_AVAILABLE - last build : $LAST_BUILD"

if [ "$LAST_AVAILABLE" \> "$LAST_BUILD" ]
then
	echo "building with node-webkit v $LAST_AVAILABLE"
	./buildAll.sh $LAST_AVAILABLE
	echo $LAST_AVAILABLE > last_build	
fi 


