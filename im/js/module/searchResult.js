/**
 * Created by zyy-mac on 2016/12/27.
 */


YX.fn.beginChat = function(){
    var account = $.trim(this.$addFriendBox.find(".j-account").val().toLowerCase())
    this.hideAddFriend()
    this.openChatBox(account,"p2p")
}