#!/bin/sh

npx sequelize-cli db:migrate

node ./dist/src/main.js