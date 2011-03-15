
// {% blocktrans %}usage: log('inside coolFunc', this, arguments);{% endblocktrans %}
// paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
window.log = function(){
  log.history = log.history || [];   // {% blocktrans %}store logs to an array for reference{% endblocktrans %}
  log.history.push(arguments);
  arguments.callee = arguments.callee.caller;  
  if(this.console) console.log( Array.prototype.slice.call(arguments) );
};
// {% blocktrans %}make it safe to use console.log always{% endblocktrans %}
(function(b){function c(){}for(var d="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info, log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","),a;a=d.pop();)b[a]=b[a]||c})(window.console=window.console||{});


// {% blocktrans %}place any jQuery/helper plugins in here, instead of separate, slower script files.{% endblocktrans %}

