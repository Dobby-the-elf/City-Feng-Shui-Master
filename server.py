# coding=utf-8

import flask
from flask import Flask, render_template, request, make_response
from flask import jsonify, redirect, url_for, flash
import pandas as pd
import json
from flask_login import (
    LoginManager,
    UserMixin,
    login_user,
    logout_user,
    login_required,
    current_user,
)
import configparser
import time
import math
import numpy as np

# config 初始化
config = configparser.ConfigParser()
config.read("config.ini")


app = Flask(__name__)  # 初始化一個Flask物件作為伺服器
app.secret_key = config.get("flask", "secret_key")

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.session_protection = "strong"
login_manager.login_view = "login"


class User(UserMixin):
    pass


@login_manager.user_loader
def user_loader(userid_now):
    if (userid_now not in users) and (userid_now not in admins):
        print(1)
        return

    user = User()
    user.id = userid_now
    print(1.5)
    return user


@login_manager.request_loader
def request_loader(request):
    userid_now = request.form.get("user_id")
    if (userid_now not in users) and (userid_now not in admins):
        print(2)
        return

    user = User()
    user.id = userid_now

    # DO NOT ever store passwords in plaintext and always compare password
    # hashes using constant-time comparison!
    if userid_now in users:
        print(3)
        user.is_authenticated = (
            request.form["password"] == users[userid_now]["password"]
        )
    if userid_now in admins:
        print(4)
        user.is_authenticated = (
            request.form["password"] == admins[userid_now]["password"]
        )
    print(4.5)
    return user


users = dict()
admins = {"admin": {"password": "admin"}}
users_df = pd.read_csv("static/users.csv", encoding="utf-8", dtype=str)
for index, row in users_df.iterrows():
    users.update({str(row["id"]): {"password": str(row["pw"])}})


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "GET":
        print(5)
        return render_template("login.html")

    userid_now = request.form["user_id"]
    if (userid_now in users) and (
        request.form["password"] == users[userid_now]["password"]
    ):
        print(6)
        user = User()
        user.id = userid_now
        login_user(user)

        return redirect(url_for("index"))

    elif (userid_now in admins) and (
        request.form["password"] == admins[userid_now]["password"]
    ):
        print(7)
        user = User()
        user.id = userid_now
        login_user(user)

        return redirect(url_for("index_admin"))
    if (userid_now not in users) and (userid_now not in admins):
        err = "該帳號不存在"

    else:
        err = "密碼錯誤"
    flash("登入失敗了...")
    return render_template("login.html", error_code=err)


@app.route("/logout")
def logout():
    userid_now = current_user.get_id()
    logout_user()

    return redirect(url_for("login_page"))


@app.route("/record")
def record():
    return render_template("record.html", user=current_user.get_id())


@app.route("/record_admin")
def record_admin():
    return render_template("record_admin.html")


@app.route("/login_page")  #
def login_page():
    return render_template("login.html")


@app.route("/show_records")
@login_required
def show_records():
    python_records = web_select_overall()
    return render_template("show_records.html", html_records=python_records)


@app.route("/")  # 定義“路由”
def hello():
    return redirect(url_for("login_page"))


@app.route("/index")
def index():
    return render_template("index.html", user=current_user.get_id())


@app.route("/lndex")  # 一個是管理者，一個是使用者
def lndex():
    return render_template("lndex.html", user=current_user.get_id())


@app.route("/index_admin")
def index_admin():
    return render_template("index_admin.html")


@app.route("/new_id", methods=["GET", "POST"])
def new_id():
    if request.method == "POST":
        data = request.get_json()
        newid = data["id"]
        newpw = data["pw"]
        if newid not in users:
            usersupdate_df = pd.read_csv(
                "static/users.csv", encoding="utf-8", dtype=str
            )
            usersupdate_df.loc[len(usersupdate_df)] = [newid, newpw]
            usersupdate_df.to_csv("static/users.csv", encoding="utf-8-sig", index=False)
            users.update({newid: {"password": newpw}})
            return "success"
        else:
            return "false"


@app.route("/report", methods=["GET", "POST"])
def report():
    if request.method == "POST":
        data = request.get_json()
        eventtype = data["type"]
        address = data["address"]
        detail = data["detail"]
        df = pd.read_csv("static/record.csv", encoding="utf-8", dtype=str)
        event_id = time.strftime("%Y%m%d%H%M%S", time.localtime())
        event_id_new = event_id + "00"
        if event_id in df["event_id"].tolist():

            for i in range(1, 100):
                if i < 10:
                    id_new = "0" + str(i)
                else:
                    id_new = str(i)
                if event_id_new in df["event_id"].tolist():
                    event_id_new = event_id + id_new
                else:
                    break

        event = [
            event_id_new,
            eventtype,
            detail,
            address,
            "處理中",
            current_user.get_id(),
            time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()),
            time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()),
        ]

        df.loc[len(df)] = event
        df.to_csv("static/record.csv", encoding="utf-8-sig", index=False)

        return "success"


@app.route("/get_record")
def get_record():
    df = pd.read_csv("static/record.csv", encoding="utf-8", dtype=str)
    df = df[df["reporter"] == current_user.get_id()]
    df = df.sort_values(by="update_time", ascending=False)
    feature_list = []
    for index, row in df.iterrows():
        feature_list.append(
            {
                "event_id": row["event_id"],
                "event_type": row["event_type"],
                "detail": row["detail"],
                "address": row["address"],
                "state": row["state"],
                "report_time": row["report_time"],
                "update_time": row["update_time"],
            }
        )
    print("feature_list")
    print(feature_list)
    data_return = {"features": feature_list}
    return jsonify(data_return)


@app.route("/get_record_admin")
def get_record_admin():
    df = pd.read_csv("static/record.csv", encoding="utf-8", dtype=str)
    df = df[df["state"] == "處理中"]
    df = df.sort_values(by="update_time", ascending=False)
    feature_list = []
    for index, row in df.iterrows():
        feature_list.append(
            {
                "event_id": row["event_id"],
                "event_type": row["event_type"],
                "detail": row["detail"],
                "address": row["address"],
                "state": row["state"],
                "reporter": row["reporter"],
                "report_time": row["report_time"],
                "update_time": row["update_time"],
            }
        )

    data_return = {"features": feature_list}

    return jsonify(data_return)


@app.route("/save_update", methods=["GET", "POST"])
def save_update():
    if request.method == "POST":
        data = request.get_json()
        print(data["update_已處理"])
        print(data["update_誤報"])
        print(data["update_錯誤"])
        df = pd.read_csv("static/record.csv", encoding="utf-8", dtype=str)

        for i in data["update_已處理"]:
            df.at[df.index[df["event_id"] == i].tolist()[0], "state"] = "已處理"
            df.at[
                df.index[df["event_id"] == i].tolist()[0], "update_time"
            ] = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        for i in data["update_誤報"]:
            df.at[df.index[df["event_id"] == i].tolist()[0], "state"] = "誤報"
            df.at[
                df.index[df["event_id"] == i].tolist()[0], "update_time"
            ] = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        for i in data["update_錯誤"]:
            df.at[df.index[df["event_id"] == i].tolist()[0], "state"] = "資訊不足"
            df.at[
                df.index[df["event_id"] == i].tolist()[0], "update_time"
            ] = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        df.to_csv("static/record.csv", encoding="utf-8-sig", index=False)
        return "success"


@app.route("/get_grid")  # 讀取fake
def get_grid():
    # type_event = request.args.get("mydata")
    weights = json.loads(request.args.get("myweights"))
    # print(type(weights))
    totalWeight = 0
    for i, weight in enumerate(weights):
        weights[i] = int(weights[i])
        totalWeight += weights[i]
    if totalWeight == 0:
        weights = [0.2, 0.2, 0.2, 0.2, 0.2, 0.2]
        totalWeight = 1.2
    # gain = 2.0 + np.var(weights) / totalWeight
    # # gain = 1.6 + np.var(weights) / totalWeight
    # for i, weight in enumerate(weights):
    #     # weights[i]=weight/totalWeight
    #     weights[i] = weight / max(weights) * gain / 4
    #     print(weights[i])
    # for location in [type_event]:
    all_grid_df = pd.read_csv("static/data/City_grids/500/all.csv", encoding="utf-8")
    grid_df = all_grid_df[
        (all_grid_df["all_grid_id"] >= 15177) & (all_grid_df["all_grid_id"] <= 18199)
    ]
    event = pd.read_csv("static/data/event_n.csv")
    cols = [
        "event1_num",
        "event2_num",
        "event3_num",
        "event4_num",
        "event5_num",
        "event6_num",
    ]
    # max_complain = []
    # for col in cols:
    #     event[col] = event[col].apply(lambda x: 0 if x < 0 else x)
    #     event[col] = event[col].apply(
    #         lambda x: (0.5 * math.log(1000 * x + 1)) if x == x else ""
    #     )
    #     max_complain.append(max(event[col]))
    # print(max_complain)
    feature_list = []
    for index, row in grid_df.iterrows():  # 台南的各個區域 dim ~= 3000
        color_level = []
        color_time = []
        event_id = event[event["grid_id"] == row["grid_id"]]
        for index1, row1 in event_id.iterrows():  # 某區域在各個時間的4個事件數量 dim will be 1
            type_events = ["event1", "event2", "event3", "event4", "event5", "event6"]
            color_level.append(0.0)
            for idx, type_event in enumerate(
                type_events
            ):  # dim = 6 交通違規、自然環境、土地價格、人口分布、生活機能、公共安全
                # gap = [0.8*max_complain[idx], 0.8*max_complain[idx], 0.8*max_complain[idx], 0.8*max_complain[idx], 0.8*max_complain[idx]]
                # gap = [0.15,0.3,0.45,0.6,7.5]
                # gap = list(map((lambda x: x*max_complain[idx]),gap))
                collumns = type_event + "_num"
                color_level[-1] += row1[collumns] * weights[idx] / sum(weights)
                # -------------------------- 改成除以全部最大的值 -------------------------------
                # for idx, level_index in enumerate(color_level):
                #     color_level[idx] =color_level[idx] / max(color_level)
                # print(color_level)
                # print(row1[collumns])
        for level in color_level:
            # print(level)
            if level <= 1.0 / 7:
                color_time.append("#EEEEEE")
            elif level <= 2.0 / 7:
                color_time.append("#f3fb19")  # 黃
            elif level <= 3.0 / 7:
                color_time.append("#f7a413")  # 橘黃
            elif level <= 4.0 / 7:
                color_time.append("#ef5e0e")  # 橘紅
            elif level <= 5.0 / 7:
                color_time.append("#ec513f")  # 紅
            elif level <= 6.0 / 7:
                color_time.append("#d93e41")  # 暗紅
            else:
                color_time.append("#930509")  # 黑紅

        feature_list.append(
            {
                "type": "Feature",
                "properties": {
                    "ID": int(row["grid_id"]),
                    "All_id": int(row["all_grid_id"]),
                    "center": {"lat": row["Centroid_y"], "lng": row["Centroid_x"]},
                    "area2": row["area2"],
                    "area3": row["area3"],
                    "stroke": "#FF0000",
                    "stroke-width": 0,
                    "stroke-opacity": 0,
                    "fill": color_time,
                    "fill-opacity": 0.6,
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [row["LeftBottom_x"], row["RightTop_y"]],
                            [row["RightTop_x"], row["RightTop_y"]],
                            [row["RightTop_x"], row["LeftBottom_y"]],
                            [row["LeftBottom_x"], row["LeftBottom_y"]],
                            [row["LeftBottom_x"], row["RightTop_y"]],
                        ]
                    ],
                },
            }
        )

        data_return = {"type": "Feature", "features": feature_list}
    return jsonify(data_return)


@app.route("/get_sum")  # 讀取fake
def get_sum():
    lat = request.args.get("lat")
    lng = request.args.get("lng")
    all_grid_df = pd.read_csv("static/data/City_grids/500/all.csv", encoding="utf-8")
    grid_df = all_grid_df[
        (all_grid_df["all_grid_id"] >= 15177)
        & (all_grid_df["all_grid_id"] <= 18199)
        & (all_grid_df["LeftBottom_x"] <= float(lng))
        & (all_grid_df["LeftBottom_y"] <= float(lat))
        & (all_grid_df["RightTop_x"] >= float(lng))
        & (all_grid_df["RightTop_y"] >= float(lat))
    ]
    print(grid_df["grid_id"].tolist()[0])
    event = pd.read_csv("static/data/event_365.csv")
    event_id = event[event["grid_id"] == grid_df["grid_id"].tolist()[0]]
    a = event_id["event1_num"].tolist()[0]
    b = event_id["event2_num"].tolist()[0]
    c = event_id["event3_num"].tolist()[0]
    d = event_id["event4_num"].tolist()[0]
    e = (a + b + c + d) / 4
    data_return = {"a": a, "b": b, "c": c, "d": d, "e": e}
    return jsonify(data_return)


@app.route("/get_grid1")  # 讀取圈選模式下的邊界
def get_grid1():
    if True:

        with open("static/data/bound.json", "r", encoding="utf-8") as f:
            output = json.load(f)
        print(output)
        data_return = {"type": "Feature", "features": output}
    return jsonify(data_return)


if __name__ == "__main__":
    app.config["JSON_AS_ASCII"] = False
    app.run(debug=True, port=8080)  # 執行我們的伺服器！

