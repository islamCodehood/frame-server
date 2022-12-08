import { Request, Response } from 'express'
import puppeteer from 'puppeteer'
import { v4 as uuidv4 } from 'uuid'
import Story from '../models/story.model'

const getHyperRealFilm = async () => {
  const url = 'https://hyperrealfilm.club/reviews'
  const browser = await puppeteer.launch({
    headless: false,
  })
  const page = await browser.newPage()
  await page.setDefaultNavigationTimeout(0)

  await page.goto(url)

  const blogItem = '.BlogList-item'
  await page.waitForSelector(blogItem)

  const articles = await page.evaluate((blogItem) => {
    return [...document.querySelectorAll(blogItem)].map((item) => {
      const imagePath = item
        ?.querySelector('.BlogList-item-image img')
        ?.getAttribute('src')
      const link =
        'https://hyperrealfilm.club' +
        item?.querySelector('.BlogList-item-title')?.getAttribute('href')
      const title = item?.querySelector('.BlogList-item-title')?.textContent
      const excerpt = item?.querySelector(
        '.BlogList-item-excerpt p'
      )?.textContent
      // const author = item?.querySelector('.BlogList-item-meta .Blog-meta-item--author')?.textContent
      const date = item?.querySelector(
        '.BlogList-item-meta .Blog-meta-item--date'
      )?.textContent

      return { imagePath, link, title, excerpt, date, id: '' }
    })
  }, blogItem)
  const finalArticles = articles.map((article) => ({
    ...article,
    id: uuidv4(),
  }))
  console.log(finalArticles)
  await browser.close()
  return finalArticles
}

const getMubi = async () => {
  const url = 'https://mubi.com/notebook'
  const browser = await puppeteer.launch({
    headless: false,
  })
  const page = await browser.newPage()
  await page.setDefaultNavigationTimeout(0)

  await page.goto(url)

  const showMoreButton = '.ep0oth50'
  await page.waitForSelector(showMoreButton)
  await page.click(showMoreButton)

  const blogItem = '.ep0oth52'
  await page.waitForSelector(blogItem)

  const articles = await page.evaluate((blogItem) => {
    return [...document.querySelectorAll(blogItem)].map((item) => {
      const imagePath = item?.querySelector(`.egle0sa2`)?.getAttribute('src')
      const link =
        'https://mubi.com' +
        item?.querySelector('.e7g0h938')?.getAttribute('href')
      const title = item?.querySelector('h3')?.textContent
      const excerpt = item?.querySelector('.e7g0h937')?.textContent
      const date = item?.querySelector('time')?.textContent
      console.log(imagePath)
      return { imagePath, link, title, excerpt, date, id: '' }
    })
  }, blogItem)
  const finalArticles = articles
    .filter((article) => article.imagePath)
    .map((article) => ({ ...article, id: uuidv4() }))
  await browser.close()
  return finalArticles
}

export const getStories = async (req: Request, res: Response) => {
  try {
    const stories = await Story.find()
    console.log(stories.length)
    return res.status(200).json({ stories })
  } catch (error) {
    return res.status(500).json({ message: error })
  }
}

export const saveStories = async () => {
  try {
    await Story.deleteMany()
    const articlesHyperRealFilm = await getHyperRealFilm()
    const articlesMubi = await getMubi()
    const articles = [...articlesHyperRealFilm, ...articlesMubi]
    console.log(articles)
    for (const article of articles) {
      await Story.create(article)
    }
    console.log('saved')
  } catch (error) {
    console.log(error)
  }
}

setInterval(() => {
  saveStories()
  console.log('saving data...')
}, 86400000)
