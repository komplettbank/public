/* ================================================================================== */
/*
/*  Utility with functions specific to testing the Debt Register API. You can use it
/*  to verify customers and accounts, for example like this:
/*
/*  let debtregUtil = eval(pm.globals.get("module:DebtRegisterUtil"));
/*  debtregUtil.echo("The sun is shining");
/*
/* ================================================================================== */

function DebtRegisterUtil() {

    let _logVerbose = false;
    let _module = {};

    /* ==================== Public methods ================== */

    _module.echo = (o) => { 
        pm.test("Echoing '" + o + "'", function () {
            pm.expect(true).to.be.true;
        });

        _log("Hello! You wrote: " + o);
    };

    /* ==================== Private methods ================== */

    function _log(message) {
        if (_logVerbose) {
            console.log(message);
        }
    }

    return _module;
}; DebtRegisterUtil();