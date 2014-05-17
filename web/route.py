from pymongo import Connection


class hello:
    def GET(self):
        return 'Heaallo,aaa dsdwoasdasrld!'



class article:
    def __init__(self):
        self.Article = Connection().stock.Article
    def GET(self):
        # import ipdb;ipdb.set_trace()
        data = self.Article.find({},{'_id':0}).limit(10)
        data = [i for i in data]
        j=[]
        for i in data:
            i['datetime']=str(i['datetime'])
            j.append(i)
        j = json.dumps(j)
        return j
