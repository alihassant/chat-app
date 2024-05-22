# Guide

To start the server use command `npm start`.

## API Endpoints

- ### controller/chat.js

  - #### createChat()

    `POST '/api/chat/createChat'`

    This endpoint creates a new chat and associates it with a specific user.

    Syntax:

    ```javascript
    fetch("/api/chat/createChat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });
    ```

    **Request Body:**

    - `userId`: ID of the user who creates the chat.

    **Response:**

    - Status Code: `201 Created`
    - Body:
      ```json
      {
        "message": "Chat created!",
        "chatId": "<chatId>"
      }
      ```

    **Error Responses:**

    - Status Code: `400 Bad Request`
    - Body:
      ```json
      {
        "error": "User Id are required"
      }
      ```

    **Notes:**

    - The `userId` is required in the request body.
    - If successful, it returns a `201` status code with the created chat's ID.
    - In case of any server error, it returns a `500` status code.

  - #### addUser()

    `POST '/api/chat/addUser'`

    This endpoint adds a user to an existing chat.

    Syntax:

    ```javascript
    fetch("/api/chat/addUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ chatId, userToAdd, userId }),
    });
    ```

    **Request Body:**

    - `chatId`: ID of the chat to which the user will be added.
    - `userToAdd`: Username of the user to be added.
    - `userId`: ID of the user making the request.

    **Response:**

    - Status Code: `200 OK`
    - Body:
      ```json
      {
        "message": "User added to chat"
      }
      ```

    **Error Responses:**

    - Status Code: `400 Bad Request`
    - Body:

      ```json
      {
        "error": "ChatId, userId and userToAdd are required"
      }
      ```

    - Status Code: `404 Not Found`
    - Body:
      ```json
      {
        "error": "Chat not found"
      }
      ```

    **Notes:**

    - The `chatId`, `userToAdd`, and `userId` are required in the request body.
    - Only the admin can add users to the chat.
    - If successful, it returns a `200` status code.
    - In case of any server error, it returns a `500` status code.

  - #### removeUser()

    `POST '/api/chat/removeUser'`

    This endpoint removes a user from an existing chat.

    Syntax:

    ```javascript
    fetch("/api/chat/removeUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ chatId, userId, userToRemove }),
    });
    ```

    **Request Body:**

    - `chatId`: ID of the chat from which the user will be removed.
    - `userId`: ID of the user making the request.
    - `userToRemove`: Username of the user to be removed.

    **Response:**

    - Status Code: `200 OK`
    - Body:
      ```json
      {
        "message": "User removed from chat"
      }
      ```

    **Error Responses:**

    - Status Code: `400 Bad Request`
    - Body:

      ```json
      {
        "error": "ChatId, userId and userToRemove are required"
      }
      ```

    - Status Code: `404 Not Found`
    - Body:
      ```json
      {
        "error": "Chat not found"
      }
      ```

    **Notes:**

    - The `chatId`, `userId`, and `userToRemove` are required in the request body.
    - Only the admin can remove users from the chat.
    - If successful, it returns a `200` status code.
    - In case of any server error, it returns a `500` status code.

  - #### changeUserRole()

    `POST '/api/chat/changeUserRole'`

    This endpoint changes the role of a user in a chat.

    Syntax:

    ```javascript
    fetch("/api/chat/changeUserRole", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ chatId, userId, userToChange, role }),
    });
    ```

    **Request Body:**

    - `chatId`: ID of the chat in which the user's role will be changed.
    - `userId`: ID of the user making the request.
    - `userToChange`: Username of the user whose role will be changed.
    - `role`: New role to be assigned.

    **Response:**

    - Status Code: `200 OK`
    - Body:
      ```json
      {
        "message": "User role changed"
      }
      ```

    **Error Responses:**

    - Status Code: `400 Bad Request`
    - Body:

      ```json
      {
        "error": "ChatId, userId, userToChange and role are required"
      }
      ```

    - Status Code: `404 Not Found`
    - Body:
      ```json
      {
        "error": "Chat not found"
      }
      ```

    **Notes:**

    - The `chatId`, `userId`, `userToChange`, and `role` are required in the request body.
    - Only the admin can change roles.
    - If successful, it returns a `200` status code.
    - In case of any server error, it returns a `500` status code.

- ### controller/auth.js

  - #### signup()

    `POST '/api/auth/signup'`

    This endpoint handles user registration.

    Syntax:

    ```javascript
    fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, username, password }),
    });
    ```

    **Request Body:**

    - `name`: Name of the user.
    - `email`: Email address of the user.
    - `username`: Username chosen by the user.
    - `password`: Password chosen by the user.

    **Response:**

    - Status Code: `201 Created`
    - Body:
      ```json
      {
        "message": "User created!",
        "userId": "<userId>"
      }
      ```

    **Error Responses:**

    - Status Code: `422 Unprocessable Entity`
    - Body:

      ```json
      {
        "error": "User Registration Failed."
      }
      ```

    - Status Code: `409 Conflict`
    - Body:

      ```json
      {
        "error": "Email is already registered!!!"
      }
      ```

      ```json
      {
        "error": "Username is already registered!!!"
      }
      ```

    **Notes:**

    - Validates the request body fields using express-validator.
    - Checks if the user already exists based on email and username.
    - If successful, it returns a `201` status code with the created user's ID.
    - In case of any server error, it returns a `500` status code.

  - #### login()

    `POST '/api/auth/login'`

    This endpoint handles user authentication and login.

    Syntax:

    ```javascript
    fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    ```

    **Request Body:**

    - `username`: Username of the user.
    - `password`: Password of the user.

    **Response:**

    - Status Code: `200 OK`
    - Body:
      ```json
      {
        "token": "<token>",
        "userId": "<userId>"
      }
      ```

    **Error Responses:**

    - Status Code: `404 Not Found`
    - Body:

      ```json
      {
        "error": "User not found!!!"
      }
      ```

    - Status Code: `401 Unauthorized`
    - Body:
      ```json
      {
        "error": "Wrong password!!!"
      }
      ```

    **Notes:**

    - Checks if the user exists based on the provided username.
    - Compares the provided password with the stored hashed password.
    - Generates a JWT token for authentication.
    - If successful, it returns a `200` status code with the token and user's ID.
    - In case of any server error, it returns a `500` status code.

- ### controller/user.js

  - #### getUserChats()

    `GET '/api/user/getUserChats/:userId'`

    This endpoint retrieves all chats associated with a specific user.

    Syntax:

    ```javascript
    fetch("/api/user/getUserChats/:userId", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    ```

    **Path Parameters:**

    - `userId`: ID of the user whose chats are to be retrieved.

    **Response:**

    - Status Code: `200 OK`
    - Body:
      ```json
      {
          "chats": [ <array_of_chats> ],
          "user": { <user_object> }
      }
      ```

    **Error Responses:**

    - Status Code: `404 Not Found`
    - Body:
      ```json
      {
        "error": "User not found"
      }
      ```

    **Notes:**

    - Retrieves all chats associated with the specified user.
    - Each chat object includes details about its users.
    - If successful, it returns a `200` status code with the user's chats and user object.
    - In case of any server error, it returns a `500` status code.
