#encoding=utf8
from pymongo import Connection
import json
from bson import ObjectId
import pymongo.errors


Article = Connection().stock.Article
CompanyFenlei = Connection().stock.CompanyFenlei
User = Connection().stock.user
User.safe=True


def article_list(page,keyword=""):
    # import ipdb;ipdb.set_trace()
    if keyword=="": data=Article.find({},{"title":1,"datetime":1,"url":1,"keyword":1,"datetime":1,"summary":1})
    else :data=Article.find({"keyword":keyword},{"title":1,"datetime":1,"url":1,"keyword":1,"datetime":1,"summary":1})
    #import ipdb;ipdb.set_trace()
    data = data.sort("datetime",-1).skip(page*10).limit(10)
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


from bson.son import SON

def tags_count():
    result = Article.aggregate([
         {"$unwind": "$keyword"},
         {"$group": {"_id": "$keyword", "count": {"$sum": 1}}},
         {"$sort": SON([("count", -1), ("_id", -1)])}
     ])
    N=200
    result=result['result'][0:N]
    m = max([ i['count'] for i in result])
    def f(n):
        n=n*10/m
        if(n>5) :n=5
        return n
    return [(i['_id'],f(i['count']) ) for i in result if not i['_id'].isdigit()]


def fenlei():
    r={}
    for i in CompanyFenlei.find({},{"_id":0}):
        r[i['fenlei']]=i
    r = json.dumps(r,ensure_ascii=False)
    return r


def login(session,json):
    try:
        username=json['username']
        password=json['password']
        find = User.find_one({"username":username})
        if not find:
            return {"success":False,"msg":"用户不存在"}
        if password==find['password']:
            session['username']=username
            return {"success":True,"msg":"登录成功"}
        else :
            return {"success":False,"msg":"密码错误"}
    except:
        return {"success":False,"msg":"未知错误"}


def register(username,password):
    try:
        User.insert({'username':username,'password':password})
    except pymongo.errors.DuplicateKeyError:
        return json.dumps({"success":False,"msg":"用户名已经存在"})
    return json.dumps({"success":True,"msg":"注册成功"})

# print register('wa','nga')
#import ipdb;ipdb.set_trace()
#print login({},"wa","ng")

if __name__ =='__main__':
    pass
    ##print tags_count()
    # print article().GET()
    #print article_content("537613a67f949f18042cb731")


