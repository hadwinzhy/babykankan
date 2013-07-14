// Copyright (c) 2010 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// A generic onclick callback function.
function genericOnClick(info, tab) {
  console.log("item " + info.menuItemId + " was clicked");
  console.log("info: " + JSON.stringify(info));
  console.log("tab: " + JSON.stringify(tab));
}

function goToSignInPage(info,tab){
    chrome.tabs.create( {'url': chrome.extension.getURL('options.html')});    
}


function setFriendList(){
    console.log("fuck---------",  arguments);
}

// Create one test item for each context type.
var friend_list = getUsers()

console.log("list is " + friend_list);

if ( getCurrentUserName() == null || friend_list == null){
    // first time login
    chrome.contextMenus.create(
        {"title": "BabyKankan: Please Sign In First", 
         "onclick": goToSignInPage}
    );
}else{
    var parent_id = chrome.contextMenus.create({"title": "BabyKankan: Share with your friend",
                                                 "onclick": genericOnClick});
    for (var i = 0; i < friend_list.length; i++) {
        var friend_name = friend_list[i].username;
        var id = chrome.contextMenus.create({"title": friend_name, "parentId": parent_id,
                                             "onclick": genericOnClick});
        console.log("'" + friend_name + "' item:" + id);
    }
    // add "Add New Friend"
    chrome.contextMenus.create({"title": "Add new friend", "parentId": parent_id,
                                             "onclick": genericOnClick});
    
}
