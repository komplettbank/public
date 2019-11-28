/* ================================================================================== */
/*
/*  Utility with functions specific to testing the ContactInfo API. You can use it
/*  to verify customers and accounts, for example like this:
/*
/*  let contactInfoUtil = eval(pm.globals.get("module:ContactInfoUtil"));
/*  contactInfoUtil.VerifyContactInfowalletidproperties(...);
/*
/* ================================================================================== */

function ContactInfoUtil() {

	let _module = {};
	
		/* ==================== Public methods ================== */
		

	/*
	   Verify the properties retrived from Salesforce by the gpid API in ContactInfo
	*/
			_module.VerifyContactInfogpidproperties = (CustomerData)=> {
				pm.test("All required properties exist", function () {
					pm.expect(CustomerData).to.have.property("gpid");
					pm.expect(CustomerData).to.have.property("firstName");
					pm.expect(CustomerData).to.have.property("lastName");
					pm.expect(CustomerData).to.have.property("addressLine1");
					pm.expect(CustomerData).to.have.property("addressLine2");
					pm.expect(CustomerData).to.have.property("postalCode");
					pm.expect(CustomerData).to.have.property("city");
					pm.expect(CustomerData).to.have.property("countryCode");
					pm.expect(CustomerData).to.have.property("email");
					pm.expect(CustomerData).to.have.property("mobilePhone");
					pm.expect(CustomerData).to.have.property("salesforceAccountId");
				});
			}
			
	/*
	   Comparing the values retrived from Salesforce and by the gpid API in ContactInfo
	*/
		
    
			_module.VerifyDetails = (CustomerData ,salesforceData) => {
				pm.test("Comapring the data vales from salesforce to ConatctInfo by gpid" , function () { 
					pm.expect(CustomerData.gpid).to.equal(salesforceData.GlobalCustomerId);
					pm.expect(CustomerData.firstName).to.equal(salesforceData.FirstName);
					pm.expect(CustomerData.lastName).to.equal(salesforceData.LastName);
					pm.expect(CustomerData.email).to.equal(salesforceData.EmailAddress);
					pm.expect(CustomerData.mobilePhone).to.equal(salesforceData.MobileNumber);	    
				});
			}
	
	/*
	   Verify the properties retrived from Salesforce by the walletpartyid API in ContactInfo
	*/
		
			_module.VerifyContactInfowalletidproperties = (CustWalletData)	=> {    
				pm.test("All required properties exist", function () {
					pm.expect(CustWalletData).to.have.property("gpid");
					pm.expect(CustWalletData).to.have.property("firstName");
					pm.expect(CustWalletData).to.have.property("lastName");
					pm.expect(CustWalletData).to.have.property("addressLine1");
					pm.expect(CustWalletData).to.have.property("addressLine2");
					pm.expect(CustWalletData).to.have.property("postalCode");
					pm.expect(CustWalletData).to.have.property("city");
					pm.expect(CustWalletData).to.have.property("countryCode");
					pm.expect(CustWalletData).to.have.property("email");
					pm.expect(CustWalletData).to.have.property("mobilePhone");
					pm.expect(CustWalletData).to.have.property("salesforceAccountId");
				});
			}
	/*
	   Comparing the values retrived from Salesforce and by the walletpartyid API in ContactInfo
	*/
			_module.VerifyWalletpartyDetails = (CustWalletData ,InitialCustData) => {        
				pm.test("Comapring the data vales from salesforce to ConatctInfo by walletpartyid" , function () { 
					pm.expect(CustWalletData.gpid).to.equal(InitialCustData.GlobalCustomerId);
					pm.expect(CustWalletData.firstName).to.equal(InitialCustData.FirstName);
					pm.expect(CustWalletData.lastName).to.equal(InitialCustData.LastName);
					pm.expect(CustWalletData.email).to.equal(InitialCustData.EmailAddress);
					pm.expect(CustWalletData.mobilePhone).to.equal(InitialCustData.MobileNumber);	    
				});
			}  
	/*
	   Verify the properties retrived from Salesforce by the Identity function API in ContactInfo
	*/			

			_module.VerifyContactInfoIdentityproperties = (CustMatchData) => {
				pm.test("All required properties exist", function () {
					pm.expect(CustMatchData[0]).to.have.property("ssn");
					pm.expect(CustMatchData[0]).to.have.property("countryCode");
					pm.expect(CustMatchData[0]).to.have.property("gpid");
				});  
			} 
	/*
	   Comparing the values retrived from Salesforce and by the Identity function API in ContactInfo
	*/
		
	
			_module.VerifyMatchDetails = (CustMatchData ,InitialCustData) => {        
				pm.test("Comapring the data vales from salesforce to ConatctInfo by Identities" , function () { 
					pm.expect(CustMatchData[0].gpid).to.equal(InitialCustData.gpid);				
					pm.expect(CustMatchData[0].countryCode).to.equal(InitialCustData.countryCode);			
				});
			} 
	return _module;
}; ContactInfoUtil();
