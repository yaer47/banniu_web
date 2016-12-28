/**
 * Created by zyy on 2016/12/28.
 */

YX.fn.initalAt = function () {
    var jeremy = decodeURI("J%C3%A9r%C3%A9my") // Jérémy
    var names = ["Jacob","Isabella","Ethan","Emma","Michael","Olivia","Alexander","Sophia","William","Ava","Joshua","Emily","Daniel","Madison","Jayden","Abigail","Noah","Chloe","你好","你你你", jeremy, "가"];

    this.at_config = {
        at: "@",
        data: names,
        callbacks: {
            /*  What to do before insert item's value into inputor.

             @param value [String] content to insert
             @param $li [jQuery Object] the chosen item */
            before_insert: function(value, $li) {
                return value;
            },
            // matcher: function(flag, subtext, should_start_with_space) {
            //         return subtext;
            // },
            /* Filter data by matched string.
             @param query [String] Matched string.
             @param data [Array] data list
             @param search_key [String] key char for seaching.

             @return [Array] result data.*/
            filter: function(query, data, search_key) {
                var arr=[]
                for(var i=0;i<data.length;i++){
                    if((query==""&&data[i].name!="")||data[i].name.indexOf(query) >= 0||data[i].fullname.indexOf(query)>=0)
                        arr.push(data[i].fullname)
                }
                return arr;
            }
        }
    }
    this.$messageText = $('#messageText').atwho(this.at_config);
    this.$messageText.caret('pos', 0);
    this.$messageText.focus().atwho('run');
}

YX.fn.resetAt = function (data) {
    this.at_config.data= data;
    this.at_config.insertTpl= '${name}';
    this.at_config.displayTpl= "<li>${name}${fullname}</li>";
    this.$messageText = $('#messageText').atwho(this.at_config);
    // this.$messageText.caret('pos', 47);
    // this.$messageText.focus().atwho('run');
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