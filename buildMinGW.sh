#!/bin/bash 






function getExt {
	OS=$1
	if [ $OS != 'linux' ]; 
	then
		echo '.zip';
	else
		echo '.tar.gz';
	fi
}

function clean {
	rm -rf webkit-build/tmp
	mkdir -p ./webkit-build/tmp
}

function mkNW {	

	FILES=`ls | grep -v webkit-build | grep -v exe | grep -v zip | grep -v sh | sed -e ':a;N;$!ba;s/\n/ /g'`
	
	echo "***"
	echo $FILES
	echo "***"

	prjName=$1;
	echo "*** making project archive $prjName in $PWD "
	echo "7z.exe a -r $prjName.zip  $FILES " > doZip; 
	chmod 777 doZip 
	./doZip > /Dev/null

	rm -f doZip
	
	#7z.exe -qar $prjName.zip  $FILES  > /dev/null

	mkdir -p webkit-build/tmp/
	cp $prjName.zip webkit-build/tmp/$prjName.nw

	echo "done";
}

function build {

	export VERSION=$1

	export ARCHI=$2

	export OS=$3

	export prjName=$4

	echo "*** build binary $prjName for $OS $ARCHI"	

	#rm -rf ./webkit-build/tmp
	#
	echo "buildLinux $OS $ARCHI $VERSION" ;
	EXT=`getExt $OS`
	FILE_NAME="node-webkit-v$VERSION-$OS-$ARCHI$EXT";	
	echo "copying webkit build $FILE_NAME to tmp dir"
	cp ./webkit-build/cache/$VERSION/$OS/$ARCHI/$FILE_NAME ./webkit-build/tmp
	cd ./webkit-build/tmp
	echo "untar gziping $FILE_NAME"
	echo "********** files :: ***************"
	ls .
	echo "*************************"
	if [ $OS = 'linux' ]
	then	
		tar xzvf $FILE_NAME
	else
		unzip $FILE_NAME	
	fi	

	echo $FILE_NAME | sed -e "s/$EXT//g" > tmp_fold
	NW_FOLDER=`cat tmp_fold`
	rm tmp_fold;

	echo 
	echo "nw folder ::  $NW_FOLDER";
	echo
	pwd
	cp ../../images/appicon.ico .
	case "$OS" in 
    linux)
		echo "buildLinux $NW_FOLDER $ARCHI $prjName";
        buildLinux $NW_FOLDER $ARCHI $prjName;
        ;;
     "osx")
     	builOsX $NW_FOLDER $ARCHI $prjName
     	;;	
     "win")
        buildWin $NW_FOLDER $ARCHI $prjName
        ;;
     *)
     	echo "error : unknwon OS : $OS";
     	exit 42;
     esac   


	# TODO : create ../releas/$OS/$ARCHI
	#   in folder : 
	#        make bin
	#        copy necessary bin so pak dll ... to release/OS/ARCHI

	echo "done for now";
}

function buildLinux {
	echo
	echo "specfic actions for linux in $PWD"
	export NW_FOLDER=$1;
	export ARCHI=$2;
	export PRJ=$3;
	export OUT=../releases/linux/$ARCHI;
	mkdir -p $OUT;

	cp $NW_FOLDER/nw.pak $OUT
	cp $NW_FOLDER/*.so $OUT
	cat $NW_FOLDER/nw $PRJ.nw > $OUT/$PRJ && chmod +x $OUT/$PRJ 
	
}

function buildOsX {
	echo "specfic actions for OS X"
	NW_FOLDER=$1;
	ARCHI=$2;
	$PRJ=$3;
	$OUT = ../releases/linux/$ARCHI;
	mkdir -p $OUT;
	cp $NW_FOLDER/nw.pak $OUT
	cp $NW_FOLDER/*.so $OUT
	cat $NW_FOLDER/nw ../$PRJ.nw > $OUT/$PRJ && chmod +x $OUT/$PRJ 
	cp appicon.ico $OUT
}

function buildWin {
		echo
	echo "specfic actions for Windows in $PWD"
	export NW_FOLDER=.;
	export ARCHI=$2;
	export PRJ=$3;
	export OUT=../releases/win/$ARCHI;
	mkdir -p $OUT;

	cp $NW_FOLDER/nw.pak $OUT
	cp $NW_FOLDER/*.dll $OUT
	cat $NW_FOLDER/nw.exe $PRJ.nw > $OUT/$PRJ.exe && chmod +x $OUT/$PRJ.exe 
	cp appicon.ico $OUT
}

function downloadIfNecessary {
	
	echo "*** downloading if necessary node-webkit build $1 $2 $3"		

	export VERSION=$1

	export ARCHI=$2

	export OS=$3
	EXT=`getExt $OS`
	FILE_NAME="node-webkit-v$VERSION-$OS-$ARCHI$EXT";	
	if [ -f ./webkit-build/cache/$VERSION/$OS/$ARCHI/$FILE_NAME ]
	then
		echo "file already downloaded";
	else
		echo "not found /webkit-build/cache/$VERSION/$OS/$ARCHI/$FILE_NAME => downloading"	
		downloadBuild $VERSION $ARCHI $OS;	
	fi

}


function downloadBuild {
	echo "*** downloading node-webkit build $1 $2 $3"		

	export VERSION=$1

	export ARCHI=$2

	export OS=$3

	EXT=`getExt $OS`

	if [ $OS != 'linux' ]; 
	then
		export EXT='.zip';
	else
		export EXT='.tar.gz';
	fi


	export DL_PATTERN="https://s3.amazonaws.com/node-webkit/v#VERSION#/node-webkit-v#VERSION#-#OS#-#ARCHI#$EXT"

	echo $DL_PATTERN | sed -e "s/#VERSION#/$VERSION/g" > v_subst;
	export DL2=`cat ./v_subst`;
	rm -f v_subst

	echo $DL2 | sed -e "s/#ARCHI#/$ARCHI/g" > arch_subst;
	export DL3=`cat ./arch_subst`;
	rm -f arch_subst

	echo $DL3 | sed -e "s/#OS#/$OS/g" > os_subst;
	export DL=`cat ./os_subst`;
	rm os_subst;


	
	if [ -e ./webkit-build/cache/$VERSION/$OS/$ARCHI ]
	then
		echo "cache exists"
	else
		mkdir -p ./webkit-build/cache/$VERSION/$OS/$ARCHI	
	fi
	echo "downloading $DL"

	curl -x $http_proxy -o node-webkit-v$VERSION-$OS-$ARCHI$EXT $DL 
	#axel   $DL -o node-webkit-v$VERSION-$OS-$ARCHI$EXT
	echo "moving node-webkit-v$VERSION-$OS-$ARCHI$EXT to ./webkit-build/cache/$VERSION/$OS/$ARCHI;"
	mv  node-webkit-v$VERSION-$OS-$ARCHI$EXT ./webkit-build/cache/$VERSION/$OS/$ARCHI;

	rm -f node-webkit*tar*
	rm -f node-webkit*zip


	echo "done";

}


function build_usage {
	echo "$0 <node-webkit version> <architecture> <OS>"
	echo "     - <node-webkit version> : version of node-webkit. 0.8.1 for example"
	echo "     - <architecture> : ia32 or x64 (x64 only available for linux)"
	echo "     - <OS> : the OS, win, osx or linux"
}



if [ $# != 3 ]
then	
	build_usage $0;
	exit 1;
fi

export VERSION=$1

export ARCHI=$2

export OS=$3



clean

downloadIfNecessary $VERSION $ARCHI $OS

prjName=${PWD##*/}
echo 
echo "Project Name :: $prjName";
echo

mkNW $prjName;

build  $VERSION $ARCHI $OS $prjName