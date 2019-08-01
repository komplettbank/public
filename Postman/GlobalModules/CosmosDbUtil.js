/* ================================================================================== */
/*
/*  Executing this request will update a global variable with a function that returns 
/*  an object with Cosmos DB utility-functions. The object can be loaded and used in 
/*  test-scripts, for example like this:
/*
/*      let cosmosUtil = eval(pm.globals.get("module:cosmosUtil"));
/*      let authDetails = cosmosUtil.getAuthDetails(request.url, postman.getEnvironmentVariable("cosmos.masterKey"));
/*
/*  IMPORTANT NOTE:
/*  ---------------------
/*  The master for this file is kept in "\KB.Postman\GlobalModules\LoadCosmosUtil.js"
/*  in the "KB.Shared.Testing" git-repo in the "KBShared" project in Azure DevOps.
/*  Any changes made here must be propagated to the master file!
/*
/* ======================================================= */


function CosmosUtil() {

    let _logVerbose = false;  // verbose logging OFF by default
    let _cosmosUtil = {};

    /* ======================================================= */
    /*
    /*                      Public methods
    /*
    /* ======================================================= */

    /*
        Creates an auth-token than can be used in the Authorization header to authenticate with the CosmosDb Rest API,
        as well as timestamp that can be used in the "x-ms-date"-header. The values are returned in an object, defined
        like this:

        {
            "authToken" : <token>,
            "RFC1123time" : <timestamp>
        }

        Parameters:
            url         = The url to use to build the token (the protocol and domain will be stripped). Required.
            masterKey   = The base64-encoded master key used to generate the token. Required.
            verbose     = Whether to log verbosely. Default is false.

    */
    _cosmosUtil.getAuthDetails = (url, mastKey, verbose) => {

        if (!url) {
            console.error("Missing value for required parameter 'url'");
            return null;
        }

        if (!mastKey) {
            console.error("Missing value for required parameter 'mastKey'");
            return null;
        }
        
        let authDetails = {
            authToken: null,
            RFC1123time: null
        };

        // Whether or not to log verbosely
        _logVerbose = verbose || _logVerbose;

        // store our date as RFC1123 format for the request
        var today = new Date();
        var UTCstring = today.toUTCString();
        authDetails.RFC1123time = UTCstring;

        //Resolve variables in url:
        var regex = /\{\{[\w.-]*\}\}/g;
        vars = url.match(regex);
        vars.map(v => {
            var key = v.replace("{{", "").replace("}}", "");
            var value = postman.getEnvironmentVariable(key);
            _log(`Replacing ${v} with ${value}`)
            url = url.replace(v, value);
        });

        // Strip the url of the hostname up and leading slash
        var strippedurl = url.replace(new RegExp('^https?://[^/]+/'), '/');
        _log("Stripped Url = " + strippedurl);

        // push the parts down into an array so we can determine if the call is on a specific item
        // or if it is on a resource (odd would mean a resource, even would mean an item)
        var strippedparts = strippedurl.split("/");
        var truestrippedcount = strippedparts.length - 1;

        // define resourceId/Type now so we can assign based on the amount of levels
        var resourceId = "";
        var resType = "";

        // its odd (resource request)
        if (truestrippedcount % 2) {
            _log("odd");
            // assign resource type to the last part we found.
            resType = strippedparts[truestrippedcount];
            _log(resType);

            if (truestrippedcount > 1) {
                // now pull out the resource id by searching for the last slash and substringing to it.
                var lastPart = strippedurl.lastIndexOf("/");
                resourceId = strippedurl.substring(1, lastPart);
                _log(resourceId);
            }
        }
        else // its even (item request on resource)
        {
            _log("even");
            // assign resource type to the part before the last we found (last is resource id)
            resType = strippedparts[truestrippedcount - 1];
            _log("resType");
            // finally remove the leading slash which we used to find the resource if it was
            // only one level deep.
            strippedurl = strippedurl.substring(1);
            _log("strippedurl");
            // assign our resourceId
            resourceId = strippedurl;
            _log("resourceId");
        }

        // assign our verb
        var verb = request.method.toLowerCase();

        // assign our RFC 1123 date
        var date = UTCstring.toLowerCase();

        // parse our master key out as base64 encoding
        var key = CryptoJS.enc.Base64.parse(mastKey);
        _log("key = " + key);

        // build up the request text for the signature so can sign it along with the key
        var text = (verb || "").toLowerCase() + "\n" +
            (resType || "").toLowerCase() + "\n" +
            (resourceId || "") + "\n" +
            (date || "").toLowerCase() + "\n" +
            "" + "\n";
        _log("text = " + text);

        // create the signature from build up request text
        var signature = CryptoJS.HmacSHA256(text, key);
        _log("sig = " + signature);

        // back to base 64 bits
        var base64Bits = CryptoJS.enc.Base64.stringify(signature);
        _log("base64bits = " + base64Bits);

        // format our authentication token and URI encode it.
        var MasterToken = "master";
        var TokenVersion = "1.0";
        var auth = encodeURIComponent("type=" + MasterToken + "&ver=" + TokenVersion + "&sig=" + base64Bits);
        _log("auth = " + auth);

        authDetails.authToken = auth;

        return authDetails;
    };

    /* ======================================================= */
    /*
    /*                 Private helper methods
    /*
    /* ======================================================= */

    function _log(message) {
        if (_logVerbose) {
            console.log(message);
        }
    }


    return _cosmosUtil;
}; CosmosUtil();