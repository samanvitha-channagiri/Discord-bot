const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('search')
		.setDescription('searches for words across all the messages')
        .addStringOption(option=>
            option.setName('word')
            .setDescription('The word you want to search')
            .setRequired(true)

        )
        .addIntegerOption(option=>
            option.setName('limit')
            .setDescription('min number of words message to contain')
            .setRequired(true)
        )
        
        ,
	async execute(interaction) {
        const word=interaction.options.getString('word')
        const limit=interaction.options.getInteger('limit')
		
		await interaction.reply(`The word you've given ${word}  with the limit ${limit}`);
	},
};