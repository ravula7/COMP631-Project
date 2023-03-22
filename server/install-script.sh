#!/bin/bash

sudo apt update
sudo apt-get install -y nginx
sudo cp -f nginx.conf /etc/nginx/nginx.conf
sudo cp -f -r webpage /webpage
sudo systemctl start nginx
sudo systemctl enable nginx