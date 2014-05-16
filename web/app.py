from pymongo import Connection
import web,json
web.config.debug = True

urls = (
        '/article','article',
        "/", "hello",
        )

app = web.application(urls, globals(),autoreload=True)

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



if __name__ == "__main__":
    app.run()
    pass




