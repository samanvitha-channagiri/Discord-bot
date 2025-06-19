const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('remind')
    .setDescription('Set a personal reminder')
    .addStringOption(option =>
      option.setName('task')
        .setDescription('What do you want to be reminded about?')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('time')
        .setDescription('Time duration')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('unit')
        .setDescription('Unit of time')
        .setRequired(true)
        .addChoices(
          { name: 'seconds', value: 's' },
          { name: 'minutes', value: 'm' },
          { name: 'hours', value: 'h' }
        )),

  async execute(interaction) {
    const task = interaction.options.getString('task');
    const time = interaction.options.getInteger('time');
    const unit = interaction.options.getString('unit');

    let delay;
    switch (unit) {
      case 's': delay = time * 1000; break;
      case 'm': delay = time * 60 * 1000; break;
      case 'h': delay = time * 60 * 60 * 1000; break;
      default: return interaction.reply("Invalid time unit.");
    }

    await interaction.reply(` Reminder set for **${task}** in ${time} ${unit === 's' ? 'second(s)' : unit === 'm' ? 'minute(s)' : 'hour(s)'}.`);

    setTimeout(async () => {
      try {
        await interaction.channel.send(`**Its time to :** ${task}`);
      } catch (err) {
        console.error("Failed to send reminder in the channel:", err);
        // Fallback: reply in channel if DM fails
        await interaction.followUp(`${interaction.user},  reminder: ${task}`);
      }
    }, delay);
  },
};
