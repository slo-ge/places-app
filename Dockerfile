FROM nginx:1.19.5-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY /dist/export-latest /usr/share/nginx/html
