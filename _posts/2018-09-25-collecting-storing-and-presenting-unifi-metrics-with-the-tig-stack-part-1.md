---
layout: post
title: Collecting, storing, and presenting Unifi metrics with the TIG stack (part
  1)
date: 2018-09-25 09:30:09.000000000 -04:00
image: 2018-09-tig-stack-header.jpg
categories:
- geek
- tutorials
tags:
- docker
- grafana
- influxdb
- snmp
- telegraf
- unifi
permalink: "/blog/geek/collecting-storing-and-presenting-unifi-metrics-with-the-tig-stack-part-1/"
---

So this article is going to be part 1 of 3 (hopefully). The goal is to walk through how I'm collecting and storing my Unifi metrics and then presenting them in a sort of dashboard type view. The technologies in use here are from the TIG stack - which consists of Telegraf, InfluxDB, and Grafana. The catch here is that I've not even finished getting up my Unifi metrics in Grafana (part 3 the visualization). I plan to use this article series as a driver to help get that finally completed and pushed out to you all. Either way lets get started and dig into the core storage piece of things.

If you're a more advanced user, then skip down to the <a href="#tldr">TL;DR tag</a> where I'll simply outline the basics with commands and output samples.

#### Install InfluxDB

Now you can choose a few ways to setup your InfluxDB, but we're going to be setting this up here using docker. Personally I love using docker for setting up new apps and keeping them running smoothly. It also affords you the ease to replicate and run tests before deploying your changes. But I digress. You can choose to use a local install on a system or a VM if you'd like - but you'll need to search elsewhere on how to get this configured as I'll only be covering the docker avenue. 

This is relatively quick and painless if your environment is already setup and running. If you are running an updated version of docker, and you know where you'll be storing your database, we can simply run the following command. Be sure to substitute in your location for the $PWD below to point to where you'd like to store your DB, or optionally just run this from that directory.

{% highlight bash %}
docker run -p 8086:8086 -v $PWD:/var/lib/influxdb --name influxdb influxdb
{% endhighlight %}

If you'd like to read the documentation for additional options to dig into after you get the hang of things, check out the official <a href="https://hub.docker.com/_/influxdb/">InfluxDB Docker Hub</a> information. It outlines additional options you can use to set this up with further specification and usage options for more advanced scenarios such as using the Graphite interface or running an OpenTSDB. Those options are outside the scope of this article.

At this point we should have a running container named influxdb running on port 8086 on our local system where the container was started. To check this you can run `docker ps -a` and look for the running container to be listed. Mine has been running awhile, but you should see an "Up" followed by a time it's been running. If you have other docker containers, then just look for the influxdb container in the list by name.

{% highlight bash %}
user@server$ docker ps -a
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                                            NAMES
fff3edce24f8        influxdb:latest     "/entrypoint.sh in..."   5 weeks ago         Up 45 hours         0.0.0.0:8083->8083/tcp, 0.0.0.0:8086->8086/tcp   influxdb
{% endhighlight %}

Great! We've got our container running. Painless right? Let's jump into the next section and get into the actual container to setup our first DB and prepare for part 2 of this article.

#### Creating a Databse

So now that we have our container running, or perhaps you setup a VM/Local install - we want to get access to our InfluxDB shell to setup our first DB to use for collection. To do this for our container, we need to enter the container or simply run a command inside the container. In this case it's going to be the `influx` command to get access to the InfluxDB shell. 

For the docker container we're going to use the following command: `docker exec -it influxdb influx` which will bring us into the shell which should look something like this:

{% highlight bash %}
user@server$ docker exec -it influxdb influx
Connected to http://localhost:8086 version 1.6.1
InfluxDB shell version: 1.6.1
> 
{% endhighlight %}

Now that we've got a shell, let's create our first DB! I'll reference the syntax for the <a href="https://docs.influxdata.com/influxdb/v1.6/query_language/database_management/#create-database">InfluxDB shell here</a> - in case you would like to dig a little deeper or to see why something may not be working properly when you setup subsequent DB's. I'll dig a little deeper into my preferred way of organizing data you may collect with Telegraf below. The short version, is that I think it's best to break out the sets of data being collected into their own DB for organization, simplicity, and potential scale. So for this reason, let's create a new DB called `telegraf_unifi` and we'll use a 90 day retention policy. If you'd like to make the retention longer, feel free.

{% highlight bash %}
> create database telegraf_unifi with duration 90d 
> show databases 
name: databases
 name
 ----
 _internal 
telegraf_unifi 
> show retention policies on telegraf_unifi 
name    duration  shardGroupDuration replicaN default 
----    --------  ------------------ -------- ------- 
autogen 2160h0m0s 24h0m0s            1        true
 > 
{% endhighlight %}

So our first step we created a database called telegraf_unifi with a duration (retention period) of 90d (90 days). If we are successful, there will be no feedback. So to validate this worked, we use `show databases` to verify our database was created. And lastly we validate the retention period was set properly using `show retention policies` on our newly created DB.

#### InfluxDB Organization

So before we head off to the collection of Unifi metrics into our fresh DB, I wanted to take a moment and just talk about organization quickly. This is a tip coming from someone who did it the hard way. As you start to dive down this rathole of collecting metrics and using Grafana to display them, you can find you start to collect a lot of stuff. When you do, there starts to be a LOT of extra data you end up with in your Influx databases. It also is a little more repeatable to create/use configurations in Grafana when you know where individual data points are stored.

While I don't have an easy visual (as its extraneous amounts of lines of text not worth viewing) - I'll just give you can idea on the amount of different "series" of data being collected for JUST my Unifi devices - 350. So that means I have 350 different "objects" being collected from where I have a series of data. This includes things like port bandwidth usage, memory usage, cpu usage, cpu temperatures, etc. So as you can imagine, it starts to get difficult looking for the needle in the haystack when you start piling all this data into one big database. 

So that about wraps things up. Next we'll work on setting up the collection of our metrics from our Unifi hardware. We'll do this using Telegraf in Part  2 of this article. If you haven't already - subscribe so you can get notified when great new content like this comes out!

<a href="https://1activegeek.com/blog/geek/collecting-storing-and-presenting-unifi-metrics-with-the-tig-stack-part-2/">Next up, Part 2 configuring Telegraf</a>

<a name="tldr"></a>
#### TL;DR - Just gimme the snippets!

- Create the InfluxDB container:`docker run -p 8086:8086 -v $PWD:/var/lib/influxdb --name influxdb influxdb`
- Validate container is running:`user@server$ docker ps -a`
- Exec into the docker container and invoke the influxDB shell:`user@server$ docker exec -it influxdb influx`
- Create the DB with a 90 day retention schedule:`create database telegraf_unifi with duration 90d`
- Validate the DB was created successfully:`show databases`
- Validate the retention policy is correct:`show retention policies on telegraf_unifi`

{% highlight bash %}
user@server$ docker run -p 8086:8086 -v $PWD:/var/lib/influxdb --name influxdb influxdb
user@server$ docker ps -a
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                                            NAMES
fff3edce24f8        influxdb:latest     "/entrypoint.sh in..."   5 weeks ago         Up 45 hours         0.0.0.0:8083->8083/tcp, 0.0.0.0:8086->8086/tcp   influxdb
user@server$ docker exec -it influxdb influx
Connected to http://localhost:8086 version 1.6.1
InfluxDB shell version: 1.6.1
> create database telegraf_unifi with duration 90d
> show databases
name: databases
name
----
_internal
telegraf_unifi
> show retention policies on telegraf_unifi
name    duration  shardGroupDuration replicaN default
----    --------  ------------------ -------- -------
 autogen 2160h0m0s 24h0m0s 1 true \>

{% endhighlight %}



