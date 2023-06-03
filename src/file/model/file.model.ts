import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type FileDocument = HydratedDocument<File>;
@Schema()
export class File {
  @Prop({ required: true })
  originalname: string;

  @Prop({ required: true })
  encoding: string;

  @Prop({ required: true })
  mimetype: string;

  @Prop({ required: true })
  filename: string;

  @Prop({ required: true })
  size: number;

  @Prop({ default: Date.now })
  createdAt: Date;
  @Prop()
  contentType: string;

  setContentType(this: any) {
    if (this.mimetype) {
      this.contentType = this.mimetype;
    }
  }
}

export const FileSchema = SchemaFactory.createForClass(File);
