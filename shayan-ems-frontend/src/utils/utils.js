import _ from "lodash";
import mobile from "is-mobile";
import converter from "number-to-words";
import moment from "moment";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const convertToArray = (array) => {
  return _.map(array, function (obj) {
    return Object.keys(obj)
      .sort()
      .map(function (key) {
        return obj[key];
      });
  });
};
export const omitFields = (user, fieldsToBeOmit) => {
  return _.omit(user, fieldsToBeOmit);
};

export const mappingTwoObjects = (target, src) => {
  const res = {};
  Object.keys(target).forEach((k) => (res[k] = src[k] ?? target[k]));
  return res;
};

export const matchIdInArray = (array, id) => {
  return array.find((object) => {
    if (object._id === id) {
      return object;
    }
  });
};

export const isMobile = () => {
  return mobile();
};

export const validateEmail = (email) => {
  return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email
  )
    ? true
    : false;
};

export const validateName = (name) => {
  return /^[a-zA-Z\s]+$/.test(name);
};

export const validateNationalId = (national_id_number) => {
  return /^[0-9]{5}-[0-9]{7}-[0-9]$/.test(national_id_number) ? true : false;
};

export const validateNumber = (mobile_number) => {
  return /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/.test(
    mobile_number
  )
    ? true
    : false;
};

export const getMonthName = (index) => {
  return months[index];
};

export const numbersToWords = (number) => {
  return converter.toWords(number);
};

export const daysInMonth = (month, year) => {
  return new Date(year, month, 0).getDate();
};

export const currencyFormat = (num) => {
  if (num === undefined) return false;
  return (
    "Rs " +
    Math.abs(num)
      ?.toFixed(2)
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
  );
};

export const formatDate = (date) => {
  return moment(date).format("ll");
};

export const calculateTime = (time) => {
  return time.reduce(
    (pre, curr) => {
      const splitted = curr.split(":");
      let hours = 0;
      let minutes = 0;
      let seconds = 0;
      if (splitted.length) hours = Number(splitted[0]);
      if (splitted.length >= 2) minutes = Number(splitted[1]);
      if (splitted.length === 3) seconds = Number(splitted[2]);

      if (pre[2] + seconds >= 60) {
        const result = Math.floor((pre[2] + seconds) / 60);
        minutes += result;
        seconds = pre[2] + seconds - result * 60;
        pre[2] = 0;
      }

      if (pre[1] + minutes >= 60) {
        const result = Math.floor((pre[1] + minutes) / 60);
        hours += result;
        minutes = pre[1] + minutes - result * 60;
        pre[1] = 0;
      }
      return [pre[0] + hours, pre[1] + minutes, pre[2] + seconds];
    },
    [0, 0, 0]
  );
};
