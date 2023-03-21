#!/bin/bash

su root
apt update
apt-get install -y nginx
mv nginx.conf /etc/nginx/nginx.conf
mv /webpage /webpage
systemctl start nginx
systemctl enable nginx