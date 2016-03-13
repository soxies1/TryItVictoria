var postInput = document.getElementById('postarea');
var postSubmit = document.getElementById('post-btn');
var imglink = document.getElementById('postimglink');
var infolinkel = document.getElementById('infolink');
var titleel = document.getElementById('title');
var eventdateel = document.getElementById('eventdateid');
var namehelp = document.getElementById('namehelp');
var datehelp = document.getElementById('datehelp');
var postholder = document.getElementById('postholder');
var morebtn = document.getElementById('loadmoreposts');

var currentPage = 1;




postSubmit.onclick = function() {
    var text = postInput.value;
    var link = imglink.value;
    var infolink = properlink(infolinkel.value);
    var eventdate = eventdateel.value;
    var title = titleel.value;
    if (title == '' || title == "undefined"){
        namehelp.innerHTML = "Must provide a title!";
        return;
    }
    if(eventdate == '' || eventdate == "undefined"){
        datehelp.innerHTML = "Must provide event date!";
        return;
    }
    var curr = new Date().toISOString().split('T')[0];
    if (curr > eventdate){
        datehelp.innerHTML = "Date must be after current date!";
        return;
    }
    console.log(text.length);
    var data = {text: text,
                title : title, 
                link: link,
                infolink: infolink,
                eventdate:eventdate
                }
    $.post("/newpost", data);/*.success(function(){
        alert('Successfully added post!');
    });*/
        /*.fail(function() {
            alert('failed to post! Are you logged in?')
        })*/

    postInput.value = '';
    imglink.value = '';
    infolinkel.value = '';
    titleel.value = '';
    eventdateel.value = '2016-03-12';
}

morebtn.onclick = function() {
    $.get('/more/' + currentPage)
    .success(function(data) {
            var posts = data.posts;
            for (var i in posts) {
                postholder.innerHTML += createPostHtml(posts[i]);
            }
            currentPage += 1;
        });
}



function createPostHtml(post) {
    var htmlstring = '<div class="post-preview">';
    if(post.imglink == '' || post.imglink == "undefined"){
        htmlstring += '<img class="thumb" src="img/fill.jpg">';
    }else{
        htmlstring += "<img class=\"thumb\" src='" + post.imglink + "'>";
    }
    if(post.infolink == '' || post.infolink == "undefined"){
        
    }else{
        htmlstring += "<a  href='" + post.infolink +"' target=\"_blank\">";
    }
    
    htmlstring += "<h5 class=\"post-title\">" + post.title + "</h5> <span class=\"date\">"+ post.eventdate + "</span>";
    htmlstring += "<p class=\"post-subtitle\">" + post.text + "</p>";
    
    if(post.infolink == '' || post.infolink == "undefined"){
        
    }else{
        htmlstring += "</a";
    }
    
    htmlstring += "<p class=\"post-meta\">" + post.user + " " + post.timestamp.substring(0,10) + "</p></div><hr>";
    
    return htmlstring;
}

function properlink( link ){
    var res = link.match(/http:\/\//g);
    if (res == null){
        return 'http://' + link;
    }
     res = link.match(/https:\/\//g);
     if(res == null){
         return 'http://' + link;
     }
     return link;
}