var elasticsearch = require('elasticsearch'); // import ES JS client library
var escapeHtml = require('./escape')

var client = new elasticsearch.Client({ // define the location of out elasticsearch instance
    host: 'localhost:9200'
});

function createPost(req) {
    var postText = escapeHtml(req.body.text);
    var imglink = escapeHtml(req.body.link);
    var infolink = escapeHtml(req.body.infolink);
    var title = escapeHtml(req.body.title);
    var eventdate = new Date(req.body.eventdate);
    console.log(eventdate);
    var user = req.user.nickname;
    var date = new Date();
    var post = {
        user: user,
        timestamp: date,
        text: postText,
        length: postText.length,
        imglink : imglink,
        infolink : infolink,
        title: title,
        eventdate: eventdate
    }
    return post;
}

function savePost(post) {
    client.index({
        index: 'tryit1',
        type: 'posts',
        body: post
    }, function(err, res) {
        if (err) {
            console.error(err);
            return 500;
        } else {
            console.log("Successfully inserted chirp!");
            return 200;
        }
    });
}

function getRecentPosts(callback) {
    client.search({
        index: 'tryit1',
        type: 'posts',
        sort: 'eventdate:asc',
        size: 10
    }, function(err, res) {
        if (err) console.error(err);
        else {
            var posts = [];
            var data = res.hits.hits;
            for (var i in data) {
                var eventdate = data[i]._source.eventdate;
                if(data[i]._source.eventdate == null){
                    eventdate = '';
                } else{
                    eventdate = data[i]._source.eventdate.substring(0,10);
                    var curr = new Date().toISOString().split('T')[0];
                    if (curr > eventdate){
                        //cleanup(data[i]._source.id);
                        continue;
                    }
                }
                
                if(eventdate == '') continue;
                if(data[i]._source.text == "hello world!") continue;
                
                posts.push({
                    text: data[i]._source.text,
                    user: data[i]._source.user,
                    timestamp: data[i]._source.timestamp.substring(0,10),
                    length: data[i]._source.length,
                    imglink: data[i]._source.imglink,
                    infolink: data[i]._source.infolink,
                    title: data[i]._source.title,
                    eventdate: eventdate
                })
            }
            callback(err, posts);
        }
    });
}

function getPaginatedRecentPosts(page, callback) {
    client.search({
        index: 'tryit1',
        type: 'posts',
        sort: 'eventdate:asc',
        from: page * 10,
        size: 10
    }, function(err, res) {
        if (err) console.error(err);
        else {
            var posts = [];
            var data = res.hits.hits;
            for (var i in data) {
                var eventdate = data[i]._source.eventdate;
                if(data[i]._source.eventdate == null){
                    eventdate = '';
                } else{
                    eventdate = data[i]._source.eventdate.substring(0,10);
                    var curr = new Date().toISOString().split('T')[0];
                    if (curr > eventdate){
                        //cleanup(data[i]._source.id);
                        continue;
                    }
                }
                
                posts.push({
                    text: data[i]._source.text,
                    user: data[i]._source.user,
                    timestamp: data[i]._source.timestamp.substring(0,10),
                    length: data[i]._source.length,
                    imglink: data[i]._source.imglink,
                    infolink: data[i]._source.infolink,
                    title: data[i]._source.title,
                    eventdate: eventdate
                });
            }
            callback(err, posts);
        }
    });
}

function initESIndex() {
    client.search({
        index: 'tryit1',
        type: 'posts',
        sort: 'timestamp:desc'
    }, function(err, res) {
        if (err) {
            client.index({
                index: 'tryit1',
                type: 'posts',
                body: {
                    text: 'hello world!',
                    timestamp: new Date(),
                    user: 'tysonbulmer',
                    length: 10,
                    imglink: '',
                    infolink: '',
                    title: '',
                    eventdate: '2016-03-13T03:45:52.727Z'
                }
            }, function(err, res) {
                if (err) {
                    console.error(err);
                    return 500;
                } else {
                    console.log("Successfully inserted post");
                    return 200;
                }
            })
        }
    });
}

module.exports = {
    createPost: createPost,
    savePost: savePost,
    getRecentPosts: getRecentPosts,
    //getUserChirps: getUserChirps,
    initESIndex: initESIndex,
    getPaginatedRecentPosts: getPaginatedRecentPosts
}