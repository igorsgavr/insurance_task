class InsuranceCompany {

	constructor(name) {
		this._name = name;
		this._risks = [];
	}

	// Get name of the company
	get name() {
		return this._name;
	}
	
	// Get list of the risks that can be insured.
	get availableRisks() {
		// Put your logic here
		return this._risks;
	}
	
	// Set list of the risks that can be insured. List can be updated at any time.
	setAvailableRisks(risks) {
		// Put your logic here
		risks.forEach(function(elem){
			this._risks.push(elem);
		}, this);
	}
	
	// Sell the policy.
	// nameOfInsuredObject: Name of the insured object. Must be unique in the given period.
	// validFrom: Date and time when policy starts. Can not be in the past
	// validMonths: (number) Policy period in full months
	// selectedRisks: List of risks objects that must be included in the policy
	sellPolicy(nameOfInsuredObject, validFrom, validMonths, selectedRisks) {
		// Put your logic here
		return new Policy(nameOfInsuredObject, validFrom, validMonths, selectedRisks);
	}

	// Add risk to the policy of insured object.
	// nameOfInsuredObject: Name of insured object
	// risk: Risk that must be added
	// validFrom: Date when risk becomes active. Can not be in the past
	addRisk(nameOfInsuredObject, risk, validFrom) {
		// Put your logic here
	}

	// Gets policy with a risks at the given point of time.
	// nameOfInsuredObject: Name of insured object
	// effectiveDate: Point of date and time, when to get data about a policy
	getPolicy(nameOfInsuredObject, effectiveDate) {
		// Put your logic here
		return new Policy();
	}
}



class Risk {

	constructor(name, yearlyPrice) {
		this._name = name;
		this._yearlyPrice = yearlyPrice;
	}

	// Get name of the Risk
	get name() {
		return this._name;
	}
	// Get yearly price of the Risk
	yearlyPrice() {
		return this._yearlyPrice;
	}

}
	
class Policy {

		//String, Date, Number, Array
		constructor(nameOfInsuredObject, validFrom, validMonths, selectedRisks) {
			this._nameOfInsuredObject = nameOfInsuredObject;
			this._validFrom = validFrom;
			this._validMonths = validMonths;
			this._selectedRisks = selectedRisks;
		}
	
		// Get name of insured object.
		get nameOfInsuredObject() {
		// Put your logic here
			return this._nameOfInsuredObject;
		}
		
		// Get date when policy becomes active.
		get validFrom() {
		// Put your logic here
			return this._validFrom;
		}

		// Get date when policy becomes inactive.
		get validTill() {
			// Put your logic here

			var from = new Date(this._validFrom);
			var till = new Date(from.setMonth(from.getMonth()+this._validMonths));
			return new Date(till.setDate(till.getDate()-1)); //convert to needed form
		}

		// Get total price of the policy. Calculate by summing up all insured risks.
		// Take into account that price of the risk is given for 1 full year. Policy/risk period can be shorter.
		get premium() {
		// Put your logic here
		return 0;
		}
		
		// Get list of the Risks that are included in the policy at given time moment.
		get insuredRisks() {
		// Put your logic here
		return [];
	}
}

module.exports = {
  InsuranceCompany : InsuranceCompany,
  Risk : Risk,
  Policy: Policy
}