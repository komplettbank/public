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

    let _logVerbose = true;
    let _module = {};

    /* ==================== Public methods ================== */

    _module.echo = (o) => { 
        pm.test("Echoing '" + o + "'", function () {
            pm.expect(true).to.be.true;
        });

        _log("Hello! You wrote: " + o);
    };
	
	/*
       Verify customer debt (Customer having maximum two loan accounts)
    */

    _util.verifyCustomerDebt = (customer, gpid, account1, account2)  => {  _verifyCustomerDebt(customer, gpid, account1, account2); };
    
    
    function _verifyCustomerDebt(customer,gpid, account1, account2) {
   
        customer.loans.each(function(loan) {
         
            if (loan.type == "creditFacility") { 
                if (loan.accountID == account1.kid) {
                    _verifyCreditFacilityProperties(loan, account1, gpid);
                }
                else if (loan.accountID == account2.kid) {
                    _verifyCreditFacilityProperties(loan, account2, gpid);
                }
                else
                {
                    pm.test("The accountId used in a loan matches the kid of an account", () => { pm.expect(loan.accountID).to.be.oneOf(account1.kid, account2.kid); });
                }
            }
            else if (loan.type == "repaymentLoan") {
                if (loan.accountID == account1.kid) {
                    _verifyRepaymentLoanProperties(loan, account1, gpid);
                }
                else if (loan.accountID == account2.kid) {
                    _verifyRepaymentLoanProperties(loan, account2, gpid);
                }
                else
                {
                    pm.test("The accountId used in a loan matches the kid of an account", () => { pm.expect(loan.accountID).to.be.oneOf(account1.kid, account2.kid); });
                }
            }
        });
    }

    /* ==================== Private methods ================== */
	
	/*
       Verify Repaymenmt Loan Values
    */
	
	function _verifyRepaymentLoanProperties(loan, account, gpid) {
        
        pm.test("Repayment Loan has Correct Values for KID: " + loan.accountID, function () { 
            pm.expect(loan.type).to.equal("repaymentLoan");
            pm.expect(loan.accountID).to.equal(account.kid);
            pm.expect(loan.balance).to.equal(_updateBalance(account.balance));
            pm.expect(loan.terms).to.equal(account.terms);
            pm.expect(loan.originalBalance).to.equal(_updateBalance(account.originalBalance));
            pm.expect(loan.nominalInterestRate).to.equal(_updateInterestRate(account.interestRate));
            pm.expect(loan.installmentCharges).to.equal(_updateInstallmentCharges(account.installmentCharges));
            pm.expect(loan.installmentChargePeriod).to.equal("MONTHLY");
            pm.expect(loan.accountName).to.equal("Credit Loan");
    
          if ( account.globalCosignerCustomerId === undefined || account.globalCosignerCustomerId === null) {
               
               pm.expect(loan.coBorrower).to.equal(0);
              
            }
            else if (gpid == account.globalCosignerCustomerId ) { 
               
                pm.expect(loan.coBorrower).to.equal(1);
                
            }   
            
            else if (gpid == account.globalCustomerId ) {
               
                pm.expect(loan.coBorrower).to.equal(2);
                
            }  
            
          else
                {
                    pm.test("Coborrower logic is not correct ", () => { pm.expect(gpid).to.be.oneOf(account.globalCosignerCustomerId, account.globalCustomerId); });
                }  
        });
    }    
    
    
    /*
       Verify Credit Facility Values
    */
    
 
        
    function _verifyCreditFacilityProperties(loan, account, gpid) {
        
         pm.test("CreditFacility has Correct Values  for KID: " + loan.accountID, function () { 
            pm.expect(loan.type).to.equal("creditFacility");
            pm.expect(loan.accountID).to.equal(account.kid);
            pm.expect(loan.creditLimit).to.equal(_updateBalance(account.creditLimit));
            pm.expect(loan.interestBearingBalance).to.equal(_updateBalance(account.interestBearingBalance));
            pm.expect(loan.nonInterestBearingBalance).to.equal(_updateBalance(account.nonInterestBearingBalance));
            pm.expect(loan.nominalInterestRate).to.equal(_updateInterestRate(account.interestRate));
            pm.expect(loan.installmentCharges).to.equal(_updateInstallmentCharges(account.installmentCharges));
            pm.expect(loan.installmentChargePeriod).to.equal("MONTHLY");

            if (account.productType == 'CC') { 
                pm.expect(loan.accountName).to.equal("Credit Card");
            }
            else {
                pm.expect(loan.accountName).to.equal("Credit Loan");
            } 
            
          
            
            if ( account.globalCosignerCustomerId === undefined || account.globalCosignerCustomerId === null) {
               
               pm.expect(loan.coBorrower).to.equal(0);
              
            }
            else if (gpid == account.globalCosignerCustomerId ) { 
               
                pm.expect(loan.coBorrower).to.equal(1);
                
            }   
            
            else if (gpid == account.globalCustomerId ) {
               
                pm.expect(loan.coBorrower).to.equal(2);
                
            }  
            
          else
                {
                    pm.test("Coborrower logic is not correct ", () => { pm.expect(gpid).to.be.oneOf(account.globalCosignerCustomerId, account.globalCustomerId); });
                }
              
        });
    }
	
	/*
       Return updated balance based on thier sign (negative or positive)
    */
	
	 function _updateBalance(balance) {
        return balance >= 0 ? 0 : Math.floor (-(balance)*100);
       }
	   
    /*
        Return updated interest rate   (10.20 %  is encoded as 1020) 
    */
    
    function _updateInterestRate(interestRate) {
        return interestRate*100;
       }
    /*
        Return updated  installment Charges  (11.20  is encoded as 1020) 
    */
    
    function _updateInstallmentCharges(installmentCharges) {
        return installmentCharges*100;
       }

    function _log(message) {
        if (_logVerbose) {
            console.log(message);
        }
    }

    return _module;
}; DebtRegisterUtil();