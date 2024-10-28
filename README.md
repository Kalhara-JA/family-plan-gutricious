# Family Subscription App

## Table of Contents
1. [Introduction](#introduction)
2. [Project Structure](#project-structure)
3. [Technologies Used](#technologies-used)
4. [Installation](#installation)
5. [Usage](#usage)
6. [Environment Variables](#environment-variables)
7. [API Documentation](#api-documentation)
   - [Family Routes](#family-routes)
   - [Plan Routes](#plan-routes)
8. [Error Handling](#error-handling)
9. [Logging](#logging)
10. [Swagger Integration](#swagger-integration)
11. [Postman Collection](#postman-collection)
12. [Contributing](#contributing)
13. [License](#license)

## Introduction
The Family Subscription App is a backend service built using Node.js, Express, TypeScript, and Prisma. It provides an interface for managing family subscription plans, where a manager can create a family, invite members, and manage subscription plans. This service connects to a PostgreSQL database via Prisma ORM, with support for CRUD operations on families and subscription plans.

## Project Structure
The project follows this structure:

```
family-subscription-app/
  ├── src/
  │   ├── controllers/
  │   │   ├── familyController.ts
  │   │   └── planController.ts
  │   ├── services/
  │   │   ├── familyService.ts
  │   │   └── planService.ts
  │   ├── routes/
  │   │   ├── familyRoutes.ts
  │   │   └── planRoutes.ts
  │   ├── utils/
  │   │   └── logger.ts
  │   ├── app.ts
  │   └── server.ts
  ├── prisma/
  │   └── schema.prisma
  ├── .env
  ├── package.json
  └── README.md
```

## Technologies Used
- **Node.js**: JavaScript runtime environment.
- **Express.js**: Web framework for Node.js.
- **TypeScript**: Superset of JavaScript with static typing.
- **Prisma**: ORM for PostgreSQL.
- **PostgreSQL**: Relational database.
- **Swagger**: API documentation.
- **Winston**: Logging library.

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/family-subscription-app.git
   cd family-subscription-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   - Create a PostgreSQL database.
   - Update the `.env` file with your database credentials.

4. **Run database migrations**
   ```bash
   npx prisma migrate dev
   ```

## Usage

1. **Start the server**
   ```bash
   npm run dev
   ```

2. **Access API documentation**
   - Swagger UI is available at `http://localhost:3000/api-docs`.

## Environment Variables
The following environment variables should be set up in the `.env` file:

- `DATABASE_URL`: PostgreSQL database connection string.
- `PORT`: Port number for the server (default is `3000`).
- `NEXTAUTH_URL`: URL for NextAuth session validation.

## API Documentation
The Family Subscription App provides a RESTful API. Below are the main routes:

### Family Routes

- **Create Family**
  - **Endpoint**: `/family/create`
  - **Method**: `POST`
  - **Body**:
    ```json
    {
      "managerEmail": "string",
      "planName": "string"
    }
    ```
  - **Description**: Creates a new family with the specified manager.

- **Add Family Member**
  - **Endpoint**: `/family/add-member`
  - **Method**: `POST`
  - **Body**:
    ```json
    {
      "managerEmail": "string",
      "memberEmail": "string"
    }
    ```
  - **Description**: Adds a new member to the family.

- **Get Family Details**
  - **Endpoint**: `/family/:managerEmail`
  - **Method**: `GET`
  - **Description**: Retrieves family details for the specified manager.

- **Remove Family Member**
  - **Endpoint**: `/family/remove-member`
  - **Method**: `POST`
  - **Body**:
    ```json
    {
      "managerEmail": "string",
      "memberEmail": "string"
    }
    ```
  - **Description**: Removes a member from the family.

### Plan Routes

- **Create Plan**
  - **Endpoint**: `/plan`
  - **Method**: `POST`
  - **Body**:
    ```json
    {
      "name": "string",
      "memberLimit": "number"
    }
    ```
  - **Description**: Creates a new subscription plan.

- **Get Plan Details**
  - **Endpoint**: `/plan/:planId`
  - **Method**: `GET`
  - **Description**: Retrieves details for a specific plan.

- **Update Plan**
  - **Endpoint**: `/plan/:planId`
  - **Method**: `PUT`
  - **Body**:
    ```json
    {
      "name": "string",
      "memberLimit": "number"
    }
    ```
  - **Description**: Updates an existing plan.

- **Delete Plan**
  - **Endpoint**: `/plan/:planId`
  - **Method**: `DELETE`
  - **Description**: Deletes a plan.

## Error Handling
The application has structured error handling for different types of errors:

- **Validation Errors**: `400 Bad Request` with validation details.
- **Database Errors**: Prisma-related errors like unique constraint violations return a `409 Conflict`.
- **Internal Server Errors**: `500 Internal Server Error` for unexpected issues.

## Logging
Logging is managed using Winston, with log levels for:

- **Info**: Successful operations (e.g., creating a family).
- **Warn**: Warnings (e.g., resource not found).
- **Error**: Error messages for debugging.

## Swagger Integration
Swagger is used for API documentation, accessible at `http://localhost:3000/api-docs` after the server is started.

## Postman Collection
To test the API using Postman, import the following JSON configuration:

```json
{
  "info": {
    "name": "Family Subscription App API Collection with Session Cookie",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Family Routes",
      "item": [
        {
          "name": "Create Family",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Cookie",
                "value": "next-auth.session-token={{session_token}}",
                "type": "text"
              },
              {
                "key": "Content-Type",
                "value": "application/json",
                "type": "text"
              }
            ],
            "url": {
              "raw": "http://localhost:3000/family/create",
              "host": ["http://localhost"],
              "port": "3000",
              "path": ["family", "create"]
            },
            "body": {
              "mode": "raw",
              "raw": "{\n  \"managerEmail\": \"manager@example.com\",\n  \"planName\": \"Basic Plan\"\n}"
            }
          }
        }
      ]
    }
  ]
}
```

In Postman, set `{{session_token}}` as an environment variable to automatically include your session token in requests.

## Contributing
Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a Pull Request.

## License
This project is licensed under the MIT License. See the `LICENSE` file for more details.

---