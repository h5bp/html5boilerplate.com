
// {% blocktrans %}remap jQuery to ${% endblocktrans %}
(function($){

 





 



})(this.jQuery);



// {% blocktrans %}usage{% endblocktrans %}: log('inside coolFunc',this,arguments);
// paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
window.log = function(){
  log.history = log.history || [];   // {% blocktrans %}store logs to an array for reference{% endblocktrans %}
  log.history.push(arguments);
  if(this.console){
    console.log( Array.prototype.slice.call(arguments) );
  }
};



// {% blocktrans %}catch all document.write() calls{% endblocktrans %}
(function(doc){
  var write = doc.write;
  doc.write = function(q){ 
    log('document.write(): ',arguments); 
    if (/docwriteregexwhitelist/.test(q)) write.apply(doc,arguments);  
  };
})(document);


