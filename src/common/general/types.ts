export type THttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export interface IMakeRequest {
  url: string;
  method?: THttpMethod;
  contentType?: string;
  body?: Record<string, any>;
  query?: Record<string, any>;
  headers?: Record<string, any>;
}
