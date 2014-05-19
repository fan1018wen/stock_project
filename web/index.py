#encoding=utf8
from flask import *
import flask
import route

app = Flask(__name__)



@app.route('/api/articleList/<int:page>')
def articleList(page):
    return route.articleList(page)

@app.route('/api/article/<id>')
def article_content(id):
    return route.article_content(id)


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

    

