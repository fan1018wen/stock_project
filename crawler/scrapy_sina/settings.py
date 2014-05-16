# Scrapy settings for my project
#
# For simplicity, this file contains only the most important settings by
# default. All the other settings are documented here:
#
#     http://doc.scrapy.org/en/latest/topics/settings.html
#

BOT_NAME = 'scrapy_sina'

SPIDER_MODULES = ['scrapy_sina.spiders']
NEWSPIDER_MODULE = 'scrapy_sina.spiders'

# Crawl responsibly by identifying yourself (and your website) on the user-agent
#USER_AGENT = 'scrapy_sina (+http://www.yourdomain.com)'
LOG_LEVEL = 'CRITICAL'




ITEM_PIPELINES = {
    # 'scrapy_sina.pipelines.JsonWithEncodingPipeline': 300,
    'scrapy_sina.pipelines.MongodbPipeline': 300,
}
