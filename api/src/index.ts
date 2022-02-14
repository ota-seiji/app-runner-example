import express from 'express'
import * as prisma from '@prisma/client'

const app = express()

const prismaClient = new prisma.PrismaClient()

// body-parserに基づいた着信リクエストの解析
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Get
app.get('/users/:id', async (req: express.Request, res: express.Response) => {
  const id = req.params.id
  const user = await prismaClient.user.findUnique({ where: { id: Number(id) } })
  res.send(user ?? `User not found`)
})

// POST
app.post('/users', async (req: express.Request, res: express.Response) => {
  const name = req.body.name
  const user = await prismaClient.user.create({
    data: {
      name,
    },
  })
  res.send(user)
})

// 3000番ポートでAPIサーバ起動
app.listen(3000, () => {
  console.log('Example app listening on port 3000!')
})
