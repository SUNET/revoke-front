FROM node:16 as build

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

ARG BACK_URL
ARG JWT_URL
ARG PER_PAGE

COPY . ./
RUN npm run build

FROM nginx:1.21
WORKDIR /usr/share/nginx/html
COPY --from=build /usr/src/app/dist ./

EXPOSE 80
