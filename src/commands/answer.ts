import { SlashCommandBuilder, ChatInputCommandInteraction, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, InteractionType, Interaction } from 'discord.js'
import { HomeworksRepository, QuestionType } from '../repositories/homeworks'

export const builder = new SlashCommandBuilder()
  .setName('answer')
  .setDescription('creates a answer question')
  .addStringOption(option => option
    .setName('type')
    .setDescription('If the answer must be either a text or an audio')
    .addChoices(
      { name: 'Audio', value: 'audio' },
      { name: 'Text', value: 'text' }
    )
    .setRequired(true)
  )

export const executer = async (interaction: ChatInputCommandInteraction) => {
  if (interaction.commandName !== 'answer') return

  const homework = HomeworksRepository.get(interaction.channelId)

  if (!homework) return interaction.reply({
    content: 'This channel is not assigned to any homework.'
  })

  const type = interaction.options.getString('type', true) as 'audio' | 'text'

  const id = `${Date.now()}`

  const descriptionInput = new TextInputBuilder()
    .setCustomId('descriptionInput')
    .setLabel('What\'s the description for this question?')
    .setStyle(TextInputStyle.Paragraph)

  const firstActionRow = new ActionRowBuilder().addComponents(descriptionInput)

  const modal = new ModalBuilder()
    .setCustomId(id)
    .setTitle('Answer Modal')

  modal.addComponents(firstActionRow as any)

  await interaction.showModal(modal)

  const modalListener = (interaction: Interaction) => {
    if (
      interaction.type === InteractionType.ModalSubmit &&
      interaction.customId === id
    ) {
      const description = interaction.fields.getTextInputValue('descriptionInput')

      HomeworksRepository.addQuestion(homework.channelId, {
        type: type === 'audio' ? QuestionType.AnswerAudio : QuestionType.AnswerText,
        description,
        index: homework.questions.length + 1
      })

      interaction.reply({
        content: 'Answer question has been succesffully added!',
        ephemeral: true
      })

      interaction.client.off('interactionCreate', modalListener)
    }
  }
  
  interaction.client.on('interactionCreate', modalListener)
}