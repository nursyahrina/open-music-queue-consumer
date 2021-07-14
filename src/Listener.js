class Listener {
  constructor(playlistsService, mailSender) {
    this._playlistsService = playlistsService;
    this._mailSender = mailSender;

    this.listen = this.listen.bind(this);
  }

  async listen(message) {
    try {
      const { playlistId, userId, targetEmail } = JSON.parse(message.content.toString());

      const playlistsongs = await this._playlistsService.getPlaylistById(playlistId, userId);
      const result = await this._mailSender.sendEmail(targetEmail, JSON.stringify(playlistsongs));
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = Listener;
