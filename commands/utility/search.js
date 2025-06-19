const {
  SlashCommandBuilder,
  MessageCollector,
  Collection,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("search")
    .setDescription("searches for words across all the messages")
    .addStringOption((option) =>
      option
        .setName("word")
        .setDescription("The word you want to search")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("limit")
        .setDescription("min number of words message to contain")
        .setRequired(true)
    ),

  async execute(interaction) {
    const word = interaction.options.getString("word");
    const limit = interaction.options.getInteger("limit");

    const results = [];

   

    await interaction.deferReply(); 
    const channels = interaction.guild.channels.cache.filter(
      (ch) => ch.isTextBased() && ch.viewable
    );

    for (const channel of channels.values()) {
      try {
        const messages = await channel.messages.fetch({ limit: 100 });

        messages.forEach((msg) => {
          const wordCount = msg.content.trim().split(" ").length;
          if (wordCount > limit) {
            if (msg.content.toLowerCase().includes(word.toLowerCase())) {
              const msgUrl = `https://discord.com/channels/${interaction.guild.id}/${channel.id}/${msg.id}`;
            results.push(`[${channel.name}] ${msg.author.tag}: [Jump to message](${msgUrl})`);
            }
          }
        });
      } catch (err) {
        console.warn(
          `Could not fetch messages in ${channel.name}:`,
          err.message
        );
      }
    }

    if (results.length > 0) {
      const reply = results.join("\n");
      await interaction.followUp(`Found messages:\n${reply}`);
    } else {
      await interaction.followUp("No matching messages found.");
    }
  },
};
