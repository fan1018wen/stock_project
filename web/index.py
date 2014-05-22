#encoding=utf8
from flask import *
import flask
import route
from werkzeug.contrib.cache import SimpleCache
app = Flask(__name__)
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
    rv = cache.get('tags_count')
    if rv is None:
        print "no cache tags_count"
        rv = flask.json.dumps(route.tags_count())
        cache.set('tags_count', rv, timeout=5 * 60)
    return rv


@app.route('/api/fenlei')
def fenlei():
    return route.fenlei()


# anything route return  index 
@app.route('/')
@app.route('/<id1>')
@app.route('/<id1>/<id2>')
def index(id1="",id2=""):
    return send_file('index.html')


app.jinja_env.variable_start_string='{{ '
app.jinja_env.variable_end_string=' }}'


if __name__ == '__main__':
    app.run(debug=True,use_debugger=True,host='0.0.0.0')

    

