function useRegex(input, regex) {
  return regex.test(input);
}

function processed(value) {
  let fileReader = new FileReader();
  fileReader.readAsText(value);
  fileReader.onload = (event) => {
    let fileAsText = event.target.result;
    let textByLine = fileAsText.split("\n")
    let regex = /\[([0-9]+(\.[0-9]+)+).*[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]{1,3})?\]/i;
    let regex2 = /] ([a-zA-ZiİçÇşŞğĞÜüÖö]+( [a-zA-ZiİçÇşŞğĞÜüÖö]+)+): /i;

    let dateList = [];
    let timeList = [];
    let namedList = [];

    textByLine.forEach((text) => {

      if (this.useRegex(text, regex)) {
        const dateTime = text.match(regex)[0]
        const date = dateTime.substring(1, dateTime.length - 10)
        const time = dateTime.substring(dateTime.length - 9, dateTime.length - 1)
        dateList.push(date)
        timeList.push(time)
      }

      if (this.useRegex(text, regex2)) {

        const abc = text.match(regex2)[0]
        const abc2 = abc.substring(2, abc.length - 2)

        namedList.push(abc2)

      }
      ;
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


  };
}
