//Copyright (c) 2014 Eric Vallee <eric_vallee2003@yahoo.ca>
//MIT License: https://raw.githubusercontent.com/Magnitus-/LazyLanguageLoader/master/License.txt
(function(){function k(a){var c="string"==typeof a.String,b=typeof(void 0===a.Args)||a.Args instanceof Array,f=typeof(void 0===a.Translate)||a.Translate instanceof Array;return"string"==typeof a||"object"==typeof a&&c&&b&&f}function g(a,c,b){if("undefined"==typeof b[c])throw new TypeError("LazyLanguageLoader: Not value was passed for the "+c+" option in call "+a+" and no default was set.");}function m(a){a=jQuery.extend({Language:f.Options.Get("Language")},a||{});g("FindMissingTranslations","Language", a);var c=[];this.each(function(){var b=jQuery(this);null==f.LoadString({Tag:b.attr("data-String"),Language:a.Language})&&(c[c.length]=b.attr("data-String"));if(void 0!==b.attr("data-TranslateArgs")){var d=window.JSON.parse(b.attr("data-TranslateArgs")),e=window.JSON.parse(b.attr("data-StringArgs"));jQuery.each(d,function(b,d){null==f.LoadString({Tag:e[d],Language:a.Language})&&(c[c.length]=e[d])})}});return c}function l(a){a=jQuery.extend({Language:f.Options.Get("Language")},a||{});g("ShowLanguage", "Language",a);this.each(function(){var c=jQuery(this),b=f.LoadString({Tag:c.attr("data-String"),Language:a.Language});if(void 0!==b){if(void 0!==c.attr("data-StringArgs")){var d=window.JSON.parse(c.attr("data-StringArgs"));if("undefined"!=typeof c.attr("data-TranslateArgs")){var e=window.JSON.parse(c.attr("data-TranslateArgs"));jQuery.each(e,function(b,c){d[c]=f.LoadString({Tag:d[c],Language:a.Language})})}b=vsprintf(b,d)}c.is("input[type=submit]")?c.val(b):c.text(b);c.attr("data-TranslatedIn",a.Language)}}); return this}var n="SetDefaultLanguage SetDefaultURL SetAjaxWrapper SetExpiry StrToHtmlRepr StrArgsToHtmlRepr".split(" "),p=["LoadLanguage","StrToAttr","StrArgsToAttr"],d={SetDefaultLanguage:function(a){f.Options.Set("Language",a)},SetDefaultURL:function(a){f.Options.Set("Url",a)}},h=null;d.SetAjaxWrapper=function(a){h=a};d.SetExpiry=function(a){a?f.Options.Set("Expiry",a):f.Options.Delete("Expiry")};d.StrArgsToHtmlRepr=function(a){a=jQuery.extend({Args:null,Translate:null},a||{});var c="";a.Args&& (c+="data-StringArgs='"+window.JSON.stringify(a.Args)+"'");a.Translate&&(c+=" data-TranslateArgs='"+window.JSON.stringify(a.Translate)+"'");return c};d.StrToHtmlRepr=function(a){if(!k(a))throw new TypeError("LazyLanguageLoader: Wrong argument structure passed to StrToHtmlRepr function.");return"string"==typeof a?"data-String='"+a+"'":"data-String='"+a.String+"' "+d.StrArgsToHtmlRepr(a)};d.LoadLanguage=function(a){function c(){a.Callback&&("function"==typeof a.Callback?a.Callback():"object"==typeof a.Callback&& a.Callback.Function.apply(a.Callback.Context?a.Callback.Context:this,a.Callback.Args?a.Callback.Args:[]))}a=jQuery.extend({Language:f.Options.Get("Language"),Url:f.Options.Get("Url"),Restful:!0,Callback:null,AjaxOptions:{}},a||{});g("LoadLanguage","Language",a);g("LoadLanguage","Url",a);var b=jQuery("[data-String]",this),d=m.call(b,{Language:a.Language});if(0<d.length){var e={url:a.Url,data:"",dataType:"json",cache:!1,processData:!1,timeout:5E3,async:!0,success:function(b,c,d){jQuery.each(b.Strings, function(b,c){f.SaveString({Tag:b,Value:c,Language:a.Language})})},error:function(a,b,c){b="LazyLanguageLoader: Ajax request to '"+e.url+"' failed. Error: "+b;0<a.statusCode()&&(b+="[Code: "+a.statusCode()+"]");console.log(b)},complete:function(){l.call(b,{Language:a.Language});c()}};a.Restful?e.url=e.url+"/"+encodeURIComponent(a.Language)+"?"+jQuery.param({Strings:d}):(e.url=e.url+"/"+encodeURIComponent(a.Language),e.type="POST",e.contentType="application/json; charset=UTF-8;",e.data=JSON.stringify({Strings:d})); e=jQuery.extend(a.AjaxOptions,e);h?h(e):jQuery.ajax(e)}else l.call(b,{Language:a.Language}),c();return this};d.StrArgsToAttr=function(a){a=jQuery.extend({Args:null,Translate:null},a||{});a.Args&&this.attr("data-StringArgs",window.JSON.stringify(a.Args));a.Translate&&this.attr("data-TranslateArgs",window.JSON.stringify(a.Translate));return this};d.StrToAttr=function(a){if(!k(a))throw new TypeError("LazyLanguageLoader: Wrong argument structure passed to StrToAttr function.");"string"==typeof a?this.attr("data-String", a):(this.attr("data-String",a.String),d.StrArgsToAttr.call(this,a));return this};jQuery.LazyLanguageLoader=function(a){if(0<=jQuery.inArray(a,n))return d[a].apply(this,Array.prototype.slice.call(arguments,1));throw new TypeError("LazyLanguageLoader: Invalid method name passed to LazyLanguageLoader.");};jQuery.fn.LazyLanguageLoader=function(a){if(0<=jQuery.inArray(a,p))return d[a].apply(this,Array.prototype.slice.call(arguments,1));throw new TypeError("LazyLanguageLoader: Invalid method name passed to LazyLanguageLoader."); };var f=new function(a){var c=[jQuery.PersistentBrowserObject.Storage.localStorage,jQuery.PersistentBrowserObject.Storage.Memory];this.Options=new jQuery.PersistentBrowserObject(a+"Options",jQuery.PersistentBrowserObject.Cache.Instance,[jQuery.PersistentBrowserObject.Storage.localStorage,jQuery.PersistentBrowserObject.Storage.Cookie]);this.LoadString=function(b){b=jQuery.extend({Tag:"",Language:this.Options.Get("Language")},b||{});b=new jQuery.PersistentBrowserObject(a+"_"+b.Language+"_"+b.Tag,jQuery.PersistentBrowserObject.Cache.Instance, c);if(void 0!==b.Get("Expiry")&&b.Get("Expiry")<Date.now())b.DeleteAll();else return b.Get("Value")};this.SaveString=function(b){b=jQuery.extend({Tag:"",Language:this.Options.Get("Language"),Value:""},b||{});var d=new jQuery.PersistentBrowserObject(a+"_"+b.Language+"_"+b.Tag,jQuery.PersistentBrowserObject.Cache.None,c);b={Value:b.Value};void 0!==this.Options.Get("Expiry")&&(b.Expiry=Date.now()+this.Options.Get("Expiry"));d.Set(b)}}("LazyLanguageLoaderV1.0")})();
