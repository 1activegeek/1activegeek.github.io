---
title: "Increase Max Upload Size in Wordpress"
date: 2018-07-21
section: blog
image: 2018-07-wordpress-cover.jpeg
tags:
  - docker
  - nginx
  - php
  - wordpress
  - geek
  - quicktips
aliases:
  - /blog/geek/increase-max-upload-size-in-wordpress
  - /blog/geek/increase-max-upload-size-in-wordpress/
---

This quick tip is focused around adjusting the max upload limit on a Wordpress site. While I was working on setting this site up, I ran into this issue since I was uploading large high quality media for my background images on the front page. So I naturally started the google hunt to find something. There are LOADS of different pieces of information and ways to try and adjust this. Unfortunately none of them were the right way for me.

I'm going to cover 2 ways to do this based on my configuration. I'm running my sites using the well known NGINX. What may be different from the default, is that I also run this in a docker container. What this means is that all content inside the container (unless mapped specifically) is ephemeral. The configuration reverts on restart/rebuild of said container. What most folks do (including myself) is to map the locations of important configs, to the local filesystem. This is called a volume mapping in the docker world.

## Method 1

In my case, I'm using the `linuxserver/letsencrypt` container. It maps the `/config` location to a local directory that I can modify it's contents. You may need to assess your specific build. Once inside, we are looking for the PHP folder in the root of the NGINX config folder. This can also apply if you are NOT running inside a docker container.

Once found, we need to add a new file if it doesn't already exist. If you're on the command line:

`nano php-local.ini`

Inside the file we need to add 2 lines of text:

`upload_max_filesize = 64M`  
`post_max_size = 64M`

Obviously you can adjust this to fit your needs. I set these to 64 Megabytes for now. You can adjust this to the specific sizing to fit your needs. Now a simple restart of the NGINX service, or a quick reload of the config, and you should now be able to see the updated size in your Wordpress max upload.

## Method 2

The alternative option if you prefer to set this per site perhaps, is to create specific configurations inside the virtual host file under the server block. This is pretty quick and painless and was the first solution for me before discovering Method 1 above. This one involves simply adding the following line inside your server block for your site:

`client_max_body_size 64m;`

Once you've done this, just restart the NGINX service or reload the configuration. You should then be able to see the same change reflected inside your Wordpress settings.
