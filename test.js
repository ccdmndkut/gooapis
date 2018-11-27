
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const async = require('async');
const Promise = require('promise');
const uuid = require('uuid');
const SCOPES = ['https://www.googleapis.com/auth/datastore'];
const ProgressBar = require('progress');
const TOKEN_PATH = 'token.json';
console.log();
const bar = new ProgressBar('  downloading [:bar] :rate/bps :percent :etas', {
  complete: '=',
  incomplete: ' ',
  width: 20,
  total: 100
});
fs.readFile('fs.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  authorize(JSON.parse(content), listFiles);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.web;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    // access_type: 'online',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}
var listFiles = function(auth) {
    console.log(auth)
}
/**
 * Lists the names and IDs of up to 10 files.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
// var fileIds = [];
// var listFiles = function(auth) {
//   const drive = google.drive({version: 'v3', auth});
//   drive.files.list({
//     pageSize: 99,
//     q: "mimeType = 'application/vnd.google-apps.folder'",
//     fields: 'nextPageToken, files(id)',
//   }, (err, res) => {
//     if (err) return console.log('The API returned an error: ' + err);
//     const files = res.data.files;
//     if (files.length) {
//       files.map((file) => {
//         fileIds.push(file)
//         // console.log(file.id);
//         // var fileId = file.id;
//         // drive.files.delete({fileId: fileId})
//       });

  
// console.log(fileIds)
// // trial(auth)
//     } else {
//       console.log('No files found.');
//     }
//   });
// }
// var trial = function(auth) {
//   async.eachSeries(fileIds, function (fileId, myidsCallback) {
//   const drive = google.drive({version: 'v3', auth});

//     drive.files.delete({
//       fileId: fileId.id,
//     }, function (err, res) {
//       if (err) {
//         // Handle error...
//         console.error(err);
//         myidsCallback(err);
//       } else {
//         console.clear()
// var b = b++
//         var l = fileIds.length - 1;
//         var i = fileIds.indexOf(fileId);
//         var ia = parseInt(i, 10);
//         var calcu = (100 - (l - i)) / 1;
// bar.tick(b);

//         // console.clear()
//         // console.log(calcu+"%")
//         myidsCallback();
//       }
//     });
//   }, function (err) {
//     if (err) {
//       // Handle error
//       console.error(err);
//     } else {

//       console.log(fileIds)
//       // All permissions inserted
//     }
//   });

// }  
// [END drive_quickstart]
