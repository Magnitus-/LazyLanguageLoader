"""
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
"""
import os
import urllib2
import webbrowser

Scripts = {'Sprintf': {'Url': "https://raw.githubusercontent.com/alexei/sprintf.js/master/dist/sprintf.min.js", 'Name': 'sprintf.min.js'},
           'PersistentBrowserObject': {'Url': "https://raw.githubusercontent.com/Magnitus-/PersistentBrowserObject/master/jQuery.PersistentBrowserObject.Min.js", 'Name': 'jQuery.PersistentBrowserObject.Min.js'},
           'TestServer': {'Name': 'TestServer.js'}}
StartingPath = os.getcwd()
ServerPath = os.path.join(StartingPath, 'Client', 'Tests')

def Exists(Command):
    for Path in os.environ['PATH']:
        if os.path.exists(os.path.join(Path, Command)):
            return True
    return False

def InstallStaticScript(ScriptName, ScriptUrl):
    ScriptPath = os.path.join(StartingPath, 'Client', 'Tests', 'Static')
    if os.path.exists(ScriptPath):
        return
    Request = urllib2.Request(ScriptUrl)
    Descriptor = urllib2.urlopen(Request)
	except urllib2.HTTPError:
	    exit()
    except urllib2.URLError:
	    exit()
    Reply = Descriptor.read()
    ScriptFile = open(ScriptPath,'w')
    ScriptFile.write(Reply)
    ScriptFile.close()
    
def GetDependencies():
    if not(Exists('npm')):
        exit()
    InstallStaticScript(Scripts['Sprintf']['Name'], Scripts['Sprintf']['Url'])
    InstallStaticScript(Scripts['PersistentBrowserObject']['Name'], Scripts['PersistentBrowserObject']['Url'])
    os.chdir(ServerPath)
    os.system("npm install")

GetDependencies()
os.chdir(ServerPath)
NodeName = ('nodejs' if Exists('nodejs') else 'node')
os.system(NodeName+" "+Scripts['TestServer']['Name'])
webbrowser.open('127.0.0.1:8080', new=2)


