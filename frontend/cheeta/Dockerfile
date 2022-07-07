FROM node:15-alpine  AS compile-image

RUN npm install -g npm@7.6.3
RUN npm install -g @angular/cli

WORKDIR /opt/ng
COPY package.json ./
RUN npm install --force
# RUN npm install

ENV PATH="./node_modules/.bin:$PATH"

COPY . ./

ARG BUILD_ENV

RUN echo "BUILD_ENV $BUILD_ENV"

RUN node node_modules/@angular/cli/bin/ng build --configuration $BUILD_ENV;

# RUN ng build

FROM nginx
# COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY default.conf /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

COPY --from=compile-image /opt/ng/dist/cheeta /usr/share/nginx/html
