#encoding=utf8
import re
import json
import datetime

from scrapy.selector import Selector
try:
    from scrapy.spider import Spider
except:
    from scrapy.spider import BaseSpider as Spider
from scrapy.utils.response import get_base_url
from scrapy.contrib.spiders import CrawlSpider, Rule
from scrapy.contrib.linkextractors.sgml import SgmlLinkExtractor as sle


import sys
reload(sys)
sys.setdefaultencoding('utf-8')
# import ipdb;ipdb.set_trace()
from scrapy_sina.items import *



class DoubanBookSpider(CrawlSpider):
    name = "douban"
    allowed_domains = ["douban.com"]
    start_urls = [
        "http://book.douban.com/tag/"
    ]
    rules = [
        Rule(sle(allow=("/subject/\d+/?$")), callback='parse_2'),
        Rule(sle(allow=("/tag/[^/]+/?$", )), follow=True),
        Rule(sle(allow=("/tag/$", )), follow=True),
    ]

    def parse_2(self, response):
        pass

    def parse_1(self, response):
        # url cannot encode to Chinese easily.. XXX
        info('parsed ' + str(response))

    def _process_request(self, request):
        info('process ' + str(request))
        return request



class OjSpider(CrawlSpider):
    name = "oj"
    allowed_domains = ["125.221.232.253"]
    start_urls = [
        "http://125.221.232.253/JudgeOnline/"
    ]
    rules = [
        Rule(sle(allow=["/JudgeOnline/problem\.php\?id=\d+$", ]), callback='parse_2'),
        Rule(sle(allow=["/JudgeOnline/.*$"],deny=['/JudgeOnline/contest.php']),follow=True),
        # Rule(sle(allow=("/tag/$", )), follow=True),
    ]

    def parse_2(self, response):
        print response.url
        return
        sel = Selector(response)
        import ipdb;ipdb.set_trace()
        problem = sel.xpath('//*[@id="main"]/div[1]/p').extract()
        for i in problem: log(i)







class SinaSpider(CrawlSpider):
    name = "sina"
    allowed_domains = ["stock.eastmoney.com"]
    start_urls = [
        'http://stock.eastmoney.com/'
    ]
    rules = [
        Rule(sle(allow=["/news/\w+\.html", ]), callback='parse_list',follow=True),
        
        Rule(sle(allow=["/news/\d+,20140516\d+\.html", ]), callback='parse_news',follow=False),
        # Rule(sle(allow=["/.*$"],deny=[]),follow=True),
        # Rule(sle(allow=("/tag/$", )), follow=True),
    ]

    def parse_list(self, response):
        print response.url
       
    def parse_news(self,response):
        print response.url
        sel = Selector(response)
        try:
            body=sel.xpath('//*[@id="ContentBody"]').extract()[0]
            span = sel.css('.titlebox .newsContent .new .Info')
            datetime_string = span.css('span:nth-child(2)::text').extract()[0]
            date = datetime.datetime.strptime(datetime_string,'%Y年%m月%d日 %H:%M')
            title = sel.css('.titlebox .newsContent .new h1::text').extract()[0]
            item = Article(title=title,datetime=date,body=body,url=response.url)
            # print item
            return item
        except Exception as e:
            print e

