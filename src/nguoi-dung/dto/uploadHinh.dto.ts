import { ApiProperty } from "@nestjs/swagger";

export interface UploadHinhAvatar {
    fieldname: string,
    originalname: string,
    encoding: string,
    mimetype: string,
    destination: string,
    filename: string,
    path: string,
    size: string
}

export class FileUploadAvatar {
    @ApiProperty({ type: 'string', format: 'binary' })
    userPhoto: any;
}