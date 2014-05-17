from pymongo import Connection
import web,json
web.config.debug = True

from route import *

urls = (
        '/article','article',
        "/", "hello",
        )

app = web.application(urls, globals(),autoreload=True)

if __name__ == "__main__":
    app.run()
    pass



