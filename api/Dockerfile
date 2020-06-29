FROM node:12-slim  

ENV NODE_ENV production

EXPOSE 3000

RUN mkdir /opt/app
WORKDIR /opt/app

COPY . .

RUN buildDeps='g++ make python' \
    && apt-get update \
    && apt-get install -y --no-install-recommends $buildDeps \
    && npm install --only-production \
    && apt-get remove -y --purge --auto-remove $buildDeps \
    && rm -rf /var/lib/apt/lists/* /tmp/* /root/.node-gyp

RUN npm run build

RUN chmod +x ./docker-entrypoint.sh

ENTRYPOINT ["./docker-entrypoint.sh"]