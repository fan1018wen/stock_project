from pypinyin import pinyin, lazy_pinyin
import pypinyin

for i in CompanyFenlei.find():
#     print i['fenlei']
    i['fenlei_pinyin']=''.join(lazy_pinyin(i['fenlei']))
#     print i['fenlei_pinyin']
    i['title_list_pinyin'] =[''.join(lazy_pinyin(j))for j in i['title_list'] ]
#     print i['title_list_pinyin']
    CompanyFenlei.save(i)
