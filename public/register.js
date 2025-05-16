$(document).ready(function () {
    console.log(document.getElementById("passInput"))
    $("#passInput").keyup(function () { 
        $(this).removeClass("pass-not-same");
        console.log(document.getElementById("passInput"))
    });
})
