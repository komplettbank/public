/* ================================================================================== */
/*
/*  This utility will helpdownload and store modules in Postman as global variables, for
/*  example like this (if the Postman request does a GET to download this util):
/*  
/*  pm.test("The ModuleLoader was downloaded and used to load all modules into global variables", () => { 
/*  pm.response.to.have.status(200);
/*     let loader = eval(pm.response.text());
/*     pm.expect(loader).to.not.equal(undefined);
/*     loader.loadAll(true);
/*  });

/* ================================================================================== */

function ModuleLoader() {

    let _config = {
        "baseUrl" : "https://raw.githubusercontent.com/komplettbank/public/master/Postman/GlobalModules/",
        "coreUtil" : {
            "filename" : "CoreUtil.js",
            "variable" : "module:CoreUtil"
        },
        "azureBlobUtil" : {
            "filename" : "AzureBlobUtil.js",
            "variable" : "module:AzureBlobUtil"
        },
        "cosmosDbUtil" : {
            "filename" : "CosmosDbUtil.js",
            "variable" : "module:CosmosDbUtil"
        },
        "jobAssistant" : {
            "filename" : "JobAssistant.js",
            "variable" : "module:JobAssistant"
        },
        "debtRegisterUtil" : {
            "filename" : "DebtRegisterUtil.js",
            "variable" : "module:DebtRegisterUtil"
        },
    };

    let _module = {};

    /* ==================== Public methods ================== */

    /*
        Loading a util should happen in a separate request, or as 
        a pre-request script, to ensure that any asynchronus downloading 
        is finished before testscripts are executed.
    */
    _module.loadCoreUtil = (forceDownload) => { _loadUtil(_config.coreUtil.filename, _config.coreUtil.variable, forceDownload); }
    _module.loadAzureBlobUtil = (forceDownload) => { _loadUtil(_config.azureBlobUtil.filename, _config.azureBlobUtil.variable, forceDownload); }
    _module.loadCosmosDbUtil = (forceDownload) => { _loadUtil(_config.cosmosDbUtil.filename, _config.cosmosDbUtil.variable, forceDownload); }
    _module.loadJobAssistant = (forceDownload) => { _loadUtil(_config.jobAssistant.filename, _config.jobAssistant.variable, forceDownload); }
    _module.loadDebtRegisterUtil = (forceDownload) => { _loadUtil(_config.debtRegisterUtil.filename, _config.debtRegisterUtil.variable, forceDownload); }

    _module.loadAll = (forceDownload) => { 
        _module.loadCoreUtil(forceDownload); 
        _module.loadAzureBlobUtil(forceDownload); 
        _module.loadCosmosDbUtil(forceDownload); 
        _module.loadJobAssistant(forceDownload); 
        _module.loadDebtRegisterUtil(forceDownload); 
    }

    /* ==================== Private methods ================== */

    /*
        Ensures that a util is loaded into a variable. If it does not
        already exist in the variable, or if "forceDownload" is true, it
        will be downloaded first.
    */
    function _loadUtil(fileName, variableName, forceDownload) { 
        forceDownload = forceDownload === undefined ? false : forceDownload;
        let util = eval(pm.globals.get(variableName));
        if (forceDownload || util === undefined) {
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
            pm.test(fileName + " was loaded into the global variable '" + variableName + "'", () => { 
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
}; ModuleLoader();