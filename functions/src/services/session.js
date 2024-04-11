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

const updateSession = async ( session, update) => {
  return firebase.firestore().collection(`sessions`).doc(session).update(omit(update, `id`));
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
  updateSession,
  reIssueAccessToken,
};
