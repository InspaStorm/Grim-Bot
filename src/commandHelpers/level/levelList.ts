interface levelScoreList {
    [index: string]: number;
}

const scoreToReachLevel: levelScoreList = {
    "20" : 1,
    "100" : 2,
    "250" : 3,
    "500" : 4,
    "1000" : 5,
    "2000" : 6,
    "4000" : 7,
    "8000" : 8
}

export default scoreToReachLevel