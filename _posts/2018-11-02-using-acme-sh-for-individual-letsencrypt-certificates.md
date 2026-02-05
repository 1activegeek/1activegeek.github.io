---
layout: post
title: Using acme.sh for individual LetsEncrypt certificates
date: 2018-11-02 10:00:28.000000000 -04:00
image: 2018-11-acme-sh-cover.png
categories:
- geek
- quicktips
tags:
- docker
- nginx
- unRAID
# permalink: "/blog/geek/using-acme-sh-for-individual-letsencrypt-certificates/"
redirect_from:
  - /blog/geek/using-acme-sh-for-individual-letsencrypt-certificates
  - /blog/geek/using-acme-sh-for-individual-letsencrypt-certificates/
---
So you wanted to make your site a bit more secure and start to leverage SSL certificates using the popular LetsEncrypt method. Great choice!! I too took the same journey, as you can see for this site. The interesting thing, is I was using a popular NGINX Docker container from the team at LS.io. The up side, it was quick and easy, and it's my default NGINX install for hosting a few sites. The unfortunate thing, is that I didn't have a way to separate out the individual domains I was hosting to separate certificates. What do I mean, well let's dig a little deeper.

When you request a certificate, there is a possibility for it to have entries under "Subject Alternative Name". It's a cheap way in the legacy world to use one certificate for many destinations. It's not really a solid practice from a security standpoint either since a certificate with a list of 20 SAN, could become hacked, broken, or have the keys stolen. In this scenario there are now 20 other potential locations vulnerable to SSL attacks from a would-be attacker. It also means you have to replace a certificate in potentially 20 different places - that is for each app where it doesn't work.&nbsp;

For me personally, I just didn't think it looked very nice having a laundry list of names attached to a certificate for my domain. Since some of the entries were internally hosted only (aka rules blocking external access) it further created documentation of said systems that I don't want anyone to know of. In the security realm, you always need to realize that the least amount of information you can give up to an attacker, the better off you are. Some would call that security by obscurity, but it's simply decreasing the amount of help you truly give a hacker in making yourself an easy target.&nbsp;

The silver lining here, is that using this container isn't the only way to go! I stumbled upon this great repository&nbsp;[acme.sh](https://github.com/Neilpang/acme.sh)&nbsp;on GitHub. He created a set of shell scripts and cron jobs. They request the certificates needed and then use a cron job to request renewal on a specified interval. The cron job basically runs pretty frequently, with a control file that governs when to actually put through the request to LetsEncrypt for new certificates. What makes it even better, there is even a docker container version.

{:.center}

![]({{ site.baseurl }}/assets/img/2018-11-subject-alternative-name.png)
<br>
This is much better looking than a long list of gobbley gook
{: .center}
<style>
.center {
  text-align: center;
}
</style>

Let me step back for a moment and highlight that many users could likely just get away with installing the scripts right onto a system doing their web hosting or similar to retrieve it from. For me, I wanted to run this on an unRAID box as there are a few other containers including the NGINX container mentioned above running on it. If you aren't aware, it's not quite as straightforward/easy to install scripts, cron jobs, etc since the OS runs completely in memory on each boot. Enter the docker container option. Now I can just setup the initial certs using some docker commands, and then create a single cron job in the unRAID UI.&nbsp;

If you aren't aware, docker containers can be spun up on demand, run a command, and then spun down or deleted. In this case, I've done just that. You can take a look at the [appropriate syntax here](https://github.com/Neilpang/acme.sh/wiki/Run-acme.sh-in-docker). You run the initial script to get your certificates created, and then subsequently create a cron job to execute the cron activity which will check for renewal. And that's all there is to it, now I can have certificates that are solely for one entry or maybe just a \*.domain.com entry vs \*.domain1.com \*.domain2.com etc.&nbsp;

If you too are running a similar setup, the script below will create a log (in case of issues), clear the log once reaching a large enough size, and finally run the cron job (logging to said log). You'll also notice that the docker run command has a mount option being used so that the output of job, will drop the certs into the location where they will be needed. I should point out, you'll want to use the `--nginx`&nbsp;flag when running the `--issue`&nbsp;command. This will be sure that the output will include a proper formatted certificate for NGINX - aka the .PEM formats.

{% highlight bash %}
#!/bin/bash
## Make sure file exists
touch /mnt/user/appdata/nginx/keys/acmesh/cron-job.log
## Variables declarations
MaxFileSize=1000000
file_size=`du -b /mnt/user/appdata/nginx/keys/acmesh/cron-job.log | tr -s '\t' ' ' | cut -d' ' -f1`

## Log rotation component
    if [$file_size -gt $MaxFileSize];then   
        mv /mnt/user/appdata/nginx/keys/acmesh/cron-job.log /mnt/user/appdata/nginx/keys/acmesh/cron-job.log.old
        touch /mnt/user/appdata/nginx/keys/acmesh/cron-job.log
    fi

## Command to run
docker run --rm -i -v /mnt/user/appdata/nginx/keys/acmesh:/acme.sh --net=host --name=acme neilpang/acme.sh --cron >> /mnt/user/appdata/nginx/keys/acmesh/cron-job.log
{% endhighlight %}

<!-- <script src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js"></script><script>hljs.initHighlighting();</script> -->