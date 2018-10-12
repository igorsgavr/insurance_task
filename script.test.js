const { InsuranceCompany, Risk, Policy } = require('./script.js');


test('company set name',() => {
	let copmanyInstance = new InsuranceCompany('abc');
	expect(copmanyInstance._name).toBeTruthy()
})

test('company get name',() => {
	let copmanyInstance = new InsuranceCompany('abc');
	expect(copmanyInstance.name).toEqual('abc')
})

test('risk construct',() => {
	let riskInstance = new Risk('fire',150);
	expect(riskInstance).toBeTruthy()
})

test('risk get name',() => {
	let riskInstance = new Risk('fire',150);
	expect(riskInstance.name).toBe('fire')
})

test('risk get yearly price',() => {
	let riskInstance = new Risk('fire',150);
	expect(riskInstance.yearlyPrice()).toBe(150)
})

test('set available risks',() => {
	let copmanyInstance = new InsuranceCompany('abc');
	let storm = new Risk('storm',90);
	let fire = new Risk('fire',115);
	let availableRisks = [storm, fire];

	copmanyInstance.setAvailableRisks(availableRisks);
	expect(copmanyInstance._risks).not.toHaveLength(0);
})

test('get available risks',() => {
	let copmanyInstance = new InsuranceCompany('abc');
	let storm = new Risk('storm',90);
	let fire = new Risk('fire',115);
	let availableRisks = [storm, fire];

	copmanyInstance.setAvailableRisks(availableRisks);
	expect(copmanyInstance.availableRisks).toEqual([{_name: 'storm', _yearlyPrice: 90}, {_name: 'fire', _yearlyPrice: 115}]);
})


let fireRisk = new Risk('Fire', 50);
let theftRisk = new Risk('Theft', 100);
let availableRisks = [fireRisk, theftRisk];
let copmanyInstance = new InsuranceCompany();
copmanyInstance.setAvailableRisks(availableRisks);

let policyStartDate = new Date(2020, 0, 1);
let policy = copmanyInstance.sellPolicy('Garage', policyStartDate, 12, [fireRisk,theftRisk]);

test('sell policy',() => {
	expect(policy).toMatchObject({
	    _nameOfInsuredObject: expect.any(String),
	    _validFrom: expect.any(Date),
	    _validMonths: expect.any(Number),
	    _selectedRisks: expect.any(Array)
	  });
})

test('policy get object name',() => {
	expect(policy.nameOfInsuredObject).toBe('Garage');
})

test('policy get valid from Date',() => {
	expect(policy.validFrom).toBe(policyStartDate);
})

test('policy get valid till Date',() => {
	expect(policy.validTill.toString()).toContain('Dec 31 2020'); //will compare Strings instead of Date objects to avoid native js 'one day off' bug
})

test('policy get current risks array',() => {
	expect(policy.insuredRisks).toEqual([{_name: 'Fire', _yearlyPrice: 50}, {_name: 'Theft', _yearlyPrice: 100}]);
})

/*

test('get policy for "Garage" object for 5 March 2019',() => {
	var dateMarch = new Date(2019, 4, 5);
	expect(copmanyInstance.getPolicy('Garage',dateMarch)).not.toHaveLength(0);
})

test('company get all sold policies',() => {
	let date1 = new Date(2019, 2, 27);
	let date2 = new Date(2019, 4, 18);
	let policy2 = copmanyInstance.sellPolicy('Garage', date1, 1, [fireRisk]);
	let policy3 = copmanyInstance.sellPolicy('Garage', date2, 3, [fireRisk,theftRisk]);

	expect(copmanyInstance.soldPolicies).toHaveLength(3);
})

test('get policy for "Garage" object for 5 March 2019',() => {
	var dateMarch = new Date(2019, 4, 5);
	expect(copmanyInstance.getPolicy('Garage',dateMarch)).not.toHaveLength(0);
})
*/

test('can not sell two policies with the same effective period',() => {
	let policy2 = copmanyInstance.sellPolicy('Garage', policyStartDate, 12, [fireRisk,theftRisk]);
	expect(copmanyInstance.soldPolicies.length).toBe(1);
})

test('can not sell policy with effective period inside other policy period',() => {
	let policyStartDate2 = new Date(2020, 4, 17);
	let policy2 = copmanyInstance.sellPolicy('Garage', policyStartDate2, 4, [fireRisk,theftRisk]);

	expect(copmanyInstance.soldPolicies.length).toBe(1);
})

test('can sell many policies with different effective periods',() => {
	let policyStartDate2 = new Date(2021, 5, 1);
	let policy2 = copmanyInstance.sellPolicy('Garage', policyStartDate2, 4, [fireRisk,theftRisk]);

	let policyStartDate3 = new Date(2022, 2, 2);
	let policy3 = copmanyInstance.sellPolicy('Garage', policyStartDate3, 6, [theftRisk]);

	let policyStartDate4 = new Date(2023, 8, 22);
	let policy4 = copmanyInstance.sellPolicy('Garage', policyStartDate4, 1, [fireRisk]);

	expect(copmanyInstance.soldPolicies.length).toBe(4);
})

test('can sell two policies with the same effective period if insurance objects are different',() => {
	let policy2 = copmanyInstance.sellPolicy('House', policyStartDate, 12, [fireRisk,theftRisk]);
	expect(copmanyInstance.soldPolicies.length).toBe(5);
})


