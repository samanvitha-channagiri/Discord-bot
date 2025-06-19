const fs=require('node:fs')
const path=require('node:path')
const { REST, Routes } = require('discord.js');

const {Client,Collection,Events,GatewayIntentBits,MessageFlags,Intents}=require('discord.js')

require('dotenv').config() 

const client = new Client({ intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildMessages,GatewayIntentBits.MessageContent,GatewayIntentBits.GuildMembers] });

const commands = []; //so that I can load commands to discord
client.commands = new Collection(); //this if for the bot

// client.on('messageCreate',(message)=>{
//     if(message.author.bot) return;
	
//     if(message.content.startsWith('create')){
//         const url=message.content.split('create')[1]
//         return message.reply({
//             content:"Generating short ID for :"+url
//         })
//     }
//     message.reply({
//         content:"You are a monkey"
//     })
    
// })
client.on('guildMemberAdd',member=>{
	member.send(`Welcome to the server,${member.user.username}`)
	.catch(error=>{
		console.log("could not send dm welcome message");
		
	})
})
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
            commands.push(command.data.toJSON())
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}


client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		}
	}
});
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {

	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		await rest.put(
			Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
			{ body: commands },
		);

		console.log(`Successfully reloaded application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
})();
client.on('ready',()=>{
	console.log("Bot is listening");
	
})

client.login(process.env.DISCORD_TOKEN)
// client.on(Events.InteractionCreate,interaction=>{
//     if (!interaction.isChatInputCommand()) return;
//     console.log(interaction);
    
// })


































/*const {Client,GatewayIntentBits}=require('discord.js')
require('dotenv').config() 
const client=new Client({intents:[GatewayIntentBits.Guilds,GatewayIntentBits.GuildMessages,GatewayIntentBits.MessageContent]})


client.on('interactionCreate',(interaction)=>{
    console.log(interaction.reply("You are a monkey"));
    
})

*/