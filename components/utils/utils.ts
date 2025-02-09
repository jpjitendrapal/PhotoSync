function getFormatDate(date: Date): string {
  const d = new Date(date);
  let dateTime = "";
  dateTime = `${d.toDateString()} ${d.getHours()}:${d.getMinutes()}`;
  return dateTime;
}
export { getFormatDate };
