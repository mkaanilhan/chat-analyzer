const fs = require("fs")
const file = fs.readFileSync("_chat.txt", "utf8") // file should be added to root folder
const rgxD = /\[([0-9]+(\.[0-9]+)+).*[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]{1,3})?\]/i;
const rgxU = /] ([a-zA-ZiİçÇşŞğĞÜüÖö]+( [a-zA-ZiİçÇşŞğĞÜüÖö]+)+): /i;

const useRegex = (input, regex) => {
  return regex.test(input);
}

let textByLine = file.split("\n")
let dateList = [];
let timeList = [];
let namedList = [];

textByLine.forEach((text) => {
  if (useRegex(text, rgxD)) {
    const dateTime = text.match(rgxD)[0]
    const date = dateTime.substring(1, dateTime.length - 10)
    const time = dateTime.substring(dateTime.length - 9, dateTime.length - 1)
    dateList.push(date)
    timeList.push(time)
  }
  if (useRegex(text, rgxU)) {
    const k = text.match(rgxU)[0]
    const l = k.substring(2, k.length - 2)
    namedList.push(l)
  }
})

let nameMap = {}

namedList.forEach((item) => {
  nameMap[item] = nameMap.hasOwnProperty(item) ? nameMap[item] + 1 : 1
})


let dateMap = {}

dateList.forEach((item) => {
  const yearMonth = item.substring(item.length - 4, item.length) +
    "-" + item.substring(item.length - 7, item.length - 5)
  dateMap[yearMonth] = dateMap.hasOwnProperty(yearMonth) ? dateMap[yearMonth] + 1 : 1
})

let timeMap = {}

timeList.sort().forEach((item) => {
  const hour = item.substring(0, 2)
  timeMap[hour] = timeMap.hasOwnProperty(hour) ? timeMap[hour] + 1 : 1
})

console.log(nameMap)

