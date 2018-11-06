# current-user

This plugin supprots only [Hapi](https://hapijs.com) and assumes you are using [hapi-auth-jwt2](https://www.npmjs.com/package/hapi-auth-jwt2) for authentication

`current-user` plugin adds property `currentUser` (can be modified) to request object. Now, every handler will have current user

```js
{
  method: 'GET',
  path: '/api/v1/user',
  handler: (request, handler) => {
    return request.currentUser;
  }
}
```

**Usage**

1. Define Plugin options

   ```js
   import { User } from "/path/to/models";

   module.exports = {
     model: User,
     authColumn: "email"
   };
   ```

2. Register plugin in server.js

   ```js
   import currentUser from "current-user";
   import currentUserOptions from "current-user";

   await server.register({
     plugin: currentUser,
     options: currentUserOptions
   });
   ```

3. In handler you have

   ```js
   // file: routes.js
   [
     {
       method: "GET",
       path: "/api/v1/user",
       handler: (request, handler) => {
         return request.currentUser;
         /** Response
          * {
          *   id: 1,
          *   name: 'John Doe',
          *   email: 'john@email.com',
          *   ...
          * }
          */
       }
     }
   ];
   ```

**Example**

```js
import currentUser from "current-user";
import loginuser from "/path/to/loginUser";
import { User } from "/path/to/models";

server.route([
  {
    method: "POST",
    path: "/api/v1/authenticate",
    handler: (request, handler) => {
      // hapi-auth-jwt2 is implemented
      // in loginUser
      return loginUser(request);
    },
    options: {
      auth: false
    }
  },
  {
    method: "GET",
    path: "/api/v1/user",
    handler: (request, handler) => {
      return request.currentUser;
      /** Response
       * {
       *   id: 1,
       *   name: 'John Doe',
       *   email: 'john@email.com',
       *   ...
       * }
       */
    }
  }
]);
.
.
.
// register currentUser after hapi-auth-jwt2

await server.register({
  plugin: currentUser,
  options: {
    model: User,
    authColumn: "email"
  }
});
.
.
.
```

## Contributing

Feel free to contribute

## LICENSE

package licensed under [MIT License](https://github.com/vemarav/current-user/blob/master/LICENSE)

## Social

[![Twitter Follow](https://img.shields.io/twitter/follow/vemarav.svg?style=social&label=Follow)](https://twitter.com/vemarav)
