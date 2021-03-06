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
	// risks: Array of Risks or single Risk
	setAvailableRisks(risks) {
		this._risks = [];
		if(!(risks instanceof Array)) this._risks.push(risks); //if only one element is passed, will not use foreach
		else {
			risks.forEach(function(elem){
				this._risks.push(elem);
			}, this);
		}
	}

	// Return true if Risk is available
	// risks: Array of Risks 
	isAvailable(risks) {
		for (let risk of Object.keys(risks)) {
		    let currentRisk = risks[risk];
			if (!this.availableRisks.includes(currentRisk)) { // If one of selected risks is not available reject to sell policy
				return false;
			}
		}

		return true;
	}
	
	// Sell the policy.
	// nameOfInsuredObject: Name of the insured object. Must be unique in the given period.
	// validFrom: Date and time when policy starts. Can not be in the past
	// validMonths: (number) Policy period in full months
	// selectedRisks: List of risks objects that must be included in the policy
	sellPolicy(nameOfInsuredObject, validFrom, validMonths, selectedRisks) {
		if(!dateNotPast(validFrom)) {
			console.log('error: Policy date can not be in the past');
			return;
		}

		if(!this.isAvailable(selectedRisks)) return; //refuse to sell policy if risk is not available

		let overlap = false;
		let policyClass = new Policy(); //create an instance of class to access calculateValidTill method
		let f2 = validFrom.getTime(); // validFrom candidate for new Policy object
		let t2 = policyClass.calculateValidTill(validFrom,validMonths).getTime(); // validTill candidate for new Policy object

		let sp = this.soldPolicies;

		sp.forEach(function(el){
			let f1 = el._validFrom.getTime(); // validFrom already existing Policy object
			let t1 = el.validTillUnformatted.getTime(); // valid Till already existing Policy object
			
			/*
			cases when effective periods overlap each other:
				f2<=f1 && t2>=t1
				f2>=f1 && f2<=t1
				t2>=f1 && f2<=f1

				f - from , t - to
				1 - already existing Policy object
				2 - candidate for new Policy object
			*/
			if (((f2<=f1 && t2>=t1) || (f2>=f1 && f2<=t1) || (t2>=f1 && f2<=f1)) && nameOfInsuredObject == el.nameOfInsuredObject) 
				overlap = true;
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
		let efDateTime = effectiveDate.getTime();
		let toReturn;

		policies.forEach(function(el){
			if (el.nameOfInsuredObject == nameOfInsuredObject && (efDateTime >= el.validFrom.getTime() && efDateTime <= el.validTillUnformatted.getTime())) {
				toReturn = el;
			}
			return toReturn;
		});

		return toReturn;
	}

	// Add risk to the policy of insured object.
	// nameOfInsuredObject: Name of insured object
	// risk: Risk that must be added
	// validFrom: Date when _policy_ becomes active. Can not be in the past
	addRisk(nameOfInsuredObject, risk, validFrom) {
		if(!this.isAvailable([risk])) return; //refuse to add risk if not available

		if(dateNotPast(validFrom)) {
			let currentPolicy = this.getPolicy(nameOfInsuredObject, validFrom);
			currentPolicy._selectedRisks.push(risk);
		} else {
			console.log('error: Risk date can not be in the past');
		}
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

	// Get date when policy becomes inactive
	// from: Date and time when policy starts. Can not be in the past
	// months: (number) Policy period in full months
	calculateValidTill(from, months) {
		let fromCopy = new Date(from.getTime()); //copy the argument to not change the original
		let till = new Date(fromCopy.setMonth(fromCopy.getMonth()+months));
		return new Date(till.setDate(till.getDate()-1)); //convert to needed form
	}

	// Get date when policy becomes inactive.
	get validTill() {
		return formatDate(this.calculateValidTill(this._validFrom, this._validMonths)); //return String in the 'yyyy-mm-dd' format
	}

	// Get date when policy becomes inactive.
	get validTillUnformatted() {
		return this.calculateValidTill(this._validFrom, this._validMonths); //return Date object
	}


	// Get total price of the policy. Calculate by summing up all insured risks.
	// Take into account that price of the risk is given for 1 full year. Policy/risk period can be shorter.
	get premium() {
		let sum = 0;

		this.insuredRisks.forEach(function(elem){
			sum += ((elem._yearlyPrice/12)*this._validMonths);
		},this);

		return Math.ceil(sum); //round a fraction in favor of the seller
	}
	
	// Get list of the Risks that are included in the policy at given time moment.
	get insuredRisks() {
		let arr = [];	

		this._selectedRisks.forEach(function(elem){
			arr.push(elem);
		});

		return arr;
	}
}

// Convert Date Object to String 'yyyy-mm-dd' expected in the task (.html)
// date: Date object
function formatDate(date) {
    let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

// Return true if the date is not in the past in relation to the current day, otherwise false
// date: Date object
function dateNotPast(date) {
	let nowDate = new Date();
	if(date.getTime() < nowDate.getTime()) return false;
	return true;
}

// Export classes for Jest testing framework (script.test.js)
module.exports = {
  InsuranceCompany : InsuranceCompany,
  Risk : Risk,
  Policy: Policy
}
