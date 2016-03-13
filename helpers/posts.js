var elasticsearch = require('elasticsearch'); // import ES JS client library
var escapeHtml = require('./escape')

var client = new elasticsearch.Client({ // define the location of out elasticsearch instance
    host: 'localhost:9200'
});

function createPost(req) {
    var postText = escapeHtml(req.body.text);
    var imglink = escapeHtml(req.body.link);
    var infolink = escapeHtml(req.body.infolink);
    var user = req.user.nickname;
    var date = new Date();
    var post = {
        user: user,
        timestamp: date,
        text: postText,
        length: postText.length,
        imglink : imglink,
        infolink : infolink
    }
    return post;
}

function savePost(post) {
    client.index({
        index: 'tryit',
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
        index: 'tryit',
        type: 'posts',
        sort: 'timestamp:desc'
    }, function(err, res) {
        if (err) console.error(err);
        else {
            var posts = [];
            var data = res.hits.hits;
            for (var i in data) {
                posts.push({
                    text: data[i]._source.text,
                    user: data[i]._source.user,
                    timestamp: data[i]._source.timestamp,
                    length: data[i]._source.length,
                    imglink: data[i]._source.imglink,
                    infolink: data[i]._source.infolink
                })
            }
            callback(err, posts);
        }
    });
}

function initESIndex() {
    client.search({
        index: 'tryit',
        type: 'posts',
        sort: 'timestamp:desc'
    }, function(err, res) {
        if (err) {
            client.index({
                index: 'tryit',
                type: 'posts',
                body: {
                    text: 'hello world!',
                    timestamp: new Date(),
                    user: 'tysonbulmer',
                    length: 10,
                    imglink: '',
                    infolink: ''
                }
            }, function(err, res) {
                if (err) {
                    console.error(err);
                    return 500;
                } else {
                    console.log("Successfully inserted chirp!");
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
    initESIndex: initESIndex
    //getPaginatedRecentChirps: getPaginatedRecentChirps
}