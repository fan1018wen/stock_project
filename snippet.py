#encoding=utf8

import lxml
def html2text(html): 
     tree = lxml.etree.fromstring(html, lxml.etree.HTMLParser())if  isinstance(html, basestring) else html 
     for skiptag in ('//script', '//iframe'): 
         for node in tree.xpath(skiptag): 
             node.getparent().remove(node) 
     return lxml.etree.tounicode(tree, method='text') 



def pr(t):
    print json.dumps(t, ensure_ascii=False,indent=2)
