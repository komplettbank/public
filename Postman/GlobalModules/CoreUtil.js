/* ================================================================================== */
/*
/*  Utility with general functions that may  be helpful when writing test scripts in 
/*  Postman. For example, to load the module and test that a request returns 200 OK,
/*  and also stop the runner in case the test fails, you could write the following:
/*
/*  let util = eval(pm.globals.get("module:CoreUtil"));
/*  if (!util.isResponse200()) {
/*      util.stopRunner("Unexpected HTTP status");
/*      return;
/*  }
/*   
/* ================================================================================== */

function CoreUtil() {

    let _module = {};

    /* ==================== Public methods ================== */

    /*
        Returns true for an empty object, or null, or undefined, or nothing specified at all, or any number.
        Returns true for an actual object, or for a string.
    */
    _module.isEmpty = (o) => { return _isEmpty(o); };

    /*
        Returns true if iteration data has been specified (an input file to a runner). 
        This can be used to determine if fallback values should be used (when no iteration data exists)
    */
    _module.hasIterationData = () => { return !_isEmpty(pm.iterationData.toObject()); };

    /* 
        Use the following functions to add a test that verifies the responsecode, 
        and get the test-result as a boolean.
    */
    _module.isResponse200 = () => { return _verifyResponseStatusCode(200); };
    _module.isResponse400 = () => { return _verifyResponseStatusCode(400); };
    _module.isResponse404 = () => { return _verifyResponseStatusCode(404); };
	_module.isResponse201 = () => { return _verifyResponseStatusCode(201); };
    _module.isResponse = (expectedCode) => { return _verifyResponseStatusCode(expectedCode); };

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
    _module.isResponseJson = (expectedContentType) => {
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
    _module.isResponsePdf = () => {
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
    _module.stopRunner = (reason) => {
        console.warn("Stopping runner. Reason: " + reason);
        postman.setNextRequest(null);
    };

    /* ==================== Private methods ================== */

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

    return _module;
}; CoreUtil();
