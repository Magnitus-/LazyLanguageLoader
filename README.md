LazyLanguageLoader Server
=========================

To come later in Express/Mongo.

Technically, the client is usable right now with any backend as long as you follow the client/server interface described below.

LazyLanguageLoader Client
=========================

Library that automates client-side loading of server multilingual server strings.

It also provides caching of those strings to minimize the number of server request.

Ideal to use in web applications that create a lot of html dynamically (like single page applications).

Requirements
============

The library requires: 
- jQuery
- window.JSON (native or from a third party-library such as the one written by Douglas Crockford)
- Alexandru's sprintf library (or another that implements vsprintf as described in his documentation) which can be found here: https://github.com/alexei/sprintf.js
- The PersistentBrowserObject library which can be found here: https://github.com/Magnitus-/PersistentBrowserObject
- Ideally, window.localStorage for caching strings (without it, library options will be stored in a cookie and strings will be stored in memory)

Additionally, the following are required to run the tests:
- Node.js
- npm
- Python (only necessary if you want to run the convenience script that sets up the environment to run the tests for you)

If you plan to run the tests without using the convenience script, you'll also need:
- Express and body-parser, installed in the 'Client/Tests' directory
- The sprintf and PersistentBrowserObject libraries (described above), installed in the 'Client/Tests/Static' directory

Library Calls Convention
========================

In order to avoid pollution the jQuery object, only the LazyLanguageLoader property is added to the jQuery object (ie, jQuery.LazyLanguageLoader).

Global library calls are made as follows:

```javascript
jQuery.LazyLanguageLoader('FunctionName', <Arguments>);
```

Library calls meant to operate on a jQuery set of HTML tags are made as follows:

```javascript
ThejQuerySet.LazyLanguageLoader('FunctionName', <Arguments>);
```

Basic Structure
===============

At the core, the library relies on the following attributes on HTML tags that contain linguistic content:

1) data-String

This attribute contains the tag describing the string that should be fetched on the server or in local storage. It's value could be the literal value of the string, but it needs not be.

For example, it would be better to use a shorter descriptive name to describe a paragraph of text than to use the value of the paragraph as a tag.

Also, unicode support for string tags is not expected nor tested.

2) data-StringArgs

This attribute contains a JSON stringnified array that contains the arguments to pass inside the string (using vsprintf). 

They can be language-dependant if specified in the data-TranslateArgs attribute which case they act as a tag. Othersive, they are passed in the string directly.

3) data-TranslateArgs

This attribute contains a JSON stringnified array that contains the position of the arguments that are language dependant in the arguments' array.

Utilities For Structure
=======================

You can manually craft HTML tags with the above structure or use utility functions that will generate that structure for you.

The 2 functions provided for this task are as follows:

1) StrToHtmlRepr

Takes an argument os the form {'String':..., 'Args':..., 'Translate': ...} and output the relevant attributes in a string as it would appear inside html.

Ex: 

```javascript
jQuery('<div '+jQuery.LazyLanguageLoader('StrToHtmlRepr', {'String': 'Hello World'})+'></div>').appendTo(SomeParentTag);
```

2) StrToAttr

Takes an argument os the form {'String':..., 'Args':..., 'Translate': ...} and sets the relevant attributes in the context tag.

Ex:

```javascript
jQuery('div#HelloWorld').LazyLanguageLoader('StrToAttr', {'String': 'Hello World'});
```

Customization Utilities
=======================

The following calls allows users to customize their usage of the library

1) SetDefaultLanguage

Sets the default language that will be requested when fetchin strings from the server.

If the 'Language' argument is passed to the 'LoadLanguage' call, this will take precedence over the default.

2) SetDefaultURL

Sets the default Url that will be used fetch strings from the server.

If the 'Url' argument is passed to the 'LoadLanguage' call, this will take precedence over the default.

3) SetAjaxWrapper

Passes a wrapper function to make Ajax calls.

The passed function should have the following form: function(Request).

Request is the Ajax request object with all its parameters set by the library (including callbacks and all).

The passed function is responsible for making the Ajax request (ie, jQuery.ajax(Request)).

4) SetExpiry

Sets the expiry for cached strings in milliseconds after which they will be deleted from the localStore and refetched from the server.

The default value, if no call is made to this function, is no expiry. 

Assuming an expiry was specified in previous call, passing null as an argument in a subsequent call restores this 'no expiry' default.

To be continued...
