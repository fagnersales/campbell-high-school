import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js'
import { HomeworksRepository, QuestionType } from '../repositories/homeworks'

export const builder = new SlashCommandBuilder()
  .setName('mark')
  .setDescription('creates a mark question')
  .addStringOption(option => option
    .setName('description')
    .setDescription('Description of the question')
    .setRequired(true)
  )
  .addStringOption(option => option
    .setName('a')
    .setDescription('content for the "a" option')
    .setRequired(true)
  )
  .addStringOption(option => option
    .setName('b')
    .setDescription('content for the "b" option')
    .setRequired(true)
  )
  .addStringOption(option => option
    .setName('c')
    .setDescription('content for the "c" option')
    .setRequired(true)
  )
  .addStringOption(option => option
    .setName('d')
    .setDescription('content for the "d" option')
    .setRequired(true)
  )
  .addStringOption(option => option
    .setName('e')
    .setDescription('content for the "e" option')
    .setRequired(true)
  )
  .addNumberOption(option => option
    .setName('correct')
    .setDescription('correct option for this question')
    .setMinValue(1)
    .setMaxValue(5)
    .setRequired(true)
  )

export const executer = async (interaction: ChatInputCommandInteraction) => {
  if (interaction.commandName !== 'mark') return

  const homework = HomeworksRepository.get(interaction.channelId)

  if (!homework) return interaction.reply({
    content: 'This channel is not assigned to any homework.'
  })

  const description = interaction.options.getString('description', true)
  const questions = [
    interaction.options.getString('a', true),
    interaction.options.getString('b', true),
    interaction.options.getString('c', true),
    interaction.options.getString('d', true),
    interaction.options.getString('e', true)
  ]
  const correctAnswer = interaction.options.getNumber('correct', true) as 1 | 2 | 3 | 4 | 5

  HomeworksRepository.addQuestion(homework.channelId, {
    type: QuestionType.Mark,
    description,
    correctOption: correctAnswer,
    options: questions,
    index: homework.questions.length + 1
  })

  interaction.reply({
    ephemeral: true,
    content: 'Mark question has been succesffully added!'
  })
}