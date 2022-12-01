import moment from "moment";
import { readFileSync } from "fs";

const file = readFileSync("_chat.txt", "utf8") // file should be added to root folder

const rgxD = /\[([0-9]+(\.[0-9]+)+).*[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]{1,3})?\]/i;
const rgxU = /] ([a-zA-ZiİçÇşŞğĞÜüÖö]+( [a-zA-ZiİçÇşŞğĞÜüÖö]+)+): /i;

const useRegex = (input, regex) => {
  return regex.test(input);
}

let textByLine = file.split("\n")

const lineList = (textByLine, regex, format, replaceOne, replaceTwo) => {

  let list = []

  textByLine.forEach((text) => {
    if (useRegex(text, regex)) {
      let rxgValue = text.match(regex)[0]
      rxgValue = rxgValue.replace(replaceOne, "").replace(replaceTwo, "")
      const formattedValue = moment(rxgValue, "DD.MM.YYYY HH.mm.ss")
      const item = formattedValue.format(format)
      list.push(formattedValue.isValid() ? item : rxgValue)
    }
  })
  return list
}

const mapper = (list) => {
  let map = {}
  list.sort().forEach((item) => {
    map[item] = map.hasOwnProperty(item) ? map[item] + 1 : 1
  })
  return map
}

console.log(mapper(lineList(textByLine, rgxD, "YYYY-MM", "]", "["))) //Month mapper
console.log(mapper(lineList(textByLine, rgxD, "HH", "]", "["))) //Hour mapper
console.log(mapper(lineList(textByLine, rgxU, "", "] ", ": "))) //Name mapper

