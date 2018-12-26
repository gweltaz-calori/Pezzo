const { Router } = require("../../../src/index");
const Guild = require("../model/Guild");
const User = require("../model/User");

const Controller = {
  async getGuild(req, res) {
    res.send(await Guild.findById(req.params.guild_id));
  },

  async createGuild(req, res) {
    const guild = new Guild(req.body);
    try {
      await guild.save();
      res.status(201).send(guild);
    } catch (e) {
      res.status(400).send(e);
    }
  },

  async addUser(req, res) {
    try {
      const guild = await Guild.findById(req.params.guild_id);
      const user = await User.findById(req.params.user_id);
      user.guilds.push(guild);
      guild.users.push(user);
      await guild.save();
      await user.save();
      res.status(201).send(guild);
    } catch (e) {}
  },

  async getGuildUsers(req, res) {
    const guild = await Guild.findById(req.params.guild_id).populate("users");
    res.send(guild ? await guild.users : []);
  }
};

module.exports = new Router({ baseUrl: "/guilds" })
  .get("/:guild_id", Controller.getGuild)
  .get("/:guild_id/users", Controller.getGuildUsers)
  .put("/:guild_id/users/:user_id", Controller.addUser)
  .post("/", Controller.createGuild);
