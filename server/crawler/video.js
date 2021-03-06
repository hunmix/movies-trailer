const puppeteer = require('puppeteer')

const baseUrl = 'https://movie.douban.com/subject/'
// const doubanId = 27172911
// const videoBase = 'https://movie.douban.com/trailer/27172911/'}

process.on('message', async (movies) => {
  console.log('start visit the target page')

  const browser = await puppeteer.launch({
    headless: false
  })

  const page = await browser.newPage()

  for(let i = 0; i < movies.length; i++) {
    const movie = movies[i]
    const doubanId = movie.doubanId
    await page.goto(baseUrl + doubanId, {
      waitUntil: 'networkidle2' // https://zhaoqize.github.io/puppeteer-api-zh_CN/#?product=Puppeteer&version=v1.11.0&show=api-pagegotourl-options
    })

    const result = await page.evaluate(() => {
      const $ = window.$
      let it = $('.related-pic-video')
      if (it && it.length > 0) {
        const link = it.attr('href')
        const backgroundImg = it.css('background-image')
        const result = backgroundImg.match(/\(\"(.+)\"\)/)

        let cover
        if (result) {
          cover = result[1]
        }
        console.log(cover)
        return {
          link,
          cover
        }
      }
      return {}
    })
    
    let video
    
    console.log(result)
    if (result.link) {
      await page.goto(result.link, {
        waitUntil: 'networkidle2'
      })
  
      video = await page.evaluate(() => {
        const $ = window.$
  
        let it = $('source')
  
        if (it && it.length > 0) {
          return it.attr('src')
        }
        return ''
      })
    }
  
    const data = {
      video,
      doubanId,
      cover: result.cover
    }
    process.send(data)
  }

  browser.close()
  console.log('close')
  process.exit(0)
})
