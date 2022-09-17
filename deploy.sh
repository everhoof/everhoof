export NVM_DIR=~/.nvm
source ~/.nvm/nvm.sh

find . -maxdepth 1 ! -name node_modules ! -name artifacts.tgz ! -name ecosystem.config.js ! -name . ! -name .. -exec rm -rf {} \;
tar -xvf artifacts.tgz
rm artifacts.tgz

NODE_ENV=$NODE_ENV pm2 stop ecosystem.config.js
nvm exec 14.18.1 npm i -g yarn
nvm exec 14.18.1 yarn --frozen-lockfile --production
NODE_ENV=$NODE_ENV pm2 start ecosystem.config.js
pm2 save
