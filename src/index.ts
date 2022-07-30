import 'dotenv/config'
import './infra'

import { AttachmentBuilder, Client, GatewayIntentBits, REST, Routes } from 'discord.js'
import { builders, executers } from './commands/list'
import { HomeworksRepository } from './repositories/homeworks'
import { questionToString } from './utils/questionToString'
import axios from 'axios'
import { createReadStream } from 'fs'

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
})

client.on('interactionCreate', async interaction => {
  if (interaction.isChatInputCommand()) return executers(interaction)

  if (interaction.isButton()) {
    const homework = HomeworksRepository.get(interaction.channelId)

    if (homework?.isDone === false) {
      const collector = interaction.message.channel.createMessageCollector({
        filter: (message) => message.author.id === interaction.user.id && message.attachments.size > 0,
        time: 60000,
        max: 1
      })

      collector.on('end', async (collected, reason) => {
        const message = collected.last()

        const attachment = message?.attachments.first()

        if (attachment) {
          const response = await axios.get(attachment.url, {
            'responseType': 'arraybuffer'
          })

          await interaction.message.edit({
            files: [
              new AttachmentBuilder(response.data)
            ]
          })
        }
      })

      await interaction.reply({
        ephemeral: true,
        content: 'Send the file for this answer.'
      })
    }
  }

  if (interaction.isSelectMenu()) {
    const [questionIndex] = interaction.customId.split('-')
    const homework = HomeworksRepository.get(interaction.channelId)

    if (homework?.isDone === false) {
      const question = homework.questions[Number(questionIndex)]
      const answer = Number(interaction.values[0])

      interaction.update({
        content: questionToString(question, {
          userAnswer: answer,
          showCorrect: true
        }),
        components: []
      })
    }
  }
})



const rest = new REST({ version: '10' }).setToken(process.env.TOKEN!)

rest.put(
  Routes.applicationGuildCommands(process.env.CLIENT_ID!, process.env.GUILD_ID!),
  { body: builders }
).then(() => console.log(`Commands successfully loaded.`))

client.login(process.env.TOKEN)