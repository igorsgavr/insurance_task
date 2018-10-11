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




var fireRisk = new Risk('Fire', 50);
var theftRisk = new Risk('Theft', 100);
var availableRisks = [fireRisk, theftRisk];
var copmanyInstance = new InsuranceCompany();
copmanyInstance.setAvailableRisks(availableRisks);

var policyStartDate = new Date(2019, 0, 1);
let policy = copmanyInstance.sellPolicy('Garage', policyStartDate, 12, [theftRisk]);

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
	expect(policy.validTill.toString()).toContain('Dec 31 2019'); //will compare two strings instead of Date objects to avoid native js 'one day off' bug
})
