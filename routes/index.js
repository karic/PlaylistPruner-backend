var express = require('express');
var router = express.Router();
const ytlist = require('youtube-playlist');
var youtubedl = require('@microlink/youtube-dl');
var fs = require('fs');


const url = 'https://www.youtube.com/playlist?list=PL55713C70BA91BD6E';
const urlDownload = '';

/* GET home page. */
router.post('/', function (req, res, next) {
    console.log(req.body.body.url);
    ytlist(req.body.body.url).then(data => {
        console.log(url);
        console.log(data.data.playlist);
        res.send(data.data.playlist);
    });
});

router.post('/download', function (req, res, next) {
    var vids = req.body.body;
    var length = req.body.body.length;
    for (let i = 0; i < length; i++) {
        let video = youtubedl(vids[i].url,
            // Optional arguments passed to youtube-dl.
            ['--format=18'],
            // Additional options can be given for calling `child_process.execFile()`.
            { cwd: __dirname });

        video.on('info', function (info) {
            console.log('Download started');
            console.log('filename: ' + vids[i].name);
            console.log('size: ' + info.size);
            video.pipe(fs.createWriteStream('public/videos/user/' + vids[i].name + '.mp4'));
        });
        vids[i].downloadUrl = 'http://localhost:3000/videos/user/' + vids[i].name + '.mp4';
    }
    res.send(vids);
});

module.exports = router;
