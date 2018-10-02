FROM node:8-alpine

WORKDIR /app

ARG NPM_REGISTRY_TOKEN

COPY tsconfig.json  ./
COPY proxy  ./proxy/
COPY src  ./src/
COPY package.json ./

# allowing docker to access the private repo
RUN echo "//npm.slock.it/:_authToken=\"$NPM_REGISTRY_TOKEN\"" > ~/.npmrc \
    && npm set registry https://npm.slock.it \
    && apk add --no-cache make gcc g++ python \
    && npm install \
    && npm run build \
    && rm -rf node_modules \
    && npm install --production \
    && npm install koa koa-bodyparser \
    && rm -rf src tsconfig.json ~/.npmrc proxy \
    && apk del binutils gmp isl libgomp libatomic pkgconf mpfr3 mpc1 gcc musl-dev libc-dev g++ make libbz2 expat libffi gdbm  ncurses-terminfo-base ncurses-terminfo  ncurses-libs readline sqlite-libs python2

# setup ENTRYPOINT
EXPOSE 8545
ENTRYPOINT ["node", "js/proxy/main.js"]




