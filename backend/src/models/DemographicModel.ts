import mongoose, { Schema, Document } from 'mongoose';

interface Demographic extends Document {
  patientdemographics: {
    0: {
      contactpreference_announcement_sms: string;
      zip: string;
      lastupdatedby: string;
      patientid: string;
      contactpreference_billing_phone: string;
      guarantordob: string;
      guarantorcountrycode: string;
      guarantorcountrycode3166: string;
      homebound: string;
      lastupdated: string;
      city: string;
      guarantorrelationshiptopatient: string;
      departmentid: string;
      firstname: string;
      contactpreference_billing_sms: string;
      portalaccessgiven: string;
      confidentialitycode: string;
      portaltermsonfile: string;
      contactpreference_lab_sms: string;
      guarantoraddress1: string;
      driverslicense: string;
      address1: string;
      primaryproviderid: string;
      dob: string;
      emailexists: string;
      primarydepartmentid: string;
      patientphoto: string;
      guarantorzip: string;
      status: string;
      contactpreference_announcement_email: string;
      sex: string;
      contactpreference_lab_email: string;
      contactpreference_appointment_email: string;
      homephone: string;
      guarantorfirstname: string;
      guarantorstate: string;
      contactpreference_announcement_phone: string;
      guarantoraddresssameaspatient: string;
      contactpreference_lab_phone: string;
      guarantorphone: string;
      balances: {
        0: {
          balance: string;
          cleanbalance: string;
        };
      };
      privacyinformationverified: string;
      consenttocall: string;
      contactpreference_appointment_phone: string;
      lastname: string;
      contactpreference_billing_email: string;
      countrycode3166: string;
      countrycode: string;
      state: string;
      caresummarydeliverypreference: string;
      registrationdate: string;
      guarantorcity: string;
      medicationhistoryconsentverified: string;
      guarantorlastname: string;
      contactpreference_appointment_sms: string;
      maritalstatusname: string;
      ethnicitycodes: {
        0: string;
        1: string;
      };
      agriculturalworker: string;
      schoolbasedhealthcenter: string;
      publichousing: string;
      ethnicitycode: string;
      language6392code: string;
      maritalstatus: string;
      ssn: string;
      race: {
        0: string;
      };
      guarantorssn: string;
      homeless: string;
      racename: string;
      racecode: string;
      firstappointment: string;
      lastappointment: string;
      veteran: string;
      mobilephone: string;
      workphone: string;
      middlename: string;
      address2: string;
      contactrelationship: string;
      contacthomephone: string;
      defaultpharmacyncpdpid: string;
      guarantoraddress2: string;
      contactname: string;
      notes: string;
      email: string;
      contactpreference: string;
      consenttotext: string;
      smsoptindate: string;
      guarantoremail: string;
      guarantormiddlename: string;
      mobilecarrierid: string;
      hasmobile: string;
      referralsourceid: string;
      altfirstname: string;
      referralsourceother: string;
      assignedsexatbirth: string;
      sexualorientation: string;
      suffix: string;
      guarantorsuffix: string;
      lastemail: string;
      contactmobilephone: string;
      nextkinrelationship: string;
      nextkinphone: string;
      nextkinname: string;
      genderidentity: string;
      driverslicensestateid: string;
      driverslicensenumber: string;
      patientphotoid: string;
      patientphotourl: string;
      preferredname: string;
      donotcall: string;
      onlinestatementonly: string;
      guardianlastname: string;
      guardianfirstname: string;
      driverslicenseexpirationdate: string;
      driverslicenseurl: string;
      employeraddress: string;
      employerstate: string;
      employername: string;
      employerzip: string;
      employerid: string;
      employercity: string;
      guarantoremployerid: string;
      preferredpronouns: string;
      deceaseddate: string;
      employerphone: string;
    };
  };
  patientdetails: {
    state: string;
    lastname: string;
    firstname: string;
    homephone: string;
    zip: string;
    enterpriseid: string;
    address1: string;
    dob: string;
    city: string;
    athenapatientid: string;
    ssn: string;
    mobilephone: string;
    address2: string;
  };
}

const DemographicSchema: Schema = new Schema({
  patientdemographics: {
    0: {
      contactpreference_announcement_sms: { type: String, required: true },
      zip: { type: String, required: true },
      lastupdatedby: { type: String, required: true },
      patientid: { type: String, required: true },
      contactpreference_billing_phone: { type: String, required: true },
      guarantordob: { type: String, required: true },
      guarantorcountrycode: { type: String, required: true },
      guarantorcountrycode3166: { type: String, required: true },
      homebound: { type: String, required: true },
      lastupdated: { type: String, required: true },
      city: { type: String, required: true },
      guarantorrelationshiptopatient: { type: String, required: true },
      departmentid: { type: String, required: true },
      firstname: { type: String, required: true },
      contactpreference_billing_sms: { type: String, required: true },
      portalaccessgiven: { type: String, required: true },
      confidentialitycode: { type: String, required: true },
      portaltermsonfile: { type: String, required: true },
      contactpreference_lab_sms: { type: String, required: true },
      guarantoraddress1: { type: String, required: true },
      driverslicense: { type: String, required: true },
      address1: { type: String, required: true },
      primaryproviderid: { type: String, required: true },
      dob: { type: String, required: true },
      emailexists: { type: String, required: true },
      primarydepartmentid: { type: String, required: true },
      patientphoto: { type: String, required: true },
      guarantorzip: { type: String, required: true },
      status: { type: String, required: true },
      contactpreference_announcement_email: { type: String, required: true },
      sex: { type: String, required: true },
      contactpreference_lab_email: { type: String, required: true },
      contactpreference_appointment_email: { type: String, required: true },
      homephone: { type: String, required: true },
      guarantorfirstname: { type: String, required: true },
      guarantorstate: { type: String, required: true },
      contactpreference_announcement_phone: { type: String, required: true },
      guarantoraddresssameaspatient: { type: String, required: true },
      contactpreference_lab_phone: { type: String, required: true },
      guarantorphone: { type: String, required: true },
      balances: {
        0: {
          balance: { type: String, required: true },
          cleanbalance: { type: String, required: true },
        },
      },
      privacyinformationverified: { type: String, required: true },
      consenttocall: { type: String, required: true },
      contactpreference_appointment_phone: { type: String, required: true },
      lastname: { type: String, required: true },
      contactpreference_billing_email: { type: String, required: true },
      countrycode3166: { type: String, required: true },
      countrycode: { type: String, required: true },
      state: { type: String, required: true },
      caresummarydeliverypreference: { type: String, required: true },
      registrationdate: { type: String, required: true },
      guarantorcity: { type: String, required: true },
      medicationhistoryconsentverified: { type: String, required: true },
      guarantorlastname: { type: String, required: true },
      contactpreference_appointment_sms: { type: String, required: true },
      maritalstatusname: { type: String, required: true },
      ethnicitycodes: {
        0: { type: String, required: true },
        1: { type: String, required: true },
      },
      agriculturalworker: { type: String, required: true },
      schoolbasedhealthcenter: { type: String, required: true },
      publichousing: { type: String, required: true },
      ethnicitycode: { type: String, required: true },
      language6392code: { type: String, required: true },
      maritalstatus: { type: String, required: true },
      ssn: { type: String, required: true },
      race: {
        0: { type: String, required: true },
      },
      guarantorssn: { type: String, required: true },
      homeless: { type: String, required: true },
      racename: { type: String, required: true },
      racecode: { type: String, required: true },
      firstappointment: { type: String, required: true },
      lastappointment: { type: String, required: true },
      veteran: { type: String, required: true },
      mobilephone: { type: String, required: true },
      workphone: { type: String, required: true },
      middlename: { type: String, required: true },
      address2: { type: String, required: true },
      contactrelationship: { type: String, required: true },
      contacthomephone: { type: String, required: true },
      defaultpharmacyncpdpid: { type: String, required: true },
      guarantoraddress2: { type: String, required: true },
      contactname: { type: String, required: true },
      notes: { type: String, required: true },
      email: { type: String, required: true },
      contactpreference: { type: String, required: true },
      consenttotext: { type: String, required: true },
      smsoptindate: { type: String, required: true },
      guarantoremail: { type: String, required: true },
      guarantormiddlename: { type: String, required: true },
      mobilecarrierid: { type: String, required: true },
      hasmobile: { type: String, required: true },
      referralsourceid: { type: String, required: true },
      altfirstname: { type: String, required: true },
      referralsourceother: { type: String, required: true },
      assignedsexatbirth: { type: String, required: true },
      sexualorientation: { type: String, required: true },
      suffix: { type: String, required: true },
      guarantorsuffix: { type: String, required: true },
      lastemail: { type: String, required: true },
      contactmobilephone: { type: String, required: true },
      nextkinrelationship: { type: String, required: true },
      nextkinphone: { type: String, required: true },
      nextkinname: { type: String, required: true },
      genderidentity: { type: String, required: true },
      driverslicensestateid: { type: String, required: true },
      driverslicensenumber: { type: String, required: true },
      patientphotoid: { type: String, required: true },
      patientphotourl: { type: String, required: true },
      preferredname: { type: String, required: true },
      donotcall: { type: String, required: true },
      onlinestatementonly: { type: String, required: true },
      guardianlastname: { type: String, required: true },
      guardianfirstname: { type: String, required: true },
      driverslicenseexpirationdate: { type: String, required: true },
      driverslicenseurl: { type: String, required: true },
      employeraddress: { type: String, required: true },
      employerstate: { type: String, required: true },
      employername: { type: String, required: true },
      employerzip: { type: String, required: true },
      employerid: { type: String, required: true },
      employercity: { type: String, required: true },
      guarantoremployerid: { type: String, required: true },
      preferredpronouns: { type: String, required: true },
      deceaseddate: { type: String, required: true },
      employerphone: { type: String, required: true },
    },
  },
  patientdetails: {
    state: { type: String, required: true },
    lastname: { type: String, required: true },
    firstname: { type: String, required: true },
    homephone: { type: String, required: true },
    zip: { type: String, required: true },
    enterpriseid: { type: String, required: true },
    address1: { type: String, required: true },
    dob: { type: String, required: true },
    city: { type: String, required: true },
    athenapatientid: { type: String, required: true },
    ssn: { type: String, required: true },
    mobilephone: { type: String, required: true },
    address2: { type: String, required: true },
  },
}, { collection: 'demographic' });

const DemographicModel = mongoose.model<Demographic>('Demographic', DemographicSchema);

export default DemographicModel;