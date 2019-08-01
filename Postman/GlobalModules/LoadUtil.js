/* ================================================================================== */
/*
/*  Executing this request will update a global variable with a function that returns 
/*  an object with general utility-functions. The object can be loaded and used in 
/*  test-scripts, for example like this:
/*
/*      let util = eval(pm.globals.get("module:util"));
/*      util.isResponse200();
/*
/*  IMPORTANT NOTE:
/*  ---------------------
/*  The master for this file is kept in "\KB.Postman\GlobalModules\LoadUtil.js"
/*  in the "KB.Shared.Testing" git-repo in the "KBShared" project in Azure DevOps.
/*  Any changes made here must be propagated to the master file!
/*
/* ======================================================= */


postman.setGlobalVariable("module:util", function loadUtil() {

    let _util = {};

    /* ======================================================= */
    /*
    /*                      Public methods
    /*
    /* ======================================================= */

    /*
        Returns true for an empty object, or null, or undefined, or nothing specified at all, or any number.
        Returns true for an actual object, or for a string.
    */
    _util.isEmpty = (o) => { return _isEmpty(o); };

    /*
        Returns true if iteration data has been specified (an input file to a runner). 
        This can be used to determine if fallback values should be used (when no iteration data exists)
    */
    _util.hasIterationData = () => { return !_isEmpty(pm.iterationData.toObject()); };

    /* 
        Use the following functions to add a test that verifies the responsecode, 
        and get the test-result as a boolean.
    */
    _util.isResponse200 = () => { return _verifyResponseStatusCode(200); };
    _util.isResponse400 = () => { return _verifyResponseStatusCode(400); };
    _util.isResponse404 = () => { return _verifyResponseStatusCode(404); };
    _util.isResponse = (expectedCode) => { return _verifyResponseStatusCode(expectedCode); };

    /*
        Adds a test that verifies that the content-type header is correct, and that the 
        response is a valid JSON, with an actual body (not an empty object), and returns 
        the result of these tests as a boolean.
        Note:
        The parameter "expectedContentType" is optional, and can usually be ommitted. It 
        specifies the expected content-type to look for in the header, and will default
        to "application/json; charset=utf-8", which is what our API's will return. However,
        the Cosmos DB API will only return "application/json", and so we need to be able
        to override the default expected value.
    */
    _util.isResponseJson = (expectedContentType) => {
        expectedContentType = expectedContentType || "application/json; charset=utf-8";
        if (_verifyResponseContentType(expectedContentType)) {
            try {
                let json = pm.response.json(); // Details: http://www.postmanlabs.com/postman-collection/Response.html
                pm.test("Response has a valid JSON body", () => { pm.expect(_isEmpty(json)).to.be.false; });
                return true;
            }
            catch (e) {
                pm.test("Response is valid JSON", () => { pm.expect(e).to.be.null; });
                return false;
            }
        }
        return false;
    };

    /*
        Adds a test that verifies that the content-type header is correct, and that the 
        response size (content-length header or the actual response body) is greater than 0.
    */
    _util.isResponsePdf = () => {
        if (_verifyResponseContentType("application/pdf")) {
            let size = pm.response.size().body; // The doc says size() returns a number, but the log tells me it's an object. Doc: http://www.postmanlabs.com/postman-collection/Response.html
            pm.test("Content length > 0", () => { pm.expect(size).to.be.above(0); });
            return size > 0;
        }
        return false;
    };

    /*
        Stops the runner (Newman or the Postman Collection Runner), and logs the reason.
    */
    _util.stopRunner = (reason) => {
        console.warn("Stopping runner. Reason: " + reason);
        postman.setNextRequest(null);
    };

    /* ======================================================= */
    /*
    /*                 Private helper methods
    /*
    /* ======================================================= */

    /* 
        Test for a response status code, but also return the result of that test as a boolean, to enable
        conditional execution of requests, based on the return value
    */
    function _verifyResponseStatusCode(expectedStatusCode) {
        pm.test("Status code is " + expectedStatusCode, () => { pm.response.to.have.status(expectedStatusCode); });
        return pm.response.code === expectedStatusCode;
    }

    function _verifyResponseContentType(expectedContentType) {
        pm.test("Content-Type is '" + expectedContentType + "'", () => { pm.response.to.have.header("Content-Type", expectedContentType); });
        return postman.getResponseHeader("Content-Type") === expectedContentType;
    }

    /* 
        Returns true if an object is empty. 
        See https://stackoverflow.com/questions/2340509/javascript-trivia-check-for-equality-against-the-empty-object
    */
    function _isEmpty(o) {
        for (let i in o) {
            if (o.hasOwnProperty(i)) {
                return false;
            }
        }
        return true;
    }

    return _util;
} + '; loadUtil();');

/*
 * Try to load the module using eval, and test the result, to assert that it 
 * actually can be loaded inside a test-script in Postman.
 */
let util = eval(pm.globals.get("module:util"));
pm.test("Global util loaded successfully", () => {
    pm.expect(util).to.not.equal(undefined);
});
