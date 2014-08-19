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
jQuery.LazyLanguageLoader('SetDefaultURL', '/Strings');
jQuery.LazyLanguageLoader('SetAjaxWrapper', TestAjaxWrapper);

QUnit.asyncTest("Update", function( assert ) {
    localStorage.clear();
    jQuery.LazyLanguageLoader('SetDefaultLanguage', 'French');
    jQuery('div.None').LazyLanguageLoader('LoadLanguage', {'Callback': function(){
        assert.ok(jQuery('div.None div[data-String=Blue]').text()=="Bleu" && jQuery('div.None div[data-String=House]').text()=="Maison", "Confirming that uploader works at the most basic level.");
        assert.ok(jQuery('div.None form input').val()=="Soumettre", "Confirming that uploader works with submit buttons.");
        assert.ok(jQuery('div.None div[data-String=CarLove]').text()=="Greg aime mon automobile rouge", "Confirming loading string with arguments work.");
        jQuery('div.None').LazyLanguageLoader('LoadLanguage', {'Callback': function(){
            assert.ok(AjaxRequests==1, "Confirming that content is properly cached.");
            jQuery('div.None').LazyLanguageLoader('LoadLanguage', {'Language': 'English', 'Callback': function(){
                    assert.ok(jQuery('div.None div[data-String=Blue]').text()=="Blue" && jQuery('div.None div[data-String=House]').text()=="House", "Confirming that uploader works with language change.");
                    assert.ok(jQuery('div.None form input').val()=="Submit", "Confirming that uploader works with language change.");
                    assert.ok(jQuery('div.None div[data-String=CarLove]').text()=="Greg likes my red car", "Confirming loading string with arguments works with language change.");
                    QUnit.start();
            }});
        }});
    }});
});
