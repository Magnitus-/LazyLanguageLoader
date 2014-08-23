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

QUnit.test("Dependencies", function( assert ) {
    assert.ok(JSON, "Confirming the presence of the JSON property on the global object");
    assert.ok(localStorage, "Confirming the presence of the localStorage property on the global object");
});

QUnit.test("NameSpace", function( assert ) {
    assert.ok(jQuery.LazyLanguageLoader&&jQuery.fn.LazyLanguageLoader, "Confirming LazyLanguageLoader exists in jQuery namespace.");
    assert.ok(!(window.GlobalMethods||window.FnMethods||window.Methods||window.CheckInput||window.LocalStore||window.LocalStoreInstance||window.FindMissingTranslations||window.ShowLanguage), "Confirming none of the library's internals pollute the global namespace.");
    
});

var AjaxRequests = 0;
var DoneCallback = null;
var TestAjaxWrapper = function(Request)
{
    AjaxRequests+=1;
    if(DoneCallback)
    {
        Request['complete'] = [Request['complete'], DoneCallback];
    }
    jQuery.ajax(Request);
};
jQuery.LazyLanguageLoader('SetAjaxWrapper', TestAjaxWrapper);

QUnit.asyncTest("Update", function( assert ) {
    localStorage.clear();
    jQuery.LazyLanguageLoader('SetDefaultURL', '/Strings');
    jQuery.LazyLanguageLoader('SetDefaultLanguage', 'French');
    jQuery.LazyLanguageLoader('SetExpiry', null);
    AjaxRequests = 0;
    jQuery('div.First').LazyLanguageLoader('LoadLanguage', {'Callback': function(){
        assert.ok(jQuery('div.First div[data-String=Blue]').text()=="Bleu" && jQuery('div.None div[data-String=House]').text()=="Maison", "Confirming that uploader works at the most basic level.");
        assert.ok(jQuery('div.First form input').val()=="Soumettre", "Confirming that uploader works with submit buttons.");
        assert.ok(jQuery('div.First div[data-String=CarLove]').text()=="Greg aime mon automobile rouge", "Confirming loading string with arguments works.");
        assert.ok(window.FrenchTranslatorFromHell === undefined, "Confirming protection against javaScript injection");
        assert.ok(jQuery('div.First div[data-String=MixedFriendship]').text()=="Amanda est bonne amie avec Greg, mais pas avec Tom", "Confirming loading string with arguments works in the absence of argument translation.");
        jQuery('div.First').LazyLanguageLoader('LoadLanguage', {'Callback': function(){
            assert.ok(AjaxRequests==1, "Confirming that content is properly cached.");
            jQuery('div.First').LazyLanguageLoader('LoadLanguage', {'Language': 'English', 'Callback': function(){
                    assert.ok(jQuery('div.First div[data-String=Blue]').text()=="Blue" && jQuery('div.None div[data-String=House]').text()=="House", "Confirming that uploader works with language change.");
                    assert.ok(jQuery('div.First form input').val()=="Submit", "Confirming that uploader works with language change.");
                    assert.ok(jQuery('div.First div[data-String=CarLove]').text()=="Greg likes my red car", "Confirming loading string with arguments works with language change.");
                    assert.ok(jQuery('div.First div[data-String=MixedFriendship]').text()=="Amanda is good friends with Greg, but not with Tom", "Confirming loading string with arguments works in the absence of argument translation and language change.");
                    jQuery('div#Empty').LazyLanguageLoader('StrToAttr', {'String': 'FastRunner', 'Args': ['Jim']});
                    var StringHTML = jQuery.LazyLanguageLoader('StrToHtmlRepr', {'String': 'SchoolAffection', 'Args': ['Brad', 'Lot'], 'Translate': [1]});
                    jQuery('<div '+StringHTML+'></div>').appendTo('div.Second');
                    jQuery('div.Second').LazyLanguageLoader('LoadLanguage', {'Language': 'English', 'Callback': function(){
                            assert.ok(jQuery('div.Second div[data-String=NotInDatabase]').text()=="Same", "Confirming that tags containing strings that aren't found are not modified.");
                            assert.ok(jQuery('div#Empty').text()=="Jim is a fast runner", "Confirming that dynamically loading strings into existing tags works.");
                            assert.ok(jQuery('div.Second div[data-String=SchoolAffection]').text()=="Brad likes school a lot", "Confirming that generating strings dynamically inside html works.");
                            QUnit.start();
                            localStorage.clear();
                    }});
            }});
        }});
    }});
});

QUnit.asyncTest("Non Addressable Requests", function( assert ) {
    localStorage.clear();
    jQuery.LazyLanguageLoader('SetDefaultURL', '/Strings');
    jQuery.LazyLanguageLoader('SetDefaultLanguage', 'French');
    jQuery.LazyLanguageLoader('SetExpiry', null);
    jQuery('div.First').LazyLanguageLoader('LoadLanguage', {'Restful': false, 'Callback': function(){
        assert.ok(jQuery('div.First div[data-String=Blue]').text()=="Bleu" && jQuery('div.None div[data-String=House]').text()=="Maison", "Confirming that uploader works at the most basic level.");
        assert.ok(jQuery('div.First div[data-String=CarLove]').text()=="Greg aime mon automobile rouge", "Confirming loading string with arguments works.");
        QUnit.start();
        localStorage.clear();
    }});
});

QUnit.asyncTest("Unicode", function( assert ) {
    localStorage.clear();
    jQuery.LazyLanguageLoader('SetDefaultURL', '/Strings');
    jQuery.LazyLanguageLoader('SetDefaultLanguage', 'French');
    jQuery.LazyLanguageLoader('SetExpiry', null);
    jQuery('div.Unicode').LazyLanguageLoader('LoadLanguage', {'Callback': function(){
            assert.ok(jQuery('div.Unicode div[data-String=FrostWindow]').text()=="Fenêtre Givrée", "Unicode characters are preserved for default GET requests.");
            localStorage.clear();
            jQuery('div.Unicode').LazyLanguageLoader('LoadLanguage', {'Restful': false, 'Callback': function(){
                assert.ok(jQuery('div.Unicode div[data-String=FrostWindow]').text()=="Fenêtre Givrée", "Unicode characters are preserved for overloaded POST requests.");
                QUnit.start();
            }});
    }});
});

QUnit.asyncTest("Expiry", function( assert ) {
    localStorage.clear();
    jQuery.LazyLanguageLoader('SetDefaultURL', '/Strings');
    jQuery.LazyLanguageLoader('SetDefaultLanguage', 'English');
    jQuery.LazyLanguageLoader('SetExpiry', 200);
    AjaxRequests = 0;
    jQuery('div.First').LazyLanguageLoader('LoadLanguage', {'Callback': function(){
        assert.ok(AjaxRequests==1, "Confirming that initial request happened.");
        jQuery('div.First').LazyLanguageLoader('LoadLanguage', {'Callback': function(){
            assert.ok(AjaxRequests==1, "Confirming that local storage is used within the expiry window.");
            setTimeout(function() {
                jQuery('div.First').LazyLanguageLoader('LoadLanguage', {'Callback': function(){
                    assert.ok(AjaxRequests==2, "Confirming that data in local storage isn't reused after expiry.");
                    QUnit.start();
                    localStorage.clear();
                }});
            }, 210)
        }});
    }});
});
