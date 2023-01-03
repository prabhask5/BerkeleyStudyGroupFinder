This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Initializing Node Modules and Starting Node Server

To install all necessary node modules:

```bash
npm install
```

After you've done that, you can start the node server by starting in the root directory and typing:

```bash
nodemon node-server/server.js
```

If test data is needed, uncomment the InitiateTestData() line in server.js

## Additional Progams Needed

This app runs on mongodb, so database authentication is needed before running the application.

Create a .env file in the node-server directory and add the DB_URI, and PORT=4000 into the file. Be ready to enter the db admin username and password after application start.

This app also uses cloudinary for profile image storage, so cloudinary API authentication is needed before running the application.

After gaining access to the cloudinary application image folder through making an account, put the CLOUD_NAME, API_KEY, and API_SECRET in the .env folder.

## Additional Features to Work On

- Notification system for friend requests
- on-platform instant messaging feature using Twilio
- Algorithm for recommending other students based on course list match to yours (maybe have percent of courses match displayed on summary box on explore page)
- Add feature to select study areas or book library study rooms through platform
- Add additional profile information, like preferred study times, preferred study locations
- Pseudo dropdown (can type to filter but can only select from dropdown options) input for major, grad year, pronouns, courseAbrName, courseLongName
- Link error checking for fbURL, igURL, scURL

## Ongoing Bugs to Fix

- Like button on profile summary component incorrectly staying full black instead of reverting to outline after hover off
- Avatar images flickering on initial page load
- Main logo font flickering on initial page load
- Make website look good in general (polish), and on big screens, [http://whatismyscreenresolution.net/multi-screen-test?site-url=http://localhost:3000/login&w=1920&h=1200](like what is seen here)
