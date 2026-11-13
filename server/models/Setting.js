import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema(
  {
    commissionRate: {
      type: Number,
      default: 0,
    },
    instantPayouts: {
      type: Boolean,
      default: true,
    },
    inspectionRequired: {
      type: Boolean,
      default: false,
    },
    bannerAnnouncement: {
      type: String,
      default: '🌾 Direct Farm Trade Protocol: 0% Platform Commission active across all harvests.',
    },
  },
  {
    timestamps: true,
  }
);

const Setting = mongoose.model('Setting', settingSchema);
export default Setting;

