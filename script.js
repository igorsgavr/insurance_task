class InsuranceCompany {

	constructor(name) {
		this._name = name;
		this._risks = [];
		this._soldPolicies = [];
	}

	// Get name of the company
	get name() {
		return this._name;
	}
	
	// Get list of the risks that can be insured.
	get availableRisks() {
		return this._risks;
	}
	
	// Add a new policy to the list
	addSoldPolicy(policy) {
		this._soldPolicies.push(policy);
	}

	// Get list of all sold policies
	get soldPolicies() {
		return this._soldPolicies;
	}
	
	// Set list of the risks that can be insured. List can be updated at any time.
	setAvailableRisks(risks) {
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

		var overlap = false;
		let f2 = validFrom.getTime();
		let policyClass = new Policy();
		let t2 = policyClass.calculateValidTill(validFrom,validMonths).getTime();

		let sp = this.soldPolicies;
		sp.forEach(function(el){
			let f1 = el._validFrom.getTime();
			let t1 = el.validTill.getTime();
			
			/*
			f - from , t - to, n - name
			1 - already existing Policy object
			2 - candidate for new Policy object

			cases when effective periods overlap each other:
				f2<=f1 && t2>=t1
				f2>=f1 && f2<=t1
				t2>=f1 && f2<=f1
			*/
			if (((f2<=f1 && t2>=t1) || (f2>=f1 && f2<=t1) || (t2>=f1 && f2<=f1))
			&& nameOfInsuredObject == el.nameOfInsuredObject) overlap = true;
		});

		if(!overlap) {
			let newPolicy = new Policy(nameOfInsuredObject, validFrom, validMonths, selectedRisks);
			this.addSoldPolicy(newPolicy);
			return newPolicy;
		} else {
			console.log('error: Effective periods of different policies overlap each other');
		}
	}

	// Gets policy with a risks at the given point of time.
	// nameOfInsuredObject: Name of insured object
	// effectiveDate: Point of date and time, when to get data about a policy
	getPolicy(nameOfInsuredObject, effectiveDate) {
		let policies = this._soldPolicies;
		let validPolicies = [];

		policies.forEach(function(element){
			if (element.nameOfInsuredObject != nameOfInsuredObject) validPolicies.push(element);
		});

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

		// String, Date, Number, Array
		constructor(nameOfInsuredObject, validFrom, validMonths, selectedRisks) {
			this._nameOfInsuredObject = nameOfInsuredObject;
			this._validFrom = validFrom;
			this._validMonths = validMonths;
			this._selectedRisks = selectedRisks;
		}
	
		// Get name of insured object.
		get nameOfInsuredObject() {
			return this._nameOfInsuredObject;
		}
		
		// Get date when policy becomes active.
		get validFrom() {
			return this._validFrom;
		}

		calculateValidTill(from,months) {
			let fromCopy = new Date(from.getTime()); //copy the argument to not change the original
			let till = new Date(fromCopy.setMonth(fromCopy.getMonth()+months));
			return new Date(till.setDate(till.getDate()-1)); //convert to needed form
		}

		// Get date when policy becomes inactive.
		get validTill() {
			return this.calculateValidTill(this._validFrom, this._validMonths);
		}

		// Get total price of the policy. Calculate by summing up all insured risks.
		// Take into account that price of the risk is given for 1 full year. Policy/risk period can be shorter.
		get premium() {
			return this.insuredRisks.length;
		}
		
		// Get list of the Risks that are included in the policy at given time moment.
		get insuredRisks() {
			let arr = [];	

			this._selectedRisks.forEach(function(elem){
				arr.push(elem);
			});

			return arr;
		}

		// Add risk to the policy of insured object.
		// nameOfInsuredObject: Name of insured object
		// risk: Risk that must be added
		// validFrom: Date when risk becomes active. Can not be in the past
		addRisk(nameOfInsuredObject, risk, validFrom) {
			// Put your logic here
		}
}

module.exports = {
  InsuranceCompany : InsuranceCompany,
  Risk : Risk,
  Policy: Policy
}