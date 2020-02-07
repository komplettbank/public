# Motivation

This repo was created as a workaround to overcome [Postman's](https://www.postman.com/) missing support for creating javscript-functions that can be shared between testscripts.

# Backgroud

If you find yourself writing the same code snippets over and over, you may look for a way to extract this code into a helper-function that can be reused in multiple test scripts, rather than repeating yourself, or copy-pasting snippets from one request to another.

Unfortunately, there is no built-in support for this in Postman*, so we will need to resort to a sort of hack, which involves creating a global "module", and then using eval(...) to retrieve that module and use the functionality it exposes.

Tests that require more complex code, are great candidates for global modules, as they abstract away the complexities, leaving the actual tests more readable. Another argument is maintainability. Having complex code scattered across a number of requests, makes bug-fixing or implementing changes to that code a nightmare. Keeping it in a single, reusable module, means having a single point of maintenance.

_*) Postman does support writing pre-request scripts and test scripts on the collection level, but these will be executed for every request in a collection, and is far from being the same as being able to call a specific helper-function on demand..._

# Usage

## Loading all the Global Modules

To load and make all the Global Modules available in Postman, create a GET request in Postman to download the ModuleLoader.js: https://raw.githubusercontent.com/komplettbank/public/master/Postman/GlobalModules/ModuleLoader.js. 

In the Test-tab of this request, ensure that it was downloaded as it should, and call the loadAll() method to load each of the Global Modules into corresponding Global Postman Variables:
```javascript
pm.test("The ModuleLoader was downloaded and used to load all modules into global variables", () => { 
    pm.response.to.have.status(200);
    let loader = eval(pm.response.text());
    pm.expect(loader).to.not.equal(undefined);
    loader.loadAll();
});
```

## Using a Global Module
Once the Global Modules have been loaded, you can start using them in the Test-tab in subsequent requests. For example, if you make a request to https://postman-echo.com/status/200, you could write the following test script:

```javascript
let util = eval(pm.globals.get("module:CoreUtil"));
if (!util.isResponse200()) {
    util.stopRunner("Unexpected HTTP status");
    return;
}
```

# More about Global Modules

## Creating a Global Module

1. Create a wrapper-function, which - when called - returns an object that holds the helper-function you would like to reuse
2. Store the definition of the wrapper-function, immediately followed by a call to that function, in a global variable.
3. Then, in any test-scripts where you would like to call the helper-function:
   1. Call eval(...) on the global variable. This will first define and then immediately execute the wrapper-function, and return the object (or "module" if you will) containing the helper-function.
   2. Call the helper-function exposed by the object returned in the previous step. 

## Example Module
```javascript
postman.setGlobalVariable("module:sampleUtil", function loadSampleUtil() {
    let _sampleUtil = {};
    _sampleUtil.isResponse = (expectedStatusCode) => {
         pm.test("Status code is " + expectedStatusCode, () => { pm.response.to.have.status(expectedStatusCode); });
         return pm.response.code === expectedStatusCode;
    };
    return _sampleUtil;
} + '; loadSampleUtil();');
 
pm.test("Sample util loaded successfully", () => {
    let sampleUtil = eval(pm.globals.get("module:sampleUtil"));
    pm.expect(sampleUtil).to.not.equal(undefined);
});
```
Note that in the example above, the name of the global variable is set to module:sampleUtil.

Also note the name of the function - loadSampleUtil() - and how it is being called immediately after its definition (with the code '; loadSampleUtil();', added at the end of the contents of the global variable).

Also note the Postman test at the end of the snippet. This test verifies that the module is saved correctly to a global variable, by attempting to load it. If there is a problem with the module, executing the request should yield a failed test, immediately raising awareness to the error.

If the entire script above is pasted into the Tests-tab for a request in Postman, and the request is executed without any failed tests, the global variable called module:sampleModule will be created and can be used on subsequent requests.
