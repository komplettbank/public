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

	let _module = {};
	
	let _constants = {
		creditFacility: "creditFacility",
		repaymentLoan: "repaymentLoan",
		chargePeriodMonthly: "MONTHLY",
		cardAccountName: "Credit Card",
		loanAccountName: "Credit Loan",
	}

	/* ==================== Public methods ================== */

	/*
	   Verify customer debt (Customer having maximum two loan accounts)
	*/
	_util.verifyCustomerDebt = (customer, gpid, account1, account2)  => {  
		customer.loans.each(function(loan) {
			pm.test("The loan type should be creditFacility or repaymentLoan", () => { pm.expect(loan.type).to.be.oneOf(_constants.creditFacility, _constants.repaymentLoan); });
			pm.test("The accountId used in a loan matches the kid of an account", () => { pm.expect(loan.accountID).to.be.oneOf(account1.kid, account2.kid); });
		 
			if (loan.type === _constants.creditFacility) { 
				if (loan.accountID === account1.kid) {
					_verifyCreditFacilityProperties(loan, account1, gpid);
				}
				else if (loan.accountID === account2.kid) {
					_verifyCreditFacilityProperties(loan, account2, gpid);
				}
			}
			else if (loan.type === _constants.repaymentLoan) {
				if (loan.accountID === account1.kid) {
					_verifyRepaymentLoanProperties(loan, account1, gpid);
				}
				else if (loan.accountID === account2.kid) {
					_verifyRepaymentLoanProperties(loan, account2, gpid);
				}
			}
		});
	}

	/* ==================== Private methods ================== */
	
	function _verifyRepaymentLoanProperties(loan, account, gpid) {
		
		pm.test("Repayment loan has correct values for KID: " + loan.accountID, function () { 
			pm.expect(loan.type).to.equal(_constants.repaymentLoan);
			pm.expect(loan.accountID).to.equal(account.kid);
			pm.expect(loan.balance).to.equal(_ensurePositiveOrZero(account.balance));
			pm.expect(loan.terms).to.equal(account.terms);
			pm.expect(loan.originalBalance).to.equal(_ensurePositiveOrZero(account.originalBalance));
			pm.expect(loan.nominalInterestRate).to.equal(_multiplyBy100(account.interestRate));
			pm.expect(loan.installmentCharges).to.equal(_multiplyBy100(account.installmentCharges));
			pm.expect(loan.installmentChargePeriod).to.equal(_constants.chargePeriodMonthly);
			pm.expect(loan.accountName).to.equal(_constants.loanAccountName);
			_verifyCoBorrower(account, gpid);
		});
	}    
	
	function _verifyCreditFacilityProperties(loan, account, gpid) {
		
		 pm.test("CreditFacility has correct values for KID: " + loan.accountID, function () { 
			pm.expect(loan.type).to.equal(_constants.creditFacility);
			pm.expect(loan.accountID).to.equal(account.kid);
			pm.expect(loan.creditLimit).to.equal(_ensurePositiveOrZero(account.creditLimit));
			pm.expect(loan.interestBearingBalance).to.equal(_ensurePositiveOrZero(account.interestBearingBalance));
			pm.expect(loan.nonInterestBearingBalance).to.equal(_ensurePositiveOrZero(account.nonInterestBearingBalance));
			pm.expect(loan.nominalInterestRate).to.equal(_multiplyBy100(account.interestRate));
			pm.expect(loan.installmentCharges).to.equal(_multiplyBy100(account.installmentCharges));
			pm.expect(loan.installmentChargePeriod).to.equal(_constants.chargePeriodMonthly);
			_verifyCoBorrower(account, gpid);

			if (account.productType == 'CC') { 
				pm.expect(loan.accountName).to.equal(_constants.cardAccountName);
			}
			else {
				pm.expect(loan.accountName).to.equal(_constants.loanAccountName);
			} 
		});
	}
	
	function _verifyCoBorrower(account, gpid) {

		pm.test("CoBorrower logic is correct", () => {
			if (account.globalCosignerCustomerId === undefined || account.globalCosignerCustomerId === null) {
				pm.expect(loan.coBorrower).to.equal(0);
			}
			else if (gpid == account.globalCosignerCustomerId ) { 
				pm.expect(loan.coBorrower).to.equal(1);
			}   
			else if (gpid == account.globalCustomerId ) {
				pm.expect(loan.coBorrower).to.equal(2);
			}
			else {
				pm.expect(gpid).to.be.oneOf(account.globalCosignerCustomerId, account.globalCustomerId);
			}
		});
	}    
	
	/*
	   Ensure the balance is positive, and multiply by 100 to get rid of decimal point
	*/
	 function _ensurePositiveOrZero(balance) {
		return balance >= 0 ? 0 : Math.floor(-(_multiplyBy100(balance)));
	   }
	   
	/*
		Return decimal number multiplied by 100, so that for example 10.20 is returned as 1020.
	*/
	function _multiplyBy100(decimalNumber) {
		return decimalNumber * 100;
	}

	return _module;
}; DebtRegisterUtil();
