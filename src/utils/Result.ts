import { ResultType } from '../types/index'

class Result<T> implements ResultType<T> {
  code: number
  message: string
  data: T
  exprieTime:number

  constructor(code: number, message: string, data?: T) {
    this.data = data!
    this.code = code
    this.message = message
    this.exprieTime=new Date().getTime()
  }
}

export default Result
