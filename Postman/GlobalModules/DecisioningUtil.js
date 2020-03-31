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
        pm.test("Errors are as expected", function () {
            pm.expect(errors).to.eql(expectedErrors);
        })
    };

    _module.verifyRefinancePolicies = (policies, expectedPolicy) => {
        pm.test("Policy is correct", function () {
            pm.expect(policies).to.eql(expectedPolicy);
        });
    }

    _module.verifyAction = (action, expectedAction) => {
        pm.test("Action is correct", function () {
            pm.expect(action).to.eql(expectedAction);
        });
    }

    _module.verifydecisivePolicyCode = (decisivePolicyCode, expectedDecisivePolicyCode) => {
        pm.test("DecisivePolicyCode is correct", function () {
            pm.expect(decisivePolicyCode).to.eql(expectedDecisivePolicyCode);
        });
    }

    _module.verifyAttributes = (attributes, expectedAttributes) => {
        pm.test("Attributes are correct", function () {
            pm.expect(attributes).to.eql(expectedAttributes);
        });
    }


    /*
	   Credit Decisioning services verifications
	*/

    _module.verifyCreditDecisionResponseProperties = (json) => {
        pm.test("Response corresponds to contract", function () {
            pm.expect(json.decisionId).to.exist;
            pm.expect(json.requestId).to.exist;
            pm.expect(json.correlationId).to.exist;
            pm.expect(json.action).to.exist;
            pm.expect(json.decisivePolicyCode).to.exist;
            pm.expect(json.score).to.exist;
            pm.expect(json.main).to.exist;
            pm.expect(json.main.gpid).to.exist;
            pm.expect(json.main).to.have.property("firstNames");
            pm.expect(json.main).to.have.property("lastName");
            pm.expect(json.main).to.have.property("address");
            pm.expect(json.main.policies).to.exist;
            pm.expect(json.main.policies[0].code).to.exist;
            pm.expect(json.main.policies[0].description).to.exist;
            pm.expect(json.main.policies[0].priority).to.exist;
            pm.expect(json.main.policies[0].action).to.exist;
            pm.expect(json.main.policies[0].quarantineDays).to.exist;
            pm.expect(json.main).to.have.property("attributes");
            //pm.expect(json.main).to.have.property("additionalDataCollection");
            pm.expect(json).to.have.property("cosigner");
            pm.expect(json).to.have.property("debts"); 
        });
    }

    _module.verifyDebts = (debts, expectedDebts) => {
        pm.test("Debts are correct", function () {
            pm.expect(debts).to.eql(expectedDebts);
        });
    }

    _module.verifyScore = (score, expectedScore) => {
        pm.test("Score is correct", function () {
            pm.expect(score).to.eql(expectedScore);
        });
    }

    /*
	   Price Decisioning services verifications
	*/

    _module.verifyPriceDecisionResponseProperties = (json) => {
        pm.test("Response corresponds to contract", function () {
            pm.expect(json.decisionId).to.exist;
            pm.expect(json.requestId).to.exist;
            pm.expect(json.correlationId).to.exist;
            pm.expect(json.offers).to.exist;
            pm.expect(json.refinanceInfos).to.exist;
            pm.expect(json.action).to.exist;
            pm.expect(json.decisivePolicyCode).to.exist;
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
            pm.expect(json.refinanceInfos[0].debtId).to.exist;
            pm.expect(json.refinanceInfos[0].totalCost).to.exist;
            pm.expect(json.refinanceInfos[0].monthlyCost).to.exist;
            pm.expect(json.refinanceInfos[0].refinanceAmount).to.exist;
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
            pm.expect(json.requestId).to.exist;
            pm.expect(json.correlationId).to.exist;
            pm.expect(json.refinanceScopeInfo).to.exist;
            pm.expect(json.action).to.exist;
            pm.expect(json.decisivePolicyCode).to.exist;    
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

    /*
	   kycExternal LookUp service verifications
	*/

    _module.verifyKycExternalLookUpAppHandlingModelResponseProperties = (json) => {
        pm.test("Response corresponds to contract", function () {
            pm.expect(json.decisionId).to.exist;
            pm.expect(json.requestId).to.exist;
            pm.expect(json.correlationId).to.exist;
            pm.expect(json.cosigner).to.exist;
            pm.expect(json.main).to.exist
        });
    }

    _module.verifyKycExternalLookUpBatchModelResponseProperties = (json) => {
        pm.test("Response corresponds to contract", function () {
            pm.expect(json.decisionId).to.exist;
            pm.expect(json.requestId).to.exist;
            pm.expect(json.correlationId).to.exist;
            pm.expect(json.checkResults).to.exist
        });
    }

    _module.verifyKycExternalLookUpDefaultModelResponseProperties = (json) => {
        pm.test("Response corresponds to contract", function () {
            pm.expect(json.decisionId).to.exist;
            pm.expect(json.requestId).to.exist;
            pm.expect(json.correlationId).to.exist;
            pm.expect(json.checkResults).to.exist
        });
    }

    _module.verifyCheckResults = (checkResults, expectedCheckResults) => {
        pm.test("The Check Result is correct", function () {            
            pm.expect(checkResults).to.eql(expectedCheckResults);
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


