from flask import *
import route

app = Flask(__name__)

@app.route('/')
def hello_world():
    1+1
    return render_template('index.html')

@app.route('/api/article')
def article():
    return route.article()


app.jinja_env.variable_start_string='{{ '
app.jinja_env.variable_end_string=' }}'


if __name__ == '__main__':
    app.run(debug=True,use_debugger=True,)

    

