/**
 * Created by zyy-mac on 2016/12/27.
 */
YX.fn.search = function () {
    this.$searchInput = $('#searchInput')
    this.$searchInput.on('focus input', this.onSearchInputChanged.bind(this))
    this.$resultList = $('#searchResult')
    this.addResultEvent()
}

YX.fn.onSearchInputChanged = function (e) {
    switch(e.type)
    {
        case "input":
            var c = this.$searchInput.val()
            var result = this.cache.getSearchTeamList(c)
            this.updateSearchList(result)
            // var data = {
            //     searchs:this.cache.getSearchTeamList(this.$searchInput.val())
            // }
            // if(!this.searchs){
            //     var options = {
            //         data:data,
            //         infoprovider:this.infoProvider.bind(this),
            //         onclickavatar:this.clickTeamAvatar.bind(this),
            //         onclickitem:this.openChatBox.bind(this)
            //
            //     }
            //     this.searchs = new NIMUIKit.TeamList(options)
            //     this.searchs.inject($('#teams').get(0))
            // }else{
            //     this.searchs.update(data)
            // }
            break;
        default:
    }
}

YX.fn.addResultEvent = function(){
    var that = this,
        cbClickList = this.clickTeamAvatar.bind(this)||function(account,type){console.log('account:'+account+'---type:'+type);},
        cbClickPortrait = this.openChatBox.bind(this)||function(account,type){console.log('account:'+account+'---type:'+type);};

    this.$resultList.on('click',function(e){
        var self = this,
            evt = e||window.event,
            account,
            type,
            target = evt.srcElement||evt.target;
        while(self!==target) {
            if (target.tagName.toLowerCase() === "img") {
                var item = target.parentNode.parentNode;
                account = item.getAttribute("data-account");
                type = item.getAttribute("data-type");
                cbClickPortrait(account, type);
                return;
            } else if (target.tagName.toLowerCase() === "li") {
                account = target.getAttribute("data-account");
                type = target.getAttribute("data-type");
                cbClickList(account, type);
                return;
            }
            target = target.parentNode
        }
    });
};

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
            html = '<p>搜索结果</p>';
        }
    } else {
        html = '<p>搜索结果</p>';
    }
    this.$resultList.html(html);
}


YX.fn.beginChat = function(){
    var account = $.trim(this.$addFriendBox.find(".j-account").val().toLowerCase())
    this.hideAddFriend()
    this.openChatBox(account,"p2p")
}