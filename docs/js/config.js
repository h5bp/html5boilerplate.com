/**
* This is the configuration file. Any modules / services use in the apps may require this config module.
*
* Feel free to make any change to options you want there.
* 
*/
define({
  // path to the wiki folder, by defaults it is wiki-upstream and points to a git submodule
  baseUrl: '../wiki-upstream/',

  //default file
  baseFile: 'Home.md',
  
  // path to the wiki folder, by defaults it is wiki-upstream and points to a git submodule
  wikiUrl: '//github.com/paulirish/html5-boilerplate/wiki/',

  // File of the wiki, needs a manual update to any new file (or file deletion)
  // In the perspective of a datasource that uses the github api (on real repos onlt, repos wikis are not part of the api yet),
  // we wouldn't need this anymore
  files: [
    "htaccess.md",
    "960.gs.md",
    "ARIA-in-Boilerplate.md",
    "Articles-on-using-boilerplate.md",
    "Build-script.md",
    "createproject.sh.md",
    "crossdomain.xml.md",
    "Experimental.md",
    "FAQs.md",
    "Get-Started!.md",
    "Home.md",
    "Internationalization-tips.md",
    "List-of-commonly-installed-fonts-in-different-devices.md",
    "Make-it-better.md",
    "Mobile-Blogs-and-Articles.md",
    "nginx.conf.md",
    "Notes-on-using-png.md",
    "Patterns-for-writing-better-JavaScript.md",
    "Script-Loading-Techniques.md",
    "Security.md",
    "Sites-using-the-boilerplate.md",
    "The-markup.md",
    "The-style.md",
    "Tips-For-Customizing-Boilerplate.md",
    "Version-Control-with-Cachebusting.md",
    "web.config.md"
  ]
});