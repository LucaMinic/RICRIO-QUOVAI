spaces=' ================================= '
smallSpaces=' --__--__--__-- '
echo
echo $spaces Inizio build $spaces
npm run build
sed -i.bak 's|</head>|<!-- Start cookieyes banner --><script id="cookieyes" type="text/javascript" src="https://cdn-cookieyes.com/client_data/a275d13eee5a9a7d363eb2bd7a8fd3e9/script.js"></script><!-- End cookieyes banner --></head>|' ./dist/index.html && rm -f ./dist/index.html.bak

DIR="./build"
NOW=$(date +%d-%m-%Y_%H-%M)
if [ ! -d "$DIR" ]; then
    mkdir "$DIR"
fi
cp ./public/web.config ./dist/ 2>/dev/null || :
mv ./dist $DIR/SITO_${NOW}
start $DIR 

# bash build.sh