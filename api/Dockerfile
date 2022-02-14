FROM node:14-slim

WORKDIR /usr/src/app

# https://github.com/prisma/prisma/issues/1301#issuecomment-574317426
RUN apt-get -qy update
RUN apt-get -qy install openssl

COPY . .

RUN yarn install --pure-lockfile --non-interactive

RUN yarn db:generate

EXPOSE 3000

CMD sh -c "yarn db:migrate && yarn start"