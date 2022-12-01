import moment from "moment";
import { readFileSync } from "fs";
import { addAbortSignal } from "stream";

const file = readFileSync("_chat.txt", "utf8") // file should be added to root folder

const rgxD = /\[([0-9]+(\.[0-9]+)+).*[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]{1,3})?\]/i;
const rgxU = /] (.*?): /i

const useRegex = (input, regex) => {
  return regex.test(input);
}

let textByLine = file.split("\n")

const groupName = () => {

  let name = textByLine[0].match(rgxU)[0]

  return name.replace("] ", "").replace(": ", "")

}

const lineList = (textByLine, regex, format, replaceOne, replaceTwo) => {

  let list = []

  textByLine.slice(3).forEach((text) => {
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


let mainData = {

  groupName: groupName(),
  numberOfMembers: Object.keys(mapper(lineList(textByLine, rgxU, "", "] ", ": "))).length,
  byName: mapper(lineList(textByLine, rgxU, "", "] ", ": ")),
  byHour: mapper(lineList(textByLine, rgxD, "HH", "]", "[")),
  byMonth: mapper(lineList(textByLine, rgxD, "YYYY-MM", "]", "["))

}

console.log(mainData)


