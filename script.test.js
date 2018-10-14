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

// Create some repeatable objects outside test
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
	expect(policy.validTill).toEqual('2020-12-31');
})

test('policy get current risks array',() => {
	expect(policy.insuredRisks).toEqual([{_name: 'Fire', _yearlyPrice: 50}, {_name: 'Theft', _yearlyPrice: 100}]);
})

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


test('calculate premium for full year',() => {
	expect(policy.premium).toBe(150);
})

test('calculate premium for 4 months',() => {
	let policyStartDate2 = new Date(2024, 4, 17);
	let policy2 = copmanyInstance.sellPolicy('Garage', policyStartDate2, 4, [fireRisk,theftRisk]);

	expect(policy2.premium).toBe(50);
})

test('calculate premium for 11 months with odd yearly sum',() => {
	let policyStartDate2 = new Date(2025, 4, 17);
	let floodRisk = new Risk('Flood', 133);
	copmanyInstance.setAvailableRisks(floodRisk);
	let policy2 = copmanyInstance.sellPolicy('Garage', policyStartDate2, 11, [floodRisk]);

	expect(policy2.premium).toBe(122);
})

test('get policy for "Garage" object for 5 May 2020',() => {
	let dateMay = new Date(2020, 4, 5);
	expect(copmanyInstance.getPolicy('Garage', dateMay)).toHaveProperty('_nameOfInsuredObject','Garage');
})

test('add risk after policy is sold to the "Garage" object with policy, starting 17-05-2026 ',() => {
	let policyStartDate2 = new Date(2026, 4, 17);
	let floodRisk = new Risk('Flood', 133);
	copmanyInstance.setAvailableRisks([floodRisk,fireRisk,theftRisk]);
	let policy2 = copmanyInstance.sellPolicy('Garage', policyStartDate2, 11, [fireRisk,theftRisk]);

	copmanyInstance.addRisk('Garage', floodRisk, policyStartDate2); //find policy with name 'Garage' and start day 17-05-2026 and add risk

	expect(policy2.insuredRisks.length).toBe(3);
})

test('premium price with later added risk must be recalculated',() => {
	let policyStartDate2 = new Date(2027, 4, 17);
	let floodRisk = new Risk('Flood', 40);
	copmanyInstance.setAvailableRisks([floodRisk,fireRisk,theftRisk]);
	let policy2 = copmanyInstance.sellPolicy('Garage', policyStartDate2, 6, [fireRisk,theftRisk]);

	copmanyInstance.addRisk('Garage', floodRisk, policyStartDate2);

	expect(policy2.premium).toBe(95);
})

test('policy date can not be in the past',() => {
	let incorrectDate = new Date(2000, 10, 30);
	let policyInvalid = copmanyInstance.sellPolicy('Office', incorrectDate, 2, [theftRisk]);

	expect(policyInvalid).toBeUndefined();
})

test('risk date can not be in the past ',() => {
	let riskDate = new Date(1998, 2, 25);
	expect(copmanyInstance.addRisk('Garage', theftRisk, riskDate)).toBeFalsy();
})

test('can not sell policy with risk which is not in available list',() => {
	let incorrectDate = new Date(2030, 10, 30);
	let newrisk = new Risk('newrisk', 250);
	let policyNewRisk = copmanyInstance.sellPolicy('Office', incorrectDate, 2, [newrisk]);

	expect(policyNewRisk).toBeUndefined();
})
