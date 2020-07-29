import * as functions from 'firebase-functions';

import * as bodyParser from "body-parser";
import * as express from "express"

import * as admin from "firebase-admin"

import { asyncHandler, buildValidator } from "./middleware"
import Joi = require('@hapi/joi');


// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//

admin.initializeApp()
const Firestore = admin.firestore()

const app = express();
app.use(bodyParser.json());

app.get("/", asyncHandler( async (request, response, next) => { 
  response.send("alive 💪")
}))

/*
 *
 * TIP:
 * 
 * for field validation use Joi
 * there is a middleware `buildValidator` already defined
 * just figure out how to define the right Joi schema and use the middleware
 * 
 * the 'buildValidator' middleware will also handle all the errors
 */


/*
 *
 * database models
 * 
 * USER:
 *   collection name: 'users'
 *   object structure:
 *     { 
 *       name: string, 
 *       quizIds: string[]
 *     }
 * 
 * 
 * QUIZ:
 *   collection name: 'quizzes'
 *   object structure:
 *     { 
 *       name: string, 
 *       description: string
 *       active: boolean
 *       userCount: number
 *     }
*/
const usersColl = Firestore.collection("users")
const quizzesColl = Firestore.collection("quizzes")

const userSchema = Joi.object({
  name: Joi.string()
    .required(),
  quizIds: Joi.array()
    .items(Joi.string())
    .default([])
});

const quizSchema = Joi.object({
  name: Joi.string()
    .required()
    .min(1), 
  description: Joi.string()
    .optional()
    .min(1),
  active: Joi.boolean()
    .optional()
    .default(false),
  userCount: Joi.number()
    .default(0),
  createdOn: Joi.date()
    .default(admin.firestore.FieldValue.serverTimestamp())
});

/*
 * create a user
 *
 * 
 * ROUTE: 
 *   POST /users
 *
 * expected body JSON:
 * {
 *   name: "Bob Builder"
 * }
 * 
 * name: string, required, min length 1
 *  
 * EXPECTED RESPONSE:
 * JSON
  {
      "id": "uAWoWFpknToBcdZ7GF59",
      "quizIds": [],
      "name": "Bob Builder"
  }
 * 
 */
app.post("/users", buildValidator(userSchema, 'body'),
  asyncHandler( async (request, response, next) => { 

  const body = request.body;
  const createdUser = await createDocument(body, usersColl);

  response.status(createdUser.status).json(createdUser.data);
}));

/*
 * get a user
 *
 * 
 * ROUTE: 
 *   GET /users/:userId
 *  
 * EXPECTED RESPONSE:
 * JSON
 * {
 *   ... dump all the properties of the created user ...
 * }
 * 
 */
app.get("/users/:userId", 
  asyncHandler( async (request, response, next) => { 

  // @TODO: IMPLEMENT ME
  const userId = request.params.userId;

  const res = await getDocument(userId, usersColl);
  response.status(res.status).json(res.data);
}))

 /*
 * delete a user
 * 
 * name: string, required, can't be blank
 * 
 * ROUTE: 
 *   POST /users
 * 
 * EXPECTED RESPONSE:
 * JSON
 * {
 *   user: {
 *      ... dump all the properties of the created user ...
 *   }
 * }
 * 
 */
app.delete("/users/:userId", asyncHandler( async (request, response, next) => { 

  // @TODO: IMPLEMENT ME
  const userId = request.params.userId;
  const deletedUser = await deleteDocument(userId, usersColl);

  response.status(deletedUser.status).json(deletedUser.data)
}))


/*
 * create an individual quiz
 *
 * expected JSON body:
 * {
 *   name: "Quiz 2",
 *   description: "this is a quiz to do something",
 *   active: false
 * }
 * 
 * name: string, required, can't be blank
 * description: string, optional, can't be blank
 * active: boolean, optional, defaults to false
 * 
 * ROUTE: 
 *   POST /quizes
 * 
 * EXPECTED RESPONSE:
 * JSON
    "quiz": {
        "id": "KltYLDxCbP5lX6BHWY9l",
        "description": "this is a quiz to do something",
        "active": false,
        "userCount": 0,
        "name": "Quiz 2",
        "createdOn": {
            "_seconds": 1595465567,
            "_nanoseconds": 643000000
        }
    }
 * 
 * 
 * TIP: for your createdOn value, in your set call, set it to 
 *  `admin.firestore.FieldValue.serverTimestamp()`, that will use the server timestamp
 * 
 */
app.post("/quizzes", buildValidator(quizSchema, 'body'),
  asyncHandler( async (request, response, next) => { 

  // @TODO: IMPLEMENT ME
  const body = request.body;
  const createdQuiz = await createDocument(body, quizzesColl);

  response.status(createdQuiz.status).json(createdQuiz.data);
}))


/*
 * partially update an individual quiz
 * 
 * Epected JSON:
 *   fields thesame as in create but can send one field at a time
 * 
 * name: string, optional, can't be blank
 * description: string, optional, can't be blank
 * active: boolean, optional
 * 
 * ROUTE: 
 *   PATCH /quizes/:quizId
 * 
 * EXPECTED RESPONSE:
 * JSON
 * {
 *   quiz: {
 *      ... dump all the properties of the updated quiz ...
 *   }
 * }
 * 
 */
app.patch("/quizzes/:quizId", buildValidator(quizSchema, 'body'),
  asyncHandler( async (request, response, next) => { 

  // @TODO: IMPLEMENT ME
  const quizId = request.params.quizId;
  const body = request.body;

  const res = await updateDocument(quizId, body, quizzesColl);

  response.status(res.status).json(res.data);
}))

/*
 * get an individual quiz
 *
 * ROUTE: 
 *   GET /quizes/:quizId
 * 
 * EXPECTED RESPONSE:
 * JSON
 * {
 *   quiz: {
 *      ... dump all the properties of the fetched quiz ...
 *   }
 * }
 */
app.get("/quizzes/:quizId", asyncHandler( async (request, response, next) => { 
  const quizId = request.params.quizId;

  const res = await getDocument(quizId, quizzesColl);
  response.status(res.status).json(res.data);
}));

/*
 * delete an individual quiz
 *
 * ROUTE: 
 *   DELETE /quizes/:quizId
 * 
 * EXPECTED RESPONSE:
 * JSON
 * {
 *   quiz: {
 *      ... dump all the properties of the deleted quiz ...
 *   }
 * }
 */
app.delete("/quizzes/:quizId", asyncHandler( async (request, response, next) => { 
  const quizId = request.params.quizId;
  const deletedQuiz = await deleteDocument(quizId, quizzesColl);

  response.status(deletedQuiz.status).json(deletedQuiz.data)
}))

/*
 * list latest 10 quizzes (ignore pagination)
 *
 * ROUTE: 
 *   GET /quizes
 * 
 * EXPECTED RESPONSE:
 * JSON
 * {
 *   quizes: [
 *      ... dump all the properties of the deleted quiz ...,
 *      ... dump all the properties of the deleted quiz ...,
 *      ...
 *   ]
 * }
 * 
 */
app.get("/quizzes", asyncHandler( async (request, response, next) => { 
  try {
    const quizzes = (await quizzesColl.orderBy('createdOn', 'desc').limit(10).get()).docs.map(doc => doc.data());
    response.status(200).json(quizzes);
  } catch (error) {
    response.status(500);
  }
}))

 /*
 * add a users to a quiz
 *
 * 
 * Should append the quiz id to the array of quizes on the user object in the database
 * Should increment the `userCount` on the quiz object 
 *   - if the user is already part of the quiz, do not imcrement
 * Both operations should be done in a Firestore transaction
 * 
 * ROUTE: 
 *   POST /users/:userId/quizes/:quizId
 * 
 * expected JSON body:
 * {} // blank body
 * 
 * EXPECTED RESPONSE:
 * JSON
  {
      "quiz": {
          "id": "KltYLDxCbP5lX6BHWY9l",
          "description": "this is a quiz to do something",
          "active": false,
          "name": "Quiz 2",
          "createdOn": {
              "_seconds": 1595465567,
              "_nanoseconds": 643000000
          },
          "userCount": 1
      },
      "user": {
          "id": "uAWoWFpknToBcdZ7GF59",
          "name": "Bob Builder",
          "quizIds": [
              "KltYLDxCbP5lX6BHWY9l"
          ]
      }
  }
 */
app.post("/users/:userId/quizes/:quizId", asyncHandler( async (request, response, next) => { 
  // @TODO: IMPLEMENT ME
  const userId = request.params.userId;
  const quizId = request.params.quizId;

  const user = await getDocument(userId, usersColl);
  if (user.status === 200) {
    const quiz = await getDocument(quizId, quizzesColl);
    if (quiz.status === 200 && !user.data.quizIds.includes(quizId)) {
      const userUpdateData =  { quizIds: admin.firestore.FieldValue.arrayUnion(quiz.data.id) };
      const quizUpateData = { userCount: quiz.data.userCount + 1 }

      const updatedUser = await updateDocument(userId, userUpdateData, usersColl);
      const updatedQuiz = await updateDocument(quizId, quizUpateData, quizzesColl);

      response.status(200).json({ quiz: updatedQuiz.data, user: updatedUser.data });

    } else {
      response.status(quiz.status).json( user.data.quizIds.includes(quizId) ? { data: 'User has that Quiz' } : quiz.data);
    }
  } else {
    response.status(user.status).json(user.data);
  }
}))

async function createDocument(body: string, firestoreCollection: any) {
  try {
    const document = await firestoreCollection.add(body);
    const createdDocument = await getDocument(document.id, firestoreCollection);

    return createdDocument;
  } catch (error) {
    return { status: 500, data: {} };
  }
}

async function getDocument(fieldId: string, firestoreCollection: any) {
  try {
    const collectionRef = firestoreCollection.doc(fieldId);
    const document = await collectionRef.get();

    if (document.exists) {
      return { status: 200, data: { ...document.data(), id: fieldId } };
    }
    return { status: 404, data: {} };
  } catch (error) {
    return { status: 500, data: {} };
  }
}

async function updateDocument(fieldId: string, data: any, firestoreCollection: any) {
  try {
    const collectionRef = firestoreCollection.doc(fieldId);
    const documentUpdated = await collectionRef.update(data);
    const document = await getDocument(fieldId, firestoreCollection);
    
    return document;
  } catch (error) {
    return { status: 500, data: {} };
  }
}

async function deleteDocument(fieldId: string, firestoreCollection: any) {
  try {
    const collectionRef = firestoreCollection.doc(fieldId);
    if (collectionRef) {
      await collectionRef.delete();
      return { status: 200, data: {} };
    }

    return { status: 404, data: {} };
  } catch (error) {
    return { status: 500, data: {} };
  }
}

// Expose Express API as a single Cloud Function:
exports.api = functions.https.onRequest(app);