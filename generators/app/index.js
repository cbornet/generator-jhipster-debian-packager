'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var packagejs = require(__dirname + '/../../package.json');
var _ = require('underscore.string');
var shelljs = require('shelljs');
var fs = require('fs');
var path = require('path');

// Stores JHipster variables
var jhipsterVar = {moduleName: 'debian-packager'};

// Stores JHipster functions
var jhipsterFunc = {};

module.exports = yeoman.generators.Base.extend({

  initializing: {
    templates: function (args) {
      this.composeWith('jhipster:modules', {
        options: {
          jhipsterVar: jhipsterVar,
          jhipsterFunc: jhipsterFunc
        }
      });
    },
    displayLogo: function () {
      // Have Yeoman greet the user.
      this.log(yosay(
        'Welcome to the ' + chalk.red('JHipster debian-packager') + ' generator! ' + chalk.yellow('v' + packagejs.version)
      ));
    }
  },

  prompting: function () {
    var done = this.async();

    if (jhipsterVar.buildTool !== 'maven') {
      this.log(chalk.red('Error!') + ' The JHipster debian-packager module currently supports only Maven builds');
      process.exit(1);
    }
    if(this.options.force !== true) {
      var prompts = [{
        type: 'confirm',
        name: 'continue',
        message: 'Your project files will be modified. Are you sure you want to continue ?',
        default: false
      }]

      this.prompt(prompts, function (props) {
        if(!props.continue) {
          process.exit(1);
        }
        done();
      }.bind(this));
    } else {
      done();
    }
  },

  writing: function () {
    var done = this.async();

    this.slugifiedBaseName = _.slugify(jhipsterVar.baseName);
    var debControlDir = "src/deb/control";

    var other = "                <executions>\n" +
    "                    <execution>\n" +
    "                        <phase>package</phase>\n" +
    "                        <goals>\n" +
    "                            <goal>jdeb</goal>\n" +
    "                        </goals>\n" +
    "                        <configuration>\n" +
    "                            <dataSet>\n" +
    "                                <data>\n" +
    "                                    <src>${project.build.directory}/${project.build.finalName}.war</src>\n" +
    "                                    <type>file</type>\n" +
    "                                    <mapper>\n" +
    "                                        <type>perm</type>\n" +
    "                                        <prefix>/usr/share/${project.artifactId}/lib</prefix>\n" +
    "                                        <user>${project.artifactId}</user>\n" +
    "                                        <group>${project.artifactId}</group>\n" +
    "                                        <filemode>550</filemode>\n" +
    "                                    </mapper>\n" +
    "                                </data>\n" +
    "                                <data>\n" +
    "                                  <type>link</type>\n" +
    "                                  <symlink>true</symlink>\n" +
    "                                  <linkName>/usr/share/${project.artifactId}/bin/${project.artifactId}</linkName>\n" +
    "                                  <linkTarget>/usr/share/${project.artifactId}/lib/${project.build.finalName}.war</linkTarget>\n" +
    "                                </data>\n" +
    "                                <data>\n" +
    "                                  <type>link</type>\n" +
    "                                  <symlink>true</symlink>\n" +
    "                                  <linkName>etc/init.d/${project.artifactId}</linkName>\n" +
    "                                  <linkTarget>/usr/share/${project.artifactId}/bin/${project.artifactId}</linkTarget>\n" +
    "                                </data>\n" +
    "                                <data>\n" +
    "                                    <src>${basedir}/src/deb/etc/default/${project.artifactId}</src>\n" +
    "                                    <type>file</type>\n" +
    "                                    <conffile>true</conffile>\n" +
    "                                    <mapper>\n" +
    "                                        <type>perm</type>\n" +
    "                                        <prefix>/etc/default</prefix>\n" +
    "                                        <user>${project.artifactId}</user>\n" +
    "                                        <group>${project.artifactId}</group>\n" +
    "                                    </mapper>\n" +
    "                                </data>\n" +
    "                                <data>\n" +
    "                                  <type>link</type>\n" +
    "                                  <symlink>true</symlink>\n" +
    "                                  <linkName>/usr/share/${project.artifactId}/lib/${project.build.finalName}.conf</linkName>\n" +
    "                                  <linkTarget>/etc/default/${project.artifactId}</linkTarget>\n" +
    "                                </data>\n" +
    "                                <data>\n" +
    "                                    <type>files</type>\n" +
    "                                    <conffile>true</conffile>\n" +
    "                                    <paths>\n" +
    "                                        <path>${project.build.outputDirectory}/config/application-dev.yml</path>\n" +
    "                                        <path>${project.build.outputDirectory}/config/application-prod.yml</path>\n" +
    "                                        <path>${project.build.outputDirectory}/config/application.yml</path>\n" +
    "                                        <path>${project.build.outputDirectory}/logback-spring.xml</path>\n" +
    "                                        <path>${project.build.outputDirectory}/ehcache.xml</path>\n" +
    "                                    </paths>\n" +
    "                                    <dst>/etc/${project.artifactId}</dst>\n" +
    "                                    <mapper>\n" +
    "                                        <type>perm</type>\n" +
    "                                        <user>${project.artifactId}</user>\n" +
    "                                        <group>${project.artifactId}</group>\n" +
    "                                    </mapper>\n" +
    "                                </data>\n" +
    "                                <data>\n" +
    "                                    <type>template</type>\n" +
    "                                    <paths>\n" +
    "                                        <path>etc/${project.artifactId}</path>\n" +
    "                                        <path>var/log/${project.artifactId}</path>\n" +
    "                                        <path>var/run/${project.artifactId}</path>\n" +
    "                                    </paths>\n" +
    "                                    <mapper>\n" +
    "                                        <type>perm</type>\n" +
    "                                        <user>${project.artifactId}</user>\n" +
    "                                        <group>${project.artifactId}</group>\n" +
    "                                    </mapper>\n" +
    "                                </data>\n" +
    "                            </dataSet>\n" +
    "                        </configuration>\n" +
    "                    </execution>\n" +
    "                </executions>";

    var replaceContent = function (filePath, pattern, content, _this) {
      var body = _this.fs.read(filePath);
      body = body.replace(pattern, content);
      _this.fs.write(filePath, body);
    }

    if( this.options.clean === true) {
      this.fs.delete("src/deb/");
      var plugin =  '            <plugin>\n' +
      '                <groupId>org.vafer</groupId>\n' +
      '                <artifactId>jdeb</artifactId>\n' +
      '                <version>1.4</version>\n' +
      other + '\n' +
      '            </plugin>\n';
      replaceContent('pom.xml', plugin, '', this);

    } else {
      this.copy("src/deb/etc/default/linux-service", "src/deb/etc/default/" + this.slugifiedBaseName);
      this.copy(debControlDir + "/control", debControlDir + "/control");
      this.copy(debControlDir + "/prerm", debControlDir + "/prerm");
      this.copy(debControlDir + "/preinst", debControlDir + "/preinst");
      this.copy(debControlDir + "/postinst", debControlDir + "/postinst");
      this.copy(debControlDir + "/postrm", debControlDir + "/postrm");

      jhipsterFunc.addMavenPlugin("org.vafer", "jdeb", "1.4", other);
    }
    done();
  }

});
