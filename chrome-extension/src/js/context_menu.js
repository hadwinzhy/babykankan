// Copyright (c) 2010 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// A generic onclick callback function.
function shareClick(info, tab) {
    chrome.tabs.getSelected(null,function(tab) {
        var tablink = tab.url;
        var id = tablink.match(/id=(\d+)/)
        console.log(id)

        $.ajax({
            url:server+"share/",
            type:"POST",
            data:{
                to_user_id: "2", 
                num_iid: id[1]
            }
        })
    });
}

function goToSignInPage(info,tab){
    chrome.tabs.create( {'url': chrome.extension.getURL('options.html')});    
}

function addNewUser(info,tab){

}

function reloadUsers(){
    init_context()
}

function init_context(){
    friend_list = getUsers()

    console.log("list is " + friend_list);
    
    if ( getCurrentUserName() == null || friend_list == null){
        // first time login
        chrome.contextMenus.create(
            {"title": "BabyKankan: Please Sign In First", 
             "onclick": goToSignInPage}
        );
    }else{
        var parent_id = chrome.contextMenus.create({"title": "BabyKankan: Share with your friend"});
        for (var i = 0; i < friend_list.length; i++) {
            var friend_name = friend_list[i].username;
            var id = chrome.contextMenus.create({"title": friend_name, "parentId": parent_id,
                                        "onclick": shareClick});
        }
        // add "Add New Friend"
        chrome.contextMenus.create({"title": "Add new friend", "parentId": parent_id,
                                    "onclick": addNewUser});   
    }  
}

// Create one test item for each context type.
friend_list = null
//item_ids = []
init_context()
