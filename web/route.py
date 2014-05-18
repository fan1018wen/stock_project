from pymongo import Connection
import json

def hello():
    return 'Heaallo,aaa dsdwoasdasrld!'



Article = Connection().stock.Article



def article():
    # import ipdb;ipdb.set_trace()
    data = Article.find({},{"title":1,"datetime":1,"url":1,"keyword":1,"datetime":1,"summary":1}).limit(10)
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

if __name__ =='__main__':
    pass
    # print article().GET()



