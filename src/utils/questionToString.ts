import { IAnyQuestion, IMarkQuestion, QuestionType } from '../repositories/homeworks'

export type Props = {
  userAnswer: number | null
  showCorrect: boolean
}

export const questionToString = <T extends IAnyQuestion>(question: IAnyQuestion, props?: T extends IMarkQuestion ? Props : never) => {
  if (question.type === QuestionType.Mark) {
    const indexToLetter = (index: number) => 'ABCDE'[index]

    return `${question.index}) ${question.description}\n${question.options.map((option, index) => {
      const content = `${indexToLetter(index)}) ${option}`
      if (props?.userAnswer && index + 1 === props?.userAnswer && props?.userAnswer === question.correctOption) return `**${content}** :point_left: :tada:`
      if (props?.showCorrect && index + 1 === question.correctOption) return `**${content}** ✅`
      if (props?.userAnswer && index + 1 === props?.userAnswer) return `**${content}** :point_left: ❌`

      return content
    }).join('\n')}`
  }

  if (question.type === QuestionType.AnswerText) {
    return `${question.index}) ${question.description}`
  }
  
  if (question.type === QuestionType.AnswerAudio) {
    return `${question.index}) ${question.description}`
  }

  throw new Error('Unknown Question Type')
}