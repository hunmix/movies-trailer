const puppeteer = require('puppeteer')

const doubanMovieUrl = 'https://movie.douban.com/tag/#/?sort=R'
const clickMoreBtnTime = 1


;(async () => {
  console.log('start visit the target page')

  const browser = await puppeteer.launch({
    headless: false
  })

  const page = await browser.newPage()

  await page.goto(doubanMovieUrl, {
    waitUntil: 'networkidle0' // https://zhaoqize.github.io/puppeteer-api-zh_CN/#?product=Puppeteer&version=v1.11.0&show=api-pagegotourl-options
  })

  await page.waitForSelector('.more')

  for (let i = 0; i < clickMoreBtnTime; i++) {
    // await sleep()
    await page.click('.more')
  }

  const result = await page.evaluate(() => {

    var $ = window.$
    var items = $('.list-wp a.item')
    var links = []

    if (items.length <= 0) {
      return []
    }

    items.each((index, item) => {
      let it = $(item)
      let doubanId = it.find('div').data('id')
      let title = it.find('.title').text()
      let rate = Number(it.find('.rate').text())
      let poster = it.find('img').attr('src').replace('s_ratio', 'l_ratio')

      links.push({
        doubanId,
        title,
        rate,
        poster
      })
    })

    return links
  })
  
  browser.close()

  process.send({result})
  process.exit(0)
})()