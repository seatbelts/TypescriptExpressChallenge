
## Express Challenge

### Description

To test your familiarity or ability to quickly pick up our stack, we ask you to create a small CRUD API that uses Node, Typescript, and the Firestore Emulator. The entire project will run locally on your machine using Firebase's emulators for their cloud services.

You will create the API using Express that is sitting behind a Firebase function. All the API routes are already stubbed out. Your task is to fill them out. All the specifications are in the comments in [functions/src/index.ts](functions/src/index.ts).

Read the comments closely: they contain a few tips that will clarify certain peculiarities of the Firestore.

### Setup

- Install Node.js

- Install OpenJDK (need this for the local Firestore emulator)

- Install Firebase Tools globally `npm install -g firebase-tools`

- All the code is in the `functions` folder

- Out of `functions` run `npm run install`, 

- To start the API out of `functions` run `npm run serve` out 

- To verify that all started well, in your browser go to the URL that is defined by `✔  functions[api]: http function initialized (...)` in the terminal

- You should see `alive 💪` as a response

### Firestore

- Every single time you rerun `npm run serve`, your data will be erased on the Firestore Emulator and replaced with a base set of data your APIs should be able to recreate. 

- If you are ever confused at what objects your APIs should create, look at the prepopulated objects in the Firestore through the `Emulator UI`

### Task

- Copy this repository into your own PRIVATE repository on GitHub (the free plan allows you to has a private repository with up to 3 collaborators)

- Invite the GitHub users `abfinhealth` and `firemuzzy` to your Repository

- Implement the stubbed out APIs in [functions/src/index.ts](functions/src/index.ts)

- If something does not makes sense in the spec, take your best guess and finish the task
