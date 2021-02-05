var http = require("http"); //need to http
var url = require("url"); //to parse url strings

var ROOT_DIR = "main"; //dir to serve static files from

var ecStatic = require('ecstatic');
var server = http.createServer(ecStatic({root: ROOT_DIR}));

http.createServer(function(request, response) {
  
    var urlObj = url.parse(request.url, true, false);
    console.log("\n============================");
    console.log("PATHNAME: " + urlObj.pathname);
    console.log("REQUEST: " + ROOT_DIR + urlObj.pathname);
    console.log("METHOD: " + request.method);

    var receivedData = "";

    //attached event handlers to collect the message data
    request.on("data", function(chunk) {
      receivedData += chunk;
    });

    //event handler for the end of the message
    request.on("end", function() {
      console.log("REQUEST END: ");
      console.log("received data: ", receivedData);
      console.log("type: ", typeof receivedData);

      if (request.method == "POST") {




        // var dataObj = JSON.parse(receivedData);
        // if (dataObj.type == "word" || dataObj.type == "rectangle") {
          
        // }
        //echo back the location of the moving box to who ever
        //sent the POST message
        response.writeHead(200);
      }

      if (request.method == "GET") {

      }
    });
  });

server.listen(3000);

console.log("Server Running at http://127.0.0.1:3000  CNTL-C to quit");

<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>main</title>
</head>
<!-- AIzaSyBsyk9s0Talgl_jtsNozvJ_5D3VyddoZjk -->
<!-- AIzaSyBL8Pyf9tPLbcmkjQRLK8VvIHc-JcHOILA -->

<script src="https://apis.google.com/js/api.js"></script>
<script>
  /**
   * Sample JavaScript code for search.cse.list
   * See instructions for running APIs Explorer code samples locally:
   * https://developers.google.com/explorer-help/guides/code_samples#javascript
   */

  function loadClient() {
    gapi.client.setApiKey("AIzaSyBL8Pyf9tPLbcmkjQRLK8VvIHc-JcHOILA");
    return gapi.client.load("https://content.googleapis.com/discovery/v1/apis/customsearch/v1/rest")
        .then(function() { console.log("GAPI client loaded for API"); },
              function(err) { console.error("Error loading GAPI client for API", err); });
  }
  // Make sure the client is loaded before calling this method.
  function execute() {
    return gapi.client.search.cse.list({
      "cx": "584310571ba15f0ef",
      "q": "computer"
    })
        .then(function(response) {
                // Handle the results here (response.result has the parsed body).
                console.log("Response", response);
              },
              function(err) { console.error("Execute error", err); });
  }
  gapi.load("client", loadClient);
</script>


<body>
<button onclick="loadClient()">load</button>
<button onclick="execute()">execute</button>


<!-- <div id="content"></div>
    <script>
      function hndlr(response) {
      for (var i = 0; i < response.items.length; i++) {
        var item = response.items[i];
        // in production code, item.htmlTitle should have the HTML entities escaped.
        document.getElementById("content").innerHTML += "<br>" + item.htmlTitle;
      }
    }
    </script>
    <script src="https://www.googleapis.com/customsearch/v1?key=AIzaSyBL8Pyf9tPLbcmkjQRLK8VvIHc-JcHOILA&cx=017576662512468239146:omuauf_lfve&q=cars&callback=hndlr">
    </script> -->

</body>
</html>

