/**
* This is the base module from wich others should extend.
*
* It provides the setup interface (the one which does the heavy-crafting of our module) which setup 
* important datas when created.
*
* this.options -> a configurable mixins object merged between module default options and the one provided by user
* this.element -> jQuery element
* this.dom -> dom equivalent
* this.name -> the name of the module (the one passed to $.bridge)
*
* It also adds a css class which value is the module name lowercased to provide some useful css hooks.
*/
define(function() {
  return Object.create({
      setup: function(options, elem, name) {
          this.options = $.extend(this.options, options);
          this.element = $(elem);
          this.dom = elem;
          this.name = name;


          // Also add a css class as a CSS Hook
          this.element.addClass(name.toLowerCase());
      }
  });
});