import { GET } from "../features/authentication/constants/apiConstants";

interface FetchParams {
    url: string,
    httpMethod?: string,
    headers?: Record<string, string>,
    body?: BodyInit | null | undefined,
}

async function fetchClient({
  url,
  httpMethod = GET,
  headers = {},
  body,
}: FetchParams) {
  const updatedHeaders = new Headers();
  updatedHeaders.append("Content-type", "application/json");

  Object.keys(headers).forEach((key) => {
    updatedHeaders.append(key, headers[key]);
  });

  const resp = await fetch(url, {
    method: httpMethod,
    headers: updatedHeaders,
    body,
  });
  return resp;
};

export default fetchClient;