const dataTime = (props) => {
  if (props) {
    const Data = new Date(props);
    return Data;
  } else {
    const Data = new Date();
    return Data;
  }
};

export const DataNow = (x) => {
  const dataNow = dataTime();
  const day = dataNow.getDate();
  const month = dataNow.getUTCMonth() + 1;
  const year = dataNow.getFullYear();

  if (x === "day") {
    return day;
  }
  if (x === "month") {
    return month;
  }
  if (x === "year") {
    return year;
  }
  if (x === "mesref") {
    return `${month}/${year}`;
  }
  if (x === undefined) {
    return `${day}/${month}/${year}`;
  }
  if (x === "noformated"){
    return `${year}-0${month}-${day}`
  }
};

export const DataSelect = (e, props) => {
  const dataSelect = dataTime(e);
  const day = dataSelect.getUTCDate();
  const month = dataSelect.getUTCMonth() + 1;
  const year = dataSelect.getFullYear();

  if (props === "day") {
    return day;
  }
  if (props === "month") {
    return month;
  }
  if (props === "year") {
    return year;
  }
  if (props === "mesref") {
    return `${month}/${year}`;
  }
  if (props === undefined) {
    return `${day}/${month}/${year}`;
  }
};
