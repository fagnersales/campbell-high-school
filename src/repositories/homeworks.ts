import { db } from '../infra'

export enum QuestionType {
  Mark,
  AnswerText,
  AnswerAudio,
}

export type IQuestion = {
  description: string
  index: number
  type: QuestionType
}

export type IAnswerQuestion = IQuestion & {
  type: QuestionType.AnswerAudio | QuestionType.AnswerText
}

export type IMarkQuestion = IQuestion & {
  type: QuestionType.Mark,
  options: string[],
  correctOption: number
}

export type IAnyQuestion = IAnswerQuestion | IMarkQuestion

export type IHomework = {
  channelId: string

  title: string
  description: string
  resourceChannelId: string
  isDone: boolean

  questions: IAnyQuestion[]
}

const Homeworks = db.createCollection<IHomework>('homeworks')

const get = (channelId: string): IHomework | null => {
  const homework = Homeworks.get(homework => homework.channelId === channelId)

  if (!homework) return null

  return Array.isArray(homework) ? homework[0] : homework
}

const update = (channelId: string, data: Partial<Omit<IHomework, 'channelId'>>) => {
  Homeworks.update(
    homework => ({ ...homework, ...data }),
    homework => homework.channelId === channelId
  )

  const homework = get(channelId)!

  return homework
}

const addQuestion = (channelId: string, question: IAnyQuestion): void => {
  Homeworks.update(homework => homework.questions.push(question), homework => homework.channelId === channelId)
}

const create = (data: IHomework): void => {
  Homeworks.create(data)
}

export const HomeworksRepository = {
  get,
  create,
  update,
  addQuestion
}