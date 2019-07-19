import * as Router from 'koa-router'
import { Context } from 'koa'
import { ClassKeys } from '../decorator'
import { PingController } from '../controller/PingController'

const router = new Router()

type Controller = InstanceType<any>

function getRouter (controllers: Controller[]): any {
    const routers = []
    controllers.forEach((controller: Controller) => {
      const prototype = controller.prototype
      const basePath = Reflect.getOwnMetadata(ClassKeys.BasePath, controller)
      const members = Object.getOwnPropertyNames(prototype)
    
      members.forEach((member) => {
        const route = prototype[member]
        const routeProperties = Reflect.getOwnMetadata(member, prototype)
    
        if (route && routeProperties) {
            const { httpVerb, path } = routeProperties
    
            routers.push({
              method: httpVerb,
              // TODO
              // filter ${route_url}
              route: `${basePath}${path}`.replace('//', '/'),
              controller: controller,
              action: member
            })
        }
      })
    })
    return routers
}

const Routers = getRouter([PingController])

Routers.forEach(route => {
  (router as any)[route.method](route.route, async (ctx: Context, next: Function) => {
      const response = (new (route.controller as any))[route.action](ctx.request, ctx.response, next, ctx)
      if (response instanceof Promise) {
        await response
        await next()
      } else if (response !== null && response !== undefined) {
          ctx.response.toJSON()
      }
  })
})

export default router