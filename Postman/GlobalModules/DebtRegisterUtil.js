/* ================================================================================== */
/*
/*  Utility with functions specific to testing the Debt Register API.
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

        _log("Hello " + o);
    };

    /* ==================== Private methods ================== */

    function _log(message) {
        if (_logVerbose) {
            console.log(message);
        }
    }

    return _module;
}; DebtRegisterUtil();