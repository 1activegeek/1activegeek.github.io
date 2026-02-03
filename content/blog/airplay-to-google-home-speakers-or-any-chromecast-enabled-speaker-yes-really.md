---
title: "AirPlay to Google Home Speakers or any Chromecast enabled speaker ... yes really!"
date: 2019-04-28
tags:
  - blog
aliases:
  - /blog/uncategorized/airplay-to-google-home-speakers-or-any-chromecast-enabled-speaker-yes-really
  - /blog/uncategorized/airplay-to-google-home-speakers-or-any-chromecast-enabled-speaker-yes-really/
---

I know what you're thinking, it's not possible. There are bunches of posts all over of different ways to try and use AirPlay with convoluted methodologies. I promise you, I have the best and simplest way to do it. Sadly, I didn't even create it, I'm just a huge fan that is documenting and spreading the news about it!

So let's dive into it - whats the magic? It's an application developed by a great developer [phillippe44](https://github.com/philippe44) on GitHub called [AirConnect](https://github.com/philippe44/AirConnect). What the app does is to act as a sort of bridge. It will basically look for Chromecast or UPnP enabled streaming devices (others as well but this will be focused on Google Home Mini), and then to turn around and advertise those devices as AirPlay devices using another great app that allows for this streaming. So how does it convert? Think of it like a travel adapter for power - you plug it into one type of receptacle, and it converts it to the other format. In one side, out the other in the freshly converted format. The same happens here.

## Pros and Cons

So let's talk about the plus and minus, since there is always going to be some when we build things like this in the world. First up, lets get the negatives out of the way. Quality and delay. Based on what is happening here there is an expected delay. It's not something massive that makes this difficult or unusable in a fashion of some like 30 second delay. It's very small but noticeable, and needs to be kept in mind when you change tracks or volume for example. Quality isn't significantly degraded at this point, but being there is conversion happening, it's bound to drop some of the quality. If you're an audiophile, you'll likely notice. If you're like me, a general music listener who doesn't spend too much on audio equipment, you likely won't notice. Lastly the only big thing I noticed was the lack of AirPlay 2 features, which is a known limitation of the core AirPlay library in use I believe. This means you won't be able to effectively use the multi speaker audio options - I noticed a delay between the synced audio, so I considered it non-functional. It's worth noting as well in case this wasn't already obvious - this won't work for any video, only audio.

Now for the positives! This is easy - YOU GET TO PLAY APPLE MUSIC ON A GOOGLE HOME SPEAKER! I'm an apple household. I only own a few non-Apple based computing hardware (pentesting phone, kindle fire, and google home minis). Personally the Apple speakers are too much for our needs, and personally Siri isn't up to snuff compared to the Google Assistant capabilities. So for anyone who agrees and runs the Google Home speaker/screen systems, but lives in hte Apple ecosystem this will be a godsend! Especially in our case where we all have Apple Music and can easily just cast something via AirPlay onto them now. The other nice thing, is to address one of the issues in the negatives above - Speaker Groups are supported. So if you want to send audio to multiple devices, you can just create a speaker group, and then just wait for AirConnect to see it and presto magic it'll appear as a new target. I know the pro list seems shorter than the con list, but that's just based on the main purpose being usefulness over anything.

## Installation

Now lets dive into the details of getting this up and running. I'll highlight two mechanisms and also advise you to check the GitHub repo for additional help if something doesn't seem to line up properly. I'll also take this moment to outline the assumption that you are operating on a basic home network without too much complication in your configuration. What I mean by this is that all your devices are on the same local network and/or Wifi network. If you have things like VLAN's (if you don't know what those are, don't worry I'm not swearing at you), segemented network for IoT devices, or completely different subnets for your devices - then your mileage may vary. Feel free to drop a comment, but I can't guarantee I can help as multicast traffic can be tricky to deal with.

### Method 1 - Manual Install

It's already well documented if you didn't already check out the repo. So my suggestion for manual installation is to visit the [GitHub Repo - AirConnect](https://github.com/philippe44/AirConnect/tree/master/bin#installing) and follow the directions for your platform.

### Method 2 - Docker Install

Method 2 is my preferred method since I dockerize almost all my home apps now. For this purpose I built out a [docker container](https://hub.docker.com/r/1activegeek/airconnect) that will not only run the app, but also self-update upon every container re-build. If you're not familiar with Docker, I'd highly suggest checking it out. It's my favorite tech of the past 4 years or so now. If you are familiar, then you'll appreciate the container rebuild pulling the latest image. Essentially it's been configured to run a script on creation that will pull from the repo and copy over the binaries to their operating directory, then run them via Supervisor. Quick, easy, and works perfectly in my environment.

## What's left?

So what's left? NOTHING! If you haven't already gotten so excited, dive in. It's so easy - especially my docker container. It'll get you going, streaming, and now you can almost entirely via voice play your Apple Music on your Chromecast based speakers, Sonos devices, or other DLNA based systems.

![](/img/2019-04-airplay-screenshot.png)

*This is the end results - all my Google Home Mini devices show up with a + at the end to indicate they are the devices added from this integration*

If you don't have a speaker, then you can also help support my blog and tech efforts by clicking on one of the links below to get yourself a new device. Links will bring you to affiliate sites but allow me to receive a portion of proceeds to help fund the blog and future content.

[Google Home Display](https://amzn.to/2GTlHNV)  
[Sonos Play:1](https://amzn.to/2PCngn9)  
[Sonos Play:5](https://amzn.to/2GRRwb6)  
[Sonos PlayBar](https://amzn.to/2XWyB4zhttps://amzn.to/2XWyB4z)  
[Sonos Beam](https://amzn.to/2GR7Usc)  
[Sonos Connect:Amp](https://amzn.to/2INgWsy)

Unfortunately it seems Amazon won't let me direct link the Chromecast, and they don't have the Google Home Mini available - so maybe you can use those links and pick up something else nice for yourself? If you'd like to you can also use my BuyMeACoffee link.
