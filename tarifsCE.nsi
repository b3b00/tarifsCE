
; example1.nsi
;
; This script is perhaps one of the simplest NSIs you can make. All of the
; optional settings are left to their default settings. The installer simply 
; prompts the user asking them where to install, and drops a copy of "MyProg.exe"
; there.

;--------------------------------

; The name of the installer
Name "Example1"

; The file to write
OutFile "installTarifsCE.exe"

; The default installation directory
InstallDir c:\Tarifs

; The text to prompt the user to enter a directory
DirText "This will install My Cool Program on your computer. Choose a directory"

;--------------------------------

; The stuff to install
Section "" ;No components page, name is not important

	

	; Set output path to the installation directory.
	SetOutPath $INSTDIR

	; Put file there
	File webkit-build\releases\win\ia32\*


	

	CreateDirectory "$INSTDIR\data"
	CreateDirectory "$SMPROGRAMS\CE-CGI-NORD"
	;CreateShortCut "$SMPROGRAMS\CE-CGI-NORD\tarifs.lnk" "$INSTDIR\tarifsCE.exe" \
	;" --data-path=$INSTDIR "  "$INSTDIR\appicon.ico,0" SW_SHOWNORMAL  "Tarifs billeterie CE"

	; Uninstaller - See function un.onInit and section "uninstall" for configuration
	writeUninstaller "$INSTDIR\uninstaller.exe"

SectionEnd ; end the section


Section "Uninstall"  ; uninstaller

	# Always delete uninstaller first
	delete $INSTDIR\uninstaller.exe
	 
	# now delete installed file
	delete $INSTDIR\*.exe
	delete $INSTDIR\*.dll
	delete $INSTDIR\nw.pak

SectionEnd 


