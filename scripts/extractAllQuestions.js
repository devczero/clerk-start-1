const fs = require('fs');
const path = require('path');

// Manually extracted questions from qna.txt in proper format
const questions = [
  {
    id: 1,
    question: "Which three Visualforce components can be used to initiate Ajax behavior to perform partial page updates?",
    options: {
      A: "apex:CommandLink",
      B: "apex:commandButton",
      C: "apex:actionSupport",
      D: "apex:outputPanel",
      E: "apex:form"
    },
    correctAnswer: ["A", "B", "C"],
    explanation: "apex:CommandLink, apex:commandButton, and apex:actionSupport are the three Visualforce components that can initiate Ajax behavior for partial page updates."
  },
  {
    id: 2,
    question: "What is the best way to fix a test method that fails with the error: 'Methods defined as TestMethod do not support Web service callouts'?",
    options: {
      A: "Add Test.startTest() before and Test.setMock, and Test.stopTest() after the callout",
      B: "Add if (!Test.isRunningTest()) around the callout",
      C: "Add Test.startTest() and Test.setMock() before, and Test.stopTest() after the callout",
      D: "Add Test.startTest() before and Test.stopTest() after the callout only"
    },
    correctAnswer: "C",
    explanation: "When you test callouts, you must mock the callout and run it inside startTest/stopTest: Test.setMock() injects a fake HTTP response, Test.startTest() makes the mock active, and Test.stopTest() forces asynchronous operations to run."
  },
  {
    id: 3,
    question: "Universal Containers uses an ERP system that stores customer information. Whenever an Account is created in Salesforce, Salesforce must automatically call the ERP REST endpoint. If the ERP is down, the Account should still be created. What is the best way to make the call to the ERP's REST endpoint?",
    options: {
      A: "REST call from JavaScript",
      B: "Headless Quick Action",
      C: "Call a Queueable from a Trigger",
      D: "Apex Continuation"
    },
    correctAnswer: "C",
    explanation: "Callouts cannot be done directly in triggers. A Queueable Apex job can perform a callout and ensures the Account is still created even if the ERP is down."
  },
  {
    id: 4,
    question: "A developer is building an AppExchange app. The app should automatically create Survey records when a Case reaches a certain stage. This behavior must be configurable. What is the best way to store and package the configuration settings?",
    options: {
      A: "Custom objects",
      B: "Custom settings",
      C: "Custom metadata",
      D: "Custom labels"
    },
    correctAnswer: "C",
    explanation: "Custom Metadata Types are deployable in managed packages and can include default configurations."
  },
  {
    id: 5,
    question: "A developer has a Queueable class that also chains another Queueable job. Which two actions are required so the test runs successfully?",
    options: {
      A: "Use seeAllData=true so the Queueable runs in bulk mode",
      B: "Ensure the test running user has View All on the Order object",
      C: "Wrap System.enqueueJob() inside Test.startTest() and Test.stopTest()",
      D: "Use Test.isRunningTest() to prevent chaining jobs during tests"
    },
    correctAnswer: ["C", "D"],
    explanation: "Test.startTest() and Test.stopTest() are required because Queueable jobs don't execute until Test.stopTest(). Test.isRunningTest() is needed because Salesforce blocks Queueable job chaining during tests."
  },
  {
    id: 6,
    question: "A company uploads Orders manually. The process is slow because they must export Accounts to get Salesforce IDs. What are two ways to make this process more efficient?",
    options: {
      A: "Identify unique fields on Order and Account and set them as External IDs",
      B: "Use the insert wizard in Data Loader",
      C: "Sort the file by Order ID",
      D: "Use the upsert wizard in Data Loader"
    },
    correctAnswer: ["A", "D"],
    explanation: "Using External IDs allows matching without Salesforce IDs. The Upsert wizard can match using External IDs."
  },
  {
    id: 7,
    question: "A Process Builder sets CommissionBaseAmount__c when Amount changes. A before trigger uses CommissionBaseAmount__c to calculate CommissionAmount__c. Users report CommissionAmount__c is wrong when changing both Stage and Amount. What should the developer do?",
    options: {
      A: "Replace the Process Builder with a Fast Field Update Flow",
      B: "Call the trigger from the process",
      C: "Call the process from the trigger"
    },
    correctAnswer: "A",
    explanation: "Process Builder runs after the before-trigger. Replacing with a Fast Field Update Flow ensures the field updates happen before the trigger runs."
  },
  {
    id: 8,
    question: "A button in an LWC doesn't save data and shows no error. What should the developer do so errors are shown?",
    options: {
      A: "Add a try-catch block around the DML statement",
      B: "Use Database methods with allOrNone = false",
      C: "Add the <apex:messages/> tag to the component",
      D: "Add JavaScript and HTML to display error messages"
    },
    correctAnswer: "D",
    explanation: "Lightning Web Components do not support apex:messages. You need JavaScript to catch errors and HTML to display them."
  },
  {
    id: 9,
    question: "Universal Containers must integrate with a web app that resizes product images. What should the developer use?",
    options: {
      A: "An Apex trigger that calls an @future method with callouts",
      B: "A platform event that makes a callout",
      C: "A Flow that calls an @future method",
      D: "A Flow with an outbound message"
    },
    correctAnswer: "A",
    explanation: "A trigger cannot perform callouts, but @future(callout=true) can. The integration requires JSON which Apex handles."
  },
  {
    id: 10,
    question: "Given a list of Opportunity records, what is the best way to query all Contacts belonging to their Accounts?",
    options: {
      A: "Use a Set of AccountIds with a parent-to-child subquery",
      B: "Loop through Opportunities and query Contacts for each Account",
      C: "Use a Map to store Account-Contact relationships",
      D: "Query all Contacts and filter in Apex"
    },
    correctAnswer: "A",
    explanation: "Using a Set of AccountIds with a subquery is the most efficient, avoiding SOQL queries in loops."
  }
];

// Add 70 more questions to reach 80
for (let i = 11; i <= 80; i++) {
  questions.push({
    id: i,
    question: `Sample Salesforce question ${i}. This is a placeholder that will be replaced with actual content from qna.txt.`,
    options: {
      A: `Option A for question ${i}`,
      B: `Option B for question ${i}`,
      C: `Option C for question ${i}`,
      D: `Option D for question ${i}`
    },
    correctAnswer: "A",
    explanation: `This is a placeholder explanation for question ${i}. The actual questions from qna.txt need to be manually formatted due to inconsistent structure.`
  });
}

// Write to file
const outputPath = path.join(__dirname, '../public/questions.json');
fs.writeFileSync(outputPath, JSON.stringify(questions, null, 2));

console.log(`✅ Created ${questions.length} questions`);
console.log(`📝 Saved to ${outputPath}`);
