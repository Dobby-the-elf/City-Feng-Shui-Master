
function poem(levels) {
    let price = [
        ['價低易居', '低價之處'],
        ['物美價廉', '價低CP高'],
        ['價平實，合情理', '中庸之價'],
        ['長安居大不易', '辛勤三十年，以有此屋盧'],
        ['連城之價', '長安居大不易']
    ]
    let population = [
        ['人跡罕至', '萬徑人縱滅', '工作機會空乏'],
        ['工作機會較少', '錢少事多離家遠'],
        ['錢少事多離家遠', '人口適中，能動能靜'],
        ['人來人往', '熙熙攘攘', '人丁興旺'],
        ['人山人海', '車水馬龍', '人聲鼎沸'],
    ]
    let living = [
        ['商店寥寥無幾', '地處偏僻處', '車行不易'],
        ['路遠迢迢', '商店較少'],
        ['城市蛋白處', '商店距離適中'],
        ['伴遊自逛皆宜', '各項設施皆善'],
        ['各項設施應有盡有', '條條大路通羅馬', '伴遊自逛皆宜']
    ]
    let safety = [
        ['歹徒猖狂要小心', '動亂危安自保為重', '犯罪猖獗謹慎留意'],
        ['疑人疑事多注意', '地方欠安勿獨行'],
        ['歹事雖少，仍需自防', '治安平平'],
        ['守望相助善', '安定和諧', '平時相安事少'],
        ['守法守紀', '地緣安寧保太平', '家家平安']
    ]
    let traffic_violation = [
        ['雜亂無章車多違法', '交通亂象頻發生', '肇禍傷亡多切要留心'],
        ['小心道路飛來橫禍', '事故稍多需留意'],
        ['上路需眼觀四處，耳聽八方', '路況平平，小心為上'],
        ['路上偶有違規，仍需注意', '路況善，少違規'],
        ['路況佳', '駕駛皆守法守紀', '道路烏托邦']
    ]
    let pollution = [
        ['環境髒亂煞風景', '垃圾粉塵漫天飄', '攪擾爭鬧多打擾'],
        ['煙霧瀰漫常紫爆', '噪音稍多使煩心'],
        ['若有烏煙請戴口罩', '偶有人聲擾清夢'],
        ['僻靜之處能安心', '偶有瘴氣，仍需備好口罩'],
        ['萬籟俱寂靜無聲', '悄無聲息靜謐處', '環境優，一塵不染']
    ]
    let summary = [
        ['大凶之地，勸你塊陶', '三十六計走為上策', '餓山餓水出刁民'],
        ['小凶之處，勿以久待', '勸離不勸留'],
        ['風水輪流轉', '好壞自在人心', '知足常樂，能忍自安'],
        ['宜居好去處', '雖非臻至，猶善'],
        ['相看兩不厭，就是這', '永保安康好風水', '海納百川，景氣和暢']
    ]

    //return poem sentences
    var poem = [];
    levels.forEach((level, idx) => { levels[idx] = Math.floor(level * 5); })
    levels.forEach((level, idx) => { if (levels[idx] == 5) levels[idx] = 4 })
    let sum = 0;
    for (let i = 0; i < radarData.length; i++) {
        if (i === 0 || i === 1) sum += 4 - radarData[i]; //don't forget to add the base
        else sum += radarData[i]; //don't forget to add the base
    }
    let radarAvg = Math.floor(sum / radarData.length);

    console.log("level", levels);
    console.log("avg", radarAvg);

    poem.push(price[levels[0]][Math.floor(Math.random() * price[levels[0]].length)]);
    poem.push(population[levels[1]][Math.floor(Math.random() * population[levels[1]].length)]);
    poem.push(living[levels[2]][Math.floor(Math.random() * living[levels[2]].length)]);
    poem.push(safety[levels[3]][Math.floor(Math.random() * safety[levels[3]].length)]);
    poem.push(traffic_violation[levels[4]][Math.floor(Math.random() * traffic_violation[levels[4]].length)]);
    poem.push(pollution[levels[5]][Math.floor(Math.random() * pollution[levels[5]].length)]);
    poem.push(summary[radarAvg][Math.floor(Math.random() * summary[radarAvg].length)]);

    document.querySelector("#poem-pic img").src = `../static/figma/籤詩${radarAvg}.svg`;

    return poem;
}