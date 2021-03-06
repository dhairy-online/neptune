import {
  CommandInteraction,
  GuildMember,
  MessageEmbed,
  Permissions,
} from "discord.js";
import { bold, SlashCommandBuilder } from "@discordjs/builders";
import client from "../base/NeptuneClient";

export = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Are you a admin? Ban someone!")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Select a user to ban")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Why do you want to ban the user? "),
    ),
  async execute(interaction: CommandInteraction) {
    const user = interaction.options.getMember("user") as GuildMember;
    const reason =
      interaction.options.getString("reason") || "No reason provided";
    const bannedEmbed = new MessageEmbed();
    bannedEmbed
      .setColor("#332191")
      .setTitle(`Banned Successfully 🔨`)
      .setDescription(
        `${user} has been banned from ${bold(`${interaction.guild?.name}`)}`,
      )
      .setFooter(
        `Banned by ${interaction.user.tag}`,
        interaction.user?.displayAvatarURL(),
      );
    const cannotBanEmbed = new MessageEmbed();
    cannotBanEmbed
      .setColor("#332191")
      .setTitle(`You Cannot ban that user 🔨`)
      .setDescription(`${user} is not bannable.`)
      .setFooter(
        `Used by ${interaction.user.tag}`,
        interaction.user?.displayAvatarURL(),
      );

    if (!user.bannable) {
      return await interaction.reply({ embeds: [cannotBanEmbed] });
    } else if (
      (interaction as any).member?.permissions.has(
        Permissions.FLAGS.BAN_MEMBERS,
      )
    ) {
      user.ban({ reason });

      return await interaction.reply({ embeds: [bannedEmbed] });
    }
  },
};
