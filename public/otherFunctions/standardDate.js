exports.date = () => {
  let create_time1 = new Date()
    .toLocaleString()
    // .toISOString()
    .replace(/,/, " ");
  //.replace(/\..+/, "");

  let create_time2 = create_time1.split(" ");
  //return create_time2[0].split("-").reverse().join("-") + " " + create_time2[1];
  return create_time1;
};
