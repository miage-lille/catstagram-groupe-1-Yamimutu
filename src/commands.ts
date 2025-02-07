import { Cmd } from 'redux-loop';
import { fetchCatsCommit, fetchCatsRollback } from './actions';
import { FetchCatsRequest } from './types/actions.type';
import { Picture } from './types/picture.type';

export const cmdFetch = (action: FetchCatsRequest) =>
  Cmd.run(
    () => {
      return fetch(action.path, {
        method: action.method,
      })
      .then(checkStatus)
      .then((response) => {
        return response.json(); 
      })
      .then((data) => {
        return parseResponse(data);
      })
      .then((pictures) => {
        return pictures;
      });
    },
    {
      successActionCreator: (payload) => fetchCatsCommit(payload), // (equals to (payload) => fetchCatsCommit(payload))
      failActionCreator: (error: Error) => fetchCatsRollback(error), // (equals to (error) => fetchCatsRollback(error))
    },
  );

const checkStatus = (response: Response) => {
  if (response.ok) return response;
  throw new Error(response.statusText);
};

const parseResponse = (data: any): Picture[] => {
  if (!data || !Array.isArray(data.hits)) {
    throw new Error("Format invalide : hits n'est pas présent ou n'est pas un tableau");
  }

  return data.hits.map((hit: any) => ({
    previewFormat: hit.previewURL,
    webFormat: hit.webformatURL,
    author: hit.user,
    largeFormat: hit.largeImageURL,
  }));
};