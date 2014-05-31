window.searchCompany = (company,keyword)->
    ans=[]
    isAdd={}
    searchId = ->
        #if parseInt(keyword)<100 then return
        for item in company
            id=item.id
            if id.toString().indexOf(keyword)!=-1 
                if not isAdd[id]
                    ans.push(item)
                    isAdd[id]=1
        if ans.length>50 then ans=ans[0...50] else ans
    searchName = ->
        return
    
    searchPinYin = ->
        return
    if isNaN parseInt keyword
       if /^[a-z]+$/.test keyword
            return searchPinYin()
        return searchName()
    return searchId()

