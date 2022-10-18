          
function loadClient() {
    //vit AIzaSyBXnqwmXZGJqhICbb-kMmBfQNL7InWve7I
    //personal AIzaSyCeFBXxvNWBLjPhqhfuER6r4SrQ0lBMAvk
    gapi.client.setApiKey("AIzaSyBXnqwmXZGJqhICbb-kMmBfQNL7InWve7I");
    return gapi.client.load("https://content.googleapis.com/discovery/v1/apis/customsearch/v1/rest")
        .then(function() { console.log("GAPI client loaded for API"); },
            function(err) { console.error("Error loading GAPI client for API", err); });
}

gapi.load("client");
