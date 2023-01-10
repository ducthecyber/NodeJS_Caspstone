import { ApiProperty } from "@nestjs/swagger";

export interface UploadHinhPhong {
    fieldname: string,
    originalname: string,
    encoding: string,
    mimetype: string,
    destination: string,
    filename: string,
    path: string,
    size: string
}

export class FileUploadHinhPhong {
    @ApiProperty({ type: 'string', format: 'binary' })
    roomPhoto: any;
}