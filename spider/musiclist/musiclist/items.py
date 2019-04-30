# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# https://doc.scrapy.org/en/latest/topics/items.html

import scrapy


class MusiclistItem(scrapy.Item):
    # define the fields for your item here like:
    # name = scrapy.Field()
    SongName = scrapy.Field()
    SingerName = scrapy.Field()
    AlbumName = scrapy.Field()
    Duration = scrapy.Field()
    FileHash = scrapy.Field()