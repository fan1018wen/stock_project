from pymongo import Connection
import json

def hello():
    return 'Heaallo,aaa dsdwoasdasrld!'

class article:
    def __init__(self):
        self.Article = Connection().stock.Article
    def GET(self):
        # import ipdb;ipdb.set_trace()
        data = self.Article.find({},{"title":1,"datetime":1,"url":1,"keyword":1,"datetime":1,"summary":1}).limit(10)
        data = [i for i in data]
        j=[]
        for i in data:
            i['_id']=str(i['_id'])
            i['datetime']=str(i['datetime'])
            j.append(i)
        #pr(j)
        j = json.dumps(j,ensure_ascii=False)
        return j

if __name__ =='__main__':
    pass
    # print article().GET()



