window.searchCompany = (company,keyword)->
    ans=[]
    isAdd={}
    enque = (ans)->
        isAdd={}
        re=[]
        for item in ans
            id=item.id
            unless isAdd[id]
                re.push item
                isAdd[id]=1
        if re.length>50 then re=re[0...50] else re
    searchId = ->
        #if parseInt(keyword)<100 then return
        for item in company
            id=item.id
            if id.toString().indexOf(keyword)!=-1 
                ans.push(item)
        enque ans
    searchName = ->
        for item in company
            name=item.title
            if name.toString().indexOf(keyword)!=-1 
                ans.push(item)
        enque ans
    
    searchPinYin = ->
        for item in company
            py=item.title_pinyin
            if py.toString().indexOf(keyword)!=-1 
                ans.push(item)
        enque ans
        
    if isNaN parseInt keyword
       if /^[a-z]+$/.test keyword
            return searchPinYin()
        return searchName()
    return searchId()

