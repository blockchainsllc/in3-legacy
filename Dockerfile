#***********************************************************
# This file is part of the Slock.it IoT Layer.             *
# The Slock.it IoT Layer contains:                         *
#   - USN (Universal Sharing Network)                      *
#   - INCUBED (Trustless INcentivized remote Node Network) *
#***********************************************************
# Copyright (C) 2016 - 2018 Slock.it GmbH                  *
# All Rights Reserved.                                     *
#***********************************************************
# You may use, distribute and modify this code under the   *
# terms of the license contract you have concluded with    *
# Slock.it GmbH.                                           *
# For information about liability, maintenance etc. also   *
# refer to the contract concluded with Slock.it GmbH.      *
#***********************************************************
# For more information, please refer to https://slock.it   *
# For questions, please contact info@slock.it              *
#***********************************************************/

FROM node:10-alpine

WORKDIR /app

ARG NPM_REGISTRY_TOKEN

COPY tsconfig.json  ./
COPY proxy  ./proxy/
COPY src  ./src/
COPY package.json package-lock.json ./

# allowing docker to access the private repo
RUN apk add --no-cache make gcc g++ python \
    && npm install \
    && npm run build \
    && npm prune --production \
    && rm -rf src tsconfig.json proxy \
    && apk del binutils gmp isl libgomp libatomic pkgconf mpfr3 mpc1 gcc musl-dev libc-dev g++ make libbz2 expat libffi gdbm  ncurses-terminfo-base ncurses-terminfo  ncurses-libs readline sqlite-libs python2 || echo 'warnings'

# setup ENTRYPOINT
EXPOSE 8545
ENTRYPOINT ["node", "js/proxy/main.js"]




