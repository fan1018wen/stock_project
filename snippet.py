#encoding=utf8

import lxml.etree
import json
def html2text(html): 
     tree = lxml.etree.fromstring(html, lxml.etree.HTMLParser())if  isinstance(html, basestring) else html 
     for skiptag in ('//script', '//iframe'): 
         for node in tree.xpath(skiptag): 
             node.getparent().remove(node) 
     return lxml.etree.tounicode(tree, method='text') 



def pr(t):
    print json.dumps(t, ensure_ascii=False,indent=2)



for i in Article.find({"keyword":u"危机"}).sort("datetime",-1).limit(10):
    print i['title'],i['url']
