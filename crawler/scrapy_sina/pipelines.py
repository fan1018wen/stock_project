# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: http://doc.scrapy.org/en/latest/topics/item-pipeline.html




from scrapy import signals


import json
import codecs


class JsonWithEncodingPipeline(object):

    def __init__(self):
        self.file = codecs.open('data_utf8.json', 'w', encoding='utf-8')

    def process_item(self, item, spider):
        # print item
        # import ipdb;ipdb.set_trace()
        
        line = json.dumps(dict(item), ensure_ascii=False) + "\n"
        self.file.write(line)
        return item

    def spider_closed(self, spider):
        self.file.close()




class MongodbPipeline(object):
    def __init__(self):
        from pymongo import Connection
        self.Artile = Connection().stock.FenleiTest

    def process_item(self, item, spider):
        # import ipdb;ipdb.set_trace()
        # import ipdb;ipdb.set_trace()
        self.Artile.insert(dict(item))
        return item

    def spider_closed(self, spider):
        pass




