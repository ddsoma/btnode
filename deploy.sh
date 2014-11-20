
cd /Users/jade/documents/devworkspace/git/static
git reset --hard
git pull origin HEAD
cd /Users/jade/documents/devworkspace/node/btnode/grunt
grunt build-app1
cd ..
npm install
pm2 stop btnode -f
pm2 start app.js -n btnode