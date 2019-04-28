import Mercury from '@postlight/mercury-parser';

import { corsSuccessResponse, corsErrorResponse, runWarm } from './utils';

const mercuryParser = async (
  { queryStringParameters, headers },
  context,
  cb
) => {
  if (!queryStringParameters) {
    return cb(
      null,
      corsErrorResponse({
        message: 'Provide an URL in the query string: ?url=',
      })
    );
  }
  const { url } = queryStringParameters;
  if (
    !('x-api-key' in headers) ||
    headers['x-api-key'] !== process.env.SECRET_TOKEN
  ) {
    return cb(null, corsErrorResponse({ message: 'Invalid x-api-key' }));
  }

  const result = await Mercury.parse(url);

  return cb(
    null,
    result
      ? corsSuccessResponse(result)
      : corsErrorResponse({ message: 'There was an error parsing that URL.' })
  );
};

export default runWarm(mercuryParser);
