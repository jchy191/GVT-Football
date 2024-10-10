# Govtech Annual Football Championships (Assessment)
## Getting Started

To run this locally, clone the repo and add the provided `.env` file to the root of the application.

Then, run: 

```bash
npm install
npm run dev
```


## Architecture Decisions

### Next.JS & Vercel

[Next.js](nextjs.org) was chosen as it allows me to handle both server and client code together. Not needing to have a separate frontend and backend reduces the complexity of this project and allows me to not need to worry about Docker. Next also has many other helpful features such as streaming, built-in optimisations, etc.

Next also allows easy deployment onto [Vercel](vercel.com).


### Prisma & Postgres

[Prisma](prisma.io) is used as an ORM to help manage the database connections, and also prevent SQL injection attacks. Atomic transactions are used to ensure database consistency is maintained.

To ensure normalisation and reduce redundancy in the database, wins, draws, losses, points, etc., are all evaluated by the web app server rather than stored in the database. 

However, there is some redundancy as the form inputs are stored in the database, which is needed to enable users to edit previous inputs. 

Ideally, it would be proper to set up a local Postgres instance, or some docker configuration set up, but due to the scale and timeframe of this project, I decided to just stick with one production Postgres database, used both for local development and deployment.

### Form validation

[Zod](zod.dev) was used for form validation, allowing custom error messages which hopefully provide useful help to the user. [Fuse.js](fusejs.io) was used to provide typo suggestions for the user when entering the match results.

### Tests


Ideally, I would have wanted to have better test coverage by having e2e tests as well using [Cypress](cypress.io). However, due to the lack of time on this assessment, I decided to not make it a priority. The lack of complexity of the various components made it feel a bit contrived to add component tests given the limited time, and it felt like I would be adding tests just to increase test code coverage rather than actually writing useful tests.

Nevertheless, I still do believe that tests are very important in ensuring application correctness, and [Jest](jestjs.io) was used as a test runner to test the core business logic of the web app (i.e., the functions in `app/lib/utils.ts`).

### Authentication & Authorisation 

To avoid needing to store and manage passwords, Google OAuth is used. This web app implements a basic RBAC scheme, with admins and users. 

Unauthenticated:
* Can view table
* Can view individual team data

Users
* Can add, edit and delete data

Admins:
* Can view logs
* Can view all users
* Can add and delete users

## Assumptions

There will ever only be two groups, so the number of groups and names of the groups can be hard-coded in various parts of the application.
