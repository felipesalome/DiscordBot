// Importa a biblioteca discord.js
const Discord = require('discord.js');

// Cria uma nova instancia
const client = new Discord.Client();

// Importa o arquivo com o token
const config = require("./config.json");

// Quando o Bot estiver utilizavel ira avisar no prompt e vai atualizar o status do bot
client.on("ready", () => {
    console.log(`Bot iniciado, com ${client.users.size} usuários, em ${client.channels.size} canais, em ${client.guilds.size} servidores.`);
    client.user.setActivity(`Albion Online`);
});

// Assim que entrar em um servidor vai mencionar no prompt e atualizar o status do bot
client.on("guildCreate", guild => {
    console.log(`O bot entrou no servidor: ${guild.name} (id: ${guild.id}). População ${guild.memberCount} membros!`);
    client.user.setActivity(`Estou em ${client.guilds.size} servidores.`);
});

client.on("guildDelete", guild => {
    console.log(`O bot foi removido do servidor: ${guild.name} (id: ${guild.id})`);
    client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on("guildMemberAdd", member => {
    const channel = member.guild.channels.find(ch => ch.name === 'recrutamento');
    const embed = new Discord.RichEmbed()
        .setColor(0x0F0FF0)
        .setDescription(`:wave: Bem vindo(a) ${member} :wave:`)
        .addBlankField()
        .addField(' Membro da guid :punch: ', ' No canal ` #registro ` digite: ``` !registrar SeuNickNoJogo ```')
        .addField(' Convidado :handshake: ', ' No canal ` #registro ` digite: ``` !convidado ```');
    if (!channel) return;
    channel.send(embed);
});

client.on("message", async message => {
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const comando = args.shift().toLowerCase();

    if(comando === "registrar"){
        const embed = new Discord.RichEmbed()
            .setTitle('Registro')
            .setColor(0xFF0000)
            .setDescription('Registrando.');
        const m = await message.channel.send(embed);
        if(args[0] !== "" && args[0] !== null && args[0] !== undefined){
            let role = message.guild.roles.find(r => r.name === "Membro");
            message.member.addRole(role).catch(e => console.log(e));
            message.member.setNickname(`[ED]${args[0]}`).catch(e => console.log(e));
            embed.setDescription(`Bem vindo(a) ${args[0]}, cadastro realizado com sucesso.`);
            embed.setColor(0x00FF00);
            console.log(`O usuário ${message.member} acabou de se cadastrar!`);
        } else {
            embed.setDescription("Não foi possivel fazer o registro, por favor digite seu nome no jogo logo após !registrar");
            console.log(`Falha ao registrar o usuário ${message.member}.`);
        }
        m.edit(embed);
    }

    if(comando === "convidado"){
        const embed = new Discord.RichEmbed()
            .setTitle('Registro')
            .setColor(0xFF0000)
            .setDescription('Registrando.');
        const m = await message.channel.send(embed);
        let role = message.guild.roles.find(r => r.name === "Convidado");
        message.member.addRole(role).catch(e => console.log(e));
        embed.setDescription(`Olá ${message.member}! É um prazer ter você aqui.`);
        embed.setColor(0x00FF00);
        m.edit(embed);
    }
})

client.login(config.token);