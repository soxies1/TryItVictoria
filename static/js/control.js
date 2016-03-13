var postInput = document.getElementById('postarea');
var postSubmit = document.getElementById('post-btn');
var imglink = document.getElementById('postimglink');
var infolinkel = document.getElementById('infolink');

postSubmit.onclick = function() {
    var text = postInput.value;
    var link = imglink.value;
    var infolink = infolinkel.value;
    console.log(text.length);
    var data = {text: text,
                link: link,
                infolink: infolink
                }
    $.post("/newpost", data);/*.success(function(){
        alert('Successfully added post!');
    });*/
        /*.fail(function() {
            alert('failed to post! Are you logged in?')
        })*/

    postInput.value = '';
    imglink.value = '';
    infolink.value = '';
}