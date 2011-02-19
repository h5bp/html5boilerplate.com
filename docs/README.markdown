## Experimental branch for HTML5Boilerplate.com documentation

## Goals

Still based on github wiki. The idea is to locally (like it's done for now) or remotely (via github api on a given repo. Wiki's repos are not part of the REST api for now) retrieve the content of wiki markdown files and display them on a fully customizable web site. The conversion is made using the handy [Showdown](https://github.com/coreyti/showdown) library. This version uses the markup and style of the official [html5-boilerplate](http://html5boilerplate.com/) site.

You can see a first rough version here: [http://mklabs.github.com/html5boilerplate-site/docs/](http://mklabs.github.com/html5boilerplate-site/docs/)

## Remaining issues

[https://github.com/nimbupani/html5boilerplate-site/issues#issue/29](https://github.com/nimbupani/html5boilerplate-site/issues#issue/29)

* bring files over to this repo.. 'docs' branch.
	* *To be done*
	
* some amount of control, configuration on the left nav. maybe use a new .md file for it?
  * *To be done*
  	
* merge styles into site's style.css ? maybe?
	* *Done: Have to do check out wiki.css file. Certainly has a bunch of unused and unnecessary selectors (that may duplicate with H5B's website).*
	
* path should be at /docs/
	* *Done. Still have to figure out how to restructure the repo (in dev branchs I used, I've removed most of master branch files).*
	
* "edit this page" link that links to wiki edit page
	* *Done. Technically took no much effort. Visually, is it is the best place for that link?*
	
* "Pretty docs brought to you by Mickaël Daniel", but of course! :)
	* *Done. However... I made it as less little as possible ;) It might seen silly but I had wrap my head around on how and where to implement that. I really wanted to make clear that I had just worked on the pretty docs part, boilerplate itself is brought by true superheroes :p* 
	
* Fix [[link text | http://example.com]] links in markdown not always working..
	* I can change them all to [text] (url) really easy if that makes sense.
		* *Done (I guess..). Well, I made a few obvious improvements on regex escape. Though, I feel that I'll have to further work those regex, I feel like this is not as robust as it should be. Was previously done directly in showdown.js file, now done in the wiki module.*
		
* kill off the languages links..
	* *Done*
	
* add link back to the homepage.
	* *Done. Not sure of the proper location and the proper style you'll want to apply on it. Basically, I made it appear upper-cased in the top right corner of the screen.*

## Try it yourself

### To init a new fresh repo and setup the wiki content from github

    git clone git://github.com/MkLabs/html5boilerplate-site.git
    cd html5boilerplate-site
    git checkout -b wiki origin/gh-pages
    git submodule update --init

This branch includes a submodule that points to the official wiki repository with read-only access.
    
Assuming you have a local server pointing to the root of html5boilerplate-site clone, head over to [http://localhost/docs/](http://localhost/docs/), you should see the boilerplate documentation displayed in a boilerplate fashion ;)
  
### To update the wiki with remote changes

    cd wiki-upstream
    git remote -v
    
At this point, it should point to the official wiki repository with read-only access:

    origin	git://github.com/paulirish/html5-boilerplate.wiki.git (fetch)
    origin	git://github.com/paulirish/html5-boilerplate.wiki.git (push)
    
The submodule repositories added by “git submodule update” are “headless”. This means that they aren’t on a current branch. To fix this, we simply need to switch to a branch. In this example, that would be the master branch. We switch with the following command: “git checkout master“.

    git checkout master
    
To bring any new changes back in

    git pull origin
    
And done !

At this point, if any new files were created and you would like to see there in the page menu pane, it requires the modification of files variable in config.js file. Otherwise, internal links to another page should work (new pages just don't show up in the menu section). This is a drawback of using local datasource (really just xhr to get markdown files), with remote github api calls, we could get the list of all blobs.