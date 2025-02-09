import { GET } from "../features/authentication/constants/apiConstants";

interface FetchParams<T> {
    endPoint: string,
    httpMethod?: string,
    body?: BodyInit | null | undefined,
    onSuccess?: (data: T) => void,
    onFailure?: (error: string) => void,
}

async function request<T>({
  endPoint,
  httpMethod = GET,
  body,
  onSuccess,
  onFailure,
}: FetchParams<T>) {
  const headers = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    'Content-Type': "application/json",
  };
  const url = import.meta.env.VITE_API_URL + endPoint;

  try {
    const resp = await fetch(url, {
      method: httpMethod,
      headers,
      body,
    });

    if (resp.ok) {
      if (onSuccess) {
        const data: T = await resp.json();
        onSuccess(data);
      }
    } else {
      const { message }: { message: string} = await resp.json();
      throw new Error(message);
    }
  } catch(error) {
    if (onFailure) {
      if (error instanceof Error) {
        onFailure(error.message);
      } else {
        onFailure("Something went wrong");
      }
    }
  }
};

export default request;