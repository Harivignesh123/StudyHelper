          
function loadClient() {
    gapi.client.setApiKey("AIzaSyCeFBXxvNWBLjPhqhfuER6r4SrQ0lBMAvk");
    return gapi.client.load("https://content.googleapis.com/discovery/v1/apis/customsearch/v1/rest")
        .then(function() { console.log("GAPI client loaded for API"); },
            function(err) { console.error("Error loading GAPI client for API", err); });
}

function execute() {
    return gapi.client.search.cse.list({
    "cx": "e46634678bec7495c",
    "exactTerms": "Microprocessor"
    })
        .then(function(response) {
          response.result.items.forEach(item => {
              console.log(item.link+"\n");
          });

            },
            function(err) { console.error("Execute error", err); });
}
gapi.load("client");
         
