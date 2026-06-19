spaces=' ================================= '
smallSpaces=' --__--__--__-- '
text='(s/n altro tasto per uscire)'
echo
echo $spaces Preparo build $spaces
find . -name '*.tsx' -exec sed -i -e 's|figma:asset|/src/assets|g' {} \;
find . -name '*.tsx-e' -type f -delete
npm i
npm audit fix --force
echo vuoi debuggare? $text
read BUILD
if [ $BUILD == 's' ]
then
npm run dev
fi
# bash prepare.sh 