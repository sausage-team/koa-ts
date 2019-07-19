import { Controller, Post, Get } from "../decorator"
import { Request, Response, Context} from 'koa'

@Controller('/')
export class PingController {
  @Get('/ping')
  public async pingGet(req: Request, res: Response) {
    res.body = 'Pong Get!!!'
  }
}