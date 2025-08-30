import mongoose, { Schema, model, models } from "mongoose";

export const Video_Dimensions = {
    height: 1920,
    width: 1080
} as const;

export interface VideoInterface {
    _id?: mongoose.Types.ObjectId;
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl: string;
    controls?: boolean;
    transformation?: {
        height: number;
        width: number;
        quality?: number;
    }
}

const videoSchema = new Schema<VideoInterface>(
    {
        title: { type: String, required: true, unique: true },
        description: { type: String, required: true },
        videoUrl: { type: String, required: true },
        thumbnailUrl: { type: String, required: true },
        controls: { type: Boolean, default: true },
        transformation: {
            height: { type: Number, default: Video_Dimensions.height },
            width: { type: Number, default: Video_Dimensions.width },
            quality: { type: Number, min: 1, max: 100 },
        }
    },

    {
        timestamps: true,
    }
)

const Video = models?.Video || model<VideoInterface>("Video", videoSchema)

export default Video;