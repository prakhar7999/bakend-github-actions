import { BadRequestException } from '@nestjs/common';

export function fileFilter(
  req,
  file,
  cb: (error: Error | null, acceptFile: boolean) => void,
) {
  if (file.fieldname === 'artwork') {
    cb(null, true);
  } else if (file.fieldname === 'legalRightsDoc') {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else
      cb(
        new BadRequestException(
          `Only Pdf Formatted Document is allowed for [legalRightsDoc]`,
        ),
        false,
      );
  } else {
    cb(new BadRequestException('Invalid field name is used'), false);
  }
}
