// 将该脚本保存为“options.js”
// 将选项保存至 localStorage.
var CONST_STORAGE_EMAIL = "__STORAGE_EMAIL__";
var CONST_STORAGE_API_KEY = "__STORAGE_API_KEY__";
function save_options() {
    localStorage.setItem(CONST_STORAGE_EMAIL, $("#inputEmail").val());
    localStorage.setItem(CONST_STORAGE_API_KEY, $("#apiKey").val());
    $("#info").html("保存成功.").show();
    chrome.extension.sendRequest({method: "setLocalStorage", values: {
        email: localStorage.getItem(CONST_STORAGE_EMAIL),
        apiKey: localStorage.getItem(CONST_STORAGE_API_KEY)
    }}, function () {
    });
}

// 从保存在 localStorage 中的值恢复选定的内容。
function restore_options() {

    $("#inputEmail").val(localStorage.getItem(CONST_STORAGE_EMAIL));
    $("#apiKey").val(localStorage.getItem(CONST_STORAGE_API_KEY));

}
$(function () {
    restore_options();
    $("#save").click(save_options);
})

