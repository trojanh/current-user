/** *** plugin: current-user 😎  ***
 * This plugin adds
 * @property[currentUser] on request object.
 * import plugin and regester with server
 *    file: server.js
 *    ====================================================
 *    import currentUser from "current-user";
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
  name: "current-user",
  version: "0.0.1",
  register: async (server, options) => {
    const { authColumn, model } = options;
    let { property } = options;

    if (!property) {
      property = "currentUser";
    }

    server.ext("onPreHandler", async (request, handler) => {
      try {
        // fetch currentUser credentials from hapi-auth-jwt2
        const {
          auth: {
            credentials: { currentUser }
          }
        } = request;

        // fetch given authColumn value
        const authValue = currentUser[authColumn];

        // prepare where query to find object
        const whereQuery = {};
        whereQuery[authColumn] = authValue;

        // find object with given model
        request[property] = await model.findOne({
          where: whereQuery
        });
      } catch (error) {
        request[property] = null;
      }

      return handler.continue;
    });
  }
};

module.exports = Plugin;
