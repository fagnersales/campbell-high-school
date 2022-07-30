import {
  ChatInputCommandInteraction,
  RESTPostAPIApplicationCommandsJSONBody
} from 'discord.js'

import {
  builder as homeworkBuilder,
  executer as homeworkExecuter
} from './homework'

import {
  builder as startBuilder,
  executer as startExecuter
} from './start'

import {
  builder as markBuilder,
  executer as markExecuter
} from './mark'

import {
  builder as answerBuilder,
  executer as answerExecuter
} from './answer'

export const builders: RESTPostAPIApplicationCommandsJSONBody[] = [
  homeworkBuilder.toJSON(),
  startBuilder.toJSON(),
  markBuilder.toJSON(),
  answerBuilder.toJSON()
]

export const executers = (interaction: ChatInputCommandInteraction) => {
  const executers = [homeworkExecuter, startExecuter, markExecuter, answerExecuter]

  executers.forEach(executer => executer(interaction))
}