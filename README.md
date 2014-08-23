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

To be continued...
