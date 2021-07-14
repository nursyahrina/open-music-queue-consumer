const { Pool } = require('pg');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylistById(playlistId, userId) {
    const query = {
      text: `SELECT playlist.* FROM playlists
      LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id
      WHERE (playlists.owner = $2 OR collaborations.playlist_id = $2)
      AND playlists.id = $1
      GROUP BY playlists.id`,
      values: [playlistId, userId],
    };

    const result = await this._pool.query(query);

    if (result.rowCount) {
      const playlist = result.rows;

      const querySongs = {
        text: `SELECT songs.* FROM songs
        INNER JOIN playlistsongs ON playlistsongs.song_id = songs.id
        WHERE playlistsongs.playlist_id = $1`,
        values: [playlistId],
      };

      const resultSongs = await this._pool.query(querySongs);
      const songs = resultSongs.rows;

      return {
        playlist,
        songs,
      };
    }

    return result.rows;
  }
}

module.exports = PlaylistsService;
