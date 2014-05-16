#encoding=utf8
import pymongo
import simhash 

Article = pymongo.Connection().stock.Article


def pr(t):
    print json.dumps(t, ensure_ascii=False,indent=2)

bu = simhash.SimhashIndex({},k=50)
for i in Article.find({},{"title":1,"sim":1}).limit(1000):
    obj_id = i['title']
    hash_int = simhash.Simhash(int(i['sim']))
#     print hash_int.value
    bu.add( obj_id,hash_int)



