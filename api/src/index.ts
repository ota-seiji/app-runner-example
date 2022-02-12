import express from 'express'

const app = express()

// body-parserに基づいた着信リクエストの解析
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Get
app.get('/', (req: express.Request, res: express.Response) => {
  res.send('Hello World!')
})

// 3000番ポートでAPIサーバ起動
app.listen(3000, () => {
  console.log('Example app listening on port 3000!')
})
