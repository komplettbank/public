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

    _module.getGlobalUtil = (forceReload) => { 
        return _getOrLoadUtil(_config.globalUtil.filename, _config.globalUtil.variable, forceReload);
    }

    _module.getDebtRegisterUtil = (forceReload) => { 
        return _getOrLoadUtil(_config.debtRegisterUtil.filename, _config.debtRegisterUtil.variable, forceReload);
    }

    _module.getAzureBlobUtil = (forceReload) => { 
        return _getOrLoadUtil(_config.azureBlobUtil.filename, _config.azureBlobUtil.variable, forceReload);
    }

    _module.getCosmosDbUtil = (forceReload) => { 
        return _getOrLoadUtil(_config.cosmosDbUtil.filename, _config.cosmosDbUtil.variable, forceReload);
    }

    /* ==================== Private methods ================== */

    /*
        Returns the specified util stored in the global variable.        
        The "foreReload" parameter is optional. Default is false, which means the util 
        will be returned from the global variable, if it exists there. If it doesn't exist,
        or if "foreReload" is true, then it will be downloaded and stored in the 
        global variable first.
    */
    function _getOrLoadUtil(utilName, variableName, forceReload) { 
        forceReload = forceReload === undefined ? false : forceReload;
        if (forceReload) {
            _loadUtil(utilName, variableName);
        }

        let util = eval(pm.globals.get(variableName));
        if (util === undefined) {
            _loadUtil(utilName, variableName);
            util = eval(pm.globals.get(variableName));
        }
        return util;
    }

    function _loadUtil(fileName, variableName) {
        var url = _config.baseUrl + fileName;
        let settings = {
            async: false,
            crossDomain: true,
            url: url,
            method: 'GET',
        };
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
        });
    }

    return _module;
}; UtilLoader();