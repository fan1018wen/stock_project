#encoding=utf8
from pymongo import Connection
import json
from bson import ObjectId
def hello():
    return 'Heaallo,aaa dsdwoasdasrld!'



Article = Connection().stock.Article



def article():
    # import ipdb;ipdb.set_trace()
    data = Article.find({},{"title":1,"datetime":1,"url":1,"keyword":1,"datetime":1,"summary":1}).limit(20)
    data = [i for i in data]
    j=[]
    for i in data:
        i['_id']=str(i['_id'])
        i['datetime']=str(i['datetime'])
        i['keyword']=i['keyword'][0:10]
        j.append(i)
    #pr(j)
    j = json.dumps(j,ensure_ascii=False)
    return j

def article_content(id):
    
    data = Article.find_one({'_id':ObjectId(id)},{'body':1,"_id":0})
    return json.dumps(data,ensure_ascii=False)

if __name__ =='__main__':
    pass
    # print article().GET()
    print article_content("537613a67f949f18042cb731")


