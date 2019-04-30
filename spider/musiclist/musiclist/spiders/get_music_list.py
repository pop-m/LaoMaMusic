# -*- coding: utf-8 -*-
import scrapy
from musiclist.items import MusiclistItem
import json

class GetMusicListSpider(scrapy.Spider):
    name = 'get_music_list'
    allowed_domains = ['kugou.com']
    start_urls = ['https://www.kugou.com/yy/rank/home/1-8888.html?from=rank']
    

    def parse(self, response):
        for each in response.xpath('//div[@class="pc_temp_songlist "]/ul/li'):
            all_name = each.xpath('./a/text()').extract()[0]
            music_name = all_name.split('-')[1].strip()
            next_url = "http://songsearch.kugou.com/song_search_v2?callback=jQuery191034642999175022426_1489023388639&keyword=%s&page=1&pagesize=30&userid=-1&clientver=&platform=WebFilter&filter=2&iscorrection=1&privilege_filter=0" % music_name
            yield scrapy.Request(url=next_url,callback=self.get_song_list,method="GET")

    def get_song_list(self, response):
        response_str = str(response.body, encoding = "utf8")
        json_str = response_str[response_str.index("(")+1:len(response_str)-2]
        first_song = json.loads(json_str)["data"]["lists"][0]
        item = MusiclistItem()
        item["SongName"] = first_song["SongName"]
        item["SingerName"] = first_song["SingerName"]
        item["AlbumName"] = first_song["AlbumName"]
        item["FileHash"] = first_song["FileHash"]
        item["Duration"] = first_song["Duration"]
        yield item