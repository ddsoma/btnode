git reset --hard
git pull origin master
npm install
pm2 stop myapp -f
pm2 start app.js -n myapp