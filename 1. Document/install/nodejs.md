---
id: nodejs
title: Install NodeJs
sidebar_label: Install NodeJs
---

## How To Install the Distro-Stable Version for Ubuntu

In order to get this version, we just have to use the apt package manager. We should refresh our local package index first, and then install from the repositories:

```
sudo apt-get update
sudo apt-get install nodejs
```

If the package in the repositories suits your needs, this is all you need to do to get set up with Node.js. In most cases, you’ll also want to also install npm, which is the Node.js package manager. You can do this by typing:

```
sudo apt-get install npm
```
This will allow you to easily install modules and packages to use with Node.js.

Because of a conflict with another package, the executable from the Ubuntu repositories is called nodejs instead of node. Keep this in mind as you are running software.

To check which version of Node.js you have installed after these initial steps, type:

```
nodejs -v
```

## How To Install Using NVM

An alternative to installing Node.js through apt is to use a specially designed tool called nvm, which stands for “Node.js version manager”. Rather than working at the operating system level, nvm works at the level of an independent directory within your home directory. This means that you can install multiple, self-contained versions of Node.js without affecting the entire system.

Controlling your environment with nvm allows you to access the newest versions of Node.js and retain and manage previous releases. It is a different utility from apt-get, however, and the versions of Node.js that you manage through it are distinct from the distro-stable version of Node.js available from the Ubuntu repositories.

To start off, we’ll need to get the software packages from our Ubuntu repositories that will allow us to build source packages. The nvm script will leverage these tools to build the necessary components:

```
sudo apt-get update
sudo apt-get install build-essential libssl-dev
```

Once the prerequisite packages are installed, you can pull down the nvm installation script from the project’s GitHub page. The version number may be different, but in general, you can download it with `curl`:

```
curl -sL https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh -o install_nvm.sh
```

And inspect the installation script with `nano`:

```
nano install_nvm.sh
```

Run the script with `bash`:

```
bash install_nvm.sh
```

It will install the software into a subdirectory of your home directory at ~/.nvm. It will also add the necessary lines to your `~/.profile` file to use the file.

To gain access to the nvm functionality, you’ll need to log out and log back in again, or you can source the `~/.profile` file so that your current session knows about the changes:

```
source ~/.profile
```

Now that you have nvm installed, you can install isolated Node.js versions.

To find out the versions of Node.js that are available for installation, you can type:

```
nvm ls-remote
```

```
Output
...
         v8.5.0
         v8.6.0
         v8.7.0
         v8.8.0
         v8.8.1
         v8.9.0   
         v8.9.1   
         v8.9.2   
         v8.9.3   
->      v8.9.4   (Latest LTS: Carbon)        
```

As you can see, the newest LTS version at the time of this writing is v8.9.4. You can install that by typing:

```
nvm install 8.9.4
```

Usually, nvm will switch to use the most recently installed version. You can explicitly tell nvm to use the version we just downloaded by typing:

```
nvm use 8.9.4
```

When you install Node.js using nvm, the executable is called node. You can see the version currently being used by the shell by typing:

```
node -v
```

```
Output
v8.9.4
```

## Removing Node.js

You can uninstall Node.js using `apt-get` or nvm, depending on the version you want to target. To remove the distro-stable version, you will need to work with the `apt-get` utility at the system level.

To remove the distro-stable version, type the following:

```
sudo apt-get remove nodejs
```

This command will remove the package and retain the configuration files. These may be of use to you if you intend to install the package again at a later point. If you don’t want to save the configuration files for later use, however, then run the following:

```
sudo apt-get purge nodejs
```

This will uninstall the package and remove the configuration files associated with it. 
As a final step, you can remove any unused packages that were automatically installed with the removed package:

```
sudo apt-get autoremove
```

To uninstall a version of Node.js that you have enabled using nvm, first determine whether or not the version you would like to remove is the current active version:

```
nvm current
```

If the version you are targeting is not the current active version, you can run:

```
nvm uninstall [node_version]
```

This command will uninstall the selected version of Node.js.

If the version you would like to remove is the current active version, you must first deactive nvm to enable your changes:

```
nvm deactivate
```

You can now uninstall the current version using the uninstall command above, which will remove all files associated with the targeted version of Node.js except the cached files that can be used for reinstallment.