require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const fs = require('fs');


const configPath = './config.json';
let config = { addedChannels: [], lineResponse: 'Default response' };


function loadConfig() {
    try {
        if (fs.existsSync(configPath)) {
            const data = fs.readFileSync(configPath, 'utf8');
            config = JSON.parse(data);
        } else {
            saveConfig(); // Create default config if doesn't exist
        }
    } catch (error) {
        console.error('Error loading config:', error);
    }
}


function saveConfig() {
    try {
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    } catch (error) {
        console.error('Error saving config:', error);
    }
}


loadConfig();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.once('ready', () => {
    console.log(`

    ╔═════════════════════════════════════════════════════════════════════════════════╗
    ║                                                                                 ║
    ║                                                                                 ║
    ║                       █████╗ ██████╗ ██████╗  █████╗                            ║
    ║                      ██╔══██╗██╔══██╗╚════██╗██╔══██╗		              ║
    ║                      ╚██████║██████╔╝ █████╔╝███████║		              ║
    ║                       ╚═══██║██╔══██╗ ╚═══██╗██╔══██║                           ║
    ║                       █████╔╝██║  ██║██████╔╝██║  ██║                           ║
    ║                       ╚════╝ ╚═╝  ╚═╝╚═════╝ ╚═╝  ╚═╝                           ║
    ║                                < 3                                              ║
    ║                                                                                 ║
    ╚═════════════════════════════════════════════════════════════════════════════════╝ 
                          ════════════════════════════════════════
                              All Systems Operations Active         
                            → Bot: ${client.user.tag}   
                            → Status: Online 
                            → Pray For Syria & Palastine ❤	
                            → Github: https://github.com/9R3A
                          ════════════════════════════════════════
                                              <3                                     
    `);
});

client.on('messageCreate', (message) => {
    if (message.author.bot) return;

    if (message.content.startsWith('!addchannel')) {
        const args = message.content.split(' ');
        if (args.length > 1) {
            const channelId = args[1];
            if (!config.addedChannels.includes(channelId)) {
                config.addedChannels.push(channelId);
                saveConfig();
                message.channel.send(`Channel <#${channelId}> has been added for auto line responses.`);
            } else {
                message.channel.send(`Channel <#${channelId}> is already added.`);
            }
        } else {
            message.channel.send('Please provide a channel ID to add.');
        }
    }

    if (message.content.startsWith('!set-line')) {
        const args = message.content.split(' ');
        args.shift();
        if (args.length > 0) {
            config.lineResponse = args.join(' ');
            saveConfig();
            message.channel.send(`Line response has been set to: "${config.lineResponse}"`);
        } else {
            message.channel.send('Please provide a response message.');
        }
    }

    if (message.content === '!whitelisted') {
        if (config.addedChannels.length === 0) {
            message.channel.send('No channels are currently whitelisted.');
        } else {
            const channelList = config.addedChannels.map(id => `<#${id}>`).join(', ');
            message.channel.send(`Whitelisted channels: ${channelList}`);
        }
    }

    if (config.addedChannels.includes(message.channel.id)) {
        message.channel.send(config.lineResponse);
    }

    if (message.content === '!help') {
        const helpEmbed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Help Menu')
            .setDescription('Here are the available commands:')
            .addFields(
                { name: '!addchannel <channel_id>', value: 'Add a channel to the whitelist for auto line responses.' },
                { name: '!set-line <message>', value: 'Set a custom line response.' },
                { name: '!whitelisted', value: 'List all whitelisted channels.' },
                { name: '!help', value: 'Show this help menu.' }
            )
            .setFooter({ text: 'Use these commands wisely!' })
            .setTimestamp();

        message.channel.send({ embeds: [helpEmbed] });
    }
});

client.login(process.env.DISCORD_TOKEN);
