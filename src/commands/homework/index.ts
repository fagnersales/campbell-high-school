import { ChannelType, ChatInputCommandInteraction, CommandInteraction, SlashCommandBuilder, SlashCommandChannelOption, TextChannel } from 'discord.js'

import { HomeworksRepository } from '../../repositories/homeworks'

export const builder = new SlashCommandBuilder()
  .setName('homework')
  .setDescription('Creates a new homework channel')
  .addChannelOption(option => option
    .setName('channel')
    .setDescription('The channel the homework will belong to')
    .addChannelTypes(ChannelType.GuildText)
    .setRequired(true)
  )
  .addStringOption(option => option
    .setName('title')
    .setDescription('The title for this homework')
    .setRequired(true)
  )
  .addStringOption(option => option
    .setName('description')
    .setDescription('The description for this homework')
    .setRequired(true)
  )
  .addChannelOption(option => option
    .setName('resource')
    .setDescription('The resource channel to studying for this homework')
    .addChannelTypes(ChannelType.GuildText)
    .setRequired(true)
  )

export const executer = async (interaction: ChatInputCommandInteraction) => {
  if (interaction.commandName !== 'homework') return

  const channel = interaction.options.getChannel('channel', true) as TextChannel
  const resource = interaction.options.getChannel('resource', true) as TextChannel
  const title = interaction.options.getString('title', true)
  const description = interaction.options.getString('description', true)

  const channelIsAlreadyInUse = HomeworksRepository.get(interaction.channelId)

  if (channelIsAlreadyInUse) return interaction.reply({
    content: 'This channel is already in use.'
  })

  HomeworksRepository.create({
    channelId: channel.id,
    resourceChannelId: resource.id,
    title,
    description,
    isDone: false,
    questions: []
  })

  return interaction.reply({
    content: `Congratulations! You just created a new homework channel! ${channel.toString()}`
  })
}