FROM nginx:1.15.6-alpine
LABEL maintainer="docker@biebersprojects.com"
EXPOSE 80
COPY ./ /usr/share/nginx/html/
