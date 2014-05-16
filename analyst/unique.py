#encoding=utf8
# 找出 最相近的文章

import pymongo
import sys
import bson
sys.path.append('..')
import mysimhash 
Article = pymongo.Connection().stock.Article


def pr(t):
    print json.dumps(t, ensure_ascii=False,indent=2)
id=0
bu = mysimhash.SimhashIndex({},k=50)
for i in Article.find({},{"_id":1,"sim":1}).limit(10000):
    obj_id = i['_id']
    hash_int = mysimhash.Simhash(int(i['sim']))
    bu.add( obj_id,hash_int)

bu.k=13
for item in Article.find().limit(10):
    obj_id = str(item['_id'])
    sim = mysimhash.Simhash(int(item['sim']))
#     print sim,
    articles = bu.get_near_dups(sim)
    print item['title'],item['_id']
    for i in articles:
        if i[1]==obj_id:continue
        art = Article.find_one({"_id":bson.objectid.ObjectId(i[1])})
        print '\t',art['title'],art['_id'],art['url']
