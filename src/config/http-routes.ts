// Roots
const charactersRoot = 'characters';
const episodesRoot = 'episodes';

export enum HttpApiVersion {
  V1 = '1',
}

export const HttpApiRoutes = {
  characters: {
    create: `/${charactersRoot}`,
    delete: `/${charactersRoot}/:id`,
    setEpisodes: `/${charactersRoot}/:id/episodes`,
    update: `/${charactersRoot}/:id`,
    findOne: `/${charactersRoot}/:id`,
    findPaginatedList: `/${charactersRoot}`,
  },
  episodes: {
    create: `/${episodesRoot}`,
    delete: `/${episodesRoot}/:id`,
  },
};
