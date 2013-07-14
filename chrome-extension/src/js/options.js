// 将该脚本保存为“options.js”
// 将选项保存至 localStorage.
var CONST_STORAGE_USERNAME = "__STORAGE_USERNAME__";
var CONST_STORAGE_PASSWORD = "__STORAGE_PASSWORD__";
function save_options() {
    localStorage.setItem(CONST_STORAGE_USERNAME, $("#username").val());
    localStorage.setItem(CONST_STORAGE_PASSWORD, $("#password").val());
    $("#info").html("保存成功.").show();
    chrome.extension.sendRequest({method: "setLocalStorage", values: {
        username: localStorage.getItem(CONST_STORAGE_USERNAME),
        password: localStorage.getItem(CONST_STORAGE_PASSWORD)
    }});
}

// 从保存在 localStorage 中的值恢复选定的内容。
function restore_options() {

    $("#username").val(localStorage.getItem(CONST_STORAGE_USERNAME));
    $("#password").val(localStorage.getItem(CONST_STORAGE_PASSWORD));

}
$(function () {
    restore_options();
    $("#save").click(save_options);
})

