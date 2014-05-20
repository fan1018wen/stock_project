#encoding=utf8
from flask import *
import flask
import route

app = Flask(__name__)



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
    return flask.json.dumps(route.tags_count())



# anything route return  index 
@app.route('/')
@app.route('/<id1>')
@app.route('/<id1>/<id2>')
def hello_world(id1="",id2=""):
    return send_file('static/index.html')


app.jinja_env.variable_start_string='{{ '
app.jinja_env.variable_end_string=' }}'


if __name__ == '__main__':
    app.run(debug=True,use_debugger=True,)

    

