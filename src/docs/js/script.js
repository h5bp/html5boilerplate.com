/**
*
* Main app file, this one is responsible of the load of any used modules so as to their initilisation
* against dom elements.
*
* Keep in mind that you can get a quick access to the internal stored object with container.data('modulename')
*
*/
(function($) {

    require(
    
    // Load in modules  
    ['app/modules/wiki', 'app/modules/messaging', 'app/modules/history', 'app/modules/highlight', 'app/modules/disqus', 'app/modules/ga'],
    
    function(wiki, messaging, history, highlight, ga) {
        
        $(function() {
          var container = $('#container');
          
          container
              // Needed prior main module initialization
              // This misconception leads to unexpected behaviour on Opera 11 
              // (haschange binding needed prior hash rewrite)
              .history()
          
              // Our main module
              .wikiConvertor({
                  wikiPath: container.data('wiki') || '',
                  main: '.wikiconvertor-content'
              })
              
              // Add messaging support, user feedback and so on
              .messaging()

              // Allow the hightlight of code snippets using SyntaxHighligter
              .highlight()
              
              .disqus({
                // we can't use # in this url, otherwise thread won't be correctly referenced
                dsqUrl: 'http://example.com/test/hashbang/article/{id}',
                dsqShortname: 'h5bdocstest'
              })
              
              // analytics
              .ga({
                uid: 'UA-22315681-1'
              });
        });
    });
    
})(this.jQuery);
