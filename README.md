# chenv

`chenv` (CHange ENV) is a CLI tool for managing config changes to multiple codebases simultaneously. Sort of a meta-config tool.

Imagine you have 3 codebases for a project called `foobar`:

* Foobar API
* Foobar App
* Foobar web frontend

Each codebase uses its own text-based config format, or (WORSE) uses hardcoded config variables.

Now imagine you want to switch your entire stack to point to a `staging` environment.

Don't trip. `chenv` got you:

```
$ chenv foobar staging
```

BAM!!! Just like that, configs for all of your codebases now point to `staging`.

How do you know?

```
$ whichenv foobar // => staging
```

Awwwww yeah.


## Install

Copy the appropriate binaries in `/bin` to somewhere on your `$PATH`, i.e. for mac:

```
$ cp ./bin/chenv-macos /usr/local/bin/chenv && cp ./bin/whichenv-macos /usr/local/bin/whichenv
```

Or build it yourself:

```
$ npx pkg ./chenv.js && npx pkg ./whichenv.js
```

Then move the built binaries wherever you need them.


## Project Setup

To set up a new project, make a new project directory under `~/.chenv`:

```
$ mkdir ~/.chenv/foobar
```

Then, for each env, create an executable script named `<NAME OF ENV>.sh`, i.e.:

```
# in ~/.chenv/foobar/staging.sh:

SCRIPT_DIR="$HOME/.chenv/foobar"

##############
# Foobar API #
##############
API_CONFIG="~/projects/foobar/api/.env"

cp "$SCRIPT_DIR/.staging.env" $API_CONFIG

##############
# Foobar App #
##############
APP_DIR="~/projects/foobar/app"
APP_CONFIG="$APP_DIR/app.config.js"

cd $APP_DIR && git checkout -- $APP_CONFIG && cd -;

sed -i '' "s/.*var apiUrl=.*$/    var apiUrl = \'http:\/\/foobar.staging.com/api\';/" $APP_CONFIG

#######################
# Foobar Web Frontend #
#######################
WEB_DIR="~/projects/foobar/web"
WEB_CONFIG="$APP_DIR/config.json"

cp "$SCRIPT_DIR/config.staging.json" $WEB_CONFIG
```

Now when you run `chenv foobar staging` the above shell script will be run.


## FAQ

* Q: is `chenv` a build tool (like `make`, `scons` etc)?

  A: No. Eh, well, not really. Not unless use it like a build tool. It's more of a meta-config tool. If you use it like a build tool then yes, it's a build tool.

* Q: What does `chenv` actually do?

  A: I'm gonna let you in on a little secret. `chenv` is stupidly simple — SO RIDICULOUSLY simple. It just runs shell scripts in a prespecified location (`~/.chenv`).

* Q: You know the name `chenv` has [been](https://www.npmjs.com/package/chenv) [used](https://github.com/betamatt/chenv) [before](https://github.com/johnmcconnell/chenv) right?

  A: Yeah. But a.) none of those tools do what I want and b.) it's SUCH a great name for this util!

## Caveats

* It probably goes without saying, but `chenv` is a band-aid. Ideally your codebases don't hardcode config vars and/or they all read configs from the same places. You should probably fix that. When you can't, `chenv` is your friend.

* `chenv` doesn't know _anything_ about the shell scripts for the env you're switching to. It just runs them. So be careful.

* The scripts for each env should probably `git checkout` the config file you're munging for each codebase so you have a clean starting point to munge. Otherwise you won't be able to cleanly switch between multiple envs.

* Since your env scripts probably munge your configs, you probably shouldn't check those configs back into source control. Like I said above, `chenv` is a band-aid.

* When possible, you should probably just copy over example config files to their destinations instead of munging via `sed` but it's not always possible.

* To make copying files easy, you probably want to adopt a naming convention of ```<NAME OF FILE>.<ENV>.<EXTENSIONS>```. Then you just copy files for the correct env.

* You probably want to check your `chenv` configs into source control since it's a bit of work to write those configs for each env. If you do this, make sure you check into a PRIVATE REPO (for obvious reasons...)

## TODO
* Use a proper CLI framework
* Add a config option or tool to generate new skeleton project

