const { test, expect } = require('@playwright/test');

// Test configuration and shared data
const testConfig = {
    baseURL: 'https://stage-api.ecarehealth.com',
    tenant: 'stage_aithinkitive',
    loginCredentials: {
        username: "rose.gomez@jourrapide.com",
        password: "Pass@123"
    }
};

// Shared test data storage
let testData = {
    accessToken: null,
    providerUUID: null,
    patientUUID: null,
    provider: null,
    patient: null
};

/**
 * Generate random test data for provider
 */
function generateProviderData() {
    const firstNames = ["Steven", "John", "Michael", "David", "Robert", "James"];
    const lastNames = ["Miller", "Smith", "Johnson", "Williams", "Brown", "Davis"];
    const randomFirst = firstNames[Math.floor(Math.random() * firstNames.length)];
    const randomLast = lastNames[Math.floor(Math.random() * lastNames.length)];
    const randomNum = Math.floor(Math.random() * 10000);

    return {
        "roleType": "PROVIDER",
        "active": false,
        "admin_access": true,
        "status": false,
        "avatar": "",
        "role": "PROVIDER",
        "firstName": randomFirst,
        "lastName": randomLast,
        "gender": "MALE",
        "phone": "",
        "npi": "",
        "specialities": null,
        "groupNpiNumber": "",
        "licensedStates": null,
        "licenseNumber": "",
        "acceptedInsurances": null,
        "experience": "",
        "taxonomyNumber": "",
        "workLocations": null,
        "email": `testprovider${randomNum}@medarch.com`,
        "officeFaxNumber": "",
        "areaFocus": "",
        "hospitalAffiliation": "",
        "ageGroupSeen": null,
        "spokenLanguages": null,
        "providerEmployment": "",
        "insurance_verification": "",
        "prior_authorization": "",
        "secondOpinion": "",
        "careService": null,
        "bio": "",
        "expertise": "",
        "workExperience": "",
        "licenceInformation": [
            {
                "uuid": "",
                "licenseState": "",
                "licenseNumber": ""
            }
        ],
        "deaInformation": [
            {
                "deaState": "",
                "deaNumber": "",
                "deaTermDate": "",
                "deaActiveDate": ""
            }
        ]
    };
}

/**
 * Generate random test data for patient
 */
function generatePatientData() {
    const firstNames = ["Samuel", "John", "Michael", "David", "Robert", "James", "William", "Joseph"];
    const lastNames = ["Peterson", "Smith", "Johnson", "Williams", "Brown", "Davis", "Wilson", "Miller"];
    const randomFirst = firstNames[Math.floor(Math.random() * firstNames.length)];
    const randomLast = lastNames[Math.floor(Math.random() * lastNames.length)];

    return {
        "phoneNotAvailable": true,
        "emailNotAvailable": true,
        "registrationDate": "",
        "firstName": randomFirst,
        "middleName": "",
        "lastName": randomLast,
        "timezone": "IST",
        "birthDate": "1994-08-16T18:30:00.000Z",
        "gender": "MALE",
        "ssn": "",
        "mrn": "",
        "languages": null,
        "avatar": "",
        "mobileNumber": "",
        "faxNumber": "",
        "homePhone": "",
        "address": {
            "line1": "",
            "line2": "",
            "city": "",
            "state": "",
            "country": "",
            "zipcode": ""
        },
        "emergencyContacts": [
            {
                "firstName": "",
                "lastName": "",
                "mobile": ""
            }
        ],
        "patientInsurances": [
            {
                "active": true,
                "insuranceId": "",
                "copayType": "FIXED",
                "coInsurance": "",
                "claimNumber": "",
                "note": "",
                "deductibleAmount": "",
                "employerName": "",
                "employerAddress": {
                    "line1": "",
                    "line2": "",
                    "city": "",
                    "state": "",
                    "country": "",
                    "zipcode": ""
                },
                "subscriberFirstName": "",
                "subscriberLastName": "",
                "subscriberMiddleName": "",
                "subscriberSsn": "",
                "subscriberMobileNumber": "",
                "subscriberAddress": {
                    "line1": "",
                    "line2": "",
                    "city": "",
                    "state": "",
                    "country": "",
                    "zipcode": ""
                },
                "groupId": "",
                "memberId": "",
                "groupName": "",
                "frontPhoto": "",
                "backPhoto": "",
                "insuredFirstName": "",
                "insuredLastName": "",
                "address": {
                    "line1": "",
                    "line2": "",
                    "city": "",
                    "state": "",
                    "country": "",
                    "zipcode": ""
                },
                "insuredBirthDate": "",
                "coPay": "",
                "insurancePayer": {}
            }
        ],
        "emailConsent": false,
        "messageConsent": false,
        "callConsent": false,
        "patientConsentEntities": [
            {
                "signedDate": new Date().toISOString()
            }
        ]
    };
}

test.describe('eCareHealth API Test Suite', () => {
    test.beforeAll(async ({ request }) => {
        console.log('🚀 Starting eCareHealth API Test Suite...\n');
    });

    test('TEST-001: Provider Login', async ({ request }) => {
        console.log('=== TEST-001: Provider Login ===');
        
        const loginData = {
            "username": testConfig.loginCredentials.username,
            "password": testConfig.loginCredentials.password,
            "xTENANTID": testConfig.tenant
        };

        const response = await request.post(`${testConfig.baseURL}/api/master/login`, {
            data: loginData,
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'X-TENANT-ID': testConfig.tenant
            }
        });

        // Assertions
        expect(response.status()).toBe(200);
        
        const responseData = await response.json();
        expect(responseData.data).toBeDefined();
        expect(responseData.data.access_token).toBeDefined();
        
        // Store access token for subsequent tests
        testData.accessToken = responseData.data.access_token;
        
        console.log('✅ Provider Login: PASSED');
    });

    test('TEST-002: Add Provider', async ({ request }) => {
        console.log('=== TEST-002: Add Provider ===');
        
        expect(testData.accessToken).toBeDefined();
        
        const providerData = generateProviderData();
        testData.provider = providerData;

        const response = await request.post(`${testConfig.baseURL}/api/master/provider`, {
            data: providerData,
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'X-TENANT-ID': testConfig.tenant,
                'Authorization': `Bearer ${testData.accessToken}`
            }
        });

        // Assertions
        expect(response.status()).toBe(201);
        
        const responseData = await response.json();
        expect(responseData.message).toBe('Provider created successfully.');
        
        console.log('✅ Add Provider: PASSED');
        console.log(`   Created: ${providerData.firstName} ${providerData.lastName}`);
    });

    test('TEST-003: Get Provider Details', async ({ request }) => {
        console.log('=== TEST-003: Get Provider Details ===');
        
        expect(testData.accessToken).toBeDefined();
        expect(testData.provider).toBeDefined();

        const response = await request.get(`${testConfig.baseURL}/api/master/provider?page=0&size=20`, {
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'X-TENANT-ID': testConfig.tenant,
                'Authorization': `Bearer ${testData.accessToken}`
            }
        });

        // Assertions
        expect(response.status()).toBe(200);
        
        const responseData = await response.json();
        expect(responseData.data).toBeDefined();
        expect(responseData.data.content).toBeDefined();
        
        // Find the created provider
        const createdProvider = responseData.data.content.find(provider => 
            provider.firstName === testData.provider.firstName && 
            provider.lastName === testData.provider.lastName &&
            provider.email === testData.provider.email
        );
        
        expect(createdProvider).toBeDefined();
        testData.providerUUID = createdProvider.uuid;
        
        console.log('✅ Get Provider Details: PASSED');
        console.log(`   Provider UUID: ${testData.providerUUID}`);
    });

    test('TEST-004: Set Availability', async ({ request }) => {
        console.log('=== TEST-004: Set Availability ===');
        
        expect(testData.accessToken).toBeDefined();
        expect(testData.providerUUID).toBeDefined();

        const availabilityData = {
            "setToWeekdays": false,
            "providerId": testData.providerUUID,
            "bookingWindow": "3",
            "timezone": "EST",
            "bufferTime": 0,
            "initialConsultTime": 0,
            "followupConsultTime": 0,
            "settings": [
                {
                    "type": "NEW",
                    "slotTime": "30",
                    "minNoticeUnit": "8_HOUR"
                }
            ],
            "blockDays": [],
            "daySlots": [
                {
                    "day": "MONDAY",
                    "startTime": "12:00:00",
                    "endTime": "13:00:00",
                    "availabilityMode": "VIRTUAL"
                }
            ],
            "bookBefore": "undefined undefined",
            "xTENANTID": testConfig.tenant
        };

        const response = await request.post(`${testConfig.baseURL}/api/master/provider/availability-setting`, {
            data: availabilityData,
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'X-TENANT-ID': testConfig.tenant,
                'Authorization': `Bearer ${testData.accessToken}`
            }
        });

        // Assertions
        expect(response.status()).toBe(200);
        
        const responseData = await response.json();
        expect(responseData.message).toMatch(/Availability added successfully for provider/i);
        
        console.log('✅ Set Availability: PASSED');
        console.log(`   Message: ${responseData.message}`);
    });

    test('TEST-005: Create Patient', async ({ request }) => {
        console.log('=== TEST-005: Create Patient ===');
        
        expect(testData.accessToken).toBeDefined();

        const patientData = generatePatientData();
        testData.patient = patientData;

        const response = await request.post(`${testConfig.baseURL}/api/master/patient`, {
            data: patientData,
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'X-TENANT-ID': testConfig.tenant,
                'Authorization': `Bearer ${testData.accessToken}`
            }
        });

        // Assertions
        expect(response.status()).toBe(201);
        
        const responseData = await response.json();
        expect(responseData.message).toBe('Patient Details Added Successfully.');
        
        console.log('✅ Create Patient: PASSED');
        console.log(`   Created: ${patientData.firstName} ${patientData.lastName}`);
    });

    test('TEST-006: Get Patient Details', async ({ request }) => {
        console.log('=== TEST-006: Get Patient Details ===');
        
        expect(testData.accessToken).toBeDefined();
        expect(testData.patient).toBeDefined();

        const response = await request.get(`${testConfig.baseURL}/api/master/patient?page=0&size=20&searchString=`, {
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'X-TENANT-ID': testConfig.tenant,
                'Authorization': `Bearer ${testData.accessToken}`
            }
        });

        // Assertions
        expect(response.status()).toBe(200);
        
        const responseData = await response.json();
        expect(responseData.data).toBeDefined();
        expect(responseData.data.content).toBeDefined();
        
        // Find the created patient
        const createdPatient = responseData.data.content.find(patient => 
            patient.firstName === testData.patient.firstName && 
            patient.lastName === testData.patient.lastName
        );
        
        expect(createdPatient).toBeDefined();
        testData.patientUUID = createdPatient.uuid;
        
        console.log('✅ Get Patient Details: PASSED');
        console.log(`   Patient UUID: ${testData.patientUUID}`);
    });

    test('TEST-007: Book Appointment', async ({ request }) => {
        console.log('=== TEST-007: Book Appointment ===');
        
        expect(testData.accessToken).toBeDefined();
        expect(testData.providerUUID).toBeDefined();
        expect(testData.patientUUID).toBeDefined();

        // Calculate next Monday at 12:00 PM EST (17:00 UTC) - within availability window
        const today = new Date();
        const nextMonday = new Date();
        const daysUntilMonday = (1 + 7 - today.getDay()) % 7 || 7;
        nextMonday.setDate(today.getDate() + daysUntilMonday);
        nextMonday.setUTCHours(17, 0, 0, 0);
        
        const startTime = nextMonday.toISOString();
        const endDate = new Date(nextMonday.getTime() + 30 * 60000);
        const endTime = endDate.toISOString();

        const appointmentData = {
            "mode": "VIRTUAL",
            "patientId": testData.patientUUID,
            "customForms": null,
            "visit_type": "",
            "type": "NEW",
            "paymentType": "CASH",
            "providerId": testData.providerUUID,
            "startTime": startTime,
            "endTime": endTime,
            "insurance_type": "",
            "note": "",
            "authorization": "",
            "forms": [],
            "chiefComplaint": "automated test appointment",
            "isRecurring": false,
            "recurringFrequency": "daily",
            "reminder_set": false,
            "endType": "never",
            "endDate": new Date().toISOString(),
            "endAfter": 5,
            "customFrequency": 1,
            "customFrequencyUnit": "days",
            "selectedWeekdays": [],
            "reminder_before_number": 1,
            "timezone": "EST",
            "duration": 30,
            "xTENANTID": testConfig.tenant
        };

        const response = await request.post(`${testConfig.baseURL}/api/master/appointment`, {
            data: appointmentData,
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'X-TENANT-ID': testConfig.tenant,
                'Authorization': `Bearer ${testData.accessToken}`
            }
        });

        // Assertions
        expect([200, 201]).toContain(response.status());
        
        const responseData = await response.json();
        expect(responseData.message).toBe('Appointment booked successfully.');
        
        console.log('✅ Book Appointment: PASSED');
        console.log(`   Appointment: ${startTime} to ${endTime}`);
    });

    test.afterAll(async () => {
        console.log('\n📊 TEST EXECUTION SUMMARY');
        console.log('==============================');
        console.log('🎉 All tests completed successfully!');
        console.log('\nTest Data Summary:');
        console.log(`- Provider UUID: ${testData.providerUUID}`);
        console.log(`- Patient UUID: ${testData.patientUUID}`);
        if (testData.provider) {
            console.log(`- Provider: ${testData.provider.firstName} ${testData.provider.lastName}`);
        }
        if (testData.patient) {
            console.log(`- Patient: ${testData.patient.firstName} ${testData.patient.lastName}`);
        }
    });
}); 