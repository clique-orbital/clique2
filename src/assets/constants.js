export const cliqueBlue = "#0f3764";
export const getDay = dateObj => {
  dateObj = new Date(dateObj);
  let day = dateObj.getDay();
  switch (day) {
    case 0:
      day = "Sunday";
      break;
    case 1:
      day = "Monday";
      break;
    case 2:
      day = "Tuesday";
      break;
    case 3:
      day = "Wednesday";
      break;
    case 4:
      day = "Thursday";
      break;
    case 5:
      day = "Friday";
      break;
    case 6:
      day = "Saturday";
      break;
    default:
      day = "No day defined";
      break;
  }
  return day;
};

export const getDate = dateObj => {
  dateObj = new Date(dateObj);
  let month = dateObj.getMonth();
  switch (month) {
    case 0:
      month = "Jan";
      break;
    case 1:
      month = "Feb";
      break;
    case 2:
      month = "Mar";
      break;
    case 3:
      month = "Apr";
      break;
    case 4:
      month = "May";
      break;
    case 5:
      month = "Jun";
      break;
    case 6:
      month = "Jul";
      break;
    case 7:
      month = "Aug";
      break;
    case 8:
      month = "Sep";
      break;
    case 9:
      month = "Oct";
      break;
    case 10:
      month = "Nov";
      break;
    case 11:
      month = "Dec";
      break;
    default:
      month = "No Month Defined";
      break;
  }
  return `${dateObj.getDate()} ${month}`;
};

export const getTime = dateObj => {
  dateObj = new Date(dateObj);
  let hour = dateObj.getHours();
  hour = hour < 10 ? "0" + hour : hour;
  let minute = dateObj.getMinutes();
  minute = minute < 10 ? "0" + minute : minute;
  return `${hour}:${minute}`;
};

export const convertDate = dateObj => {
  dateObj = new Date(dateObj);
  const date = getDate(dateObj);
  const time = getTime(dateObj);
  const day = getDay(dateObj);

  return `${day}, ${date}, ${time}`;
};
