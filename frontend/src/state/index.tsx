import { createResource } from 'solid-js';
import { urqlClient } from '../urqlWsClient';

export const [todos, { refetch }] = createResource(() =>
    urqlClient.query(`
        query {
          getTodos {
            id
            title
            completed
          }
        }
      `, {})
        .toPromise()
        .then(({ data }) => data.getTodos)
);