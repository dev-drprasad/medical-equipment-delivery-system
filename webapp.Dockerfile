# build environment
# make sure to match with .nvmrc version
FROM node:12.13-alpine as build
WORKDIR /app

ENV NODE_ENV=production

COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
RUN npm install


ARG RBO_UI_RBO_API_BASE_URL

COPY public /app/public
COPY jsconfig.json /app
COPY craco.config.js /app
COPY src /app/src

RUN npm run build

# production environment
FROM fholzer/nginx-brotli:v1.16.0

EXPOSE 80

COPY --from=build /app/build /usr/share/nginx/html
# RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf.template /etc/nginx/nginx.conf.template
COPY docker-entrypoint.sh /

ENTRYPOINT ["sh", "/docker-entrypoint.sh"]

CMD ["nginx", "-g", "daemon off;"]

# https://mherman.org/blog/dockerizing-a-react-app/
