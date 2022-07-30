import { SlashCommandBuilder, ChatInputCommandInteraction, ActionRow, ActionRowBuilder, SelectMenuBuilder, ComponentType, ButtonBuilder, ButtonStyle } from 'discord.js'
import { HomeworksRepository, QuestionType } from '../repositories/homeworks'
import { questionToString } from '../utils/questionToString'

export const builder = new SlashCommandBuilder()
  .setName('start')
  .setDescription('Starts a homework channel')

export const executer = async (interaction: ChatInputCommandInteraction) => {
  if (interaction.commandName !== 'start') return

  const homework = HomeworksRepository.get(interaction.channelId)

  if (!homework) return interaction.reply({
    content: 'This channel is not assigned to any homework.'
  })

  interaction.reply({ ephemeral: true, content: 'Starting...' })

  await interaction.channel?.send({
    content: `> **${homework.title.toUpperCase()}**\n${homework.description}\n\nYou can find more about this content here <#${homework.resourceChannelId}>\n\n> **Questions**`
  })

  for (const [index, question] of homework.questions.entries()) {
    const indexToLetter = (index: number) => ['A', 'B', 'C', 'D', 'E'][index]

    if (question.type === QuestionType.Mark) {
      const actionRow = new ActionRowBuilder({
        components: [
          new SelectMenuBuilder({
            customId: `${index}`,
            placeholder: 'Select an option to answer',
            options: question.options.map((option, index) => ({
              value: String(index + 1),
              label: `${indexToLetter(index)}) ${option.slice(0, 100)}`
            }))
          })
        ],
      })

      await interaction.channel?.send({
        content: questionToString(question, { showCorrect: false, userAnswer: null }),
        components: [actionRow as any]
      })
    }

    if (question.type === QuestionType.AnswerAudio) {
      const actionRow = new ActionRowBuilder({
        components: [
          new ButtonBuilder({
            customId: `${index}`,
            label: 'Answer',
            emoji: '🎙️',
            style: ButtonStyle.Primary
          })
        ]
      })

      await interaction.channel?.send({
        content: questionToString(question),
        components: [actionRow as any]
      })
    }

    if (question.type === QuestionType.AnswerText) {
      const actionRow = new ActionRowBuilder({
        components: [
          new ButtonBuilder({
            customId: `${index}`,
            label: 'Answer',
            emoji: '✍️',
            style: ButtonStyle.Primary
          })
        ]
      })

      await interaction.channel?.send({
        content: questionToString(question),
        components: [actionRow as any]
      })
    }
  }
}