export default function poem(levels) {
    let price = {
        1: ['價低易居', '低價之處'],
        2: ['物美價廉', '價低CP高'],
        3: ['價平實，合情理', '中庸之價'],
        4: ['長安居大不易', '辛勤三十年，以有此屋盧'],
        5: ['連城之價', '長安居大不易']
    }
    let population = {
        1: ['人跡罕至', '萬徑人縱滅', '工作機會空乏'],
        2: ['工作機會較少', '錢少事多離家遠'],
        3: ['錢少事多離家遠', '人口適中，能動能靜'],
        4: ['人來人往', '熙熙攘攘', '人丁興旺'],
        5: ['人山人海', '車水馬龍', '人聲鼎沸'],
    }
    let living = {
        1: ['商店寥寥無幾', '地處偏僻處', '車行不易'],
        2: ['路遠迢迢', '商店較少'],
        3: ['城市蛋白處', '商店距離適中'],
        4: ['伴遊自逛皆宜', '各項設施皆善'],
        5: ['各項設施應有盡有', '條條大路通羅馬', '伴遊自逛皆宜']
    }
    let safety = {
        1: ['歹徒猖狂要小心', '動亂危安自保為重', '犯罪猖獗謹慎留意'],
        2: ['疑人疑事多注意', '地方欠安勿獨行'],
        3: ['歹事雖少，仍需自防', '治安平平'],
        4: ['守望相助善', '安定和諧', '平時相安事少'],
        5: ['守法守紀', '地緣安寧保太平', '家家平安']
    }
    let traffic_violation = {
        1: ['雜亂無章車多違法', '交通亂象頻發生', '肇禍傷亡多切要留心'],
        2: ['小心道路飛來橫禍', '事故稍多需留意'],
        3: ['上路需眼觀四處，耳聽八方', '路況平平，小心為上'],
        4: ['路上偶有違規，仍需注意', '路況善，少違規'],
        5: ['路況佳', '駕駛皆守法守紀', '道路烏托邦']
    }
    let pollution = {
        1: ['環境髒亂煞風景', '垃圾粉塵漫天飄', '攪擾爭鬧多打擾'],
        2: ['煙霧瀰漫常紫爆', '噪音稍多使煩心'],
        3: ['若有烏煙請戴口罩', '偶有人聲擾清夢'],
        4: ['僻靜之處能安心', '偶有瘴氣，仍需備好口罩'],
        5: ['萬籟俱寂靜無聲', '悄無聲息靜謐處', '環境優，一塵不染']
    }
    let summary = {
        1: ['大凶之地，勸你塊陶', '三十六計走為上策', '餓山餓水出刁民'],
        2: ['小凶之處，勿以久待', '勸離不勸留'],
        3: ['風水輪流轉，好壞自在人心', '知足常樂，能忍自安'],
        4: ['宜居好去處', '雖非臻至，猶善'],
        5: ['相看兩不厭，就是這了', '永保安康好風水', '海納百川，景氣和暢']
    }

    //return poem sentences
    var poem = new Object();
    poem.price = price[levels[0].toString()][Math.floor(Math.random() * price[levels[0].toString()].length)];
    poem.population = population[levels[0].toString()][Math.floor(Math.random() * population[levels[0].toString()].length)];
    poem.living = living[levels[0].toString()][Math.floor(Math.random() * living[levels[0].toString()].length)];
    poem.safety = safety[levels[0].toString()][Math.floor(Math.random() * safety[levels[0].toString()].length)];
    poem.traffic_violation = traffic_violation[levels[0].toString()][Math.floor(Math.random() * traffic_violation[levels[0].toString()].length)];
    poem.pollution = pollution[levels[0].toString()][Math.floor(Math.random() * pollution[levels[0].toString()].length)];
    poem.summary = summary[levels[0].toString()][Math.floor(Math.random() * summary[levels[0].toString()].length)];

    return poem;
}
