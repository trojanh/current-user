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
    let { authColumn, property } = options;

    if (!property) {
      property = "currentUser";
    }

    server.ext("onPreHandler", async (request, handler) => {
      try {
        const {
          auth: {
            credentials: { currentUser }
          }
        } = request;
        const authValue = currentUser[authColumn];
        const whereQuery = {};
        whereQuery[authColumn] = authValue;
        request.currentUser = await User.findOne({
          where: whereQuery
        });
      } catch (error) {
        request.currentUser = null;
      }

      return handler.continue;
    });
  }
};

export default Plugin;
