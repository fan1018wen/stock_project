# Define here the models for your scraped items
#
# See documentation in:
# http://doc.scrapy.org/en/latest/topics/items.html

from scrapy.item import Item, Field

class Article(Item):
    # define the fields for your item here like:
    # name = Field()
    title = Field()
    datetime = Field()
    body = Field()
    url = Field()
    pass



class Fenlei(Item):
    title_list = Field()
    id_list = Field()
    fenlei = Field()
    pass
