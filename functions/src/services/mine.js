const Mine = require("../model/mine");
const {sheets, spreadsheets} = require("../utils/connect");
const {getFile, getVideos} = require("./file");

/**
 *
 * @param {String} platform - The platform to fetch from
 */
const getMines = async (platform) => {
  const mines = [];
  const rows = await sheets.spreadsheets.values.get({spreadsheetId: spreadsheets[platform].mine, range: "Mine!A2:Z"});

  rows.data.values.map((single)=>{
    if (single[0]) {
      const mine = new Mine({
        id: single[0],
        name: single[1],
        company: single[2],
        mineral: single[3],
        location: single[4],
        note: single[5],
        image: single[6],
      });
      mines.push(mine);
    }
  });

  return mines;
};

const getMiners = async (concession) => {
  const results = await sheets.spreadsheets.values.get({spreadsheetId: spreadsheets.gold.miners, range: "Miners!A:ZZ"});
  const header = results.data.values[0];
  const rows = results.data.values.filter((item, i)=>i>0 && item[header.indexOf("ID")]);
  return {miners: rows.filter((row)=>row[header.indexOf(`Mine/Concession Name`)] === concession), header};
};

{/**
 *
 * @param {String} id - Unique identifier for mine being fetched
 * @param {String} platform - The platform to fetch from
*/}
const getMine = async (id, platform) => {
  const rows = await sheets.spreadsheets.values.get({spreadsheetId: spreadsheets[platform].mine, range: "Mine!A2:ZZ"});

  const found = rows.data.values.filter((single)=>single[0] === id);

  if (found.length === 0) {
    throw new Error("The mine with the unique identifier was not found on our records.");
  }

  const mine = new Mine({
    id: found[0][0],
    name: found[0][1],
    company: found[0][2],
    mineral: found[0][3],
    location: found[0][4],
    note: found[0][5],
    image: found[0][6],
  });

  mine.image = await getFile(mine.image.split("/")[1]);

  return mine;
};

{/**
 *
 * @param {String} id - Unique identifier for mine being fetched
 * @param {String} platform - The platform to fetch from
*/}
const getMineImages = async (id, platform) => {
  const images = [];
  const results = await sheets.spreadsheets.values.get({spreadsheetId: spreadsheets[platform].mine_image, range: "Mine Image!A:ZZ"});
  const header = results.data.values[0];
  const rows = results.data.values.filter((item, i)=>i>0 && item[header.indexOf("Unique ID")] && item[header.indexOf("Image")] && item[header.indexOf("Mine")] === id);
  for await (const row of rows.reverse()) {
    const image = await getFile(row[header.indexOf(`Image`)].split(`/`)[1]);
    images.push(image);
  }

  return images;
};

{/**
 *
 * @param {String} id - Unique identifier for mine being fetched
 * @param {String} platform - The platform to fetch from
*/}
const getMineVideos = async (id, platform) => {
  const videos = [];
  const files = await getVideos();
  const rows = await sheets.spreadsheets.values.get({spreadsheetId: spreadsheets[platform].mine_image, range: "Mine Image!A2:Z"});

  rows.data.values.map((video)=>{
    if (video[0]) {
      if (video[1] === id) {
        const found = files.filter((file)=>file.name.includes(video[3].split(`/`)[1]));
        if (found.length > 0) {
          videos.push(found[0].id);
        }
      }
    }
  });

  return videos;
};

module.exports = {
  getMines,
  getMiners,
  getMineImages,
  getMineVideos,
  getMine,
};
