import { ApiProperty } from "@nestjs/swagger";

export interface UploadHinhViTri {
    fieldname: string,
    originalname: string,
    encoding: string,
    mimetype: string,
    destination: string,
    filename: string,
    path: string,
    size: string
}

export class FileUploadHinhViTri {
    @ApiProperty({ type: 'string', format: 'binary' })
    locationPhoto: any;
}