
// `jQuery` in `$` umbennen
(function($){

 





 



})(window.jQuery);




// Usage: log( 'von coolFunk', this, arguments );
// paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/

window.log = function(){
  log.history = log.history || [];   // Logs in einen Array speichern
  log.history.push(arguments);
  if(this.console){
    console.log( Array.prototype.slice.call(arguments) );
  }
};



// fange alle `document.write()` aufrufe ab
(function(doc){
  var write = doc.write;
  doc.write = function(q){ 
    log('document.write(): ',arguments); 
    if (/docwriteregexwhitelist/.test(q)) write.apply(doc,arguments);  
  };
})(document);


