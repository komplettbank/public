/* ================================================================================== */
/*
/*  Utility with functions specific to testing the Decisioning  API. 
/*
/*  let decisioningUtil = eval(pm.globals.get("module:DecisioningUtil"));
/*  decisioningUtil.verifyPriceDecisionResponseProperties(...);
/*
/* ================================================================================== */

function DecisioningUtil() {

	let _module = {};

    /* ======================================================= */
    /*
    /* Public methods, exposed through the util object 
    /*
    /* ======================================================= */

    /*
	   Common verifications 
	*/

    _module.verifyMessage = (json, expectedMessage) => {
        pm.test("Message is correct", function () {
            pm.expect(json).to.eql(expectedMessage);
        })
    };

    _module.verifyErrors = (errors, expectedErrors) => {
        pm.test("Erros are correct", function () {
            pm.expect(errors).to.eql(expectedErrors);
        })
    };

    /*
	   Price Decisioning services verifications
	*/

    _module.verifyPriceDecisionResponseProperties = (json) => {
        pm.test("Response corresponds to contract", function () {
            pm.expect(json.decisionId).to.exist;
            pm.expect(json.correlationId).to.exist;
            pm.expect(json.offers).to.exist;
            pm.expect(json.refinanceInfos).to.exist;
            pm.expect(json.policies).to.exist;
            pm.expect(json).to.have.property("attributes");
            pm.expect(json.offers[0].id).to.exist;
            pm.expect(json.offers[0].numberOfTerms).to.exist;
            pm.expect(json.offers[0].amount).to.exist;
            pm.expect(json.offers[0].nominalInterestRate).to.exist;
            pm.expect(json.offers[0].effectiveInterestRate).to.exist;
            pm.expect(json.offers[0].establishmentFee).to.exist;
            pm.expect(json.offers[0].establishmentDate).to.exist;
            pm.expect(json.offers[0].installmentCharges).to.exist;
            pm.expect(json.offers[0].installmentChargePeriod).to.exist;
            pm.expect(json.offers[0].ppiRate).to.exist;
            pm.expect(json.offers[0].ppiFreeTerms).to.exist;
            pm.expect(json.offers[0].totalCost).to.exist;
            pm.expect(json.offers[0].minimumTermPayment).to.exist;
        });
    }

    _module.verifyRefinanceInfos = (refinanceInfos, expectedrefinanceInfos) => {
        pm.test("refinanceInfos are correct", function () {
            pm.expect(refinanceInfos).to.eql(expectedrefinanceInfos);
        });
    }

    /*
	   Refinance Scope service verifications
	*/

    _module.verifyRefinanceScopeResponseProperties = (json) => {
        pm.test("Response corresponds to contract", function () {
            pm.expect(json.decisionId).to.exist;
            pm.expect(json.correlationId).to.exist;
            pm.expect(json.refinanceScopeInfo).to.exist;
            pm.expect(json.policies).to.exist;
            pm.expect(json).to.have.property("attributes");
            pm.expect(json.refinanceScopeInfo.debtLevelLimitations).to.exist;
            pm.expect(json.refinanceScopeInfo.totalRefinanceableDebt).to.exist;
            pm.expect(json.refinanceScopeInfo.refinanceLimitMin).to.exist;
            pm.expect(json.refinanceScopeInfo.refinanceLimitMax).to.exist;
            pm.expect(json.refinanceScopeInfo.debtLevelLimitations[0].debtId).to.exist;
            pm.expect(json.refinanceScopeInfo.debtLevelLimitations[0].limitations).to.exist;
        });
    }

    _module.verifyRefinanceScope = (json, refinanceScopeInfo, expectedLimitMin, expectedLimitMax, debts, expectedLimitation) => {
        pm.test("The Refinance scope is correct", function () {
            pm.expect(json.decisionId).to.not.be.null;
            pm.expect(refinanceScopeInfo.refinanceLimitMin).to.equal(expectedLimitMin);
            pm.expect(refinanceScopeInfo.refinanceLimitMax).to.equal(expectedLimitMax);
            _verifyRefinanceLimitations(debts, expectedLimitation);
        });
    }

    _module.verifyRefinancePolicies = (policies, expectedPolicy) => {
        pm.test("Policy is correct", function () {
            pm.expect(policies).to.eql(expectedPolicy);
        });
    }
  

    /* ==================== Private methods ================== */


    function _verifyRefinanceLimitations(debts, expectedLimitation) {
        debts.each(function (debt) {
            pm.test("The limitations are correct", () => {
                pm.expect(debt.limitations).to.equal(expectedLimitation);
            });
        });
    }

    return _module;
}; DecisioningUtil();


