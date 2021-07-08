import pandas as pd
import numpy as np
import requests
import urllib.parse
from bs4 import BeautifulSoup as BS
import math
import time
import os
import csv

def get_latitude_longtitude(address):
    print(address)
    address = urllib.parse.quote(address)
    url = "https://www.google.com.tw/maps/place/" + address
    headers = {
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36"}

    while True:
        try:
            res = requests.get(url, headers=headers, timeout=10)
            break
        except:
            print("Connection refused by the server..")
            time.sleep(10)
            continue

    soup = BS(res.text, 'lxml')
    temp = soup.find("meta", {"itemprop": "image"})
    if temp == None:
        return 0, 0

    temp = temp.get("content")
    for i in range(len(temp)):
        if temp[i:i+3] == "ll=":
            temp = temp[i+3:]
            lat, lon = temp.split(',')
            return lat, lon

        if temp[i:i+4] == "ter=" and temp[i+4] != "0":
            lat = ""
            lon = ""
            while temp[i+4] != "%":
                lat += temp[i+4]
                i += 1
            i += 3
            while temp[i+4] != "&":
                lon += temp[i+4]
                i += 1
            return lat, lon

    return 0, 0

data = pd.read_csv("2020年08月臺南1999派工案件.csv").to_numpy()  # modify
date = data[:, 2]
event = data[:, 4]
region = data[:, 6]

for i in range(len(date)):
    temp = ""
    if type(data[:, 7][i]) != float:
        for j in range(len(data[:, 7][i])):
            if data[:, 7][i][j] != " " and data[:, 7][i][j] != "，":
                temp += data[:, 7][i][j]
            else:
                break

    if type(region[i]) != float:
        region[i] = "台南市" + region[i] + temp

day = ""
count = 0
unit_lat = 0.00451463192206
unit_lon = 0.0049139566196
start_lat = 23.2331565911176  # row 40
start_lon = 120.06130326333721  # column 7
record = np.zeros((31, 77, 68, 4), dtype=int)
for i in range(len(date)):
    day = date[i].replace("2020/8/", "")  # modify

    kind = -1  # 0:交通事故 1:自然災害 2:公共安全 3:生活機能
    if event[i] == "違規停車" or event[i] == "警政及路霸排除類" or event[i] == "交通運輸" or event[i] == "交通類" or event[i] == "道路維修":
        kind = 0
    elif event[i] == "髒亂及汙染" or event[i] == "衛生醫療類" or event[i] == "環保類" or event[i] == "消防類":
        kind = 1
    elif event[i] == "民政類" or event[i] == "噪音舉發" or event[i] == "建築管理及使用類" or event[i] == "騎樓舉發" or event[i] == "警政類" or event[i] == "動保類" or event[i] == "動物救援" or event[i] == "農林漁畜及動保類":
        kind = 2
    elif event[i] == "路燈路樹公園類" or event[i] == "民生管線" or event[i] == "路燈故障" or event[i] == "教育類" or event[i] == "地政類"or event[i] == "經濟發展類" or event[i] == "道路、人行道、騎樓及排水溝類" or event[i] == "工務類" or event[i] == "水利類" or event[i] == "公用事業類" or event[i] == "騎樓及排水溝類" or event[i] == "社會福利救助類" or event[i] == "勞工類" or event[i] == "文化觀光類" or event[i] == "都市發展類" or event[i] == "新聞及國際關係類":
        kind = 3
    elif event[i] == "1999派工" or event[i] == "其他通報" or event[i] == "其他類" or event[i] == "財稅類" or event[i] == "存參類" or event[i] == "行動應用程式(APP)":
        kind = count % 4
        count += 1

    if kind != -1:
        if type(region[i]) != float:
            lat, lon = get_latitude_longtitude(region[i])
            print(i, lat, lon)
            row = math.floor((start_lat - float(lat))/unit_lat)
            column = math.floor((float(lon) - start_lon)/unit_lon)
            if(row >= 0 and row < 77 and column >= 0 and column < 68):
                record[int(day) - 1][row][column][kind] += 1

target = pd.read_csv("event.csv").to_numpy()
row2 = target[:, 1]
column2 = target[:, 2]
for d in range(31):
    result = []
    for i in range(77):
        for j in range(68):
            result.append([i + 40, j + 7, record[d][i][j][0], record[d]
                           [i][j][1], record[d][i][j][2], record[d][i][j][3]])

    result = np.array(result)
    row1 = result[:, 0]
    column1 = result[:, 1]
    data = np.zeros((77, 68), dtype=int)
    for i in range(len(row2)):
        data[row2[i] - 40][column2[i] - 7] = 1

    remove = []
    for i in range(len(row1)):
        if(data[row1[i] - 40][column1[i] - 7] != 1):
            remove.append(i)

    result = np.delete(result, remove, axis=0)
    os.mkdir("./temp/2020_8_" + str(d + 1)) # modify
    with open("./temp/2020_8_" + str(d + 1) + "/event.csv", "w", newline='') as csvfile: # modify
        writer = csv.writer(csvfile)
        writer.writerow(["grid_id", "row", "col", "event1_num", "event2_num", "event3_num", "event4_num"])
    pd.DataFrame(result).to_csv("./temp/2020_8_" + str(d + 1) + "/event.csv", mode="a", header = False) # modify
