var CONST_STORAGE_USERNAME = "__STORAGE_USERNAME__";
var CONST_STORAGE_PASSWORD = "__STORAGE_PASSWORD__";
var CONST_STORAGE_USER_LIST = "__STORAGE_USER_LIST__";

var server = "http://localhost:8080/"
var loginUrl = server +"login";


chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    console.log("back  onRequest...",request.values);
    if (request.method == "setLocalStorage"){
        var values = request.values;
        localStorage.setItem(CONST_STORAGE_USERNAME,values.username);
        localStorage.setItem(CONST_STORAGE_PASSWORD,values.password);
        $.ajax({
            url:loginUrl,
            data:{
                username:values.username,
                password:values.password
            },
            success:function(data){
                  if(data.success){
                      localStorage.setItem(CONST_STORAGE_USER_LIST, data.users);
                  }
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


console.log("backbround init-------");


//查询分享信息

var queryUrl = "http://www.baidu.com";
var queryInterval = 3000;


~(function queryShares(){
    console.log("query shares ... ...")
    $.ajax({
        url:queryUrl,
        success:function(data){

        },
        complete:function(){
            setTimeout(queryShares,queryInterval);
        }
    })
})()

