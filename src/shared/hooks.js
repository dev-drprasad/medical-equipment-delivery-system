import {message} from 'antd';
import {useCallback, useContext, useEffect, useMemo, useState} from 'react';
// import userService from "src/shared/services/user.service";

import NS from 'shared/utils/NS';

import {AuthContext} from './context';

export const cr = '\n';
export const tab = '\t';

function getType(data) {
  if (data === null) return 'Null';
  if (data === undefined) return 'Undefined';
  if (typeof data === 'string') return 'String';
  if (typeof data === 'number' && !Number.isNaN(data)) return 'Number';
  if (Number.isNaN(data)) return 'NaN';
  if (typeof data === 'boolean') return 'Boolean';
  if (data instanceof Array)
    return 'Array';  // always should be before `Object`
  if (data instanceof Object) return 'Object';

  return '';
}

// https://stackoverflow.com/a/2117523
function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11)
      .replace(
          /[018]/g,
          (c) =>
              (c ^
               (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4))))
                  .toString(16));
}

const defaultFetchOptions = {
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};

export function useFetch(url, opts) {
  const [[rId, fresh], setParams] = useState(() => ['', false]);
  const [response, setResponse] = useState([undefined, new NS('INIT')]);

  const refresh = useCallback(() => setParams([uuidv4(), true]), []);

  useEffect(() => {
    setParams([uuidv4(), false]);
  }, [url, opts]);

  useEffect(() => {
    if (!url || !rId) return;

    const abortctrl = new AbortController();
    setResponse([undefined, new NS('LOADING')]);
    const startTime = performance.now();

    // recursive merge might be better solution
    const finalopts = {
      ...defaultFetchOptions,
      ...opts,
      headers: {
        ...defaultFetchOptions.headers,
        ...opts?.headers,
        ...(fresh && {'X-Clear-Cache': true}),
        'X-Request-ID': rId,
      },
    };

    if (finalopts.headers['Content-Type'] === null) {
      delete finalopts.headers['Content-Type'];
    }
    fetch(url, finalopts)
        .then(async (res) => {
          if (abortctrl.signal.aborted) return;

          const responseTime = performance.now() - startTime;
          const cached = !!res.headers.get('X-Browser-Cache');
          const token = res.headers.get('X-Token');
          let body;

          try {
            body = await res.json();
          } catch (e) {
            const message = 'Invalid JSON response from API';
            console.error(`${cr}API Error:${cr}${tab}URL: ${url}${cr}${
                tab}Msg: ${message}${cr}${tab}Code: ${res.status}`);
            setResponse([
              undefined,
              new NS('ERROR', '', res.status, responseTime, rId, cached)
            ]);
            return;
          }

          if (res.status >= 400) {
            const errorType = body.error || '';
            const isInternalError =
                !errorType || errorType === 'Internal Server Error';
            const message = !isInternalError ? body.message || '' : '';
            setResponse([
              undefined,
              new NS(
                  'ERROR', message, res.status, responseTime, rId, cached,
                  false, token)
            ]);
            return;
          }
          console.log('body :>> ', body);
          const dataType = getType(body);
          const hasData = dataType !== 'Null' &&
              (dataType === 'Array' ? body.length > 0 : true);

          setResponse([
            body,
            new NS(
                'SUCCESS', '', res.status, responseTime, rId, cached, hasData,
                token)
          ]);
        })
        .catch((err) => {
          if (abortctrl.signal.aborted) return;
          const responseTime = performance.now() - startTime;
          console.error(`${cr}API Error:${cr}${tab}URL: ${url}${cr}${tab}Msg: ${
              err.message}${cr}${tab}Code: 0`);
          setResponse([undefined, new NS('ERROR', '', 0, responseTime, rId)]);
        });

    return () => abortctrl.abort();
  }, [rId]);

  return [response[0], response[1], refresh];
}

const RBO_API_BASE_URL =
    process.env.RBO_UI_RBO_API_BASE_URL || window.location.origin;
export default function useBROAPI(urlpath, extraOptions) {
  const [user] = useContext(AuthContext);
  const url = urlpath && new URL(urlpath, RBO_API_BASE_URL).toString();

  const options = useMemo(
      () => ({
        ...extraOptions,
        headers: {
          Authorization: `Bearer ${user?.token || ''}`,
          ...extraOptions?.headers,
        },
      }),
      [extraOptions, user]);

  const [data, status, refresh] = useFetch(url, options);

  useEffect(() => {
    if (status.isError && status.statusCode === 500) {
      message.error('Oops! Something went wrong.', 3000)
    }
  }, [status])

  return [data, status, refresh];
}

export const mergeStatuses = (...statuses) => {
  const hasData = statuses.some((s) => s.hasData);
  const statusWithError = statuses.find((s) => s.isError);
  const message = statusWithError ? statusWithError.message : '';
  const statusCode = statusWithError ? statusWithError.statusCode : 0;

  const status = statuses.every((s) => s.isSuccess) ?
      'SUCCESS'  // [SUCCESS, SUCCESS, SUCCESS]
      :
      statusWithError ?
      'ERROR'  // [SUCCESS, ERROR] or [LOADING, ERROR]
      :
      statuses.find((s) => s.isLoading) ?
      'LOADING'  // [SUCCESS, LOADING] or [LOADING, INIT] or [LOADING, LOADING]
      :
      statuses.find((s) => s.isSuccess) ? 'LOADING'  // [SUCCESS, INIT]
                                          :
                                          'INIT';  // [INIT, INIT]

  return new NS(status, message, statusCode, 0, 0, '', false, hasData);
};

export function useInsurerIdAndNames() {
  const queryParams = new URLSearchParams([
    ['fields', ['id', 'name']],
    ['sortBy', 'name'],
  ]);
  const [insurers = [], status] = useBROAPI(`/api/v1/insurers?${queryParams}`);
  return [insurers, status];
}
export function usePatientIdAndNames() {
  const queryParams = new URLSearchParams([
    ['fields', ['id', 'name']],
    ['sortBy', 'name'],
  ]);
  const [patients = [], status] = useBROAPI(`/api/v1/patients?${queryParams}`);
  return [patients, status];
}
export function usePhysicianIdAndNames() {
  const queryParams = new URLSearchParams([
    ['fields', ['id', 'name']],
    ['sortBy', 'name'],
  ]);
  const [physicians = [], status] =
      useBROAPI(`/api/v1/physicians?${queryParams}`);
  return [physicians, status];
}

export function useTeams() {
  const [teams = [], status] = useBROAPI(`/api/v1/teams`);
  return [teams, status];
}

export function useRoles() {
  const [roles = [], status] = useBROAPI('/api/v1/roles');
  return [roles, status];
}

export function useOrderStatuses() {
  const [statuses = [], status] = useBROAPI('/api/v1/orderstatuses');
  return [statuses, status];
}

export function useEquiments() {
  const [equiments = [], status] = useBROAPI('/api/v1/equipments');
  return [equiments, status];
}

export function useSalesUsers() {
  const queryParams = new URLSearchParams([['team', 1]]);
  const [users = [], status] = useBROAPI(`/api/v1/users?${queryParams}`);
  return [users, status];
}
