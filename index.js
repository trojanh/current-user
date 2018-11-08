/** *** plugin: hapi-current-user 😎  ***
 * This plugin adds
 * @property[currentUser] on request object.
 * import plugin and regester with server
 *    file: server.js
 *    ====================================================
 *    import currentUser from "hapi-current-user";
 *    import { User } from "/path/to/models"; // sequelize
 *
 *    server.register({
 *      plugin: currentUser,
 *      options: {
 *        // if you set @property[property] currentAdmin
 *        // then it will @property[currentAdmin] on request
 *        // object instead of @property[currentUser]
 *        property: 'currentUser'
 *        model: User,
 *        // @property[authColumn] can be email or username
 *        // whichever you are using to generate token
 *        authColumn: 'email'
 *      }
 *    })
 *
 * Note: @property[authColumn] can be anything which
 *       is used to authenticate user.
 */

const Plugin = {
  name: "hapi-current-user",
  version: "0.0.3",
  register: async (server, options) => {
    const { model } = options;
    let { authColumn, property } = options;

    if (!property) {
      property = "currentUser";
    }

    if (!authColumn) {
      throw new TypeError("provide authColumn");
    }

    server.ext("onPreHandler", async (request, handler) => {
      // fetch currentUser credentials from hapi-auth-jwt2
      const {
        auth: { credentials }
      } = request;
      if (credentials) {
        const { currentUser } = credentials;
        // fetch given authColumn value
        const authValue = currentUser[authColumn];

        // prepare where query to find object
        const whereQuery = {};
        whereQuery[authColumn] = authValue;

        // find object with given model
        request[property] = await model.findOne({
          where: whereQuery
        });
      } else {
        request[property] = null;
      }
      return handler.continue;
    });
  }
};

module.exports = Plugin;
