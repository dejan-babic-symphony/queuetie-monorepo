#!/bin/sh

ROOT_DIR=/usr/share/nginx/html

# Replace env vars in files served by NGINX
IFS=$'\n' # make newlines the only separator
for file in $ROOT_DIR/assets/*.js* $ROOT_DIR/index.html;
do
  # Loop through environment variables starting with "VITE_"
  for var in $(env | grep '^VITE_'); do
    # Extract the variable name
    var_name="PLACEHOLDER_$(echo "$var" | cut -d= -f1)"
    new_value=$(echo "$var" | cut -d= -f2-)
    # Replace the variable name with its value in the file
    sed -i "s|$var_name|$new_value|g" $file
  done
done

# Starting Nginx
nginx -g 'daemon off;'