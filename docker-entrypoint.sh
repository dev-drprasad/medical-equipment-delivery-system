#!/usr/bin/env sh
set -eu

envsubst '${RBO_UI_RBO_API_BASE_URL}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# https://stackoverflow.com/questions/32255814
exec "$@"
