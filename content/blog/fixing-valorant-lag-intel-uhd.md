---
title: Fixing Valorant Lags, Stuttering, FPS drops on Intel UHD integrated graphics
date: 2021-12-25
tags: [gaming]
description: Roll back the Intel UHD display driver to stop Valorant from stuttering.
---

![Valorant](https://wallpaperaccess.com/full/3037903.jpg)

## Overview

Valorant conflicts with the newer edition of the Display Driver of Intel UHD series graphics, which they confirmed will be solving in the future patches. Even though you try optimizing your pc and even the game wouldn't fix the issue, as it the problem with the device driver itself.

## Uninstalling the Newer Versions of the Driver

It is not recommended to use the older versions of device drivers as it has some security issues, but since valorant is not compatible with the newer versions i.e. above 27 therefore we will have to install older version of the driver from intel's website. To uninstall the existing driver you'll need a Display Driver Uninstaller or [DDU](https://www.guru3d.com/files-get/display-driver-uninstaller-download,1.html).

## Steps

### Uninstalling the drivers

1. Download [Display Driver Uninstaller](http://www.guru3d.com/files-details/display-driver-uninstaller-download.html).
2. Extract the file and then run DDU as an administrator.
3. You'll see three buttons available on the left side. If you're installing a new driver for your graphic card, simply select Clean and Restart button.
4. Optional: You can also set Windows so it won't download drivers all by itself.
5. Restart your computer.

### Installing driver

1. Download the older version i.e. [Intel UHD graphics Driver version 26.20.100.8141](https://www.intel.com/content/www/us/en/download/19344/29530/intel-graphics-windows-dch-drivers.html) and install it.
2. Restart your computer once again.

This should fix all the lags in-game.
