export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const month = date.getMonth() + 1; // getMonth() is zero-based
  const day = date.getDate();
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "pm" : "am";

  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'

  // Format minutes to always have at least one digit, no leading zero.
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  // Format month and day without padding zeros
  const formattedMonth = month;
  const formattedDay = day;

  return `${formattedMonth}/${formattedDay}/${year} ${hours}:${formattedMinutes} ${ampm}`;
};
