const {SlashCommandBuilder}=require('discord.js')

module.exports={
    data:new SlashCommandBuilder()
.setName('ping')
.setDescription('Searches for the messages, with mentioned words'),
async execute(interaction){
    await interaction.reply('Pong!lol')
}

}