FROM node:8

WORKDIR /app

ARG NPM_REGISTRY_TOKEN

COPY tsconfig.json  ./
COPY proxy  ./proxy/
COPY src  ./src/
COPY package.json ./

# allowing docker to access the private repo
RUN echo "//npm.slock.it/:_authToken=\"$NPM_REGISTRY_TOKEN\"" > ~/.npmrc \
    && npm set registry https://npm.slock.it \
    && npm install \
    && npm run build \
    && npm prune --production \
    && npm install koa args koa-bodyparser \
    && rm -rf src tsconfig.json ~/.npmrc

# setup ENTRYPOINT
EXPOSE 8545
ENTRYPOINT ["node", "js/proxy/main.js"]




