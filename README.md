# generator-jhipster-debian-packager
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]
> JHipster module, packages a JHipster application into a debian/ubuntu .deb package

# Introduction

This is a [JHipster](http://jhipster.github.io/) module, that is meant to be used in a JHipster application.
The module uses the [jdeb](https://github.com/tcurdt/jdeb) library to repackage the war and configuration files into a .deb archive

# Prerequisites

As this is a [JHipster](http://jhipster.github.io/) module, we expect you have JHipster and its related tools already installed:

- [Installing JHipster](https://jhipster.github.io/installation.html)

# Installation

To install this module:

```bash
npm install -g generator-jhipster-debian-packager
```

To update this module:
```bash
npm update -g generator-jhipster-debian-packager
```

# Usage

In your JHipster project directory run:
```bash
yo jhipster-debian-packager
```
This will add a jdeb goal to the pom.xml and support files that will create a .deb archive in the target directory when ```mvn package``` is called.
Options :
* ```--force``` if you don't want questions to be asked.
* ```--clean``` to uninstall the module instead of installing.

NOTE: with the current version of JHipster, some modifications must be done manually in the pom.xml:
* upgrade Spring Boot version to 1.3.2.RELEASE (because of issue https://github.com/spring-projects/spring-boot/issues/4866)
* with JHipster version <= 2.26.2, set the war as executable for the prod profile with ```<executable>true</executable>```

You can then use the command
```bash
dpkg-i target/myapp_0.0.1~SNAPSHOT_all.deb
```
to install the package on a debian or ubuntu server. Or you can deploy it to an apt repository.

The executable war will be installed and started as a linux service. To start it manually use:
```bash
sudo service <appname> start
```
By default, the application is started with the ```prod``` profile. This can be changed in the ```/etc/default/<appname>``` configuration file.

The package installs the following files:
* ```/usr/share/<appname>/lib/<appname>-<version>.war```: your JHipster application as executable war symlinked to ```/usr/share/<appname>/bin/<appname>```
* ```/etc/default/<appname>```: the launch script configuration file (see Spring Boot [doc](https://docs.spring.io/spring-boot/docs/current/reference/html/deployment-install.html#deployment-script-customization-conf-file). The .conf file is symlinked to this file)
* ```/etc/<appname>/```: the directory for the configuration files (application.yml, ...)
* ```/var/log/<appname>/``` : the directory for the application logs

# License

Apache-2.0 © [Christophe Bornet]

[npm-image]: https://img.shields.io/npm/v/generator-jhipster-debian-packager.svg
[npm-url]: https://npmjs.org/package/generator-jhipster-debian-packager
[travis-image]: https://travis-ci.org/cbornet/generator-jhipster-debian-packager.svg?branch=master
[travis-url]: https://travis-ci.org/cbornet/generator-jhipster-debian-packager
[daviddm-image]: https://david-dm.org/cbornet/generator-jhipster-debian-packager.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/cbornet/generator-jhipster-module
