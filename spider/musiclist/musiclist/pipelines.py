# -*- coding: utf-8 -*-

# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://doc.scrapy.org/en/latest/topics/item-pipeline.html

import json

class MusiclistPipeline(object):
    def __init__(self):
        self.file = open("rankingList.json","wb+")
        self.result = []

    def process_item(self, item, spider):
        self.result.append(dict(item))
        return item

    def close_spider(self, spider):
        json_str = json.dumps(self.result,ensure_ascii=False)
        self.file.write(json_str.encode(encoding="utf-8"))
        self.file.close()