var CONST_STORAGE_USERNAME = "__STORAGE_USERNAME__";
var CONST_STORAGE_PASSWORD = "__STORAGE_PASSWORD__";
var CONST_STORAGE_USER_LIST = "__STORAGE_USER_LIST__";

var server = "http://127.0.0.1:5000/"
var loginUrl = server +"login/";

/**
 * 获取用户列表
 * @return {*}
 */


function getUsers(){
    var users = JSON.parse(localStorage.getItem(CONST_STORAGE_USER_LIST));
    return users;
}

function getCurrentUserName(){
    return localStorage.getItem(CONST_STORAGE_USERNAME);
}


chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    console.log("back  onRequest...",request.values);
    if (request.method == "setLocalStorage"){
        var values = request.values;
        localStorage.setItem(CONST_STORAGE_USERNAME,values.username);
        localStorage.setItem(CONST_STORAGE_PASSWORD,values.password);
        $.ajax({
            url:loginUrl,
            type:"POST",
            data:{
                username:values.username,
                password:values.password
            },
            success:function(data){

                  var users = [];

                  if(data.success){
                       for(var i = 0 ; i < data.f_ids.length;i++){
                           var u = {
                               id:data.f_ids[i],
                               username:data.f_names[i]
                           }
                           users.push(u);
                       }

                  }
                  localStorage.setItem(CONST_STORAGE_USER_LIST, JSON.stringify(users));
                console.log(getUsers())

            },
            error:function(){
                console.log("error")
                var users = [{
                    id:1,
                    username:"Liangdi"
                },{
                    id:2,
                    username:"郑老师"
                }]
                localStorage.setItem(CONST_STORAGE_USER_LIST,  JSON.stringify(users));
                console.log(getUsers());
            }
        })

    }

});

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if (request.method == "getOptions"){
        if(sendResponse){
            var username = localStorage.getItem(CONST_STORAGE_USERNAME);
            var password = localStorage.getItem(CONST_STORAGE_PASSWORD);
            sendResponse({
                username:username,
                password:password
            });
        }
        
    }
    
});

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if (request.method == "getUsers"){

        if(sendResponse){
            var username = localStorage.getItem(CONST_STORAGE_USERNAME);
            var password = localStorage.getItem(CONST_STORAGE_PASSWORD);
            var users = localStorage.getItem(CONST_STORAGE_USER_LIST);
           sendResponse({username:username,password:password,users:users})
        }
    }
});


chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if (request.method == "reloadFriends"){
        reloadUsers()
    }
});



console.log("backbround init-------");


//查询分享信息

var queryUrl = server + "read_sharing/";
var queryInterval = 5000;


~(function queryShares(){
    console.log("query shares ... ...")
    $.ajax({
        url:queryUrl,
        success:function(data){
             console.log(data)
             if(data.success){
                  if(data.num_iids && data.num_iids.length){
                     notfy("您有新的商品分享,请查看!");
                  }
             }
        },
        complete:function(){
            //notfy("分享查询中...")
            setTimeout(queryShares,queryInterval);
        }
    })
})()

function notfy(msg) {
    var opt = {
        type: "list",
        title: "分享提示",
        message: msg,
        iconUrl: "img/expand.png"
    }
    chrome.notifications.create("share", opt,function(){});
    setTimeout(function(){
        chrome.notifications.clear("share", function callback(){})
    },3000)
}

