import scrapy


class MyspiderSpider(scrapy.Spider):
    name = "myspider"
    allowed_domains = ["oer.open.ubc.ca"]
    start_urls = ["https://oer.open.ubc.ca/open-catalogue/"]

    def parse(self, response):
        pass
