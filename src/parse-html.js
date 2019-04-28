import Mercury from '@postlight/mercury-parser';

import { corsSuccessResponse, corsErrorResponse, runWarm } from './utils';

const parseHtml = async ({ body, headers }, context, cb) => {
  const { url, html } = JSON.parse(body);
  if (
    !('x-api-key' in headers) ||
    headers['x-api-key'] !== process.env.SECRET_TOKEN
  ) {
    return cb(null, corsErrorResponse({ message: 'Invalid x-api-key' }));
  }

  const result = await Mercury.parse(url, { html });

  return cb(
    null,
    result
      ? corsSuccessResponse(result)
      : corsErrorResponse({ message: 'There was an error parsing that URL.' })
  );
};

export default runWarm(parseHtml);
