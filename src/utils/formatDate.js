export const formatDate = (dateString) => {
  // Step 1: Extract UTC Date
  const utcDate = new Date(dateString);

  // Step 2: Get Time Zone Offset
  const offsetMinutes = utcDate.getTimezoneOffset();

  // Step 3: Calculate Local Time
  const localTime = new Date(utcDate.getTime() - offsetMinutes * 60 * 1000);

  // Format Local Time
  const year = localTime.getFullYear();
  const month = String(localTime.getMonth() + 1);
  const day = String(localTime.getDate()).padStart(2, "0");
  const hours = String(localTime.getHours() % 12 || 12);
  const minutes = String(localTime.getMinutes()).padStart(2, "0");
  const ampm = localTime.getHours() >= 12 ? "pm" : "am";

  const formattedTimeString = `${month}/${day}/${year} ${hours}:${minutes} ${ampm}`;

  return formattedTimeString;
};
