#!/bin/bash

sudo apt update
sudo apt-get install -y nginx
cp -f nginx.conf /etc/nginx/nginx.conf
cp -f -r /webpage /webpage
systemctl start nginx
systemctl enable nginx