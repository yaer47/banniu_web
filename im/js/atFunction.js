/**
 * Created by zyy on 2016/12/28.
 */

String.prototype.endWith=function(endStr){
    var d=this.length-endStr.length;
    return (d>=0&&this.lastIndexOf(endStr)==d)
}

YX.fn.initalAt = function (data) {
    return at_config = {
        at: "@",
        data: data,
        insertTpl: '@${name}',
        displayTpl: "<li>${name}</li>",
        startWithSpace: false,
        callbacks:{
            filter: function(query, data, search_key) {
                var arr=[]
                for(var i=0;i<data.length;i++){
                    if((query==""&&data[i].name!="")||data[i].name.indexOf(query) >= 0||data[i].fullname.indexOf(query)>=0)
                        arr.push(data[i].name)
                }
                return arr;
            },
            sorter: function(query, items, searchKey){
                return items
            },
            beforeReposition: function(offset){
                var d= window.parent.document.getElementById("nim_iframe");
                var t = d.offsetTop;
                var l= d.offsetLeft;
                // var top = this.imIframe.contentWindow.document.body.offsetTop;
                offset.top -= t;
                offset.left -= l;
            },
            tplEval: function(tpl, map) {
                var error, template;
                template = tpl;
                try {
                    if (typeof tpl !== 'string') {
                        template = tpl(map);
                    }
                    return template.replace(/\$\{([^\}]*)\}/g, function(tag, key, pos) {
                        return map[key];
                    });
                } catch (error1) {
                    error = error1;
                    return "";
                }
            },
            beforeInsert: function(value, $li, e){
                return value;
            }
        }
    }
}

YX.fn.resetAt = function (members) {
    if(!members){
        this.$messageText.atwho('destroy');
        return;
    }
    var data = $.map(members,function(value,i) {
        var user= this.cache.getUserFromId(value.account),
            avatar = user.userIcon?user.userIcon:"images/default-icon.png",
            nick = user.workNick,
            fullname = user.fullNamePinyin
        return {'id': value.account, 'name':nick, 'fullname':fullname, 'icon':avatar};
    }.bind(this));

    this.$messageText = $('#messageText').atwho(this.initalAt(data));
    this.$messageText.caret('pos', 0);
}

YX.fn.atFunc = function () {
    this.$atList = $('#atList')
    this.$showAt = $('#showAt')
    this.$showAt.on('click', this.showAtList.bind(this))
    this.hasShowList = false
}

YX.fn.showAtList = function (str, e) {
    var that = this
    this.$atList.removeClass("hide")
    if(e && e.stopPropagation){
        e.stopPropagation();  //w3c
    }else{
        window.event.cancelBubble=true; //IE
    }
    document.onclick=function(){
        that.$atList.addClass("hide")
        document.onclick=null;
    }
}

YX.fn.insertAtToText = function () {
    var $curLi = $('#at-view-64 li.cur')
    var text = $curLi.text()
    this.getTeamMembers(this.crtSessionAccount, function (members) {
        for(var i=0; i<members.length; i++){
            var user= this.cache.getUserFromId(members[i].account)
            if(user.workNick==text&&!this.atIds.contains(members[i].account)){
                this.atIds.push(members[i].account)
            }
        }
    }.bind(this))
}

YX.fn.onTextAreaInputChanged = function (e) {
    var str= this.$messageText.val();
    if($.trim(this.$messageText.val()).length<=0){
        this.activateSendBtn(false);
    }else{
        this.activateSendBtn(true);
    }
    /*
    var str= this.$messageText.val();
    if($.trim(this.$messageText.val()).length<=0){
        this.activateSendBtn(false);
        this.$atList.addClass("hide")
        return
    }
    var position = this.getTextCursorPosition()
    var text = str.substr(0, position);
    this.activateSendBtn(true);
    if(this.hasShowList==true){
        var n = str.lastIndexOf("@");
        if (-1 != n)
        {
            var currStr = text.right(text.length() - n - 1);
            if (!this.showAtList(currStr, e))
            {
                this.$atList.addClass("hide")
                this.hasShowList = false;
            }
        }
        else
        {
            this.$atList.addClass("hide")
            this.hasShowList = false;
        }
    }else{
        if(str.substr(str.length-1,1)=='@'){
            this.showAtList('', e)
            this.hasShowList = true;
        }
    }
    console.log('input changed : '+str+"\r\n"+"cursor position :"+ position);
    */
}


YX.fn.getTextCursorPosition = function(){
    var cursurPosition=-1;
    if($('#messageText').selectionStart){//非IE浏览器
        cursurPosition= $('#messageText').selectionStart;
    }else{//IE
        var range = document.selection.createRange();
        range.moveStart("character",-$('#messageText').value.length);
        cursurPosition=range.text.length;
    }
    // alert(cursurPosition);
    return cursurPosition;
}

YX.fn.addAtEvent = function(element,type,callback){
    if(!!element.addEventListener){
        element.addEventListener(type,callback,false);
    }else if(!!element.attachEvent){
        element.attachEvent('on'+type,callback);
    }else{
    }
};