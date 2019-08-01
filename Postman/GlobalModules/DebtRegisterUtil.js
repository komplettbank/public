function DebtRegisterUtil() {

    let _module = {};

    /* ======================================================= */
    /*
    /*                      Public methods
    /*
    /* ======================================================= */

    _module.echo = (o) => { 
        pm.test("Echoing '" + o + "'", function () {
            pm.expect(true).to.be.true;
        });
        console.info("Hello " + o);
    };

    return _module;
}; DebtRegisterUtil();