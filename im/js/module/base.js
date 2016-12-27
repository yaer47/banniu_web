'use strict'
var YX = function (accid) {
    this.accid = accid
    this.initModule()
    this.cache = new Cache(this)
    this.cache.initData()
    this.mysdk = new SDKBridge(this, this.cache)
    this.firstLoadSysMsg = true
    this.isBodyShow = false
    this.totalUnread = 0
    this.iframeWidth = 0
}

YX.fn = YX.prototype

YX.fn.initModule = function () {
    this.initBase()
    this.message()
    this.notification()
    this.personCard()
    this.sysMsg()
    this.session()
    this.friend()
    this.team()
    this.cloudMsg()
}

//onchanged

// var element = document.getElementById("mytext");
// if("\v"=="v") {
//     element.onpropertychange = webChange;
// }else{
//     element.addEventListener("input",webChange,false);
// }
// function webChange(){
//     if(element.value){document.getElementById("test").innerHTML = element.value};
// }

YX.fn.initBase = function () {
	// 初始化节点事件
    this.$iClose = $('#iClose')
    this.$iClose.on('click', this.onClose.bind(this))
    this.$searchInput = $('#searchInput')
    // this.$searchInput.on('input', this.onInputChanged.bind(this))
    this.$searchInput.on('focus input', this.onInputChanged.bind(this))
    this.$resultList = $('#searchResult')
    this.$resultWrap = $('#resultWrap')

	this.$mask = $('#mask')
    this.$sendBtn = $('#sendBtn')
	//左上角信息
	this.$userPic = $('#userPic')
	this.$userName = $('#userName')
    //右边面板内容节点
    this.$rightPanel = $('#right-panel')
    this.$leftPanel = $('#left-panel')
    this.$chatTitle = $('#chatTitle')
    this.$chatContent = $('#chatContent')
    this.$nickName = $('#nickName')
	//切换面板
    this.$switchPanel = $('#switchPanel')
    this.$switchPanel.on('click', 'a', this.switchPanel.bind(this))
    //切换的面板
	this.$sessionsWrap = $('#sessionsWrap')
    this.$friendsWrap = $('#friendsWrap')
    this.$teamsWrap = $('#teamsWrap')
    this.$panelItems = $('#left-panel .item')
    //this.$panelItems = $('#right-panel .item')
    //2面板中间的圆点
    this.$chatVernier = $('#chatVernier span')
    $('#left-panel .item .list').on('scroll', this.doPoint.bind(this))
    this.$chatVernier.on('click', this.pointCkicked.bind(this))
    this.$chatVernier.on('mouseover', function () {
        this.style.backgroundColor = "#e06b79";
    })
    this.$chatVernier.on('mouseout', function () {
        this.style.backgroundColor = "#92C8EE";
    })
    $('#bodyHidden').on('mouseover', function () {
        if(!this.isBodyShow)
           this.iframeWidth= IFrameResize(50, 0).width;
    }.bind(this))
    $('#bodyHidden').on('mouseout', function () {
        if(!this.isBodyShow)
            this.iframeWidth=IFrameResize(20, 0).width;
    }.bind(this))

    //$('#right-panel .item .list').on('scroll', this.doPoint.bind(this))
    //显示隐藏
    this.bodyHiddenEvt()

	//登出
	this.logoutEvt()
    //多端登陆
    this.multiportEvt()
}

YX.fn.onClose = function () {
    $("#mainPanel").addClass('hide')
}

YX.fn.onInputChanged = function (e) {
    switch(e.type)
    {
        case "focus":
            this.showSearchResult();
            break;
        case "input":
            var c = this.$searchInput.val()
            var result = this.cache.getSearchTeamList(c)
            this.updateSearchList(result)
            break;
        default:
    }

}

YX.fn.updateSearchList = function (list) {

    var tmp1 = '<div class="panel_team"><div class="panel_team-title">讨论组</div><ul class="j-normalTeam">',
        tmp2 = '<div class=" panel_team"><div class="panel_team-title">高级群</div><ul class="j-advanceTeam">',
        flag1 = false,
        flag2 = false,
        html = '',
        info,
        teams = list;
    if (teams && teams.length > 0) {
        for (var i = 0, l = teams.length; i < l; ++i) {
            info = this.infoProvider(teams[i],"team");
            if (info.type === 'normal') {
                flag1 = true;
                tmp1 += ['<li class="panel_item '+'" data-gtype="normal" data-type="team" data-account="' + info.teamId + '">',
                    '<div class="panel_avatar"><img class="panel_image" src="'+info.avatar+'"/></div>',
                    '<div class="panel_text">',
                    '<p class="panel_single-row">'+info.nick+'</p>',
                    '</div>',
                    '</li>'].join("");
            } else if (info.type === 'advanced') {
                flag2 = true;
                tmp2 += ['<li class="panel_item '+'" data-gtype="advanced" data-type="team" data-account="' + info.teamId + '">',
                    '<div class="panel_avatar"><img class="panel_image" src="'+info.avatar+'"/></div>',
                    '<div class="panel_text">',
                    '<p class="panel_single-row">'+info.nick+'</p>',
                    '</div>',
                    '</li>'].join("");
            }
        }
        tmp1 += '</ul></div>';
        tmp2 += '</ul></div>';
        if (flag1 && flag2) {
            html = tmp2 + tmp1;
        } else if (flag1 && !flag2) {
            html = tmp1;
        } else if (!flag1 && flag2) {
            html = tmp2;
        } else {
            html = '<p>暂时还没有群哦</p>';
        }
    } else {
        html = '<p>暂时还没有群哦</p>';
    }
    this.$resultList.html(html);
}

YX.fn.showSearchResult = function (){

}

/**
 * 同步完成后 UI显示  本demo这里显示最近会话列表 跟消息中心 新系统通知技术计数
 * @see session.js 
 */
YX.fn.initUI = function () {
    this.buildSessions()
    this.showSysMsgCount()
}
/**
 * 初始化个人信息回调 显示左上角信息
 */
YX.fn.showMe = function () {
	// var user = this.cache.getUserById(userUID)
	// this.$userName.text(user.nick)
	// this.$userPic.attr('src', getAvatar(user.avatar))
	// setCookie('nickName',user.nick)
	// setCookie('avatar',user.avatar)
    //try

    var user = this.cache.getUserFromId(userUID)
    this.$userName.text(user.workNick)
    this.$userPic.attr('src', user.userIcon?user.userIcon:"images/default-icon.png")
    setCookie('nickName',user.workNick)
    setCookie('avatar',user.userIcon)
}
/*********************************************
 * SDK初始化结束后，拉取需要用到的用户信息，群组信息
 *********************************************/
YX.fn.initInfo = function (obj, team) {
	this.lockPerson = true
    this.lockTeam = true
    var array = Object.keys(obj),
        teamArray=[]
    for (var i = team.length - 1; i >= 0; i--) {
        if(!this.cache.hasTeam(team[i])){
            teamArray.push(team[i])
        }
    }
    if(teamArray.length>0){
        this.mysdk.getLocalTeams(teamArray,this.cbInitLocalTeamInfo.bind(this))           
    }else{
        this.lockTeam = false
    }
    this.mysdk.getUsers(array,this.cbInitInfo.bind(this)) 
}
YX.fn.cbInitInfo = function (error, data) {
    if(!error){
        this.cache.setPersonlist(data)
        this.lockPerson = false
        if(this.lockTeam === false){
            this.initUI()   
        }
    }else{
        alert("获取用户信息失败")
    }   
}

YX.fn.cbInitLocalTeamInfo = function (err, data) {
    if(!err){
        this.cache.addTeamMap(data.teams)
        this.lockTeam = false
        if(this.lockPerson === false){
            this.initUI()
        }
    }else{
        alert("获取本地群组失败")
    }
}

/*********************************
 * 点击左边面板，打开聊天框
 *********************************/

YX.fn.deleteSession= function (scene, account) {
    this.mysdk.deleteSession(scene, account, function (err, obj) {
        var a= err;
    })
}
YX.fn.openChatBox = function (account, scene) {
    this.iframeWidth= IFrameResize(1000, 0).width;
    this.$leftPanel.animate({left:'5'},function () {

    var info
    this.mysdk.setCurrSession(scene,account)
    this.crtSession = scene+"-"+account
    this.crtSessionType = scene
    this.crtSessionAccount = account
    //隐藏其他窗口
    $('#teamInfoContainer') && $('#teamInfoContainer').addClass('hide')
    this.$devices && this.$devices.addClass('hide')
    this.$cloudMsgContainer && this.$cloudMsgContainer.addClass('hide')
    //退群的特殊UI
    // this.$rightPanel.find(".u-chat-notice").addClass("hide")
    // this.$rightPanel.find(".chat-mask").addClass("hide")
    // // this.$rightPanel.removeClass('hide')
    // this.$rightPanel.fadeIn("slow")
    // this.$chatVernier.fadeIn("slow")



        // this.$leftPanel.find(".u-chat-notice").addClass("hide")
    // this.$leftPanel.find(".chat-mask").addClass("hide")
    // this.$leftPanel.removeClass('hide')
    this.$messageText.val('')

    //根据帐号跟消息类型获取消息数据
    if(scene=="p2p"){
        //info = this.cache.getUserById(account)
        // if(info.account == userUID){
        //     this.$nickName.text("我的手机")
        //     this.$chatTitle.find('img').attr('src', "images/myPhone.png")
        // }else{
        //     this.$nickName.text(this.getNick(account))
        //     this.$chatTitle.find('img').attr('src', getAvatar(info.avatar))
        // }

        //try
        info = this.cache.getUserFromId(account)
        if(info.id == userUID){
            this.$nickName.text("我的手机")
            this.$chatTitle.find('img').attr('src', "images/myPhone.png")
        }else{
            this.$nickName.text(info.workNick)
            this.$chatTitle.find('img').attr('src', info.userIcon?info.userIcon:"images/default-icon.png")
        }
        this.$intoGroup && this.$intoGroup.addClass('hide')
        // 群资料入口隐藏
        this.$teamInfo && this.$teamInfo.addClass('hide')
    }else{
    	//群聊
        info = this.cache.getTeamById(account)
        this.$intoGroup && this.$intoGroup.removeClass('hide')
        this.$teamInfo && this.$teamInfo.removeClass('hide')
        if(info){
            if(info.avatar){
                this.$chatTitle.find('img').attr('src', info.avatar+"?imageView&thumbnail=80x80&quality=85") 
            }else{
                this.$chatTitle.find('img').attr('src', "images/" + info.type + ".png") 
            }
            this.$nickName.text(info.name) 
        }else{
            // this.$rightPanel.find(".u-chat-notice").removeClass("hide")
            // this.$rightPanel.find(".chat-mask").removeClass("hide")
            // this.$leftPanel.find(".u-chat-notice").removeClass("hide")
            // this.$leftPanel.find(".chat-mask").removeClass("hide")
            this.$chatTitle.find('img').attr('src', "images/normal.png") 
            this.$nickName.text(account) 
        }
        this.crtSessionTeamType = info? info.type : "normal"   
    }
    this.doPoint()
    // 根据或取聊天记录
    this.getHistoryMsgs(scene,account)

    }.bind(this));
}
 /**
 * 切换左边面板上方tab
 */
YX.fn.switchPanel = function (evt) {
    var node
    // if(evt.target.tagName.toLowerCase() === ('span'||'input')){
    //     node = evt.target.parentNode
    // } else {
    //     node = evt.target
    // }
    node = evt.target.parentNode
    $('.panel_tab').removeClass('cur')
    $(node).addClass('cur')
    var type = $(node).data('type')
    $('.item[data-type="' + type + '"]').removeClass('hide').siblings('.item').addClass('hide')
    if (type === 'sessions') {
        this.clearSearchResult()
        this.buildSessions()
    } else if (type === 'friends') {
        this.clearSearchResult()
        this.buildFriends()
    } else if (type === 'results') {
        // this.buildFriends()
    }else {
        this.clearSearchResult()
        this.buildTeams()
    }
}

YX.fn.clearSearchResult = function () {
    this.$searchInput.val("")
    this.$resultList.html('<p>暂时还没有群哦</p>');

}
/**
 * 导航圆点显示
 */

YX.fn.pointCkicked= function () {
    // this.$chatVernier.fadeOut(10);
    // //隐藏其他窗口
    // $('#teamInfoContainer') && $('#teamInfoContainer').addClass('hide')
    // this.$devices && this.$devices.addClass('hide')
    // this.$cloudMsgContainer && this.$cloudMsgContainer.addClass('hide')
    // //
    // this.$rightPanel.fadeOut(10,function () {
    //     this.$leftPanel.animate({left:'720'}, function(){
    //         var $container
    //         if(!this.$sessionsWrap.is('.hide')){
    //             $container = this.$sessionsWrap
    //         }else if(!this.$friendsWrap.is('.hide')){
    //             $container = this.$friendsWrap
    //         }else{
    //             $container = this.$teamsWrap
    //         }
    //         var $li = $container.find(".m-panel li")
    //         $li.removeClass("active")
    //         this.crtSession = ""
    //         this.crtSessionType = ""
    //         this.crtSessionAccount = ""
    //         this.mysdk.reSetCurrSession()
    //         this.iframeWidth= IFrameResize(283, 0).width
    //         }.bind(this)
    //     );
    // }.bind(this));
    // this.$leftPanel.removeClass("left-float");
    // this.$rightPanel.addClass("hide");
    // this.$chatVernier.addClass("hide");
}

YX.fn.doPoint = function () {
    var $container
    var that = this
    if(!this.$sessionsWrap.is('.hide')){
        $container = this.$sessionsWrap
    }else if(!this.$friendsWrap.is('.hide')){
        $container = this.$friendsWrap
    }else{
        $container = this.$teamsWrap
    }
    var $li = $container.find(".m-panel li")
    var $active = $li.map(function(){
        $(this).removeClass("active")
        if($(this).attr('data-account')==that.crtSessionAccount){
            $(this).addClass("active")
            return this
        }})
    // if ($active.length) {
    //     var top = $active.offset().top - $container.offset().top + 60
    //     this.$chatVernier.css('top', top).removeClass("hide")
    // }else{
    //     this.$chatVernier.addClass("hide")
    // }
}
//获取好友备注名或者昵称
YX.fn.getNick = function (account) {
    // 使用util中的工具方法
    return getNick(account, this.cache)
}

/**
 * 列表想内容提供方法（用于ui组件）
 * @param  {Object} data 数据
 * @param  {String} type 类型
 * @return {Object} info 需要呈现的数据
 */
YX.fn.infoProvider = function(data,type){
    var info = {}
    switch(type){
        case "session":   
            var msg = data.lastMsg
            if(!msg){
                return;
            }
            var scene = msg.scene
            info.scene = scene
            info.account = msg.target
            info.target = msg.scene+"-"+msg.target
            info.time =  transTime2(msg.time)
            info.crtSession = this.crtSession
            info.unread = data.unread>99?"99+":data.unread
            info.text = buildSessionMsg(msg)
            if(scene==="p2p"){
                //点对点
                if(msg.target === userUID){
                    info.nick = "我的手机"
                    info.avatar = "images/myPhone.png"
                }else{
                    // var userInfo = this.cache.getUserById(msg.target)
                    // info.nick = this.getNick(msg.target)
                    //info.avatar = getAvatar(userInfo.avatar)
                    var userInfo = this.cache.getUserFromId(msg.target)
                    info.nick = userInfo.workNick
                    if(userInfo.userIcon){
                        info.avatar = userInfo.userIcon
                    }else{
                        info.avatar = "images/default-icon.png"
                    }
                }

            }else{
                //群组
                var teamInfo = this.cache.getTeamById(msg.target)
                if(teamInfo){
                    info.nick = teamInfo.name
                    if(teamInfo.avatar){
                        info.avatar = teamInfo.avatar+"?imageView&thumbnail=40x40&quality=85"
                    }else{
                        info.avatar = "images/"+teamInfo.type+".png"
                    }
                }else{
                    info.nick = msg.target
                    info.avatar = "images/normal.png"
                }   
            }
        break
        case "friend":
            // info.target = "p2p-"+data.account
            // info.account = data.account
            // info.nick = this.getNick(info.account)
            // info.avatar = getAvatar(data.avatar)
            // info.crtSession = this.crtSession

            info.target = "p2p-"+data.id
            info.account = data.id
            info.nick = data.workNick
            info.avatar = data.userIcon
            info.crtSession = this.crtSession

        break
        case "team":
            info.type = data.type
            info.nick = data.name
            info.target = "team-"+data.teamId
            info.teamId = data.teamId
            if(data.avatar){
                info.avatar = data.avatar+"?imageView&thumbnail=40x40&quality=85"
            }else{
                info.avatar = info.type==="normal"?"images/normal.png":"images/advanced.png"
            }
            info.crtSession = this.crtSession  
        break
    }
    return info
}
/*
* 显示/隐藏
* */

YX.fn.bodyHiddenEvt = function () {
    this.$bodyHidden = $('#bodyHidden')
    this.$bodyHidden.on('click', this.setBodyHidden.bind(this))
    // this.setBodyHidden()
}

// $.fn.toggle = function( fn, fn2 ) {
//     var args = arguments,guid = fn.guid || $.guid++,i=0,
//         toggle = function( event ) {
//             var lastToggle = ( $._data( this, "lastToggle" + fn.guid ) || 0 ) % i;
//             $._data( this, "lastToggle" + fn.guid, lastToggle + 1 );
//             event.preventDefault();
//             return args[ lastToggle ].apply( this, arguments ) || false;
//         };
//     toggle.guid = guid;
//     while ( i < args.length ) {
//         args[ i++ ].guid = guid;
//     }
//     return this.click( toggle );
// };

YX.fn.setBodyHidden = function () {
    this.$bodyIM = $('#bodyIM')
    this.$bodyIM.toggle(300);
    if(this.isBodyShow){
        //隐藏其他窗口
        $('#teamInfoContainer') && $('#teamInfoContainer').addClass('hide')
        this.$devices && this.$devices.addClass('hide')
        this.$cloudMsgContainer && this.$cloudMsgContainer.addClass('hide')
        //
        this.isBodyShow= false;
        // this.$rightPanel.fadeOut(200)
        // this.$chatVernier.fadeOut(200)
        var $container
        if (!this.$sessionsWrap.is('.hide')) {
            $container = this.$sessionsWrap
        } else if (!this.$friendsWrap.is('.hide')) {
            $container = this.$friendsWrap
        } else {
            $container = this.$teamsWrap
        }
        var $li = $container.find(".m-panel li")
        $li.removeClass("active")
        this.crtSession = ""
        this.crtSessionType = ""
        this.crtSessionAccount = ""
        this.mysdk.reSetCurrSession()
        // this.pointCkicked();
        this.$leftPanel.animate({left:'1000'}, function(){
           this.iframeWidth= IFrameResize(50, 0).width;
        }.bind(this));
    }
    else{
        this.isBodyShow= true;
        // if(this.$rightPanel.is(":hidden")){
        //     this.iframeWidth= IFrameResize(283, 0).width;
        //     this.$leftPanel.animate({left:'720'});
        // }
        // else{
        //     this.iframeWidth= IFrameResize(1000, 0).width;
        //     this.$leftPanel.animate({left:'5'});
        //     this.$chatVernier.fadeIn("slow")
        // }

    }
}
/**********************************
 * 登出
 **********************************/
YX.fn.logoutEvt = function () {
	this.$logout = $('#logout')
	this.$logoutDialog = $('#logoutDialog')
  	this.$logout.on('click', this.showLogoutDialog.bind(this))
    this.$logoutDialog.delegate('.j-close', 'click', this.hideLogoutDialog.bind(this))
    this.$logoutDialog.delegate('.j-ok', 'click', this.doLogout.bind(this))
}

YX.fn.doLogout = function () {
    delCookie('uid')
    delCookie('sdktoken')
    window.location.href = './index.html'
}

YX.fn.showLogoutDialog = function () {
    this.$logoutDialog.removeClass('hide')
    this.$mask.removeClass('hide')
}

YX.fn.hideLogoutDialog = function () {
	this.$logoutDialog.addClass('hide')
	this.$mask.addClass('hide')
}
/**********************************************
 * 多端登录管理      
 ********************************************/
 YX.fn.multiportEvt = function () {
    this.$devices = $("#devices")
    // 踢人 0：移动端 1：pc端
    $("#devices .mobile").on('click', function () {
        this.mysdk.kick(0)
    }.bind(this))
    $("#devices .pc").on('click', function () {
        this.mysdk.kick(1)
    }.bind(this))
    $("#backBtn2").on('click',this.hideDevices.bind(this))
    $(".m-devices").on('click',this.showDevices.bind(this))
 }
 //SDK回调
 YX.fn.loginPorts = function(devices){
    var pc,mobile
    for (var i = devices.length - 1; i >= 0; i--) {
        if(/iOS|Android|WindowsPhone/i.test(devices[i].type)){
            mobile=devices[i]
        }else if(/PC/i.test(devices[i].type)){
            pc = devices[i]
        }
    }
    if((pc&&pc.online)||(mobile&&mobile.online)){
        if((pc&&pc.online)&&(mobile&&mobile.online)){
            $(".m-devices").html("正在使用云信手机版，电脑版")
            $("#devices .pc").removeClass("hide")
            $("#devices .mobile").removeClass("hide")
            this.mysdk.mobileDeviceId = mobile.deviceId
            this.mysdk.pcDeviceId = pc.deviceId
        }else if(pc&&pc.online){
            $(".m-devices").html("正在使用云信电脑版")
            $("#devices .pc").removeClass("hide")
            $("#devices .mobile").addClass("hide")
            this.mysdk.mobileDeviceId = false
            this.mysdk.pcDeviceId = pc.deviceId
        }else{
            $(".m-devices").html("正在使用云信手机版")
            $("#devices .mobile").removeClass("hide")
            $("#devices .pc").addClass("hide")
            this.mysdk.mobileDeviceId = mobile.deviceId
            this.mysdk.pcDeviceId = false
        }
        $(".m-devices").removeClass("hide")
        $("#left-panel .item").height(463)
        //$("#right-panel .item").height(463)
        $("#chatVernier").css({marginTop:'41px'})
    }else{
        $(".m-devices").addClass("hide")
        $("#devices").addClass("hide")
        $("#devices .pc").addClass("hide")
        $("#devices .mobile").addClass("hide")
        this.mysdk.mobileDeviceId = false
        this.mysdk.pcDeviceId = false
        $("#left-panel .item").height(504)
        //$("#right-panel .item").height(504)
        $("#chatVernier").css({marginTop:'0'})
    }
},

/**
 * 多端登录面板UI
 */
YX.fn.showDevices = function(){
    this.$devices.removeClass("hide")    
}
YX.fn.hideDevices = function(){
    this.$devices.addClass("hide")
}
/**
 * 语音播放
 */
YX.fn.playAudio = function(){
    if(!!window.Audio){
        var node = $(this),
            btn = $(this).children(".j-play")
        node.addClass("play")
        setTimeout(function(){node.removeClass("play");},parseInt(btn.attr("data-dur")))
        new window.Audio(btn.attr("data-src")+"?audioTrans&type=mp3").play()
    }
}