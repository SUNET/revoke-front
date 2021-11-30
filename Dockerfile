FROM node as build

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

ARG BACK_URL
ARG JWT_URL
ARG PER_PAGE

COPY . ./
RUN npm run build

FROM nginx:alpine AS server
WORKDIR /usr/share/nginx/html

COPY --from=build /usr/src/app/dist ./

COPY nginx-entrypoint.sh .
COPY inject_template.js .
RUN apk add --no-cache gettext

EXPOSE 80

ENTRYPOINT ["sh", "./nginx-entrypoint.sh"]
