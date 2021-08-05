#!/usr/bin/python
# -*- coding: utf-8 -*-

import pandas as pd
import numpy as np
from matplotlib import pyplot as plt 
import os
import os.path as path
import csv

DATA_DIR = "./line_chart"
DATA_DIR = path.abspath(DATA_DIR)

files = os.listdir(DATA_DIR)
files.sort(key=lambda x: int(x.split('_')[1]))

for i in range(3, 9):
    for index, fn in enumerate(files[2130:2140]):
        date_slices = fn.split("_")
        
        data = f"{DATA_DIR}/{fn}/trend.csv"
        data = pd.read_csv(data).to_numpy(dtype = float)
        
        x= data[:, -1]
        y = data[:, i]

        plt.subplot(2, 3, i - 2)
        plt.title("event" + str(i - 2) + "_num")
        plt.plot(x,y)

plt.show()
