const { Router } = require("../../../src/index");
const User = require("../model/User");
const Guild = require("../model/Guild");

const isAuthenticated = require("../middleware/is-authenticated");

const UserController = {
  async getUsers(req, res) {
    res.send(await User.find());
  },
  async getUser(req, res) {
    res.send(await User.findById(req.params.id));
  },
  getMe(req, res) {
    res.send(req.user.toJSON());
  },
  async getMyGuilds(req, res) {
    const guilds = (await User.findOne(req.user._id).populate("guilds")).guilds;
    res.send(guilds.map(guild => guild.toJSON()));
  },
  async leaveGuild(req, res) {
    const guild = await Guild.findOne({ _id: req.params.guild_id });
    await guild.remove();

    req.user.guilds.splice(
      req.user.guilds.findIndex(guildId => guildId === req.params.guild_id),
      1
    );
    await req.user.save();

    res.status(204).send("");
  }
};

module.exports = new Router({ baseUrl: "/users" })
  .get("/", UserController.getUsers)
  .get("/:id", UserController.getUser)
  .get("/@me", UserController.getMe, [isAuthenticated])
  .get("/@me/guilds", UserController.getMyGuilds, [isAuthenticated])
  .delete("/@me/guilds/:guild_id", UserController.leaveGuild, [
    isAuthenticated
  ]);
