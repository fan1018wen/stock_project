#encoding=utf8
from flask import *
import flask
import route
import re
from werkzeug.contrib.cache import SimpleCache
import time
app = Flask(__name__)
app.secret_key = 'sgdersdsffdsfdsfgtderfgy#efds??><>'
cache = SimpleCache()
app.config['SEND_FILE_MAX_AGE_DEFAULT']=-1

@app.route('/api/articleList/<int:page>')
def article_list(page):
    return route.article_list(page)


@app.route('/api/articleList/keyword/<keyword>/<int:page>')
def article_list_keyword(keyword,page):
    # print keyword
    # print type(keyword)
    return route.article_list(page,keyword)


@app.route('/api/article/<id>')
def article_content(id):
    return route.article_content(id)

@app.route('/api/tags')
def tags_count():
    t = time.time()
    rv = cache.get('tags_count')
    if rv is None:
        print "no cache tags_count"
        rv = flask.json.dumps(route.tags_count())
        cache.set('tags_count', rv, timeout=5 * 60)
    return rv


@app.route('/api/fenlei')
def fenlei():
    return route.fenlei()

@app.route('/api/login', methods=['POST'])
def login():
    return json.dumps(route.login(session,request.json))


@app.route('/api/isLogin')
def isLogin():
    if session.has_key('username'):
        return json.dumps({"isLogin":True,"username":session['username']})
    return json.dumps({"isLogin":False})
    

#@app.route('/api/session')
#def get_session():
#    return json.dumps(session)

@app.route('/api/logout')
def logout():
    del session['username']
    return ""


@app.route('/api/register',methods=['POST'])
def register():
    try:
        username=request.json['username']
        password=request.json['password']
    except:
        return json.dumps({"success":False,"msg":"填写不完整"})
    if not re.match(r'^[a-z@\-_\.]{4,30}$',username):
        return json.dumps({"success":False,"msg":"邮箱格式不正确"})
    if len(password)<6:
        return json.dumps({"success":False,"msg":"密码太段"})
    if len(password)>30:
        return json.dumps({"success":False,"msg":"密码太长"})
    return route.register(username,password)


@app.route('/api/f10/<int:id>')
def content_path(id):
    return route.content_path(id)


# anything route return  index 

@app.route('/')
@app.route('/<id1>')
@app.route('/<id1>/<id2>')
def index(id1="",id2=""):
    return send_file('index.html')


app.jinja_env.variable_start_string='{{ '
app.jinja_env.variable_end_string=' }}'


if __name__ == '__main__':
    app.run(debug=True,use_debugger=True,host='0.0.0.0',port=3000)

    

