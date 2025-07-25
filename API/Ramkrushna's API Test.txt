/**
 * eCareHealth AI Session API Test Suite
 * Complete JavaScript test file using Playwright
 * 
 * This script tests the complete flow:
 * 1. Provider Login
 * 2. Add Provider
 * 3. Get Provider Details
 * 4. Set Availability
 * 5. Create Patient
 * 6. Get Patient Details  
 * 7. Book Appointment
 * 
 * Author: Automated Test Suite
 * Date: July 25, 2025
 */

const { chromium } = require('playwright');

class eCareHealthAPITester {
    constructor() {
        this.baseURL = 'https://stage-api.ecarehealth.com';
        this.tenant = 'stage_aithinkitive';
        this.accessToken = null;
        this.providerUUID = null;
        this.patientUUID = null;
        this.testResults = [];
        this.testData = {
            provider: null,
            patient: null
        };
    }

    /**
     * Generate random test data for provider
     */
    generateProviderData() {
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
    generatePatientData() {
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

    /**
     * Make HTTP request with proper headers
     */
    async makeRequest(page, method, endpoint, data = null, requiresAuth = true) {
        const url = `${this.baseURL}${endpoint}`;
        
        const headers = {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'X-TENANT-ID': this.tenant
        };

        if (requiresAuth && this.accessToken) {
            headers['Authorization'] = `Bearer ${this.accessToken}`;
        }

        const options = {
            method: method,
            headers: headers
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        const response = await page.evaluate(async ({ url, options }) => {
            const res = await fetch(url, options);
            const text = await res.text();
            return {
                status: res.status,
                data: text ? JSON.parse(text) : {},
                headers: Object.fromEntries(res.headers.entries())
            };
        }, { url, options });

        return response;
    }

    /**
     * TEST-001: Provider Login
     */
    async testProviderLogin(page) {
        console.log('=== TEST-001: Provider Login ===');
        const startTime = Date.now();

        const loginData = {
            "username": "rose.gomez@jourrapide.com",
            "password": "Pass@123",
            "xTENANTID": this.tenant
        };

        try {
            const response = await this.makeRequest(page, 'POST', '/api/master/login', loginData, false);
            
            const testResult = {
                testId: 'TEST-001',
                testName: 'Provider Login',
                endpoint: '/api/master/login',
                method: 'POST',
                expectedStatus: 200,
                actualStatus: response.status,
                success: response.status === 200 && response.data.data && response.data.data.access_token,
                executionTime: Date.now() - startTime,
                response: response.data,
                validations: [
                    {
                        description: 'Status Code = 200',
                        result: response.status === 200 ? 'PASSED' : 'FAILED'
                    },
                    {
                        description: 'Access token received',
                        result: response.data.data && response.data.data.access_token ? 'PASSED' : 'FAILED'
                    }
                ]
            };

            if (testResult.success) {
                this.accessToken = response.data.data.access_token;
                console.log('✅ Provider Login: PASSED');
            } else {
                console.log('❌ Provider Login: FAILED');
            }

            this.testResults.push(testResult);
            return testResult;

        } catch (error) {
            console.log('❌ Provider Login: ERROR -', error.message);
            const testResult = {
                testId: 'TEST-001',
                testName: 'Provider Login',
                success: false,
                error: error.message,
                executionTime: Date.now() - startTime
            };
            this.testResults.push(testResult);
            return testResult;
        }
    }

    /**
     * TEST-002: Add Provider
     */
    async testAddProvider(page) {
        console.log('=== TEST-002: Add Provider ===');
        const startTime = Date.now();

        if (!this.accessToken) {
            throw new Error('Access token not available. Login test must pass first.');
        }

        try {
            const providerData = this.generateProviderData();
            this.testData.provider = providerData;

            const response = await this.makeRequest(page, 'POST', '/api/master/provider', providerData);

            const testResult = {
                testId: 'TEST-002',
                testName: 'Add Provider',
                endpoint: '/api/master/provider',
                method: 'POST',
                expectedStatus: 201,
                actualStatus: response.status,
                success: response.status === 201 && response.data.message === 'Provider created successfully.',
                executionTime: Date.now() - startTime,
                response: response.data,
                testData: {
                    firstName: providerData.firstName,
                    lastName: providerData.lastName,
                    email: providerData.email
                },
                validations: [
                    {
                        description: 'Status Code = 201',
                        result: response.status === 201 ? 'PASSED' : 'FAILED'
                    },
                    {
                        description: 'Message = "Provider created successfully."',
                        result: response.data.message === 'Provider created successfully.' ? 'PASSED' : 'FAILED'
                    }
                ]
            };

            if (testResult.success) {
                console.log('✅ Add Provider: PASSED');
                console.log(`   Created: ${providerData.firstName} ${providerData.lastName}`);
            } else {
                console.log('❌ Add Provider: FAILED');
                console.log('   Response:', response.data);
            }

            this.testResults.push(testResult);
            return testResult;

        } catch (error) {
            console.log('❌ Add Provider: ERROR -', error.message);
            const testResult = {
                testId: 'TEST-002',
                testName: 'Add Provider',
                success: false,
                error: error.message,
                executionTime: Date.now() - startTime
            };
            this.testResults.push(testResult);
            return testResult;
        }
    }

    /**
     * TEST-003: Get Provider Details
     */
    async testGetProvider(page) {
        console.log('=== TEST-003: Get Provider Details ===');
        const startTime = Date.now();

        try {
            const response = await this.makeRequest(page, 'GET', '/api/master/provider?page=0&size=20');

            let createdProvider = null;
            if (response.data.data && response.data.data.content && this.testData.provider) {
                createdProvider = response.data.data.content.find(provider => 
                    provider.firstName === this.testData.provider.firstName && 
                    provider.lastName === this.testData.provider.lastName &&
                    provider.email === this.testData.provider.email
                );

                if (createdProvider) {
                    this.providerUUID = createdProvider.uuid;
                }
            }

            const testResult = {
                testId: 'TEST-003',
                testName: 'Get Provider Details',
                endpoint: '/api/master/provider',
                method: 'GET',
                expectedStatus: 200,
                actualStatus: response.status,
                success: response.status === 200 && !!createdProvider,
                executionTime: Date.now() - startTime,
                response: response.data,
                extractedData: {
                    providerUUID: this.providerUUID,
                    totalProviders: response.data.data?.content?.length || 0
                },
                validations: [
                    {
                        description: 'Status Code = 200',
                        result: response.status === 200 ? 'PASSED' : 'FAILED'
                    },
                    {
                        description: 'Created provider found in response',
                        result: !!createdProvider ? 'PASSED' : 'FAILED'
                    },
                    {
                        description: 'Provider UUID extracted successfully',
                        result: !!this.providerUUID ? 'PASSED' : 'FAILED'
                    }
                ]
            };

            if (testResult.success) {
                console.log('✅ Get Provider Details: PASSED');
                console.log(`   Provider UUID: ${this.providerUUID}`);
            } else {
                console.log('❌ Get Provider Details: FAILED');
            }

            this.testResults.push(testResult);
            return testResult;

        } catch (error) {
            console.log('❌ Get Provider Details: ERROR -', error.message);
            const testResult = {
                testId: 'TEST-003',
                testName: 'Get Provider Details',
                success: false,
                error: error.message,
                executionTime: Date.now() - startTime
            };
            this.testResults.push(testResult);
            return testResult;
        }
    }

    /**
     * TEST-004: Set Availability
     */
    async testSetAvailability(page) {
        console.log('=== TEST-004: Set Availability ===');
        const startTime = Date.now();

        if (!this.providerUUID) {
            throw new Error('Provider UUID not available. Get Provider test must pass first.');
        }

        try {
            const availabilityData = {
                "setToWeekdays": false,
                "providerId": this.providerUUID,
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
                "xTENANTID": this.tenant
            };

            const response = await this.makeRequest(page, 'POST', '/api/master/provider/availability-setting', availabilityData);

            const expectedMessagePattern = /Availability added successfully for provider/i;
            const actualMessage = response.data.message || "";

            const testResult = {
                testId: 'TEST-004',
                testName: 'Set Availability',
                endpoint: '/api/master/provider/availability-setting',
                method: 'POST',
                expectedStatus: 200,
                actualStatus: response.status,
                success: response.status === 200 && expectedMessagePattern.test(actualMessage),
                executionTime: Date.now() - startTime,
                response: response.data,
                availabilityConfig: {
                    day: "MONDAY",
                    timeSlot: "12:00:00 - 13:00:00",
                    mode: "VIRTUAL"
                },
                validations: [
                    {
                        description: 'Status Code = 200',
                        result: response.status === 200 ? 'PASSED' : 'FAILED'
                    },
                    {
                        description: 'Message contains "Availability added successfully for provider"',
                        result: expectedMessagePattern.test(actualMessage) ? 'PASSED' : 'FAILED'
                    }
                ]
            };

            if (testResult.success) {
                console.log('✅ Set Availability: PASSED');
                console.log(`   Message: ${actualMessage}`);
            } else {
                console.log('❌ Set Availability: FAILED');
            }

            this.testResults.push(testResult);
            return testResult;

        } catch (error) {
            console.log('❌ Set Availability: ERROR -', error.message);
            const testResult = {
                testId: 'TEST-004',
                testName: 'Set Availability',
                success: false,
                error: error.message,
                executionTime: Date.now() - startTime
            };
            this.testResults.push(testResult);
            return testResult;
        }
    }

    /**
     * TEST-005: Create Patient
     */
    async testCreatePatient(page) {
        console.log('=== TEST-005: Create Patient ===');
        const startTime = Date.now();

        try {
            const patientData = this.generatePatientData();
            this.testData.patient = patientData;

            const response = await this.makeRequest(page, 'POST', '/api/master/patient', patientData);

            const testResult = {
                testId: 'TEST-005',
                testName: 'Create Patient',
                endpoint: '/api/master/patient',
                method: 'POST',
                expectedStatus: 201,
                actualStatus: response.status,
                success: response.status === 201 && response.data.message === 'Patient Details Added Successfully.',
                executionTime: Date.now() - startTime,
                response: response.data,
                testData: {
                    firstName: patientData.firstName,
                    lastName: patientData.lastName,
                    gender: patientData.gender,
                    birthDate: patientData.birthDate
                },
                validations: [
                    {
                        description: 'Status Code = 201',
                        result: response.status === 201 ? 'PASSED' : 'FAILED'
                    },
                    {
                        description: 'Message = "Patient Details Added Successfully."',
                        result: response.data.message === 'Patient Details Added Successfully.' ? 'PASSED' : 'FAILED'
                    }
                ]
            };

            if (testResult.success) {
                console.log('✅ Create Patient: PASSED');
                console.log(`   Created: ${patientData.firstName} ${patientData.lastName}`);
            } else {
                console.log('❌ Create Patient: FAILED');
            }

            this.testResults.push(testResult);
            return testResult;

        } catch (error) {
            console.log('❌ Create Patient: ERROR -', error.message);
            const testResult = {
                testId: 'TEST-005',
                testName: 'Create Patient',
                success: false,
                error: error.message,
                executionTime: Date.now() - startTime
            };
            this.testResults.push(testResult);
            return testResult;
        }
    }

    /**
     * TEST-006: Get Patient Details
     */
    async testGetPatient(page) {
        console.log('=== TEST-006: Get Patient Details ===');
        const startTime = Date.now();

        try {
            const response = await this.makeRequest(page, 'GET', '/api/master/patient?page=0&size=20&searchString=');

            let createdPatient = null;
            if (response.data.data && response.data.data.content && this.testData.patient) {
                createdPatient = response.data.data.content.find(patient => 
                    patient.firstName === this.testData.patient.firstName && 
                    patient.lastName === this.testData.patient.lastName
                );

                if (createdPatient) {
                    this.patientUUID = createdPatient.uuid;
                }
            }

            const testResult = {
                testId: 'TEST-006',
                testName: 'Get Patient Details',
                endpoint: '/api/master/patient',
                method: 'GET',
                expectedStatus: 200,
                actualStatus: response.status,
                success: response.status === 200 && !!createdPatient,
                executionTime: Date.now() - startTime,
                response: response.data,
                extractedData: {
                    patientUUID: this.patientUUID,
                    totalPatients: response.data.data?.content?.length || 0
                },
                validations: [
                    {
                        description: 'Status Code = 200',
                        result: response.status === 200 ? 'PASSED' : 'FAILED'
                    },
                    {
                        description: 'Created patient found in response',
                        result: !!createdPatient ? 'PASSED' : 'FAILED'
                    },
                    {
                        description: 'Patient UUID extracted successfully',
                        result: !!this.patientUUID ? 'PASSED' : 'FAILED'
                    }
                ]
            };

            if (testResult.success) {
                console.log('✅ Get Patient Details: PASSED');
                console.log(`   Patient UUID: ${this.patientUUID}`);
            } else {
                console.log('❌ Get Patient Details: FAILED');
            }

            this.testResults.push(testResult);
            return testResult;

        } catch (error) {
            console.log('❌ Get Patient Details: ERROR -', error.message);
            const testResult = {
                testId: 'TEST-006',
                testName: 'Get Patient Details',
                success: false,
                error: error.message,
                executionTime: Date.now() - startTime
            };
            this.testResults.push(testResult);
            return testResult;
        }
    }

    /**
     * TEST-007: Book Appointment
     */
    async testBookAppointment(page) {
        console.log('=== TEST-007: Book Appointment ===');
        const startTime = Date.now();

        if (!this.providerUUID || !this.patientUUID) {
            throw new Error('Provider UUID or Patient UUID not available. Previous tests must pass first.');
        }

        try {
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
                "patientId": this.patientUUID,
                "customForms": null,
                "visit_type": "",
                "type": "NEW",
                "paymentType": "CASH",
                "providerId": this.providerUUID,
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
                "xTENANTID": this.tenant
            };

            const response = await this.makeRequest(page, 'POST', '/api/master/appointment', appointmentData);

            const testResult = {
                testId: 'TEST-007',
                testName: 'Book Appointment',
                endpoint: '/api/master/appointment',
                method: 'POST',
                expectedStatus: 200,
                actualStatus: response.status,
                success: (response.status === 200 || response.status === 201) && response.data.message === 'Appointment booked successfully.',
                executionTime: Date.now() - startTime,
                response: response.data,
                appointmentDetails: {
                    startTime: startTime,
                    endTime: endTime,
                    mode: "VIRTUAL",
                    type: "NEW",
                    duration: 30,
                    chiefComplaint: "automated test appointment"
                },
                validations: [
                    {
                        description: 'Status Code = 200/201',
                        result: (response.status === 200 || response.status === 201) ? 'PASSED' : 'FAILED'
                    },
                    {
                        description: 'Message = "Appointment booked successfully."',
                        result: response.data.message === 'Appointment booked successfully.' ? 'PASSED' : 'FAILED'
                    }
                ]
            };

            if (testResult.success) {
                console.log('✅ Book Appointment: PASSED');
                console.log(`   Appointment: ${startTime} to ${endTime}`);
            } else {
                console.log('❌ Book Appointment: FAILED');
                console.log('   Response:', response.data);
            }

            this.testResults.push(testResult);
            return testResult;

        } catch (error) {
            console.log('❌ Book Appointment: ERROR -', error.message);
            const testResult = {
                testId: 'TEST-007',
                testName: 'Book Appointment',
                success: false,
                error: error.message,
                executionTime: Date.now() - startTime
            };
            this.testResults.push(testResult);
            return testResult;
        }
    }

    /**
     * Generate comprehensive test report
     */
    generateTestReport() {
        const totalTests = this.testResults.length;
        const passedTests = this.testResults.filter(test => test.success).length;
        const failedTests = totalTests - passedTests;
        const successRate = totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(1) : 0;

        const report = {
            testSuite: "eCareHealth AI Session API Testing",
            executionDate: new Date().toISOString(),
            testEnvironment: "Stage Environment",
            baseURL: this.baseURL,
            tenant: this.tenant,
            summary: {
                totalTests: totalTests,
                passed: passedTests,
                failed: failedTests,
                successRate: `${successRate}%`,
                overallStatus: failedTests === 0 ? "PASSED" : "FAILED"
            },
            testResults: this.testResults,
            testData: {
                providerUUID: this.providerUUID,
                patientUUID: this.patientUUID,
                provider: this.testData.provider ? {
                    firstName: this.testData.provider.firstName,
                    lastName: this.testData.provider.lastName,
                    email: this.testData.provider.email
                } : null,
                patient: this.testData.patient ? {
                    firstName: this.testData.patient.firstName,
                    lastName: this.testData.patient.lastName,
                    birthDate: this.testData.patient.birthDate
                } : null
            }
        };

        return report;
    }

    /**
     * Run all tests in sequence
     */
    async runAllTests() {
        console.log('🚀 Starting eCareHealth API Test Suite...\n');
        
        const browser = await chromium.launch({ headless: true });
        const context = await browser.newContext();
        const page = await context.newPage();

        try {
            // Run tests in sequence
            await this.testProviderLogin(page);
            await this.testAddProvider(page);
            await this.testGetProvider(page);
            await this.testSetAvailability(page);
            await this.testCreatePatient(page);
            await this.testGetPatient(page);
            await this.testBookAppointment(page);

            // Generate and display report
            const report = this.generateTestReport();
            
            console.log('\n📊 TEST EXECUTION SUMMARY');
            console.log('==============================');
            console.log(`Total Tests: ${report.summary.totalTests}`);
            console.log(`Passed: ${report.summary.passed}`);
            console.log(`Failed: ${report.summary.failed}`);
            console.log(`Success Rate: ${report.summary.successRate}`);
            console.log(`Overall Status: ${report.summary.overallStatus}`);
            
            if (report.summary.overallStatus === 'PASSED') {
                console.log('\n🎉 All tests completed successfully!');
            } else {
                console.log('\n⚠️  Some tests failed. Check the detailed report above.');
            }

            // Return full report for further processing if needed
            return report;

        } catch (error) {
            console.error('❌ Test execution failed:', error.message);
            throw error;
        } finally {
            await browser.close();
        }
    }
}

/**
 * Main execution function
 */
async function main() {
    try {
        const tester = new eCareHealthAPITester();
        const report = await tester.runAllTests();
        
        // You can save the report to a file or send it somewhere
        // console.log('\n📄 Full Test Report:', JSON.stringify(report, null, 2));
        
        return report;
    } catch (error) {
        console.error('Fatal error:', error.message);
        process.exit(1);
    }
}

// Export for module usage or run directly
if (require.main === module) {
    main();
}

module.exports = { eCareHealthAPITester, main };