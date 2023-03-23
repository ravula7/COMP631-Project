#!/bin/bash

sudo apt update
sudo apt-get install -y nginx
sudo cp -f nginx.conf /etc/nginx/nginx.conf
sudo cp -f -r webpage /webpage
sudo adduser --system --no-create-home --shell /sbin/nologin --group nginx
sudo systemctl start nginx
sudo systemctl enable nginx
sudo apt install snapd
sudo snap install core
sudo snap install --classic certbot
sudo certbot --nginx