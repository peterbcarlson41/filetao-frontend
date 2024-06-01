export const formatDate = (dateString) => {
  // Step 1: Create Date Object
  const date = new Date(dateString);

  // Format Local Time
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1);
  const day = String(date.getDate());
  const hours = String(date.getHours() % 12 || 12);
  const minutes = String(date.getMinutes());
  const ampm = date.getHours() >= 12 ? "pm" : "am";

  const formattedTimeString = `${month}/${day}/${year} ${hours}:${minutes} ${ampm}`;

  return formattedTimeString;
};
