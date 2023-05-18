import scrapy

class MySpider(scrapy.Spider):
    name = 'myspider'
    start_urls = ['https://phet.colorado.edu/en/simulations/filter?subjects=physics&type=html,prototype']  # Replace with the actual URL

    def parse(self, response):
        # Use CSS selector to extract the desired elements
        for li_elem in response.css('li[role="listitem"]'):
            href = li_elem.css('a::attr(href)').get()
            img_src = li_elem.css('img.thumbnail::attr(src)').get()

            yield {
                'li': li_elem.get(),
                'href': href,
                'img_src': img_src,
            }
