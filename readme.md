Coffee Chat
===========

Tools:
-----------
- Node:
	- http://nodejs.org/en/
	- http://nodeschool.io/
- Express: http://expressjs.com/
- MySQL: https://github.com/felixge/node-mysql
- Simple Oauth2: https://github.com/andreareginato/simple-oauth2
- Jade: http://jade-lang.com/
- Materialize: http://materializecss.com/ (We should probably move away from this at some point but it's good for throwing things together quickly)
- Grunt: http://gruntjs.com/

Setup:
-----------
###Prerequisites:
Be sure to have git installed.

####Install Git on a Mac:
The easiest way to install git is through the Xcode Command Line Tools. On Mavericks (10.9) or above you can do this simply by trying to run git from the Terminal the very first time. If you don’t have it installed already, it will prompt you to install it.

####Install Git on Linux:
```
$ sudo apt-get install git
```

###Mac Setup:
Download and install the latest version Node from the [Node](http://nodejs.org/en/) website.

Clone the repository
```
$ git clone https://github.com/nuvention-web/coffee-chat.git
```

Navigate to the "webApp" directory, where the "package.json" file exists and run the following command to install dependencies.
```
$ npm install
```

You should be all setup!

###Linux Setup:
Depending on your operating system you may need to use yum instead of apt-get to install dependencies.

Install Node via apt-get.
```
$ sudo apt-get install nodejs
```

Clone the repository
```
$ git clone https://github.com/nuvention-web/coffee-chat.git
```

Navigate to the "webApp" directory, where the "package.json" file exists and run the following command to install the Node dependencies.

```
$ npm install
```

You should be good to go!


###Creating a Local Database for Testing


Developing:
-----------
After pulling a new branch or updating your local repo, it is advised that you run:
```
$ npm install 
```
This will install any new dependencies added to the `package.json`

Similarly, if you want to add modules to the `package.json`, run:
```
$ npm install --save [name of the module]
```

##Running the Server
###Mac:
With node installed, navigate to where server.js resides, and run:
```
$ node server.js
```
This will start the server.

###Linux:
With most Linux distros, `node` installs as `nodejs`. You can easily create a symlink, so you can type node instead of nodejs.

###Directory Structure


###Best Practices Guidelines for using Git
1. If you want to change something in the repo, submit an issue. This way we can keep track of open tasks we are working on.
2. When you are working on a feature, branch off of dev.
3. When you have tested your code and are ready to merge with dev, submit a pull request, and close any issues that it involves in the request.
4. Try your best not to merge commit, rebase your code instead. Merge commits make it difficult to see who actually wrote the code.