export interface ControllerRequest<
  T extends {
    params?: Record<string, string> | unknown;
    query?: Record<string, string | string[]> | unknown;
    body?: Record<string, unknown> | unknown;
  } = {
    params: Record<string, string> | unknown;
    query: Record<string, string | string[]> | unknown;
    body: Record<string, unknown> | unknown;
  },
> {
  params: T['params'];
  query: T['query'];
  body: T['body'];
}
