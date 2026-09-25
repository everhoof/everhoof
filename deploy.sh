export NVM_DIR=~/.nvm
source ~/.nvm/nvm.sh

find . -maxdepth 1 ! -name node_modules ! -name artifacts.tgz ! -name ecosystem.config.js ! -name . ! -name .. -exec rm -rf {} \;
tar -xvf artifacts.tgz
rm artifacts.tgz

NODE_ENV=$NODE_ENV pm2 stop ecosystem.config.js
nvm use 14.18.1
export PNPM_HOME="$HOME/.local/share/pnpm"
export PATH="$PNPM_HOME:$PATH"
curl -fsSL https://get.pnpm.io/install.sh | env PNPM_VERSION=12.6.0 sh -
pnpm install --frozen-lockfile --prod
NODE_ENV=$NODE_ENV pm2 start ecosystem.config.js
pm2 save
