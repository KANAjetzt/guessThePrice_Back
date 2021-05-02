import mongoose from 'mongoose'

const metaStatsSchema = new mongoose.Schema({
  gamesStarted: Number,
  gamesEnded: Number
})

const MetaStats = mongoose.model('MetaStats', metaStatsSchema)

export default MetaStats
