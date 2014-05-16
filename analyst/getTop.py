



for i in Article.find():
    keyword = jieba.analyse.extract_tags(html2text(i['body'])) 
    i['keyword']=keyword
