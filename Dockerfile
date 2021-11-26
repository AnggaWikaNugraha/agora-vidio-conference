# FROM node:14-alpine as build

# WORKDIR /app

# COPY package*.json ./

# RUN npm install

# COPY . ./

# ARG REACT_APP_AGORA_APP_ID
# ARG REACT_APP_GENERATE_TOKEN_URL
# ENV REACT_APP_AGORA_APP_ID=$REACT_APP_AGORA_APP_ID
# ENV REACT_APP_GENERATE_TOKEN_URL=$REACT_APP_GENERATE_TOKEN_URL

# RUN npm run build

# FROM nginx:1.21.1-alpine
# COPY --from=build /app/build /usr/share/nginx/html
# RUN rm -rf /etc/nginx/conf.d
# COPY conf /etc/nginx

FROM nginx:1.21.1-alpine

COPY build /usr/share/nginx/html

RUN rm -rf /etc/nginx/conf.d

COPY conf /etc/nginx