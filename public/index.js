import recognizeFile from 'watson-speech/speech-to-text/recognize-file';
// import AuthorizationV1 from 'watson-developer-cloud/authorization/v1';
// import IamTokenManagerV1 from 'watson-developer-cloud/iam-token-manager/v1';

console.log('we live');
fetchToken(() => {
    return fetch('/token')
        .then((data) => {
            return data.json();
        })
        .then((token) => {
            console.log('token', token);
            const params = {
              url: 'https://stream.watsonplatform.net/speech-to-text/api',
              file: __dirname + req.file.path,
              access_token: apiAuth,
              token: token,
              smart_formatting: true,
              format: true,
              model: 'en-US_BroadbandModel',
              objectMode: true,
              interim_results: true,
              word_alternatives_threshold: 0.01,
              timestamps: true,
            // outputElement: fs.createWriteStream(req.file.path).pipe(fs.writeFile('/uploads'))
            }
            var recognizeStream = recognizeFile(params)
              // Listen for events.
            recognizeStream.on('data', function(event) { 
                onEvent('Data:', event); 
            });
            
            recognizeStream.on('error', function(event) { onEvent('Error:', event); });
            
            recognizeStream.on('close', function(event) { onEvent('Close:', event); });
            return res.send('we are live');
            // Display events on the console.
            function onEvent(name, event) {
                console.log('name', name);
                //event = JSON.parse(event)
                console.log('event', event);
      };
    })
})
fetchToken();
