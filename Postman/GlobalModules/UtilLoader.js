/* ======================================================= */
/*
/*  This utility will help retrieve and store shared utils
/*  in global Postman variables. The exposed methods will
/*  return the specified util, downloading it if necessary. 
/*
/* ======================================================= */

function UtilLoader() {

    let _config = {
        "baseUrl" : "https://raw.githubusercontent.com/komplettbank/public/master/Postman/GlobalModules/",
        "globalUtil" : {
            "filename" : "GlobalUtil.js",
            "variable" : "module:GlobalUtil"
        },
        "azureBlobUtil" : {
            "filename" : "AzureBlobUtil.js",
            "variable" : "module:AzureBlobUtil"
        },
        "cosmosDbUtil" : {
            "filename" : "CosmosDbUtil.js",
            "variable" : "module:CosmosDbUtil"
        },
        "debtRegisterUtil" : {
            "filename" : "DebtRegisterUtil.js",
            "variable" : "module:DebtRegisterUtil"
        },
    };

    let _module = {};

    /* ==================== Public methods ================== */

    /*
        Loading a util should happen in a pre-request script, to
        ensure that any asynchronus downloading is finished before 
        the request and testscripts are executed.
    */
    _module.loadGlobalUtil = (forceReload) => { _loadUtil(_config.globalUtil.filename, _config.globalUtil.variable, forceReload); }
    _module.loadAzureBlobUtil = (forceReload) => { _loadUtil(_config.azureBlobUtil.filename, _config.azureBlobUtil.variable, forceReload); }
    _module.loadCosmosDbUtil = (forceReload) => { _loadUtil(_config.cosmosDbUtil.filename, _config.cosmosDbUtil.variable, forceReload); }
    _module.loadDebtRegisterUtil = (forceReload) => { _loadUtil(_config.debtRegisterUtil.filename, _config.debtRegisterUtil.variable, forceReload); }

    /*
        These getters simply retrieves a util from a global variable,
        so that the usercaller does not need to know the name of the
        variables containing the utils. It also enables us to modify the
        variable names later, if we need/want to, without affecting the caller.
    */
    _module.getGlobalUtil = () => { return eval(pm.globals.get(_config.globalUtil.variable)); }
    _module.getAzureBlobUtil = () => { return eval(pm.globals.get(_config.azureBlobUtil.variable)); }
    _module.getCosmosDbUtil = () => { return eval(pm.globals.get(_config.cosmosDbUtil.variable)); }
    _module.getDebtRegisterUtil = () => { return eval(pm.globals.get(_config.debtRegisterUtil.variable)); }

    /* ==================== Private methods ================== */

    /*
        Ensures that a util is loaded into a variable. If it does not
        already exist in the variable, or if "forceReload" is true, it
        will be downloaded first.
    */
    function _loadUtil(fileName, variableName, forceReload) { 
        forceReload = forceReload === undefined ? false : forceReload;
        let util = eval(pm.globals.get(variableName));
        if (forceReload || util === undefined) {
            _downloadUtilAndUpdateVariable(fileName, variableName);
        }
    }

    function _downloadUtilAndUpdateVariable(fileName, variableName) {
        var url = _config.baseUrl + fileName;
        let settings = {
            async: false,
            crossDomain: true,
            url: url,
            method: 'GET',
        };
        console.info("Loading starting...");
        pm.sendRequest(settings, function (err, res) {
            pm.test("Loaded " + fileName + " into global variable '" + variableName + "'", () => { 
                if (err)
                {
                    console.error("Failed to download util: " + url);
                    console.error(err);
                }

                pm.expect(err).to.not.be.ok;
                pm.expect(res).to.have.property('code', 200);
                pm.expect(res).to.have.property('status', 'OK');
                console.info("Downloaded util: " + url);
                pm.globals.set(variableName, res.text());
                console.info("Updated variable: " + variableName);
            });
            console.info("Loading finished!");
        });
    }

    return _module;
}; UtilLoader();