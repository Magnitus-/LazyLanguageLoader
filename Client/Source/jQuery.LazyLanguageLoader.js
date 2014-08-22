/*
Copyright (c) 2014 Eric Vallee <eric_vallee2003@yahoo.ca>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

(function(){
    "use strict";
    var GlobalMethods = ['SetDefaultLanguage', 'SetDefaultURL', 'SetAjaxWrapper', 'SetExpiry', 'StrToHtmlRepr', 'StrArgsToHtmlRepr'];
    var FnMethods = ['LoadLanguage', 'StrToAttr', 'StrArgsToAttr'];
    var Methods = {};
    
    //Global Methods
    Methods['SetDefaultLanguage'] = function(Default){
        LocalStoreInstance.Options.Set('Language', Default);
    };
    
    Methods['SetDefaultURL'] = function(Default){
        LocalStoreInstance.Options.Set('Url', Default);
    };
    
    var WrappedAjax = null;    
    Methods['SetAjaxWrapper'] = function(Wrapper){
        WrappedAjax = Wrapper;
    };
    
    Methods['SetExpiry'] = function(Value){
        LocalStoreInstance.Options.Set('Expiry', Value);
    };
    
    Methods['StrArgsToHtmlRepr'] = function(Data){
        var Data = jQuery.extend({'Args': null, 'Translate': null}, Data||{});
        var ToReturn = "";
        if(Data['Args'])
        {
            ToReturn+="data-StringArgs='"+window.JSON.stringify(Data['Args'])+"'";
        }
        if(Data['Translate'])
        {
            ToReturn+=" data-TranslateArgs='"+window.JSON.stringify(Data['Translate'])+"'";
        }
        return(ToReturn);
    };
    
    Methods['StrToHtmlRepr'] = function(Data){
        if(!CheckInput(Data))
        {
            throw new TypeError("LazyLanguageLoader: Wrong argument structure passed to StrToHtmlRepr function.");
        }
        if(typeof(Data)=='string')
        {
            return("data-String='"+Data+"'");
        }
        else
        {
            return("data-String='"+Data['String']+"' "+Methods.StrArgsToHtmlRepr(Data));
        }
    };
    
    //fn methods
    Methods['LoadLanguage'] = function(Options){
        var Options = jQuery.extend({'Language': LocalStoreInstance.Options.Get('Language'), 'Url': LocalStoreInstance.Options.Get('Url'), 'AddressableRequest': true, 'Callback': null, 'AjaxOptions': {}}, Options||{});
        ErrorIfNotInOptions('LoadLanguage', 'Language', Options);
        ErrorIfNotInOptions('LoadLanguage', 'Url', Options);
        var Context = this;
        var Set = jQuery("[data-String]", Context);
        var NeededTranslations = FindMissingTranslations.call(Set, {'Language': Options.Language});
        function HandleCallback()
        {
            if(Options.Callback)
            {
                if(typeof Options.Callback == "function")
                {
                    Options.Callback();
                }
                else if(typeof Options.Callback == "object")
                {
                    var Args = Options.Callback['Args'] ? Options.Callback['Args'] : [];
                    var Context = Options.Callback['Context'] ? Options.Callback['Context'] : this;
                    Options.Callback['Function'].apply(Context, Args);
                }
            }
        }
        if(NeededTranslations.length>0)
        {
            var AjaxRequest = {'url': Options.Url, 'data': "", 'dataType': 'json', 'cache': false, 'processData': false, 'timeout': 5000, 'async': true};
            AjaxRequest['success'] = function(Data, Status, Xhr){
                jQuery.each(Data.Strings, function(Key,Value) {
                    LocalStoreInstance.SaveString({'Tag': Key, 'Value': Value, 'Language': Options.Language});
                });
            };
            AjaxRequest['error'] = function(Xhr, StatusMessage, ThrownError){
                var LogMessage = "LazyLanguageLoader: Ajax request to '"+AjaxRequest.url+"' failed. Error: "+StatusMessage;
                if(Xhr.statusCode() > 0)
                {
                    LogMessage += "[Code: "+Xhr.statusCode()+"]";
                }
                console.log(LogMessage);
            };
            AjaxRequest['complete'] = function(){
                ShowLanguage.call(Set, {'Language': Options.Language});
                HandleCallback();
            };
            if(!Options.AddressableRequest)
            {
                AjaxRequest['data'] = {'Language': Options.Language, 'Strings': window.JSON.stringify(NeededTranslations)};
            }
            else
            {
                AjaxRequest['url'] = AjaxRequest['url']+"/"+encodeURIComponent(Options.Language)+"?"+jQuery.param({'Strings': NeededTranslations});
            }
            AjaxRequest = jQuery.extend(Options.AjaxOptions, AjaxRequest);
            if(!WrappedAjax)
            {
                jQuery.ajax(AjaxRequest); 
            }
            else
            {
                WrappedAjax(AjaxRequest);
            }
        }
        else
        {
            ShowLanguage.call(Set, {'Language': Options.Language});
            HandleCallback();
        }
        
        return(this);
    };
    
    Methods['StrArgsToAttr'] = function(Data){
        var Data = jQuery.extend({'Args': null, 'Translate': null}, Data||{});
        if(Data['Args'])
        {
            this.attr('data-StringArgs', window.JSON.stringify(Data['Args']));
        }
        if(Data['Translate'])
        {
            this.attr('data-TranslateArgs', window.JSON.stringify(Data['Translate']));
        }
        return(this);
    };
    
    Methods['StrToAttr'] = function(Data){
        if(!CheckInput(Data))
        {
            throw new TypeError("LazyLanguageLoader: Wrong argument structure passed to StrToAttr function.");
        }
        if(typeof(Data)=='string')
        {
            this.attr('data-String', Data);
        }
        else
        {
            this.attr('data-String', Data['String']);
            Methods.StrArgsToAttr.call(this, Data);
        }
        return(this);
    };
    
    jQuery.LazyLanguageLoader = function(Method){
        if(jQuery.inArray(Method, GlobalMethods)>=0)
        {
            return Methods[Method].apply(this, Array.prototype.slice.call(arguments, 1));
        }
        else
        {
            throw new TypeError("LazyLanguageLoader: Invalid method name passed to LazyLanguageLoader.");
        }
    };

    //Technically, the same function instance could be used by checking on the call context and branching
    //accordingly, but I find that for a small DRY infraction, this implementation makes the intent of the
    //code clearer
    jQuery.fn.LazyLanguageLoader = function(Method){//FnMethods
        if(jQuery.inArray(Method, FnMethods)>=0)
        {
            return Methods[Method].apply(this, Array.prototype.slice.call(arguments, 1));
        }
        else
        {
            throw new TypeError("LazyLanguageLoader: Invalid method name passed to LazyLanguageLoader.");
        }
    };
    
    //Private Internal Global utilities
    function CheckInput(Input)
    {
        var IsString = typeof(Input)=='string';
        var IsObject = typeof(Input)=='object';
        var StringMemberOk = typeof(Input['String'])=='string';
        var ArgsMemberOk = typeof(Input['Args']===undefined) || Input['Args'] instanceof Array;
        var TranslateMemberOk = typeof(Input['Translate']===undefined) || Input['Translate'] instanceof Array;
        return(IsString||(IsObject&&StringMemberOk&&ArgsMemberOk&&TranslateMemberOk));
    }
    
    function LocalStore(Prefix)
    {
        var LocalStoreFallbackList = [jQuery.PersistentBrowserObject.Storage.localStorage, jQuery.PersistentBrowserObject.Storage.Memory];
        this.Options = new jQuery.PersistentBrowserObject(Prefix+'Options', jQuery.PersistentBrowserObject.Cache.Instance, [jQuery.PersistentBrowserObject.Storage.localStorage, jQuery.PersistentBrowserObject.Storage.Cookie]);
        this.LoadString = function(Options){
            var Options = jQuery.extend({'Tag': "", 'Language': this.Options.Get('Language')}, Options||{});
            var StringObject = new jQuery.PersistentBrowserObject(Prefix+'_'+Options['Language']+'_'+Options['Tag'], jQuery.PersistentBrowserObject.Cache.Instance, LocalStoreFallbackList);
            if(StringObject.Get('Expiry') !== undefined && StringObject.Get('Expiry') < Date.now())
            {
                StringObject.DeleteAll();
            }
            else
            {
                return StringObject.Get('Value');
            }
        };
        this.SaveString = function(Options){
            var Options = jQuery.extend({'Tag': "", 'Language': this.Options.Get('Language'), 'Value': ""}, Options||{});
            var StringObject = new jQuery.PersistentBrowserObject(Prefix+'_'+Options['Language']+'_'+Options['Tag'], jQuery.PersistentBrowserObject.Cache.None, LocalStoreFallbackList);
            var SetObject = {'Value': Options.Value};
            if(this.Options.Get('Expiry') !== undefined)
            {
                SetObject['Expiry'] = Date.now() + this.Options.Get('Expiry');
            }
            StringObject.Set(SetObject);
        };
    }
    var LocalStoreInstance = new LocalStore('LazyLanguageLoaderV1.0');
    
    function ErrorIfNotInOptions(Call, Key, Options)
    {
        if(typeof Options[Key] == "undefined")
        {
            throw new TypeError("LazyLanguageLoader: Not value was passed for the "+Key+" option in call "+Call+" and no default was set.");
        }
    }
    
    //Private internal fn utilities
    function FindMissingTranslations(Options){
        var Options = jQuery.extend({'Language': LocalStoreInstance.Options.Get('Language')}, Options||{});
        ErrorIfNotInOptions('FindMissingTranslations', 'Language', Options);
        var Missing = [];
        this.each(function(){
            var WrapperElement = jQuery(this);
            if(LocalStoreInstance.LoadString({'Tag': WrapperElement.attr('data-String'), 'Language': Options.Language})==null)
            {
                Missing[Missing.length]=WrapperElement.attr('data-String');
            }
            if(WrapperElement.attr('data-TranslateArgs') !== undefined)
            {
                var ToTranslate = window.JSON.parse(WrapperElement.attr('data-TranslateArgs'));
                var Args = window.JSON.parse(WrapperElement.attr('data-StringArgs'));
                jQuery.each(ToTranslate, function(Index, Value) {
                    if(LocalStoreInstance.LoadString({'Tag': Args[Value], 'Language': Options.Language})==null)
                    {
                        Missing[Missing.length]=Args[Value];
                    }
                });
            }
        });
        
        return(Missing);
    }
    
    function ShowLanguage(Options){
        var Options = jQuery.extend({'Language': LocalStoreInstance.Options.Get('Language')}, Options||{});
        ErrorIfNotInOptions('ShowLanguage', 'Language', Options);
        this.each(function(){
            var WrappedElement = jQuery(this);
            var Translation = LocalStoreInstance.LoadString({'Tag': WrappedElement.attr('data-String'), 'Language': Options['Language']});
            if(Translation !== undefined)
            {
                if(WrappedElement.attr('data-StringArgs') !== undefined)
                {
                    var Args = window.JSON.parse(WrappedElement.attr('data-StringArgs'));
                    if(typeof(WrappedElement.attr('data-TranslateArgs'))!='undefined')
                    {
                        var ToTranslate = window.JSON.parse(WrappedElement.attr('data-TranslateArgs'));
                        jQuery.each(ToTranslate, function(Index, Value) {
                            Args[Value]=LocalStoreInstance.LoadString({'Tag': Args[Value], 'Language': Options.Language});
                        });
                    }
                    Translation = vsprintf(Translation, Args);
                }
    
                if(WrappedElement.is('input[type=submit]'))
                {
                    WrappedElement.val(Translation);
                }
                else
                {
                    WrappedElement.text(Translation);
                }
                
                WrappedElement.attr('data-TranslatedIn', Options.Language);
            }
        });
        
        return(this);
    }
})();