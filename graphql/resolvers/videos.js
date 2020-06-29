const Video = require('../../models/video')

module.exports = {
  videos: (args, req) => { 
    if (!req.isAuth) {
      throw new Error('Unauthenticated!')
    }
    return Video.find({creator: req.userId})
    .then(videos => {
      return videos.map(video => {
        return {...video._doc,
          _id: video.id,
          createdAt: video.createdAt
        }
      })
    }).catch(err => console.log(err))
  },
  createVideo: (args, req) => { 
    if (!req.isAuth) {
      throw new Error('Unauthenticated!')
    }
    const video = new Video({
      title: args.videoInput.title,
      category: args.videoInput.category,
      link: args.videoInput.link,
      creator: req.userId
    });
    return video.save()
    .then(result => {
      return {...result._doc,
        _id: result.id,
        creator: result._doc.creator };
    })
    .catch(err => console.log(err));
  },
  deleteVideo: async (args, req) => {
    if (!req.isAuth) {
     throw new Error('Unauthenticated!')
    }
    try {
      const deletedVideo = await Video.findByIdAndDelete(args.videoId).populate('video');
      if (!deletedVideo) {
        throw new Error("video_delete_not_found")
      }
      return deletedVideo._id;
    } catch(err) {
      throw err; 
    }
  }
}