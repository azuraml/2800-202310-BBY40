import scrapy

class CampySpider(scrapy.Spider):
    name = 'campy'
    start_urls = ['https://collection.bccampus.ca/subjects/math-stats/']

    def parse(self, response):
        for products in response.css('div.ant-col.ant-col-24'):
            yield {
                'title': products.css('div.ant-typography.ant-typography-ellipsis.ant-typography-single-line.ant-typography-ellipsis-single-line.bccampus-list-item-title::text').get(),
                'ed': products.css('div.ant-typography.ant-typography-ellipsis.ant-typography-single-line.ant-typography-ellipsis-single-line.bccampus-list-item-extra::text').get(),
                'link': response.urljoin(products.css('a.bccampus-link.card.bccampus-list-item.primary::attr(href)').get())
            }
                # 'link': products.css('a.bccampus-link.card.bccampus-list-item.primary').attrib['href'],
