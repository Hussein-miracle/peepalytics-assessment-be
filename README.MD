# **Node.js Express with TypeScript App**

This is a sample Node.js application built using **Express** and **TypeScript**. It includes basic configurations, routes, and middleware to get you started.

---

## **Features**

- TypeScript for type safety and modern JavaScript features.
- Modular architecture for scalability and maintainability.
- Example routes and middleware.
- Basic error handling and logging.

---

## **Getting Started**

### **Prerequisites**

Ensure you have the following installed:

- **Node.js** (v16 or later)
- **npm** or **yarn**
- **Git**

---

### **Installation**

1.  **Clone the Repository**

    ```bash
    git clone https://github.com/Hussein-miracle/peepalytics-assessment-be.git
    cd peepalytics-assessment-be

    ```

2.  **Install Dependencies**

    ```bash
    npm install
    ```

    # OR

    ```bash
     yarn install
    ```

3.  **Environment Variables**
    Create a .env file in the root directory to define environment variables. Below is an example:

    .env:

    ```plaintext
    DATABASE_URL=
     SQUARE_ACCESS_TOKEN=
     SQUARE_ENVIRONMENT=
     JWT_SECRET=
     # For rate limiting
     RATE_LIMIT_MAX_REQUESTS=
    ```

    Input the appropriate values

4.  **Running the app**

    1.  Development Mode
        ```bash
        npm run dev
        ```
    2.  Production Mode
        ```bash
        npm run build && npm start
        ```

5.  **Directory structure**

```
project/
├── src/
│   ├── configs/            # configs
│   ├── controllers/       # Route handlers and business logic
│   ├── middlewares/       # Custom middleware
│   ├── migrations/         # migrations
│   ├── models/            # Database models (e.g., Sequelize)
│   ├── routes/            # Route definitions
│   ├── services/          # Third party services 
│   ├── test/               # tests (unit and integration)
│   └── types/             # Typescript types
│   └── utils/             # Utility functions
│   ├── app.ts             # App entry point
├── dist/                  # Compiled output (generated after build)
├── tests/                 # Test files
├── .env                   # Environment variables
├── .gitignore             # Git ignore file
├── package.json           # Node.js project metadata
├── tsconfig.json          # TypeScript configuration
└── README.md              # Project documentation
```
