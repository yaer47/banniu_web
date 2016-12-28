/**
 * Created by zyy on 2016/12/28.
 */
YX.fn.atFunc = function () {
    this.$atList = $('#atList')
    this.$showAt = $('#showAt')
    this.$showAt.on('click', this.showAtList.bind(this))
    this.hasShowList = false
    // this.addAtEvent(document, 'click', function () {
    //     that.$atList.addClass('hide')
    // })
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
    // if (!isTribe)
    // {
    //     return;
    // }
    // QString text(document()->toPlainText());
    // int n = this->textCursor().positionInBlock();
    // text = text.left(n);
    // if (hasAt)
    // {
    //     int n = text.lastIndexOf("@");
    //     if (-1 != n)
    //     {
    //         QString currStr = text.right(text.length() - n - 1);
    //         if (!m_atListWidget->showList(currStr, getCursorPoint()))
    //         {
    //             m_atListWidget->hide();
    //         }
    //     }
    //     else
    //     {
    //         m_atListWidget->hide();
    //         hasAt = false;
    //     }
    //
    // }
    // else
    // {
    //     if (text.endsWith("@"))
    //     {
    //         hasAt = true;
    //         m_atListWidget->showList("", getCursorPoint());
    //     }
    // }
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