FROM openresty/openresty:alpine-fat
RUN mkdir /var/log/nginx && mkdir /var/www && mkdir /var/www/html
RUN apk add --no-cache openssl-dev
RUN apk add --no-cache git
RUN apk add --no-cache gcc
RUN luarocks install lua-resty-openidc
COPY nginx.conf /config/nginx.conf
COPY cert.crt /config/cert.crt
COPY privkey.pem /config/privkey.pem
COPY index.html /var/www/html/index.html
RUN cp /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/ca-certificates.pem
ENTRYPOINT ["/usr/local/openresty/nginx/sbin/nginx", "-g", "daemon off;"]
CMD ["-c", "/config/nginx.conf"]