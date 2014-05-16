# Scrapy settings for my project
#
# For simplicity, this file contains only the most important settings by
# default. All the other settings are documented here:
#
#     http://doc.scrapy.org/en/latest/topics/settings.html
#

BOT_NAME = 'my'

SPIDER_MODULES = ['my.spiders']
NEWSPIDER_MODULE = 'my.spiders'

# Crawl responsibly by identifying yourself (and your website) on the user-agent
#USER_AGENT = 'my (+http://www.yourdomain.com)'
LOG_LEVEL = 'CRITICAL'




ITEM_PIPELINES = {
    # 'my.pipelines.JsonWithEncodingPipeline': 300,
    'my.pipelines.MongodbPipeline': 300,
}
