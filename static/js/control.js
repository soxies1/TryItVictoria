var postInput = document.getElementById('postarea');
var postSubmit = document.getElementById('post-btn');

postSubmit.onclick = function() {
    var text = postInput.value;
    console.log(text.length);
    var data = {text: text}
    $.post("/newpost", data)
        .fail(function() {
            alert('failed to post! Are you logged in?')
        })

    postInput.value = '';
}