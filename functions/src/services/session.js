const {get, omit} = require("lodash");
const config = require("../config/default");
const {firebase} = require( "../utils/connect");
const {verifyJwt, signJwt} = require( "../utils/jwt");
const {findUser} = require( "./user");

const createSession = async (session) => {
  return await firebase.firestore().collection(`sessions`).add( omit(session, `id`) );
};

const findSessions = async (query) => {
  return await firebase.firestore().collection(`sessions`).where(`user`, `==`, query).where(`valid`, `==`, true).orderBy(`updated`, `desc`).get();
};

const getSessions = async () => {
  const sessions = [];
  const docs = await firebase.firestore().collection(`sessions`).orderBy(`created`, `desc`).get();
  docs.forEach((doc)=>{
    const session = doc.data();
    session.id = doc.id;
    session.created = doc.createTime.toDate();
    session.updated = doc.updateTime.toDate();
    sessions.push(session);
  });
  return sessions;
};

const terminateSession = async (id) => {
  try {
    await firebase.firestore().collection(`sessions`).doc(id).update({
      updated: new Date(),
      valid: false,
    });
    return true;
  } catch (err) {
    return false;
  }
};

const terminateAll = async () => {
  try {
    await firebase.firestore().collection(`sessions`).where("valid", "==", true).update({
      updated: new Date(),
      valid: false,
    });
    return true;
  } catch (err) {
    return false;
  }
};

const reIssueAccessToken = async ({refreshToken}) => {
  const {decoded} = verifyJwt(refreshToken);

  if (!decoded || !get(decoded, `session`)) return false;

  const session = await firebase.firestore().collection(`sessions`).doc(get(decoded, `session`) || ``).get();

  if (!session || !session.exists) return false;

  const user = await findUser( session.data()?.user );

  if (!user) return false;

  const accessToken = signJwt(
      {...user, session: session.id},
      {expiresIn: config.accessTokenTtl},
  );

  return accessToken;
};

module.exports = {
  createSession,
  findSessions,
  getSessions,
  terminateSession,
  terminateAll,
  reIssueAccessToken,
};
